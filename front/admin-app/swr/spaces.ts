import type { AdminListSpaces } from "@app/lib/api/admin/spaces";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

export function useAdminSpaces({ disabled, owner }: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const spacesFetcher: Fetcher<AdminListSpaces> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/spaces`,
    spacesFetcher,
    { disabled }
  );

  return {
    data: data?.spaces ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
