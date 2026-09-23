import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { DataRetentionConfig } from "@app/lib/data_retention";
import { getMetronomeCustomerUrl } from "@app/lib/metronome/urls";
import { useAdminWorkOSDSyncStatus } from "@app/lib/swr/admin";
import type { WorkOSConnectionSyncStatus } from "@app/lib/types/workos";
import type { ExtensionConfigurationType } from "@app/types/extension";
import { isDevelopment } from "@app/types/shared/env";
import { asDisplayName } from "@app/types/shared/utils/string_utils";
import type { WorkspaceType } from "@app/types/user";
import type { WorkspaceDomain } from "@app/types/workspace";
import { Chip, LinkWrapper } from "@ruby-ai/ui";

export function WorkspaceInfoTable({
  owner,
  membersCount,
  inactiveMembersCount,
  metronomeCustomerId,
  stripeCustomerId,
  workspaceVerifiedDomains,
  workspaceCreationDay,
  extensionConfig,
  dataRetention,
  workosEnvironmentId,
  hasDummyFeature,
  temporalFrontNamespace,
}: {
  owner: WorkspaceType;
  membersCount: number;
  inactiveMembersCount: number;
  metronomeCustomerId: string | null;
  stripeCustomerId: string | null;
  workspaceVerifiedDomains: WorkspaceDomain[];
  workspaceCreationDay: string;
  extensionConfig: ExtensionConfigurationType | null;
  dataRetention: DataRetentionConfig | undefined;
  workosEnvironmentId: string;
  hasDummyFeature: boolean;
  temporalFrontNamespace: string;
}) {
  const { dsyncStatus } = useAdminWorkOSDSyncStatus({ owner });

  const getStatusChipColor = (status: WorkOSConnectionSyncStatus["status"]) => {
    switch (status) {
      case "configured":
        return "success";
      case "configuring":
        return "warning";
      case "not_configured":
        return "info";
      default:
        return "info";
    }
  };

  const getConnectionStateChipColor = (state: string) => {
    switch (state) {
      case "active":
        return "success";
      case "inactive":
      case "deleting":
      case "invalid_credentials":
        return "warning";
      case "validating":
        return "warning";
      case "draft":
        return "highlight";
      default:
        return "info";
    }
  };

  const nbAgentsWithRetention = dataRetention
    ? Object.entries(dataRetention.agents).length
    : 0;

  return (
    <div className="flex justify-between gap-3">
      <div className="flex flex-grow flex-col rounded-lg border p-4 pb-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-md flex-grow pb-4 font-bold">Workspace info</h2>
        </div>
        <AdminTable>
          <AdminTableBody>
            <AdminTableRow>
              <AdminTableCell>Id</AdminTableCell>
              <AdminTableCellWithCopy label={owner.id.toString()} />
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>sId</AdminTableCell>
              <AdminTableCellWithCopy label={owner.sId} />
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Workspace Health</AdminTableCell>
              <AdminTableCell>
                <LinkWrapper
                  href={`https://metabase.ruby.ad/dashboard/34-snowflake-workspace-health?end_date=2030-12-31&start_date=2024-01-01&tab=30-executive-summary&workspace_size_difference_margin=0.2&workspacesid=${owner.sId}`}
                  target="_blank"
                  className="text-xs text-highlight-400"
                >
                  Metabase
                </LinkWrapper>
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>WorkOS dashboard</AdminTableCell>
              <AdminTableCell>
                {owner.workOSOrganizationId && (
                  <LinkWrapper
                    href={`https://dashboard.workos.com/${workosEnvironmentId}/organizations/${owner.workOSOrganizationId}`}
                    target="_blank"
                    className="text-xs text-highlight-400"
                  >
                    {owner.workOSOrganizationId}
                  </LinkWrapper>
                )}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Stripe customer</AdminTableCell>
              <AdminTableCell>
                {stripeCustomerId ? (
                  <LinkWrapper
                    href={
                      isDevelopment()
                        ? `https://dashboard.stripe.com/test/customers/${stripeCustomerId}`
                        : `https://dashboard.stripe.com/customers/${stripeCustomerId}`
                    }
                    target="_blank"
                    className="text-xs text-highlight-400"
                  >
                    {stripeCustomerId}
                  </LinkWrapper>
                ) : (
                  "Not provisioned"
                )}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Metronome</AdminTableCell>
              <AdminTableCell>
                {metronomeCustomerId ? (
                  <LinkWrapper
                    href={getMetronomeCustomerUrl(metronomeCustomerId)}
                    target="_blank"
                    className="text-xs text-highlight-400"
                  >
                    {metronomeCustomerId}
                  </LinkWrapper>
                ) : (
                  "Not provisioned"
                )}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Creation</AdminTableCell>
              <AdminTableCell>{workspaceCreationDay}</AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Members count</AdminTableCell>
              <AdminTableCell>
                {`${membersCount} active, ${inactiveMembersCount} inactive`}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>SSO Enforced</AdminTableCell>
              <AdminTableCell>{owner.ssoEnforced ? "✅" : "❌"}</AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Auto Join</AdminTableCell>
              <AdminTableCell>
                {workspaceVerifiedDomains.length > 0 &&
                workspaceVerifiedDomains.every((d) => d.domainAutoJoinEnabled)
                  ? "✅"
                  : workspaceVerifiedDomains.some(
                        (d) => d.domainAutoJoinEnabled
                      )
                    ? "⚠️"
                    : "❌"}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Verified Domains</AdminTableCell>
              <AdminTableCell className="max-w-sm break-words">
                {workspaceVerifiedDomains.map((d) => d.domain).join(", ")}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell className="max-w-48">
                Extension blacklisted domains/URLs
              </AdminTableCell>
              <AdminTableCell className="max-w-sm break-words">
                {extensionConfig?.blacklistedDomains.length
                  ? extensionConfig.blacklistedDomains.join(", ")
                  : "None"}
              </AdminTableCell>
            </AdminTableRow>
            <AdminTableRow>
              <AdminTableCell>Directory Sync</AdminTableCell>
              <AdminTableCell>
                <Chip
                  color={getStatusChipColor(
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    dsyncStatus?.status || "not_configured"
                  )}
                >
                  {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                  {asDisplayName(dsyncStatus?.status || "not_configured")}
                </Chip>
              </AdminTableCell>
            </AdminTableRow>
            {dsyncStatus?.connection && (
              <AdminTableRow>
                <AdminTableCell>Directory Sync State</AdminTableCell>
                <AdminTableCell>
                  <Chip
                    color={getConnectionStateChipColor(
                      dsyncStatus.connection.state
                    )}
                  >
                    {dsyncStatus.connection.state}
                  </Chip>
                </AdminTableCell>
              </AdminTableRow>
            )}
            {dataRetention !== undefined && (
              <>
                <AdminTableRow>
                  <AdminTableCell>✂️ Conversations retention</AdminTableCell>
                  <AdminTableCell>
                    {dataRetention.conversations !== null
                      ? `${dataRetention.conversations} days inactive`
                      : "No retention policy"}
                  </AdminTableCell>
                </AdminTableRow>
                <AdminTableRow>
                  <AdminTableCell>✂️ Workspace retention</AdminTableCell>
                  <AdminTableCell>
                    {dataRetention.workspace} days post downgrade
                  </AdminTableCell>
                </AdminTableRow>
                <AdminTableRow>
                  <AdminTableCell>✂️ Agents retention</AdminTableCell>
                  <AdminTableCell>
                    {nbAgentsWithRetention === 0
                      ? "No agents with policies"
                      : `${nbAgentsWithRetention} with policies`}
                  </AdminTableCell>
                </AdminTableRow>
              </>
            )}
            <AdminTableRow>
              <AdminTableCell>Self-Improving Skills</AdminTableCell>
              <AdminTableCell>
                <LinkWrapper
                  href={`https://cloud.temporal.io/namespaces/${temporalFrontNamespace}/schedules?query=%60ScheduleId%60%3D%22reinforcement-workspace-${owner.sId}%22`}
                  target="_blank"
                  className="text-xs text-highlight-400"
                >
                  Schedule
                </LinkWrapper>
              </AdminTableCell>
            </AdminTableRow>
            {hasDummyFeature && (
              <AdminTableRow>
                <AdminTableCell>Dummy feature</AdminTableCell>
                <AdminTableCell>Enabled</AdminTableCell>
              </AdminTableRow>
            )}
          </AdminTableBody>
        </AdminTable>
      </div>
    </div>
  );
}
