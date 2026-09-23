import type { AdminListProjectTasks } from "@app/lib/api/admin/projects";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminProjectTasksProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  projectId: string;
}

export function useAdminProjectTasks({
  disabled,
  owner,
  projectId,
}: UseAdminProjectTasksProps) {
  const { fetcher } = useFetcher();
  const tasksFetcher: Fetcher<AdminListProjectTasks> = fetcher;
  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/projects/${projectId}/tasks`,
    tasksFetcher,
    { disabled }
  );

  return {
    data: data?.tasks ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
