import { adminApp } from "@front-api/middlewares/ctx";

import currency from "./currency";

const app = adminApp();

app.route("/currency", currency);

export default app;
