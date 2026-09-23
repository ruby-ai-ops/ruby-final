import { AppDataTable } from "@app/components/admin/apps/table";
import { AssistantsDataTable } from "@app/components/admin/assistants/table";
import { AdminUsageTab } from "@app/components/admin/credits/AdminUsageTab";
import { CreditsDataTable } from "@app/components/admin/credits/table";
import { DataSourceViewsDataTable } from "@app/components/admin/data_source_views/table";
import { DataSourceDataTable } from "@app/components/admin/data_sources/table";
import { FeatureFlagsDataTable } from "@app/components/admin/features/table";
import { FramesDataTable } from "@app/components/admin/frames/table";
import { GovernanceTab } from "@app/components/admin/governance/GovernanceTab";
import { GroupDataTable } from "@app/components/admin/groups/table";
import { MCPServerViewsDataTable } from "@app/components/admin/mcp_server_views/table";
import { PluginList } from "@app/components/admin/plugins/PluginList";
import { ProjectsDataTable } from "@app/components/admin/projects/table";
import {
  AdminAlert,
  AdminAlertDescription,
  AdminAlertTitle,
} from "@app/components/admin/shadcn/ui/alert";
import { SkillsDataTable } from "@app/components/admin/skills/table";
import { SpaceDataTable } from "@app/components/admin/spaces/table";
import {
  ActiveSubscriptionTable,
  PlanLimitationsTable,
} from "@app/components/admin/subscriptions/table";
import { TriggerDataTable } from "@app/components/admin/triggers/table";
import { WebhookSourceDataTable } from "@app/components/admin/webhook_sources/table";
import { WorkspaceMetadataTab } from "@app/components/admin/workspace/MetadataTab";
import { WorkspaceInfoTable } from "@app/components/admin/workspace/table";
import { WorkspaceAnalyticsButton } from "@app/components/admin/workspace/WorkspaceAnalyticsButton";
import { WorkspacePoolUsageButton } from "@app/components/admin/workspace/WorkspacePoolUsageButton";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useCellContext } from "@app/lib/auth/CellContext";
import { useSubmitFunction } from "@app/lib/client/utils";
import { clientFetch } from "@app/lib/egress/client";
import { useAppRouter } from "@app/lib/platform";
import { getCellChipColor, getCellDisplay } from "@app/lib/admin/cells";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { useAdminDataRetention } from "@app/admin-app/swr/data_retention";
import { useAdminWorkspaceInfo } from "@app/admin-app/swr/workspace_info";
import { isString } from "@app/types/shared/utils/general";
import type { WorkspaceSegmentationType } from "@app/types/user";
import {
  Button,
  Chip,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ruby-ai/ui";

export function WorkspacePage() {
  const owner = useWorkspace();
  useAdminPageMetadata({ name: owner.name ?? "Workspace", sId: owner.sId });
  const { cellInfo: currentCell } = useCellContext();

  const router = useAppRouter();

  const {
    data: workspaceInfo,
    isLoading,
    isError,
  } = useAdminWorkspaceInfo({
    owner,
    disabled: false,
  });

  const currentTab = !isString(router.query.tab)
    ? "datasources"
    : router.query.tab;

  const handleTabChange = (value: string) => {
    void router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: value },
      },
      undefined,
      { shallow: true }
    );
  };

  const { submit: onWorkspaceUpdate } = useSubmitFunction(
    async (segmentation: WorkspaceSegmentationType) => {
      try {
        const r = await clientFetch(`/api/admin/workspaces/${owner.sId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            segmentation,
          }),
        });
        if (!r.ok) {
          throw new Error("Failed to update workspace.");
        }
        router.reload();
      } catch {
        window.alert("An error occurred while updating the workspace.");
      }
    }
  );

  const { data: dataRetention } = useAdminDataRetention({
    owner,
    disabled: false,
  });

  const agentsRetention = dataRetention?.agents ?? {};
  const isInMaintenance = owner.metadata?.maintenance;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !workspaceInfo) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Error loading workspace information.</p>
      </div>
    );
  }

  const {
    activeSubscription,
    hasDummyFeature,
    hasMetronomeFeature,
    inactiveMembersCount,
    membersCount,
    metronomeCustomerId,
    pendingSubscription,
    planLimitOverride,
    poolCreditState,
    poolAlert,
    programmaticAlerts,
    usageCapAlert,
    defaultAlerts,
    programmaticRateLimiterState,
    programmaticSpendLimitRateCapCount,
    programmaticEsConsumedAwuCredits,
    programmaticMetronomeConsumedAwuCredits,
    seatPlan,
    stripeSubscription,
    stripeCustomerId,
    subscriptions,
    whitelistableFeatures,
    workspaceVerifiedDomains,
    workspaceCreationDay,
    extensionConfig,
    creditUsageConfig,
    programmaticUsageConfig,
    workosEnvironmentId,
    temporalFrontNamespace,
  } = workspaceInfo;

  // Credit diagnostics are backed by Metronome usage data, so they apply to
  // any workspace with a Metronome contract — both credit-priced and legacy
  // shadow contracts. The activity chart itself is available to every
  // workspace.
  const hasMetronomeBillingUsage =
    metronomeCustomerId !== null &&
    activeSubscription.metronomeContractId !== null;
  return (
    <div className="ml-8 p-6">
      {isInMaintenance && (
        <AdminAlert variant="destructive" className="mb-6">
          <AdminAlertTitle>Workspace in Maintenance Mode</AdminAlertTitle>
          <AdminAlertDescription>
            This workspace is currently in maintenance mode and should not be
            modified, unless you know what you are doing.
          </AdminAlertDescription>
        </AdminAlert>
      )}
      <div className="flex justify-between gap-3">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{owner.name}</span>
            {currentCell && (
              <Chip size="xs" color={getCellChipColor(currentCell.region)}>
                {getCellDisplay(currentCell)}
              </Chip>
            )}
          </div>
          <div className="flex gap-4 pt-2">
            <Button
              href={`/admin/${owner.sId}/memberships`}
              label="View members"
              variant="outline"
            />
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                isSelect
                label={`Segmentation: ${owner.segmentation ?? "none"}`}
                variant="outline"
                size="sm"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[null, "interesting"].map((segment) => (
                <DropdownMenuItem
                  label={segment ?? "none"}
                  key={segment ?? "all"}
                  onClick={() => {
                    void onWorkspaceUpdate(
                      segment as WorkspaceSegmentationType
                    );
                  }}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-col justify-center">
        <div className="flex flex-col space-y-8">
          <div className="mt-4 flex flex-row items-stretch gap-3">
            <Tabs defaultValue="workspace" className="min-w-[512px]">
              <TabsList className="mb-3">
                <TabsTrigger value="workspace" label="Workspace" />
                <TabsTrigger value="subscriptions" label="Subscriptions" />
                <TabsTrigger value="planlimitations" label="Plan Limitations" />
              </TabsList>
              <TabsContent value="workspace">
                <div className="flex flex-col gap-3">
                  <WorkspaceInfoTable
                    owner={owner}
                    membersCount={membersCount}
                    inactiveMembersCount={inactiveMembersCount}
                    metronomeCustomerId={metronomeCustomerId}
                    stripeCustomerId={stripeCustomerId}
                    workspaceVerifiedDomains={workspaceVerifiedDomains}
                    workspaceCreationDay={workspaceCreationDay}
                    extensionConfig={extensionConfig}
                    dataRetention={dataRetention}
                    workosEnvironmentId={workosEnvironmentId}
                    hasDummyFeature={hasDummyFeature}
                    temporalFrontNamespace={temporalFrontNamespace}
                  />
                  <WorkspaceAnalyticsButton workspaceId={owner.sId} />
                  <WorkspacePoolUsageButton workspaceId={owner.sId} />
                </div>
              </TabsContent>
              <TabsContent value="subscriptions">
                <ActiveSubscriptionTable
                  owner={owner}
                  metronomeCustomerId={metronomeCustomerId}
                  subscription={activeSubscription}
                  pendingSubscription={pendingSubscription}
                  subscriptions={subscriptions}
                  programmaticUsageConfig={programmaticUsageConfig}
                  hasMetronomeBillingFeature={hasMetronomeFeature}
                  stripeCustomerId={stripeCustomerId}
                  seatPlan={seatPlan}
                />
              </TabsContent>
              <TabsContent value="planlimitations">
                <PlanLimitationsTable
                  subscription={activeSubscription}
                  planLimitOverride={planLimitOverride}
                />
              </TabsContent>
            </Tabs>

            <div className="flex flex-grow flex-col">
              <PluginList
                pluginResourceTarget={{
                  resourceId: owner.sId,
                  resourceType: "workspaces",
                  workspace: owner,
                }}
              />
            </div>
          </div>
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="min-h-[1024px] w-full"
          >
            <TabsList>
              <TabsTrigger value="metadata" label="Metadata" />
              <TabsTrigger value="agents" label="Agents" />
              <TabsTrigger value="apps" label="Apps" />
              <TabsTrigger value="datasources" label="Data Sources" />
              <TabsTrigger value="datasourceviews" label="Data Source Views" />
              <TabsTrigger value="featureflags" label="Feature Flags" />
              <TabsTrigger value="frames" label="Frames" />
              <TabsTrigger value="governance" label="Governance" />
              <TabsTrigger value="groups" label="Groups" />
              <TabsTrigger value="mcpviews" label="MCP" />
              <TabsTrigger value="pods" label="Pods" />
              <TabsTrigger value="skills" label="Skills" />
              <TabsTrigger value="spaces" label="Spaces" />
              <TabsTrigger value="triggers" label="Triggers" />
              <TabsTrigger value="webhooksources" label="Webhook Sources" />
              <TabsTrigger value="credits" label="API Usage" />
              <TabsTrigger value="usage" label="Usage" />
            </TabsList>

            <TabsContent value="metadata">
              <WorkspaceMetadataTab owner={owner} />
            </TabsContent>
            <TabsContent value="datasources">
              <DataSourceDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="datasourceviews">
              <DataSourceViewsDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="mcpviews">
              <MCPServerViewsDataTable
                owner={owner}
                loadOnInit
                systemSpaceOnly
              />
            </TabsContent>
            <TabsContent value="pods">
              <ProjectsDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="frames">
              <FramesDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="spaces">
              <SpaceDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="groups">
              <GroupDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="agents">
              <AssistantsDataTable
                owner={owner}
                agentsRetention={agentsRetention}
                loadOnInit
              />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="apps">
              <AppDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="featureflags">
              <FeatureFlagsDataTable
                owner={owner}
                whitelistableFeatures={whitelistableFeatures}
                loadOnInit
              />
            </TabsContent>

            <TabsContent value="governance">
              <GovernanceTab
                owner={owner}
                workosEnvironmentId={workosEnvironmentId}
              />
            </TabsContent>
            <TabsContent value="triggers">
              <TriggerDataTable owner={owner} />
            </TabsContent>
            <TabsContent value="webhooksources">
              <WebhookSourceDataTable owner={owner} loadOnInit />
            </TabsContent>
            <TabsContent value="credits">
              <CreditsDataTable
                owner={owner}
                subscription={activeSubscription}
                stripeSubscription={stripeSubscription}
                loadOnInit
              />
            </TabsContent>
            <TabsContent value="usage">
              <AdminUsageTab
                owner={owner}
                hasMetronomeBillingUsage={hasMetronomeBillingUsage}
                subscription={activeSubscription}
                stripeSubscription={stripeSubscription}
                poolCreditState={poolCreditState}
                programmaticRateLimiterState={programmaticRateLimiterState}
                programmaticSpendLimitRateCapCount={
                  programmaticSpendLimitRateCapCount
                }
                programmaticEsConsumedAwuCredits={
                  programmaticEsConsumedAwuCredits
                }
                programmaticMetronomeConsumedAwuCredits={
                  programmaticMetronomeConsumedAwuCredits
                }
                creditUsageConfig={creditUsageConfig}
                poolAlert={poolAlert}
                programmaticAlerts={programmaticAlerts}
                usageCapAlert={usageCapAlert}
                defaultAlerts={defaultAlerts}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
