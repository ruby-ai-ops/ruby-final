import { MCPError } from "@app/lib/actions/mcp_errors";
import { ConfigurableToolInputSchemas } from "@app/lib/actions/mcp_internal_actions/input_schemas";
import type {
  ToolGeneratedFilePathType,
  ToolGeneratedFileType,
} from "@app/lib/actions/mcp_internal_actions/output_schemas";
import type { ToolDefinition } from "@app/lib/actions/mcp_internal_actions/tool_definition";
import { makeInternalMCPServer } from "@app/lib/actions/mcp_internal_actions/utils";
import { registerTool } from "@app/lib/actions/mcp_internal_actions/wrappers";
import type { ToolContext } from "@app/lib/actions/types";
import { isAgentLoopRunContext } from "@app/lib/actions/types";
import {
  isLightServerSideMCPToolConfigurationWithName,
  isServerSideMCPServerConfigurationWithName,
} from "@app/lib/actions/types/guards";
import {
  containsFileOutput,
  convertDatasetSchemaToZodRawShape,
  prepareAppContext,
  prepareParamsWithHistory,
  processRubyFileOutput,
} from "@app/lib/api/actions/servers/run_ruby_app/helpers";
import config from "@app/lib/api/config";
import type { Authenticator } from "@app/lib/auth";
import { getApiKeyNameHeader, prodAPICredentialsForOwner } from "@app/lib/auth";
import { sanitizeJSONOutput } from "@app/lib/utils";
import logger from "@app/logger/logger";
import { getHeaderFromRole } from "@app/types/groups";
import { Err, Ok } from "@app/types/shared/result";
import { getHeaderFromUserEmail } from "@app/types/user";
import { RubyAPI, INTERNAL_MIME_TYPES } from "@ruby-ai/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TextContent } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates the run_ruby_app MCP server.
 *
 * This server is special because tools are dynamically created based on the Ruby app
 * configuration. The server handles three different contexts:
 *
 * 1. listToolsContext: Used to list available tools for an agent. Creates a tool
 *    based on the configured Ruby app's input schema.
 *
 * 2. runContext: Used when actually running the Ruby app. Creates a tool that
 *    executes the app with the provided parameters.
 *
 * 3. Default context: Used during configuration to select which Ruby app to use.
 *    Creates a configuration tool using the RUBY_APP input schema.
 */
