import { searchAdminResources } from "@app/lib/admin/search";
import type { GetAdminSearchItemsResponseBody } from "@app/types/api/admin/search";
import { isString } from "@app/types/shared/utils/general";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { apiError } from "@front-api/middlewares/utils";

// Mounted at /api/admin/search. adminAuth is applied by the parent admin sub-app.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<GetAdminSearchItemsResponseBody> => {
  const auth = ctx.get("auth");
  const search = ctx.req.query("search");
  if (!isString(search)) {
    return apiError(ctx, {
      status_code: 400,
      api_error: {
        type: "invalid_request_error",
        message: "The search query parameter is required.",
      },
    });
  }

  const results = await searchAdminResources(auth, search);
  return ctx.json({ results });
});

export default app;
