import config from "@app/lib/api/config";
import { registerRubyMcpTools } from "@app/lib/api/mcp_server/tools";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Icon } from "@modelcontextprotocol/sdk/types.js";

function getRubyMcpServerIcons(): Icon[] {
  return [
    {
      src: `${config.getAppUrl()}/static/favicon180.png`,
      mimeType: "image/png",
      sizes: ["180x180"],
    },
  ];
}

const RUBY_MCP_SERVER_INSTRUCTIONS = `Ruby MCP server — programmatic access to a Ruby workspace for external clients (Cursor, Claude Desktop, etc.).

Every call is scoped to the authenticated Ruby user and workspace.

## Key concepts

- **Workspace**: the Ruby organization you signed into. All tools operate within it.
- **Conversation**: a chat thread with Ruby agents. Conversations can live at workspace level or inside a Pod. Each has its own file system for attachments and generated files.
- **Pod**: a Ruby project space — shared context with a description, tasks, linked company-data nodes, conversations, and files.
- **Skill**: a reusable set of instructions that Ruby agents can enable when relevant.
- **File system**: scoped paths such as \`conversation-<id>/...\` or \`pod-<id>/...\`.
- **Search**: semantic search across all globally accessible Spaces in the workspace.`;

export function createRubyMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "Ruby",
      version: "1.0",
      description:
        "Ruby is where people and agents collaborate as co-contributors, so that work doesn't just get done – it gets rewired.",
      websiteUrl: config.getStaticWebsiteUrl(),
      icons: getRubyMcpServerIcons(),
    },
    { instructions: RUBY_MCP_SERVER_INSTRUCTIONS }
  );

  registerRubyMcpTools(server);

  return server;
}
