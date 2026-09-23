import { AppContentLayout } from "@ruby-ai/front/components/ui/AppContentLayout";
import { AppLayoutProvider } from "@ruby-ai/front/components/ui/AppLayoutContext";
import { Outlet } from "react-router-dom";

/**
 * Router layout that provides the shared AppContentLayout (navigation sidebar, title bar, etc.)
 * for SPA routes. Pages configure the layout via useAppLayoutConfig().
 *
 * Routes that don't need the layout chrome (onboarding, agent/skill builders)
 * should be placed outside this layout.
 */
export function AppContentRouterLayout() {
  return (
    <AppLayoutProvider>
      <AppContentLayout>
        <Outlet />
      </AppContentLayout>
    </AppLayoutProvider>
  );
}
