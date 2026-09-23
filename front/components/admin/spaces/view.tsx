import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import { isManageableGroupKind } from "@app/types/groups";
import type { AdminSpaceType } from "@app/types/admin";

interface ViewSpaceTableProps {
  space: AdminSpaceType;
}

export function ViewSpaceViewTable({ space }: ViewSpaceTableProps) {
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
                <AdminTableHead>Space ID</AdminTableHead>
                <AdminTableCellWithCopy label={`${space.id}`} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>sId</AdminTableHead>
                <AdminTableCellWithCopy label={space.sId} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Name</AdminTableHead>
                <AdminTableCell>{space.name}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Kind</AdminTableHead>
                <AdminTableCell>{space.kind}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Space Type</AdminTableHead>
                <AdminTableCell>{space.kind}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Is Restricted</AdminTableHead>
                <AdminTableCell>
                  {space.kind === "regular"
                    ? space.isRestricted
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Groups</AdminTableHead>
                <AdminTableCell>
                  {space.groups
                    .filter((g) => isManageableGroupKind(g.kind))
                    .map((g) => g.name)
                    .join(", ") || "None"}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Created At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(space.createdAt)}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Updated At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(space.updatedAt)}
                </AdminTableCell>
              </AdminTableRow>
            </AdminTableBody>
          </AdminTable>
        </div>
      </div>
    </div>
  );
}
