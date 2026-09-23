import type { AdminGetDataRetentionResponseBody } from "@app/lib/api/admin/data_retention";
import {
  getAgentsDataRetention,
  getConversationsDataRetention,
  getWorkspaceDataRetention,
} from "@app/lib/data_retention";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

export type { AdminGetDataRetentionResponseBody };

// Mounted at /api/admin/workspaces/:wId/data_retention.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminGetDataRetentionResponseBody> => {
  const auth = ctx.get("auth");

  const workspaceRetention = await getWorkspaceDataRetention(auth);
  const convosRetention = await getConversationsDataRetention(auth);
  const agentsRetention = await getAgentsDataRetention(auth);

  return ctx.json({
    data: {
      workspace: workspaceRetention,
      conversations: convosRetention,
      agents: agentsRetention,
    },
  });
});

export default app;
