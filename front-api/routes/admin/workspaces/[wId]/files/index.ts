import { adminApp } from "@front-api/middlewares/ctx";

import sId from "./[sId]";

const app = adminApp();

app.route("/:sId", sId);

export default app;
