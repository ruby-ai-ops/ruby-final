import type { MCPServerConfigurationType } from "@app/lib/actions/mcp";
import { getGlobalAgentMetadata } from "@app/lib/api/assistant/global_agents/global_agent_metadata";
import { globalAgentGuidelines } from "@app/lib/api/assistant/global_agents/guidelines";
import type { MCPServerViewsForGlobalAgentsMap } from "@app/lib/api/assistant/global_agents/tools";
import {
  _getAgentRouterToolsConfiguration,
  _getDefaultWebActionsForGlobalAgent,
} from "@app/lib/api/assistant/global_agents/tools";
import { dummyModelConfiguration } from "@app/lib/api/assistant/global_agents/utils";
import {
  getLargeWhitelistedModel,
  getSmallWhitelistedModel,
} from "@app/lib/api/assistant/models";
import type { Authenticator } from "@app/lib/auth";
import type {
  AgentConfigurationType,
  AgentModelConfigurationType,
} from "@app/types/assistant/agent";
import { MAX_STEPS_USE_PER_RUN_LIMIT } from "@app/types/assistant/agent";
import { GLOBAL_AGENTS_SID } from "@app/types/assistant/assistant";
import type { WhitelistableFeature } from "@app/types/shared/feature_flags";

export function _getHelperGlobalAgent({
  auth,
  featureFlags,
  mcpServerViews,
}: {
  auth: Authenticator;
  featureFlags: WhitelistableFeature[];
  mcpServerViews: MCPServerViewsForGlobalAgentsMap;
}): AgentConfigurationType {
  let prompt = `<primary_goal>
You are a customer success AI agent called @help designed by Ruby and embedded in the platform. Your goal is to help users with their questions, guide them and help them to discover new things about the platform.
</primary_goal>

<ruby_platform_support_guidelines>
1. Perform web searches using site:ruby.ad to find up-to-date information about Ruby and, at the same time, fetch https://docs.ruby.ad/llms.txt to easily view the documentation site map.
2. Provide clear, straightforward answers with accuracy and empathy.
3. Use bullet points and steps to guide the user effectively.
4. NEVER invent features or capabilities that Ruby does not have.
5. NEVER make promises about future features.
6. Only refer to URLs that are mentioned in the documentation or search results - do not make up URLs about Ruby.
7. At the end of your answer about Ruby, provide these helpful links:
   - Official documentation: https://docs.ruby.ad
   - Community support on Slack: https://ruby-community.tightknit.community/join

Always base your answers on the documentation. If you don't know the answer after searching, be honest about it. Make your answers clear and straightforward.

If the user is searching for something unrelated to Ruby, do not perform any action and let them know that you can only assist them with information about Ruby. Always be polite and respectful as you represent Ruby.
</ruby_platform_support_guidelines>

<agent_discovery_guidelines>
If the user asks you questions about agents configured in their account, use the agent router related tools to suggest relevant agents to the user based on their needs.
</agent_discovery_guidelines>`;

  const user = auth.user();
  if (user) {
    const role = auth.role();
    prompt =
      prompt +
      "\n\n" +
      `<user_context>
The user you're interacting with is granted with the role ${role}. Their name is ${user.fullName}.
</user_context>`;
  }

  const modelConfiguration = auth.isUpgraded()
    ? getLargeWhitelistedModel(auth, undefined, { featureFlags })
    : getSmallWhitelistedModel(auth, undefined, { featureFlags });

  const model: AgentModelConfigurationType = modelConfiguration
    ? {
        providerId: modelConfiguration?.providerId,
        modelId: modelConfiguration?.modelId,
        temperature: 0.2,
        reasoningEffort: modelConfiguration?.defaultReasoningEffort,
      }
    : dummyModelConfiguration;
  const status = modelConfiguration ? "active" : "disabled_by_admin";

  const sId = GLOBAL_AGENTS_SID.HELPER;
  const metadata = getGlobalAgentMetadata(sId);

  const actions: MCPServerConfigurationType[] = [
    ..._getDefaultWebActionsForGlobalAgent({
      agentId: sId,
      mcpServerViews,
    }),
    ..._getAgentRouterToolsConfiguration({
      agentId: sId,
      mcpServerViews,
    }),
  ];

  return {
    id: -1,
    agentModelId: null,
    sId,
    version: 0,
    versionCreatedAt: null,
    versionAuthorId: null,
    name: metadata.name,
    description: metadata.description,
    instructions: prompt + globalAgentGuidelines,
    instructionsHtml: null,
    pictureUrl: metadata.pictureUrl,
    status: status,
    userFavorite: false,
    scope: "global",
    model: model,
    actions,
    codeDefinedSkillIds: ["frames"],
    maxStepsPerRun: MAX_STEPS_USE_PER_RUN_LIMIT,
    templateId: null,
    requestedGroupIds: [],
    requestedSpaceIds: [],
    tags: [],
    canRead: true,
    canEdit: false,
  };
}
