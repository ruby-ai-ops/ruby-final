import type { AdminListProjects } from "@app/lib/api/admin/projects";
import { listAllProjectsWithAdminMetadata } from "@app/lib/api/projects/list";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import projectId from "./[projectId]";

// Mounted at /api/admin/workspaces/:wId/projects.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListProjects> => {
  const auth = ctx.get("auth");

  const projects = await listAllProjectsWithAdminMetadata(auth);

  return ctx.json({ projects });
});

app.route("/:projectId", projectId);

export default app;
