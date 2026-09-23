import config from "@app/lib/api/config";
import { RubyFileSystem } from "@app/lib/api/file_system/ruby_file_system";
import {
  convertCanonicalFileToPdf,
  deleteCanonicalFile,
  fetchLinkedFileResource,
  moveCanonicalFile,
  readCanonicalFileContent,
  renameCanonicalFile,
  streamThumbnail,
  WRITE_CANONICAL_FILE_CONTENT_MAX_BYTES,
  WriteCanonicalFileContentError,
  writeCanonicalFileContent,
} from "@app/lib/api/files/file_system_ops";
import {
  type FolderArchivePlanError,
  isFolderArchiveError,
  planFolderArchive,
  streamFolderArchive,
} from "@app/lib/api/files/folder_archive";
import {
  extractArchiveToFolder,
  type FolderExtractError,
  isFolderExtractError,
  MAX_ARCHIVE_UPLOAD_SIZE_BYTES,
} from "@app/lib/api/files/folder_extract";
import { requestRubyProjectIncrementalSyncForScopedPath } from "@app/lib/api/projects/request_incremental_sync";
import type { PostExtractArchiveResponseBody } from "@app/types/api/file_system/types";
import type { APIErrorWithContentfulStatusCode } from "@app/types/error";
import type { RubyFileSystemError } from "@app/types/file_system";
import {
  RUBY_FILE_CAN_WRITE_HEADER,
  RUBY_FILE_CONTENT_TYPE_HEADER,
  RUBY_FILE_ID_HEADER,
  RUBY_FILE_REVISION_HEADER,
  FileRevisionSchema,
  getFileFormat,
  normalizeMimeType,
} from "@app/types/files";
import { assertNever } from "@app/types/shared/utils/assert_never";
import { readableToReadableStream } from "@app/types/shared/utils/streams";
import type { WorkspaceAwareCtx } from "@front-api/middlewares/ctx";
import { workspaceApp } from "@front-api/middlewares/ctx";
import { apiError } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import type { Context } from "hono";
import { bodyLimit as honoBodyLimit } from "hono/body-limit";
import path from "path";
import { z } from "zod";
import { fromError } from "zod-validation-error";

const RevisionHeaderSchema = z.object({
  "x-ruby-if-revision-match": FileRevisionSchema.optional(),
});

const ParamsSchema = z.object({
  canonicalPath: z.string(),
});

/**
 * Unified file system API by canonical scoped path.
 *
 *   GET    /api/w/:wId/files/path/conversation-{cId}/report.pdf         stream inline
 *   GET    /api/w/:wId/files/path/pod-{pId}/data.csv?download=1         stream + Content-Disposition
 *   GET    /api/w/:wId/files/path/conversation-{cId}/photo.png?thumbnail=1  stream thumbnail
 *   HEAD   /api/w/:wId/files/path/{...canonicalPath}                    metadata only
 *   PATCH  /api/w/:wId/files/path/{...canonicalPath}  { action:"rename", fileName }
 *   PATCH  /api/w/:wId/files/path/{...canonicalPath}  { action:"move",   dest }
 *   POST   /api/w/:wId/files/path/{...canonicalPath}?action=extract    expand a ZIP into the folder
 *   PUT    /api/w/:wId/files/path/{...canonicalPath}                    replace text or JSON content, optional X-Ruby-If-Revision-Match
 *   DELETE /api/w/:wId/files/path/{...canonicalPath}
 *
 * Raw GCS reads return X-Ruby-File-Revision for exactly the streamed bytes. PUT accepts
 * that revision in X-Ruby-If-Revision-Match and returns 412 on a revision mismatch.
 * Successful GCS writes return their new X-Ruby-File-Revision. Revisions are unquoted
 * positive generation strings, independent of HTTP ETags. Backends without revision
 * support reject conditional writes.
 * GET and HEAD expose current mount write permission in X-Ruby-File-Can-Write.
 */
const app = workspaceApp();

const PatchBodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("rename"),
    fileName: z
      .string()
      .min(1)
      .refine((v) => !v.includes("/") && !v.includes("\\"), {
        message: "fileName must not contain path separators.",
      }),
  }),
  z.object({
    action: z.literal("move"),
    dest: z.string().min(1),
  }),
]);

function isBodyLimitError(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.name === "BodyLimitError" || err.message === "Payload Too Large")
  );
}

