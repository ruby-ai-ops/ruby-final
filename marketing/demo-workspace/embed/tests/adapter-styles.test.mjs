import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const embedRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

test("the larger desktop embed keeps a white canvas and slight shadow in both themes", async () => {
  const css = await readFile(path.join(embedRoot, "src", "embed.css"), "utf8");
  const stageRule =
    css.match(/\.app-stage,\s*\.app-stage\.theme-dark\s*\{([^}]*)\}/)?.[1] ??
    "";
  const frameRule =
    css.match(
      /\.workspace-frame,\s*\.theme-dark \.workspace-frame\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(stageRule, /background:\s*#fff/);
  assert.match(stageRule, /padding:\s*clamp\(6px,\s*1vw,\s*16px\)/);
  assert.match(
    frameRule,
    /width:\s*min\(97vw,\s*calc\(97vh \* 16 \/ 9\)\)/
  );
  assert.match(frameRule, /aspect-ratio:\s*16 \/ 9/);
  assert.match(frameRule, /box-shadow:\s*0 10px 32px rgb\(31 38 35 \/ 10%\)/);
});

test("sender-authored Teams messages do not show reaction badges", async () => {
  const css = await readFile(path.join(embedRoot, "src", "embed.css"), "utf8");
  const senderReactionRule =
    css.match(
      /\.teams-chat-message:not\(\.teams-ruby-chat-message\)\s+\.teams-bubble-reactions\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(senderReactionRule, /display:\s*none/);
});

test("workspace card surfaces do not render side or bottom border stripes", async () => {
  const css = await readFile(path.join(embedRoot, "src", "embed.css"), "utf8");
  const cardRule =
    css.match(/\/\* Borderless workspace cards \*\/([\s\S]*?)\{([^}]*)\}/)?.[0] ??
    "";

  for (const selector of [
    ".ruby-tool-card",
    ".deliverable-card",
    ".scenario-artifact button",
    ".scenario-artifact article",
    ".scenario-artifact .rw-pick",
    ".scenario-artifact .rw-metric",
    '.scenario-artifact [class*="-card"]',
    ".scenario-artifact .shift-row > div",
  ]) {
    assert.match(cardRule, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(cardRule, /border-color:\s*transparent/);
  assert.doesNotMatch(cardRule, /border:\s*0/);
  assert.doesNotMatch(css, /--(?:artifact|rw)-line:\s*transparent/);
});

test("the launch-operation alert uses a softer red in the Ruby sidebar", async () => {
  const css = await readFile(
    path.join(embedRoot, "src", "scenario-overrides.css"),
    "utf8"
  );
  const iconRule =
    css.match(
      /\.app-stage \.ruby-history-item \.workspace-chat-indicator\.is-alert i\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(iconRule, /color:\s*#d46b6b/);
});

test("long workspace chat names can be swiped without reducing their type size", async () => {
  const css = await readFile(
    path.join(embedRoot, "src", "scenario-overrides.css"),
    "utf8"
  );
  const swipeRule =
    css.match(
      /\.ruby-history-item > span:first-child,[\s\S]*?\.teams-group-copy > strong\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(swipeRule, /overflow-x:\s*auto/);
  assert.match(swipeRule, /text-overflow:\s*clip/);
  assert.match(swipeRule, /touch-action:\s*pan-x pan-y/);
  assert.doesNotMatch(swipeRule, /font-size/);
});

test("long workspace chat names loop left while hovered and respect reduced motion", async () => {
  const css = await readFile(
    path.join(embedRoot, "src", "scenario-overrides.css"),
    "utf8"
  );
  const marqueeRule =
    css.match(/\.workspace-chat-marquee\.is-hovering > span\s*\{([^}]*)\}/)?.[1] ??
    "";

  assert.match(marqueeRule, /animation:[\s\S]*infinite/);
  assert.match(css, /@keyframes workspace-chat-marquee-loop/);
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation:\s*none/
  );
});

test("the desktop sidebar is wide enough for full chat names", async () => {
  const css = await readFile(path.join(embedRoot, "src", "embed.css"), "utf8");
  const frameRule =
    css.match(
      /#workspace-demo-root \.workspace-frame\s*\{([^}]*)\}/
    )?.[1] ?? "";
  const slackBackdropRule =
    css.match(
      /#workspace-demo-root \.platform-slack \.workspace-frame::before\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(frameRule, /clamp\(280px,\s*22vw,\s*360px\)/);
  assert.match(slackBackdropRule, /clamp\(280px,\s*22vw,\s*360px\)/);
});

test("light-mode deliverables use a slightly gray surface", async () => {
  const css = await readFile(path.join(embedRoot, "src", "embed.css"), "utf8");
  const deliverableRule =
    css.match(
      /#workspace-demo-root \.theme-light \.deliverable-card\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(deliverableRule, /background:\s*#f2f4f5/);
});

test("Ruby integration cards use a subtle shadow in both themes", async () => {
  const css = await readFile(path.join(embedRoot, "src", "embed.css"), "utf8");
  const lightRule =
    css.match(
      /#workspace-demo-root \.theme-light \.ruby-tool-card\s*\{([^}]*)\}/
    )?.[1] ?? "";
  const darkRule =
    css.match(
      /#workspace-demo-root \.theme-dark \.ruby-tool-card\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(lightRule, /box-shadow:\s*0 2px 8px rgb\(31 38 35 \/ 8%\)/);
  assert.match(darkRule, /box-shadow:\s*0 2px 8px rgb\(0 0 0 \/ 20%\)/);
});

test("workspace rail hover keeps the server button inside the clipped frame", async () => {
  const css = await readFile(path.join(embedRoot, "src", "embed.css"), "utf8");
  const hoverRule =
    css.match(
      /#workspace-demo-root \.server-logo:hover,[\s\S]*?#workspace-demo-root \.server-logo:focus-visible\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(hoverRule, /transform:\s*none/);
  assert.doesNotMatch(hoverRule, /translateY\(-1px\)/);
});

test("Ruby sidebar status icons have a complete line box", async () => {
  const css = await readFile(
    path.join(embedRoot, "src", "embed.css"),
    "utf8"
  );
  const indicatorRule =
    css.match(
      /#workspace-demo-root \.ruby-history-item \.workspace-chat-indicator\s*\{([^}]*)\}/
    )?.[1] ?? "";

  assert.match(indicatorRule, /min-height:\s*14px/);
  assert.match(indicatorRule, /line-height:\s*1/);
  assert.match(indicatorRule, /overflow:\s*visible/);
});

test("the payment summary action uses the demo green", async () => {
  const css = await readFile(path.join(embedRoot, "src", "scenario-overrides.css"), "utf8");
  const actionRule =
    css.match(/\.scenario-addon-action\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(actionRule, /background:\s*#17683f/);
  assert.match(actionRule, /color:\s*#fff/);
});

test("payment summary values use separate vertical columns", async () => {
  const css = await readFile(path.join(embedRoot, "src", "scenario-overrides.css"), "utf8");
  const summaryRule =
    css.match(/\.scenario-addon-amount-summary > span\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(summaryRule, /display:\s*flex/);
  assert.match(summaryRule, /flex-direction:\s*column/);
  assert.match(summaryRule, /gap:\s*2px/);
});

test("the cheese presentation preview keeps a slide ratio and scrollable thumbnails", async () => {
  const css = await readFile(
    path.join(embedRoot, "src", "scenario-overrides.css"),
    "utf8"
  );
  const slideRule =
    css.match(/\.meadow-cheese-slide\s*\{([^}]*)\}/)?.[1] ?? "";
  const thumbnailRule =
    css.match(/\.meadow-cheese-controls nav\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.match(slideRule, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(thumbnailRule, /overflow-x:\s*auto/);
});
