import {
  getCheckHistoryRuns,
  getRegisteredCheck,
} from "@app/lib/api/admin/production_checks";
import type { GetCheckHistoryResponseBody } from "@app/types/api/admin/production_checks";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

export type { GetCheckHistoryResponseBody };

const ParamsSchema = z.object({
  checkName: z.string(),
});

// Mounted at /api/admin/production-checks/:checkName/history.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<GetCheckHistoryResponseBody> => {
    const { checkName } = ctx.req.valid("param");

    const registeredCheck = getRegisteredCheck(checkName);
    if (!registeredCheck) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "action_not_found",
          message: `Check "${checkName}" not found.`,
        },
      });
    }

    const runs = await getCheckHistoryRuns(checkName);

    return ctx.json({ runs });
  }
);

export default app;
