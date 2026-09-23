import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { SkillType } from "@app/types/assistant/skill_configuration";
import type { LightWorkspaceType } from "@app/types/user";
import { LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

type SkillDisplayType = Pick<
  SkillType,
  "sId" | "name" | "status" | "createdAt" | "updatedAt"
>;

export function makeColumnsForSkills(
  owner: LightWorkspaceType
): ColumnDef<SkillDisplayType>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => {
        const sId: string = row.getValue("sId");

        return (
          <LinkWrapper href={`/admin/${owner.sId}/skills/${sId}`}>
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
      accessorKey: "status",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Status" />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Created at" />
      ),
      cell: ({ row }) => {
        const createdAt: number | null = row.getValue("createdAt");
        return createdAt ? formatTimestampToFriendlyDate(createdAt) : null;
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Updated at" />
      ),
      cell: ({ row }) => {
        const updatedAt: number | null = row.getValue("updatedAt");
        return updatedAt ? formatTimestampToFriendlyDate(updatedAt) : null;
      },
    },
  ];
}
