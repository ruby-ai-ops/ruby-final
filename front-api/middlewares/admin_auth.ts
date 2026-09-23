import {
  getCloudflareAccessConfig,
  getAdminRolesForUserViaCloudflareAccess,
  resolveCloudflareAccessToken,
  verifyCloudflareAccessJwt,
} from "@app/lib/api/admin/cloudflare_access";
import { Authenticator, isRubyInternalEmail } from "@app/lib/auth";
import { ALL_ROLES } from "@app/lib/admin/roles";
import logger from "@app/logger/logger";
import { isDevelopment } from "@app/types/shared/env";
import type { AdminCtx } from "@front-api/middlewares/ctx";
import { resolveSession } from "@front-api/middlewares/session_resolution";
import { apiError } from "@front-api/middlewares/utils";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

/**
 * Authenticates a Admin (super-user) request and stashes an unscoped
 * `Authenticator` on the Hono context. Apply once at the `/api/admin` root;
 * workspace-scoped routes layer `withAdminWorkspace` on top.
 *
 * Prefers a validated Cloudflare Access JWT (`Cf-Access-Jwt-Assertion` /
 * `CF_Authorization`) so admin operators do not need a provisioned Ruby user
 * with `isRubySuperUser` on every deployment. Outside development, a missing
 * Access token is rejected. In development only, falls back to the WorkOS
 * super-user session path when no Access token is present.
 *
 * Super-user privilege is an Authenticator flag set only by admin factories
 * (`fromRubySuperUser` / `fromSuperUserSession`), not by the DB column alone.
 */
export const adminAuth = createMiddleware<AdminCtx>(async (ctx, next) => {
  const accessConfig = getCloudflareAccessConfig();
  const accessToken = resolveCloudflareAccessToken({
    headerToken: ctx.req.header("cf-access-jwt-assertion"),
    cookieToken: getCookie(ctx, "CF_Authorization"),
  });

  if (accessConfig && accessToken) {
    const identity = await verifyCloudflareAccessJwt(accessToken);
    if (!identity) {
      return apiError(ctx, {
        status_code: 401,
        api_error: {
          type: "not_authenticated",
          message: "Invalid Cloudflare Access token.",
        },
      });
    }

    // Note: we should maybe remove this check and fully trust the Cloudflare Access token.
    // Kept for now to be symmetric with the WorkOS fallback.
    if (!isRubyInternalEmail(identity.email)) {
      logger.warn(
        {
          email: identity.email,
        },
        "[Admin Auth] Cloudflare Access token user is not a Ruby internal email"
      );
      return apiError(ctx, {
        status_code: 401,
        api_error: {
          type: "not_authenticated",
          message: "The user does not have permission",
        },
      });
    }

    const auth = await Authenticator.fromRubySuperUser({
      adminPrincipal: {
        email: identity.email,
        name: identity.name,
      },
    });

    logger.info(
      { email: identity.email },
      "[Admin Auth] User logged in Admin via Cloudflare Access token"
    );

    const adminRoles = await getAdminRolesForUserViaCloudflareAccess(accessToken);
    ctx.set("auth", auth);
    ctx.set("adminRoles", adminRoles);
    await next();
    return;
  } else if (!accessToken) {
    if (!isDevelopment()) {
      logger.warn(
        "[Admin Auth] Request missing Cloudflare Access token; rejecting request"
      );
    } else {
      logger.info(
        "[Admin Auth] Request missing Cloudflare Access token in development; falling back to WorkOS super-user session"
      );

      const sessionResult = await resolveSession(ctx);
      if (sessionResult instanceof Response) {
        return sessionResult;
      }

      const user = await Authenticator.userFromSession(sessionResult);
      // WorkOS fallback still requires a provisioned Ruby user
      if (user) {
        const auth = await Authenticator.fromRubySuperUser({ user });
        logger.info(
          {
            userId: user.sId,
            email: user.email,
          },
          "[Admin Auth] User logged in Admin via WorkOS in development."
        );

        ctx.set("auth", auth);
        ctx.set("adminRoles", ALL_ROLES);
        await next();
        return;
      } else {
        logger.warn(
          "[Admin Auth] WorkOS fallback user not found; rejecting request"
        );
      }
    }
  }

  return apiError(ctx, {
    status_code: 401,
    api_error: {
      type: "not_authenticated",
      message: "The user does not have permission",
    },
  });
});

/**
 * Re-scopes the existing Admin `Authenticator` to the `:wId` workspace from
 * the route and 404s if the workspace cannot be resolved. Apply after
 * `adminAuth` so the unscoped super-user `auth` is already on the context.
 */
export const withAdminWorkspace = createMiddleware<AdminCtx>(
  async (ctx, next) => {
    const wId = ctx.req.param("wId");
    if (!wId) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "workspace_not_found",
          message: "The workspace was not found.",
        },
      });
    }

    const current = ctx.get("auth");
    const auth = await Authenticator.fromRubySuperUser({
      user: current.user(),
      wId,
      adminPrincipal: current.getAdminPrincipal(),
    });

    if (!auth.workspace()) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "workspace_not_found",
          message: "The workspace was not found.",
        },
      });
    }

    ctx.set("auth", auth);
    await next();
  }
);
