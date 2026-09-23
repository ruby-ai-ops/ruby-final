import type { AdminGetSpaceDetails } from "@app/lib/api/admin/spaces";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminSpaceDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  spaceId: string;
}

export function useAdminSpaceDetails({
  disabled,
  owner,
  spaceId,
}: UseAdminSpaceDetailsProps) {
  const { fetcher } = useFetcher();
  const spaceDetailsFetcher: Fetcher<AdminGetSpaceDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/spaces/${spaceId}/details`,
    spaceDetailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
