import { adminApp } from "@front-api/middlewares/ctx";

import redirect from "./redirect";

// Mounted at /api/admin/connectors/:connectorId.
const app = adminApp();

app.route("/redirect", redirect);

export default app;
