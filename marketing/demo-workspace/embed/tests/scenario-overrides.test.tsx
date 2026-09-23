import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  getCompanyScenarios,
  type DemoScenario,
  type InlineRun,
} from "../../upstream/app/demo-scenarios";
import {
  WorkspaceChatIndicator,
  WorkspaceScenarioAddon,
  workspaceChatChannel,
  workspaceChatDescription,
  workspaceChatTeamsGroup,
  workspaceChatTitle,
  workspaceCompanies,
  workspaceArtifactLeadIn,
  workspaceScenarioConsistencyIssues,
  workspaceCompanyScenarios,
  workspaceConversationScenario,
} from "../src/scenario-overrides";

const everglade = getCompanyScenarios("everglade");
const northstar = getCompanyScenarios("northstar");
const meadow = getCompanyScenarios("meadow");
const vector = getCompanyScenarios("vector");
afterEach(cleanup);
const byId = (id: string) => {
  const scenario = everglade.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`Missing fixture ${id}`);
  }
  return scenario;
};

const byNorthstarId = (id: string) => {
  const scenario = northstar.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`Missing Northstar fixture ${id}`);
  }
  return scenario;
};

const byMeadowId = (id: string) => {
  const scenario = meadow.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`Missing Meadow fixture ${id}`);
  }
  return scenario;
};

const byCompanyScenarioId = (companyId: string, id: string) => {
  const scenario = getCompanyScenarios(companyId).find(
    (item) => item.id === id
  );
  if (!scenario) {
    throw new Error(`Missing ${companyId} fixture ${id}`);
  }
  return scenario;
};

const byVectorId = (id: string) => {
  const scenario = vector.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`Missing Vector fixture ${id}`);
  }
  return scenario;
};

const expectedTitles: Record<string, string> = {
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
};

const expectedNorthstarTitles: Record<string, string> = {
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
};

const expectedMeadowTitles = [
  "Create next week's production orders",
  "Pay approved supplier invoices",
  "Order packaging before stock runs out",
  "Book refrigerated transport for urgent orders",
  "Create packing lists for store deliveries",
  "Balance Michael's workload",
  "Create a presentation for the new cheese recipe",
  "Process replacements for damaged products",
  "Compare supplier quotes and place the order",
  "Submit approved overtime to payroll",
];

const expectedVectorTitles = [
  "Set up new customers automatically",
  "Get checkout working again",
  "Fix the customer data leak",
  "Ship bulk team invitations",
  "Speed up large customer exports",
  "Keep developer guides up to date",
  "Cut the cost of running our AI",
  "Test mobile signup before release",
  "Turn bug reports into repeatable tests",
  "Upgrade the database without disruption",
];

const expectedRemainingTitles: Record<string, string[]> = {
  stonebridge: [
    "Recover the days lost to rain",
    "Get the site ready for tomorrow’s work",
    "Create an agent for contractor paperwork",
    "Resolve the extra concrete charges",
    "Reschedule crews when site work changes",
    "Get approval to change the building plans",
    "Compare window pricing and place the order",
    "Turn the site meeting into assigned work",
    "Send the owner this week’s construction updates",
    "Finish the cooling-system repair",
  ],
  loom: [
    "Move stock to stores before the weekend",
    "Launch the new collection on Shopify",
    "Fix the size guide before selling",
    "Invite loyal customers to the new collection launch",
    "Correct the denim fit problem",
    "Fill Saturday’s uncovered shifts",
    "Get the new store ready to open",
    "Schedule next week’s product ads",
    "Turn customer reviews into product changes",
    "Plan a sale for stock that isn’t selling",
  ],
  cartly: [
    "Bring shoppers back to finish their orders",
    "Process and pay valid refunds",
    "Create an agent for customer questions",
    "Rewrite product pages that leave shoppers guessing",
    "Put best-selling products on the store homepage",
    "Reschedule deliveries when suppliers are late",
    "Update prices within our margin rules",
    "Bring back customers who stopped buying",
    "Organize a live shopping event",
    "Grow sales of our best-selling product",
  ],
  harborview: [
    "Fill tomorrow’s cancelled appointments",
    "Collect the documents needed before surgery",
    "Submit the patient’s insurance paperwork",
    "Create an agent for hospital training guides",
    "Get the broken scanner repaired",
    "Complete the cleaning and hygiene follow-ups",
    "Prepare the patient’s discharge documents",
    "Order medicines before pharmacy stock runs low",
    "Assign doctors to extra clinic sessions",
    "Prepare the proposal for a new hospital scanner",
  ],
  keyline: [
    "Send buyers the homes they asked for",
    "Plan Saturday’s open-house visits",
    "Move accepted offers toward completion",
    "Recover missed rent with agreed payment plans",
    "Get unsold homes back in front of buyers",
    "Update listings for homes on sale",
    "Negotiate the house price with the buyer",
    "Turn inspection photos into repair jobs",
    "Pay agents their commission for this week",
    "Resolve the resident’s repeated complaint",
  ],
  talentspring: [
    "Research candidates for our Engineering Lead role",
    "Schedule interviews with the shortlisted candidates",
    "Move the chosen candidate to the offer stage",
    "Prepare the manager for tomorrow’s interview",
    "Send outreach for the Manager role",
    "Publish the new hiring campaign on LinkedIn",
    "Send candidates their interview results",
    "Balance the recruiting team’s workload",
    "Prepare the offer that matches what we promised",
    "Create an agent for new-hire onboarding",
  ],
  cedarshield: [
    "Book vehicle inspection after each accident",
    "Recover repair costs from the other insurer",
    "Check whether the same car repair was claimed twice",
    "Prepare the policy change for approval",
    "Arrange a replacement car after an accident",
    "Submit the claim payment for final approval",
    "Activate the flood response plan",
    "Complete claims actions before their deadlines",
    "Prepare insurance for the company’s new delivery vans",
    "Turn customer calls into claim updates",
  ],
  ledger: [
    "Open approved customer accounts",
    "Follow up on missed loan repayments",
    "Plan the cash each branch needs",
    "Prepare a disputed card payment for review",
    "Assign shared bank costs to the right branches",
    "Collect the missing documents for a home loan",
    "Prepare the bank’s lending performance review",
    "Check a repeated transfer before it is sent",
    "Trace why a merchant received less than expected",
    "Explain the fees on a customer’s account",
  ],
};

