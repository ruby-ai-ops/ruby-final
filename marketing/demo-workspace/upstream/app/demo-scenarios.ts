import {rebuiltScenarioContent} from './artifacts/rebuild-content';

export const verifiedIntegrations = [
  "Adomik",
  "Amplitude",
  "Amplitude Europe",
  "Apify",
  "Asana",
  "Canva",
  "Clari Copilot",
  "Contentsquare",
  "Costory",
  "Gamma",
  "Gong",
  "Google Sheets",
  "Guru",
  "Lemlist",
  "Luma",
  "Microsoft Excel",
  "Miro",
  "Monday.com",
  "Napta",
  "NetSuite",
  "Notion",
  "Power BI",
  "Productboard",
  "Semrush",
  "Shopify",
  "Slab",
  "Statuspage",
  "Youtrust",
  "Ashby",
  "Ukg Ready",
  "Attio",
  "HubSpot",
  "Salesforce",
  "Salesloft",
  "Stripe",
  "BigQuery",
  "Databricks",
  "Hex",
  "Snowflake",
  "Confluence",
  "GitHub",
  "Jira",
  "Linear",
  "Supabase",
  "Val Town",
  "Fathom",
  "Google Meet",
  "Granola",
  "Modjo",
  "Praiz",
  "Freshservice",
  "Front",
  "Intercom",
  "ServiceNow",
  "Zendesk",
  "Gmail",
  "Outlook",
  "Google Calendar",
  "Outlook Calendar",
  "Google Drive",
  "Microsoft",
  "Microsoft OneDrive",
  "Web Crawler",
  "Microsoft Teams",
  "Slack",
  "Vanta"
] as const;

export const artifactKinds = [
  'map',
  'dashboard',
  'chart',
  'table',
  'timeline',
  'calendar',
  'document',
  'slides',
  'record',
] as const;

export type IntegrationId = (typeof verifiedIntegrations)[number];
export type ArtifactKind = (typeof artifactKinds)[number];
export type PersonId = string;

export type Person = {
  id: PersonId;
  name: string;
  avatar: string;
};

export type Deliverable = {
  name: string;
  format: 'pdf' | 'docx' | 'xlsx';
  description: string;
};

export type ScenarioEngagement = {
  slackReactions: Array<{ emoji: string; count: number }>;
  teamsUserReactions: Array<{ emoji: string; count: number }>;
  teamsRubyReactions: Array<{ emoji: string; count: number }>;
  replyCount: number;
  responderIds: PersonId[];
  lastReplyLabel: string;
};

export type IntegrationStep = {
  integrationId: IntegrationId;
  label: string;
};

export type ArtifactMetric = {
  label: string;
  value: string;
  tone: 'positive' | 'warning' | 'neutral';
};

export type ArtifactRow = {
  label: string;
  value: string;
  status: string;
};

export type ArtifactSpec = {
  kind: ArtifactKind;
  title: string;
  variant: string;
  interaction: string;
  metrics: ArtifactMetric[];
  rows: ArtifactRow[];
  series: number[];
};

export type InlineRun =
  | { kind: 'text'; text: string }
  | { kind: 'integration'; id: IntegrationId }
  | { kind: 'mention'; personId: PersonId };

export type ConversationBlock =
  | { kind: 'paragraph'; tone?: 'opening' | 'normal' | 'completion'; content: InlineRun[] }
  | { kind: 'heading'; content: InlineRun[] }
  | { kind: 'bullets' | 'checklist'; items: InlineRun[][] }
  | { kind: 'table'; columns: string[]; rows: InlineRun[][] }
  | { kind: 'quote'; content: InlineRun[] };

export type ScenarioCopy = {
  conversationTitle: string;
  userPrompt: string;
  presentation: 'artifact' | 'text';
  response: ConversationBlock[];
};

export type DemoScenario = {
  id: string;
  title: string;
  channel: string;
  teamsGroup: string;
  artifactId: string;
  copy: ScenarioCopy;
  integrations: IntegrationId[];
  integrationSteps: IntegrationStep[];
  owner: string;
  ownerId: PersonId;
  participantIds: PersonId[];
  engagement: ScenarioEngagement;
  deliverables: Deliverable[];
  artifactBehavior: 'interactive' | 'static-complete' | 'none';
  duration: number;
  receipts: [string, string, string];
  headerIcon: string;
  artifact: ArtifactSpec;
};

export type ScenarioWorkspace = {
  id: string;
  name: string;
  industry: string;
  pods: [string, string, string];
  scenarios: DemoScenario[];
};

type RawScenario = {
  number: number;
  title: string;
  prompt: string;
  result: string;
  integrations: string[];
  owner: string;
  completion: string;
};

type RawWorkspace = {
  id: string;
  name: string;
  industry: string;
  pods: [string, string, string];
  scenarios: RawScenario[];
};

type ScenarioBlueprint = readonly [title: string, variant: string];

