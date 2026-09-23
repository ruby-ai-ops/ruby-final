import { adminApp } from "@front-api/middlewares/ctx";

import suggestionId from "./[suggestionId]";

const app = adminApp();

app.route("/:suggestionId", suggestionId);

export default app;
