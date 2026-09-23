import { resolveCurrencyFromStripe } from "@app/lib/plans/billing_currency";
import { getStripeCustomer } from "@app/lib/plans/stripe";
import {
  PostAdminStripeCustomerCurrencyBodySchema,
  type PostAdminStripeCustomerCurrencyResponseBody,
} from "@app/types/api/admin/stripe_customers";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";

// Mounted at /api/admin/stripe/customers/currency.
const app = adminApp();

/** @ignoreswagger */
app.post(
  "/",
  validate("json", PostAdminStripeCustomerCurrencyBodySchema),
  async (ctx): HandlerResult<PostAdminStripeCustomerCurrencyResponseBody> => {
    const { stripeCustomerId } = ctx.req.valid("json");

    const stripeCustomer = await getStripeCustomer(stripeCustomerId);
    if (!stripeCustomer) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "invalid_request_error",
          message: `Stripe customer not found: ${stripeCustomerId}.`,
        },
      });
    }

    const currency = resolveCurrencyFromStripe({ stripeCustomer });
    return ctx.json({ currency });
  }
);

export default app;
