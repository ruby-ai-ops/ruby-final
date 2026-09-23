import { AdminColumnSortableHeader } from "@app/components/admin/AdminColumnSortableHeader";
import config from "@app/lib/api/config";
import { clientFetch } from "@app/lib/egress/client";
import { formatTimestampToFriendlyDate } from "@app/lib/utils";
import type { AdminAgentConfigurationType } from "@app/types/api/admin/agent_configurations";
import type { LightWorkspaceType } from "@app/types/user";
import {
  Download01,
  FaceSmile,
  IconButton,
  LinkWrapper,
  Trash01,
  XClose,
} from "@ruby-ai/ui";
import type { ColumnDef } from "@tanstack/react-table";

export function makeColumnsForAssistants(
  owner: LightWorkspaceType,
  agentsRetention: Record<string, number>,
  onAgentArchivedOrRestored: () => Promise<void>
): ColumnDef<AdminAgentConfigurationType>[] {
  return [
    {
      accessorKey: "sId",
      cell: ({ row }) => {
        const sId: string = row.getValue("sId");

        return (
          <LinkWrapper href={`/admin/${owner.sId}/assistants/${sId}`}>
            {sId}
          </LinkWrapper>
        );
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="sId" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Name" />
      ),
    },
    {
      accessorKey: "scope",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Scope" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Status" />
      ),
    },
    {
      accessorKey: "versionCreatedAt",
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Created at" />
      ),
      cell: ({ row }) => {
        const createdAt: string | null = row.getValue("versionCreatedAt");

        if (!createdAt) {
          return;
        }

        return formatTimestampToFriendlyDate(new Date(createdAt).getTime());
      },
    },
    {
      id: "author",
      accessorFn: (row) => {
        const author = row.versionAuthor;
        if (author) {
          return author.email;
        }
        return row.versionAuthorId?.toString() ?? "";
      },
      header: ({ column }) => (
        <AdminColumnSortableHeader column={column} label="Author" />
      ),
      cell: ({ row }) => {
        const author = row.original.versionAuthor;
        if (author) {
          return author.email;
        }
        return row.original.versionAuthorId?.toString() ?? "-";
      },
    },
    {
      accessorKey: "retention",
      header: ({ column }) => (
        <AdminColumnSortableHeader
          column={column}
          label="Conversation retention"
        />
      ),
      cell: ({ row }) => {
        const sId: string = row.getValue("sId");
        const retention: number = agentsRetention[sId];
        return retention ? `${retention} days` : <XClose className="h-4 w-4" />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const assistant = row.original;

        if (assistant.scope === "global") {
          return null;
        }

        return (
          <>
            <IconButton
              icon={assistant.status !== "archived" ? Trash01 : FaceSmile}
              size="xs"
              variant="outline"
              onClick={async () => {
                await (assistant.status !== "archived"
                  ? archiveAssistant(
                      owner,
                      onAgentArchivedOrRestored,
                      assistant
                    )
                  : restoreAssistant(
                      owner,
                      onAgentArchivedOrRestored,
                      assistant
                    ));
              }}
            />
            <a
              href={`${config.getApiBaseUrl()}/api/admin/workspaces/${owner.sId}/agent_configurations/${assistant.sId}/export`}
              download={`${assistant.name}.json`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton icon={Download01} size="xs" variant="outline" />
            </a>
          </>
        );
      },
    },
  ];
}

async function archiveAssistant(
  owner: LightWorkspaceType,
  onAgentArchived: () => Promise<void>,
  agentConfiguration: AdminAgentConfigurationType
) {
  if (
    !window.confirm(
      `Are you sure you want to archive the ${agentConfiguration.name} assistant?`
    )
  ) {
    return;
  }

  try {
    const r = await clientFetch(
      `/api/admin/workspaces/${owner.sId}/agent_configurations/${agentConfiguration.sId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!r.ok) {
      throw new Error("Failed to archive agent configuration.");
    }

    await onAgentArchived();
  } catch (e) {
    console.error(e);
    window.alert("An error occurred while archiving the agent configuration.");
  }
}

async function restoreAssistant(
  owner: LightWorkspaceType,
  onAgentRestored: () => Promise<void>,
  agentConfiguration: AdminAgentConfigurationType
) {
  if (
    !window.confirm(
      `Are you sure you want to restore the ${agentConfiguration.name} assistant?`
    )
  ) {
    return;
  }

  try {
    const r = await clientFetch(
      `/api/admin/workspaces/${owner.sId}/agent_configurations/${agentConfiguration.sId}/restore`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!r.ok) {
      throw new Error("Failed to restore agent configuration.");
    }

    await onAgentRestored();
  } catch (e) {
    console.error(e);
    window.alert("An error occurred while restoring the agent configuration.");
  }
}
