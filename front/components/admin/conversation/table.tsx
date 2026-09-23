import { makeColumnsForConversations } from "@app/components/admin/conversation/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import type { AdminConversationsFetchProps } from "@app/admin-app/swr/conversation";
import { useAdminConversations } from "@app/admin-app/swr/conversation";
import type { TriggerType } from "@app/types/assistant/triggers";
import type { LightWorkspaceType } from "@app/types/user";

interface ConversationDataTableProps {
  owner: LightWorkspaceType;
  trigger: TriggerType;
  loadOnInit?: boolean;
}

export function ConversationDataTable({
  owner,
  trigger,
  loadOnInit,
}: ConversationDataTableProps) {
  const useConversationsWithTrigger = (props: AdminConversationsFetchProps) =>
    useAdminConversations({ ...props, triggerId: trigger.sId });

  return (
    <AdminDataTableConditionalFetch
      header="Conversations"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useConversationsWithTrigger}
    >
      {(conversations) => (
        <AdminDataTable
          columns={makeColumnsForConversations(owner)}
          data={conversations}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
