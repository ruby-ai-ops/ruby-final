import type { AdminListProjectKnowledgeFromConnectors } from "@app/lib/api/admin/projects";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminProjectConnectorKnowledgeProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  projectId: string;
}

export function useAdminProjectConnectorKnowledge({
  disabled,
  owner,
  projectId,
}: UseAdminProjectConnectorKnowledgeProps) {
  const { fetcher } = useFetcher();
  const connectorKnowledgeFetcher: Fetcher<AdminListProjectKnowledgeFromConnectors> =
    fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/projects/${projectId}/connector-knowledge`,
    connectorKnowledgeFetcher,
    { disabled }
  );

  return {
    data:
      data?.items ??
      emptyArray<AdminListProjectKnowledgeFromConnectors["items"][number]>(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