function inlineRunText(run: InlineRun) {
  if (run.kind === "text") {
    return run.text;
  }
  if (run.kind === "mention") {
    return run.personId;
  }
  return run.id;
}

function responseText(scenario: DemoScenario) {
  return scenario.copy.response
    .flatMap((block) => {
      if ("content" in block) {
        return block.content.map(inlineRunText);
      }
      if ("items" in block) {
        return block.items.flat().map(inlineRunText);
      }
      return block.rows.flat().map(inlineRunText);
    })
    .join(" ");
}

describe("Everglade workspace chat labels", () => {
  it("uses every requested title without changing other companies", () => {
    expect(
      Object.fromEntries(
        everglade.map((scenario) => [scenario.id, workspaceChatTitle(scenario)])
      )
    ).toEqual(expectedTitles);
  });

  it("uses all ten requested Northstar titles", () => {
    expect(
      Object.fromEntries(
        northstar.map((scenario) => [scenario.id, workspaceChatTitle(scenario)])
      )
    ).toEqual(expectedNorthstarTitles);
  });

  it("derives matching Slack and Teams labels", () => {
    const scenario = byId("everglade-daily-ops-briefing");
    expect(workspaceChatChannel(scenario)).toBe(
      "send-the-morning-drivers-brief"
    );
    expect(workspaceChatTeamsGroup(scenario)).toBe(
      "Send the morning driver's brief"
    );
  });

  it("orders the Meadow conversations around completed production work", () => {
    expect(
      workspaceCompanyScenarios("meadow").map((scenario) =>
        workspaceChatTitle(scenario)
      )
    ).toEqual(expectedMeadowTitles);
  });

  it("orders the Vector conversations around completed engineering work", () => {
    expect(
      workspaceCompanyScenarios("vector").map((scenario) =>
        workspaceChatTitle(scenario)
      )
    ).toEqual(expectedVectorTitles);
  });

  it("uses the revised titles and preserves each industry’s ten slots", () => {
    for (const [companyId, titles] of Object.entries(expectedRemainingTitles)) {
      expect(
        workspaceCompanyScenarios(companyId).map((scenario) =>
          workspaceChatTitle(scenario)
        )
      ).toEqual(titles);
    }
  });

  it("moves Harborview appointments before document intake", () => {
    expect(
      workspaceCompanyScenarios("harborview").map((scenario) => scenario.id)
    ).toEqual([
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
    ]);
  });

  it("renames and orders the remaining workspaces without changing their IDs", () => {
    const companies = workspaceCompanies([
      {
        id: "vector",
        name: "Vector Forge",
        industry: "Technology",
        icon: "fa-code",
      },
      {
        id: "ledger",
        name: "Ledger & Co.",
        industry: "Accounting",
        icon: "fa-calculator",
      },
      { id: "loom", name: "Loom & Line", industry: "Retail", icon: "fa-shirt" },
      {
        id: "cartly",
        name: "Cartly Commerce",
        industry: "E-commerce",
        icon: "fa-cart",
      },
      {
        id: "stonebridge",
        name: "Stonebridge Build",
        industry: "Construction",
        icon: "fa-trowel",
      },
      {
        id: "meadow",
        name: "Meadow Dairy Co.",
        industry: "Food Production",
        icon: "fa-cow",
      },
      {
        id: "everglade",
        name: "Everglade Logistics",
        industry: "Operations",
        icon: "fa-truck",
      },
    ]);
    expect(companies.map((company) => company.id)).toEqual([
      "everglade",
      "meadow",
      "ledger",
      "loom",
      "cartly",
      "vector",
      "stonebridge",
    ]);
    expect(companies.find((company) => company.id === "ledger")).toMatchObject({
      name: "Morgan Banks",
      industry: "Banking",
      icon: "fa-solid fa-dollar-sign",
    });
    expect(companies.find((company) => company.id === "vector")).toMatchObject({
      name: "Clearpath Software",
    });
    expect(
      companies.find((company) => company.id === "stonebridge")
    ).toMatchObject({
      icon: "fa-solid fa-screwdriver-wrench",
    });
  });

  it("adds the requested schedules and approval markers", () => {
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("stonebridge", "stonebridge-site-safety-brief")
      )
    ).toBe("Site supervisor approval pending");
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("loom", "loom-campaign-launch")
      )
    ).toBeUndefined();
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("loom", "loom-replenishment-watch")
      )
    ).toBe("Runs Thursdays at 2:00 PM");
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("cartly", "cartly-cart-recovery")
      )
    ).toBe("Runs daily at 10:00 AM");
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("harborview", "harborview-no-show-recovery")
      )
    ).toBe("Runs daily at 3:00 PM");
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("keyline", "keyline-owner-update")
      )
    ).toBe("Runs Fridays at 2:00 PM");
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("cedarshield", "cedarshield-claim-triage")
      )
    ).toContain("every 30 minutes");
    expect(
      workspaceChatDescription(
        byCompanyScenarioId("ledger", "ledger-cash-forecast")
      )
    ).toBe("Treasury approval pending");
  });

  it("keeps all revised workflows internally consistent", () => {
    for (const companyId of Object.keys(expectedRemainingTitles)) {
      for (const scenario of workspaceCompanyScenarios(companyId)) {
        const adapted = workspaceConversationScenario(scenario);
        expect(
          workspaceScenarioConsistencyIssues(adapted),
          scenario.id
        ).toEqual([]);
        expect(adapted.copy.conversationTitle).toBe(
          workspaceChatTitle(scenario)
        );
        expect(adapted.channel).toBe(workspaceChatChannel(scenario));
        expect(adapted.teamsGroup).toBe(workspaceChatTeamsGroup(scenario));
      }
    }
  });

  it("preserves every existing widget identity and presentation type", () => {
    for (const companyId of Object.keys(expectedRemainingTitles)) {
      for (const original of getCompanyScenarios(companyId)) {
        const adapted = workspaceConversationScenario(original);
        expect(adapted.artifactId, original.id).toBe(original.artifactId);
        expect(adapted.artifact.variant, original.id).toBe(
          original.artifact.variant
        );
        expect(adapted.copy.presentation, original.id).toBe(
          original.copy.presentation
        );
        expect(adapted.artifactBehavior, original.id).toBe(
          original.artifactBehavior
        );
      }
    }
  });

  it("adds schedules and meaningful exceptions to the Meadow sidebar", () => {
    expect(workspaceChatDescription(byMeadowId("meadow-demand-forecast"))).toBe(
      "Runs Mondays at 6:00 AM"
    );
    expect(
      workspaceChatDescription(byMeadowId("meadow-quality-deviation"))
    ).toBe("Runs weekdays at 5:00 AM");
    expect(
      workspaceChatDescription(byMeadowId("meadow-production-schedule"))
    ).toBe("Two tasks remain unassigned");
    expect(
      workspaceChatDescription(byMeadowId("meadow-weekly-plant-report"))
    ).toBe("Runs Fridays at 11:00 AM");
  });
});

