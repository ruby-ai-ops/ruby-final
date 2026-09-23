import { adminApp } from "@front-api/middlewares/ctx";

import permissions from "./permissions";

const app = adminApp();

app.route("/permissions", permissions);

export default app;
