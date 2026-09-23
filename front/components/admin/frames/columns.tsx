import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import type { AdminFrameListItem } from "@app/lib/api/admin/frames";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { LightWorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export function makeColumnsForFrames({
  owner,
}: {
  owner: LightWorkspaceType;
}): ColumnDef<AdminFrameListItem>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => row.name ?? "",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Name" />
      ),
      cell: ({ row }) => (
        <LinkWrapper
          href={`/admin/${owner.sId}/files/${row.original.sId}`}
          className="text-highlight-500"
        >
          {row.original.name ?? row.original.fileName}
        </LinkWrapper>
      ),
    },
    {
      accessorKey: "sId",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="sId" />
      ),
      cell: ({ row }) => row.original.sId,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Status" />
      ),
      cell: ({ row }) => row.original.status,
    },
    {
      id: "sandboxStatus",
      accessorFn: (row) => row.sandboxStatus ?? "",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Sandbox" />
      ),
      cell: ({ row }) => row.original.sandboxStatus ?? "—",
    },
    {
      accessorKey: "functionCount",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Functions" />
      ),
      cell: ({ row }) => row.original.functionCount,
    },
    {
      id: "activePublicationId",
      accessorFn: (row) => row.activePublicationId ?? "",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Publication" />
      ),
      cell: ({ row }) => row.original.activePublicationId ?? "unpublished",
    },
    {
      id: "origin",
      accessorFn: (row) => row.conversationId ?? row.spaceId ?? "",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Origin" />
      ),
      cell: ({ row }) => {
        const { conversationId, spaceId } = row.original;
        if (conversationId) {
          return (
            <LinkWrapper
              href={`/admin/${owner.sId}/conversation/${conversationId}`}
              className="text-highlight-500"
            >
              conversation
            </LinkWrapper>
          );
        }
        if (spaceId) {
          return (
            <LinkWrapper
              href={`/admin/${owner.sId}/spaces/${spaceId}`}
              className="text-highlight-500"
            >
              pod
            </LinkWrapper>
          );
        }
        return "—";
      },
    },
    {
      id: "author",
      accessorFn: (row) => row.author ?? "",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Author" />
      ),
      cell: ({ row }) => row.original.author ?? "—",
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Updated" />
      ),
      cell: ({ row }) =>
        formatTimestampToFriendlyDate(
          new Date(row.original.updatedAt).getTime()
        ),
    },
  ];
}
