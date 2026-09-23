import type { AdminGetGroupDetails } from "@app/lib/api/admin/groups";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminGroupDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  groupId: string;
}

export function useAdminGroupDetails({
  disabled,
  owner,
  groupId,
}: UseAdminGroupDetailsProps) {
  const { fetcher } = useFetcher();
  const groupDetailsFetcher: Fetcher<AdminGetGroupDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/groups/${groupId}/details`,
    groupDetailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
