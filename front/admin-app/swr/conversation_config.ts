import type { AdminGetConversationConfig } from "@app/lib/api/admin/conversations";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminConversationConfigProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  conversationId: string;
}

export function useAdminConversationConfig({
  disabled,
  owner,
  conversationId,
}: UseAdminConversationConfigProps) {
  const { fetcher } = useFetcher();
  const configFetcher: Fetcher<AdminGetConversationConfig> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/conversations/${conversationId}/config`,
    configFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
