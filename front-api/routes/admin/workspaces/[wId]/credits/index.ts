import { CreditResource } from "@app/lib/resources/credit_resource";
import type { AdminListCreditsResponseBody } from "@app/types/api/admin/credits";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import apiKeysUsage from "./api-keys-usage";
import awuPoolCurrentCycle from "./awu-pool-current-cycle";
import awuPoolCycleHistory from "./awu-pool-cycle-history";
import consumptionExport from "./consumption-export";
import membersUsage from "./members-usage";
import seatsPlan from "./seats-plan";
import topUps from "./top-ups";

// Mounted at /api/admin/workspaces/:wId/credits.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListCreditsResponseBody> => {
  const auth = ctx.get("auth");

  const DAYS_30_MS = 30 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - DAYS_30_MS);

  const [credits, excessCreditsLast30DaysMicroUsd] = await Promise.all([
    CreditResource.listAll(auth),
    CreditResource.sumExcessCreditsInPeriod(auth, {
      periodStart: thirtyDaysAgo,
      periodEnd: now,
    }),
  ]);

  const rows = credits.map((credit) => credit.toJSONForAdmin());

  return ctx.json({
    rows,
    excessCreditsLast30DaysMicroUsd,
  });
});

app.route("/api-keys-usage", apiKeysUsage);
app.route("/awu-pool-current-cycle", awuPoolCurrentCycle);
app.route("/awu-pool-cycle-history", awuPoolCycleHistory);
app.route("/consumption-export", consumptionExport);
app.route("/members-usage", membersUsage);
app.route("/seats-plan", seatsPlan);
app.route("/top-ups", topUps);

export default app;
