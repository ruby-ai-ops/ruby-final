import {
  formatMicroUsdToUsd,
  makeColumnsForCredits,
} from "@app/components/admin/credits/columns";
import { AdminDataTableConditionalFetch } from "@app/components/admin/AdminConditionalDataTables";
import type { AdminStripeSubscriptionWire } from "@app/lib/api/admin/workspace_info";
import { LoadingBlock, safeLazy, Tooltip } from "@ruby-ai/ui";
import { Suspense } from "react";

const AdminProgrammaticCostChart = safeLazy(() =>
  import("@app/components/admin/credits/AdminProgrammaticCostChart").then(
    (mod) => ({
      default: mod.AdminProgrammaticCostChart,
    })
  )
);

function AdminChartFallback() {
  return <LoadingBlock className="h-96 rounded-lg" />;
}

import { AdminDataTable } from "@app/components/admin/shadcn/ui/data_table";
import type { AdminCreditsData } from "@app/admin-app/swr/credits";
import { useAdminCredits } from "@app/admin-app/swr/credits";
import type { AdminCreditType } from "@app/types/api/admin/credits";
import type { SubscriptionType } from "@app/types/plan";
import type { WorkspaceType } from "@app/types/user";

const ONE_DOLLAR_MICRO_USD = 1_000_000;

interface CreditsDataTableProps {
  owner: WorkspaceType;
  subscription: SubscriptionType;
  stripeSubscription: AdminStripeSubscriptionWire | null;
  loadOnInit?: boolean;
}

function sortRowsByStartDateDescending(
  rows: AdminCreditType[]
): AdminCreditType[] {
  return [...rows].sort((a, b) => {
    const aStart = a.startDate ? new Date(a.startDate).getTime() : null;
    const bStart = b.startDate ? new Date(b.startDate).getTime() : null;
    // Null start dates go first (pending credits).
    if (aStart === null && bStart === null) {
      return 0;
    }
    if (aStart === null) {
      return -1;
    }
    if (bStart === null) {
      return 1;
    }
    return bStart - aStart;
  });
}

export function CreditsDataTable({
  owner,
  subscription,
  stripeSubscription,
  loadOnInit,
}: CreditsDataTableProps) {
  // Get the billing cycle start day from Stripe subscription, fallback to Ruby subscription
  const getBillingCycleStartDay = (): number | null => {
    if (stripeSubscription?.current_period_start) {
      return new Date(stripeSubscription.current_period_start * 1000).getDate();
    }
    if (subscription.startDate) {
      return new Date(subscription.startDate).getDate();
    }
    return null;
  };
  const billingCycleStartDay = getBillingCycleStartDay();

  return (
    <>
      <AdminDataTableConditionalFetch<AdminCreditsData, AdminCreditsData>
        header="API Usage"
        owner={owner}
        loadOnInit={loadOnInit}
        useSWRHook={useAdminCredits}
      >
        {(data) => (
          <div className="space-y-4">
            {data.excessCreditsLast30DaysMicroUsd > ONE_DOLLAR_MICRO_USD && (
              <div className="rounded-md border border-warning-200 bg-warning-50 p-3">
                <Tooltip
                  label="Excess credits are created when programmatic usage exceeds available credits. This tracks over-consumption that needs to be billed."
                  trigger={
                    <p className="cursor-help text-sm font-medium text-warning-800">
                      Excess credits (last 30 days):{" "}
                      {formatMicroUsdToUsd(
                        data.excessCreditsLast30DaysMicroUsd
                      )}
                    </p>
                  }
                />
              </div>
            )}
            <AdminDataTable
              columns={makeColumnsForCredits()}
              data={sortRowsByStartDateDescending(data.rows)}
              defaultFilterColumn="type"
            />
          </div>
        )}
      </AdminDataTableConditionalFetch>

      {billingCycleStartDay && (
        <div className="flex flex-col gap-4">
          <Suspense fallback={<AdminChartFallback />}>
            <AdminProgrammaticCostChart
              owner={owner}
              billingCycleStartDay={billingCycleStartDay}
            />
          </Suspense>
        </div>
      )}
    </>
  );
}
