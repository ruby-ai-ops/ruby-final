// import config from "@app/lib/api/config";
// import { getRubyProdActionRegistry } from "@app/lib/registry";
// import { AppModel } from "@app/lib/resources/storage/models/apps";
// import { WorkspaceModel } from "@app/lib/resources/storage/models/workspace";
// import { getResourceIdFromSId } from "@app/lib/resources/string_ids";
// import { makeScript } from "@app/scripts/helpers";
//
// makeScript({}, async ({ execute }, logger) => {
//   const publicVaultSqid = config.getRubyAppsSpaceId();
//   const vaultId = getResourceIdFromSId(publicVaultSqid);
//   const rubyAppsWorkspace = await WorkspaceModel.findOne({
//     where: { sId: config.getRubyAppsWorkspaceId() },
//   });
//   if (!rubyAppsWorkspace) {
//     throw new Error(
//       `Could not find workspace with sId ${config.getRubyAppsWorkspaceId()}`
//     );
//   }
//   if (!vaultId) {
//     throw new Error(`Could not find vault with SQID ${publicVaultSqid}`);
//   }
//
//   for (const [
//     appName,
//     {
//       app: { appId },
//     },
//   ] of Object.entries(getRubyProdActionRegistry())) {
//     console.log(
//       execute ? "" : "[DRY RUN] ",
//       `Updating app ${appName} (sId=${appId}) in ${rubyAppsWorkspace.name} workspace ` +
//         `(sId=${rubyAppsWorkspace.sId}) with vaultId ${vaultId}`
//     );
//     if (execute) {
//       await AppModel.update(
//         {
//           vaultId,
//         },
//         {
//           where: {
//             sId: appId,
//             workspaceId: rubyAppsWorkspace.id,
//           },
//         }
//       );
//       logger.info(
//         {
//           appName,
//           appId,
//           workspaceId: config.getRubyAppsWorkspaceId(),
//           vaultId,
//           execute,
//         },
//         "Updated app"
//       );
//     }
//   }
// });
