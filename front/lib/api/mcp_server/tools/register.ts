import { getAuthenticatorFromMcpContext } from "@app/lib/api/mcp_server/context";
import type { WorkOSWorkspaceAuthenticator } from "@app/lib/api/workos_authenticator";
import type {
  McpServer,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";

type RubyMcpInputSchema = Record<string, z.ZodTypeAny>;

type InferMcpToolArgs<T extends RubyMcpInputSchema> = {
  [K in keyof T]: z.infer<T[K]>;
};

type RubyMcpToolConfig<T extends RubyMcpInputSchema | undefined = undefined> = {
  title?: string;
  description?: string;
  inputSchema?: T;
  _meta?: Record<string, unknown>;
};

type RubyMcpToolHandlerResult = CallToolResult | Promise<CallToolResult>;

type RubyMcpToolHandler<T extends RubyMcpInputSchema | undefined> =
  T extends RubyMcpInputSchema
    ? (
        auth: WorkOSWorkspaceAuthenticator,
        args: InferMcpToolArgs<T>
      ) => RubyMcpToolHandlerResult
    : (auth: WorkOSWorkspaceAuthenticator) => RubyMcpToolHandlerResult;

export function registerRubyMcpTool<
  T extends RubyMcpInputSchema | undefined = undefined,
>(
  server: McpServer,
  name: string,
  config: RubyMcpToolConfig<T>,
  handler: RubyMcpToolHandler<T>
): void {
  if (config.inputSchema === undefined) {
    server.registerTool(
      name,
      {
        title: config.title,
        description: config.description,
        _meta: config._meta,
      },
      ((extra) => {
        const auth = getAuthenticatorFromMcpContext(extra);
        return (handler as RubyMcpToolHandler<undefined>)(auth);
      }) as ToolCallback<undefined>
    );
    return;
  }

  server.registerTool(name, config, ((args, extra) => {
    const auth = getAuthenticatorFromMcpContext(extra);
    return (handler as RubyMcpToolHandler<RubyMcpInputSchema>)(auth, args);
  }) as ToolCallback<RubyMcpInputSchema>);
}
