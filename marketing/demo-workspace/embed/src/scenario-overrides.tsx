import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { getCompanyScenarios } from "../../upstream/app/demo-scenarios";
import type {
  ConversationBlock,
  DemoScenario,
  ArtifactRow,
  InlineRun,
  IntegrationId,
} from "../../upstream/app/demo-scenarios";
import "./scenario-overrides.css";
import {
  REMAINING_INRUBYRY_EXPECTED_DOWNLOADS,
  REMAINING_INRUBYRY_INDICATORS,
  REMAINING_INRUBYRY_ORDER,
  REMAINING_INRUBYRY_REQUIRED_TERMS,
  REMAINING_INRUBYRY_TITLES,
  applyRemainingIndustryScenario,
} from "./remaining-industry-overrides";

const WORKSPACE_TITLES: Record<string, string> = {
  "everglade-sla-risk-command": "Send late drivers to fastest routes",
  "everglade-missed-pickup-recovery": "Reschedule missed deliveries",
  "everglade-carrier-claim-packet": "Update customers on delivery delays",
  "everglade-freight-cost-spike": "Explain this week's route cost",
  "everglade-warehouse-incident": "Dockyard accident report",
  "everglade-customer-escalation": "Resolve the complaint",
  "everglade-capacity-forecast": "Confirm tomorrow's dock capacity",
  "everglade-daily-ops-briefing": "Send the morning driver's brief",
  "everglade-supplier-onboarding": "Launch new operation",
  "everglade-fleet-launch-deck": "Finalize drivers' payments",
  "northstar-contract-risk-scan": "Compare the latest contract versions",
  "northstar-nda-signature-flow": "Follow up on unsigned agreements",
  "northstar-privacy-review": "Collect new client documents",
  "northstar-litigation-chronology": "Put case documents in date order",
  "northstar-clause-precedent-finder": "Find the latest signed agreement",
  "northstar-client-intake": "Schedule client consultations",
  "northstar-regulatory-watch": "Send overdue matter updates",
  "northstar-matter-staffing": "Chase missing time entries",
  "northstar-invoice-review": "Check draft invoices for missing details",
  "northstar-board-memo": "Turn client calls into follow-ups",
  "meadow-demand-forecast": "Create next week's production orders",
  "meadow-recall-simulation": "Pay approved supplier invoices",
  "meadow-quality-deviation": "Order packaging before stock runs out",
  "meadow-cold-chain-alert": "Book refrigerated transport for urgent orders",
  "meadow-batch-traceability": "Create packing lists for store deliveries",
  "meadow-production-schedule": "Balance Michael's workload",
  "meadow-supplier-certificate-audit":
    "Create a presentation for the new cheese recipe",
  "meadow-plant-maintenance-triage":
    "Process replacements for damaged products",
  "meadow-energy-cost-review": "Compare supplier quotes and place the order",
  "meadow-weekly-plant-report": "Submit approved overtime to payroll",
  "vector-internal-tool-prototype": "Set up new customers automatically",
  "vector-incident-root-cause": "Get checkout working again",
  "vector-pull-request-review": "Fix the customer data leak",
  "vector-roadmap-reconciliation": "Ship bulk team invitations",
  "vector-database-debugger": "Speed up large customer exports",
  "vector-documentation-drift": "Keep developer guides up to date",
  "vector-cloud-spend-guard": "Cut the cost of running our AI",
  "vector-regression-explorer": "Test mobile signup before release",
  "vector-feedback-signal-map": "Turn bug reports into repeatable tests",
  "vector-release-communication": "Upgrade the database without disruption",
  ...REMAINING_INRUBYRY_TITLES,
};

const NORTHSTAR_ARTIFACT_LEAD_INS: Record<string, string> = {
  "northstar-contract-risk-scan":
    "The latest contract changes and cited clauses are below.",
  "northstar-nda-signature-flow":
    "The signature reminders and current statuses are below.",
  "northstar-privacy-review":
    "The client document checklist and missing files are below.",
  "northstar-litigation-chronology":
    "The dated document index and uncertain dates are below.",
  "northstar-clause-precedent-finder":
    "The latest signed agreements and amendments are below.",
  "northstar-client-intake":
    "The consultation availability and confirmations are below.",
  "northstar-matter-staffing":
    "The missing time entries and reminders are below.",
  "northstar-invoice-review": "The draft invoice findings are below.",
  "meadow-demand-forecast":
    "The production order comparison and created order are below.",
  "meadow-cold-chain-alert":
    "The confirmed collections and temperature readings are below.",
  "meadow-batch-traceability":
    "The store orders and packing handoff are below.",
  "meadow-production-schedule":
    "The reassigned tasks and remaining owners are below.",
  "meadow-supplier-certificate-audit":
    "The six-slide cheese presentation and sources are below.",
  "meadow-energy-cost-review":
    "The supplier quotes and placed order are below.",
  "vector-internal-tool-prototype":
    "The customer setup run and replay-safe result are below.",
  "vector-incident-root-cause":
    "The rollback timeline and recovery checks are below.",
  "vector-pull-request-review":
    "The account-isolation code changes and test evidence are below.",
  "vector-roadmap-reconciliation":
    "The invitation capabilities and release status are below.",
  "vector-database-debugger":
    "The export timing comparison and record checks are below.",
  "vector-documentation-drift":
    "The guide checks and prepared corrections are below.",
  "vector-cloud-spend-guard":
    "The measured cost changes and quality checks are below.",
  "vector-regression-explorer":
    "The device checks and release decision are below.",
  "vector-feedback-signal-map":
    "The customer reports and reproducible test results are below.",
  "vector-release-communication":
    "The upgrade steps, compatibility checks, and recovery record are below.",
};

const NORTHSTAR_REQUIRED_TERMS: Record<string, string[]> = {
  "northstar-contract-risk-scan": ["contract", "clause"],
  "northstar-nda-signature-flow": ["agreement", "signature"],
  "northstar-privacy-review": ["client", "document"],
  "northstar-litigation-chronology": ["document", "date"],
  "northstar-clause-precedent-finder": ["signed", "agreement", "executed"],
  "northstar-client-intake": ["consultation", "lawyer"],
  "northstar-regulatory-watch": ["matter", "update"],
  "northstar-matter-staffing": ["time", "matter"],
  "northstar-invoice-review": ["invoice", "review"],
  "northstar-board-memo": ["client", "follow-up"],
};

const MEADOW_REQUIRED_TERMS: Record<string, string[]> = {
  "meadow-demand-forecast": ["production order", "created", "netsuite"],
  "meadow-recall-simulation": ["invoice", "paid", "remittance"],
  "meadow-quality-deviation": ["packaging", "purchase order", "cups"],
  "meadow-cold-chain-alert": ["refrigerated", "collection", "confirmed"],
  "meadow-batch-traceability": ["packing list", "warehouse", "reserved"],
  "meadow-production-schedule": ["michael", "tasks", "owner"],
  "meadow-supplier-certificate-audit": ["presentation", "cheese", "gamma"],
  "meadow-plant-maintenance-triage": ["replacement", "customer", "damage"],
  "meadow-energy-cost-review": ["supplier", "quote", "order"],
  "meadow-weekly-plant-report": ["overtime", "payroll", "submitted"],
};

const VECTOR_REQUIRED_TERMS: Record<string, string[]> = {
  "vector-internal-tool-prototype": [
    "customer setup agent",
    "workspace",
    "deployed",
  ],
  "vector-incident-root-cause": ["checkout", "restored", "incident"],
  "vector-pull-request-review": ["account", "isolation", "security"],
  "vector-roadmap-reconciliation": ["invitation", "released", "duplicate"],
  "vector-database-debugger": ["export", "seconds", "checksums"],
  "vector-documentation-drift": ["guide", "correction", "agent"],
  "vector-cloud-spend-guard": ["cost", "quality", "projected"],
  "vector-regression-explorer": ["signup", "checks", "held"],
  "vector-feedback-signal-map": ["reports", "reproduced", "tests"],
  "vector-release-communication": ["database", "upgrade", "recovery"],
};

const NORTHSTAR_EXPECTED_DOWNLOADS: Record<string, string[]> = {
  "northstar-litigation-chronology": [
    "dawson-document-index.xlsx",
    "dawson-source-links.pdf",
  ],
  "northstar-regulatory-watch": ["overdue-matter-updates.pdf"],
  "northstar-board-memo": ["client-call-follow-ups.pdf"],
};

const MEADOW_EXPECTED_DOWNLOADS: Record<string, string[]> = {
  "meadow-batch-traceability": ["store-packing-lists.xlsx"],
  "meadow-supplier-certificate-audit": ["herb-cheese-recipe-presentation.pdf"],
  "meadow-weekly-plant-report": ["approved-overtime-payroll.xlsx"],
};

const VECTOR_EXPECTED_DOWNLOADS: Record<string, string[]> = {
  "vector-incident-root-cause": ["checkout-recovery-record.pdf"],
  "vector-release-communication": ["database-upgrade-record.pdf"],
};

interface WorkspaceChatIndicatorSpec {
  className: "is-schedule" | "is-alert";
  iconClass: string;
  label: string;
}

const WORKSPACE_CHAT_INDICATORS: Record<string, WorkspaceChatIndicatorSpec> = {
  "everglade-daily-ops-briefing": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs every morning",
  },
  "everglade-supplier-onboarding": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Needs attention",
  },
  "northstar-contract-risk-scan": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Review due today",
  },
  "northstar-matter-staffing": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Reminders sent today",
  },
  "northstar-regulatory-watch": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Needs attention",
  },
  "meadow-demand-forecast": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Mondays at 6:00 AM",
  },
  "meadow-quality-deviation": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs weekdays at 5:00 AM",
  },
  "meadow-production-schedule": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Two tasks remain unassigned",
  },
  "meadow-weekly-plant-report": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Fridays at 11:00 AM",
  },
  ...REMAINING_INRUBYRY_INDICATORS,
};

const COMPANY_ORDER = [
  "everglade",
  "meadow",
  "ledger",
  "loom",
  "cartly",
  "vector",
  "stonebridge",
  "northstar",
  "harborview",
  "keyline",
  "talentspring",
  "cedarshield",
] as const;

const companyOrder = new Map<string, number>(
  COMPANY_ORDER.map((companyId, index) => [companyId, index])
);

const MEADOW_SCENARIO_ORDER = [
  "meadow-demand-forecast",
  "meadow-recall-simulation",
  "meadow-quality-deviation",
  "meadow-cold-chain-alert",
  "meadow-batch-traceability",
  "meadow-production-schedule",
  "meadow-supplier-certificate-audit",
  "meadow-plant-maintenance-triage",
  "meadow-energy-cost-review",
  "meadow-weekly-plant-report",
] as const;

