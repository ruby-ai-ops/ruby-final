import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AgentMessageConsumptionWithModelsResponse } from "@app/types/assistant/agent_message_consumption";
import type { Fetcher } from "swr";

interface AdminMessageConsumptionFetchProps {
  conversationId: string;
  disabled: boolean;
  messageId: string;
  workspaceId: string;
}

export function useAdminMessageConsumption({
  conversationId,
  disabled,
  messageId,
  workspaceId,
}: AdminMessageConsumptionFetchProps) {
  const { fetcher } = useFetcher();
  const consumptionFetcher: Fetcher<AgentMessageConsumptionWithModelsResponse> =
    fetcher;

  const { data, error, isLoading, isValidating } = useSWRWithDefaults(
    `/api/admin/workspaces/${workspaceId}/conversations/${conversationId}/messages/${messageId}/consumption`,
    consumptionFetcher,
    { disabled, revalidateOnFocus: false }
  );

  return {
    consumption: data,
    isConsumptionError: error,
    isConsumptionLoading: !disabled && (isLoading || isValidating),
  };
}
