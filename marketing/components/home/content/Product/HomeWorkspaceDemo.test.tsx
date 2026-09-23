import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomeWorkspaceDemo } from "./HomeWorkspaceDemo";

class MockMediaQueryList extends EventTarget {
  matches: boolean;
  media = "(min-width: 1024px)";
  onchange = null;

  constructor(matches: boolean) {
    super();
    this.matches = matches;
  }

  addListener(listener: EventListener) {
    this.addEventListener("change", listener);
  }

  removeListener(listener: EventListener) {
    this.removeEventListener("change", listener);
  }
}

class MockIntersectionObserver {
  static callback: IntersectionObserverCallback | null = null;
  static instances: MockIntersectionObserver[] = [];

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {}
  ) {
    MockIntersectionObserver.instances.push(this);
    if (options.rootMargin === "600px") {
      MockIntersectionObserver.callback = callback;
    }
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve() {}
  takeRecords() {
    return [];
  }
  readonly root = null;
  readonly scrollMargin = "0px";
  readonly rootMargin = "600px";
  readonly thresholds = [0];
}

function visibilityObserver() {
  const observer = MockIntersectionObserver.instances
    .filter(({ options }) => options.threshold === 0.25)
    .at(-1);
  if (!observer) {
    throw new Error("Expected a separate 25% visibility observer");
  }
  return observer;
}

function intersect(ratio: number, isIntersecting = ratio > 0) {
  const observer = visibilityObserver();
  const rect = new DOMRect();
  observer.callback(
    [
      {
        intersectionRatio: ratio,
        isIntersecting,
        target: screen.getByTestId("workspace-demo-shell"),
        time: 0,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: null,
      },
    ],
    observer
  );
}

function mountedDemo() {
  setDesktop(true);
  const view = render(<HomeWorkspaceDemo />);
  revealDemo();
  const iframe = screen.getByTitle<HTMLIFrameElement>(
    "Interactive Ruby workspace demo"
  );
  if (!iframe.contentWindow) {
    throw new Error("Expected iframe window");
  }
  return {
    ...view,
    iframe,
    postMessage: vi.spyOn(iframe.contentWindow, "postMessage"),
  };
}

function sendReady(iframe: HTMLIFrameElement) {
  fireEvent(
    window,
    new MessageEvent("message", {
      data: { type: "workspace-demo:ready" },
      origin: window.location.origin,
      source: iframe.contentWindow,
    })
  );
}

function setDesktop(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => new MockMediaQueryList(matches)),
  });
}

