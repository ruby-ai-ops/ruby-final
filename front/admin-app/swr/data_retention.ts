import type { AdminGetDataRetentionResponseBody } from "@app/lib/api/admin/data_retention";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

export function useAdminDataRetention({
  disabled,
  owner,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const dataRetentionFetcher: Fetcher<AdminGetDataRetentionResponseBody> =
    fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/data_retention`,
    dataRetentionFetcher,
    { disabled }
  );

  return {
    data: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
