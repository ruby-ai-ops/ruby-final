// import { groupBy, keyBy, mapValues, uniq } from "lodash";
// import { Op } from "sequelize";

// import { AgentRubyAppRunConfiguration } from "@app/lib/models/assistant/actions/ruby_app_run";
// import { AgentConfiguration } from "@app/lib/models/assistant/agent";
// import { AppModel } from "@app/lib/resources/storage/models/apps";
// import { GroupSpaceModel } from "@app/lib/resources/storage/models/group_spaces";
// import { SpaceModel } from "@app/lib/resources/storage/models/spaces";
// import { makeScript } from "@app/scripts/helpers";

// makeScript({}, async ({ execute }, logger) => {
//   const allRubyAppRunConfigs = await AgentRubyAppRunConfiguration.findAll();
//   const allRubyAppModels = await AppModel.findAll({
//     where: {
//       sId: allRubyAppRunConfigs.map((config) => config.appId),
//     },
//   });
//   const allRubyAppVaults = await SpaceModel.findAll({
//     where: {
//       id: allRubyAppModels.map((app) => app.vaultId),
//     },
//   });
//   const groupSpaces = await GroupSpaceModel.findAll({
//     where: {
//       vaultId: allRubyAppVaults.map((vault) => vault.id),
//     },
//   });
//   const groupIdsByVaultId = mapValues(
//     groupBy(groupSpaces, "vaultId"),
//     (groupSpaces) => groupSpaces.map((groupVault) => groupVault.groupId)
//   );
//   const rubyAppIdsByAgentConfigId = mapValues(
//     groupBy(allRubyAppRunConfigs, "agentConfigurationId"),
//     (configs) => configs.map((config) => config.appId)
//   );
//   const appByRubyAppId = keyBy(allRubyAppModels, "sId");

//   const affectedAgents = await AgentConfiguration.findAll({
//     where: {
//       id: uniq(
//         allRubyAppRunConfigs.map((config) => config.agentConfigurationId)
//       ),
//       status: {
//         [Op.not]: "draft",
//       },
//     },
//   });

//   for (const agent of affectedAgents) {
//     const rubyAppIds = rubyAppIdsByAgentConfigId[agent.id];
//     const vaultIds = uniq(
//       rubyAppIds.map((rubyAppId) => appByRubyAppId[rubyAppId].vaultId)
//     );
//     const groupIds = uniq([
//       ...vaultIds.map((vaultId) => groupIdsByVaultId[vaultId]).flat(),
//       // @ts-expect-error `groupIds` was removed.
//       ...agent.groupIds,
//     ]);
//     const newGroupIds = groupIds.filter(
//       // @ts-expect-error `groupIds` was removed.
//       (groupId) => !agent.groupIds.includes(groupId)
//     );

//     if (newGroupIds.length) {
//       console.log(
//         !execute ? "[DRY RUN] " : "",
//         `Backfilling agent ${agent.sId} with new group ids: ${newGroupIds.join(", ")}`
//       );

//       if (execute) {
//         logger.info(
//           // @ts-expect-error `groupIds` was removed
//           { agentId: agent.sId, newGroupIds, prevGroupIds: agent.groupIds },
//           `Backfilling agent group IDs`
//         );
//         await agent.update({
//           // @ts-expect-error `groupIds` was removed
//           groupIds,
//         });
//       }
//     }
//   }
// });
