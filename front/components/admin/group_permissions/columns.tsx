import { getAdminGroupKindChipColor } from "@app/components/admin/groups/columns";
import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import type { AdminGroupPermissionType } from "@app/lib/api/admin/group_permissions";
import { WHOLE_TYPE_RESOURCE_ID } from "@app/types/group_permissions";
import type { LightWorkspaceType } from "@app/types/user";
import { Chip, LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export function makeColumnsForGroupPermissions(
  owner: LightWorkspaceType
): ColumnDef<AdminGroupPermissionType>[] {
  return [
    {
      id: "group",
      accessorFn: (row) => row.group.name,
      cell: ({ row }) => {
        const { group } = row.original;

        return (
          <LinkWrapper href={`/admin/${owner.sId}/groups/${group.sId}`}>
            {group.name}
          </LinkWrapper>
        );
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Group" />
      ),
    },
    {
      id: "groupKind",
      accessorFn: (row) => row.group.kind,
      cell: ({ row }) => {
        const { group } = row.original;

        return (
          <Chip color={getAdminGroupKindChipColor(group.kind)}>
            {group.kind}
          </Chip>
        );
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Group kind" />
      ),
    },
    {
      accessorKey: "grantType",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Grant type" />
      ),
    },
    {
      accessorKey: "resourceType",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Resource type" />
      ),
    },
    {
      accessorKey: "resourceId",
      cell: ({ row }) => {
        const resourceId: number = row.getValue("resourceId");

        return resourceId === WHOLE_TYPE_RESOURCE_ID
          ? "All instances (-1)"
          : resourceId.toString();
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Resource id" />
      ),
    },
  ];
}
