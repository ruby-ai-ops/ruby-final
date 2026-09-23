import type { AdminGetMCPServerViewDetails } from "@app/lib/api/admin/mcp_server_views";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminMCPServerViewDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  mcpServerViewId: string;
}

export function useAdminMCPServerViewDetails({
  disabled,
  owner,
  mcpServerViewId,
}: UseAdminMCPServerViewDetailsProps) {
  const { fetcher } = useFetcher();
  const detailsFetcher: Fetcher<AdminGetMCPServerViewDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/mcp_server_views/${mcpServerViewId}/details`,
    detailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
