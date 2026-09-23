import type { AnalyticsConsumptionComponents } from "@app/components/pages/workspace/AnalyticsConsumptionPage";
import {
  AnalyticsConsumptionContent,
  useAnalyticsConsumptionState,
} from "@app/components/pages/workspace/AnalyticsConsumptionPage";
import { AdminConsumptionAttributionTable } from "@app/components/admin/analytics/AdminConsumptionAttributionTable";
import { AdminConsumptionOverview } from "@app/components/admin/analytics/AdminConsumptionOverview";
import { AdminConsumptionSummary } from "@app/components/admin/analytics/AdminConsumptionSummary";
import { AdminUsageFilterPanel } from "@app/components/admin/analytics/AdminUsageFilterPanel";
import { isNavigationLocked } from "@app/lib/navigation-lock";
import type { WorkspaceType } from "@app/types/user";
import { safeLazy } from "@ruby-ai/ui";

const canReload = () => !isNavigationLocked();

// Keep Recharts out of the initial Admin bundle until the analytics preview is
// rendered.
const AdminConsumptionChart = safeLazy(
  () =>
    import("@app/components/admin/analytics/AdminConsumptionChart").then(
      (mod) => ({ default: mod.AdminConsumptionChart })
    ),
  { canReload }
);

const ADMIN_CONSUMPTION_COMPONENTS: AnalyticsConsumptionComponents = {
  AttributionTable: AdminConsumptionAttributionTable,
  Chart: AdminConsumptionChart,
  Overview: AdminConsumptionOverview,
  Summary: AdminConsumptionSummary,
  UsageFilterPanel: AdminUsageFilterPanel,
};

interface AdminConsumptionPreviewProps {
  owner: WorkspaceType;
}

export function AdminConsumptionPreview({ owner }: AdminConsumptionPreviewProps) {
  const state = useAnalyticsConsumptionState();

  return (
    <AnalyticsConsumptionContent
      components={ADMIN_CONSUMPTION_COMPONENTS}
      owner={owner}
      embedded
      showExport={false}
      showMemberGroupFilter={false}
      showOverviewError
      state={state}
      usageHref={`/admin/${owner.sId}/pool-usage`}
      usageLinkLabel="View Usage"
    />
  );
}
