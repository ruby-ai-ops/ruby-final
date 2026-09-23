import { AdminJsonBlock } from "@app/components/admin/sandbox_functions/json_block";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AdminFrameFunctionDetails } from "@app/lib/api/admin/frames";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";

interface ViewFrameFunctionTableProps {
  frameFunction: AdminFrameFunctionDetails;
}

export function ViewFrameFunctionTable({
  frameFunction,
}: ViewFrameFunctionTableProps) {
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
                <AdminTableHead>Slug</AdminTableHead>
                <AdminTableCellWithCopy label={frameFunction.slug} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>sId</AdminTableHead>
                <AdminTableCellWithCopy label={frameFunction.sId} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Description</AdminTableHead>
                <AdminTableCell>{frameFunction.description}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>User identity</AdminTableHead>
                <AdminTableCell>
                  {frameFunction.userIdentity ?? "optional"}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Execution mode</AdminTableHead>
                <AdminTableCell>{frameFunction.executionMode}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Default stake</AdminTableHead>
                <AdminTableCell>{frameFunction.defaultStake}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Publication</AdminTableHead>
                <AdminTableCell>
                  {frameFunction.publicationId ?? "unpublished"}
                  {frameFunction.publicationId &&
                    !frameFunction.isActivePublication &&
                    " (superseded)"}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Bundle sha256</AdminTableHead>
                {frameFunction.bundleSha256 ? (
                  <AdminTableCellWithCopy label={frameFunction.bundleSha256} />
                ) : (
                  <AdminTableCell>—</AdminTableCell>
                )}
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Created At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(
                    new Date(frameFunction.createdAt).getTime()
                  )}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Updated At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(
                    new Date(frameFunction.updatedAt).getTime()
                  )}
                </AdminTableCell>
              </AdminTableRow>
            </AdminTableBody>
          </AdminTable>
          <div className="flex flex-col gap-2 pt-4">
            <AdminJsonBlock
              label="Input schema"
              value={frameFunction.inputSchema}
            />
            <AdminJsonBlock
              label="Output schema"
              value={frameFunction.outputSchema}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
