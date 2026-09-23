import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableCellWithLink,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AppType } from "@app/types/app";
import type { LightWorkspaceType } from "@app/types/user";

export function ViewAppTable({
  app,
  owner,
}: {
  app: AppType;
  owner: LightWorkspaceType;
}) {
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
                <AdminTableCellWithCopy label={app.id.toString()} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>sId</AdminTableHead>
                <AdminTableCellWithCopy label={app.sId} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Space</AdminTableHead>
                <AdminTableCellWithLink
                  href={`/admin/${owner.sId}/spaces/${app.space.sId}`}
                  content={`${app.space.name} (${app.space.sId})`}
                />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Name</AdminTableHead>
                <AdminTableCell>{app.name}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Description</AdminTableHead>
                <AdminTableCell>{app.description}</AdminTableCell>
              </AdminTableRow>
            </AdminTableBody>
          </AdminTable>
        </div>
      </div>
    </div>
  );
}
