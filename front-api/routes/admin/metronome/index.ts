import { adminApp } from "@front-api/middlewares/ctx";

import packages from "./packages";

const app = adminApp();

app.route("/packages", packages);

export default app;
