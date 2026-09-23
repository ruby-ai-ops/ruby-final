import type { AdminListApps } from "@app/lib/api/admin/apps";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

export function useAdminApps({ disabled, owner }: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const dataSourceViewsFetcher: Fetcher<AdminListApps> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/apps`,
    dataSourceViewsFetcher,
    { disabled }
  );

  return {
    data: data?.apps ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
