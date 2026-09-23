// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountFloorScene } from "./heroOfficeScene";
import { HeroOfficeSection } from "./HeroOfficeSection";

vi.mock("@marketing/components/home/content/Product/HomeReveal", () => ({
  HomeReveal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock(
  "@marketing/components/home/content/Product/heroOfficeScenario",
  () => ({ homeScenarios: [] })
);

vi.mock("@marketing/components/home/content/Product/heroOfficeScene", () => ({
  mountFloorScene: vi.fn(() => vi.fn()),
}));

vi.mock("@marketing/lib/tracking", () => ({
  TRACKING_AREAS: { HOME: "home" },
  withTracking: (_area: string, _event: string, callback?: () => void) =>
    callback ?? vi.fn(),
}));

vi.mock("@ruby-ai/ui", () => ({
  LegacyButton: ({ label }: { label: string }) => (
    <button type="button">{label}</button>
  ),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("HeroOfficeSection background", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  afterEach(cleanup);

  it("renders the shared hero gradient surface and white fade", () => {
    const { container } = render(<HeroOfficeSection />);
    const backdrop = container.querySelector<HTMLElement>(
      ".marketing-gradient-surface-hero"
    );
    const blobs = container.querySelectorAll(".marketing-gradient-blob");
    const fade = container.querySelector(".home-hero-gradient-fade");

    expect(backdrop).not.toBeNull();
    expect(blobs).toHaveLength(3);
    expect(fade).not.toBeNull();
  });

  it("keeps the decorative floor scene out of the mobile hero", () => {
    const { container } = render(<HeroOfficeSection />);

    expect(container.querySelector(".hero-office-mobile-preview")).toBeNull();
    expect(container.querySelector(".ruby-floor-host")).not.toBeNull();
  });

  it("mounts and cleans up the desktop scene as the desktop media query changes", () => {
    const mediaQueryList = new EventTarget();
    let matches = false;
    const cleanup = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      }
    );

    Object.defineProperty(mediaQueryList, "matches", {
      get: () => matches,
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => mediaQueryList),
    });
    vi.mocked(mountFloorScene).mockReturnValue(cleanup);

    const { unmount } = render(<HeroOfficeSection />);

    expect(mountFloorScene).not.toHaveBeenCalled();

    matches = true;
    mediaQueryList.dispatchEvent(new Event("change"));
    expect(mountFloorScene).toHaveBeenCalledTimes(1);

    matches = false;
    mediaQueryList.dispatchEvent(new Event("change"));
    expect(cleanup).toHaveBeenCalledTimes(1);

    unmount();
    matches = true;
    mediaQueryList.dispatchEvent(new Event("change"));
    expect(mountFloorScene).toHaveBeenCalledTimes(1);
  });

  it("clears a stale paused state before a desktop scene remount", () => {
    const mediaQueryList = new EventTarget();
    let matches = true;
    const pausedValuesAtMount: Array<string | null> = [];

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      }
    );

    Object.defineProperty(mediaQueryList, "matches", {
      get: () => matches,
    });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => mediaQueryList),
    });
    vi.mocked(mountFloorScene).mockImplementation((host) => {
      pausedValuesAtMount.push(host.getAttribute("data-paused"));
      return () => {
        host.setAttribute("data-paused", "true");
      };
    });

    const { container } = render(<HeroOfficeSection />);
    const host = container.querySelector<HTMLElement>(
      '.ruby-floor-host[aria-hidden="true"]'
    );

    expect(host).not.toBeNull();
    host?.setAttribute("data-paused", "true");

    matches = false;
    mediaQueryList.dispatchEvent(new Event("change"));
    expect(host?.hasAttribute("data-paused")).toBe(false);

    matches = true;
    mediaQueryList.dispatchEvent(new Event("change"));
    expect(pausedValuesAtMount).toEqual([null, null]);
  });
});
