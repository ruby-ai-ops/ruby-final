import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getCompanyScenarios } from "../../upstream/app/demo-scenarios";
import { ScenarioArtifact } from "../../upstream/app/scenario-artifact";
import { workspaceConversationScenario } from "../src/scenario-overrides";

const northstar = getCompanyScenarios("northstar");
const meadow = getCompanyScenarios("meadow");
const vector = getCompanyScenarios("vector");
afterEach(cleanup);

function scenario(id: string) {
  const original = northstar.find((item) => item.id === id);
  if (!original) {
    throw new Error(`Missing fixture ${id}`);
  }
  return workspaceConversationScenario(original);
}

function meadowScenario(id: string) {
  const original = meadow.find((item) => item.id === id);
  if (!original) {
    throw new Error(`Missing fixture ${id}`);
  }
  return workspaceConversationScenario(original);
}

function vectorScenario(id: string) {
  const original = vector.find((item) => item.id === id);
  if (!original) {
    throw new Error(`Missing Vector fixture ${id}`);
  }
  return workspaceConversationScenario(original);
}

describe("Northstar artifact registry overrides", () => {
  it.each([
    ["northstar-privacy-review", "bespoke-matrix-widget"],
    ["northstar-litigation-chronology", "reviewed-dawson"],
    ["northstar-clause-precedent-finder", "reviewed-precedent"],
    ["northstar-client-intake", "reviewed-partner"],
    ["northstar-matter-staffing", "reviewed-staffing"],
    ["northstar-invoice-review", "reviewed-invoice"],
  ])("renders the adapted %s widget with the original structure", (id, className) => {
    const { container } = render(
      <ScenarioArtifact scenario={scenario(id)} platform="ruby" />
    );
    expect(container.querySelector(`.${className}`)).toBeInTheDocument();
  });
});

describe("Meadow artifact registry overrides", () => {
  it.each([
    ["meadow-demand-forecast", "bespoke-calculator-widget"],
    ["meadow-cold-chain-alert", "reviewed-cold-chain"],
    ["meadow-batch-traceability", "reviewed-lineage"],
    ["meadow-production-schedule", "bespoke-timeline-widget"],
    ["meadow-supplier-certificate-audit", "meadow-cheese-presentation"],
    ["meadow-energy-cost-review", "reviewed-energy"],
  ])("renders the adapted %s widget with the original structure", (id, className) => {
    const { container } = render(
      <ScenarioArtifact scenario={meadowScenario(id)} platform="ruby" />
    );
    expect(container.querySelector(`.${className}`)).toBeInTheDocument();
  });
});

describe("Vector artifact registry overrides", () => {
  it.each([
    ["vector-internal-tool-prototype", "vector-webhook"],
    ["vector-pull-request-review", "vector-code-review"],
    ["vector-regression-explorer", "vector-activation"],
    ["vector-documentation-drift", "vector-doc-drift"],
    ["vector-cloud-spend-guard", "vector-cloud-spend"],
    ["vector-feedback-signal-map", "vector-feedback"],
  ])("renders the adapted %s widget with the current design family", (id, className) => {
    const { container } = render(
      <ScenarioArtifact scenario={vectorScenario(id)} platform="ruby" />
    );
    expect(container.querySelector(`.${className}`)).toBeInTheDocument();
  });
});
