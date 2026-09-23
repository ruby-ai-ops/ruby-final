import type { AdminListProjectKnowledgeFromConnectors } from "@app/lib/api/admin/projects";
import { listProjectKnowledgeFromConnectors } from "@app/lib/api/projects/context";
import { SpaceResource } from "@app/lib/resources/space_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  projectId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/projects/:projectId/connector-knowledge.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminListProjectKnowledgeFromConnectors> => {
    const auth = ctx.get("auth");
    const { projectId } = ctx.req.valid("param");

    const space = await SpaceResource.fetchById(auth, projectId);
    if (!space || !space.isProject()) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "space_not_found",
          message: "Project not found.",
        },
      });
    }

    const items = await listProjectKnowledgeFromConnectors(auth, space);

    return ctx.json({ items });
  }
);

export default app;
