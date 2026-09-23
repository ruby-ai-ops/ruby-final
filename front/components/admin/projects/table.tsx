import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { makeColumnsForProjects } from "@app/components/admin/projects/columns";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminProjects } from "@app/admin-app/swr/projects";
import type { WorkspaceType } from "@app/types/user";

interface ProjectsDataTableProps {
  owner: WorkspaceType;
  loadOnInit?: boolean;
}

export function ProjectsDataTable({
  owner,
  loadOnInit,
}: ProjectsDataTableProps) {
  return (
    <AdminDataTableConditionalFetch
      header="Pods"
      owner={owner}
      loadOnInit={loadOnInit}
      useSWRHook={useAdminProjects}
    >
      {(data) => (
        <AdminDataTable columns={makeColumnsForProjects(owner)} data={data} />
      )}
    </AdminDataTableConditionalFetch>
  );
}
