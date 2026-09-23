import type { AdminListWebhookSources } from "@app/lib/api/admin/webhook_sources";
import { listWebhookSourcesWithCounts } from "@app/lib/api/webhook_source";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import wsId from "./[wsId]";

// Mounted at /api/admin/workspaces/:wId/webhook_sources.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListWebhookSources> => {
  const auth = ctx.get("auth");

  const webhookSources = await listWebhookSourcesWithCounts(auth);

  return ctx.json({ webhookSources });
});

app.route("/:wsId", wsId);

export default app;
