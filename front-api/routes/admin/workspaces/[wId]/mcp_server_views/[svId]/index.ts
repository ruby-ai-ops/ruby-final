import { adminApp } from "@front-api/middlewares/ctx";

import details from "./details";

const app = adminApp();

app.route("/details", details);

export default app;
