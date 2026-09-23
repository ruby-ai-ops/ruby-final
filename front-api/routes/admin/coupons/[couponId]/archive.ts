import { CouponResource } from "@app/lib/resources/coupon_resource";
import type { CouponDiscountType } from "@app/types/coupon";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { apiError } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

// `expirationDate` and `archivedAt` are `Date | null` in
// `CouponResource.toJSON()` but JSON-serialize to ISO strings on the wire;
// the response body type reflects the wire format.
export type ArchiveAdminCouponResponseBody = {
  coupon: {
    sId: string;
    code: string;
    description: string | null;
    discountType: CouponDiscountType;
    amount: number;
    durationMonths: number | null;
    maxRedemptions: number | null;
    redemptionCount: number;
    expirationDate: string | null;
    archivedAt: string | null;
  };
};

const ParamsSchema = z.object({
  couponId: z.string(),
});

// Mounted at /api/admin/coupons/:couponId/archive. adminAuth is applied by the
// parent admin sub-app.
const app = adminApp();

/** @ignoreswagger */
app.post(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<ArchiveAdminCouponResponseBody> => {
    const auth = ctx.get("auth");
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

    if (coupon.archivedAt !== null) {
      return apiError(ctx, {
        status_code: 400,
        api_error: {
          type: "invalid_request_error",
          message: "Coupon is already archived.",
        },
      });
    }

    const result = await coupon.archive(auth);
    if (result.isErr()) {
      return apiError(ctx, {
        status_code: 500,
        api_error: {
          type: "internal_server_error",
          message: `Failed to archive coupon: ${result.error.message}`,
        },
      });
    }

    return ctx.json({ coupon: coupon.toJSON() });
  }
);

export default app;
