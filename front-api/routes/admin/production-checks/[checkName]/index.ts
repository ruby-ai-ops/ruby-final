import { adminApp } from "@front-api/middlewares/ctx";

import history from "./history";

const app = adminApp();

app.route("/history", history);

export default app;
