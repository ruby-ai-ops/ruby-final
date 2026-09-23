import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { AdminGetAgentConfigurationsResponseBody } from "@app/types/api/admin/agent_configurations";
import type { Fetcher } from "swr";

type AdminAgentConfigurationsProps = AdminConditionalFetchProps & {
  agentsGetView?: "admin_internal" | "archived";
};

/*
 * Agent configurations for admin. Currently only supports archived agent.
 * A null agentsGetView means no fetching
 */
export function useAdminAgentConfigurations({
  agentsGetView = "admin_internal",
  disabled,
  owner,
}: AdminAgentConfigurationsProps) {
  const { fetcher } = useFetcher();
  const agentConfigurationsFetcher: Fetcher<AdminGetAgentConfigurationsResponseBody> =
    fetcher;

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/agent_configurations?view=${agentsGetView}`,
    agentConfigurationsFetcher,
    { disabled }
  );

  return {
    data: data?.agentConfigurations ?? emptyArray(),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
