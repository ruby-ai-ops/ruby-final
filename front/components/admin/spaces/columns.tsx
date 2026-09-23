import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { EnrichedSpaceType } from "@app/types/space";
import type { WorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export function makeColumnsForSpaces(
  owner: WorkspaceType
): ColumnDef<EnrichedSpaceType>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => {
        const sId: string = row.getValue("sId");

        return (
          <LinkWrapper href={`/admin/${owner.sId}/spaces/${sId}`}>
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
      accessorKey: "kind",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Kind" />
      ),
    },
    {
      accessorKey: "isRestricted",
      cell: ({ row }) => {
        const isRestricted: boolean = row.getValue("isRestricted");

        return isRestricted ? "Yes" : "No";
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Is restricted" />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Created at" />
      ),
      cell: ({ row }) => {
        const createdAt: number = row.getValue("createdAt");

        return formatTimestampToFriendlyDate(createdAt);
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Updated at" />
      ),
      cell: ({ row }) => {
        const updatedAt: number = row.getValue("updatedAt");

        return formatTimestampToFriendlyDate(updatedAt);
      },
    },
  ];
}
