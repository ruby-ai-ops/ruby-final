import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const WORKSPACE_DEMO_PATH = "/static/workspace-demo/index.html";
const WORKSPACE_DEMO_READY_MESSAGE = "workspace-demo:ready";
const WORKSPACE_DEMO_READY_REQUEST = "workspace-demo:ping";
const WORKSPACE_DEMO_READY_TIMEOUT_MS = 15_000;

type WorkspaceDemoStatus = "idle" | "loading" | "ready" | "error";

function subscribeToDesktopViewport(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getDesktopViewportSnapshot() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getServerDesktopViewportSnapshot() {
  return false;
}

function requestWorkspaceDemoReady(iframe: HTMLIFrameElement | null) {
  iframe?.contentWindow?.postMessage(
    { type: WORKSPACE_DEMO_READY_REQUEST },
    window.location.origin
  );
}

export function HomeWorkspaceDemo() {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopViewport,
    getDesktopViewportSnapshot,
    getServerDesktopViewportSnapshot
  );
  return isDesktop ? <DesktopWorkspaceDemo /> : null;
}

function DesktopWorkspaceDemo() {
  const shellRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isInViewportRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<WorkspaceDemoStatus>("idle");

  const sendVisibility = useCallback(() => {
    if (typeof IntersectionObserver === "undefined") {
      const rect = shellRef.current?.getBoundingClientRect();
      const width = rect
        ? Math.max(
            0,
            Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)
          )
        : 0;
      const height = rect
        ? Math.max(
            0,
            Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
          )
        : 0;
      isInViewportRef.current = Boolean(
        rect &&
          rect.width > 0 &&
          rect.height > 0 &&
          (width * height) / (rect.width * rect.height) >= 0.25
      );
    }
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "workspace-demo:visibility",
        visible:
          isInViewportRef.current && document.visibilityState === "visible",
      },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    let active = true;
    // Keep visibility independent of the larger lazy-loading margin. The ref
    // lets ready/load events read an observation before React renders again.
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (!active) {
                return;
              }
              for (const entry of entries) {
                isInViewportRef.current =
                  entry.isIntersecting && entry.intersectionRatio >= 0.25;
              }
              sendVisibility();
            },
            { threshold: 0.25 }
          );
    observer?.observe(shell);
    if (!observer) {
      sendVisibility();
      // Capture also catches scrolling inside an ancestor container.
      window.addEventListener("scroll", sendVisibility, true);
      window.addEventListener("resize", sendVisibility);
    }
    document.addEventListener("visibilitychange", sendVisibility);
    return () => {
      active = false;
      isInViewportRef.current = false;
      observer?.disconnect();
      if (!observer) {
        window.removeEventListener("scroll", sendVisibility, true);
        window.removeEventListener("resize", sendVisibility);
      }
      document.removeEventListener("visibilitychange", sendVisibility);
    };
  }, [sendVisibility]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    setStatus("loading");
    const readyTimeout = window.setTimeout(
      () => setStatus((current) => (current === "ready" ? current : "error")),
      WORKSPACE_DEMO_READY_TIMEOUT_MS
    );
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.type !== WORKSPACE_DEMO_READY_MESSAGE
      ) {
        return;
      }
      window.clearTimeout(readyTimeout);
      setStatus("ready");
      sendVisibility();
    };
    window.addEventListener("message", handleMessage);
    requestWorkspaceDemoReady(iframeRef.current);
    sendVisibility();
    return () => {
      window.clearTimeout(readyTimeout);
      window.removeEventListener("message", handleMessage);
    };
  }, [attempt, shouldLoad, sendVisibility]);

  return (
    <div
      ref={shellRef}
      data-testid="workspace-demo-shell"
      data-status={status}
      className="relative h-screen w-screen overflow-hidden bg-white"
    >
      {shouldLoad && (
        <iframe
          key={attempt}
          ref={iframeRef}
          title="Interactive Ruby workspace demo"
          src={`${WORKSPACE_DEMO_PATH}?attempt=${attempt}`}
          className="h-full w-full border-0"
          onLoad={() => {
            requestWorkspaceDemoReady(iframeRef.current);
            sendVisibility();
          }}
          onError={() => setStatus("error")}
        />
      )}
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-white text-sm text-[#737881]">
          Loading workspace…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-white">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="m-0 text-sm text-[#737881]">
              The workspace demo could not start.
            </p>
            <button
              type="button"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#17191c] shadow-sm"
              onClick={() => setAttempt((current) => current + 1)}
            >
              Retry workspace demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
