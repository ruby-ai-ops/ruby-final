import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup } from "@testing-library/react";
import { getCompanyScenarios } from "../../upstream/app/demo-scenarios";
import {
  NorthstarClientIntakeMatrix,
  NorthstarConsultationScheduler,
  NorthstarDatedDocuments,
  NorthstarDraftInvoiceReview,
  NorthstarSignedAgreements,
  NorthstarTimeEntryMatrix,
} from "../src/northstar-widgets";
import { workspaceConversationScenario } from "../src/scenario-overrides";

const northstar = getCompanyScenarios("northstar");
afterEach(cleanup);

function scenario(id: string) {
  const original = northstar.find((item) => item.id === id);
  if (!original) {
    throw new Error(`Missing fixture ${id}`);
  }
  return workspaceConversationScenario(original);
}

describe("Northstar content widgets", () => {
  it("shows client document statuses and preserves matrix selection", () => {
    render(
      <NorthstarClientIntakeMatrix
        scenario={scenario("northstar-privacy-review")}
        platform="ruby"
      />
    );

    expect(screen.getByText("Greenline")).toBeInTheDocument();
    expect(screen.getByText("1 missing")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Missing" }));
    expect(screen.getByRole("button", { name: "Missing" })).toHaveClass(
      "is-selected"
    );
  });

  it("flags an uncertain document date when selected", () => {
    render(
      <NorthstarDatedDocuments
        scenario={scenario("northstar-litigation-chronology")}
        platform="ruby"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Date uncertain/u }));
    expect(
      screen.getByText("Date needs review before the document is relied on.")
    ).toBeInTheDocument();
  });

  it("shows executed agreements and keeps the selected-version summary updated", () => {
    render(
      <NorthstarSignedAgreements
        scenario={scenario("northstar-clause-precedent-finder")}
        platform="ruby"
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Greenline mutual NDA/u })
    );
    expect(
      screen.getByText(
        "Selected executed version: Greenline mutual NDA · Aug 27, 2026; drafts excluded."
      )
    ).toBeInTheDocument();
  });

  it("tracks consultation invitations and confirmation status", () => {
    render(
      <NorthstarConsultationScheduler
        scenario={scenario("northstar-client-intake")}
        platform="ruby"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Wed 11:00 AM" }));
    expect(
      screen.getByText("Consultation awaiting confirmation for Wed 11:00 AM.")
    ).toBeInTheDocument();
  });

  it("shows missing time entries by person and matter", () => {
    render(
      <NorthstarTimeEntryMatrix
        scenario={scenario("northstar-matter-staffing")}
        platform="ruby"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Daniel Brooks/u }));
    expect(
      screen.getByText(
        /Daniel Brooks has 2 entries remaining for Dawson dispute/u
      )
    ).toBeInTheDocument();
  });

  it("keeps invoice filters and flags missing draft details", () => {
    render(
      <NorthstarDraftInvoiceReview
        scenario={scenario("northstar-invoice-review")}
        platform="ruby"
      />
    );

    expect(screen.getAllByTestId("invoice-row")).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "Needs attention" }));
    expect(screen.getAllByTestId("invoice-row")).toHaveLength(3);
    expect(screen.getByText("Missing work description")).toBeInTheDocument();
    expect(
      screen.getByText("Duplicate-looking research line")
    ).toBeInTheDocument();
  });
});
