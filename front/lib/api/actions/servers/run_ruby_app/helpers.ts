import { generateCSVFileAndSnippet } from "@app/lib/actions/action_file_helpers";
import { RUBY_CONVERSATION_HISTORY_MAGIC_INPUT_KEY } from "@app/lib/actions/constants";
import type {
  LightServerSideMCPToolConfigurationType,
  ServerSideMCPServerConfigurationType,
} from "@app/lib/actions/mcp";
import type {
  ToolGeneratedFilePathType,
  ToolGeneratedFileType,
} from "@app/lib/actions/mcp_internal_actions/output_schemas";
import type {
  AgentLoopRunContext,
  ToolRunContext,
} from "@app/lib/actions/types";
import { renderConversationForModel } from "@app/lib/api/assistant/conversation_rendering";
import { getDatasetSchema } from "@app/lib/api/datasets";
import { writeToToolOutputsFolder } from "@app/lib/api/files/action_output_fs";
import { makeFileName } from "@app/lib/api/files/action_output_fs/naming";
import type { Authenticator } from "@app/lib/auth";
import { extractConfig } from "@app/lib/config";
import { AppResource } from "@app/lib/resources/app_resource";
import logger from "@app/logger/logger";
import type { BlockRunConfig, SpecificationBlockType } from "@app/types/app";
import type { ConversationWithoutContentType } from "@app/types/assistant/conversation";
import type { DatasetSchema } from "@app/types/dataset";
import type { SupportedFileContentType } from "@app/types/files";
import { extensionsForContentType } from "@app/types/files";
import type { Result } from "@app/types/shared/result";
import { Ok } from "@app/types/shared/result";
import { safeParseJSON } from "@app/types/shared/utils/json_utils";
import { INTERNAL_MIME_TYPES } from "@ruby-ai/client";
import type { ZodRawShape } from "zod";
import { z } from "zod";

const MIN_GENERATION_TOKENS = 2048;

interface RubyFileOutput {
  __ruby_file?: {
    type: string;
    content: unknown;
  };
  [key: string]: unknown;
}

function getRubyAppRunResultsFileTitle({
  appName,
  resultsFileContentType,
}: {
  appName: string;
  resultsFileContentType: SupportedFileContentType;
}): string {
  const extensions = extensionsForContentType(resultsFileContentType);
  let title = `${appName}_output`;
  if (extensions.length > 0) {
    title += extensions[0];
  }
  return title;
}

export function convertDatasetSchemaToZodRawShape(
  datasetSchema: DatasetSchema | null
): ZodRawShape {
  const shape: ZodRawShape = {};
  if (datasetSchema) {
    for (const entry of datasetSchema) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const desc = entry.description || "";
      switch (entry.type) {
        case "string":
          shape[entry.key] = z.string().describe(desc);
          break;
        case "number":
          shape[entry.key] = z.number().describe(desc);
          break;
        case "boolean":
          shape[entry.key] = z.boolean().describe(desc);
          break;
        case "json":
          shape[entry.key] = z.any().describe(desc);
          break;
        default:
          throw new Error(`Unsupported dataset type: ${entry.type}`);
      }
    }
  }
  return shape;
}

export async function prepareAppContext(
  auth: Authenticator,
  actionConfig:
    | ServerSideMCPServerConfigurationType
    | LightServerSideMCPToolConfigurationType
): Promise<{
  app: AppResource;
  schema: DatasetSchema | null;
  appConfig: BlockRunConfig;
}> {
  if (!actionConfig.rubyAppConfiguration?.appId) {
    logger.error(
      {
        workspaceId: auth.getNonNullableWorkspace().sId,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        userId: auth.user()?.sId || "no_user",
        role: auth.role(),
        actionConfig,
        rubyAppConfiguration: actionConfig.rubyAppConfiguration,
        appId: actionConfig.rubyAppConfiguration?.appId,
      },
      "[run_ruby_app] Missing Ruby app ID"
    );
    throw new Error("Missing Ruby app ID");
  }

  const app = await AppResource.fetchById(
    auth,
    actionConfig.rubyAppConfiguration.appId
  );
  if (!app) {
    logger.error(
      {
        workspaceId: auth.getNonNullableWorkspace().sId,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        userId: auth.user()?.sId || "no_user",
        role: auth.role(),
        appId: actionConfig.rubyAppConfiguration.appId,
        actionConfig,
      },
      "[run_ruby_app] Could not find Ruby app"
    );
    throw new Error("Could not find Ruby app");
  }

  const parsedSpec = app.parseSavedSpecification();
  const appConfig = extractConfig(parsedSpec);

  const inputSpec = parsedSpec.find(
    (b: SpecificationBlockType) => b.type === "input"
  );
  const inputConfig = inputSpec ? appConfig[inputSpec.name] : null;
  const datasetName = inputConfig?.dataset;

  if (!datasetName) {
    return { app, schema: null, appConfig };
  }

  const schema = await getDatasetSchema(auth, app, datasetName);
  if (!schema) {
    throw new Error("Missing dataset schema name");
  }

  return { app, schema, appConfig };
}

