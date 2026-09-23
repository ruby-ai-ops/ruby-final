import {
  ImgBlock,
  QuoteSection,
} from "@marketing/components/home/ContentBlocks";
import { Grid } from "@marketing/components/home/ContentComponents";
import { ExtensibilitySection } from "@marketing/components/home/content/Product/ExtensibilitySection";
import { PlatformIntroSection } from "@marketing/components/home/content/Product/PlatformIntroSection";
import type { DemoVideoProps } from "@marketing/components/home/content/Solutions/DemoVideoSection";
import { DemoVideoSection } from "@marketing/components/home/content/Solutions/DemoVideoSection";
import { VisibilityGate } from "@marketing/components/home/content/Solutions/VisibilityGate";
import type { LandingLayoutProps } from "@marketing/components/home/LandingLayout";
import LandingLayout from "@marketing/components/home/LandingLayout";
import { PageMetadata } from "@marketing/components/home/PageMetadata";
import { MARKETING_SURFACES } from "@marketing/lib/marketing_visibility";
import { TRACKING_AREAS, withTracking } from "@marketing/lib/tracking";
import { classNames } from "@marketing/lib/utils";
import {
  LegacyButton as Button,
  Div3D,
  Hover3D,
  Rocket02,
} from "@ruby-ai/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

export async function getStaticProps() {
  return {
    props: {
      gtmTrackingId: process.env.NEXT_PUBLIC_GTM_TRACKING_ID ?? null,
    },
  };
}

export const DemoVideo: DemoVideoProps = {
  sectionTitle: "Ruby in motion",
  videoUrl:
    "/static/workspace-demo/index.html",
};

export default function RubyPlatformNextJS() {
  const router = useRouter();

  return (
    <>
      <PageMetadata
        title="Ruby AI Platform: Build Custom AI Agents for Your Organization"
        description="The enterprise platform for building, deploying, and managing AI agents. Connect your tools, customize workflows, and maintain security and compliance."
        pathname={router.asPath}
      />
      <PlatformIntroSection />
      <Grid>
        <div
          className={classNames(
            "col-span-12 grid grid-cols-1 gap-8",
            "md:grid-cols-3"
          )}
        >
          <ImgBlock
            title={
              <span className="font-['Bricolage_Grotesque'] tracking-[-0.05em]">
                MCP: Integrate custom tools into Ruby agents
              </span>
            }
            content={[
              <>
                Seamlessly connect your own and external tools to Ruby agents
                using MCP servers. Customize agent capabilities, manage
                authentication, and control access—all through a flexible
                integration framework.
              </>,
            ]}
          >
            <Hover3D
              depth={-20}
              perspective={1000}
              className={classNames("relative")}
            >
              <Div3D depth={-20}>
                <img src="/static/landing/api/MCP1.png" />
              </Div3D>
              <Div3D depth={40} className="absolute top-0">
                <img src="/static/landing/api/MCP2.png" />
              </Div3D>
              <Div3D depth={0} className="absolute top-0">
                <img src="/static/landing/api/MCP3.png" />
              </Div3D>
              <Div3D depth={40} className="absolute top-0">
                <img src="/static/landing/api/MCP4.png" />
              </Div3D>
            </Hover3D>
          </ImgBlock>
          <ImgBlock
            title={
              <span className="font-['Bricolage_Grotesque'] tracking-[-0.05em]">
                Custom Webhooks: Connect agents to your workflow
              </span>
            }
            content={[
              <>
                Build webhook endpoints to trigger agents from any external
                system. Receive events from GitHub, Jira, Slack, or your own
                services with full company context.
              </>,
            ]}
          >
            <Hover3D
              depth={-20}
              perspective={1000}
              className={classNames("relative")}
            >
              <Div3D depth={-20}>
                <img src="/static/landing/webhooks/Webhooks.png" />
              </Div3D>
              <Div3D depth={0} className="absolute top-0">
                <img src="/static/landing/webhooks/Webhooks3.png" />
              </Div3D>
              <Div3D depth={15} className="absolute top-0">
                <img src="/static/landing/webhooks/Webhooks2.png" />
              </Div3D>
            </Hover3D>
          </ImgBlock>
          <ImgBlock
            title={
              <span className="font-['Bricolage_Grotesque'] tracking-[-0.05em]">
                Ruby API: Integrate Ruby across your tools
              </span>
            }
            content={[
              <>
                Access Ruby's capabilities through a developer API to manage
                agents and data sources programmatically. Use Ruby on your terms
                and on the product surfaces of your choice.
              </>,
            ]}
          >
            <Hover3D
              depth={-20}
              perspective={1000}
              className={classNames("relative")}
            >
              <Div3D depth={-20}>
                <img src="/static/landing/api/api1.png" />
              </Div3D>
              <Div3D depth={20} className="absolute top-0">
                <img src="/static/landing/api/api2.png" />
              </Div3D>
              <Div3D depth={60} className="absolute top-0">
                <img src="/static/landing/api/api3.png" />
              </Div3D>
            </Hover3D>
          </ImgBlock>
        </div>
      </Grid>
      <ExtensibilitySection page="platform" />
      <VisibilityGate surface={MARKETING_SURFACES.demoVideo}>
        <DemoVideoSection demoVideo={DemoVideo} />
      </VisibilityGate>
      <VisibilityGate surface={MARKETING_SURFACES.customerProof}>
        <QuoteSection
          quote="Ruby functions as a 'meta-platform.' Its aggregation approach offers flexibility, allowing us to leverage multiple data sources across tools and avoid being locked into specific tools or vertical ecosystems."
          name="Charles Gorintin"
          title="CTO at Alan"
          logo="/static/landing/logos/color/alan.png"
        />
      </VisibilityGate>
      <div
        className={classNames(
          "col-span-12 flex flex-col items-center pb-24",
          "lg:col-span-12 lg:col-start-1",
          "xl:col-span-10 xl:col-start-2"
        )}
      >
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/home/contact" shallow={true}>
            <Button
              variant="outline"
              size="md"
              label="Request a demo"
              onClick={withTracking(
                TRACKING_AREAS.SOLUTIONS,
                "platform_footer_cta_secondary"
              )}
            />
          </Link>

          <Link href="/home/pricing" shallow={true}>
            <Button
              variant="primary"
              size="md"
              label="Try Ruby now"
              icon={Rocket02}
              onClick={withTracking(
                TRACKING_AREAS.SOLUTIONS,
                "platform_footer_cta_primary"
              )}
            />
          </Link>
        </div>
      </div>
    </>
  );
}

RubyPlatformNextJS.getLayout = (
  page: ReactElement,
  pageProps: LandingLayoutProps
) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
