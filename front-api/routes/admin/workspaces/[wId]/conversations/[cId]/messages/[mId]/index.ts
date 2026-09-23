import { adminApp } from "@front-api/middlewares/ctx";

import consumption from "./consumption";

// Mounted at /api/admin/workspaces/:wId/conversations/:cId/messages/:mId.
const app = adminApp();

app.route("/consumption", consumption);

export default app;
