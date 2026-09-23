import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import type { AdminListWebhookSources } from "@app/lib/api/admin/webhook_sources";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { LightWorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

type WebhookSourceDisplayType =
  AdminListWebhookSources["webhookSources"][number];

export function makeColumnsForWebhookSources(
  owner: LightWorkspaceType
): ColumnDef<WebhookSourceDisplayType>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => {
        const source = row.original;
        return (
          <LinkWrapper
            href={`/admin/${owner.sId}/webhook-sources/${source.sId}`}
          >
            {source.sId}
          </LinkWrapper>
        );
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="sId" />
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Id" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Name" />
      ),
    },
    {
      accessorKey: "provider",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Provider" />
      ),
      cell: ({ row }) => row.original.provider ?? "Custom",
    },
    {
      accessorKey: "subscribedEvents",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Events" />
      ),
      cell: ({ row }) => {
        const events = row.original.subscribedEvents;
        if (events.length === 0) {
          return "All";
        }
        return events.join(", ");
      },
    },
    {
      accessorKey: "triggerCount",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Triggers" />
      ),
    },
    {
      accessorKey: "viewCount",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Views" />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Created at" />
      ),
      cell: ({ row }) => formatTimestampToFriendlyDate(row.original.createdAt),
    },
  ];
}
