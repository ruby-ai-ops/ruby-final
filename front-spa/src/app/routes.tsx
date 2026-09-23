import Custom404 from "@ruby-ai/front/components/pages/Custom404";
import { GlobalErrorFallback } from "@spa/app/components/GlobalErrorFallback";
import { AgentSurfaceRouterLayout } from "@spa/app/layouts/AgentSurfaceRouterLayout";
import { AppContentRouterLayout } from "@spa/app/layouts/AppContentRouterLayout";
import { RootRouterLayout } from "@spa/app/layouts/RootRouterLayout";
import { UnauthenticatedPage } from "@spa/app/layouts/UnauthenticatedPage";
import { WorkspacePage } from "@spa/app/layouts/WorkspacePage";
import { IndexPage } from "@spa/app/pages/IndexPage";
import { adminFullPageRoutes, adminRoutes } from "@spa/app/routes/adminRoutes";
import { appsRoutes } from "@spa/app/routes/appsRoutes";
import {
  builderAgentSurfaceRoutes,
  builderContentRoutes,
  builderFullPageRoutes,
  builderRedirectRoutes,
} from "@spa/app/routes/builderRoutes";
import {
  conversationRedirectRoutes,
  conversationRoutes,
} from "@spa/app/routes/conversationRoutes";
import { getStartedRoutes } from "@spa/app/routes/getStartedRoutes";
import { labsRoutes } from "@spa/app/routes/labsRoutes";
import {
  loginAuthenticatedRoutes,
  loginUnauthenticatedRoutes,
} from "@spa/app/routes/loginRoutes";
import { onboardingRoutes } from "@spa/app/routes/onboardingRoutes";
import { podsRoutes } from "@spa/app/routes/podsRoutes";
import {
  spacesRedirectRoutes,
  spacesRoutes,
} from "@spa/app/routes/spacesRoutes";
import { withSuspense } from "@spa/app/routes/withSuspense";
import type { RouteObject } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MaintenancePage = withSuspense(
  () => import("@ruby-ai/front/components/pages/MaintenancePage"),
  "MaintenancePage"
);

// Redirect /admin/* to the admin app (admin.ruby.ad)
function AdminRedirect() {
  const location = useLocation();
  const adminPath = location.pathname.replace(/^\/admin/, "");
  const adminOrigin = window.location.origin.replace("://app.", "://admin.");
  window.location.replace(
    `${adminOrigin}${adminPath}${location.search}${location.hash}`
  );
  return null;
}

export const routes: RouteObject[] = [
  {
    element: <RootRouterLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      { path: "/", element: <IndexPage /> },
      {
        path: "/w/:wId",
        element: <WorkspacePage />,
        children: [
          // Routes WITH shared AppContentLayout (navigation, sidebar, title bar)
          {
            element: <AppContentRouterLayout />,
            children: [
              // Surfaces that share the agent sidebar. They hang off a single layout route so
              // the sidebar is mounted once and survives navigation between them.
              {
                element: <AgentSurfaceRouterLayout />,
                children: [
                  ...conversationRoutes,
                  ...podsRoutes,
                  ...getStartedRoutes,
                  ...builderAgentSurfaceRoutes,
                  ...labsRoutes,
                ],
              },
              ...adminRoutes,
              ...spacesRoutes,
              ...appsRoutes,
              ...builderContentRoutes,
              ...spacesRedirectRoutes,
            ],
          },

          // Routes WITHOUT AppContentLayout (no sidebar/navigation chrome)
          ...adminFullPageRoutes,
          ...builderFullPageRoutes,
          ...builderRedirectRoutes,
          ...conversationRedirectRoutes,
          ...onboardingRoutes,
        ],
      },
      // Login (authenticated routes + logout)
      ...loginAuthenticatedRoutes,
      // Redirect /admin/* to the admin app (e.g., admin.ruby.ad)
      { path: "/admin/*", element: <AdminRedirect /> },
      // Login (unauthenticated routes)
      ...loginUnauthenticatedRoutes,
      // Global catch-all routes
      {
        element: <UnauthenticatedPage />,
        children: [
          { path: "/maintenance", element: <MaintenancePage /> },
          { path: "*", element: <Custom404 /> },
        ],
      },
    ],
  },
];
