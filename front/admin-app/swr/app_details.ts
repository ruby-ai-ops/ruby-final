import type { AdminGetAppDetails } from "@app/lib/api/admin/apps";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminAppDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  appId: string;
  hash?: string | null;
}

export function useAdminAppDetails({
  disabled,
  owner,
  appId,
  hash,
}: UseAdminAppDetailsProps) {
  const { fetcher } = useFetcher();
  const detailsFetcher: Fetcher<AdminGetAppDetails> = fetcher;
  const hashParam = hash ? `?hash=${hash}` : "";
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/apps/${appId}/details${hashParam}`,
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
