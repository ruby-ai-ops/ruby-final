import type { DisplayMode } from "@app/components/workspace/ProgrammaticCostChart";
import {
  BaseProgrammaticCostChart,
  formatPeriod,
} from "@app/components/workspace/ProgrammaticCostChart";
import type { GroupByType } from "@app/lib/api/analytics/programmatic_cost";
import { getBillingCycleFromDay } from "@app/lib/client/subscription";
import { useAdminProgrammaticCost } from "@app/admin-app/swr/credits";
import type { WorkspaceType } from "@app/types/user";
import { useState } from "react";

interface AdminProgrammaticCostChartProps {
  owner: WorkspaceType;
  billingCycleStartDay: number;
}

/**
 * Admin-specific wrapper component that handles data fetching
 * using the admin API endpoint (for super users).
 */
export function AdminProgrammaticCostChart({
  owner,
  billingCycleStartDay,
}: AdminProgrammaticCostChartProps) {
  const [groupBy, setGroupBy] = useState<GroupByType | undefined>(undefined);
  const [groupByCount, setGroupByCount] = useState<number>(5);
  const [filter, setFilter] = useState<Partial<Record<GroupByType, string[]>>>(
    {}
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>("cumulative");

  // Initialize selectedPeriod to a date within the current billing cycle.
  // Using just formatPeriod(now) would create a date on the 1st of the month,
  // which may fall in the previous billing cycle if billingCycleStartDay > 1.
  // By using the billing cycle's start date, we ensure we're in the correct cycle.
  const now = new Date();
  const currentBillingCycle = getBillingCycleFromDay(
    billingCycleStartDay,
    now,
    true
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    formatPeriod(currentBillingCycle.cycleStart)
  );

  const {
    programmaticCostData,
    isProgrammaticCostLoading,
    isProgrammaticCostError,
  } = useAdminProgrammaticCost({
    owner,
    selectedPeriod,
    billingCycleStartDay,
    groupBy,
    groupByCount,
    filter,
  });

  return (
    <BaseProgrammaticCostChart
      workspaceId={owner.sId}
      programmaticCostData={programmaticCostData}
      isProgrammaticCostLoading={isProgrammaticCostLoading}
      isProgrammaticCostError={!!isProgrammaticCostError}
      groupBy={groupBy}
      setGroupBy={setGroupBy}
      groupByCount={groupByCount}
      setGroupByCount={setGroupByCount}
      filter={filter}
      setFilter={setFilter}
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      billingCycleStartDay={billingCycleStartDay}
      displayMode={displayMode}
      setDisplayMode={setDisplayMode}
    />
  );
}
