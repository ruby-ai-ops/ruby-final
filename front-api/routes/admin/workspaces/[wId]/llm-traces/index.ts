import { adminApp } from "@front-api/middlewares/ctx";

import runId from "./[runId]";

const app = adminApp();

app.route("/:runId", runId);

export default app;
