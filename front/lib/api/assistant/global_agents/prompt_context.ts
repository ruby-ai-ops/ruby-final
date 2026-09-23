import {
  GLOBAL_AGENTS_SID,
  isGlobalAgentId,
} from "@app/types/assistant/assistant";

type GlobalAgentPromptContext = {
  injectsToolsets: boolean;
  injectsUserContext: boolean;
  injectsWorkspaceContext: boolean;
};

// Exhaustive map of prompt-context behavior for each global agent. This
// controls which agents inject per-user dynamic content (like the user profile)
// into the prompt context. This approach is not ideal but allows us to move
// dynamic content out of instructions and into context sections, improving
// prompt cache hit rates. Will be properly refactored if we manage to improve
// cache hit rates.
const GLOBAL_AGENT_PROMPT_CONTEXT: Record<
  GLOBAL_AGENTS_SID,
  GlobalAgentPromptContext
> = {
  [GLOBAL_AGENTS_SID.RUBY]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_LEAN]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OMITTED]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_HIGH_OMITTED]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_EDGE]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_QUICK]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_QUICK_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OAI]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OAI_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OAI_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OAI_LUNA]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OAI_LUNA_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_OAI_NANO_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GOOG]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GOOG_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GOOG_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GOOG_LITE]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GOOG_PRO]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GOOG_PRO_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_ANT]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_ANT_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_ANT_MEDIUM_OMITTED]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_ANT_HIGH_OMITTED]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_ANT_SONNET_EDGE_LIGHT]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_HAIKU]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_LIGHT]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_KIMI]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_KIMI_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_KIMI_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GLM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GLM_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_GLM_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_MINIMAX]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_MINIMAX_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_MINIMAX_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_DEEPSEEK]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_NONE]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_MISTRAL_MEDIUM_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_NEXT]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_NEXT_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_NEXT_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_CHAWI]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_CHAWI_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_CHAWI_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_SOUPINOU]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_SOUPINOU_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_SOUPINOU_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_SOUPINOU_NONE]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_SUNDAE]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_SUNDAE_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_SUNDAE_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_PISTACHE]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_PISTACHE_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_PISTACHE_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_CHALOM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_CHALOM_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_CHALOM_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_LIONEL]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_LIONEL_MEDIUM]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_LIONEL_HIGH]: {
    injectsToolsets: true,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.HELPER]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.DEEP_DIVE]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_TASK]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_BROWSER_SUMMARY]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.RUBY_PLANNING]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.SIDEKICK]: {
    injectsToolsets: false,
    injectsUserContext: true,
    injectsWorkspaceContext: true,
  },
  [GLOBAL_AGENTS_SID.REINFORCEMENT]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.ANALYST]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.SLACK]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GOOGLE_DRIVE]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.NOTION]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GITHUB]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.INTERCOM]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GPT35_TURBO]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GPT4]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GPT5]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GPT5_THINKING]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GPT5_NANO]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GPT5_MINI]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.O1]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.O1_MINI]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.O1_HIGH_REASONING]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.O3_MINI]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.O3]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_4_5_HAIKU]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_5_SONNET]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_4_5_SONNET]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_4_SONNET]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_3_OPUS]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_3_SONNET]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_3_HAIKU]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.CLAUDE_3_7_SONNET]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.MISTRAL_LARGE]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.MISTRAL_MEDIUM]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.MISTRAL_SMALL]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.GEMINI_PRO]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
  [GLOBAL_AGENTS_SID.NOOP]: {
    injectsToolsets: false,
    injectsUserContext: false,
    injectsWorkspaceContext: false,
  },
};

export function globalAgentInjectsToolsets(sId: string): boolean {
  return (
    isGlobalAgentId(sId) && GLOBAL_AGENT_PROMPT_CONTEXT[sId].injectsToolsets
  );
}

export function globalAgentInjectsUserContext(sId: string): boolean {
  return (
    isGlobalAgentId(sId) && GLOBAL_AGENT_PROMPT_CONTEXT[sId].injectsUserContext
  );
}

export function globalAgentInjectsWorkspaceContext(sId: string): boolean {
  return (
    isGlobalAgentId(sId) &&
    GLOBAL_AGENT_PROMPT_CONTEXT[sId].injectsWorkspaceContext
  );
}

export function isRubyLikeAgent(sId: string): boolean {
  return globalAgentInjectsToolsets(sId);
}
