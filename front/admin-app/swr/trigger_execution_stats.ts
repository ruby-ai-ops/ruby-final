import type { AdminGetTriggerExecutionStats } from "@app/lib/api/admin/triggers";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminTriggerStatsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  triggerId: string;
}

export function useAdminTriggerExecutionStats({
  disabled,
  owner,
  triggerId,
}: UseAdminTriggerStatsProps) {
  const { fetcher } = useFetcher();
  const statsFetcher: Fetcher<AdminGetTriggerExecutionStats> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/triggers/${triggerId}/execution_stats`,
    statsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
