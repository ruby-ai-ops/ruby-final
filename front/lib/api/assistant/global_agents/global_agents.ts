import { getFavoriteStates } from "@app/lib/api/assistant/get_favorite_states";
import { _getAnalystGlobalAgent } from "@app/lib/api/assistant/global_agents/configurations/analyst";
import {
  _getClaude3_7GlobalAgent,
  _getClaude3GlobalAgent,
  _getClaude3HaikuGlobalAgent,
  _getClaude3OpusGlobalAgent,
  _getClaude4_5HaikuGlobalAgent,
  _getClaude4_5SonnetGlobalAgent,
  _getClaude4SonnetGlobalAgent,
  _getClaude5SonnetGlobalAgent,
} from "@app/lib/api/assistant/global_agents/configurations/anthropic";
import {
  _getArchivedBrowserSummaryAgent,
  _getDeepDiveGlobalAgent,
  _getRubyTaskGlobalAgent,
  _getPlanningAgent,
} from "@app/lib/api/assistant/global_agents/configurations/ruby/deep-dive";
import {
  _getRubyAntGlobalAgent,
  _getRubyAntHighGlobalAgent,
  _getRubyAntHighOmittedGlobalAgent,
  _getRubyAntMediumGlobalAgent,
  _getRubyAntMediumOmittedGlobalAgent,
  _getRubyAntSonnetEdgeGlobalAgent,
  _getRubyAntSonnetEdgeLightGlobalAgent,
  _getRubyDeepseekGlobalAgent,
  _getRubyEdgeGlobalAgent,
  _getRubyGlmGlobalAgent,
  _getRubyGlmHighGlobalAgent,
  _getRubyGlmMediumGlobalAgent,
  _getRubyGlobalAgent,
  _getRubyGoogGlobalAgent,
  _getRubyGoogHighGlobalAgent,
  _getRubyGoogLiteGlobalAgent,
  _getRubyGoogMediumGlobalAgent,
  _getRubyGoogProGlobalAgent,
  _getRubyGoogProHighGlobalAgent,
  _getRubyGoogProMediumGlobalAgent,
  _getRubyHaikuGlobalAgent,
  _getRubyHighGlobalAgent,
  _getRubyHighOmittedGlobalAgent,
  _getRubyKimiGlobalAgent,
  _getRubyKimiHighGlobalAgent,
  _getRubyKimiMediumGlobalAgent,
  _getRubyLeanGlobalAgent,
  _getRubyLightGlobalAgent,
  _getRubyLionelGlobalAgent,
  _getRubyLionelHighGlobalAgent,
  _getRubyLionelMediumGlobalAgent,
  _getRubyMinimaxGlobalAgent,
  _getRubyMinimaxHighGlobalAgent,
  _getRubyMinimaxMediumGlobalAgent,
  _getRubyMistralMediumHighGlobalAgent,
  _getRubyMistralMediumNoneGlobalAgent,
  _getRubyNextGlobalAgent,
  _getRubyNextHighGlobalAgent,
  _getRubyNextMediumGlobalAgent,
  _getRubyOaiGlobalAgent,
  _getRubyOaiHighGlobalAgent,
  _getRubyOaiLunaGlobalAgent,
  _getRubyOaiLunaHighGlobalAgent,
  _getRubyOaiLunaMediumGlobalAgent,
  _getRubyOaiMediumGlobalAgent,
  _getRubyOaiNanoHighGlobalAgent,
  _getRubyOmittedGlobalAgent,
  _getRubyPistacheGlobalAgent,
  _getRubyPistacheHighGlobalAgent,
  _getRubyPistacheMediumGlobalAgent,
  _getRubyQuickGlobalAgent,
  _getRubyQuickMediumGlobalAgent,
  _getRetiredRubyLikeGlobalAgent,
  getCustomModelRubyGlobalAgentIndex,
} from "@app/lib/api/assistant/global_agents/configurations/ruby/ruby";
import { _getNoopAgent } from "@app/lib/api/assistant/global_agents/configurations/ruby/noop";
import { _getReinforcementGlobalAgent } from "@app/lib/api/assistant/global_agents/configurations/ruby/reinforcement";
import { _getSidekickGlobalAgent } from "@app/lib/api/assistant/global_agents/configurations/ruby/sidekick";
import { isDeepDiveDisabledByAdmin } from "@app/lib/api/assistant/global_agents/configurations/ruby/utils";
import { _getGeminiProGlobalAgent } from "@app/lib/api/assistant/global_agents/configurations/google";
import { _getHelperGlobalAgent } from "@app/lib/api/assistant/global_agents/configurations/helper";
import {
  _getMistralLargeGlobalAgent,
  _getMistralMediumGlobalAgent,
  _getMistralSmallGlobalAgent,
} from "@app/lib/api/assistant/global_agents/configurations/mistral";
import {
  _getGPT4GlobalAgent,
  _getGPT5GlobalAgent,
  _getGPT5MiniGlobalAgent,
  _getGPT5NanoGlobalAgent,
  _getGPT5ThinkingGlobalAgent,
  _getGPT35TurboGlobalAgent,
  _getO1GlobalAgent,
  _getO1HighReasoningGlobalAgent,
  _getO1MiniGlobalAgent,
  _getO3GlobalAgent,
  _getO3MiniGlobalAgent,
} from "@app/lib/api/assistant/global_agents/configurations/openai";
import {
  _getGithubGlobalAgent,
  _getGoogleDriveGlobalAgent,
  _getIntercomGlobalAgent,
  _getNotionGlobalAgent,
  _getSlackGlobalAgent,
} from "@app/lib/api/assistant/global_agents/configurations/retired_managed";
import { canRoleSeeGlobalAgent } from "@app/lib/api/assistant/global_agents/global_agent_metadata";
import type { SidekickContext } from "@app/lib/api/assistant/global_agents/sidekick_context";
import { buildSidekickContext } from "@app/lib/api/assistant/global_agents/sidekick_context";
import type {
  MCPServerViewsForGlobalAgentsMap,
  PrefetchedDataSourcesType,
} from "@app/lib/api/assistant/global_agents/tools";
import {
  getDataSourcesAndWorkspaceIdForGlobalAgents,
  getMCPServerViewsForGlobalAgents,
} from "@app/lib/api/assistant/global_agents/tools";
import { isProviderWhitelistedForAuth } from "@app/lib/api/assistant/models";
import type { Authenticator } from "@app/lib/auth";
import { getFeatureFlags } from "@app/lib/auth";
import { getDefaultStreamConfigForAuth } from "@app/lib/model_tiers/enabled_models";
import { GlobalAgentSettingsModel } from "@app/lib/models/agent/agent";
import type {
  AgentConfigurationType,
  AgentFetchVariant,
  GlobalAgentContext,
  GlobalAgentStatus,
} from "@app/types/assistant/agent";
import {
  GLOBAL_AGENTS_SID,
  isGlobalAgentId,
} from "@app/types/assistant/assistant";
import { CUSTOM_MODEL_CONFIGS } from "@app/types/assistant/models/custom_models.generated";
import type { ModelConfigurationType } from "@app/types/assistant/models/types";
import type { WhitelistableFeature } from "@app/types/shared/feature_flags";
import { isComputerFeatureEnabled } from "@app/types/shared/feature_flags";
import { isWorkspaceAnalyticsEnabled } from "@app/types/user";