function putContentTooLargeError(ctx: Context) {
  return apiError(ctx, {
    status_code: 413,
    api_error: {
      type: "invalid_request_error",
      message: `Content exceeds the ${WRITE_CANONICAL_FILE_CONTENT_MAX_BYTES / 1024} KB limit.`,
    },
  });
}

function isContentTypeSafeToDisplay(contentType: string): boolean {
  // Mirrors the isSafeToDisplay policy from getSecureFileAction (FileResource-backed serving),
  // applied to the raw stored content type since canonical-path files may lack a FileResource.
  return (
    getFileFormat(normalizeMimeType(contentType))?.isSafeToDisplay ?? false
  );
}

function contentDispositionAttachment(fileName: string): string {
  const asciiFallback = fileName.replace(/[^\x20-\x7E\/\\]/g, "_");
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

const putBodyLimit = honoBodyLimit({
  maxSize: WRITE_CANONICAL_FILE_CONTENT_MAX_BYTES,
  onError: putContentTooLargeError,
});

/** Resolve and validate the canonical path from the URL, returning an error response if invalid. */
async function resolveFs(
  ctx: Context<WorkspaceAwareCtx>,
  canonicalPath: string,
  { allowMountRoot = false }: { allowMountRoot?: boolean } = {}
) {
  if (!canonicalPath || (!allowMountRoot && !canonicalPath.includes("/"))) {
    return {
      fs: null,
      err: apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message:
            "Invalid canonical path: expected at least two path segments " +
            "(e.g. /files/path/conversation-{id}/file.txt).",
        },
      }),
    };
  }

  const auth = ctx.get("auth");
  const fsResult = await RubyFileSystem.fromScopedPath(auth, canonicalPath);
  if (fsResult.isErr()) {
    return { fs: null, err: apiError(ctx, mapRubyFsError(fsResult.error)) };
  }

  return { fs: fsResult.value, err: null };
}

function mapFolderArchiveError(
  error: FolderArchivePlanError
): APIErrorWithContentfulStatusCode {
  if (!isFolderArchiveError(error)) {
    return mapRubyFsError(error);
  }

  const { code } = error;
  switch (code) {
    case "not_found":
      return {
        status_code: 404,
        api_error: { type: "file_not_found", message: error.message },
      };

    case "not_directory":
      return {
        status_code: 400,
        api_error: { type: "invalid_request_error", message: error.message },
      };

    case "too_many_entries":
    case "too_large":
      return {
        status_code: 413,
        api_error: { type: "invalid_request_error", message: error.message },
      };

    case "internal":
      return {
        status_code: 500,
        api_error: { type: "internal_server_error", message: error.message },
      };

    default:
      return assertNever(code);
  }
}

async function handleFolderArchiveRequest(
  ctx: Context<WorkspaceAwareCtx>,
  canonicalPath: string,
  { headOnly }: { headOnly: boolean }
) {
  const { fs: rubyFs, err } = await resolveFs(ctx, canonicalPath, {
    allowMountRoot: true,
  });
  if (err) {
    return err;
  }

  const planResult = await planFolderArchive(rubyFs, canonicalPath);
  if (planResult.isErr()) {
    return apiError(ctx, mapFolderArchiveError(planResult.error));
  }

  const headers = {
    "Content-Type": "application/zip",
    "Content-Disposition": contentDispositionAttachment(
      planResult.value.archiveFileName
    ),
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  };

  if (headOnly) {
    return new Response(null, { status: 200, headers });
  }

  return new Response(streamFolderArchive(rubyFs, planResult.value), {
    status: 200,
    headers,
  });
}

async function handleHeadRequest(
  ctx: Context<WorkspaceAwareCtx>,
  canonicalPath: string
) {
  const auth = ctx.get("auth");
  const { fs: rubyFs, err } = await resolveFs(ctx, canonicalPath);
  if (err) {
    return err;
  }

  const statResult = await rubyFs.stat(canonicalPath);
  if (statResult.isErr()) {
    return apiError(ctx, mapRubyFsError(statResult.error));
  }
  if (!statResult.value) {
    return apiError(ctx, {
      status_code: 404,
      api_error: { type: "file_not_found", message: "File not found." },
    });
  }

  const linkedFileResource = await fetchLinkedFileResource(
    auth,
    rubyFs,
    canonicalPath
  );
  const headers: Record<string, string> = {
    "Content-Type": statResult.value.contentType,
    "Content-Length": String(statResult.value.sizeBytes),
    [RUBY_FILE_CAN_WRITE_HEADER]: String(
      rubyFs.checkWriteAccess(canonicalPath).isOk()
    ),
    "X-Content-Type-Options": "nosniff",
  };
  if (linkedFileResource) {
    headers[RUBY_FILE_ID_HEADER] = linkedFileResource.sId;
    headers[RUBY_FILE_CONTENT_TYPE_HEADER] = linkedFileResource.contentType;
  }

  return new Response(null, {
    status: 200,
    headers,
  });
}

