import type { ActionGeneratedFileType } from "@app/lib/actions/types";
import type { MCPServerViewType } from "@app/lib/api/mcp";
import type { SandboxStatus } from "@app/lib/resources/storage/models/sandbox";
import type { CellType } from "@app/types/cell";
import type { RegionType } from "@app/types/region";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import type {
  AgentMessageType,
  ConversationType,
  UserMessageType,
} from "../assistant/conversation";
import type { ContentFragmentType } from "../content_fragment";
import type { DataSourceType } from "../data_source";
import type { DataSourceViewType } from "../data_source_view";
import type { GroupType } from "../groups";
import type { ModelId } from "../shared/model_id";
import type { SpaceType } from "../space";

type AdminItemType =
  | "Workspace"
  | "Data Source"
  | "Data Source View"
  | "Connector"
  | "MCP Server View"
  | "Frame"
  | "File"
  | "Group"
  | "Skill"
  | "Space"
  | "Webhook Source";

export interface AdminItemBase {
  id: ModelId;
  link: string | null;
  name: string;
  type: AdminItemType;
  cell?: CellType;
  region?: RegionType;
}

export type AdminSpaceType = SpaceType & {
  id: ModelId;
  groups: GroupType[];
  isRestricted: boolean;
};

export type AdminSandboxType = {
  providerId: string;
  status: SandboxStatus;
};

export type AdminDataSourceType = DataSourceType &
  AdminItemBase & {
    space: AdminSpaceType;
  };

export type AdminDataSourceViewType = DataSourceViewType &
  AdminItemBase & {
    dataSource: AdminDataSourceType;
    space: AdminSpaceType;
  };

export type AdminMCPServerViewType = MCPServerViewType &
  AdminItemBase & {
    customName: string | null;
    space: AdminSpaceType;
    connections: {
      connectionType: "workspace" | "personal";
      userId: string | null;
      userFullName: string | null;
      userEmail: string | null;
    }[];
  };

type AdminAgentActionType = AgentMessageType["actions"][number] & {
  runId?: string | null;
  appWorkspaceId?: string | null;
  appSpaceId?: string | null;
  appId?: string | null;
  created?: number;
  mcpIO?: {
    params: Record<string, unknown>;
    output: CallToolResult["content"] | null;
    generatedFiles: ActionGeneratedFileType[];
    isError: boolean;
  };
};

export type AdminAgentMessageType = Omit<AgentMessageType, "actions"> & {
  runIds?: string[] | null;
  runUrls?: { runId: string; url: string; isLLM: boolean }[] | null;
  actions: AdminAgentActionType[];
};

export type AdminConversationType = Omit<ConversationType, "content"> & {
  content: (
    | UserMessageType[]
    | AdminAgentMessageType[]
    | ContentFragmentType[]
  )[];
};
