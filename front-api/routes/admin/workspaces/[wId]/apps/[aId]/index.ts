import { adminApp } from "@front-api/middlewares/ctx";

import details from "./details";
import exportApp from "./export";
import state from "./state";

const app = adminApp();

app.route("/details", details);
app.route("/export", exportApp);
app.route("/state", state);

export default app;
