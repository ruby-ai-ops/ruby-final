import { GovernanceSettingRowLayout } from "@app/components/pages/workspace/governance/GovernanceSettingRowLayout";
import { RubyMcpServerSettingsSheet } from "@app/components/workspace/RubyMcpServerSettingsSheet";
import { useRubyMcpServerSettings } from "@app/hooks/useRubyMcpServerSettings";
import type { WorkspaceType } from "@app/types/user";
import { Button, Settings01, SliderToggle } from "@ruby-ai/ui";
import { useEffect, useState } from "react";

interface RubyMcpServerSettingsItemProps {
  owner: WorkspaceType;
}

export const RUBY_MCP_SERVER_LABEL = "MCP server";
export const RUBY_MCP_SERVER_DESCRIPTION =
  "Whether external MCP clients can connect to this workspace";

export function RubyMcpServerSettingsItem({
  owner,
}: RubyMcpServerSettingsItemProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { settings, isSaving, saveSettings } = useRubyMcpServerSettings({
    owner,
  });
  const isEnabled = !settings.disabled;

  useEffect(() => {
    if (settings.disabled) {
      setIsSheetOpen(false);
    }
  }, [settings.disabled]);

  const handleToggleEnabled = async () => {
    await saveSettings({
      ...settings,
      disabled: isEnabled,
    });
  };

  return (
    <>
      <GovernanceSettingRowLayout
        label={RUBY_MCP_SERVER_LABEL}
        description={RUBY_MCP_SERVER_DESCRIPTION}
        action={
          <div className="flex shrink-0 items-center gap-2">
            {isEnabled && (
              <Button
                label="Manage"
                size="xs"
                variant="outline"
                icon={Settings01}
                disabled={isSaving}
                onClick={() => setIsSheetOpen(true)}
              />
            )}
            <SliderToggle
              selected={isEnabled}
              disabled={isSaving}
              onClick={() => {
                void handleToggleEnabled();
              }}
            />
          </div>
        }
      />
      <RubyMcpServerSettingsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        settings={settings}
        isSaving={isSaving}
        onSave={saveSettings}
      />
    </>
  );
}
