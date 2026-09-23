import { DEFAULT_PERIOD_DAYS } from "@app/components/agent_builder/observability/constants";
import type { GetWorkspaceActiveUsersResponse } from "@app/lib/api/assistant/observability/active_users_metrics";
import type { GetWorkspaceUsageMetricsResponse } from "@app/lib/api/assistant/observability/messages_metrics";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { Fetcher } from "swr";

export function useAdminWorkspaceUsageMetrics({
  workspaceId,
  days = DEFAULT_PERIOD_DAYS,
  interval = "day",
  timezone = "UTC",
  disabled,
}: {
  workspaceId: string;
  days?: number;
  interval?: "day" | "week";
  timezone?: string;
  disabled?: boolean;
}) {
  const { fetcher } = useFetcher();
  const fetcherFn: Fetcher<GetWorkspaceUsageMetricsResponse> = fetcher;
  const key = `/api/admin/workspaces/${workspaceId}/analytics/usage-metrics?days=${days}&interval=${interval}&timezone=${encodeURIComponent(timezone)}`;

  const { data, error, isValidating } = useSWRWithDefaults(
    disabled ? null : key,
    fetcherFn
  );

  return {
    usageMetrics: data?.points ?? emptyArray(),
    isUsageMetricsLoading: !error && !data && !disabled,
    isUsageMetricsError: error,
    isUsageMetricsValidating: isValidating,
  };
}

export function useAdminWorkspaceActiveUsersMetrics({
  workspaceId,
  days = DEFAULT_PERIOD_DAYS,
  timezone = "UTC",
  disabled,
}: {
  workspaceId: string;
  days?: number;
  timezone?: string;
  disabled?: boolean;
}) {
  const { fetcher } = useFetcher();
  const fetcherFn: Fetcher<GetWorkspaceActiveUsersResponse> = fetcher;
  const key = `/api/admin/workspaces/${workspaceId}/analytics/active-users?days=${days}&timezone=${encodeURIComponent(timezone)}`;

  const { data, error, isValidating } = useSWRWithDefaults(
    disabled ? null : key,
    fetcherFn
  );

  return {
    activeUsersMetrics: data?.points ?? emptyArray(),
    isActiveUsersMetricsLoading: !error && !data && !disabled,
    isActiveUsersMetricsError: error,
    isActiveUsersMetricsValidating: isValidating,
  };
}
