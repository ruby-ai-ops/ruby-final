import { listDataSourceViewsWithUsage } from "@app/lib/api/data_source_view";
import type { AdminListDataSourceViews } from "@app/lib/api/admin/data_source_views";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import dsvId from "./[dsvId]";

// Mounted at /api/admin/workspaces/:wId/data_source_views.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListDataSourceViews> => {
  const auth = ctx.get("auth");

  const dataSourceViewsWithUsage = await listDataSourceViewsWithUsage(auth);

  return ctx.json({ data_source_views: dataSourceViewsWithUsage });
});

app.route("/:dsvId", dsvId);

export default app;
