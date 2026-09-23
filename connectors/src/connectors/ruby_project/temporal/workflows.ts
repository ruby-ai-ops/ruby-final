import type * as activities from "@connectors/connectors/ruby_project/temporal/activities";
import { rubyProjectSyncSignal } from "@connectors/connectors/ruby_project/temporal/signals";
import type { ModelId } from "@connectors/types";
import {
  allHandlersFinished,
  condition,
  continueAsNew,
  proxyActivities,
  setHandler,
  sleep,
} from "@temporalio/workflow";

const {
  rubyProjectConversationsFullSyncActivity,
  rubyProjectConversationsIncrementalSyncActivity,
  rubyProjectMountFilesFullSyncActivity,
  rubyProjectMountFilesIncrementalSyncActivity,
  rubyProjectSyncMetadataActivity,
  rubyProjectMarkSyncedActivity,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "60 minutes",
});

/** Debounce window before running an on-demand incremental sync. */
const INCREMENTAL_SYNC_DEBOUNCE_MS = 30_000;
/** Cap debounce loops before continueAsNew to bound workflow history size. */
const MAX_DEBOUNCE_COUNT = 100;

/**
 * Generate workflow IDs for ruby_project workflows
 */
export function rubyProjectFullSyncWorkflowId(connectorId: ModelId): string {
  return `ruby-project-full-sync-${connectorId}`;
}

export function rubyProjectIncrementalSyncWorkflowId(
  connectorId: ModelId
): string {
  return `ruby-project-incremental-sync-${connectorId}`;
}

export function rubyProjectIncrementalSyncNowWorkflowId(
  connectorId: ModelId
): string {
  return `ruby-project-incremental-sync-now-${connectorId}`;
}

type RubyProjectSyncActivity = (input: {
  connectorId: ModelId;
}) => Promise<{ skippedDueToWorkspaceApiAccess: boolean }>;

async function rubyProjectSyncActivitiesCompleted(
  connectorId: ModelId,
  activities: ReadonlyArray<RubyProjectSyncActivity>
): Promise<boolean> {
  for (const activity of activities) {
    if ((await activity({ connectorId })).skippedDueToWorkspaceApiAccess) {
      return false;
    }
  }
  return true;
}

async function runRubyProjectIncrementalSync(
  connectorId: ModelId
): Promise<void> {
  if (
    await rubyProjectSyncActivitiesCompleted(connectorId, [
      rubyProjectConversationsIncrementalSyncActivity,
      rubyProjectMountFilesIncrementalSyncActivity,
      rubyProjectSyncMetadataActivity,
    ])
  ) {
    await rubyProjectMarkSyncedActivity({ connectorId });
  }
}

/**
 * Full sync workflow for ruby_project connector.
 * Syncs all conversations for a project from scratch.
 */
export async function rubyProjectFullSyncWorkflow({
  connectorId,
}: {
  connectorId: ModelId;
}): Promise<void> {
  if (
    await rubyProjectSyncActivitiesCompleted(connectorId, [
      rubyProjectConversationsFullSyncActivity,
      rubyProjectMountFilesFullSyncActivity,
      rubyProjectSyncMetadataActivity,
    ])
  ) {
    await rubyProjectMarkSyncedActivity({ connectorId });
  }
}

/**
 * Cron-driven incremental sync for ruby_project (hourly catch-up / GC).
 */
export async function rubyProjectIncrementalSyncWorkflow({
  connectorId,
}: {
  connectorId: ModelId;
}): Promise<void> {
  await runRubyProjectIncrementalSync(connectorId);
}

/**
 * On-demand incremental sync, coalesced via Temporal signals.
 * Front notifies on file/conversation changes; bursts debounce into one sync.
 */
export async function rubyProjectIncrementalSyncNowWorkflow({
  connectorId,
}: {
  connectorId: ModelId;
}): Promise<void> {
  let signaled = false;
  let debounceCount = 0;

  setHandler(rubyProjectSyncSignal, () => {
    signaled = true;
  });

  while (signaled && debounceCount < MAX_DEBOUNCE_COUNT) {
    signaled = false;
    await sleep(INCREMENTAL_SYNC_DEBOUNCE_MS);
    if (signaled) {
      debounceCount++;
      continue;
    }

    await runRubyProjectIncrementalSync(connectorId);
  }

  if (debounceCount >= MAX_DEBOUNCE_COUNT) {
    setHandler(rubyProjectSyncSignal, undefined);
    await condition(allHandlersFinished);
    await continueAsNew({ connectorId });
  }

  // /!\ Any signal received outside of the while loop will be lost, so don't make any async
  // call here, which will allow the signal handler to be executed by the nodejs event loop. /!\
}
