import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WorkspaceChatMarquee } from "../src/scenario-overrides";

afterEach(cleanup);

function setMeasurements(
  element: HTMLElement,
  inner: HTMLElement,
  clientWidth: number,
  scrollWidth: number
) {
  Object.defineProperty(element, "clientWidth", {
    configurable: true,
    value: clientWidth,
  });
  Object.defineProperty(inner, "scrollWidth", {
    configurable: true,
    value: scrollWidth,
  });
}

describe("WorkspaceChatMarquee", () => {
  it("starts a looping hover state only when the title overflows", () => {
    const { container } = render(
      <WorkspaceChatMarquee text="Order packaging before stock runs out" />
    );
    const element = container.firstElementChild as HTMLElement;
    const inner = element.firstElementChild as HTMLElement;
    setMeasurements(element, inner, 120, 280);

    expect(element).not.toHaveAttribute("title");
    fireEvent.mouseEnter(element);
    expect(element).toHaveClass("is-hovering");

    fireEvent.mouseLeave(element);
    expect(element).not.toHaveClass("is-hovering");
  });

  it("leaves short titles static while preserving strong semantics", () => {
    const { container } = render(
      <WorkspaceChatMarquee as="strong" text="Deploy now" />
    );
    const element = container.firstElementChild as HTMLElement;
    const inner = element.firstElementChild as HTMLElement;
    setMeasurements(element, inner, 120, 90);

    fireEvent.mouseEnter(element);
    expect(element.tagName).toBe("STRONG");
    expect(element).not.toHaveClass("is-hovering");
  });
});
