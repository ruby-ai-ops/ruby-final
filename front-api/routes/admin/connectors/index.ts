import { adminApp } from "@front-api/middlewares/ctx";

import connectorId from "./[connectorId]";

// Mounted at /api/admin/connectors.
const app = adminApp();

app.route("/:connectorId", connectorId);

export default app;
