import type { AdminGetMessagingApps } from "@app/lib/api/admin/messaging_apps";
import { getAdminMessagingApps } from "@app/lib/api/admin/messaging_apps";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/workspaces/:wId/messaging_apps.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminGetMessagingApps> => {
  const auth = ctx.get("auth");

  return ctx.json({ messagingApps: await getAdminMessagingApps(auth) });
});

export default app;
