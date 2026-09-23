import type { AdminGetDataSourceViewDetails } from "@app/lib/api/admin/data_source_views";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminDataSourceViewDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  dataSourceViewId: string;
}

export function useAdminDataSourceViewDetails({
  disabled,
  owner,
  dataSourceViewId,
}: UseAdminDataSourceViewDetailsProps) {
  const { fetcher } = useFetcher();
  const detailsFetcher: Fetcher<AdminGetDataSourceViewDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/data_source_views/${dataSourceViewId}/details`,
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
