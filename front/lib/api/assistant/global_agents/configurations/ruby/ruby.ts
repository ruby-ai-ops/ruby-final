import type { MCPServerConfigurationType } from "@app/lib/actions/mcp";
import {
  getMcpServerViewDescription,
  getMcpServerViewDisplayName,
} from "@app/lib/actions/mcp_helper";
import type { InternalMCPServerNameType } from "@app/lib/actions/mcp_internal_actions/constants";
import { getPrefixedToolName } from "@app/lib/actions/tool_name_utils";
import {
  AGENT_ROUTER_SERVER_NAME,
  SUGGEST_AGENTS_TOOL_NAME,
} from "@app/lib/api/actions/servers/agent_router/metadata";
import { getGlobalAgentMetadata } from "@app/lib/api/assistant/global_agents/global_agent_metadata";
import { globalAgentGuidelines } from "@app/lib/api/assistant/global_agents/guidelines";
import type {
  MCPServerViewsForGlobalAgentsMap,
  PrefetchedDataSourcesType,
} from "@app/lib/api/assistant/global_agents/tools";
import {
  _getAgentRouterToolsConfiguration,
  _getDefaultWebActionsForGlobalAgent,
  _getToolsetsToolsConfiguration,
} from "@app/lib/api/assistant/global_agents/tools";
import { dummyModelConfiguration } from "@app/lib/api/assistant/global_agents/utils";
import {
  getLargeWhitelistedModel,
  getSmallWhitelistedModel,
  selectEnabledModel,
} from "@app/lib/api/assistant/models";
import type { Authenticator } from "@app/lib/auth";
import type { GlobalAgentSettingsModel } from "@app/lib/models/agent/agent";
import {
  isRubyCompanyPlan,
  isEnterprisePlanPrefix,
} from "@app/lib/plans/plan_codes";
import type { MCPServerViewResource } from "@app/lib/resources/mcp_server_view_resource";
import type {
  AgentConfigurationType,
  AgentModelConfigurationType,
  GlobalAgentContext,
} from "@app/types/assistant/agent";
import { MAX_STEPS_USE_PER_RUN_LIMIT } from "@app/types/assistant/agent";
import { GLOBAL_AGENTS_SID } from "@app/types/assistant/assistant";
import { RUBY_AVATAR_URL } from "@app/types/assistant/avatar";
import {
  CLAUDE_4_5_HAIKU_DEFAULT_MODEL_CONFIG,
  CLAUDE_FABLE_5_DEFAULT_MODEL_CONFIG,
  CLAUDE_OPUS_4_6_DEFAULT_MODEL_CONFIG,
  CLAUDE_OPUS_5_DEFAULT_MODEL_CONFIG,
  CLAUDE_SONNET_4_6_DEFAULT_MODEL_CONFIG,
  CLAUDE_SONNET_5_DEFAULT_MODEL_CONFIG,
} from "@app/types/assistant/models/anthropic";
import { CUSTOM_MODEL_CONFIGS } from "@app/types/assistant/models/custom_models.generated";
import {
  FIREWORKS_DEEPSEEK_V4P1_FLASH_MODEL_CONFIG,
  FIREWORKS_GLM_5_MODEL_CONFIG,
  FIREWORKS_GLM_5P3_MODEL_CONFIG,
  FIREWORKS_KIMI_K3_MODEL_CONFIG,
  FIREWORKS_MINIMAX_M2P5_MODEL_CONFIG,
} from "@app/types/assistant/models/fireworks";
import {
  GEMINI_3_1_FLASH_LITE_MODEL_CONFIG,
  GEMINI_3_1_PRO_MODEL_CONFIG,
  GEMINI_3_8_FLASH_MODEL_CONFIG,
} from "@app/types/assistant/models/google_ai_studio";
import { MISTRAL_MEDIUM_3_5_MODEL_CONFIG } from "@app/types/assistant/models/mistral";
import { NOOP_MODEL_CONFIG } from "@app/types/assistant/models/noop";
import {
  GPT_5_4_NANO_MODEL_CONFIG,
  GPT_5_5_MODEL_CONFIG,
  GPT_5_6_LUNA_MODEL_CONFIG,
  GPT_5_6_SOL_MODEL_CONFIG,
} from "@app/types/assistant/models/openai";
import type {
  ModelConfigurationType,
  ReasoningEffort,
} from "@app/types/assistant/models/types";
import type { WhitelistableFeature } from "@app/types/shared/feature_flags";

