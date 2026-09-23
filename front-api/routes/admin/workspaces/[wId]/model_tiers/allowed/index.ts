import {
  listGroupAllowedTierNames,
  listUserAllowedTierNames,
  listWorkspaceMaxAllowedTierName,
} from "@app/lib/model_tiers/allowed_tiers";
import type { GetAdminAllowedModelTiersResponseBody } from "@app/types/api/model_tiers";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";

// Mounted at /api/admin/workspaces/:wId/model_tiers/allowed.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  async (ctx): HandlerResult<GetAdminAllowedModelTiersResponseBody> => {
    const auth = ctx.get("auth");

    const [users, groups, maxTierName] = await Promise.all([
      listUserAllowedTierNames(auth),
      listGroupAllowedTierNames(auth),
      listWorkspaceMaxAllowedTierName(auth),
    ]);

    return ctx.json({ users, groups, maxTierName });
  }
);

export default app;
