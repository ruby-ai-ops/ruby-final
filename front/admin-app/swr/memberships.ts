import type {
  AdminGetMemberships,
  AdminSearchWorkspaceMembers,
} from "@app/lib/api/admin/memberships";
import { parseAdminSearchWorkspaceMembers } from "@app/lib/api/admin/memberships";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { LightWorkspaceType } from "@app/types/user";
import { useCallback } from "react";
import type { Fetcher } from "swr";

export function useAdminMemberships({
  disabled,
  owner,
}: AdminConditionalFetchProps) {
  const { fetcher } = useFetcher();
  const membershipsFetcher: Fetcher<AdminGetMemberships> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/memberships`,
    membershipsFetcher,
    { disabled }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

export function useAdminWorkspaceMembersSearch({
  disabled,
  limit = 25,
  owner,
  query,
}: {
  disabled?: boolean;
  limit?: number;
  owner: Pick<LightWorkspaceType, "sId">;
  query: string;
}) {
  const { fetcher } = useFetcher();

  const searchFetcher: Fetcher<AdminSearchWorkspaceMembers> = useCallback(
    async (url: string) => {
      const json = await fetcher(url);
      return parseAdminSearchWorkspaceMembers(json);
    },
    [fetcher]
  );

  const params = new URLSearchParams({ limit: String(limit) });
  if (query.trim()) {
    params.set("q", query.trim());
  }

  const { data, error, isValidating } = useSWRWithDefaults(
    disabled
      ? null
      : `/api/admin/workspaces/${owner.sId}/memberships/search?${params.toString()}`,
    searchFetcher,
    { disabled, keepPreviousData: true, revalidateOnFocus: false }
  );

  return {
    members: data?.members ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    isValidating,
  };
}
