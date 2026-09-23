import { adminApp } from "@front-api/middlewares/ctx";

import dsvId from "./[dsvId]";

const app = adminApp();

app.route("/:dsvId", dsvId);

export default app;
