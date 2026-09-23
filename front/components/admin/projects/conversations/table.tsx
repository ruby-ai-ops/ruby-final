import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { makeColumnsForProjectConversations } from "@app/components/admin/projects/conversations/columns";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { useAdminProjectConversations } from "@app/admin-app/swr/project_conversations";
import type { AdminConditionalFetchProps } from "@app/admin-app/swr/types";
import type { LightWorkspaceType } from "@app/types/user";
import { Button } from "@ruby-ai/ui";
import { useState } from "react";

const PAGE_SIZE = 20;

interface ProjectConversationDataTableProps {
  owner: LightWorkspaceType;
  projectId: string;
}

export function ProjectConversationDataTable({
  owner,
  projectId,
}: ProjectConversationDataTableProps) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const useConversationsForProject = (props: AdminConditionalFetchProps) =>
    useAdminProjectConversations({ ...props, limit, projectId });

  return (
    <AdminDataTableConditionalFetch
      header="Conversations"
      owner={owner}
      useSWRHook={useConversationsForProject}
    >
      {({ conversations, hasMore, isLoadingMore }) => (
        <div className="flex flex-col gap-3">
          <AdminDataTable
            columns={makeColumnsForProjectConversations(owner)}
            data={conversations}
            pageSize={PAGE_SIZE}
          />
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                label="Load more"
                isLoading={isLoadingMore}
                onClick={() => setLimit((current) => current + PAGE_SIZE)}
              />
            </div>
          )}
        </div>
      )}
    </AdminDataTableConditionalFetch>
  );
}
