import type {
  AgentConfigurationType,
  LightAgentConfigurationType,
} from "@app/types/assistant/agent";
import type { SkillType } from "@app/types/assistant/skill_configuration";
import type { EnrichedSpaceType } from "@app/types/space";
import type { AgentSuggestionType } from "@app/types/suggestions/agent_suggestion";
import type { UserType } from "@app/types/user";

export type AdminAgentConfigurationType = LightAgentConfigurationType & {
  versionAuthor?: UserType | null;
};

export type AdminGetAgentConfigurationsResponseBody = {
  agentConfigurations: AdminAgentConfigurationType[];
};

export type AdminGetAgentDetails = {
  agentConfigurations: AgentConfigurationType[];
  authors: UserType[];
  lastVersionEditors: UserType[];
  spaces: EnrichedSpaceType[];
  skillsByVersion: Record<number, SkillType[]>;
};

export type AdminListSuggestions = {
  suggestions: AgentSuggestionType[];
};
