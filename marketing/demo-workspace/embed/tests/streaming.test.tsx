import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Demo from "../../upstream/app/page";
// Vite's query keeps content overrides while disabling presentation timing.
import OriginalDemo from "../../upstream/app/page?unstreamed";
import { scenarioLibrary } from "../../upstream/app/demo-scenarios";
import { buildRevealSchedule, STREAM_END_MS } from "../src/streaming";
import { AUTOPLAY_READING_MS, AUTOPLAY_STREAMING_MS } from "../src/autoplay";
import {
  workspaceChatTitle,
  workspaceConversationScenario,
} from "../src/scenario-overrides";

let reduced = false;
let mobile = false;
let mobileListeners = new Set<() => void>();
const scenarios = Object.values(scenarioLibrary).flatMap((workspace) =>
  workspace.scenarios.map((scenario) => ({ companyId: workspace.id, scenario }))
);
beforeEach(() => {
  vi.useFakeTimers({
    toFake: [
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "Date",
      "performance",
      "requestAnimationFrame",
      "cancelAnimationFrame",
    ],
  });
  reduced = false;
  mobile = false;
  mobileListeners = new Set();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches:
      (query.includes("prefers-reduced-motion") && reduced) ||
      (query.includes("max-width") && mobile),
    media: query,
    addEventListener: (_event: string, listener: () => void) => {
      if (query.includes("max-width")) {
        mobileListeners.add(listener);
      }
    },
    removeEventListener: (_event: string, listener: () => void) => {
      mobileListeners.delete(listener);
    },
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
function save(companyId: string, channel: string, platform = "ruby") {
  localStorage.setItem(
    "ruby-workspace-state-v1",
    JSON.stringify({ companyId, channel, platform })
  );
}
function content(container: HTMLElement) {
  const conversation = container.querySelector(".conversation-scroll");
  if (!conversation) {
    throw new Error("Expected conversation");
  }
  return {
    text: conversation.textContent,
    images: [...conversation.querySelectorAll("img")].map((image) => [
      image.getAttribute("src"),
      image.alt,
    ]),
    controls: [
      ...conversation.querySelectorAll("button, input, select, a"),
    ].map((element) => [
      element.tagName,
      element.getAttribute("aria-label"),
      element.getAttribute("href"),
      element.textContent,
    ]),
  };
}
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function visibleWordCount(container: HTMLElement) {
  return container.querySelectorAll(
    ".demo-stream-word:not([data-stream-hidden])"
  ).length;
}

function setMobile(nextMobile: boolean) {
  act(() => {
    mobile = nextMobile;
    for (const listener of mobileListeners) {
      listener();
    }
  });
}

describe("streaming presentation", () => {
  it("integrates one autoplay boundary and an accessible composer control", () => {
    const view = render(<Demo />);
    expect(
      view.container.querySelectorAll("[data-autoplay-boundary]")
    ).toHaveLength(1);
    const control = view.getByRole("button", { name: "Pause autoplay" });
    expect(control).toHaveAccessibleDescription(
      /conversation 1 of 120.*streaming/i
    );
    expect(control.closest("fieldset")).not.toHaveAttribute("aria-disabled");
    expect(control.closest("[aria-hidden='true']")).toBeNull();
  });

  it("resumes the same stream clock across every platform direction", () => {
    const { container, getByRole } = render(<Demo />);
    advance(3200);
    expect(visibleWordCount(container)).toBeGreaterThan(0);
    for (const platform of [
      "Slack",
      "Teams",
      "Ruby",
      "Teams",
      "Slack",
    ] as const) {
      fireEvent.click(getByRole("button", { name: `Use ${platform}` }));
      expect(visibleWordCount(container), platform).toBeGreaterThan(0);
      expect(
        container.querySelectorAll(".demo-stream-word[data-stream-hidden]")
          .length,
        platform
      ).toBeGreaterThan(0);
    }
    advance(STREAM_END_MS - 3200);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("freezes reveals while paused and resumes from the same elapsed point", () => {
    const { container, getByRole } = render(<Demo />);
    advance(3200);
    const beforePause = visibleWordCount(container);
    fireEvent.click(getByRole("button", { name: "Pause autoplay" }));
    advance(3000);
    expect(visibleWordCount(container)).toBe(beforePause);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "paused"
    );
    fireEvent.click(getByRole("button", { name: "Play autoplay" }));
    advance(STREAM_END_MS - 3200);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("scopes current-chat replay to the workspace autoplay boundary", () => {
    const { container } = render(<Demo />);
    advance(STREAM_END_MS);
    const external = document.createElement("button");
    external.setAttribute("aria-current", "page");
    external.setAttribute(
      "aria-label",
      `${workspaceChatTitle(scenarios[0].scenario)} channel`
    );
    document.body.append(external);
    try {
      fireEvent.click(external);
      expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
        "data-stream-state",
        "complete"
      );
    } finally {
      external.remove();
    }
  });

  it("crossfades the old and new conversation for 140ms", () => {
    const { container } = render(<Demo />);
    const firstPrompt = workspaceConversationScenario(scenarios[0].scenario)
      .copy.userPrompt;
    const secondPrompt = workspaceConversationScenario(scenarios[1].scenario)
      .copy.userPrompt;
    advance(AUTOPLAY_STREAMING_MS + AUTOPLAY_READING_MS - 1);
    expect(container.querySelector("[data-autoplay-transition]")).toBeNull();
    advance(1);
    expect(
      container.querySelector("[data-autoplay-transition='in']")
    ).not.toBeNull();
    expect(container.querySelector(".ruby-user-message")).toHaveTextContent(
      secondPrompt
    );
    expect(
      container.querySelector("[data-autoplay-outgoing]")
    ).toHaveTextContent(firstPrompt);
    advance(139);
    expect(
      container.querySelector("[data-autoplay-transition='in']")
    ).not.toBeNull();
    expect(container.querySelector("[data-autoplay-outgoing]")).not.toBeNull();
    advance(1);
    expect(container.querySelector("[data-autoplay-transition]")).toBeNull();
    expect(container.querySelector("[data-autoplay-outgoing]")).toBeNull();
  });

  it("shows a completed revisit immediately during another active stream", () => {
    const { container, getByRole } = render(<Demo />);
    const first = scenarios[0].scenario;
    const second = scenarios[1].scenario;
    advance(STREAM_END_MS);
    fireEvent.click(
      getByRole("button", { name: `${workspaceChatTitle(second)} channel` })
    );
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "playing"
    );
    fireEvent.click(
      getByRole("button", { name: `${workspaceChatTitle(first)} channel` })
    );
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
  });

  it("keeps one controller and control when changing between desktop and mobile", () => {
    const { container, getByRole } = render(<Demo />);
    advance(3000);
    setMobile(true);
    expect(container.querySelectorAll("[data-autoplay-boundary]")).toHaveLength(
      1
    );
    expect(getByRole("button", { name: "Pause autoplay" })).toBeVisible();
    expect(container.querySelector(".mobile-workspace")).not.toBeNull();
    advance(2850);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("replays the active mobile list chat through the provider boundary", () => {
    mobile = true;
    const { container, getByRole } = render(<Demo />);
    advance(STREAM_END_MS);
    fireEvent.click(getByRole("button", { name: "Open Ruby menu" }));
    const currentChat = container.querySelector<HTMLButtonElement>(
      "[data-autoplay-current-chat]"
    );
    if (!currentChat) {
      throw new Error("Missing active mobile chat button");
    }
    fireEvent.click(currentChat);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "playing"
    );
  });

  it("guards rapid platform switches without resetting or reviving stale renderers", () => {
    const { container, getByRole } = render(<Demo />);
    advance(3000);
    for (const platform of ["Slack", "Teams", "Ruby"] as const) {
      fireEvent.click(getByRole("button", { name: `Use ${platform}` }));
    }
    advance(STREAM_END_MS - 3000);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
  });

  it("shows a completed conversation immediately after a platform switch", () => {
    const { container, getByRole } = render(<Demo />);
    advance(STREAM_END_MS);
    fireEvent.click(getByRole("button", { name: "Use Slack" }));
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
  });

  it("restores independent scroll positions while switching platforms", () => {
    const { container, getByRole } = render(<Demo />);
    const rubyScroller = container.querySelector<HTMLElement>(
      ".conversation-scroll"
    );
    if (!rubyScroller) {
      throw new Error("Missing Ruby scroller");
    }
    rubyScroller.scrollTop = 42;
    fireEvent.wheel(rubyScroller);
    fireEvent.click(getByRole("button", { name: "Use Slack" }));
    const slackScroller = container.querySelector<HTMLElement>(
      ".conversation-scroll"
    );
    if (!slackScroller) {
      throw new Error("Missing Slack scroller");
    }
    expect(slackScroller.scrollTop).toBe(0);
    slackScroller.scrollTop = 77;
    fireEvent.wheel(slackScroller);
    fireEvent.click(getByRole("button", { name: "Use Ruby" }));
    expect(
      container.querySelector<HTMLElement>(".conversation-scroll")?.scrollTop
    ).toBe(42);
    fireEvent.click(getByRole("button", { name: "Use Slack" }));
    expect(
      container.querySelector<HTMLElement>(".conversation-scroll")?.scrollTop
    ).toBe(77);
  });

  it("runs the real 120-chat tour and starts a fresh stream after wrap", () => {
    const { container, getByRole } = render(<Demo />);
    for (let index = 0; index < 120; index += 1) {
      advance(STREAM_END_MS);
      advance(AUTOPLAY_READING_MS);
      advance(140);
      const expectedPosition = ((index + 1) % 120) + 1;
      expect(
        getByRole("button", { name: "Pause autoplay" }),
        `advance ${index + 1}`
      ).toHaveAccessibleDescription(
        new RegExp(`conversation ${expectedPosition} of 120`, "i")
      );
    }
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "playing"
    );
  }, 120000);
  it("streams Teams lead-ins and places structured tables after earlier response text", () => {
    const first = scenarios[0];
    save(first.companyId, first.scenario.id, "teams");
    const teams = render(<Demo />);
    expect(
      teams.container.querySelectorAll(".teams-artifact-lead .demo-stream-word")
        .length
    ).toBeGreaterThan(1);
    teams.unmount();
    const example = scenarios.find(({ scenario }) =>
      scenario.copy.response.some((block) => block.kind === "table")
    );
    if (!example) {
      throw new Error("Missing table scenario");
    }
    save(example.companyId, example.scenario.id);
    const tableView = render(<Demo />);
    const schedule = buildRevealSchedule(
      tableView.container,
      example.scenario,
      "ruby"
    );
    const tableItem = schedule.items.find((item) =>
      item.element.classList.contains("conversation-table-wrap")
    );
    if (!tableItem) {
      throw new Error("Table reveal missing");
    }
    expect(tableItem.word).toBe(false);
    const precedingWords = schedule.items.filter(
      (item) =>
        item.word &&
        (item.element.compareDocumentPosition(tableItem.element) &
          Node.DOCUMENT_POSITION_FOLLOWING) !==
          0
    );
    expect(precedingWords.length).toBeGreaterThan(0);
    expect(precedingWords.every((item) => item.atMs < tableItem.atMs)).toBe(
      true
    );
    expect(
      tableItem.element.querySelectorAll("[data-stream-hidden]")
    ).toHaveLength(0);
  });
  it("shows prompt, thinking, cards then checks, words, artifact and original completion in order", () => {
    const { companyId, scenario } = scenarios[0];
    save(companyId, scenario.id);
    const { container } = render(<Demo />);
    const prompt = container.querySelector(".ruby-user-message");
    const card = container.querySelector(".ruby-tool-card");
    const check = card?.querySelector(".ruby-tool-check");
    expect(prompt).not.toHaveAttribute("data-stream-hidden");
    expect(card).toHaveAttribute("data-stream-hidden");
    advance(272);
    expect(container.querySelector(".demo-thinking")).toHaveTextContent(
      "Thinking…"
    );
    advance(1248);
    expect(container.querySelector(".demo-thinking")).toBeNull();
    expect(card).not.toHaveAttribute("data-stream-hidden");
    expect(check).toHaveAttribute("data-stream-hidden");
    advance(144);
    expect(check).not.toHaveAttribute("data-stream-hidden");
    advance(1200);
    expect(
      container.querySelectorAll(".demo-stream-word:not([data-stream-hidden])")
        .length
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll(".demo-stream-word[data-stream-hidden]").length
    ).toBeGreaterThan(0);
    expect(container.querySelector(".scenario-artifact")).toHaveAttribute(
      "data-stream-hidden"
    );
    advance(1300);
    expect(container.querySelector(".scenario-artifact")).not.toHaveAttribute(
      "data-stream-hidden"
    );
    expect(
      container.querySelector(".fleet-assignment-cards > article")
    ).toHaveAttribute("data-stream-hidden");
    expect(
      container.querySelector(".ruby-response-header small")
    ).toHaveAttribute("data-stream-hidden");
    advance(1840);
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
    expect(
      container.querySelector(".ruby-response-header small")
    ).toHaveTextContent(`Completed in ${scenario.duration} sec`);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("replays the selected chat, cancels stale playback on switching and does not replay on theme changes", () => {
    const { companyId, scenario } = scenarios[0];
    save(companyId, scenario.id);
    const { container, getByRole } = render(<Demo />);
    advance(6000);
    fireEvent.click(getByRole("button", { name: `Switch to dark mode` }));
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
    fireEvent.click(
      getByRole("button", {
        name: `${workspaceChatTitle(scenario)} channel`,
      })
    );
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "playing"
    );
    advance(500);
    const next = scenarios[1].scenario;
    fireEvent.click(
      getByRole("button", { name: `${workspaceChatTitle(next)} channel` })
    );
    expect(container.querySelector(".ruby-user-message")).toHaveTextContent(
      workspaceConversationScenario(next).copy.userPrompt
    );
    advance(6000);
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
  });

  it("describes recurring and attention indicators on their sidebar buttons", () => {
    const { getByRole } = render(<Demo />);
    expect(
      getByRole("button", {
        name: "Send the morning driver's brief channel",
      })
    ).toHaveAccessibleDescription("Runs every morning");
    expect(
      getByRole("button", { name: "Launch new operation channel" })
    ).toHaveAccessibleDescription("Needs attention");
  });

  it("shows the complete original immediately for reduced motion", () => {
    reduced = true;
    const { container } = render(<Demo />);
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
    expect(container.querySelector(".demo-thinking")).toBeNull();
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("waits for trusted parent visibility and replays the restored selection on refresh", () => {
    const parentFrame = document.createElement("iframe");
    document.body.append(parentFrame);
    const parentWindow = parentFrame.contentWindow;
    if (!parentWindow) {
      throw new Error("Missing parent test window");
    }
    vi.stubGlobal("parent", parentWindow);
    const saved = scenarios[12];
    save(saved.companyId, saved.scenario.id, "slack");
    const view = render(<Demo />);
    advance(7000);
    expect(view.container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "waiting"
    );
    for (const details of [
      { origin: "https://untrusted.example", source: parentWindow },
      { origin: window.location.origin, source: window },
    ]) {
      fireEvent(
        window,
        new MessageEvent("message", {
          ...details,
          data: { type: "workspace-demo:visibility", visible: true },
        })
      );
      expect(
        view.container.querySelector(".demo-stream-shell")
      ).toHaveAttribute("data-stream-state", "waiting");
    }
    fireEvent(
      window,
      new MessageEvent("message", {
        origin: window.location.origin,
        source: parentWindow,
        data: { type: "workspace-demo:visibility", visible: true },
      })
    );
    expect(view.container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "playing"
    );
    expect(
      view.container.querySelector(".slack-thread > article p")
    ).toHaveTextContent(
      workspaceConversationScenario(saved.scenario).copy.userPrompt
    );
    advance(6000);
    view.unmount();
    const refreshed = render(<Demo />);
    expect(
      refreshed.container.querySelector(".demo-stream-shell")
    ).toHaveAttribute("data-stream-state", "waiting");
    expect(
      refreshed.container.querySelectorAll("[data-stream-hidden]").length
    ).toBeGreaterThan(0);
    refreshed.unmount();
    parentFrame.remove();
  });

  it("stops following after manual scrolling and preserves artifact interaction state", () => {
    const { container } = render(<Demo />);
    const scroller = container.querySelector<HTMLElement>(
      ".conversation-scroll"
    );
    const paragraph = container.querySelector<HTMLElement>(
      ".conversation-document > p"
    );
    if (!scroller || !paragraph) {
      throw new Error("Missing scroll fixture");
    }
    vi.spyOn(scroller, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 800, 400)
    );
    vi.spyOn(paragraph, "getBoundingClientRect").mockImplementation(
      () => new DOMRect(0, 700 - scroller.scrollTop, 600, 40)
    );
    Object.defineProperty(scroller, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(scroller, "clientHeight", {
      configurable: true,
      value: 400,
    });
    advance(3000);
    expect(scroller.scrollTop).toBeGreaterThan(0);
    fireEvent.wheel(scroller);
    scroller.scrollTop = 42;
    advance(3000);
    expect(scroller.scrollTop).toBe(42);
    const button = container.querySelector<HTMLButtonElement>(
      "[data-primary-action]"
    );
    if (!button) {
      throw new Error("Missing interactive artifact button");
    }
    fireEvent.click(button);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
  });

  it("reveals everything when returning after the deadline with animation frames paused", () => {
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(1);
    const { container } = render(<Demo />);
    expect(
      container.querySelectorAll("[data-stream-hidden]").length
    ).toBeGreaterThan(0);
    advance(6000);
    fireEvent(document, new Event("visibilitychange"));
    expect(container.querySelectorAll("[data-stream-hidden]")).toHaveLength(0);
    expect(container.querySelector(".demo-stream-shell")).toHaveAttribute(
      "data-stream-state",
      "complete"
    );
  });

  it("preserves content and completes all 360 presentations within six seconds", () => {
    for (const { companyId, scenario } of scenarios) {
      for (const platform of ["ruby", "slack", "teams"] as const) {
        save(companyId, scenario.id, platform);
        const original = render(<OriginalDemo />);
        const expected = content(original.container);
        original.unmount();
        save(companyId, scenario.id, platform);
        const streamed = render(<Demo />);
        expect(
          streamed.container.querySelector(".demo-stream-shell"),
          `${scenario.id}/${platform}`
        ).toHaveAttribute("data-stream-state", "playing");
        const schedule = buildRevealSchedule(
          streamed.container,
          scenario,
          platform
        );
        expect(
          schedule.items.every((item) => item.atMs + 220 <= STREAM_END_MS),
          scenario.id
        ).toBe(true);
        advance(6000);
        expect(
          streamed.container.querySelectorAll("[data-stream-hidden]").length,
          `${scenario.id}/${platform}`
        ).toBe(0);
        expect(
          streamed.container.querySelector(".demo-thinking"),
          `${scenario.id}/${platform}`
        ).toBeNull();
        expect(
          content(streamed.container),
          `${scenario.id}/${platform}`
        ).toEqual(expected);
        streamed.unmount();
      }
    }
  }, 120000);
});
