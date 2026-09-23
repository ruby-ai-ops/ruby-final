import { useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { AdminGetDocument } from "@app/types/api/admin/data_sources";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminDocumentProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  dsId: string;
  documentId: string | null;
}

export function useAdminDocument({
  disabled,
  owner,
  dsId,
  documentId,
}: UseAdminDocumentProps) {
  const { fetcher } = useFetcher();
  const documentFetcher: Fetcher<AdminGetDocument> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    documentId
      ? `/api/admin/workspaces/${owner.sId}/data_sources/${dsId}/document?documentId=${encodeURIComponent(documentId)}`
      : null,
    documentFetcher,
    { disabled: disabled ?? !documentId }
  );

  return {
    data: data ?? null,
    isLoading: !error && !data && !disabled && !!documentId,
    isError: error,
    mutate,
  };
}
