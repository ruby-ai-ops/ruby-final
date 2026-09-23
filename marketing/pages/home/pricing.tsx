// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
import { HomeAIOperatorsCTASection } from "@marketing/components/home/content/Product/HomeAIOperatorsCTASection";
import { FAQ, type FAQItem } from "@marketing/components/home/FAQ";
import type { LandingLayoutProps } from "@marketing/components/home/LandingLayout";
import LandingLayout from "@marketing/components/home/LandingLayout";
import { PageMetadata } from "@marketing/components/home/PageMetadata";
import {
  CP_MAX_SEAT_COST_MONTHLY,
  CP_MAX_SEAT_COST_YEARLY,
  CP_PRO_SEAT_COST_MONTHLY,
  CP_PRO_SEAT_COST_YEARLY,
  formatPriceWithCurrency,
  useUserBillingCurrency,
} from "@marketing/lib/client/subscription";
import {
  TRACKING_ACTIONS,
  TRACKING_AREAS,
  trackEvent,
} from "@marketing/lib/tracking";
import { classNames } from "@marketing/lib/utils";
import { appendUTMParams } from "@marketing/lib/utils/utm";
import { useSignUpModal } from "@marketing/hooks/useSignUpModal";
import {
  Brain,
  Button,
  CalendarCheck01,
  Check,
  ChevronDown,
  CoinsStacked01,
  cn,
  CurrencyDollarCircle,
  Globe01,
  Headphones01,
  Icon,
  Link01,
  Minus,
  Scales01,
  SearchInput,
  SearchLg,
  Server03,
  Settings01,
  ShieldTick,
  Star01,
  Settings02,
  Users01,
} from "@ruby-ai/ui";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useRouter } from "next/router";
import type React from "react";
import type { ReactElement, ReactNode } from "react";
import { useState } from "react";

export async function getStaticProps() {
  return {
    props: {
      gtmTrackingId: process.env.NEXT_PUBLIC_GTM_TRACKING_ID ?? null,
    },
  };
}

// ---------- Types ----------

type PricingIcon = React.ComponentType<{ className?: string }>;

interface TierBenefit {
  label: string;
  icon: PricingIcon;
}

interface SeatTier {
  id: "free" | "pro" | "max";
  name: string;
  eyebrow: string;
  tagline: string;
  cta: string;
  priceYearDollars: number;
  priceMonthDollars: number;
  credits: string;
  creditDetail: string;
  benefits: TierBenefit[];
}

interface Plan {
  id: "business" | "enterprise";
  name: string;
}

type CellValue = boolean | string;

interface ComparisonRow {
  feature: string;
  featureShort?: string;
  note?: string;
  business: CellValue;
  enterprise: CellValue;
}

interface ComparisonSectionData {
  section: string;
  rows: ComparisonRow[];
}

interface FAQItemData {
  q: string;
  a: ReactNode;
}

type Billing = "yearly" | "monthly";

// ---------- Data (mirrors pricing bundle / feature.csv) ----------

