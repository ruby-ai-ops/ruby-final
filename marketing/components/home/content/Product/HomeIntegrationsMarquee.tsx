"use client";

import {
  ResourceAvatar,
  getIcon,
} from "@marketing/components/resources/resources_icons";
import {
  INTEGRATION_MARQUEE_ROW_DURATIONS_SECONDS,
  INTEGRATION_SHOWCASE_ROWS,
  getAdditionalActionCount,
  type IntegrationShowcaseItem,
} from "@marketing/components/home/content/Product/homeIntegrationShowcaseData";
import {
  getCapabilityBubblePlacement,
  getCapabilityBubbleSize,
} from "@marketing/components/home/content/Product/homeIntegrationShowcaseLayout";
import {
  INTEGRATION_BUBBLE_ENTER_DURATION_MS,
  INTEGRATION_BUBBLE_EXIT_DURATION_MS,
  INTEGRATION_MARQUEE_ACCELERATION_DURATION_MS,
  INTEGRATION_MARQUEE_DECELERATION_DURATION_MS,
  applyMarqueePlaybackRate,
  getMarqueePlaybackRate,
} from "@marketing/components/home/content/Product/homeIntegrationMarqueeMotion";
import { Icon, PuzzlePiece01, getPlatformLogo } from "@ruby-ai/ui";
import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const BUBBLE_HEIGHT_PX = 270;

const CATEGORY_TAG_CLASSES: Record<string, string> = {
  Communication: "bg-sky-100 text-sky-800",
  Email: "bg-rose-100 text-rose-800",
  Calendar: "bg-amber-100 text-amber-800",
  Knowledge: "bg-violet-100 text-violet-800",
  CRM: "bg-emerald-100 text-emerald-800",
  Marketing: "bg-pink-100 text-pink-800",
  Analytics: "bg-indigo-100 text-indigo-800",
  Automation: "bg-orange-100 text-orange-800",
  Web: "bg-teal-100 text-teal-800",
  "AI Models": "bg-slate-200 text-slate-800",
  Data: "bg-cyan-100 text-cyan-800",
  Design: "bg-fuchsia-100 text-fuchsia-800",
  Development: "bg-lime-100 text-lime-800",
  Events: "bg-yellow-100 text-yellow-800",
  Finance: "bg-green-100 text-green-800",
  Meetings: "bg-blue-100 text-blue-800",
  Observability: "bg-purple-100 text-purple-800",
  People: "bg-red-100 text-red-800",
  Productivity: "bg-sky-100 text-sky-800",
  Revenue: "bg-emerald-100 text-emerald-800",
  Security: "bg-slate-200 text-slate-800",
  Storage: "bg-stone-200 text-stone-800",
  Support: "bg-cyan-100 text-cyan-800",
};

const DEFAULT_CATEGORY_TAG_CLASS = "bg-muted-background text-muted-foreground";

const MARQUEE_CSS = `
@keyframes home-integrations-forward {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
@keyframes home-integrations-reverse {
  from { transform: translate3d(-50%, 0, 0); }
  to { transform: translate3d(0, 0, 0); }
}
.home-integrations-track {
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
.home-integration-bubble {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
@media (hover: hover) and (pointer: fine) {
  .home-integration-logo:hover {
    transform: translateY(-2px);
    border-color: #bfdbfe;
  }
}
@media (prefers-reduced-motion: reduce) {
  .home-integrations-track {
    animation: none;
    transform: none;
    will-change: auto;
  }
  .home-integration-logo,
  .home-integration-logo:hover,
  .home-integration-logo:focus,
  .home-integration-logo:focus-visible {
    transition: none;
    transform: none;
  }
  .home-integration-bubble {
    transition: opacity 100ms linear;
    transform: none;
  }
}
`;

interface BubbleState {
  item: IntegrationShowcaseItem;
  left: number;
  top: number;
  placement: "above" | "below";
  visible: boolean;
}

