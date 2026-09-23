import { makeColumnsForDataSourceViews } from "@app/components/admin/data_source_views/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import type { DataSourceViewWithUsage } from "@app/lib/api/admin/data_source_views";
import { getDisplayNameForDataSource } from "@app/lib/data_sources";
import { useAdminDataSourceViews } from "@app/admin-app/swr/data_source_views";
import type { LightWorkspaceType } from "@app/types/user";

interface DataSourceViewsDataTableProps {
  owner: LightWorkspaceType;
  spaceId?: string;
  loadOnInit?: boolean;
}

function prepareDataSourceViewsForDisplay(
  owner: LightWorkspaceType,
  dataSourceViews: DataSourceViewWithUsage[],
  spaceId?: string
) {
  return dataSourceViews
    .map((dsv) => {
      return {
        ...dsv,
        dataSourceLink: `/admin/${owner.sId}/data_sources/${dsv.dataSource.sId}`,
        dataSourceName: getDisplayNameForDataSource(dsv.dataSource),
        dataSourceViewLink: `/admin/${owner.sId}/spaces/${dsv.spaceId}/data_source_views/${dsv.sId}`,
        editedAt: dsv.editedByUser?.editedAt ?? undefined,
        editedBy: dsv.editedByUser?.fullName ?? undefined,
        name: dsv.sId,
        usage: dsv.usage,
      };
    })
    .filter((dsv) => !spaceId || dsv.spaceId === spaceId);
}

export function DataSourceViewsDataTable({
  owner,
  spaceId,
  loadOnInit,
}: DataSourceViewsDataTableProps) {
  return (
    <AdminDataTableConditionalFetch
      header="Data Source Views"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useAdminDataSourceViews}
    >
      {(data) => (
        <AdminDataTable
          columns={makeColumnsForDataSourceViews()}
          data={prepareDataSourceViewsForDisplay(owner, data, spaceId)}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
