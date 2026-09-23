import type { AdminListMCPServerViews } from "@app/lib/api/admin/mcp_server_views";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

interface UseAdminMCPServerViewsProps extends AdminConditionalFetchProps {
  globalSpaceOnly?: boolean;
  systemSpaceOnly?: boolean;
}

/*
 * MCP server views for admin.
 */
export function useAdminMCPServerViews({
  disabled,
  owner,
  globalSpaceOnly,
  systemSpaceOnly,
}: UseAdminMCPServerViewsProps) {
  const { fetcher } = useFetcher();
  const mcpServerViewsFetcher: Fetcher<AdminListMCPServerViews> = fetcher;

  const params = new URLSearchParams();
  if (globalSpaceOnly) {
    params.set("globalSpaceOnly", "true");
  }
  if (systemSpaceOnly) {
    params.set("systemSpaceOnly", "true");
  }

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/mcp/views?${params.toString()}`,
    mcpServerViewsFetcher,
    { disabled }
  );

  return {
    data: data?.serverViews ?? emptyArray(),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useAdminSystemSpaceMCPServerViews(
  props: AdminConditionalFetchProps
) {
  return useAdminMCPServerViews({ ...props, systemSpaceOnly: true });
}
