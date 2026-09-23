import { adminApp } from "@front-api/middlewares/ctx";

import images from "./images";
import request from "./request";

const app = adminApp();

app.route("/images", images);
app.route("/request", request);

export default app;
