import { RubyAppRouterLayout } from "@spa/app/layouts/RubyAppRouterLayout";
import { RequireFeatureFlagLayout } from "@spa/app/layouts/RequireFeatureFlagLayout";
import { withSuspense } from "@spa/app/routes/withSuspense";
import type { RouteObject } from "react-router-dom";

const AppSettingsPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/apps/AppSettingsPage"),
  "AppSettingsPage"
);
const AppSpecificationPage = withSuspense(
  () =>
    import("@ruby-ai/front/components/pages/spaces/apps/AppSpecificationPage"),
  "AppSpecificationPage"
);
const AppViewPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/apps/AppViewPage"),
  "AppViewPage"
);
const DatasetPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/apps/DatasetPage"),
  "DatasetPage"
);
const DatasetsPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/apps/DatasetsPage"),
  "DatasetsPage"
);
const NewDatasetPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/apps/NewDatasetPage"),
  "NewDatasetPage"
);
const RunPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/apps/RunPage"),
  "RunPage"
);
const RunsPage = withSuspense(
  () => import("@ruby-ai/front/components/pages/spaces/apps/RunsPage"),
  "RunsPage"
);

export const appsRoutes: RouteObject[] = [
  {
    element: <RequireFeatureFlagLayout flag="legacy_ruby_apps" />,
    children: [
      {
        path: "spaces/:spaceId/apps/:aId",
        element: <RubyAppRouterLayout />,
        children: [
          { index: true, element: <AppViewPage /> },
          { path: "settings", element: <AppSettingsPage /> },
          {
            path: "specification",
            element: <AppSpecificationPage />,
          },
          { path: "datasets", element: <DatasetsPage /> },
          { path: "datasets/new", element: <NewDatasetPage /> },
          { path: "datasets/:name", element: <DatasetPage /> },
          { path: "runs", element: <RunsPage /> },
          { path: "runs/:runId", element: <RunPage /> },
        ],
      },
    ],
  },
];
