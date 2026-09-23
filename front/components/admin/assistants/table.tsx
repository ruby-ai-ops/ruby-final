import { makeColumnsForAssistants } from "@app/components/admin/assistants/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import { clientFetch } from "@app/lib/egress/client";
import type { AppRouter } from "@app/lib/platform";
import { useAppRouter } from "@app/lib/platform";
import { getErrorFromResponse } from "@app/lib/swr/swr";
import { useAdminAgentConfigurations } from "@app/admin-app/swr/agent_configurations";
import type { LightWorkspaceType } from "@app/types/user";
import {
  Button,
  Sheet,
  SheetContainer,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@ruby-ai/ui";
import { useState } from "react";

interface AssistantsDataTableProps {
  owner: LightWorkspaceType;
  agentsRetention: Record<string, number>;
  loadOnInit?: boolean;
}

const importAssistant = async (
  owner: LightWorkspaceType,
  router: AppRouter,
  setImporting: (importing: boolean) => void
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    setImporting(true);
    const fileContent = await file.text();
    const response = await clientFetch(
      `/api/admin/workspaces/${owner.sId}/agent_configurations/import`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: fileContent,
      }
    );
    setImporting(false);
    if (!response.ok) {
      const errorData = await getErrorFromResponse(response);
      window.alert(`Failed to import agent. ${errorData.message}`);
    } else {
      router.reload();
    }
  };
  input.click();
};

export function AssistantsDataTable({
  owner,
  agentsRetention,
  loadOnInit,
}: AssistantsDataTableProps) {
  const router = useAppRouter();
  const [showRestoreAssistantModal, setShowRestoreAssistantModal] =
    useState(false);
  const [importing, setImporting] = useState(false);

  const assistantButtons = (
    <div className="flex flex-row gap-2">
      <Button
        aria-label="Restore an agent"
        variant="outline"
        size="sm"
        onClick={() => setShowRestoreAssistantModal(true)}
        label="🔥 Restore an agent"
      />
      <Button
        aria-label="Import an agent"
        variant="outline"
        size="sm"
        onClick={() => importAssistant(owner, router, setImporting)}
        label={importing ? "📥 Importing..." : "📥 Import agent"}
        isLoading={importing}
      />
    </div>
  );

  return (
    <>
      <RestoreAssistantModal
        show={showRestoreAssistantModal}
        onClose={() => setShowRestoreAssistantModal(false)}
        agentsRetention={agentsRetention}
        owner={owner}
      />
      <AdminDataTableConditionalFetch
        header="Agents"
        globalActions={assistantButtons}
        owner={owner}
        loadOnInit={loadOnInit}
        useSWRHook={useAdminAgentConfigurations}
      >
        {(data, mutate) => (
          <AdminDataTable
            columns={makeColumnsForAssistants(
              owner,
              agentsRetention,
              async () => {
                await mutate();
              }
            )}
            data={data}
          />
        )}
      </AdminDataTableConditionalFetch>
    </>
  );
}

function RestoreAssistantModal({
  show,
  onClose,
  owner,
  agentsRetention,
}: {
  show: boolean;
  onClose: () => void;
  owner: LightWorkspaceType;
  agentsRetention: Record<string, number>;
}) {
  const { data: archivedAssistants, mutate } = useAdminAgentConfigurations({
    owner,
    disabled: !show,
    agentsGetView: "archived",
  });

  return (
    <Sheet
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent size="xl">
        <SheetHeader>
          <SheetTitle>Restore an agent</SheetTitle>
        </SheetHeader>
        <SheetContainer>
          {!!archivedAssistants?.length && (
            <AdminDataTable
              columns={makeColumnsForAssistants(
                owner,
                agentsRetention,
                async () => {
                  await mutate();
                }
              )}
              data={archivedAssistants}
            />
          )}
        </SheetContainer>
      </SheetContent>
    </Sheet>
  );
}
