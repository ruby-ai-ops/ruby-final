import type { GetAdminFeatureFlagsResponseBody } from "@app/lib/api/admin/feature_flags";
import { listFeatureFlagUsage } from "@app/lib/api/admin/feature_flags";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import flagName from "./[flagName]";

// Mounted at /api/admin/feature-flags. adminAuth is applied by the parent admin
// sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<GetAdminFeatureFlagsResponseBody> => {
  const featureFlags = await listFeatureFlagUsage();

  return ctx.json({ featureFlags });
});

app.route("/:flagName", flagName);

export default app;
