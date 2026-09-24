import {
  DEEP_DIVE_DESC,
  DEEP_DIVE_NAME,
} from "@app/lib/api/assistant/global_agents/configurations/ruby/consts";
import type { Authenticator } from "@app/lib/auth";
import { GLOBAL_AGENTS_SID } from "@app/types/assistant/assistant";
import { RUBY_AVATAR_URL } from "@app/types/assistant/avatar";
import {
  CLAUDE_3_5_SONNET_DEFAULT_MODEL_CONFIG,
  CLAUDE_3_7_SONNET_DEFAULT_MODEL_CONFIG,
  CLAUDE_3_HAIKU_DEFAULT_MODEL_CONFIG,
  CLAUDE_3_OPUS_DEFAULT_MODEL_CONFIG,
  CLAUDE_4_5_HAIKU_DEFAULT_MODEL_CONFIG,
  CLAUDE_4_SONNET_DEFAULT_MODEL_CONFIG,
  CLAUDE_SONNET_4_6_DEFAULT_MODEL_CONFIG,
  CLAUDE_SONNET_5_DEFAULT_MODEL_CONFIG,
} from "@app/types/assistant/models/anthropic";
import { GEMINI_2_5_PRO_MODEL_CONFIG } from "@app/types/assistant/models/google_ai_studio";
import {
  MISTRAL_LARGE_MODEL_CONFIG,
  MISTRAL_MEDIUM_MODEL_CONFIG,
  MISTRAL_SMALL_MODEL_CONFIG,
} from "@app/types/assistant/models/mistral";
import {
  GPT_3_5_TURBO_MODEL_CONFIG,
  GPT_4_1_MODEL_CONFIG,
  GPT_5_4_MINI_MODEL_CONFIG,
  GPT_5_4_NANO_MODEL_CONFIG,
  GPT_5_5_MODEL_CONFIG,
  O1_MINI_MODEL_CONFIG,
  O1_MODEL_CONFIG,
  O3_MODEL_CONFIG,
} from "@app/types/assistant/models/openai";
import { assertNever } from "@app/types/shared/utils/assert_never";
import type { RoleType } from "@app/types/user";

// Audiences are role-hierarchical: `managers` means managers and admins.
const GLOBAL_AGENT_AUDIENCES = ["everyone", "managers", "admins"] as const;
type GlobalAgentAudience = (typeof GLOBAL_AGENT_AUDIENCES)[number];

type AgentMetadata = {
  sId: string;
  name: string;
  description: string;
  pictureUrl: string;
  audience?: GlobalAgentAudience;
};

function readerRolesForAudience(audience: GlobalAgentAudience): RoleType[] {
  switch (audience) {
    case "everyone":
      return ["admin", "manager", "user", "none"];
    case "managers":
      return ["admin", "manager"];
    case "admins":
      return ["admin"];
    default:
      return assertNever(audience);
  }
}

export function canRoleSeeAudience(
  audience: GlobalAgentAudience,
  auth: Authenticator
): boolean {
  return readerRolesForAudience(audience).includes(auth.role());
}

export function globalAgentReaderRoles(sId: GLOBAL_AGENTS_SID): RoleType[] {
  const { audience = "everyone" } = getGlobalAgentMetadata(sId);
  return readerRolesForAudience(audience);
}

export function canRoleSeeGlobalAgent(
  sId: GLOBAL_AGENTS_SID,
  auth: Authenticator
): boolean {
  return globalAgentReaderRoles(sId).includes(auth.role());
}

