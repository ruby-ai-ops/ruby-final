import config from "@app/lib/api/config";
import type { AdminGetConversationConfig } from "@app/lib/api/admin/conversations";
import { ConversationResource } from "@app/lib/resources/conversation_resource";
import { ConversationSandboxAdapter } from "@app/lib/resources/conversation_sandbox_adapter";
import { DataSourceResource } from "@app/lib/resources/data_source_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  cId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/conversations/:cId/config.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetConversationConfig> => {
    const auth = ctx.get("auth");
    const { cId } = ctx.req.valid("param");

    const conversation = await ConversationResource.fetchById(auth, cId, {
      includeDeleted: true,
    });
    if (!conversation) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "conversation_not_found",
          message: "Conversation not found.",
        },
      });
    }

    const conversationDataSource = await DataSourceResource.fetchByConversation(
      auth,
      conversation
    );

    const sandbox = await ConversationSandboxAdapter.fetchSandbox(
      auth,
      conversation
    );

    return ctx.json({
      conversationDataSourceId: conversationDataSource?.sId ?? null,
      langfuseUiBaseUrl: config.getLangfuseUiBaseUrl() ?? null,
      sandbox: sandbox ? sandbox.toAdminJSON() : null,
      temporalWorkspace: config.getTemporalAgentNamespace() ?? "",
    });
  }
);

export default app;
