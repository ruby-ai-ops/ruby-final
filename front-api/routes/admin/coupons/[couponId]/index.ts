import { adminApp } from "@front-api/middlewares/ctx";

import archive from "./archive";
import redemptions from "./redemptions";

// Mounted at /api/admin/coupons/:couponId.
const app = adminApp();

app.route("/archive", archive);
app.route("/redemptions", redemptions);

export default app;
