import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import type { AdminMCPServerViewListItemType } from "@app/lib/api/admin/mcp_server_views";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

interface MCPServerView extends AdminMCPServerViewListItemType {
  editedAt?: number;
  editedBy?: string;
  mcpServerViewLink: string;
  spaceLink: string;
}

export function makeColumnsForMCPServerViews({
  hideSpaceColumn = false,
}: {
  hideSpaceColumn?: boolean;
} = {}): ColumnDef<MCPServerView>[] {
  const columns: ColumnDef<MCPServerView>[] = [
    {
      accessorKey: "server.sId",
      cell: ({ row }) => {
        const { server } = row.original;

        return `${server.sId}`;
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="sId" />
      ),
    },
    {
      accessorKey: "server.name",
      cell: ({ row }) => {
        const { name, server } = row.original;
        return name ? `${server.name} (${name})` : server.name;
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Name" />
      ),
    },
  ];

  if (!hideSpaceColumn) {
    columns.push({
      accessorKey: "space.name",
      cell: ({ row }) => {
        const { spaceLink, space } = row.original;
        return (
          <span onClick={(e) => e.stopPropagation()}>
            <LinkWrapper href={spaceLink}>{space.name}</LinkWrapper>
          </span>
        );
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Space" />
      ),
    });
  }

  columns.push(
    {
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return formatTimestampToFriendlyDate(row.original.createdAt);
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Created at" />
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
      cell: ({ row }) => {
        return row.original.editedAt
          ? formatTimestampToFriendlyDate(row.original.editedAt)
          : "";
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Last edited at" />
      ),
    }
  );

  return columns;
}
