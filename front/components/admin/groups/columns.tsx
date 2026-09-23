import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import type { GroupKind, GroupType } from "@app/types/groups";
import type { WorkspaceType } from "@app/types/user";
import { Chip, LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export const getAdminGroupKindChipColor = (kind: GroupKind) => {
  switch (kind) {
    case "provisioned":
      return "highlight";
    case "global":
      return "success";
    case "system":
      return "warning";
    default:
      return "primary";
  }
};

export function makeColumnsForGroups(
  owner: WorkspaceType
): ColumnDef<GroupType>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => {
        const sId: string = row.getValue("sId");

        return (
          <LinkWrapper href={`/admin/${owner.sId}/groups/${sId}`}>
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
      cell: ({ row }) => {
        const kind: GroupKind = row.getValue("kind");
        return <Chip color={getAdminGroupKindChipColor(kind)}>{kind}</Chip>;
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Kind" />
      ),
    },
    {
      accessorKey: "memberCount",
      cell: ({ row }) => {
        const memberCount: number = row.getValue("memberCount");

        return memberCount.toString();
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Members" />
      ),
    },
  ];
}
