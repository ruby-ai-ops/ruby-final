import type { AgentConfigurationScope } from "@app/types/assistant/agent";
import SUPPORTED_MODEL_CONFIGS from "@app/types/assistant/models/models";
import type {
  ModelIdType,
  SupportedModel,
} from "@app/types/assistant/models/types";

export const DEFAULT_TOKEN_COUNT_ADJUSTMENT = 1.15;

export function isSupportedModel(
  model: unknown,
  checkProvider: boolean = true
): model is SupportedModel {
  if (
    typeof model !== "object" ||
    model === null ||
    !("modelId" in model) ||
    typeof model.modelId !== "string"
  ) {
    return false;
  }

  return SUPPORTED_MODEL_CONFIGS.some(
    (m) =>
      m.modelId === model.modelId &&
      (!checkProvider ||
        ("providerId" in model && m.providerId === model.providerId))
  );
}

export function isSupportingResponseFormat(modelId: ModelIdType) {
  const model = SUPPORTED_MODEL_CONFIGS.find(
    (config) => config.modelId === modelId
  );
  return model?.supportsResponseFormat;
}

/**
 * Global agent list (stored here to be imported from client-side)
 */

export enum GLOBAL_AGENTS_SID {
  HELPER = "helper",
  RUBY = "ruby",
  RUBY_LEAN = "ruby-lean",
  RUBY_OMITTED = "ruby-omitted",
  RUBY_HIGH = "ruby-high",
  RUBY_HIGH_OMITTED = "ruby-high-omitted",
  RUBY_EDGE = "ruby-edge",
  RUBY_QUICK = "ruby-quick",
  RUBY_QUICK_MEDIUM = "ruby-quick-medium",
  RUBY_OAI = "ruby-oai",
  RUBY_OAI_MEDIUM = "ruby-oai-medium",
  RUBY_OAI_HIGH = "ruby-oai-high",
  RUBY_OAI_LUNA = "ruby-oai-luna",
  RUBY_OAI_LUNA_MEDIUM = "ruby-oai-luna-medium",
  RUBY_OAI_LUNA_HIGH = "ruby-oai-luna-high",
  RUBY_OAI_NANO_HIGH = "ruby-oai-nano-high",
  RUBY_GOOG = "ruby-goog",
  RUBY_GOOG_MEDIUM = "ruby-goog-medium",
  RUBY_GOOG_HIGH = "ruby-goog-high",
  RUBY_GOOG_LITE = "ruby-goog-lite",
  RUBY_GOOG_PRO = "ruby-goog-pro",
  RUBY_GOOG_PRO_MEDIUM = "ruby-goog-pro-medium",
  RUBY_GOOG_PRO_HIGH = "ruby-goog-pro-high",
  RUBY_NEXT = "ruby-next",
  RUBY_NEXT_MEDIUM = "ruby-next-medium",
  RUBY_CHAWI = "ruby-chawi",
  RUBY_CHAWI_MEDIUM = "ruby-chawi-medium",
  RUBY_CHAWI_HIGH = "ruby-chawi-high",
  RUBY_SOUPINOU = "ruby-soupinou",
  RUBY_SOUPINOU_MEDIUM = "ruby-soupinou-medium",
  RUBY_SOUPINOU_HIGH = "ruby-soupinou-high",
  RUBY_SOUPINOU_NONE = "ruby-soupinou-none",
  RUBY_SUNDAE = "ruby-sundae",
  RUBY_SUNDAE_MEDIUM = "ruby-sundae-medium",
  RUBY_SUNDAE_HIGH = "ruby-sundae-high",
  RUBY_PISTACHE = "ruby-pistache",
  RUBY_PISTACHE_MEDIUM = "ruby-pistache-medium",
  RUBY_PISTACHE_HIGH = "ruby-pistache-high",
  RUBY_CHALOM = "ruby-chalom",
  RUBY_CHALOM_MEDIUM = "ruby-chalom-medium",
  RUBY_CHALOM_HIGH = "ruby-chalom-high",
  RUBY_LIONEL = "ruby-lionel",
  RUBY_LIONEL_MEDIUM = "ruby-lionel-medium",
  RUBY_LIONEL_HIGH = "ruby-lionel-high",
  RUBY_ANT = "ruby-ant",
  RUBY_ANT_MEDIUM = "ruby-ant-medium",
  RUBY_ANT_HIGH = "ruby-ant-high",
  RUBY_ANT_MEDIUM_OMITTED = "ruby-ant-medium-omitted",
  RUBY_ANT_HIGH_OMITTED = "ruby-ant-high-omitted",
  RUBY_ANT_SONNET_EDGE = "ruby-ant-sonnet-edge",
  RUBY_ANT_SONNET_EDGE_LIGHT = "ruby-ant-sonnet-edge-light",
  RUBY_HAIKU = "ruby-haiku",
  RUBY_LIGHT = "ruby-light",
  RUBY_KIMI = "ruby-kimi",
  RUBY_KIMI_MEDIUM = "ruby-kimi-medium",
  RUBY_KIMI_HIGH = "ruby-kimi-high",
  RUBY_GLM = "ruby-glm",
  RUBY_GLM_MEDIUM = "ruby-glm-medium",
  RUBY_GLM_HIGH = "ruby-glm-high",
  RUBY_MINIMAX = "ruby-minimax",
  RUBY_MINIMAX_MEDIUM = "ruby-minimax-medium",
  RUBY_MINIMAX_HIGH = "ruby-minimax-high",
  RUBY_DEEPSEEK = "ruby-deepseek",
  RUBY_MISTRAL_MEDIUM_NONE = "ruby-mistral-medium-none",
  RUBY_MISTRAL_MEDIUM_HIGH = "ruby-mistral-medium-high",
  RUBY_NEXT_HIGH = "ruby-next-high",
  DEEP_DIVE = "deep-dive",
  RUBY_TASK = "ruby-task",
  RUBY_BROWSER_SUMMARY = "ruby-browser-summary",
  RUBY_PLANNING = "ruby-planning",
  SIDEKICK = "sidekick",
  REINFORCEMENT = "reinforcement",
  SLACK = "slack",
  GOOGLE_DRIVE = "google_drive",
  NOTION = "notion",
  GITHUB = "github",
  INTERCOM = "intercom",
  GPT35_TURBO = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
  GPT5 = "gpt-5",
  GPT5_THINKING = "gpt-5-thinking",
  GPT5_NANO = "gpt-5-nano",
  GPT5_MINI = "gpt-5-mini",
  O1 = "o1",
  O1_MINI = "o1-mini",
  O1_HIGH_REASONING = "o1_high",
  O3_MINI = "o3-mini",
  O3 = "o3",
  CLAUDE_4_5_HAIKU = "claude-4.5-haiku",
  CLAUDE_5_SONNET = "claude-5-sonnet",
  CLAUDE_4_5_SONNET = "claude-4.5-sonnet",
  CLAUDE_4_SONNET = "claude-4-sonnet",
  CLAUDE_3_OPUS = "claude-3-opus",
  CLAUDE_3_SONNET = "claude-3-sonnet",
  CLAUDE_3_HAIKU = "claude-3-haiku",
  CLAUDE_3_7_SONNET = "claude-3-7-sonnet",
  MISTRAL_LARGE = "mistral-large",
  MISTRAL_MEDIUM = "mistral-medium",
  //!\ TEMPORARY WORKAROUND: Renaming 'mistral' to 'mistral-small' is not feasible since
  // it interferes with the retrieval of ongoing conversations involving this agent.
  // Needed to preserve ongoing chat integrity due to 'sId=mistral' references in legacy messages.
  MISTRAL_SMALL = "mistral",
  GEMINI_PRO = "gemini-pro",

