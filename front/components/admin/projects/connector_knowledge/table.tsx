import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { makeColumnsForProjectConnectorKnowledge } from "@app/components/admin/projects/connector_knowledge/columns";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminProjectConnectorKnowledge } from "@app/admin-app/swr/project_connector_knowledge";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { WorkspaceType } from "@app/types/user";

interface ProjectConnectorKnowledgeDataTableProps {
  owner: WorkspaceType;
  projectId: string;
}

export function ProjectConnectorKnowledgeDataTable({
  owner,
  projectId,
}: ProjectConnectorKnowledgeDataTableProps) {
  const useConnectorKnowledgeForProject = (props: AdminConditionalFetchProps) =>
    useAdminProjectConnectorKnowledge({ ...props, projectId });

  return (
    <AdminDataTableConditionalFetch
      header="Knowledge from connectors"
      owner={owner}
      useSWRHook={useConnectorKnowledgeForProject}
    >
      {(items) => (
        <AdminDataTable
          columns={makeColumnsForProjectConnectorKnowledge(owner)}
          data={items}
        />
      )}
    </AdminDataTableConditionalFetch>
  );
}
