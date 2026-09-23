// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingGradientSurface } from "./MarketingGradientSurface";

describe("MarketingGradientSurface", () => {
  it("renders the card and hero variants with three decorative blobs", () => {
    const { container } = render(
      <>
        <MarketingGradientSurface variant="card">
          <span>card content</span>
        </MarketingGradientSurface>
        <MarketingGradientSurface variant="hero" />
      </>
    );

    const surfaces = container.querySelectorAll(".marketing-gradient-surface");
    expect(surfaces).toHaveLength(2);
    expect(surfaces[0].classList.contains("marketing-card-dark-gradient")).toBe(
      true
    );
    expect(
      surfaces[0].classList.contains("marketing-gradient-surface-card")
    ).toBe(true);
    expect(
      surfaces[1].classList.contains("marketing-gradient-surface-hero")
    ).toBe(true);
    expect(
      surfaces[0].querySelectorAll(".marketing-gradient-blob")
    ).toHaveLength(3);
    expect(surfaces[0].textContent).toContain("card content");
  });
});
