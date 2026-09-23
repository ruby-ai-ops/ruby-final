import { adminApp } from "@front-api/middlewares/ctx";

import suggestions from "./suggestions";

const app = adminApp();

app.route("/suggestions", suggestions);

export default app;
