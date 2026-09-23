import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { DemoScenario } from "../../upstream/app/demo-scenarios";
import { artifactRevealMap } from "./artifact-reveal-map";
import { useWorkspaceAutoplay } from "./autoplay";
import "./streaming.css";

export const STREAM_END_MS = 5850;
export const STREAM_DEADLINE_MS = 6000;
const StreamingContext = createContext(false);
type Platform = "ruby" | "slack" | "teams";
interface StreamWordsProps {
  text: string;
}
interface StreamConversationProps {
  children: ReactNode;
  scenario: DemoScenario;
  platform: Platform;
  restored: boolean;
}
export function StreamWords({ text }: StreamWordsProps) {
  const enabled = useContext(StreamingContext);
  if (!enabled) {
    return text;
  }
  return text.split(/(\s+)/u).map((word, index) =>
    /^\s*$/u.test(word) ? (
      word
    ) : (
      <span className="demo-stream-word" key={index}>
        {word}
      </span>
    )
  );
}

const platformMap = {
  ruby: {
    user: ".ruby-user-message",
    identity: ".ruby-response-header",
    assistant: ".ruby-response",
    tools: ".ruby-tool-card",
    checks: ".ruby-tool-check",
    complete: ".ruby-response-header small",
    extras: "",
  },
  slack: {
    user: ".slack-thread > .slack-message:not(.slack-ruby-message)",
    identity: ".slack-ruby-message .slack-message-meta",
    assistant: ".slack-ruby-message",
    tools: ".slack-tool-receipts > span",
    checks: ".fa-check",
    complete: ".slack-completion-status",
    extras: ".slack-reactions, .slack-thread-summary",
  },
  teams: {
    user: ".teams-chat-content > .teams-chat-message:not(.teams-ruby-chat-message)",
    identity: ".teams-ruby-chat-message .teams-chat-message-body > header",
    assistant: ".teams-ruby-chat-message",
    tools: ".teams-tool-receipts > span",
    checks: "",
    complete: ".teams-complete-label",
    extras: ".teams-reactions",
  },
} as const;

export interface RevealItem {
  element: HTMLElement;
  atMs: number;
  word: boolean;
}
function distribute(
  index: number,
  count: number,
  startMs: number,
  endMs: number
) {
  return startMs + (count > 1 ? (index / (count - 1)) * (endMs - startMs) : 0);
}

