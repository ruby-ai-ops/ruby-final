import type {
  AdminGetFrameFunction,
  AdminGetFrameFunctionSource,
} from "@app/lib/api/admin/frames";
import { getFrameFunctionSource } from "@app/lib/api/admin/frames";
import { adminFrameFunctionApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { withFrameFunction } from "@front-api/middlewares/with_frames";

import invocations from "./invocations";

// Mounted at /api/admin/workspaces/:wId/frames/:frameId/functions/:functionId.
const app = adminFrameFunctionApp();

app.use("*", withFrameFunction());

app.route("/invocations", invocations);

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<AdminGetFrameFunction> => {
  const frame = ctx.get("frame");
  const frameFunction = ctx.get("frameFunction");

  return ctx.json({
    frameFunction: frameFunction.toAdminFrameDetailsJSON(
      frame.useCaseMetadata?.activePublicationId ?? null
    ),
  });
});

/** @ignoreswagger */
app.get("/source", async (ctx): HandlerResult<AdminGetFrameFunctionSource> => {
  const auth = ctx.get("auth");
  const frame = ctx.get("frame");
  const frameFunction = ctx.get("frameFunction");

  const sourceResult = await getFrameFunctionSource(auth, {
    frame,
    sandboxFunction: frameFunction,
  });
  if (sourceResult.isErr()) {
    return apiError(ctx, {
      status_code: 404,
      api_error: {
        type: "file_not_found",
        message:
          "The published bundle for this Frame function is missing from storage.",
      },
    });
  }

  return ctx.json({ source: sourceResult.value });
});

export default app;
