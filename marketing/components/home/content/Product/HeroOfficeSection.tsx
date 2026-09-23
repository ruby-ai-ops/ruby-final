// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file

import { HomeReveal } from "@marketing/components/home/content/Product/HomeReveal";
import { homeScenarios } from "@marketing/components/home/content/Product/heroOfficeScenario";
import { mountFloorScene } from "@marketing/components/home/content/Product/heroOfficeScene";
import { MarketingGradientSurface } from "@marketing/components/home/MarketingGradientSurface";
import type { TeamMember } from "@marketing/components/home/content/shared/team";
import { TRACKING_AREAS, withTracking } from "@marketing/lib/tracking";
import { LegacyButton as Button } from "@ruby-ai/ui";
import Link from "next/link";
import { useEffect, useRef } from "react";

const HEADLINE_LINE_1 = "The AI teammate that completes";
const HEADLINE_LINE_2 = "work across your tools.";
const LEAD_COPY =
  "Ruby connects the tools, people, and steps behind everyday work, taking repetitive work to completion while your team stays in control.";

const OFFICE_FIRST_NAMES = [
  "Aisha",
  "Amara",
  "Carlos",
  "David",
  "Elena",
  "James",
  "Kevin",
  "Leila",
  "Marcus",
  "Mei",
  "Natasha",
  "Omar",
  "Priya",
  "Raj",
  "Ryan",
  "Sarah",
  "Sofia",
  "Tyler",
  "Wei",
  "Yuki",
] as const;

const TEAM_POOL: TeamMember[] = OFFICE_FIRST_NAMES.map((firstName) => ({
  name: firstName,
  title: "",
  image: `/static/landing/people/office/${firstName.toLowerCase()}.png`,
  linkedIn: null,
  github: "",
}));

export function HeroOfficeSection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollToTeamUseCases = withTracking(
    TRACKING_AREAS.HOME,
    "hero_learn_more",
    () => {
      document
        .getElementById("team-use-cases")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  );

  useEffect(() => {
    const host = sceneRef.current;
    if (!host) {
      return;
    }
    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");
    let cleanupScene: (() => void) | null = null;

    const mountDesktopScene = () => {
      if (cleanupScene) {
        return;
      }
      host.removeAttribute("data-paused");
      const cleanup = mountFloorScene(host, {
        avatarPool: TEAM_POOL,
        scenarios: homeScenarios,
      });
      // Pause the scene's CSS animations when the hero scrolls out of view OR
      // the tab loses focus. The CSS rule
      //   .ruby-floor-host[data-paused="true"] * { animation-play-state: paused; }
      // freezes every running keyframe. We only toggle the attribute when the
      // resolved state actually changed (idempotent) and we ignore transient
      // off-screen flips with a 500ms debounce so browser-zoom reflow chatter
      // doesn't reach the DOM. WAAPI animations (chat card enter/exit) are
      // intentionally NOT paused — pausing them mid-fade snaps the playhead
      // and produces a visible flicker.
      let currentPaused = false;
      const setPaused = (paused: boolean) => {
        if (paused === currentPaused) {
          return;
        }
        currentPaused = paused;
        if (paused) {
          host.setAttribute("data-paused", "true");
        } else {
          host.removeAttribute("data-paused");
        }
      };
      let viewportInView = true;
      let tabVisible = document.visibilityState === "visible";
      let pendingPause: number | null = null;
      const sync = () => {
        if (pendingPause !== null) {
          clearTimeout(pendingPause);
          pendingPause = null;
        }
        const shouldPause = !(viewportInView && tabVisible);
        if (!shouldPause) {
          setPaused(false);
        } else {
          pendingPause = window.setTimeout(() => {
            pendingPause = null;
            setPaused(true);
          }, 500);
        }
      };
      const observer = new IntersectionObserver(([entry]) => {
        viewportInView = entry.isIntersecting;
        sync();
      });
      observer.observe(host);
      const onVisibility = () => {
        tabVisible = document.visibilityState === "visible";
        sync();
      };
      document.addEventListener("visibilitychange", onVisibility);
      cleanupScene = () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        if (pendingPause !== null) {
          clearTimeout(pendingPause);
        }
        cleanup();
        host.removeAttribute("data-paused");
        cleanupScene = null;
      };
    };

    const syncDesktopScene = () => {
      if (desktopMediaQuery.matches) {
        mountDesktopScene();
      } else {
        cleanupScene?.();
      }
    };

    syncDesktopScene();
    desktopMediaQuery.addEventListener("change", syncDesktopScene);
    return () => {
      desktopMediaQuery.removeEventListener("change", syncDesktopScene);
      cleanupScene?.();
    };
  }, []);

  return (
    <section className="relative w-full pb-12 lg:left-1/2 lg:right-1/2 lg:-ml-[50vw] lg:-mr-[50vw] lg:w-screen lg:min-h-[calc(100vh-4rem)]">
      <MarketingGradientSurface
        variant="hero"
        className="pointer-events-none inset-x-0 bottom-0 z-0"
      />
      <div className="home-hero-gradient-fade pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[200px]" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col-reverse items-stretch gap-10 px-5 pt-16 sm:px-6 lg:flex-row lg:items-center lg:gap-0 lg:px-10 lg:pt-24">
        <div className="z-10 flex w-full flex-col items-center gap-6 lg:w-[42%] lg:items-start lg:pr-8">
          <HomeReveal>
            <h1 className="m-0 text-balance text-center text-[clamp(38px,11vw,54px)] font-semibold leading-[90%] tracking-[-0.04em] text-foreground lg:text-left lg:text-[clamp(24px,2.5vw,44px)]">
              <span className="lg:whitespace-nowrap">{HEADLINE_LINE_1}</span>
              <br />
              <span className="lg:whitespace-nowrap">{HEADLINE_LINE_2}</span>
            </h1>
          </HomeReveal>
          <HomeReveal delay={80}>
            <p className="copy-lg max-w-[520px] text-pretty text-center leading-[1.55] text-muted-foreground lg:text-left">
              {LEAD_COPY}
            </p>
          </HomeReveal>
          <HomeReveal delay={160}>
            <div className="flex flex-row flex-wrap justify-center gap-3 lg:justify-start">
              <Button
                variant="primary"
                size="md"
                label="Explore what Ruby can do"
                onClick={scrollToTeamUseCases}
              />
              <Link href="/home/contact">
                <Button
                  variant="outline"
                  size="md"
                  label="Talk to us!"
                  onClick={withTracking(TRACKING_AREAS.HOME, "hero_book_demo")}
                />
              </Link>
            </div>
          </HomeReveal>
        </div>

        <HomeReveal
          delay={80}
          className="relative hidden w-full lg:block lg:w-[58%]"
        >
          <div
            ref={sceneRef}
            className="ruby-floor-host w-full lg:h-[min(86vh,900px)]"
            aria-hidden="true"
          />
        </HomeReveal>
      </div>
    </section>
  );
}
