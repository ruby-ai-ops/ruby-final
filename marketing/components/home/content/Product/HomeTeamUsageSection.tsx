// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
"use client";

import { H2 } from "@marketing/components/home/ContentComponents";
import { HomeEyebrow } from "@marketing/components/home/content/Product/HomeEyebrow";
import { HomeReveal } from "@marketing/components/home/content/Product/HomeReveal";
import { HomeSolutionCatalog } from "@marketing/components/home/content/Product/HomeSolutionCatalog";
import { HomeWorkspaceDemo } from "@marketing/components/home/content/Product/HomeWorkspaceDemo";
import type { TeamUsageId } from "@marketing/components/home/content/Product/homeTeamUsageData";
import { cn } from "@marketing/components/admin/shadcn/lib/utils";
import Image from "next/image";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

type UsageShape = "circle" | "pie-br" | "pie-bl" | "pie-tr" | "pie-tl";

const PIE_ROTATION: Record<Exclude<UsageShape, "circle">, number> = {
  "pie-br": 0,
  "pie-tr": 90,
  "pie-tl": 180,
  "pie-bl": 270,
};

interface UsagePoint {
  title: string;
  description: string;
  shape: UsageShape;
  colorClass: string;
}

interface UsageTab {
  id: TeamUsageId;
  label: string;
  heading: string;
  imageSrc: string;
  imageAlt: string;
  bg: string;
  points: UsagePoint[];
}

// The four shapes cycle through every tab so each list reads with the same
// rhythm: circle → quarter-pie left → quarter-pie right → circle.
const SHAPE_CYCLE: UsageShape[] = ["circle", "pie-bl", "pie-br", "circle"];

