import { ConversationLayout } from "@ruby-ai/front/components/assistant/conversation/ConversationLayout";
import { useAuth, useWorkspace } from "@ruby-ai/front/lib/auth/AuthContext";
import { Outlet } from "react-router-dom";

/**
 * Router layout that provides ConversationLayout for SPA conversation routes.
 * Gets auth context from AppAuthContextLayout and passes it to ConversationLayout.
 */
export function ConversationRouterLayout() {
  const owner = useWorkspace();
  const {
    subscription,
    user,
    isAdmin,
    isManager,
    featureFlags,
    vizUrl,
    providersHealth,
    workspacePermissions,
  } = useAuth();

  const pageProps = {
    workspace: owner,
    subscription,
    user,
    isAdmin,
    isManager,
    featureFlags,
    vizUrl,
    providersHealth,
    workspacePermissions,
  };

  return (
    <ConversationLayout pageProps={pageProps}>
      <Outlet />
    </ConversationLayout>
  );
}
