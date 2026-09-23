import type { AdminGetSpaceDetails } from "@app/lib/api/admin/spaces";
import { getMembers } from "@app/lib/api/workspace";
import { spaceToAdminJSON } from "@app/lib/admin/utils";
import { ProjectMetadataResource } from "@app/lib/resources/project_metadata_resource";
import { SpaceResource } from "@app/lib/resources/space_resource";
import type { UserTypeWithWorkspaces } from "@app/types/user";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  spaceId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/spaces/:spaceId/details.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetSpaceDetails> => {
    const auth = ctx.get("auth");
    const { spaceId } = ctx.req.valid("param");

    const space = await SpaceResource.fetchById(auth, spaceId);
    if (!space) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "space_not_found",
          message: "Space not found.",
        },
      });
    }

    const members: Record<string, UserTypeWithWorkspaces[]> = {};

    const groups = await space.fetchMembershipGroups(auth);

    const memberships = await getMembers(auth);
    const memberById = new Map(memberships.members.map((m) => [m.sId, m]));

    for (const group of groups) {
      const groupMembers = await group.getActiveMembers(auth);
      members[group.name] = groupMembers.flatMap((user) => {
        const member = memberById.get(user.sId);
        return member ? [member] : [];
      });
    }

    const metadata = space.isProject()
      ? await ProjectMetadataResource.fetchBySpace(auth, space)
      : null;

    return ctx.json({
      members,
      metadata: metadata ? metadata.toJSON() : null,
      space: await spaceToAdminJSON(auth, space),
    });
  }
);

export default app;
