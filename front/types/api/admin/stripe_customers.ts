import type { SupportedCurrency } from "@app/types/currency";
import { z } from "zod";

export const PostAdminStripeCustomerCurrencyBodySchema = z.object({
  stripeCustomerId: z.string().min(1, "Required"),
});

export type PostAdminStripeCustomerCurrencyResponseBody = {
  currency: SupportedCurrency;
};
