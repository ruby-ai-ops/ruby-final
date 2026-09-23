import type { AdminSeatLimitScheduleResponseBody } from "@app/lib/api/admin/seat_limits_schedule";
import {
  getSeatLimitSchedule,
  setSeatLimitScheduleForSeatType,
} from "@app/lib/api/admin/seat_limits_schedule";
import { MEMBERSHIP_SEAT_TYPES } from "@app/types/memberships";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import type { SuccessResponseBody } from "@front-api/routes/types";
import { z } from "zod";

export type { AdminSeatLimitScheduleResponseBody };

// End dates are derived server-side (phases are contiguous), so the client
// only submits each phase's start.
const PhaseSchema = z.object({
  minSeats: z.number().int().min(0),
  maxSeats: z.number().int().min(1).nullable(),
  startAt: z.coerce.date(),
});

const PostSeatLimitScheduleBodySchema = z.object({
  seatType: z.enum(MEMBERSHIP_SEAT_TYPES),
  phases: z.array(PhaseSchema),
});

// Mounted at /api/admin/workspaces/:wId/seat_limits_schedule.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminSeatLimitScheduleResponseBody> => {
  const auth = ctx.get("auth");
  const schedule = await getSeatLimitSchedule(auth);
  return ctx.json(schedule);
});

/** @ignoreswagger */
app.post(
  "/",
  validate("json", PostSeatLimitScheduleBodySchema),
  async (ctx): HandlerResult<SuccessResponseBody> => {
    const auth = ctx.get("auth");
    const { seatType, phases } = ctx.req.valid("json");

    const result = await setSeatLimitScheduleForSeatType(auth, {
      seatType,
      phases,
    });
    if (result.isErr()) {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: result.error.message,
        },
      });
    }

    return ctx.json({ success: true });
  }
);

export default app;
