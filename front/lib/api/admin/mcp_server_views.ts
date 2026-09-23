import type { MCPServerViewType } from "@app/lib/api/mcp";
import type { AdminMCPServerViewType } from "@app/types/admin";
import type { SpaceType } from "@app/types/space";

export type AdminMCPServerViewListItemType = MCPServerViewType & {
  space: Pick<SpaceType, "sId" | "name" | "kind">;
};

export type AdminListMCPServerViews = {
  serverViews: AdminMCPServerViewListItemType[];
};

export type AdminMCPServerViewSpaceAvailabilityType = {
  sId: string;
  spaceId: string;
  space: Pick<SpaceType, "sId" | "name" | "kind">;
  createdAt: number;
  editedBy: string | null;
  editedAt: number | null;
};

export type AdminGetMCPServerViewDetails = {
  mcpServerView: AdminMCPServerViewType;
  spaceViews: AdminMCPServerViewSpaceAvailabilityType[];
};
