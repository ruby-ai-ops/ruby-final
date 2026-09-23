import { adminApp } from "@front-api/middlewares/ctx";

import tId from "./[tId]";
import search from "./search";

// Mounted at /api/admin/workspaces/:wId/triggers.
const app = adminApp();

app.route("/search", search);
app.route("/:tId", tId);

export default app;
