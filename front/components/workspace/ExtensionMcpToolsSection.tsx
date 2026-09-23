import { GovernanceSettingRowLayout } from "@app/components/pages/workspace/governance/GovernanceSettingRowLayout";
import { useExtensionMcpToolsToggle } from "@app/hooks/useExtensionMcpToolsToggle";
import type { LightWorkspaceType } from "@app/types/user";
import { SliderToggle } from "@ruby-ai/ui";

export const EXTENSION_MCP_TOOLS_LABEL = "Browser Extension Tools";
export const EXTENSION_MCP_TOOLS_DESCRIPTION =
  "Whether the Ruby browser extension is allowed to list and read browser tabs.";

interface ExtensionMcpToolsSectionProps {
  owner: LightWorkspaceType;
}

export function ExtensionMcpToolsSection({
  owner,
}: ExtensionMcpToolsSectionProps) {
  const { isEnabled, isChanging, doToggleExtensionMcpTools } =
    useExtensionMcpToolsToggle({ owner });

  return (
    <GovernanceSettingRowLayout
      label={EXTENSION_MCP_TOOLS_LABEL}
      description={EXTENSION_MCP_TOOLS_DESCRIPTION}
      action={
        <SliderToggle
          selected={isEnabled}
          disabled={isChanging}
          onClick={() => void doToggleExtensionMcpTools()}
        />
      }
    />
  );
}
