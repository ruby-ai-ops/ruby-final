import type { AdminListWebhookSources } from "@app/lib/api/admin/webhook_sources";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { Fetcher } from "swr";

export function useAdminWebhookSources({
  disabled,
  owner,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const webhookSourcesFetcher: Fetcher<AdminListWebhookSources> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/webhook_sources`,
    webhookSourcesFetcher,
    { disabled }
  );

  return {
    data: data?.webhookSources ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
