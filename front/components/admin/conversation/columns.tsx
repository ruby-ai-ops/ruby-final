import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { ConversationWithoutContentType } from "@app/types/assistant/conversation";
import type { LightWorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export function makeColumnsForConversations(
  owner: LightWorkspaceType
): ColumnDef<ConversationWithoutContentType>[] {
  return [
    {
      accessorKey: "sId",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="sId" />
      ),
      cell: ({ row }) => {
        const conversation = row.original;

        return (
          <LinkWrapper
            href={`/admin/${owner.sId}/conversation/${conversation.sId}`}
          >
            {conversation.sId}
          </LinkWrapper>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Created at" />
      ),
      cell: ({ row }) => {
        return formatTimestampToFriendlyDate(row.original.created);
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Title" />
      ),
    },
    {
      accessorKey: "visibility",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Visibility" />
      ),
    },
  ];
}