export function buildRevealSchedule(
  root: HTMLElement,
  scenario: DemoScenario,
  platform: Platform
) {
  const map = platformMap[platform];
  const items = new Map<HTMLElement, RevealItem>();
  function add(element: HTMLElement, atMs: number, word = false) {
    items.set(element, { element, atMs, word });
  }
  function select(selector: string) {
    return [...root.querySelectorAll<HTMLElement>(selector)];
  }
  function group(selector: string, startMs: number, endMs = startMs) {
    if (!selector) {
      return;
    }
    const elements = select(selector);
    elements.forEach((element, index) =>
      add(element, distribute(index, elements.length, startMs, endMs))
    );
  }
  const identity = root.querySelector<HTMLElement>(map.identity);
  const assistant = root.querySelector<HTMLElement>(map.assistant);
  if (!identity || !assistant || !root.querySelector(map.user)) {
    throw new Error("Missing streaming conversation structure");
  }
  group(map.user, 0);
  group(map.identity, 250);
  group(".slack-ruby-avatar, .teams-ruby-avatar", 250);
  const tools = select(map.tools);
  tools.forEach((element, index) => {
    const atMs = distribute(index, tools.length, 1500, 2480);
    add(element, atMs);
    if (map.checks) {
      element
        .querySelectorAll<HTMLElement>(map.checks)
        .forEach((check) => add(check, atMs + 140));
    }
  });
  const textStartMs = tools.length ? 2800 : 1500;
  const blocks = select(
    ".conversation-document > :not(ul), .conversation-document > ul > li, .teams-artifact-lead"
  );
  interface TextUnit {
    element: HTMLElement;
    block: HTMLElement;
    atomic: boolean;
  }
  const words: TextUnit[] = [];
  const completionWords: TextUnit[] = [];
  for (const block of blocks) {
    const completion = block.classList.contains("is-completion");
    const stream = completion ? completionWords : words;
    if (block.classList.contains("conversation-table-wrap")) {
      stream.push({ element: block, block, atomic: true });
      continue;
    }
    const tokens = [
      ...block.querySelectorAll<HTMLElement>(
        ".demo-stream-word, .inline-mention, .inline-integration"
      ),
    ].filter(
      (token) =>
        !token.parentElement?.closest(".inline-mention, .inline-integration")
    );
    if (tokens.length === 0) {
      stream.push({ element: block, block, atomic: true });
    } else {
      stream.push(
        ...tokens.map((element) => ({ element, block, atomic: false }))
      );
    }
  }
  function scheduleText(units: TextUnit[], startMs: number, endMs: number) {
    const startedBlocks = new Set<HTMLElement>();
    units.forEach((unit, index) => {
      const atMs = distribute(index, units.length, startMs, endMs);
      if (!startedBlocks.has(unit.block)) {
        add(unit.block, atMs);
        startedBlocks.add(unit.block);
      }
      add(unit.element, atMs, !unit.atomic);
    });
  }
  scheduleText(words, textStartMs, 3880);
  scheduleText(completionWords, 5550, 5630);
  group(".scenario-artifact", 4100);
  const mapping = artifactRevealMap[scenario.artifactId];
  if (scenario.copy.presentation === "artifact" && !mapping) {
    throw new Error(`Missing artifact reveal mapping: ${scenario.artifactId}`);
  }
  const artifact = root.querySelector<HTMLElement>(".scenario-artifact");
  const cards =
    artifact && mapping?.cards.length
      ? [...artifact.querySelectorAll<HTMLElement>(mapping.cards.join(","))]
      : [];
  const cardSet = new Set(cards);
  const outerCards = cards.filter((card) => {
    let parent = card.parentElement;
    while (parent && parent !== artifact) {
      if (cardSet.has(parent)) {
        return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });
  const supportingCards = [...outerCards, ...select(".deliverable-card")];
  supportingCards.forEach((card, index) =>
    add(card, distribute(index, supportingCards.length, 4550, 5330))
  );
  group(map.complete, 5550);
  group(".scenario-addon", 5630);
  group(map.extras, 5550, 5630);
  // Teams' bubble chrome must not appear before the response itself.
  group(".teams-ruby-bubble", 1500);
  return {
    items: [...items.values()].sort((a, b) => a.atMs - b.atMs),
    identity,
    assistant,
  };
}

interface HiddenItem extends RevealItem {
  ariaHidden: string | null;
  inert: boolean;
}

export function StreamConversation({
  children,
  scenario,
  platform,
  restored,
}: StreamConversationProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [thinkingHost, setThinkingHost] = useState<HTMLElement | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const autoplay = useWorkspaceAutoplay();
  const activeRunIdentityRef = useRef(autoplay.runIdentity);
  const previousRenderRef = useRef<{
    scenarioId: string;
    platform: Platform;
    runIdentity: number;
  } | null>(null);
  const followRef = useRef(true);
  activeRunIdentityRef.current = autoplay.runIdentity;

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }
    setThinkingHost(null);
    setAnnouncement("");
    const scroller = shell.querySelector<HTMLElement>(".conversation-scroll");
    if (!scroller) {
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousLive = scroller.getAttribute("aria-live");
    const previousBusy = scroller.getAttribute("aria-busy");
    const animations: Animation[] = [];
    let hidden: HiddenItem[] = [];
    let frameId = 0;
    let completed = false;
    let disposed = false;
    let followTop = scroller.scrollTop;
    let nextIndex = 0;
    let identity: HTMLElement | null = null;
    const runIdentity = autoplay.runIdentity;
    const previousRender = previousRenderRef.current;
    const newRun =
      previousRender !== null && previousRender.runIdentity !== runIdentity;
    if (newRun) {
      followRef.current = true;
    }
    previousRenderRef.current = {
      scenarioId: scenario.id,
      platform,
      runIdentity,
    };

    function restore(item: HiddenItem) {
      item.element.removeAttribute("data-stream-hidden");
      if (item.ariaHidden === null) {
        item.element.removeAttribute("aria-hidden");
      } else {
        item.element.setAttribute("aria-hidden", item.ariaHidden);
      }
      item.element.inert = item.inert;
    }
    function finish() {
      if (completed || disposed) {
        return;
      }
      completed = true;
      window.cancelAnimationFrame(frameId);
      hidden.forEach(restore);
      animations.forEach((animation) => animation.cancel());
      if (previousLive === null) {
        scroller?.removeAttribute("aria-live");
      } else {
        scroller?.setAttribute("aria-live", previousLive);
      }
      if (previousBusy === null) {
        scroller?.removeAttribute("aria-busy");
      } else {
        scroller?.setAttribute("aria-busy", previousBusy);
      }
      if (shell) {
        shell.dataset.streamState = "complete";
      }
      setThinkingHost(null);
      setAnnouncement("Completed");
    }
    function tick() {
      if (
        disposed ||
        completed ||
        activeRunIdentityRef.current !== runIdentity ||
        !scroller
      ) {
        return;
      }
      const elapsedMs = autoplay.getActiveElapsedMs();
      if (elapsedMs >= STREAM_END_MS) {
        finish();
        return;
      }
      if (elapsedMs >= 250 && elapsedMs < 1500) {
        setThinkingHost(identity);
        setAnnouncement("Thinking…");
      } else if (elapsedMs >= 1500) {
        setThinkingHost(null);
        setAnnouncement("");
      }
      let newest: HTMLElement | null = null;
      while (nextIndex < hidden.length && hidden[nextIndex].atMs <= elapsedMs) {
        const item = hidden[nextIndex++];
        restore(item);
        newest = item.word
          ? item.element.closest<HTMLElement>("p, h3, li, blockquote")
          : item.element;
        if (typeof item.element.animate === "function") {
          const durationMs = Math.min(
            item.word ? 180 : 220,
            STREAM_END_MS - elapsedMs
          );
          animations.push(
            item.element.animate(
              item.word
                ? [{ opacity: 0 }, { opacity: 1 }]
                : [
                    { opacity: 0, transform: "translateY(6px)" },
                    { opacity: 1, transform: "translateY(0)" },
                  ],
              { duration: durationMs, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
            )
          );
        }
      }
      if (followRef.current && newest) {
        const box = scroller.getBoundingClientRect();
        const composer = shell
          ?.closest(".conversation")
          ?.querySelector(".composer-dock")
          ?.getBoundingClientRect();
        const bottom = Math.min(box.bottom, composer?.top ?? box.bottom) - 20;
        const newestBox = newest.getBoundingClientRect();
        // Hidden supporting cards reserve their final layout, but should not
        // pull the scroller past the main artifact before those cards appear.
        const visibleLeaves = [...newest.querySelectorAll("*")].filter(
          (element) =>
            element.childElementCount === 0 &&
            !element.closest("[data-stream-hidden]")
        );
        const revealedBottom = visibleLeaves.length
          ? Math.max(
              ...visibleLeaves.map(
                (element) => element.getBoundingClientRect().bottom
              )
            )
          : newestBox.bottom;
        if (revealedBottom > bottom) {
          followTop = Math.min(
            scroller.scrollHeight - scroller.clientHeight,
            scroller.scrollTop + revealedBottom - bottom
          );
        }
      }
      if (followRef.current && Math.abs(scroller.scrollTop - followTop) > 1) {
        scroller.scrollTop += (followTop - scroller.scrollTop) * 0.24;
      }
      frameId = window.requestAnimationFrame(tick);
    }
    const interrupt = () => {
      followRef.current = false;
    };
    const keydown = (event: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
          "Tab",
        ].includes(event.key)
      ) {
        interrupt();
      }
    };
    try {
      const schedule = buildRevealSchedule(shell, scenario, platform);
      identity = schedule.identity;
      hidden = schedule.items.map((item) => ({
        ...item,
        ariaHidden: item.element.getAttribute("aria-hidden"),
        inert: item.element.inert,
      }));
      const elapsedMs = Math.min(autoplay.getActiveElapsedMs(), STREAM_END_MS);
      if (
        reducedMotion.matches ||
        autoplay.mode === "complete" ||
        elapsedMs >= STREAM_END_MS
      ) {
        finish();
        return;
      }
      scroller.setAttribute("aria-live", "off");
      scroller.setAttribute("aria-busy", "true");
      while (nextIndex < hidden.length && hidden[nextIndex].atMs <= elapsedMs) {
        nextIndex += 1;
      }
      hidden.slice(nextIndex).forEach((item) => {
        item.element.setAttribute("data-stream-hidden", "");
        item.element.setAttribute("aria-hidden", "true");
        item.element.inert = true;
      });
      setThinkingHost(elapsedMs >= 250 && elapsedMs < 1500 ? identity : null);
      setAnnouncement(elapsedMs >= 250 && elapsedMs < 1500 ? "Thinking…" : "");
      const storedScrollTop = autoplay.getScrollPosition(scenario.id, platform);
      scroller.scrollTop = newRun ? 0 : (storedScrollTop ?? 0);
      followTop = scroller.scrollTop;
      shell.dataset.streamState = autoplay.animationActive
        ? "playing"
        : autoplay.status === "waiting-for-visibility" || !restored
          ? "waiting"
          : "paused";
      scroller.addEventListener("wheel", interrupt, { passive: true });
      scroller.addEventListener("touchstart", interrupt, { passive: true });
      scroller.addEventListener("pointerdown", interrupt);
      scroller.addEventListener("keydown", keydown);
      // Request the parent's latest visibility after every conversation remount.
      window.parent.postMessage(
        { type: "workspace-demo:ready" },
        window.location.origin
      );
      if (autoplay.animationActive) {
        tick();
      }
    } catch {
      finish();
    }
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      autoplay.setScrollPosition(scenario.id, platform, scroller.scrollTop);
      hidden.forEach(restore);
      animations.forEach((animation) => animation.cancel());
      scroller.removeEventListener("wheel", interrupt);
      scroller.removeEventListener("touchstart", interrupt);
      scroller.removeEventListener("pointerdown", interrupt);
      scroller.removeEventListener("keydown", keydown);
      if (previousLive === null) {
        scroller.removeAttribute("aria-live");
      } else {
        scroller.setAttribute("aria-live", previousLive);
      }
      if (previousBusy === null) {
        scroller.removeAttribute("aria-busy");
      } else {
        scroller.setAttribute("aria-busy", previousBusy);
      }
    };
  }, [
    autoplay.animationActive,
    autoplay.getActiveElapsedMs,
    autoplay.getScrollPosition,
    autoplay.mode,
    autoplay.runIdentity,
    autoplay.setScrollPosition,
    autoplay.status,
    platform,
    restored,
    scenario,
  ]);

  return (
    <StreamingContext.Provider value={true}>
      <div
        className={`demo-stream-shell demo-stream-${platform}`}
        ref={shellRef}
      >
        {children}
        {thinkingHost &&
          createPortal(
            <span className="demo-thinking" aria-hidden="true">
              <span>Thinking…</span>
              <i />
              <i />
              <i />
            </span>,
            thinkingHost
          )}
        <span
          className="demo-stream-announcement"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </span>
      </div>
    </StreamingContext.Provider>
  );
}
