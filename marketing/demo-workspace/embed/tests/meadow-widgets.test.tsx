import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getCompanyScenarios } from "../../upstream/app/demo-scenarios";
import {
  MeadowCheeseRecipePresentation,
  MeadowColdChainTransportExplorer,
  MeadowPackingListFlow,
  MeadowProductionOrderCalculator,
  MeadowSupplierQuoteComparison,
  MeadowWorkloadTimeline,
} from "../src/meadow-widgets";
import { workspaceConversationScenario } from "../src/scenario-overrides";

const meadow = getCompanyScenarios("meadow");
afterEach(cleanup);

function scenario(id: string) {
  const original = meadow.find((item) => item.id === id);
  if (!original) {
    throw new Error(`Missing fixture ${id}`);
  }
  return workspaceConversationScenario(original);
}

describe("Meadow production widgets", () => {
  it("marks the expected production order and previews alternatives", () => {
    render(
      <MeadowProductionOrderCalculator
        scenario={scenario("meadow-demand-forecast")}
        platform="ruby"
      />
    );

    expect(screen.getByText("MO-6201 created")).toBeInTheDocument();
    expect(screen.getByText("8,000 cups")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Higher demand" }));
    expect(screen.getByText("10,000 cups")).toBeInTheDocument();
    expect(screen.getByText("1,000 cups above capacity")).toBeInTheDocument();
  });

  it("updates the refrigerated collection view as deliveries are selected", () => {
    render(
      <MeadowColdChainTransportExplorer
        scenario={scenario("meadow-cold-chain-alert")}
        platform="ruby"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /DL-219/u }));
    expect(screen.getByText("Milwaukee")).toBeInTheDocument();
    expect(screen.getByText("11:15 AM")).toBeInTheDocument();
    expect(screen.getByText("Carrier C-219")).toBeInTheDocument();
  });

  it("keeps the packing handoff steps selectable", () => {
    render(
      <MeadowPackingListFlow
        scenario={scenario("meadow-batch-traceability")}
        platform="ruby"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Warehouse handoff/u }));
    expect(
      screen.getByRole("button", { name: /Warehouse handoff/u })
    ).toHaveTextContent("Picking instructions | Link sent");
    expect(screen.getByText("Posted in Teams")).toBeInTheDocument();
  });

  it("shows reassigned workload steps and their update systems", () => {
    render(
      <MeadowWorkloadTimeline
        scenario={scenario("meadow-production-schedule")}
        platform="ruby"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Packaging count/u }));
    expect(
      screen.getByRole("button", { name: /Packaging count.*Michael → Lena/u })
    ).toBeInTheDocument();
    expect(screen.getByText("Reassigned in Asana")).toBeInTheDocument();
  });

  it("provides a six-slide cheese presentation with local controls", () => {
    render(
      <MeadowCheeseRecipePresentation
        scenario={scenario("meadow-supplier-certificate-audit")}
        platform="ruby"
      />
    );

    expect(screen.getByText("New herb cheese")).toBeInTheDocument();
    expect(screen.getByText("Created in Gamma")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(screen.getByText("What changed")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Sources for this slide"));
    expect(screen.getByText("Previous approved trial")).toBeInTheDocument();
  });

  it("marks the placed supplier quote and compares alternatives", () => {
    render(
      <MeadowSupplierQuoteComparison
        scenario={scenario("meadow-energy-cost-review")}
        platform="ruby"
      />
    );

    expect(screen.getByText("PO-645 placed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "ClearPack" }));
    expect(screen.getByText("Comparison only")).toBeInTheDocument();
    expect(screen.getByText("$2,340")).toBeInTheDocument();
  });
});
