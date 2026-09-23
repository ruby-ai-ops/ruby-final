import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { DemoScenario } from "../../upstream/app/demo-scenarios";
import {
  workspaceChatTitle,
  workspaceCompanyScenarios,
} from "./scenario-overrides";
import "./autoplay.css";

export const AUTOPLAY_STREAMING_MS = 5850;
export const AUTOPLAY_READING_MS = 3000;
export const AUTOPLAY_INACTIVITY_MS = 8000;

export type WorkspacePlatform = "ruby" | "slack" | "teams";
export type AutoplayMode = "streaming" | "complete";
export type AutoplayStatus =
  | "paused"
  | "streaming"
  | "reading"
  | "waiting-for-inactivity"
  | "waiting-for-visibility";

export interface AutoplayNavigation {
  companyId: string;
  scenarioId: string;
  title: string;
}

export function buildOrderedTour(
  orderedCompanyIds: readonly string[]
): AutoplayNavigation[] {
  return orderedCompanyIds.flatMap((companyId) =>
    workspaceCompanyScenarios(companyId).map((scenario) => ({
      companyId,
      scenarioId: scenario.id,
      title: workspaceChatTitle(scenario),
    }))
  );
}

function findTourIndex(
  tour: readonly AutoplayNavigation[],
  companyId: string,
  scenarioId: string
) {
  return tour.findIndex(
    (entry) => entry.companyId === companyId && entry.scenarioId === scenarioId
  );
}

export function getCurrentTourPosition(
  tour: readonly AutoplayNavigation[],
  companyId: string,
  scenarioId: string
) {
  const index = findTourIndex(tour, companyId, scenarioId);
  return index < 0 ? 0 : index + 1;
}

export function getNextTourEntry(
  tour: readonly AutoplayNavigation[],
  companyId: string,
  scenarioId: string
) {
  if (tour.length === 0) {
    return undefined;
  }
  const index = findTourIndex(tour, companyId, scenarioId);
  if (index < 0) {
    return tour[0];
  }
  return tour[(index + 1) % tour.length];
}

export function didTourWrap(
  tour: readonly AutoplayNavigation[],
  companyId: string,
  scenarioId: string
) {
  return (
    tour.length > 0 &&
    findTourIndex(tour, companyId, scenarioId) === tour.length - 1
  );
}

interface ActiveClock {
  elapsedMs: number;
  resumedAtMs: number | null;
}

interface ManualTarget {
  companyId: string;
  scenarioId: string;
}

interface WorkspaceAutoplayContextValue {
  mode: AutoplayMode;
  status: AutoplayStatus;
  paused: boolean;
  runIdentity: number;
  animationActive: boolean;
  getActiveElapsedMs: () => number;
  position: number;
  total: number;
  title: string;
  togglePaused: () => void;
  notifyManualNavigation: (companyId: string, scenarioId: string) => void;
  getScrollPosition: (
    scenarioId: string,
    platform: WorkspacePlatform
  ) => number | undefined;
  setScrollPosition: (
    scenarioId: string,
    platform: WorkspacePlatform,
    scrollTop: number
  ) => void;
}

const WorkspaceAutoplayContext =
  createContext<WorkspaceAutoplayContextValue | null>(null);

export interface WorkspaceAutoplayProviderProps {
  orderedCompanyIds: readonly string[];
  activeCompanyId: string;
  activeScenario: DemoScenario;
  activePlatform: WorkspacePlatform;
  restored: boolean;
  children: ReactNode;
  onNavigate: (navigation: AutoplayNavigation) => void;
}

function selectionKey(companyId: string, scenarioId: string) {
  return `${companyId}:${scenarioId}`;
}

function scrollKey(scenarioId: string, platform: WorkspacePlatform) {
  return `${scenarioId}:${platform}`;
}

function isExcludedActivityTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(
      "[data-autoplay-control], [data-autoplay-platform-control], .platform-switcher, .mobile-platform-switcher"
    ) !== null
  );
}

function isEditable(element: Element | null) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
}

function hasOpenSurface(boundary: HTMLElement) {
  return (
    boundary.querySelector(
      "dialog[open], [role='dialog'][aria-modal='true']:is([data-state='open'], [aria-hidden='false']), [role='menu']:is([data-state='open'], [aria-hidden='false'], [aria-expanded='true']), [data-autoplay-blocker='true']"
    ) !== null
  );
}