const SEAT_TIERS: SeatTier[] = [
  {
    id: "free",
    name: "Free",
    eyebrow: "Explore Ruby",
    tagline: "Build a useful first teammate.",
    cta: "Start free",
    priceYearDollars: 0,
    priceMonthDollars: 0,
    credits: "100 credits · Lifetime",
    creditDetail: "Start with real work, not a trial timer.",
    benefits: [
      { label: "20+ frontier models", icon: Star01 },
      { label: "Custom AI teammates", icon: Brain },
      { label: "Connected everyday tools", icon: Link01 },
      { label: "Shared team workspaces", icon: Users01 },
      { label: "US or EU data residency", icon: Globe01 },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    eyebrow: "For every teammate",
    tagline: "The daily AI teammate.",
    cta: "Start with Pro",
    priceYearDollars: CP_PRO_SEAT_COST_YEARLY,
    priceMonthDollars: CP_PRO_SEAT_COST_MONTHLY,
    credits: "500 credits /seat/mo",
    creditDetail: "Useful daily work across your tools.",
    benefits: [
      { label: "Everything in Free +", icon: Star01 },
      { label: "Custom agents + knowledge", icon: Brain },
      { label: "Slack, Notion, GitHub + more", icon: Link01 },
      { label: "Schedules and agent workflows", icon: CalendarCheck01 },
      { label: "Collaboration workspaces", icon: Users01 },
    ],
  },
  {
    id: "max",
    name: "Max",
    eyebrow: "For operators",
    tagline: "Depth for repeated work.",
    cta: "Choose Max",
    priceYearDollars: CP_MAX_SEAT_COST_YEARLY,
    priceMonthDollars: CP_MAX_SEAT_COST_MONTHLY,
    credits: "2,500 credits /seat/mo",
    creditDetail: "For research, automation, and heavy tool use.",
    benefits: [
      { label: "Everything in Pro +", icon: Star01 },
      { label: "Deep research at speed", icon: SearchLg },
      { label: "Complex automations", icon: Settings01 },
      { label: "Tool-heavy workflows", icon: Settings02 },
      { label: "Team collaboration spaces", icon: Users01 },
    ],
  },
];

const PLANS: Plan[] = [
  {
    id: "business",
    name: "Business",
  },
  {
    id: "enterprise",
    name: "Enterprise",
  },
];

const ENTERPRISE_BENEFITS: TierBenefit[] = [
  { label: "Unlimited connectors & MCP servers", icon: Link01 },
  { label: "Pooled credits & volume pricing", icon: CoinsStacked01 },
  { label: "SCIM, audit logs & data controls", icon: ShieldTick },
  { label: "Single-tenant deployment", icon: Server03 },
  { label: "Dedicated CSM, support & SLA", icon: Headphones01 },
  { label: "Custom legal terms", icon: Scales01 },
];

const COMPARISON: ComparisonSectionData[] = [
  {
    section: "Features",
    rows: [
      {
        feature:
          "20+ frontier models (GPT, Claude, Gemini, Mistral, DeepSeek) + multi-modal input",
        featureShort: "20+ frontier models + multi-modal input",
        business: true,
        enterprise: true,
      },
      {
        feature: "Custom agents with skills + knowledge & tools",
        business: true,
        enterprise: true,
      },
      {
        feature:
          "Multi-agent orchestration & triggers (scheduled + event-driven)",
        featureShort: "Multi-agent orchestration & triggers",
        business: true,
        enterprise: true,
      },
      {
        feature: "MCP servers (native + remote)",
        business: "5 remote",
        enterprise: true,
      },
      {
        feature: "Frames (interactive dashboards & apps)",
        featureShort: "Frames",
        business: "Standard",
        enterprise: "White-labelled",
      },
      {
        feature: "Pods (collaborative workspaces with shared context)",
        featureShort: "Pods",
        business: true,
        enterprise: true,
      },
    ],
  },
  {
    section: "Company data",
    rows: [
      {
        feature: "Connectors to 20+ data sources",
        business: "Up to 3",
        enterprise: true,
      },
      {
        feature: "Search + query & extract across all company data",
        featureShort: "Search, query & extract",
        business: true,
        enterprise: true,
      },
      {
        feature: "Spaces for data segmentation & permissions",
        featureShort: "Spaces",
        business: "5",
        enterprise: true,
      },
    ],
  },
  {
    section: "Security & admin",
    rows: [
      {
        feature: "SOC 2 Type II",
        business: true,
        enterprise: true,
      },
      {
        feature: "SSO (Okta, Entra ID, Jumpcloud)",
        business: "5+ seats on demand",
        enterprise: true,
      },
      {
        feature: "SCIM provisioning",
        business: false,
        enterprise: true,
      },
      {
        feature: "Audit logs & advanced security controls",
        business: false,
        enterprise: true,
      },
      {
        feature: "Data residency",
        business: "US / EU",
        enterprise: "US / EU",
      },
      {
        feature: "Single-tenant deployment",
        business: false,
        enterprise: true,
      },
      {
        feature: "Custom legal terms (MSA, DPA)",
        business: false,
        enterprise: true,
      },
      {
        feature: "Usage analytics & adoption reporting",
        business: false,
        enterprise: true,
      },
    ],
  },
  {
    section: "Support",
    rows: [
      {
        feature: "Support tier",
        business: "Email",
        enterprise: "Priority + SLA",
      },
      {
        feature: "Dedicated CSM & onboarding",
        business: false,
        enterprise: true,
      },
    ],
  },
  {
    section: "Developer tools",
    rows: [
      {
        feature: "Developer API",
        business: "Conversation API",
        enterprise: "+ Data Source API",
      },
      {
        feature: "Automation platforms (Zapier, Make, n8n, Power Automate)",
        featureShort: "Automation platforms",
        business: true,
        enterprise: true,
      },
      {
        feature: "Programmatic usage rate",
        business: "$0.01 / credit",
        enterprise: "Custom",
      },
    ],
  },
];

function SeatTiersFAQAnswer() {
  const currency = useUserBillingCurrency();
  const formatSeatPrice = (priceDollars: number) =>
    formatPriceWithCurrency(priceDollars, currency);

  const pro = SEAT_TIERS.find((tier) => tier.id === "pro");
  const max = SEAT_TIERS.find((tier) => tier.id === "max");

  return (
    <>
      <p className="mb-3">
        These are seat types within the Business plan. Admins assign one to each
        user based on that individual's expected usage:
      </p>
      <ul>
        <li>
          <strong>Free:</strong> {formatSeatPrice(0)}, 100 credits lifetime.
          Best for occasional users or people trying Ruby.
        </li>
        <li>
          <strong>Pro:</strong>{" "}
          {formatSeatPrice(pro?.priceMonthDollars ?? CP_PRO_SEAT_COST_MONTHLY)}
          /month, or{" "}
          {formatSeatPrice(pro?.priceYearDollars ?? CP_PRO_SEAT_COST_YEARLY)}
          /month billed yearly, with 500 credits/month. Best for most team
          members.
        </li>
        <li>
          <strong>Max:</strong>{" "}
          {formatSeatPrice(max?.priceMonthDollars ?? CP_MAX_SEAT_COST_MONTHLY)}
          /month, or{" "}
          {formatSeatPrice(max?.priceYearDollars ?? CP_MAX_SEAT_COST_YEARLY)}
          /month billed yearly, with 2,500 credits/month. Best for power users
          running complex automations, Deep research, or tool-heavy workflows
          regularly.
        </li>
      </ul>
      <p className="mt-3">
        You can mix and match seat types across your workspace and reassign them
        anytime as usage changes.{" "}
        <a
          href="https://docs.ruby.ad/docs/seat-management"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-highlight hover:underline"
        >
          Learn more about seats
        </a>
        .
      </p>
    </>
  );
}

const FAQS: FAQItemData[] = [
  {
    q: "What is a credit?",
    a: (
      <>
        A credit is Ruby's unit for measuring AI usage. Credit consumption
        depends on the model used, the complexity of the task, and any tools the
        agent uses, such as search, data retrieval, code execution, or actions
        in connected apps.{" "}
        <a
          href="https://docs.ruby.ad/docs/credits"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-highlight hover:underline"
        >
          Learn more about credits
        </a>
        .
      </>
    ),
  },
  {
    q: "How are credits consumed?",
    a: (
      <>
        Credits are charged per message, based on the model used and the actions
        performed. Basic chat with a token-efficient model like Claude Sonnet
        will consume few credits, while a deep research task that requires
        complex, multi-step orchestration and tool use will consume more. You'll
        be able to track your credit usage in Ruby so that you can understand
        how different workflows consume credits.{" "}
        <a
          href="https://docs.ruby.ad/docs/credit-management"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-highlight hover:underline"
        >
          Learn more about managing credits
        </a>
        .
      </>
    ),
  },
  {
    q: "Do unused credits roll over?",
    a: "No. Each seat's monthly credit allocation resets at the start of every billing period. This keeps pricing predictable and makes it easier for teams to plan.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "If an agent is already generating a response, it will finish; you won't be cut off mid-response. After that, additional usage depends on your seat type and workspace settings. Pro and Max users will be able to continue through workspace overage if enabled by an admin up to a capped amount. Free users are prompted to request an upgrade.",
  },
  {
    q: "What's the difference between Free, Pro, and Max seats?",
    a: <SeatTiersFAQAnswer />,
  },
  {
    q: "How does billing work when I add or remove members?",
    a: "Adding a member mid-cycle is prorated: they get their full credit allocation immediately, and you're charged only for the remaining days in the period on your next invoice. Removing a member frees the seat for reassignment. Monthly seats can be cancelled anytime; annual seats stay available for reassignment until their commitment ends.",
  },
  {
    q: "Which AI models are included?",
    a: "All plans include access to 20+ models from OpenAI, Anthropic, Google, Mistral, and DeepSeek. You choose the model per agent. No model is locked behind a higher plan, though higher-capability models may consume more credits per message.",
  },
  {
    q: "When should I consider Enterprise?",
    a: "Enterprise is best for organizations that need advanced security and admin controls, dedicated support, custom terms, or more flexible usage arrangements at scale. This includes needs like SCIM, audit logs, SLAs, hands-on onboarding, and Customer Success support.",
  },
];

// ---------- Subcomponents ----------

interface BillingToggleProps {
  billing: Billing;
  setBilling: (b: Billing) => void;
}

function BillingToggle({ billing, setBilling }: BillingToggleProps) {
  const pillBase =
    "inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 heading-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted";

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <p className="text-[11px] font-bold uppercase tracking-normal text-muted-foreground">
        Billing cadence
      </p>
      <div
        role="group"
        aria-label="Billing period"
        className="flex w-full items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-100/80 p-1.5 shadow-inner"
      >
        <button
          type="button"
          data-val="yearly"
          aria-pressed={billing === "yearly"}
          onClick={() => setBilling("yearly")}
          className={cn(
            pillBase,
            billing === "yearly"
              ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Yearly
          <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
            Save 20%
          </span>
        </button>
        <button
          type="button"
          data-val="monthly"
          aria-pressed={billing === "monthly"}
          onClick={() => setBilling("monthly")}
          className={cn(
            pillBase,
            billing === "monthly"
              ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
      </div>
    </div>
  );
}

const TIER_TONE: Record<
  SeatTier["id"],
  { credit: string; icon: string; iconColor: string }
> = {
  free: {
    credit: "bg-gray-100/80",
    icon: "bg-gray-100",
    iconColor: "text-gray-600",
  },
  pro: {
    credit: "bg-blue-100/80",
    icon: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  max: {
    credit: "bg-green-100/70",
    icon: "bg-green-100",
    iconColor: "text-green-700",
  },
};

function BenefitList({
  benefits,
  tone = "neutral",
}: {
  benefits: TierBenefit[];
  tone?: "neutral" | SeatTier["id"];
}) {
  const iconClasses =
    tone === "neutral"
      ? { icon: "bg-blue-100", iconColor: "text-blue-700" }
      : TIER_TONE[tone];

  return (
    <ul className="flex flex-col gap-3">
      {benefits.map((benefit) => (
        <li
          key={benefit.label}
          className="copy-sm flex items-start gap-3 text-foreground"
        >
          <span
            aria-hidden="true"
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              iconClasses.icon
            )}
          >
            <Icon
              visual={benefit.icon}
              size="sm"
              className={iconClasses.iconColor}
            />
          </span>
          <span className="pt-1">{benefit.label}</span>
        </li>
      ))}
    </ul>
  );
}

interface TierCardProps {
  tier: SeatTier;
  billing: Billing;
  onStart: () => void;
}

function TierCard({ tier, billing, onStart }: TierCardProps) {
  const currency = useUserBillingCurrency();
  const price =
    billing === "yearly" ? tier.priceYearDollars : tier.priceMonthDollars;
  const tone = TIER_TONE[tier.id];
  const isPro = tier.id === "pro";

  return (
    <article
      data-pricing-tier={tier.id}
      className={cn(
        "relative flex h-full flex-col rounded-3xl bg-background p-6 text-left md:p-7",
        isPro
          ? "border border-blue-400 bg-gradient-to-b from-blue-50/70 to-background shadow-[0_24px_56px_-26px_rgba(37,137,232,0.42)]"
          : "border border-gray-200 shadow-[0_22px_48px_-24px_rgba(23,42,61,0.26)]"
      )}
    >
      {isPro && (
        <span className="absolute right-4 top-0 rounded-b-md bg-blue-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
          Most Popular
        </span>
      )}
      <p
        className={cn(
          "mb-3 text-[11px] font-bold uppercase tracking-normal",
          tier.id === "free"
            ? "text-gray-900"
            : tier.id === "max"
              ? "text-green-700"
              : "text-blue-700"
        )}
      >
        {tier.eyebrow}
      </p>
      <h3 className="heading-3xl mb-1.5 !font-medium text-foreground">
        {tier.name}
      </h3>
      <p className="copy-sm min-h-10 text-muted-foreground">{tier.tagline}</p>

      <div className="mb-5 mt-6">
        <div className="flex items-end gap-1.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${tier.id}-${price}-${currency}`}
              data-pricing-price={tier.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18, ease: [0.215, 0.61, 0.355, 1] }}
              className="heading-4xl tabular-nums text-foreground"
              aria-live="polite"
            >
              {formatPriceWithCurrency(price, currency)}
            </motion.span>
          </AnimatePresence>
          <span className="copy-xs pb-1 text-muted-foreground">
            {tier.id === "free" ? "forever" : "/ seat / month"}
          </span>
        </div>
        <p className="copy-xs mt-1 text-muted-foreground">
          {tier.id === "free"
            ? "No card required"
            : billing === "yearly"
              ? "Billed yearly"
              : "Billed monthly"}
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        label={tier.cta}
        onClick={onStart}
        className="w-full rounded-xl"
      />

      <div
        data-pricing-credit={tier.id}
        className={cn(
          "mb-6 mt-5 flex items-center gap-3 rounded-xl p-3.5",
          tone.credit
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            tone.icon
          )}
        >
          <Icon
            visual={CurrencyDollarCircle}
            size="sm"
            className={tone.iconColor}
          />
        </span>
        <div>
          <p className="copy-sm font-bold text-foreground">{tier.credits}</p>
          <p className="copy-xs mt-0.5 text-muted-foreground">
            {tier.creditDetail}
          </p>
        </div>
      </div>

      <BenefitList benefits={tier.benefits} tone={tier.id} />
    </article>
  );
}

function EnterpriseCard({ onContact }: { onContact: () => void }) {
  return (
    <article
      data-pricing-enterprise
      className="grid gap-8 rounded-3xl border border-gray-200 bg-background p-7 text-left shadow-[0_22px_48px_-24px_rgba(23,42,61,0.24)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:p-9"
    >
      <div className="flex flex-col items-start">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-normal text-blue-700">
          Built to scale
        </p>
        <h3 className="heading-3xl mb-2 !font-medium text-foreground">
          Enterprise
        </h3>
        <p className="copy-base max-w-lg text-muted-foreground">
          Deploy Ruby company-wide with the governance, flexibility, and
          partnership your organization needs.
        </p>
        <Button
          variant="primary"
          size="md"
          label="Talk to sales"
          onClick={onContact}
          className="mt-6 w-full rounded-xl md:w-auto"
        />
      </div>
      <BenefitList benefits={ENTERPRISE_BENEFITS} />
    </article>
  );
}

interface HeroProps {
  billing: Billing;
  setBilling: (b: Billing) => void;
  onBusinessStart: () => void;
  onEnterpriseContact: () => void;
}

function Hero({
  billing,
  setBilling,
  onBusinessStart,
  onEnterpriseContact,
}: HeroProps) {
  return (
    <section className="-mx-6 flex flex-col items-center px-4 pt-6 text-center md:mx-0 md:px-0 md:pt-10 lg:pt-14">
      <h1
        className={classNames(
          "heading-5xl md:heading-6xl lg:heading-7xl",
          "mb-5 max-w-3xl text-balance text-foreground"
        )}
      >
        Plans for every way your team works
      </h1>
      <p className="copy-lg mb-9 max-w-2xl text-balance text-muted-foreground">
        Start free, equip most teammates with Pro, give high-output operators
        Max, or deploy Ruby company-wide with Enterprise.
      </p>

      <div className="w-full max-w-sm">
        <BillingToggle billing={billing} setBilling={setBilling} />
      </div>

      <div className="mt-10 grid w-full max-w-6xl grid-cols-1 items-stretch gap-5 md:grid-cols-3">
        {SEAT_TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            billing={billing}
            onStart={onBusinessStart}
          />
        ))}
      </div>
      <p className="copy-xs mt-4 w-full max-w-6xl text-right text-muted-foreground">
        Prices exclude VAT where applicable.
      </p>
      <div className="mt-5 w-full max-w-6xl">
        <EnterpriseCard onContact={onEnterpriseContact} />
      </div>
    </section>
  );
}

