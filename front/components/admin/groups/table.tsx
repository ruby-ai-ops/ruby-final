import { makeColumnsForGroups } from "@app/components/admin/groups/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminGroups } from "@app/admin-app/swr/groups";
import type { WorkspaceType } from "@app/types/user";

interface GroupDataTableProps {
  owner: WorkspaceType;
  loadOnInit?: boolean;
}

export function GroupDataTable({ owner, loadOnInit }: GroupDataTableProps) {
  return (
    <AdminDataTableConditionalFetch
      header="Groups"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useAdminGroups}
    >
      {(data) => (
        <AdminDataTable columns={makeColumnsForGroups(owner)} data={data} />
      )}
    </AdminDataTableConditionalFetch>
  );
}
