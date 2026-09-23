// Contract types for the admin auth-context endpoints, used by the admin
// auth-context API routes (front-api/routes/admin/...).
import type { AdminRole } from "@app/lib/admin/roles";
import type { WorkspacePermissions } from "@app/types/group_permissions";
import type { SubscriptionType } from "@app/types/plan";
import type { LightWorkspaceType, UserType } from "@app/types/user";

export type GetAdminNoWorkspaceAuthContextResponseType = {
  user: UserType;
  isSuperUser: true;
  adminRoles: AdminRole[];
};

export type GetAdminWorkspaceAuthContextResponseType = {
  user: UserType;
  workspace: LightWorkspaceType;
  subscription: SubscriptionType;
  isAdmin: true; // Superusers have admin privileges
  isManager: true; // Superusers have manager privileges
  isSuperUser: true;
  workspacePermissions: WorkspacePermissions;
};
