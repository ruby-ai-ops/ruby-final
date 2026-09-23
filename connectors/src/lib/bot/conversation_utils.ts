import { apiConfig } from "@connectors/lib/api/config";

export function makeRubyAppUrl(path: string) {
  return `${apiConfig.getRubyAppUrl()}${path}`;
}

export function makeConversationUrl(
  workspaceId?: string,
  conversationId?: string | null
) {
  if (workspaceId && conversationId) {
    return makeRubyAppUrl(`/w/${workspaceId}/conversation/${conversationId}`);
  }
  return null;
}

/**
 * Opens the agent details sheet in the given conversation (same query as front
 * `getConversationRoute(wId, conversationId, \`agentDetails=${agentConfigurationId}\`)`).
 */
export function makeAgentDetailsInConversationUrl(
  workspaceId: string,
  conversationId: string,
  agentConfigurationId: string
): string {
  const q = new URLSearchParams({
    agentDetails: agentConfigurationId,
  });
  return makeRubyAppUrl(
    `/w/${workspaceId}/conversation/${conversationId}?${q.toString()}`
  );
}
