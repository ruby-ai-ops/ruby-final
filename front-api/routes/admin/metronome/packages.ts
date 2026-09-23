import type { GetAdminMetronomePackagesResponseBody } from "@app/lib/api/admin/metronome";
import { listMetronomePackages } from "@app/lib/metronome/client";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/metronome/packages. adminAuth is applied by the parent
// admin sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  async (ctx): HandlerResult<GetAdminMetronomePackagesResponseBody> => {
    const result = await listMetronomePackages();
    if (result.isErr()) {
      return apiError(ctx, {
        status_code: 502,
        api_error: {
          type: "internal_server_error",
          message: `Failed to list Metronome packages: ${result.error.message}`,
        },
      });
    }

    return ctx.json({ packages: result.value });
  }
);

export default app;