interface LogoButtonProps {
  item: IntegrationShowcaseItem;
  activeId: string | null;
  onMouseEnter: (
    item: IntegrationShowcaseItem,
    element: HTMLButtonElement
  ) => void;
  onMouseLeave: () => void;
  onFocus: (item: IntegrationShowcaseItem, element: HTMLButtonElement) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

function LogoButton({
  item,
  activeId,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
}: LogoButtonProps) {
  const Logo = getPlatformLogo(item.logo, PuzzlePiece01);
  const isActive = item.id === activeId;

  return (
    <button
      type="button"
      aria-label={`${item.name} integration capabilities`}
      aria-describedby={
        isActive ? "home-integration-capability-bubble" : undefined
      }
      onMouseEnter={(event: MouseEvent<HTMLButtonElement>) =>
        onMouseEnter(item, event.currentTarget)
      }
      onMouseLeave={onMouseLeave}
      onFocus={(event: FocusEvent<HTMLButtonElement>) =>
        onFocus(item, event.currentTarget)
      }
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="home-integration-logo group/logo flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/[0.07] bg-white transition-[border-color,transform] [transition-duration:280ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transform-none md:h-16 md:w-16 lg:rounded-2xl"
    >
      <Icon visual={Logo} size="md" className="h-8 w-8 md:h-9 md:w-9" />
    </button>
  );
}

function CapabilityBubble({
  state,
  onMeasure,
}: {
  state: BubbleState;
  onMeasure: (height: number) => void;
}) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const Logo = getPlatformLogo(state.item.logo, PuzzlePiece01);
  const translateY = state.placement === "above" ? 8 : -8;

  useLayoutEffect(() => {
    const element = bubbleRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      const height = element.getBoundingClientRect().height;
      if (height > 0) {
        onMeasure(height);
      }
    };

    measure();
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [onMeasure, state.item.id]);

  return (
    <div
      ref={bubbleRef}
      id="home-integration-capability-bubble"
      role="tooltip"
      className="home-integration-bubble pointer-events-none fixed z-[100] w-[calc(100vw-32px)] max-w-[320px] rounded-3xl border border-black/[0.08] bg-white p-5 text-left shadow-[0_28px_72px_-24px_rgba(15,23,42,0.5),0_8px_24px_-12px_rgba(15,23,42,0.22)]"
      style={{
        left: state.left,
        top: state.top,
        transitionDuration: state.visible
          ? `${INTEGRATION_BUBBLE_ENTER_DURATION_MS}ms`
          : `${INTEGRATION_BUBBLE_EXIT_DURATION_MS}ms`,
        opacity: state.visible ? 1 : 0,
        transform: state.visible
          ? "translate3d(0, 0, 0) scale(1)"
          : `translate3d(0, ${translateY}px, 0) scale(.985)`,
      }}
    >
      <div className="flex items-center gap-3">
        <ResourceAvatar icon={Logo} size="md" backgroundColor="bg-white" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold text-foreground">
            {state.item.name}
          </div>
          <span
            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_TAG_CLASSES[state.item.category] ?? DEFAULT_CATEGORY_TAG_CLASS}`}
          >
            {state.item.category}
          </span>
        </div>
      </div>
      <div className="mt-4 text-[11px] font-semibold uppercase text-muted-foreground">
        Available actions
      </div>
      <div className="mt-2.5 flex flex-col gap-2">
        {state.item.actions.map((action) => {
          const ActionIcon = getIcon(action.icon);
          return (
            <div
              key={action.label}
              className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-muted-background/50 px-3 py-2"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-foreground shadow-sm">
                <Icon visual={ActionIcon} size="xs" />
              </span>
              <span className="text-sm font-medium text-foreground">
                {action.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-xl border border-dashed border-blue-200 bg-blue-50/80 px-3 py-2 text-sm font-medium text-blue-800">
        <span>+{getAdditionalActionCount(state.item.id)} possible actions</span>
      </div>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-black/[0.08] bg-white ${
          state.placement === "above"
            ? "-bottom-2 border-b border-r"
            : "-top-2 border-l border-t"
        }`}
      />
    </div>
  );
}