interface RubyLikeGlobalAgentArgs {
  settings: GlobalAgentSettingsModel | null;
  preFetchedDataSources: PrefetchedDataSourcesType | null;
  mcpServerViews: MCPServerViewsForGlobalAgentsMap;
  hasDeepDive: boolean;
  globalAgentContext?: GlobalAgentContext;
  // Workspace feature flags, forwarded to model selection so it runs the exact
  // same model availability check that is enforced when a message is posted.
  featureFlags: WhitelistableFeature[];
  // When set, the @ruby agent defaults to this stream meta-model (the highest
  // one the member's model-tier cap allows) instead of GPT 5.6 Luna.
  autoDefaultModelConfig?: ModelConfigurationType | null;
  // When set, the @ruby agent defaults to Claude Sonnet 5 instead of GPT 5.6
  // Luna. Gated by the `ruby_agent_sonnet_5_default` feature flag.
  preferSonnet5DefaultModel?: boolean;
}

const INSTRUCTION_SECTIONS = {
  primary: `<primary_goal>
You are an AI agent created by Ruby to answer questions using your internal knowledge, the public internet and the user's internal company data sources.
</primary_goal>

<general_guidelines>${globalAgentGuidelines}</general_guidelines>

<critical_thinking_guidelines>
Keep your thinking as short as possible.
</critical_thinking_guidelines>`,

  instructions: `<instructions>
1. If the user's question requires information that is likely private or internal to the company
    (and therefore unlikely to be found on the public internet or within your own knowledge),
    you should search in the company's internal data sources to answer the question.
    Searching in all datasources is the default behavior unless the user has specified the location,
    in which case it is better to search only on the specific data source.
    It's important to not pick a restrictive timeframe unless it's explicitly requested or obviously needed.

2. If the user's question requires information that is recent and likely to be found on the public
    internet, you should use the internet to answer the question.
    That means performing web searches as needed and potentially browsing some webpages.

3. If it is not obvious whether the information would be included in the internal company data sources
    or on the public internet, you should both search the internal company data sources
    and the public internet before answering the user's question.

4. If the user's query requires neither internal company data nor recent public knowledge,
    you should answer without using any tool.

Only use the ${getPrefixedToolName(AGENT_ROUTER_SERVER_NAME, SUGGEST_AGENTS_TOOL_NAME)} tool if the user explicitly asks about other agents available in the workspace. Never use it proactively.
</instructions>`,

  goDeepInstructions: `<go_deep_skill_guidelines>
Enable the "Go Deep" skill only when the user explicitly asks to use Go Deep, asks for a deep dive or deep research, or requests a comprehensive multi-source investigation.
Do not infer that Go Deep is needed from task complexity alone. Do not enable it based only on a detailed requested output, SQL, a mix of company and web research, several tool calls, or an opportunity to parallelize work.
If none of the explicit activation conditions is clearly met, handle the request directly. When in doubt, do not enable it.
</go_deep_skill_guidelines>`,

  memory: `<memory_guidelines>
You have access to a persistent, user-specific memory system. Each user has their own private memory store.

<critical_behavior>
Retrieve them with the \`agent_memory\` tool when prior context about the user is likely to change your answer: recurring workflows, personal preferences, ongoing projects, or requests that assume context you don't have. Do not retrieve memories for self-contained requests that any user would want answered the same way.
To add or edit memories, use the \`agent_memory\` tool.
</critical_behavior>

<memory_strategy>
Think of memories as building a "user manual" for each person you interact with:
- Extract salient facts worth remembering (use judgment - not everything is memory-worthy)
- Consolidate similar memories to avoid redundancy
- Update facts when they change rather than accumulating outdated versions
- Memories should enable you to provide increasingly personalized and efficient help over time
</memory_strategy>

<what_to_remember>
High-value memories (always save):
- Identity & role: job title, team structure, responsibilities
- Preferences: communication style, detail level, format preferences
- Context: ongoing projects, goals, deadlines, constraints
- Expertise: knowledge level, skills, areas where they need support
- Decisions: technical choices, strategic directions, agreed approaches
- Tools & workflows: software they use, processes they follow

Low-value memories (usually skip):
- Temporal states: "working on X today", "currently debugging"
- One-off queries without broader context
- Information readily available in their data sources
</what_to_remember>

<memory_usage>
Use memories to:
- Skip redundant questions (e.g., don't ask their role if you know it)
- Tailor complexity to their expertise level automatically
- Proactively offer relevant suggestions based on their patterns
- Maintain continuity across conversations (reference past decisions naturally)
- Adapt tone and format to their preferences without being asked

Never explicitly say "I remember" or "based on our previous conversation" - just apply the context naturally.
</memory_usage>

<memory_hygiene>
- Write atomic, factual statements (e.g., "CFO at Series B startup, 50 employees")
- Include temporal markers when relevant (e.g., "Migrating to AWS - started Jan 2025")
- Edit existing memories when facts change rather than creating new ones
- Erase memories that become irrelevant or that users ask you to forget
</memory_hygiene>
</memory_guidelines>`,
};

