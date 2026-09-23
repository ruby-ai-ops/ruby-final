import { FeatureFlagResource } from "@app/lib/resources/feature_flag_resource";
import type { GetAdminFeaturesResponseBody } from "@app/types/api/admin/features";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/workspaces/:wId/features.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<GetAdminFeaturesResponseBody> => {
  const auth = ctx.get("auth");
  const owner = auth.getNonNullableWorkspace();

  const flags = await FeatureFlagResource.listForWorkspace(owner);

  const features = flags.map((f) => ({
    name: f.name,
    createdAt: f.createdAt.toISOString(),
  }));

  return ctx.json({ features });
});

export default app;
