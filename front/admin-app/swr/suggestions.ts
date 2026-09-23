import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { AdminListSuggestions } from "@app/types/api/admin/agent_configurations";
import type { Fetcher } from "swr";

interface AdminSuggestionsFetchProps extends AdminConditionalFetchProps {
  agentId: string;
}

export function useAdminSuggestions({
  disabled,
  owner,
  agentId,
}: AdminSuggestionsFetchProps) {
  const { fetcher } = useFetcher();
  const suggestionsFetcher: Fetcher<AdminListSuggestions> = fetcher;

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/assistants/${agentId}/suggestions`,
    suggestionsFetcher,
    { disabled }
  );

  return {
    data: data?.suggestions ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: !!error,
    mutate,
  };
}
