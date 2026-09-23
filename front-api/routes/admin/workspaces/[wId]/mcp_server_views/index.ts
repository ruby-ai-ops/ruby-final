import { adminApp } from "@front-api/middlewares/ctx";

import svId from "./[svId]";

const app = adminApp();

app.route("/:svId", svId);

export default app;
