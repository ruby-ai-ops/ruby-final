import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import type { AdminProjectType } from "@app/lib/api/admin/projects";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { WorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export function makeColumnsForProjects(
  owner: WorkspaceType
): ColumnDef<AdminProjectType>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => (
        <LinkWrapper href={`/admin/${owner.sId}/spaces/${row.original.sId}`}>
          {row.original.sId}
        </LinkWrapper>
      ),
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
      accessorKey: "description",
      cell: ({ row }) => row.original.description ?? "-",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Description" />
      ),
    },
    {
      accessorKey: "isRestricted",
      cell: ({ row }) => (row.original.isRestricted ? "Yes" : "No"),
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Restricted" />
      ),
    },
    {
      accessorKey: "archivedAt",
      cell: ({ row }) =>
        row.original.archivedAt
          ? formatTimestampToFriendlyDate(row.original.archivedAt)
          : "-",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Archived at" />
      ),
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => formatTimestampToFriendlyDate(row.original.createdAt),
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Created at" />
      ),
    },
    {
      accessorKey: "updatedAt",
      cell: ({ row }) => formatTimestampToFriendlyDate(row.original.updatedAt),
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Updated at" />
      ),
    },
  ];
}
