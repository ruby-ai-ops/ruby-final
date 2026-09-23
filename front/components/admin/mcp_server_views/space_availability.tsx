import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithLink,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AdminMCPServerViewSpaceAvailabilityType } from "@app/lib/api/admin/mcp_server_views";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { LightWorkspaceType } from "@app/types/user";

interface MCPServerSpaceAvailabilityTableProps {
  owner: LightWorkspaceType;
  spaceViews: AdminMCPServerViewSpaceAvailabilityType[];
}

export function MCPServerSpaceAvailabilityTable({
  owner,
  spaceViews,
}: MCPServerSpaceAvailabilityTableProps) {
  return (
    <div className="my-4 flex flex-grow flex-col rounded-lg border p-4">
      <h2 className="text-md pb-4 font-bold">Available in spaces</h2>
      {spaceViews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          This server is only installed in the system space and not shared to
          any other space yet.
        </p>
      ) : (
        <AdminTable>
          <AdminTableHeader>
            <AdminTableRow>
              <AdminTableHead>Space</AdminTableHead>
              <AdminTableHead>View ID</AdminTableHead>
              <AdminTableHead>Kind</AdminTableHead>
              <AdminTableHead>Added by</AdminTableHead>
              <AdminTableHead>Added at</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {spaceViews.map((view) => (
              <AdminTableRow key={view.sId}>
                <AdminTableCellWithLink
                  href={`/admin/${owner.sId}/spaces/${view.spaceId}/mcp_server_views/${view.sId}`}
                  content={view.space.name}
                />
                <AdminTableCell>{view.sId}</AdminTableCell>
                <AdminTableCell>{view.space.kind}</AdminTableCell>
                <AdminTableCell>{view.editedBy ?? ""}</AdminTableCell>
                <AdminTableCell>
                  {view.editedAt
                    ? formatTimestampToFriendlyDate(view.editedAt)
                    : formatTimestampToFriendlyDate(view.createdAt)}
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}
    </div>
  );
}
