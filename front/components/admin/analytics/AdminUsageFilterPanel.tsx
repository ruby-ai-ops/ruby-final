import type { UsageFilterPanelProps } from "@app/components/workspace/analytics/UsageFilterPanel";
import {
  UsageFilterPanelView,
  useUsageFilterPanelState,
} from "@app/components/workspace/analytics/UsageFilterPanel";
import { useAdminConsumptionFacets } from "@app/admin-app/swr/consumption";

export function AdminUsageFilterPanel({
  owner,
  period,
  filter,
  onFilterChange,
  showMemberGroupFilter = false,
}: UsageFilterPanelProps) {
  const state = useUsageFilterPanelState({
    owner,
    filter,
    showMemberGroupFilter,
  });
  const {
    options: categoryOptions,
    isFacetsLoading,
    isFacetsError,
    isFacetsValidating,
  } = useAdminConsumptionFacets({
    workspaceId: owner.sId,
    period,
    filter: state.draftScopeFilter,
    disabled: !state.isOpen,
  });

  return (
    <UsageFilterPanelView
      filter={filter}
      onFilterChange={onFilterChange}
      showMemberGroupFilter={showMemberGroupFilter}
      state={state}
      categoryOptions={categoryOptions}
      isFacetsLoading={isFacetsLoading}
      isFacetsError={Boolean(isFacetsError)}
      isFacetsValidating={isFacetsValidating}
    />
  );
}
