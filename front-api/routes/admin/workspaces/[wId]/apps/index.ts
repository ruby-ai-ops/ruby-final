import type { AdminListApps } from "@app/lib/api/admin/apps";
import { AppResource } from "@app/lib/resources/app_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import aId from "./[aId]";
import importApp from "./import";

// Mounted at /api/admin/workspaces/:wId/apps. adminAuth is applied by
// the parent workspaces/[wId] sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListApps> => {
  const auth = ctx.get("auth");
  const apps = await AppResource.listByWorkspace(auth);

  return ctx.json({ apps: apps.map((a) => a.toJSON()) });
});

// Literal segments before param segments.
app.route("/import", importApp);
app.route("/:aId", aId);

export default app;
