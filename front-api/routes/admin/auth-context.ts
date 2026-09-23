import type { GetAdminNoWorkspaceAuthContextResponseType } from "@app/lib/api/admin/auth_context";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/auth-context. adminAuth is applied by the parent admin
// sub-app, so ctx.get("auth") is always available here and the user is a
// verified super-user.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  async (ctx): HandlerResult<GetAdminNoWorkspaceAuthContextResponseType> => {
    const auth = ctx.get("auth");

    return ctx.json({
      user: auth.toAdminUserJSON(),
      isSuperUser: true,
      adminRoles: ctx.get("adminRoles"),
    });
  }
);

export default app;
