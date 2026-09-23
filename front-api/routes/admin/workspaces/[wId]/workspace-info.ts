import {
  getAdminWorkspaceInfo,
  type AdminGetWorkspaceInfo,
} from "@app/lib/api/admin/workspace_info";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/workspaces/:wId/workspace-info.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminGetWorkspaceInfo> => {
  const auth = ctx.get("auth");

  const result = await getAdminWorkspaceInfo(auth);
  if (result.isErr()) {
    return apiError(ctx, {
      status_code: 404,
      api_error: {
        type: "workspace_not_found",
        message: "Workspace not found.",
      },
    });
  }

  return ctx.json(result.value);
});

export default app;
