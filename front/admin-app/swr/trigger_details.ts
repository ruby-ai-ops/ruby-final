import type { AdminGetTriggerDetails } from "@app/lib/api/admin/triggers";
import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminTriggerDetailsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  triggerId: string;
}

export function useAdminTriggerDetails({
  disabled,
  owner,
  triggerId,
}: UseAdminTriggerDetailsProps) {
  const { fetcher } = useFetcher();
  const triggerDetailsFetcher: Fetcher<AdminGetTriggerDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/triggers/${triggerId}/details`,
    triggerDetailsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
