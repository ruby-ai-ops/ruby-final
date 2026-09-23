import type { AdminListMCPServerViews } from "@app/lib/api/admin/mcp_server_views";
import { MCPServerViewResource } from "@app/lib/resources/mcp_server_view_resource";
import { SpaceResource } from "@app/lib/resources/space_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import type { HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const QuerySchema = z.object({
  globalSpaceOnly: z.enum(["true", "false"]).optional(),
  systemSpaceOnly: z.enum(["true", "false"]).optional(),
});

// Mounted at /api/admin/workspaces/:wId/mcp/views.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("query", QuerySchema),
  async (ctx): HandlerResult<AdminListMCPServerViews> => {
    const auth = ctx.get("auth");
    const { globalSpaceOnly, systemSpaceOnly } = ctx.req.valid("query");

    let mcpServerViews: MCPServerViewResource[];
    if (systemSpaceOnly === "true") {
      mcpServerViews = await MCPServerViewResource.listForSystemSpace(auth, {
        includeHeavyAttributes: [
          "authorization",
          "cachedTools",
          "customHeaders",
          "lastError",
          "sharedSecret",
        ],
      });
    } else if (globalSpaceOnly === "true") {
      const globalSpace = await SpaceResource.fetchWorkspaceGlobalSpace(auth);
      mcpServerViews = await MCPServerViewResource.listBySpace(
        auth,
        globalSpace,
        {
          includeHeavyAttributes: [
            "authorization",
            "cachedTools",
            "customHeaders",
            "lastError",
            "sharedSecret",
          ],
        }
      );
    } else {
      mcpServerViews = await MCPServerViewResource.listByWorkspace(auth, {
        includeHeavyAttributes: [
          "authorization",
          "cachedTools",
          "customHeaders",
          "lastError",
          "sharedSecret",
        ],
      });
    }

    return ctx.json({
      serverViews: mcpServerViews.map((sv) => {
        const space = sv.space.toJSON();
        return {
          ...sv.toJSON(),
          space: {
            sId: space.sId,
            name: space.name,
            kind: space.kind,
          },
        };
      }),
    });
  }
);

export default app;
