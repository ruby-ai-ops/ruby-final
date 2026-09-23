import { adminApp } from "@front-api/middlewares/ctx";

import message from "./[mId]";

// Mounted at /api/admin/workspaces/:wId/conversations/:cId/messages.
const app = adminApp();

app.route("/:mId", message);

export default app;
