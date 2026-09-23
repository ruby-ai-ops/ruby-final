import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { artifactRegistry } from "../../upstream/app/artifacts/registry";
import { scenarioLibrary } from "../../upstream/app/demo-scenarios";
import { ScenarioArtifact } from "../../upstream/app/scenario-artifact";
import { artifactRevealMap } from "../src/artifact-reveal-map";

const scenarios = Object.values(scenarioLibrary).flatMap(
  (workspace) => workspace.scenarios
);

// Independently reviewed eligibility: deleting a selector must not silently turn
// a card-bearing artifact into an intentional empty entry. These are whole
// evidence/record, media, metric, completion or setup cards, not chart/table rows.
const cardArtifactIds = new Set([
  "cartly-campaign-roas",
  "cartly-cart-recovery",
  "cartly-commerce-qbr",
  "cartly-competitor-price-watch",
  "cartly-creator-event-ops",
  "cartly-revenue-cohort-explorer",
  "cartly-support-swarm",
  "cedarshield-broker-coaching",
  "cedarshield-catastrophe-response",
  "cedarshield-claim-triage",
  "cedarshield-claims-sla-dashboard",
  "cedarshield-client-qbr",
  "everglade-missed-pickup-recovery",
  "everglade-sla-risk-command",
  "everglade-supplier-onboarding",
  "harborview-equipment-ticket-triage",
  "harborview-operations-dashboard",
  "harborview-referral-intake",
  "harborview-staff-rota",
  "keyline-inspection-pack",
  "keyline-lead-to-viewing",
  "keyline-lease-renewal-flow",
  "keyline-portfolio-dashboard",
  "ledger-audit-evidence-binder",
  "ledger-cash-forecast",
  "ledger-cloud-cost-allocation",
  "ledger-duplicate-ap-detection",
  "ledger-expense-anomaly",
  "ledger-month-end-command",
  "ledger-revenue-reconciliation",
  "loom-product-launch-room",
  "loom-replenishment-watch",
  "loom-social-content-board",
  "meadow-batch-traceability",
  "meadow-supplier-certificate-audit",
  "northstar-contract-risk-scan",
  "stonebridge-site-safety-brief",
  "talentspring-candidate-experience",
  "talentspring-candidate-shortlist",
  "talentspring-onboarding-launch",
  "talentspring-workforce-capacity",
  "vector-cloud-spend-guard",
  "vector-feedback-signal-map",
]);

it("covers the actual artifact registry", () => {
  expect(scenarios).toHaveLength(120);
  expect(Object.keys(artifactRevealMap).sort()).toEqual(
    Object.keys(artifactRegistry).sort()
  );
  expect(
    new Set(
      scenarios
        .filter((scenario) =>
          Object.hasOwn(artifactRegistry, scenario.artifactId)
        )
        .map((scenario) => scenario.artifactId)
    )
  ).toEqual(new Set(Object.keys(artifactRegistry)));
  for (const id of cardArtifactIds) {
    expect(Object.hasOwn(artifactRegistry, id), id).toBe(true);
  }
});

describe.each(scenarios)("$id", (scenario) => {
  it.each([
    "ruby",
    "slack",
    "teams",
  ] as const)("selects only separate supporting cards in the original %s artifact", (platform) => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      createElement(ScenarioArtifact, { scenario, platform })
    );
    if (!Object.hasOwn(artifactRegistry, scenario.artifactId)) {
      expect(Object.hasOwn(artifactRevealMap, scenario.artifactId)).toBe(false);
      expect(container.childElementCount).toBe(0);
      return;
    }

    const entry = artifactRevealMap[scenario.artifactId];
    expect(entry, scenario.artifactId).toBeDefined();
    const root = container.querySelector(".scenario-artifact");
    expect(root).not.toBeNull();
    if (!root) {
      throw new Error(`Missing artifact: ${scenario.artifactId}`);
    }
    expect(root.getAttribute("data-artifact-id")).toBe(scenario.artifactId);
    expect(entry.cards.length > 0).toBe(
      cardArtifactIds.has(scenario.artifactId)
    );

    const selected = new Set<Element>();
    for (const selector of entry.cards) {
      // A named supporting group and explicit child path, never a catch-all.
      expect(selector).toMatch(/^\.[a-z][\w-]* > /);
      expect(selector).not.toMatch(/[,\*]/);
      const cards = root.querySelectorAll(selector);
      expect(
        cards.length,
        `${scenario.artifactId}: ${selector}`
      ).toBeGreaterThan(0);
      for (const card of cards) {
        expect(selected.has(card), `Duplicate card: ${selector}`).toBe(false);
        expect(card).not.toBe(root.firstElementChild);
        expect(
          card.matches(
            "table, thead, tbody, tr, th, td, svg, svg *, img, small, strong, i, input, select, option"
          )
        ).toBe(false);
        expect(card.closest("table, svg, [role=tablist]")).toBeNull();
        expect(card.textContent?.trim().length).toBeGreaterThan(0);
        selected.add(card);
      }
    }
    // Walk ancestors rather than comparing every pair of selected elements.
    for (const card of selected) {
      for (
        let ancestor = card.parentElement;
        ancestor && ancestor !== root;
        ancestor = ancestor.parentElement
      ) {
        expect(
          selected.has(ancestor),
          `Overlapping reveal targets in ${scenario.artifactId}`
        ).toBe(false);
      }
    }
  });
});

it("reveals the three fleet assignment cards without their nested content or main map", () => {
  const scenario = scenarios.find(
    (item) => item.artifactId === "everglade-sla-risk-command"
  );
  if (!scenario) {
    throw new Error("Fleet scenario missing");
  }
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    createElement(ScenarioArtifact, { scenario, platform: "ruby" })
  );
  const targets = artifactRevealMap[scenario.artifactId].cards.flatMap(
    (selector) => Array.from(container.querySelectorAll(selector))
  );
  expect(targets).toHaveLength(3);
  expect(
    targets.every(
      (card) =>
        card.tagName === "ARTICLE" &&
        card.parentElement?.className === "fleet-assignment-cards"
    )
  ).toBe(true);
  expect(
    targets.map((card) => card.querySelector("header strong")?.textContent)
  ).toEqual(["EG-4821", "EG-4828", "EG-4835"]);
});
