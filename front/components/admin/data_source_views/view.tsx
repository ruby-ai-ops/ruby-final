import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableCellWithLink,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import { getDisplayNameForDataSource } from "@app/lib/data_sources";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { AdminDataSourceViewType } from "@app/types/admin";
import type { LightWorkspaceType } from "@app/types/user";

interface ViewDataSourceViewTableProps {
  dataSourceView: AdminDataSourceViewType;
  owner: LightWorkspaceType;
}

export function ViewDataSourceViewTable({
  dataSourceView,
  owner,
}: ViewDataSourceViewTableProps) {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-between gap-3">
        <div className="my-4 flex flex-grow flex-col rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-md flex-grow pb-4 font-bold">Overview</h2>
          </div>
          <AdminTable>
            <AdminTableBody>
              <AdminTableRow>
                <AdminTableHead>Id</AdminTableHead>
                <AdminTableCellWithCopy label={dataSourceView.id.toString()} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>sId</AdminTableHead>
                <AdminTableCellWithCopy label={dataSourceView.sId} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Kind</AdminTableHead>
                <AdminTableCell>{dataSourceView.kind}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Space</AdminTableHead>
                <AdminTableCellWithLink
                  href={`/admin/${owner.sId}/spaces/${dataSourceView.space.sId}`}
                  content={`${dataSourceView.space.name} (${dataSourceView.space.sId})`}
                />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Space Type</AdminTableHead>
                <AdminTableCell>{dataSourceView.space.kind}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Data source</AdminTableHead>
                <AdminTableCellWithLink
                  href={`/admin/${owner.sId}/data_sources/${dataSourceView.dataSource.sId}`}
                  content={`${getDisplayNameForDataSource(dataSourceView.dataSource)} (${dataSourceView.dataSource.sId})`}
                />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Created At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(dataSourceView.createdAt)}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Updated At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(dataSourceView.updatedAt)}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Edited by</AdminTableHead>
                <AdminTableCell>
                  {dataSourceView.editedByUser?.fullName ?? "N/A"}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Edited at</AdminTableHead>
                <AdminTableCell>
                  {dataSourceView.editedByUser?.editedAt
                    ? formatTimestampToFriendlyDate(
                        dataSourceView.editedByUser.editedAt
                      )
                    : "N/A"}
                </AdminTableCell>
              </AdminTableRow>
            </AdminTableBody>
          </AdminTable>
        </div>
      </div>
    </div>
  );
}