/** @ignoreswagger */
app.get("/:canonicalPath{.+}", validate("param", ParamsSchema), async (ctx) => {
  const { canonicalPath } = ctx.req.valid("param");
  const archive = ctx.req.query("archive");

  // Hono dispatches HEAD requests through the matching GET route.
  if (archive === "zip") {
    return handleFolderArchiveRequest(ctx, canonicalPath, {
      headOnly: ctx.req.method === "HEAD",
    });
  }

  if (ctx.req.method === "HEAD") {
    return handleHeadRequest(ctx, canonicalPath);
  }

  const auth = ctx.get("auth");
  const { fs: rubyFs, err } = await resolveFs(ctx, canonicalPath);
  if (err) {
    return err;
  }

  const thumbnail = ctx.req.query("thumbnail");
  const download = ctx.req.query("download");
  const previewPdf = ctx.req.query("preview") === "pdf";

  // ?preview=pdf converts Office files to PDF via Gotenberg's LibreOffice route.
  if (previewPdf) {
    const rendererUrl = config.getDocumentRendererUrl();
    if (!rendererUrl) {
      return apiError(ctx, {
        status_code: 503,
        api_error: {
          type: "internal_server_error",
          message: "PDF preview is not configured.",
        },
      });
    }

    const conversionResult = await convertCanonicalFileToPdf(
      rubyFs,
      canonicalPath,
      rendererUrl
    );
    if (conversionResult.isErr()) {
      const e = conversionResult.error;

      switch (e.code) {
        case "not_found":
          return apiError(ctx, {
            status_code: 404,
            api_error: { type: "file_not_found", message: e.message },
          });

        case "too_large":
          return apiError(ctx, {
            status_code: 413,
            api_error: { type: "invalid_request_error", message: e.message },
          });

        case "unsupported_type":
          return apiError(ctx, {
            status_code: 400,
            api_error: { type: "invalid_request_error", message: e.message },
          });

        case "conversion_failed":
        case "internal":
          return apiError(ctx, {
            status_code: 500,
            api_error: { type: "internal_server_error", message: e.message },
          });

        default:
          assertNever(e.code);
      }
    }

    const { pdfBuffer, pdfFileName } = conversionResult.value;
    // RFC 5987: filename= must be ASCII-safe; filename*= carries the UTF-8 encoded name.
    const asciiFallback = pdfFileName.replace(/[^\x20-\x7E]/g, "_");
    const encodedName = encodeURIComponent(pdfFileName);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${asciiFallback}"; filename*=UTF-8''${encodedName}`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  // ?thumbnail=1 serves the resized/processed version (images only).
  if (thumbnail && thumbnail !== "0") {
    const thumbResult = await streamThumbnail(auth, rubyFs, canonicalPath);
    if (thumbResult.isErr()) {
      const e = thumbResult.error;
      switch (e.code) {
        case "not_found":
          return apiError(ctx, {
            status_code: 404,
            api_error: { type: "file_not_found", message: e.message },
          });
        case "not_image":
          return apiError(ctx, {
            status_code: 400,
            api_error: { type: "invalid_request_error", message: e.message },
          });
        case "internal":
          return apiError(ctx, {
            status_code: 500,
            api_error: { type: "internal_server_error", message: e.message },
          });
        default:
          assertNever(e.code);
      }
    }

    const { stream, contentType } = thumbResult.value;
    return new Response(readableToReadableStream(stream), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  // Normal inline or attachment stream.
  const readResult = await readCanonicalFileContent(rubyFs, canonicalPath);
  if (readResult.isErr()) {
    return apiError(ctx, mapRubyFsError(readResult.error));
  }
  if (!readResult.value) {
    return apiError(ctx, {
      status_code: 404,
      api_error: { type: "file_not_found", message: "File not found." },
    });
  }
  const { contentType, stream, revision } = readResult.value;

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
    [RUBY_FILE_CAN_WRITE_HEADER]: String(
      rubyFs.checkWriteAccess(canonicalPath).isOk()
    ),
  };
  if (revision !== undefined) {
    headers[RUBY_FILE_REVISION_HEADER] = revision;
    headers["Cache-Control"] = "private, no-cache";
  }

  // Unsafe content types and ?download=1 must always be served as attachments.
  if (
    !isContentTypeSafeToDisplay(contentType) ||
    (download && download !== "0")
  ) {
    const fileName = path.posix.basename(canonicalPath);
    headers["Content-Disposition"] = contentDispositionAttachment(fileName);
  }

  return new Response(readableToReadableStream(stream), {
    status: 200,
    headers,
  });
});

app.patch(
  "/:canonicalPath{.+}",
  validate("param", ParamsSchema),
  async (ctx) => {
    const auth = ctx.get("auth");
    const { canonicalPath } = ctx.req.valid("param");
    const { fs: rubyFs, err } = await resolveFs(ctx, canonicalPath);
    if (err) {
      return err;
    }

    let body: unknown;
    try {
      body = await ctx.req.json();
    } catch {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: "Invalid JSON body.",
        },
      });
    }

    const parsed = PatchBodySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: fromError(parsed.error).toString(),
        },
      });
    }

    const data = parsed.data;

    switch (data.action) {
      case "rename": {
        const renameResult = await renameCanonicalFile(
          auth,
          rubyFs,
          canonicalPath,
          data.fileName
        );
        if (renameResult.isErr()) {
          return apiError(ctx, mapRubyFsError(renameResult.error));
        }
        break;
      }

      case "move": {
        if (data.dest === canonicalPath) {
          return new Response(null, { status: 200 });
        }
        const moveResult = await moveCanonicalFile(
          auth,
          rubyFs,
          canonicalPath,
          data.dest
        );
        if (moveResult.isErr()) {
          return apiError(ctx, mapRubyFsError(moveResult.error));
        }
        break;
      }

      default:
        assertNever(data);
    }

    return new Response(null, { status: 200 });
  }
);

