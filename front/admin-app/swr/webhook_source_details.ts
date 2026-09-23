import type { AdminGetWebhookSourceDetails } from "@app/lib/api/admin/webhook_sources";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminWebhookSourceDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  webhookSourceId: string;
}

export function useAdminWebhookSourceDetails({
  disabled,
  owner,
  webhookSourceId,
}: UseAdminWebhookSourceDetailsProps) {
  const { fetcher } = useFetcher();
  const detailsFetcher: Fetcher<AdminGetWebhookSourceDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/webhook_sources/${webhookSourceId}/details`,
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
