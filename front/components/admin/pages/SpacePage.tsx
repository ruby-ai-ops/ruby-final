import { DataSourceViewsDataTable } from "@app/components/admin/data_source_views/table";
import { GroupPermissionsDataTable } from "@app/components/admin/group_permissions/table";
import { MCPServerViewsDataTable } from "@app/components/admin/mcp_server_views/table";
import { MembersDataTable } from "@app/components/admin/members/table";
import { ProjectPage } from "@app/components/admin/pages/ProjectPage";
import { PluginList } from "@app/components/admin/plugins/PluginList";
import { ViewSpaceViewTable } from "@app/components/admin/spaces/view";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useRequiredPathParam } from "@app/lib/platform";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { useAdminSpaceDetails } from "@app/admin-app/swr/space_details";
import { LinkWrapper, Spinner } from "@ruby-ai/ui";

export function SpacePage() {
  const owner = useWorkspace();

  const spaceId = useRequiredPathParam("spaceId");
  const {
    data: spaceDetails,
    isLoading,
    isError,
  } = useAdminSpaceDetails({
    owner,
    spaceId,
    disabled: false,
  });

  useAdminPageMetadata({
    name: spaceDetails?.space.name,
    subtitle: owner.name,
    sId: spaceId,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !spaceDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Error loading space details.</p>
      </div>
    );
  }

  const { members, space } = spaceDetails;

  if (spaceDetails.space.kind === "project") {
    return <ProjectPage details={spaceDetails} />;
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        Space {space.name} ({space.kind}) within workspace{" "}
        <LinkWrapper href={`/admin/${owner.sId}`} className="text-highlight-500">
          {owner.name}
        </LinkWrapper>
      </h3>
      <div className="flex flex-row gap-x-6">
        <ViewSpaceViewTable space={space} />
        <div className="mt-4 flex grow flex-col">
          {Object.entries(members).map(([groupName, groupMembers]) => (
            <MembersDataTable
              key={groupName}
              groupName={groupName}
              members={groupMembers}
              owner={owner}
              readonly
            />
          ))}
          <PluginList
            pluginResourceTarget={{
              resourceId: space.sId,
              resourceType: "spaces",
              workspace: owner,
            }}
          />
          <DataSourceViewsDataTable owner={owner} spaceId={space.sId} />
          <MCPServerViewsDataTable owner={owner} spaceId={space.sId} />
          <GroupPermissionsDataTable
            owner={owner}
            resourceType="space"
            resourceId={space.id}
          />
        </div>
      </div>
    </>
  );
}
