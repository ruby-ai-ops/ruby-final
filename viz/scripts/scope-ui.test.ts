import postcss from "postcss";
import { describe, expect, it } from "vitest";

import { scopeRubyUI } from "./scope-ui.mjs";

describe("RubyUI style isolation", () => {
  it("excludes resets and keeps responsive rules inside the component boundary", () => {
    const result = postcss.parse(
      scopeRubyUI(`
        @layer base { input { padding: 8px; } }
        @layer utilities {
          .text-sm { font-size: 14px; }
          @media (width >= 640px) { .text-lg { font-size: 18px; } }
        }
      `)
    );

    expect(result.toString()).not.toContain("input");
    expect(result.first?.type).toBe("atrule");
    result.walkAtRules("scope", (scope) => {
      expect(scope.params).toBe("(.viz-ui) to ([data-viz-ui-slot])");
    });
    result.walkRules((rule) => {
      let ancestor = rule.parent;
      while (ancestor && ancestor.type !== "root") {
        if (ancestor.type === "atrule" && ancestor.name === "scope") {
          return;
        }
        ancestor = ancestor.parent;
      }
      expect.fail(`Unscoped selector: ${rule.selector}`);
    });
  });

  it("isolates properties and animations without renaming classes or external variables", () => {
    const result = scopeRubyUI(`
      @property --tw-shadow { syntax: "*"; inherits: false; initial-value: none; }
      :root { --foreground: red; --animate-pulse: pulse 2s infinite; }
      .animate-pulse {
        animation: var(--animate-pulse);
        color: var(--foreground);
        box-shadow: var(--tw-shadow);
        transform-origin: var(--radix-tooltip-content-transform-origin);
        content: "pulse --foreground";
      }
      @keyframes pulse { to { opacity: .5; } }
    `);

    expect(result).toContain("@property --viz-ui-tw-shadow");
    expect(result).toContain("@keyframes viz-ui-pulse");
    expect(result).toContain("--viz-ui-animate-pulse: viz-ui-pulse");
    expect(result).toContain("animation: var(--viz-ui-animate-pulse)");
    expect(result).toContain("color: var(--viz-ui-foreground)");
    expect(result).toContain("box-shadow: var(--viz-ui-tw-shadow)");
    expect(result).toContain(".animate-pulse");
    expect(result).toContain("var(--radix-tooltip-content-transform-origin)");
    expect(result).toContain('content: "pulse --foreground"');
  });

  it("puts light and dark tokens on the scope root", () => {
    const result = scopeRubyUI(`
      :root, :host { --foreground: black; }
      .dark { --foreground: white; }
      .dark .border { border-color: var(--foreground); }
    `);

    expect(result).toContain(":scope, :scope");
    expect(result).toContain(":scope:where(.dark, .dark *)");
    expect(result).toContain(":scope:where(.dark, .dark *) .border");
    expect(result).not.toContain(":root");
    expect(result).not.toContain(":host");
  });
});
