import {
  Grid,
  H1,
  H2,
  H3,
  P,
} from "@marketing/components/home/ContentComponents";
import { HomeAIOperatorsCTASection } from "@marketing/components/home/content/Product/HomeAIOperatorsCTASection";
import { DemoVideoSection } from "@marketing/components/home/content/Solutions/DemoVideoSection";
import type { LandingLayoutProps } from "@marketing/components/home/LandingLayout";
import LandingLayout from "@marketing/components/home/LandingLayout";
import { PageMetadata } from "@marketing/components/home/PageMetadata";
import {
  MARKETING_SURFACES,
  isMarketingSurfaceVisible,
} from "@marketing/lib/marketing_visibility";
import TrustedBy from "@marketing/components/home/TrustedBy";
import { TRACKING_AREAS, withTracking } from "@marketing/lib/tracking";
import { classNames } from "@marketing/lib/utils";
import {
  LegacyButton as Button,
  CheckCircle,
  BarChart01,
  Edit04,
  File02,
  Icon,
  Lock01,
  MessageChatSquare,
  Planet,
} from "@ruby-ai/ui";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

const SECTION_CLASSES = "py-12 md:py-16";
const CONTAINER_CLASSES = "container mx-auto px-6";
const GRID_SECTION_CLASSES = classNames(
  "flex flex-col gap-16",
  "col-span-12",
  "lg:col-span-12 lg:col-start-1",
  "xl:col-span-12 xl:col-start-1",
  "2xl:col-start-1"
);

const DEMO_VIDEO = {
  sectionTitle: "See how it works",
  // TODO: Replace video URL with Marketing one.
  videoUrl: "/static/workspace-demo/index.html",
  showCaptions: true,
};

const ANNOTATED_HEADING_STYLE = {
  fontFamily: '"RubySerif", var(--font-display)',
  letterSpacing: "-0.05em",
};

export async function getStaticProps() {
  return {
    props: {
      gtmTrackingId: process.env.NEXT_PUBLIC_GTM_TRACKING_ID ?? null,
    },
  };
}