/**
 * @cc [owner:aubin-tchoi,label:product] exclude-skills-only-toolsets
 * The available toolsets context MUST NOT include MCP server views restricted to skills.
 */
export function buildToolsetsContext(
  availableToolsets: MCPServerViewResource[]
): string {
  const toolsetsList = availableToolsets
    .filter((toolset) => !toolset.isRestrictedToSkills)
    .sort((a, b) => {
      const aView = a.toJSON();
      const bView = b.toJSON();
      const nameCompare = getMcpServerViewDisplayName(aView).localeCompare(
        getMcpServerViewDisplayName(bView)
      );
      if (nameCompare !== 0) {
        return nameCompare;
      }
      return aView.sId.localeCompare(bView.sId);
    })
    .map((toolset) => {
      const mcpServerView = toolset.toJSON();
      const sId = mcpServerView.sId;
      const displayName = getMcpServerViewDisplayName(mcpServerView);
      const description = getMcpServerViewDescription(mcpServerView);
      return `- **${displayName}** (toolsetId: \`${sId}\`): ${description}`;
    })
    .join("\n");

  return `
<toolsets_guidelines>
The "toolsets" tools allow listing and enabling additional tools.

<available_toolsets>
${toolsetsList.length > 0 ? toolsetsList : "No additional toolsets are currently available."}
</available_toolsets>

A \`<tool id="..." />\` tag in a user message means the user attached that toolset, which is ready to use so you don't need to call \`toolsets__enable\` for this id.
For any other tool that might help with the request, find it in the available toolsets above and enable it using \`toolsets__enable\` with its toolsetId (shown in backticks) before attempting to fulfill the request.
Never assume or reply that you cannot do something before checking if there's a relevant toolset available.

<toolsets_vs_company_data>
IMPORTANT: If the user's company data sources already index data from a platform (e.g. Slack, Notion, Google Drive, GitHub, etc.), always prefer searching company data over enabling the corresponding toolset for retrieval purposes. Company data is lower latency, already indexed, and easier to search.
Only enable a toolset for data retrieval when the needed data is absent from or not indexed in company data sources (e.g. private data, real-time data, or data from a source that isn't connected).
Toolsets remain valuable for **write operations** (posting a Slack message, creating a Notion page, updating a GitHub issue, etc.) that company data tools cannot perform.
</toolsets_vs_company_data>
</toolsets_guidelines>`;
}

function buildInstructions({
  hasDeepDive,
  hasAgentMemory,
}: {
  hasDeepDive: boolean;
  hasAgentMemory: boolean;
}): string {
  const parts: string[] = [
    INSTRUCTION_SECTIONS.primary,
    INSTRUCTION_SECTIONS.instructions,
    hasDeepDive && INSTRUCTION_SECTIONS.goDeepInstructions,
    hasAgentMemory && INSTRUCTION_SECTIONS.memory,
  ].filter((part): part is string => typeof part === "string");

  return parts.join("\n\n");
}

