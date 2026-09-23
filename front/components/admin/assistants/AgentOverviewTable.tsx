import { RequestedSpacesList } from "@app/components/admin/assistants/RequestedSpacesList";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AgentConfigurationType } from "@app/types/assistant/agent";
import type { EnrichedSpaceType } from "@app/types/space";
import type { LightWorkspaceType, UserType } from "@app/types/user";
import { ContentMessage, InfoCircle } from "@ruby-ai/ui";

interface AgentOverviewTableProps {
  agentConfiguration: AgentConfigurationType;
  authors: UserType[];
  owner: LightWorkspaceType;
  spacesById: Map<string, EnrichedSpaceType>;
}

export function AgentOverviewTable({
  agentConfiguration,
  authors,
  owner,
  spacesById,
}: AgentOverviewTableProps) {
  const author = authors.find(
    (user) => user.id === agentConfiguration.versionAuthorId
  );

  const restrictedSpaces = agentConfiguration.requestedSpaceIds
    .map((spaceId) => spacesById.get(spaceId))
    .filter(
      (space): space is EnrichedSpaceType =>
        space !== undefined && space.isRestricted
    );

  return (
    <>
      <div className="flex grow flex-col rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-md grow pb-4 font-bold">
            {agentConfiguration.name}
          </h2>
        </div>
        {restrictedSpaces.length > 0 && (
          <ContentMessage
            title="Restricted space access"
            variant="warning"
            icon={InfoCircle}
            size="lg"
            className="mb-4 w-full"
          >
            <div className="flex flex-col gap-2">
              <div>
                Only users who are members of all restricted spaces can access
                this agent. API keys must also be scoped to include all of these
                spaces.
              </div>
              <RequestedSpacesList
                owner={owner}
                requestedSpaceIds={restrictedSpaces.map((space) => space.sId)}
                spacesById={spacesById}
              />
            </div>
          </ContentMessage>
        )}
        <AdminTable>
          <AdminTableBody>
            <AdminTableRow>
              <AdminTableCell>Description</AdminTableCell>
              <AdminTableCell>{agentConfiguration.description}</AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Scope</AdminTableCell>
              <AdminTableCell>
                <span className="capitalize">{agentConfiguration.scope}</span>
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Spaces</AdminTableCell>
              <AdminTableCell>
                <RequestedSpacesList
                  owner={owner}
                  requestedSpaceIds={agentConfiguration.requestedSpaceIds}
                  spacesById={spacesById}
                />
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Status</AdminTableCell>
              <AdminTableCell>
                <span className="capitalize">
                  {agentConfiguration.status} (v{agentConfiguration.version})
                </span>
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Created at</AdminTableCell>
              <AdminTableCell>
                {agentConfiguration.versionCreatedAt ?? "N/A"}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Created by</AdminTableCell>
              <AdminTableCell>
                {author ? `${author.fullName} (${author.email})` : "N/A"}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Max Steps</AdminTableCell>
              <AdminTableCell>{agentConfiguration.maxStepsPerRun}</AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Actions</AdminTableCell>
              <AdminTableCell>{agentConfiguration.actions.length}</AdminTableCell>
            </AdminTableRow>
          </AdminTableBody>
        </AdminTable>
      </div>
    </>
  );
}
