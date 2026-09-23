// import type { ModelId } from "@app/types";
// import { QueryTypes } from "sequelize";

// import { AgentRubyAppRunAction } from "@app/lib/models/assistant/actions/ruby_app_run";
// import { AgentMessage } from "@app/lib/models/assistant/conversation";
// import { frontSequelize } from "@app/lib/resources/storage";
// import logger from "@app/logger/logger";
// import { makeScript } from "@app/scripts/helpers";

// const backfillRubyAppRunActions = async (execute: boolean) => {
//   let actions: AgentRubyAppRunAction[] = [];
//   actions = await AgentRubyAppRunAction.findAll({
//     // @ts-expect-error agentMessageId became null during this PR. But the migration still has to run to
//     // effectively update the agentMessageId.
//     where: {
//       agentMessageId: null,
//     },
//   });
//   logger.info(
//     {
//       count: actions.length,
//     },
//     "Processing actions for backfilling agentMessageId"
//   );
//   for (const action of actions) {
//     const agentMessage = await AgentMessage.findOne({
//       where: {
//         agentRubyAppRunActionId: action.id,
//       },
//     });
//     if (agentMessage) {
//       if (execute) {
//         await action.update({
//           agentMessageId: agentMessage.id,
//         });
//         logger.info({ actionId: action.id }, "Updated agentMessageId");
//       } else {
//         logger.info({ actionId: action.id }, "*Would* update agentMessageId");
//       }
//     } else {
//       logger.warn({ actionId: action.id }, "AgentMessage not found");
//     }
//   }

//   // checking that all pairs are correct
//   const errors: { id: ModelId }[] = await frontSequelize.query(
//     `
//     SELECT
//     *
//   FROM
//     agent_messages am
//     INNER JOIN agent_ruby_app_run_actions adara ON (am."agentRubyAppRunActionId" = adara.id)
//   WHERE
//     (
//       am.id <> adara."agentMessageId"
//       OR adara."agentMessageId" IS NULL
//     );
//   `,
//     {
//       type: QueryTypes.SELECT,
//     }
//   );
//   if (errors.length > 0) {
//     logger.error(
//       { count: errors.length },
//       "AgentMessageId not updated correctly"
//     );
//   } else {
//     logger.info("No error found");
//   }
// };

// makeScript({}, async ({ execute }) => {
//   await backfillRubyAppRunActions(execute);
// });
