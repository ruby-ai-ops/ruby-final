import type { GetAdminFeatureFlagWorkspacesResponseBody } from "@app/lib/api/admin/feature_flags";
import { listWorkspacesForFeatureFlag } from "@app/lib/api/admin/feature_flags";
import { isWhitelistableFeature } from "@app/types/shared/feature_flags";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { apiError } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  flagName: z.string(),
});

// Mounted at /api/admin/feature-flags/:flagName. adminAuth is applied by the
// parent admin sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<GetAdminFeatureFlagWorkspacesResponseBody> => {
    const { flagName } = ctx.req.valid("param");

    const result = await listWorkspacesForFeatureFlag(flagName);

    // A name that is neither configured nor present in the database is a bad URL, not a flag
    // that happens to be enabled nowhere.
    if (!isWhitelistableFeature(flagName) && result.workspaces.length === 0) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "feature_flag_not_found",
          message: `Unknown feature flag: ${flagName}.`,
        },
      });
    }

    return ctx.json(result);
  }
);

export default app;
