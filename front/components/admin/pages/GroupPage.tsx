import { GroupPermissionsDataTable } from "@app/components/admin/group_permissions/table";
import { ViewGroupTable } from "@app/components/admin/groups/view";
import { MembersDataTable } from "@app/components/admin/members/table";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useRequiredPathParam } from "@app/lib/platform";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { useAdminGroupDetails } from "@app/admin-app/swr/group_details";
import { LinkWrapper, Spinner } from "@ruby-ai/ui";

export function GroupPage() {
  const owner = useWorkspace();

  const groupId = useRequiredPathParam("groupId");
  const {
    data: groupDetails,
    isLoading,
    isError,
  } = useAdminGroupDetails({
    owner,
    groupId,
    disabled: false,
  });

  useAdminPageMetadata({
    name: groupDetails?.group.name,
    subtitle: owner.name,
    sId: groupId,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !groupDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Error loading group details.</p>
      </div>
    );
  }

  const { members, group } = groupDetails;

  return (
    <>
      <h3 className="text-xl font-bold">
        Group {group.name} ({group.kind}) within workspace{" "}
        <LinkWrapper href={`/admin/${owner.sId}`} className="text-highlight-500">
          {owner.name}
        </LinkWrapper>
      </h3>
      <div className="flex flex-row gap-x-6">
        <ViewGroupTable group={group} />
        <MembersDataTable members={members} owner={owner} readonly />
      </div>
      <GroupPermissionsDataTable owner={owner} groupId={groupId} />
    </>
  );
}
