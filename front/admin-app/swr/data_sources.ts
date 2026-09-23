import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { AdminListDataSources } from "@app/types/api/admin/data_sources";
import type { Fetcher } from "swr";

export function useAdminDataSources({
  disabled,
  owner,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const dataSourceViewsFetcher: Fetcher<AdminListDataSources> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/data_sources`,
    dataSourceViewsFetcher,
    { disabled }
  );

  return {
    data: data?.data_sources ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
