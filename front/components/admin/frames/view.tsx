import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AdminFrameDetails } from "@app/lib/api/admin/frames";
import { makeSandboxConnectCommand } from "@app/lib/admin/sandbox";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { LightWorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";

interface ViewFrameTableProps {
  details: AdminFrameDetails;
  owner: LightWorkspaceType;
}

export function ViewFrameTable({ details, owner }: ViewFrameTableProps) {
  const { frame, sandbox } = details;

  return (
    <div className="my-4 flex flex-col rounded-lg border p-4">
      <h2 className="text-md pb-4 font-bold">Overview</h2>
      <AdminTable>
        <AdminTableBody>
          <AdminTableRow>
            <AdminTableHead>sId</AdminTableHead>
            <AdminTableCellWithCopy label={frame.sId} />
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableHead>Name</AdminTableHead>
            <AdminTableCell>{frame.name ?? "—"}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableHead>Description</AdminTableHead>
            <AdminTableCell>{frame.description ?? "—"}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableHead>File status</AdminTableHead>
            <AdminTableCell>{frame.status}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableHead>Origin</AdminTableHead>
            <AdminTableCell>
              {frame.conversationId ? (
                <LinkWrapper
                  href={`/admin/${owner.sId}/conversation/${frame.conversationId}`}
                  className="text-highlight-500"
                >
                  {frame.conversationId}
                </LinkWrapper>
              ) : frame.spaceId ? (
                <LinkWrapper
                  href={`/admin/${owner.sId}/spaces/${frame.spaceId}`}
                  className="text-highlight-500"
                >
                  {frame.spaceId}
                </LinkWrapper>
              ) : (
                "—"
              )}
            </AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableHead>Author</AdminTableHead>
            <AdminTableCell>{frame.author ?? "—"}</AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableHead>Created</AdminTableHead>
            <AdminTableCell>
              {formatTimestampToFriendlyDate(
                new Date(frame.createdAt).getTime()
              )}
            </AdminTableCell>
          </AdminTableRow>
          <AdminTableRow>
            <AdminTableHead>Updated</AdminTableHead>
            <AdminTableCell>
              {formatTimestampToFriendlyDate(
                new Date(frame.updatedAt).getTime()
              )}
            </AdminTableCell>
          </AdminTableRow>
          {sandbox ? (
            <>
              <AdminTableRow>
                <AdminTableHead>Sandbox status</AdminTableHead>
                <AdminTableCell>{sandbox.status}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Sandbox connect</AdminTableHead>
                <AdminTableCellWithCopy
                  label={makeSandboxConnectCommand(sandbox)}
                />
              </AdminTableRow>
            </>
          ) : (
            <AdminTableRow>
              <AdminTableHead>Sandbox</AdminTableHead>
              <AdminTableCell>None</AdminTableCell>
            </AdminTableRow>
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