function _getRubyLikeGlobalAgent(
  auth: Authenticator,
  {
    settings,
    preFetchedDataSources,
    mcpServerViews,
    hasDeepDive,
    globalAgentContext,
    featureFlags,
  }: RubyLikeGlobalAgentArgs,
  {
    agentId,
    name,
    preferredModelConfiguration,
    preferredReasoningEffort,
    omittedThinking,
  }: {
    agentId: GLOBAL_AGENTS_SID;
    name: string;
    preferredModelConfiguration?: ModelConfigurationType | null;
    preferredReasoningEffort?: ReasoningEffort;
    omittedThinking?: boolean;
  }
): (AgentConfigurationType & { omittedThinking?: boolean }) | null {
  const { agent_memory: agentMemoryMCPServerView } = mcpServerViews;

  const description = `Ruby is your general purpose agent. It has access to all of your company data and tools available in the Company space. Ruby can help you:
- Find and analyze data across your company knowledge
- Research topics by searching the web
- Create content like documents, presentations, images, and dashboards`;
  const pictureUrl = RUBY_AVATAR_URL;

  // When the triggering user message carries pre-formatted text (today: the
  // skill-suggestion notification flow), Ruby echoes it as a NOOP static reply
  // instead of running the LLM.
  const staticReply = globalAgentContext?.staticReply;
  let isPreferredModel = false;

  const modelConfiguration = (() => {
    if (staticReply) {
      return NOOP_MODEL_CONFIG;
    }

    const isPreferredModelConfigurationAvailable =
      preferredModelConfiguration != null &&
      selectEnabledModel(auth, [preferredModelConfiguration], {
        featureFlags,
      }) != null;

    if (!auth.isUpgraded()) {
      return getSmallWhitelistedModel(auth, undefined, {
        featureFlags,
      });
    }

    if (isPreferredModelConfigurationAvailable) {
      isPreferredModel = true;
      return preferredModelConfiguration;
    }

    return getLargeWhitelistedModel(auth, undefined, { featureFlags });
  })();

  const model: AgentModelConfigurationType = modelConfiguration
    ? {
        providerId: modelConfiguration.providerId,
        modelId: modelConfiguration.modelId,
        temperature: 0.7,
        reasoningEffort:
          isPreferredModel && preferredReasoningEffort
            ? preferredReasoningEffort
            : modelConfiguration.defaultReasoningEffort,
        ...(staticReply && {
          metaData: {
            staticResponse: staticReply,
          },
        }),
      }
    : dummyModelConfiguration;

  // Once the workspace has the `user_memory` feature flag, personal memory is
  // owned by user_memory, so we deprecate agent_memory for the ruby global agent.
  const hasAgentMemory =
    agentMemoryMCPServerView !== null && !featureFlags.includes("user_memory");

  const instructions = buildInstructions({
    hasDeepDive,
    hasAgentMemory,
  });

  const rubyAgent = {
    id: -1,
    agentModelId: null,
    sId: agentId,
    version: 0,
    versionCreatedAt: null,
    versionAuthorId: null,
    name,
    description,
    instructions,
    instructionsHtml: null,
    pictureUrl,
    scope: "global" as const,
    userFavorite: false,
    model,
    templateId: null,
    requestedGroupIds: [],
    requestedSpaceIds: [],
    tags: [],
    canRead: true,
    canEdit: false,
  };

  if (
    (settings && settings.status === "disabled_by_admin") ||
    !modelConfiguration
  ) {
    return {
      ...rubyAgent,
      status: "disabled_by_admin",
      actions: [
        ..._getDefaultWebActionsForGlobalAgent({
          agentId,
          mcpServerViews,
        }),
      ],
      maxStepsPerRun: 0,
    };
  }

  // This only happens when we fetch the list version of the agent.
  if (!preFetchedDataSources) {
    return {
      ...rubyAgent,
      status: "active",
      actions: [],
      maxStepsPerRun: MAX_STEPS_USE_PER_RUN_LIMIT,
    };
  }

  const actions: MCPServerConfigurationType[] = [];

  actions.push(
    ..._getDefaultWebActionsForGlobalAgent({
      agentId,
      mcpServerViews,
    }),
    ..._getToolsetsToolsConfiguration({
      agentId,
      mcpServerViews,
    }),
    ..._getAgentRouterToolsConfiguration({
      agentId,
      mcpServerViews,
    })
  );

  if (hasAgentMemory) {
    actions.push({
      id: -1,
      sId: agentId + "-agent-memory",
      type: "mcp_server_configuration",
      name: "agent_memory" satisfies InternalMCPServerNameType,
      description: "The agent memory tool",
      mcpServerViewId: agentMemoryMCPServerView.sId,
      internalMCPServerId: agentMemoryMCPServerView.internalMCPServerId,
      dataSources: null,
      tables: null,
      childAgentId: null,
      additionalConfiguration: {},
      timeFrame: null,
      rubyAppConfiguration: null,
      jsonSchema: null,
      secretName: null,
      rubyProject: null,
    });
  }

  // Fix the action ids.
  actions.forEach((action, i) => {
    action.id = -i;
  });

  return {
    ...rubyAgent,
    status: "active",
    actions,
    codeDefinedSkillIds: [
      "discover_knowledge",
      "discover_skills",
      "frames",
      "skill-authoring",
      "go-deep",
      "mention_users",
      "support",
    ],
    maxStepsPerRun: MAX_STEPS_USE_PER_RUN_LIMIT,
    omittedThinking: omittedThinking ?? false,
  };
}

