import type {
  ArtifactRow,
  ConversationBlock,
  DemoScenario,
  IntegrationId,
} from "../../upstream/app/demo-scenarios";

export type RemainingIndustryIndicator = {
  className: "is-schedule" | "is-alert";
  iconClass: string;
  label: string;
};

type RemainingIndustrySpec = {
  title: string;
  prompt: string;
  opening: string;
  detail: string;
  heading: string;
  columns: string[];
  rows: ArtifactRow[];
  checklist: string[];
  integrations: IntegrationId[];
  actions: string[];
  receipts: [string, string, string];
  owner: string;
  ownerId: string;
  terms: string[];
  deliverables?: DemoScenario["deliverables"];
  presentation?: DemoScenario["copy"]["presentation"];
  variant?: string;
  interaction?: string;
};

const text = (value: string) => ({ kind: "text", text: value }) as const;
const mention = (personId: string) => ({ kind: "mention", personId }) as const;

function paragraph(
  tone: "opening" | "normal" | "completion",
  ...content: ReturnType<typeof text | typeof mention>[]
): ConversationBlock {
  return { kind: "paragraph", tone, content };
}

function heading(value: string): ConversationBlock {
  return { kind: "heading", content: [text(value)] };
}

function table(columns: string[], rows: ArtifactRow[]): ConversationBlock {
  return {
    kind: "table",
    columns,
    rows: rows.map((row) => [
      text(`${row.label} | ${row.value} | ${row.status}`),
    ]),
  };
}

function checklist(items: string[]): ConversationBlock {
  return { kind: "checklist", items: items.map((item) => [text(item)]) };
}

function responseFor(spec: RemainingIndustrySpec): ConversationBlock[] {
  return [
    paragraph("opening", text(spec.opening)),
    paragraph("normal", text(spec.detail)),
    heading(spec.heading),
    table(spec.columns, spec.rows),
    checklist(spec.checklist),
    paragraph(
      "completion",
      text(`${spec.owner}: `),
      mention(spec.ownerId),
      text(".")
    ),
  ];
}

function applySpec(
  scenario: DemoScenario,
  spec: RemainingIndustrySpec
): DemoScenario {
  const presentation = spec.presentation ?? scenario.copy.presentation;
  return {
    ...scenario,
    channel: slug(spec.title),
    teamsGroup: spec.title,
    integrations: spec.integrations,
    integrationSteps: spec.integrations.map((integrationId, index) => ({
      integrationId,
      label: spec.actions[index] ?? `Recorded work in ${integrationId}`,
    })),
    receipts: spec.receipts,
    owner: `@${spec.owner}`,
    ownerId: spec.ownerId,
    copy: {
      ...scenario.copy,
      conversationTitle: spec.title,
      userPrompt: spec.prompt,
      presentation,
      response: responseFor(spec),
    },
    deliverables: spec.deliverables ?? scenario.deliverables,
    artifact: {
      ...scenario.artifact,
      title: spec.title,
      variant: spec.variant ?? scenario.artifact.variant,
      interaction: spec.interaction ?? scenario.artifact.interaction,
      rows: spec.rows,
    },
  };
}

