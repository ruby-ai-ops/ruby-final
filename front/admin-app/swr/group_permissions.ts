import type { AdminListGroupPermissions } from "@app/lib/api/admin/group_permissions";
import { emptyArray, useFetcher, useSWRWithDefaults } from "@app/lib/swr/swr";
import type { GroupPermissionResourceType } from "@app/types/group_permissions";
import type { LightWorkspaceType } from "@app/types/user";
import type { Fetcher } from "swr";

interface UseAdminGroupPermissionsProps {
  disabled?: boolean;
  owner: LightWorkspaceType;
  // Pass either a groupId (grants held by that group) or a resourceType +
  // resourceId (grants that apply to that resource instance).
  groupId?: string;
  resourceType?: GroupPermissionResourceType;
  resourceId?: number;
}

export function useAdminGroupPermissions({
  disabled,
  owner,
  groupId,
  resourceType,
  resourceId,
}: UseAdminGroupPermissionsProps) {
  const { fetcher } = useFetcher();
  const groupPermissionsFetcher: Fetcher<AdminListGroupPermissions> = fetcher;

  const params = new URLSearchParams();
  if (groupId !== undefined) {
    params.set("groupId", groupId);
  }
  if (resourceType !== undefined) {
    params.set("resourceType", resourceType);
  }
  if (resourceId !== undefined) {
    params.set("resourceId", String(resourceId));
  }

  const { data, error, mutate } = useSWRWithDefaults(
    `/api/admin/workspaces/${owner.sId}/group_permissions?${params.toString()}`,
    groupPermissionsFetcher,
    { disabled }
  );

  return {
    data: data?.groupPermissions ?? emptyArray(),
    isLoading: !error && !data && !disabled,
    isError: error,
    mutate,
  };
}
