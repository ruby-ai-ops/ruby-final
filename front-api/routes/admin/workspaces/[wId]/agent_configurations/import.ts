import { createOrUpgradeAgentConfiguration } from "@app/lib/api/assistant/configuration/create_or_upgrade";
import { PostOrPatchAgentConfigurationRequestBodySchema } from "@app/types/api/agent_configuration";
import type { AgentConfigurationType } from "@app/types/assistant/agent";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";

export type AdminImportAgentConfigurationResponseBody = {
  assistant: AgentConfigurationType;
};

// Mounted at /api/admin/workspaces/:wId/agent_configurations/import.
const app = adminApp();

/** @ignoreswagger */
app.post(
  "/",
  validate("json", PostOrPatchAgentConfigurationRequestBodySchema),
  async (ctx): HandlerResult<AdminImportAgentConfigurationResponseBody> => {
    const auth = ctx.get("auth");
    const body = ctx.req.valid("json");

    const result = await createOrUpgradeAgentConfiguration({
      auth,
      assistant: body.assistant,
    });

    if (result.isErr()) {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: result.error.message,
        },
      });
    }

    return ctx.json({ assistant: result.value.agentConfiguration });
  }
);

export default app;
