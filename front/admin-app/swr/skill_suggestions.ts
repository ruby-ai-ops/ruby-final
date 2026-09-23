import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { AdminListSkillSuggestions } from "@app/types/api/admin/skills";
import type { Fetcher } from "swr";

interface AdminSkillSuggestionsFetchProps extends AdminConditionalFetchProps {
  skillId: string;
}

export function useAdminSkillSuggestions({
  disabled,
  owner,
  skillId,
}: AdminSkillSuggestionsFetchProps) {
  const { fetcher } = useFetcher();
  const suggestionsFetcher: Fetcher<AdminListSkillSuggestions> = fetcher;

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/skills/${skillId}/suggestions`,
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
