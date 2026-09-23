import { pullTemplatesFromMainRegion } from "@app/lib/api/admin/templates";
import { config } from "@app/lib/api/regions/config";
import type { PullTemplatesResponseBody } from "@app/types/api/admin/templates";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { apiError } from "@front-api/middlewares/utils";

// Mounted at /api/admin/templates/pull. adminAuth is applied by the parent admin
// sub-app.
const app = adminApp();

/** @ignoreswagger */
app.post("/", async (ctx): HandlerResult<PullTemplatesResponseBody> => {
  if (!config.getRubyRegionSyncEnabled()) {
    return apiError(ctx, {
      status_code: 400,
      api_error: {
        type: "invalid_request_error",
        message: "This endpoint can only be called from non-main regions.",
      },
    });
  }

  const result = await pullTemplatesFromMainRegion();
  if (result.isErr()) {
    return apiError(ctx, {
      status_code: 500,
      api_error: {
        type: "internal_server_error",
        message: "Failed to fetch templates from main region.",
      },
    });
  }

  return ctx.json({
    success: true,
    count: result.value.count,
  });
});

export default app;
