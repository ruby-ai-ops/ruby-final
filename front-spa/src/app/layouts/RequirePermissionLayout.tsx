import { AdminLayout } from "@ruby-ai/front/components/layouts/AdminLayout";
import Custom404 from "@ruby-ai/front/components/pages/Custom404";
import { useWorkspacePermissions } from "@ruby-ai/front/lib/swr/permissions.js";
import type {
  ConcreteResourceType,
  GrantVerb,
} from "@ruby-ai/front/types/group_permissions";
import { Outlet } from "react-router-dom";

interface RequirePermissionLayoutProps {
  verb: GrantVerb;
  resourceType: ConcreteResourceType;
}

export function RequirePermissionLayout({
  verb,
  resourceType,
}: RequirePermissionLayoutProps) {
  const { hasPermission } = useWorkspacePermissions();

  const hasRequiredPermission = hasPermission(verb, resourceType);

  if (!hasRequiredPermission) {
    return <Custom404 />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
