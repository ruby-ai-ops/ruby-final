import { adminApp } from "@front-api/middlewares/ctx";

import datasourceRetrieval from "./datasource-retrieval";

const app = adminApp();

app.route("/datasource-retrieval", datasourceRetrieval);

export default app;
