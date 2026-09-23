import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { makeColumnsForProjectTasks } from "@app/components/admin/projects/tasks/columns";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminProjectTasks } from "@app/admin-app/swr/project_tasks";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { WorkspaceType } from "@app/types/user";

interface ProjectTasksDataTableProps {
  owner: WorkspaceType;
  projectId: string;
}

export function ProjectTasksDataTable({
  owner,
  projectId,
}: ProjectTasksDataTableProps) {
  const useTasksForProject = (props: AdminConditionalFetchProps) =>
    useAdminProjectTasks({ ...props, projectId });

  return (
    <AdminDataTableConditionalFetch
      header="Tasks"
      owner={owner}
      useSWRHook={useTasksForProject}
    >
      {(tasks) => (
        <AdminDataTable
          columns={makeColumnsForProjectTasks(owner)}
          data={tasks}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