function getGlobalAgent({
  auth,
  sId,
  preFetchedDataSources,
  globalAgentSettings,
  mcpServerViews,
  sidekickContext,
  hasDeepDive,
  hasSandbox,
  globalAgentContext,
  autoDefaultModelConfig,
  preferSonnet5DefaultModel,
  featureFlags,
}: {
  auth: Authenticator;
  sId: string | number;
  preFetchedDataSources: PrefetchedDataSourcesType | null;
  globalAgentSettings: GlobalAgentSettingsModel[];
  mcpServerViews: MCPServerViewsForGlobalAgentsMap;
  sidekickContext: SidekickContext | null;
  hasDeepDive: boolean;
  hasSandbox: boolean;
  globalAgentContext?: GlobalAgentContext;
  autoDefaultModelConfig: ModelConfigurationType | null;
  preferSonnet5DefaultModel: boolean;
  featureFlags: WhitelistableFeature[];
}): AgentConfigurationType | null {
  const settings =
    globalAgentSettings.find((settings) => settings.agentId === sId) ?? null;

  let agentConfiguration: AgentConfigurationType | null = null;

  switch (sId) {
    case GLOBAL_AGENTS_SID.HELPER:
      agentConfiguration = _getHelperGlobalAgent({
        auth,
        featureFlags,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.GPT35_TURBO:
      agentConfiguration = _getGPT35TurboGlobalAgent({
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.GPT4:
      agentConfiguration = _getGPT4GlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.GPT5:
      agentConfiguration = _getGPT5GlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.GPT5_NANO:
      agentConfiguration = _getGPT5NanoGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.GPT5_MINI:
      agentConfiguration = _getGPT5MiniGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.GPT5_THINKING:
      agentConfiguration = _getGPT5ThinkingGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.O1:
      agentConfiguration = _getO1GlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.O1_MINI:
      agentConfiguration = _getO1MiniGlobalAgent({ auth, settings });
      break;
    case GLOBAL_AGENTS_SID.O1_HIGH_REASONING:
      agentConfiguration = _getO1HighReasoningGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.O3_MINI:
      agentConfiguration = _getO3MiniGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.O3:
      agentConfiguration = _getO3GlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_5_SONNET:
      agentConfiguration = _getClaude5SonnetGlobalAgent({
        auth,
        settings,
        mcpServerViews,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_4_5_SONNET:
      agentConfiguration = _getClaude4_5SonnetGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_4_5_HAIKU:
      agentConfiguration = _getClaude4_5HaikuGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_4_SONNET:
      agentConfiguration = _getClaude4SonnetGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_3_OPUS:
      agentConfiguration = _getClaude3OpusGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_3_SONNET:
      agentConfiguration = _getClaude3GlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_3_HAIKU:
      agentConfiguration = _getClaude3HaikuGlobalAgent({
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.CLAUDE_3_7_SONNET:
      agentConfiguration = _getClaude3_7GlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.MISTRAL_LARGE:
      agentConfiguration = _getMistralLargeGlobalAgent({
        settings,
        auth,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.MISTRAL_MEDIUM:
      agentConfiguration = _getMistralMediumGlobalAgent({
        settings,
        auth,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.MISTRAL_SMALL:
      agentConfiguration = _getMistralSmallGlobalAgent({
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.GEMINI_PRO:
      agentConfiguration = _getGeminiProGlobalAgent({
        auth,
        settings,
        mcpServerViews,
      });
      break;
    case GLOBAL_AGENTS_SID.SLACK:
      agentConfiguration = _getSlackGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.GOOGLE_DRIVE:
      agentConfiguration = _getGoogleDriveGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.NOTION:
      agentConfiguration = _getNotionGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.GITHUB:
      agentConfiguration = _getGithubGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.INTERCOM:
      agentConfiguration = _getIntercomGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY:
      agentConfiguration = _getRubyGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
        globalAgentContext,
        autoDefaultModelConfig,
        preferSonnet5DefaultModel,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_LEAN:
      agentConfiguration = _getRubyLeanGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
        autoDefaultModelConfig,
        preferSonnet5DefaultModel,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_HIGH:
      agentConfiguration = _getRubyHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
        globalAgentContext,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OMITTED:
      agentConfiguration = _getRubyOmittedGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
        globalAgentContext,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_HIGH_OMITTED:
      agentConfiguration = _getRubyHighOmittedGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
        globalAgentContext,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_EDGE:
      agentConfiguration = _getRubyEdgeGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_ANT:
      agentConfiguration = _getRubyAntGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM:
      agentConfiguration = _getRubyAntMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_ANT_HIGH:
      agentConfiguration = _getRubyAntHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM_OMITTED:
      agentConfiguration = _getRubyAntMediumOmittedGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_ANT_HIGH_OMITTED:
      agentConfiguration = _getRubyAntHighOmittedGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE:
      agentConfiguration = _getRubyAntSonnetEdgeGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE_LIGHT:
      agentConfiguration = _getRubyAntSonnetEdgeLightGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_HAIKU:
      agentConfiguration = _getRubyHaikuGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_LIGHT:
      agentConfiguration = _getRubyLightGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_KIMI:
      agentConfiguration = _getRubyKimiGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_KIMI_MEDIUM:
      agentConfiguration = _getRubyKimiMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_KIMI_HIGH:
      agentConfiguration = _getRubyKimiHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GLM:
      agentConfiguration = _getRubyGlmGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GLM_MEDIUM:
      agentConfiguration = _getRubyGlmMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GLM_HIGH:
      agentConfiguration = _getRubyGlmHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_PISTACHE:
      agentConfiguration = _getRubyPistacheGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_PISTACHE_MEDIUM:
      agentConfiguration = _getRubyPistacheMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_PISTACHE_HIGH:
      agentConfiguration = _getRubyPistacheHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_MINIMAX:
      agentConfiguration = _getRubyMinimaxGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_MINIMAX_MEDIUM:
      agentConfiguration = _getRubyMinimaxMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_MINIMAX_HIGH:
      agentConfiguration = _getRubyMinimaxHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_DEEPSEEK:
      agentConfiguration = _getRubyDeepseekGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_NONE:
      agentConfiguration = _getRubyMistralMediumNoneGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_HIGH:
      agentConfiguration = _getRubyMistralMediumHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_QUICK:
      agentConfiguration = _getRubyQuickGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OAI:
      agentConfiguration = _getRubyOaiGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OAI_MEDIUM:
      agentConfiguration = _getRubyOaiMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OAI_HIGH:
      agentConfiguration = _getRubyOaiHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OAI_LUNA:
      agentConfiguration = _getRubyOaiLunaGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_MEDIUM:
      agentConfiguration = _getRubyOaiLunaMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_HIGH:
      agentConfiguration = _getRubyOaiLunaHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_OAI_NANO_HIGH:
      agentConfiguration = _getRubyOaiNanoHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GOOG:
      agentConfiguration = _getRubyGoogGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GOOG_MEDIUM:
      agentConfiguration = _getRubyGoogMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GOOG_HIGH:
      agentConfiguration = _getRubyGoogHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GOOG_LITE:
      agentConfiguration = _getRubyGoogLiteGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GOOG_PRO:
      agentConfiguration = _getRubyGoogProGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_MEDIUM:
      agentConfiguration = _getRubyGoogProMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_HIGH:
      agentConfiguration = _getRubyGoogProHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_QUICK_MEDIUM:
      agentConfiguration = _getRubyQuickMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_NEXT:
      agentConfiguration = _getRubyNextGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM:
      agentConfiguration = _getRubyNextMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH:
      agentConfiguration = _getRubyNextHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_LIONEL:
      agentConfiguration = _getRubyLionelGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_LIONEL_MEDIUM:
      agentConfiguration = _getRubyLionelMediumGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_LIONEL_HIGH:
      agentConfiguration = _getRubyLionelHighGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasDeepDive,
        featureFlags,
      });
      break;
    // Retired custom-model ruby-* agents: their eval models were removed from
    // the infra config, so they resolve to a fallback model for past
    // conversations only (see RETIRED_GLOBAL_AGENTS_SID).
    case GLOBAL_AGENTS_SID.RUBY_SUNDAE:
    case GLOBAL_AGENTS_SID.RUBY_SUNDAE_MEDIUM:
    case GLOBAL_AGENTS_SID.RUBY_SUNDAE_HIGH:
    case GLOBAL_AGENTS_SID.RUBY_CHALOM:
    case GLOBAL_AGENTS_SID.RUBY_CHALOM_MEDIUM:
    case GLOBAL_AGENTS_SID.RUBY_CHALOM_HIGH:
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU:
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU_MEDIUM:
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU_HIGH:
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU_NONE:
    case GLOBAL_AGENTS_SID.RUBY_CHAWI:
    case GLOBAL_AGENTS_SID.RUBY_CHAWI_MEDIUM:
    case GLOBAL_AGENTS_SID.RUBY_CHAWI_HIGH:
      agentConfiguration = _getRetiredRubyLikeGlobalAgent(
        auth,
        {
          settings,
          preFetchedDataSources,
          mcpServerViews,
          hasDeepDive,
          featureFlags,
        },
        sId
      );
      break;
    case GLOBAL_AGENTS_SID.DEEP_DIVE:
      agentConfiguration = _getDeepDiveGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        hasSandbox,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_TASK:
      agentConfiguration = _getRubyTaskGlobalAgent(auth, {
        settings,
        preFetchedDataSources,
        mcpServerViews,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.RUBY_BROWSER_SUMMARY:
      agentConfiguration = _getArchivedBrowserSummaryAgent();
      break;
    case GLOBAL_AGENTS_SID.RUBY_PLANNING:
      agentConfiguration = _getPlanningAgent(auth, {
        settings,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.SIDEKICK:
      agentConfiguration = _getSidekickGlobalAgent(auth, {
        sidekickContext,
        preFetchedDataSources,
        mcpServerViews,
        globalAgentContext,
        featureFlags,
      });
      break;
    case GLOBAL_AGENTS_SID.REINFORCEMENT:
      agentConfiguration = _getReinforcementGlobalAgent();
      break;
    case GLOBAL_AGENTS_SID.ANALYST:
      agentConfiguration = _getAnalystGlobalAgent({ auth });
      break;
    case GLOBAL_AGENTS_SID.NOOP:
      agentConfiguration = _getNoopAgent();
      break;
    default:
      return null;
  }

  // TODO(2025-10-20 flav): Remove once SDK JS does not rely on it anymore.
  if (agentConfiguration) {
    agentConfiguration.visualizationEnabled = false;
  }

  return agentConfiguration;
}

// This is the list of global agents that we want to support in past conversations but we don't want
// to be accessible to users moving forward.
const RETIRED_GLOBAL_AGENTS_SID = [
  GLOBAL_AGENTS_SID.CLAUDE_4_5_SONNET,
  GLOBAL_AGENTS_SID.CLAUDE_4_SONNET,
  GLOBAL_AGENTS_SID.CLAUDE_3_7_SONNET,
  GLOBAL_AGENTS_SID.CLAUDE_3_HAIKU,
  GLOBAL_AGENTS_SID.CLAUDE_3_OPUS,
  GLOBAL_AGENTS_SID.CLAUDE_3_SONNET,
  GLOBAL_AGENTS_SID.GITHUB,
  GLOBAL_AGENTS_SID.GOOGLE_DRIVE,
  GLOBAL_AGENTS_SID.GPT35_TURBO,
  GLOBAL_AGENTS_SID.INTERCOM,
  GLOBAL_AGENTS_SID.MISTRAL_MEDIUM,
  GLOBAL_AGENTS_SID.MISTRAL_SMALL,
  GLOBAL_AGENTS_SID.NOTION,
  GLOBAL_AGENTS_SID.O1,
  GLOBAL_AGENTS_SID.O1_HIGH_REASONING,
  GLOBAL_AGENTS_SID.O1_MINI,
  GLOBAL_AGENTS_SID.O3,
  GLOBAL_AGENTS_SID.O3_MINI,
  GLOBAL_AGENTS_SID.GPT4,
  GLOBAL_AGENTS_SID.SLACK,
  // Hidden helper sub-agent, only invoked via run_agent by deep-dive
  GLOBAL_AGENTS_SID.RUBY_TASK,
  GLOBAL_AGENTS_SID.RUBY_BROWSER_SUMMARY,
  GLOBAL_AGENTS_SID.RUBY_PLANNING,
  GLOBAL_AGENTS_SID.RUBY_NEXT,
  GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH,
  GLOBAL_AGENTS_SID.RUBY_QUICK,
  GLOBAL_AGENTS_SID.RUBY_QUICK_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM_OMITTED,
  GLOBAL_AGENTS_SID.RUBY_ANT_HIGH_OMITTED,
  // Custom-model ruby-* agents whose eval models were removed from the infra
  // config. Kept callable for past conversations; may be revived in the future.
  GLOBAL_AGENTS_SID.RUBY_SUNDAE,
  GLOBAL_AGENTS_SID.RUBY_SUNDAE_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_SUNDAE_HIGH,
  GLOBAL_AGENTS_SID.RUBY_CHALOM,
  GLOBAL_AGENTS_SID.RUBY_CHALOM_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_CHALOM_HIGH,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU_HIGH,
  GLOBAL_AGENTS_SID.RUBY_SOUPINOU_NONE,
  GLOBAL_AGENTS_SID.RUBY_CHAWI,
  GLOBAL_AGENTS_SID.RUBY_CHAWI_MEDIUM,
  GLOBAL_AGENTS_SID.RUBY_CHAWI_HIGH,
];

// Retired global agents remain resolvable internally (to keep past conversations running) but
// must not be surfaced to users/integrations. `getGlobalAgents` already filters them out of list
// views; callers that fetch a specific agent by sId should use this to gate the public response.
export function isRetiredGlobalAgent(sId: string): boolean {
  return isGlobalAgentId(sId) && RETIRED_GLOBAL_AGENTS_SID.includes(sId);
}

const MODEL_ONLY_GLOBAL_AGENTS_SID: readonly GLOBAL_AGENTS_SID[] = [
  GLOBAL_AGENTS_SID.GPT35_TURBO,
  GLOBAL_AGENTS_SID.GPT4,
  GLOBAL_AGENTS_SID.GPT5,
  GLOBAL_AGENTS_SID.GPT5_THINKING,
  GLOBAL_AGENTS_SID.GPT5_NANO,
  GLOBAL_AGENTS_SID.GPT5_MINI,
  GLOBAL_AGENTS_SID.O1,
  GLOBAL_AGENTS_SID.O1_MINI,
  GLOBAL_AGENTS_SID.O1_HIGH_REASONING,
  GLOBAL_AGENTS_SID.O3_MINI,
  GLOBAL_AGENTS_SID.O3,
  GLOBAL_AGENTS_SID.CLAUDE_5_SONNET,
  GLOBAL_AGENTS_SID.CLAUDE_4_5_SONNET,
  GLOBAL_AGENTS_SID.CLAUDE_4_5_HAIKU,
  GLOBAL_AGENTS_SID.CLAUDE_4_SONNET,
  GLOBAL_AGENTS_SID.CLAUDE_3_OPUS,
  GLOBAL_AGENTS_SID.CLAUDE_3_SONNET,
  GLOBAL_AGENTS_SID.CLAUDE_3_HAIKU,
  GLOBAL_AGENTS_SID.CLAUDE_3_7_SONNET,
  GLOBAL_AGENTS_SID.MISTRAL_LARGE,
  GLOBAL_AGENTS_SID.MISTRAL_MEDIUM,
  GLOBAL_AGENTS_SID.MISTRAL_SMALL,
  GLOBAL_AGENTS_SID.GEMINI_PRO,
];

/**
 * @cc [owner:sfriquet,label:product] default-global-agent-ids
 * Lists the global agents fetched when no sIds are requested, before any workspace or caller
 * filtering: every `GLOBAL_AGENTS_SID` except retired, sidekick, reinforcement and model-only
 * agents. The result MUST NOT depend on any workspace, plan, flag or caller state.
 */
export function listDefaultGlobalAgentIds(): GLOBAL_AGENTS_SID[] {
  return (
    Object.values(GLOBAL_AGENTS_SID)
      .filter((sId) => !RETIRED_GLOBAL_AGENTS_SID.includes(sId))
      // We only want to fetch sidekick global agents if explicitly requested.
      .filter((sId) => sId !== GLOBAL_AGENTS_SID.SIDEKICK)
      // The reinforcement agent is never called directly, it is only used as a
      // placeholder when building reinforcement conversations.
      .filter((sId) => sId !== GLOBAL_AGENTS_SID.REINFORCEMENT)
      .filter((sId) => !MODEL_ONLY_GLOBAL_AGENTS_SID.includes(sId))
  );
}

function getCustomModelIndexForGlobalAgent(sId: string): number | null {
  if (!isGlobalAgentId(sId)) {
    return null;
  }

  return getCustomModelRubyGlobalAgentIndex(sId);
}

export async function getGlobalAgents(
  auth: Authenticator,
  agentIds?: string[],
  variant: AgentFetchVariant = "full",
  options?: { globalAgentContext?: GlobalAgentContext }
): Promise<AgentConfigurationType[]> {
  if (agentIds !== undefined && agentIds.some((sId) => !isGlobalAgentId(sId))) {
    throw new Error("Invalid agentIds.");
  }

  if (agentIds !== undefined && agentIds.length === 0) {
    return [];
  }

  const owner = auth.getNonNullableWorkspace();

  const plan = auth.plan();
  if (!plan) {
    throw new Error("Unexpected `auth` without `plan`.");
  }

  const [
    isDeepDiveDisabled,
    preFetchedDataSources,
    globalAgentSettings,
    mcpServerViews,
  ] = await Promise.all([
    isDeepDiveDisabledByAdmin(auth),
    variant === "full"
      ? getDataSourcesAndWorkspaceIdForGlobalAgents(auth)
      : null,
    GlobalAgentSettingsModel.findAll({
      where: { workspaceId: owner.id },
    }),
    getMCPServerViewsForGlobalAgents(auth, variant),
  ]);

  // If agentIds have been passed we fetch those. Otherwise we fetch them all, removing the retired
  // one (which will remove these models from the list of default agents in the product + list of
  // user agents).
  let agentsIdsToFetch: string[] = agentIds ?? listDefaultGlobalAgentIds();

  const flags = await getFeatureFlags(auth);

  if (!flags.includes("ruby_lean_agent")) {
    agentsIdsToFetch = agentsIdsToFetch.filter(
      (sId) => sId !== GLOBAL_AGENTS_SID.RUBY_LEAN
    );
  }

  if (!isWorkspaceAnalyticsEnabled(owner)) {
    agentsIdsToFetch = agentsIdsToFetch.filter(
      (sId) => sId !== GLOBAL_AGENTS_SID.ANALYST
    );
  }

  const RUBY_INTERNAL_AGENTS: readonly GLOBAL_AGENTS_SID[] = [
    GLOBAL_AGENTS_SID.RUBY_HIGH,
    GLOBAL_AGENTS_SID.RUBY_OMITTED,
    GLOBAL_AGENTS_SID.RUBY_HIGH_OMITTED,
    GLOBAL_AGENTS_SID.RUBY_ANT,
    GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_ANT_HIGH,
    GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM_OMITTED,
    GLOBAL_AGENTS_SID.RUBY_ANT_HIGH_OMITTED,
    GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE,
    GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE_LIGHT,
    GLOBAL_AGENTS_SID.RUBY_HAIKU,
    GLOBAL_AGENTS_SID.RUBY_LIGHT,
    GLOBAL_AGENTS_SID.RUBY_EDGE,
    GLOBAL_AGENTS_SID.RUBY_KIMI,
    GLOBAL_AGENTS_SID.RUBY_KIMI_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_KIMI_HIGH,
    GLOBAL_AGENTS_SID.RUBY_GLM,
    GLOBAL_AGENTS_SID.RUBY_GLM_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_GLM_HIGH,
    GLOBAL_AGENTS_SID.RUBY_MINIMAX,
    GLOBAL_AGENTS_SID.RUBY_MINIMAX_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_MINIMAX_HIGH,
    GLOBAL_AGENTS_SID.RUBY_DEEPSEEK,
    GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_NONE,
    GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_HIGH,
    GLOBAL_AGENTS_SID.RUBY_QUICK,
    GLOBAL_AGENTS_SID.RUBY_QUICK_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_OAI,
    GLOBAL_AGENTS_SID.RUBY_OAI_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_OAI_HIGH,
    GLOBAL_AGENTS_SID.RUBY_OAI_LUNA,
    GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_HIGH,
    GLOBAL_AGENTS_SID.RUBY_OAI_NANO_HIGH,
    GLOBAL_AGENTS_SID.RUBY_GOOG,
    GLOBAL_AGENTS_SID.RUBY_GOOG_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_GOOG_HIGH,
    GLOBAL_AGENTS_SID.RUBY_GOOG_LITE,
    GLOBAL_AGENTS_SID.RUBY_GOOG_PRO,
    GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_HIGH,
    GLOBAL_AGENTS_SID.RUBY_NEXT,
    GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM,
    GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH,
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
    GLOBAL_AGENTS_SID.NOOP,
  ];
  if (!flags.includes("ruby_internal_global_agents")) {
    agentsIdsToFetch = agentsIdsToFetch.filter(
      (sId) => !isGlobalAgentId(sId) || !RUBY_INTERNAL_AGENTS.includes(sId)
    );
  }

  if (!flags.includes("custom_model_feature")) {
    agentsIdsToFetch = agentsIdsToFetch.filter(
      (sId) => getCustomModelIndexForGlobalAgent(sId) === null
    );
  }

  agentsIdsToFetch = agentsIdsToFetch.filter((sId) => {
    const customModelIndex = getCustomModelIndexForGlobalAgent(sId);
    if (customModelIndex === null) {
      return true;
    }

    const customModel = CUSTOM_MODEL_CONFIGS[customModelIndex];
    if (!customModel) {
      return false;
    }

    const customModelFlag = customModel.availableIfOneOf?.featureFlag;

    return !customModelFlag || flags.includes(customModelFlag);
  });

  agentsIdsToFetch = agentsIdsToFetch.filter(
    (sId) => !isGlobalAgentId(sId) || canRoleSeeGlobalAgent(sId, auth)
  );

  const sidekickContext =
    variant === "full"
      ? await buildSidekickContext(auth, agentsIdsToFetch)
      : null;

  const autoDefaultModelConfig = await getDefaultStreamConfigForAuth(auth);

  // For now we retrieve them all
  // We will store them in the database later to allow admin enable them or not
  const agentCandidates = agentsIdsToFetch.map((sId) =>
    getGlobalAgent({
      auth,
      sId,
      preFetchedDataSources,
      globalAgentSettings,
      mcpServerViews,
      sidekickContext,
      hasDeepDive: !isDeepDiveDisabled,
      hasSandbox: isComputerFeatureEnabled(flags),
      globalAgentContext: options?.globalAgentContext,
      autoDefaultModelConfig,
      preferSonnet5DefaultModel: flags.includes("ruby_agent_sonnet_5_default"),
      featureFlags: flags,
    })
  );

  const globalAgents: AgentConfigurationType[] = [];

  for (const agentFetcherResult of agentCandidates) {
    if (
      agentFetcherResult &&
      agentFetcherResult.scope === "global" &&
      isProviderWhitelistedForAuth(auth, agentFetcherResult.model.providerId)
    ) {
      globalAgents.push(agentFetcherResult);
    }
  }

  // add user's favorite status to the agents if needed
  const user = auth.user();
  if (user) {
    const favoriteStates = await getFavoriteStates(auth, {
      configurationIds: globalAgents.map((agent) => agent.sId),
    });

    for (const agent of globalAgents) {
      agent.userFavorite = !!favoriteStates.get(agent.sId);
    }
  }

  return globalAgents;
}

export async function upsertGlobalAgentSettings(
  auth: Authenticator,
  {
    agentId,
    status,
  }: {
    agentId: string;
    status: GlobalAgentStatus;
  }
): Promise<boolean> {
  const owner = auth.getNonNullableWorkspace();

  if (!isGlobalAgentId(agentId)) {
    throw new Error("Global Agent not found: invalid agentId.");
  }

  const settings = await GlobalAgentSettingsModel.findOne({
    where: { workspaceId: owner.id, agentId },
  });

  if (settings) {
    await settings.update({ status });
  } else {
    await GlobalAgentSettingsModel.create({
      workspaceId: owner.id,
      agentId,
      status,
    });
  }

  return true;
}