function revealDemo() {
  const callback = MockIntersectionObserver.callback;
  if (!callback) {
    throw new Error("Expected a workspace demo intersection observer");
  }
  act(() => {
    callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
}

describe("HomeWorkspaceDemo", () => {
  beforeEach(() => {
    MockIntersectionObserver.callback = null;
    MockIntersectionObserver.instances = [];
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: MockIntersectionObserver,
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("loads when the browser batches an offscreen observation followed by entry into view", () => {
    setDesktop(true);
    render(<HomeWorkspaceDemo />);
    const observer = MockIntersectionObserver.instances
      .filter(({ options }) => options.rootMargin === "600px")
      .at(-1);
    if (!observer) {
      throw new Error("Missing lazy observer");
    }
    const rect = new DOMRect();
    const entry = {
      target: screen.getByTestId("workspace-demo-shell"),
      time: 0,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
    };
    act(() =>
      observer.callback(
        [
          { ...entry, isIntersecting: false, intersectionRatio: 0 },
          { ...entry, isIntersecting: true, intersectionRatio: 0.5 },
        ],
        observer
      )
    );
    expect(
      screen.getByTitle("Interactive Ruby workspace demo")
    ).toBeInTheDocument();
  });

  it.each([
    { strict: false, initiallyIntersecting: false },
    { strict: true, initiallyIntersecting: false },
    { strict: false, initiallyIntersecting: true },
    { strict: true, initiallyIntersecting: true },
  ])("hydrates the false desktop server snapshot (StrictMode: $strict, initially intersecting: $initiallyIntersecting)", async ({
    strict,
    initiallyIntersecting,
  }) => {
    setDesktop(true);
    const demo = strict ? (
      <StrictMode>
        <HomeWorkspaceDemo />
      </StrictMode>
    ) : (
      <HomeWorkspaceDemo />
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(demo);
    expect(container.innerHTML).toBe("");
    document.body.appendChild(container);
    const recoverableError = vi.fn();
    const root = hydrateRoot(container, demo, {
      onRecoverableError: recoverableError,
    });
    try {
      await act(async () => {});
      const shell = screen.getByTestId("workspace-demo-shell");
      expect(shell.isConnected).toBe(true);
      expect(screen.queryByTitle("Interactive Ruby workspace demo")).toBeNull();
      const lazyObserver = MockIntersectionObserver.instances
        .filter(({ options }) => options.rootMargin === "600px")
        .at(-1);
      if (!lazyObserver) {
        throw new Error("Expected lazy observer after hydration");
      }
      expect(lazyObserver.observe).toHaveBeenCalledWith(shell);
      expect(visibilityObserver().observe).toHaveBeenCalledWith(shell);
      // Deliver observations to the registered target, either on first layout
      // or after the user scrolls the initially offscreen shell into view.
      const rect = new DOMRect(0, 417, 1595, 912);
      const entry = {
        target: shell,
        time: 0,
        boundingClientRect: rect,
        intersectionRect: rect,
        rootBounds: null,
        isIntersecting: false,
        intersectionRatio: 0,
      };
      if (!initiallyIntersecting) {
        act(() => lazyObserver.callback([entry], lazyObserver));
        expect(
          screen.queryByTitle("Interactive Ruby workspace demo")
        ).toBeNull();
      }
      act(() => {
        lazyObserver.callback(
          [{ ...entry, isIntersecting: true, intersectionRatio: 1 }],
          lazyObserver
        );
        intersect(0.54);
      });
      const iframe = screen.getByTitle<HTMLIFrameElement>(
        "Interactive Ruby workspace demo"
      );
      if (!iframe.contentWindow) {
        throw new Error("Expected hydrated iframe window");
      }
      const postMessage = vi.spyOn(iframe.contentWindow, "postMessage");
      fireEvent.load(iframe);
      sendReady(iframe);
      expect(shell).toHaveAttribute("data-status", "ready");
      expect(postMessage).toHaveBeenLastCalledWith(
        { type: "workspace-demo:visibility", visible: true },
        window.location.origin
      );
      expect(recoverableError).not.toHaveBeenCalled();
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });

  it("does not mount the workspace iframe below the desktop breakpoint", () => {
    setDesktop(false);

    render(<HomeWorkspaceDemo />);

    expect(screen.queryByTitle("Interactive Ruby workspace demo")).toBeNull();
    expect(MockIntersectionObserver.instances).toHaveLength(0);
  });

  it("signals the inclusive 25% threshold independently of lazy loading", () => {
    const { postMessage } = mountedDemo();
    expect(visibilityObserver().options.rootMargin ?? "0px").toBe("0px");
    for (const [ratio, visible] of [
      [0, false],
      [0.249, false],
      [0.25, true],
      [1, true],
      [0.24, false],
    ] as const) {
      act(() => intersect(ratio));
      expect(postMessage).toHaveBeenLastCalledWith(
        { type: "workspace-demo:visibility", visible },
        window.location.origin
      );
    }
    act(() => intersect(1, false));
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
  });

  it("uses viewport geometry without IntersectionObserver and cleans up fallback listeners", () => {
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: undefined,
    });
    setDesktop(true);
    const geometry = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(-50, -50, 100, 100));
    const { unmount } = render(<HomeWorkspaceDemo />);
    const iframe = screen.getByTitle<HTMLIFrameElement>(
      "Interactive Ruby workspace demo"
    );
    if (!iframe.contentWindow) {
      throw new Error("Expected iframe window");
    }
    const postMessage = vi.spyOn(iframe.contentWindow, "postMessage");
    fireEvent.load(iframe);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
    geometry.mockReturnValue(new DOMRect(-51, -50, 100, 100));
    fireEvent.scroll(window);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
    geometry.mockReturnValue(
      new DOMRect(window.innerWidth - 50, window.innerHeight - 50, 100, 100)
    );
    fireEvent.resize(window);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    geometry.mockReturnValue(new DOMRect(0, 0, 0, 0));
    sendReady(iframe);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
    const remove = vi.spyOn(window, "removeEventListener");
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function), true);
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
    geometry.mockClear();
    postMessage.mockClear();
    fireEvent.scroll(window);
    fireEvent.resize(window);
    expect(geometry).not.toHaveBeenCalled();
    expect(postMessage).not.toHaveBeenCalled();
  });

  it.each([
    0, 20_000,
  ])("synchronizes cached or slow cold readiness after %i ms", (delayMs) => {
    vi.useFakeTimers();
    const { iframe, postMessage } = mountedDemo();
    act(() => intersect(0.5));
    act(() => vi.advanceTimersByTime(delayMs));
    fireEvent.load(iframe);
    expect(postMessage).toHaveBeenCalledWith(
      { type: "workspace-demo:ping" },
      window.location.origin
    );
    sendReady(iframe);
    expect(screen.getByTestId("workspace-demo-shell")).toHaveAttribute(
      "data-status",
      "ready"
    );
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
    act(() => vi.advanceTimersByTime(15_000));
    expect(screen.getByTestId("workspace-demo-shell")).toHaveAttribute(
      "data-status",
      "ready"
    );
  });

  it("combines document visibility with the latest intersection", () => {
    const { postMessage } = mountedDemo();
    act(() => intersect(1));
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
    act(() => intersect(0.5));
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
    fireEvent(document, new Event("visibilitychange"));
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
    act(() => intersect(0));
    fireEvent(document, new Event("visibilitychange"));
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
  });

  it("synchronizes ready and load before observation and without waiting for a render", () => {
    const { iframe, postMessage } = mountedDemo();
    sendReady(iframe);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
    act(() => {
      intersect(0.25);
      postMessage.mockClear();
      sendReady(iframe);
      expect(postMessage).toHaveBeenLastCalledWith(
        { type: "workspace-demo:visibility", visible: true },
        window.location.origin
      );
    });
    postMessage.mockClear();
    fireEvent.load(iframe);
    expect(postMessage).toHaveBeenCalledWith(
      { type: "workspace-demo:ping" },
      window.location.origin
    );
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    sendReady(iframe);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: false },
      window.location.origin
    );
  });

  it("disconnects observers and removes visibility and ready listeners on unmount", () => {
    const { iframe, postMessage, unmount } = mountedDemo();
    const removeListener = vi.spyOn(document, "removeEventListener");
    const observer = visibilityObserver();
    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
    expect(removeListener).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function)
    );
    postMessage.mockClear();
    fireEvent(document, new Event("visibilitychange"));
    sendReady(iframe);
    expect(postMessage).not.toHaveBeenCalled();
  });

  it("retains observations made before iframe mount and across retry", () => {
    vi.useFakeTimers();
    setDesktop(true);
    render(<HomeWorkspaceDemo />);
    act(() => intersect(0.5));
    expect(screen.queryByTitle("Interactive Ruby workspace demo")).toBeNull();
    revealDemo();
    const iframe = screen.getByTitle<HTMLIFrameElement>(
      "Interactive Ruby workspace demo"
    );
    if (!iframe.contentWindow) {
      throw new Error("Expected iframe window");
    }
    const postMessage = vi.spyOn(iframe.contentWindow, "postMessage");
    fireEvent.load(iframe);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
    act(() => vi.advanceTimersByTime(15_000));
    fireEvent.click(
      screen.getByRole("button", { name: "Retry workspace demo" })
    );
    const replacement = screen.getByTitle<HTMLIFrameElement>(
      "Interactive Ruby workspace demo"
    );
    if (!replacement.contentWindow) {
      throw new Error("Expected replacement window");
    }
    const replacementPostMessage = vi.spyOn(
      replacement.contentWindow,
      "postMessage"
    );
    fireEvent.load(replacement);
    expect(replacementPostMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
    sendReady(replacement);
    expect(replacementPostMessage).toHaveBeenLastCalledWith(
      { type: "workspace-demo:visibility", visible: true },
      window.location.origin
    );
  });

  it("mounts the workspace iframe only after its desktop section approaches the viewport", () => {
    setDesktop(true);

    render(<HomeWorkspaceDemo />);
    expect(screen.getByTestId("workspace-demo-shell")).toHaveClass("bg-white");
    expect(screen.queryByTitle("Interactive Ruby workspace demo")).toBeNull();

    revealDemo();

    expect(
      screen.getByTitle("Interactive Ruby workspace demo")
    ).toHaveAttribute("src", "/static/workspace-demo/index.html?attempt=0");
  });

  it("accepts ready messages only from the embedded same-origin window", () => {
    setDesktop(true);
    render(<HomeWorkspaceDemo />);
    revealDemo();

    const iframe = screen.getByTitle<HTMLIFrameElement>(
      "Interactive Ruby workspace demo"
    );
    fireEvent(
      window,
      new MessageEvent("message", {
        data: { type: "workspace-demo:ready" },
        origin: "https://example.com",
        source: iframe.contentWindow,
      })
    );
    expect(screen.getByTestId("workspace-demo-shell")).toHaveAttribute(
      "data-status",
      "loading"
    );

    fireEvent(
      window,
      new MessageEvent("message", {
        data: { type: "workspace-demo:ready" },
        origin: window.location.origin,
        source: iframe.contentWindow,
      })
    );
    expect(screen.getByTestId("workspace-demo-shell")).toHaveAttribute(
      "data-status",
      "ready"
    );
  });

  it("requests readiness again when the iframe finishes loading", () => {
    setDesktop(true);
    render(<HomeWorkspaceDemo />);
    revealDemo();

    const iframe = screen.getByTitle<HTMLIFrameElement>(
      "Interactive Ruby workspace demo"
    );
    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) {
      throw new Error("Expected the workspace iframe to have a content window");
    }
    const postMessage = vi.spyOn(iframeWindow, "postMessage");

    fireEvent.load(iframe);

    expect(postMessage).toHaveBeenCalledWith(
      { type: "workspace-demo:ping" },
      window.location.origin
    );
  });

  it("offers a retry that remounts the iframe after a load error", () => {
    vi.useFakeTimers();
    setDesktop(true);
    render(<HomeWorkspaceDemo />);
    revealDemo();

    act(() => vi.advanceTimersByTime(15_000));
    fireEvent.click(
      screen.getByRole("button", { name: "Retry workspace demo" })
    );

    expect(
      screen.getByTitle("Interactive Ruby workspace demo")
    ).toHaveAttribute("src", "/static/workspace-demo/index.html?attempt=1");
  });
});
