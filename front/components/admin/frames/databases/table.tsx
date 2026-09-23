import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import type { AdminFrameDatabase } from "@app/lib/api/admin/frames";
import { formatFileSize } from "@app/lib/utils";
import { useAdminFrameDatabases } from "@app/admin-app/swr/frames";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { LightWorkspaceType } from "@app/types/user";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<AdminFrameDatabase>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "sizeBytes",
    header: "Size",
    cell: ({ row }) => formatFileSize(row.original.sizeBytes),
  },
];

interface FrameDatabaseDataTableProps {
  frameId: string;
  owner: LightWorkspaceType;
}

export function FrameDatabaseDataTable({
  frameId,
  owner,
}: FrameDatabaseDataTableProps) {
  const useDatabasesForFrame = (props: AdminConditionalFetchProps) =>
    useAdminFrameDatabases({ ...props, frameId });

  return (
    <AdminDataTableConditionalFetch
      buttonText="List live databases (wakes the sandbox)"
      header="Databases"
      owner={owner}
      useSWRHook={useDatabasesForFrame}
    >
      {(items) => <AdminDataTable columns={columns} data={items} />}
    </AdminDataTableConditionalFetch>
  );
}
