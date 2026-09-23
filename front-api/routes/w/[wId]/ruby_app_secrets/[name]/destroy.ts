import { getRubyAppSecret } from "@app/lib/api/ruby_app_secrets";
import { workspaceApp } from "@front-api/middlewares/ctx";
import { ensureIsAdmin } from "@front-api/middlewares/ensure_role";
import { apiError } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  name: z.string(),
});

// Mounted at /api/w/:wId/ruby_app_secrets/:name/destroy.
const app = workspaceApp();

/** @ignoreswagger */
app.delete(
  "/",
  validate("param", ParamsSchema),
  ensureIsAdmin(),
  async (ctx) => {
    const auth = ctx.get("auth");

    const { name } = ctx.req.valid("param");

    const secret = await getRubyAppSecret(auth, name);

    if (secret == null) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "ruby_app_secret_not_found",
          message: "Workspace not found.",
        },
      });
    }

    await secret.destroy();
    return ctx.body(null, 204);
  }
);

export default app;
