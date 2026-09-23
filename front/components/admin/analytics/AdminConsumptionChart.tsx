import { ConsumptionBurnUpChart } from "@app/components/workspace/analytics/consumption/ConsumptionBurnUpChart";
import type { ConsumptionChartProps } from "@app/components/workspace/analytics/consumption/ConsumptionChart";
import {
  CONSUMPTION_CHART_BREAKDOWN_COUNT,
  ConsumptionDailyChart,
} from "@app/components/workspace/analytics/consumption/ConsumptionChart";
import {
  consumptionGranularityLabel,
  DEFAULT_CONSUMPTION_GRANULARITY,
} from "@app/lib/analytics/consumption_period";
import type { ConsumptionTimeseriesMode } from "@app/lib/api/analytics/consumption/timeseries";
import {
  useAdminConsumptionOverview,
  useAdminConsumptionTimeseries,
} from "@app/admin-app/swr/consumption";
import { ButtonsSwitch, ButtonsSwitchList } from "@ruby-ai/ui";
import type { ReactNode } from "react";
import { useState } from "react";

interface AdminConsumptionDailyChartProps extends ConsumptionChartProps {
  additionalControls: ReactNode;
}

function AdminConsumptionDailyChart({
  workspaceId,
  period,
  granularity,
  dimension,
  filter,
  additionalControls,
}: AdminConsumptionDailyChartProps) {
  const showActiveUsers = filter?.users?.length !== 1;
  const { timeseries, isTimeseriesLoading, isTimeseriesError } =
    useAdminConsumptionTimeseries({
      workspaceId,
      period,
      granularity,
      mode: "period",
      breakdownBy: dimension,
      breakdownCount: CONSUMPTION_CHART_BREAKDOWN_COUNT,
      filter,
    });
  const isFiltered = Object.values(filter ?? {}).some(
    (values) => values.length > 0
  );

  return (
    <ConsumptionDailyChart
      timeseries={timeseries}
      isTimeseriesLoading={isTimeseriesLoading}
      isTimeseriesError={Boolean(isTimeseriesError)}
      emptyMessage={
        isFiltered
          ? "No consumption matches the current filters."
          : "No consumption over this period."
      }
      additionalControls={additionalControls}
      showActiveUsers={showActiveUsers}
    />
  );
}

interface AdminConsumptionBurnUpChartProps
  extends Omit<ConsumptionChartProps, "dimension"> {
  additionalControls: ReactNode;
}

function AdminConsumptionBurnUpChart({
  workspaceId,
  period,
  granularity,
  filter,
  additionalControls,
}: AdminConsumptionBurnUpChartProps) {
  const { overview } = useAdminConsumptionOverview({
    workspaceId,
    period,
    filter,
  });
  const isFiltered = Object.values(filter ?? {}).some(
    (values) => values.length > 0
  );
  // A cap only exists on a billing cycle, when there's no filter. Gating on the
  // selection rather than on the response alone keeps a previous cycle's cap —
  // kept around by `keepPreviousData` while the new request lands — from drawing
  // a target over a period that has none.
  const capCredits =
    period.kind === "cycle" && !isFiltered
      ? (overview?.creditUsage?.capCredits ?? null)
      : null;

  const { timeseries, isTimeseriesLoading, isTimeseriesError } =
    useAdminConsumptionTimeseries({
      workspaceId,
      period,
      granularity,
      mode: "cumulative",
      filter,
    });

  return (
    <ConsumptionBurnUpChart
      timeseries={timeseries}
      capCredits={capCredits}
      isTimeseriesLoading={isTimeseriesLoading}
      isTimeseriesError={Boolean(isTimeseriesError)}
      emptyMessage={
        isFiltered
          ? "No consumption matches the current filters."
          : "No consumption over this period."
      }
      additionalControls={additionalControls}
    />
  );
}

export function AdminConsumptionChart({
  workspaceId,
  period,
  granularity = DEFAULT_CONSUMPTION_GRANULARITY,
  dimension,
  filter,
}: ConsumptionChartProps) {
  const [mode, setMode] = useState<ConsumptionTimeseriesMode>("period");
  const modeSelector = (
    <ButtonsSwitchList value={mode} size="xs">
      <ButtonsSwitch
        value="period"
        label={consumptionGranularityLabel(granularity)}
        onClick={() => setMode("period")}
      />
      <ButtonsSwitch
        value="cumulative"
        label="Cumulative"
        onClick={() => setMode("cumulative")}
      />
    </ButtonsSwitchList>
  );

  return mode === "cumulative" ? (
    <AdminConsumptionBurnUpChart
      workspaceId={workspaceId}
      period={period}
      granularity={granularity}
      filter={filter}
      additionalControls={modeSelector}
    />
  ) : (
    <AdminConsumptionDailyChart
      workspaceId={workspaceId}
      period={period}
      granularity={granularity}
      dimension={dimension}
      filter={filter}
      additionalControls={modeSelector}
    />
  );
}
