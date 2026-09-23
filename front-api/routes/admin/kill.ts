import type { GetKillSwitchesResponseBody } from "@app/lib/api/admin/kill";
import { KillSwitchTypeSchema } from "@app/lib/api/admin/kill";
import { isKillSwitchType } from "@app/lib/admin/types";
import { KillSwitchResource } from "@app/lib/resources/kill_switch_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { apiError } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import type { SuccessResponseBody } from "@front-api/routes/types";

// Mounted at /api/admin/kill. adminAuth is applied by the parent admin sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<GetKillSwitchesResponseBody> => {
  const killSwitches = await KillSwitchResource.listEnabledKillSwitches();
  return ctx.json({ killSwitches });
});

app.post(
  "/",
  validate("json", KillSwitchTypeSchema),
  async (ctx): HandlerResult<SuccessResponseBody> => {
    const { enabled, type } = ctx.req.valid("json");
    if (!isKillSwitchType(type)) {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: `The request body is invalid: ${type} is not a valid kill switch type`,
        },
      });
    }
    if (enabled) {
      await KillSwitchResource.enableKillSwitch(type);
    } else {
      await KillSwitchResource.disableKillSwitch(type);
    }
    return ctx.json({ success: true });
  }
);

export default app;
