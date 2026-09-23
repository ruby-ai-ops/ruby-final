import { classNames } from "@marketing/lib/utils";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD_PX = 12;
const HIDE_SCROLL_DELTA_PX = 64;
const REVEAL_SCROLL_DELTA_PX = 12;

type ScrollDirection = "up" | "down" | null;

interface ScrollingHeaderProps {
  children: ReactNode;
  hasBanner?: boolean;
  hideAfterSelector?: string;
}

const ScrollingHeader = ({
  children,
  hasBanner = false,
  hideAfterSelector,
}: ScrollingHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const directionDistancePxRef = useRef(0);
  const directionRef = useRef<ScrollDirection>(null);
  const hideStartYRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  const updateHideStartY = useCallback(() => {
    if (!hideAfterSelector) {
      hideStartYRef.current = null;
      return;
    }

    const hideAfterElement =
      document.querySelector<HTMLElement>(hideAfterSelector);
    hideStartYRef.current = hideAfterElement
      ? hideAfterElement.getBoundingClientRect().top + window.scrollY
      : null;
  }, [hideAfterSelector]);

  const checkScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > SCROLL_THRESHOLD_PX);

    if (!hideAfterSelector) {
      return;
    }

    const scrollDeltaPx = currentScrollY - lastScrollYRef.current;
    lastScrollYRef.current = currentScrollY;

    if (hideStartYRef.current === null) {
      updateHideStartY();
    }

    const hideStartY = hideStartYRef.current;
    const canHide = hideStartY !== null && currentScrollY >= hideStartY;

    if (currentScrollY <= SCROLL_THRESHOLD_PX || !canHide) {
      directionRef.current = null;
      directionDistancePxRef.current = 0;
      setIsHidden(false);
      return;
    }

    if (scrollDeltaPx === 0) {
      return;
    }

    const direction: ScrollDirection = scrollDeltaPx > 0 ? "down" : "up";
    if (directionRef.current !== direction) {
      directionRef.current = direction;
      directionDistancePxRef.current = 0;
    }

    directionDistancePxRef.current += Math.abs(scrollDeltaPx);

    if (
      direction === "down" &&
      directionDistancePxRef.current >= HIDE_SCROLL_DELTA_PX
    ) {
      setIsHidden(true);
    }

    if (
      direction === "up" &&
      directionDistancePxRef.current >= REVEAL_SCROLL_DELTA_PX
    ) {
      setIsHidden(false);
    }
  }, [hideAfterSelector, updateHideStartY]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    updateHideStartY();
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });

    if (!hideAfterSelector) {
      return () => window.removeEventListener("scroll", checkScroll);
    }

    const handleResize = () => {
      updateHideStartY();
      checkScroll();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkScroll, hideAfterSelector, updateHideStartY]);

  // Keep the standard shell unchanged for every existing non-homepage caller.
  const defaultBaseClasses =
    "fixed top-0 w-full z-50 border-b transition-[transform,height,background-color,border-color] duration-200 ease-out xl:left-1/2 xl:right-auto xl:top-4 xl:w-[calc(100%-3rem)] xl:max-w-5xl xl:-translate-x-1/2 xl:rounded-2xl xl:border xl:border-border/70 xl:bg-background/92 xl:shadow-[0_8px_24px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.05)] xl:backdrop-blur-xl";
  const homepageBaseClasses =
    "fixed top-0 left-0 right-0 z-50 border-b transition-[transform,opacity,height,width,top,left,right,border-radius,background-color,border-color,box-shadow] ease-out motion-reduce:transition-none xl:left-1/2 xl:right-auto xl:top-4 xl:w-[calc(100%-3rem)] xl:max-w-5xl xl:-translate-x-1/2 xl:rounded-2xl xl:border xl:border-border/70 xl:bg-background/92 xl:shadow-[0_8px_24px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.05)] xl:backdrop-blur-xl";
  const defaultIdleClasses = `${hasBanner ? "translate-y-10" : "translate-y-0"} h-24 border-transparent xl:h-16 xl:border-border/70`;
  const homepageIdleClasses =
    "h-24 border-transparent xl:h-16 xl:border-border/70";
  const defaultScrolledClasses =
    "h-16 translate-y-0 border-border bg-muted-background/70 backdrop-blur-lg xl:bg-background/92";
  const homepageScrolledClasses =
    "left-3 right-3 top-3 h-16 rounded-2xl border border-border/70 bg-background/92 shadow-[0_8px_24px_rgba(15,23,42,0.1),0_2px_8px_rgba(15,23,42,0.06)] backdrop-blur-xl xl:left-1/2 xl:right-auto xl:top-4 xl:w-[calc(100%-3rem)] xl:max-w-5xl xl:-translate-x-1/2 xl:rounded-2xl xl:border-border/70 xl:bg-background/92";
  const homepageVisibleTranslateClass =
    !isScrolled && hasBanner ? "translate-y-10" : "translate-y-0";
  const homepageVisibilityClasses = isHidden
    ? "pointer-events-none -translate-y-full opacity-0 [transition-duration:420ms]"
    : `${homepageVisibleTranslateClass} opacity-100 [transition-duration:220ms]`;

  const combinedClasses = classNames(
    hideAfterSelector ? homepageBaseClasses : defaultBaseClasses,
    isScrolled
      ? hideAfterSelector
        ? homepageScrolledClasses
        : defaultScrolledClasses
      : hideAfterSelector
        ? homepageIdleClasses
        : defaultIdleClasses,
    hideAfterSelector ? homepageVisibilityClasses : false
  );

  return (
    <div className={combinedClasses}>
      <div className="absolute bottom-0 left-0 right-0 top-0 z-20">
        {children}
      </div>
    </div>
  );
};

export default ScrollingHeader;
