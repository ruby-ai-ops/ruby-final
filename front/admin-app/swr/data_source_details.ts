import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminGetDataSourceDetails } from "@app/types/api/admin/data_sources";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminDataSourceDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  dsId: string;
}

export function useAdminDataSourceDetails({
  disabled,
  owner,
  dsId,
}: UseAdminDataSourceDetailsProps) {
  const { fetcher } = useFetcher();
  const dataSourceDetailsFetcher: Fetcher<AdminGetDataSourceDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/data_sources/${dsId}/details`,
    dataSourceDetailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
