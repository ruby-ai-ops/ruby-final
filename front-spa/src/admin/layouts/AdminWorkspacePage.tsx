import AdminLayout from "@ruby-ai/front/components/admin/AdminLayout.tsx";
import type { AuthContextValue } from "@ruby-ai/front/lib/auth/AuthContext";
import { useAdminAuthContext } from "@ruby-ai/front/lib/swr/admin.ts";
import { Spinner } from "@ruby-ai/ui";
import { AuthErrorPage } from "@spa/app/components/AuthErrorPage";
import { useAppReadyContext } from "@spa/app/contexts/AppReadyContext";
import { useRequiredPathParam } from "@spa/lib/platform";
import { type ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminWorkspacePage({ children }: AdminLayoutProps) {
  const wId = useRequiredPathParam("wId");

  const { authContext, isAuthenticated, authContextError } = useAdminAuthContext(
    {
      workspaceId: wId,
    }
  );

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

  const fullAuthContext: AuthContextValue = {
    ...authContext,
    featureFlags: [],
    vizUrl: "",
    providersHealth: null,
  };

  return (
    <AdminLayout authContext={fullAuthContext}>
      {children ?? <Outlet />}
    </AdminLayout>
  );
}