describe("Vector Forge conversation overrides", () => {
  it("uses one explicit agent-building workflow and nine distinct engineering outcomes", () => {
    const adapted = workspaceCompanyScenarios("vector").map(
      workspaceConversationScenario
    );
    expect(adapted[0].copy.userPrompt).toContain("Build an agent");
    expect(responseText(adapted[0])).toContain("customer setup agent");
    expect(
      adapted.slice(1).map((scenario) => scenario.copy.userPrompt)
    ).toEqual([
      "Restore checkout after the latest release, confirm customers can place orders, and update the incident.",
      "Fix the account-isolation bug, prove one customer cannot access another customer’s records, and prepare the change for release.",
      "Build and release bulk team invitations so customer admins can invite everyone from one spreadsheet.",
      "Fix the slow customer exports and verify the complete files still contain the right records.",
      "Check our developer guides after each release and prepare corrections when the software behaves differently.",
      "Apply the approved cost reductions and check that answer quality and response speed stay within our targets.",
      "Test the new signup flow on small phones before release and give the release owner the results.",
      "Turn customer bug reports into reproducible tests and give engineers the failing case they can use.",
      "Run the approved database upgrade, verify the application on the new version, and publish the completion record.",
    ]);
    expect(
      new Set(adapted.map((scenario) => scenario.copy.userPrompt)).size
    ).toBe(10);
  });

  it("keeps every Vector workflow aligned across title, channel, Teams label, and widget heading", () => {
    for (const original of vector) {
      const adapted = workspaceConversationScenario(original);
      expect(adapted.copy.conversationTitle).toBe(workspaceChatTitle(original));
      expect(adapted.channel).toBe(workspaceChatChannel(original));
      expect(adapted.teamsGroup).toBe(workspaceChatTeamsGroup(original));
      expect(adapted.artifact.title).toBe(workspaceChatTitle(original));
      expect(workspaceScenarioConsistencyIssues(adapted)).toEqual([]);
    }
  });

  it("keeps the preserved Vector widget scenarios interactive", () => {
    const widgetScenarios = [
      "vector-internal-tool-prototype",
      "vector-pull-request-review",
      "vector-regression-explorer",
      "vector-documentation-drift",
      "vector-cloud-spend-guard",
      "vector-feedback-signal-map",
    ];
    for (const id of widgetScenarios) {
      const adapted = workspaceConversationScenario(byVectorId(id));
      expect(adapted.copy.presentation).toBe("artifact");
      expect(adapted.artifactBehavior).toBe("interactive");
    }
  });

  it("records concrete completion states without claiming blocked work is deployed", () => {
    const signup = workspaceConversationScenario(
      byVectorId("vector-regression-explorer")
    );
    const dataFix = workspaceConversationScenario(
      byVectorId("vector-pull-request-review")
    );
    const agent = workspaceConversationScenario(
      byVectorId("vector-internal-tool-prototype")
    );
    expect(responseText(signup)).toContain("Release is held");
    expect(responseText(dataFix)).toContain("ready for the security reviewer");
    expect(responseText(agent)).toContain("is deployed");
  });
});

