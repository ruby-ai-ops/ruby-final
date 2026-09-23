import type {
  AdminListConversationItem,
  AdminListConversations,
} from "@app/lib/api/admin/conversations";
import type { AgentConversationsOrderColumn } from "@app/lib/resources/conversation_resource";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

export interface AdminConversationsFetchProps extends AdminConditionalFetchProps {
  triggerId?: string;
  reinforcedSkillId?: string;
}

export function useAdminConversations({
  disabled,
  owner,
  triggerId,
  reinforcedSkillId,
}: AdminConversationsFetchProps) {
  const { fetcher } = useFetcher();
  const conversationsFetcher: Fetcher<AdminListConversations> = fetcher;

  let url: string | null = null;
  if (reinforcedSkillId) {
    url = `/api/admin/workspaces/${owner.sId}/conversations?reinforcedSkillId=${reinforcedSkillId}`;
  } else if (triggerId) {
    url = `/api/admin/workspaces/${owner.sId}/conversations?triggerId=${triggerId}`;
  }

  const { data, error, mutate } = useSWRWithDefaults(
    url,
    conversationsFetcher,
    { disabled }
  );

  return {
    data: data?.conversations ?? emptyArray<AdminListConversationItem>(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

interface UseAdminAgentConversationsProps extends AdminConditionalFetchProps {
  agentId: string;
  limit: number;
  offset: number;
  orderColumn: AgentConversationsOrderColumn;
  orderDirection: "asc" | "desc";
  // Inclusive `createdAt` day bounds, as YYYY-MM-DD.
  from?: string;
  to?: string;
}

export function useAdminAgentConversations({
  agentId,
  disabled,
  from,
  limit,
  offset,
  orderColumn,
  orderDirection,
  owner,
  to,
}: UseAdminAgentConversationsProps) {
  const { fetcher } = useFetcher();
  const conversationsFetcher: Fetcher<AdminListConversations> = fetcher;

  const params = new URLSearchParams({
    agentId,
    limit: limit.toString(),
    offset: offset.toString(),
    orderColumn,
    orderDirection,
  });
  if (from) {
    params.set("from", from);
  }
  if (to) {
    params.set("to", to);
  }

  const { data, error, isValidating, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/conversations?${params.toString()}`,
    conversationsFetcher,
    { disabled, keepPreviousData: true }
  );

  return {
    data: {
      conversations:
        data?.conversations ?? emptyArray<AdminListConversationItem>(),
      totalCount: data?.totalCount ?? 0,
      isValidating: isValidating && !!data,
    },
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
