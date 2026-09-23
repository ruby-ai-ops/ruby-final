import { adminApp } from "@front-api/middlewares/ctx";

import views from "./views";

const app = adminApp();

app.route("/views", views);

export default app;