function slug(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/[’']/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

const specs: Record<string, RemainingIndustrySpec> = {
  "stonebridge-schedule-recovery": {
    title: "Recover the days lost to rain",
    prompt:
      "Replan the Riverside project after three rain days and recover as much time as possible.",
    opening:
      "The revised Riverside schedule is published. Two rain days are recovered and one day remains lost.",
    detail:
      "Indoor work moves forward while the ground dries, and subcontractor dates are confirmed against the revised sequence.",
    heading: "Recovered schedule",
    columns: ["Milestone", "Updated date", "Status"],
    rows: [
      {
        label: "East-core work",
        value: "Moved ahead of exterior work",
        status: "Replanned",
      },
      {
        label: "Subcontractor dates",
        value: "Confirmed in Outlook",
        status: "Accepted",
      },
      {
        label: "Owner handover",
        value: "Dec 12 remains protected",
        status: "One day at risk",
      },
    ],
    checklist: [
      "Monday.com dependencies updated.",
      "Indoor work added to the revised sequence.",
      "Remaining lost day assigned to Olivia Grant.",
    ],
    integrations: ["Monday.com", "Asana", "Outlook"],
    actions: [
      "Published the revised schedule",
      "Updated critical-path tasks",
      "Confirmed subcontractor dates",
    ],
    receipts: [
      "Reviewed three rain days",
      "Recovered two schedule days",
      "Published the owner handover update",
    ],
    owner: "Olivia Grant",
    ownerId: "olivia-grant",
    terms: ["rain", "schedule", "recovered"],
  },
  "stonebridge-site-safety-brief": {
    title: "Get the site ready for tomorrow’s work",
    prompt:
      "Prepare the Riverside site for tomorrow’s work and route every open safety item to the right contractor.",
    opening:
      "Four site risks have verified closeout photos. The loading area remains closed until the site supervisor approves it.",
    detail:
      "Barriers, walkway clearance, and material cleanup are assigned with contractors, locations, due times, and evidence.",
    heading: "Tomorrow’s site readiness",
    columns: ["Location", "Action", "Status"],
    rows: [
      {
        label: "Loading bay",
        value: "Install edge barrier",
        status: "Awaiting inspection",
      },
      {
        label: "Level 4",
        value: "Clear access route",
        status: "Photo verified",
      },
      {
        label: "South hoist",
        value: "Renew inspection tag",
        status: "Photo verified",
      },
    ],
    checklist: [
      "Four closeout photos attached.",
      "Contractor tasks assigned in Asana.",
      "Loading bay held for supervisor approval.",
    ],
    integrations: ["Asana", "Microsoft OneDrive", "Microsoft Teams"],
    actions: [
      "Assigned site readiness tasks",
      "Saved closeout photos",
      "Notified the site team",
    ],
    receipts: [
      "Reviewed the morning site inspection",
      "Attached four closeout photos",
      "Flagged the loading bay for approval",
    ],
    owner: "Site supervisor",
    ownerId: "olivia-grant",
    terms: ["site", "work", "approval"],
  },
  "stonebridge-subcontractor-readiness": {
    title: "Create an agent for contractor paperwork",
    prompt:
      "Create an agent that checks tomorrow’s contractors for the documents needed before they arrive on site.",
    opening:
      "The contractor-paperwork agent is active. Six contractor packs are ready and two missing documents were requested from the correct firms.",
    detail:
      "The agent reads tomorrow’s schedule, checks the required documents, and leaves unresolved files with the responsible contractor.",
    heading: "Tomorrow’s contractor packs",
    columns: ["Contractor", "Required file", "Status"],
    rows: [
      {
        label: "Atlas Scaffolding",
        value: "Insurance certificate",
        status: "Complete",
      },
      {
        label: "North Core Crew",
        value: "Safety induction list",
        status: "Complete",
      },
      {
        label: "Metro Lift",
        value: "Operator training record",
        status: "Requested",
      },
    ],
    checklist: [
      "Tomorrow’s contractor list checked.",
      "Missing files requested through Outlook.",
      "SharePoint readiness register updated.",
    ],
    integrations: ["Microsoft OneDrive", "Outlook", "Asana"],
    actions: [
      "Read tomorrow’s contractor list",
      "Sent targeted document requests",
      "Updated readiness tasks",
    ],
    receipts: [
      "Checked eight contractor packs",
      "Marked six packs ready",
      "Requested two missing documents",
    ],
    owner: "Project administrator",
    ownerId: "olivia-grant",
    terms: ["agent", "contractor", "paperwork"],
  },
  "stonebridge-cost-overrun-analysis": {
    title: "Resolve the extra concrete charges",
    prompt:
      "Reconcile the extra concrete charges against the approved quantities, deliveries, and drawing changes.",
    opening:
      "The supplier accepted a credit for duplicated delivery charges. The remaining concrete overrun is explained by approved design changes and extra material.",
    detail:
      "Order quantities, delivery tickets, Excel measurements, and approved drawing changes now agree in the project cost record.",
    heading: "Concrete cost decision",
    columns: ["Cost item", "Amount", "Result"],
    rows: [
      {
        label: "Duplicate delivery charge",
        value: "$4,800",
        status: "Supplier credit accepted",
      },
      {
        label: "Approved design changes",
        value: "$41,000",
        status: "Explained",
      },
      { label: "Extra material", value: "$23,800", status: "Recorded" },
    ],
    checklist: [
      "NetSuite purchase orders matched.",
      "Delivery tickets matched to pours.",
      "Approved drawing changes retained as the source.",
    ],
    integrations: ["NetSuite", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Matched concrete orders",
      "Checked delivery quantities",
      "Posted the supplier credit update",
    ],
    receipts: [
      "Matched orders to delivery tickets",
      "Confirmed the duplicate charge",
      "Recorded the accepted credit",
    ],
    owner: "Cost manager",
    ownerId: "olivia-grant",
    terms: ["concrete", "charges", "credit"],
  },
  "stonebridge-crew-allocation": {
    title: "Reschedule crews when site work changes",
    prompt:
      "Move the finishing crews when site work changes and confirm their new rooms and dates.",
    opening:
      "The painters and flooring crew accepted new rooms and dates, and the updated assignments are recorded.",
    detail:
      "Ready rooms were checked against inspection dependencies so no crew was moved into work that was still blocked.",
    heading: "Revised crew plan",
    columns: ["Crew", "New assignment", "Status"],
    rows: [
      {
        label: "North Core Painters",
        value: "East tower, Level 3",
        status: "Accepted",
      },
      { label: "FloorPro", value: "West tower, Level 2", status: "Accepted" },
      {
        label: "Electrical inspection",
        value: "West tower, Level 4",
        status: "Still required",
      },
    ],
    checklist: [
      "Ready rooms checked.",
      "Crew acceptance recorded.",
      "Inspection-dependent room kept blocked.",
    ],
    integrations: ["Monday.com", "Outlook Calendar", "Microsoft Teams"],
    actions: [
      "Updated crew assignments",
      "Moved calendar bookings",
      "Sent the revised room list",
    ],
    receipts: [
      "Checked room readiness",
      "Confirmed two crew moves",
      "Kept one room blocked by inspection",
    ],
    owner: "Site coordinator",
    ownerId: "olivia-grant",
    terms: ["crew", "site", "reschedule"],
  },
  "stonebridge-rfi-decision-pack": {
    title: "Get approval to change the building plans",
    prompt:
      "Prepare the approval package for the pipe and wall conflict in the Riverside building plans.",
    opening:
      "The building-plan change package is submitted with the marked-up drawing, site measurements, proposed correction, and cost impact.",
    detail:
      "The architect has the exact conflict and supporting records needed to approve or reject the change.",
    heading: "Plan change request",
    columns: ["Evidence", "Details", "Status"],
    rows: [
      {
        label: "Drawing conflict",
        value: "Pipe crosses planned wall",
        status: "Marked",
      },
      {
        label: "Site measurement",
        value: "86 mm clearance required",
        status: "Verified",
      },
      {
        label: "Cost impact",
        value: "$6,400 allowance",
        status: "Awaiting approval",
      },
    ],
    checklist: [
      "Marked-up drawing attached.",
      "Measurements linked to the site record.",
      "Decision request sent through Outlook.",
    ],
    integrations: ["Microsoft OneDrive", "Outlook", "Monday.com"],
    actions: [
      "Attached the marked-up drawing",
      "Sent the architect review",
      "Recorded the decision request",
    ],
    receipts: [
      "Located the conflicting plan versions",
      "Verified the site measurement",
      "Submitted the approval package",
    ],
    owner: "Architect",
    ownerId: "olivia-grant",
    terms: ["approval", "building", "plans"],
  },
  "stonebridge-vendor-quote-compare": {
    title: "Compare window pricing and place the order",
    prompt:
      "Compare the approved window prices and place the order that meets the project specification and delivery date.",
    opening:
      "The approved window order is placed with the selected supplier, and the supplier has confirmed delivery for the installation window.",
    detail:
      "The comparison uses the same window specification, installation scope, delivery charge, and warranty for every supplier.",
    heading: "Window pricing",
    columns: ["Supplier", "Comparable price", "Status"],
    rows: [
      {
        label: "North Ridge Windows",
        value: "$186,400 delivered",
        status: "Order placed",
      },
      {
        label: "ClearView Glass",
        value: "$191,850 delivered",
        status: "Comparison",
      },
      {
        label: "Summit Frames",
        value: "$198,200 delivered",
        status: "Comparison",
      },
    ],
    checklist: [
      "Matching window specification checked.",
      "Installation and warranty included.",
      "Delivery acknowledgement saved in NetSuite.",
    ],
    integrations: ["Microsoft Excel", "NetSuite", "Outlook"],
    actions: [
      "Compared delivered window prices",
      "Created the approved order",
      "Sent the supplier confirmation",
    ],
    receipts: [
      "Normalised three window prices",
      "Placed the approved order",
      "Recorded confirmed delivery",
    ],
    owner: "Procurement lead",
    ownerId: "olivia-grant",
    terms: ["window", "pricing", "order"],
  },
  "stonebridge-daily-site-brief": {
    title: "Turn the site meeting into assigned work",
    prompt:
      "Turn today’s site meeting notes into assigned work with owners, dates, and source timestamps.",
    opening:
      "Seven site actions are assigned with due dates, and two decisions are recorded in the project workspace.",
    detail:
      "Each task keeps its Fathom timestamp and links to the drawing, room, or contractor record that explains why it exists.",
    heading: "Site meeting actions",
    columns: ["Action", "Owner and due date", "Status"],
    rows: [
      {
        label: "Clear Level 4 access",
        value: "North Core Crew · Today",
        status: "Assigned",
      },
      {
        label: "Confirm window delivery",
        value: "Procurement · Thursday",
        status: "Assigned",
      },
      {
        label: "Approve doorway detail",
        value: "Architect · Friday",
        status: "Decision recorded",
      },
    ],
    checklist: [
      "Fathom commitments captured.",
      "Asana owners and deadlines added.",
      "Two decisions linked to their source timestamps.",
    ],
    integrations: ["Fathom", "Asana", "Microsoft Teams"],
    actions: [
      "Read the recorded site meeting",
      "Created assigned tasks",
      "Sent the Teams recap",
    ],
    receipts: [
      "Captured seven commitments",
      "Assigned seven site tasks",
      "Linked two decisions to source notes",
    ],
    owner: "Site coordinator",
    ownerId: "olivia-grant",
    terms: ["site", "meeting", "assigned"],
  },
  "stonebridge-client-progress-pack": {
    title: "Send the owner this week’s construction updates",
    prompt:
      "Prepare and send this week’s construction updates with dated photos, completed work, costs, and delays.",
    opening:
      "This week’s construction update is sent to the owner with dated photos, reconciled costs, completed work, and remaining delays.",
    detail:
      "The progress figures match the Riverside schedule and cost register, so the owner can see what changed and why.",
    heading: "Construction updates",
    columns: ["Update", "Evidence", "Status"],
    rows: [
      { label: "Project progress", value: "72% complete", status: "Verified" },
      {
        label: "Approved cost",
        value: "$18.4M forecast",
        status: "Reconciled",
      },
      {
        label: "Remaining decision",
        value: "Glazing alternate",
        status: "Due Friday",
      },
    ],
    checklist: [
      "Site photos dated and attached.",
      "Cost figures reconciled.",
      "Owner email sent through Outlook.",
    ],
    integrations: ["Microsoft Excel", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Reconciled project figures",
      "Saved the owner update",
      "Sent the construction update",
    ],
    receipts: [
      "Prepared the weekly project update",
      "Verified photos and costs",
      "Sent the owner package",
    ],
    owner: "Project director",
    ownerId: "olivia-grant",
    terms: ["owner", "construction", "updates"],
    deliverables: [
      {
        name: "riverside-construction-updates.pdf",
        format: "pdf",
        description:
          "Dated photos, completed work, costs, and schedule updates",
      },
    ],
  },
  "stonebridge-warranty-escalation": {
    title: "Finish the cooling-system repair",
    prompt:
      "Close the Tower A cooling repair after the contractor’s work is checked and the facility accepts the result.",
    opening:
      "The failed control valve is replaced, temperatures are back within the agreed range, and the facilities manager accepts the repair.",
    detail:
      "The repair record, contractor report, post-repair readings, and final acknowledgement are connected in the ServiceNow job.",
    heading: "Repair closeout",
    columns: ["Checkpoint", "Evidence", "Status"],
    rows: [
      { label: "Fault", value: "Failed control valve", status: "Confirmed" },
      {
        label: "Repair",
        value: "Valve replaced by contractor",
        status: "Complete",
      },
      {
        label: "Verification",
        value: "21°C recorded in Tower A",
        status: "Accepted",
      },
    ],
    checklist: [
      "Contractor report attached.",
      "Post-repair readings recorded.",
      "Facilities manager acknowledgement saved.",
    ],
    integrations: ["ServiceNow", "Outlook", "Microsoft Teams"],
    actions: [
      "Updated the service job",
      "Recorded the accepted reading",
      "Notified facilities",
    ],
    receipts: [
      "Matched the fault to the service order",
      "Verified the repaired temperature",
      "Closed the repair with acceptance",
    ],
    owner: "Facilities manager",
    ownerId: "olivia-grant",
    terms: ["cooling", "repair", "accepted"],
  },

  "loom-replenishment-watch": {
    title: "Move stock to stores before the weekend",
    prompt:
      "Move the missing sizes to the stores that need them before the weekend and keep minimum stock at the sending stores.",
    opening:
      "Three store transfers are booked. The busiest stores receive the missing sizes while sending stores retain their minimum stock.",
    detail:
      "NetSuite transfers, collection windows, product sizes, and warehouse packing instructions are aligned.",
    heading: "Weekend stock moves",
    columns: ["Product", "Transfer", "Status"],
    rows: [
      {
        label: "High-rise denim",
        value: "7 units to Store 03",
        status: "Booked",
      },
      {
        label: "Linen overshirt",
        value: "8 units to Store 18",
        status: "Packed",
      },
      { label: "Leather tote", value: "5 units to Store 02", status: "Booked" },
    ],
    checklist: [
      "Missing sizes matched to store demand.",
      "Sending-store minimums protected.",
      "Teams packing instructions sent.",
    ],
    integrations: ["NetSuite", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Checked store stock by size",
      "Created three stock transfers",
      "Sent store packing instructions",
    ],
    receipts: [
      "Reviewed weekend store demand",
      "Booked three transfers",
      "Protected sending-store minimums",
    ],
    owner: "Retail manager",
    ownerId: "ava-sinclair",
    terms: ["stock", "stores", "transfers"],
  },
  "loom-campaign-launch": {
    title: "Launch the new collection on Shopify",
    prompt:
      "Launch the new collection on Shopify with the approved products, images, prices, and launch date.",
    opening:
      "The new collection is live on Shopify with the approved products, images, prices, and launch date.",
    detail:
      "The launch assets are linked to the same collection record; supporting email and social material remains labeled by its actual status.",
    heading: "Collection launch",
    columns: ["Launch item", "Destination", "Status"],
    rows: [
      {
        label: "New collection page",
        value: "Shopify collection /new",
        status: "Published",
      },
      {
        label: "Product images",
        value: "Approved product set",
        status: "Attached",
      },
      { label: "Launch message", value: "Customer email", status: "Scheduled" },
    ],
    checklist: [
      "Shopify products and prices checked.",
      "Approved images attached.",
      "Email and social assets retain prepared or scheduled status.",
    ],
    integrations: ["Shopify", "Canva", "Outlook"],
    actions: [
      "Published the new collection",
      "Attached approved product images",
      "Scheduled the launch email",
    ],
    receipts: [
      "Checked the approved collection",
      "Published the Shopify page",
      "Scheduled supporting launch assets",
    ],
    owner: "Retail manager",
    ownerId: "ava-sinclair",
    terms: ["collection", "shopify", "published"],
  },
  "loom-journey-drop-off": {
    title: "Fix the size guide before selling",
    prompt:
      "Correct the product size guide before we sell more of the affected items online.",
    opening:
      "The approved size guide is live on the affected Shopify products, and mobile checks confirm customers can read it and select a size.",
    detail:
      "Supplier measurements were matched to product variants before the guide was updated.",
    heading: "Size guide correction",
    columns: ["Product", "Correction", "Status"],
    rows: [
      {
        label: "High-rise denim",
        value: "Waist and inseam table",
        status: "Published",
      },
      {
        label: "New overshirt",
        value: "Chest measurement note",
        status: "Published",
      },
      {
        label: "Mobile page",
        value: "Size guide selection test",
        status: "Passed",
      },
    ],
    checklist: [
      "Supplier measurements matched to variants.",
      "Approved copy published in Shopify.",
      "Mobile selection path checked.",
    ],
    integrations: ["Shopify", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Matched supplier measurements",
      "Published the corrected guide",
      "Recorded the mobile check",
    ],
    receipts: [
      "Checked the affected variants",
      "Updated two product pages",
      "Passed the mobile size test",
    ],
    owner: "Product manager",
    ownerId: "ava-sinclair",
    terms: ["size", "guide", "selling"],
  },
  "loom-vip-outreach": {
    title: "Invite loyal customers to the new collection launch",
    prompt:
      "Invite the approved loyal customers to the new collection launch and track who confirms.",
    opening:
      "Personalized invitations are sent to the approved customer list, and confirmed guests have their joining details.",
    detail:
      "Ruby checked customer preferences and contact permissions before sending each launch invitation.",
    heading: "Launch invitations",
    columns: ["Audience", "Message", "Status"],
    rows: [
      {
        label: "Loyal customers",
        value: "Collection preview invitation",
        status: "Sent",
      },
      {
        label: "Confirmed guests",
        value: "Joining details",
        status: "Delivered",
      },
      { label: "No response", value: "Follow-up list", status: "Tracked" },
    ],
    checklist: [
      "Customer preferences checked.",
      "Contact permissions respected.",
      "Confirmed and unanswered guests separated.",
    ],
    integrations: ["Shopify", "Outlook", "Google Calendar"],
    actions: [
      "Checked customer purchase history",
      "Sent personalized invitations",
      "Recorded launch responses",
    ],
    receipts: [
      "Selected the approved customer list",
      "Sent the launch invitations",
      "Tracked confirmations",
    ],
    owner: "Customer lead",
    ownerId: "ava-sinclair",
    terms: ["loyal", "customers", "launch"],
  },
  "loom-returns-diagnosis": {
    title: "Correct the denim fit problem",
    prompt:
      "Use the denim returns to correct the fit problem with the supplier and book replacement samples.",
    opening:
      "The affected denim sizes and batch are identified. The approved measurement correction is sent to the supplier and replacement samples are booked.",
    detail:
      "The returns pattern is separated from unrelated return reasons so the supplier receives a precise correction.",
    heading: "Denim fit correction",
    columns: ["Finding", "Evidence", "Status"],
    rows: [
      {
        label: "Affected size",
        value: "Size 28 waist runs small",
        status: "Confirmed",
      },
      { label: "Affected batch", value: "DN-204", status: "Linked" },
      {
        label: "Replacement sample",
        value: "Supplier review Sep 12",
        status: "Booked",
      },
    ],
    checklist: [
      "Return reasons grouped by size.",
      "Batch linked to the supplier record.",
      "Supplier acceptance recorded.",
    ],
    integrations: ["Shopify", "Microsoft Excel", "Outlook"],
    actions: [
      "Grouped denim return reasons",
      "Sent the approved correction",
      "Booked replacement samples",
    ],
    receipts: [
      "Identified the affected sizes",
      "Linked batch DN-204",
      "Booked the supplier sample review",
    ],
    owner: "Product manager",
    ownerId: "ava-sinclair",
    terms: ["denim", "fit", "supplier"],
  },
  "loom-store-staffing": {
    title: "Fill Saturday’s uncovered shifts",
    prompt:
      "Fill Saturday’s uncovered store shifts without double-booking qualified staff.",
    opening:
      "Three Saturday shifts are covered by staff who accepted the assignments. One supervisor shift remains open.",
    detail:
      "UKG availability, role qualifications, contracted hours, and existing assignments were checked before the roster changed.",
    heading: "Saturday coverage",
    columns: ["Shift", "Assigned staff", "Status"],
    rows: [
      { label: "Store 03 opening", value: "Ari Patel", status: "Accepted" },
      { label: "Store 18 afternoon", value: "Mina Cole", status: "Accepted" },
      {
        label: "Store 02 supervisor",
        value: "No eligible spare",
        status: "Open",
      },
    ],
    checklist: [
      "Qualifications checked.",
      "Accepted shifts recorded in UKG.",
      "Open supervisor shift escalated to the manager.",
    ],
    integrations: ["Ukg Ready", "Microsoft Teams", "Google Calendar"],
    actions: [
      "Checked staff availability",
      "Updated the accepted roster",
      "Notified store managers",
    ],
    receipts: [
      "Reviewed Saturday coverage",
      "Filled three shifts",
      "Left one specialist shift open",
    ],
    owner: "Store manager",
    ownerId: "ava-sinclair",
    terms: ["Saturday", "shifts", "covered"],
  },
  "loom-product-launch-room": {
    title: "Get the new store ready to open",
    prompt:
      "Complete the stock, till, staff training, and facilities work needed before the new store opens.",
    opening:
      "Stock receipt, till tests, and staff training are complete. The store still needs final facilities approval before opening.",
    detail:
      "The launch room keeps operational completion separate from the final decision to open the doors.",
    heading: "Opening readiness",
    columns: ["Readiness item", "Evidence", "Status"],
    rows: [
      {
        label: "Stock receipt",
        value: "All launch units counted",
        status: "Complete",
      },
      {
        label: "Till tests",
        value: "Payments and returns tested",
        status: "Complete",
      },
      {
        label: "Facilities sign-off",
        value: "Final inspection",
        status: "Awaiting approval",
      },
    ],
    checklist: [
      "Launch stock counted.",
      "Till and returns path tested.",
      "Facilities approval remains visible.",
    ],
    integrations: ["Shopify", "Microsoft Teams", "Outlook"],
    actions: [
      "Checked launch inventory",
      "Recorded till tests",
      "Requested facilities sign-off",
    ],
    receipts: [
      "Completed the store readiness checks",
      "Attached training and till evidence",
      "Held opening for facilities approval",
    ],
    owner: "Facilities manager",
    ownerId: "ava-sinclair",
    terms: ["store", "open", "approval"],
  },
  "loom-social-content-board": {
    title: "Schedule next week’s product ads",
    prompt:
      "Schedule next week’s approved product ads with the correct creative, links, accounts, and dates.",
    opening:
      "Seven product ads are scheduled with matching product links, approved creative, accounts, and campaign dates.",
    detail:
      "The calendar distinguishes scheduled ads from supporting assets that are still awaiting their own publication step.",
    heading: "Product ad schedule",
    columns: ["Product", "Placement", "Status"],
    rows: [
      {
        label: "High-rise denim",
        value: "Instagram · Monday 9 AM",
        status: "Scheduled",
      },
      {
        label: "New collection",
        value: "Email · Wednesday 10 AM",
        status: "Scheduled",
      },
      { label: "Leather tote", value: "Shopify homepage", status: "Prepared" },
    ],
    checklist: [
      "Creative links checked.",
      "Product destinations verified.",
      "Paid and prepared placements separated.",
    ],
    integrations: ["Canva", "Shopify", "Outlook"],
    actions: [
      "Checked approved product creative",
      "Verified product links",
      "Scheduled seven ads",
    ],
    receipts: [
      "Prepared next week’s ad calendar",
      "Verified product destinations",
      "Recorded seven scheduled placements",
    ],
    owner: "Marketing manager",
    ownerId: "ava-sinclair",
    terms: ["product", "ads", "scheduled"],
  },
  "loom-review-insight-digest": {
    title: "Turn customer reviews into product changes",
    prompt:
      "Turn the recurring customer review problems into approved product and care-instruction changes.",
    opening:
      "Care instructions are corrected on four product pages, and two manufacturing issues are assigned to the supplier team.",
    detail:
      "Ruby separates problems solved by clearer instructions from defects that require product or supplier work.",
    heading: "Review actions",
    columns: ["Theme", "Action", "Status"],
    rows: [
      {
        label: "Care confusion",
        value: "Update four product pages",
        status: "Published",
      },
      {
        label: "Denim fit",
        value: "Supplier measurement task",
        status: "Assigned",
      },
      { label: "Bag hardware", value: "Batch review task", status: "Assigned" },
    ],
    checklist: [
      "Reviews linked to products.",
      "Care fixes published in Shopify.",
      "Supplier issues assigned with batch references.",
    ],
    integrations: ["Shopify", "Asana", "Microsoft Teams"],
    actions: [
      "Grouped review themes",
      "Published care updates",
      "Created supplier tasks",
    ],
    receipts: [
      "Reviewed recent product reviews",
      "Published four care corrections",
      "Assigned two supplier issues",
    ],
    owner: "Product manager",
    ownerId: "ava-sinclair",
    terms: ["reviews", "product", "changes"],
  },
  "loom-weekly-trade-report": {
    title: "Plan a sale for stock that isn’t selling",
    prompt:
      "Prepare a clearance sale for slow-moving stock using stock age, size availability, sales, and minimum margin.",
    opening:
      "The clearance proposal is ready with proposed prices, expected margin, and Shopify changes awaiting merchandising approval.",
    detail:
      "The proposal focuses on older stock with complete size runs and protects the recorded minimum margin.",
    heading: "Clearance proposal",
    columns: ["Product", "Proposed price", "Expected margin"],
    rows: [
      {
        label: "Linen overshirt",
        value: "$99 from $129",
        status: "Approval needed",
      },
      {
        label: "High-rise denim",
        value: "$79 from $98",
        status: "Approval needed",
      },
      {
        label: "Leather tote",
        value: "Hold at $159",
        status: "Margin protected",
      },
    ],
    checklist: [
      "Stock age and sizes checked.",
      "Minimum margin applied.",
      "Shopify changes held for merchandising approval.",
    ],
    integrations: ["Shopify", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Reviewed slow-moving stock",
      "Calculated clearance prices",
      "Prepared the merchandising approval",
    ],
    receipts: [
      "Selected the clearance candidates",
      "Protected the minimum margin",
      "Prepared three Shopify price actions",
    ],
    owner: "Merchandising manager",
    ownerId: "ava-sinclair",
    terms: ["sale", "stock", "approval"],
  },

  "cartly-cart-recovery": {
    title: "Bring shoppers back to finish their orders",
    prompt:
      "Send the approved follow-up to eligible shoppers who left available products in their carts.",
    opening:
      "Approved follow-ups are sent to eligible shoppers with available products. Confirmed purchases are tracked separately from the modeled recovery.",
    detail:
      "The recovery selection respects consent, stock, discount limits, and existing customer exclusions.",
    heading: "Cart recovery",
    columns: ["Audience", "Offer", "Status"],
    rows: [
      { label: "High-value carts", value: "Free shipping", status: "Sent" },
      {
        label: "Returning shoppers",
        value: "No extra discount",
        status: "Sent",
      },
      {
        label: "Completed orders",
        value: "Shopify order records",
        status: "Measured separately",
      },
    ],
    checklist: [
      "Available stock checked.",
      "Consent and exclusions applied.",
      "Modeled recovery kept separate from completed purchases.",
    ],
    integrations: ["Shopify", "Outlook", "BigQuery"],
    actions: [
      "Checked eligible carts",
      "Sent approved follow-ups",
      "Measured completed orders",
    ],
    receipts: [
      "Selected eligible abandoned carts",
      "Sent the approved messages",
      "Linked confirmed purchases",
    ],
    owner: "Growth manager",
    ownerId: "noah-williams",
    terms: ["shoppers", "orders", "recovery"],
  },
  "cartly-fraud-signal-review": {
    title: "Process and pay valid refunds",
    prompt:
      "Process the approved refunds after matching each case to its order, return evidence, and prior payments.",
    opening:
      "Approved refunds are confirmed in Stripe. Previous refunds, missing evidence, and disputed cases remain separated for review.",
    detail:
      "Each payment reference is linked to the original Shopify order and its approved refund decision.",
    heading: "Refund payment run",
    columns: ["Case", "Amount", "Status"],
    rows: [
      { label: "RF-2041", value: "$780", status: "Paid in Stripe" },
      { label: "RF-2048", value: "$540", status: "Held for review" },
      { label: "RF-2053", value: "$420", status: "Evidence requested" },
    ],
    checklist: [
      "Orders matched to refund cases.",
      "Valid refunds paid through Stripe.",
      "Exceptions assigned without changing their status.",
    ],
    integrations: ["Shopify", "Stripe", "Zendesk"],
    actions: [
      "Matched refunds to orders",
      "Paid approved refunds",
      "Assigned evidence exceptions",
    ],
    receipts: [
      "Checked the approved refund run",
      "Confirmed valid Stripe refunds",
      "Held two exception cases",
    ],
    owner: "Payments reviewer",
    ownerId: "noah-williams",
    terms: ["refunds", "paid", "Stripe"],
    presentation: "text",
  },
  "cartly-support-swarm": {
    title: "Create an agent for customer questions",
    prompt:
      "Create an agent that answers customer questions about deliveries, returns, products, and existing orders.",
    opening:
      "The customer-questions agent is active. It answered eighteen cases using verified records and assigned three cases with missing information to support.",
    detail:
      "The agent checks Shopify orders and approved policies before replying; it sends uncertain cases to a person with the missing detail named.",
    heading: "Customer question results",
    columns: ["Question type", "Cases", "Status"],
    rows: [
      { label: "Delivery status", value: "8 cases", status: "Answered" },
      { label: "Returns and exchanges", value: "6 cases", status: "Answered" },
      { label: "Missing order details", value: "3 cases", status: "Assigned" },
    ],
    checklist: [
      "Shopify records checked before replying.",
      "Approved return policy used.",
      "Unanswered cases routed to support.",
    ],
    integrations: ["Zendesk", "Shopify", "Notion"],
    actions: [
      "Read customer questions",
      "Checked order records",
      "Created support follow-ups",
    ],
    receipts: [
      "Reviewed eighteen customer cases",
      "Answered verified questions",
      "Assigned three missing-detail cases",
    ],
    owner: "Support manager",
    ownerId: "noah-williams",
    terms: ["agent", "customer", "questions"],
  },
  "cartly-seo-opportunity-map": {
    title: "Rewrite product pages that leave shoppers guessing",
    prompt:
      "Rewrite the approved product pages with accurate dimensions, compatibility, included items, and common answers.",
    opening:
      "Six product pages are updated with verified specifications, useful comparisons, and approved answers to common questions.",
    detail:
      "The revised pages use product records and approved copy, with each published page linked back to its source facts.",
    heading: "Product page updates",
    columns: ["Page", "Change", "Status"],
    rows: [
      {
        label: "Travel charger",
        value: "Compatibility and included cable",
        status: "Published",
      },
      {
        label: "Storage bundle",
        value: "Dimensions and capacity",
        status: "Published",
      },
      {
        label: "Returns FAQ",
        value: "Approved customer answers",
        status: "Published",
      },
    ],
    checklist: [
      "Specifications verified.",
      "Approved copy reviewed.",
      "Shopify page references recorded.",
    ],
    integrations: ["Shopify", "Notion", "Google Sheets"],
    actions: [
      "Checked product facts",
      "Updated six product pages",
      "Recorded published URLs",
    ],
    receipts: [
      "Selected pages with unclear details",
      "Published approved page updates",
      "Linked source facts",
    ],
    owner: "Content manager",
    ownerId: "noah-williams",
    terms: ["product", "pages", "published"],
    presentation: "text",
  },
  "cartly-campaign-roas": {
    title: "Put best-selling products on the store homepage",
    prompt:
      "Prepare a Shopify homepage selection using sales, demand, stock, and margin.",
    opening:
      "The Shopify homepage proposal is ready with best-selling products, placement details, and expected margin. Merchandising approval is still required.",
    detail:
      "The existing campaign controls now compare product exposure and expected commercial value rather than changing advertising spend.",
    heading: "Homepage product proposal",
    columns: ["Product", "Evidence", "Decision"],
    rows: [
      {
        label: "Travel charger",
        value: "High sales and healthy stock",
        status: "Propose feature",
      },
      {
        label: "Storage bundle",
        value: "Strong margin and demand",
        status: "Propose feature",
      },
      {
        label: "Low-stock item",
        value: "High demand, limited units",
        status: "Keep off homepage",
      },
    ],
    checklist: [
      "Sales and stock checked.",
      "Margin floor applied.",
      "Shopify homepage changes held for approval.",
    ],
    integrations: ["Shopify", "BigQuery", "Microsoft Teams"],
    actions: [
      "Checked best-selling products",
      "Calculated homepage exposure",
      "Prepared merchandising approval",
    ],
    receipts: [
      "Reviewed product performance",
      "Prepared the homepage selection",
      "Held publishing for approval",
    ],
    owner: "Merchandising lead",
    ownerId: "noah-williams",
    terms: ["homepage", "products", "approval"],
  },
  "cartly-supplier-delay-recovery": {
    title: "Reschedule deliveries when suppliers are late",
    prompt:
      "Update customer deliveries when a supplier’s confirmed arrival date changes.",
    opening:
      "Affected orders have revised delivery arrangements based on supplier-confirmed dates, and customers received the details that apply to their order.",
    detail:
      "Accepted alternatives, cancellations, and orders still waiting for a confirmed date are kept as separate states.",
    heading: "Delivery recovery",
    columns: ["Order group", "New arrangement", "Status"],
    rows: [
      {
        label: "ORD-4812",
        value: "Replacement item ships Friday",
        status: "Customer accepted",
      },
      {
        label: "ORD-4820",
        value: "Original item arrives Tuesday",
        status: "Customer notified",
      },
      {
        label: "ORD-4831",
        value: "Supplier date not confirmed",
        status: "Support follow-up",
      },
    ],
    checklist: [
      "Supplier dates matched to orders.",
      "Customer-specific messages sent.",
      "Cancellations kept separate from substitutions.",
    ],
    integrations: ["Shopify", "NetSuite", "Outlook"],
    actions: [
      "Checked delayed order groups",
      "Updated delivery arrangements",
      "Sent revised customer details",
    ],
    receipts: [
      "Linked supplier delay to affected orders",
      "Recorded two revised dates",
      "Assigned one unconfirmed case",
    ],
    owner: "Fulfillment manager",
    ownerId: "noah-williams",
    terms: ["deliveries", "suppliers", "reschedule"],
    presentation: "text",
  },
  "cartly-competitor-price-watch": {
    title: "Update prices within our margin rules",
    prompt:
      "Apply the approved product price changes while keeping every product above its recorded margin floor.",
    opening:
      "Approved price changes are published in Shopify. Two products retain their current price because matching the competitor would break the margin limit.",
    detail:
      "The comparison matches product variants, pack size, shipping, and active promotion terms before recommending a price.",
    heading: "Pricing decisions",
    columns: ["Product", "Decision", "Status"],
    rows: [
      { label: "Travel charger", value: "$39 → $37", status: "Published" },
      { label: "Storage bundle", value: "$84 → $79", status: "Published" },
      {
        label: "Premium case",
        value: "Hold at $59",
        status: "Margin protected",
      },
    ],
    checklist: [
      "Variants and pack sizes matched.",
      "Shipping and promotions included.",
      "Margin floor checked before publishing.",
    ],
    integrations: ["Shopify", "Microsoft Excel", "Slack"],
    actions: [
      "Compared matching product prices",
      "Published approved changes",
      "Flagged two protected prices",
    ],
    receipts: [
      "Reviewed the approved price list",
      "Published five changes",
      "Protected two margin floors",
    ],
    owner: "Commercial manager",
    ownerId: "noah-williams",
    terms: ["prices", "margin", "published"],
  },
  "cartly-revenue-cohort-explorer": {
    title: "Bring back customers who stopped buying",
    prompt:
      "Launch the approved win-back campaign for customers who stopped buying, excluding recent buyers and unresolved complaints.",
    opening:
      "The approved win-back campaign is scheduled for the selected customer group, with recent buyers and unresolved complaints excluded.",
    detail:
      "The retention view distinguishes the selected audience, past buying pattern, and future campaign outcome.",
    heading: "Win-back audience",
    columns: ["Customer group", "Selection", "Status"],
    rows: [
      {
        label: "June denim buyers",
        value: "620 mobile customers",
        status: "Selected",
      },
      {
        label: "Recent purchasers",
        value: "Bought in last 30 days",
        status: "Excluded",
      },
      { label: "Open complaints", value: "64 customers", status: "Excluded" },
    ],
    checklist: [
      "Purchase pattern used for selection.",
      "Recent purchasers excluded.",
      "Open complaints excluded from outreach.",
    ],
    integrations: ["Shopify", "BigQuery", "Outlook"],
    actions: [
      "Built the approved audience",
      "Applied exclusion rules",
      "Scheduled the win-back messages",
    ],
    receipts: [
      "Selected the lapsed customer group",
      "Applied two exclusions",
      "Scheduled the approved campaign",
    ],
    owner: "Growth manager",
    ownerId: "noah-williams",
    terms: ["customers", "buying", "campaign"],
  },
  "cartly-creator-event-ops": {
    title: "Organize a live shopping event",
    prompt:
      "Organize the live shopping event with the host, product demonstrations, stock, offers, and customer invitations.",
    opening:
      "The live shopping event page, host schedule, featured-product stock, and invitations are ready. The final offer list needs event-manager approval.",
    detail:
      "Ruby checked event capacity, product stock, demonstration times, and the approved campaign assets before preparing the run sheet.",
    heading: "Live shopping event",
    columns: ["Event item", "Details", "Status"],
    rows: [
      { label: "Event page", value: "Cartly Live · Sep 18", status: "Ready" },
      {
        label: "Host and demos",
        value: "Three confirmed sessions",
        status: "Booked",
      },
      {
        label: "Offer list",
        value: "Four product offers",
        status: "Needs approval",
      },
    ],
    checklist: [
      "Featured product stock checked.",
      "Host and demo slots booked.",
      "Offer list held for event-manager approval.",
    ],
    integrations: ["Shopify", "Google Calendar", "Canva"],
    actions: [
      "Prepared the live event page",
      "Booked host and demos",
      "Prepared the offer approval",
    ],
    receipts: [
      "Checked event product stock",
      "Booked the event run sheet",
      "Held four offers for approval",
    ],
    owner: "Event manager",
    ownerId: "noah-williams",
    terms: ["live", "shopping", "approval"],
  },
  "cartly-commerce-qbr": {
    title: "Grow sales of our best-selling product",
    prompt:
      "Prepare a growth package for our best-selling product using supplier capacity, bundles, creative, and recorded sales assumptions.",
    opening:
      "The best-selling product growth package is ready with supplier capacity, a product bundle, campaign creative, and sales targets. Launch budget approval is pending.",
    detail:
      "The existing commerce review keeps recorded sales, returns, margin, and proposed investment visible in one decision package.",
    heading: "Best-seller growth plan",
    columns: ["Workstream", "Prepared item", "Status"],
    rows: [
      { label: "Supply", value: "12,000 units available", status: "Confirmed" },
      {
        label: "Offer",
        value: "Best-seller + accessory bundle",
        status: "Drafted",
      },
      {
        label: "Campaign",
        value: "Creative and targets",
        status: "Budget approval",
      },
    ],
    checklist: [
      "Supplier capacity confirmed.",
      "Bundle margin calculated.",
      "Proposed spend held for approval.",
    ],
    integrations: ["Shopify", "Microsoft Excel", "Canva"],
    actions: [
      "Checked best-seller supply",
      "Drafted the bundle",
      "Prepared the growth campaign",
    ],
    receipts: [
      "Reviewed best-seller performance",
      "Confirmed supplier capacity",
      "Prepared the budget decision",
    ],
    owner: "Commercial lead",
    ownerId: "noah-williams",
    terms: ["sales", "best-selling", "approval"],
  },

  "harborview-no-show-recovery": {
    title: "Fill tomorrow’s cancelled appointments",
    prompt:
      "Offer tomorrow’s cancelled appointments to suitable patients on the waiting list and confirm the accepted bookings.",
    opening:
      "Five patients accepted tomorrow’s cancelled appointments and received confirmed bookings. Two slots remain open.",
    detail:
      "The appointment type, duration, clinician requirements, preparation instructions, and patient availability were checked before offers were sent.",
    heading: "Tomorrow’s appointments",
    columns: ["Slot", "Patient status", "Result"],
    rows: [
      {
        label: "9:00 AM",
        value: "Waiting-list patient accepted",
        status: "Confirmed",
      },
      {
        label: "11:30 AM",
        value: "Waiting-list patient accepted",
        status: "Confirmed",
      },
      { label: "3:00 PM", value: "No suitable match yet", status: "Open" },
    ],
    checklist: [
      "Clinician-assigned appointment type checked.",
      "Accepted bookings confirmed.",
      "Open slots remain visible.",
    ],
    integrations: ["Google Calendar", "Outlook", "Microsoft Teams"],
    actions: [
      "Checked cancelled slots",
      "Confirmed patient appointments",
      "Notified the clinic team",
    ],
    receipts: [
      "Reviewed tomorrow’s waiting list",
      "Booked five patients",
      "Left two slots open",
    ],
    owner: "Clinic coordinator",
    ownerId: "nina-patel",
    terms: ["appointments", "cancelled", "confirmed"],
  },
  "harborview-referral-intake": {
    title: "Collect the documents needed before surgery",
    prompt:
      "Collect the administrative documents needed before the scheduled surgery and update the preparation record.",
    opening:
      "The surgery preparation record is organized. Six required documents are complete and two specific files were requested from the correct sources.",
    detail:
      "Ruby checks the clinician-defined list and routes missing administrative documents without claiming medical clearance.",
    heading: "Surgery preparation documents",
    columns: ["Document", "Source", "Status"],
    rows: [
      { label: "Consent form", value: "Patient portal", status: "Received" },
      {
        label: "Medication list",
        value: "Clinician record",
        status: "Received",
      },
      {
        label: "Insurance card",
        value: "Patient request",
        status: "Requested",
      },
    ],
    checklist: [
      "Clinician-defined list checked.",
      "Missing files requested from the recorded source.",
      "Medical clearance left to the care team.",
    ],
    integrations: ["Microsoft OneDrive", "Notion", "Outlook"],
    actions: [
      "Checked the surgery document list",
      "Saved received files",
      "Requested missing administration",
    ],
    receipts: [
      "Reviewed eight required documents",
      "Marked six received",
      "Requested two missing files",
    ],
    owner: "Surgery coordinator",
    ownerId: "nina-patel",
    terms: ["documents", "surgery", "preparation"],
  },
  "harborview-policy-answer": {
    title: "Submit the patient’s insurance paperwork",
    prompt:
      "Submit the patient’s approved insurance paperwork and record the authorization reference.",
    opening:
      "The insurance authorization package is submitted with the clinician order and required documents. The insurer’s decision is still pending.",
    detail:
      "The submission record names the recipient, documents, timestamp, and reference so the care team can track the next step.",
    heading: "Authorization submission",
    columns: ["Package item", "Reference", "Status"],
    rows: [
      { label: "Clinician order", value: "Order CO-1842", status: "Attached" },
      {
        label: "Supporting documents",
        value: "Five files",
        status: "Attached",
      },
      { label: "Insurer response", value: "AUTH-7714", status: "Pending" },
    ],
    checklist: [
      "Clinician order matched.",
      "Required documents attached.",
      "Submitted status kept separate from approval.",
    ],
    integrations: ["Microsoft OneDrive", "Outlook", "Microsoft Teams"],
    actions: [
      "Assembled the authorization package",
      "Submitted the insurer request",
      "Recorded the reference",
    ],
    receipts: [
      "Checked the approved treatment documents",
      "Submitted AUTH-7714",
      "Notified the care coordinator",
    ],
    owner: "Authorization coordinator",
    ownerId: "nina-patel",
    terms: ["insurance", "paperwork", "submitted"],
    presentation: "text",
  },
  "harborview-staff-rota": {
    title: "Create an agent for hospital training guides",
    prompt:
      "Create an agent that prepares role-specific hospital training guides from approved procedures and assigns them to staff.",
    opening:
      "The hospital training-guide agent is prepared. Three role-based guides are ready for the training lead’s approval before distribution.",
    detail:
      "The existing staffing grid now shows required topics, assigned staff, completion, and training time while keeping the current controls.",
    heading: "Training guide assignments",
    columns: ["Role", "Guide", "Status"],
    rows: [
      {
        label: "Ward nurse",
        value: "Cleaning and hygiene guide",
        status: "Prepared",
      },
      {
        label: "Theatre assistant",
        value: "Pre-surgery checklist",
        status: "Prepared",
      },
      {
        label: "Admissions clerk",
        value: "Patient document guide",
        status: "Approval needed",
      },
    ],
    checklist: [
      "Approved procedures linked to guides.",
      "Role assignments prepared.",
      "Training lead approval required before distribution.",
    ],
    integrations: ["Notion", "Microsoft OneDrive", "Microsoft Teams"],
    actions: [
      "Read approved hospital procedures",
      "Prepared three role guides",
      "Sent the training approval request",
    ],
    receipts: [
      "Checked the approved procedure set",
      "Prepared three guides",
      "Held distribution for approval",
    ],
    owner: "Training lead",
    ownerId: "nina-patel",
    terms: ["agent", "training", "guides"],
  },
  "harborview-equipment-ticket-triage": {
    title: "Get the broken scanner repaired",
    prompt:
      "Arrange repair for the broken hospital scanner and coordinate the appointments affected by its downtime.",
    opening:
      "The scanner repair visit is confirmed, the fault evidence is attached, and affected appointments have replacement room arrangements.",
    detail:
      "The scanner remains unavailable until the authorized return-to-service check is recorded.",
    heading: "Scanner service impact",
    columns: ["Checkpoint", "Details", "Status"],
    rows: [
      {
        label: "Fault",
        value: "Image calibration failure",
        status: "Confirmed",
      },
      {
        label: "Service visit",
        value: "Engineer · Tuesday 8 AM",
        status: "Confirmed",
      },
      {
        label: "Return to service",
        value: "Post-repair check",
        status: "Pending",
      },
    ],
    checklist: [
      "Fault record linked.",
      "Engineer visit confirmed.",
      "Appointments moved around equipped rooms.",
    ],
    integrations: ["ServiceNow", "Google Calendar", "Microsoft Teams"],
    actions: [
      "Opened the scanner service record",
      "Confirmed the engineer visit",
      "Sent room changes",
    ],
    receipts: [
      "Attached scanner fault evidence",
      "Booked the repair visit",
      "Coordinated affected appointments",
    ],
    owner: "Equipment coordinator",
    ownerId: "nina-patel",
    terms: ["scanner", "repair", "hospital"],
  },
  "harborview-quality-meeting-actions": {
    title: "Complete the cleaning and hygiene follow-ups",
    prompt:
      "Complete the approved cleaning and hygiene actions from today’s hospital quality meeting.",
    opening:
      "Cleaning supplies are reordered, deep-cleaning tasks are assigned, and the approved checklist updates are ready for supervisor verification.",
    detail:
      "The meeting notes are converted into trackable work, with completion evidence separate from supervisor sign-off.",
    heading: "Cleaning and hygiene actions",
    columns: ["Action", "Owner", "Status"],
    rows: [
      {
        label: "Replace ward dispensers",
        value: "Facilities team",
        status: "Assigned",
      },
      {
        label: "Deep-clean recovery bay",
        value: "Environmental services",
        status: "Complete",
      },
      {
        label: "Update cleaning checklist",
        value: "Quality lead",
        status: "Needs verification",
      },
    ],
    checklist: [
      "Meeting decisions recorded.",
      "Cleaning evidence attached.",
      "Supervisor verification kept separate.",
    ],
    integrations: ["Fathom", "Asana", "Microsoft Teams"],
    actions: [
      "Read the quality meeting notes",
      "Created hygiene tasks",
      "Sent the supervisor review",
    ],
    receipts: [
      "Captured the approved actions",
      "Assigned cleaning work",
      "Requested verification",
    ],
    owner: "Quality supervisor",
    ownerId: "nina-patel",
    terms: ["cleaning", "hygiene", "follow-ups"],
    presentation: "text",
  },
  "harborview-compliance-evidence-pack": {
    title: "Prepare the patient’s discharge documents",
    prompt:
      "Prepare the clinician-approved discharge documents and send them to the care team for final review.",
    opening:
      "The discharge document package is assembled with the approved summary, medication list, follow-up appointments, and home-care instructions. Care-team approval is pending.",
    detail:
      "The existing evidence binder shows each required document, its source, and the remaining review state.",
    heading: "Discharge package",
    columns: ["Document", "Source", "Status"],
    rows: [
      {
        label: "Discharge summary",
        value: "Clinician record",
        status: "Attached",
      },
      {
        label: "Medication list",
        value: "Pharmacy record",
        status: "Attached",
      },
      {
        label: "Follow-up appointment",
        value: "Clinic calendar",
        status: "Booked",
      },
    ],
    checklist: [
      "Clinician-approved documents matched.",
      "Medication list checked against the record.",
      "Care-team review remains pending.",
    ],
    integrations: ["Microsoft OneDrive", "Google Calendar", "Microsoft Teams"],
    actions: [
      "Collected approved discharge files",
      "Checked medication and appointments",
      "Sent the care-team review",
    ],
    receipts: [
      "Assembled the discharge package",
      "Booked the follow-up visit",
      "Requested care-team approval",
    ],
    owner: "Care-team lead",
    ownerId: "nina-patel",
    terms: ["patient", "discharge", "documents"],
  },
  "harborview-service-feedback": {
    title: "Order medicines before pharmacy stock runs low",
    prompt:
      "Replenish the medicines that are nearing their pharmacy stock limit using expiry dates, usage, and incoming deliveries.",
    opening:
      "The pharmacist-approved medicine order is created with current stock, expiry dates, pack sizes, and confirmed delivery details.",
    detail:
      "Ruby separates usable stock from expired or reserved stock before calculating the reorder quantities.",
    heading: "Medicine replenishment",
    columns: ["Medicine", "Order quantity", "Status"],
    rows: [
      {
        label: "Amoxicillin 500mg capsules",
        value: "12 packs",
        status: "Order created",
      },
      {
        label: "Salbutamol inhalers",
        value: "24 units",
        status: "Delivery confirmed",
      },
      { label: "Insulin pens", value: "8 boxes", status: "Expiry checked" },
    ],
    checklist: [
      "Usable and reserved stock separated.",
      "Expiry dates checked.",
      "Pharmacist approval attached to the order.",
    ],
    integrations: ["Microsoft Excel", "NetSuite", "Outlook"],
    actions: [
      "Checked pharmacy stock and expiry",
      "Created the approved medicine order",
      "Sent supplier delivery details",
    ],
    receipts: [
      "Calculated three medicine replenishments",
      "Recorded the supplier order",
      "Confirmed the delivery date",
    ],
    owner: "Pharmacy manager",
    ownerId: "nina-patel",
    terms: ["medicines", "pharmacy", "order"],
    presentation: "text",
  },
  "harborview-operations-dashboard": {
    title: "Assign doctors to extra clinic sessions",
    prompt:
      "Assign qualified doctors to the approved extra clinic sessions and check the rooms and existing commitments.",
    opening:
      "Two extra clinic sessions have doctors and rooms proposed. The clinical lead must approve the final assignments.",
    detail:
      "The capacity dashboard shows the proposed doctors, session hours, room fit, and additional patient capacity.",
    heading: "Extra clinic sessions",
    columns: ["Session", "Proposed doctor", "Status"],
    rows: [
      {
        label: "Tuesday evening",
        value: "Dr. Eva Morales · Room 4",
        status: "Proposed",
      },
      {
        label: "Saturday morning",
        value: "Dr. Nina Patel · Room 2",
        status: "Proposed",
      },
      {
        label: "Clinical lead review",
        value: "Two session assignments",
        status: "Pending",
      },
    ],
    checklist: [
      "Doctor qualifications checked.",
      "Room requirements matched.",
      "Clinical lead approval remains pending.",
    ],
    integrations: ["Google Calendar", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Checked doctor availability",
      "Matched doctors to rooms",
      "Sent the clinical lead approval",
    ],
    receipts: [
      "Prepared two extra sessions",
      "Matched doctors and rooms",
      "Requested clinical approval",
    ],
    owner: "Clinical lead",
    ownerId: "nina-patel",
    terms: ["doctors", "clinic", "sessions"],
  },
  "harborview-board-operations-pack": {
    title: "Prepare the proposal for a new hospital scanner",
    prompt:
      "Prepare the proposal for a new hospital scanner using examination demand, room needs, installation, servicing, and training.",
    opening:
      "The scanner proposal is ready with an equipment comparison, demand estimate, installation plan, servicing costs, and staff-training needs. Capital approval is pending.",
    detail:
      "The existing presentation distinguishes measured demand from estimated operating costs so the purchasing team can make the decision.",
    heading: "Scanner purchase proposal",
    columns: ["Option", "Total cost", "Decision state"],
    rows: [
      {
        label: "ClearScan 4",
        value: "$248,000 including installation",
        status: "Recommended",
      },
      {
        label: "ImagePro 6",
        value: "$292,000 including service",
        status: "Comparison",
      },
      {
        label: "Capital request",
        value: "Room and training included",
        status: "Awaiting approval",
      },
    ],
    checklist: [
      "Examination demand measured.",
      "Room and training requirements included.",
      "Purchase held for capital approval.",
    ],
    integrations: ["Microsoft Excel", "Microsoft OneDrive", "Canva"],
    actions: [
      "Compared scanner proposals",
      "Prepared the purchasing deck",
      "Sent the capital approval request",
    ],
    receipts: [
      "Gathered demand and room requirements",
      "Compared two scanner options",
      "Prepared the capital decision",
    ],
    owner: "Capital committee",
    ownerId: "nina-patel",
    terms: ["hospital", "scanner", "approval"],
    deliverables: [
      {
        name: "hospital-scanner-proposal.pdf",
        format: "pdf",
        description:
          "Scanner options, demand, installation, service, and training",
      },
    ],
  },

  "keyline-lead-to-viewing": {
    title: "Send buyers the homes they asked for",
    prompt:
      "Send buyers a current selection of homes that match their budget, area, requirements, and purchase timeline.",
    opening:
      "Three current homes matching the buyer’s requirements are sent with prices, locations, photos, and next-viewing options.",
    detail:
      "Ruby checks listing availability before sending so buyers do not receive properties that are already under offer.",
    heading: "Buyer property selection",
    columns: ["Home", "Match", "Status"],
    rows: [
      {
        label: "Maple Street, 3 bed",
        value: "$620,000 · school area",
        status: "Sent",
      },
      {
        label: "Oak Avenue, 3 bed",
        value: "$645,000 · garden",
        status: "Sent",
      },
      {
        label: "River Road, 4 bed",
        value: "$690,000 · move-in ready",
        status: "Viewing offered",
      },
    ],
    checklist: [
      "Budget and area checked.",
      "Live listing availability verified.",
      "Buyer response tracked in the customer record.",
    ],
    integrations: ["HubSpot", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Matched buyer requirements",
      "Prepared the property selection",
      "Sent property details",
    ],
    receipts: [
      "Reviewed current listings",
      "Selected three matching homes",
      "Recorded buyer outreach",
    ],
    owner: "Sales agent",
    ownerId: "marcus-reed",
    terms: ["buyers", "homes", "sent"],
  },
  "keyline-maintenance-dispatch": {
    title: "Plan Saturday’s open-house visits",
    prompt:
      "Plan Saturday’s open-house visits with sales agents, seller access, property times, and buyer invitations.",
    opening:
      "Saturday’s open-house visits are scheduled with sales agents and seller access confirmed for the selected properties.",
    detail:
      "The existing dispatch map now shows properties, assigned agents, and viewing windows instead of repair jobs.",
    heading: "Open-house schedule",
    columns: ["Property", "Agent", "Status"],
    rows: [
      {
        label: "Maple Street",
        value: "Marcus Reed · 10 AM",
        status: "Confirmed",
      },
      {
        label: "Oak Avenue",
        value: "Eva Morales · 11:30 AM",
        status: "Confirmed",
      },
      { label: "River Road", value: "Seller access check", status: "Pending" },
    ],
    checklist: [
      "Seller access confirmed where available.",
      "Agents assigned without overlap.",
      "Buyer invitations sent with property details.",
    ],
    integrations: ["Google Calendar", "HubSpot", "Outlook"],
    actions: [
      "Checked Saturday properties",
      "Assigned sales agents",
      "Sent buyer invitations",
    ],
    receipts: [
      "Built the open-house route",
      "Confirmed two properties",
      "Flagged one access check",
    ],
    owner: "Real-estate coordinator",
    ownerId: "marcus-reed",
    terms: ["open-house", "visits", "agents"],
  },
  "keyline-lease-renewal-flow": {
    title: "Move accepted offers toward completion",
    prompt:
      "Move accepted home offers forward by requesting missing transaction documents and arranging the next appointments.",
    opening:
      "Accepted offers are updated with their next documents, survey dates, and responsible parties. Two missing files are requested from the buyers’ solicitors.",
    detail:
      "The pipeline shows each sale’s next step rather than treating an accepted offer as a completed transaction.",
    heading: "Accepted offer progress",
    columns: ["Sale", "Next step", "Status"],
    rows: [
      {
        label: "Maple Street",
        value: "Survey booked Sep 14",
        status: "Confirmed",
      },
      { label: "Oak Avenue", value: "Proof of funds", status: "Requested" },
      { label: "River Road", value: "Contract pack", status: "Awaiting file" },
    ],
    checklist: [
      "Accepted offers matched to sale records.",
      "Survey appointments arranged.",
      "Missing documents assigned to the right party.",
    ],
    integrations: ["HubSpot", "Google Calendar", "Outlook"],
    actions: [
      "Checked accepted sales",
      "Booked required surveys",
      "Requested missing documents",
    ],
    receipts: [
      "Reviewed three accepted offers",
      "Booked one survey",
      "Requested two missing files",
    ],
    owner: "Sales progression manager",
    ownerId: "marcus-reed",
    terms: ["offers", "completion", "documents"],
  },
  "keyline-delinquency-recovery": {
    title: "Recover missed rent with agreed payment plans",
    prompt:
      "Check the latest rent receipts and follow up on missed payments using the payment plans already agreed.",
    opening:
      "Accurate statements are sent for five missed balances. Recent payments and two active disputes are excluded from the follow-up.",
    detail:
      "The rent record distinguishes money received, promised payment dates, disputes, and balances that still need contact.",
    heading: "Rent follow-up",
    columns: ["Account", "Latest state", "Action"],
    rows: [
      {
        label: "Flat 4, Oak House",
        value: "$1,240 due",
        status: "Reminder sent",
      },
      {
        label: "Flat 8, Maple Court",
        value: "$980 payment plan",
        status: "Promise recorded",
      },
      { label: "Flat 2, River Court", value: "Paid Sep 4", status: "Excluded" },
    ],
    checklist: [
      "Receipts checked before contact.",
      "Agreed payment plans retained.",
      "Paid and disputed accounts excluded.",
    ],
    integrations: ["NetSuite", "Outlook", "Microsoft Teams"],
    actions: [
      "Reconciled latest rent receipts",
      "Sent accurate reminders",
      "Recorded payment promises",
    ],
    receipts: [
      "Checked five missed balances",
      "Excluded three non-actionable accounts",
      "Sent the approved follow-ups",
    ],
    owner: "Property manager",
    ownerId: "marcus-reed",
    terms: ["rent", "payment", "plans"],
    presentation: "text",
  },
  "keyline-portfolio-dashboard": {
    title: "Get unsold homes back in front of buyers",
    prompt:
      "Review stale homes for sale and prepare property-specific changes that can bring them back in front of buyers.",
    opening:
      "Three stale listings have property-specific presentation and availability recommendations. A proposed price change is waiting for seller approval.",
    detail:
      "Viewing feedback, listing age, enquiries, and competing homes are shown together in the existing portfolio view.",
    heading: "Stale listing actions",
    columns: ["Home", "Recommended action", "Status"],
    rows: [
      {
        label: "Maple Street",
        value: "Refresh photos and first paragraph",
        status: "Ready",
      },
      { label: "Oak Avenue", value: "Add open-house date", status: "Ready" },
      {
        label: "River Road",
        value: "Propose $15,000 price change",
        status: "Seller approval",
      },
    ],
    checklist: [
      "Listing age and viewing feedback checked.",
      "Property-specific changes prepared.",
      "Price change held for seller approval.",
    ],
    integrations: ["HubSpot", "Microsoft Excel", "Outlook"],
    actions: [
      "Reviewed stale listings",
      "Prepared buyer-facing changes",
      "Sent the seller approval request",
    ],
    receipts: [
      "Selected three stale homes",
      "Prepared two listing updates",
      "Flagged one price decision",
    ],
    owner: "Seller",
    ownerId: "marcus-reed",
    terms: ["unsold", "homes", "buyers"],
  },
  "keyline-listing-refresh": {
    title: "Update listings for homes on sale",
    prompt:
      "Update the approved home listings with current prices, availability, descriptions, and photos.",
    opening:
      "Four home listings are updated with approved prices, current availability, accurate descriptions, and the correct photos.",
    detail:
      "Ruby verifies the live listing details after publishing and records each listing reference.",
    heading: "Listing updates",
    columns: ["Home", "Updated fields", "Status"],
    rows: [
      {
        label: "Maple Street",
        value: "Price and availability",
        status: "Updated",
      },
      {
        label: "Oak Avenue",
        value: "Photos and description",
        status: "Updated",
      },
      { label: "River Road", value: "Sale status", status: "Verified" },
    ],
    checklist: [
      "Approved listing copy used.",
      "Current photos matched to each property.",
      "Published details checked.",
    ],
    integrations: ["HubSpot", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Applied approved listing updates",
      "Matched current property photos",
      "Verified live details",
    ],
    receipts: [
      "Updated four listings",
      "Checked live sale details",
      "Recorded listing references",
    ],
    owner: "Listing manager",
    ownerId: "marcus-reed",
    terms: ["listings", "homes", "updated"],
  },
  "keyline-vendor-quote-review": {
    title: "Negotiate the house price with the buyer",
    prompt:
      "Prepare the seller-authorized counteroffer using the buyer’s price, conditions, concessions, and completion date.",
    opening:
      "The buyer counteroffer is prepared with the seller’s authority, proposed price, conditions, concessions, and completion date. Seller approval is required before sending.",
    detail:
      "The existing comparison controls show the offer terms and resulting seller proceeds without accepting anything automatically.",
    heading: "Counteroffer proposal",
    columns: ["Term", "Buyer offer", "Proposed counter"],
    rows: [
      { label: "Price", value: "$620,000", status: "$638,000 proposed" },
      { label: "Completion", value: "30 days", status: "28 days proposed" },
      {
        label: "Included items",
        value: "Kitchen appliances",
        status: "Same proposal",
      },
    ],
    checklist: [
      "Seller authority checked.",
      "Offer terms compared.",
      "Counteroffer held for seller approval.",
    ],
    integrations: ["HubSpot", "Microsoft Excel", "Outlook"],
    actions: [
      "Read the buyer’s offer",
      "Calculated the counteroffer",
      "Prepared seller approval",
    ],
    receipts: [
      "Compared price and conditions",
      "Prepared the authorized counteroffer",
      "Held sending for approval",
    ],
    owner: "Seller",
    ownerId: "marcus-reed",
    terms: ["house", "price", "buyer"],
  },
  "keyline-inspection-pack": {
    title: "Turn inspection photos into repair jobs",
    prompt:
      "Turn the agreed findings from the home inspection into repair jobs with photos, locations, costs, and deadlines.",
    opening:
      "Five repair jobs are created from the inspection findings, each with its photo, location, priority, and owner.",
    detail:
      "Observations remain separate from confirmed causes, and each job stays connected to the original inspection finding.",
    heading: "Inspection repair work",
    columns: ["Finding", "Job", "Status"],
    rows: [
      {
        label: "Roof flashing",
        value: "Contractor inspection",
        status: "Assigned",
      },
      {
        label: "Kitchen leak",
        value: "Plumber visit Sep 10",
        status: "Booked",
      },
      {
        label: "Loose handrail",
        value: "Repair before viewing",
        status: "Assigned",
      },
    ],
    checklist: [
      "Inspection photos attached.",
      "Agreed findings converted to jobs.",
      "Contractor dates and costs recorded.",
    ],
    integrations: ["Microsoft OneDrive", "ServiceNow", "Outlook"],
    actions: [
      "Reviewed inspection photos",
      "Created five repair jobs",
      "Booked the approved contractors",
    ],
    receipts: [
      "Grouped inspection findings",
      "Linked photos to jobs",
      "Recorded contractor dates",
    ],
    owner: "Property manager",
    ownerId: "marcus-reed",
    terms: ["inspection", "photos", "repair"],
  },
  "keyline-owner-update": {
    title: "Pay agents their commission for this week",
    prompt:
      "Pay the agents whose home sales completed this week using the approved commission agreements and confirmed sale records.",
    opening:
      "This week’s eligible agent commissions are reconciled and submitted for payment with the approved splits, deductions, and completed-sale references.",
    detail:
      "The payment report keeps completed sales, unpaid exceptions, and confirmed agent transfers separate from seller proceeds.",
    heading: "Weekly agent commissions",
    columns: ["Agent", "Commission", "Status"],
    rows: [
      { label: "Marcus Reed", value: "$8,400", status: "Payment confirmed" },
      { label: "Eva Morales", value: "$6,750", status: "Payment confirmed" },
      { label: "Lena Ortiz", value: "$3,200", status: "Approval checked" },
    ],
    checklist: [
      "Completed sales matched to agreements.",
      "Agent splits and deductions reconciled.",
      "Confirmed transfers kept separate from seller funds.",
    ],
    integrations: ["NetSuite", "Microsoft Excel", "Outlook"],
    actions: [
      "Matched completed weekly sales",
      "Reconciled commission splits",
      "Sent payment notices",
    ],
    receipts: [
      "Checked this week’s completed sales",
      "Prepared three commission payments",
      "Recorded confirmed transfers",
    ],
    owner: "Finance manager",
    ownerId: "marcus-reed",
    terms: ["agents", "commission", "week"],
    deliverables: [
      {
        name: "weekly-agent-commission-payments.xlsx",
        format: "xlsx",
        description:
          "Completed sales, commission splits, deductions, and payment confirmations",
      },
    ],
  },
  "keyline-resident-escalation": {
    title: "Resolve the resident’s repeated complaint",
    prompt:
      "Complete the agreed resolution for the resident’s repeated heating complaint and record the acknowledgement.",
    opening:
      "The heating repair is verified, the approved credit is posted, and the resident has acknowledged the resolution.",
    detail:
      "The complaint timeline connects the earlier reports, technician findings, payment adjustment, and final communication.",
    heading: "Complaint resolution",
    columns: ["Step", "Evidence", "Status"],
    rows: [
      { label: "Repair", value: "Boiler control replaced", status: "Verified" },
      { label: "Adjustment", value: "$180 approved credit", status: "Posted" },
      {
        label: "Resident response",
        value: "Acknowledged Sep 5",
        status: "Closed",
      },
    ],
    checklist: [
      "Earlier complaints linked.",
      "Technician report attached.",
      "Resident acknowledgement recorded.",
    ],
    integrations: ["ServiceNow", "NetSuite", "Outlook"],
    actions: [
      "Linked the complaint history",
      "Posted the approved adjustment",
      "Sent the resolution notice",
    ],
    receipts: [
      "Reviewed repeated heating reports",
      "Verified the repair",
      "Recorded resident acknowledgement",
    ],
    owner: "Property manager",
    ownerId: "marcus-reed",
    terms: ["resident", "complaint", "resolution"],
  },

  "talentspring-candidate-shortlist": {
    title: "Research candidates for our Engineering Lead role",
    prompt:
      "Research and compare candidates for the Engineering Lead role using the approved requirements and relevant work history.",
    opening:
      "Four researched candidates are prepared for the hiring manager with sourced experience, work examples, and unanswered questions.",
    detail:
      "Ruby compares evidence against the role requirements and leaves unknown experience clearly marked.",
    heading: "Engineering Lead research",
    columns: ["Candidate", "Strong evidence", "Next step"],
    rows: [
      {
        label: "Avery Chen",
        value: "Led platform migration",
        status: "Manager review",
      },
      {
        label: "Jordan Bell",
        value: "Built a 20-person team",
        status: "Manager review",
      },
      {
        label: "Samira Patel",
        value: "Architecture portfolio",
        status: "Reference needed",
      },
    ],
    checklist: [
      "Approved role requirements used.",
      "Work examples linked.",
      "Unknowns left for human review.",
    ],
    integrations: ["Ashby", "Notion", "Outlook"],
    actions: [
      "Read the approved role requirements",
      "Researched relevant candidates",
      "Saved the sourced shortlist",
    ],
    receipts: [
      "Reviewed the Engineering Lead brief",
      "Prepared four candidate records",
      "Flagged three follow-up questions",
    ],
    owner: "Hiring manager",
    ownerId: "chloe-martin",
    terms: ["candidates", "Engineering Lead", "research"],
  },
  "talentspring-interview-scheduler": {
    title: "Schedule interviews with the shortlisted candidates",
    prompt:
      "Schedule the shortlisted candidates’ interviews with the right interviewers and send confirmed invitations.",
    opening:
      "The shortlisted candidates have interview invitations with assigned interviewers, assessment areas, and confirmed times.",
    detail:
      "Ruby checks candidate availability, interviewer calendars, time zones, and existing bookings before creating each meeting.",
    heading: "Interview schedule",
    columns: ["Candidate", "Interview plan", "Status"],
    rows: [
      {
        label: "Avery Chen",
        value: "System design · Tue 10 AM",
        status: "Confirmed",
      },
      {
        label: "Jordan Bell",
        value: "Leadership panel · Wed 2 PM",
        status: "Confirmed",
      },
      {
        label: "Samira Patel",
        value: "Hiring manager · Thu 4 PM",
        status: "Invitation sent",
      },
    ],
    checklist: [
      "Candidate time zones checked.",
      "Interviewers assigned to assessment areas.",
      "Accepted bookings separated from pending invitations.",
    ],
    integrations: ["Google Calendar", "Ashby", "Outlook"],
    actions: [
      "Checked candidate availability",
      "Booked interview panels",
      "Sent interview invitations",
    ],
    receipts: [
      "Scheduled three interview plans",
      "Avoided interviewer conflicts",
      "Recorded two accepted bookings",
    ],
    owner: "Recruiting coordinator",
    ownerId: "chloe-martin",
    terms: ["interviews", "shortlisted", "schedule"],
  },
  "talentspring-interview-synthesis": {
    title: "Move the chosen candidate to the offer stage",
    prompt:
      "Record the interview team’s chosen candidate and move the approved hiring process to the offer stage.",
    opening:
      "The chosen candidate is moved to the offer stage in Ashby, with interview evidence linked. Proposed compensation is waiting for approval.",
    detail:
      "Ruby records the team’s decision and prepares the next administrative step without making the hiring decision itself.",
    heading: "Hiring decision",
    columns: ["Decision item", "Evidence", "Status"],
    rows: [
      { label: "Chosen candidate", value: "Avery Chen", status: "Recorded" },
      {
        label: "Interview evidence",
        value: "Four scorecards linked",
        status: "Complete",
      },
      {
        label: "Compensation",
        value: "$182,000 proposed",
        status: "Approval needed",
      },
    ],
    checklist: [
      "Interview scorecards linked.",
      "Ashby stage updated.",
      "Compensation approval remains separate.",
    ],
    integrations: ["Ashby", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Read the approved interview decision",
      "Updated the candidate stage",
      "Prepared compensation approval",
    ],
    receipts: [
      "Recorded the selected candidate",
      "Linked four scorecards",
      "Submitted compensation for approval",
    ],
    owner: "Compensation approver",
    ownerId: "chloe-martin",
    terms: ["candidate", "offer", "approval"],
    presentation: "text",
  },
  "talentspring-hiring-manager-brief": {
    title: "Prepare the manager for tomorrow’s interview",
    prompt:
      "Prepare the hiring manager’s interview brief with relevant work, open questions, and assessment areas.",
    opening:
      "The candidate-specific brief is attached to tomorrow’s invitation with relevant work, unanswered questions, and assessment areas.",
    detail:
      "The brief uses the existing candidate record so the manager can spend the interview on the right questions.",
    heading: "Interview brief",
    columns: ["Brief section", "Included", "Status"],
    rows: [
      {
        label: "Relevant work",
        value: "Platform migration case",
        status: "Attached",
      },
      {
        label: "Open question",
        value: "Team scaling experience",
        status: "Included",
      },
      {
        label: "Assessment area",
        value: "Technical leadership",
        status: "Assigned",
      },
    ],
    checklist: [
      "Candidate work linked.",
      "Repeated questions removed.",
      "Brief attached to the calendar invitation.",
    ],
    integrations: ["Ashby", "Google Calendar", "Notion"],
    actions: [
      "Gathered candidate evidence",
      "Prepared the manager brief",
      "Attached it to tomorrow’s invite",
    ],
    receipts: [
      "Reviewed candidate history",
      "Prepared the interview brief",
      "Attached the brief to the invitation",
    ],
    owner: "Hiring manager",
    ownerId: "chloe-martin",
    terms: ["manager", "interview", "brief"],
    presentation: "text",
  },
  "talentspring-sourcing-campaign": {
    title: "Send outreach for the Manager role",
    prompt:
      "Send the approved personalized outreach to candidates for the Manager role and track their responses.",
    opening:
      "Approved personalized outreach is sent to the selected candidates, with previous contact, replies, and follow-ups recorded.",
    detail:
      "Ruby checks contact history and opt-outs before sending so candidates do not receive duplicate messages.",
    heading: "Manager outreach",
    columns: ["Audience", "Message", "Status"],
    rows: [
      {
        label: "Engineering managers",
        value: "Role-specific introduction",
        status: "Sent",
      },
      { label: "Prior contact", value: "Two candidates", status: "Excluded" },
      {
        label: "Replies",
        value: "Three positive responses",
        status: "Tracked",
      },
    ],
    checklist: [
      "Manager role requirements used.",
      "Duplicate contact excluded.",
      "Replies linked to candidate records.",
    ],
    integrations: ["Ashby", "Outlook", "Notion"],
    actions: [
      "Selected approved candidates",
      "Sent personalized outreach",
      "Recorded replies",
    ],
    receipts: [
      "Checked contact history",
      "Sent the Manager campaign",
      "Tracked three replies",
    ],
    owner: "Recruiting lead",
    ownerId: "chloe-martin",
    terms: ["Manager", "outreach", "replies"],
    presentation: "text",
  },
  "talentspring-job-launch": {
    title: "Publish the new hiring campaign on LinkedIn",
    prompt:
      "Publish the approved hiring campaign on LinkedIn and verify the application destination.",
    opening:
      "The new hiring campaign is live on LinkedIn with the approved role details and a verified application destination.",
    detail:
      "The publication record names the LinkedIn listing and keeps supporting campaign assets in their actual status.",
    heading: "LinkedIn hiring campaign",
    columns: ["Campaign item", "Destination", "Status"],
    rows: [
      {
        label: "Engineering Lead role",
        value: "LinkedIn listing LI-4481",
        status: "Published",
      },
      {
        label: "Application link",
        value: "Ashby application form",
        status: "Verified",
      },
      {
        label: "Campaign creative",
        value: "Approved hiring image",
        status: "Attached",
      },
    ],
    checklist: [
      "Approved role description used.",
      "Application destination checked.",
      "LinkedIn publication reference recorded.",
    ],
    integrations: ["Ashby", "Canva", "Outlook"],
    actions: [
      "Published the LinkedIn campaign",
      "Verified the application link",
      "Attached approved creative",
    ],
    receipts: [
      "Prepared the approved job campaign",
      "Published LI-4481",
      "Checked the application path",
    ],
    owner: "Recruiting lead",
    ownerId: "chloe-martin",
    terms: ["hiring", "campaign", "LinkedIn"],
  },
  "talentspring-candidate-experience": {
    title: "Send candidates their interview results",
    prompt:
      "Send the approved interview outcome messages and update each candidate’s next step.",
    opening:
      "Approved interview results are sent and candidate stages are updated. Candidates awaiting a human decision remain pending.",
    detail:
      "Each message uses the recorded outcome and next step rather than sending a generic status update.",
    heading: "Candidate outcomes",
    columns: ["Candidate", "Message", "Status"],
    rows: [
      { label: "Avery Chen", value: "Advance to offer review", status: "Sent" },
      {
        label: "Jordan Bell",
        value: "Second interview requested",
        status: "Sent",
      },
      { label: "Samira Patel", value: "Decision pending", status: "Held" },
    ],
    checklist: [
      "Hiring-team decisions matched.",
      "Candidate stages updated in Ashby.",
      "Pending decisions left pending.",
    ],
    integrations: ["Ashby", "Outlook", "Microsoft Teams"],
    actions: [
      "Checked approved interview outcomes",
      "Sent candidate messages",
      "Updated candidate stages",
    ],
    receipts: [
      "Prepared three candidate outcomes",
      "Sent two approved updates",
      "Held one pending decision",
    ],
    owner: "Recruiting lead",
    ownerId: "chloe-martin",
    terms: ["candidates", "interview", "results"],
  },
  "talentspring-workforce-capacity": {
    title: "Balance the recruiting team’s workload",
    prompt:
      "Balance the recruiting team’s searches around planned leave and update candidate ownership.",
    opening:
      "Four searches have accepted cover around planned leave, and candidate ownership and manager contacts are updated.",
    detail:
      "Specialist experience, interview load, availability, and deadlines were checked before work moved between recruiters.",
    heading: "Recruiting capacity",
    columns: ["Recruiter", "Change", "Status"],
    rows: [
      {
        label: "Chloe Martin",
        value: "Four searches before leave",
        status: "Rebalanced",
      },
      {
        label: "Nikhil Rao",
        value: "Two searches accepted",
        status: "Confirmed",
      },
      {
        label: "Specialist search",
        value: "No qualified cover",
        status: "Remains assigned",
      },
    ],
    checklist: [
      "Leave dates checked.",
      "Search expertise matched.",
      "Hiring managers notified of ownership changes.",
    ],
    integrations: ["Ashby", "Asana", "Microsoft Teams"],
    actions: [
      "Measured recruiter capacity",
      "Updated search ownership",
      "Notified hiring managers",
    ],
    receipts: [
      "Reviewed upcoming leave",
      "Confirmed four coverage moves",
      "Kept one specialist search assigned",
    ],
    owner: "Recruiting manager",
    ownerId: "chloe-martin",
    terms: ["recruiting", "workload", "ownership"],
  },
  "talentspring-offer-packet": {
    title: "Prepare the offer that matches what we promised",
    prompt:
      "Prepare the offer using the approved salary, bonus, location, start date, and benefits promised to the candidate.",
    opening:
      "The offer matches the recorded promises and is ready for final approval before it is sent to the candidate.",
    detail:
      "Ruby reconciles Ashby details, compensation approval, and the offer template so a mismatch is caught before delivery.",
    heading: "Offer package",
    columns: ["Term", "Offer detail", "Status"],
    rows: [
      { label: "Base salary", value: "$182,000", status: "Matched" },
      { label: "Start date", value: "October 14", status: "Matched" },
      {
        label: "Benefits",
        value: "Approved package",
        status: "Final approval",
      },
    ],
    checklist: [
      "Recorded promises reconciled.",
      "Offer template checked.",
      "Final approval required before sending.",
    ],
    integrations: ["Ashby", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Reconciled offer terms",
      "Prepared the offer document",
      "Sent final approval request",
    ],
    receipts: [
      "Matched salary and start date",
      "Checked benefits language",
      "Held the offer for approval",
    ],
    owner: "Hiring approver",
    ownerId: "chloe-martin",
    terms: ["offer", "promised", "approval"],
  },
  "talentspring-onboarding-launch": {
    title: "Create an agent for new-hire onboarding",
    prompt:
      "Create an agent that starts onboarding when an offer is signed and prepares the new hire’s first-week work.",
    opening:
      "The new-hire onboarding agent is active. It creates equipment requests, account tasks, first-week meetings, and welcome instructions when an offer is signed.",
    detail:
      "Created tasks and completed provisioning remain separate so the hiring team can see what still needs a person or system owner.",
    heading: "First-week onboarding",
    columns: ["Task", "Destination", "Status"],
    rows: [
      {
        label: "Equipment request",
        value: "ServiceNow · Laptop and monitor",
        status: "Created",
      },
      {
        label: "First-week meetings",
        value: "Google Calendar · Four events",
        status: "Booked",
      },
      {
        label: "Welcome instructions",
        value: "Outlook · New hire",
        status: "Sent",
      },
    ],
    checklist: [
      "Signed-offer trigger recorded.",
      "Equipment and account tasks created.",
      "Provisioning completion tracked separately.",
    ],
    integrations: ["Ashby", "ServiceNow", "Google Calendar"],
    actions: [
      "Detected the signed offer",
      "Created onboarding tasks",
      "Booked first-week meetings",
    ],
    receipts: [
      "Started the onboarding run",
      "Created three task groups",
      "Sent the new-hire instructions",
    ],
    owner: "People operations",
    ownerId: "chloe-martin",
    terms: ["agent", "onboarding", "new-hire"],
  },

  "cedarshield-claim-triage": {
    title: "Book vehicle inspection after each accident",
    prompt:
      "Book a vehicle inspection after each new accident claim and confirm the appointment with the customer.",
    opening:
      "The accident-inspection check is running on schedule. New claims receive an assessor and confirmed appointment without duplicate bookings.",
    detail:
      "The claims map checks location, assessor availability, accident evidence, and existing inspections before creating a booking.",
    heading: "Accident inspection queue",
    columns: ["Claim", "Inspection", "Status"],
    rows: [
      {
        label: "CL-4821",
        value: "Vehicle assessor · Sep 8, 10 AM",
        status: "Confirmed",
      },
      {
        label: "CL-4828",
        value: "Customer location · Sep 8, 2 PM",
        status: "Confirmed",
      },
      {
        label: "CL-4835",
        value: "Existing inspection found",
        status: "No duplicate",
      },
    ],
    checklist: [
      "New accident claims checked.",
      "Existing inspections excluded.",
      "Customer confirmations recorded.",
    ],
    integrations: ["ServiceNow", "Google Calendar", "Outlook"],
    actions: [
      "Checked new accident claims",
      "Assigned vehicle assessors",
      "Confirmed customer visits",
    ],
    receipts: [
      "Reviewed the accident queue",
      "Booked two inspections",
      "Skipped one duplicate booking",
    ],
    owner: "Claims coordinator",
    ownerId: "james-foster",
    terms: ["vehicle", "accident", "inspection"],
  },
  "cedarshield-renewal-brief": {
    title: "Recover repair costs from the other insurer",
    prompt:
      "Submit the approved repair-cost recovery request to the other insurer using the liability decision and supporting records.",
    opening:
      "The repair-cost recovery request is submitted with the accident record, repair invoice, payment confirmation, and approved recovery amount.",
    detail:
      "The claim record shows the request reference and acknowledgement separately from money recovered.",
    heading: "Repair-cost recovery",
    columns: ["Evidence", "Amount", "Status"],
    rows: [
      { label: "Repair invoice", value: "$6,420", status: "Attached" },
      {
        label: "Liability decision",
        value: "Other insurer responsible",
        status: "Recorded",
      },
      { label: "Recovery request", value: "REC-7714", status: "Submitted" },
    ],
    checklist: [
      "Liability decision linked.",
      "Repair invoice and payment attached.",
      "Recovery acknowledgement tracked separately.",
    ],
    integrations: ["ServiceNow", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Matched the repair evidence",
      "Prepared the recovery request",
      "Sent the other-insurer package",
    ],
    receipts: [
      "Checked the approved liability decision",
      "Attached the repair invoice",
      "Submitted REC-7714",
    ],
    owner: "Claims recovery team",
    ownerId: "james-foster",
    terms: ["repair", "costs", "insurer"],
    presentation: "text",
  },
  "cedarshield-fraud-investigation": {
    title: "Check whether the same car repair was claimed twice",
    prompt:
      "Check two car-repair claims for duplicate invoices, vehicle details, dates, and prior payments.",
    opening:
      "The two claims and their repair records are linked for review. One invoice appears duplicated; no fraud decision is made automatically.",
    detail:
      "The evidence view preserves the original claim records, repair dates, vehicle identity, and payment history for the reviewer.",
    heading: "Duplicate repair check",
    columns: ["Record", "Match", "Status"],
    rows: [
      {
        label: "Claim CL-4821",
        value: "Vehicle VIN ending 2184",
        status: "Linked",
      },
      {
        label: "Invoice INV-8042",
        value: "$2,180 · same repair date",
        status: "Possible duplicate",
      },
      { label: "Prior payment", value: "PAY-1184", status: "Reviewer check" },
    ],
    checklist: [
      "Vehicle identity matched.",
      "Invoices and dates compared.",
      "Reviewer decides whether the invoice is duplicate.",
    ],
    integrations: ["ServiceNow", "Microsoft Excel", "Microsoft OneDrive"],
    actions: [
      "Linked the two claim records",
      "Compared repair invoices",
      "Attached the reviewer evidence",
    ],
    receipts: [
      "Matched vehicle and repair dates",
      "Flagged one possible duplicate",
      "Prepared the evidence review",
    ],
    owner: "Claims reviewer",
    ownerId: "james-foster",
    terms: ["car", "repair", "claimed"],
  },
  "cedarshield-policy-comparison": {
    title: "Prepare the policy change for approval",
    prompt:
      "Prepare the policy change for the customer’s newly purchased vehicle and send it for approval.",
    opening:
      "The policy-change package is prepared with current and proposed cover, price, excess, and effective date. Approval is pending.",
    detail:
      "The existing comparison makes the change visible without treating proposed cover as active cover.",
    heading: "New vehicle policy change",
    columns: ["Term", "Current", "Proposed"],
    rows: [
      { label: "Vehicles", value: "Two vans", status: "Add third van" },
      { label: "Annual premium", value: "$8,420", status: "$9,180 proposed" },
      {
        label: "Effective date",
        value: "Current term",
        status: "Sep 15 proposed",
      },
    ],
    checklist: [
      "Vehicle schedule checked.",
      "Premium and excess compared.",
      "Policy change held for approval.",
    ],
    integrations: ["Microsoft Excel", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Checked the vehicle schedule",
      "Prepared the policy comparison",
      "Sent the approval request",
    ],
    receipts: [
      "Matched current policy terms",
      "Prepared the new-vehicle change",
      "Held the proposal for approval",
    ],
    owner: "Policy approver",
    ownerId: "james-foster",
    terms: ["policy", "change", "approval"],
  },
  "cedarshield-broker-call-pack": {
    title: "Arrange a replacement car after an accident",
    prompt:
      "Arrange the approved replacement car after the accident and send the customer the collection details.",
    opening:
      "The replacement car is booked for the approved period, and the customer has the collection address, date, and reservation reference.",
    detail:
      "Ruby checks the customer’s recorded entitlement and approved duration before making the rental booking.",
    heading: "Replacement car booking",
    columns: ["Booking item", "Details", "Status"],
    rows: [
      { label: "Reservation", value: "RC-4821", status: "Confirmed" },
      { label: "Vehicle", value: "Compact automatic", status: "Reserved" },
      {
        label: "Collection",
        value: "Sep 8 · 9:30 AM",
        status: "Customer notified",
      },
    ],
    checklist: [
      "Entitlement checked.",
      "Approved rental duration applied.",
      "Collection details sent to the customer.",
    ],
    integrations: ["ServiceNow", "Google Calendar", "Outlook"],
    actions: [
      "Checked replacement entitlement",
      "Booked the rental vehicle",
      "Sent collection details",
    ],
    receipts: [
      "Matched the accident claim",
      "Confirmed RC-4821",
      "Sent the customer confirmation",
    ],
    owner: "Claims coordinator",
    ownerId: "james-foster",
    terms: ["replacement", "car", "accident"],
    presentation: "text",
  },
  "cedarshield-compliance-approval": {
    title: "Submit the claim payment for final approval",
    prompt:
      "Submit the approved claim settlement package for final payment authorization.",
    opening:
      "The settlement package is submitted with the recorded decision, payee details, amount, and required evidence. Final payment approval is pending.",
    detail:
      "The approval gate distinguishes preparing and submitting the package from actually authorizing or paying it.",
    heading: "Claim payment package",
    columns: ["Package item", "Details", "Status"],
    rows: [
      { label: "Settlement", value: "$14,860", status: "Approved decision" },
      {
        label: "Payee",
        value: "Customer account ending 4421",
        status: "Verified",
      },
      {
        label: "Payment request",
        value: "PAY-8842",
        status: "Awaiting approval",
      },
    ],
    checklist: [
      "Settlement decision attached.",
      "Payee details verified.",
      "Payment authorization remains pending.",
    ],
    integrations: ["ServiceNow", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Assembled the settlement package",
      "Verified payee details",
      "Submitted payment approval",
    ],
    receipts: [
      "Matched the approved claim decision",
      "Prepared PAY-8842",
      "Sent the final approval request",
    ],
    owner: "Payment approver",
    ownerId: "james-foster",
    terms: ["claim", "payment", "approval"],
  },
  "cedarshield-catastrophe-response": {
    title: "Activate the flood response plan",
    prompt:
      "Activate the approved flood response plan and assign affected areas, inspection capacity, and customer-contact work.",
    opening:
      "The flood response plan is active. Response teams, affected areas, inspection capacity, and customer-contact queues are assigned.",
    detail:
      "The catastrophe map separates regional coordination from individual accident inspection bookings.",
    heading: "Flood response",
    columns: ["Area", "Assigned response", "Status"],
    rows: [
      {
        label: "Riverside North",
        value: "Two adjusters · 18 claims",
        status: "Assigned",
      },
      {
        label: "East floodplain",
        value: "Contractor inspection queue",
        status: "Active",
      },
      {
        label: "Customer contact",
        value: "Verified update message",
        status: "Sent",
      },
    ],
    checklist: [
      "Affected territory mapped.",
      "Inspection capacity assigned.",
      "Customer contact plan distributed.",
    ],
    integrations: ["ServiceNow", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Mapped flood-affected areas",
      "Assigned response capacity",
      "Distributed the contact plan",
    ],
    receipts: [
      "Activated the approved flood plan",
      "Assigned three response groups",
      "Sent the customer-contact instructions",
    ],
    owner: "Catastrophe manager",
    ownerId: "james-foster",
    terms: ["flood", "response", "active"],
  },
  "cedarshield-claims-sla-dashboard": {
    title: "Complete claims actions before their deadlines",
    prompt:
      "Complete the required claim requests and notices before their recorded deadlines and escalate unresolved cases.",
    opening:
      "Required requests and notices are sent for six claims. Two unresolved cases are escalated to their assigned owners using the original deadlines.",
    detail:
      "The deadline chart shows the actual claim dates and does not reset a missed deadline just because a reminder was sent.",
    heading: "Claims deadline work",
    columns: ["Claim", "Required action", "Status"],
    rows: [
      { label: "CL-4821", value: "Repair invoice request", status: "Sent" },
      { label: "CL-4828", value: "Customer update", status: "Acknowledged" },
      { label: "CL-4835", value: "Liability evidence", status: "Escalated" },
    ],
    checklist: [
      "Original deadlines retained.",
      "Acknowledgements recorded.",
      "Unresolved cases assigned to owners.",
    ],
    integrations: ["ServiceNow", "Outlook", "Microsoft Teams"],
    actions: [
      "Checked claim deadlines",
      "Sent required notices",
      "Escalated unresolved cases",
    ],
    receipts: [
      "Reviewed eight deadline actions",
      "Completed six claim requests",
      "Escalated two cases",
    ],
    owner: "Claims team lead",
    ownerId: "james-foster",
    terms: ["claims", "deadlines", "actions"],
  },
  "cedarshield-client-qbr": {
    title: "Prepare insurance for the company’s new delivery vans",
    prompt:
      "Prepare the insurance submission for the company’s new delivery vans using the vehicle schedule, drivers, use, and requested cover.",
    opening:
      "The delivery-van insurance package is ready with the vehicle schedule, intended use, driver information, requested cover, and insurer offer. Customer acceptance is pending.",
    detail:
      "The client review cards show the evidence used and keep the insurer’s offer separate from active coverage.",
    heading: "Delivery-van insurance",
    columns: ["Coverage item", "Details", "Status"],
    rows: [
      {
        label: "Vehicles",
        value: "Four new delivery vans",
        status: "Recorded",
      },
      { label: "Drivers", value: "Six approved drivers", status: "Verified" },
      {
        label: "Insurer offer",
        value: "$12,480 annual premium",
        status: "Awaiting acceptance",
      },
    ],
    checklist: [
      "Vehicle schedule checked.",
      "Driver and intended-use records attached.",
      "Customer acceptance required before cover starts.",
    ],
    integrations: ["Microsoft Excel", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Assembled the delivery-van schedule",
      "Checked drivers and intended use",
      "Sent the insurer offer",
    ],
    receipts: [
      "Prepared the vehicle insurance package",
      "Attached six driver records",
      "Sent customer acceptance",
    ],
    owner: "Customer",
    ownerId: "james-foster",
    terms: ["insurance", "delivery", "vans"],
  },
  "cedarshield-broker-coaching": {
    title: "Turn customer calls into claim updates",
    prompt:
      "Turn the recorded customer calls into verified claim details, missing-document requests, callbacks, and follow-up tasks.",
    opening:
      "Customer call details are saved to the claims, missing documents are assigned, and promised callbacks are tracked with source timestamps.",
    detail:
      "The transcript scorecard measures whether required claim details are present; it does not make a decision about the claim.",
    heading: "Claim call updates",
    columns: ["Call detail", "Source", "Status"],
    rows: [
      {
        label: "Accident location",
        value: "Call 09:14",
        status: "Saved to claim",
      },
      {
        label: "Missing repair invoice",
        value: "Call 09:18",
        status: "Requested",
      },
      {
        label: "Customer callback",
        value: "Call 09:23 · Sep 9",
        status: "Scheduled",
      },
    ],
    checklist: [
      "Accident details linked to the claim.",
      "Missing documents assigned.",
      "Callbacks recorded with timestamps.",
    ],
    integrations: ["Fathom", "ServiceNow", "Outlook"],
    actions: [
      "Read recorded customer calls",
      "Updated claim records",
      "Scheduled callbacks",
    ],
    receipts: [
      "Reviewed three customer calls",
      "Saved verified claim details",
      "Created two follow-ups",
    ],
    owner: "Claims owner",
    ownerId: "james-foster",
    terms: ["customer", "calls", "claim"],
  },

  "ledger-month-end-command": {
    title: "Open approved customer accounts",
    prompt:
      "Open the customer accounts that have completed identity checks and received approval, then send the welcome confirmation.",
    opening:
      "Approved customer accounts are created in the core-banking demo record, and welcome confirmations are sent. One account remains blocked by missing approval.",
    detail:
      "The dependency path shows identity checks, approval, account creation, and welcome communication as separate steps.",
    heading: "Account opening",
    columns: ["Customer", "Account record", "Status"],
    rows: [
      { label: "Acme Retail", value: "Account CB-1842", status: "Opened" },
      { label: "Northside Foods", value: "Account CB-1843", status: "Opened" },
      {
        label: "River Market",
        value: "Identity approval missing",
        status: "Blocked",
      },
    ],
    checklist: [
      "Identity checks matched.",
      "Recorded approval checked.",
      "Welcome confirmations sent after account creation.",
    ],
    integrations: ["Notion", "Microsoft OneDrive", "Outlook"],
    actions: [
      "Checked approved identity records",
      "Created customer accounts",
      "Sent welcome confirmations",
    ],
    receipts: [
      "Reviewed three account applications",
      "Opened two approved accounts",
      "Left one account blocked",
    ],
    owner: "Banking operations",
    ownerId: "amelia-ross",
    terms: ["customer", "accounts", "opened"],
  },
  "ledger-invoice-chase": {
    title: "Follow up on missed loan repayments",
    prompt:
      "Check this week’s loan repayments and follow up with customers whose payments are genuinely missed.",
    opening:
      "Accurate repayment reminders are sent for five missed installments. Paid installments and active disputes are excluded.",
    detail:
      "Recent receipts, agreed arrangements, and customer accounts are reconciled before any reminder is sent.",
    heading: "Loan repayment follow-up",
    columns: ["Loan", "Latest record", "Action"],
    rows: [
      { label: "LN-1842", value: "$1,240 due Sep 5", status: "Reminder sent" },
      {
        label: "LN-1851",
        value: "$980 payment plan",
        status: "Promise recorded",
      },
      { label: "LN-1860", value: "Paid Sep 4", status: "Excluded" },
    ],
    checklist: [
      "Bank receipts checked.",
      "Existing payment plans preserved.",
      "Paid and disputed loans excluded.",
    ],
    integrations: ["Microsoft Excel", "Outlook", "Microsoft Teams"],
    actions: [
      "Reconciled loan receipts",
      "Sent approved repayment reminders",
      "Recorded customer responses",
    ],
    receipts: [
      "Reviewed five missed installments",
      "Excluded paid loans",
      "Sent the correct reminders",
    ],
    owner: "Collections manager",
    ownerId: "amelia-ross",
    terms: ["loan", "repayments", "customers"],
    presentation: "text",
  },
  "ledger-cash-forecast": {
    title: "Plan the cash each branch needs",
    prompt:
      "Prepare the thirteen-week cash plan for each branch using expected withdrawals, deposits, known events, and reserves.",
    opening:
      "The branch cash plan is prepared with payroll, tax, supplier commitments, expected deposits, and the required cash buffer. Treasury approval is pending.",
    detail:
      "The existing forecast scenarios compare branch needs without moving money or presenting a forecast as actual cash.",
    heading: "Branch cash plan",
    columns: ["Branch", "Lowest projected cash", "Status"],
    rows: [
      {
        label: "Central branch",
        value: "$420,000 in week 6",
        status: "Within reserve",
      },
      {
        label: "North branch",
        value: "$118,000 in week 8",
        status: "Review needed",
      },
      {
        label: "Treasury decision",
        value: "$85,000 proposed transfer",
        status: "Approval needed",
      },
    ],
    checklist: [
      "Expected deposits and withdrawals included.",
      "Reserve requirement applied.",
      "Proposed transfer held for treasury approval.",
    ],
    integrations: ["Microsoft Excel", "Microsoft OneDrive", "Microsoft Teams"],
    actions: [
      "Built the thirteen-week branch plan",
      "Checked reserve requirements",
      "Prepared treasury approval",
    ],
    receipts: [
      "Reconciled branch cash inputs",
      "Identified one low-balance week",
      "Submitted the proposed transfer",
    ],
    owner: "Treasury approver",
    ownerId: "amelia-ross",
    terms: ["cash", "branch", "treasury"],
  },
  "ledger-expense-anomaly": {
    title: "Prepare a disputed card payment for review",
    prompt:
      "Prepare the evidence package for a disputed card payment and submit it to the payments reviewer.",
    opening:
      "The disputed card payment is prepared for review with the transaction, merchant details, receipt, and case history attached.",
    detail:
      "The receipt view identifies what is known, what is disputed, and what the reviewer must decide; no refund is claimed.",
    heading: "Card payment dispute",
    columns: ["Evidence", "Details", "Status"],
    rows: [
      { label: "Transaction", value: "CARD-8821 · $2,480", status: "Matched" },
      { label: "Merchant", value: "Harbor Office Supply", status: "Verified" },
      {
        label: "Dispute",
        value: "Customer says item not received",
        status: "Submitted",
      },
    ],
    checklist: [
      "Transaction matched to customer account.",
      "Receipt and merchant evidence attached.",
      "Refund decision left to the reviewer.",
    ],
    integrations: ["Microsoft OneDrive", "Outlook", "Microsoft Teams"],
    actions: [
      "Matched the card transaction",
      "Attached receipt evidence",
      "Submitted the dispute package",
    ],
    receipts: [
      "Reviewed the disputed payment",
      "Linked the merchant receipt",
      "Sent the reviewer package",
    ],
    owner: "Payments reviewer",
    ownerId: "amelia-ross",
    terms: ["card", "payment", "disputed"],
  },
  "ledger-cloud-cost-allocation": {
    title: "Assign shared bank costs to the right branches",
    prompt:
      "Allocate this month’s shared bank costs to the right branches using the approved allocation rules.",
    opening:
      "The approved shared-cost allocation is reconciled to the source bill, and branch entries are ready for posting.",
    detail:
      "The allocation ledger keeps direct branch costs, shared costs, and untagged usage visible as separate amounts.",
    heading: "Branch cost allocation",
    columns: ["Cost group", "Allocation", "Status"],
    rows: [
      {
        label: "Core banking platform",
        value: "$42,000 shared by deposits",
        status: "Allocated",
      },
      {
        label: "Fraud monitoring",
        value: "$18,000 by transaction volume",
        status: "Allocated",
      },
      { label: "Untagged service", value: "$4,200", status: "Owner review" },
    ],
    checklist: [
      "Source bill total reconciled.",
      "Documented allocation rules applied.",
      "Untagged cost assigned for review.",
    ],
    integrations: ["Microsoft Excel", "NetSuite", "Microsoft Teams"],
    actions: [
      "Read the shared bank bill",
      "Applied branch allocation rules",
      "Prepared branch entries",
    ],
    receipts: [
      "Reconciled $64,200 of shared costs",
      "Allocated costs to branches",
      "Flagged $4,200 untagged",
    ],
    owner: "Finance controller",
    ownerId: "amelia-ross",
    terms: ["bank", "costs", "branches"],
  },
  "ledger-audit-evidence-binder": {
    title: "Collect the missing documents for a home loan",
    prompt:
      "Collect the missing documents for the home-loan application and assemble the package for the loan officer.",
    opening:
      "The home-loan document package is indexed for the loan officer. Six documents are received and two missing applicant files are requested.",
    detail:
      "The evidence binder shows the bank checklist, document source, reporting date, and the application status without claiming loan approval.",
    heading: "Home-loan documents",
    columns: ["Document", "Source", "Status"],
    rows: [
      {
        label: "Income verification",
        value: "Employer record",
        status: "Received",
      },
      {
        label: "Bank statements",
        value: "Customer upload",
        status: "Received",
      },
      {
        label: "Property valuation",
        value: "Approved surveyor",
        status: "Requested",
      },
    ],
    checklist: [
      "Bank checklist applied.",
      "Received documents indexed.",
      "Missing files assigned to the applicant or surveyor.",
    ],
    integrations: ["Microsoft OneDrive", "Outlook", "Microsoft Teams"],
    actions: [
      "Checked the home-loan checklist",
      "Indexed received documents",
      "Requested missing files",
    ],
    receipts: [
      "Reviewed eight application documents",
      "Marked six received",
      "Requested two missing files",
    ],
    owner: "Loan officer",
    ownerId: "amelia-ross",
    terms: ["home", "loan", "documents"],
  },
  "ledger-board-reporting": {
    title: "Prepare the bank’s lending performance review",
    prompt:
      "Prepare the bank’s lending performance review using applications, issued loans, repayments, overdue balances, and branch results.",
    opening:
      "The lending performance review is prepared with reconciled branch results, issued loans, repayments, overdue balances, and approved follow-ups.",
    detail:
      "The existing financial presentation uses the same reporting period for every figure and labels forecasts separately.",
    heading: "Lending performance",
    columns: ["Measure", "Result", "Status"],
    rows: [
      {
        label: "Applications",
        value: "1,842 this quarter",
        status: "Reconciled",
      },
      { label: "Loans issued", value: "$18.4M", status: "Reconciled" },
      {
        label: "Overdue balance",
        value: "$620,000",
        status: "Follow-ups assigned",
      },
    ],
    checklist: [
      "Reporting period aligned.",
      "Branch figures reconciled.",
      "Approved actions assigned to owners.",
    ],
    integrations: ["Microsoft Excel", "Microsoft OneDrive", "Microsoft Teams"],
    actions: [
      "Reconciled lending figures",
      "Prepared the bank review",
      "Shared approved follow-ups",
    ],
    receipts: [
      "Checked branch lending results",
      "Prepared the performance pack",
      "Assigned overdue-balance actions",
    ],
    owner: "Banking leadership",
    ownerId: "amelia-ross",
    terms: ["bank", "lending", "performance"],
    deliverables: [
      {
        name: "bank-lending-performance-review.pdf",
        format: "pdf",
        description:
          "Applications, loans, repayments, overdue balances, and branch results",
      },
    ],
  },
  "ledger-duplicate-ap-detection": {
    title: "Check a repeated transfer before it is sent",
    prompt:
      "Check the repeated transfer instruction against recipients, references, amounts, and execution status before it is released.",
    opening:
      "Two transfer instructions are compared. One appears repeated and is held for payment-operations approval before release or cancellation.",
    detail:
      "The duplicate comparison preserves both instructions and their execution state so the authorized reviewer can decide safely.",
    heading: "Transfer review",
    columns: ["Instruction", "Amount and recipient", "Status"],
    rows: [
      {
        label: "TR-8821",
        value: "$48,000 · Northstar Supplies",
        status: "Ready",
      },
      {
        label: "TR-8822",
        value: "$48,000 · Northstar Supplies",
        status: "Possible repeat",
      },
      {
        label: "Payment operations",
        value: "Release or cancel TR-8822",
        status: "Approval needed",
      },
    ],
    checklist: [
      "Recipient and reference matched.",
      "Execution status checked.",
      "Payment operations approval remains pending.",
    ],
    integrations: ["NetSuite", "Microsoft Excel", "Microsoft Teams"],
    actions: [
      "Compared transfer instructions",
      "Checked execution records",
      "Sent payment-operations approval",
    ],
    receipts: [
      "Matched two transfer instructions",
      "Flagged one possible repeat",
      "Held the second instruction",
    ],
    owner: "Payment operations",
    ownerId: "amelia-ross",
    terms: ["transfer", "repeated", "approval"],
  },
  "ledger-revenue-reconciliation": {
    title: "Trace why a merchant received less than expected",
    prompt:
      "Trace the merchant settlement from sales through refunds, processing fees, adjustments, and the bank deposit.",
    opening:
      "The merchant’s settlement is reconciled, and a verified explanation is sent showing why the bank deposit is lower than gross sales.",
    detail:
      "The waterfall separates sales, refunds, processing fees, adjustments, and the final amount actually deposited.",
    heading: "Merchant settlement",
    columns: ["Settlement step", "Amount", "Status"],
    rows: [
      { label: "Gross card sales", value: "$84,200", status: "Matched" },
      { label: "Refunds and adjustments", value: "−$5,480", status: "Matched" },
      {
        label: "Fees and deposit",
        value: "$76,920",
        status: "Explanation sent",
      },
    ],
    checklist: [
      "Sales matched to settlement.",
      "Refunds and fees identified.",
      "Merchant explanation sent with settlement reference.",
    ],
    integrations: ["Stripe", "Microsoft Excel", "Outlook"],
    actions: [
      "Matched merchant sales",
      "Reconciled refunds and fees",
      "Sent the settlement explanation",
    ],
    receipts: [
      "Traced the settlement waterfall",
      "Matched $84,200 gross sales",
      "Sent the verified merchant explanation",
    ],
    owner: "Merchant finance lead",
    ownerId: "amelia-ross",
    terms: ["merchant", "settlement", "received"],
  },
  "ledger-finance-policy-q-a": {
    title: "Explain the fees on a customer’s account",
    prompt:
      "Explain the fees charged on the customer’s account using the recorded account terms and current fee schedule.",
    opening:
      "The customer receives an explanation linked to the account terms and fee schedule. Any fee reversal follows a separate approval process.",
    detail:
      "Ruby identifies the charge, the rule that allows it, and the next step if the customer requests a reversal.",
    heading: "Customer fee explanation",
    columns: ["Charge", "Reason", "Status"],
    rows: [
      { label: "Monthly account fee", value: "$25", status: "Terms confirmed" },
      {
        label: "Out-of-network transfer",
        value: "$8",
        status: "Fee schedule confirmed",
      },
      { label: "Requested reversal", value: "$8", status: "Separate approval" },
    ],
    checklist: [
      "Account terms checked.",
      "Current fee schedule linked.",
      "Any reversal kept separate from the explanation.",
    ],
    integrations: ["Microsoft OneDrive", "Outlook", "Microsoft Teams"],
    actions: [
      "Checked the customer account terms",
      "Prepared the fee explanation",
      "Recorded the reversal request",
    ],
    receipts: [
      "Matched two charged fees",
      "Sent the customer explanation",
      "Recorded one reversal request",
    ],
    owner: "Customer banking team",
    ownerId: "amelia-ross",
    terms: ["fees", "customer", "account"],
    presentation: "text",
  },
};

export const REMAINING_INRUBYRY_TITLES: Record<string, string> =
  Object.fromEntries(
    Object.entries(specs).map(([id, spec]) => [id, spec.title])
  );

export const REMAINING_INRUBYRY_REQUIRED_TERMS: Record<string, string[]> =
  Object.fromEntries(
    Object.entries(specs).map(([id, spec]) => [id, spec.terms])
  );

export const REMAINING_INRUBYRY_EXPECTED_DOWNLOADS: Record<string, string[]> =
  Object.fromEntries(
    Object.entries(specs)
      .filter(([, spec]) => spec.deliverables)
      .map(([id, spec]) => [
        id,
        spec.deliverables?.map((deliverable) => deliverable.name) ?? [],
      ])
  );

export const REMAINING_INRUBYRY_ORDER: Record<string, string[]> = {
  stonebridge: [
    "stonebridge-schedule-recovery",
    "stonebridge-site-safety-brief",
    "stonebridge-subcontractor-readiness",
    "stonebridge-cost-overrun-analysis",
    "stonebridge-crew-allocation",
    "stonebridge-rfi-decision-pack",
    "stonebridge-vendor-quote-compare",
    "stonebridge-daily-site-brief",
    "stonebridge-client-progress-pack",
    "stonebridge-warranty-escalation",
  ],
  loom: [
    "loom-replenishment-watch",
    "loom-campaign-launch",
    "loom-journey-drop-off",
    "loom-vip-outreach",
    "loom-returns-diagnosis",
    "loom-store-staffing",
    "loom-product-launch-room",
    "loom-social-content-board",
    "loom-review-insight-digest",
    "loom-weekly-trade-report",
  ],
  cartly: [
    "cartly-cart-recovery",
    "cartly-fraud-signal-review",
    "cartly-support-swarm",
    "cartly-seo-opportunity-map",
    "cartly-campaign-roas",
    "cartly-supplier-delay-recovery",
    "cartly-competitor-price-watch",
    "cartly-revenue-cohort-explorer",
    "cartly-creator-event-ops",
    "cartly-commerce-qbr",
  ],
  harborview: [
    "harborview-no-show-recovery",
    "harborview-referral-intake",
    "harborview-policy-answer",
    "harborview-staff-rota",
    "harborview-equipment-ticket-triage",
    "harborview-quality-meeting-actions",
    "harborview-compliance-evidence-pack",
    "harborview-service-feedback",
    "harborview-operations-dashboard",
    "harborview-board-operations-pack",
  ],
  keyline: [
    "keyline-lead-to-viewing",
    "keyline-maintenance-dispatch",
    "keyline-lease-renewal-flow",
    "keyline-delinquency-recovery",
    "keyline-portfolio-dashboard",
    "keyline-listing-refresh",
    "keyline-vendor-quote-review",
    "keyline-inspection-pack",
    "keyline-owner-update",
    "keyline-resident-escalation",
  ],
  talentspring: [
    "talentspring-candidate-shortlist",
    "talentspring-interview-scheduler",
    "talentspring-interview-synthesis",
    "talentspring-hiring-manager-brief",
    "talentspring-sourcing-campaign",
    "talentspring-job-launch",
    "talentspring-candidate-experience",
    "talentspring-workforce-capacity",
    "talentspring-offer-packet",
    "talentspring-onboarding-launch",
  ],
  cedarshield: [
    "cedarshield-claim-triage",
    "cedarshield-renewal-brief",
    "cedarshield-fraud-investigation",
    "cedarshield-policy-comparison",
    "cedarshield-broker-call-pack",
    "cedarshield-compliance-approval",
    "cedarshield-catastrophe-response",
    "cedarshield-claims-sla-dashboard",
    "cedarshield-client-qbr",
    "cedarshield-broker-coaching",
  ],
  ledger: [
    "ledger-month-end-command",
    "ledger-invoice-chase",
    "ledger-cash-forecast",
    "ledger-expense-anomaly",
    "ledger-cloud-cost-allocation",
    "ledger-audit-evidence-binder",
    "ledger-board-reporting",
    "ledger-duplicate-ap-detection",
    "ledger-revenue-reconciliation",
    "ledger-finance-policy-q-a",
  ],
};

export const REMAINING_INRUBYRY_INDICATORS: Record<
  string,
  RemainingIndustryIndicator
> = {
  "stonebridge-site-safety-brief": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Site supervisor approval pending",
  },
  "stonebridge-subcontractor-readiness": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs weekdays at 4:00 PM",
  },
  "stonebridge-rfi-decision-pack": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Architect approval pending",
  },
  "stonebridge-client-progress-pack": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Fridays at 3:00 PM",
  },
  "loom-replenishment-watch": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Thursdays at 2:00 PM",
  },
  "loom-product-launch-room": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Opening approval pending",
  },
  "loom-social-content-board": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Fridays at 11:00 AM",
  },
  "loom-weekly-trade-report": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Markdown approval pending",
  },
  "cartly-cart-recovery": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs daily at 10:00 AM",
  },
  "cartly-campaign-roas": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Homepage approval pending",
  },
  "cartly-revenue-cohort-explorer": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Mondays at 9:00 AM",
  },
  "cartly-creator-event-ops": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Event manager approval pending",
  },
  "cartly-commerce-qbr": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Launch budget approval pending",
  },
  "harborview-no-show-recovery": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs daily at 3:00 PM",
  },
  "harborview-staff-rota": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Training lead approval pending",
  },
  "harborview-compliance-evidence-pack": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Care-team approval pending",
  },
  "harborview-operations-dashboard": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Clinical lead approval pending",
  },
  "harborview-board-operations-pack": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Capital purchase approval pending",
  },
  "keyline-maintenance-dispatch": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Thursdays at 11:00 AM",
  },
  "keyline-portfolio-dashboard": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Seller approval pending",
  },
  "keyline-vendor-quote-review": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Seller approval pending",
  },
  "keyline-owner-update": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs Fridays at 2:00 PM",
  },
  "talentspring-interview-synthesis": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Compensation approval pending",
  },
  "talentspring-hiring-manager-brief": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs weekdays at 4:00 PM",
  },
  "talentspring-candidate-experience": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs weekdays at 2:00 PM",
  },
  "talentspring-offer-packet": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Final offer approval pending",
  },
  "cedarshield-claim-triage": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs every 30 minutes on weekdays, 8:00 AM–6:00 PM",
  },
  "cedarshield-policy-comparison": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Policy approval pending",
  },
  "cedarshield-compliance-approval": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Payment approval pending",
  },
  "cedarshield-claims-sla-dashboard": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs weekdays at 8:00 AM",
  },
  "cedarshield-client-qbr": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Customer acceptance pending",
  },
  "ledger-invoice-chase": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs weekdays at 9:00 AM",
  },
  "ledger-cash-forecast": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Treasury approval pending",
  },
  "ledger-board-reporting": {
    className: "is-schedule",
    iconClass: "fa-regular fa-clock",
    label: "Runs the first business day at 10:00 AM",
  },
  "ledger-duplicate-ap-detection": {
    className: "is-alert",
    iconClass: "fa-solid fa-circle-exclamation",
    label: "Payment-operations approval pending",
  },
};

export function applyRemainingIndustryScenario(scenario: DemoScenario) {
  const spec = specs[scenario.id];
  return spec ? applySpec(scenario, spec) : scenario;
}
