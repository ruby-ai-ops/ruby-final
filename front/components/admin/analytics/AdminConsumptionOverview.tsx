import type { ConsumptionOverviewProps } from "@app/components/workspace/analytics/consumption/ConsumptionOverview";
import { ConsumptionOverviewView } from "@app/components/workspace/analytics/consumption/ConsumptionOverview";
import { useAdminConsumptionOverview } from "@app/admin-app/swr/consumption";

export function AdminConsumptionOverview({
  workspaceId,
  period,
  showError = false,
}: ConsumptionOverviewProps) {
  const { overview, isOverviewLoading, isOverviewError } =
    useAdminConsumptionOverview({ workspaceId, period });

  return (
    <ConsumptionOverviewView
      overview={overview}
      isOverviewLoading={isOverviewLoading}
      isOverviewError={Boolean(isOverviewError)}
      showError={showError}
      showIndexingDetails
    />
  );
}
