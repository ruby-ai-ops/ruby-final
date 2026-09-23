import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import config from "@app/lib/api/config";
import type { AppType } from "@app/types/app";
import type { LightWorkspaceType } from "@app/types/user";
import { Download01, IconButton, LinkWrapper } from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export function makeColumnsForApps(
  owner: LightWorkspaceType
): ColumnDef<AppType>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => {
        const { space, sId } = row.original;

        return (
          <LinkWrapper
            href={`/admin/${owner.sId}/spaces/${space.sId}/apps/${sId}`}
          >
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
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const app = row.original;

        return (
          <>
            <a
              href={`${config.getApiBaseUrl()}/api/admin/workspaces/${owner.sId}/apps/${app.sId}/export`}
              download={`${app.name}.json`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton icon={Download01} size="xs" variant="outline" />
            </a>
          </>
        );
      },
    },
  ];
}
