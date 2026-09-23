import { DEFAULT_PERIOD_DAYS } from "@app/components/agent_builder/observability/constants";
import type { AdminGetDatasourceRetrievalResponse } from "@app/lib/api/admin/agent_configurations";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminGetAgentDetails } from "@app/types/api/admin/agent_configurations";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminAgentDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  aId: string;
}

export function useAdminAgentDetails({
  disabled,
  owner,
  aId,
}: UseAdminAgentDetailsProps) {
  const { fetcher } = useFetcher();
  const agentDetailsFetcher: Fetcher<AdminGetAgentDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/agent_configurations/${aId}/details`,
    agentDetailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

interface UseAdminAgentDatasourceRetrievalProps {
  workspaceId: string;
  agentConfigurationId: string;
  days?: number;
  disabled?: boolean;
}

export function useAdminAgentDatasourceRetrieval({
  workspaceId,
  agentConfigurationId,
  days = DEFAULT_PERIOD_DAYS,
  disabled,
}: UseAdminAgentDatasourceRetrievalProps) {
  const { fetcher } = useFetcher();
  const fetcherFn: Fetcher<AdminGetDatasourceRetrievalResponse> = fetcher;
  const params = new URLSearchParams({ days: days.toString() });
  const key = `/api/admin/workspaces/${workspaceId}/agent_configurations/${agentConfigurationId}/observability/datasource-retrieval?${params.toString()}`;

  const { data, error, isValidating } = useSWRWithDefaults(
    disabled ? null : key,
    fetcherFn
  );

  return {
    datasourceRetrieval: data?.datasources ?? emptyArray(),
    totalRetrievals: data?.total ?? 0,
    isDatasourceRetrievalLoading: !error && !data && !disabled,
    isDatasourceRetrievalError: error,
    isDatasourceRetrievalValidating: isValidating,
  };
}
