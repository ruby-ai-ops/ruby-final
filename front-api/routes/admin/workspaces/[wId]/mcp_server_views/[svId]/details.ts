import type { AdminGetMCPServerViewDetails } from "@app/lib/api/admin/mcp_server_views";
import { mcpServerViewToAdminJSON } from "@app/lib/admin/utils";
import { MCPServerViewResource } from "@app/lib/resources/mcp_server_view_resource";
import { adminApp } from "@front-api/middlewares/ctx";
import { apiError, type HandlerResult } from "@front-api/middlewares/utils";
import { validate } from "@front-api/middlewares/validator";
import { z } from "zod";

const ParamsSchema = z.object({
  svId: z.string(),
});

// Mounted at /api/admin/workspaces/:wId/mcp_server_views/:svId/details.
const app = adminApp();

/** @ignoreswagger */
app.get(
  "/",
  validate("param", ParamsSchema),
  async (ctx): HandlerResult<AdminGetMCPServerViewDetails> => {
    const auth = ctx.get("auth");
    const { svId } = ctx.req.valid("param");

    const mcpServerView = await MCPServerViewResource.fetchById(auth, svId, {
      includeHeavyAttributes: [
        "authorization",
        "cachedTools",
        "customHeaders",
        "lastError",
        "sharedSecret",
      ],
      // Admin admin surface: surface a restricted server's view too.
      includeRestricted: true,
    });
    if (!mcpServerView) {
      return apiError(ctx, {
        status_code: 404,
        api_error: {
          type: "mcp_server_view_not_found",
          message: "MCP server view not found.",
        },
      });
    }

    const mcpServerViewJSON = await mcpServerViewToAdminJSON(
      mcpServerView,
      auth
    );

    const allViews = await MCPServerViewResource.listByMCPServer(
      auth,
      mcpServerView.mcpServerId,
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
    const spaceViews = allViews
      .filter((view) => view.space.kind !== "system")
      .map((view) => {
        const json = view.toJSON();
        return {
          sId: view.sId,
          spaceId: view.space.sId,
          space: {
            sId: view.space.sId,
            name: view.space.name,
            kind: view.space.kind,
          },
          createdAt: json.createdAt,
          editedBy: json.editedByUser?.fullName ?? null,
          editedAt: json.editedByUser?.editedAt ?? null,
        };
      });

    return ctx.json({ mcpServerView: mcpServerViewJSON, spaceViews });
  }
);

export default app;
