import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminGetSkillSuggestionDetails } from "@app/types/api/admin/skills";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminSkillSuggestionDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  suggestionId: string;
}

export function useAdminSkillSuggestionDetails({
  disabled,
  owner,
  suggestionId,
}: UseAdminSkillSuggestionDetailsProps) {
  const { fetcher } = useFetcher();
  const detailsFetcher: Fetcher<AdminGetSkillSuggestionDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/skill_suggestions/${suggestionId}/details`,
    detailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
