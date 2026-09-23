import type {
  AdminFrameDatabase,
  AdminFrameDetails,
  AdminFrameFunction,
  AdminFrameListItem,
  AdminListFrameDatabases,
  AdminListFrameFunctions,
  AdminListFrames,
} from "@app/lib/api/admin/frames";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminFramesProps {
  disabled?: boolean;
  hasSandbox: boolean;
  limit: number;
  offset: number;
  owner: LightWorkspaceType;
}

export function useAdminFrames({
  disabled,
  hasSandbox,
  limit,
  offset,
  owner,
}: UseAdminFramesProps) {
  const { fetcher } = useFetcher();
  const framesFetcher: Fetcher<AdminListFrames> = fetcher;
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    hasSandbox: hasSandbox.toString(),
  });
  const { data, error, isValidating, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/frames?${params.toString()}`,
    framesFetcher,
    { disabled, keepPreviousData: true }
  );

  return {
    data: {
      items: data?.items ?? emptyArray<AdminFrameListItem>(),
      totalCount: data?.totalCount ?? 0,
      isValidating,
    },
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

interface UseAdminFrameDetailsProps {
  disabled?: boolean;
  frameId: string;
  owner: LightWorkspaceType;
}

export function useAdminFrameDetails({
  disabled,
  frameId,
  owner,
}: UseAdminFrameDetailsProps) {
  const { fetcher } = useFetcher();
  const detailsFetcher: Fetcher<AdminFrameDetails> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/frames/${frameId}`,
    detailsFetcher,
    { disabled }
  );

  return {
    details: data ?? null,
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

interface UseAdminFrameSubResourceProps {
  disabled?: boolean;
  frameId: string;
  owner: LightWorkspaceType;
}

export function useAdminFrameFunctions({
  disabled,
  frameId,
  owner,
}: UseAdminFrameSubResourceProps) {
  const { fetcher } = useFetcher();
  const functionsFetcher: Fetcher<AdminListFrameFunctions> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/frames/${frameId}/functions`,
    functionsFetcher,
    { disabled }
  );

  return {
    data: data?.items ?? emptyArray<AdminFrameFunction>(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}

export function useAdminFrameDatabases({
  disabled,
  frameId,
  owner,
}: UseAdminFrameSubResourceProps) {
  const { fetcher } = useFetcher();
  const databasesFetcher: Fetcher<AdminListFrameDatabases> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/frames/${frameId}/databases`,
    databasesFetcher,
    { disabled }
  );

  return {
    data: data?.items ?? emptyArray<AdminFrameDatabase>(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