interface FeatureCellProps {
  value: CellValue;
}

function FeatureCell({ value }: FeatureCellProps) {
  if (value === true) {
    return (
      <span
        aria-label="Included"
        className="inline-flex h-6 w-6 items-center justify-center text-foreground"
      >
        <Check className="h-5 w-5" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        aria-label="Not included"
        className="inline-flex h-6 w-6 items-center justify-center text-primary-300"
      >
        <Minus className="h-5 w-5" />
      </span>
    );
  }
  return <span className="copy-sm text-foreground">{value}</span>;
}

interface ComparisonTableProps {
  onBusinessStart: () => void;
  onEnterpriseContact: () => void;
}

function ComparisonTable({
  onBusinessStart,
  onEnterpriseContact,
}: ComparisonTableProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        COMPARISON.map((section) => [
          section.section,
          section.section === "Features",
        ])
      )
  );
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const toggleSection = (sectionName: string) => {
    // Sections are forced open while searching; ignore toggles so the
    // stored open state doesn't silently flip underneath.
    if (isSearching) {
      return;
    }
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !(prev[sectionName] ?? true),
    }));
  };

  const filteredSections = COMPARISON.map((section) => {
    if (!isSearching) {
      return section;
    }
    const rows = section.rows.filter((row) => {
      const haystack = `${row.feature} ${row.note ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
    return { ...section, rows };
  }).filter((section) => !isSearching || section.rows.length > 0);

  const matchCount = filteredSections.reduce(
    (acc, section) => acc + section.rows.length,
    0
  );

  const ctaFor = (planId: Plan["id"]) => {
    if (planId === "business") {
      return (
        <Button
          variant="highlight"
          size="sm"
          label="Start for free"
          onClick={onBusinessStart}
        />
      );
    }
    return (
      <Button
        variant="primary"
        size="sm"
        label="Talk to sales"
        onClick={onEnterpriseContact}
      />
    );
  };

  return (
    <section className="-mx-6 px-3 py-8 md:mx-0 md:px-12 md:py-12 lg:px-32">
      <div>
        <div className="mb-10 text-center md:mb-14">
          <h2 className="heading-5xl">Compare plans feature by feature</h2>
        </div>

        {/* Table */}
        <div>
          <table className="w-full border-separate border-spacing-0">
            {/* top-16 matches the ScrollingHeader scrolled height (h-16). */}
            <thead className="sticky top-16 z-10">
              <tr className="grid grid-cols-2 bg-background md:table-row">
                <th className="hidden border-b border-border bg-background px-2 text-left align-bottom md:table-cell md:py-5">
                  <SearchInput
                    name="features-search"
                    placeholder="Search features…"
                    value={query}
                    onChange={setQuery}
                    className="max-w-xs [&_input]:font-medium [&_input::placeholder]:font-medium"
                  />
                  <span role="status" className="sr-only">
                    {isSearching
                      ? `${matchCount} feature${matchCount === 1 ? "" : "s"} matching`
                      : ""}
                  </span>
                </th>
                {PLANS.map((p) => (
                  <th
                    key={p.id}
                    className="block border-b border-border bg-background px-3 py-4 text-center align-bottom md:table-cell md:w-[240px] md:px-5 md:py-5"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <span className="heading-lg text-foreground">
                        {p.name}
                      </span>
                      {ctaFor(p.id)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {filteredSections.map((section) => {
              const isOpen = isSearching
                ? true
                : (openSections[section.section] ?? true);
              return (
                <tbody
                  key={section.section}
                  // Row-dim on hover, gated to hover-capable devices to avoid
                  // sticky hover on touch.
                  className="motion-safe:[&_tr[data-row=feature]]:transition-opacity motion-safe:[&_tr[data-row=feature]]:duration-200 [@media(hover:hover)]:[&:has(tr[data-row=feature]:hover)_tr[data-row=feature]:not(:hover)]:opacity-40"
                >
                  <tr className="grid grid-cols-1 md:table-row">
                    <th
                      colSpan={3}
                      scope="colgroup"
                      className="block border-t border-border p-0 text-left md:table-cell"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(section.section)}
                        aria-expanded={isOpen}
                        className="group flex w-full items-center justify-between gap-2 px-2 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      >
                        <span className="heading-2xl font-semibold text-foreground">
                          {section.section}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform duration-200",
                            !isOpen && "-rotate-90"
                          )}
                        />
                      </button>
                    </th>
                  </tr>
                  <AnimatePresence initial={false}>
                    {isOpen &&
                      section.rows.map((row, idx) => (
                        <motion.tr
                          key={`${section.section}:${row.feature}`}
                          data-row="feature"
                          className={cn(
                            "grid grid-cols-2 md:table-row",
                            idx % 2 === 1 && "bg-muted/40"
                          )}
                          initial={{ y: -4 }}
                          animate={{ y: 0 }}
                          transition={{
                            duration: 0.18,
                            ease: [0.215, 0.61, 0.355, 1],
                          }}
                        >
                          <td className="col-span-2 block px-2 pb-1.5 pt-3.5 align-middle md:table-cell md:py-3.5 md:pb-3.5">
                            <span className="copy-sm block max-w-[560px] font-medium text-foreground">
                              <span className="md:hidden">
                                {row.featureShort ?? row.feature}
                              </span>
                              <span className="hidden md:inline">
                                {row.feature}
                              </span>
                            </span>
                            {row.note && (
                              <span className="copy-xs mt-0.5 block font-medium text-faint">
                                {row.note}
                              </span>
                            )}
                          </td>
                          <td className="block px-2 pb-3.5 pt-1.5 text-center align-middle md:table-cell md:w-[240px] md:px-5 md:py-3.5 md:pt-3.5">
                            <FeatureCell value={row.business} />
                          </td>
                          <td className="block px-2 pb-3.5 pt-1.5 text-center align-middle md:table-cell md:w-[240px] md:px-5 md:py-3.5 md:pt-3.5">
                            <FeatureCell value={row.enterprise} />
                          </td>
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </tbody>
              );
            })}
            {isSearching && filteredSections.length === 0 && (
              <tbody>
                <tr>
                  <td
                    colSpan={3}
                    className="border-t border-border px-2 py-12 text-center copy-sm text-muted-foreground"
                  >
                    No features match “{query}”.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const items: FAQItem[] = FAQS.map((f) => ({
    question: f.q,
    answer: f.a,
  }));

  return (
    <section className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen border-y border-border bg-muted">
      <div className="container mx-auto px-6 py-20">
        <div className="px-4 md:px-12 lg:px-32">
          <FAQ title="Frequently asked questions" items={items} />
        </div>
      </div>
    </section>
  );
}

// ---------- Page ----------

export default function Pricing() {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing>("yearly");
  const { openSignUpModal } = useSignUpModal();

  const onBusinessStart = () => {
    trackEvent({
      area: TRACKING_AREAS.PRICING,
      object: "plan_card_start_trial",
      action: TRACKING_ACTIONS.CLICK,
      extra: { plan: "business", billing },
    });
    openSignUpModal();
  };

  const onEnterpriseContact = () => {
    trackEvent({
      area: TRACKING_AREAS.PRICING,
      object: "plan_card_contact_sales",
      action: TRACKING_ACTIONS.CLICK,
      extra: { plan: "enterprise", billing },
    });
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = appendUTMParams("/home/contact");
  };

  return (
    <MotionConfig reducedMotion="user">
      <PageMetadata
        title="Ruby AI Pricing: Business and Enterprise Plans for AI Agents"
        description={`Ruby AI scales from a single builder to thousands of seats. Business self-serve with Pro ($${CP_PRO_SEAT_COST_YEARLY}/seat/mo yearly) and Max ($${CP_MAX_SEAT_COST_YEARLY}/seat/mo yearly) seats, Enterprise for organizations at scale.`}
        pathname={router.asPath}
      />
      <Hero
        billing={billing}
        setBilling={setBilling}
        onBusinessStart={onBusinessStart}
        onEnterpriseContact={onEnterpriseContact}
      />
      <ComparisonTable
        onBusinessStart={onBusinessStart}
        onEnterpriseContact={onEnterpriseContact}
      />
      <FAQSection />
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen md:-mt-24 xl:-mt-16 2xl:-mt-24">
        <HomeAIOperatorsCTASection />
      </div>
    </MotionConfig>
  );
}

Pricing.getLayout = (page: ReactElement, pageProps: LandingLayoutProps) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
