import { TriggerFilterRenderer } from "@app/components/agent_builder/triggers/TriggerFilterRenderer";
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableCellWithLink,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AdminGetTriggerDetails } from "@app/lib/api/admin/triggers";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { LightAgentConfigurationType } from "@app/types/assistant/agent";
import type { TriggerType } from "@app/types/assistant/triggers";
import { DEFAULT_SINGLE_TRIGGER_EXECUTION_PER_DAY_LIMIT } from "@app/types/assistant/triggers";
import type { LightWorkspaceType, UserType } from "@app/types/user";
import { Chip, LinkWrapper } from "@ruby-ai/ui";

interface ViewTriggerTableProps {
  trigger: TriggerType;
  agent: LightAgentConfigurationType;
  owner: LightWorkspaceType;
  editorUser?: UserType | null;
  webhookSource: AdminGetTriggerDetails["webhookSource"];
}

export function ViewTriggerTable({
  trigger,
  agent,
  owner,
  editorUser,
  webhookSource,
}: ViewTriggerTableProps) {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-between gap-3">
        <div className="my-4 flex flex-grow flex-col rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-md flex-grow pb-4 font-bold">Overview</h2>
          </div>
          <AdminTable>
            <AdminTableBody>
              <AdminTableRow>
                <AdminTableHead>Id</AdminTableHead>
                <AdminTableCellWithCopy label={trigger.id.toString()} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>sId</AdminTableHead>
                <AdminTableCellWithCopy label={trigger.sId} />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Agent</AdminTableHead>
                <AdminTableCellWithLink
                  href={`/admin/${owner.sId}/assistants/${agent.sId}`}
                  content={`${agent.name} (${agent.sId})`}
                />
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Name</AdminTableHead>
                <AdminTableCell>{trigger.name}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Kind</AdminTableHead>
                <AdminTableCell>{trigger.kind}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Origin</AdminTableHead>
                <AdminTableCell>
                  <Chip
                    color={trigger.origin === "agent" ? "info" : "primary"}
                    size="xs"
                  >
                    {trigger.origin}
                  </Chip>
                </AdminTableCell>
              </AdminTableRow>

              {/* Configuration - structured by kind */}
              {trigger.kind === "schedule" ? (
                <>
                  {trigger.configuration.type === "interval" ? (
                    <>
                      <AdminTableRow>
                        <AdminTableHead>Interval</AdminTableHead>
                        <AdminTableCell>
                          Every {trigger.configuration.intervalDays} days
                        </AdminTableCell>
                      </AdminTableRow>
                      <AdminTableRow>
                        <AdminTableHead>Timezone</AdminTableHead>
                        <AdminTableCell>
                          {trigger.configuration.timezone}
                        </AdminTableCell>
                      </AdminTableRow>
                    </>
                  ) : (
                    <>
                      <AdminTableRow>
                        <AdminTableHead>Cron</AdminTableHead>
                        <AdminTableCell>
                          {trigger.configuration.cron}
                        </AdminTableCell>
                      </AdminTableRow>
                      <AdminTableRow>
                        <AdminTableHead>Timezone</AdminTableHead>
                        <AdminTableCell>
                          {trigger.configuration.timezone}
                        </AdminTableCell>
                      </AdminTableRow>
                    </>
                  )}
                </>
              ) : (
                <>
                  <AdminTableRow>
                    <AdminTableHead>Include Payload</AdminTableHead>
                    <AdminTableCell>
                      {trigger.configuration.includePayload ? "Yes" : "No"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Event Filter</AdminTableHead>
                    <AdminTableCell>
                      {trigger.configuration.event ?? "All events"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Execution Mode</AdminTableHead>
                    <AdminTableCell>
                      {trigger.executionMode ?? "not set"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Execution Limit</AdminTableHead>
                    <AdminTableCell>
                      {trigger.executionPerDayLimitOverride ??
                        `Default (${DEFAULT_SINGLE_TRIGGER_EXECUTION_PER_DAY_LIMIT})`}
                    </AdminTableCell>
                  </AdminTableRow>
                  {trigger.webhookSourceViewId && (
                    <AdminTableRow>
                      <AdminTableHead>Webhook Source View</AdminTableHead>
                      <AdminTableCellWithCopy
                        label={trigger.webhookSourceViewId}
                      />
                    </AdminTableRow>
                  )}
                  {webhookSource && (
                    <>
                      <AdminTableRow>
                        <AdminTableHead>Webhook Source</AdminTableHead>
                        <AdminTableCellWithLink
                          href={`/admin/${owner.sId}/webhook-sources/${webhookSource.sId}`}
                          content={`${webhookSource.name} (${webhookSource.sId})`}
                        />
                      </AdminTableRow>
                      <AdminTableRow>
                        <AdminTableHead>Payloads (GCS)</AdminTableHead>
                        <AdminTableCell>
                          <LinkWrapper
                            href={webhookSource.payloadsGcsUrl}
                            target="_blank"
                            className="text-xs text-highlight-400"
                          >
                            Open bucket
                          </LinkWrapper>
                        </AdminTableCell>
                      </AdminTableRow>
                    </>
                  )}
                </>
              )}

              <AdminTableRow>
                <AdminTableHead>Status</AdminTableHead>
                <AdminTableCell>{trigger.status}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Editor</AdminTableHead>
                <AdminTableCell>
                  {editorUser
                    ? `${editorUser.fullName} (${editorUser.email})`
                    : (trigger.editor?.toString() ?? "-")}
                </AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Created At</AdminTableHead>
                <AdminTableCell>
                  {formatTimestampToFriendlyDate(trigger.createdAt)}
                </AdminTableCell>
              </AdminTableRow>
            </AdminTableBody>
          </AdminTable>
        </div>
      </div>
      {trigger.kind === "webhook" && (
        <div className="flex flex-col rounded-lg border p-4">
          <h2 className="text-md pb-4 font-bold">Filter Expression</h2>
          {trigger.configuration.filter ? (
            <TriggerFilterRenderer data={trigger.configuration.filter} />
          ) : (
            <p className="text-sm text-muted-foreground">No filter</p>
          )}
        </div>
      )}
    </div>
  );
}
