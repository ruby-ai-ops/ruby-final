import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AutoplayComposerControl,
  WorkspaceAutoplayProvider,
  buildOrderedTour,
  didTourWrap,
  getCurrentTourPosition,
  getNextTourEntry,
  useWorkspaceAutoplay,
  type AutoplayNavigation,
  type WorkspacePlatform,
} from "../src/autoplay";
import { workspaceCompanyScenarios } from "../src/scenario-overrides";

const companyIds = [
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

const expectedTour = [
  "everglade:everglade-sla-risk-command",
  "everglade:everglade-missed-pickup-recovery",
  "everglade:everglade-carrier-claim-packet",
  "everglade:everglade-freight-cost-spike",
  "everglade:everglade-warehouse-incident",
  "everglade:everglade-customer-escalation",
  "everglade:everglade-capacity-forecast",
  "everglade:everglade-daily-ops-briefing",
  "everglade:everglade-supplier-onboarding",
  "everglade:everglade-fleet-launch-deck",
  "meadow:meadow-demand-forecast",
  "meadow:meadow-recall-simulation",
  "meadow:meadow-quality-deviation",
  "meadow:meadow-cold-chain-alert",
  "meadow:meadow-batch-traceability",
  "meadow:meadow-production-schedule",
  "meadow:meadow-supplier-certificate-audit",
  "meadow:meadow-plant-maintenance-triage",
  "meadow:meadow-energy-cost-review",
  "meadow:meadow-weekly-plant-report",
  "ledger:ledger-month-end-command",
  "ledger:ledger-invoice-chase",
  "ledger:ledger-cash-forecast",
  "ledger:ledger-expense-anomaly",
  "ledger:ledger-cloud-cost-allocation",
  "ledger:ledger-audit-evidence-binder",
  "ledger:ledger-board-reporting",
  "ledger:ledger-duplicate-ap-detection",
  "ledger:ledger-revenue-reconciliation",
  "ledger:ledger-finance-policy-q-a",
  "loom:loom-replenishment-watch",
  "loom:loom-campaign-launch",
  "loom:loom-journey-drop-off",
  "loom:loom-vip-outreach",
  "loom:loom-returns-diagnosis",
  "loom:loom-store-staffing",
  "loom:loom-product-launch-room",
  "loom:loom-social-content-board",
  "loom:loom-review-insight-digest",
  "loom:loom-weekly-trade-report",
  "cartly:cartly-cart-recovery",
  "cartly:cartly-fraud-signal-review",
  "cartly:cartly-support-swarm",
  "cartly:cartly-seo-opportunity-map",
  "cartly:cartly-campaign-roas",
  "cartly:cartly-supplier-delay-recovery",
  "cartly:cartly-competitor-price-watch",
  "cartly:cartly-revenue-cohort-explorer",
  "cartly:cartly-creator-event-ops",
  "cartly:cartly-commerce-qbr",
  "vector:vector-internal-tool-prototype",
  "vector:vector-incident-root-cause",
  "vector:vector-pull-request-review",
  "vector:vector-roadmap-reconciliation",
  "vector:vector-database-debugger",
  "vector:vector-documentation-drift",
  "vector:vector-cloud-spend-guard",
  "vector:vector-regression-explorer",
  "vector:vector-feedback-signal-map",
  "vector:vector-release-communication",
  "stonebridge:stonebridge-schedule-recovery",
  "stonebridge:stonebridge-site-safety-brief",
  "stonebridge:stonebridge-subcontractor-readiness",
  "stonebridge:stonebridge-cost-overrun-analysis",
  "stonebridge:stonebridge-crew-allocation",
  "stonebridge:stonebridge-rfi-decision-pack",
  "stonebridge:stonebridge-vendor-quote-compare",
  "stonebridge:stonebridge-daily-site-brief",
  "stonebridge:stonebridge-client-progress-pack",
  "stonebridge:stonebridge-warranty-escalation",
  "northstar:northstar-contract-risk-scan",
  "northstar:northstar-nda-signature-flow",
  "northstar:northstar-privacy-review",
  "northstar:northstar-litigation-chronology",
  "northstar:northstar-clause-precedent-finder",
  "northstar:northstar-client-intake",
  "northstar:northstar-regulatory-watch",
  "northstar:northstar-matter-staffing",
  "northstar:northstar-invoice-review",
  "northstar:northstar-board-memo",
  "harborview:harborview-no-show-recovery",
  "harborview:harborview-referral-intake",
  "harborview:harborview-policy-answer",
  "harborview:harborview-staff-rota",
  "harborview:harborview-equipment-ticket-triage",
  "harborview:harborview-quality-meeting-actions",
  "harborview:harborview-compliance-evidence-pack",
  "harborview:harborview-service-feedback",
  "harborview:harborview-operations-dashboard",
  "harborview:harborview-board-operations-pack",
  "keyline:keyline-lead-to-viewing",
  "keyline:keyline-maintenance-dispatch",
  "keyline:keyline-lease-renewal-flow",
  "keyline:keyline-delinquency-recovery",
  "keyline:keyline-portfolio-dashboard",
  "keyline:keyline-listing-refresh",
  "keyline:keyline-vendor-quote-review",
  "keyline:keyline-inspection-pack",
  "keyline:keyline-owner-update",
  "keyline:keyline-resident-escalation",
  "talentspring:talentspring-candidate-shortlist",
  "talentspring:talentspring-interview-scheduler",
  "talentspring:talentspring-interview-synthesis",
  "talentspring:talentspring-hiring-manager-brief",
  "talentspring:talentspring-sourcing-campaign",
  "talentspring:talentspring-job-launch",
  "talentspring:talentspring-candidate-experience",
  "talentspring:talentspring-workforce-capacity",
  "talentspring:talentspring-offer-packet",
  "talentspring:talentspring-onboarding-launch",
  "cedarshield:cedarshield-claim-triage",
  "cedarshield:cedarshield-renewal-brief",
  "cedarshield:cedarshield-fraud-investigation",
  "cedarshield:cedarshield-policy-comparison",
  "cedarshield:cedarshield-broker-call-pack",
  "cedarshield:cedarshield-compliance-approval",
  "cedarshield:cedarshield-catastrophe-response",
  "cedarshield:cedarshield-claims-sla-dashboard",
  "cedarshield:cedarshield-client-qbr",
  "cedarshield:cedarshield-broker-coaching",
] as const;

let reducedMotion = false;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
  reducedMotion = false;
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" && reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: "visible",
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function advance(ms: number) {
  act(() => vi.advanceTimersByTime(ms));
}

interface HarnessProps {
  initialIndex?: number;
  navigations: AutoplayNavigation[];
  children?: ReactNode;
}

function Harness({ initialIndex = 0, navigations, children }: HarnessProps) {
  const tour = buildOrderedTour(companyIds);
  const [selection, setSelection] = useState(tour[initialIndex]);
  const [platform, setPlatform] = useState<WorkspacePlatform>("ruby");
  const scenario = workspaceCompanyScenarios(selection.companyId).find(
    (item) => item.id === selection.scenarioId
  );
  if (!scenario) {
    throw new Error(`Missing scenario ${selection.scenarioId}`);
  }

  return (
    <WorkspaceAutoplayProvider
      orderedCompanyIds={companyIds}
      activeCompanyId={selection.companyId}
      activeScenario={scenario}
      activePlatform={platform}
      restored
      onNavigate={(next) => {
        navigations.push(next);
        setSelection(next);
      }}
    >
      <HarnessControls
        tour={tour}
        selection={selection}
        setSelection={setSelection}
        setPlatform={setPlatform}
      />
      {children}
    </WorkspaceAutoplayProvider>
  );
}

interface HarnessControlsProps {
  tour: AutoplayNavigation[];
  selection: AutoplayNavigation;
  setSelection: (selection: AutoplayNavigation) => void;
  setPlatform: (platform: WorkspacePlatform) => void;
}

function HarnessControls({
  tour,
  selection,
  setSelection,
  setPlatform,
}: HarnessControlsProps) {
  const autoplay = useWorkspaceAutoplay();
  const select = (next: AutoplayNavigation) => {
    autoplay.notifyManualNavigation(next.companyId, next.scenarioId);
    setSelection(next);
  };
  return (
    <>
      <AutoplayComposerControl />
      <span data-testid="mode">{autoplay.mode}</span>
      <span data-testid="status">{autoplay.status}</span>
      <button type="button" onClick={() => select(tour[1])}>
        Second chat
      </button>
      <button type="button" onClick={() => select(tour[0])}>
        First chat
      </button>
      <button type="button" onClick={() => select(tour[tour.length - 1])}>
        Last chat
      </button>
      <button type="button" onClick={() => select(selection)}>
        Current chat
      </button>
      <button
        type="button"
        data-autoplay-platform-control=""
        onClick={() => setPlatform("slack")}
      >
        Slack
      </button>
      <button
        type="button"
        onClick={() =>
          autoplay.setScrollPosition(selection.scenarioId, "ruby", 42)
        }
      >
        Save scroll
      </button>
      <span data-testid="scroll">
        {autoplay.getScrollPosition(selection.scenarioId, "ruby") ?? "missing"}
      </span>
    </>
  );
}

describe("workspace autoplay tour", () => {
  it("builds the literal 120-entry unique display-order tour and wraps across workspaces", () => {
    const tour = buildOrderedTour(companyIds);
    expect(
      tour.map(({ companyId, scenarioId }) => `${companyId}:${scenarioId}`)
    ).toEqual(expectedTour);
    expect(tour).toHaveLength(120);
    expect(new Set(tour.map(({ scenarioId }) => scenarioId)).size).toBe(120);
    expect(
      getCurrentTourPosition(tour, "everglade", "everglade-fleet-launch-deck")
    ).toBe(10);
    expect(
      getNextTourEntry(tour, "everglade", "everglade-fleet-launch-deck")
    ).toEqual(tour[10]);
    expect(
      getNextTourEntry(tour, "cedarshield", "cedarshield-broker-coaching")
    ).toEqual(tour[0]);
    expect(
      didTourWrap(tour, "cedarshield", "cedarshield-broker-coaching")
    ).toBe(true);
  });
});

describe("WorkspaceAutoplayProvider", () => {
  it("advances after 5850ms streaming and 3000ms reading", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    advance(5849);
    expect(screen.getByTestId("mode")).toHaveTextContent("streaming");
    advance(1);
    expect(screen.getByTestId("mode")).toHaveTextContent("complete");
    advance(2999);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toEqual([buildOrderedTour(companyIds)[1]]);
  });

  it("freezes elapsed time while explicitly paused and resumes it on Play", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    advance(3000);
    fireEvent.click(screen.getByRole("button", { name: "Pause autoplay" }));
    advance(20000);
    expect(navigations).toHaveLength(0);
    expect(screen.getByTestId("mode")).toHaveTextContent("streaming");
    fireEvent.click(screen.getByRole("button", { name: "Play autoplay" }));
    advance(5849);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("waits for 8000ms after the latest user activity without adding another read delay", () => {
    const navigations: AutoplayNavigation[] = [];
    const view = render(<Harness navigations={navigations} />);
    advance(8000);
    fireEvent.wheel(
      view.container.querySelector("[data-autoplay-boundary]") ?? view.container
    );
    advance(850);
    expect(screen.getByTestId("status")).toHaveTextContent(
      "waiting-for-inactivity"
    );
    advance(3000);
    fireEvent.keyDown(
      view.container.querySelector("[data-autoplay-boundary]") ??
        view.container,
      { key: "Tab" }
    );
    advance(7999);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("shows completed revisits immediately and restarts the selected chat", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    advance(5850);
    fireEvent.click(screen.getByRole("button", { name: "Second chat" }));
    expect(screen.getByTestId("mode")).toHaveTextContent("streaming");
    fireEvent.click(screen.getByRole("button", { name: "First chat" }));
    expect(screen.getByTestId("mode")).toHaveTextContent("complete");
    fireEvent.click(screen.getByRole("button", { name: "Current chat" }));
    expect(screen.getByTestId("mode")).toHaveTextContent("streaming");
  });

  it("defaults reduced motion to complete and paused, then advances without streaming", () => {
    reducedMotion = true;
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    expect(screen.getByTestId("mode")).toHaveTextContent("complete");
    fireEvent.click(screen.getByRole("button", { name: "Play autoplay" }));
    expect(screen.getByTestId("mode")).toHaveTextContent("complete");
    advance(2999);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("freezes for document invisibility and resumes without background catch-up", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    advance(2000);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    fireEvent(document, new Event("visibilitychange"));
    advance(30000);
    expect(navigations).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: "Pause autoplay" })
    ).toHaveAccessibleDescription(/waiting for visibility/i);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    fireEvent(document, new Event("visibilitychange"));
    advance(6849);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("preserves an in-progress run across excluded platform changes", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    advance(3000);
    fireEvent.click(screen.getByRole("button", { name: "Slack" }));
    advance(5849);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("resets reading after a completed platform change", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    advance(7000);
    fireEvent.click(screen.getByRole("button", { name: "Slack" }));
    advance(2999);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("renders an accessible outlined pill with a stable 1 / 120 counter", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    const control = screen.getByRole("button", { name: "Pause autoplay" });
    expect(control).toHaveAccessibleDescription(
      /conversation 1 of 120.*streaming/i
    );
    expect(control).toHaveClass("autoplay-composer-control");
    expect(screen.getByText("1 / 120")).toHaveClass(
      "autoplay-composer-counter"
    );
    fireEvent.wheel(control);
    advance(8850);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("blocks advancement for editable focus and starts inactivity timing when focus leaves", () => {
    const navigations: AutoplayNavigation[] = [];
    render(
      <Harness navigations={navigations}>
        <input aria-label="Widget editor" />
      </Harness>
    );
    const input = screen.getByRole("textbox", { name: "Widget editor" });
    act(() => input.focus());
    advance(30000);
    expect(navigations).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
    act(() => input.blur());
    advance(7999);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("does not block autoplay for an inactive mobile drawer shell", () => {
    const navigations: AutoplayNavigation[] = [];
    render(
      <Harness navigations={navigations}>
        <div className="mobile-drawer" aria-hidden="true" />
      </Harness>
    );
    advance(8850);
    advance(70);
    expect(navigations).toHaveLength(1);
  });

  it("clears completion history on wrap so the first entry streams again", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    advance(5850);
    fireEvent.click(screen.getByRole("button", { name: "Last chat" }));
    advance(8850);
    advance(70);
    expect(navigations.at(-1)).toEqual(buildOrderedTour(companyIds)[0]);
    expect(screen.getByTestId("mode")).toHaveTextContent("streaming");
  });

  it("freezes and resumes active time only for trusted host visibility messages", () => {
    const parentFrame = document.createElement("iframe");
    document.body.append(parentFrame);
    const parentWindow = parentFrame.contentWindow;
    if (!parentWindow) {
      throw new Error("Missing parent test window");
    }
    vi.stubGlobal("parent", parentWindow);
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);

    fireEvent(
      window,
      new MessageEvent("message", {
        origin: "https://untrusted.example",
        source: parentWindow,
        data: { type: "workspace-demo:visibility", visible: true },
      })
    );
    advance(8850);
    expect(navigations).toHaveLength(0);

    const sendHostVisibility = (visible: boolean) => {
      fireEvent(
        window,
        new MessageEvent("message", {
          origin: window.location.origin,
          source: parentWindow,
          data: { type: "workspace-demo:visibility", visible },
        })
      );
    };
    sendHostVisibility(true);
    advance(2000);
    sendHostVisibility(false);
    advance(30000);
    expect(navigations).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: "Pause autoplay" })
    ).toHaveAccessibleDescription(/waiting for visibility/i);
    sendHostVisibility(true);
    advance(6849);
    expect(navigations).toHaveLength(0);
    advance(1);
    advance(70);
    expect(navigations).toHaveLength(1);
    parentFrame.remove();
  });

  it("keeps per-scenario and platform scroll positions in provider session memory", () => {
    const navigations: AutoplayNavigation[] = [];
    render(<Harness navigations={navigations} />);
    expect(screen.getByTestId("scroll")).toHaveTextContent("missing");
    fireEvent.click(screen.getByRole("button", { name: "Save scroll" }));
    expect(screen.getByTestId("scroll")).toHaveTextContent("42");
    fireEvent.click(screen.getByRole("button", { name: "Second chat" }));
    expect(screen.getByTestId("scroll")).toHaveTextContent("missing");
    fireEvent.click(screen.getByRole("button", { name: "First chat" }));
    expect(screen.getByTestId("scroll")).toHaveTextContent("42");
  });
});
