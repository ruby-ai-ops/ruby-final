// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeTeamUsageSection } from "./HomeTeamUsageSection";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));

vi.mock("@marketing/components/home/ContentComponents", () => ({
  H2: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
}));

vi.mock("@marketing/components/home/content/Product/HomeEyebrow", () => ({
  HomeEyebrow: ({ label }: { label: string }) => <span>{label}</span>,
}));

vi.mock("@marketing/components/home/content/Product/HomeReveal", () => ({
  HomeReveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock(
  "@marketing/components/home/content/Product/HomeSolutionCatalog",
  () => ({
    HomeSolutionCatalog: () => <div data-testid="solution-catalog" />,
  })
);

vi.mock("@marketing/components/home/content/Product/HomeWorkspaceDemo", () => ({
  HomeWorkspaceDemo: () => <div data-testid="desktop-workspace-demo" />,
}));

class MockMediaQueryList extends EventTarget {
  matches = false;
  media = "(prefers-reduced-motion: reduce)";
  onchange = null;

  addListener(listener: EventListener) {
    this.addEventListener("change", listener);
  }

  removeListener(listener: EventListener) {
    this.removeEventListener("change", listener);
  }

  setMatches(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(new Event("change"));
  }
}

let mediaQuery: MockMediaQueryList;
let documentHidden = false;

function getActiveTab() {
  const activeTab = screen
    .getAllByRole("tab")
    .find((tab) => tab.getAttribute("aria-selected") === "true");

  if (!activeTab) {
    throw new Error("Expected an active team tab");
  }

  return activeTab;
}

function getActiveProgress() {
  return getActiveTab().querySelector<HTMLElement>(".home-team-tab-progress");
}

function finishPanelTransition() {
  act(() => vi.advanceTimersByTime(300));
}

function setTabListLayout(
  tabList: HTMLElement,
  tab: HTMLElement,
  tabOffsetLeft: number
) {
  Object.defineProperties(tabList, {
    clientWidth: { configurable: true, value: 200 },
    scrollWidth: { configurable: true, value: 600 },
  });
  Object.defineProperties(tab, {
    offsetLeft: { configurable: true, value: tabOffsetLeft },
    offsetWidth: { configurable: true, value: 100 },
  });

  const scrollTo = vi.fn();
  Object.defineProperty(tabList, "scrollTo", {
    configurable: true,
    value: scrollTo,
  });
  return scrollTo;
}

describe("HomeTeamUsageSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mediaQuery = new MockMediaQueryList();
    documentHidden = false;

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => mediaQuery),
    });
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => documentHidden,
    });
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("keeps the mobile team panel and catalog while adding the desktop workspace", () => {
    render(<HomeTeamUsageSection />);

    expect(screen.queryByTestId("desktop-workspace-demo")).not.toBeNull();
    expect(
      screen.getByRole("tablist").closest("[data-mobile-team-panel]")
    ).not.toBeNull();
    expect(screen.queryByTestId("solution-catalog")).not.toBeNull();
  });

  it("supports wrapping Arrow, Home, and End keyboard navigation", () => {
    render(<HomeTeamUsageSection />);

    const sales = screen.getByRole("tab", { name: "Sales" });
    const support = screen.getByRole("tab", { name: "Customer Support" });
    const engineering = screen.getByRole("tab", { name: "Engineering" });

    act(() => sales.focus());
    fireEvent.keyDown(sales, { key: "ArrowRight" });
    expect(support.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(support);

    finishPanelTransition();
    fireEvent.keyDown(support, { key: "End" });
    expect(engineering.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(engineering);

    finishPanelTransition();
    fireEvent.keyDown(engineering, { key: "Home" });
    expect(sales.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(sales);

    finishPanelTransition();
    fireEvent.keyDown(sales, { key: "ArrowLeft" });
    expect(engineering.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(engineering);
  });

  it("marks only the active tab with the animated gradient underline", () => {
    render(<HomeTeamUsageSection />);

    const sales = screen.getByRole("tab", { name: "Sales" });
    const support = screen.getByRole("tab", { name: "Customer Support" });

    expect(sales.classList.contains("font-semibold")).toBe(true);
    expect(sales.classList.contains("text-foreground")).toBe(true);
    expect(sales.querySelector(".home-team-tab-underline")).not.toBeNull();
    expect(sales.querySelector(".home-team-tab-shimmer")).not.toBeNull();
    expect(support.querySelector(".home-team-tab-underline")).toBeNull();

    fireEvent.click(support);
    expect(support.getAttribute("aria-selected")).toBe("true");
    expect(support.querySelector(".home-team-tab-underline")).not.toBeNull();
    expect(support.querySelector(".home-team-tab-shimmer")).not.toBeNull();
    expect(sales.querySelector(".home-team-tab-underline")).toBeNull();
  });

  it("advances on progress completion and loops Engineering to Sales", () => {
    render(<HomeTeamUsageSection />);

    for (const nextLabel of [
      "Customer Support",
      "Marketing & Content",
      "Data & Analytics",
      "Engineering",
      "Sales",
    ]) {
      const progress = getActiveProgress();
      if (!progress) {
        throw new Error("Expected active autoplay progress");
      }
      fireEvent.animationEnd(progress);
      expect(getActiveTab().textContent).toContain(nextLabel);
      finishPanelTransition();
    }
  });

  it("keeps running for pointer while pausing for focus and document visibility", () => {
    const { container } = render(<HomeTeamUsageSection />);
    const section = container.querySelector("#team-use-cases");
    const activeTab = getActiveTab();

    if (!section) {
      throw new Error("Expected team use section");
    }
    expect(getActiveProgress()?.style.animationPlayState).toBe("running");

    fireEvent.pointerEnter(section);
    expect(getActiveProgress()?.style.animationPlayState).toBe("running");

    fireEvent.pointerLeave(section);
    expect(getActiveProgress()?.style.animationPlayState).toBe("running");

    fireEvent.focus(activeTab);
    expect(getActiveProgress()?.style.animationPlayState).toBe("paused");

    fireEvent.blur(activeTab, { relatedTarget: document.body });
    expect(getActiveProgress()?.style.animationPlayState).toBe("running");

    documentHidden = true;
    fireEvent(document, new Event("visibilitychange"));
    expect(getActiveProgress()?.style.animationPlayState).toBe("paused");

    documentHidden = false;
    fireEvent(document, new Event("visibilitychange"));
    expect(getActiveProgress()?.style.animationPlayState).toBe("running");
  });

  it("disables autoplay for reduced motion while keeping manual tabs usable", () => {
    mediaQuery.setMatches(true);
    render(<HomeTeamUsageSection />);

    expect(getActiveProgress()).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Engineering" }));
    expect(getActiveTab().textContent).toContain("Engineering");
    expect(getActiveProgress()).toBeNull();
    expect(document.querySelectorAll(".home-team-slide")).toHaveLength(1);
    expect(document.querySelectorAll(".home-team-img-slide")).toHaveLength(1);
  });

  it("clears an in-flight outgoing panel when reduced motion becomes preferred", () => {
    render(<HomeTeamUsageSection />);

    fireEvent.click(screen.getByRole("tab", { name: "Engineering" }));
    expect(document.querySelectorAll(".home-team-slide")).toHaveLength(2);
    expect(document.querySelectorAll(".home-team-img-slide")).toHaveLength(2);

    act(() => mediaQuery.setMatches(true));

    expect(getActiveTab().textContent).toContain("Engineering");
    expect(document.querySelectorAll(".home-team-slide")).toHaveLength(1);
    expect(document.querySelectorAll(".home-team-img-slide")).toHaveLength(1);
    expect(getActiveProgress()).toBeNull();
  });

  it("defers reduced-motion detection until after the initial render", () => {
    const matchMedia = vi.fn(() => mediaQuery);
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: matchMedia,
    });

    renderToString(<HomeTeamUsageSection />);

    expect(matchMedia).not.toHaveBeenCalled();
  });

  it("restarts progress when the active tab is selected again", () => {
    render(<HomeTeamUsageSection />);

    const initialProgress = getActiveProgress();
    fireEvent.click(screen.getByRole("tab", { name: "Sales" }));

    expect(getActiveProgress()).not.toBe(initialProgress);
  });

  it("keeps the current marketing capability copy in the responsive panel", () => {
    render(<HomeTeamUsageSection />);

    fireEvent.click(screen.getByRole("tab", { name: "Marketing & Content" }));

    expect(
      screen.getAllByText("Campaign-ready before the meeting.").length
    ).toBeGreaterThan(0);
  });

  it("centers the selected tab after manual selection and autoplay", () => {
    render(<HomeTeamUsageSection />);

    const tabList = screen.getByRole("tablist");
    const engineering = screen.getByRole("tab", { name: "Engineering" });
    const manualScrollTo = setTabListLayout(tabList, engineering, 400);

    fireEvent.click(engineering);
    expect(manualScrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      left: 350,
    });

    finishPanelTransition();
    const sales = screen.getByRole("tab", { name: "Sales" });
    const autoplayScrollTo = setTabListLayout(tabList, sales, 240);
    const progress = getActiveProgress();
    if (!progress) {
      throw new Error("Expected active autoplay progress");
    }

    fireEvent.animationEnd(progress);
    expect(autoplayScrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      left: 190,
    });
  });

  it("centers manual selections immediately when reduced motion is preferred", () => {
    mediaQuery.setMatches(true);
    render(<HomeTeamUsageSection />);

    const tabList = screen.getByRole("tablist");
    const engineering = screen.getByRole("tab", { name: "Engineering" });
    const scrollTo = setTabListLayout(tabList, engineering, 400);

    fireEvent.click(engineering);
    expect(scrollTo).toHaveBeenCalledWith({
      behavior: "auto",
      left: 350,
    });
  });

  it("uses immediate positioning for its first reduced-motion centering scroll", () => {
    mediaQuery.setMatches(true);
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });

    render(<HomeTeamUsageSection />);

    expect(scrollTo.mock.calls[0]).toEqual([{ behavior: "auto", left: 0 }]);
  });
});