const meadowScenarioOrder = new Map<string, number>(
  MEADOW_SCENARIO_ORDER.map((scenarioId, index) => [scenarioId, index])
);

const VECTOR_SCENARIO_ORDER = [
  "vector-internal-tool-prototype",
  "vector-incident-root-cause",
  "vector-pull-request-review",
  "vector-roadmap-reconciliation",
  "vector-database-debugger",
  "vector-documentation-drift",
  "vector-cloud-spend-guard",
  "vector-regression-explorer",
  "vector-feedback-signal-map",
  "vector-release-communication",
] as const;

const vectorScenarioOrder = new Map<string, number>(
  VECTOR_SCENARIO_ORDER.map((scenarioId, index) => [scenarioId, index])
);

const overrideCache = new WeakMap<DemoScenario, DemoScenario>();

interface WorkspaceScenarioProps {
  scenario: DemoScenario;
}

interface WorkspaceChatMarqueeProps {
  text: string;
  as?: "span" | "strong";
}

export function WorkspaceChatMarquee({
  text: value,
  as = "span",
}: WorkspaceChatMarqueeProps) {
  const outerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [hovered, setHovered] = useState(false);

  const measure = () => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) {
      return;
    }
    setDistance(Math.max(0, inner.scrollWidth - outer.clientWidth));
  };

  useEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined" || !outerRef.current) {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(outerRef.current);
    if (innerRef.current) {
      observer.observe(innerRef.current);
    }
    return () => observer.disconnect();
  }, [value]);

  const marqueeStyle = {
    "--workspace-marquee-distance": `${distance}px`,
  } as CSSProperties;
  const marqueeClassName = `workspace-chat-marquee${hovered && distance > 0 ? " is-hovering" : ""}`;
  const setOuterRef = (element: HTMLElement | null) => {
    outerRef.current = element;
  };
  const start = () => {
    measure();
    setHovered(true);
  };
  const stop = () => setHovered(false);

  if (as === "strong") {
    return (
      <strong
        ref={setOuterRef}
        className={marqueeClassName}
        style={marqueeStyle}
        onMouseEnter={start}
        onMouseLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        <span ref={innerRef}>{value}</span>
      </strong>
    );
  }

  return (
    <span
      ref={setOuterRef}
      className={marqueeClassName}
      style={marqueeStyle}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <span ref={innerRef}>{value}</span>
    </span>
  );
}

const text = (value: string): InlineRun => ({ kind: "text", text: value });
const mention = (personId: string): InlineRun => ({
  kind: "mention",
  personId,
});
const paragraph = (
  tone: "opening" | "normal" | "completion",
  ...content: InlineRun[]
): ConversationBlock => ({ kind: "paragraph", tone, content });

const heading = (value: string): ConversationBlock => ({
  kind: "heading",
  content: [text(value)],
});

const checklist = (items: string[]): ConversationBlock => ({
  kind: "checklist",
  items: items.map((item) => [text(item)]),
});

const bullets = (items: string[]): ConversationBlock => ({
  kind: "bullets",
  items: items.map((item) => [text(item)]),
});

const table = (columns: string[], rows: string[]): ConversationBlock => ({
  kind: "table",
  columns,
  rows: rows.map((row) => [text(row)]),
});

function slug(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/[’']/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

export function workspaceChatTitle(scenario: DemoScenario) {
  return WORKSPACE_TITLES[scenario.id] ?? scenario.copy.conversationTitle;
}

export function workspaceChatChannel(scenario: DemoScenario) {
  const title = WORKSPACE_TITLES[scenario.id];
  return title ? slug(title) : scenario.channel;
}

export function workspaceChatTeamsGroup(scenario: DemoScenario) {
  return WORKSPACE_TITLES[scenario.id] ?? scenario.teamsGroup;
}

export function workspaceArtifactLeadIn(scenario: DemoScenario) {
  return NORTHSTAR_ARTIFACT_LEAD_INS[scenario.id];
}

type WorkspaceCompanyShape = {
  id: string;
  name?: string;
  industry?: string;
  icon?: string;
};

function workspaceCompanyDisplay<T extends WorkspaceCompanyShape>(
  company: T
): T {
  if (company.id === "ledger") {
    return {
      ...company,
      name: "Morgan Banks",
      industry: "Banking",
      icon: "fa-solid fa-dollar-sign",
    };
  }
  if (company.id === "vector") {
    return { ...company, name: "Clearpath Software" };
  }
  if (company.id === "stonebridge") {
    return { ...company, icon: "fa-solid fa-screwdriver-wrench" };
  }
  if (company.id === "keyline") {
    return { ...company, name: "Keyline", industry: "Real Estate" };
  }
  return company;
}

export function workspaceCompanies<T extends WorkspaceCompanyShape>(
  companies: T[]
) {
  return companies
    .map((company, index) => ({
      company: workspaceCompanyDisplay(company),
      index,
      order: companyOrder.get(company.id) ?? COMPANY_ORDER.length,
    }))
    .sort((left, right) => left.order - right.order || left.index - right.index)
    .map(({ company }) => company);
}

export function workspaceCompanyScenarios(companyId: string) {
  const scenarios = getCompanyScenarios(companyId);
  const scenarioOrder =
    companyId === "meadow"
      ? meadowScenarioOrder
      : companyId === "vector"
        ? vectorScenarioOrder
        : null;
  const configuredOrder = REMAINING_INRUBYRY_ORDER[companyId];
  return scenarios
    .map((scenario, index) => ({
      scenario,
      index,
      order:
        scenarioOrder?.get(scenario.id) ??
        configuredOrder?.indexOf(scenario.id) ??
        Number.MAX_SAFE_INTEGER,
    }))
    .sort((left, right) => left.order - right.order || left.index - right.index)
    .map(({ scenario }) => scenario);
}

function runToText(run: InlineRun) {
  if (run.kind === "text") {
    return run.text;
  }
  if (run.kind === "integration") {
    return run.id;
  }
  return run.personId;
}

function scenarioContentText(scenario: DemoScenario) {
  const response = scenario.copy.response.flatMap((block) => {
    if ("content" in block) {
      return block.content.map(runToText);
    }
    if ("items" in block) {
      return block.items.flat().map(runToText);
    }
    return block.rows.flat().map(runToText);
  });
  const artifact = scenario.artifact.rows.flatMap((row) => [
    row.label,
    row.value,
    row.status,
  ]);
  const downloads = scenario.deliverables.flatMap((deliverable) => [
    deliverable.name,
    deliverable.description,
  ]);
  return [
    scenario.copy.conversationTitle,
    scenario.copy.userPrompt,
    ...response,
    ...artifact,
    ...downloads,
  ]
    .join(" ")
    .toLocaleLowerCase("en-US");
}

export function workspaceScenarioConsistencyIssues(scenario: DemoScenario) {
  const requiredTerms =
    NORTHSTAR_REQUIRED_TERMS[scenario.id] ??
    MEADOW_REQUIRED_TERMS[scenario.id] ??
    VECTOR_REQUIRED_TERMS[scenario.id] ??
    REMAINING_INRUBYRY_REQUIRED_TERMS[scenario.id];
  if (!requiredTerms) {
    return [];
  }

  const issues: string[] = [];
  const title = workspaceChatTitle(scenario);
  const titleOnlyScenario = scenario.id === "northstar-contract-risk-scan";
  if (!titleOnlyScenario && scenario.copy.conversationTitle !== title) {
    issues.push("conversation title does not match the workspace title");
  }
  if (
    !titleOnlyScenario &&
    scenario.channel !== workspaceChatChannel(scenario)
  ) {
    issues.push("channel does not match the workspace title");
  }
  if (
    !titleOnlyScenario &&
    scenario.teamsGroup !== workspaceChatTeamsGroup(scenario)
  ) {
    issues.push("Teams group does not match the workspace title");
  }
  if (
    !titleOnlyScenario &&
    scenario.copy.presentation === "artifact" &&
    scenario.artifact.title !== scenario.copy.conversationTitle
  ) {
    issues.push("widget heading does not match the conversation title");
  }
  const content = scenarioContentText(scenario);
  for (const term of requiredTerms) {
    if (!content.includes(term.toLocaleLowerCase("en-US"))) {
      issues.push(`content is missing the workflow term ${term}`);
    }
  }
  const expectedDownloads =
    NORTHSTAR_EXPECTED_DOWNLOADS[scenario.id] ??
    MEADOW_EXPECTED_DOWNLOADS[scenario.id] ??
    VECTOR_EXPECTED_DOWNLOADS[scenario.id] ??
    REMAINING_INRUBYRY_EXPECTED_DOWNLOADS[scenario.id];
  if (
    expectedDownloads &&
    JSON.stringify(
      scenario.deliverables.map((deliverable) => deliverable.name)
    ) !== JSON.stringify(expectedDownloads)
  ) {
    issues.push("download names do not match the workflow");
  }
  return issues;
}

function assertWorkspaceScenarioConsistency(scenario: DemoScenario) {
  const issues = workspaceScenarioConsistencyIssues(scenario);
  if (issues.length > 0) {
    throw new Error(
      `Inconsistent workspace scenario ${scenario.id}: ${issues.join("; ")}`
    );
  }
}

function withArtifactRows(
  scenario: DemoScenario,
  rows: ArtifactRow[]
): DemoScenario["artifact"] {
  return {
    ...scenario.artifact,
    title: workspaceChatTitle(scenario),
    rows,
  };
}

export function workspaceChatDescription(scenario: DemoScenario) {
  return WORKSPACE_CHAT_INDICATORS[scenario.id]?.label;
}

function missedPickupOverride(scenario: DemoScenario): DemoScenario {
  const recovered = "Recovered six pickups";
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Reschedule today’s missed deliveries using the fastest available routes.",
      response: [
        paragraph(
          "opening",
          text("Reschedule missed deliveries: Recovered six pickups.")
        ),
        paragraph(
          "normal",
          text(
            "The recovery plan uses faster routes, a revised dispatch calendar, and three assigned recovery tasks."
          )
        ),
        paragraph(
          "completion",
          text("Recovery follow-through: "),
          mention("leo-chen"),
          text(".")
        ),
      ],
    },
    receipts: [
      recovered,
      "Created three recovery tasks",
      "Sent driver/customer notices from Outlook",
    ],
    integrationSteps: [
      { integrationId: "Outlook", label: recovered },
      {
        integrationId: "Google Calendar",
        label: "Created three recovery tasks",
      },
      {
        integrationId: "Microsoft Teams",
        label: "Sent driver and customer notices",
      },
      {
        integrationId: "Monday.com",
        label: "Verified missed-delivery recovery",
      },
      { integrationId: "Asana", label: "Shared missed-delivery recovery" },
    ],
    artifact: {
      ...scenario.artifact,
      title: workspaceChatTitle(scenario),
      rows: scenario.artifact.rows.map((row, index) =>
        index === 0 ? { ...row, label: recovered } : row
      ),
    },
  };
}

function lateDriverPromptOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    copy: {
      ...scenario.copy,
      userPrompt:
        "Send every late driver to the fastest available route, assign capacity, and notify the shipment owners before cutoff.",
    },
  };
}

function customerDelayUpdateOverride(scenario: DemoScenario): DemoScenario {
  const integrations: IntegrationId[] = [
    "NetSuite",
    "Outlook",
    "Google Sheets",
    "Front",
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    integrations,
    integrationSteps: [
      { integrationId: "NetSuite", label: "Found three delayed loads" },
      { integrationId: "Outlook", label: "Sent verified ETA updates" },
      { integrationId: "Google Sheets", label: "Logged customer notices" },
      { integrationId: "Front", label: "Flagged unresolved exceptions" },
    ],
    receipts: [
      "Found three delayed loads",
      "Sent verified ETA updates",
      "Flagged two unresolved exceptions",
    ],
    owner: "@Nora Patel",
    ownerId: "nora-patel",
    copy: {
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Update customers about today’s delayed loads using the latest verified ETAs, and flag any unresolved exceptions.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text(
            "Customer updates are ready for three delayed loads after the latest ETAs were verified."
          )
        ),
        paragraph(
          "normal",
          text(
            "Delayed loads, verified latest ETAs, customer updates, and unresolved exceptions."
          )
        ),
        heading("Verified customer updates"),
        table(
          ["Load / Ticket", "Verified ETA", "Customer update"],
          [
            "EG-4821 / CS-2841 | 4:10 PM | Sent · 22-minute delay",
            "EG-4828 / CS-2847 | 5:35 PM | Sent · rerouted via I-294",
            "EG-4835 / CS-2853 | Pending | Waiting for dock release",
          ]
        ),
        heading("Unresolved exceptions"),
        bullets([
          "EG-4835 / CS-2853: Dock C release time is not confirmed.",
          "EG-4840 / CS-2858: Replacement driver assignment is still pending.",
        ]),
        paragraph(
          "completion",
          text("Customer follow-through: "),
          mention("nora-patel"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "delivery-delay-customer-updates.pdf",
        format: "pdf",
        description:
          "Verified ETAs, customer notices, and unresolved exceptions",
      },
    ],
    artifactBehavior: "none",
  };
}

function complaintPromptOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    copy: {
      ...scenario.copy,
      userPrompt:
        "Resolve the Acme delivery complaint and prepare the customer reply for the account owner.",
    },
  };
}

function greenlineFollowupOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    integrationSteps: [
      { integrationId: "Youtrust", label: "Reviewed approved agreements" },
      { integrationId: "Outlook", label: "Prepared signature reminders" },
      {
        integrationId: "Google Calendar",
        label: "Checked current signature status",
      },
    ],
    copy: {
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Follow up on unsigned agreements and confirm their current signature status.",
      presentation: "artifact",
      response: [
        paragraph(
          "opening",
          text(
            "Follow-up is ready for the approved agreements still awaiting signatures."
          )
        ),
        paragraph(
          "normal",
          text(
            "Previously approved agreements awaiting signatures, reminders, and current status."
          )
        ),
        heading("Signature follow-up"),
        table(
          ["Agreement", "Current status"],
          [
            "Greenline mutual NDA | Ready for Eva Morales signature",
            "Cedar Ridge data addendum | Reminder due today",
            "Northstar vendor terms | Awaiting counterparty signature",
          ]
        ),
        checklist([
          "Reminder prepared for the Greenline mutual NDA.",
          "Current signature status checked in Youtrust.",
          "Escalation owner assigned to Eva Morales.",
        ]),
        paragraph(
          "completion",
          text("Follow-up owner: "),
          mention("eva-morales"),
          text(".")
        ),
      ],
    },
    artifact: {
      ...scenario.artifact,
      title: workspaceChatTitle(scenario),
    },
  };
}

function clientDocumentsOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Greenline",
      value: "4 complete | 1 missing | Personalized reminder sent",
      status: "Needs one document",
    },
    {
      label: "Halcyon",
      value: "5 complete | Complete | Confirmation sent",
      status: "Ready for review",
    },
    {
      label: "Cedar Ridge",
      value: "3 complete | 2 missing | Document request sent",
      status: "Needs two documents",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Reviewed completed intake items",
      "Logged missing documents",
      "Sent personalized client requests",
    ],
    integrationSteps: [
      { integrationId: "Vanta", label: "Reviewed completed intake items" },
      { integrationId: "Jira", label: "Logged missing documents" },
      { integrationId: "Slack", label: "Sent personalized client requests" },
      { integrationId: "Notion", label: "Updated client records" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Collect the missing documents for our new clients and send each client a personalized request.",
      response: [
        paragraph(
          "opening",
          text(
            "Client intake is organized for Greenline, Halcyon, and Cedar Ridge."
          )
        ),
        paragraph(
          "normal",
          text(
            "Completed intake items, missing files, and personalized requests are shown below."
          )
        ),
        heading("Client document intake"),
        table(
          ["Client", "Completed", "Missing", "Request status"],
          rows.map((row) => `${row.label} | ${row.value}`)
        ),
        paragraph(
          "completion",
          text("Intake owner: "),
          mention("daniel-brooks"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function datedDocumentsOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Feb 3, 2026",
      value: "Complaint filed",
      status: "Dawson complaint · filed copy",
    },
    {
      label: "Feb 7, 2026",
      value: "Delivery receipt added",
      status: "Carrier receipt · exhibit B",
    },
    {
      label: "Mar 1, 2026",
      value: "Counsel email received",
      status: "Outlook message · source timestamp",
    },
    {
      label: "Date uncertain",
      value: "Draft amendment found",
      status: "Document metadata · review required",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Generated the dated document index",
      "Linked each document source",
      "Flagged one uncertain date",
    ],
    integrationSteps: [
      { integrationId: "Google Drive", label: "Generated the document index" },
      { integrationId: "Outlook", label: "Linked document source timestamps" },
      { integrationId: "Microsoft Excel", label: "Flagged one uncertain date" },
      { integrationId: "Miro", label: "Shared the dated document view" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Put the Dawson case documents in date order and flag any dates that are uncertain.",
      response: [
        paragraph(
          "opening",
          text(
            "The Dawson documents are indexed by date with each source linked."
          )
        ),
        paragraph(
          "normal",
          text("One document date is uncertain and clearly flagged for review.")
        ),
        heading("Dated document index"),
        table(
          ["Date", "Document", "Source"],
          rows.map((row) => `${row.label} | ${row.value} | ${row.status}`)
        ),
        paragraph(
          "completion",
          text("Document review owner: "),
          mention("eva-morales"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "dawson-document-index.xlsx",
        format: "xlsx",
        description: "Dated Dawson document index",
      },
      {
        name: "dawson-source-links.pdf",
        format: "pdf",
        description: "Dawson document sources and uncertain dates",
      },
    ],
    artifact: withArtifactRows(scenario, rows),
  };
}

function signedAgreementOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Atlas master services agreement",
      value: "Aug 29, 2026 | Amendment 3",
      status: "Executed",
    },
    {
      label: "Greenline mutual NDA",
      value: "Aug 27, 2026 | None",
      status: "Executed",
    },
    {
      label: "Halcyon data licence",
      value: "Aug 22, 2026 | Amendment 1",
      status: "Executed",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Searched signed agreements",
      "Linked related amendments",
      "Excluded draft versions",
    ],
    integrationSteps: [
      { integrationId: "Notion", label: "Searched signed agreements" },
      { integrationId: "Slab", label: "Linked related amendments" },
      { integrationId: "Confluence", label: "Excluded draft versions" },
      { integrationId: "Google Drive", label: "Shared the executed version" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Find the latest signed agreement and separate the executed version from drafts.",
      response: [
        paragraph(
          "opening",
          text(
            "The latest executed agreement is identified with its related amendments."
          )
        ),
        paragraph(
          "normal",
          text(
            "Drafts are separated from signed documents so the controlling version is clear."
          )
        ),
        heading("Executed agreements"),
        table(
          ["Agreement", "Executed", "Amendments", "Status"],
          rows.map((row) => `${row.label} | ${row.value} | ${row.status}`)
        ),
        paragraph(
          "completion",
          text("Agreement review owner: "),
          mention("daniel-brooks"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function consultationOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Halcyon consultation",
      value: "Eva Morales | Delaware",
      status: "Availability matched",
    },
    {
      label: "Tue 2:30 PM",
      value: "Invitation sent",
      status: "Confirmed",
    },
    {
      label: "Wed 11:00 AM",
      value: "Invitation sent",
      status: "Awaiting confirmation",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Created the Halcyon consultation record",
      "Matched Eva Morales availability",
      "Tracked the invitation confirmation",
    ],
    integrationSteps: [
      { integrationId: "HubSpot", label: "Updated the Halcyon client record" },
      { integrationId: "Attio", label: "Matched Eva Morales availability" },
      { integrationId: "Gmail", label: "Sent consultation invitations" },
      { integrationId: "Google Calendar", label: "Tracked confirmations" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Schedule consultations for the new clients with the assigned lawyer.",
      response: [
        paragraph(
          "opening",
          text(
            "Consultation availability is matched with Eva Morales for the Halcyon matter."
          )
        ),
        paragraph(
          "normal",
          text(
            "Invitations and confirmations are tracked against the selected time."
          )
        ),
        heading("Consultation schedule"),
        table(
          ["Client matter", "Assigned lawyer", "Status"],
          [
            "Halcyon consultation | Eva Morales | Availability matched",
            "Tue 2:30 PM | Invitation sent | Confirmed",
            "Wed 11:00 AM | Invitation sent | Awaiting confirmation",
          ]
        ),
        paragraph(
          "completion",
          text("Scheduling owner: "),
          mention("eva-morales"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function overdueMatterUpdatesOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Checked the overdue matter list",
      "Verified current matter statuses",
      "Prepared approved client updates",
    ],
    integrationSteps: [
      {
        integrationId: "Web Crawler",
        label: "Checked the overdue matter list",
      },
      { integrationId: "Semrush", label: "Verified current matter statuses" },
      { integrationId: "Slack", label: "Prepared approved client updates" },
      { integrationId: "Outlook", label: "Queued matter messages" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Send overdue matter updates using the approved client template.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text("Three matters are due for a client update today.")
        ),
        paragraph(
          "normal",
          text(
            "Each status is verified before the approved update is prepared."
          )
        ),
        heading("Overdue matter updates"),
        table(
          ["Matter", "Verified status", "Owner", "Due"],
          [
            "Dawson dispute | Evidence review complete | Daniel Brooks | Due 4:00 PM",
            "Orion acquisition | Signature status confirmed | Eva Morales | Due 4:30 PM",
            "Halcyon licensing | Consultation booked | Eva Morales | Due 5:00 PM",
          ]
        ),
        checklist([
          "Matter statuses verified before sending.",
          "Approved client template used.",
          "Messages queued for delivery.",
        ]),
        paragraph(
          "completion",
          text("Update owner: "),
          mention("daniel-brooks"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "overdue-matter-updates.pdf",
        format: "pdf",
        description: "Verified matter statuses and approved client updates",
      },
    ],
  };
}

function missingTimeEntriesOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Eva Morales",
      value: "Halcyon licensing | 3 missing | Reminder sent 9:12 AM",
      status: "3 entries missing",
    },
    {
      label: "Daniel Brooks",
      value: "Dawson dispute | 2 missing | Reminder sent 9:18 AM",
      status: "2 entries missing",
    },
    {
      label: "Priya Rao",
      value: "Orion acquisition | 1 missing | Completed 10:04 AM",
      status: "Completion list updated",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Found six missing time entries",
      "Sent reminders by matter",
      "Updated the completion list",
    ],
    integrationSteps: [
      { integrationId: "Napta", label: "Found six missing time entries" },
      { integrationId: "Monday.com", label: "Sent reminders by matter" },
      { integrationId: "Asana", label: "Updated the completion list" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Chase the missing time entries and update the completion list.",
      response: [
        paragraph(
          "opening",
          text("Six missing time entries remain across three matters.")
        ),
        paragraph(
          "normal",
          text(
            "Each person has a reminder, matter reference, and current completion status."
          )
        ),
        paragraph(
          "completion",
          text("Time-entry owner: "),
          mention("eva-morales"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function draftInvoiceOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "INV-2841",
      value: "Missing work description | $1,240",
      status: "Needs attention",
    },
    {
      label: "INV-2848",
      value: "Duplicate-looking research line | $860",
      status: "Needs attention",
    },
    {
      label: "INV-2852",
      value: "Supporting record attached | $2,100",
      status: "Completed",
    },
    {
      label: "INV-2859",
      value: "Filing receipt missing | $430",
      status: "Needs attention",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Reviewed four draft invoice lines",
      "Flagged missing invoice details",
      "Linked supporting review records",
    ],
    integrationSteps: [
      { integrationId: "NetSuite", label: "Reviewed four draft invoice lines" },
      { integrationId: "Stripe", label: "Flagged missing invoice details" },
      {
        integrationId: "Google Sheets",
        label: "Linked supporting review records",
      },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Check the draft client invoices for missing details before review.",
      response: [
        paragraph(
          "opening",
          text("Four draft invoice lines were checked before client review.")
        ),
        paragraph(
          "normal",
          text(
            "Missing descriptions, duplicate-looking lines, and supporting records are ready for review."
          )
        ),
        paragraph(
          "completion",
          text("Invoice review owner: "),
          mention("daniel-brooks"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function clientCallFollowupsOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Reviewed today's client call notes",
      "Created follow-up tasks",
      "Assigned owners and due dates",
    ],
    integrationSteps: [
      { integrationId: "Gamma", label: "Reviewed client call notes" },
      { integrationId: "Canva", label: "Created follow-up tasks" },
      { integrationId: "Power BI", label: "Assigned owners and due dates" },
      { integrationId: "Microsoft OneDrive", label: "Saved source timestamps" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Turn today’s client calls into follow-up tasks with owners and due dates.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text(
            "Follow-ups are ready from today’s Dawson, Orion, and Halcyon calls."
          )
        ),
        paragraph(
          "normal",
          text(
            "Commitments, tasks, owners, due dates, and call timestamps are captured below."
          )
        ),
        heading("Client call follow-ups"),
        table(
          ["Task", "Owner", "Due", "Source"],
          [
            "Send Dawson evidence list | Daniel Brooks | Sep 7, 10:00 AM | Call at 9:14 AM",
            "Confirm Orion signer | Eva Morales | Sep 7, noon | Call at 10:32 AM",
            "Share Halcyon consultation note | Priya Rao | Sep 7, 3:00 PM | Call at 11:08 AM",
          ]
        ),
        checklist([
          "Client commitments verified.",
          "Follow-up tasks created.",
          "Owners notified of due dates.",
        ]),
        paragraph(
          "completion",
          text("Follow-up owner: "),
          mention("daniel-brooks"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "client-call-follow-ups.pdf",
        format: "pdf",
        description:
          "Client call commitments, owners, due dates, and timestamps",
      },
    ],
  };
}

function productionOrdersOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Confirmed orders",
      value: "6,000 cups",
      status: "Comparison",
    },
    {
      label: "Expected demand",
      value: "8,000 cups",
      status: "Created MO-6201",
    },
    {
      label: "Higher demand",
      value: "10,000 cups",
      status: "1,000 cups above capacity",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Checked confirmed orders",
      "Applied the approved demand forecast",
      "Created production order MO-6201",
    ],
    integrationSteps: [
      { integrationId: "Salesforce", label: "Checked confirmed orders" },
      {
        integrationId: "BigQuery",
        label: "Applied the approved demand forecast",
      },
      {
        integrationId: "Power BI",
        label: "Checked available production capacity",
      },
      {
        integrationId: "Google Sheets",
        label: "Added production order MO-6201",
      },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Create next week’s strawberry yogurt production orders using the approved forecast, confirmed orders, and usable stock.",
      response: [
        paragraph(
          "opening",
          text(
            "Production order MO-6201 is created for 8,000 cups and added to next week’s planning sheet."
          )
        ),
        paragraph(
          "normal",
          text(
            "Expected demand is 10,000 cups; 2,000 usable cups are already in stock, so 8,000 cups are ordered within the available capacity."
          )
        ),
        heading("Production order"),
        table(
          ["Product", "Order", "Quantity", "Status"],
          ["Strawberry yogurt | MO-6201 | 8,000 cups | Created in NetSuite"]
        ),
        checklist([
          "Confirmed orders matched to the approved forecast.",
          "Usable stock subtracted from expected demand.",
          "Planning sheet updated with MO-6201.",
        ]),
        paragraph(
          "completion",
          text("Production planning owner: "),
          mention("sofia-alvarez"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function supplierPaymentsOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Matched invoices to purchase orders and approvals",
      "Recorded two payment confirmations",
      "Sent supplier remittance notices",
    ],
    integrationSteps: [
      { integrationId: "Jira", label: "Matched invoices to approvals" },
      { integrationId: "Slack", label: "Recorded payment confirmations" },
      { integrationId: "Gmail", label: "Sent remittance notices" },
      { integrationId: "Outlook", label: "Held the unmatched invoice" },
      { integrationId: "Miro", label: "Shared the payment summary" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Pay the supplier invoices approved for this payment run and send the payment notices.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text(
            "Two supplier invoices totaling $6,480 are paid. Both suppliers have received their payment notices."
          )
        ),
        paragraph(
          "normal",
          text(
            "The payments match approved purchase orders and delivery receipts; one $960 invoice remains unpaid because its received quantity does not match."
          )
        ),
        heading("Supplier payment run"),
        table(
          ["Invoice", "Amount", "Status", "Payment or review"],
          [
            "INV-4102 | $4,200 | Paid | Payment reference PAY-6102",
            "INV-4108 | $2,280 | Paid | Payment reference PAY-6108",
            "INV-4111 | $960 | On hold | Quantity discrepancy assigned for review",
          ]
        ),
        checklist([
          "Invoices matched to approved purchase orders.",
          "Payment confirmations recorded in NetSuite.",
          "Remittance notices sent through Outlook.",
        ]),
        paragraph(
          "completion",
          text("Payment run owner: "),
          mention("sofia-alvarez"),
          text(".")
        ),
      ],
    },
  };
}

function packagingOrderOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Checked approved yogurt production quantities",
      "Calculated cups and lids to order",
      "Sent the supplier order request",
    ],
    integrationSteps: [
      { integrationId: "ServiceNow", label: "Checked production quantities" },
      {
        integrationId: "Google Sheets",
        label: "Calculated packaging requirements",
      },
      { integrationId: "Slack", label: "Sent the supplier order request" },
      { integrationId: "Jira", label: "Tracked the Tuesday delivery" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Order the cups and lids needed for the approved yogurt runs, accounting for stock and deliveries already on the way.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text(
            "PO-632 is created and emailed to North Ridge Packaging for 3,000 cups and 2,000 lids. Delivery is confirmed for Tuesday at 6:00 AM."
          )
        ),
        paragraph(
          "normal",
          text(
            "The purchase order subtracts current stock and confirmed incoming packaging before calculating what is still needed."
          )
        ),
        heading("Packaging order"),
        table(
          ["Item", "Required", "Available and incoming", "Ordered"],
          [
            "Cups | 8,000 | 4,000 available + 1,000 incoming | 3,000",
            "Lids | 8,000 | 6,000 available + 0 incoming | 2,000",
          ]
        ),
        checklist([
          "Supplier pack sizes applied.",
          "PO-632 created in NetSuite.",
          "Tuesday delivery appointment booked in Google Calendar.",
        ]),
        paragraph(
          "completion",
          text("Packaging owner: "),
          mention("sofia-alvarez"),
          text(".")
        ),
      ],
    },
  };
}

function refrigeratedTransportOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "DL-204",
      value: "Madison | 10:30 AM | Carrier C-204",
      status: "Confirmed",
    },
    {
      label: "DL-219",
      value: "Milwaukee | 11:15 AM | Carrier C-219",
      status: "Confirmed",
    },
    {
      label: "DL-227",
      value: "Green Bay | 12:00 PM | Carrier C-227",
      status: "Confirmed",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Matched urgent orders to refrigerated carriers",
      "Recorded three confirmed collections",
      "Sent dispatch collection details",
    ],
    integrationSteps: [
      { integrationId: "BigQuery", label: "Matched urgent orders to carriers" },
      {
        integrationId: "Power BI",
        label: "Recorded three confirmed collections",
      },
      { integrationId: "Outlook", label: "Sent dispatch collection details" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Book refrigerated transport for the three urgent store orders and send the collection details to dispatch.",
      response: [
        paragraph(
          "opening",
          text(
            "Three collections are confirmed. Carrier references, loading appointments, and dispatch instructions are recorded against the orders."
          )
        ),
        paragraph(
          "normal",
          text(
            "The selected carriers match each order’s destination and delivery deadline; the recorded temperature readings are available for review."
          )
        ),
        paragraph(
          "completion",
          text("Transport booking owner: "),
          mention("lena-ortiz"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function packingListOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Store orders",
      value: "3 stores | 60 whole-milk cases | 30 chocolate-milk cases",
      status: "Confirmed in NetSuite",
    },
    {
      label: "Reserved batches",
      value: "1,080 bottles | Approved batches",
      status: "Reserved in NetSuite",
    },
    {
      label: "Packing lists",
      value: "3 lists | One per store",
      status: "Created in Excel",
    },
    {
      label: "Warehouse handoff",
      value: "Picking instructions | Link sent",
      status: "Posted in Teams",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Confirmed three store orders",
      "Reserved approved product batches",
      "Sent the warehouse packing lists",
    ],
    integrationSteps: [
      { integrationId: "Snowflake", label: "Confirmed three store orders" },
      {
        integrationId: "Databricks",
        label: "Reserved approved product batches",
      },
      { integrationId: "NetSuite", label: "Created store packing lists" },
      { integrationId: "Microsoft Excel", label: "Sent the warehouse handoff" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Create tomorrow’s store packing lists, reserve the approved stock, and send the lists to the warehouse.",
      response: [
        paragraph(
          "opening",
          text(
            "Three store packing lists are saved. Stock is reserved against the orders, and the warehouse team has received the picking instructions."
          )
        ),
        paragraph(
          "normal",
          text(
            "Each store receives 20 cases of whole milk and 10 cases of chocolate milk. At 12 bottles per case, the handoff covers 1,080 bottles."
          )
        ),
        heading("Packing handoff"),
        table(
          ["Step", "Result", "Status"],
          [
            "Store orders | 3 stores | Confirmed",
            "Reserved batches | 1,080 bottles | Reserved",
            "Packing lists | 3 store lists | Sent to warehouse",
          ]
        ),
        paragraph(
          "completion",
          text("Warehouse handoff owner: "),
          mention("sofia-alvarez"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "store-packing-lists.xlsx",
        format: "xlsx",
        description: "Three store packing lists and reserved batches",
      },
    ],
    artifact: withArtifactRows(scenario, rows),
  };
}

function workloadBalanceOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "Sanitation record",
      value: "Michael → Lena | 2h | Due 1:00 PM",
      status: "Reassigned in Monday.com",
    },
    {
      label: "Packaging count",
      value: "Michael → Lena | 1h | Due 2:00 PM",
      status: "Reassigned in Asana",
    },
    {
      label: "Material pickup",
      value: "Michael → Marco | 1h | Due 2:30 PM",
      status: "Reassigned in Monday.com",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Checked Michael’s assigned hours",
      "Moved three eligible tasks",
      "Notified the updated owners",
    ],
    integrationSteps: [
      { integrationId: "Monday.com", label: "Moved three eligible tasks" },
      { integrationId: "Asana", label: "Updated task deadlines" },
      { integrationId: "Google Calendar", label: "Adjusted linked bookings" },
      {
        integrationId: "Microsoft Teams",
        label: "Notified the updated owners",
      },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Michael has too much work today. Move the tasks his teammates can take and update everyone.",
      response: [
        paragraph(
          "opening",
          text(
            "Three tasks have moved from Michael to available teammates. Their deadlines are updated and everyone has been notified. Two specialist tasks still need an owner because no eligible teammate is available."
          )
        ),
        paragraph(
          "normal",
          text(
            "Michael started with 11 assigned hours and eight available hours. Two specialist tasks still need an owner because no eligible teammate is available."
          )
        ),
        heading("Workload changes"),
        table(
          ["Task", "Previous owner", "New owner", "Status"],
          [
            "Sanitation record | Michael | Lena | Updated",
            "Packaging count | Michael | Lena | Updated",
            "Material pickup | Michael | Marco | Updated",
          ]
        ),
        paragraph(
          "completion",
          text("Workload owner: "),
          mention("lena-ortiz"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function cheesePresentationOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "New herb cheese",
      value: "Product concept for deli and prepared-food customers",
      status: "Recipe notes",
    },
    {
      label: "What changed",
      value: "Fresh herb blend and lower salt from the approved trial",
      status: "Recipe comparison",
    },
    {
      label: "Trial results",
      value: "Yield, texture, and batch CH-041 observations",
      status: "Measured results",
    },
    {
      label: "Tasting feedback",
      value: "Seven tasters preferred the milder herb finish",
      status: "Tasting notes",
    },
    {
      label: "Estimated cost",
      value: "$1.84 per 200g unit using current assumptions",
      status: "Estimated",
    },
    {
      label: "Next trial",
      value: "Sofia to test a firmer texture on Sep 12",
      status: "Proposed",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    integrations: ["Gamma", "Google Drive", "Canva", "Microsoft Excel"],
    receipts: [
      "Gathered approved recipe notes and trial photos",
      "Created the six-slide Gamma presentation",
      "Saved the presentation and PDF export",
    ],
    integrationSteps: [
      { integrationId: "Gamma", label: "Created the six-slide presentation" },
      {
        integrationId: "Google Drive",
        label: "Saved the presentation and PDF",
      },
      { integrationId: "Canva", label: "Added the product meeting cover" },
      {
        integrationId: "Microsoft Excel",
        label: "Linked trial cost assumptions",
      },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Create a presentation for the new herb cheese recipe using the trial notes, photos, and tasting feedback. Save it for the product meeting.",
      response: [
        paragraph(
          "opening",
          text(
            "The six-slide herb cheese presentation is created in Gamma and saved to the product-development folder in Drive."
          )
        ),
        paragraph(
          "normal",
          text(
            "The deck combines approved recipe notes, trial photos, tasting feedback, the cost sheet, and the proposed next trial."
          )
        ),
        paragraph(
          "completion",
          text("Presentation owner: "),
          mention("sofia-alvarez"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "herb-cheese-recipe-presentation.pdf",
        format: "pdf",
        description: "Six-slide herb cheese recipe presentation",
      },
    ],
    artifact: withArtifactRows(scenario, rows),
  };
}

function replacementOrdersOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    receipts: [
      "Matched approved damage claims to orders",
      "Created two replacement orders",
      "Sent customer delivery confirmations",
    ],
    integrationSteps: [
      {
        integrationId: "Freshservice",
        label: "Matched approved damage claims",
      },
      { integrationId: "ServiceNow", label: "Created two replacement orders" },
      {
        integrationId: "Statuspage",
        label: "Checked replacement delivery dates",
      },
      {
        integrationId: "Microsoft Teams",
        label: "Sent customer confirmations",
      },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Process the approved damage claims, create replacement orders, and send customers their delivery confirmations.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text(
            "Two replacement orders are created and confirmed with customers. A third claim is waiting for the missing delivery photos."
          )
        ),
        paragraph(
          "normal",
          text(
            "Approved claims are linked to the original orders, reserved stock, replacement order numbers, and recorded delivery dates."
          )
        ),
        heading("Replacement orders"),
        table(
          ["Claim", "Original order", "Replacement", "Status"],
          [
            "CL-2041 | SO-8721 | RO-6201 | Confirmed for Sep 10",
            "CL-2048 | SO-8728 | RO-6208 | Confirmed for Sep 11",
            "CL-2053 | SO-8735 | Not created | Waiting for delivery photos",
          ]
        ),
        checklist([
          "Approved replacement stock reserved.",
          "Customer confirmations sent through Outlook.",
          "Incomplete claim assigned for photo follow-up.",
        ]),
        paragraph(
          "completion",
          text("Replacement owner: "),
          mention("lena-ortiz"),
          text(".")
        ),
      ],
    },
  };
}

function supplierQuoteOverride(scenario: DemoScenario): DemoScenario {
  const rows: ArtifactRow[] = [
    {
      label: "North Ridge Packaging",
      value: "$2,160 | $120 | $2,280",
      status: "PO-645 placed",
    },
    {
      label: "ClearPack",
      value: "$2,040 | $300 | $2,340",
      status: "Comparison only",
    },
    {
      label: "Valley Packaging",
      value: "$2,280 | $180 | $2,460",
      status: "Comparison only",
    },
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    integrations: ["Google Sheets", "NetSuite", "Outlook"],
    receipts: [
      "Compared three approved supplier quotes",
      "Created purchase order PO-645",
      "Sent the supplier order notice",
    ],
    integrationSteps: [
      {
        integrationId: "Google Sheets",
        label: "Compared three supplier quotes",
      },
      { integrationId: "NetSuite", label: "Created purchase order PO-645" },
      { integrationId: "Outlook", label: "Sent the supplier order notice" },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Compare the three approved quotes for cheese tubs, place the order that meets our price and delivery requirements, and notify the supplier.",
      response: [
        paragraph(
          "opening",
          text(
            "PO-645 is placed with North Ridge Packaging for 12,000 cheese tubs. The order is emailed and Thursday’s delivery is confirmed."
          )
        ),
        paragraph(
          "normal",
          text(
            "The comparison uses the same quantity, specification, delivery treatment, and supplier approval for each quote."
          )
        ),
        paragraph(
          "completion",
          text("Purchasing owner: "),
          mention("sofia-alvarez"),
          text(".")
        ),
      ],
    },
    artifact: withArtifactRows(scenario, rows),
  };
}

function overtimeSubmissionOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    integrations: [
      "Microsoft Excel",
      "Microsoft OneDrive",
      "Outlook",
      "Google Drive",
      "Microsoft Teams",
    ],
    receipts: [
      "Reconciled approved overtime hours",
      "Created the payroll submission file",
      "Sent the payroll submission before cutoff",
    ],
    integrationSteps: [
      {
        integrationId: "Microsoft Excel",
        label: "Reconciled approved overtime",
      },
      {
        integrationId: "Microsoft OneDrive",
        label: "Saved the payroll submission file",
      },
      { integrationId: "Outlook", label: "Sent the payroll submission" },
      { integrationId: "Google Drive", label: "Linked approval records" },
      {
        integrationId: "Microsoft Teams",
        label: "Notified the shift supervisor",
      },
    ],
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Reconcile this week’s approved overtime and submit it to payroll before the cutoff.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text(
            "The approved overtime file is submitted to payroll: 42 hours totaling $1,176. One unapproved entry is assigned back to the shift supervisor."
          )
        ),
        paragraph(
          "normal",
          text(
            "Approved hours match the shift roster, recorded pay rates, and supervisor approvals. The unapproved entry is kept out of the submission."
          )
        ),
        heading("Payroll submission"),
        table(
          ["Team", "Hours", "Rate", "Total"],
          [
            "Packaging | 18 | $28 | $504",
            "Filling | 16 | $27 | $432",
            "Warehouse | 8 | $30 | $240",
            "Submitted total | 42 | — | $1,176",
          ]
        ),
        checklist([
          "Approved hours matched to rosters.",
          "Payroll workbook saved in OneDrive.",
          "OT-219 excluded and sent back for approval.",
        ]),
        paragraph(
          "completion",
          text("Payroll submission owner: "),
          mention("sofia-alvarez"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "approved-overtime-payroll.xlsx",
        format: "xlsx",
        description: "Approved overtime hours and payroll submission record",
      },
    ],
  };
}

function dockCapacityOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Confirm tomorrow's dock capacity before we accept new loads.",
      response: [
        paragraph(
          "opening",
          text(
            "Tomorrow's dock capacity is confirmed at Oak Park, Cicero, and Elmhurst."
          )
        ),
        paragraph(
          "normal",
          text(
            "Two constrained windows need overflow capacity moved to Elmhurst before the schedule is locked."
          )
        ),
        paragraph(
          "completion",
          text("Capacity owner: "),
          mention("maya-bennett"),
          text(".")
        ),
      ],
    },
    integrationSteps: [
      { integrationId: "Power BI", label: "Checked tomorrow's dock schedule" },
      { integrationId: "BigQuery", label: "Compared loads with dock capacity" },
      { integrationId: "NetSuite", label: "Flagged two constrained windows" },
      {
        integrationId: "Google Sheets",
        label: "Shared the dock capacity confirmation",
      },
    ],
    artifact: { ...scenario.artifact, title: workspaceChatTitle(scenario) },
  };
}

function morningBriefOverride(scenario: DemoScenario): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    copy: {
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt:
        "Send the morning driver's brief with today's routes, pickups, dock notes, and exceptions.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text(
            "The morning driver's brief is ready and sent to the operations team."
          )
        ),
        paragraph(
          "normal",
          text(
            "It covers today's routes, missed-pickup recoveries, dock notes, and driver exceptions."
          )
        ),
        heading("Morning driver brief"),
        table(
          ["Completed work", "System"],
          [
            "Posted the driver brief | Microsoft Teams",
            "Created the morning schedule | Outlook Calendar",
            "Updated route and dock notes | Notion",
          ]
        ),
        paragraph(
          "completion",
          text("Brief approval: "),
          mention("maya-bennett"),
          text(".")
        ),
      ],
    },
  };
}

function driverPaymentsOverride(scenario: DemoScenario): DemoScenario {
  const integrations: IntegrationId[] = [
    "NetSuite",
    "Microsoft Excel",
    "Google Sheets",
    "Outlook",
  ];
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    integrations,
    integrationSteps: [
      { integrationId: "NetSuite", label: "Reconciled driver pay records" },
      {
        integrationId: "Microsoft Excel",
        label: "Calculated approved adjustments",
      },
      {
        integrationId: "Google Sheets",
        label: "Verified twelve driver statements",
      },
      { integrationId: "Outlook", label: "Prepared payment approval notice" },
    ],
    receipts: [
      "Reconciled twelve driver statements",
      "Calculated approved mileage and detention",
      "Prepared the final payment approval",
    ],
    copy: {
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt: "Finalize this week's driver payments.",
      presentation: "text",
      response: [
        paragraph(
          "opening",
          text("Driver payments are ready for final approval.")
        ),
        paragraph(
          "normal",
          text(
            "Twelve driver statements total $18,420.00 after approved mileage, detention, and reimbursement adjustments."
          )
        ),
        heading("Payment review"),
        table(
          ["Measure", "Final value"],
          [
            "Driver statements | 12",
            "Gross approved pay | $18,420.00",
            "Exceptions remaining | 0",
          ]
        ),
        checklist([
          "Mileage and detention adjustments reconciled.",
          "Reimbursements matched to submitted receipts.",
          "Payment file prepared for approval.",
        ]),
        paragraph(
          "completion",
          text("Payment approval: "),
          mention("maya-bennett"),
          text(".")
        ),
      ],
    },
    deliverables: [
      {
        name: "driver-payment-summary.xlsx",
        format: "xlsx",
        description: "Final driver statements and approved adjustments",
      },
    ],
    artifactBehavior: "none",
  };
}

interface VectorScenarioOverride {
  prompt: string;
  integrations: IntegrationId[];
  integrationSteps: DemoScenario["integrationSteps"];
  receipts: DemoScenario["receipts"];
  response: ConversationBlock[];
  rows: ArtifactRow[];
  variant?: string;
  interaction?: string;
  series?: number[];
  deliverables?: DemoScenario["deliverables"];
  presentation?: DemoScenario["copy"]["presentation"];
  artifactBehavior?: DemoScenario["artifactBehavior"];
  owner?: string;
  ownerId?: string;
}

function vectorScenarioOverride(
  scenario: DemoScenario,
  options: VectorScenarioOverride
): DemoScenario {
  return {
    ...scenario,
    channel: workspaceChatChannel(scenario),
    teamsGroup: workspaceChatTeamsGroup(scenario),
    integrations: options.integrations,
    integrationSteps: options.integrationSteps,
    receipts: options.receipts,
    owner: options.owner ?? scenario.owner,
    ownerId: options.ownerId ?? scenario.ownerId,
    copy: {
      ...scenario.copy,
      conversationTitle: workspaceChatTitle(scenario),
      userPrompt: options.prompt,
      presentation: options.presentation ?? "artifact",
      response: options.response,
    },
    deliverables: options.deliverables ?? scenario.deliverables,
    artifactBehavior: options.artifactBehavior ?? "interactive",
    artifact: {
      ...scenario.artifact,
      title: workspaceChatTitle(scenario),
      variant: options.variant ?? scenario.artifact.variant,
      interaction: options.interaction ?? scenario.artifact.interaction,
      rows: options.rows,
      series: options.series ?? scenario.artifact.series,
    },
  };
}

function vectorCustomerSetupAgentOverride(
  scenario: DemoScenario
): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Build an agent that sets up newly signed customers using their agreed plan, creates their workspace, and sends the welcome instructions.",
    integrations: ["HubSpot", "Val Town", "Supabase", "Outlook"],
    integrationSteps: [
      { integrationId: "HubSpot", label: "Read Acme's signed plan" },
      { integrationId: "Val Town", label: "Deployed the customer setup agent" },
      { integrationId: "Supabase", label: "Created workspace WS-208" },
      {
        integrationId: "Outlook",
        label: "Sent the administrator welcome email",
      },
    ],
    receipts: [
      "Read Acme's signed plan from HubSpot",
      "Deployed the customer setup agent",
      "Created workspace WS-208 and sent the welcome message",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The customer setup agent is deployed. Its first run created Acme's workspace, applied the agreed plan, and sent the administrator a welcome message."
        )
      ),
      paragraph(
        "normal",
        text(
          "It reads the signed customer record, chooses the setup steps, and keeps a replay from creating duplicate accounts."
        )
      ),
      heading("First customer setup"),
      table(
        ["Step", "Result"],
        [
          "Signed plan | Acme Growth plan from HubSpot",
          "Agent run | SETUP-1042 completed in Val Town",
          "Workspace | WS-208 created in Supabase",
          "Welcome | Administrator email sent through Outlook",
        ]
      ),
      checklist([
        "Growth plan permissions applied.",
        "Administrator invitation sent.",
        "Replay returned the existing workspace.",
      ]),
      paragraph(
        "completion",
        text("Agent owner: "),
        mention("elena-park"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "Customer event",
        value: "Acme signed Growth plan",
        status: "Ready",
      },
      {
        label: "Agent run",
        value: "SETUP-1042",
        status: "Deployed",
      },
      {
        label: "Workspace result",
        value: "WS-208 created",
        status: "Welcome sent",
      },
    ],
    variant: "webhook-console",
    interaction: "Replay setup",
  });
}

function vectorCheckoutRecoveryOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Restore checkout after the latest release, confirm customers can place orders, and update the incident.",
    integrations: ["GitHub", "Jira", "ServiceNow", "Statuspage", "Slack"],
    integrationSteps: [
      { integrationId: "GitHub", label: "Restored the previous release" },
      { integrationId: "Jira", label: "Updated incident INC-208" },
      { integrationId: "ServiceNow", label: "Verified checkout recovery" },
      { integrationId: "Statuspage", label: "Published the recovery update" },
      { integrationId: "Slack", label: "Notified the incident channel" },
    ],
    receipts: [
      "Linked deployment DEP-481 to incident INC-208",
      "Restored release v4.7.1 at 10:14 AM",
      "Verified five test purchases and published recovery",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "Checkout is working again. The previous release is restored, test purchases pass, and the incident update is published."
        )
      ),
      paragraph(
        "normal",
        text(
          "Ruby linked the release to the checkout incident, rolled back the approved change, and watched the same checkout path during recovery."
        )
      ),
      heading("Recovery checks"),
      table(
        ["Checkpoint", "Result"],
        [
          "Failure detected | DEP-481 linked to INC-208 | Correlated",
          "Previous version | v4.7.1 restored at 10:14 AM | Rollback complete",
          "Test purchases | 5 of 5 passed | Verified",
          "Customer status | Errors 18% → 0.3% | Published",
        ]
      ),
      paragraph(
        "completion",
        text("Incident owner: "),
        mention("elena-park"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "Failure detected",
        value: "DEP-481 linked to INC-208",
        status: "Correlated",
      },
      {
        label: "Previous version",
        value: "v4.7.1 restored at 10:14 AM",
        status: "Rollback complete",
      },
      { label: "Test purchases", value: "5 of 5 passed", status: "Verified" },
      {
        label: "Customer status",
        value: "Errors 18% → 0.3%",
        status: "Published",
      },
    ],
    variant: "deploy-timeline",
    interaction: "Open a recovery checkpoint",
    deliverables: [
      {
        name: "checkout-recovery-record.pdf",
        format: "pdf",
        description: "Rollback timeline and verified checkout checks",
      },
    ],
  });
}

function vectorBulkInvitationsOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Build and release bulk team invitations so customer admins can invite everyone from one spreadsheet.",
    integrations: ["Productboard", "Notion", "GitHub", "Slack"],
    integrationSteps: [
      {
        integrationId: "Productboard",
        label: "Confirmed the invitation requirements",
      },
      { integrationId: "Notion", label: "Read the customer admin workflow" },
      {
        integrationId: "GitHub",
        label: "Released the bulk invitation feature",
      },
      { integrationId: "Slack", label: "Posted the release result" },
    ],
    receipts: [
      "Confirmed bulk invitation requirements",
      "Released the spreadsheet invitation flow",
      "Posted the tested result to the product channel",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "Bulk invitations are live. Customer admins can upload a spreadsheet, correct invalid rows, and send invitations without creating duplicates."
        )
      ),
      paragraph(
        "normal",
        text(
          "The released flow previews every row before sending and reports the result for each address."
        )
      ),
      heading("Release result"),
      table(
        ["Capability", "Evidence"],
        [
          "Spreadsheet upload | 100-row sample preview | Released",
          "Invalid rows | 5 email addresses flagged before send | Tested",
          "Existing members | 3 duplicates skipped safely | Protected",
          "Invitations | 92 sent successfully | Released",
        ]
      ),
      checklist([
        "Admin access checked before sending.",
        "Invalid rows can be corrected without restarting the import.",
        "Duplicate members are skipped and reported.",
      ]),
      paragraph(
        "completion",
        text("Release owner: "),
        mention("elena-park"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "Spreadsheet upload",
        value: "100-row import and preview",
        status: "Released",
      },
      {
        label: "Invalid rows",
        value: "5 email errors shown before send",
        status: "Tested",
      },
      {
        label: "Existing members",
        value: "3 duplicates skipped safely",
        status: "Protected",
      },
      {
        label: "Invitations",
        value: "92 sent successfully",
        status: "Released",
      },
    ],
    variant: "commitment-matrix",
    interaction: "Select a release capability",
  });
}

function vectorDataIsolationOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Fix the account-isolation bug, prove one customer cannot access another customer’s records, and prepare the change for release.",
    integrations: ["GitHub", "Linear", "Confluence"],
    integrationSteps: [
      { integrationId: "GitHub", label: "Committed the account-isolation fix" },
      { integrationId: "Linear", label: "Attached six security checks" },
      { integrationId: "Confluence", label: "Linked the access standard" },
    ],
    receipts: [
      "Reproduced the cross-account read",
      "Committed the account-isolation fix in PR #842",
      "Attached six passing security checks",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The account-isolation fix is committed and its security tests pass. PR #842 is ready for the security reviewer."
        )
      ),
      paragraph(
        "normal",
        text(
          "The query now checks the account before reading a record, and background export results use the same isolation rule."
        )
      ),
      heading("Security review"),
      table(
        ["Check", "Result"],
        [
          "Customer's own record | Read succeeds | Passed",
          "Another customer's record ID | Read is denied | Passed",
          "Missing account context | Request is denied | Passed",
          "Review status | PR #842 | Ready for security review",
        ]
      ),
      checklist([
        "Tenant scope is checked before the query is built.",
        "Export jobs retain the account that created them.",
        "Confluence access standard linked to the pull request.",
      ]),
      paragraph(
        "completion",
        text("Security reviewer: "),
        mention("nikhil-rao"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "src/tenant-query.ts",
        value: "Account scope is checked before reading a record",
        status: "High risk fixed",
      },
      {
        label: "src/export-job.ts",
        value: "Account scope is checked before reading a job result",
        status: "Medium risk fixed",
      },
    ],
    variant: "code-diff",
    interaction: "Review a changed file",
  });
}

function vectorExportSpeedOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Fix the slow customer exports and verify the complete files still contain the right records.",
    integrations: ["Supabase", "Snowflake", "Databricks", "Hex"],
    integrationSteps: [
      { integrationId: "Supabase", label: "Measured the export query" },
      { integrationId: "Snowflake", label: "Checked the same 250,000 records" },
      { integrationId: "Databricks", label: "Verified the index migration" },
      { integrationId: "Hex", label: "Saved the before-and-after run" },
    ],
    receipts: [
      "Measured the 250,000-record export before the fix",
      "Added and verified the account-and-date index",
      "Saved matching record counts and checksums in Hex",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The export fix is deployed. The same 250,000-record export now finishes in 24 seconds instead of 96, with matching record counts and checksums."
        )
      ),
      paragraph(
        "normal",
        text(
          "Ruby kept the dataset and export request the same before and after the index change, so the timing comparison is meaningful."
        )
      ),
      heading("Export performance"),
      table(
        ["Measurement", "Result"],
        [
          "Before the fix | 250,000 records | 96 seconds",
          "Index added | Account + date lookup | Migration verified",
          "After the fix | 250,000 records | 24 seconds",
          "Output check | 250,000 records and matching checksums | Passed",
        ]
      ),
      paragraph(
        "completion",
        text("Performance owner: "),
        mention("elena-park"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "Before the fix",
        value: "250,000 records",
        status: "96 seconds",
      },
      {
        label: "Index added",
        value: "Account + date lookup",
        status: "Verified",
      },
      {
        label: "After the fix",
        value: "250,000 records",
        status: "24 seconds",
      },
      {
        label: "Output check",
        value: "250,000 records and matching checksums",
        status: "Passed",
      },
    ],
    variant: "query-plan",
    interaction: "Run the export check",
  });
}

function vectorDocumentationAgentOverride(
  scenario: DemoScenario
): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Check our developer guides after each release and prepare corrections when the software behaves differently.",
    integrations: ["GitHub", "Slab", "Confluence", "Notion"],
    integrationSteps: [
      { integrationId: "GitHub", label: "Read the release changes" },
      { integrationId: "Slab", label: "Tested eight guide examples" },
      { integrationId: "Confluence", label: "Prepared two corrections" },
      { integrationId: "Notion", label: "Notified guide owners" },
    ],
    receipts: [
      "Tested eight examples after the release",
      "Prepared two guide corrections",
      "Notified the two documentation owners",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The documentation agent is active. Its first run checked eight examples and opened corrections for two outdated guides."
        )
      ),
      paragraph(
        "normal",
        text(
          "It runs after each release, compares the software's observed response with the published guide, and leaves an owner with the evidence."
        )
      ),
      heading("Guide check"),
      table(
        ["Example", "Observed result", "Guide action"],
        [
          "Export request | Returns a queued job and status link | Correction prepared",
          "Seven other examples | Match the released behavior | No change needed",
          "Run record | 8 examples checked | Owners notified",
        ]
      ),
      checklist([
        "Release changes read from GitHub.",
        "Corrections linked to executable examples.",
        "Unverified discrepancies remain assigned to their guide owner.",
      ]),
      paragraph(
        "completion",
        text("Documentation owner: "),
        mention("nikhil-rao"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "Export status example",
        value: "Guide says 200 OK; software returns queued status",
        status: "Correction prepared",
      },
      {
        label: "Seven other examples",
        value: "Match the released behavior",
        status: "No change needed",
      },
      {
        label: "Run record",
        value: "8 examples checked",
        status: "Owners notified",
      },
    ],
    variant: "documentation-diff",
    interaction: "Accept a prepared correction",
  });
}

function vectorCloudSpendOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Apply the approved cost reductions and check that answer quality and response speed stay within our targets.",
    integrations: ["Costory", "BigQuery", "Power BI", "Slack"],
    integrationSteps: [
      { integrationId: "Costory", label: "Measured current AI spend" },
      { integrationId: "BigQuery", label: "Applied approved usage limits" },
      { integrationId: "Power BI", label: "Published the cost comparison" },
      { integrationId: "Slack", label: "Notified cost owners" },
    ],
    receipts: [
      "Measured the current $125k monthly run rate",
      "Applied approved model and storage changes",
      "Published quality and speed checks with projected savings",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The approved changes are deployed. Measured usage projects monthly spend falling from $125,000 to $98,000, with quality and speed checks passing."
        )
      ),
      paragraph(
        "normal",
        text(
          "The comparison separates measured evaluation results from the projected monthly cost reduction."
        )
      ),
      heading("Cost and quality check"),
      table(
        ["Area", "Before", "After"],
        [
          "AI requests | $42k | $31k",
          "Idle environments | $18k | $6k",
          "Duplicate storage | $11k | $7k",
          "Core services | $54k | $54k",
          "Monthly total | $125k | $98k projected",
        ]
      ),
      checklist([
        "Answer quality stayed above the recorded target.",
        "Response speed stayed within the recorded target.",
        "Projected reduction is $27k per month.",
      ]),
      paragraph(
        "completion",
        text("Cost owner: "),
        mention("elena-park"),
        text(".")
      ),
    ],
    rows: [
      { label: "AI requests", value: "$42k → $31k", status: "Measured" },
      { label: "Idle environments", value: "$18k → $6k", status: "Measured" },
      { label: "Duplicate storage", value: "$11k → $7k", status: "Measured" },
      { label: "Core services", value: "$54k → $54k", status: "Unchanged" },
    ],
    variant: "spend-treemap",
    interaction: "Compare before and after changes",
  });
}

function vectorMobileSignupOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Test the new signup flow on small phones before release and give the release owner the results.",
    integrations: ["Amplitude", "Amplitude Europe", "BigQuery", "GitHub"],
    integrationSteps: [
      {
        integrationId: "Amplitude",
        label: "Checked the current signup baseline",
      },
      {
        integrationId: "Amplitude Europe",
        label: "Compared the small-screen group",
      },
      { integrationId: "BigQuery", label: "Verified the twelve test runs" },
      { integrationId: "GitHub", label: "Held the release for one fix" },
    ],
    receipts: [
      "Ran twelve device-and-browser signup checks",
      "Attached the failing 320px reproduction",
      "Held the release and notified its owner",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The signup checks are complete. Eleven of twelve device-and-browser combinations passed. Release is held for one small-screen failure."
        )
      ),
      paragraph(
        "normal",
        text(
          "At 320px wide, the keyboard covers the Continue button. The remaining eleven combinations complete the full signup journey."
        )
      ),
      heading("Release decision"),
      table(
        ["Test group", "Result"],
        [
          "Small phones | 11 of 12 checks passed | One failure",
          "Failing case | 320px screen with keyboard open | Reproduced",
          "Other browsers | Signup completes | Passed",
          "Release status | Candidate held | Owner notified",
        ]
      ),
      paragraph(
        "completion",
        text("Release owner: "),
        mention("elena-park"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "Small phones",
        value: "11 of 12 checks passed",
        status: "One failure",
      },
      {
        label: "Failing case",
        value: "320px screen with keyboard open",
        status: "Reproduced",
      },
      {
        label: "Other browsers",
        value: "Signup completes",
        status: "Passed",
      },
      {
        label: "Release status",
        value: "Candidate held",
        status: "Owner notified",
      },
    ],
    variant: "activation-chart",
    interaction: "Compare current release and candidate",
  });
}

function vectorBugReproductionOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Turn customer bug reports into reproducible tests and give engineers the failing case they can use.",
    integrations: ["Zendesk", "Intercom", "Productboard", "Amplitude"],
    integrationSteps: [
      { integrationId: "Zendesk", label: "Grouped twelve customer reports" },
      { integrationId: "Intercom", label: "Added reproduction details" },
      {
        integrationId: "Productboard",
        label: "Linked three engineering issues",
      },
      {
        integrationId: "Amplitude",
        label: "Attached customer impact evidence",
      },
    ],
    receipts: [
      "Grouped twelve reports into three issues",
      "Reproduced two issues with failing tests",
      "Linked the unresolved report to its missing browser details",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The bug reproduction agent is active. It grouped twelve reports into three issues and reproduced two with failing tests."
        )
      ),
      paragraph(
        "normal",
        text(
          "Each reproduced issue includes the customer report, application version, steps to repeat it, and a test that fails for the same reason."
        )
      ),
      heading("Reproduction results"),
      table(
        ["Result", "Evidence"],
        [
          "Grouped reports | 12 customer reports | 3 issues",
          "Reproduced | Checkout filter and mobile size picker | 2 failing tests",
          "Awaiting details | One report needs browser version | Follow-up assigned",
        ]
      ),
      checklist([
        "Original Zendesk and Intercom reports remain linked.",
        "Failing tests run against the recorded application version.",
        "Productboard issues include customer impact evidence.",
      ]),
      paragraph(
        "completion",
        text("Engineering owner: "),
        mention("nikhil-rao"),
        text(".")
      ),
    ],
    rows: [
      {
        label: "Grouped reports",
        value: "12 reports → 3 issues",
        status: "Classified",
      },
      {
        label: "Reproduced issues",
        value: "Checkout filter and mobile size picker",
        status: "2 failing tests",
      },
      {
        label: "Awaiting details",
        value: "One report needs browser version",
        status: "Follow-up assigned",
      },
    ],
    variant: "feedback-clusters",
    interaction: "Review a report source",
  });
}

function vectorDatabaseUpgradeOverride(scenario: DemoScenario): DemoScenario {
  return vectorScenarioOverride(scenario, {
    prompt:
      "Run the approved database upgrade, verify the application on the new version, and publish the completion record.",
    integrations: ["GitHub", "Supabase", "ServiceNow", "Statuspage"],
    integrationSteps: [
      { integrationId: "GitHub", label: "Ran the approved upgrade workflow" },
      { integrationId: "Supabase", label: "Verified the new database version" },
      { integrationId: "ServiceNow", label: "Checked application health" },
      {
        integrationId: "Statuspage",
        label: "Published the maintenance record",
      },
    ],
    receipts: [
      "Verified the backup and recovery copy",
      "Completed the database upgrade and compatibility checks",
      "Published the completion record after application checks passed",
    ],
    response: [
      paragraph(
        "opening",
        text(
          "The database upgrade is complete. Customer checks passed throughout the switch, and the rollback copy is retained for the agreed recovery window."
        )
      ),
      paragraph(
        "normal",
        text(
          "The run checked the backup, migration, application compatibility, and recovery path before publishing the completion record."
        )
      ),
      heading("Upgrade record"),
      table(
        ["Step", "Result"],
        [
          "Backup | Recovery copy verified | Ready",
          "Upgrade | New database version active | Complete",
          "Application | Compatibility and synthetic checks passed | Verified",
          "Recovery | Rollback copy retained for the agreed window | Recorded",
        ]
      ),
      checklist([
        "Migration completed through the approved workflow.",
        "No failed synthetic checks occurred during the switch.",
        "Jira change record and maintenance update are complete.",
      ]),
      paragraph(
        "completion",
        text("Upgrade owner: "),
        mention("elena-park"),
        text(".")
      ),
    ],
    rows: [
      { label: "Backup", value: "Recovery copy verified", status: "Ready" },
      {
        label: "Upgrade",
        value: "New database version active",
        status: "Complete",
      },
      {
        label: "Application",
        value: "Compatibility and synthetic checks passed",
        status: "Verified",
      },
      {
        label: "Recovery",
        value: "Rollback copy retained for the agreed window",
        status: "Recorded",
      },
    ],
    variant: "release-builder",
    interaction: "Open an upgrade step",
    deliverables: [
      {
        name: "database-upgrade-record.pdf",
        format: "pdf",
        description: "Upgrade steps, compatibility checks, and recovery record",
      },
    ],
  });
}

export function workspaceConversationScenario(scenario: DemoScenario) {
  const cached = overrideCache.get(scenario);
  if (cached) {
    return cached;
  }

  let adapted = scenario;
  const remainingIndustryScenario = applyRemainingIndustryScenario(scenario);
  if (remainingIndustryScenario !== scenario) {
    adapted = remainingIndustryScenario;
  } else if (scenario.id === "everglade-sla-risk-command") {
    adapted = lateDriverPromptOverride(scenario);
  } else if (scenario.id === "everglade-missed-pickup-recovery") {
    adapted = missedPickupOverride(scenario);
  } else if (scenario.id === "everglade-carrier-claim-packet") {
    adapted = customerDelayUpdateOverride(scenario);
  } else if (scenario.id === "everglade-customer-escalation") {
    adapted = complaintPromptOverride(scenario);
  } else if (scenario.id === "northstar-nda-signature-flow") {
    adapted = greenlineFollowupOverride(scenario);
  } else if (scenario.id === "northstar-privacy-review") {
    adapted = clientDocumentsOverride(scenario);
  } else if (scenario.id === "northstar-litigation-chronology") {
    adapted = datedDocumentsOverride(scenario);
  } else if (scenario.id === "northstar-clause-precedent-finder") {
    adapted = signedAgreementOverride(scenario);
  } else if (scenario.id === "northstar-client-intake") {
    adapted = consultationOverride(scenario);
  } else if (scenario.id === "northstar-regulatory-watch") {
    adapted = overdueMatterUpdatesOverride(scenario);
  } else if (scenario.id === "northstar-matter-staffing") {
    adapted = missingTimeEntriesOverride(scenario);
  } else if (scenario.id === "northstar-invoice-review") {
    adapted = draftInvoiceOverride(scenario);
  } else if (scenario.id === "northstar-board-memo") {
    adapted = clientCallFollowupsOverride(scenario);
  } else if (scenario.id === "meadow-demand-forecast") {
    adapted = productionOrdersOverride(scenario);
  } else if (scenario.id === "meadow-recall-simulation") {
    adapted = supplierPaymentsOverride(scenario);
  } else if (scenario.id === "meadow-quality-deviation") {
    adapted = packagingOrderOverride(scenario);
  } else if (scenario.id === "meadow-cold-chain-alert") {
    adapted = refrigeratedTransportOverride(scenario);
  } else if (scenario.id === "meadow-batch-traceability") {
    adapted = packingListOverride(scenario);
  } else if (scenario.id === "meadow-production-schedule") {
    adapted = workloadBalanceOverride(scenario);
  } else if (scenario.id === "meadow-supplier-certificate-audit") {
    adapted = cheesePresentationOverride(scenario);
  } else if (scenario.id === "meadow-plant-maintenance-triage") {
    adapted = replacementOrdersOverride(scenario);
  } else if (scenario.id === "meadow-energy-cost-review") {
    adapted = supplierQuoteOverride(scenario);
  } else if (scenario.id === "meadow-weekly-plant-report") {
    adapted = overtimeSubmissionOverride(scenario);
  } else if (scenario.id === "vector-internal-tool-prototype") {
    adapted = vectorCustomerSetupAgentOverride(scenario);
  } else if (scenario.id === "vector-incident-root-cause") {
    adapted = vectorCheckoutRecoveryOverride(scenario);
  } else if (scenario.id === "vector-pull-request-review") {
    adapted = vectorDataIsolationOverride(scenario);
  } else if (scenario.id === "vector-roadmap-reconciliation") {
    adapted = vectorBulkInvitationsOverride(scenario);
  } else if (scenario.id === "vector-database-debugger") {
    adapted = vectorExportSpeedOverride(scenario);
  } else if (scenario.id === "vector-documentation-drift") {
    adapted = vectorDocumentationAgentOverride(scenario);
  } else if (scenario.id === "vector-cloud-spend-guard") {
    adapted = vectorCloudSpendOverride(scenario);
  } else if (scenario.id === "vector-regression-explorer") {
    adapted = vectorMobileSignupOverride(scenario);
  } else if (scenario.id === "vector-feedback-signal-map") {
    adapted = vectorBugReproductionOverride(scenario);
  } else if (scenario.id === "vector-release-communication") {
    adapted = vectorDatabaseUpgradeOverride(scenario);
  } else if (scenario.id === "everglade-capacity-forecast") {
    adapted = dockCapacityOverride(scenario);
  } else if (scenario.id === "everglade-daily-ops-briefing") {
    adapted = morningBriefOverride(scenario);
  } else if (scenario.id === "everglade-fleet-launch-deck") {
    adapted = driverPaymentsOverride(scenario);
  }

  assertWorkspaceScenarioConsistency(adapted);
  overrideCache.set(scenario, adapted);
  return adapted;
}

export function WorkspaceChatIndicator({ scenario }: WorkspaceScenarioProps) {
  const indicator = WORKSPACE_CHAT_INDICATORS[scenario.id];
  if (!indicator) {
    return null;
  }
  return (
    <span
      className={`workspace-chat-indicator ${indicator.className}`}
      aria-label={indicator.label}
    >
      <i className={indicator.iconClass} aria-hidden="true" />
    </span>
  );
}

export function WorkspaceScenarioAddon({ scenario }: WorkspaceScenarioProps) {
  if (scenario.id === "everglade-daily-ops-briefing") {
    return (
      <div
        className="scenario-addon scenario-addon-schedule"
        aria-label="Schedule created"
      >
        <span className="scenario-addon-icon" aria-hidden="true">
          <i className="fa-regular fa-calendar-check" />
        </span>
        <span>
          <strong>Schedule created</strong>
          <small>Every morning at 6:00 AM</small>
        </span>
        <em>Active</em>
      </div>
    );
  }

  if (scenario.id === "everglade-fleet-launch-deck") {
    return (
      <div
        className="scenario-addon scenario-addon-amount"
        aria-label="Final driver payment amount"
      >
        <div className="scenario-addon-amount-summary">
          <span>
            <small>Final amount</small>
            <strong>$18,420.00</strong>
          </span>
          <span className="scenario-addon-detail">
            <strong>12 drivers</strong>
            <small>Ready for approval</small>
          </span>
        </div>
        <button type="button" className="scenario-addon-action">
          Send the invoice to Accounting Division
        </button>
      </div>
    );
  }

  return null;
}
