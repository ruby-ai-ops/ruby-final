import type { GetAutomationTriggersResponse } from "@app/lib/api/analytics/automations/triggers";
import { resolveConsumptionPeriod } from "@app/lib/api/analytics/consumption/period";
import { toConsumptionPeriodInput } from "@app/lib/api/analytics/consumption/schema";
import {
  fetchAdminTriggers,
  AdminTriggersSearchBodySchema,
} from "@app/lib/api/admin/triggers";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";

// Mounted at /api/admin/workspaces/:wId/triggers/search.
const app = adminApp();

/** @ignoreswagger */
app.post(
  "/",
  validate("json", AdminTriggersSearchBodySchema),
  async (ctx): HandlerResult<GetAutomationTriggersResponse> => {
    const auth = ctx.get("auth");
    const { limit, offset, search, filter, sortOrder, ...periodQuery } =
      ctx.req.valid("json");
    const period = await resolveConsumptionPeriod(
      auth,
      toConsumptionPeriodInput(periodQuery)
    );

    const result = await fetchAdminTriggers(auth, {
      period,
      limit,
      offset,
      search,
      filter,
      sortOrder,
    });
    if (result.isErr()) {
      return apiError(
        ctx,
        {
          status_code: 500,
          api_error: {
            type: "internal_server_error",
            message: "Failed to retrieve triggers.",
          },
        },
        result.error
      );
    }

    return ctx.json(result.value);
  }
);

export default app;