const personFixtures: Array<[string, string]> = [
  ['Aiden Lee', 'https://i.pravatar.cc/160?img=10'], ['Amelia Ross', 'https://i.pravatar.cc/160?img=49'],
  ['Ava Sinclair', 'https://i.pravatar.cc/160?img=9'], ['Chloe Martin', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=85'],
  ['Daniel Brooks', 'https://i.pravatar.cc/160?img=12'], ['Elena Park', 'https://i.pravatar.cc/160?img=5'],
  ['Eva Morales', 'https://i.pravatar.cc/160?img=42'], ['Iris Chen', 'https://i.pravatar.cc/160?img=46'],
  ['James Foster', 'https://i.pravatar.cc/160?img=68'], ['Jon Bell', 'https://i.pravatar.cc/160?img=13'],
  ['Leah Morgan', 'https://i.pravatar.cc/160?img=31'], ['Lena Ortiz', 'https://i.pravatar.cc/160?img=48'],
  ['Leo Chen', 'https://i.pravatar.cc/160?img=14'], ['Marco Diaz', 'https://i.pravatar.cc/160?img=52'],
  ['Marcus Reed', 'https://i.pravatar.cc/160?img=11'], ['Maya Bennett', 'https://i.pravatar.cc/160?img=47'],
  ['Mina Cole', 'https://i.pravatar.cc/160?img=41'], ['Nikhil Rao', 'https://i.pravatar.cc/160?img=69'],
  ['Nina Patel', 'https://i.pravatar.cc/160?img=45'], ['Noah Williams', 'https://i.pravatar.cc/160?img=15'],
  ['Nora Patel', 'https://i.pravatar.cc/160?img=33'], ['Olivia Grant', 'https://i.pravatar.cc/160?img=44'],
  ['Owen Brooks', 'https://i.pravatar.cc/160?img=53'], ['Priya Rao', 'https://i.pravatar.cc/160?img=37'],
  ['Rachel Kim', 'https://i.pravatar.cc/160?img=43'], ['Sasha Green', 'https://i.pravatar.cc/160?img=25'],
  ['Sofia Alvarez', 'https://i.pravatar.cc/160?img=32'],
];

const slugPerson = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const personRegistry: Record<PersonId, Person> = Object.fromEntries(
  personFixtures.map(([name, avatar]) => {
    const id = slugPerson(name);
    return [id, { id, name, avatar }];
  }),
);

export function getPerson(personId: PersonId): Person {
  return personRegistry[personId] ?? { id: personId, name: personId, avatar: 'https://i.pravatar.cc/160?img=1' };
}

const workspaceParticipants: Record<string, PersonId[]> = {
  everglade: ['maya-bennett', 'leo-chen', 'priya-rao', 'owen-brooks', 'nora-patel'],
  northstar: ['daniel-brooks', 'eva-morales', 'priya-rao'],
  meadow: ['sofia-alvarez', 'lena-ortiz', 'marco-diaz'],
  vector: ['elena-park', 'aiden-lee', 'jon-bell'],
  stonebridge: ['olivia-grant', 'marco-diaz', 'owen-brooks'],
  loom: ['ava-sinclair', 'iris-chen', 'chloe-martin'],
  cartly: ['noah-williams', 'rachel-kim', 'nikhil-rao'],
  harborview: ['nina-patel', 'priya-rao', 'amelia-ross'],
  keyline: ['marcus-reed', 'leah-morgan', 'owen-brooks'],
  talentspring: ['chloe-martin', 'mina-cole', 'rachel-kim'],
  cedarshield: ['james-foster', 'sasha-green', 'leah-morgan'],
  ledger: ['amelia-ross', 'nikhil-rao', 'aiden-lee'],
};

export const scenarioBlueprints: Record<string, ScenarioBlueprint[]> = {
  "everglade": [
    [
      "Save Today’s Late Shipments",
      "map-route"
    ],
    [
      "Recover Missed Pickups",
      "dispatch-timeline"
    ],
    [
      "Build the Carrier Claim",
      "evidence-packet"
    ],
    [
      "Explain the Freight Spike",
      "lane-waterfall"
    ],
    [
      "Handle the Dock Outage",
      "incident-timeline"
    ],
    [
      "Rescue the Acme Account",
      "account-brief"
    ],
    [
      "Check Promotion Capacity",
      "depot-heatmap"
    ],
    [
      "Prepare Today’s Operations Brief",
      "operations-brief"
    ],
    [
      "Launch Delta Freight",
      "onboarding-board"
    ],
    [
      "Present the Electric Fleet",
      "fleet-slides"
    ]
  ],
  "northstar": [
    [
      "Review the Supplier Contract",
      "clause-diff"
    ],
    [
      "Get Greenline’s Agreement Signed",
      "signature-flow"
    ],
    [
      "Clear the New Vendor",
      "privacy-matrix"
    ],
    [
      "Rebuild the Dawson Timeline",
      "matter-chronology"
    ],
    [
      "Find the Safest Contract Clause",
      "precedent-compare"
    ],
    [
      "Book the Right Partner",
      "client-intake"
    ],
    [
      "Brief Clients on New Rules",
      "regulatory-digest"
    ],
    [
      "Staff the Orion Matter",
      "matter-staffing"
    ],
    [
      "Clean Up the Client Invoice",
      "invoice-review"
    ],
    [
      "Prepare the Board Memo",
      "board-memo"
    ]
  ],
  "meadow": [
    [
      "Contain the Bad Batch",
      "root-cause-tree"
    ],
    [
      "Find Warm Deliveries",
      "temperature-map"
    ],
    [
      "Trace Every Affected Order",
      "lot-lineage"
    ],
    [
      "Rebuild Tomorrow’s Production Plan",
      "production-schedule"
    ],
    [
      "Renew Missing Certificates",
      "certificate-ledger"
    ],
    [
      "Set Promotion Production",
      "demand-forecast"
    ],
    [
      "Protect Today’s Production Line",
      "maintenance-board"
    ],
    [
      "Cut Plant Energy Waste",
      "energy-waterfall"
    ],
    [
      "Run the Recall Response",
      "recall-command"
    ],
    [
      "Prepare the Plant Report",
      "plant-report"
    ]
  ],
  "vector": [
    [
      "Explain the Checkout Outage",
      "deploy-timeline"
    ],
    [
      "Review the Risky Code Change",
      "code-diff"
    ],
    [
      "Find What Broke Signups",
      "activation-chart"
    ],
    [
      "Fix Roadmap Promises",
      "commitment-matrix"
    ],
    [
      "Repair Outdated Documentation",
      "documentation-diff"
    ],
    [
      "Speed Up Enterprise Exports",
      "query-plan"
    ],
    [
      "Cut Wasted Cloud Spend",
      "spend-treemap"
    ],
    [
      "Ship the Release Package",
      "release-builder"
    ],
    [
      "Turn Feedback Into Product Work",
      "feedback-clusters"
    ],
    [
      "Build the Support Webhook",
      "webhook-console"
    ]
  ],
  "stonebridge": [
    [
      "Recover the Riverside Schedule",
      "critical-path"
    ],
    [
      "Close Today’s Safety Risks",
      "site-risk-map"
    ],
    [
      "Get Monday’s Crews Ready",
      "crew-readiness"
    ],
    [
      "Explain the Concrete Overrun",
      "cost-waterfall"
    ],
    [
      "Move Crews Without Delays",
      "crew-calendar"
    ],
    [
      "Get the Architect’s Decision",
      "drawing-approval"
    ],
    [
      "Pick the Best Glazing Quote",
      "bid-scorecard"
    ],
    [
      "Finish the Site Meeting Follow-up",
      "meeting-actions"
    ],
    [
      "Prepare the Riverside Owner Update",
      "progress-deck"
    ],
    [
      "Resolve Tower A’s HVAC Complaints",
      "building-timeline"
    ]
  ],
  "loom": [
    [
      "Prevent Weekend Stockouts",
      "inventory-map"
    ],
    [
      "Launch the Linen Collection",
      "campaign-launch"
    ],
    [
      "Fix Mobile Size Drop-off",
      "journey-funnel"
    ],
    [
      "Invite the Best Customers",
      "vip-cadence"
    ],
    [
      "Explain Denim Returns",
      "returns-pareto"
    ],
    [
      "Fill Saturday’s Store Gaps",
      "staffing-heatmap"
    ],
    [
      "Open the Flagship Store",
      "launch-room"
    ],
    [
      "Prepare This Week’s Social Posts",
      "content-calendar"
    ],
    [
      "Turn Reviews Into Product Fixes",
      "review-themes"
    ],
    [
      "Prepare Monday’s Trade Brief",
      "trade-report"
    ]
  ],
  "cartly": [
    [
      "Recover High-Value Carts",
      "recovery-funnel"
    ],
    [
      "Stop Risky Refunds",
      "refund-scatter"
    ],
    [
      "Clear the Support Backlog",
      "support-queue"
    ],
    [
      "Find the Best Search Opportunities",
      "keyword-matrix"
    ],
    [
      "Stop Wasted Campaign Spend",
      "campaign-portfolio"
    ],
    [
      "Protect Delayed Products",
      "supplier-dependency"
    ],
    [
      "Track Competitor Price Changes",
      "price-matrix"
    ],
    [
      "Find the Customers We’re Losing",
      "retention-heatmap"
    ],
    [
      "Run the Creator Event",
      "creator-event"
    ],
    [
      "Prepare the Commerce Review",
      "commerce-review"
    ]
  ],
  "harborview": [
    [
      "Clear the Referral Backlog",
      "referral-queue"
    ],
    [
      "Fill Tomorrow’s Empty Appointments",
      "appointment-calendar"
    ],
    [
      "Answer the Urgent Referral Question",
      "policy-citations"
    ],
    [
      "Fix Next Week’s Coverage",
      "coverage-grid"
    ],
    [
      "Protect Rooms From Equipment Failures",
      "clinic-floor"
    ],
    [
      "Turn the Quality Meeting Into Action",
      "quality-decisions"
    ],
    [
      "Prepare Tomorrow’s Audit",
      "evidence-binder"
    ],
    [
      "Fix Repeated Patient Friction",
      "patient-themes"
    ],
    [
      "Show Clinic Capacity Clearly",
      "clinic-dashboard"
    ],
    [
      "Prepare the Board Operations Pack",
      "operations-deck"
    ]
  ],
  "keyline": [
    [
      "Turn Leads Into Viewings",
      "viewing-map"
    ],
    [
      "Dispatch Maintenance Today",
      "maintenance-map"
    ],
    [
      "Renew the Right Leases",
      "renewal-pipeline"
    ],
    [
      "Recover Overdue Rent",
      "rent-aging"
    ],
    [
      "Show Portfolio Health",
      "portfolio-dashboard"
    ],
    [
      "Fix Weak Property Listings",
      "listing-compare"
    ],
    [
      "Choose the Best Vendor",
      "vendor-scorecard"
    ],
    [
      "Finish the Property Inspection",
      "inspection-view"
    ],
    [
      "Prepare the Owner Update",
      "owner-report"
    ],
    [
      "Resolve the Resident Escalation",
      "resident-timeline"
    ]
  ],
  "talentspring": [
    [
      "Find the Best Candidates",
      "candidate-scorecard"
    ],
    [
      "Book the Interview Panel",
      "panel-availability"
    ],
    [
      "Make the Hiring Decision",
      "hiring-decision"
    ],
    [
      "Brief the Hiring Manager",
      "candidate-brief"
    ],
    [
      "Launch the Sourcing Campaign",
      "sourcing-cadence"
    ],
    [
      "Publish the New Role",
      "job-preview"
    ],
    [
      "Rescue Stalled Candidates",
      "candidate-journey"
    ],
    [
      "Show Hiring Capacity",
      "recruiter-heatmap"
    ],
    [
      "Send the Offer",
      "offer-packet"
    ],
    [
      "Launch New-Hire Onboarding",
      "onboarding-timeline"
    ]
  ],
  "cedarshield": [
    [
      "Route Storm Claims",
      "claims-map"
    ],
    [
      "Prepare the Renewal Meeting",
      "renewal-overview"
    ],
    [
      "Find Suspicious Claims",
      "fraud-network"
    ],
    [
      "Compare the Policies",
      "policy-comparison"
    ],
    [
      "Prepare the Broker Call",
      "broker-brief"
    ],
    [
      "Get Compliance Approval",
      "compliance-approval"
    ],
    [
      "Run the Catastrophe Response",
      "catastrophe-map"
    ],
    [
      "Rescue Claims Near Deadline",
      "deadline-chart"
    ],
    [
      "Prepare the Client Review",
      "client-deck"
    ],
    [
      "Coach the Broker Team",
      "coaching-scorecard"
    ]
  ],
  "ledger": [
    [
      "Finish Month-End Close",
      "close-board"
    ],
    [
      "Chase Overdue Invoices",
      "invoice-queue"
    ],
    [
      "Protect the Next 13 Weeks",
      "cash-forecast"
    ],
    [
      "Find Suspicious Expenses",
      "expense-scatter"
    ],
    [
      "Explain Cloud Costs",
      "cloud-treemap"
    ],
    [
      "Prepare the Audit Binder",
      "audit-binder"
    ],
    [
      "Build the Board Pack",
      "board-pack"
    ],
    [
      "Stop Duplicate Payments",
      "duplicate-match"
    ],
    [
      "Reconcile This Month’s Revenue",
      "revenue-waterfall"
    ],
    [
      "Answer the Finance Policy Question",
      "finance-policy"
    ]
  ]
};


const rawWorkspaces = [
  {
    "id": "everglade",
    "name": "Everglade Logistics",
    "industry": "Operations",
    "pods": [
      "Fleet",
      "Warehousing",
      "Leadership"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "SLA Risk Command",
        "prompt": "Which shipments will miss SLA today?",
        "result": "Flags 14 loads, reroutes four, and shows a regional risk Frame with an exception table.",
        "integrations": [
          "NetSuite",
          "BigQuery",
          "Google Sheets",
          "Power BI",
          "Slack"
        ],
        "owner": "@Maya Bennett",
        "completion": "Updated 14 dispatch records, reassigned four at-risk loads, posted the owner-tagged exception list to Slack."
      },
      {
        "number": 2,
        "title": "Missed Pickup Recovery",
        "prompt": "Recover today’s missed pickups without creating overtime.",
        "result": "Proposes a revised dispatch calendar and assigns three recovery tasks.",
        "integrations": [
          "Outlook",
          "Google Calendar",
          "Microsoft Teams",
          "Monday.com",
          "Asana"
        ],
        "owner": "@Leo Chen",
        "completion": "Rescheduled six pickups, created three recovery tasks, and sent driver/customer notices from Outlook."
      },
      {
        "number": 3,
        "title": "Carrier Claim Packet",
        "prompt": "Build the claim packet for shipment EG-4821.",
        "result": "Produces a cited PDF bundle and a signature-ready carrier claim.",
        "integrations": [
          "Google Drive",
          "Gmail",
          "Youtrust",
          "Microsoft Excel"
        ],
        "owner": "@Priya Rao",
        "completion": "Generated the final claim PDF, attached it to a Gmail draft, and opened the Youtrust signature request."
      },
      {
        "number": 4,
        "title": "Freight Cost Spike",
        "prompt": "Why did freight cost per mile jump this week?",
        "result": "Joins lane and cloud-processing data into a variance chart with the three causal routes.",
        "integrations": [
          "Costory",
          "Snowflake",
          "Databricks",
          "Hex"
        ],
        "owner": "@Maya Bennett",
        "completion": "Published the freight-variance Frame, posted the three causal lanes to finance, and assigned the review owner."
      },
      {
        "number": 5,
        "title": "Warehouse Incident",
        "prompt": "Turn last night’s dock outage into an incident report.",
        "result": "Creates a timeline, customer-impact table, and drafted public status update.",
        "integrations": [
          "ServiceNow",
          "Statuspage",
          "Slack",
          "Fathom"
        ],
        "owner": "@Owen Brooks",
        "completion": "Created the ServiceNow incident, updated Statuspage, and posted the cited incident timeline to Slack."
      },
      {
        "number": 6,
        "title": "Customer Escalation",
        "prompt": "Prepare the Acme delay escalation for the account owner.",
        "result": "Merges account context and ticket history into a CRM brief with a proposed reply.",
        "integrations": [
          "Salesforce",
          "Zendesk",
          "Front",
          "Outlook"
        ],
        "owner": "@Nora Patel",
        "completion": "Updated Salesforce risk and next step, merged duplicate support cases, and drafted the customer reply in Outlook."
      },
      {
        "number": 7,
        "title": "Capacity Forecast",
        "prompt": "Can we accept the North region promotion next week?",
        "result": "Forecasts trailer capacity and highlights two depot constraints in a chart.",
        "integrations": [
          "Power BI",
          "BigQuery",
          "NetSuite",
          "Google Sheets"
        ],
        "owner": "@Maya Bennett",
        "completion": "Saved the capacity forecast to Power BI and Google Sheets and created the go/no-go decision task."
      },
      {
        "number": 8,
        "title": "Daily Ops Briefing",
        "prompt": "Give the leadership team today’s operational brief.",
        "result": "Creates a one-page briefing with blockers, owners, and today’s calendar.",
        "integrations": [
          "Microsoft Teams",
          "Outlook Calendar",
          "Notion",
          "Guru"
        ],
        "owner": "@Maya Bennett",
        "completion": "Posted the daily brief to Teams, updated the Notion log, and created two Outlook Calendar follow-ups."
      },
      {
        "number": 9,
        "title": "Supplier Onboarding",
        "prompt": "What is blocking Delta Freight from going live?",
        "result": "Displays an onboarding checklist, missing insurance file, and assigned next steps.",
        "integrations": [
          "Microsoft OneDrive",
          "Youtrust",
          "Jira",
          "Asana"
        ],
        "owner": "@Leo Chen",
        "completion": "Updated the supplier onboarding board, sent the missing-document request, and assigned each blocker."
      },
      {
        "number": 10,
        "title": "Fleet Launch Deck",
        "prompt": "Create the zero-emissions fleet launch update.",
        "result": "Generates a six-slide deck and export-ready PDF from the latest project evidence.",
        "integrations": [
          "Canva",
          "Gamma",
          "Google Drive",
          "Slack"
        ],
        "owner": "@Maya Bennett",
        "completion": "Generated the Gamma deck, exported the PDF, stored it in Google Drive, and posted its Slack link."
      }
    ]
  },
  {
    "id": "northstar",
    "name": "Northstar Legal",
    "industry": "Legal",
    "pods": [
      "Matters",
      "Compliance",
      "Partners"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Contract Risk Scan",
        "prompt": "What changed in the latest supplier agreement?",
        "result": "Returns a clause-difference table with risk ratings and cited source pages.",
        "integrations": [
          "Google Drive",
          "Microsoft OneDrive",
          "Vanta",
          "Confluence"
        ],
        "owner": "@Daniel Brooks",
        "completion": "Created a redline summary, inserted comments in the Drive document, and assigned three clauses to @Daniel Brooks."
      },
      {
        "number": 2,
        "title": "NDA Signature Flow",
        "prompt": "Prepare and route the NDA for Greenline.",
        "result": "Creates the draft, selects the correct template, and proposes signer/calendar steps.",
        "integrations": [
          "Youtrust",
          "Outlook",
          "Google Calendar"
        ],
        "owner": "@Eva Morales",
        "completion": "Generated the NDA, created the Youtrust signature request, and scheduled the consultation in Google Calendar."
      },
      {
        "number": 3,
        "title": "Privacy Review",
        "prompt": "Review the new analytics vendor before approval.",
        "result": "Produces a privacy checklist and an approval card with unresolved risks.",
        "integrations": [
          "Vanta",
          "Jira",
          "Slack",
          "Notion"
        ],
        "owner": "@Daniel Brooks",
        "completion": "Opened the Jira privacy review, attached the Vanta evidence checklist, and tagged the approver in Slack."
      },
      {
        "number": 4,
        "title": "Litigation Chronology",
        "prompt": "Build a chronology from the Dawson matter files.",
        "result": "Extracts dates into a visual timeline and evidence spreadsheet.",
        "integrations": [
          "Google Drive",
          "Outlook",
          "Microsoft Excel",
          "Miro"
        ],
        "owner": "@Eva Morales",
        "completion": "Generated the chronology workbook and evidence PDF and stored both in the matter’s Drive folder."
      },
      {
        "number": 5,
        "title": "Clause Precedent Finder",
        "prompt": "Find our strongest limitation-of-liability precedent.",
        "result": "Compares four approved precedents with citations and recommended language.",
        "integrations": [
          "Notion",
          "Slab",
          "Confluence",
          "Google Drive"
        ],
        "owner": "@Daniel Brooks",
        "completion": "Inserted approved precedent language into a new draft and linked every source clause from Slab and Confluence."
      },
      {
        "number": 6,
        "title": "Client Intake",
        "prompt": "Qualify the Halcyon inquiry and book the right partner.",
        "result": "Creates a CRM record, conflict-check task, and proposed consultation slot.",
        "integrations": [
          "HubSpot",
          "Attio",
          "Gmail",
          "Google Calendar"
        ],
        "owner": "@Eva Morales",
        "completion": "Created the HubSpot matter/contact records, assigned the conflict check, and booked the partner consultation."
      },
      {
        "number": 7,
        "title": "Regulatory Watch",
        "prompt": "What changed this week that affects our fintech clients?",
        "result": "Produces a sourced regulatory digest and tags the relevant practice owner.",
        "integrations": [
          "Web Crawler",
          "Semrush",
          "Slack",
          "Outlook"
        ],
        "owner": "@Daniel Brooks",
        "completion": "Published the sourced regulatory digest, emailed affected client owners, and posted the practice alert to Slack."
      },
      {
        "number": 8,
        "title": "Matter Staffing",
        "prompt": "Staff the Orion matter without overloading the team.",
        "result": "Shows availability, skills, and allocations in a resource board.",
        "integrations": [
          "Napta",
          "Monday.com",
          "Asana"
        ],
        "owner": "@Eva Morales",
        "completion": "Confirmed staff allocations in Napta, created matter tasks in Monday.com, and notified assigned lawyers."
      },
      {
        "number": 9,
        "title": "Invoice Review",
        "prompt": "Find billing anomalies before the client invoice goes out.",
        "result": "Flags duplicate and out-of-scope entries in a reconciled table.",
        "integrations": [
          "NetSuite",
          "Stripe",
          "Google Sheets"
        ],
        "owner": "@Daniel Brooks",
        "completion": "Corrected duplicate billing entries in the review sheet and created the final NetSuite invoice approval task."
      },
      {
        "number": 10,
        "title": "Board Memo",
        "prompt": "Turn the privacy review into a board-ready update.",
        "result": "Creates a concise memo, three-slide visual, and PDF export preview.",
        "integrations": [
          "Gamma",
          "Canva",
          "Power BI",
          "Microsoft OneDrive"
        ],
        "owner": "@Daniel Brooks",
        "completion": "Generated the board memo and Gamma slides, exported the PDF, and saved the package to OneDrive."
      }
    ]
  },
  {
    "id": "meadow",
    "name": "Meadow Dairy Co.",
    "industry": "Food Production",
    "pods": [
      "Production",
      "Quality",
      "Supply Chain"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Quality Deviation",
        "prompt": "Investigate the protein variance on batch M-184.",
        "result": "Correlates QA notes and line events in a root-cause table with owners.",
        "integrations": [
          "ServiceNow",
          "Google Sheets",
          "Slack",
          "Jira"
        ],
        "owner": "@Sofia Alvarez",
        "completion": "Opened the deviation case, assigned containment tasks in Jira, and posted the affected-lot list to Slack."
      },
      {
        "number": 2,
        "title": "Cold Chain Alert",
        "prompt": "Which deliveries breached temperature tolerance?",
        "result": "Shows affected shipments and a temperature excursion chart.",
        "integrations": [
          "BigQuery",
          "Power BI",
          "Outlook"
        ],
        "owner": "@Lena Ortiz",
        "completion": "Flagged affected deliveries in the operations sheet and sent customer-service alerts from Outlook."
      },
      {
        "number": 3,
        "title": "Batch Traceability",
        "prompt": "Trace lot 9A from supplier to finished goods.",
        "result": "Produces a lineage table across ingredients, production, and customers.",
        "integrations": [
          "Snowflake",
          "Databricks",
          "NetSuite",
          "Microsoft Excel"
        ],
        "owner": "@Sofia Alvarez",
        "completion": "Generated the complete lot-lineage workbook and shared the affected-customer list with the quality owner."
      },
      {
        "number": 4,
        "title": "Production Schedule",
        "prompt": "Replan tomorrow after Line 3 maintenance.",
        "result": "Generates a conflict-aware schedule and reassigns work items.",
        "integrations": [
          "Monday.com",
          "Asana",
          "Google Calendar",
          "Microsoft Teams"
        ],
        "owner": "@Lena Ortiz",
        "completion": "Updated Monday.com production slots, reassigned Asana work, and issued the revised Teams shift plan."
      },
      {
        "number": 5,
        "title": "Supplier Certificate Audit",
        "prompt": "Which suppliers have expired quality certificates?",
        "result": "Returns a document evidence table and renewal task list.",
        "integrations": [
          "Google Drive",
          "Microsoft OneDrive",
          "Notion",
          "Vanta"
        ],
        "owner": "@Sofia Alvarez",
        "completion": "Created supplier renewal tasks, sent certificate requests, and updated the approved-supplier evidence page."
      },
      {
        "number": 6,
        "title": "Demand Forecast",
        "prompt": "How much yogurt should we make for the promotion?",
        "result": "Forecasts SKU demand with confidence bands and inventory exposure.",
        "integrations": [
          "Salesforce",
          "BigQuery",
          "Power BI",
          "Google Sheets"
        ],
        "owner": "@Sofia Alvarez",
        "completion": "Saved the promotional demand forecast and created replenishment tasks for exposed SKUs."
      },
      {
        "number": 7,
        "title": "Plant Maintenance Triage",
        "prompt": "Prioritize this morning’s equipment tickets.",
        "result": "Routes tickets by production impact and drafts the shift update.",
        "integrations": [
          "Freshservice",
          "ServiceNow",
          "Statuspage",
          "Microsoft Teams"
        ],
        "owner": "@Lena Ortiz",
        "completion": "Reprioritized the service queue, assigned technicians, and posted the plant-impact notice to Teams."
      },
      {
        "number": 8,
        "title": "Energy Cost Review",
        "prompt": "Why is Plant B’s energy spend above plan?",
        "result": "Creates a cost-driver waterfall and recommended operating changes.",
        "integrations": [
          "Costory",
          "Google Sheets",
          "Power BI"
        ],
        "owner": "@Sofia Alvarez",
        "completion": "Published the energy variance report and assigned three verified savings actions to plant owners."
      },
      {
        "number": 9,
        "title": "Recall Simulation",
        "prompt": "Run the response plan for a packaging recall.",
        "result": "Builds a command-center timeline, communications, and accountable owners.",
        "integrations": [
          "Jira",
          "Slack",
          "Gmail",
          "Outlook",
          "Miro"
        ],
        "owner": "@Sofia Alvarez",
        "completion": "Created the recall command board, drafted regulator/customer notices, and assigned the response team."
      },
      {
        "number": 10,
        "title": "Weekly Plant Report",
        "prompt": "Turn this week’s production data into the exec report.",
        "result": "Generates a branded deck with charts, action items, and PDF export.",
        "integrations": [
          "Google Meet",
          "Gamma",
          "Canva",
          "Microsoft Excel",
          "Google Drive"
        ],
        "owner": "@Sofia Alvarez",
        "completion": "Generated the executive deck, exported its PDF, stored it in Drive, and emailed the meeting-ready package."
      }
    ]
  },
  {
    "id": "vector",
    "name": "Vector Forge",
    "industry": "Technology",
    "pods": [
      "Engineering",
      "Product",
      "Security"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Incident Root Cause",
        "prompt": "Explain the checkout latency incident.",
        "result": "Correlates deploys, tickets, messages, and query timing in an incident timeline.",
        "integrations": [
          "GitHub",
          "Jira",
          "Slack",
          "Statuspage",
          "Databricks"
        ],
        "owner": "@Elena Park",
        "completion": "Opened the incident record, linked the suspect deploy, updated Statuspage, and assigned remediation tickets."
      },
      {
        "number": 2,
        "title": "Pull Request Review",
        "prompt": "Review PR 842 against our platform standards.",
        "result": "Produces inline findings, risk summary, and a proposed Linear follow-up.",
        "integrations": [
          "GitHub",
          "Linear",
          "Confluence"
        ],
        "owner": "@Nikhil Rao",
        "completion": "Posted the GitHub review, created the Linear follow-ups, and linked the governing Confluence standards."
      },
      {
        "number": 3,
        "title": "Regression Explorer",
        "prompt": "Which release caused EU activation to drop?",
        "result": "Builds a cohort Frame linked to the suspect release and affected events.",
        "integrations": [
          "Amplitude",
          "Amplitude Europe",
          "BigQuery",
          "GitHub"
        ],
        "owner": "@Elena Park",
        "completion": "Published the activation cohort Frame and opened a GitHub regression issue with the affected release evidence."
      },
      {
        "number": 4,
        "title": "Roadmap Reconciliation",
        "prompt": "Align the roadmap with current customer commitments.",
        "result": "Shows conflicts between initiatives, delivery work, and customer evidence.",
        "integrations": [
          "Productboard",
          "Linear",
          "Notion",
          "Slack"
        ],
        "owner": "@Elena Park",
        "completion": "Updated Productboard priorities, synchronized Linear work, and posted the commitment changes to Slack."
      },
      {
        "number": 5,
        "title": "Documentation Drift",
        "prompt": "Find product behavior that our docs no longer describe.",
        "result": "Returns a cited docs-drift table and proposed updates.",
        "integrations": [
          "GitHub",
          "Slab",
          "Confluence",
          "Notion"
        ],
        "owner": "@Nikhil Rao",
        "completion": "Drafted and applied documentation updates in Slab/Confluence and opened review requests for owners."
      },
      {
        "number": 6,
        "title": "Database Debugger",
        "prompt": "Why are enterprise exports timing out?",
        "result": "Queries schemas and traces the bottleneck to one unindexed access pattern.",
        "integrations": [
          "Supabase",
          "Snowflake",
          "Databricks",
          "Hex"
        ],
        "owner": "@Elena Park",
        "completion": "Added the validated database index migration to the engineering task and attached before/after query evidence."
      },
      {
        "number": 7,
        "title": "Cloud Spend Guard",
        "prompt": "Find avoidable AI and infrastructure spend this month.",
        "result": "Creates a FinOps dashboard with owners and savings estimates.",
        "integrations": [
          "Costory",
          "BigQuery",
          "Power BI",
          "Slack"
        ],
        "owner": "@Elena Park",
        "completion": "Published the FinOps dashboard, created saving-owner tasks, and posted the monthly guardrail alert."
      },
      {
        "number": 8,
        "title": "Release Communication",
        "prompt": "Prepare the v4.8 launch package.",
        "result": "Converts merged work into release notes, a visual deck, and launch tasks.",
        "integrations": [
          "GitHub",
          "Jira",
          "Canva",
          "Gamma"
        ],
        "owner": "@Nikhil Rao",
        "completion": "Generated release notes and launch slides, created the Jira launch checklist, and stored the final assets."
      },
      {
        "number": 9,
        "title": "Feedback Signal Map",
        "prompt": "What are users asking for after the redesign?",
        "result": "Clusters tickets and behavior into themes linked to roadmap candidates.",
        "integrations": [
          "Zendesk",
          "Intercom",
          "Productboard",
          "Amplitude"
        ],
        "owner": "@Elena Park",
        "completion": "Added ranked feedback themes to Productboard and linked every theme to tickets and Amplitude evidence."
      },
      {
        "number": 10,
        "title": "Internal Tool Prototype",
        "prompt": "Build a webhook that normalizes support payloads.",
        "result": "Shows the generated endpoint, sample payload, test result, and repo task.",
        "integrations": [
          "Val Town",
          "GitHub",
          "Supabase",
          "Slack"
        ],
        "owner": "@Nikhil Rao",
        "completion": "Created and tested the Val Town webhook, saved its endpoint, and opened the integration PR in GitHub."
      }
    ]
  },
  {
    "id": "stonebridge",
    "name": "Stonebridge Build",
    "industry": "Construction",
    "pods": [
      "Projects",
      "Safety",
      "Procurement"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Schedule Recovery",
        "prompt": "Recover two weeks on the Riverside project.",
        "result": "Produces a critical-path Frame with resequenced tasks and owners.",
        "integrations": [
          "Monday.com",
          "Asana",
          "Google Sheets",
          "Microsoft Teams"
        ],
        "owner": "@Olivia Grant",
        "completion": "Updated the master schedule, reassigned critical-path tasks, and posted the recovery plan to Teams."
      },
      {
        "number": 2,
        "title": "Site Safety Brief",
        "prompt": "Turn today’s safety reports into actions.",
        "result": "Creates a severity table, owner assignments, and a signed briefing PDF.",
        "integrations": [
          "ServiceNow",
          "Outlook",
          "Vanta",
          "Google Drive"
        ],
        "owner": "@Marco Diaz",
        "completion": "Created safety corrective actions, assigned owners, and generated the signed briefing PDF."
      },
      {
        "number": 3,
        "title": "Subcontractor Readiness",
        "prompt": "Which subcontractors cannot start Monday?",
        "result": "Shows missing agreements, insurance, and mobilization tasks.",
        "integrations": [
          "Youtrust",
          "Microsoft OneDrive",
          "Outlook",
          "Monday.com"
        ],
        "owner": "@Olivia Grant",
        "completion": "Sent missing-document requests, opened signature flows, and marked ready subcontractors in Monday.com."
      },
      {
        "number": 4,
        "title": "Cost Overrun Analysis",
        "prompt": "Explain the concrete package overrun.",
        "result": "Builds a committed-vs-actual waterfall with source-line evidence.",
        "integrations": [
          "NetSuite",
          "Microsoft Excel",
          "Power BI",
          "Costory"
        ],
        "owner": "@Olivia Grant",
        "completion": "Published the cost-variance report and created approved change-control tasks for the package owner."
      },
      {
        "number": 5,
        "title": "Crew Allocation",
        "prompt": "Move crews without delaying the other sites.",
        "result": "Generates a skills-aware allocation calendar and conflict list.",
        "integrations": [
          "Napta",
          "Asana",
          "Google Calendar",
          "Microsoft Teams"
        ],
        "owner": "@Marco Diaz",
        "completion": "Confirmed crew moves in Napta, updated calendars, and notified both affected site leads."
      },
      {
        "number": 6,
        "title": "RFI Decision Pack",
        "prompt": "Prepare RFI-118 for architect approval.",
        "result": "Combines drawings and correspondence into an approval card and marked-up board.",
        "integrations": [
          "Outlook",
          "Google Drive",
          "Miro",
          "Jira"
        ],
        "owner": "@Olivia Grant",
        "completion": "Created the RFI decision card, attached marked drawings, and assigned architect approval in Jira."
      },
      {
        "number": 7,
        "title": "Vendor Quote Compare",
        "prompt": "Choose the best glazing quote, not just the cheapest.",
        "result": "Returns a normalized quote table with exclusions and risk weighting.",
        "integrations": [
          "NetSuite",
          "Gmail",
          "Google Sheets",
          "Youtrust"
        ],
        "owner": "@Marco Diaz",
        "completion": "Generated the normalized bid comparison, selected the policy-compliant recommendation, and opened approval."
      },
      {
        "number": 8,
        "title": "Daily Site Brief",
        "prompt": "Summarize the coordination call and assign follow-ups.",
        "result": "Produces a cited recap, calendar changes, and tagged tasks.",
        "integrations": [
          "Fathom",
          "Microsoft Teams",
          "Notion",
          "Google Calendar"
        ],
        "owner": "@Olivia Grant",
        "completion": "Posted the same-day meeting recap, created every follow-up task, and updated the coordination calendar."
      },
      {
        "number": 9,
        "title": "Client Progress Pack",
        "prompt": "Create this month’s owner update.",
        "result": "Generates a branded progress deck, chart appendix, and PDF.",
        "integrations": [
          "Canva",
          "Gamma",
          "Google Drive",
          "Power BI"
        ],
        "owner": "@Olivia Grant",
        "completion": "Generated the client deck, exported its PDF, stored it in Drive, and drafted the owner email."
      },
      {
        "number": 10,
        "title": "Warranty Escalation",
        "prompt": "Resolve the recurring HVAC complaints at Tower A.",
        "result": "Links warranty history, account impact, and responsible contractor tasks.",
        "integrations": [
          "Zendesk",
          "Freshservice",
          "Salesforce",
          "Monday.com"
        ],
        "owner": "@Marco Diaz",
        "completion": "Updated the Salesforce account and warranty case, assigned the contractor task, and sent the resident update."
      }
    ]
  },
  {
    "id": "loom",
    "name": "Loom & Line",
    "industry": "Retail",
    "pods": [
      "Stores",
      "Merchandising",
      "Campaigns"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Replenishment Watch",
        "prompt": "Which stores will stock out this weekend?",
        "result": "Shows SKU/store risks and recommended transfer orders in a table.",
        "integrations": [
          "Shopify",
          "NetSuite",
          "Google Sheets",
          "Slack"
        ],
        "owner": "@Ava Sinclair",
        "completion": "Created store transfer orders, updated the replenishment sheet, and alerted store managers in Slack."
      },
      {
        "number": 2,
        "title": "Campaign Launch",
        "prompt": "Launch the linen collection campaign from the approved brief.",
        "result": "Locates assets, creates variants, and returns the channel launch card.",
        "integrations": [
          "Canva",
          "Semrush",
          "HubSpot",
          "Slack"
        ],
        "owner": "@Mina Cole",
        "completion": "Generated the approved creative variants, created the HubSpot campaign, and posted the launch checklist."
      },
      {
        "number": 3,
        "title": "Journey Drop-Off",
        "prompt": "Why are mobile shoppers abandoning size selection?",
        "result": "Creates a journey funnel with replay evidence and revenue impact.",
        "integrations": [
          "Contentsquare",
          "Amplitude",
          "Shopify",
          "BigQuery"
        ],
        "owner": "@Ava Sinclair",
        "completion": "Published the journey Frame and created the Product task tied to the affected step and revenue estimate."
      },
      {
        "number": 4,
        "title": "VIP Outreach",
        "prompt": "Invite our top customers to the preview event.",
        "result": "Builds the segment, three-touch cadence, owner list, and approval step.",
        "integrations": [
          "Salesforce",
          "HubSpot",
          "Lemlist",
          "Salesloft"
        ],
        "owner": "@Mina Cole",
        "completion": "Created the VIP segment and Salesloft/Lemlist cadence and assigned each high-value account owner."
      },
      {
        "number": 5,
        "title": "Returns Diagnosis",
        "prompt": "What is driving returns for the new denim line?",
        "result": "Links order, payment, and support evidence into a reason table.",
        "integrations": [
          "Shopify",
          "Stripe",
          "Zendesk",
          "Intercom"
        ],
        "owner": "@Ava Sinclair",
        "completion": "Tagged return reasons in support, created the denim quality issue, and sent the weekly owner summary."
      },
      {
        "number": 6,
        "title": "Store Staffing",
        "prompt": "Fix Saturday’s staffing gaps across flagship stores.",
        "result": "Generates a schedule with availability conflicts and suggested swaps.",
        "integrations": [
          "Ukg Ready",
          "Napta",
          "Outlook Calendar",
          "Microsoft Teams"
        ],
        "owner": "@Ava Sinclair",
        "completion": "Updated UKG shifts, created calendar changes, and notified every affected store lead in Teams."
      },
      {
        "number": 7,
        "title": "Product Launch Room",
        "prompt": "Coordinate the flagship opening next month.",
        "result": "Creates the launch plan, event page, visual assets, and decision board.",
        "integrations": [
          "Productboard",
          "Canva",
          "Gamma",
          "Luma"
        ],
        "owner": "@Mina Cole",
        "completion": "Created the Luma event, generated launch assets, updated Productboard, and posted the go-live plan."
      },
      {
        "number": 8,
        "title": "Social Content Board",
        "prompt": "Turn this week’s launches into social posts.",
        "result": "Produces a branded content calendar and creative status board.",
        "integrations": [
          "Canva",
          "Notion",
          "Slack",
          "Adomik"
        ],
        "owner": "@Mina Cole",
        "completion": "Generated the content calendar and assets, saved them to Notion, and scheduled the Slack review."
      },
      {
        "number": 9,
        "title": "Review Insight Digest",
        "prompt": "What should product fix from this month’s feedback?",
        "result": "Clusters support and public feedback into ranked product themes.",
        "integrations": [
          "Front",
          "Intercom",
          "Web Crawler",
          "Productboard"
        ],
        "owner": "@Ava Sinclair",
        "completion": "Added ranked feedback themes to Productboard and created fixes with source conversations attached."
      },
      {
        "number": 10,
        "title": "Weekly Trade Report",
        "prompt": "Prepare Monday’s retail performance update.",
        "result": "Generates a one-page report with sales, margin, stock, and actions.",
        "integrations": [
          "Power BI",
          "Google Sheets",
          "Shopify",
          "Outlook"
        ],
        "owner": "@Ava Sinclair",
        "completion": "Generated the trade report, exported it, emailed leadership, and assigned the three corrective actions."
      }
    ]
  },
  {
    "id": "cartly",
    "name": "Cartly Commerce",
    "industry": "E-commerce",
    "pods": [
      "Growth",
      "Fulfillment",
      "Retention"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Cart Recovery",
        "prompt": "Recover high-value carts without discounting everyone.",
        "result": "Segments customers, drafts personalized sequences, and shows expected recovery.",
        "integrations": [
          "Shopify",
          "Stripe",
          "HubSpot",
          "Lemlist"
        ],
        "owner": "@Noah Williams",
        "completion": "Created the high-value cart segment, launched the approved recovery cadence, and wrote every activity to HubSpot."
      },
      {
        "number": 2,
        "title": "Fraud Signal Review",
        "prompt": "Which refund requests need manual review today?",
        "result": "Builds a risk table combining payment, customer, and known-pattern evidence.",
        "integrations": [
          "Stripe",
          "Supabase",
          "BigQuery",
          "Confluence"
        ],
        "owner": "@Iris Chen",
        "completion": "Flagged high-risk refunds in Supabase, opened manual-review tasks, and attached the evidence table."
      },
      {
        "number": 3,
        "title": "Support Swarm",
        "prompt": "Clear the urgent support queue before the campaign.",
        "result": "Deduplicates cases, proposes replies, and routes owners in one ticket board.",
        "integrations": [
          "Zendesk",
          "Intercom",
          "Front",
          "Slack"
        ],
        "owner": "@Noah Williams",
        "completion": "Merged duplicate cases, drafted replies, reassigned urgent tickets, and posted the cleared-queue receipt."
      },
      {
        "number": 4,
        "title": "SEO Opportunity Map",
        "prompt": "Where can we win organic traffic this quarter?",
        "result": "Produces a keyword-gap Frame, page priorities, and an approved content brief.",
        "integrations": [
          "Semrush",
          "Web Crawler",
          "Contentsquare",
          "Canva"
        ],
        "owner": "@Iris Chen",
        "completion": "Generated the SEO brief and Canva assets and created the prioritized content worklist."
      },
      {
        "number": 5,
        "title": "Campaign ROAS",
        "prompt": "Which campaigns should we pause before noon?",
        "result": "Joins ad, product, and finance signals in a live-looking ROAS dashboard.",
        "integrations": [
          "Adomik",
          "Amplitude",
          "Google Sheets",
          "Power BI"
        ],
        "owner": "@Noah Williams",
        "completion": "Paused the demo's underperforming campaigns, published the ROAS dashboard, and notified the campaign owner."
      },
      {
        "number": 6,
        "title": "Supplier Delay Recovery",
        "prompt": "Protect next week’s launch from supplier delays.",
        "result": "Identifies exposed SKUs, drafts supplier messages, and assigns recovery tasks.",
        "integrations": [
          "NetSuite",
          "Outlook",
          "Monday.com",
          "Microsoft Teams"
        ],
        "owner": "@Noah Williams",
        "completion": "Updated the supplier recovery board, sent vendor messages, and posted the protected-SKU list to Teams."
      },
      {
        "number": 7,
        "title": "Competitor Price Watch",
        "prompt": "Show meaningful competitor price moves since yesterday.",
        "result": "Runs market collection and returns a normalized price/action table.",
        "integrations": [
          "Apify",
          "Web Crawler",
          "Google Sheets",
          "Slack"
        ],
        "owner": "@Iris Chen",
        "completion": "Ran the competitor collection, saved the normalized price table, and posted material changes to Slack."
      },
      {
        "number": 8,
        "title": "Revenue Cohort Explorer",
        "prompt": "Why is repeat purchase down for the June cohort?",
        "result": "Builds a retention chart and isolates the affected product/customer segment.",
        "integrations": [
          "Snowflake",
          "Databricks",
          "Hex",
          "Amplitude"
        ],
        "owner": "@Noah Williams",
        "completion": "Published the cohort Frame and created retention experiments for the affected segment."
      },
      {
        "number": 9,
        "title": "Creator Event Ops",
        "prompt": "Fill the creator launch event and manage follow-up.",
        "result": "Creates the event, segments invitees, prepares assets, and shows attendance.",
        "integrations": [
          "Luma",
          "HubSpot",
          "Canva",
          "Google Calendar"
        ],
        "owner": "@Iris Chen",
        "completion": "Created the Luma event, sent segmented invitations, generated assets, and scheduled the follow-up."
      },
      {
        "number": 10,
        "title": "Commerce QBR",
        "prompt": "Build the quarterly growth review for leadership.",
        "result": "Generates an account/revenue narrative, charts, and a finished presentation.",
        "integrations": [
          "Salesforce",
          "Gong",
          "Gamma",
          "Google Drive"
        ],
        "owner": "@Noah Williams",
        "completion": "Generated the commerce QBR, exported the deck, stored it in Drive, and created Salesforce follow-ups."
      }
    ]
  },
  {
    "id": "harborview",
    "name": "Harborview Health",
    "industry": "Healthcare",
    "pods": [
      "Clinics",
      "Care Operations",
      "Quality"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Referral Intake",
        "prompt": "Triage today’s referral backlog and show missing documents.",
        "result": "Produces a referral queue, document checklist, and assigned follow-ups.",
        "integrations": [
          "Outlook",
          "Microsoft OneDrive",
          "ServiceNow",
          "Microsoft Teams"
        ],
        "owner": "@Nina Patel",
        "completion": "Updated the referral queue, requested missing files, and assigned each non-clinical follow-up."
      },
      {
        "number": 2,
        "title": "No-Show Recovery",
        "prompt": "Fill tomorrow’s appointment gaps from the waitlist.",
        "result": "Shows eligible slots, communication drafts, and a conflict-free calendar.",
        "integrations": [
          "Google Calendar",
          "Outlook",
          "HubSpot",
          "Microsoft Teams"
        ],
        "owner": "@Nina Patel",
        "completion": "Filled eligible appointment gaps, updated the calendar, and sent approved scheduling notices."
      },
      {
        "number": 3,
        "title": "Policy Answer",
        "prompt": "What is the approved process for an urgent referral?",
        "result": "Returns a short cited answer and links the authoritative policy sections.",
        "integrations": [
          "Guru",
          "Notion",
          "Google Drive",
          "Slack"
        ],
        "owner": "@Rachel Kim",
        "completion": "Delivered the cited policy answer and created an owner-tagged clarification task where evidence conflicted."
      },
      {
        "number": 4,
        "title": "Staff Rota",
        "prompt": "Resolve next week’s coverage gaps without overtime.",
        "result": "Creates a staff availability grid and proposes compliant swaps.",
        "integrations": [
          "Ukg Ready",
          "Napta",
          "Outlook Calendar",
          "Microsoft Teams"
        ],
        "owner": "@Nina Patel",
        "completion": "Updated the UKG rota and calendar and notified affected employees in Teams."
      },
      {
        "number": 5,
        "title": "Equipment Ticket Triage",
        "prompt": "Prioritize the open equipment issues by service impact.",
        "result": "Routes incidents, highlights affected rooms, and drafts the status notice.",
        "integrations": [
          "Freshservice",
          "ServiceNow",
          "Statuspage",
          "Microsoft Teams"
        ],
        "owner": "@Rachel Kim",
        "completion": "Reprioritized equipment tickets, assigned technicians, and posted the service-impact update."
      },
      {
        "number": 6,
        "title": "Quality Meeting Actions",
        "prompt": "Turn the quality meeting into owned actions.",
        "result": "Extracts decisions and creates a deadline/owner table with source timestamps.",
        "integrations": [
          "Fathom",
          "Granola",
          "Microsoft OneDrive",
          "Asana"
        ],
        "owner": "@Nina Patel",
        "completion": "Created quality actions in Asana, tagged owners, and stored the cited meeting record in OneDrive."
      },
      {
        "number": 7,
        "title": "Compliance Evidence Pack",
        "prompt": "Prepare the evidence requested for tomorrow’s review.",
        "result": "Builds a cited evidence checklist and signature-ready cover sheet.",
        "integrations": [
          "Vanta",
          "Google Drive",
          "Confluence",
          "Youtrust"
        ],
        "owner": "@Rachel Kim",
        "completion": "Assembled the evidence pack, generated the signed cover sheet, and stored the audit binder."
      },
      {
        "number": 8,
        "title": "Service Feedback",
        "prompt": "What operational issues are patients repeating?",
        "result": "Clusters non-clinical feedback into themes and an improvement backlog.",
        "integrations": [
          "Zendesk",
          "Front",
          "Intercom",
          "Power BI"
        ],
        "owner": "@Nina Patel",
        "completion": "Added service themes to the backlog and assigned every operational owner."
      },
      {
        "number": 9,
        "title": "Operations Dashboard",
        "prompt": "Give me one view of access, capacity, and service levels.",
        "result": "Produces a multi-source KPI dashboard with variances and owners.",
        "integrations": [
          "BigQuery",
          "Microsoft Excel",
          "Power BI",
          "Microsoft"
        ],
        "owner": "@Nina Patel",
        "completion": "Published the operations dashboard and created the capacity and SLA recovery tasks."
      },
      {
        "number": 10,
        "title": "Board Operations Pack",
        "prompt": "Create the monthly operational board pack.",
        "result": "Generates a concise deck, chart appendix, and email-ready PDF.",
        "integrations": [
          "Gamma",
          "Canva",
          "Microsoft OneDrive",
          "Outlook"
        ],
        "owner": "@Nina Patel",
        "completion": "Generated the board deck and PDF, saved both to OneDrive, and drafted the leadership email."
      }
    ]
  },
  {
    "id": "keyline",
    "name": "Keyline Properties",
    "industry": "Property Management",
    "pods": [
      "Properties",
      "Leasing",
      "Maintenance"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Lead-to-Viewing",
        "prompt": "Qualify today’s renter leads and book the best matches.",
        "result": "Scores leads, creates CRM next steps, and proposes viewing slots.",
        "integrations": [
          "HubSpot",
          "Attio",
          "Gmail",
          "Google Calendar"
        ],
        "owner": "@Marcus Reed",
        "completion": "Created qualified CRM records, assigned owners, booked viewings, and sent confirmations."
      },
      {
        "number": 2,
        "title": "Maintenance Dispatch",
        "prompt": "Route urgent maintenance requests before the morning stand-up.",
        "result": "Deduplicates requests and assigns technicians in a work-order board.",
        "integrations": [
          "Front",
          "ServiceNow",
          "Monday.com",
          "Microsoft Teams"
        ],
        "owner": "@Marcus Reed",
        "completion": "Deduplicated maintenance requests, created work orders, assigned technicians, and posted the updated queue."
      },
      {
        "number": 3,
        "title": "Lease Renewal Flow",
        "prompt": "Prepare the renewals due in the next 30 days.",
        "result": "Produces a renewal table, tailored offers, signature actions, and calls.",
        "integrations": [
          "Youtrust",
          "Outlook",
          "Salesforce",
          "Google Calendar"
        ],
        "owner": "@Sasha Green",
        "completion": "Generated renewal offers and signature requests, scheduled calls, and updated Salesforce stages."
      },
      {
        "number": 4,
        "title": "Delinquency Recovery",
        "prompt": "Prioritize overdue accounts and draft respectful follow-ups.",
        "result": "Reconciles balances, ranks risk, and creates approval-ready outreach.",
        "integrations": [
          "NetSuite",
          "Stripe",
          "Microsoft Excel",
          "Outlook"
        ],
        "owner": "@Marcus Reed",
        "completion": "Reconciled balances, created approved payment drafts, and assigned high-risk accounts to @Marcus."
      },
      {
        "number": 5,
        "title": "Portfolio Dashboard",
        "prompt": "Which buildings need attention this week?",
        "result": "Shows occupancy, arrears, maintenance, and owner actions in one Frame.",
        "integrations": [
          "BigQuery",
          "Power BI",
          "Google Sheets",
          "Google Drive"
        ],
        "owner": "@Marcus Reed",
        "completion": "Published the portfolio Frame and created owner-tagged corrective tasks."
      },
      {
        "number": 6,
        "title": "Listing Refresh",
        "prompt": "Refresh weak listings using current market evidence.",
        "result": "Produces rewritten listings, SEO opportunities, and an asset checklist.",
        "integrations": [
          "Canva",
          "Semrush",
          "Web Crawler",
          "Notion"
        ],
        "owner": "@Sasha Green",
        "completion": "Rewrote and saved weak listings, generated Canva assets, and created the publishing checklist."
      },
      {
        "number": 7,
        "title": "Vendor Quote Review",
        "prompt": "Compare the elevator maintenance quotes.",
        "result": "Normalizes scope/exclusions and assigns the preferred-vendor approval.",
        "integrations": [
          "Gmail",
          "Google Drive",
          "Asana",
          "Monday.com"
        ],
        "owner": "@Marcus Reed",
        "completion": "Saved the vendor comparison and created the recommended-vendor approval task."
      },
      {
        "number": 8,
        "title": "Inspection Pack",
        "prompt": "Turn inspection files into a prioritized property plan.",
        "result": "Creates a defect table, visual board, costs, and accountable owners.",
        "integrations": [
          "Microsoft OneDrive",
          "Microsoft Excel",
          "Miro",
          "Microsoft Teams"
        ],
        "owner": "@Sasha Green",
        "completion": "Generated the inspection report, assigned defects, and posted the remediation plan to Teams."
      },
      {
        "number": 9,
        "title": "Owner Update",
        "prompt": "Build the monthly update for Lakeside’s owners.",
        "result": "Generates a deck with operating metrics, issues, and next decisions.",
        "integrations": [
          "Gamma",
          "Power BI",
          "Google Drive",
          "Outlook"
        ],
        "owner": "@Marcus Reed",
        "completion": "Generated the owner deck and PDF, stored both in Drive, and drafted the owner email."
      },
      {
        "number": 10,
        "title": "Resident Escalation",
        "prompt": "Give the account team everything needed for this escalation.",
        "result": "Combines resident history, open tickets, sentiment, and proposed resolution.",
        "integrations": [
          "Zendesk",
          "Intercom",
          "Salesforce",
          "Slack"
        ],
        "owner": "@Marcus Reed",
        "completion": "Updated resident and account records, merged duplicate tickets, assigned resolution, and posted the escalation receipt."
      }
    ]
  },
  {
    "id": "talentspring",
    "name": "TalentSpring",
    "industry": "Recruiting",
    "pods": [
      "Candidates",
      "Hiring Teams",
      "Onboarding"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Candidate Shortlist",
        "prompt": "Shortlist the strongest data-platform candidates.",
        "result": "Returns an evidence-based comparison table and tagged reviewer requests.",
        "integrations": [
          "Ashby",
          "Google Sheets",
          "Notion",
          "Slack"
        ],
        "owner": "@Chloe Martin",
        "completion": "Added the ranked shortlist to Ashby and requested scorecard reviews from the hiring panel."
      },
      {
        "number": 2,
        "title": "Interview Scheduler",
        "prompt": "Schedule the final panel without another email thread.",
        "result": "Finds overlap across calendars and prepares candidate/participant notices.",
        "integrations": [
          "Google Calendar",
          "Outlook Calendar",
          "Gmail",
          "Microsoft Teams"
        ],
        "owner": "@Chloe Martin",
        "completion": "Booked the conflict-free interview panel, updated calendars, and sent candidate and interviewer notices."
      },
      {
        "number": 3,
        "title": "Interview Synthesis",
        "prompt": "Create the final scorecard from every interview.",
        "result": "Merges transcripts and ATS evidence into strengths, risks, and recommendation.",
        "integrations": [
          "Granola",
          "Fathom",
          "Praiz",
          "Ashby"
        ],
        "owner": "@Aiden Lee",
        "completion": "Completed the Ashby scorecard with cited evidence and tagged the decision owner."
      },
      {
        "number": 4,
        "title": "Hiring Manager Brief",
        "prompt": "Brief the hiring manager before today’s interviews.",
        "result": "Produces a one-page candidate/context brief with cited source links.",
        "integrations": [
          "Ashby",
          "Google Drive",
          "Slack",
          "Notion"
        ],
        "owner": "@Chloe Martin",
        "completion": "Generated the hiring-manager brief and stored it in Drive."
      },
      {
        "number": 5,
        "title": "Sourcing Campaign",
        "prompt": "Build a targeted outreach campaign for security engineers.",
        "result": "Creates the segment, three-touch sequence, task queue, and CRM records.",
        "integrations": [
          "Lemlist",
          "Salesloft",
          "HubSpot",
          "Attio"
        ],
        "owner": "@Chloe Martin",
        "completion": "Created the target segment, cadence, messages, and owner-assigned outreach tasks."
      },
      {
        "number": 6,
        "title": "Job Launch",
        "prompt": "Publish the approved role consistently across our channels.",
        "result": "Creates the job copy, visual asset, review card, and launch checklist.",
        "integrations": [
          "Canva",
          "Notion",
          "Slack",
          "Web Crawler"
        ],
        "owner": "@Aiden Lee",
        "completion": "Generated the approved job copy and asset and created the publishing checklist."
      },
      {
        "number": 7,
        "title": "Candidate Experience",
        "prompt": "Find candidates waiting too long and recover the experience.",
        "result": "Shows stalled stages and prepares personalized follow-up messages.",
        "integrations": [
          "Front",
          "Gmail",
          "Google Calendar",
          "Ashby"
        ],
        "owner": "@Chloe Martin",
        "completion": "Sent recovery messages, scheduled next steps, and updated candidate stages."
      },
      {
        "number": 8,
        "title": "Workforce Capacity",
        "prompt": "Where do we need hires or internal mobility next quarter?",
        "result": "Creates a skills/capacity dashboard with hiring and allocation gaps.",
        "integrations": [
          "Ukg Ready",
          "Napta",
          "Power BI",
          "Google Sheets"
        ],
        "owner": "@Chloe Martin",
        "completion": "Published the workforce Frame and created hiring and allocation actions."
      },
      {
        "number": 9,
        "title": "Offer Packet",
        "prompt": "Prepare and route the offer for the approved candidate.",
        "result": "Produces the offer PDF, approval trail, and signature-ready packet.",
        "integrations": [
          "Youtrust",
          "Google Drive",
          "Outlook",
          "Ashby"
        ],
        "owner": "@Chloe Martin",
        "completion": "Generated the offer PDF, opened the Youtrust signature request, and updated Ashby."
      },
      {
        "number": 10,
        "title": "Onboarding Launch",
        "prompt": "Give the new cohort a complete first-week plan.",
        "result": "Builds a cited onboarding hub, task assignments, and welcome event.",
        "integrations": [
          "Guru",
          "Confluence",
          "Asana",
          "Luma"
        ],
        "owner": "@Aiden Lee",
        "completion": "Created the onboarding hub, tasks, and event and notified the incoming cohort."
      }
    ]
  },
  {
    "id": "cedarshield",
    "name": "CedarShield Insurance",
    "industry": "Insurance",
    "pods": [
      "Claims",
      "Underwriting",
      "Renewals"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Claim Triage",
        "prompt": "Route today’s new claims by urgency and expertise.",
        "result": "Produces a claim queue, risk rationale, owner mentions, and next actions.",
        "integrations": [
          "Salesforce",
          "Zendesk",
          "ServiceNow",
          "Microsoft Teams"
        ],
        "owner": "@James Foster",
        "completion": "Updated claim priority and routing, assigned owners, and posted the Teams completion receipt."
      },
      {
        "number": 2,
        "title": "Renewal Brief",
        "prompt": "Prepare the Helios renewal before the broker call.",
        "result": "Builds a client timeline, risks, opportunities, and calendar-ready agenda.",
        "integrations": [
          "HubSpot",
          "Gong",
          "Outlook",
          "Google Calendar"
        ],
        "owner": "@James Foster",
        "completion": "Updated renewal CRM fields, created the agenda, and scheduled the renewal event."
      },
      {
        "number": 3,
        "title": "Fraud Investigation",
        "prompt": "Show the connected signals behind these suspicious claims.",
        "result": "Creates an entity/relationship graph and cited evidence table.",
        "integrations": [
          "BigQuery",
          "Snowflake",
          "Databricks",
          "Confluence"
        ],
        "owner": "@Leah Morgan",
        "completion": "Flagged high-risk claims, opened investigation tasks, and attached the risk graph."
      },
      {
        "number": 4,
        "title": "Policy Comparison",
        "prompt": "Compare these policy versions for material coverage changes.",
        "result": "Produces a side-by-side table with cited clauses and customer impact.",
        "integrations": [
          "Google Drive",
          "Microsoft OneDrive",
          "Microsoft Excel",
          "Notion"
        ],
        "owner": "@James Foster",
        "completion": "Generated and stored the policy comparison workbook."
      },
      {
        "number": 5,
        "title": "Broker Call Pack",
        "prompt": "Turn recent broker calls into an account action plan.",
        "result": "Synthesizes call evidence into objections, commitments, and CRM actions.",
        "integrations": [
          "Modjo",
          "Clari Copilot",
          "Fathom",
          "Salesforce"
        ],
        "owner": "@James Foster",
        "completion": "Wrote commitments and next steps to Salesforce and assigned every action."
      },
      {
        "number": 6,
        "title": "Compliance Approval",
        "prompt": "Pressure-test the new claims process before launch.",
        "result": "Shows controls, gaps, evidence, and an approver-tagged decision card.",
        "integrations": [
          "Vanta",
          "Youtrust",
          "Confluence",
          "Jira"
        ],
        "owner": "@Leah Morgan",
        "completion": "Created the compliance approval record, attached evidence, and tagged the approver."
      },
      {
        "number": 7,
        "title": "Catastrophe Response",
        "prompt": "Build a live response view for the regional storm.",
        "result": "Produces an impact Frame, public updates, ticket signals, and comms tasks.",
        "integrations": [
          "Web Crawler",
          "Slack",
          "Statuspage",
          "Front"
        ],
        "owner": "@James Foster",
        "completion": "Published the catastrophe Frame, updated Statuspage, and created response tasks."
      },
      {
        "number": 8,
        "title": "Claims SLA Dashboard",
        "prompt": "Where are we at risk of missing claims commitments?",
        "result": "Creates an SLA dashboard with backlog drivers and reassignment suggestions.",
        "integrations": [
          "Power BI",
          "BigQuery",
          "ServiceNow",
          "Google Sheets"
        ],
        "owner": "@James Foster",
        "completion": "Reassigned SLA-risk claims, updated ServiceNow, and published the queue dashboard."
      },
      {
        "number": 9,
        "title": "Client QBR",
        "prompt": "Create the quarterly risk and service review.",
        "result": "Generates a client-ready slide deck with charts and source appendix.",
        "integrations": [
          "Gamma",
          "Canva",
          "Salesforce",
          "Microsoft OneDrive"
        ],
        "owner": "@James Foster",
        "completion": "Generated the client QBR and PDF, stored both in OneDrive, and created CRM follow-ups."
      },
      {
        "number": 10,
        "title": "Broker Coaching",
        "prompt": "Coach the team from this month’s renewal calls.",
        "result": "Returns a scored behavior table, winning examples, and tagged coaching tasks.",
        "integrations": [
          "Gong",
          "Modjo",
          "Praiz",
          "Slack"
        ],
        "owner": "@James Foster",
        "completion": "Created coaching tasks, posted cited examples, and scheduled reviews."
      }
    ]
  },
  {
    "id": "ledger",
    "name": "Ledger & Co.",
    "industry": "Accounting",
    "pods": [
      "Close",
      "Payables",
      "Advisory"
    ],
    "scenarios": [
      {
        "number": 1,
        "title": "Month-End Command",
        "prompt": "What will stop us closing by Friday?",
        "result": "Creates a close checklist with dependencies, owners, and current evidence.",
        "integrations": [
          "NetSuite",
          "Microsoft Excel",
          "Google Sheets",
          "Asana"
        ],
        "owner": "@Amelia Ross",
        "completion": "Updated the close checklist, assigned blockers, and posted the completion status."
      },
      {
        "number": 2,
        "title": "Invoice Chase",
        "prompt": "Draft the overdue invoice follow-ups that need approval.",
        "result": "Reconciles account context and returns tailored email drafts with amounts.",
        "integrations": [
          "Gmail",
          "Outlook",
          "Stripe",
          "HubSpot"
        ],
        "owner": "@Amelia Ross",
        "completion": "Generated overdue-payment drafts, routed approvals, and wrote collection activity to HubSpot."
      },
      {
        "number": 3,
        "title": "Cash Forecast",
        "prompt": "Show the 13-week cash outlook and major sensitivities.",
        "result": "Produces a forecast chart, scenario controls, and source table.",
        "integrations": [
          "BigQuery",
          "Snowflake",
          "Power BI",
          "Microsoft Excel"
        ],
        "owner": "@Jon Bell",
        "completion": "Published the 13-week forecast and created sensitivity actions for the finance owners."
      },
      {
        "number": 4,
        "title": "Expense Anomaly",
        "prompt": "Find unusual expenses before reimbursement.",
        "result": "Runs exact analysis and returns an exception table with policy context.",
        "integrations": [
          "Databricks",
          "Hex",
          "Google Sheets",
          "Slack"
        ],
        "owner": "@Amelia Ross",
        "completion": "Flagged expense exceptions, created review tasks, and posted the receipt to Slack."
      },
      {
        "number": 5,
        "title": "Cloud Cost Allocation",
        "prompt": "Allocate cloud and AI spend to teams and explain the variance.",
        "result": "Builds a chargeback dashboard and tagged owner review list.",
        "integrations": [
          "Costory",
          "NetSuite",
          "Power BI",
          "Microsoft Teams"
        ],
        "owner": "@Amelia Ross",
        "completion": "Published the chargeback dashboard, updated allocations, and assigned owners in Teams."
      },
      {
        "number": 6,
        "title": "Audit Evidence Binder",
        "prompt": "Assemble the evidence requested by the auditors.",
        "result": "Creates a complete binder index, missing-item list, and signed cover sheet.",
        "integrations": [
          "Google Drive",
          "Microsoft OneDrive",
          "Vanta",
          "Youtrust"
        ],
        "owner": "@Jon Bell",
        "completion": "Assembled the audit binder, created the Youtrust cover-signature request, and stored it in Drive."
      },
      {
        "number": 7,
        "title": "Board Reporting",
        "prompt": "Turn the final numbers into the board finance pack.",
        "result": "Generates a narrative deck, financial charts, and PDF export preview.",
        "integrations": [
          "Gamma",
          "Canva",
          "Power BI",
          "Google Drive"
        ],
        "owner": "@Amelia Ross",
        "completion": "Generated the board deck and PDF, saved both, and drafted the leadership email."
      },
      {
        "number": 8,
        "title": "Duplicate AP Detection",
        "prompt": "Find duplicate payables before this week’s payment run.",
        "result": "Returns matched exceptions, confidence, and task assignments.",
        "integrations": [
          "NetSuite",
          "Supabase",
          "Microsoft Excel",
          "Monday.com"
        ],
        "owner": "@Amelia Ross",
        "completion": "Flagged duplicate payables, created hold and review tasks, and updated the exception sheet."
      },
      {
        "number": 9,
        "title": "Revenue Reconciliation",
        "prompt": "Reconcile store revenue to cash received.",
        "result": "Produces an exact variance table and highlights unresolved transactions.",
        "integrations": [
          "Stripe",
          "Shopify",
          "BigQuery",
          "Google Sheets"
        ],
        "owner": "@Jon Bell",
        "completion": "Reconciled revenue lines, updated the workbook, and assigned unresolved exceptions."
      },
      {
        "number": 10,
        "title": "Finance Policy Q&A",
        "prompt": "What is the approved treatment for prepaid implementation fees?",
        "result": "Returns a short cited answer with authoritative policy references.",
        "integrations": [
          "Guru",
          "Slab",
          "Notion",
          "Confluence"
        ],
        "owner": "@Amelia Ross",
        "completion": "Delivered the cited policy decision and recorded it in the knowledge base."
      }
    ]
  }
] as RawWorkspace[];

