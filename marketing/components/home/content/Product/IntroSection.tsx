import { HeroOfficeSection } from "@marketing/components/home/content/Product/HeroOfficeSection";
import { HomeAgentsImproveSection } from "@marketing/components/home/content/Product/HomeAgentsImproveSection";
import { HomeAIOperatorsCTASection } from "@marketing/components/home/content/Product/HomeAIOperatorsCTASection";
import { HomeIntegrationsMarquee } from "@marketing/components/home/content/Product/HomeIntegrationsMarquee";
import { HomeNewsSection } from "@marketing/components/home/content/Product/HomeNewsSection";
import { HomeQuotesSection } from "@marketing/components/home/content/Product/HomeQuotesSection";
import { HomeRevealStyles } from "@marketing/components/home/content/Product/HomeReveal";
import { HomeSecuritySection } from "@marketing/components/home/content/Product/HomeSecuritySection";
import { HomeTeamUsageSection } from "@marketing/components/home/content/Product/HomeTeamUsageSection";
import { HomeTrustedSection } from "@marketing/components/home/content/Product/HomeTrustedSection";
import type { NewsItem } from "@marketing/lib/homepage_news";
import {
  MARKETING_SURFACES,
  isMarketingSurfaceVisible,
} from "@marketing/lib/marketing_visibility";

const TESTIMONIAL_IMAGE = "/static/landing/people/quote-testimonial.png";

const QUOTES = [
  {
    quote:
      "Ruby is the most impactful software we've adopted since building Clay.",
    authorName: "Everett Berry",
    authorRole: "Head of GTM Engineering at Clay",
    imageSrc: TESTIMONIAL_IMAGE,
    imageAlt: "Everett Berry, Head of GTM Engineering at Clay",
  },
  {
    quote: "We used to do the work. Now we build the agents that do it.",
    authorName: "Shashank Khanna",
    authorRole: "Founder in Residence of GTM Innovation at Vanta",
    imageSrc: "/static/landing/people/shashank-khanna.png",
    imageAlt: "Shashank Khanna, Founder in Residence at Vanta",
    bg: "bg-violet-50",
  },
];

interface IntroSectionProps {
  news?: NewsItem[];
}

export function IntroSection({ news }: IntroSectionProps = {}) {
  return (
    <section className="home-marketing-page w-full">
      <HomeRevealStyles />
      <div className="flex flex-col">
        <HeroOfficeSection />
        <div className="relative flex w-full flex-col lg:left-1/2 lg:right-1/2 lg:-ml-[50vw] lg:-mr-[50vw] lg:w-screen">
          <HomeIntegrationsMarquee />
          <HomeTeamUsageSection />
          {isMarketingSurfaceVisible(MARKETING_SURFACES.trustedSection) && (
            <HomeTrustedSection />
          )}
          {isMarketingSurfaceVisible(
            MARKETING_SURFACES.testimonialCarousel
          ) && <HomeQuotesSection quotes={QUOTES} />}
          <HomeAgentsImproveSection />
          {isMarketingSurfaceVisible(MARKETING_SURFACES.newsSection) && (
            <HomeNewsSection news={news} />
          )}
          <HomeSecuritySection />
          <HomeAIOperatorsCTASection />
        </div>
      </div>
    </section>
  );
}
