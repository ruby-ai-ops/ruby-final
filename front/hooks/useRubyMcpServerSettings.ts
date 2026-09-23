import { useSendNotification } from "@app/hooks/useNotification";
import type { RubyMcpServerSettings } from "@app/lib/api/mcp_server/ruby_mcp_server_settings";
import { getRubyMcpServerSettingsFromMetadata } from "@app/lib/api/mcp_server/ruby_mcp_server_settings";
import { clientFetch } from "@app/lib/egress/client";
import { useAuthContext } from "@app/lib/swr/workspaces";
import { normalizeError } from "@app/types/shared/utils/error_utils";
import type { LightWorkspaceType } from "@app/types/user";
import { useEffect, useState } from "react";

interface UseRubyMcpServerSettingsProps {
  owner: LightWorkspaceType;
}

export function useRubyMcpServerSettings({
  owner,
}: UseRubyMcpServerSettingsProps) {
  const sendNotification = useSendNotification();
  const { mutateAuthContext } = useAuthContext({ workspaceId: owner.sId });
  const [settings, setSettings] = useState<RubyMcpServerSettings>(() =>
    getRubyMcpServerSettingsFromMetadata(owner.metadata)
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(getRubyMcpServerSettingsFromMetadata(owner.metadata));
  }, [owner.metadata]);

  const saveSettings = async (
    nextSettings: RubyMcpServerSettings
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await clientFetch(`/api/w/${owner.sId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rubyMcpServerSettings: nextSettings,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update Ruby MCP server settings");
      }

      setSettings(nextSettings);
      // Revalidation is best-effort; failure does not mean the save failed.
      await mutateAuthContext().catch(() => {
        // Non-critical — settings will sync on next navigation.
      });
      return true;
    } catch (error) {
      sendNotification({
        type: "error",
        title: "Failed to update Ruby MCP server settings",
        description: normalizeError(error).message,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    isSaving,
    saveSettings,
  };
}
