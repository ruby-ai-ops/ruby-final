import type { AvailableTool } from "@app/lib/api/assistant/workspace_capabilities";
import type {
  ConversationVisibility,
  ConversationWithoutContentType,
} from "@app/types/assistant/conversation";
import type { WakeUpType } from "@app/types/assistant/wakeups";
import type { AdminSandboxType } from "@app/types/admin";

export type AdminListConversationItem = ConversationWithoutContentType & {
  visibility?: ConversationVisibility;
};

export type AdminListConversations = {
  conversations: AdminListConversationItem[];
  // Upper bound on the agent listing: counted before visibility and permission
  // filtering. Equal to the returned length on the trigger and reinforced-skill
  // listings, which are not paged.
  totalCount: number;
};

export type AdminListConversationWakeUps = {
  wakeUps: WakeUpType[];
};

export type AdminGetConversationConfig = {
  conversationDataSourceId: string | null;
  langfuseUiBaseUrl: string | null;
  sandbox: AdminSandboxType | null;
  temporalWorkspace: string;
};

export interface ReinforcementTestCaseMockAction {
  functionCallName: string;
  status: "succeeded" | "failed";
  params?: Record<string, unknown>;
  output?: string | null;
}

export interface ReinforcementTestCaseMockFeedback {
  direction: "up" | "down";
  comment?: string;
}

export interface ReinforcementTestCaseMockMessage {
  role: "user" | "agent";
  content: string;
  feedback?: ReinforcementTestCaseMockFeedback;
  actions?: ReinforcementTestCaseMockAction[];
}

export interface ReinforcementTestCaseMockSkillTool {
  name: string;
  sId: string;
}

export interface ReinforcementTestCaseMockSkillConfig {
  name: string;
  sId: string;
  description?: string;
  instructions?: string;
  tools?: ReinforcementTestCaseMockSkillTool[];
}

interface ReinforcementTestCaseWorkspaceContext {
  tools: AvailableTool[];
}

export interface ReinforcementTestCaseType {
  scenarioId: string;
  type: "analysis";
  skillConfigs: ReinforcementTestCaseMockSkillConfig[];
  conversation: ReinforcementTestCaseMockMessage[];
  workspaceContext: ReinforcementTestCaseWorkspaceContext;
  expectedToolCalls: [];
  judgeCriteria: string;
}

export type GetReinforcementTestCaseResponseBody = {
  testCase: ReinforcementTestCaseType;
};
