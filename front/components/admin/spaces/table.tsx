import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { makeColumnsForSpaces } from "@app/components/admin/spaces/columns";
import { useAdminSpaces } from "@app/admin-app/swr/spaces";
import type { WorkspaceType } from "@app/types/user";

interface SpaceDataTableProps {
  owner: WorkspaceType;
  loadOnInit?: boolean;
}

export function SpaceDataTable({ owner, loadOnInit }: SpaceDataTableProps) {
  return (
    <AdminDataTableConditionalFetch
      header="Spaces"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useAdminSpaces}
    >
      {(data) => (
        <AdminDataTable columns={makeColumnsForSpaces(owner)} data={data} />
      )}
    </AdminDataTableConditionalFetch>
  );
}
