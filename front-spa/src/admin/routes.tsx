import Custom404 from "@ruby-ai/front/components/pages/Custom404";
import { AnalyticsPage } from "@ruby-ai/front/components/admin/pages/AnalyticsPage";
import { AppPage } from "@ruby-ai/front/components/admin/pages/AppPage";
import { AssistantDetailsPage } from "@ruby-ai/front/components/admin/pages/AssistantDetailsPage";
import { AssistantInstructionsPage } from "@ruby-ai/front/components/admin/pages/AssistantInstructionsPage";
import { CacheLookupPage } from "@ruby-ai/front/components/admin/pages/CacheLookupPage";
import { ConnectorRedirectPage } from "@ruby-ai/front/components/admin/pages/ConnectorRedirectPage";
import { ConversationPage } from "@ruby-ai/front/components/admin/pages/ConversationPage";
import { CouponsPage } from "@ruby-ai/front/components/admin/pages/CouponsPage";
import { DashboardPage } from "@ruby-ai/front/components/admin/pages/DashboardPage";
import { DataSourcePage } from "@ruby-ai/front/components/admin/pages/DataSourcePage";
import { DataSourceQueryPage } from "@ruby-ai/front/components/admin/pages/DataSourceQueryPage";
import { DataSourceSearchPage } from "@ruby-ai/front/components/admin/pages/DataSourceSearchPage";
import { DataSourceViewPage } from "@ruby-ai/front/components/admin/pages/DataSourceViewPage";
import { EmailTemplatesPage } from "@ruby-ai/front/components/admin/pages/EmailTemplatesPage";
import { FeatureFlagDetailPage } from "@ruby-ai/front/components/admin/pages/FeatureFlagDetailPage";
import { FeatureFlagsPage } from "@ruby-ai/front/components/admin/pages/FeatureFlagsPage";
import { FrameFunctionPage } from "@ruby-ai/front/components/admin/pages/FrameFunctionPage";
import { FramePage } from "@ruby-ai/front/components/admin/pages/FramePage";
import { GlobalAgentFeedbacksPage } from "@ruby-ai/front/components/admin/pages/GlobalAgentFeedbacksPage";
import { GroupPage } from "@ruby-ai/front/components/admin/pages/GroupPage";
import { KillPage } from "@ruby-ai/front/components/admin/pages/KillPage";
import { LLMTracePage } from "@ruby-ai/front/components/admin/pages/LLMTracePage";
import { MCPServerViewPage } from "@ruby-ai/front/components/admin/pages/MCPServerViewPage";
import { MembershipsPage } from "@ruby-ai/front/components/admin/pages/MembershipsPage";
import { NotionRequestsPage } from "@ruby-ai/front/components/admin/pages/NotionRequestsPage";
import { PlansPage } from "@ruby-ai/front/components/admin/pages/PlansPage";
import { PluginsPage } from "@ruby-ai/front/components/admin/pages/PluginsPage";
import { AdminifyPage } from "@ruby-ai/front/components/admin/pages/AdminifyPage";
import { PoolUsagePage } from "@ruby-ai/front/components/admin/pages/PoolUsagePage";
import { ProductionChecksPage } from "@ruby-ai/front/components/admin/pages/ProductionChecksPage";
import { SkillDetailsPage } from "@ruby-ai/front/components/admin/pages/SkillDetailsPage";
import { SkillSuggestionDetailsPage } from "@ruby-ai/front/components/admin/pages/SkillSuggestionDetailsPage";
import { SpaceDataSourceViewPage } from "@ruby-ai/front/components/admin/pages/SpaceDataSourceViewPage";
import { SpacePage } from "@ruby-ai/front/components/admin/pages/SpacePage";
import { TemplateDetailPage } from "@ruby-ai/front/components/admin/pages/TemplateDetailPage";
import { TemplatesListPage } from "@ruby-ai/front/components/admin/pages/TemplatesListPage";
import { TriggerDetailsPage } from "@ruby-ai/front/components/admin/pages/TriggerDetailsPage";
import { WebhookSourceDetailsPage } from "@ruby-ai/front/components/admin/pages/WebhookSourceDetailsPage";
import { WorkspacePage } from "@ruby-ai/front/components/admin/pages/WorkspacePage";
import { GlobalErrorFallback } from "@spa/app/components/GlobalErrorFallback";
import { RootRouterLayout } from "@spa/app/layouts/RootRouterLayout";
import { UnauthenticatedPage } from "@spa/app/layouts/UnauthenticatedPage";
import { AdminPage } from "@spa/admin/layouts/AdminPage";
import { AdminWorkspacePage } from "@spa/admin/layouts/AdminWorkspacePage";
import type { RouteObject } from "react-router-dom";
import { Navigate, useLocation, useParams } from "react-router-dom";