export function shouldUseOpus(auth: Authenticator): boolean {
  const planCode = auth.plan()?.code ?? "";

  return isRubyCompanyPlan(planCode) || isEnterprisePlanPrefix(planCode);
}

export function _getRubyGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  let preferredModelConfiguration: ModelConfigurationType =
    GPT_5_6_LUNA_MODEL_CONFIG;
  let preferredReasoningEffort: ReasoningEffort = "high";

  if (args.autoDefaultModelConfig) {
    preferredModelConfiguration = args.autoDefaultModelConfig;
    preferredReasoningEffort = "none";
  } else if (args.preferSonnet5DefaultModel) {
    preferredModelConfiguration = CLAUDE_SONNET_5_DEFAULT_MODEL_CONFIG;
    preferredReasoningEffort = "medium";
  }
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY,
    name: "ruby",
    preferredModelConfiguration,
    preferredReasoningEffort,
  });
}

export function _getRubyLeanGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  const rubyAgent = _getRubyGlobalAgent(auth, args);
  if (!rubyAgent) {
    return null;
  }

  return {
    ...rubyAgent,
    ...getGlobalAgentMetadata(GLOBAL_AGENTS_SID.RUBY_LEAN),
    instructions: `<primary_goal>
You are an AI agent created by Ruby. Answer questions using your own knowledge and the information provided in this conversation.
Use only the capabilities explicitly provided in this conversation. When information is missing and no available capability can retrieve it, say so and ask the user to provide it.
</primary_goal>

<general_guidelines>${globalAgentGuidelines}</general_guidelines>

<critical_thinking_guidelines>
Keep your thinking as short as possible.
</critical_thinking_guidelines>`,
    actions: [],
    codeDefinedSkillIds: [],
  };
}

export function _getRubyHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_HIGH,
    name: "ruby-high",
    preferredModelConfiguration: CLAUDE_SONNET_4_6_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyHighOmittedGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_HIGH_OMITTED,
    name: "ruby-high-omitted",
    preferredModelConfiguration: CLAUDE_SONNET_4_6_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "high",
    omittedThinking: true,
  });
}

export function _getRubyOmittedGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OMITTED,
    name: "ruby-omitted",
    preferredModelConfiguration: CLAUDE_SONNET_4_6_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
    omittedThinking: true,
  });
}

export function _getRubyEdgeGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_EDGE,
    name: "ruby-edge",
    preferredModelConfiguration: CLAUDE_OPUS_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyAntGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_ANT,
    name: "ruby-ant",
    preferredModelConfiguration: CLAUDE_OPUS_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyAntMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM,
    name: "ruby-ant-medium",
    preferredModelConfiguration: CLAUDE_OPUS_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyAntHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_ANT_HIGH,
    name: "ruby-ant-high",
    preferredModelConfiguration: CLAUDE_OPUS_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyAntSonnetEdgeGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE,
    name: "ruby-ant-sonnet-edge",
    preferredModelConfiguration: CLAUDE_SONNET_5_DEFAULT_MODEL_CONFIG,
  });
}

export function _getRubyAntSonnetEdgeLightGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE_LIGHT,
    name: "ruby-ant-sonnet-edge-light",
    preferredModelConfiguration: CLAUDE_SONNET_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyHaikuGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_HAIKU,
    name: "ruby-haiku",
    preferredModelConfiguration: CLAUDE_4_5_HAIKU_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyLightGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_LIGHT,
    name: "ruby-light",
    preferredModelConfiguration: CLAUDE_SONNET_4_6_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyLionelGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_LIONEL,
    name: "ruby-lionel",
    preferredModelConfiguration: CLAUDE_FABLE_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyLionelMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_LIONEL_MEDIUM,
    name: "ruby-lionel-medium",
    preferredModelConfiguration: CLAUDE_FABLE_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyLionelHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_LIONEL_HIGH,
    name: "ruby-lionel-high",
    preferredModelConfiguration: CLAUDE_FABLE_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyKimiGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_KIMI,
    name: "ruby-kimi",
    preferredModelConfiguration: FIREWORKS_KIMI_K3_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyKimiMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_KIMI_MEDIUM,
    name: "ruby-kimi-medium",
    preferredModelConfiguration: FIREWORKS_KIMI_K3_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyKimiHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_KIMI_HIGH,
    name: "ruby-kimi-high",
    preferredModelConfiguration: FIREWORKS_KIMI_K3_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyGlmGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GLM,
    name: "ruby-glm",
    preferredModelConfiguration: FIREWORKS_GLM_5_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyGlmMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GLM_MEDIUM,
    name: "ruby-glm-medium",
    preferredModelConfiguration: FIREWORKS_GLM_5_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyGlmHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GLM_HIGH,
    name: "ruby-glm-high",
    preferredModelConfiguration: FIREWORKS_GLM_5_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyPistacheGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_PISTACHE,
    name: "ruby-pistache",
    preferredModelConfiguration: FIREWORKS_GLM_5P3_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyPistacheMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_PISTACHE_MEDIUM,
    name: "ruby-pistache-medium",
    preferredModelConfiguration: FIREWORKS_GLM_5P3_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyPistacheHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_PISTACHE_HIGH,
    name: "ruby-pistache-high",
    preferredModelConfiguration: FIREWORKS_GLM_5P3_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyMinimaxGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_MINIMAX,
    name: "ruby-minimax",
    preferredModelConfiguration: FIREWORKS_MINIMAX_M2P5_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyMinimaxMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_MINIMAX_MEDIUM,
    name: "ruby-minimax-medium",
    preferredModelConfiguration: FIREWORKS_MINIMAX_M2P5_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyMinimaxHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_MINIMAX_HIGH,
    name: "ruby-minimax-high",
    preferredModelConfiguration: FIREWORKS_MINIMAX_M2P5_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyDeepseekGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_DEEPSEEK,
    name: "ruby-deepseek",
    preferredModelConfiguration: FIREWORKS_DEEPSEEK_V4P1_FLASH_MODEL_CONFIG,
    // `none` on the preview meant "reasoning not wired up" and resolved to
    // DeepSeek's `high` on the wire; on this model's ladder that is `medium`.
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyMistralMediumNoneGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_NONE,
    name: "ruby-mistral-medium-none",
    preferredModelConfiguration: MISTRAL_MEDIUM_3_5_MODEL_CONFIG,
    preferredReasoningEffort: "none",
  });
}

