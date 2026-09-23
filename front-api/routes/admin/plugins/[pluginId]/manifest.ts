import { pluginManager } from "@app/lib/api/admin/plugin_manager";
import type { AdminGetPluginDetailsResponseBody } from "@app/types/api/admin/plugins/manifest";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  pluginId: z.string(),
});

// Mounted at /api/admin/plugins/:pluginId/manifest.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetPluginDetailsResponseBody> => {
    const { pluginId } = ctx.req.valid("param");

    const plugin = pluginManager.getPluginById(pluginId);
    if (!plugin) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "plugin_not_found",
          message: "Could not find the plugin.",
        },
      });
    }

    return ctx.json({ manifest: plugin.manifest });
  }
);

export default app;