// Redirect component that strips /admin prefix
function AdminRedirect() {
  const params = useParams();
  const location = useLocation();
  const rest = params["*"] || "";
  return <Navigate to={`/${rest}${location.search}${location.hash}`} replace />;
}

// Redirect app-style builder/agents/:aId to admin-style assistants/:aId.
function BuilderAgentRedirect() {
  const { aId } = useParams();
  const location = useLocation();
  return (
    <Navigate
      to={`../assistants/${aId}${location.search}${location.hash}`}
      replace
    />
  );
}

export const routes: RouteObject[] = [
  {
    element: <RootRouterLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: "/",
        element: <AdminPage />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "kill", element: <KillPage /> },
          { path: "plans", element: <PlansPage /> },
          { path: "coupons", element: <CouponsPage /> },
          { path: "adminify", element: <AdminifyPage /> },
          { path: "feature-flags", element: <FeatureFlagsPage /> },
          {
            path: "feature-flags/:flagName",
            element: <FeatureFlagDetailPage />,
          },
          { path: "production-checks", element: <ProductionChecksPage /> },
          { path: "email-templates", element: <EmailTemplatesPage /> },
          {
            path: "global-agent-feedbacks",
            element: <GlobalAgentFeedbacksPage />,
          },
          { path: "templates", element: <TemplatesListPage /> },
          { path: "templates/:tId", element: <TemplateDetailPage /> },
          { path: "plugins", element: <PluginsPage /> },
          { path: "cache", element: <CacheLookupPage /> },
          {
            path: "connectors/:connectorId",
            element: <ConnectorRedirectPage />,
          },
        ],
      },
      {
        path: "/:wId",
        element: <AdminWorkspacePage />,
        children: [
          { index: true, element: <WorkspacePage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "pool-usage", element: <PoolUsagePage /> },
          { path: "memberships", element: <MembershipsPage /> },
          { path: "llm-traces/:runId", element: <LLMTracePage /> },
          {
            path: "assistants/:aId/instructions",
            element: <AssistantInstructionsPage />,
          },
          { path: "assistants/:aId", element: <AssistantDetailsPage /> },
          {
            path: "assistants/:aId/triggers/:triggerId",
            element: <TriggerDetailsPage />,
          },
          { path: "conversation/:cId", element: <ConversationPage /> },
          { path: "data_sources/:dsId", element: <DataSourcePage /> },
          {
            path: "data_sources/:dsId/notion-requests",
            element: <NotionRequestsPage />,
          },
          {
            path: "data_sources/:dsId/query",
            element: <DataSourceQueryPage />,
          },
          {
            path: "data_sources/:dsId/search",
            element: <DataSourceSearchPage />,
          },
          {
            path: "data_sources/:dsId/view",
            element: <DataSourceViewPage />,
          },
          {
            path: "connectors/:connectorId",
            element: <ConnectorRedirectPage />,
          },
          { path: "groups/:groupId", element: <GroupPage /> },
          { path: "files/:sId", element: <FramePage /> },
          {
            path: "files/:sId/functions/:functionId",
            element: <FrameFunctionPage />,
          },
          { path: "skills/:sId", element: <SkillDetailsPage /> },
          {
            path: "suggestions/:suggestionId",
            element: <SkillSuggestionDetailsPage />,
          },
          { path: "spaces/:spaceId", element: <SpacePage /> },
          { path: "spaces/:spaceId/apps/:appId", element: <AppPage /> },
          {
            path: "spaces/:spaceId/data_source_views/:dsvId",
            element: <SpaceDataSourceViewPage />,
          },
          {
            path: "spaces/:spaceId/mcp_server_views/:svId",
            element: <MCPServerViewPage />,
          },
          {
            path: "webhook-sources/:wsId",
            element: <WebhookSourceDetailsPage />,
          },
          // Redirect app-style URLs to admin-style URLs.
          {
            path: "builder/agents/:aId",
            element: <BuilderAgentRedirect />,
          },
        ],
      },
      // Redirect /admin/* to /* (strip /admin prefix)
      { path: "admin/*", element: <AdminRedirect /> },
      { path: "w/*", element: <AdminRedirect /> },
      {
        element: <UnauthenticatedPage />,
        children: [{ path: "*", element: <Custom404 /> }],
      },
    ],
  },
];
