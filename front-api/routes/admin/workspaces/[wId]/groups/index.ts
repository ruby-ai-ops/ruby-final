import type { AdminListGroups } from "@app/lib/api/admin/groups";
import { GroupResource } from "@app/lib/resources/group_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import groupId from "./[groupId]";

// Mounted at /api/admin/workspaces/:wId/groups.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListGroups> => {
  const auth = ctx.get("auth");

  const groups = await GroupResource.listAllWorkspaceGroups(auth);
  const memberCounts = await GroupResource.getMemberCountsForGroups(
    auth,
    groups
  );

  return ctx.json({
    groups: groups.map((group) => ({
      ...group.toJSON(),
      memberCount: memberCounts.get(group.id) ?? 0,
    })),
  });
});

app.route("/:groupId", groupId);

export default app;
