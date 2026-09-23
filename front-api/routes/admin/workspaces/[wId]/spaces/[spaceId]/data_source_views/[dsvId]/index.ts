import { adminApp } from "@front-api/middlewares/ctx";

import contentNodes from "./content-nodes";

const app = adminApp();

app.route("/content-nodes", contentNodes);

export default app;
