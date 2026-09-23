import type { AdminListConversationWakeUps } from "@app/lib/api/admin/conversations";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminConversationWakeUpsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  conversationId: string;
}

export function useAdminConversationWakeUps({
  disabled,
  owner,
  conversationId,
}: UseAdminConversationWakeUpsProps) {
  const { fetcher } = useFetcher();
  const wakeUpsFetcher: Fetcher<AdminListConversationWakeUps> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/conversations/${conversationId}/wakeups`,
    wakeUpsFetcher,
    { disabled }
  );

  return {
    wakeUps: data?.wakeUps ?? emptyArray(),
    isWakeUpsLoading: !error && !data && !disabled,
    isWakeUpsError: error,
    mutate,
  };
}
