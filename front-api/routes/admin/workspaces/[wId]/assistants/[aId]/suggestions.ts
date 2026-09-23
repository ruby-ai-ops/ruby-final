import { AgentSuggestionResource } from "@app/lib/resources/agent_suggestion_resource";
import type { AdminListSuggestions } from "@app/types/api/admin/agent_configurations";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const DeleteSuggestionQuerySchema = z.object({
  sId: z.string(),
});

const ParamsSchema = z.object({
  aId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/assistants/:aId/suggestions.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminListSuggestions> => {
    const auth = ctx.get("auth");
    const { aId } = ctx.req.valid("param");

    const suggestions =
      await AgentSuggestionResource.listByAgentConfigurationId(auth, aId);

    return ctx.json({ suggestions: suggestions.map((s) => s.toJSON()) });
  }
);

app.delete(
  "/",
  validate("param", ParamsSchema),
  validate("query", DeleteSuggestionQuerySchema),
  async (ctx) => {
    const auth = ctx.get("auth");
    const { sId } = ctx.req.valid("query");

    const suggestion = await AgentSuggestionResource.fetchById(auth, sId);
    if (!suggestion) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "agent_configuration_not_found",
          message: "The suggestion was not found.",
        },
      });
    }

    const deleteResult = await suggestion.delete(auth);
    if (deleteResult.isErr()) {
      return apiError(ctx, {
        status_code: 500,
        api_error: {
          type: "internal_server_error",
          message: "Failed to delete suggestion.",
        },
      });
    }

    return ctx.body(null, 204);
  }
);

export default app;
