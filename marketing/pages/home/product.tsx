import { H2 } from "@marketing/components/home/ContentComponents";
import { CapabilitySection } from "@marketing/components/home/content/Product/CapabilitySection";
import { HomeAIOperatorsCTASection } from "@marketing/components/home/content/Product/HomeAIOperatorsCTASection";
import { InteractiveFeaturesSection } from "@marketing/components/home/content/Product/InteractiveFeaturesSection";
import { ProductIntroSection } from "@marketing/components/home/content/Product/ProductIntroSection";
import { SecurityFeaturesSection } from "@marketing/components/home/content/Product/SecurityFeaturesSection";
import { TestimonialSection } from "@marketing/components/home/content/Product/TestimonialSection";
import { FunctionsSection } from "@marketing/components/home/FunctionsSection";
import type { LandingLayoutProps } from "@marketing/components/home/LandingLayout";
import LandingLayout from "@marketing/components/home/LandingLayout";
import { PageMetadata } from "@marketing/components/home/PageMetadata";
import {
  MARKETING_SURFACES,
  isMarketingSurfaceVisible,
} from "@marketing/lib/marketing_visibility";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

export async function getStaticProps() {
  return {
    props: {
      shape: 0,
      gtmTrackingId: process.env.NEXT_PUBLIC_GTM_TRACKING_ID ?? null,
    },
  };
}

export function Landing() {
  const router = useRouter();

  return (
    <>
      <PageMetadata
        title="Ruby Product: AI Agents That Know Your Company"
        description="Discover how Ruby AI agents access your company knowledge, integrate with your tools, and help teams work smarter. Secure, customizable, and enterprise-ready."
        pathname={router.asPath}
      />
      <ProductIntroSection />
      <div className="mt-16">
        <CapabilitySection />
      </div>
      <div className="mt-16">
        <InteractiveFeaturesSection />
      </div>
      <div className="mt-16">
        <SecurityFeaturesSection />
      </div>
      {isMarketingSurfaceVisible(MARKETING_SURFACES.productTestimonial) &&
        isMarketingSurfaceVisible(MARKETING_SURFACES.resultsClaims) && (
          <div className="mt-16 w-full">
            <div className="mb-8 flex max-w-4xl flex-col gap-6 text-center sm:gap-2">
              <H2 className="text-center text-3xl font-medium md:text-4xl xl:text-5xl">
                Driving AI ROI Together
              </H2>
            </div>
            <TestimonialSection
              quote="Ruby is the most impactful software we've adopted since building Clay. It delivers immediate value while continuously getting smarter and more valuable over time"
              author={{
                name: "Everett Berry",
                title: "Head of GTM Engineering at Clay",
              }}
              company={{
                logo: "/static/landing/logos/color/clay_white.png",
                alt: "Clay logo",
              }}
              bgColor="bg-green-600"
              textColor="text-white"
            />
          </div>
        )}
      {isMarketingSurfaceVisible(MARKETING_SURFACES.productAgentExamples) && (
        <div className="mt-16">
          <FunctionsSection />
        </div>
      )}
      {isMarketingSurfaceVisible(MARKETING_SURFACES.aiOperatorsCta) && (
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16 w-screen">
          <HomeAIOperatorsCTASection />
        </div>
      )}
    </>
  );
}

export default function HomeNextJS() {
  return <Landing />;
}

HomeNextJS.getLayout = (page: ReactElement, pageProps: LandingLayoutProps) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
