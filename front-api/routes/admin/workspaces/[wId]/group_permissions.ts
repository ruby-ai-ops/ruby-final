import type { AdminListGroupPermissions } from "@app/lib/api/admin/group_permissions";
import {
  getAdminGroupPermissionsForGroup,
  getAdminGroupPermissionsForResource,
} from "@app/lib/api/admin/group_permissions";
import { fetchAdminGroupById } from "@app/lib/api/admin/groups";
import { GROUP_PERMISSION_RESOURCE_TYPES } from "@app/types/group_permissions";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

// Either mode: grants held by a group, or grants that apply to a resource instance.
const QuerySchema = z.union([
  z.object({
    groupId: z.string(),
  }),
  z.object({
    resourceType: z.enum([...GROUP_PERMISSION_RESOURCE_TYPES]),
    resourceId: z.coerce.number().int(),
  }),
]);

// Mounted at /api/admin/workspaces/:wId/group_permissions.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("query", QuerySchema),
  async (ctx): HandlerResult<AdminListGroupPermissions> => {
    const auth = ctx.get("auth");
    const query = ctx.req.valid("query");

    if ("groupId" in query) {
      const group = await fetchAdminGroupById(auth, query.groupId);
      if (!group) {
        return apiError(ctx, {
          status_code: 404,
          api_error: {
            type: "group_not_found",
            message: "Group not found.",
          },
        });
      }

      return ctx.json({
        groupPermissions: await getAdminGroupPermissionsForGroup(auth, group),
      });
    }

    return ctx.json({
      groupPermissions: await getAdminGroupPermissionsForResource(auth, {
        resourceType: query.resourceType,
        resourceId: query.resourceId,
      }),
    });
  }
);

export default app;
