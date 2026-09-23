import { adminApp } from "@front-api/middlewares/ctx";

import dataSourceViews from "./data_source_views";
import details from "./details";

const app = adminApp();

app.route("/data_source_views", dataSourceViews);
app.route("/details", details);

export default app;
