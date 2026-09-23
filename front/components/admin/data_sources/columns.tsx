import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { WorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

interface DataSources {
  connectorProvider: string | null;
  id: number;
  sId: string;
  name: string;
  editedBy: string | undefined;
  editedAt: number | undefined;
}

export function makeColumnsForDataSources(
  owner: WorkspaceType
): ColumnDef<DataSources>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => {
        const sId: string = row.getValue("sId");

        return (
          <LinkWrapper href={`/admin/${owner.sId}/data_sources/${sId}`}>
            {sId}
          </LinkWrapper>
        );
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="sId" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Name" />
      ),
    },
    {
      accessorKey: "connectorProvider",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Provider" />
      ),
    },
    {
      accessorKey: "editedBy",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Last edited by" />
      ),
    },
    {
      accessorKey: "editedAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Last edited at" />
      ),
      cell: ({ row }) => {
        const editedAt: number | undefined = row.getValue("editedAt");

        if (!editedAt) {
          return "";
        }

        return formatTimestampToFriendlyDate(editedAt);
      },
    },
  ];
}
