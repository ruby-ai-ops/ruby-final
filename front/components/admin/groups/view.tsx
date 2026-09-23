import { getAdminGroupKindChipColor } from "@app/components/admin/groups/columns";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { GroupType } from "@app/types/groups";
import { Chip } from "@ruby-ai/ui";

export function ViewGroupTable({ group }: { group: GroupType }) {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-between gap-3">
        <div className="my-4 flex flex-grow flex-col rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-md flex-grow pb-4 font-bold">Group Details:</h2>
          </div>
          <AdminTable>
            <AdminTableBody>
              <AdminTableRow>
                <AdminTableCell>Id</AdminTableCell>
                <AdminTableCellWithCopy label={group.id.toString()} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableCell>sId</AdminTableCell>
                <AdminTableCellWithCopy label={group.sId} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableCell>Name</AdminTableCell>
                <AdminTableCell>{group.name}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableCell>Kind</AdminTableCell>
                <AdminTableCell>
                  <Chip color={getAdminGroupKindChipColor(group.kind)}>
                    {group.kind}
                  </Chip>
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableCell>Member Count</AdminTableCell>
                <AdminTableCell>{group.memberCount}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableCell>Workspace Id</AdminTableCell>
                <AdminTableCellWithCopy label={group.workspaceId.toString()} />
              </AdminTableRow>
            </AdminTableBody>
          </AdminTable>
        </div>
      </div>
    </div>
  );
}
