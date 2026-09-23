import { useAdminAwuPoolCurrentCycle } from "@app/admin-app/swr/credits";
import { AdminWorkspaceUsageChart } from "@app/components/admin/analytics/AdminWorkspaceUsageChart";
import { AdminApiKeysUsageTable } from "@app/components/admin/credits/AdminApiKeysUsageTable";
import { AdminAwuUsageFromAnalyticsChart } from "@app/components/admin/credits/AdminAwuUsageFromAnalyticsChart";
import { AdminMembersUsageTable } from "@app/components/admin/credits/AdminMembersUsageTable";
import { AdminTopUpsHistoryTable } from "@app/components/admin/credits/AdminTopUpsHistoryTable";
import { AlertChip } from "@app/components/admin/credits/AlertChip";
import { CreditStateLogsLink } from "@app/components/admin/credits/CreditStateLogsLink";
import { RateLimiterStateChip } from "@app/components/admin/credits/RateLimiterStateChip";
import { ReconcileCreditStateButton } from "@app/components/admin/credits/ReconcileCreditStateButton";
import type {
  AdminCreditUsageConfig,
  AdminProgrammaticAlerts,
  AdminStripeSubscriptionWire,
} from "@app/lib/api/admin/workspace_info";
import type { RateLimiterState } from "@app/lib/api/credits/members_usage";
import { formatCredits, formatCreditsPrecise } from "@app/lib/client/credits";
import type { DefaultMetronomeAlerts } from "@app/lib/metronome/alerts/default_alerts";
import type { MetronomeAlertRef } from "@app/lib/metronome/alerts/types";
import type {
  WorkspacePoolCreditState,
  WorkspaceProgrammaticCreditState,
} from "@app/types/credits";
import type { SubscriptionType } from "@app/types/plan";
import { assertNeverAndIgnore } from "@app/types/shared/utils/assert_never";
import type { WorkspaceType } from "@app/types/user";
import {
  AlertCircle,
  Chip,
  ContentMessage,
  ProgressBar,
  Spinner,
  ValueCard,
} from "@ruby-ai/ui";

interface AdminUsageTabProps {
  owner: WorkspaceType;
  hasMetronomeBillingUsage: boolean;
  subscription: SubscriptionType;
  stripeSubscription: AdminStripeSubscriptionWire | null;
  poolCreditState: WorkspacePoolCreditState;
  programmaticRateLimiterState: RateLimiterState | null;
  programmaticSpendLimitRateCapCount: number | null;
  programmaticEsConsumedAwuCredits: number | null;
  programmaticMetronomeConsumedAwuCredits: number | null;
  creditUsageConfig: AdminCreditUsageConfig | null;
  poolAlert: MetronomeAlertRef | null;
  programmaticAlerts: AdminProgrammaticAlerts;
  usageCapAlert: MetronomeAlertRef | null;
  defaultAlerts: DefaultMetronomeAlerts;
}

interface SpendCountersInlineProps {
  esConsumedAwuCredits: number | null;
  rateLimiterAwuCredits: number | null;
  metronomeConsumedAwuCredits: number | null;
}

const formatCreditsOrDash = (value: number | null): string =>
  value !== null ? formatCreditsPrecise(value) : "—";

// The three spend figures for a cap dimension shown together to spot
// divergence: ES = Elasticsearch-derived, RL = Redis rate-limiter counter (the
// value enforcement reads), MT = Metronome-derived. Mirrors the
// "Consumed (ES / RL / MT)" column in the members table.
function SpendCountersInline({
  esConsumedAwuCredits,
  rateLimiterAwuCredits,
  metronomeConsumedAwuCredits,
}: SpendCountersInlineProps) {
  return (
    <span className="text-xs text-muted-foreground">
      ES {formatCreditsOrDash(esConsumedAwuCredits)} / RL{" "}
      {formatCreditsOrDash(rateLimiterAwuCredits)} / MT{" "}
      {formatCreditsOrDash(metronomeConsumedAwuCredits)}
    </span>
  );
}

