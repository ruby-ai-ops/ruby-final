// import { INTERNAL_MIME_TYPES } from "@ruby-ai/client";
// import assert from "assert";
// import type { CreationAttributes } from "sequelize";
// import { Op } from "sequelize";

// import { getWorkspaceInfos } from "@app/lib/api/workspace";
// import { Authenticator } from "@app/lib/auth";
// import { AgentRubyAppRunAction } from "@app/lib/models/assistant/actions/ruby_app_run";
// import {
//   AgentMCPAction,
//   AgentMCPActionOutputItem,
//   AgentMCPServerConfiguration,
// } from "@app/lib/models/assistant/actions/mcp";
// import { AgentConfiguration } from "@app/lib/models/assistant/agent";
// import { AgentMessage } from "@app/lib/models/assistant/conversation";
// import { FileResource } from "@app/lib/resources/file_resource";
// import { MCPServerViewResource } from "@app/lib/resources/mcp_server_view_resource";
// import { WorkspaceModel } from "@app/lib/resources/storage/models/workspace";
// import { concurrentExecutor } from "@app/lib/utils/async_utils";
// import type { Logger } from "@app/logger/logger";
// import { makeScript } from "@app/scripts/helpers";
// import type { ModelId } from "@app/types";

// const BATCH_SIZE = 200;
// const CREATION_CONCURRENCY = 50;
// const NOT_FOUND_MCP_SERVER_CONFIGURATION_ID = "unknown";

// /**
//  * Migrates ruby app run actions from non-MCP to MCP version for a specific workspace.
//  */
// async function migrateWorkspaceRubyAppRunActions({
//   workspaceModelId,
//   execute,
//   parentLogger,
// }: {
//   workspaceModelId: ModelId;
//   execute: boolean;
//   parentLogger: Logger;
// }) {
//   const workspace = await WorkspaceModel.findByPk(workspaceModelId);

//   if (!workspace) {
//     throw new Error(`Workspace ${workspaceModelId} not found`);
//   }

//   const auth = await Authenticator.internalAdminForWorkspace(workspace.sId);

//   const mcpServerViewForRubyAppRun =
//     await MCPServerViewResource.getMCPServerViewForAutoInternalTool(
//       auth,
//       "run_ruby_app"
//     );

//   assert(mcpServerViewForRubyAppRun, "Ruby App Run MCP server view must exist");

//   let hasMore = false;
//   let lastId = 0;
//   do {
//     // Step 1: Retrieve the legacy Ruby App Run actions.
//     const rubyAppRunActions = await AgentRubyAppRunAction.findAll({
//       where: {
//         workspaceId: workspaceModelId,
//         id: {
//           [Op.gt]: lastId,
//         },
//       },
//       limit: BATCH_SIZE,
//       order: [["id", "ASC"]],
//     });

//     if (rubyAppRunActions.length === 0) {
//       return;
//     }
//     parentLogger.info(`Found ${rubyAppRunActions.length} Ruby App Run actions`);

//     // Step 2: Find the corresponding AgentMessages.
//     const agentMessages = await AgentMessage.findAll({
//       where: {
//         id: {
//           [Op.in]: rubyAppRunActions.map((action) => action.agentMessageId),
//         },
//         workspaceId: workspaceModelId,
//       },
//     });

//     // Step 3: Find the corresponding AgentConfigurations.
//     const agentConfigurationIds = [
//       ...new Set(agentMessages.map((message) => message.agentConfigurationId)),
//     ];

//     const agentConfigurations = await AgentConfiguration.findAll({
//       where: {
//         sId: {
//           [Op.in]: agentConfigurationIds,
//         },
//         workspaceId: workspaceModelId,
//       },
//       include: [
//         {
//           model: AgentMCPServerConfiguration,
//           as: "mcpServerConfigurations",
//         },
//       ],
//     });
//     const agentConfigurationsMap = new Map(
//       agentConfigurations.map((config) => [
//         `${config.sId}-${config.version}`,
//         config,
//       ])
//     );

//     const agentMessagesMap = new Map(
//       agentMessages.map((message) => [message.id, message])
//     );

//     // Step 4: Create the MCP actions with their output items.
//     await concurrentExecutor(
//       rubyAppRunActions,
//       async (rubyAppRunAction) => {
//         const agentMessage = agentMessagesMap.get(
//           rubyAppRunAction.agentMessageId
//         );
//         assert(agentMessage, "Agent message must exist");

//         const agentConfiguration = agentConfigurationsMap.get(
//           `${agentMessage.agentConfigurationId}-${agentMessage.agentConfigurationVersion}`
//         );

//         await migrateSingleRubyAppRunAction({
//           auth,
//           agentConfiguration: agentConfiguration ?? null,
//           rubyAppRunAction,
//           mcpServerViewForRubyAppRun,
//           parentLogger,
//           execute,
//         });
//       },
//       {
//         concurrency: CREATION_CONCURRENCY,
//       }
//     );

//     // Step 5: Delete the legacy Ruby App Run actions.
//     if (execute) {
//       await AgentRubyAppRunAction.destroy({
//         where: {
//           id: {
//             [Op.in]: rubyAppRunActions.map((action) => action.id),
//           },
//           workspaceId: workspaceModelId,
//         },
//       });
//     }

//     hasMore = rubyAppRunActions.length === BATCH_SIZE;
//     lastId = rubyAppRunActions[rubyAppRunActions.length - 1].id;
//   } while (hasMore);
// }

