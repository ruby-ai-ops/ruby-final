import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AdminFrameStorageLocation } from "@app/lib/api/admin/frames";
import { Button, LinkExternal01 } from "@ruby-ai/ui";

interface FrameStorageTableProps {
  storage: AdminFrameStorageLocation[];
}

export function FrameStorageTable({ storage }: FrameStorageTableProps) {
  return (
    <div className="my-4 flex flex-col rounded-lg border p-4">
      <h2 className="text-md pb-4 font-bold">Storage</h2>
      <AdminTable>
        <AdminTableBody>
          {storage.map((location) => (
            <AdminTableRow key={location.label}>
              <AdminTableHead>{location.label}</AdminTableHead>
              <AdminTableCellWithCopy label={location.gcsUri} />
              <AdminTableCell>
                {location.consoleUrl ? (
                  <Button
                    label="Open in GCS"
                    variant="ghost"
                    size="xs"
                    icon={LinkExternal01}
                    href={location.consoleUrl}
                    target="_blank"
                  />
                ) : (
                  "—"
                )}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
