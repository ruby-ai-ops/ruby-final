import { OAUTH_USE_CASE_TO_LABEL } from "@app/components/actions/mcp/MCPServerAuthConnection";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableCellWithLink,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import { getMcpServerDisplayName } from "@app/lib/actions/mcp_helper";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { AdminMCPServerViewType } from "@app/types/admin";
import type { LightWorkspaceType } from "@app/types/user";

interface ViewMCPServerViewTableProps {
  mcpServerView: AdminMCPServerViewType;
  owner: LightWorkspaceType;
}

export function ViewMCPServerViewTable({
  mcpServerView,
  owner,
}: ViewMCPServerViewTableProps) {
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
                <AdminTableCellWithCopy label={mcpServerView.id.toString()} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Custom Name</AdminTableHead>
                <AdminTableCell>{mcpServerView.customName ?? ""}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Server Name</AdminTableHead>
                <AdminTableCell>
                  {getMcpServerDisplayName(mcpServerView.server)}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Server ID</AdminTableHead>
                <AdminTableCellWithCopy label={mcpServerView.server.sId} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Custom Description</AdminTableHead>
                <AdminTableCell>{mcpServerView.description ?? ""}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Server Description</AdminTableHead>
                <AdminTableCell>
                  {mcpServerView.server.description}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Credentials Type</AdminTableHead>
                <AdminTableCell>
                  {mcpServerView.oAuthUseCase
                    ? `${OAUTH_USE_CASE_TO_LABEL[mcpServerView.oAuthUseCase]} credentials`
                    : "Not configured"}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Space</AdminTableHead>
                <AdminTableCellWithLink
                  href={`/admin/${owner.sId}/spaces/${mcpServerView.spaceId}`}
                  content={mcpServerView.space.name}
                />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Created At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(mcpServerView.createdAt)}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Updated At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(mcpServerView.updatedAt)}
                </AdminTableCell>
              </AdminTableRow>
              {mcpServerView.editedByUser && (
                <>
                  <AdminTableRow>
                    <AdminTableHead>Edited By</AdminTableHead>
                    <AdminTableCell>
                      {mcpServerView.editedByUser.fullName}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Edited At</AdminTableHead>
                    <AdminTableCell>
                      {formatTimestampToFriendlyDate(
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        mcpServerView.editedByUser.editedAt || 0
                      )}
                    </AdminTableCell>
                  </AdminTableRow>
                </>
              )}
            </AdminTableBody>
          </AdminTable>
        </div>
      </div>
    </div>
  );
}