// /**
//  * Migrates a single Ruby App Run action from non-MCP to MCP version.
//  */
// async function migrateSingleRubyAppRunAction({
//   auth,
//   agentConfiguration,
//   rubyAppRunAction,
//   mcpServerViewForRubyAppRun,
//   parentLogger,
//   execute,
// }: {
//   auth: Authenticator;
//   agentConfiguration: AgentConfiguration | null;
//   rubyAppRunAction: AgentRubyAppRunAction;
//   execute: boolean;
//   mcpServerViewForRubyAppRun: MCPServerViewResource;
//   parentLogger: Logger;
// }) {
//   // Find the MCP server configuration for Ruby App Run.
//   const rubyAppRunMcpServerConfiguration =
//     agentConfiguration?.mcpServerConfigurations.find(
//       (config) =>
//         config.mcpServerViewId === mcpServerViewForRubyAppRun.id &&
//         config.appId === rubyAppRunAction.appId
//     );

//   const mcpServerConfigurationId =
//     rubyAppRunMcpServerConfiguration?.sId ??
//     NOT_FOUND_MCP_SERVER_CONFIGURATION_ID;

//   if (execute) {
//     const mcpAction = await AgentMCPAction.create({
//       workspaceId: rubyAppRunAction.workspaceId,
//       createdAt: rubyAppRunAction.createdAt,
//       updatedAt: rubyAppRunAction.updatedAt,
//       mcpServerConfigurationId,
//       params: rubyAppRunAction.params,
//       functionCallId: rubyAppRunAction.functionCallId,
//       functionCallName: rubyAppRunAction.functionCallName,
//       step: rubyAppRunAction.step,
//       agentMessageId: rubyAppRunAction.agentMessageId,
//       isError: false,
//       executionState: "allowed_implicitly",
//     });

//     // Create output items based on the presence of a file.
//     const outputItems: CreationAttributes<AgentMCPActionOutputItem>[] = [];

//     // If there's a file, create a file resource output item.
//     if (rubyAppRunAction.resultsFileId) {
//       // Fetch the file to get its actual properties.
//       const file = await FileResource.fetchByModelIdWithAuth(
//         auth,
//         rubyAppRunAction.resultsFileId
//       );

//       if (file) {
//         outputItems.push({
//           workspaceId: rubyAppRunAction.workspaceId,
//           createdAt: rubyAppRunAction.createdAt,
//           updatedAt: rubyAppRunAction.updatedAt,
//           agentMCPActionId: mcpAction.id,
//           content: {
//             type: "resource" as const,
//             resource: {
//               mimeType: INTERNAL_MIME_TYPES.TOOL_OUTPUT.FILE,
//               uri: `file://${file.id}`,
//               fileId: file.sId,
//               title: file.fileName,
//               contentType: file.contentType,
//               snippet: rubyAppRunAction.resultsFileSnippet,
//               text: `Generated ${file.contentType === "text/csv" ? "CSV" : "text"} file: ${file.fileName}`,
//             },
//           },
//           fileId: rubyAppRunAction.resultsFileId,
//         });
//       } else {
//         parentLogger.warn(
//           {
//             rubyAppRunActionId: rubyAppRunAction.id,
//             resultsFileId: rubyAppRunAction.resultsFileId,
//           },
//           "File not found for Ruby App Run action"
//         );
//       }
//     }

//     // Always create a text output item with the JSON output.
//     outputItems.push({
//       workspaceId: rubyAppRunAction.workspaceId,
//       createdAt: rubyAppRunAction.createdAt,
//       updatedAt: rubyAppRunAction.updatedAt,
//       agentMCPActionId: mcpAction.id,
//       content: {
//         type: "text",
//         text: JSON.stringify(rubyAppRunAction.output, null, 2),
//       },
//       fileId: null,
//     });

//     await AgentMCPActionOutputItem.bulkCreate(outputItems);

//     parentLogger.info(
//       {
//         rubyAppRunActionId: rubyAppRunAction.id,
//         agentConfigurationId: agentConfiguration?.sId ?? "unknown",
//         appId: rubyAppRunAction.appId,
//         mcpServerConfigurationId,
//         mcpActionId: mcpAction.id,
//         outputItemsCount: outputItems.length,
//         hasFile: !!rubyAppRunAction.resultsFileId,
//       },
//       "Successfully migrated Ruby App Run action to MCP"
//     );
//   } else {
//     parentLogger.info(
//       {
//         rubyAppRunActionId: rubyAppRunAction.id,
//         mcpServerConfigurationId,
//         agentConfigurationId: agentConfiguration?.sId ?? "unknown",
//         appId: rubyAppRunAction.appId,
//       },
//       "Would migrate Ruby App Run action to MCP (dry run)"
//     );
//   }
// }

// /**
//  * Script to migrate ruby app run actions from non-MCP to MCP version.
//  *
//  */
// makeScript(
//   {
//     workspaceId: {
//       type: "string",
//       description: "Workspace ID to migrate",
//       required: false,
//     },
//   },
//   async ({ execute, workspaceId }, parentLogger) => {
//     let workspaceModelIds: ModelId[] = [];

//     if (workspaceId) {
//       const workspace = await getWorkspaceInfos(workspaceId);
//       if (!workspace) {
//         throw new Error(`Workspace ${workspaceId} not found`);
//       }
//       workspaceModelIds = [workspace.id];
//     } else {
//       const rubyAppRunActions = await AgentRubyAppRunAction.findAll({
//         attributes: ["workspaceId"],
//         group: ["workspaceId"],
//         raw: true,
//       });
//       workspaceModelIds = rubyAppRunActions.map((action) => action.workspaceId);
//     }

//     for (const workspaceModelId of workspaceModelIds) {
//       await migrateWorkspaceRubyAppRunActions({
//         execute,
//         workspaceModelId,
//         parentLogger,
//       });
//     }
//   }
// );
