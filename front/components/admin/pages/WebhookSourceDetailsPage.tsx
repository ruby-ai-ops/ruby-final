import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCellWithCopy,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import { useWorkspace } from "@app/lib/auth/AuthContext";
import { useRequiredPathParam } from "@app/lib/platform";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import { useAdminPageMetadata } from "@app/admin-app/swr/currentPage";
import { useAdminWebhookSourceDetails } from "@app/admin-app/swr/webhook_source_details";
import { LinkWrapper, Spinner } from "@ruby-ai/ui";

export function WebhookSourceDetailsPage() {
  const owner = useWorkspace();

  const webhookSourceId = useRequiredPathParam("wsId");
  const {
    data: details,
    isLoading,
    isError,
  } = useAdminWebhookSourceDetails({
    owner,
    webhookSourceId,
    disabled: false,
  });

  useAdminPageMetadata({
    name: details?.webhookSource.name,
    subtitle: owner.name,
    sId: webhookSourceId,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !details) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Error loading webhook source details.</p>
      </div>
    );
  }

  const { webhookSource, views, triggers, requestStats, payloadsGcsUrl } =
    details;

  return (
    <>
      <h3 className="text-xl font-bold">
        Webhook Source {webhookSource.name}{" "}
        <LinkWrapper href={`/admin/${owner.sId}`} className="text-highlight-500">
          {owner.name}
        </LinkWrapper>
      </h3>
      <div className="flex flex-row gap-x-6">
        {/* Left column: Overview table */}
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between gap-3">
            <div className="my-4 flex flex-grow flex-col rounded-lg border p-4">
              <h2 className="text-md pb-4 font-bold">Overview</h2>
              <AdminTable>
                <AdminTableBody>
                  <AdminTableRow>
                    <AdminTableHead>sId</AdminTableHead>
                    <AdminTableCellWithCopy label={webhookSource.sId} />
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Id</AdminTableHead>
                    <AdminTableCellWithCopy
                      label={webhookSource.id.toString()}
                    />
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Name</AdminTableHead>
                    <AdminTableCell>{webhookSource.name}</AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Provider</AdminTableHead>
                    <AdminTableCell>
                      {webhookSource.provider ?? "Custom"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Events</AdminTableHead>
                    <AdminTableCell>
                      {webhookSource.subscribedEvents.length > 0
                        ? webhookSource.subscribedEvents.join(", ")
                        : "All"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Secret</AdminTableHead>
                    <AdminTableCell>{webhookSource.secret ?? "-"}</AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>URL Secret</AdminTableHead>
                    <AdminTableCellWithCopy label={webhookSource.urlSecret} />
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Signature Header</AdminTableHead>
                    <AdminTableCell>
                      {webhookSource.signatureHeader ?? "-"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Signature Algorithm</AdminTableHead>
                    <AdminTableCell>
                      {webhookSource.signatureAlgorithm ?? "-"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Remote Metadata</AdminTableHead>
                    <AdminTableCell>
                      {webhookSource.remoteMetadata
                        ? JSON.stringify(webhookSource.remoteMetadata)
                        : "-"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>OAuth Connection</AdminTableHead>
                    <AdminTableCell>
                      {webhookSource.oauthConnectionId ?? "-"}
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Payloads (GCS)</AdminTableHead>
                    <AdminTableCell>
                      <LinkWrapper
                        href={payloadsGcsUrl}
                        target="_blank"
                        className="text-xs text-highlight-400"
                      >
                        Open bucket
                      </LinkWrapper>
                    </AdminTableCell>
                  </AdminTableRow>
                  <AdminTableRow>
                    <AdminTableHead>Created At</AdminTableHead>
                    <AdminTableCell>
                      {formatTimestampToFriendlyDate(webhookSource.createdAt)}
                    </AdminTableCell>
                  </AdminTableRow>
                </AdminTableBody>
              </AdminTable>
            </div>
          </div>
        </div>

        {/* Right column: Views, Triggers, Request Stats */}
        <div className="mt-4 flex grow flex-col gap-4">
          {/* Views */}
          <div className="flex flex-col rounded-lg border p-4">
            <h2 className="text-md pb-4 font-bold">Views ({views.length})</h2>
            {views.length === 0 ? (
              <p className="text-sm text-muted-foreground">No views found.</p>
            ) : (
              <AdminTable>
                <AdminTableBody>
                  {views.map((view) => (
                    <AdminTableRow key={view.sId}>
                      <AdminTableHead>{view.customName}</AdminTableHead>
                      <AdminTableCell>
                        <span className="text-xs text-muted-foreground">
                          {view.sId}
                        </span>
                        {view.description && (
                          <span className="ml-2 text-xs">
                            {view.description}
                          </span>
                        )}
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </div>

          {/* Connected Triggers */}
          <div className="flex flex-col rounded-lg border p-4">
            <h2 className="text-md pb-4 font-bold">
              Connected Triggers ({triggers.length})
            </h2>
            {triggers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No connected triggers.
              </p>
            ) : (
              <AdminTable>
                <AdminTableBody>
                  {triggers.map((trigger) => (
                    <AdminTableRow key={trigger.sId}>
                      <AdminTableHead>{trigger.name}</AdminTableHead>
                      <AdminTableCell>
                        <div className="flex flex-col gap-1">
                          <LinkWrapper
                            href={`/admin/${owner.sId}/assistants/${trigger.agentConfigurationId}/triggers/${trigger.sId}`}
                            className="text-highlight-500"
                          >
                            {trigger.sId}
                          </LinkWrapper>
                          <span className="text-xs text-muted-foreground">
                            {trigger.status} | {trigger.origin}
                            {trigger.editorUser
                              ? ` | ${trigger.editorUser.email}`
                              : ""}
                          </span>
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  ))}
                </AdminTableBody>
              </AdminTable>
            )}
          </div>

          {/* Request Volume Stats */}
          <div className="flex flex-col rounded-lg border p-4">
            <h2 className="text-md pb-4 font-bold">Request Volume</h2>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  {requestStats.last24h}
                </span>
                <span className="text-xs text-muted-foreground">Last 24h</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  {requestStats.last7d}
                </span>
                <span className="text-xs text-muted-foreground">Last 7d</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">
                  {requestStats.last30d}
                </span>
                <span className="text-xs text-muted-foreground">Last 30d</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
