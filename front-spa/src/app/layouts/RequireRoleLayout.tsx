import { AdminLayout } from "@ruby-ai/front/components/layouts/AdminLayout";
import Custom404 from "@ruby-ai/front/components/pages/Custom404";
import { useAuth } from "@ruby-ai/front/lib/auth/AuthContext";
import { isAdmin, isManager, type RoleType } from "@ruby-ai/front/types/user";
import { Outlet } from "react-router-dom";

interface RequireRoleProps {
  requiredRole: Extract<RoleType, "admin" | "manager">;
}

export function RequireRoleLayout({ requiredRole }: RequireRoleProps) {
  const { workspace } = useAuth();

  const hasRequiredRole =
    requiredRole === "admin" ? isAdmin(workspace) : isManager(workspace);

  if (!hasRequiredRole) {
    return <Custom404 />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
