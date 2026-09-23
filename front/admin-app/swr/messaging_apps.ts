import type { AdminGetMessagingApps } from "@app/lib/api/admin/messaging_apps";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

export function useAdminMessagingApps({
  disabled,
  owner,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const messagingAppsFetcher: Fetcher<AdminGetMessagingApps> = fetcher;

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/messaging_apps`,
    messagingAppsFetcher,
    { disabled }
  );

  return {
    data: data?.messagingApps ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
