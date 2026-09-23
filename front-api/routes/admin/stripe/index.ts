import { adminApp } from "@front-api/middlewares/ctx";

import customers from "./customers";

const app = adminApp();

app.route("/customers", customers);

export default app;
