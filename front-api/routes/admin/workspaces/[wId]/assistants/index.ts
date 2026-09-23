import { adminApp } from "@front-api/middlewares/ctx";

import aId from "./[aId]";

const app = adminApp();

app.route("/:aId", aId);

export default app;
