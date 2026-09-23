import type { AdminListSpaces } from "@app/lib/api/admin/spaces";
import { SpaceResource } from "@app/lib/resources/space_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import spaceId from "./[spaceId]";

// Mounted at /api/admin/workspaces/:wId/spaces.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListSpaces> => {
  const auth = ctx.get("auth");

  const spaces = await SpaceResource.listWorkspaceSpaces(auth);

  return ctx.json({
    spaces: await SpaceResource.enrichSpacesWithAccess(auth, spaces),
  });
});

app.route("/:spaceId", spaceId);

export default app;
