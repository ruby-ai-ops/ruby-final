import type { GetApiKeysUsageResponseBody } from "@app/lib/api/credits/api_keys_usage";
import { getApiKeysUsage } from "@app/lib/api/credits/api_keys_usage";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

export type { GetApiKeysUsageResponseBody };

// Mounted at /api/admin/workspaces/:wId/credits/api-keys-usage.
const app = adminApp();

/** @ignoreswagger */
app.get("/", async (ctx): HandlerResult<GetApiKeysUsageResponseBody> => {
  const auth = ctx.get("auth");

  return ctx.json(await getApiKeysUsage(auth));
});

export default app;
