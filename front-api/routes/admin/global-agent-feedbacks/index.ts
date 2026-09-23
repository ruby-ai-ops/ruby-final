import type { GetGlobalAgentFeedbacksResponseBody } from "@app/lib/api/admin/global_agent_feedbacks";
import { listGlobalAgentFeedbacks } from "@app/lib/api/admin/global_agent_feedbacks";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/global-agent-feedbacks. adminAuth is applied by the
// parent admin sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  async (ctx): HandlerResult<GetGlobalAgentFeedbacksResponseBody> => {
    const includeEmptyQuery = ctx.req.query("includeEmpty");
    const lastIdQuery = ctx.req.query("lastId");

    const lastId =
      lastIdQuery !== undefined ? parseInt(lastIdQuery, 10) : undefined;

    const result = await listGlobalAgentFeedbacks({
      includeEmpty: includeEmptyQuery === "true",
      lastId,
    });

    return ctx.json(result);
  }
);

export default app;