type CreditStateChipColor = "success" | "warning" | "warning" | "info";

// Shared color mapping for the workspace pool and programmatic credit states.
// Both unions share the active/low/critical/depleted members; `overage` is
// pool-only.
function creditStateChipColor(
  state: WorkspacePoolCreditState | WorkspaceProgrammaticCreditState
): CreditStateChipColor {
  switch (state) {
    case "active":
      return "success";
    case "active_low_balance":
      return "warning";
    case "active_critical_balance":
      return "warning";
    case "overage":
      return "info";
    case "depleted":
      return "warning";
    default:
      assertNeverAndIgnore(state);
      return "info";
  }
}

interface AdminCreditStatesCardProps {
  owner: WorkspaceType;
  creditUsageConfig: AdminCreditUsageConfig | null;
  poolCreditState: WorkspacePoolCreditState;
  programmaticRateLimiterState: RateLimiterState | null;
  programmaticSpendLimitRateCapCount: number | null;
  programmaticEsConsumedAwuCredits: number | null;
  programmaticMetronomeConsumedAwuCredits: number | null;
  poolAlert: MetronomeAlertRef | null;
  programmaticAlerts: AdminProgrammaticAlerts;
}

function AdminCreditStatesCard({
  owner,
  creditUsageConfig,
  poolCreditState,
  programmaticRateLimiterState,
  programmaticSpendLimitRateCapCount,
  programmaticEsConsumedAwuCredits,
  programmaticMetronomeConsumedAwuCredits,
  poolAlert,
  programmaticAlerts,
}: AdminCreditStatesCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <span className="text-sm font-medium text-foreground">
        Credit state machine
      </span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Pool</span>
          <Chip
            size="xs"
            color={creditStateChipColor(poolCreditState)}
            label={poolCreditState}
          />
          <AlertChip alert={poolAlert} label="balance alert" />
          <CreditStateLogsLink machine="pool" workspaceId={owner.sId} />
          <ReconcileCreditStateButton owner={owner} target="pool" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Programmatic</span>
          {/* The rate-limiter is authoritative; its verdict already encodes
              near-limit, so there is no separate warning chip. */}
          <RateLimiterStateChip
            rateLimiterState={programmaticRateLimiterState}
          />
          <span className="text-xs text-muted-foreground">
            cap:{" "}
            {creditUsageConfig
              ? `${formatCredits(creditUsageConfig.programmaticMonthlyCapAwuCredits)} credits`
              : "—"}
          </span>
          <SpendCountersInline
            esConsumedAwuCredits={programmaticEsConsumedAwuCredits}
            rateLimiterAwuCredits={programmaticSpendLimitRateCapCount}
            metronomeConsumedAwuCredits={
              programmaticMetronomeConsumedAwuCredits
            }
          />
          <AlertChip alert={programmaticAlerts.cap} label="cap alert" />
          <AlertChip alert={programmaticAlerts.warning} label="warning (80%)" />
          <AlertChip alert={programmaticAlerts.low} label="low (-100)" />
          <AlertChip
            alert={programmaticAlerts.critical}
            label="critical (-10)"
          />
          <CreditStateLogsLink machine="programmatic" workspaceId={owner.sId} />
        </div>
      </div>
    </div>
  );
}

interface AdminCreditConfigCardProps {
  creditUsageConfig: AdminCreditUsageConfig | null;
  usageCapAlert: MetronomeAlertRef | null;
}