function archiveTooLargeError(ctx: Context) {
  return apiError(ctx, {
    status_code: 413,
    api_error: {
      type: "invalid_request_error",
      message: `Archive exceeds the ${MAX_ARCHIVE_UPLOAD_SIZE_BYTES / (1024 * 1024)} MB upload limit.`,
    },
  });
}

const extractBodyLimit = honoBodyLimit({
  maxSize: MAX_ARCHIVE_UPLOAD_SIZE_BYTES,
  onError: archiveTooLargeError,
});

function mapFolderExtractError(
  error: FolderExtractError
): APIErrorWithContentfulStatusCode {
  const { code } = error;
  switch (code) {
    case "invalid_archive":
    case "unsafe_entry_path":
      return {
        status_code: 400,
        api_error: { type: "invalid_request_error", message: error.message },
      };

    case "too_many_entries":
    case "too_large":
      return {
        status_code: 413,
        api_error: { type: "invalid_request_error", message: error.message },
      };

    default:
      return assertNever(code);
  }
}

/** @ignoreswagger */
app.post(
  "/:canonicalPath{.+}",
  extractBodyLimit,
  validate("param", ParamsSchema),
  async (ctx) => {
    const auth = ctx.get("auth");
    const { canonicalPath } = ctx.req.valid("param");

    if (ctx.req.query("action") !== "extract") {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: "Unsupported action: expected `?action=extract`.",
        },
      });
    }

    // The destination is a folder, so a bare mount root is a valid target.
    const { fs: rubyFs, err } = await resolveFs(ctx, canonicalPath, {
      allowMountRoot: true,
    });
    if (err) {
      return err;
    }

    let archiveBuffer: ArrayBuffer;
    try {
      archiveBuffer = await ctx.req.arrayBuffer();
    } catch (err) {
      if (isBodyLimitError(err)) {
        return archiveTooLargeError(ctx);
      }
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: "Failed to read request body.",
        },
      });
    }

    const extractResult = await extractArchiveToFolder(
      rubyFs,
      canonicalPath,
      Buffer.from(archiveBuffer)
    );
    if (extractResult.isErr()) {
      const error = extractResult.error;
      return apiError(
        ctx,
        isFolderExtractError(error)
          ? mapFolderExtractError(error)
          : mapRubyFsError(error)
      );
    }

    requestRubyProjectIncrementalSyncForScopedPath(auth, canonicalPath);

    const body: PostExtractArchiveResponseBody = extractResult.value;

    return ctx.json(body);
  }
);

