import { makeColumnsForDataSources } from "@app/components/admin/data_sources/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminDataSources } from "@app/admin-app/swr/data_sources";
import type { DataSourceType } from "@app/types/data_source";
import type { WorkspaceType } from "@app/types/user";

function prepareDataSourceForDisplay(dataSources: DataSourceType[]) {
  return dataSources.map((ds) => {
    return {
      ...ds,
      editedAt: ds.editedByUser?.editedAt ?? undefined,
      editedBy: ds.editedByUser?.fullName ?? undefined,
    };
  });
}

interface DataSourceDataTableProps {
  owner: WorkspaceType;
  loadOnInit?: boolean;
}

export function DataSourceDataTable({
  owner,
  loadOnInit,
}: DataSourceDataTableProps) {
  return (
    <AdminDataTableConditionalFetch
      header="Data Sources"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useAdminDataSources}
    >
      {(data) => (
        <AdminDataTable
          columns={makeColumnsForDataSources(owner)}
          data={prepareDataSourceForDisplay(data)}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
