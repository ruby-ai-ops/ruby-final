import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { GetAdminFileResponseBody } from "@app/types/api/admin/files";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

export function useAdminFileDetails({
  owner,
  sId,
  disabled,
}: {
  owner: LightWorkspaceType;
  sId: string | null;
  disabled?: boolean;
}) {
  const { fetcher } = useFetcher();
  const fileFetcher: Fetcher<GetAdminFileResponseBody> = fetcher;

  const { data, error, mutate } = useSWRWithDefaults(
    sId ? `/api/admin/workspaces/${owner.sId}/files/${sId}` : null,
    fileFetcher,
    { disabled: disabled || !sId }
  );

  return {
    file: data?.file ?? null,
    content: data?.content ?? null,
    shareInfo: data?.shareInfo ?? null,
    sharingGrants: data?.sharingGrants ?? [],
    isFileLoading: !error && !data && !disabled && !!sId,
    isFileError: error,
    mutateFile: mutate,
  };
}
