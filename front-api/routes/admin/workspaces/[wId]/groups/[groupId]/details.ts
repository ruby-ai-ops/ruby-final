import type { AdminGetGroupDetails } from "@app/lib/api/admin/groups";
import { fetchAdminGroupById } from "@app/lib/api/admin/groups";
import { getGroupMembersWithWorkspaces } from "@app/lib/api/workspace";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  groupId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/groups/:groupId/details.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetGroupDetails> => {
    const auth = ctx.get("auth");
    const { groupId } = ctx.req.valid("param");

    const group = await fetchAdminGroupById(auth, groupId);
    if (!group) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "group_not_found",
          message: "Group not found.",
        },
      });
    }

    const members = await getGroupMembersWithWorkspaces(auth, group);

    return ctx.json({
      members,
      group: { ...group.toJSON(), memberCount: members.length },
    });
  }
);

export default app;
