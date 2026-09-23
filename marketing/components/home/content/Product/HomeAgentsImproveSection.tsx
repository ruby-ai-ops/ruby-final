import { H2, P } from "@marketing/components/home/ContentComponents";
import { HomeEyebrow } from "@marketing/components/home/content/Product/HomeEyebrow";
import { HomeReveal } from "@marketing/components/home/content/Product/HomeReveal";
import {
  HOME_FEATURE_CARDS,
  HOME_FEATURE_VIDEO_SCALE,
  type HomeFeatureCard,
} from "@marketing/components/home/content/Product/homeFeatureCatalogData";
import { useEffect, useRef, useState } from "react";

const HOME_FEATURE_VIDEO_CSS = `
.home-feature-card {
  transition-property: transform, border-color, box-shadow, background-color;
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.home-feature-video {
  transform: scale(${HOME_FEATURE_VIDEO_SCALE.resting});
  transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
@media (hover: hover) and (pointer: fine) {
  .home-feature-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: rgba(106, 155, 204, 0.42);
    box-shadow: 0 30px 70px -38px rgba(35, 35, 32, 0.48);
  }
  .home-feature-card:hover .home-feature-video {
    transform: scale(${HOME_FEATURE_VIDEO_SCALE.hover});
  }
}
@media (hover: none) and (pointer: coarse) {
  .home-feature-card {
    will-change: auto;
  }
  .home-feature-card:active {
    border-color: rgba(106, 155, 204, 0.42);
  }
}
.home-feature-card:focus-visible {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(106, 155, 204, 0.42);
  box-shadow: 0 30px 70px -38px rgba(35, 35, 32, 0.48);
  outline: 2px solid #6a9bcc;
  outline-offset: 3px;
}
.home-feature-card:focus-visible .home-feature-video {
  transform: scale(${HOME_FEATURE_VIDEO_SCALE.hover});
}
@media (prefers-reduced-motion: reduce) {
  .home-feature-card,
  .home-feature-card:hover,
  .home-feature-card:focus-visible {
    transform: none;
    transition: border-color 120ms linear, box-shadow 120ms linear;
    will-change: auto;
  }
  .home-feature-video,
  .home-feature-card:hover .home-feature-video,
  .home-feature-card:focus-visible .home-feature-video {
    transform: none;
    transition: none;
    will-change: auto;
  }
}
`;

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function FeatureVideoCard({
  card,
  index,
}: {
  card: HomeFeatureCard;
  index: number;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const article = articleRef.current;
    const video = videoRef.current;
    if (!article || !video) {
      return;
    }

    if (reducedMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Muted autoplay can still be blocked; the first frame remains.
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(article);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

  return (
    <HomeReveal delay={index * 80} className="h-full">
      <article
        ref={articleRef}
        tabIndex={0}
        className="home-feature-card home-marketing-hover-surface group flex h-full flex-col overflow-hidden rounded-[20px] border border-black/[0.1] bg-[#faf9f6] shadow-[0_14px_30px_-24px_rgba(35,35,32,0.3)] sm:rounded-[28px]"
      >
        <div className="relative aspect-video overflow-hidden bg-muted-background">
          <video
            ref={videoRef}
            src={card.videoSrc}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="home-feature-video h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5 sm:p-7 md:p-8">
          <div className="flex items-center gap-4">
            <span
              className={`font-mono text-xl font-medium tracking-tight ${card.accent}`}
            >
              {card.number}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
              {card.title}
            </h3>
            <p className="m-0 text-sm leading-[1.55] text-muted-foreground">
              {card.subtitle}
            </p>
          </div>
        </div>
      </article>
    </HomeReveal>
  );
}

export function HomeAgentsImproveSection() {
  return (
    <section className="w-full bg-background py-14 lg:py-24">
      <style dangerouslySetInnerHTML={{ __html: HOME_FEATURE_VIDEO_CSS }} />
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-16 px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <HomeReveal>
            <HomeEyebrow label="Self-improving AI" />
          </HomeReveal>
          <HomeReveal delay={80}>
            <H2 className="max-w-[820px] text-balance text-center font-semibold leading-[1.08] tracking-[-0.03em] text-foreground">
              Agents that get smarter the more you use them
            </H2>
          </HomeReveal>
          <HomeReveal delay={160}>
            <P
              size="sm"
              className="max-w-[680px] text-center text-muted-foreground"
            >
              Ruby remembers what works, so your team doesn&apos;t have to start
              over.
            </P>
          </HomeReveal>
        </div>
        <div className="grid grid-cols-1 gap-6 min-[700px]:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {HOME_FEATURE_CARDS.map((card, index) => (
            <FeatureVideoCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
