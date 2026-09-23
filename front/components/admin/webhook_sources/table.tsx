import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { makeColumnsForWebhookSources } from "@app/components/admin/webhook_sources/columns";
import { useAdminWebhookSources } from "@app/admin-app/swr/webhook_sources";
import type { LightWorkspaceType } from "@app/types/user";

interface WebhookSourceDataTableProps {
  owner: LightWorkspaceType;
  loadOnInit?: boolean;
}

export function WebhookSourceDataTable({
  owner,
  loadOnInit,
}: WebhookSourceDataTableProps) {
  return (
    <AdminDataTableConditionalFetch
      header="Webhook Sources"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useAdminWebhookSources}
    >
      {(data) => (
        <AdminDataTable
          columns={makeColumnsForWebhookSources(owner)}
          data={data}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
