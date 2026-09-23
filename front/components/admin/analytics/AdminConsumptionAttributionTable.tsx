import type {
  ConsumptionAttributionBreakdownColumnProps,
  ConsumptionAttributionBreakdownProps,
} from "@app/components/workspace/analytics/consumption/ConsumptionAttributionBreakdown";
import {
  CONSUMPTION_ATTRIBUTION_BREAKDOWN_LIMIT,
  ConsumptionAttributionBreakdownColumnView,
  ConsumptionAttributionBreakdownView,
} from "@app/components/workspace/analytics/consumption/ConsumptionAttributionBreakdown";
import type { ConsumptionAttributionRowsTableProps } from "@app/components/workspace/analytics/consumption/ConsumptionAttributionRowsTable";
import { ConsumptionAttributionRowsTableView } from "@app/components/workspace/analytics/consumption/ConsumptionAttributionRowsTable";
import type {
  ConsumptionAttributionRowsProps,
  ConsumptionAttributionTableProps,
} from "@app/components/workspace/analytics/consumption/ConsumptionAttributionTable";
import {
  ConsumptionAttributionRowsView,
  ConsumptionAttributionTableView,
  useConsumptionAttributionRowsQueryState,
} from "@app/components/workspace/analytics/consumption/ConsumptionAttributionTable";
import { useAdminConsumptionTop } from "@app/admin-app/swr/consumption";

function AdminConsumptionAttributionBreakdownColumn({
  workspaceId,
  dimension,
  period,
  filter,
  selectedRowName,
  onViewAll,
}: ConsumptionAttributionBreakdownColumnProps) {
  const { rows, totalCredits, isTopLoading, isTopError } =
    useAdminConsumptionTop({
      workspaceId,
      dimension,
      period,
      limit: CONSUMPTION_ATTRIBUTION_BREAKDOWN_LIMIT,
      filter,
    });

  return (
    <ConsumptionAttributionBreakdownColumnView
      dimension={dimension}
      selectedRowName={selectedRowName}
      onViewAll={onViewAll}
      rows={rows}
      totalCredits={totalCredits}
      isTopLoading={isTopLoading}
      isTopError={Boolean(isTopError)}
    />
  );
}

function AdminConsumptionAttributionBreakdown(
  props: ConsumptionAttributionBreakdownProps
) {
  return (
    <ConsumptionAttributionBreakdownView
      {...props}
      BreakdownColumnComponent={AdminConsumptionAttributionBreakdownColumn}
    />
  );
}

function AdminConsumptionAttributionRowsTable(
  props: ConsumptionAttributionRowsTableProps
) {
  return (
    <ConsumptionAttributionRowsTableView
      {...props}
      BreakdownComponent={AdminConsumptionAttributionBreakdown}
    />
  );
}

function AdminConsumptionAttributionRows(
  props: ConsumptionAttributionRowsProps
) {
  const queryState = useConsumptionAttributionRowsQueryState();
  const isFiltered = Object.values(props.filter ?? {}).some(
    (values) => values.length > 0
  );
  const {
    rows,
    totalCredits,
    totalActiveMembers,
    totalCount,
    isTopLoading,
    isTopError,
    isTopValidating,
  } = useAdminConsumptionTop({
    workspaceId: props.workspaceId,
    dimension: props.dimension,
    period: props.period,
    limit: queryState.pagination.pageSize,
    offset: queryState.pagination.pageIndex * queryState.pagination.pageSize,
    search: props.search,
    filter: props.filter,
    sortOrder: queryState.sortOrder,
  });

  return (
    <ConsumptionAttributionRowsView
      {...props}
      data={{
        rows,
        totalCredits,
        totalActiveMembers,
        totalCount,
        isTopLoading,
        isTopError: Boolean(isTopError),
        isTopValidating,
      }}
      emptyMessage={
        isFiltered
          ? "No consumption matches the current filters."
          : "No consumption over this period."
      }
      queryState={queryState}
      RowsTableComponent={AdminConsumptionAttributionRowsTable}
    />
  );
}

export function AdminConsumptionAttributionTable(
  props: ConsumptionAttributionTableProps
) {
  return (
    <ConsumptionAttributionTableView
      {...props}
      AttributionRowsComponent={AdminConsumptionAttributionRows}
    />
  );
}
