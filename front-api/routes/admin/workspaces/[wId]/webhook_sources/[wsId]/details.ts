import type { AdminGetWebhookSourceDetails } from "@app/lib/api/admin/webhook_sources";
import { getWebhookSourceAdminDetails } from "@app/lib/api/webhook_source";
import { WebhookSourceResource } from "@app/lib/resources/webhook_source_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  wsId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/webhook_sources/:wsId/details.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetWebhookSourceDetails> => {
    const auth = ctx.get("auth");
    const { wsId } = ctx.req.valid("param");

    const source = await WebhookSourceResource.fetchById(auth, wsId);
    if (!source) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "webhook_source_not_found",
          message: "Webhook source not found.",
        },
      });
    }

    const details = await getWebhookSourceAdminDetails(auth, source);

    return ctx.json(details);
  }
);

export default app;