  ANALYST = "analyst",

  NOOP = "noop",
}

export function isGlobalAgentId(sId: string): sId is GLOBAL_AGENTS_SID {
  return (Object.values(GLOBAL_AGENTS_SID) as string[]).includes(sId);
}

// Hidden helper sub-agents that are only ever invoked internally (e.g. via
// run_agent by the Deep Dive agent). On their own they are not meaningful to
// users, so usage they generate should be attributed to the parent agent that
// spawned them rather than to the helper itself. Other sub-agents (real user
// agents invoked via run_agent / agent_handover) keep their own attribution.
const HIDDEN_HELPER_SUB_AGENT_ID_SET: ReadonlySet<string> = new Set<string>([
  GLOBAL_AGENTS_SID.RUBY_TASK,
  GLOBAL_AGENTS_SID.RUBY_PLANNING,
  GLOBAL_AGENTS_SID.RUBY_BROWSER_SUMMARY,
]);

export function isHiddenHelperSubAgentId(sId: string): boolean {
  return HIDDEN_HELPER_SUB_AGENT_ID_SET.has(sId);
}

export function getAgentUsageAttributedId({
  agentId,
  parentAgentId,
}: {
  agentId: string;
  parentAgentId: string | null | undefined;
}): string {
  return isHiddenHelperSubAgentId(agentId) && parentAgentId
    ? parentAgentId
    : agentId;
}

// If you want to show feedback buttons for global agents, add sId here.
const GLOBAL_AGENTS_WITH_FEEDBACK = new Set<GLOBAL_AGENTS_SID>([
  GLOBAL_AGENTS_SID.RUBY,
  GLOBAL_AGENTS_SID.DEEP_DIVE,
  GLOBAL_AGENTS_SID.SIDEKICK,
]);

export function isGlobalAgentWithFeedback(sId: GLOBAL_AGENTS_SID): boolean {
  return GLOBAL_AGENTS_WITH_FEEDBACK.has(sId);
}

const AGENT_IDS_WITHOUT_CONVERSATION_ACTIONS = new Set<string>([
  GLOBAL_AGENTS_SID.SIDEKICK,
]);

