import { AdminLayoutNoWorkspace } from "@ruby-ai/front/components/admin/AdminLayout.tsx";
import { useAdminAuthContext } from "@ruby-ai/front/lib/swr/admin.ts";
import { Spinner } from "@ruby-ai/ui";
import { AuthErrorPage } from "@spa/app/components/AuthErrorPage";
import { useAppReadyContext } from "@spa/app/contexts/AppReadyContext";
import { type ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminPage({ children }: AdminLayoutProps) {
  const { authContext, isAuthenticated, authContextError } =
    useAdminAuthContext();

  const signalAppReady = useAppReadyContext();

  useEffect(() => {
    if ((isAuthenticated && authContext) || authContextError) {
      signalAppReady();
    }
  }, [isAuthenticated, authContext, authContextError, signalAppReady]);

  if (authContextError) {
    return <AuthErrorPage error={authContextError} />;
  }

  if (!isAuthenticated || !authContext) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <AdminLayoutNoWorkspace authContext={authContext}>
      {children ?? <Outlet />}
    </AdminLayoutNoWorkspace>
  );
}