export default async function createServer(
  auth: Authenticator,
  toolContext?: ToolContext
): Promise<McpServer> {
  const server = makeInternalMCPServer("run_ruby_app");
  const owner = auth.getNonNullableWorkspace();

  if (toolContext?.listToolsContext) {
    // Context: Listing tools for an agent
    const { agentActionConfiguration } = toolContext.listToolsContext;
    if (
      !isServerSideMCPServerConfigurationWithName(
        agentActionConfiguration,
        "run_ruby_app"
      )
    ) {
      throw new Error("Invalid Ruby app run agent configuration");
    }

    const { app, schema } = await prepareAppContext(
      auth,
      agentActionConfiguration
    );

    if (!app.description) {
      throw new Error("Missing app description");
    }

    const toolDefinition: ToolDefinition = {
      name: app.name,
      description: app.description,
      schema: convertDatasetSchemaToZodRawShape(schema),
      stake: "never_ask",
      displayLabels: {
        running: "Listing Ruby App configuration",
        done: "List Ruby App configuration",
      },
      toolCostCategory: "basic",
      freeUsage: false,
      handler: async () => {
        return new Ok([
          {
            type: "text",
            text: "Successfully list Ruby App configuration",
          },
        ]);
      },
    };

    registerTool(auth, toolContext, server, toolDefinition, {
      monitoringName: "run_ruby_app",
    });
  } else if (isAgentLoopRunContext(toolContext?.runContext)) {
    // Context: Running the Ruby app
    const runContext = toolContext.runContext;
    if (
      !isLightServerSideMCPToolConfigurationWithName(
        runContext.toolConfiguration,
        "run_ruby_app"
      )
    ) {
      throw new Error("Invalid Ruby app run tool configuration");
    }

    const { app, schema, appConfig } = await prepareAppContext(
      auth,
      runContext.toolConfiguration
    );

    if (!app.description) {
      throw new Error("Missing app description");
    }

    const toolDefinition: ToolDefinition = {
      name: app.name,
      description: app.description,
      schema: convertDatasetSchemaToZodRawShape(schema),
      stake: "never_ask",
      displayLabels: {
        running: "Running Ruby app",
        done: "Run Ruby app",
      },
      toolCostCategory: "basic",
      freeUsage: false,
      handler: async (params) => {
        const content: (
          | TextContent
          | {
              type: "resource";
              resource: ToolGeneratedFileType | ToolGeneratedFilePathType;
            }
        )[] = [];

        const preparedParams = await prepareParamsWithHistory(
          params,
          schema,
          runContext,
          auth
        );

        const user = auth.user();

        const prodCredentials = await prodAPICredentialsForOwner(owner);
        const apiConfig = config.getRubyAPIConfig();
        const api = new RubyAPI(
          apiConfig,
          {
            ...prodCredentials,
            extraHeaders: {
              ...getHeaderFromUserEmail(user?.email),
              ...getApiKeyNameHeader(auth),
              ...getHeaderFromRole(auth.role()), // Keep the user's role for api.runApp call only
            },
          },
          logger,
          apiConfig.nodeEnv === "development" ? "http://localhost:3000" : null
        );

        const runRes = await api.runAppStreamed(
          {
            workspaceId: owner.sId,
            appId: app.sId,
            appSpaceId: app.space.sId,
            appHash: "latest",
          },
          appConfig,
          [preparedParams],
          { useWorkspaceCredentials: true }
        );

        if (runRes.isErr()) {
          return new Err(
            new MCPError(`Error running Ruby app: ${runRes.error.message}`)
          );
        }

        const { eventStream } = runRes.value;
        let lastBlockOutput = null;

        for await (const event of eventStream) {
          if (event.type === "error") {
            return new Err(
              new MCPError(`Error running Ruby app: ${event.content.message}`)
            );
          }

          if (event.type === "block_execution") {
            const e = event.content.execution[0][0];
            if (e.error) {
              return new Err(
                new MCPError(`Error in block execution: ${e.error}`)
              );
            }
            lastBlockOutput = e.value;
          }
        }

        const sanitizedOutput = sanitizeJSONOutput(lastBlockOutput);

        if (containsFileOutput(sanitizedOutput) && runContext.conversation) {
          const fileContentResult = await processRubyFileOutput(
            auth,
            runContext,
            sanitizedOutput,
            runContext.conversation,
            app.name
          );
          if (fileContentResult.isErr()) {
            return new Err(new MCPError(fileContentResult.error.message));
          }
          content.push(...fileContentResult.value);
        }

        content.push({
          type: "text",
          text: JSON.stringify(sanitizedOutput, null, 2),
        });

        return new Ok(content);
      },
    };

    registerTool(auth, toolContext, server, toolDefinition, {
      monitoringName: "run_ruby_app",
    });
  } else {
    // Context: Configuration - selecting which Ruby app to use

    const toolDefinition: ToolDefinition = {
      name: "run_ruby_app",
      description: "Run a Ruby App with specified parameters.",
      schema: {
        rubyApp:
          ConfigurableToolInputSchemas[INTERNAL_MIME_TYPES.TOOL_INPUT.RUBY_APP],
      },
      stake: "never_ask",
      displayLabels: {
        running: "Running Ruby app",
        done: "Run Ruby app",
      },
      toolCostCategory: "basic",
      freeUsage: false,
      handler: async () => {
        return new Ok([
          {
            type: "text",
            text: "Successfully saved Ruby App configuration",
          },
        ]);
      },
    };

    registerTool(auth, toolContext, server, toolDefinition, {
      monitoringName: "run_ruby_app",
    });
  }

  return server;
}
