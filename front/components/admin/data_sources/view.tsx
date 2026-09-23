import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithLink,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import { useTheme } from "@app/components/ui/ThemeContext";
import { isWebhookBasedProvider } from "@app/lib/connector_providers";
import { clientFetch } from "@app/lib/egress/client";
import {
  decodeSqids,
  formatTimestampToFriendlyDate,
  timeAgoFrom,
} from "@app/lib/utils";
import type { CheckStuckResponseBody } from "@app/types/api/data_sources/check_stuck";
import type { InternalConnectorType } from "@app/types/connectors/connectors_api";
import type { CoreAPIDataSource } from "@app/types/core/data_source";
import type { DataSourceType } from "@app/types/data_source";
import type { DataSourceViewType } from "@app/types/data_source_view";
import { pluralize } from "@app/types/shared/utils/string_utils";
import type { WorkspaceType } from "@app/types/user";
import {
  Brackets,
  Button,
  Chip,
  ContentMessage,
  ContextItem,
  Dialog,
  DialogContainer,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LinkExternal01,
  LinkWrapper,
  ScrollArea,
  ScrollBar,
  SearchMd,
  Spinner,
  Tooltip,
} from "@ruby-ai/ui";
import { JsonViewer } from "@textea/json-viewer";
import { useState } from "react";

