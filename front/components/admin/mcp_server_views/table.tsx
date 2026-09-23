import { makeColumnsForMCPServerViews } from "@app/components/admin/mcp_server_views/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import type { AdminMCPServerViewListItemType } from "@app/lib/api/admin/mcp_server_views";
import { useAppRouter } from "@app/lib/platform";
import {
  useAdminMCPServerViews,
  useAdminSystemSpaceMCPServerViews,
} from "@app/admin-app/swr/mcp_server_views";
import type { LightWorkspaceType } from "@app/types/user";

interface MCPServerViewsDataTableProps {
  owner: LightWorkspaceType;
  spaceId?: string;
  loadOnInit?: boolean;
  systemSpaceOnly?: boolean;
}

function prepareMCPServerViewsForDisplay(
  owner: LightWorkspaceType,
  mcpServerViews: AdminMCPServerViewListItemType[],
  spaceId?: string
) {
  return mcpServerViews
    .map((sv) => {
      // We need to add display properties but keep the original properties
      const result = {
        ...sv,
        // For display purposes
        mcpServerViewLink: `/admin/${owner.sId}/spaces/${sv.spaceId}/mcp_server_views/${sv.sId}`,
        spaceLink: `/admin/${owner.sId}/spaces/${sv.spaceId}`,
        editedAt: sv.editedByUser?.editedAt ?? undefined,
        editedBy: sv.editedByUser?.fullName ?? undefined,
      };

      return result;
    })
    .filter((sv) => !spaceId || sv.spaceId === spaceId);
}

export function MCPServerViewsDataTable({
  owner,
  spaceId,
  loadOnInit,
  systemSpaceOnly = false,
}: MCPServerViewsDataTableProps) {
  const router = useAppRouter();

  return (
    <AdminDataTableConditionalFetch
      header={systemSpaceOnly ? "MCP Servers" : "MCP Server Views"}
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={
        systemSpaceOnly
          ? useAdminSystemSpaceMCPServerViews
          : useAdminMCPServerViews
      }
    >
      {(data) => (
        <AdminDataTable
          columns={makeColumnsForMCPServerViews({
            hideSpaceColumn: systemSpaceOnly,
          })}
          data={prepareMCPServerViewsForDisplay(owner, data, spaceId)}
          onRowClick={(row) => void router.push(row.mcpServerViewLink)}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
