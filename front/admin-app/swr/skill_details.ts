import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type {
  AdminGetSkillDetails,
  AdminGetSkillVersions,
} from "@app/types/api/admin/skills";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminSkillDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  skillId: string;
}

export function useAdminSkillDetails({
  disabled,
  owner,
  skillId,
}: UseAdminSkillDetailsProps) {
  const { fetcher } = useFetcher();
  const skillDetailsFetcher: Fetcher<AdminGetSkillDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/skills/${skillId}/details`,
    skillDetailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

interface UseAdminSkillVersionsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  skillId: string;
}

export function useAdminSkillVersions({
  disabled,
  owner,
  skillId,
}: UseAdminSkillVersionsProps) {
  const { fetcher } = useFetcher();
  const skillVersionsFetcher: Fetcher<AdminGetSkillVersions> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/skills/${skillId}/versions`,
    skillVersionsFetcher,
    { disabled }
  );

  return {
    versions: data?.versions ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
