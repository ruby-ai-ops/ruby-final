import type { AdminFrameDetails } from "@app/lib/api/admin/frames";
import { getFrameDetails } from "@app/lib/api/admin/frames";
import { adminFrameApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { withFrame } from "@front-api/middlewares/with_frames";

import databases from "./databases";
import functions from "./functions";

// Mounted at /api/admin/workspaces/:wId/frames/:frameId.
const app = adminFrameApp();

app.use("*", withFrame());

app.route("/functions", functions);
app.route("/databases", databases);

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminFrameDetails> => {
  const auth = ctx.get("auth");
  const frame = ctx.get("frame");

  return ctx.json(await getFrameDetails(auth, frame));
});

export default app;