export function WorkspaceAutoplayProvider({
  orderedCompanyIds,
  activeCompanyId,
  activeScenario,
  activePlatform,
  restored,
  children,
  onNavigate,
}: WorkspaceAutoplayProviderProps) {
  const tour = useMemo(
    () => buildOrderedTour(orderedCompanyIds),
    [orderedCompanyIds]
  );
  const reducedMotionRef = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [paused, setPaused] = useState(reducedMotionRef.current);
  const [mode, setMode] = useState<AutoplayMode>(
    reducedMotionRef.current ? "complete" : "streaming"
  );
  const [documentVisible, setDocumentVisible] = useState(
    document.visibilityState === "visible"
  );
  const [hostVisible, setHostVisible] = useState(window.parent === window);
  const [blocked, setBlocked] = useState(false);
  const [revision, setRevision] = useState(0);
  const [runIdentity, setRunIdentity] = useState(1);
  const [transitionPhase, setTransitionPhase] = useState<"out" | "in" | null>(
    null
  );
  const boundaryRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<ActiveClock>({ elapsedMs: 0, resumedAtMs: null });
  const completedScenarioIdsRef = useRef(
    new Set(reducedMotionRef.current ? [activeScenario.id] : [])
  );
  const readDeadlineMsRef = useRef(
    reducedMotionRef.current
      ? AUTOPLAY_READING_MS
      : AUTOPLAY_STREAMING_MS + AUTOPLAY_READING_MS
  );
  const inactivityDeadlineMsRef = useRef<number | null>(null);
  const scrollPositionsRef = useRef(new Map<string, number>());
  const previousSelectionRef = useRef(
    selectionKey(activeCompanyId, activeScenario.id)
  );
  const previousPlatformRef = useRef(activePlatform);
  const manualTargetRef = useRef<ManualTarget | null>(null);
  const pendingNavigationRef = useRef<string | null>(null);
  const onNavigateRef = useRef(onNavigate);
  const schedulerRevisionRef = useRef(0);
  const draggingRef = useRef(false);
  const blockedRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);
  const outgoingLayerRef = useRef<HTMLElement | null>(null);
  const canRun = restored && !paused && documentVisible && hostVisible;

  onNavigateRef.current = onNavigate;

  const currentElapsedMs = useCallback(() => {
    const clock = clockRef.current;
    if (clock.resumedAtMs === null) {
      return clock.elapsedMs;
    }
    return clock.elapsedMs + performance.now() - clock.resumedAtMs;
  }, []);

  const synchronizeClock = useCallback((running: boolean) => {
    const clock = clockRef.current;
    if (running && clock.resumedAtMs === null) {
      clock.resumedAtMs = performance.now();
    } else if (!running && clock.resumedAtMs !== null) {
      clock.elapsedMs += performance.now() - clock.resumedAtMs;
      clock.resumedAtMs = null;
    }
  }, []);

  const resetClock = useCallback((running: boolean) => {
    clockRef.current = {
      elapsedMs: 0,
      resumedAtMs: running ? performance.now() : null,
    };
  }, []);

  const clearTransition = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    outgoingLayerRef.current?.remove();
    outgoingLayerRef.current = null;
    setTransitionPhase(null);
  }, []);

  const createTransitionSnapshot = useCallback(() => {
    const scroller = boundaryRef.current?.querySelector<HTMLElement>(
      ".conversation-scroll"
    );
    const host = scroller?.parentElement;
    if (!scroller || !host) {
      return;
    }
    outgoingLayerRef.current?.remove();
    const clone = scroller.cloneNode(true) as HTMLElement;
    const sourceRect = scroller.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    clone.setAttribute("data-autoplay-outgoing", "");
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    Object.assign(clone.style, {
      height: `${sourceRect.height}px`,
      left: `${sourceRect.left - hostRect.left}px`,
      margin: "0",
      pointerEvents: "none",
      position: "absolute",
      top: `${sourceRect.top - hostRect.top}px`,
      width: `${sourceRect.width}px`,
      zIndex: "4",
    });
    host.appendChild(clone);
    outgoingLayerRef.current = clone;
  }, []);

  const requestRender = useCallback(() => {
    schedulerRevisionRef.current += 1;
    setRevision((revision) => revision + 1);
  }, []);

  const recordActivity = useCallback(() => {
    inactivityDeadlineMsRef.current =
      currentElapsedMs() + AUTOPLAY_INACTIVITY_MS;
    requestRender();
  }, [currentElapsedMs, requestRender]);

  const restartCurrentScenario = useCallback(() => {
    clearTransition();
    completedScenarioIdsRef.current.delete(activeScenario.id);
    resetClock(canRun);
    setRunIdentity((identity) => identity + 1);
    setMode(reducedMotionRef.current ? "complete" : "streaming");
    if (reducedMotionRef.current) {
      completedScenarioIdsRef.current.add(activeScenario.id);
      readDeadlineMsRef.current = AUTOPLAY_READING_MS;
    } else {
      readDeadlineMsRef.current = AUTOPLAY_STREAMING_MS + AUTOPLAY_READING_MS;
    }
    pendingNavigationRef.current = null;
    recordActivity();
  }, [activeScenario.id, canRun, clearTransition, recordActivity, resetClock]);

  const notifyManualNavigation = useCallback(
    (companyId: string, scenarioId: string) => {
      clearTransition();
      manualTargetRef.current = { companyId, scenarioId };
      pendingNavigationRef.current = null;
      const targetKey = selectionKey(companyId, scenarioId);
      if (targetKey === selectionKey(activeCompanyId, activeScenario.id)) {
        manualTargetRef.current = null;
        restartCurrentScenario();
        return;
      }
      recordActivity();
    },
    [
      activeCompanyId,
      activeScenario.id,
      clearTransition,
      recordActivity,
      restartCurrentScenario,
    ]
  );

  const togglePaused = useCallback(() => {
    if (paused && mode === "complete") {
      readDeadlineMsRef.current = currentElapsedMs() + AUTOPLAY_READING_MS;
    }
    setPaused(!paused);
  }, [currentElapsedMs, mode, paused]);

  const getScrollPosition = useCallback(
    (scenarioId: string, platform: WorkspacePlatform) =>
      scrollPositionsRef.current.get(scrollKey(scenarioId, platform)),
    []
  );

  const setScrollPosition = useCallback(
    (scenarioId: string, platform: WorkspacePlatform, scrollTop: number) => {
      scrollPositionsRef.current.set(
        scrollKey(scenarioId, platform),
        scrollTop
      );
      setRevision((revision) => revision + 1);
    },
    []
  );

  useEffect(() => {
    const nextSelection = selectionKey(activeCompanyId, activeScenario.id);
    const selectionChanged = previousSelectionRef.current !== nextSelection;
    const platformChanged = previousPlatformRef.current !== activePlatform;
    previousPlatformRef.current = activePlatform;
    if (selectionChanged) {
      const autoplayNavigation = pendingNavigationRef.current === nextSelection;
      const manualNavigation =
        manualTargetRef.current?.companyId === activeCompanyId &&
        manualTargetRef.current.scenarioId === activeScenario.id;
      if (!autoplayNavigation) {
        clearTransition();
      }
      previousSelectionRef.current = nextSelection;
      pendingNavigationRef.current = null;
      manualTargetRef.current = null;
      resetClock(canRun);
      const complete = completedScenarioIdsRef.current.has(activeScenario.id);
      if (!complete && !reducedMotionRef.current) {
        setRunIdentity((identity) => identity + 1);
      }
      setMode(complete || reducedMotionRef.current ? "complete" : "streaming");
      if (reducedMotionRef.current) {
        completedScenarioIdsRef.current.add(activeScenario.id);
      }
      readDeadlineMsRef.current =
        complete || reducedMotionRef.current
          ? AUTOPLAY_READING_MS
          : AUTOPLAY_STREAMING_MS + AUTOPLAY_READING_MS;
      inactivityDeadlineMsRef.current = manualNavigation
        ? AUTOPLAY_INACTIVITY_MS
        : null;
      if (!autoplayNavigation && !manualNavigation) {
        inactivityDeadlineMsRef.current = AUTOPLAY_INACTIVITY_MS;
      }
      requestRender();
      return;
    }
    if (platformChanged && mode === "complete") {
      readDeadlineMsRef.current = currentElapsedMs() + AUTOPLAY_READING_MS;
      requestRender();
    }
  }, [
    activeCompanyId,
    activePlatform,
    activeScenario.id,
    canRun,
    clearTransition,
    currentElapsedMs,
    mode,
    requestRender,
    resetClock,
  ]);

  useEffect(
    () => () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      outgoingLayerRef.current?.remove();
    },
    []
  );

  useEffect(() => {
    const visibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };
    const message = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        event.data?.type !== "workspace-demo:visibility" ||
        typeof event.data.visible !== "boolean"
      ) {
        return;
      }
      setHostVisible(event.data.visible);
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("message", message);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("message", message);
    };
  }, []);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) {
      return;
    }

    const refreshBlocker = () => {
      const nextBlocked =
        draggingRef.current ||
        isEditable(document.activeElement) ||
        hasOpenSurface(boundary);
      if (blockedRef.current && !nextBlocked) {
        inactivityDeadlineMsRef.current =
          currentElapsedMs() + AUTOPLAY_INACTIVITY_MS;
        requestRender();
      }
      blockedRef.current = nextBlocked;
      setBlocked(nextBlocked);
    };
    const activity = (event: Event) => {
      if (!isExcludedActivityTarget(event.target)) {
        recordActivity();
      }
    };
    const click = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element) {
        const button = target.closest("button");
        if (
          button &&
          boundary.contains(button) &&
          (button.hasAttribute("data-autoplay-current-chat") ||
            ((button.getAttribute("aria-current") === "page" ||
              button.classList.contains("is-active")) &&
              button.getAttribute("aria-label") ===
                `${workspaceChatTitle(activeScenario)} channel`))
        ) {
          restartCurrentScenario();
          return;
        }
      }
      activity(event);
    };
    const focus = (event: FocusEvent) => {
      activity(event);
      refreshBlocker();
    };
    const dragStart = (event: DragEvent) => {
      activity(event);
      draggingRef.current = true;
      refreshBlocker();
    };
    const dragEnd = () => {
      draggingRef.current = false;
      refreshBlocker();
    };
    const events = ["wheel", "touchstart", "pointerdown", "keydown"];
    for (const eventName of events) {
      boundary.addEventListener(eventName, activity, true);
    }
    boundary.addEventListener("focusin", focus, true);
    boundary.addEventListener("click", click, true);
    boundary.addEventListener("focusout", focus, true);
    boundary.addEventListener("dragstart", dragStart, true);
    boundary.addEventListener("dragend", dragEnd, true);
    boundary.addEventListener("drop", dragEnd, true);
    const observer = new MutationObserver(refreshBlocker);
    observer.observe(boundary, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    refreshBlocker();
    return () => {
      for (const eventName of events) {
        boundary.removeEventListener(eventName, activity, true);
      }
      boundary.removeEventListener("focusin", focus, true);
      boundary.removeEventListener("click", click, true);
      boundary.removeEventListener("focusout", focus, true);
      boundary.removeEventListener("dragstart", dragStart, true);
      boundary.removeEventListener("dragend", dragEnd, true);
      boundary.removeEventListener("drop", dragEnd, true);
      observer.disconnect();
    };
  }, [
    activeScenario,
    currentElapsedMs,
    recordActivity,
    requestRender,
    restartCurrentScenario,
  ]);

  useEffect(() => {
    synchronizeClock(canRun);
    schedulerRevisionRef.current += 1;
    const schedulerRevision = schedulerRevisionRef.current;
    if (!canRun || pendingNavigationRef.current !== null) {
      return;
    }

    const elapsedMs = currentElapsedMs();
    if (mode === "streaming" && elapsedMs >= AUTOPLAY_STREAMING_MS) {
      completedScenarioIdsRef.current.add(activeScenario.id);
      setMode("complete");
      return;
    }

    const advanceDeadlineMs = Math.max(
      readDeadlineMsRef.current,
      inactivityDeadlineMsRef.current ?? 0
    );
    if (mode === "complete" && !blocked && elapsedMs >= advanceDeadlineMs) {
      const next = getNextTourEntry(tour, activeCompanyId, activeScenario.id);
      if (!next) {
        return;
      }
      if (didTourWrap(tour, activeCompanyId, activeScenario.id)) {
        completedScenarioIdsRef.current.clear();
      }
      pendingNavigationRef.current = selectionKey(
        next.companyId,
        next.scenarioId
      );
      if (reducedMotionRef.current) {
        onNavigateRef.current(next);
      } else {
        createTransitionSnapshot();
        setTransitionPhase("in");
        onNavigateRef.current(next);
        transitionTimerRef.current = window.setTimeout(() => {
          clearTransition();
        }, 140);
      }
      requestRender();
      return;
    }

    if (
      mode === "complete" &&
      blocked &&
      elapsedMs >= readDeadlineMsRef.current
    ) {
      return;
    }

    const nextDeadlineMs =
      mode === "streaming"
        ? AUTOPLAY_STREAMING_MS
        : blocked
          ? readDeadlineMsRef.current
          : elapsedMs < readDeadlineMsRef.current
            ? readDeadlineMsRef.current
            : advanceDeadlineMs;
    const delayMs = Math.max(0, nextDeadlineMs - elapsedMs);
    const schedulerId = window.setTimeout(() => {
      if (schedulerRevision === schedulerRevisionRef.current) {
        setRevision((revision) => revision + 1);
      }
    }, delayMs);
    return () => window.clearTimeout(schedulerId);
  }, [
    activeCompanyId,
    activeScenario.id,
    blocked,
    canRun,
    clearTransition,
    createTransitionSnapshot,
    currentElapsedMs,
    mode,
    requestRender,
    revision,
    synchronizeClock,
    tour,
  ]);

  const elapsedMs = currentElapsedMs();
  let status: AutoplayStatus;
  if (paused) {
    status = "paused";
  } else if (!documentVisible || !hostVisible) {
    status = "waiting-for-visibility";
  } else if (mode === "streaming") {
    status = "streaming";
  } else if (elapsedMs < readDeadlineMsRef.current) {
    status = "reading";
  } else if (blocked || elapsedMs < (inactivityDeadlineMsRef.current ?? 0)) {
    status = "waiting-for-inactivity";
  } else {
    status = "reading";
  }

  const value = useMemo<WorkspaceAutoplayContextValue>(
    () => ({
      mode,
      status,
      paused,
      runIdentity,
      animationActive: canRun && mode === "streaming",
      getActiveElapsedMs: currentElapsedMs,
      position: getCurrentTourPosition(
        tour,
        activeCompanyId,
        activeScenario.id
      ),
      total: tour.length,
      title: workspaceChatTitle(activeScenario),
      togglePaused,
      notifyManualNavigation,
      getScrollPosition,
      setScrollPosition,
    }),
    [
      activeCompanyId,
      activeScenario,
      canRun,
      currentElapsedMs,
      getScrollPosition,
      mode,
      notifyManualNavigation,
      paused,
      revision,
      runIdentity,
      setScrollPosition,
      status,
      togglePaused,
      tour,
    ]
  );

  return (
    <WorkspaceAutoplayContext.Provider value={value}>
      <div
        ref={boundaryRef}
        data-autoplay-boundary=""
        data-autoplay-transition={transitionPhase ?? undefined}
        style={{ display: "contents" }}
      >
        {children}
      </div>
    </WorkspaceAutoplayContext.Provider>
  );
}

