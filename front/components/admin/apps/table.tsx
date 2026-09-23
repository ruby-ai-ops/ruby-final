import { makeColumnsForApps } from "@app/components/admin/apps/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminApps } from "@app/admin-app/swr/apps";
import type { LightWorkspaceType } from "@app/types/user";

interface AppDataTableProps {
  owner: LightWorkspaceType;
  loadOnInit?: boolean;
}

export function AppDataTable({ owner, loadOnInit }: AppDataTableProps) {
  return (
    <AdminDataTableConditionalFetch
      header="Apps"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useAdminApps}
    >
      {(data) => (
        <AdminDataTable columns={makeColumnsForApps(owner)} data={data} />
      )}
    </AdminDataTableConditionalFetch>
  );
}