export function ViewDataSourceTable({
  connector,
  coreDataSource,
  dataSource,
  dataSourceViews,
  oauthConnectedAccount,
  owner,
  temporalWorkspace,
  temporalRunningWorkflows,
}: {
  connector: InternalConnectorType | null;
  coreDataSource: CoreAPIDataSource;
  dataSource: DataSourceType;
  dataSourceViews: DataSourceViewType[];
  oauthConnectedAccount: string | null;
  owner: WorkspaceType;
  temporalWorkspace: string;
  temporalRunningWorkflows: {
    workflowId: string;
    runId: string;
    status: string;
  }[];
}) {
  const [showRawObjectsModal, setShowRawObjectsModal] = useState(false);

  const isPaused = connector && !!connector.pausedAt;
  const isRunning = temporalRunningWorkflows.length > 0;
  const isScheduleBased =
    dataSource.connectorProvider === "gong" ||
    dataSource.connectorProvider === "intercom";

  const systemView = dataSourceViews.find((view) => view.kind === "default");

  return (
    <>
      <RawObjectsModal
        connector={connector}
        coreDataSource={coreDataSource}
        dataSource={dataSource}
        onClose={() => setShowRawObjectsModal(false)}
        show={showRawObjectsModal}
      />
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between gap-3">
          <div className="my-4 flex flex-grow flex-col rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-md flex-grow pb-4 font-bold">Overview</h2>
              <Button
                aria-label="View raw objects"
                variant="outline"
                size="sm"
                onClick={() => setShowRawObjectsModal(true)}
                icon={Brackets}
                label="Show raw objects"
              />
            </div>
            {isPaused && isRunning && (
              <Chip color="warning" size="sm" className="my-4">
                Connector is marked as paused but has temporal workflows
                running. Potential resolution: unpause the connector.
              </Chip>
            )}
            <AdminTable>
              <AdminTableBody>
                <AdminTableRow>
                  <AdminTableCell>Name</AdminTableCell>
                  <AdminTableCell>{dataSource.name}</AdminTableCell>
                </AdminTableRow>
                <AdminTableRow>
                  <AdminTableCell>Description</AdminTableCell>
                  <AdminTableCell>{dataSource.description}</AdminTableCell>
                </AdminTableRow>
                <AdminTableRow>
                  <AdminTableCell>System view</AdminTableCell>
                  <AdminTableCellWithLink
                    href={`/admin/${owner.sId}/spaces/${systemView?.spaceId}/data_source_views/${systemView?.sId}`}
                    content={systemView?.sId ?? "N/A"}
                  />
                </AdminTableRow>

                <AdminTableRow>
                  <AdminTableCell>Created at</AdminTableCell>
                  <AdminTableCell>
                    {formatTimestampToFriendlyDate(dataSource.createdAt)}
                  </AdminTableCell>
                </AdminTableRow>
                <AdminTableRow>
                  <AdminTableCell>Edited by</AdminTableCell>
                  <AdminTableCell>
                    {dataSource.editedByUser?.fullName ?? "N/A"}
                  </AdminTableCell>
                </AdminTableRow>
                <AdminTableRow>
                  <AdminTableCell>Edited at</AdminTableCell>
                  <AdminTableCell>
                    {dataSource.editedByUser?.editedAt
                      ? formatTimestampToFriendlyDate(
                          dataSource.editedByUser.editedAt
                        )
                      : "N/A"}
                  </AdminTableCell>
                </AdminTableRow>
                {oauthConnectedAccount && (
                  <AdminTableRow>
                    <AdminTableCell>Connected account</AdminTableCell>
                    <AdminTableCell>{oauthConnectedAccount}</AdminTableCell>
                  </AdminTableRow>
                )}
                <AdminTableRow>
                  <AdminTableCell>Logs</AdminTableCell>
                  <AdminTableCell>
                    <LinkWrapper
                      href={`https://app.datadoghq.eu/logs?query=%40connectorId%3A${dataSource.connectorId}`}
                      target="_blank"
                      className="text-sm text-highlight-400"
                    >
                      Datadog(connector)
                    </LinkWrapper>{" "}
                    /{" "}
                    <LinkWrapper
                      href={`https://cloud.temporal.io/namespaces/${temporalWorkspace}/${
                        isScheduleBased ? "schedules" : "workflows"
                      }?query=%60connectorId%60%3D${dataSource.connectorId}`}
                      target="_blank"
                      className="text-sm text-highlight-400"
                    >
                      Temporal
                    </LinkWrapper>{" "}
                    /{" "}
                    <LinkWrapper
                      href={`https://app.datadoghq.eu/logs?query=service%3Acore%20%40data_source_internal_id%3A${coreDataSource.data_source_internal_id}%20&agg_m=count&agg_m_source=base&agg_t=count&cols=host%2Cservice&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=desc&view=spans&viz=stream`}
                      target="_blank"
                      className="text-sm text-highlight-400"
                    >
                      Datadog(Qdrant)
                    </LinkWrapper>
                  </AdminTableCell>
                </AdminTableRow>
                {connector && (
                  <>
                    <AdminTableRow>
                      <AdminTableCell>Is Running? </AdminTableCell>
                      <AdminTableCell>{isRunning ? "✅" : "❌"}</AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>Is Stuck?</AdminTableCell>
                      <AdminTableCell>
                        <CheckConnectorStuck
                          owner={owner}
                          dsId={dataSource.sId}
                          isRunning={isRunning}
                          temporalWorkspace={temporalWorkspace}
                        />
                      </AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>Paused</AdminTableCell>
                      <AdminTableCell>
                        {connector?.pausedAt ? (
                          <span className="font-bold text-green-600">
                            {timeAgoFrom(connector?.pausedAt, {
                              useLongFormat: true,
                            })}{" "}
                            ago
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>Error type</AdminTableCell>
                      <AdminTableCell>
                        {connector?.errorType ? (
                          <span className="font-bold text-warning-500">
                            {connector.errorType}
                          </span>
                        ) : (
                          <span className="font-bold text-green-600">none</span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>First sync progress</AdminTableCell>
                      <AdminTableCell>
                        {connector?.firstSyncProgress ? (
                          <span className="font-bold">
                            {connector?.firstSyncProgress}
                          </span>
                        ) : (
                          <span>N/A</span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>Last sync start</AdminTableCell>
                      <AdminTableCell>
                        {connector?.lastSyncStartTime ? (
                          timeAgoFrom(connector?.lastSyncStartTime, {
                            useLongFormat: true,
                          }) + " ago"
                        ) : (
                          <span className="font-bold text-warning-500">
                            never
                          </span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>Last sync finish</AdminTableCell>
                      <AdminTableCell>
                        {connector?.lastSyncFinishTime ? (
                          timeAgoFrom(connector?.lastSyncFinishTime, {
                            useLongFormat: true,
                          }) + " ago"
                        ) : (
                          <span className="font-bold text-warning-500">
                            never
                          </span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>Last sync status</AdminTableCell>
                      <AdminTableCell>
                        {connector?.lastSyncStatus ? (
                          <span className="font-bold">
                            {connector?.lastSyncStatus}
                            {connector.lastSyncStatus === "failed" && (
                              <span className="text-warning-500">
                                &nbsp;{connector.errorType}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="font-bold text-warning-500">
                            N/A
                          </span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                    <AdminTableRow>
                      <AdminTableCell>Last sync success</AdminTableCell>
                      <AdminTableCell>
                        {connector?.lastSyncSuccessfulTime ? (
                          <span className="font-bold text-green-600">
                            {timeAgoFrom(connector?.lastSyncSuccessfulTime, {
                              useLongFormat: true,
                            })}{" "}
                            ago
                          </span>
                        ) : (
                          <span className="font-bold text-warning-600">
                            "Never"
                          </span>
                        )}
                        {isWebhookBasedProvider(connector.type) && (
                          <span className="pl-2 italic text-gray-500">
                            (webhook-based)
                          </span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                  </>
                )}
              </AdminTableBody>
            </AdminTable>
          </div>
        </div>
      </div>
    </>
  );
}

function RawObjectsModal({
  show,
  onClose,
  connector,
  coreDataSource,
  dataSource,
}: {
  show: boolean;
  onClose: () => void;
  connector: InternalConnectorType | null;
  coreDataSource: CoreAPIDataSource;
  dataSource: DataSourceType;
}) {
  const { isDark } = useTheme();
  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Data source raw objects</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex max-h-96 flex-col" hideScrollBar>
          <DialogContainer>
            <span className="text-sm font-bold">dataSource</span>
            <JsonViewer
              theme={isDark ? "dark" : "light"}
              value={decodeSqids(dataSource)}
              rootName={false}
              defaultInspectDepth={1}
            />
            <span className="text-sm font-bold">coreDataSource</span>
            <JsonViewer
              theme={isDark ? "dark" : "light"}
              value={decodeSqids(coreDataSource)}
              rootName={false}
              defaultInspectDepth={1}
            />
            <span className="text-sm font-bold">connector</span>
            <JsonViewer
              theme={isDark ? "dark" : "light"}
              value={decodeSqids(connector)}
              rootName={false}
              defaultInspectDepth={1}
            />
          </DialogContainer>
          <ScrollBar className="py-0" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface CheckConnectorStuckProps {
  owner: WorkspaceType;
  dsId: string;
  isRunning: boolean;
  temporalWorkspace: string;
}

function CheckConnectorStuck({
  owner,
  dsId,
  isRunning,
  temporalWorkspace,
}: CheckConnectorStuckProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckStuckResponseBody | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const checkStuck = async () => {
    setIsLoading(true);
    try {
      const res = await clientFetch(
        `/api/admin/workspaces/${owner.sId}/data_sources/${dsId}/check-stuck`
      );
      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to check connector status: ${JSON.stringify(err)}`);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert(`Error checking connector: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRunning) {
    return <Chip label="Not Running" color="primary" size="xs" />;
  }

  if (!result) {
    return (
      <Button
        variant="outline"
        label={isLoading ? "Checking..." : "Check"}
        icon={isLoading ? Spinner : SearchMd}
        disabled={isLoading}
        onClick={!isLoading ? checkStuck : undefined}
        size="xs"
      />
    );
  }

  return (
    <>
      <StuckActivitiesDialog
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        result={result}
        temporalWorkspace={temporalWorkspace}
      />
      <div className="flex items-center gap-2">
        <Tooltip
          label={result.message}
          trigger={
            <Chip
              label={result.isStuck ? "Stuck" : "Not Stuck"}
              color={result.isStuck ? "info" : "success"}
              size="xs"
            />
          }
        />
        {result.isStuck && result.workflows.length > 0 && (
          <Button
            variant="ghost"
            label="Show details"
            onClick={() => setShowDetailsModal(true)}
            size="xs"
          />
        )}
      </div>
    </>
  );
}

interface StuckActivitiesDialogProps {
  show: boolean;
  onClose: () => void;
  result: CheckStuckResponseBody;
  temporalWorkspace: string;
}

function StuckActivitiesDialog({
  show,
  onClose,
  result: { workflows },
  temporalWorkspace,
}: StuckActivitiesDialogProps) {
  const totalStuckActivities = workflows.reduce(
    (sum, wf) => sum + wf.stuckActivities.length,
    0
  );

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Stuck Activities Details</DialogTitle>
        </DialogHeader>
        <DialogContainer>
          <div className="flex flex-col gap-4">
            <ContentMessage
              variant="info"
              size="sm"
              title={
                `Found ${totalStuckActivities} stuck ` +
                `${totalStuckActivities === 1 ? "activity" : "activities"} ` +
                `across ${workflows.length} workflow${pluralize(workflows.length)}`
              }
              className="max-w-full"
            />
            {workflows.map((workflow) => (
              <ContextItem.List key={workflow.workflowId} hasBorder>
                <ContextItem
                  title={
                    <span className="font-mono text-sm">
                      {workflow.workflowId}
                    </span>
                  }
                  visual={null}
                  hasSeparator={false}
                  action={
                    <Button
                      icon={LinkExternal01}
                      variant="outline"
                      href={`https://cloud.temporal.io/namespaces/${temporalWorkspace}/workflows/${workflow.workflowId}`}
                      size="xs"
                      className="p-2"
                      label="Workflow"
                      target="_blank"
                    />
                  }
                />
                {workflow.stuckActivities.map((activity, idx) => (
                  <ContextItem
                    key={idx}
                    title={
                      <span className="text-sm">{activity.activityType}</span>
                    }
                    visual={
                      <Chip
                        color="warning"
                        label={`${activity.attempt} attempts`}
                        size="xs"
                      />
                    }
                    action={
                      <Button
                        icon={LinkExternal01}
                        variant="outline"
                        href={
                          "https://app.datadoghq.eu/logs?query=%40dd.env%3Aprod%20%40dd.service%3Aconnectors-worker" +
                          `%20%40activityType%3A${encodeURIComponent(activity.activityType)}` +
                          `%20%40workflowId%3A${encodeURIComponent(workflow.workflowId.replaceAll(":", "\\:"))}` +
                          "&agg_m=count&agg_m_source=base&agg_t=count&cols=%40workflowId&" +
                          "fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&" +
                          "stream_sort=time%2Cdesc&viz=stream"
                        }
                        size="xs"
                        className="p-2"
                        label="Logs"
                        target="_blank"
                      />
                    }
                  >
                    {activity.lastFailure && (
                      <div className="text-sm text-warning-500">
                        {activity.lastFailure}
                      </div>
                    )}
                  </ContextItem>
                ))}
              </ContextItem.List>
            ))}
          </div>
        </DialogContainer>
        <DialogFooter
          leftButtonProps={{
            label: "Close",
            variant: "outline",
            onClick: onClose,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