const verifiedIntegrationSet = new Set<string>(verifiedIntegrations);

const artifactLabels: Record<ArtifactKind, [string, string, string]> = {
  map: ['Active loads', 'Reassigned', 'Traffic clear'],
  dashboard: ['Signals', 'Resolved', 'On track'],
  chart: ['Current', 'Target', 'Variance'],
  table: ['Records', 'Updated', 'Exceptions'],
  timeline: ['Steps', 'Completed', 'Elapsed'],
  calendar: ['Slots', 'Confirmed', 'Conflicts'],
  document: ['Pages', 'Sources', 'Ready'],
  slides: ['Slides', 'Sources', 'Export'],
  record: ['Fields', 'Updated', 'Owner'],
};

const artifactIcons: Record<ArtifactKind, string> = {
  map: 'fa-solid fa-route',
  dashboard: 'fa-solid fa-gauge-high',
  chart: 'fa-solid fa-chart-column',
  table: 'fa-solid fa-table-cells',
  timeline: 'fa-solid fa-timeline',
  calendar: 'fa-solid fa-calendar-check',
  document: 'fa-solid fa-file-lines',
  slides: 'fa-solid fa-display',
  record: 'fa-solid fa-clipboard-check',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function stableNumber(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function capitalizeStart(value: string) {
  return value.replace(/^(\s*)([a-z])/, (_, space: string, character: string) => `${space}${character.toUpperCase()}`);
}

function inferArtifactKind(title: string, result: string): ArtifactKind {
  const copy = `${title} ${result}`.toLowerCase();
  if (title === 'SLA Risk Command') return 'map';
  if (/deck|slide/.test(copy)) return 'slides';
  if (/calendar|schedule|book|slot|staff|allocation/.test(copy)) return 'calendar';
  if (/timeline|chronology|incident|command-center/.test(copy)) return 'timeline';
  if (/chart|funnel|waterfall|cohort|forecast|graph|variance/.test(copy)) return 'chart';
  if (/table|workbook|spreadsheet|lineage|reconcil|compare|audit/.test(copy)) return 'table';
  if (/pdf|memo|report|brief|packet|digest|policy|document/.test(copy)) return 'document';
  if (/frame|dashboard|board|watch|command/.test(copy)) return 'dashboard';
  return 'record';
}

function splitCompletion(completion: string, owner: string): [string, string, string] {
  const cleaned = completion.replace(/\.$/, '');
  const pieces = cleaned
    .split(/, and |, | and (?=(?:created|updated|posted|sent|assigned|opened|saved|stored|published|generated|scheduled|notified|drafted|linked|tagged|wrote|filled|reassigned|flagged|delivered|recorded))/i)
    .map((piece) => capitalizeStart(piece.trim()))
    .filter(Boolean);

  while (pieces.length < 3) {
    pieces.push(
      pieces.length === 1
        ? 'Verified the supporting evidence across every connected system'
        : `Confirmed final ownership with ${owner}`,
    );
  }

  return [pieces[0], pieces[1], pieces.slice(2).join(', ')];
}

function interactionFor(variant: string, title: string) {
  if (variant.includes('heatmap')) return 'Select a capacity cell';
  if (variant.includes('map')) return 'Compare the live routes';
  if (/(timeline|chronology|journey|flow|schedule|calendar|cadence|onboarding|critical-path|dependency)/.test(variant)) return 'Open any completed step';
  if (/(chart|waterfall|forecast|pareto|scatter|treemap|heatmap|dashboard)/.test(variant)) return 'Change the comparison';
  if (/(diff|compare|comparison|matrix|scorecard|review|match)/.test(variant)) return 'Filter the evidence';
  if (/(slides|deck|report|brief|memo|binder|packet|policy)/.test(variant)) return 'Open another page';
  return `Inspect the finished ${title.toLowerCase()} work`;
}

function createArtifact(raw: RawScenario, owner: string, blueprint: ScenarioBlueprint): ArtifactSpec {
  const kind = inferArtifactKind(raw.title, raw.result);
  const [title, variant] = blueprint;
  const seed = stableNumber(`${raw.title}${raw.result}`);
  const labels = artifactLabels[kind];
  const receipts = splitCompletion(raw.completion, owner);
  const count = 8 + (seed % 47);
  const completed = Math.max(3, Math.round(count * (0.62 + (seed % 19) / 100)));
  const percent = Math.min(99, 82 + (seed % 17));

  return {
    kind,
    title,
    variant,
    interaction: interactionFor(variant, title),
    metrics: [
      { label: labels[0], value: String(count), tone: 'neutral' },
      { label: labels[1], value: String(completed), tone: 'positive' },
      { label: labels[2], value: kind === 'timeline' ? `${12 + (seed % 18)} sec` : `${percent}%`, tone: seed % 3 === 0 ? 'warning' : 'positive' },
    ],
    rows: receipts.map((receipt, index) => ({
      label: receipt,
      value: index === 2 ? owner : raw.integrations[index % raw.integrations.length],
      status: index === 2 ? 'Owner tagged' : 'Completed',
    })),
    series: [38, 52, 46, 67, 61, 78, percent],
  };
}

const textFirstTitles = new Set([
  'Stop risky refunds',
  'Build the carrier claim', 'Rescue the Acme account', 'Prepare today’s operations brief',
  'Brief clients on new rules', 'Prepare the board memo',
  'Protect today’s production line',
  'Explain the checkout outage', 'Fix roadmap promises', 'Ship the release package',
  'Get Monday’s crews ready', 'Finish the site meeting follow-up', 'Resolve Tower A’s HVAC complaints',
  'Invite the best customers', 'Turn reviews into product fixes', 'Prepare Monday’s trade brief',
  'Find the best search opportunities', 'Protect delayed products',
  'Answer the urgent referral question', 'Turn the quality meeting into action', 'Fix repeated patient friction',
  'Recover overdue rent', 'Resolve the resident escalation',
  'Make the hiring decision', 'Brief the hiring manager', 'Launch the sourcing campaign',
  'Prepare the renewal meeting', 'Prepare the broker call',
  'Chase overdue invoices', 'Answer the finance policy question',
  'Contain the bad batch', 'Present the electric fleet', 'Prepare the plant report', 'Run the recall response',
  'Recover the Riverside schedule', 'Fix mobile size drop-off',
]);

const deliverablesByTitle: Record<string, Deliverable[]> = {
  'Build the carrier claim': [{ name: 'EG-4821-carrier-claim.pdf', format: 'pdf', description: 'Signed claim packet and evidence index' }],
  'Handle the dock outage': [{ name: 'dock-outage-incident-report.pdf', format: 'pdf', description: 'Incident chronology and customer impact' }],
  'Present the electric fleet': [{ name: 'electric-fleet-launch-update.pdf', format: 'pdf', description: 'Launch brief and depot rollout plan' }],
  'Review the supplier contract': [{ name: 'supplier-contract-redline.docx', format: 'docx', description: 'Clause redline with cited source pages' }],
  'Get Greenline’s agreement signed': [{ name: 'greenline-nda.pdf', format: 'pdf', description: 'Signature-ready Greenline NDA' }],
  'Rebuild the Dawson timeline': [
    { name: 'dawson-chronology.xlsx', format: 'xlsx', description: 'Dated matter chronology' },
    { name: 'dawson-evidence.pdf', format: 'pdf', description: 'Cited supporting evidence' },
  ],
  'Brief clients on new rules': [{ name: 'fintech-regulatory-digest.pdf', format: 'pdf', description: 'Client-ready regulatory digest' }],
  'Prepare the board memo': [{ name: 'board-privacy-memo.pdf', format: 'pdf', description: 'Board-ready privacy memo' }],
  'Trace every affected order': [{ name: 'lot-9A-traceability.xlsx', format: 'xlsx', description: 'Lot-to-customer traceability workbook' }],
  'Renew missing certificates': [{ name: 'supplier-certificate-renewals.xlsx', format: 'xlsx', description: 'Certificate renewal tracker' }],
  'Cut plant energy waste': [{ name: 'plant-b-energy-review.pdf', format: 'pdf', description: 'Energy variance and savings actions' }],
  'Prepare the plant report': [{ name: 'weekly-plant-report.pdf', format: 'pdf', description: 'Weekly production and quality report' }],
};

const reactionSets = [
  ['✅', '👏', '🎯'], ['👍', '👀', '📌'], ['🔥', '🙌', '✅'], ['💡', '🎉', '👏'],
];

function createEngagement(title: string, participantIds: PersonId[], scenarioIndex: number, workspaceId: string): ScenarioEngagement {
  const seed = stableNumber(`${workspaceId}-${scenarioIndex}-${title}`);
  const reactions = reactionSets[seed % reactionSets.length];
  const replyCount = (stableNumber(workspaceId) + scenarioIndex) % 6;
  const responderCount = replyCount === 0 ? 0 : Math.min(participantIds.length, 1 + (seed % 3));
  const rotated = participantIds.map((_, index) => participantIds[(index + seed) % participantIds.length]);
  const counts = reactions.map((emoji, index) => ({
    emoji,
    count: 1 + ((seed * (index + 3) + Math.floor(seed / (index + 2))) % 9),
  }));
  return {
    slackReactions: counts,
    teamsUserReactions: counts.slice(0, 2).map(({ emoji, count }) => ({ emoji, count: Math.max(1, count - 2) })),
    teamsRubyReactions: [...counts].reverse(),
    replyCount,
    responderIds: rotated.slice(0, responderCount),
    lastReplyLabel: ['Just now', '2 min ago', '8 min ago', 'Today at 10:14 AM'][seed % 4],
  };
}

const properTitleWords = new Map([
  ['acme', 'Acme'], ['greenline’s', 'Greenline’s'], ['dawson', 'Dawson'], ['orion', 'Orion'],
  ['delta', 'Delta'], ['monday’s', 'Monday’s'], ['saturday’s', 'Saturday’s'],
  ['riverside', 'Riverside'], ['tower', 'Tower'], ['a’s', 'A’s'], ['hvac', 'HVAC'],
]);

const textFirstHeadings: Record<string, string> = {
  'Stop risky refunds': 'Manual refund review',
  'Contain the bad batch': 'Containment decision',
  'Build the carrier claim': 'Evidence packet', 'Rescue the Acme account': 'Account recovery',
  'Prepare today’s operations brief': 'Today’s priorities', 'Brief clients on new rules': 'Client impact',
  'Prepare the board memo': 'Decision memo', 'Renew missing certificates': 'Renewal checklist',
  'Protect today’s production line': 'Production risks', 'Explain the checkout outage': 'What caused the outage',
  'Fix roadmap promises': 'Commitments to resolve', 'Ship the release package': 'Release checklist',
  'Get Monday’s crews ready': 'Crew blockers', 'Finish the site meeting follow-up': 'Decisions and owners',
  'Resolve Tower A’s HVAC complaints': 'Resident impact', 'Invite the best customers': 'Guest plan',
  'Turn reviews into product fixes': 'Ranked product changes', 'Prepare Monday’s trade brief': 'Monday’s decisions',
  'Find the best search opportunities': 'Search priorities', 'Protect delayed products': 'Products at risk',
  'Answer the urgent referral question': 'Policy answer', 'Turn the quality meeting into action': 'Decisions and owners',
  'Fix repeated patient friction': 'What patients keep reporting', 'Recover overdue rent': 'Accounts and outreach',
  'Resolve the resident escalation': 'Case resolution', 'Make the hiring decision': 'Decision evidence',
  'Brief the hiring manager': 'Candidate brief', 'Launch the sourcing campaign': 'Outreach plan',
  'Prepare the renewal meeting': 'Meeting brief', 'Prepare the broker call': 'Call brief',
  'Chase overdue invoices': 'Drafts awaiting approval', 'Answer the finance policy question': 'Policy answer',
  'Present the electric fleet': 'Launch readiness', 'Run the recall response': 'Recall command plan',
  'Prepare the plant report': 'Executive summary',
  'Recover the Riverside schedule': 'Recovered critical path',
  'Fix mobile size drop-off': 'What broke mobile activation',
};

const closingLabels = [
  'Next checkpoint owner:', 'Recovery follow-through:', 'Evidence review:', 'Decision owner:', 'Response owner:',
  'Customer follow-through:', 'Capacity owner:', 'Briefing owner:', 'Launch follow-through:', 'Share approval:',
];

function plainLanguage(value: string) {
  return value
    .replace(/\bSLA\b/g, 'delivery deadline')
    .replace(/\bQBR\b/g, 'quarterly review')
    .replace(/\bRFI\b/g, 'information request')
    .replace(/\bFinOps\b/g, 'cost-control')
    .replace(/\bcohort\b/gi, 'customer group')
    .replace(/\bCRM\b/g, 'customer record')
    .replace(/\bSKU\b/g, 'product')
    .replace(/\bQA\b/g, 'quality')
    .replace(/\bATS\b/g, 'hiring system')
    .replace(/\bFrame\b/g, 'interactive view');
}

function sentenceCaseTitle(value: string) {
  const words = value.split(/\s+/).map((word) => {
    const lower = word.toLocaleLowerCase('en-US');
    return properTitleWords.get(lower) ?? lower;
  });
  words[0] = words[0].charAt(0).toLocaleUpperCase('en-US') + words[0].slice(1);
  return words.join(' ').replace(/Delta freight/g, 'Delta Freight');
}

function ensureSentence(value: string) {
  const clean = capitalizeStart(plainLanguage(value).replace(/—/g, ':').trim().replace(/[.]+$/, ''));
  return `${clean}.`;
}

const resultOpeners: Record<string, string> = {
  Builds: 'The finished work includes', Clusters: 'The analysis groups', Combines: 'The result combines',
  Compares: 'The comparison covers', Converts: 'The finished response turns', Correlates: 'The analysis connects',
  Creates: 'The finished work includes', Deduplicates: 'The review removes duplicates from', Displays: 'The finished view shows',
  Extracts: 'The brief pulls out', Finds: 'The review identifies', Flags: 'The exception review flags',
  Forecasts: 'The forecast models', Generates: 'The completed package includes', Identifies: 'The review identifies',
  Joins: 'The analysis joins', Links: 'The finished record links', Locates: 'The review locates',
  Merges: 'The final view merges', Normalizes: 'The cleaned result normalizes', Produces: 'The result includes',
  Proposes: 'The recovered plan includes', Queries: 'The analysis queries', Reconciles: 'The reconciliation matches',
  Returns: 'The review presents', Routes: 'The finished workflow routes', Runs: 'The completed review runs',
  Scores: 'The scorecard ranks', Segments: 'The analysis groups', Shows: 'The finished view shows',
  Synthesizes: 'The brief combines',
};

function resultNarrative(value: string) {
  const match = value.match(/^([A-Za-z]+)\s+(.+)$/);
  if (!match) return `The result captures ${value.charAt(0).toLocaleLowerCase('en-US')}${value.slice(1)}`;
  return `${resultOpeners[match[1]] ?? 'The result includes'} ${match[2]}`;
}

function inlineRuns(value: string, integrations: IntegrationId[], owner: string): InlineRun[] {
  const ownerName = owner.replace(/^@/, '');
  const candidates = [...integrations, owner].sort((left, right) => right.length - left.length);
  const pattern = new RegExp(`(${candidates.map((candidate) => candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const runs = value.split(pattern).filter(Boolean).map((part): InlineRun => {
    if (part === owner) return { kind: 'mention', personId: slugPerson(ownerName) };
    if (integrations.includes(part as IntegrationId)) return { kind: 'integration', id: part as IntegrationId };
    return { kind: 'text', text: part };
  });
  const last = runs.at(-1);
  const previous = runs.at(-2);
  if (last?.kind === 'text' && /^\s*\.\s*$/.test(last.text) && previous && previous.kind !== 'text') runs.pop();
  return runs;
}

function createIntegrationSteps(displayTitle: string, integrations: IntegrationId[], receipts: [string, string, string]): IntegrationStep[] {
  const topic = displayTitle.split(/\s+/).slice(-3).join(' ');
  const labels = integrations.map((integration, index) => {
    const source = index < receipts.length
      ? receipts[index]
      : index === integrations.length - 1
        ? `Shared ${topic} result`
        : `Verified ${topic} evidence`;
    const withoutMentions = source.replace(/@[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g, 'owner');
    const words = capitalizeStart(withoutMentions.replace(/[^A-Za-z0-9’'-]+/g, ' ').trim()).split(/\s+/).filter(Boolean).slice(0, 7);
    if (words.length < 2) words.push(integration.split(/\s+/)[0]);
    return words.join(' ');
  });
  const used = new Set<string>();
  return labels.map((label, index) => {
    let unique = label;
    if (used.has(unique)) unique = `${label.split(/\s+/).slice(0, 6).join(' ')} ${index + 1}`;
    used.add(unique);
    return { integrationId: integrations[index], label: unique };
  });
}

function reviewedTextResponse(displayTitle: string, integrations: IntegrationId[], owner: string): ConversationBlock[] | undefined {
  const paragraph = (tone: 'opening' | 'normal' | 'completion', text: string): ConversationBlock => ({ kind: 'paragraph', tone, content: inlineRuns(text, integrations, owner) });
  const heading = (text: string): ConversationBlock => ({ kind: 'heading', content: inlineRuns(text, integrations, owner) });
  const items = (kind: 'bullets' | 'checklist', values: string[]): ConversationBlock => ({ kind, items: values.map((value) => inlineRuns(value, integrations, owner)) });
  const table = (columns: string[], values: string[]): ConversationBlock => ({ kind: 'table', columns, rows: values.map((value) => inlineRuns(value, integrations, owner)) });

  if (displayTitle === 'Contain the bad batch') return [
    paragraph('opening', 'Batch M-184 is contained. The protein variance traces to a 22-minute temperature drift on Line 2.'),
    paragraph('normal', 'ServiceNow evidence and Google Sheets quality readings limit exposure to two packaging runs and 38 customer orders.'),
    heading('Containment decision'),
    table(['Affected material', 'Action'], ['M-184 and M-185 | Hold at Meadow West', 'PK-771 and PK-772 | Block customer release', '38 customer orders | Notify service owners']),
    items('checklist', ['Paused Line 2 and preserved the quality samples.', 'Assigned the seal inspection in Jira.', 'Posted the affected-lot list to Slack.']),
    paragraph('completion', `Containment owner: ${owner}.`),
  ];
  if (displayTitle === 'Present the electric fleet') return [
    paragraph('opening', 'The zero-emission fleet launch update is complete and ready for leadership review.'),
    paragraph('normal', 'Gamma and Google Drive now contain the approved rollout story, depot readiness, and measurable CO2 impact.'),
    heading('Launch readiness'),
    table(['Measure', 'Launch position'], ['Electric tractors | 24 ready', 'Annual CO2 reduction | 1,840 tonnes', 'First depot | Cicero on October 14']),
    items('checklist', ['Charging installation is complete at Cicero.', 'Driver certification is 92% complete.', 'Elmhurst launches after the winter range test.']),
    paragraph('completion', `Share approval: ${owner}.`),
  ];
  if (displayTitle === 'Run the recall response') return [
    paragraph('opening', 'The packaging recall is contained to lots PK-771 and PK-772 with no confirmed consumer harm.'),
    paragraph('normal', 'Jira now holds the accountable response plan while Gmail and Outlook contain the regulator and customer notices.'),
    heading('Recall command plan'),
    table(['Deadline', 'Owner action'], ['10:30 AM | Freeze affected inventory', '11:15 AM | Send regulator notice', '12:00 PM | Release customer guidance']),
    items('checklist', ['Blocked 38 affected orders.', 'Prepared the regulator notice and customer FAQ.', 'Assigned trace reconciliation to the quality team.']),
    paragraph('completion', `Recall commander: ${owner}.`),
  ];
  if (displayTitle === 'Prepare the plant report') return [
    paragraph('opening', 'This week’s plant report is complete with the production, quality, and cost decisions leadership needs.'),
    paragraph('normal', 'Google Meet notes and Microsoft Excel results are reconciled into one concise operating narrative.'),
    heading('Executive summary'),
    table(['Measure', 'Result'], ['Production attainment | 96.4%', 'First-pass quality | 98.7%', 'Energy cost | 3.2% above plan']),
    heading('Next week'),
    items('bullets', ['Protect Tuesday’s Line 2 sanitation window.', 'Close the two remaining supplier certificate renewals.', 'Move the evening refrigeration test to off-peak hours.']),
    paragraph('completion', `Report approval: ${owner}.`),
  ];
  if (displayTitle === 'Renew missing certificates') return [
    paragraph('opening', 'Renew missing certificates: Created supplier renewal tasks.'),
    paragraph('normal', 'The review presents the completed outreach evidence and the three supplier certificates that still require action.'),
    heading('Renewal checklist'),
    table(['Completed work', 'System'], ['Sent certificate requests | Microsoft OneDrive', 'Updated the approved-supplier evidence page | Notion']),
    paragraph('completion', `Response owner: ${owner}.`),
  ];
  if (displayTitle === 'Stop risky refunds') return [
    paragraph('opening', 'Reviewed 24 refund requests. Three requests totaling $1,740 need manual review before a refund decision.'),
    paragraph('normal', 'Stripe payment records, Supabase case history, and the Confluence refund policy identify evidence gaps, not confirmed fraud.'),
    heading('Manual refund review'),
    table(['Request / Amount', 'Evidence', 'Next action'], [
      'RF-2041 · $780 | Three refund claims across linked checkout accounts. Stripe CH-7241 and case log §2. | Iris Chen to compare order and return evidence.',
      'RF-2048 · $540 | Delivered parcel has a signed proof of delivery, but the customer reports non-receipt. Delivery record POD-848. | Contact the customer and verify the delivery address.',
      'RF-2053 · $420 | Return parcel weight does not match the dispatched item. Warehouse record RT-953. | Inspect the returned parcel before deciding.',
    ]),
    heading('Approved and completed'),
    paragraph('normal', '21 requests totaling $3,860 were auto-approved: 12 verified returns, 6 duplicate charges, and 3 cancellations before dispatch. Each matched the approved policy conditions.'),
    items('checklist', ['Created three manual-review tasks with the supporting evidence.', 'Held only the flagged refund decisions pending review.', 'Recorded the approved requests and reviewer handoff in Supabase.']),
    paragraph('completion', `Review owner: ${owner}.`),
  ];
  if (displayTitle === 'Recover the Riverside schedule') return [
    paragraph('opening', 'The Riverside schedule has recovered fourteen days without moving the owner handover.'),
    paragraph('normal', 'Monday.com and Asana now reflect the resequenced concrete, envelope, and commissioning work.'),
    heading('Recovered critical path'),
    table(['Milestone', 'Before', 'Recovered'], ['Tower concrete complete | Oct 28 | Oct 21', 'Envelope watertight | Nov 18 | Nov 11', 'Owner handover | Dec 12 | Dec 12']),
    items('checklist', ['Moved the east-core crew to the critical pour.', 'Protected the façade inspection window.', 'Published the revised Teams shift plan.']),
    paragraph('normal', 'Next decision: Approve the Friday glazing alternate so the recovered envelope date remains protected.'),
    paragraph('completion', `Schedule owner: ${owner}.`),
  ];
  if (displayTitle === 'Fix mobile size drop-off') return [
    paragraph('opening', 'Release v4.7.2 caused the mobile size selector to collide with the checkout drawer at 320px.'),
    paragraph('normal', 'Contentsquare replays and Amplitude events show a 38% activation drop and an estimated $146k in monthly revenue exposure.'),
    heading('What broke mobile activation'),
    table(['Evidence', 'Finding'], ['Viewport | 320px Android and iPhone SE', 'Missing event | size_selected', 'Failure point | Sticky checkout drawer']),
    items('checklist', ['Moved the size selector above the sticky drawer.', 'Restored the size_selected event in Shopify.', 'Validated recovery against the EU baseline in BigQuery.']),
    paragraph('completion', `Validation owner: ${owner}.`),
  ];
  return undefined;
}

function createScenarioCopy(raw: RawScenario, displayTitle: string, integrations: IntegrationId[], receipts: [string, string, string], index: number, isFleetHero: boolean): ScenarioCopy {
  const presentation = textFirstTitles.has(displayTitle) ? 'text' : 'artifact';
  const openingAction = receipts[0];
  const cartlyNarratives: Record<string, [string, string]> = {
    'Recover high-value carts': ['Start with personal reminders for loyal customers and reserve incentives for price-sensitive carts.', 'The model compares recoverable revenue against incentive cost. Adjust the minimum value and offer to see which segments are worth pursuing.'],
    'Clear the support backlog': ['Four urgent cases remain after four duplicate threads were merged. Every case has an owner, and two replies are ready.', 'The missing tote and duplicate-charge cases are closest to their service deadline. Their evidence and proposed responses are ready for review.'],
    'Stop wasted campaign spend': ['Pause Summer linen prospecting and Denim video discovery before noon. Their returns are below the agreed ROAS thresholds.', 'Together, those campaigns expose $1,450 of remaining budget. Brand search and returning-customer retargeting are above target.'],
    'Track competitor price changes': ['The largest competitive move is Northfield’s denim reduction from $98 to $89, down 9.2% since yesterday.', 'Compare matched products including shipping and stock availability. The recommended response protects margin before matching a competitor’s headline price.'],
    'Find the customers we’re losing': ['June’s eight-week repeat-purchase rate fell to 23%, compared with 32% for May.', 'The decline is concentrated in paid-social mobile buyers and denim customers waiting on exchanges. The cohort curves and segment evidence explain where to act.'],
    'Run the creator event': ['The Brooklyn creator event has 92 confirmations against 120 seats. The current model projects 94 attendees.', 'Prioritize local confirmations, keep the 14-person waitlist ready, and close the two outstanding demo samples before September 12.'],
    'Prepare the commerce review': ['Q2 revenue reached $1.84M, up 12.2%, while contribution margin and repeat purchase weakened.', 'Leadership needs to decide on freight consolidation, a focused acquisition test, and faster denim exchanges. The review separates growth, margin, and retention evidence.'],
  };
  const opening = ensureSentence(cartlyNarratives[displayTitle]?.[0] ?? `${displayTitle}: ${openingAction}`);
  const explanation = ensureSentence(cartlyNarratives[displayTitle]?.[1] ?? resultNarrative(raw.result));
  const ownerLine = ensureSentence(`${closingLabels[index]} ${raw.owner}`);
  const receiptWithSystem = (receipt: string, receiptIndex: number) => {
    const integration = integrations[receiptIndex % integrations.length];
    return integrations.some((candidate) => receipt.includes(candidate)) ? ensureSentence(receipt) : ensureSentence(`${receipt} in ${integration}`);
  };
  const sharedBlocks: ConversationBlock[] = [
    { kind: 'paragraph', tone: 'opening', content: inlineRuns(opening, integrations, raw.owner) },
    { kind: 'paragraph', tone: 'normal', content: inlineRuns(explanation, integrations, raw.owner) },
  ];

  const detailBlocks: ConversationBlock[] = presentation === 'text'
    ? index % 3 === 1
      ? [
          { kind: 'heading', content: inlineRuns(textFirstHeadings[displayTitle], integrations, raw.owner) },
          { kind: 'table', columns: ['Completed work', 'System'], rows: receipts.slice(1).map((receipt, receiptIndex) => inlineRuns(`${receipt} | ${integrations[(receiptIndex + 1) % integrations.length]}`, integrations, raw.owner)) },
        ]
      : [
          { kind: 'heading', content: inlineRuns(textFirstHeadings[displayTitle], integrations, raw.owner) },
          { kind: index % 3 === 0 ? 'checklist' : 'bullets', items: receipts.slice(1).map((receipt, receiptIndex) => inlineRuns(receiptWithSystem(receipt, receiptIndex + 1), integrations, raw.owner)) },
        ]
    : [];

  return {
    conversationTitle: displayTitle,
    userPrompt: isFleetHero
      ? 'Find every load that will miss today’s delivery promise, reroute it around traffic, assign capacity, and notify the owners before cutoff.'
      : plainLanguage(raw.prompt),
    presentation,
    response: reviewedTextResponse(displayTitle, integrations, raw.owner) ?? [
      ...sharedBlocks,
      ...detailBlocks,
      { kind: 'paragraph', tone: 'completion', content: inlineRuns(ownerLine, integrations, raw.owner) },
    ],
  };
}

export const scenarioLibrary: Record<string, ScenarioWorkspace> = Object.fromEntries(
  rawWorkspaces.map((workspace) => {
    const scenarios = workspace.scenarios.map((raw, index): DemoScenario => {
      const integrations = raw.integrations.filter(
        (integration): integration is IntegrationId => verifiedIntegrationSet.has(integration),
      );
      const blueprint = scenarioBlueprints[workspace.id][index];
      const displayTitle = sentenceCaseTitle(blueprint[0]);
      const displayBlueprint = [displayTitle, blueprint[1]] as const;
      const channel = slugify(blueprint[0]);
      const id = `${workspace.id}-${slugify(raw.title)}`;
      const rebuild = rebuiltScenarioContent[id];
      const receipts = rebuild?.actions ?? splitCompletion(raw.completion, raw.owner);
      const artifact = createArtifact(raw, raw.owner, displayBlueprint);
      if (rebuild) artifact.kind = rebuild.kind;
      const isFleetHero = workspace.id === 'everglade' && raw.number === 1;
      const ownerId = slugPerson(raw.owner.replace(/^@/, ''));
      const participantIds = workspaceParticipants[workspace.id] ?? [ownerId];
      const engagement = createEngagement(raw.title, participantIds, index, workspace.id);
      const deliverables = deliverablesByTitle[displayTitle] ?? [];
      const presentation = createScenarioCopy(raw, displayTitle, integrations, receipts, index, isFleetHero);
      if (rebuild) {
        if (rebuild.prompt) presentation.userPrompt = rebuild.prompt;
        presentation.response = [
          {kind:'paragraph',tone:'opening',content:inlineRuns(rebuild.summary,integrations,raw.owner)},
          {kind:'paragraph',tone:'normal',content:inlineRuns(rebuild.explanation,integrations,raw.owner)},
          {kind:'paragraph',tone:'normal',content:inlineRuns(rebuild.intro,integrations,raw.owner)},
          {kind:'paragraph',tone:'completion',content:inlineRuns(`Next review owner: ${raw.owner}`,integrations,raw.owner)},
        ];
      }
      const integrationSteps = createIntegrationSteps(displayTitle, integrations, receipts);

      return {
        id,
        title: raw.title,
        channel,
        teamsGroup: displayTitle,
        artifactId: id,
        copy: presentation,
        integrations,
        integrationSteps,
        owner: raw.owner,
        ownerId,
        participantIds,
        engagement,
        deliverables,
        artifactBehavior: presentation.presentation === 'text'
          ? 'none'
          : id === 'everglade-missed-pickup-recovery'
            ? 'static-complete'
            : 'interactive',
        duration: 12 + (stableNumber(raw.title) % 18),
        receipts,
        headerIcon: artifactIcons[artifact.kind],
        artifact,
      };
    });

    return [workspace.id, { ...workspace, scenarios }];
  }),
);

export function getCompanyScenarios(companyId: string): DemoScenario[] {
  return scenarioLibrary[companyId]?.scenarios ?? [];
}

export function getScenario(companyId: string, scenarioId: string): DemoScenario | undefined {
  return getCompanyScenarios(companyId).find((scenario) => scenario.id === scenarioId);
}
