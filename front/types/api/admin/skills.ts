import type {
  SkillType,
  SkillWithVersionType,
  UsedBySkillType,
} from "@app/types/assistant/skill_configuration";
import type { AgentsUsageType } from "@app/types/data_source";
import type { EnrichedSpaceType } from "@app/types/space";
import type { SkillSuggestionType } from "@app/types/suggestions/skill_suggestion";
import type { UserType } from "@app/types/user";

export type GetAdminSkillsResponseBody = {
  skills: SkillType[];
};

// Request body for the admin skill-suggestion endpoint. The runtime validation schema lives with
// its only consumer, the handler (front-api/routes/admin/workspaces/[wId]/skills/suggestions.ts);
// this type only needs to describe the shape the client sends.
export type PostSkillSuggestionBodyType = {
  name: string;
  userFacingDescription: string;
  agentFacingDescription: string;
  instructions: string;
  icon: string | null;
  mcpServerViewIds: string[];
};

export type AdminGetSkillDetails = {
  skill: SkillType;
  editedByUser: UserType | null;
  spaces: EnrichedSpaceType[];
  // Agents that use this skill.
  agentsUsage: AgentsUsageType;
  // Parent skills that reference this skill.
  usedBySkills: UsedBySkillType[];
};

export type AdminGetSkillVersions = {
  versions: SkillWithVersionType[];
};

export type AdminListSkillSuggestions = {
  suggestions: SkillSuggestionType[];
};

export type AdminGetSkillSuggestionDetails = {
  suggestion: SkillSuggestionType;
  skillInstructionsHtml: string | null;
  skillAgentFacingDescription: string | null;
};
