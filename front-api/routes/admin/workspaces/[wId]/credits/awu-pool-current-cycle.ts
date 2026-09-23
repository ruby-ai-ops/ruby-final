import { getAwuPoolCurrentCycle } from "@app/lib/api/credits/awu_pool_summary";
import type { AwuPoolCurrentCycleResponseBody } from "@app/types/api/credits/awu_pool_summary";
import { awuPoolSummaryErrorToApi } from "@front-api/lib/api/awu_pool_summary_errors";
import { adminApp } from "@front-api/middlewares/ctx";

export type { AwuPoolCurrentCycleResponseBody };

// Mounted at /api/admin/workspaces/:wId/credits/awu-pool-current-cycle.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx) => {
  const auth = ctx.get("auth");

  const result = await getAwuPoolCurrentCycle(auth);
  if (result.isErr()) {
    return awuPoolSummaryErrorToApi(ctx, result.error);
  }

  return ctx.json(result.value);
});

export default app;
