// Shared contract types for the admin coupons API endpoints, imported by the
// admin coupons API routes under `front-api/routes/admin/coupons`.
import type { CouponRedemptionType, CouponType } from "@app/types/coupon";

export type GetAdminCouponsResponseBody = {
  coupons: CouponType[];
  canCreateCoupon: boolean;
};

export type CreateAdminCouponResponseBody = {
  coupon: CouponType;
};

export type GetAdminCouponRedemptionsResponseBody = {
  redemptions: CouponRedemptionType[];
};