describe("Everglade conversation overrides", () => {
  it("limits content overrides to the seven explicitly requested chats", () => {
    const contentOverrideIds = new Set([
      "everglade-sla-risk-command",
      "everglade-missed-pickup-recovery",
      "everglade-carrier-claim-packet",
      "everglade-customer-escalation",
      "everglade-capacity-forecast",
      "everglade-daily-ops-briefing",
      "everglade-fleet-launch-deck",
    ]);

    for (const original of everglade) {
      const adapted = workspaceConversationScenario(original);
      expect(adapted.copy === original.copy).toBe(
        !contentOverrideIds.has(original.id)
      );
    }
  });

  it.each([
    "everglade-freight-cost-spike",
    "everglade-warehouse-incident",
    "everglade-supplier-onboarding",
  ])("preserves all conversation data for title-only chat %s", (id) => {
    const original = byId(id);
    expect(workspaceConversationScenario(original)).toBe(original);
  });

  it("updates only the late-driver prompt while preserving the completed result", () => {
    const original = byId("everglade-sla-risk-command");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Send every late driver to the fastest available route, assign capacity, and notify the shipment owners before cutoff."
    );
    expect(adapted.copy.response).toBe(original.copy.response);
    expect(adapted.artifact).toBe(original.artifact);
  });

  it("updates only the complaint prompt while preserving the completed result", () => {
    const original = byId("everglade-customer-escalation");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Resolve the Acme delivery complaint and prepare the customer reply for the account owner."
    );
    expect(adapted.copy.response).toBe(original.copy.response);
    expect(adapted.deliverables).toBe(original.deliverables);
  });

  it("keeps the contract conversation unchanged when only its title changes", () => {
    const original = byNorthstarId("northstar-contract-risk-scan");
    expect(workspaceConversationScenario(original)).toBe(original);
  });

  it("keeps the new client documents content aligned with its title", () => {
    const original = byNorthstarId("northstar-privacy-review");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Collect the missing documents for our new clients and send each client a personalized request."
    );
    expect(responseText(adapted)).toContain(
      "Completed intake items, missing files, and personalized requests"
    );
    expect(responseText(adapted)).toContain("Greenline");
    expect(responseText(adapted)).toContain("Cedar Ridge");
    expect(adapted.artifact.rows.map((row) => row.label)).toEqual([
      "Greenline",
      "Halcyon",
      "Cedar Ridge",
    ]);
    expect(adapted.artifactId).toBe(original.artifactId);
    expect(adapted.artifact.variant).toBe(original.artifact.variant);
  });

  it("keeps dated document content aligned with its title and downloads", () => {
    const original = byNorthstarId("northstar-litigation-chronology");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Put the Dawson case documents in date order and flag any dates that are uncertain."
    );
    expect(responseText(adapted)).toContain(
      "One document date is uncertain and clearly flagged for review."
    );
    expect(responseText(adapted)).toContain("Date uncertain");
    expect(adapted.deliverables).toEqual([
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
    ]);
  });

  it("keeps signed-agreement content aligned with its title", () => {
    const original = byNorthstarId("northstar-clause-precedent-finder");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Find the latest signed agreement and separate the executed version from drafts."
    );
    expect(responseText(adapted)).toContain(
      "The latest executed agreement is identified with its related amendments."
    );
    expect(responseText(adapted)).toContain(
      "Drafts are separated from signed documents"
    );
    expect(responseText(adapted)).toContain("Atlas master services agreement");
    expect(adapted.artifact.rows.map((row) => row.status)).toEqual([
      "Executed",
      "Executed",
      "Executed",
    ]);
  });

  it("keeps consultation content aligned with its title", () => {
    const original = byNorthstarId("northstar-client-intake");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Schedule consultations for the new clients with the assigned lawyer."
    );
    expect(responseText(adapted)).toContain(
      "Consultation availability is matched with Eva Morales"
    );
    expect(responseText(adapted)).toContain(
      "Invitations and confirmations are tracked"
    );
    expect(adapted.artifactId).toBe(original.artifactId);
  });

  it("keeps overdue-update content and its download aligned with its title", () => {
    const original = byNorthstarId("northstar-regulatory-watch");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.presentation).toBe("text");
    expect(adapted.copy.userPrompt).toBe(
      "Send overdue matter updates using the approved client template."
    );
    expect(responseText(adapted)).toContain(
      "Three matters are due for a client update today."
    );
    expect(responseText(adapted)).toContain("Dawson dispute");
    expect(adapted.deliverables).toEqual([
      {
        name: "overdue-matter-updates.pdf",
        format: "pdf",
        description: "Verified matter statuses and approved client updates",
      },
    ]);
  });

  it("keeps missing-time-entry content aligned with its title", () => {
    const original = byNorthstarId("northstar-matter-staffing");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Chase the missing time entries and update the completion list."
    );
    expect(responseText(adapted)).toContain(
      "Six missing time entries remain across three matters."
    );
    expect(adapted.artifact.rows.map((row) => row.label)).toEqual([
      "Eva Morales",
      "Daniel Brooks",
      "Priya Rao",
    ]);
    expect(adapted.artifact.rows[0].value).toContain("Halcyon licensing");
  });

  it("keeps draft-invoice content aligned with its title", () => {
    const original = byNorthstarId("northstar-invoice-review");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Check the draft client invoices for missing details before review."
    );
    expect(responseText(adapted)).toContain(
      "Missing descriptions, duplicate-looking lines, and supporting records are ready for review."
    );
    expect(adapted.artifact.rows.map((row) => row.label)).toEqual([
      "INV-2841",
      "INV-2848",
      "INV-2852",
      "INV-2859",
    ]);
    expect(adapted.artifact.rows[0].value).toContain(
      "Missing work description"
    );
  });

  it("keeps client-call follow-ups as rich text with matching download", () => {
    const original = byNorthstarId("northstar-board-memo");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.presentation).toBe("text");
    expect(adapted.copy.userPrompt).toBe(
      "Turn today’s client calls into follow-up tasks with owners and due dates."
    );
    expect(responseText(adapted)).toContain(
      "Commitments, tasks, owners, due dates, and call timestamps are captured below."
    );
    expect(responseText(adapted)).toContain("Send Dawson evidence list");
    expect(adapted.deliverables).toEqual([
      {
        name: "client-call-follow-ups.pdf",
        format: "pdf",
        description:
          "Client call commitments, owners, due dates, and timestamps",
      },
    ]);
  });

  it("provides title-matched Teams lead-ins for Northstar workflows", () => {
    expect(
      workspaceArtifactLeadIn(byNorthstarId("northstar-litigation-chronology"))
    ).toBe("The dated document index and uncertain dates are below.");
    expect(
      workspaceArtifactLeadIn(byNorthstarId("northstar-invoice-review"))
    ).toBe("The draft invoice findings are below.");
    expect(workspaceArtifactLeadIn(byId("everglade-capacity-forecast"))).toBe(
      undefined
    );
  });

  it("orders the workspaces with Morgan Banks third and Northstar Legal eighth", () => {
    const companies = [
      { id: "northstar" },
      { id: "everglade" },
      { id: "meadow" },
      { id: "vector" },
      { id: "stonebridge" },
      { id: "loom" },
      { id: "cartly" },
      { id: "harborview" },
      { id: "keyline" },
      { id: "talentspring" },
      { id: "cedarshield" },
      { id: "ledger" },
    ];
    expect(workspaceCompanies(companies).map((company) => company.id)).toEqual([
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
    ]);
    expect(companies[0].id).toBe("northstar");
  });

  it("validates that each Northstar surface describes the same workflow", () => {
    for (const original of northstar) {
      const adapted = workspaceConversationScenario(original);
      expect(workspaceScenarioConsistencyIssues(adapted), original.id).toEqual(
        []
      );
    }
  });

  it("reports a mismatched Northstar surface instead of allowing silent drift", () => {
    const adapted = workspaceConversationScenario(
      byNorthstarId("northstar-invoice-review")
    );
    const inconsistent = {
      ...adapted,
      copy: {
        ...adapted.copy,
        conversationTitle: "Review a different workflow",
      },
    };
    expect(workspaceScenarioConsistencyIssues(inconsistent)).toContain(
      "conversation title does not match the workspace title"
    );
  });

  it("rewrites Greenline follow-up copy while preserving the signature widget", () => {
    const original = byNorthstarId("northstar-nda-signature-flow");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toBe(
      "Follow up on unsigned agreements and confirm their current signature status."
    );
    expect(adapted.copy.presentation).toBe("artifact");
    expect(responseText(adapted)).toContain(
      "Previously approved agreements awaiting signatures, reminders, and current status."
    );
    expect(responseText(adapted)).toContain("Greenline mutual NDA");
    expect(responseText(adapted)).toContain("Cedar Ridge data addendum");
    expect(responseText(adapted)).toContain("Northstar vendor terms");
    expect(responseText(adapted)).toContain("Follow-up owner");
    expect(adapted.artifactId).toBe(original.artifactId);
    expect(adapted.artifact.variant).toBe(original.artifact.variant);
    expect(adapted.artifact.title).toBe("Follow up on unsigned agreements");
    expect(adapted.artifact.rows).toBe(original.artifact.rows);
    expect(adapted.deliverables).toBe(original.deliverables);
  });

  it("rebooks missed pickups while retaining the existing artifact", () => {
    const original = byId("everglade-missed-pickup-recovery");
    const adapted = workspaceConversationScenario(original);
    expect(adapted).not.toBe(original);
    expect(adapted.copy.userPrompt).toBe(
      "Reschedule today’s missed deliveries using the fastest available routes."
    );
    expect(responseText(adapted)).toContain(
      "Reschedule missed deliveries: Recovered six pickups."
    );
    expect(responseText(adapted)).not.toContain("Rebook missed pickups");
    expect(
      adapted.integrationSteps.map((step) => step.label).join(" ")
    ).not.toContain("Recover missed pickups");
    expect(adapted.artifactId).toBe(original.artifactId);
    expect(adapted.artifact.variant).toBe(original.artifact.variant);
  });

  it("uses rich text with load, ticket, ETA, update, and exception details", () => {
    const adapted = workspaceConversationScenario(
      byId("everglade-carrier-claim-packet")
    );
    expect(adapted.copy.presentation).toBe("text");
    expect(adapted.copy.userPrompt).toBe(
      "Update customers about today’s delayed loads using the latest verified ETAs, and flag any unresolved exceptions."
    );
    expect(responseText(adapted)).toContain(
      "Delayed loads, verified latest ETAs, customer updates, and unresolved exceptions."
    );
    expect(responseText(adapted)).toContain("EG-4821 / CS-2841");
    expect(responseText(adapted)).toContain("EG-4835 / CS-2853");
    expect(responseText(adapted)).toContain("EG-4840 / CS-2858");
    expect(responseText(adapted)).toContain(
      "Dock C release time is not confirmed"
    );
    expect(adapted.deliverables).toEqual([
      {
        name: "delivery-delay-customer-updates.pdf",
        format: "pdf",
        description:
          "Verified ETAs, customer notices, and unresolved exceptions",
      },
    ]);
    expect(responseText(adapted)).not.toContain("claim paperwork");
    expect(adapted.deliverables.map((item) => item.name)).not.toContain(
      "EG-4821-carrier-claim.pdf"
    );
  });

  it("rewrites dock-capacity content without replacing its widget", () => {
    const original = byId("everglade-capacity-forecast");
    const adapted = workspaceConversationScenario(original);
    expect(adapted.copy.userPrompt).toContain("tomorrow's dock capacity");
    expect(responseText(adapted)).toContain("Tomorrow's dock capacity");
    expect(adapted.artifactId).toBe(original.artifactId);
    expect(adapted.artifact.variant).toBe(original.artifact.variant);
  });

  it("creates a morning brief and a driver-payment summary", () => {
    const brief = workspaceConversationScenario(
      byId("everglade-daily-ops-briefing")
    );
    const payments = workspaceConversationScenario(
      byId("everglade-fleet-launch-deck")
    );
    expect(brief.copy.userPrompt).toContain("morning driver's brief");
    expect(responseText(brief)).toContain("morning driver's brief");
    expect(payments.copy.userPrompt).toBe(
      "Finalize this week's driver payments."
    );
    expect(responseText(payments)).toContain("$18,420.00");
    expect(payments.deliverables[0]).toMatchObject({
      name: "driver-payment-summary.xlsx",
      format: "xlsx",
    });
  });

  it("returns the same override object and never mutates upstream fixtures", () => {
    const original = byId("everglade-capacity-forecast");
    const originalPrompt = original.copy.userPrompt;
    expect(workspaceConversationScenario(original)).toBe(
      workspaceConversationScenario(original)
    );
    expect(original.copy.userPrompt).toBe(originalPrompt);
  });
});

