import { makeInternalMCPServer } from "@app/lib/actions/mcp_internal_actions/utils";
import { registerTool } from "@app/lib/actions/mcp_internal_actions/wrappers";
import type { ToolContext } from "@app/lib/actions/types";
import { TOOLS } from "@app/lib/api/actions/servers/admin/tools";
import type { Authenticator } from "@app/lib/auth";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

function createServer(
  auth: Authenticator,
  toolContext?: ToolContext
): McpServer {
  const server = makeInternalMCPServer("admin");

  // Gate at server creation: if the caller is not a Ruby super user, register
  // a single error tool so the agent gets a clear message.
  // Note: here we do not use the authenticator's isRubySuperUser method because the authenticator is created using the regular flow.
  // Only admin create super user's authenticators.
  const user = auth.user();
  if (!user?.isRubySuperUser) {
    server.tool(
      "admin_not_available",
      "Admin tools require Ruby super user privileges.",
      {},
      async () => ({
        isError: true,
        content: [
          {
            type: "text",
            text: "Access denied: admin tools require Ruby super user privileges.",
          },
        ],
      })
    );
    return server;
  }

  for (const tool of TOOLS) {
    registerTool(auth, toolContext, server, tool, {
      monitoringName: "admin",
    });
  }

  return server;
}

export default createServer;
