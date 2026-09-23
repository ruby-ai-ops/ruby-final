import { readInteractiveContentFile } from "@app/lib/api/files/read";
import type { GetAdminFileResponseBody } from "@app/types/api/admin/files";
import { assertNever } from "@app/types/shared/utils/assert_never";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  sId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/files/:sId.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<GetAdminFileResponseBody> => {
    const auth = ctx.get("auth");
    const { sId } = ctx.req.valid("param");

    const result = await readInteractiveContentFile(auth, sId);
    if (result.isErr()) {
      const err = result.error;
      switch (err) {
        case "file_not_found":
          return apiError(ctx, {
            status_code: 404,
            api_error: {
              type: "file_not_found",
              message: "File not found.",
            },
          });

        case "not_interactive_content":
          return apiError(ctx, {
            status_code: 400,
            api_error: {
              type: "invalid_request_error",
              message: "Only interactive content files can be viewed.",
            },
          });

        default:
          return assertNever(err);
      }
    }

    return ctx.json(result.value);
  }
);

export default app;