describe("Meadow production workspace overrides", () => {
  it("creates next week's production orders", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-demand-forecast")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Create next week’s strawberry yogurt production orders using the approved forecast, confirmed orders, and usable stock."
    );
    expect(responseText(adapted)).toContain(
      "Production order MO-6201 is created for 8,000 cups"
    );
    expect(adapted.artifact.rows[1]).toMatchObject({
      label: "Expected demand",
      value: "8,000 cups",
      status: "Created MO-6201",
    });
  });

  it("pays approved supplier invoices and isolates the held invoice", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-recall-simulation")
    );
    expect(adapted.copy.presentation).toBe("text");
    expect(adapted.copy.userPrompt).toBe(
      "Pay the supplier invoices approved for this payment run and send the payment notices."
    );
    expect(responseText(adapted)).toContain(
      "Two supplier invoices totaling $6,480 are paid."
    );
    expect(responseText(adapted)).toContain("INV-4111");
    expect(responseText(adapted)).toContain("remains unpaid");
  });

  it("orders packaging with stock and incoming quantities accounted for", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-quality-deviation")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Order the cups and lids needed for the approved yogurt runs, accounting for stock and deliveries already on the way."
    );
    expect(responseText(adapted)).toContain(
      "PO-632 is created and emailed to North Ridge Packaging"
    );
    expect(responseText(adapted)).toContain("3,000 cups and 2,000 lids");
  });

  it("books refrigerated transport and records confirmed collections", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-cold-chain-alert")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Book refrigerated transport for the three urgent store orders and send the collection details to dispatch."
    );
    expect(responseText(adapted)).toContain("Three collections are confirmed.");
    expect(adapted.artifact.rows.map((row) => row.label)).toEqual([
      "DL-204",
      "DL-219",
      "DL-227",
    ]);
  });

  it("creates store packing lists and reserves approved stock", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-batch-traceability")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Create tomorrow’s store packing lists, reserve the approved stock, and send the lists to the warehouse."
    );
    expect(responseText(adapted)).toContain(
      "Three store packing lists are saved."
    );
    expect(responseText(adapted)).toContain("1,080 bottles");
    expect(adapted.artifact.rows[0].label).toBe("Store orders");
  });

  it("balances Michael's workload and leaves specialist work visible", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-production-schedule")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Michael has too much work today. Move the tasks his teammates can take and update everyone."
    );
    expect(responseText(adapted)).toContain(
      "Three tasks have moved from Michael to available teammates."
    );
    expect(responseText(adapted)).toContain(
      "Two specialist tasks still need an owner because no eligible teammate is available."
    );
    expect(adapted.artifact.rows[0].value).toContain("Michael → Lena");
  });

  it("creates the herb cheese presentation with six slide records", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-supplier-certificate-audit")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Create a presentation for the new herb cheese recipe using the trial notes, photos, and tasting feedback. Save it for the product meeting."
    );
    expect(responseText(adapted)).toContain(
      "The six-slide herb cheese presentation is created in Gamma"
    );
    expect(adapted.copy.presentation).toBe("artifact");
    expect(adapted.artifact.rows).toHaveLength(6);
    expect(adapted.deliverables).toEqual([
      {
        name: "herb-cheese-recipe-presentation.pdf",
        format: "pdf",
        description: "Six-slide herb cheese recipe presentation",
      },
    ]);
  });

  it("processes approved replacements while holding incomplete claims", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-plant-maintenance-triage")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Process the approved damage claims, create replacement orders, and send customers their delivery confirmations."
    );
    expect(responseText(adapted)).toContain(
      "Two replacement orders are created and confirmed with customers."
    );
    expect(responseText(adapted)).toContain("missing delivery photos");
  });

  it("compares supplier quotes and places the approved order", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-energy-cost-review")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Compare the three approved quotes for cheese tubs, place the order that meets our price and delivery requirements, and notify the supplier."
    );
    expect(responseText(adapted)).toContain(
      "PO-645 is placed with North Ridge Packaging"
    );
    expect(adapted.artifact.rows[0]).toMatchObject({
      label: "North Ridge Packaging",
      value: "$2,160 | $120 | $2,280",
      status: "PO-645 placed",
    });
  });

  it("submits approved overtime and routes the unapproved entry back", () => {
    const adapted = workspaceConversationScenario(
      byMeadowId("meadow-weekly-plant-report")
    );
    expect(adapted.copy.userPrompt).toBe(
      "Reconcile this week’s approved overtime and submit it to payroll before the cutoff."
    );
    expect(responseText(adapted)).toContain(
      "The approved overtime file is submitted to payroll: 42 hours totaling $1,176."
    );
    expect(responseText(adapted)).toContain("OT-219");
    expect(adapted.deliverables[0]).toMatchObject({
      name: "approved-overtime-payroll.xlsx",
      format: "xlsx",
    });
  });

  it("keeps Meadow scenario content and navigation aligned", () => {
    const ordered = workspaceCompanyScenarios("meadow");
    expect(ordered).toHaveLength(10);
    for (const scenario of ordered) {
      const adapted = workspaceConversationScenario(scenario);
      expect(adapted.copy.conversationTitle).toBe(workspaceChatTitle(scenario));
      expect(adapted.channel).toBe(workspaceChatChannel(scenario));
      expect(adapted.teamsGroup).toBe(workspaceChatTeamsGroup(scenario));
    }
  });
});