export function _getRubyMistralMediumHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_HIGH,
    name: "ruby-mistral-medium-high",
    preferredModelConfiguration: MISTRAL_MEDIUM_3_5_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyGoogGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GOOG,
    name: "ruby-goog",
    preferredModelConfiguration: GEMINI_3_8_FLASH_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyGoogMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GOOG_MEDIUM,
    name: "ruby-goog-medium",
    preferredModelConfiguration: GEMINI_3_8_FLASH_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyGoogHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GOOG_HIGH,
    name: "ruby-goog-high",
    preferredModelConfiguration: GEMINI_3_8_FLASH_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyGoogLiteGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GOOG_LITE,
    name: "ruby-goog-lite",
    preferredModelConfiguration: GEMINI_3_1_FLASH_LITE_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyGoogProGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GOOG_PRO,
    name: "ruby-goog-pro",
    preferredModelConfiguration: GEMINI_3_1_PRO_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyGoogProMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_MEDIUM,
    name: "ruby-goog-pro-medium",
    preferredModelConfiguration: GEMINI_3_1_PRO_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyGoogProHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_HIGH,
    name: "ruby-goog-pro-high",
    preferredModelConfiguration: GEMINI_3_1_PRO_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyOaiGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OAI,
    name: "ruby-oai",
    preferredModelConfiguration: GPT_5_6_SOL_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyOaiMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OAI_MEDIUM,
    name: "ruby-oai-medium",
    preferredModelConfiguration: GPT_5_6_SOL_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyOaiHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OAI_HIGH,
    name: "ruby-oai-high",
    preferredModelConfiguration: GPT_5_6_SOL_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyOaiLunaGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OAI_LUNA,
    name: "ruby-oai-luna",
    preferredModelConfiguration: GPT_5_6_LUNA_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyOaiLunaMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_MEDIUM,
    name: "ruby-oai-luna-medium",
    preferredModelConfiguration: GPT_5_6_LUNA_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyOaiLunaHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_HIGH,
    name: "ruby-oai-luna-high",
    preferredModelConfiguration: GPT_5_6_LUNA_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

export function _getRubyOaiNanoHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_OAI_NANO_HIGH,
    name: "ruby-oai-nano-high",
    preferredModelConfiguration: GPT_5_4_NANO_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

// ---------------------------------------------------------------------------
// Retired ruby-* global agents.
//
// These agents are listed in RETIRED_GLOBAL_AGENTS_SID (see global_agents.ts)
// and no longer appear in the default agent list. They remain callable so
// past conversations and explicit sId lookups keep resolving. Do not add new
// agents here; this section is for agents on their way out.
// ---------------------------------------------------------------------------

export function _getRubyAntMediumOmittedGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM_OMITTED,
    name: "ruby-ant-medium-omitted",
    preferredModelConfiguration: CLAUDE_OPUS_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
    omittedThinking: true,
  });
}

export function _getRubyAntHighOmittedGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_ANT_HIGH_OMITTED,
    name: "ruby-ant-high-omitted",
    preferredModelConfiguration: CLAUDE_OPUS_5_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "high",
    omittedThinking: true,
  });
}

export function _getRubyQuickGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_QUICK,
    name: "ruby-quick",
    preferredModelConfiguration: GEMINI_3_8_FLASH_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyQuickMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_QUICK_MEDIUM,
    name: "ruby-quick-medium",
    preferredModelConfiguration: GEMINI_3_8_FLASH_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyNextGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  const customModel = CUSTOM_MODEL_CONFIGS[0];
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_NEXT,
    name: "ruby-next",
    preferredModelConfiguration:
      customModel ?? CLAUDE_OPUS_4_6_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "light",
  });
}

export function _getRubyNextMediumGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  const customModel = CUSTOM_MODEL_CONFIGS[0];
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM,
    name: "ruby-next-medium",
    preferredModelConfiguration:
      customModel ?? CLAUDE_OPUS_4_6_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "medium",
  });
}

export function _getRubyNextHighGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs
): AgentConfigurationType | null {
  const customModel = CUSTOM_MODEL_CONFIGS[0];
  return _getRubyLikeGlobalAgent(auth, args, {
    agentId: GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH,
    name: "ruby-next-high",
    preferredModelConfiguration:
      customModel ?? CLAUDE_OPUS_4_6_DEFAULT_MODEL_CONFIG,
    preferredReasoningEffort: "high",
  });
}

// Formerly custom-model ruby-* global agents (chawi, soupinou, sundae,
// pistache, chalom). Their eval models were removed from the infra custom-models
// config (GCS), so they no longer resolve to a custom model. They remain callable for past
// conversations via a concrete fallback model and are listed in
// RETIRED_GLOBAL_AGENTS_SID (see global_agents.ts). Reviving one as a
// custom-model agent requires moving it back into
// CUSTOM_MODEL_RUBY_GLOBAL_AGENT_CONFIGS and restoring
// _getCustomModelRubyLikeGlobalAgent and its switch cases (removed in #31262).
type RetiredRubyGlobalAgentConfig = {
  name: string;
  preferredReasoningEffort: ReasoningEffort;
};

