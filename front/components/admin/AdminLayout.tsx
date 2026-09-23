import AdminNavbar from "@app/components/admin/AdminNavbar";
import { ThemeProvider } from "@app/components/ui/ThemeContext";
import type {
  AuthContextNoWorkspaceValue,
  AuthContextValue,
} from "@app/lib/auth/AuthContext";
import { AuthContext, AuthContextNoWorkspace } from "@app/lib/auth/AuthContext";
import type React from "react";

// Layout for workspace-scoped admin pages (uses AuthContext).
export default function AdminLayout({
  children,
  authContext,
}: {
  children: React.ReactNode;
  authContext: AuthContextValue;
}) {
  return (
    <AuthContext.Provider value={authContext}>
      <ThemeProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

// Layout for global admin pages without workspace (uses AuthContextNoWorkspace).
export function AdminLayoutNoWorkspace({
  children,
  authContext,
}: {
  children: React.ReactNode;
  authContext: AuthContextNoWorkspaceValue;
}) {
  return (
    <AuthContextNoWorkspace.Provider value={authContext}>
      <ThemeProvider>
        <AdminLayoutContent showCellPicker>{children}</AdminLayoutContent>
      </ThemeProvider>
    </AuthContextNoWorkspace.Provider>
  );
}

interface AdminLayoutContentProps {
  children: React.ReactNode;
  showCellPicker?: boolean;
}

const AdminLayoutContent = ({
  children,
  showCellPicker = false,
}: AdminLayoutContentProps) => {
  return (
    // Admin overrides the default border token with the form one: the subtle stone-100 border is
    // invisible on dense backoffice pages, and per-component overrides do not scale.
    <div className="min-h-dvh bg-background text-foreground [--color-border:var(--color-border-form)]">
      <AdminNavbar showCellPicker={showCellPicker} />
      <div className="flex flex-col p-6">{children}</div>
    </div>
  );
};