describe("Everglade-only additions", () => {
  it("renders the daily schedule below the brief", () => {
    render(
      <WorkspaceScenarioAddon scenario={byId("everglade-daily-ops-briefing")} />
    );
    expect(screen.getByText("Schedule created")).toBeInTheDocument();
    expect(screen.getByText("Every morning at 6:00 AM")).toBeInTheDocument();
  });

  it("renders the final amount for driver payments", () => {
    render(
      <WorkspaceScenarioAddon scenario={byId("everglade-fleet-launch-deck")} />
    );
    expect(screen.getByText("Final amount")).toBeInTheDocument();
    expect(screen.getByText("$18,420.00")).toBeInTheDocument();
    expect(screen.getByText("12 drivers")).toBeInTheDocument();
  });

  it("renders the accounting invoice action in the payment summary", () => {
    render(
      <WorkspaceScenarioAddon scenario={byId("everglade-fleet-launch-deck")} />
    );
    expect(
      screen.getByRole("button", {
        name: "Send the invoice to Accounting Division",
      })
    ).toBeInTheDocument();
  });

  it("adds a softer alert only to Launch new operation", () => {
    const launch = byId("everglade-supplier-onboarding");
    const { rerender } = render(<WorkspaceChatIndicator scenario={launch} />);
    expect(screen.getByLabelText("Needs attention")).toBeInTheDocument();
    expect(workspaceChatDescription(launch)).toBe("Needs attention");
    rerender(
      <WorkspaceChatIndicator scenario={byId("everglade-sla-risk-command")} />
    );
    expect(screen.queryByLabelText("Needs attention")).not.toBeInTheDocument();
  });

  it("adds a clock to the recurring morning brief", () => {
    const brief = byId("everglade-daily-ops-briefing");
    render(<WorkspaceChatIndicator scenario={brief} />);
    expect(screen.getByLabelText("Runs every morning")).toBeInTheDocument();
    expect(workspaceChatDescription(brief)).toBe("Runs every morning");
  });

  it("adds the requested timing and attention indicators to Northstar chats", () => {
    const contract = byNorthstarId("northstar-contract-risk-scan");
    const timeEntries = byNorthstarId("northstar-matter-staffing");
    const overdue = byNorthstarId("northstar-regulatory-watch");
    const { rerender } = render(<WorkspaceChatIndicator scenario={contract} />);
    expect(screen.getByLabelText("Review due today")).toBeInTheDocument();
    expect(workspaceChatDescription(contract)).toBe("Review due today");
    expect(
      screen.getByLabelText("Review due today").querySelector("i")
    ).toHaveClass("fa-clock");
    rerender(<WorkspaceChatIndicator scenario={timeEntries} />);
    expect(screen.getByLabelText("Reminders sent today")).toBeInTheDocument();
    expect(workspaceChatDescription(timeEntries)).toBe("Reminders sent today");
    rerender(<WorkspaceChatIndicator scenario={overdue} />);
    expect(screen.getByLabelText("Needs attention")).toBeInTheDocument();
    expect(workspaceChatDescription(overdue)).toBe("Needs attention");
    expect(
      screen.getByLabelText("Needs attention").querySelector("i")
    ).toHaveClass("fa-circle-exclamation");
  });

  it("renders Meadow clocks and the production workload exception", () => {
    const productionOrders = byMeadowId("meadow-demand-forecast");
    const packaging = byMeadowId("meadow-quality-deviation");
    const workload = byMeadowId("meadow-production-schedule");
    const overtime = byMeadowId("meadow-weekly-plant-report");
    const { rerender } = render(
      <WorkspaceChatIndicator scenario={productionOrders} />
    );
    expect(
      screen.getByLabelText("Runs Mondays at 6:00 AM")
    ).toBeInTheDocument();
    rerender(<WorkspaceChatIndicator scenario={packaging} />);
    expect(
      screen.getByLabelText("Runs weekdays at 5:00 AM")
    ).toBeInTheDocument();
    rerender(<WorkspaceChatIndicator scenario={workload} />);
    expect(
      screen.getByLabelText("Two tasks remain unassigned")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Two tasks remain unassigned").querySelector("i")
    ).toHaveClass("fa-circle-exclamation");
    rerender(<WorkspaceChatIndicator scenario={overtime} />);
    expect(
      screen.getByLabelText("Runs Fridays at 11:00 AM")
    ).toBeInTheDocument();
  });
});