/** @ignoreswagger */
app.put(
  "/:canonicalPath{.+}",
  putBodyLimit,
  validate("param", ParamsSchema),
  validate("header", RevisionHeaderSchema),
  async (ctx) => {
    const auth = ctx.get("auth");
    const { canonicalPath } = ctx.req.valid("param");
    const { fs: rubyFs, err } = await resolveFs(ctx, canonicalPath);
    if (err) {
      return err;
    }

    const contentLengthHeader = ctx.req.header("content-length");
    if (contentLengthHeader) {
      const contentLength = Number.parseInt(contentLengthHeader, 10);
      if (
        Number.isFinite(contentLength) &&
        contentLength > WRITE_CANONICAL_FILE_CONTENT_MAX_BYTES
      ) {
        return putContentTooLargeError(ctx);
      }
    }

    let contentBuffer: ArrayBuffer;
    try {
      contentBuffer = await ctx.req.arrayBuffer();
    } catch (err) {
      if (isBodyLimitError(err)) {
        return putContentTooLargeError(ctx);
      }
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: "Failed to read request body.",
        },
      });
    }

    if (contentBuffer.byteLength > WRITE_CANONICAL_FILE_CONTENT_MAX_BYTES) {
      return putContentTooLargeError(ctx);
    }

    const writeResult = await writeCanonicalFileContent(
      auth,
      rubyFs,
      canonicalPath,
      new Uint8Array(contentBuffer),
      ctx.req.header("content-type") ?? undefined,
      ctx.req.valid("header")["x-ruby-if-revision-match"]
    );

    if (writeResult.isErr()) {
      const error = writeResult.error;
      if (error instanceof WriteCanonicalFileContentError) {
        const { code } = error;
        switch (code) {
          case "too_large":
            return apiError(ctx, {
              status_code: 413,
              api_error: {
                type: "invalid_request_error",
                message: error.message,
              },
            });
          case "revision_conflict":
            return apiError(ctx, {
              status_code: 412,
              api_error: {
                type: "invalid_request_error",
                message: error.message,
              },
            });
          case "revision_not_supported":
          case "unsupported_content_type":
            return apiError(ctx, {
              status_code: 400,
              api_error: {
                type: "invalid_request_error",
                message: error.message,
              },
            });
          default:
            return assertNever(code);
        }
      }
      return apiError(ctx, mapRubyFsError(error));
    }

    return new Response(null, {
      status: writeResult.value.created ? 201 : 200,
      headers:
        writeResult.value.revision !== undefined
          ? { [RUBY_FILE_REVISION_HEADER]: writeResult.value.revision }
          : undefined,
    });
  }
);

app.delete(
  "/:canonicalPath{.+}",
  validate("param", ParamsSchema),
  async (ctx) => {
    const auth = ctx.get("auth");
    const { canonicalPath } = ctx.req.valid("param");
    const { fs: rubyFs, err } = await resolveFs(ctx, canonicalPath);
    if (err) {
      return err;
    }

    const deleteResult = await deleteCanonicalFile(auth, rubyFs, canonicalPath);
    if (deleteResult.isErr()) {
      return apiError(ctx, mapRubyFsError(deleteResult.error));
    }

    requestRubyProjectIncrementalSyncForScopedPath(auth, canonicalPath);

    return new Response(null, { status: 204 });
  }
);

function mapRubyFsError(
  err: RubyFileSystemError
): APIErrorWithContentfulStatusCode {
  switch (err.code) {
    case "not_found":
      return {
        status_code: 404,
        api_error: { type: "file_not_found", message: err.message },
      };

    case "unauthorized":
      return {
        status_code: 403,
        api_error: { type: "workspace_auth_error", message: err.message },
      };

    case "invalid_path":
    case "legacy_path":
      return {
        status_code: 400,
        api_error: { type: "invalid_request_error", message: err.message },
      };

    case "already_exists":
      return {
        status_code: 409,
        api_error: { type: "invalid_request_error", message: err.message },
      };

    case "too_many_mounts":
    case "internal":
      return {
        status_code: 500,
        api_error: { type: "internal_server_error", message: err.message },
      };

    default:
      return assertNever(err.code);
  }
}

export default app;