export async function processRubyFileOutput(
  auth: Authenticator,
  runContext: ToolRunContext,
  sanitizedOutput: RubyFileOutput,
  conversation: ConversationWithoutContentType,
  appName: string
): Promise<
  Result<
    {
      type: "resource";
      resource: ToolGeneratedFileType | ToolGeneratedFilePathType;
    }[],
    Error
  >
> {
  const content: {
    type: "resource";
    resource: ToolGeneratedFileType | ToolGeneratedFilePathType;
  }[] = [];

  const containsValidStructuredOutput = (
    output: RubyFileOutput
  ): output is {
    __ruby_file?: {
      type: "structured";
      content: Array<
        Record<string, string | number | null | boolean | undefined>
      >;
    };
  } =>
    output.__ruby_file?.type === "structured" &&
    Array.isArray(output.__ruby_file.content) &&
    output.__ruby_file.content.length > 0 &&
    output.__ruby_file.content.every(
      (r) =>
        typeof r === "object" &&
        Object.values(r).every(
          (v) =>
            !v ||
            typeof v === "string" ||
            typeof v === "number" ||
            typeof v === "boolean"
        )
    );

  const containsValidDocumentOutput = (
    output: RubyFileOutput
  ): output is {
    __ruby_file?: { type: "document"; content: string };
  } =>
    output.__ruby_file?.type === "document" &&
    typeof output.__ruby_file.content === "string";

  if (containsValidStructuredOutput(sanitizedOutput)) {
    const fileTitle = getRubyAppRunResultsFileTitle({
      appName,
      resultsFileContentType: "text/csv",
    });

    const { csvFile } = await generateCSVFileAndSnippet(auth, {
      title: fileTitle,
      conversationId: conversation.sId,
      results: sanitizedOutput.__ruby_file?.content ?? [],
    });

    content.push({
      type: "resource",
      resource: {
        mimeType: INTERNAL_MIME_TYPES.TOOL_OUTPUT.FILE,
        uri: `file://${csvFile.id}`,
        fileId: csvFile.sId,
        title: fileTitle,
        contentType: csvFile.contentType,
        snippet: csvFile.snippet,
        text: `Generated CSV file: ${fileTitle}`,
      },
    });

    delete sanitizedOutput.__ruby_file;
  } else if (containsValidDocumentOutput(sanitizedOutput)) {
    const rawContent = sanitizedOutput.__ruby_file?.content ?? "";
    const jsonOutputRes = safeParseJSON(rawContent);

    let fileName: string;
    let fileContent: string;
    let contentType: "application/json" | "text/plain";

    if (jsonOutputRes.isOk()) {
      fileContent = JSON.stringify(jsonOutputRes.value, null, 2);
      contentType = "application/json";
      fileName = makeFileName({ name: appName, ext: ".json" });
    } else {
      fileContent = rawContent;
      contentType = "text/plain";
      fileName = makeFileName({ name: appName, ext: ".txt" });
    }

    const result = await writeToToolOutputsFolder(auth, runContext, {
      fileName,
      content: fileContent,
      contentType,
    });
    if (result.isErr()) {
      return result;
    }

    content.push({
      type: "resource",
      resource: {
        mimeType: INTERNAL_MIME_TYPES.TOOL_OUTPUT.FILE_PATH,
        uri: result.value,
        path: result.value,
        title: fileName,
        contentType,
        text: `Generated file: ${fileName}`,
      },
    });

    delete sanitizedOutput.__ruby_file;
  }

  return new Ok(content);
}

export async function prepareParamsWithHistory(
  params: { [p: string]: unknown },
  schema: DatasetSchema | null,
  agentLoopRunContext: AgentLoopRunContext,
  auth: Authenticator
): Promise<{ [p: string]: unknown }> {
  if (
    schema?.some((s) => s.key === RUBY_CONVERSATION_HISTORY_MAGIC_INPUT_KEY)
  ) {
    const modelInfo = agentLoopRunContext.modelInfo;

    if (modelInfo) {
      const allowedTokenCount =
        modelInfo.endpoint.modelConfig.contextSize - MIN_GENERATION_TOKENS;

      const convoRes = await renderConversationForModel(auth, {
        conversation: agentLoopRunContext.conversation,
        enabledSkills: [],
        model: modelInfo.endpoint.modelConfig,
        prompt: "",
        tools: "",
        allowedTokenCount,
        excludeImages: true,
        onMissingAction: "skip",
      });

      if (convoRes.isOk()) {
        const messages = convoRes.value.modelConversation.messages;
        params[RUBY_CONVERSATION_HISTORY_MAGIC_INPUT_KEY] =
          JSON.stringify(messages);
      }
    }
  }
  return params;
}

export function containsFileOutput(output: unknown): output is RubyFileOutput {
  return (
    typeof output === "object" &&
    output !== null &&
    "__ruby_file" in output &&
    typeof output.__ruby_file === "object" &&
    output.__ruby_file !== null &&
    "type" in output.__ruby_file &&
    "content" in output.__ruby_file
  );
}