function HeroSection() {
  return (
    <div className="container flex w-full flex-col px-6 pt-8 md:px-4 md:pt-16">
      <Grid className="items-center gap-x-4 lg:gap-x-8">
        <div className="col-span-12 flex flex-col justify-center py-4 text-left lg:col-span-6 lg:col-start-1">
          <H1
            mono
            className="mb-4 text-4xl font-medium leading-tight md:text-5xl lg:text-6xl xl:text-7xl"
            style={ANNOTATED_HEADING_STYLE}
          >
            Create and share living documents
          </H1>
          <P
            size="lg"
            className="pb-6 text-muted-foreground md:max-w-lg md:pb-8"
          >
            Frames transforms agent outputs into interactive dashboards,
            reports, and memos your team can explore and collaborate on.
          </P>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              variant="primary"
              size="md"
              label="Get started"
              href="/home/pricing"
              className="w-full sm:w-auto"
              onClick={withTracking(TRACKING_AREAS.FRAMES, "hero_get_started")}
            />
            <Button
              variant="outline"
              size="md"
              label="Get a demo"
              href="/home/contact"
              className="w-full sm:w-auto"
              onClick={withTracking(TRACKING_AREAS.FRAMES, "hero_get_demo")}
            />
          </div>
        </div>

        {isMarketingSurfaceVisible(MARKETING_SURFACES.demoVideo) && (
          <div className="relative col-span-12 mt-8 py-2 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <iframe
                src="/static/workspace-demo/index.html"
                title="Frames Release"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 -top-[10%] h-[120%] w-full rounded-2xl"
                style={{
                  border: "none",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}
      </Grid>
    </div>
  );
}

function ContentInAction() {
  return (
    <div className={SECTION_CLASSES}>
      <div className={CONTAINER_CLASSES}>
        <div className="mb-12">
          <H2>Frames in action</H2>
          <P size="lg" className="mt-4 text-muted-foreground">
            AI agents shouldn't hand you static charts you paste into a slide
            and forget about. They should hand you something you can admin, edit,
            and tailor on the spot.
          </P>
        </div>

        <div className="space-y-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="order-1 flex items-center justify-center lg:order-1">
              <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg bg-blue-50">
                  <img
                    src="/static/landing/frames/SalesROI.svg"
                    alt="Data visualizations for client presentations"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="order-2 flex flex-col justify-center lg:order-2">
              <H3 className="mb-6">Sales</H3>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Icon
                    visual={Edit04}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Create deeply personal, shareable content as superior
                      outbound pitches.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={MessageChatSquare}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Personalize by prospect, adapt tone/language and context
                      from previous interactions.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={File02}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Transform conversation transcripts into enriched,
                      shareable follow-up content.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={BarChart01}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Visualize qualitative and quantitative Sales insights in a
                      smooth digestible format.
                    </P>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  label="See example"
                  href="https://ruby.ad/share/frame/4ce02864-6181-451b-812d-b862f0370736"
                  className="w-full sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 flex flex-col justify-center lg:order-1">
              <H3 className="mb-6">Marketing</H3>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Icon
                    visual={Edit04}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Generate personalized marketing materials and template
                      that can be automatically tailored to different audiences.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={File02}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Build scalable templates that personalize at scale while
                      maintaining brand guidelines.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={MessageChatSquare}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Create new shareable formats, optimized for different
                      marketing channels.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={BarChart01}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Turn campaign results into an editable infographic you can
                      tailor for exec reviews and posts.
                    </P>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  label="See example"
                  href="https://ruby.ad/share/frame/1d641570-96d0-4491-a0ec-9c9426ab1009"
                  className="w-full sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
            <div className="order-1 flex items-center justify-center lg:order-2">
              <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg bg-pink-50">
                  <img
                    src="/static/landing/frames/MarketingCampaign.svg"
                    alt="Campaign performance charts and A/B testing results"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="order-1 flex items-center justify-center lg:order-1">
              <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg bg-green-50">
                  <img
                    src="/static/landing/frames/UserEngagement.svg"
                    alt="Usage analytics and health score dashboards"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="order-2 flex flex-col justify-center lg:order-2">
              <H3 className="mb-6">Customer Success</H3>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Icon
                    visual={BarChart01}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Aggregate analytics and support data in engaging formats
                      with "talk to your data".
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={MessageChatSquare}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Create modular onboarding sessions based on previous
                      discussions.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={File02}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Create a renewal summary that pulls wins and gaps into one
                      live page.
                    </P>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  label="See example"
                  href="https://ruby.ad/share/frame/a8ac6c1e-93e9-473b-92af-dd1e55216ec6"
                  className="w-full sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 flex flex-col justify-center lg:order-1">
              <H3 className="mb-6">Product & Data</H3>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Icon
                    visual={Edit04}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Build simple proofs of concept without Figma or complex
                      tools.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={File02}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Convert raw notes, roadmap ideas, receipts into polished
                      visual decks.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={MessageChatSquare}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      Create shareable content for all-hands and team meetings.
                    </P>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <Icon
                    visual={BarChart01}
                    className="h-6 w-6 flex-shrink-0 text-sky-400"
                  />
                  <div>
                    <P size="sm" className="font-medium">
                      See data exactly how you want, merging tools into your
                      ideal interface.
                    </P>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  label="See example"
                  href="https://ruby.ad/share/frame/a3819cae-2716-472d-b71d-aa6f960a7079"
                  className="w-full sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
            <div className="order-1 flex items-center justify-center lg:order-2">
              <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg bg-purple-50">
                  <img
                    src="/static/landing/frames/ProductTeam.svg"
                    alt="Feature adoption charts and data exploration tools"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoSection() {
  if (!isMarketingSurfaceVisible(MARKETING_SURFACES.demoVideo)) {
    return null;
  }

  return (
    <Grid>
      <div className={GRID_SECTION_CLASSES}>
        <DemoVideoSection demoVideo={DEMO_VIDEO} />
      </div>
    </Grid>
  );
}

function AllTheBellsAndWhistlesSection() {
  return (
    <div className={SECTION_CLASSES}>
      <div className={CONTAINER_CLASSES}>
        <div className="mb-12">
          <H2>All the bells and whistles</H2>
        </div>

        <div className="flex w-full flex-col justify-between gap-6 md:flex-row">
          <div className="flex flex-1 flex-col rounded-2xl bg-gray-50 p-6">
            <Icon visual={Lock01} className="mb-4 h-8 w-8 text-gray-600" />
            <h4 className="text-lg font-semibold">
              Secure and collaborative by default
            </h4>
            <P size="sm" className="mt-1 text-muted-foreground">
              With share and control access, you can use Frames with your team,
              customers, or your boss and still sleep at night knowing you
              control who can touch what.
            </P>
          </div>
          <div className="flex flex-1 flex-col rounded-2xl bg-gray-50 p-6">
            <Icon visual={Planet} className="mb-4 h-8 w-8 text-gray-600" />
            <h4 className="text-lg font-semibold">Works anywhere</h4>
            <P size="sm" className="mt-1 text-muted-foreground">
              Works with whatever your AI agents produce: CSVs, JSON, plain
              text, or screenshots that need a glow-up.
            </P>
          </div>
          <div className="flex flex-1 flex-col rounded-2xl bg-gray-50 p-6">
            <Icon visual={CheckCircle} className="mb-4 h-8 w-8 text-gray-600" />
            <h4 className="text-lg font-semibold">Wears your jersey</h4>
            <P size="sm" className="mt-1 text-muted-foreground">
              Your charts, dashboards, and pages don't look like they came from
              "some tool." They wear your logo, colors, and style, so every
              share feels like it's from you.
            </P>
          </div>
        </div>
      </div>
    </div>
  );
}

function SharingAndAccessSection() {
  return (
    <div className="py-16 md:py-20">
      <div className={CONTAINER_CLASSES}>
        <div className="mb-12">
          <H2>Share and control access</H2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="order-1 flex items-center justify-center lg:order-1">
            <div className="w-full">
              <div className="relative w-full overflow-hidden rounded-lg bg-violet-100">
                <img
                  src="/static/landing/frames/Security-share.svg"
                  alt="Security and sharing interface showing access controls and sharing options"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="order-2 flex flex-col justify-center lg:order-2">
            <H3 className="mb-6">Secure and collaborative</H3>
            <P size="lg" className="text-muted-foreground">
              Share content with workspace members, or anyone via public links.
            </P>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FramesNextJS() {
  const router = useRouter();

  return (
    <>
      <PageMetadata
        title="Ruby Frames: Collaborative AI-Generated Visuals"
        description="Create frames with Ruby. Turn static outputs from your Ruby AI agents into collaborative, editable visuals, tailored to whoever you're sharing them with."
        pathname={router.asPath}
        ogImage="https://ruby.ad/static/landing/hero_ruby.png"
      />

      <div className="container flex w-full flex-col gap-16 px-2 py-2">
        <HeroSection />
        <ContentInAction />
        <AllTheBellsAndWhistlesSection />
        <SharingAndAccessSection />
        <VideoSection />
        {isMarketingSurfaceVisible(MARKETING_SURFACES.trustedSection) && (
          <TrustedBy logoSet="landing" />
        )}
        {isMarketingSurfaceVisible(MARKETING_SURFACES.aiOperatorsCta) && (
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
            <HomeAIOperatorsCTASection />
          </div>
        )}
      </div>
    </>
  );
}

FramesNextJS.getLayout = (
  page: ReactElement,
  pageProps: LandingLayoutProps
) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
