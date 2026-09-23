import { ConversationDataTable } from "@app/components/admin/conversation/table";
import { PluginList } from "@app/components/admin/plugins/PluginList";
import { ExecutionStats } from "@app/components/admin/triggers/ExecutionStats";
import { AdminRecentWebhookRequests } from "@app/components/admin/triggers/RecentWebhookRequests";
import { ViewTriggerTable } from "@app/components/admin/triggers/view";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useRequiredPathParam } from "@app/lib/platform";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { useAdminTriggerDetails } from "@app/admin-app/swr/trigger_details";
import { LinkWrapper, Spinner } from "@ruby-ai/ui";

export function TriggerDetailsPage() {
  const owner = useWorkspace();

  const triggerId = useRequiredPathParam("triggerId");
  const {
    data: triggerDetails,
    isLoading,
    isError,
  } = useAdminTriggerDetails({
    owner,
    triggerId,
    disabled: false,
  });

  useAdminPageMetadata({
    name: triggerDetails?.trigger.name,
    subtitle: owner.name,
    sId: triggerId,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !triggerDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Error loading trigger details.</p>
      </div>
    );
  }

  const { trigger, agent, editorUser, webhookSource } = triggerDetails;

  return (
    <>
      <h3 className="text-xl font-bold">
        Trigger {trigger.name} on agent {agent.name}{" "}
        <LinkWrapper href={`/admin/${owner.sId}`} className="text-highlight-500">
          {owner.name}
        </LinkWrapper>
      </h3>
      <div className="flex flex-row gap-x-6">
        <ViewTriggerTable
          trigger={trigger}
          agent={agent}
          owner={owner}
          editorUser={editorUser}
          webhookSource={webhookSource}
        />
        <div className="mt-4 flex grow flex-col gap-4">
          <PluginList
            pluginResourceTarget={{
              resourceType: "triggers",
              resourceId: trigger.sId,
              workspace: owner,
            }}
          />
          {trigger.kind === "webhook" && (
            <>
              <ExecutionStats owner={owner} triggerId={trigger.sId} />
              <AdminRecentWebhookRequests
                owner={owner}
                triggerId={trigger.sId}
              />
            </>
          )}
          <ConversationDataTable owner={owner} trigger={trigger} />
        </div>
      </div>
    </>
  );
}