export function useWorkspaceAutoplay() {
  const value = useContext(WorkspaceAutoplayContext);
  if (!value) {
    throw new Error(
      "useWorkspaceAutoplay must be used within WorkspaceAutoplayProvider"
    );
  }
  return value;
}

const statusDescriptions: Record<AutoplayStatus, string> = {
  paused: "autoplay is paused",
  streaming: "autoplay is streaming",
  reading: "autoplay is reading",
  "waiting-for-inactivity": "autoplay is waiting for inactivity",
  "waiting-for-visibility": "autoplay is waiting for visibility",
};

export function AutoplayComposerControl() {
  const autoplay = useWorkspaceAutoplay();
  const descriptionId = useId();
  return (
    <button
      type="button"
      data-autoplay-control=""
      aria-label={autoplay.paused ? "Play autoplay" : "Pause autoplay"}
      aria-describedby={descriptionId}
      onClick={autoplay.togglePaused}
      className="autoplay-composer-control"
    >
      <i
        aria-hidden="true"
        className={autoplay.paused ? "fa-solid fa-play" : "fa-solid fa-pause"}
      />
      <span aria-hidden="true" className="autoplay-composer-counter">
        {autoplay.position} / {autoplay.total}
      </span>
      <span id={descriptionId} className="autoplay-visually-hidden">
        Conversation {autoplay.position} of {autoplay.total}, {autoplay.title};{" "}
        {statusDescriptions[autoplay.status]}.
      </span>
    </button>
  );
}