export function canShowAgentConversationActions(agentId: string): boolean {
  return !AGENT_IDS_WITHOUT_CONVERSATION_ACTIONS.has(agentId);
}

export function getGlobalAgentAuthorName(agentId: string): string {
  switch (agentId) {
    case GLOBAL_AGENTS_SID.GPT5:
    case GLOBAL_AGENTS_SID.GPT5_THINKING:
    case GLOBAL_AGENTS_SID.GPT5_NANO:
    case GLOBAL_AGENTS_SID.GPT5_MINI:
    case GLOBAL_AGENTS_SID.O1:
    case GLOBAL_AGENTS_SID.O1_MINI:
    case GLOBAL_AGENTS_SID.O1_HIGH_REASONING:
    case GLOBAL_AGENTS_SID.O3_MINI:
    case GLOBAL_AGENTS_SID.O3:
      return "OpenAI";
    case GLOBAL_AGENTS_SID.CLAUDE_5_SONNET:
    case GLOBAL_AGENTS_SID.CLAUDE_4_SONNET:
    case GLOBAL_AGENTS_SID.CLAUDE_4_5_SONNET:
    case GLOBAL_AGENTS_SID.CLAUDE_4_5_HAIKU:
      return "Anthropic";
    case GLOBAL_AGENTS_SID.MISTRAL_LARGE:
      return "Mistral";
    case GLOBAL_AGENTS_SID.GEMINI_PRO:
      return "Google";
    case GLOBAL_AGENTS_SID.NOOP:
      return "Noop";
    default:
      return "Ruby";
  }
}

// Not exhaustive.
const GLOBAL_AGENTS_SORT_ORDER: string[] = [
  GLOBAL_AGENTS_SID.RUBY,
  GLOBAL_AGENTS_SID.RUBY_LEAN,
  GLOBAL_AGENTS_SID.DEEP_DIVE,
  GLOBAL_AGENTS_SID.CLAUDE_5_SONNET,
  GLOBAL_AGENTS_SID.GPT5,
  GLOBAL_AGENTS_SID.GEMINI_PRO,
  GLOBAL_AGENTS_SID.MISTRAL_LARGE,
  GLOBAL_AGENTS_SID.CLAUDE_4_5_HAIKU,
  GLOBAL_AGENTS_SID.GPT5_MINI,
  GLOBAL_AGENTS_SID.GPT4,
  GLOBAL_AGENTS_SID.RUBY_EDGE,
  GLOBAL_AGENTS_SID.RUBY_QUICK,
  GLOBAL_AGENTS_SID.RUBY_OAI,
  GLOBAL_AGENTS_SID.RUBY_OAI_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_OAI_HIGH,
  GLOBAL_AGENTS_SID.RUBY_OAI_LUNA,
  GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_HIGH,
  GLOBAL_AGENTS_SID.RUBY_CHAWI,
  GLOBAL_AGENTS_SID.RUBY_CHAWI_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_CHAWI_HIGH,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU_HIGH,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU_NONE,
  GLOBAL_AGENTS_SID.RUBY_SUNDAE,
  GLOBAL_AGENTS_SID.RUBY_SUNDAE_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_SUNDAE_HIGH,
  GLOBAL_AGENTS_SID.RUBY_PISTACHE,
  GLOBAL_AGENTS_SID.RUBY_PISTACHE_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_PISTACHE_HIGH,
  GLOBAL_AGENTS_SID.RUBY_CHALOM,
  GLOBAL_AGENTS_SID.RUBY_CHALOM_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_CHALOM_HIGH,
  GLOBAL_AGENTS_SID.RUBY_LIONEL,
  GLOBAL_AGENTS_SID.RUBY_LIONEL_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_LIONEL_HIGH,
];
const globalAgentIndexMap = new Map(
  GLOBAL_AGENTS_SORT_ORDER.map((id, index) => [id, index])
);

// This function implements our general strategy to sort agents to users (input bar, agent list,
// agent suggestions...).
export function compareAgentsForSort<
  T extends {
    sId: string;
    userFavorite: boolean | undefined;
    scope: AgentConfigurationScope;
    name: string;
  },
>(a: T, b: T): number {
  if (a.userFavorite && !b.userFavorite) {
    return -1;
  }
  if (b.userFavorite && !a.userFavorite) {
    return 1;
  }

  const aGlobalIndex = globalAgentIndexMap.get(a.sId) ?? -1;
  const bGlobalIndex = globalAgentIndexMap.get(b.sId) ?? -1;

  if (aGlobalIndex !== -1 && bGlobalIndex !== -1) {
    return aGlobalIndex - bGlobalIndex;
  }
  if (aGlobalIndex !== -1) {
    return -1;
  }
  if (bGlobalIndex !== -1) {
    return 1;
  }

  // Check for agents with non-global 'scope'
  if (a.scope !== "global" && b.scope === "global") {
    return -1;
  }
  if (b.scope !== "global" && a.scope === "global") {
    return 1;
  }

  // default: sort alphabetically
  return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
}
