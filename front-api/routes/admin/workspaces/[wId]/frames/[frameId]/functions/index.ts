import type { AdminListFrameFunctions } from "@app/lib/api/admin/frames";
import { listFrameFunctions } from "@app/lib/api/admin/frames";
import { adminFrameApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

import functionId from "./[functionId]";

// Mounted at /api/admin/workspaces/:wId/frames/:frameId/functions.
const app = adminFrameApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminListFrameFunctions> => {
  const auth = ctx.get("auth");
  const frame = ctx.get("frame");

  return ctx.json({ items: await listFrameFunctions(auth, frame) });
});

app.route("/:functionId", functionId);

export default app;
