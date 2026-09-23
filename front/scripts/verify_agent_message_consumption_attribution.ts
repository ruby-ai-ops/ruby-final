/**
 * Verifies action coverage for one agent message and, with --execute, invokes the exact
 * attribution materializer used by the Temporal activity before reporting coverage again.
 *
 * Read-only inspection:
 *   npx tsx scripts/verify_agent_message_consumption_attribution.ts \
 *     --workspaceId <workspace-sId> \
 *     --agentMessageId <agent-message-sId>
 *
 * Recompute and verify:
 *   npx tsx scripts/verify_agent_message_consumption_attribution.ts \
 *     --workspaceId <workspace-sId> \
 *     --agentMessageId <agent-message-sId> \
 *     --execute
 */
import { isSandboxChildActionInfo } from "@app/lib/actions/types";
import { AGENT_MESSAGE_CONSUMPTION_ATTRIBUTION_VERSION } from "@app/lib/api/assistant/agent_message_consumption_attribution/attribution_builder";
import { computeAndStoreAgentMessageConsumptionAttribution } from "@app/lib/api/assistant/agent_message_consumption_attribution/store";
import { Authenticator } from "@app/lib/auth";
import { AgentMCPActionResource } from "@app/lib/resources/agent_mcp_action_resource";
import { AgentMessageConsumptionItemResource } from "@app/lib/resources/agent_message_consumption_item_resource";
import { ConversationResource } from "@app/lib/resources/conversation_resource";
import { RunResource } from "@app/lib/resources/run_resource";
import { makeScript } from "@app/scripts/helpers";
import type { ModelId } from "@app/types/shared/model_id";

type MissingActionCoverage = {
  action: string;
  actionModelId: ModelId;
  tool: string;
  status: string;
  rubyRunId: string;
  runUsageIds: string;
  parentAction: string;
  parentItem: "completed" | "missing" | "pending" | "n/a";
};

type CoverageSnapshot = {
  attributableActions: number;
  actionItems: Array<{
    actionModelId: ModelId;
    itemModelId: ModelId;
    inputTokens: number | null;
    outputTokens: number | null;
    directCredits: number | null;
    completedAt: string;
  }>;
  currentToolItems: number;
  missingActions: MissingActionCoverage[];
};

async function getCoverageSnapshot(
  auth: Authenticator,
  { agentMessageId }: { agentMessageId: string }
): Promise<CoverageSnapshot> {
  const creditContext =
    await ConversationResource.fetchAgentMessageCreditContext(auth, {
      agentMessageId,
    });
  if (!creditContext) {
    throw new Error(`Agent message ${agentMessageId} was not found.`);
  }

  const rubyRunIds = [...new Set(creditContext.runIds ?? [])];
  const runs = await RunResource.listByRubyRunIds(auth, { rubyRunIds });
  const usages = await RunResource.listRunUsagesForRuns(auth, { runs });
  const [actions, items] = await Promise.all([
    AgentMCPActionResource.listByAgentMessageIds(auth, [
      creditContext.agentMessageModelId,
    ]),
    AgentMessageConsumptionItemResource.listByAgentMessageModelIds(auth, {
      agentMessageModelIds: [creditContext.agentMessageModelId],
      maxAttributionVersion: AGENT_MESSAGE_CONSUMPTION_ATTRIBUTION_VERSION,
    }),
  ]);

  const currentItems = items.filter(
    (item) =>
      item.attributionVersion === AGENT_MESSAGE_CONSUMPTION_ATTRIBUTION_VERSION
  );
  const toolItemByActionModelId = new Map(
    currentItems
      .filter((item) => item.itemType === "tool")
      .map((item) => [item.agentMCPActionId, item])
  );
  const actionById = new Map(actions.map((action) => [action.sId, action]));
  const rubyRunIdByRunModelId = new Map(
    runs.map((run) => [run.id, run.rubyRunId])
  );
  const runUsageIdsByRubyRunId = new Map<string, ModelId[]>();
  for (const usage of usages) {
    const rubyRunId = rubyRunIdByRunModelId.get(usage.runModelId);
    if (!rubyRunId) {
      continue;
    }
    const runUsageIds = runUsageIdsByRubyRunId.get(rubyRunId) ?? [];
    runUsageIds.push(usage.runUsageModelId);
    runUsageIdsByRubyRunId.set(rubyRunId, runUsageIds);
  }

  const attributableActions = actions.filter((action) => {
    const rubyRunId = action.stepContent.rubyRunId;
    return rubyRunId && runUsageIdsByRubyRunId.has(rubyRunId);
  });
  const missingActions = attributableActions.flatMap((action) => {
    if (toolItemByActionModelId.has(action.id)) {
      return [];
    }

    const { rubyRunId } = action.stepContent;
    if (!rubyRunId) {
      return [];
    }
    const childInfo = action.stepContext.sandboxChildActionInfo;
    const parentAction = isSandboxChildActionInfo(childInfo)
      ? actionById.get(childInfo.parentActionId)
      : undefined;
    const parentItem = parentAction
      ? toolItemByActionModelId.get(parentAction.id)
      : undefined;

    return [
      {
        action: action.sId,
        actionModelId: action.id,
        tool: action.toolConfiguration.originalName,
        status: action.status,
        rubyRunId,
        runUsageIds: (runUsageIdsByRubyRunId.get(rubyRunId) ?? []).join(","),
        parentAction: parentAction?.sId ?? "n/a",
        parentItem: parentAction
          ? parentItem?.completedAt === null
            ? "pending"
            : parentItem
              ? "completed"
              : "missing"
          : "n/a",
      } satisfies MissingActionCoverage,
    ];
  });

  return {
    attributableActions: attributableActions.length,
    actionItems: attributableActions.flatMap((action) => {
      const item = toolItemByActionModelId.get(action.id);
      return item
        ? [
            {
              actionModelId: action.id,
              itemModelId: item.id,
              inputTokens: item.inputTokensCount,
              outputTokens: item.outputTokensCount,
              directCredits:
                item.directCreditAmountMicro === null
                  ? null
                  : item.directCreditAmountMicro / 1_000_000,
              completedAt: item.completedAt?.toISOString() ?? "pending",
            },
          ]
        : [];
    }),
    currentToolItems: toolItemByActionModelId.size,
    missingActions,
  };
}

