import { SkillResource } from "@app/lib/resources/skill/skill_resource";
import type { AdminGetSkillVersions } from "@app/types/api/admin/skills";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  sId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/skills/:sId/versions.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetSkillVersions> => {
    const auth = ctx.get("auth");
    const { sId } = ctx.req.valid("param");

    const skill = await SkillResource.fetchById(auth, sId);
    if (!skill) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "skill_not_found",
          message: "Skill not found.",
        },
      });
    }

    const versions = await skill.listVersions(auth);

    return ctx.json({
      versions: versions.map((v) => ({
        ...v.toJSON(auth),
        version: v.version,
      })),
    });
  }
);

export default app;
