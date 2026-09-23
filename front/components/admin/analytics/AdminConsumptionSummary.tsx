import type { ConsumptionSummaryProps } from "@app/components/workspace/analytics/consumption/ConsumptionSummary";
import { ConsumptionSummaryView } from "@app/components/workspace/analytics/consumption/ConsumptionSummary";
import { useAdminConsumptionOverview } from "@app/admin-app/swr/consumption";

export function AdminConsumptionSummary({
  workspaceId,
  period,
  usageHref = `/admin/${workspaceId}?tab=usage`,
  usageLinkLabel = "View Usage",
}: ConsumptionSummaryProps) {
  const { overview, isOverviewLoading, isOverviewError } =
    useAdminConsumptionOverview({ workspaceId, period });

  return (
    <ConsumptionSummaryView
      overview={overview}
      isOverviewLoading={isOverviewLoading}
      isOverviewError={Boolean(isOverviewError)}
      usageHref={usageHref}
      usageLinkLabel={usageLinkLabel}
      responsiveLayout
    />
  );
}