function AdminCreditConfigCard({
  creditUsageConfig,
  usageCapAlert,
}: AdminCreditConfigCardProps) {
  const paygEnabled = creditUsageConfig?.paygEnabled ?? false;
  const usageCapCredits = creditUsageConfig?.usageCapCredits ?? null;
  const defaultDiscountPercent = creditUsageConfig?.defaultDiscountPercent ?? 0;
  const hasUsageCap = usageCapCredits !== null && usageCapCredits > 0;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <span className="text-sm font-medium text-foreground">
        Credit configuration
      </span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">PAYG</span>
          <Chip
            size="xs"
            color={paygEnabled ? "success" : "warning"}
            label={paygEnabled ? "enabled" : "disabled"}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Usage cap</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
            {hasUsageCap ? (
              <>
                {formatCredits(usageCapCredits)} credits
                <AlertChip alert={usageCapAlert} label="alert" />
              </>
            ) : (
              "disabled"
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Default discount
          </span>
          <span className="text-sm font-medium text-foreground">
            {defaultDiscountPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface AdminDefaultAlertsCardProps {
  defaultAlerts: DefaultMetronomeAlerts;
}

// Account-wide default alerts (created by the Metronome setup script, shared
// across all customers). Hidden entirely when none resolve (setup not run in
// this environment).
function AdminDefaultAlertsCard({
  defaultAlerts,
}: AdminDefaultAlertsCardProps) {
  const hasAny = Object.values(defaultAlerts).some((alert) => alert !== null);
  if (!hasAny) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <span className="text-sm font-medium text-foreground">
        Default account alerts
      </span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Pool balance</span>
          <AlertChip alert={defaultAlerts.poolEmpty} label="empty (0)" />
          <AlertChip alert={defaultAlerts.poolLow} label="low (100)" />
          <AlertChip alert={defaultAlerts.poolCritical} label="critical (10)" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Seat balance</span>
          <AlertChip alert={defaultAlerts.seatEmpty} label="empty (0)" />
          <AlertChip alert={defaultAlerts.seatLowMax} label="low · max (500)" />
          <AlertChip alert={defaultAlerts.seatLowPro} label="low · pro (100)" />
        </div>
      </div>
    </div>
  );
}

interface AdminLegacyPerMemberCapCardProps {
  capAwuCredits: number | null;
}

// Non-credit-priced (legacy) workspaces have no Metronome credit-state machine,
// but can still enforce a single workspace-wide per-member credit cap via the
// "Set Per-Member Credit Limit (Legacy Plans)" admin plugin. Enforcement runs off
// a UTC-calendar-month Redis rate-limiter counter (see
// `isNonCreditPricedUserSpendLimitReached`); this card surfaces the configured
// cap so it isn't invisible in admin.
function AdminLegacyPerMemberCapCard({
  capAwuCredits,
}: AdminLegacyPerMemberCapCardProps) {
  return (
    <ValueCard
      title="Per-member credit limit (legacy)"
      subtitle="Enforced per member, per calendar month"
      content={
        <span className="heading-lg text-foreground">
          {capAwuCredits !== null
            ? `${formatCredits(capAwuCredits)} credits`
            : "No limit set"}
        </span>
      }
    />
  );
}

interface AdminCreditPoolCardProps {
  owner: WorkspaceType;
}

function AdminCreditPoolCard({ owner }: AdminCreditPoolCardProps) {
  const {
    awuPoolCurrentCycle,
    isAwuPoolCurrentCycleLoading,
    isAwuPoolCurrentCycleError,
  } = useAdminAwuPoolCurrentCycle({ owner });

  if (isAwuPoolCurrentCycleLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (isAwuPoolCurrentCycleError || !awuPoolCurrentCycle) {
    return (
      <ContentMessage
        title="Failed to load Workspace Credits Pool"
        icon={AlertCircle}
        variant="warning"
      >
        Could not load the credit pool summary for this workspace.
      </ContentMessage>
    );
  }

  const { totalActiveCredits, totalRemainingCredits, overageCredits } =
    awuPoolCurrentCycle;
  const consumed = Math.max(0, totalActiveCredits - totalRemainingCredits);
  const consumedPct =
    totalActiveCredits > 0
      ? Math.min((consumed / totalActiveCredits) * 100, 100)
      : 0;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          Workspace Credits Pool
        </span>
        <span className="text-sm font-semibold text-foreground">
          {formatCredits(consumed)} / {formatCredits(totalActiveCredits)}{" "}
          credits
        </span>
      </div>
      <ProgressBar
        className="h-2 w-full bg-muted-foreground/10"
        values={[
          { value: consumedPct, className: "bg-highlight" },
          { value: 100 - consumedPct, className: "bg-transparent" },
        ]}
      />
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <span>{formatCredits(totalRemainingCredits)} credits remaining</span>
        {overageCredits !== null && overageCredits > 0 && (
          <span>{formatCredits(overageCredits)} overage credits</span>
        )}
      </div>
    </div>
  );
}

export function AdminUsageTab({
  owner,
  hasMetronomeBillingUsage,
  subscription,
  stripeSubscription,
  poolCreditState,
  programmaticRateLimiterState,
  programmaticSpendLimitRateCapCount,
  programmaticEsConsumedAwuCredits,
  programmaticMetronomeConsumedAwuCredits,
  creditUsageConfig,
  poolAlert,
  programmaticAlerts,
  usageCapAlert,
  defaultAlerts,
}: AdminUsageTabProps) {
  if (!hasMetronomeBillingUsage) {
    // Non-credit-based workspaces (no Metronome contract) have no credit
    // diagnostics, but fair-use AWU limits still apply to them (free/trial), so
    // the members table — which surfaces per-user fair-use usage — is shown
    // alongside the activity chart. Legacy plans may also enforce a
    // workspace-wide per-member credit cap (`defaultPoolCapAwuCredits`), so its
    // configured value and the per-member rate-limiter state are surfaced too.
    const legacyPerMemberCapAwuCredits =
      creditUsageConfig?.defaultPoolCapAwuCredits &&
      creditUsageConfig.defaultPoolCapAwuCredits > 0
        ? creditUsageConfig.defaultPoolCapAwuCredits
        : null;
    return (
      <div className="flex flex-col gap-4">
        <AdminWorkspaceUsageChart workspaceId={owner.sId} period={30} />
        <AdminLegacyPerMemberCapCard
          capAwuCredits={legacyPerMemberCapAwuCredits}
        />
        <AdminMembersUsageTable
          owner={owner}
          isCreditBased={hasMetronomeBillingUsage}
          showUserCap={legacyPerMemberCapAwuCredits !== null}
        />
      </div>
    );
  }

  const billingCycleStartDay = stripeSubscription?.current_period_start
    ? new Date(stripeSubscription.current_period_start * 1000).getDate()
    : subscription.startDate
      ? new Date(subscription.startDate).getDate()
      : null;

  return (
    <div className="flex flex-col gap-4">
      <AdminWorkspaceUsageChart workspaceId={owner.sId} period={30} />
      <AdminCreditStatesCard
        owner={owner}
        creditUsageConfig={creditUsageConfig}
        poolCreditState={poolCreditState}
        programmaticRateLimiterState={programmaticRateLimiterState}
        programmaticSpendLimitRateCapCount={programmaticSpendLimitRateCapCount}
        programmaticEsConsumedAwuCredits={programmaticEsConsumedAwuCredits}
        programmaticMetronomeConsumedAwuCredits={
          programmaticMetronomeConsumedAwuCredits
        }
        poolAlert={poolAlert}
        programmaticAlerts={programmaticAlerts}
      />
      <AdminCreditConfigCard
        creditUsageConfig={creditUsageConfig}
        usageCapAlert={usageCapAlert}
      />
      <AdminDefaultAlertsCard defaultAlerts={defaultAlerts} />
      <AdminCreditPoolCard owner={owner} />
      <AdminTopUpsHistoryTable owner={owner} />
      <AdminMembersUsageTable
        owner={owner}
        isCreditBased={hasMetronomeBillingUsage}
      />
      <AdminApiKeysUsageTable owner={owner} />
      {billingCycleStartDay && (
        <AdminAwuUsageFromAnalyticsChart
          owner={owner}
          billingCycleStartDay={billingCycleStartDay}
        />
      )}
    </div>
  );
}
