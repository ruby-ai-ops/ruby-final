import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type {
  GetSpaceConversationsResponseBody,
  PodConversationListItemType,
} from "@app/types/api/assistant/conversation/spaces";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminProjectConversationsProps {
  disabled?: boolean;
  limit: number;
  owner: LightWorkspaceType;
  projectId: string;
}

export interface AdminProjectConversationsData {
  conversations: PodConversationListItemType[];
  hasMore: boolean;
  isLoadingMore: boolean;
}

export function useAdminProjectConversations({
  disabled,
  limit,
  owner,
  projectId,
}: UseAdminProjectConversationsProps) {
  const { fetcher } = useFetcher();
  const conversationsFetcher: Fetcher<GetSpaceConversationsResponseBody> =
    fetcher;
  const { data, error, isValidating, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/projects/${projectId}/conversations?limit=${limit}`,
    conversationsFetcher,
    { disabled, keepPreviousData: true }
  );

  return {
    data: {
      conversations:
        data?.conversations ?? emptyArray<PodConversationListItemType>(),
      hasMore: data?.hasMore ?? false,
      isLoadingMore: isValidating && !!data,
    },
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
