import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getCompanyScenarios } from "../../upstream/app/demo-scenarios";
import {
  VectorCloudSpendBreakdown,
  VectorCustomerSetupAgent,
  VectorDataIsolationReview,
  VectorDocumentationDriftComparison,
  VectorFeedbackInbox,
  VectorMobileSignupExplorer,
} from "../src/vector-widgets";
import { workspaceConversationScenario } from "../src/scenario-overrides";

const vector = getCompanyScenarios("vector");
afterEach(cleanup);

function scenario(id: string) {
  const original = vector.find((item) => item.id === id);
  if (!original) {
    throw new Error(`Missing Vector fixture ${id}`);
  }
  return workspaceConversationScenario(original);
}

describe("Vector preserved widget families", () => {
  it("shows a completed customer setup agent and a safe replay state", () => {
    render(
      <VectorCustomerSetupAgent
        scenario={scenario("vector-internal-tool-prototype")}
        platform="ruby"
      />
    );
    expect(screen.getByText(/customer setup agent/i)).toBeInTheDocument();
    expect(screen.getByText(/WS-208/u)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Replay setup" }));
    expect(
      screen.getByText("Replay returned existing workspace")
    ).toBeInTheDocument();
  });

  it("keeps the code review file selector interactive", () => {
    render(
      <VectorDataIsolationReview
        scenario={scenario("vector-pull-request-review")}
        platform="ruby"
      />
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Review src/export-job.ts" })
    );
    expect(screen.getAllByText("src/export-job.ts").length).toBeGreaterThan(1);
    expect(
      screen.getByText(/account scope is checked before reading a job result/i)
    ).toBeInTheDocument();
  });

  it("keeps the release comparison interactive and exposes the held decision", () => {
    render(
      <VectorMobileSignupExplorer
        scenario={scenario("vector-regression-explorer")}
        platform="ruby"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Release candidate" }));
    expect(screen.getByText("11 of 12 checks passed")).toBeInTheDocument();
    expect(
      screen.getByText("Release held for one small-screen fix.")
    ).toBeInTheDocument();
  });

  it("keeps the documentation correction action local", () => {
    render(
      <VectorDocumentationDriftComparison
        scenario={scenario("vector-documentation-drift")}
        platform="ruby"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Accept correction" }));
    expect(screen.getByText("Documentation updated")).toBeInTheDocument();
  });

  it("keeps the cloud spend comparison selectable", () => {
    render(
      <VectorCloudSpendBreakdown
        scenario={scenario("vector-cloud-spend-guard")}
        platform="ruby"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "After changes" }));
    expect(screen.getByText("$98k projected monthly")).toBeInTheDocument();
    expect(screen.getByText("$27k reduction")).toBeInTheDocument();
  });

  it("keeps feedback source tabs and issue creation interactive", () => {
    render(
      <VectorFeedbackInbox
        scenario={scenario("vector-feedback-signal-map")}
        platform="ruby"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Test runs" }));
    expect(screen.getByText(/2 reproduced/u)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Create Linear issues" })
    );
    expect(screen.getByText("3 Linear issues created")).toBeInTheDocument();
  });
});
