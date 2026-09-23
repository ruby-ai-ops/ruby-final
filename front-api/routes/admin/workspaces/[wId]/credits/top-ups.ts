import { getAwuTopUpsHistory } from "@app/lib/api/credits/top_ups_history";
import type { GetAwuTopUpsHistoryResponseBody } from "@app/types/api/credits/top_ups_history";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { topUpsErrorToApi } from "@front-api/routes/w/[wId]/credits/top-ups";

export type { GetAwuTopUpsHistoryResponseBody };

// Mounted at /api/admin/workspaces/:wId/credits/top-ups.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<GetAwuTopUpsHistoryResponseBody> => {
  const auth = ctx.get("auth");

  const result = await getAwuTopUpsHistory(auth);
  if (result.isErr()) {
    return topUpsErrorToApi(ctx, result.error);
  }
  return ctx.json(result.value);
});

export default app;
