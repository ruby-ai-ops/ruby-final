import { DataSourceResource } from "@app/lib/resources/data_source_resource";
import type { AdminListDataSources } from "@app/types/api/admin/data_sources";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import dsId from "./[dsId]";

// Mounted at /api/admin/workspaces/:wId/data_sources.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListDataSources> => {
  const auth = ctx.get("auth");

  const dataSources = await DataSourceResource.listByWorkspace(auth, {
    includeEditedBy: true,
  });

  return ctx.json({ data_sources: dataSources.map((ds) => ds.toJSON()) });
});

app.route("/:dsId", dsId);

export default app;