const TABS: UsageTab[] = [
  {
    id: "sales",
    label: "Sales",
    heading: "Sales\nOperations",
    imageSrc: "/static/landing/functions/sales.jpg",
    imageAlt: "Sales workflow placeholder",
    bg: "bg-green-100/40",
    points: [
      {
        title:
          "The client call ends. Ruby tells your sales team what mattered.",
        description:
          "The conversation is transcribed, the client’s concerns, buying signals, and commitments are surfaced, and the relevant sales-tool updates and internal next steps are prepared for review.",
        shape: SHAPE_CYCLE[0],
        colorClass: "text-blue-500",
      },
      {
        title:
          "A new lead arrives. Your rep knows what matters before replying.",
        description:
          "The lead’s details are gathered, relevant company context is added, the right owner is assigned, and a response is prepared for review.",
        shape: SHAPE_CYCLE[1],
        colorClass: "text-yellow-400",
      },
      {
        title: "Your sales tools stay updated.",
        description:
          "The latest client conversations and team activity flow into the sales tools your team already uses, so everyone sees what changed, what matters, and what still needs attention.",
        shape: SHAPE_CYCLE[2],
        colorClass: "text-pink-300",
      },
      {
        title:
          "The sales team enters the forecast call with answers, not guesses.",
        description:
          "The latest client conversations and sales activity are brought together, stalled deals and missing follow-through are surfaced, and the team gets the questions and next actions before the call.",
        shape: SHAPE_CYCLE[3],
        colorClass: "text-green-500",
      },
    ],
  },
  {
    id: "support",
    label: "Customer Support",
    heading: "Customer Support\nOperations",
    imageSrc: "/static/landing/functions/customersupport.jpg",
    imageAlt: "Customer support workflow placeholder",
    bg: "bg-blue-100/40",
    points: [
      {
        title: "The customer doesn’t have to repeat the story.",
        description:
          "The ticket, past conversations, account history, and relevant knowledge come together before the team replies.",
        shape: SHAPE_CYCLE[0],
        colorClass: "text-blue-400",
      },
      {
        title: "A frustrated customer doesn’t have to chase the team again.",
        description:
          "Escalation signals route the issue to the right internal owner with the customer’s full history attached.",
        shape: SHAPE_CYCLE[1],
        colorClass: "text-pink-300",
      },
      {
        title: "The morning queue is sorted before the team logs on.",
        description:
          "Incoming tickets are grouped by urgency and topic, routed internally, and surfaced when human judgment is needed.",
        shape: SHAPE_CYCLE[2],
        colorClass: "text-orange-400",
      },
      {
        title: "The next customer doesn’t make your team start from zero.",
        description:
          "Resolved tickets become reusable guidance, so support can find the answer instead of rebuilding it.",
        shape: SHAPE_CYCLE[3],
        colorClass: "text-green-500",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Content",
    heading: "Marketing & Content\nOperations",
    imageSrc: "/static/landing/functions/marketing.jpg",
    imageAlt: "Marketing workflow placeholder",
    bg: "bg-pink-100/40",
    points: [
      {
        title: "The brief doesn’t get buried in Slack.",
        description:
          "The scattered asks, files, decisions, deadline, and owner are pulled together, so the marketing team can start creating instead of decoding messages.",
        shape: SHAPE_CYCLE[0],
        colorClass: "text-pink-400",
      },
      {
        title: "Campaign-ready before the meeting.",
        description:
          "Source material, requirements, audience details, and approved company knowledge are brought together before the team sits down.",
        shape: SHAPE_CYCLE[1],
        colorClass: "text-orange-400",
      },
      {
        title: "A draft starts with the brand context already inside it.",
        description:
          "Research is gathered from approved sources, the outline is formed, and a review-ready draft is waiting for the team.",
        shape: SHAPE_CYCLE[2],
        colorClass: "text-blue-400",
      },
      {
        title: "The report ends with a next move, not another spreadsheet.",
        description:
          "Performance signals are brought together and turned into a recommendation and next action for review.",
        shape: SHAPE_CYCLE[3],
        colorClass: "text-green-500",
      },
    ],
  },
  {
    id: "data",
    label: "Data & Analytics",
    heading: "Data & Analytics\nOperations",
    imageSrc: "/static/landing/functions/data.jpg",
    imageAlt: "Data and analytics workflow placeholder",
    bg: "bg-violet-100/40",
    points: [
      {
        title: "The answer is ready when the meeting starts.",
        description:
          "Connected sources are searched, the relevant context is reconciled, and the basis for the answer is ready to inspect.",
        shape: SHAPE_CYCLE[0],
        colorClass: "text-blue-500",
      },
      {
        title: "Month-end starts with missing numbers already identified.",
        description:
          "Configured inputs are gathered, missing figures are flagged, and the internal follow-up is prepared before the process stalls.",
        shape: SHAPE_CYCLE[1],
        colorClass: "text-yellow-400",
      },
      {
        title: "The same question does not become a new analysis every week.",
        description:
          "A repeatable question becomes a shared workflow the team can run again.",
        shape: SHAPE_CYCLE[2],
        colorClass: "text-pink-300",
      },
      {
        title: "Exceptions reach the person who can act.",
        description:
          "Configured signals are checked, the cases needing judgment are surfaced, and the right owner is notified internally.",
        shape: SHAPE_CYCLE[3],
        colorClass: "text-green-500",
      },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    heading: "Engineering\nOperations",
    imageSrc: "/static/landing/functions/engineering.jpg",
    imageAlt: "Engineering team workflow placeholder",
    bg: "bg-orange-100/40",
    points: [
      {
        title: "A bug arrives with the evidence attached.",
        description:
          "Relevant discussions, documentation, and records are gathered before the issue reaches the person responsible.",
        shape: "circle",
        colorClass: "text-pink-300",
      },
      {
        title: "The decision made in the meeting becomes assigned work.",
        description:
          "The decision is captured, the next step is created, the relevant record is updated, and the owner is notified.",
        shape: "pie-bl",
        colorClass: "text-orange-500",
      },
      {
        title: "The status update is ready from the work already happening.",
        description:
          "Progress from connected systems is gathered into the update, without another round of status chasing.",
        shape: "pie-br",
        colorClass: "text-yellow-300",
      },
      {
        title: "An incident starts with context, not a scramble.",
        description:
          "Related history, owners, conversations, and next actions are brought together so the team can focus on the problem.",
        shape: "circle",
        colorClass: "text-green-700",
      },
    ],
  },
];

interface UsageMarkerProps {
  shape: UsageShape;
  colorClass: string;
  size?: number;
}

function UsageMarker({ shape, colorClass, size = 16 }: UsageMarkerProps) {
  if (shape === "circle") {
    return (
      <span
        aria-hidden="true"
        className={`block flex-shrink-0 rounded-full bg-current ${colorClass}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const rotation = PIE_ROTATION[shape];
  return (
    <span
      aria-hidden="true"
      className="block flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        className={`block ${colorClass}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <path d="M0 0 H12 A12 12 0 0 1 0 12 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

// Mirrors the carousel motion language from HomeQuotesSection: the outgoing
// panel slides off one side while the incoming panel slides in from the
// opposite side, both running on the same 300ms ease-out-cubic. Direction is
// derived from the tab index — clicking a tab further right slides content
// left (next), clicking a tab further left slides content right (prev).
const TEAM_SLIDE_DURATION_MS = 300;
const TEAM_AUTOPLAY_DURATION_MS = 8000;
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
const TEAM_PANEL_CSS = `
@keyframes home-team-tab-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@keyframes home-team-tab-shimmer {
  from {
    transform: translate3d(-140%, 0, 0) skewX(-18deg);
    opacity: 0;
  }
  20% {
    opacity: 0.85;
  }
  to {
    transform: translate3d(320%, 0, 0) skewX(-18deg);
    opacity: 0;
  }
}
.home-team-tab-underline {
  border-radius: 999px;
  background: rgb(17 24 39 / 0.18);
  box-shadow: 0 0 16px rgb(17 24 39 / 0.3);
}
.home-team-tab-progress {
  position: relative;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(90deg, #111827 0%, #4b5563 55%, #9ca3af 100%);
}
.home-team-tab-shimmer {
  position: absolute;
  inset: -1px auto -1px -35%;
  width: 32%;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.8), transparent);
  animation: home-team-tab-shimmer 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
  pointer-events: none;
}
@keyframes home-team-slide-in-right {
  from { transform: translate3d(48px, 0, 0); opacity: 0; }
  to { transform: translate3d(0, 0, 0); opacity: 1; }
}
@keyframes home-team-slide-in-left {
  from { transform: translate3d(-48px, 0, 0); opacity: 0; }
  to { transform: translate3d(0, 0, 0); opacity: 1; }
}
@keyframes home-team-slide-out-left {
  from { transform: translate3d(0, 0, 0); opacity: 1; }
  to { transform: translate3d(-48px, 0, 0); opacity: 0; }
}
@keyframes home-team-slide-out-right {
  from { transform: translate3d(0, 0, 0); opacity: 1; }
  to { transform: translate3d(48px, 0, 0); opacity: 0; }
}
@keyframes home-team-img-slide-in-right {
  from { transform: translate3d(16px, 0, 0); opacity: 0; }
  to { transform: translate3d(0, 0, 0); opacity: 1; }
}
@keyframes home-team-img-slide-in-left {
  from { transform: translate3d(-16px, 0, 0); opacity: 0; }
  to { transform: translate3d(0, 0, 0); opacity: 1; }
}
@keyframes home-team-img-slide-out-left {
  from { transform: translate3d(0, 0, 0); opacity: 1; }
  to { transform: translate3d(-16px, 0, 0); opacity: 0; }
}
@keyframes home-team-img-slide-out-right {
  from { transform: translate3d(0, 0, 0); opacity: 1; }
  to { transform: translate3d(16px, 0, 0); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .home-team-tab-progress {
    display: none;
    animation: none;
    transform: none;
  }
  .home-team-tab-shimmer {
    display: none;
    animation: none;
  }
  .home-team-slide,
  .home-team-img-slide {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
`;

interface TeamOutgoingState {
  id: TeamUsageId;
  direction: 1 | -1;
}

// Image and content are intentionally split so the two columns can animate
// independently on tab change — the image cross-fades in place (calm, stable
// reference) while the content slides horizontally with the tab direction
// (carries the directional intent). Both share the same 300ms ease-out-cubic
// so they finish together; only the motion paths differ.
function ImageCol({ tab, eager }: { tab: UsageTab; eager: boolean }) {
  return (
    <div
      className={`relative flex aspect-[16/11] w-full overflow-hidden rounded-2xl ${tab.bg} sm:aspect-[3/2] lg:aspect-auto lg:h-full lg:min-h-[500px]`}
    >
      <Image
        src={tab.imageSrc}
        alt={tab.imageAlt}
        fill
        loading={eager ? "eager" : "lazy"}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

function ContentCol({ tab }: { tab: UsageTab }) {
  return (
    <div className="flex flex-col gap-6 px-0 py-0 sm:px-1 sm:py-1 lg:gap-10 lg:px-5 lg:py-5">
      <h3 className="m-0 whitespace-pre-line text-3xl font-semibold leading-[0.98] tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
        {tab.heading}
      </h3>
      <ul className="m-0 flex list-none flex-col p-0">
        {tab.points.map((point, idx) => (
          <li
            key={point.title}
            className={`flex items-start gap-4 py-4 lg:gap-5 lg:py-5 ${
              idx > 0 ? "border-t border-border" : ""
            }`}
          >
            <span className="flex h-6 items-center pt-px lg:h-7">
              <UsageMarker shape={point.shape} colorClass={point.colorClass} />
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="text-base font-semibold tracking-[-0.01em] text-foreground lg:text-lg">
                {point.title}
              </div>
              <div className="text-[15px] leading-[1.45] text-muted-foreground sm:text-base">
                {point.description}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeTeamUsageSection() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const [outgoing, setOutgoing] = useState<TeamOutgoingState | null>(null);
  const [cycleKey, setCycleKey] = useState(0);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [isDocumentHidden, setIsDocumentHidden] = useState(false);
  // Keep the server and first client render identical. The media preference is
  // resolved after hydration, where it can safely control motion and scrolling.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMotionPreferenceResolved, setIsMotionPreferenceResolved] =
    useState(false);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Clear the outgoing slide once its exit animation completes — keeping it
  // in the DOM longer would keep two panels mounted and could trap focus.
  useEffect(() => {
    if (!outgoing || prefersReducedMotion) {
      return;
    }
    const t = window.setTimeout(
      () => setOutgoing(null),
      TEAM_SLIDE_DURATION_MS
    );
    return () => window.clearTimeout(t);
  }, [outgoing, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion && outgoing) {
      setOutgoing(null);
    }
  }, [outgoing, prefersReducedMotion]);

  const switchTo = (newId: TeamUsageId, directionOverride?: 1 | -1) => {
    if (newId === activeId) {
      return;
    }
    if (prefersReducedMotion) {
      setOutgoing(null);
      setActiveId(newId);
      setCycleKey((key) => key + 1);
      return;
    }
    if (outgoing) {
      return; // ignore mid-animation clicks
    }
    const oldIdx = TABS.findIndex((t) => t.id === activeId);
    const newIdx = TABS.findIndex((t) => t.id === newId);
    const direction: 1 | -1 = directionOverride ?? (newIdx > oldIdx ? 1 : -1);
    setOutgoing({ id: activeId, direction });
    setActiveId(newId);
    setCycleKey((key) => key + 1);
  };

  const selectTab = (newId: TeamUsageId) => {
    if (newId === activeId && !outgoing) {
      setCycleKey((key) => key + 1);
      return;
    }
    switchTo(newId);
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let destinationIndex: number;

    switch (event.key) {
      case "ArrowRight":
        destinationIndex = (currentIndex + 1) % TABS.length;
        break;
      case "ArrowLeft":
        destinationIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case "Home":
        destinationIndex = 0;
        break;
      case "End":
        destinationIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (outgoing) {
      return;
    }

    const destinationTab = TABS[destinationIndex];
    selectTab(destinationTab.id);
    document.getElementById(`team-tab-${destinationTab.id}`)?.focus();
  };

  useEffect(() => {
    const motionQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
    const updateMotionPreference = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };
    const updateDocumentVisibility = () => {
      setIsDocumentHidden(document.hidden);
    };

    updateMotionPreference();
    updateDocumentVisibility();
    setIsMotionPreferenceResolved(true);
    motionQuery.addEventListener("change", updateMotionPreference);
    document.addEventListener("visibilitychange", updateDocumentVisibility);

    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
      document.removeEventListener(
        "visibilitychange",
        updateDocumentVisibility
      );
    };
  }, []);

  useEffect(() => {
    const tabList = tabListRef.current;
    const activeTabElement = document.getElementById(`team-tab-${activeId}`);
    if (!tabList || !(activeTabElement instanceof HTMLButtonElement)) {
      return;
    }

    const maximumScrollLeft = Math.max(
      0,
      tabList.scrollWidth - tabList.clientWidth
    );
    const centeredScrollLeft = Math.max(
      0,
      Math.min(
        activeTabElement.offsetLeft -
          (tabList.clientWidth - activeTabElement.offsetWidth) / 2,
        maximumScrollLeft
      )
    );

    if (typeof tabList.scrollTo === "function") {
      tabList.scrollTo({
        behavior:
          prefersReducedMotion || !isMotionPreferenceResolved
            ? "auto"
            : "smooth",
        left: centeredScrollLeft,
      });
    }
  }, [activeId, isMotionPreferenceResolved, prefersReducedMotion]);

  const activeTab = TABS.find((t) => t.id === activeId) ?? TABS[0];
  const activeIndex = TABS.findIndex((t) => t.id === activeId);
  const nextTab = TABS[(activeIndex + 1) % TABS.length];
  const isAutoplayPaused =
    isFocusPaused ||
    isDocumentHidden ||
    prefersReducedMotion ||
    Boolean(outgoing);

  // Content (heading + list) slides horizontally with the tab direction.
  const visibleOutgoing = prefersReducedMotion ? null : outgoing;
  const incomingContentAnim = visibleOutgoing
    ? visibleOutgoing.direction === 1
      ? "home-team-slide-in-right"
      : "home-team-slide-in-left"
    : null;
  const outgoingContentAnim = visibleOutgoing
    ? visibleOutgoing.direction === 1
      ? "home-team-slide-out-left"
      : "home-team-slide-out-right"
    : null;
  // Image slides in the same direction as the content but at a much smaller
  // magnitude (16px vs 48px) — same motion language, lighter magnitude, so
  // the two columns feel layered rather than locked.
  const incomingImgAnim = visibleOutgoing
    ? visibleOutgoing.direction === 1
      ? "home-team-img-slide-in-right"
      : "home-team-img-slide-in-left"
    : null;
  const outgoingImgAnim = visibleOutgoing
    ? visibleOutgoing.direction === 1
      ? "home-team-img-slide-out-left"
      : "home-team-img-slide-out-right"
    : null;
  const animBase = `${TEAM_SLIDE_DURATION_MS}ms cubic-bezier(0.215, 0.61, 0.355, 1) both`;
  const outgoingTab = visibleOutgoing
    ? (TABS.find((t) => t.id === visibleOutgoing.id) ?? null)
    : null;

  return (
    <section
      id="team-use-cases"
      className="w-full scroll-mt-24 bg-background py-10 lg:py-16"
      onFocusCapture={() => setIsFocusPaused(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setIsFocusPaused(false);
        }
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: TEAM_PANEL_CSS }} />
      <div className="mx-auto flex w-full max-w-[1080px] flex-col px-5 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center lg:gap-5">
          <HomeReveal>
            <HomeEyebrow label="HOW TEAMS USE RUBY" />
          </HomeReveal>
          <HomeReveal delay={80}>
            <H2 className="max-w-[760px] max-lg:text-3xl text-balance text-center font-semibold leading-[1.08] tracking-[-0.03em] text-foreground sm:max-lg:text-4xl">
              From requests to done, across your tools.
            </H2>
          </HomeReveal>
          <HomeReveal delay={160}>
            <p className="m-0 max-w-[560px] text-[15px] leading-[1.55] text-muted-foreground sm:text-base">
              See how Ruby helps each team move work to done without adding more
              to manage.
            </p>
          </HomeReveal>
        </div>
      </div>

      <div className="hidden lg:block">
        <HomeWorkspaceDemo />
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1080px] flex-col gap-6 px-5 sm:px-6 lg:mt-8 lg:gap-8">
        <div data-mobile-team-panel className="flex flex-col gap-6 lg:hidden">
          {/* Custom tab nav with per-tab autoplay progress */}
          <HomeReveal delay={240}>
            <div
              role="tablist"
              aria-label="Team use cases"
              ref={tabListRef}
              className="home-team-tab-list relative flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden border-b border-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map((tab, tabIndex) => {
                const isActive = tab.id === activeId;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`team-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-controls={`team-panel-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(tab.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, tabIndex)}
                    className={cn(
                      "relative flex-none snap-center whitespace-nowrap px-4 py-3.5 text-sm transition-colors [transition-duration:280ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:py-4 md:text-base lg:flex-1",
                      isActive
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-4 bottom-0 h-[2px] overflow-hidden",
                        isActive && "home-team-tab-underline"
                      )}
                    >
                      {isActive &&
                        (prefersReducedMotion ? (
                          <span className="block h-full w-full rounded-full bg-foreground" />
                        ) : (
                          <>
                            <span
                              key={`${tab.id}-${cycleKey}`}
                              className="home-team-tab-progress block h-full w-full origin-left"
                              style={{
                                animation: `home-team-tab-progress ${TEAM_AUTOPLAY_DURATION_MS}ms linear forwards`,
                                animationPlayState: isAutoplayPaused
                                  ? "paused"
                                  : "running",
                              }}
                              onAnimationEnd={() => switchTo(nextTab.id, 1)}
                            />
                            <span
                              key={`${tab.id}-${cycleKey}-shimmer`}
                              aria-hidden="true"
                              className="home-team-tab-shimmer"
                            />
                          </>
                        ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </HomeReveal>

          {/* Two-column panel where image and content animate independently:
            the image slides a short 16px while the content slides the full
            48px in the tab direction. The panel itself is wrapped in a
            scroll-triggered HomeReveal so it fades up into view alongside
            the rest of the section. */}
          <HomeReveal delay={320}>
            <div
              role="tabpanel"
              id={`team-panel-${activeId}`}
              aria-labelledby={`team-tab-${activeId}`}
              className="home-team-panel-open grid grid-cols-1 gap-6 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8"
            >
              {/* Image column — relative wrapper with one in-flow ghost that
              sets the height and absolute-positioned layers stacked on top
              for the cross-fade slide. Using `relative` rather than `grid`
              lets the wrapper stretch to the panel grid's row height (which
              tracks the content column) so the image keeps the same tall
              presence it had before the split. */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="invisible" aria-hidden>
                  <ImageCol tab={activeTab} eager={false} />
                </div>
                {outgoingTab && outgoingImgAnim && (
                  <div
                    key={`out-img-${visibleOutgoing?.id}`}
                    className="home-team-img-slide absolute inset-0"
                    style={{ animation: `${outgoingImgAnim} ${animBase}` }}
                    aria-hidden
                  >
                    <ImageCol tab={outgoingTab} eager={false} />
                  </div>
                )}
                <div
                  key={`in-img-${activeId}`}
                  className="home-team-img-slide absolute inset-0"
                  style={
                    incomingImgAnim
                      ? { animation: `${incomingImgAnim} ${animBase}` }
                      : undefined
                  }
                >
                  <ImageCol tab={activeTab} eager={activeIndex === 0} />
                </div>
              </div>

              {/* Content column — horizontal slide. */}
              <div className="relative grid overflow-hidden">
                {TABS.map((t) => (
                  <div
                    key={`ghost-content-${t.id}`}
                    className="invisible col-start-1 row-start-1"
                    aria-hidden
                  >
                    <ContentCol tab={t} />
                  </div>
                ))}
                {outgoingTab && outgoingContentAnim && (
                  <div
                    key={`out-content-${visibleOutgoing?.id}`}
                    className="home-team-slide col-start-1 row-start-1"
                    style={{ animation: `${outgoingContentAnim} ${animBase}` }}
                    aria-hidden
                  >
                    <ContentCol tab={outgoingTab} />
                  </div>
                )}
                <div
                  key={`in-content-${activeId}`}
                  className="home-team-slide col-start-1 row-start-1"
                  style={
                    incomingContentAnim
                      ? { animation: `${incomingContentAnim} ${animBase}` }
                      : undefined
                  }
                >
                  <ContentCol tab={activeTab} />
                </div>
              </div>
            </div>
          </HomeReveal>
        </div>
        <HomeSolutionCatalog />
      </div>
    </section>
  );
}
