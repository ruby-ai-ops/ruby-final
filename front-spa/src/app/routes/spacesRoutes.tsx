import { RequireFeatureFlagLayout } from "@spa/app/layouts/RequireFeatureFlagLayout";
import { SpaceRouterLayout } from "@spa/app/layouts/SpaceRouterLayout";
import { withSuspense } from "@spa/app/routes/withSuspense";
import type { RouteObject } from "react-router-dom";

const DataSourceViewPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/DataSourceViewPage"),
  "DataSourceViewPage"
);
const SpaceActionsPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/SpaceActionsPage"),
  "SpaceActionsPage"
);
const SpaceAppsListPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/SpaceAppsListPage"),
  "SpaceAppsListPage"
);
const SpaceCategoryPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/SpaceCategoryPage"),
  "SpaceCategoryPage"
);
const SpacePage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/SpacePage"),
  "SpacePage"
);
const SpacesRedirectPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/SpacesRedirectPage"),
  "SpacesRedirectPage"
);
const SpaceTriggersPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/SpaceTriggersPage"),
  "SpaceTriggersPage"
);

export const spacesRoutes: RouteObject[] = [
  {
    path: "spaces/:spaceId",
    element: <SpaceRouterLayout />,
    children: [
      { index: true, element: <SpacePage /> },
      {
        path: "categories/actions",
        element: <SpaceActionsPage />,
      },
      {
        element: <RequireFeatureFlagLayout flag="legacy_ruby_apps" />,
        children: [{ path: "categories/apps", element: <SpaceAppsListPage /> }],
      },
      {
        path: "categories/triggers",
        element: <SpaceTriggersPage />,
      },
      {
        path: "categories/:category",
        element: <SpaceCategoryPage />,
      },
      {
        path: "categories/:category/data_source_views/:dataSourceViewId",
        element: <DataSourceViewPage />,
      },
    ],
  },
];

export const spacesRedirectRoutes: RouteObject[] = [
  {
    path: "spaces",
    element: <SpacesRedirectPage />,
  },
];
