import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getCompanyScenarios } from "../../upstream/app/demo-scenarios";
import {
  RemainingCartlyHomepageProducts,
  RemainingHarborviewTrainingGuides,
  RemainingKeylineOfferNegotiation,
  RemainingKeylineStaleListings,
  RemainingLedgerAccountOpening,
  RemainingLedgerBranchCash,
  RemainingLedgerMerchantSettlement,
} from "../src/remaining-industry-widgets";
import { workspaceConversationScenario } from "../src/scenario-overrides";

afterEach(cleanup);

function scenario(companyId: string, id: string) {
  const original = getCompanyScenarios(companyId).find(
    (item) => item.id === id
  );
  if (!original) {
    throw new Error(`Missing fixture ${companyId}/${id}`);
  }
  return workspaceConversationScenario(original);
}

describe("remaining-industry content adapters", () => {
  it("presents account opening as a compact progress overview", () => {
    render(
      <RemainingLedgerAccountOpening
        scenario={scenario("ledger", "ledger-month-end-command")}
        platform="ruby"
      />
    );
    expect(screen.getByText("Account opening")).toBeInTheDocument();
    expect(screen.getByText("Acme Retail")).toBeInTheDocument();
    expect(screen.getByText("2 accounts ready")).toBeInTheDocument();
    expect(screen.getByText("1 approval needed")).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: "Account opening progress" })
    ).toBeInTheDocument();
    for (const step of [
      "Identity checked",
      "Approval attached",
      "Accounts opened",
      "Welcome sent",
    ]) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
    expect(screen.getByText("River Market")).toBeInTheDocument();
    expect(screen.getByText("Approval missing")).toBeInTheDocument();
    expect(screen.getByText("Attach approval")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Attach approval" }));
    expect(
      screen.queryByRole("button", { name: "Accounts opened" })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("account-opening-decision")).toHaveClass(
      "is-complete"
    );
    expect(screen.getByRole("status")).toHaveTextContent("Accounts opened");
  });

  it("keeps the homepage campaign controls while showing product exposure", () => {
    render(
      <RemainingCartlyHomepageProducts
        scenario={scenario("cartly", "cartly-campaign-roas")}
        platform="ruby"
      />
    );
    expect(screen.getByText("Homepage product proposal")).toBeInTheDocument();
    expect(screen.getByText("Travel charger")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Preview homepage proposal" })
    ).toBeInTheDocument();
  });

  it("keeps training assignments in the existing coverage grid", () => {
    render(
      <RemainingHarborviewTrainingGuides
        scenario={scenario("harborview", "harborview-staff-rota")}
        platform="ruby"
      />
    );
    expect(screen.getByText("Training guide assignments")).toBeInTheDocument();
    expect(screen.getByText("Ward nurse")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Apply training plan" })
    );
    expect(screen.getByText("Training plan applied")).toBeInTheDocument();
  });

  it("keeps the quote slider interaction while showing a house counteroffer", () => {
    render(
      <RemainingKeylineOfferNegotiation
        scenario={scenario("keyline", "keyline-vendor-quote-review")}
        platform="ruby"
      />
    );
    expect(screen.getByText("Counteroffer proposal")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Proposed house price")).toBeInTheDocument();
  });

  it("keeps the portfolio card selection while showing stale-listing work", () => {
    render(
      <RemainingKeylineStaleListings
        scenario={scenario("keyline", "keyline-portfolio-dashboard")}
        platform="ruby"
      />
    );
    expect(screen.getByText("Stale listings")).toBeInTheDocument();
    expect(screen.getByText("Maple Street")).toBeInTheDocument();
  });

  it("keeps the thirteen-week cash controls for branch planning", () => {
    render(
      <RemainingLedgerBranchCash
        scenario={scenario("ledger", "ledger-cash-forecast")}
        platform="ruby"
      />
    );
    expect(screen.getByText("Branch cash plan")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Branch" })
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Preview cash movement" })
    );
    expect(
      screen.getByRole("button", { name: "Cash plan previewed" })
    ).toBeInTheDocument();
  });

  it("keeps the settlement waterfall while explaining a merchant deposit", () => {
    render(
      <RemainingLedgerMerchantSettlement
        scenario={scenario("ledger", "ledger-revenue-reconciliation")}
        platform="ruby"
      />
    );
    expect(screen.getByText("Merchant settlement")).toBeInTheDocument();
    expect(screen.getAllByText("Bank deposit")).not.toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Send explanation" }));
    expect(
      screen.getByRole("button", { name: "Explanation sent" })
    ).toBeInTheDocument();
  });
});
