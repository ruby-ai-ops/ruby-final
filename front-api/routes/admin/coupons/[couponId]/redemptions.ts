import { CouponRedemptionResource } from "@app/lib/resources/coupon_redemption_resource";
import { CouponResource } from "@app/lib/resources/coupon_resource";
import type { CouponRedemptionStatus } from "@app/types/coupon";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { apiError } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

// `redeemedAt` is a `Date` in `CouponRedemptionResource.toJSON()` but
// JSON-serializes to an ISO string on the wire; the response body type
// reflects the wire format.
export type GetAdminCouponRedemptionsResponseBody = {
  redemptions: Array<{
    sId: string;
    couponId: string;
    workspaceId: string;
    redeemedByUserId: string | null;
    redeemedAt: string;
    metronomeCreditIds: string[];
    status: CouponRedemptionStatus;
  }>;
};

const ParamsSchema = z.object({
  couponId: z.string(),
});

// Mounted at /api/admin/coupons/:couponId/redemptions. adminAuth is applied by
// the parent admin sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<GetAdminCouponRedemptionsResponseBody> => {
    const { couponId } = ctx.req.valid("param");

    const coupon = await CouponResource.fetchByCouponId(couponId);
    if (!coupon) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "coupon_not_found",
          message: "Could not find the coupon.",
        },
      });
    }

    const redemptions = await CouponRedemptionResource.listAllByCoupon(coupon);
    return ctx.json({
      redemptions: redemptions.map((r) => r.toJSON()),
    });
  }
);

export default app;
