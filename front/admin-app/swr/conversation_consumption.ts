import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { ConversationConsumptionResponse } from "@app/types/assistant/conversation_consumption";
import type { Fetcher } from "swr";

interface AdminConsumptionFetchProps {
  conversationId: string;
  disabled: boolean;
  workspaceId: string;
}

export function useAdminConversationConsumption({
  conversationId,
  disabled,
  workspaceId,
}: AdminConsumptionFetchProps) {
  const { fetcher } = useFetcher();
  const consumptionFetcher: Fetcher<ConversationConsumptionResponse> = fetcher;

  const { data, error, isLoading, isValidating, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${workspaceId}/conversations/${conversationId}/consumption`,
    consumptionFetcher,
    { disabled, revalidateOnFocus: false }
  );

  return {
    consumption: data,
    isConsumptionError: error,
    isConsumptionLoading: !disabled && (isLoading || isValidating),
    mutateConsumption: mutate,
  };
}