export function getGlobalAgentMetadata(sId: GLOBAL_AGENTS_SID): AgentMetadata {
  switch (sId) {
    case GLOBAL_AGENTS_SID.HELPER:
      return {
        sId: GLOBAL_AGENTS_SID.HELPER,
        name: "Help",
        description: "Help on how to use Ruby",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/helper_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GPT35_TURBO:
      return {
        sId: GLOBAL_AGENTS_SID.GPT35_TURBO,
        name: "gpt3.5-turbo",
        description: GPT_3_5_TURBO_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/gpt3_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GPT4:
      return {
        sId: GLOBAL_AGENTS_SID.GPT4,
        name: "gpt4",
        description: GPT_4_1_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/gpt4_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GPT5:
      return {
        sId: GLOBAL_AGENTS_SID.GPT5,
        name: "gpt5.5",
        description: GPT_5_5_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/gpt5_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GPT5_THINKING:
      return {
        sId: GLOBAL_AGENTS_SID.GPT5_THINKING,
        name: "gpt5.5-thinking",
        description: GPT_5_5_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/gpt5_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GPT5_NANO:
      return {
        sId: GLOBAL_AGENTS_SID.GPT5_NANO,
        name: "gpt5-nano",
        description: GPT_5_4_NANO_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/gpt5_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GPT5_MINI:
      return {
        sId: GLOBAL_AGENTS_SID.GPT5_MINI,
        name: "gpt5-mini",
        description: GPT_5_4_MINI_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/gpt5_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.O1:
      return {
        sId: GLOBAL_AGENTS_SID.O1,
        name: "o1",
        description: O1_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/o1_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.O1_MINI:
      return {
        sId: GLOBAL_AGENTS_SID.O1_MINI,
        name: "o1-mini",
        description: O1_MINI_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/o1_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.O1_HIGH_REASONING:
      return {
        sId: GLOBAL_AGENTS_SID.O1_HIGH_REASONING,
        name: "o1-high-reasoning",
        description: O1_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/o1_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.O3_MINI:
      return {
        sId: GLOBAL_AGENTS_SID.O3_MINI,
        name: "o3-mini",
        description: O3_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/o1_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.O3:
      return {
        sId: GLOBAL_AGENTS_SID.O3,
        name: "o3",
        description: O3_MODEL_CONFIG.description,
        pictureUrl: "https://ruby.ad/static/systemavatar/o1_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_3_HAIKU:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_3_HAIKU,
        name: "claude-3-haiku",
        description: CLAUDE_3_HAIKU_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_3_OPUS:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_3_OPUS,
        name: "claude-3-opus",
        description: CLAUDE_3_OPUS_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_3_SONNET:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_3_SONNET,
        name: "claude-3.5",
        description: CLAUDE_3_5_SONNET_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_4_SONNET:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_4_SONNET,
        name: "claude-4-sonnet",
        description: CLAUDE_4_SONNET_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_5_SONNET:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_5_SONNET,
        name: "claude-sonnet",
        description: CLAUDE_SONNET_5_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_4_5_SONNET:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_4_5_SONNET,
        name: "claude-sonnet",
        description: CLAUDE_SONNET_4_6_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_4_5_HAIKU:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_4_5_HAIKU,
        name: "claude-haiku",
        description: CLAUDE_4_5_HAIKU_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.CLAUDE_3_7_SONNET:
      return {
        sId: GLOBAL_AGENTS_SID.CLAUDE_3_7_SONNET,
        name: "claude-3.7",
        description: CLAUDE_3_7_SONNET_DEFAULT_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/claude_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.MISTRAL_LARGE:
      return {
        sId: GLOBAL_AGENTS_SID.MISTRAL_LARGE,
        name: "mistral",
        description: MISTRAL_LARGE_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/mistral_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.MISTRAL_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.MISTRAL_MEDIUM,
        name: "mistral-medium",
        description: MISTRAL_MEDIUM_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/mistral_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.MISTRAL_SMALL:
      return {
        sId: GLOBAL_AGENTS_SID.MISTRAL_SMALL,
        name: "mistral-small",
        description: MISTRAL_SMALL_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/mistral_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GEMINI_PRO:
      return {
        sId: GLOBAL_AGENTS_SID.GEMINI_PRO,
        name: "gemini-pro",
        description: GEMINI_2_5_PRO_MODEL_CONFIG.description,
        pictureUrl:
          "https://ruby.ad/static/systemavatar/gemini_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.SLACK:
      return {
        sId: GLOBAL_AGENTS_SID.SLACK,
        name: "slack",
        description: "An agent with context on your Slack Channels.",
        pictureUrl: "https://ruby.ad/static/systemavatar/slack_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GOOGLE_DRIVE:
      return {
        sId: GLOBAL_AGENTS_SID.GOOGLE_DRIVE,
        name: "googledrive",
        description: "An agent with context on your Google Drives.",
        pictureUrl: "https://ruby.ad/static/systemavatar/drive_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.NOTION:
      return {
        sId: GLOBAL_AGENTS_SID.NOTION,
        name: "notion",
        description: "An agent with context on your Notion Spaces.",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/notion_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.GITHUB:
      return {
        sId: GLOBAL_AGENTS_SID.GITHUB,
        name: "github",
        description:
          "An agent with context on your Github Issues and Discussions.",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/github_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.INTERCOM:
      return {
        sId: GLOBAL_AGENTS_SID.INTERCOM,
        name: "intercom",
        description: "An agent with context on your Intercom Help Center data.",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/intercom_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.RUBY_EDGE:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_EDGE,
        name: "ruby-edge",
        description:
          "Same as ruby but running Claude Opus 5 to experiment internally.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_QUICK:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_QUICK,
        name: "ruby-quick",
        description:
          "Same as ruby but running Gemini 3 with minimal reasoning for faster responses.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OAI:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OAI,
        name: "ruby-oai",
        description: "Same as ruby but running GPT-5.6 Sol.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OAI_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OAI_MEDIUM,
        name: "ruby-oai-medium",
        description: "Same as ruby-oai but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OAI_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OAI_HIGH,
        name: "ruby-oai-high",
        description: "Same as ruby-oai but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OAI_LUNA:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OAI_LUNA,
        name: "ruby-oai-luna",
        description: "Same as ruby but running GPT-5.6 Luna.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_MEDIUM,
        name: "ruby-oai-luna-medium",
        description: "Same as ruby-oai-luna but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_HIGH,
        name: "ruby-oai-luna-high",
        description: "Same as ruby-oai-luna but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OAI_NANO_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OAI_NANO_HIGH,
        name: "ruby-oai-nano-high",
        description:
          "Same as ruby but running GPT-5.4 Nano with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_NEXT:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_NEXT,
        name: "ruby-next",
        description:
          "Same as ruby but running a custom model for internal testing.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM,
        name: "ruby-next-medium",
        description: "Same as ruby-next but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH,
        name: "ruby-next-high",
        description: "Same as ruby-next but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_CHAWI:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_CHAWI,
        name: "ruby-chawi",
        description:
          "Same as ruby but running a custom model for internal testing.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_CHAWI_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_CHAWI_MEDIUM,
        name: "ruby-chawi-medium",
        description: "Same as ruby-chawi but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_CHAWI_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_CHAWI_HIGH,
        name: "ruby-chawi-high",
        description: "Same as ruby-chawi but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_SOUPINOU,
        name: "ruby-soupinou",
        description:
          "Same as ruby but running a custom model for internal testing.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_SOUPINOU_MEDIUM,
        name: "ruby-soupinou-medium",
        description: "Same as ruby-soupinou but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_SOUPINOU_HIGH,
        name: "ruby-soupinou-high",
        description: "Same as ruby-soupinou but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_SOUPINOU_NONE:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_SOUPINOU_NONE,
        name: "ruby-soupinou-none",
        description: "Same as ruby-soupinou but with no reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_SUNDAE:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_SUNDAE,
        name: "ruby-sundae",
        description:
          "Same as ruby but running a custom model for internal testing.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_SUNDAE_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_SUNDAE_MEDIUM,
        name: "ruby-sundae-medium",
        description: "Same as ruby-sundae but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_SUNDAE_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_SUNDAE_HIGH,
        name: "ruby-sundae-high",
        description: "Same as ruby-sundae but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_PISTACHE:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_PISTACHE,
        name: "ruby-pistache",
        description: "Same as ruby but running GLM-5.3.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_PISTACHE_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_PISTACHE_MEDIUM,
        name: "ruby-pistache-medium",
        description: "Same as ruby-pistache but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_PISTACHE_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_PISTACHE_HIGH,
        name: "ruby-pistache-high",
        description: "Same as ruby-pistache but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_CHALOM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_CHALOM,
        name: "ruby-chalom",
        description:
          "Same as ruby but running a custom model for internal testing.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_CHALOM_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_CHALOM_MEDIUM,
        name: "ruby-chalom-medium",
        description: "Same as ruby-chalom but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_CHALOM_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_CHALOM_HIGH,
        name: "ruby-chalom-high",
        description: "Same as ruby-chalom but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_LIONEL:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_LIONEL,
        name: "ruby-lionel",
        description: "Same as ruby but running Claude Fable 5.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_LIONEL_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_LIONEL_MEDIUM,
        name: "ruby-lionel-medium",
        description: "Same as ruby-lionel but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_LIONEL_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_LIONEL_HIGH,
        name: "ruby-lionel-high",
        description: "Same as ruby-lionel but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GOOG:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GOOG,
        name: "ruby-goog",
        description: "Same as ruby but running Gemini 3.8 Flash.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GOOG_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GOOG_MEDIUM,
        name: "ruby-goog-medium",
        description: "Same as ruby-goog but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GOOG_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GOOG_HIGH,
        name: "ruby-goog-high",
        description: "Same as ruby-goog but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GOOG_LITE:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GOOG_LITE,
        name: "ruby-goog-lite",
        description: "Same as ruby but running Gemini 3.1 Flash Lite.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GOOG_PRO:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GOOG_PRO,
        name: "ruby-goog-pro",
        description: "Same as ruby but running Gemini 3.1 Pro.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_MEDIUM,
        name: "ruby-goog-pro-medium",
        description: "Same as ruby-goog-pro but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_HIGH,
        name: "ruby-goog-pro-high",
        description: "Same as ruby-goog-pro but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_ANT:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_ANT,
        name: "ruby-ant",
        description: "Same as ruby but running Claude Opus 5.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM,
        name: "ruby-ant-medium",
        description: "Same as ruby-ant but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_ANT_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_ANT_HIGH,
        name: "ruby-ant-high",
        description: "Same as ruby-ant but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM_OMITTED:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM_OMITTED,
        name: "ruby-ant-medium-omitted",
        description:
          "Same as ruby-ant-medium but with omitted reasoning summaries.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_ANT_HIGH_OMITTED:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_ANT_HIGH_OMITTED,
        name: "ruby-ant-high-omitted",
        description:
          "Same as ruby-ant-high but with omitted reasoning summaries.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE,
        name: "ruby-ant-sonnet-edge",
        description:
          "Same as ruby but running Claude Sonnet 5 to experiment internally.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE_LIGHT:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE_LIGHT,
        name: "ruby-ant-sonnet-edge-light",
        description:
          "Same as ruby-ant-sonnet-edge but with light reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_HAIKU:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_HAIKU,
        name: "ruby-haiku",
        description: "Same as ruby but running Claude 4.5 Haiku.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_LIGHT:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_LIGHT,
        name: "ruby-light",
        description: "Same as ruby but running Claude Sonnet 4.6.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_KIMI:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_KIMI,
        name: "ruby-kimi",
        description: "Same as ruby but running Kimi K3.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_KIMI_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_KIMI_MEDIUM,
        name: "ruby-kimi-medium",
        description: "Same as ruby-kimi but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_KIMI_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_KIMI_HIGH,
        name: "ruby-kimi-high",
        description: "Same as ruby-kimi but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GLM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GLM,
        name: "ruby-glm",
        description: "Same as ruby but running GLM-5.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GLM_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GLM_MEDIUM,
        name: "ruby-glm-medium",
        description: "Same as ruby-glm but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_GLM_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_GLM_HIGH,
        name: "ruby-glm-high",
        description: "Same as ruby-glm but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_MINIMAX:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_MINIMAX,
        name: "ruby-minimax",
        description: "Same as ruby but running MiniMax M2.5.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_MINIMAX_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_MINIMAX_MEDIUM,
        name: "ruby-minimax-medium",
        description: "Same as ruby-minimax but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_MINIMAX_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_MINIMAX_HIGH,
        name: "ruby-minimax-high",
        description: "Same as ruby-minimax but with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_DEEPSEEK:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_DEEPSEEK,
        name: "ruby-deepseek",
        description: "Same as ruby but running DeepSeek V4.1 Flash.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_NONE:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_NONE,
        name: "ruby-mistral-medium-none",
        description:
          "Same as ruby but running Mistral Medium 3.5 with no reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_HIGH,
        name: "ruby-mistral-medium-high",
        description:
          "Same as ruby but running Mistral Medium 3.5 with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_QUICK_MEDIUM:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_QUICK_MEDIUM,
        name: "ruby-quick-medium",
        description: "Same as ruby-quick but with medium reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY,
        name: "Ruby",
        description: "An agent with context on your company data.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_LEAN:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_LEAN,
        name: "ruby-lean",
        description:
          "Ruby with no tools, skills, or company knowledge by default. Add capabilities to the conversation as needed.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_HIGH:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_HIGH,
        name: "ruby-high",
        description:
          "An agent with context on your company data, with high reasoning effort.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_OMITTED:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_OMITTED,
        name: "ruby-omitted",
        description:
          "An agent with context on your company data, with omitted reasoning summaries.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_HIGH_OMITTED:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_HIGH_OMITTED,
        name: "ruby-high-omitted",
        description:
          "An agent with context on your company data, with high reasoning effort and omitted reasoning summaries.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.DEEP_DIVE:
      return {
        sId: GLOBAL_AGENTS_SID.DEEP_DIVE,
        name: DEEP_DIVE_NAME,
        description: DEEP_DIVE_DESC,
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.RUBY_TASK:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_TASK,
        name: "ruby-task",
        description:
          "Task sub-agent for focused research using company data, web search, browsing, and data warehouses.",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/ruby-task_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.RUBY_BROWSER_SUMMARY:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_BROWSER_SUMMARY,
        name: "ruby-browser-summary",
        description: "A agent that summarizes web page content.",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/ruby-task_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.RUBY_PLANNING:
      return {
        sId: GLOBAL_AGENTS_SID.RUBY_PLANNING,
        name: "ruby-planning",
        description: "A agent that plans research tasks.",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/ruby-task_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.SIDEKICK:
      return {
        sId: GLOBAL_AGENTS_SID.SIDEKICK,
        name: "Sidekick",
        description: "An agent that suggests improvements for another agent.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.REINFORCEMENT:
      return {
        sId: GLOBAL_AGENTS_SID.REINFORCEMENT,
        name: "Reinforcement",
        description:
          "Internal agent used as a placeholder for reinforcement conversations.",
        pictureUrl: RUBY_AVATAR_URL,
      };
    case GLOBAL_AGENTS_SID.NOOP:
      return {
        sId: GLOBAL_AGENTS_SID.NOOP,
        name: "noop",
        description: "A no-op agent that does nothing.",
        pictureUrl:
          "https://ruby.ad/static/systemavatar/ruby-task_avatar_full.png",
      };
    case GLOBAL_AGENTS_SID.ANALYST:
      return {
        sId: GLOBAL_AGENTS_SID.ANALYST,
        name: "Analyst",
        description:
          "Agent for admins and managers that answers questions about how " +
          "your workspace is being used.",
        pictureUrl: RUBY_AVATAR_URL,
        audience: "managers",
      };
    default:
      assertNever(sId);
  }
}