const RETIRED_RUBY_GLOBAL_AGENT_CONFIGS = new Map<
  GLOBAL_AGENTS_SID,
  RetiredRubyGlobalAgentConfig
>([
  [
    GLOBAL_AGENTS_SID.RUBY_SUNDAE,
    { name: "ruby-sundae", preferredReasoningEffort: "light" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_SUNDAE_MEDIUM,
    { name: "ruby-sundae-medium", preferredReasoningEffort: "medium" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_SUNDAE_HIGH,
    { name: "ruby-sundae-high", preferredReasoningEffort: "high" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_CHALOM,
    { name: "ruby-chalom", preferredReasoningEffort: "light" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_CHALOM_MEDIUM,
    { name: "ruby-chalom-medium", preferredReasoningEffort: "medium" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_CHALOM_HIGH,
    { name: "ruby-chalom-high", preferredReasoningEffort: "high" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_SOUPINOU,
    { name: "ruby-soupinou", preferredReasoningEffort: "light" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_SOUPINOU_MEDIUM,
    { name: "ruby-soupinou-medium", preferredReasoningEffort: "medium" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_SOUPINOU_HIGH,
    { name: "ruby-soupinou-high", preferredReasoningEffort: "high" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_SOUPINOU_NONE,
    { name: "ruby-soupinou-none", preferredReasoningEffort: "none" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_CHAWI,
    { name: "ruby-chawi", preferredReasoningEffort: "light" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_CHAWI_MEDIUM,
    { name: "ruby-chawi-medium", preferredReasoningEffort: "medium" },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_CHAWI_HIGH,
    { name: "ruby-chawi-high", preferredReasoningEffort: "high" },
  ],
]);

export function _getRetiredRubyLikeGlobalAgent(
  auth: Authenticator,
  args: RubyLikeGlobalAgentArgs,
  agentId: GLOBAL_AGENTS_SID
): AgentConfigurationType | null {
  const config = RETIRED_RUBY_GLOBAL_AGENT_CONFIGS.get(agentId);

  if (!config) {
    return null;
  }

  return _getRubyLikeGlobalAgent(auth, args, {
    agentId,
    name: config.name,
    preferredModelConfiguration: GPT_5_5_MODEL_CONFIG,
    preferredReasoningEffort: config.preferredReasoningEffort,
  });
}

// ---------------------------------------------------------------------------
// Active custom-model ruby-* global agents.
// ---------------------------------------------------------------------------

type CustomModelRubyGlobalAgentConfig = {
  name: string;
  customModelIndex: number;
  preferredReasoningEffort: ReasoningEffort;
};

// `customModelIndex` is a position into `CUSTOM_MODEL_CONFIGS`, which is generated
// at build time from the infra custom-models config (GCS). It must stay in sync with
// the ordering of models in that config: shifting the array silently rebinds agents.
const CUSTOM_MODEL_RUBY_GLOBAL_AGENT_CONFIGS = new Map<
  GLOBAL_AGENTS_SID,
  CustomModelRubyGlobalAgentConfig
>([
  [
    GLOBAL_AGENTS_SID.RUBY_NEXT,
    {
      name: "ruby-next",
      customModelIndex: 0,
      preferredReasoningEffort: "light",
    },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM,
    {
      name: "ruby-next-medium",
      customModelIndex: 0,
      preferredReasoningEffort: "medium",
    },
  ],
  [
    GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH,
    {
      name: "ruby-next-high",
      customModelIndex: 0,
      preferredReasoningEffort: "high",
    },
  ],
]);

export function getCustomModelRubyGlobalAgentIndex(
  agentId: GLOBAL_AGENTS_SID
): number | null {
  return (
    CUSTOM_MODEL_RUBY_GLOBAL_AGENT_CONFIGS.get(agentId)?.customModelIndex ??
    null
  );
}