function printCoverage(label: string, snapshot: CoverageSnapshot): void {
  console.log(`\n${label}`);
  console.table([
    {
      attributableActions: snapshot.attributableActions,
      currentToolItems: snapshot.currentToolItems,
      missingActions: snapshot.missingActions.length,
    },
  ]);
  if (snapshot.missingActions.length > 0) {
    console.log("\nMissing action items");
    console.table(snapshot.missingActions);
  }
}

makeScript(
  {
    workspaceId: {
      type: "string",
      demandOption: true,
      description: "Workspace sId.",
    },
    agentMessageId: {
      type: "string",
      demandOption: true,
      description: "Agent message sId.",
    },
  },
  async ({ agentMessageId, execute, workspaceId }) => {
    const auth = await Authenticator.internalUserForWorkspace(workspaceId);
    const analyticsContext =
      await ConversationResource.fetchAgentMessageConsumptionAnalyticsContext(
        auth,
        { agentMessageId }
      );
    if (!analyticsContext) {
      throw new Error(
        `Consumption context for agent message ${agentMessageId} was not found.`
      );
    }

    const before = await getCoverageSnapshot(auth, { agentMessageId });
    printCoverage("Before attribution", before);

    if (!execute) {
      return;
    }

    const consumptionUpdate =
      await computeAndStoreAgentMessageConsumptionAttribution(auth, {
        agentMessageId,
        conversationId: analyticsContext.conversation.conversationId,
      });
    console.log("\nAttribution result", consumptionUpdate ?? "incomplete");

    const after = await getCoverageSnapshot(auth, { agentMessageId });
    printCoverage("After attribution", after);

    const remainingMissingActionIds = new Set(
      after.missingActions.map((action) => action.actionModelId)
    );
    const afterItemByActionModelId = new Map(
      after.actionItems.map((item) => [item.actionModelId, item])
    );
    const createdActionItems = before.missingActions.flatMap((action) => {
      if (remainingMissingActionIds.has(action.actionModelId)) {
        return [];
      }
      const item = afterItemByActionModelId.get(action.actionModelId);
      return item
        ? [{ action: action.action, tool: action.tool, ...item }]
        : [];
    });
    if (createdActionItems.length > 0) {
      console.log("\nCreated action items");
      console.table(createdActionItems);
    }

    if (after.missingActions.length > 0) {
      throw new Error(
        `${after.missingActions.length} attributable action(s) still lack current-version tool items.`
      );
    }
  }
);