export function HomeIntegrationsMarquee() {
  const [bubble, setBubble] = useState<BubbleState | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const pendingItemRef = useRef<IntegrationShowcaseItem | null>(null);
  const bubbleRef = useRef<BubbleState | null>(null);
  const bubbleRafRef = useRef<number | null>(null);
  const motionRafRef = useRef<number | null>(null);
  const motionTargetRef = useRef<number | null>(null);
  const tracksStoppedRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);

  const cancelBubbleFrame = () => {
    if (bubbleRafRef.current !== null) {
      cancelAnimationFrame(bubbleRafRef.current);
      bubbleRafRef.current = null;
    }
  };

  const cancelCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const cancelMotionRamp = () => {
    if (motionRafRef.current !== null) {
      cancelAnimationFrame(motionRafRef.current);
      motionRafRef.current = null;
    }
    motionTargetRef.current = null;
  };

  const clearScheduledWork = () => {
    cancelBubbleFrame();
    cancelCloseTimer();
    cancelMotionRamp();
  };

  const updateBubble = (nextBubble: BubbleState | null) => {
    bubbleRef.current = nextBubble;
    setBubble(nextBubble);
  };

  const getTrackAnimations = () =>
    trackRefs.current.flatMap((track) => track?.getAnimations() ?? []);

  const rampTracksTo = (
    targetRate: number,
    durationMs: number,
    onComplete?: () => void
  ) => {
    cancelMotionRamp();
    const animations = getTrackAnimations();
    if (animations.length === 0) {
      tracksStoppedRef.current = targetRate === 0;
      onComplete?.();
      return;
    }

    const startingRates = animations.map((animation) => animation.playbackRate);
    if (targetRate > 0) {
      for (const animation of animations) {
        animation.play();
      }
    }

    motionTargetRef.current = targetRate;
    const startedAtMs = performance.now();
    const updatePlaybackRates = (nowMs: number) => {
      const elapsedMs = nowMs - startedAtMs;
      animations.forEach((animation, index) => {
        applyMarqueePlaybackRate(
          animation,
          getMarqueePlaybackRate(
            startingRates[index],
            targetRate,
            elapsedMs,
            durationMs
          )
        );
      });

      if (elapsedMs < durationMs) {
        motionRafRef.current = requestAnimationFrame(updatePlaybackRates);
        return;
      }

      motionRafRef.current = null;
      motionTargetRef.current = null;
      tracksStoppedRef.current = targetRate === 0;
      for (const animation of animations) {
        applyMarqueePlaybackRate(animation, targetRate);
        if (targetRate === 0) {
          animation.pause();
        }
      }
      onComplete?.();
    };

    motionRafRef.current = requestAnimationFrame(updatePlaybackRates);
  };

  const measureBubble = (item: IntegrationShowcaseItem, visible: boolean) => {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }
    const rect = anchor.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const placement = getCapabilityBubblePlacement(
      rect,
      viewport,
      getCapabilityBubbleSize(viewport, BUBBLE_HEIGHT_PX)
    );
    updateBubble({ item, ...placement, visible });
  };

  const handleBubbleMeasure = useCallback((height: number) => {
    const currentBubble = bubbleRef.current;
    const anchor = anchorRef.current;
    if (!currentBubble || !anchor || height <= 0) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const placement = getCapabilityBubblePlacement(
      rect,
      viewport,
      getCapabilityBubbleSize(viewport, height)
    );

    if (
      placement.left === currentBubble.left &&
      placement.top === currentBubble.top &&
      placement.placement === currentBubble.placement
    ) {
      return;
    }

    const nextBubble = { ...currentBubble, ...placement };
    bubbleRef.current = nextBubble;
    setBubble(nextBubble);
  }, []);

  const revealPendingBubble = () => {
    const item = pendingItemRef.current;
    if (!item || !anchorRef.current) {
      return;
    }
    cancelBubbleFrame();
    measureBubble(item, false);
    bubbleRafRef.current = requestAnimationFrame(() => {
      bubbleRafRef.current = null;
      if (pendingItemRef.current?.id === item.id) {
        measureBubble(item, true);
      }
    });
  };

  const openBubble = (
    item: IntegrationShowcaseItem,
    anchor: HTMLButtonElement
  ) => {
    cancelCloseTimer();
    cancelBubbleFrame();
    pendingItemRef.current = item;
    anchorRef.current = anchor;

    if (tracksStoppedRef.current) {
      measureBubble(item, true);
      return;
    }
    if (motionTargetRef.current === 0) {
      return;
    }

    rampTracksTo(
      0,
      INTEGRATION_MARQUEE_DECELERATION_DURATION_MS,
      revealPendingBubble
    );
  };

  const closeBubble = () => {
    pendingItemRef.current = null;
    cancelBubbleFrame();
    cancelCloseTimer();
    const currentBubble = bubbleRef.current;
    updateBubble(
      currentBubble ? { ...currentBubble, visible: false } : currentBubble
    );

    const resumeTracks = () => {
      anchorRef.current = null;
      updateBubble(null);
      rampTracksTo(1, INTEGRATION_MARQUEE_ACCELERATION_DURATION_MS);
    };

    if (!currentBubble) {
      resumeTracks();
      return;
    }
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      resumeTracks();
    }, INTEGRATION_BUBBLE_EXIT_DURATION_MS);
  };

  useEffect(() => {
    setPortalReady(true);
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateHoverSupport = () => setSupportsHover(hoverQuery.matches);
    updateHoverSupport();
    hoverQuery.addEventListener("change", updateHoverSupport);
    return () => {
      hoverQuery.removeEventListener("change", updateHoverSupport);
      clearScheduledWork();
    };
  }, []);

  useEffect(() => {
    if (!bubble) {
      return;
    }
    const reposition = () => {
      if (bubbleRafRef.current !== null) {
        return;
      }
      bubbleRafRef.current = requestAnimationFrame(() => {
        bubbleRafRef.current = null;
        const currentBubble = bubbleRef.current;
        if (currentBubble) {
          measureBubble(currentBubble.item, currentBubble.visible);
        }
      });
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [bubble?.item]);

  const handleMouseEnter = (
    item: IntegrationShowcaseItem,
    anchor: HTMLButtonElement
  ) => {
    if (supportsHover) {
      openBubble(item, anchor);
    }
  };

  const handleFocus = (
    item: IntegrationShowcaseItem,
    anchor: HTMLButtonElement
  ) => {
    if (anchor.matches(":focus-visible")) {
      openBubble(item, anchor);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      closeBubble();
      event.currentTarget.blur();
    }
  };

  const activeId = bubble?.item.id ?? null;

  return (
    <section
      aria-label="Integration ecosystem"
      className="home-integrations-showcase relative w-full overflow-hidden bg-background py-8 md:py-14"
    >
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-white via-white/80 to-transparent md:w-44" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-white via-white/80 to-transparent md:w-44" />
      <div className="flex flex-col gap-3 md:gap-5">
        {INTEGRATION_SHOWCASE_ROWS.map((row, rowIndex) => {
          const isReverse = rowIndex === 1;
          const repeatedRow = [...row, ...row];
          return (
            <div key={rowIndex} className="overflow-hidden py-1">
              <div
                ref={(track) => {
                  trackRefs.current[rowIndex] = track;
                }}
                className="home-integrations-track flex w-max gap-4 px-2 md:gap-5"
                data-direction={isReverse ? "left-to-right" : "right-to-left"}
                style={{
                  animationName: isReverse
                    ? "home-integrations-reverse"
                    : "home-integrations-forward",
                  animationDuration: `${INTEGRATION_MARQUEE_ROW_DURATIONS_SECONDS[rowIndex]}s`,
                }}
              >
                {repeatedRow.map((item, copyIndex) => (
                  <LogoButton
                    key={`${item.id}-${copyIndex}`}
                    item={item}
                    activeId={activeId}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={closeBubble}
                    onFocus={handleFocus}
                    onBlur={closeBubble}
                    onKeyDown={handleKeyDown}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {portalReady && bubble
        ? createPortal(
            <CapabilityBubble
              state={bubble}
              onMeasure={handleBubbleMeasure}
            />,
            document.body
          )
        : null}
    </section>
  );
}
