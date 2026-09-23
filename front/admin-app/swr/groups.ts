import type { AdminListGroups } from "@app/lib/api/admin/groups";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

export function useAdminGroups({ disabled, owner }: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const groupsFetcher: Fetcher<AdminListGroups> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/groups`,
    groupsFetcher,
    { disabled }
  );

  return {
    data: data?.groups ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
