import { getWorkspaceGovernancePermissions } from "@app/lib/api/permissions/governance";
import type { GetGovernancePermissionsResponseBody } from "@app/types/api/governance";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/workspaces/:wId/governance_permissions.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  async (ctx): HandlerResult<GetGovernancePermissionsResponseBody> => {
    const auth = ctx.get("auth");

    return ctx.json({
      governancePermissions: await getWorkspaceGovernancePermissions(auth),
    });
  }
);

export default app;
