import { ConfigurableToolInputSchemas } from "@app/lib/actions/mcp_internal_actions/input_schemas";
import type { ServerMetadata } from "@app/lib/actions/mcp_internal_actions/tool_definition";
import { INTERNAL_MIME_TYPES } from "@ruby-ai/client";

/**
 * Tools metadata for run_ruby_app server.
 *
 * This server is special because the actual tool is dynamically created based on
 * the Ruby app configuration. The "run_ruby_app" tool here is used for the
 * configuration flow where users select which Ruby app to run.
 */
const RUN_RUBY_APP_TOOLS_METADATA = [
  {
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
  },
] as const;

export const RUN_RUBY_APP_SERVER = {
  serverInfo: {
    name: "run_ruby_app" as const,
    version: "1.0.0",
    description: "Run Ruby Apps with specified parameters.",
    icon: "CommandLineIcon" as const,
    authorization: null,
    documentationUrl: null,
  },
  tools: RUN_RUBY_APP_TOOLS_METADATA,
} as const satisfies ServerMetadata;
