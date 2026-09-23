import {
  Grid,
  H1,
  H2,
  P,
  Strong,
} from "@marketing/components/home/ContentComponents";
import type { LandingLayoutProps } from "@marketing/components/home/LandingLayout";
import LandingLayout from "@marketing/components/home/LandingLayout";
import { PageMetadata } from "@marketing/components/home/PageMetadata";
import { LegacyButton as Button } from "@ruby-ai/ui";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

export async function getStaticProps() {
  return {
    props: {
      gtmTrackingId: process.env.NEXT_PUBLIC_GTM_TRACKING_ID ?? null,
    },
  };
}

const ASSET_BASE_PATH = "/static/landing/logos/ruby";
const BRAND_KIT_DOWNLOAD_HREF = `${ASSET_BASE_PATH}/Ruby_Brand_Logo.zip`;
const CURRENT_RUBY_LOGO = "/static/ruby-logo.png";
const SHOW_BRAND_KIT_DOWNLOAD = false;
const ANNOTATED_HEADING_STYLE = {
  fontFamily: '"RubySerif", var(--font-display)',
  letterSpacing: "-0.05em",
};

export default function BrandResourcesNextJS() {
  const router = useRouter();

  return (
    <>
      <PageMetadata
        title="Brand Resources"
        description="Download official Ruby logos in SVG and PNG formats. Includes primary and square logo variants with usage guidelines."
        pathname={router.asPath}
      />

      <div className="container flex w-full flex-col gap-16 px-6 pb-24 md:gap-20">
        <Grid>
          <div className="col-span-12 col-start-1 flex flex-col gap-2 pt-24 md:col-span-10 md:col-start-2">
            <H1
              mono
              className="text-5xl font-medium md:text-6xl lg:text-7xl"
              style={ANNOTATED_HEADING_STYLE}
            >
              Brand resources
            </H1>
            <P size="lg" className="text-muted-foreground">
              Download official Ruby logos and follow the guidelines below for
              proper usage.
            </P>
          </div>
        </Grid>

        <Grid>
          <div className="col-span-12 col-start-1 grid grid-cols-12 gap-6 md:col-span-10 md:col-start-2">
            <div className="col-span-12 flex flex-col justify-center gap-4 xl:col-span-6">
              <div className="flex flex-col gap-2">
                <H2>Media assets</H2>
                <P className="text-muted-foreground">
                  The Ruby wordmark is available in two shapes: standard and
                  square.
                </P>
              </div>
              <div>
                <Button
                  href={
                    SHOW_BRAND_KIT_DOWNLOAD
                      ? BRAND_KIT_DOWNLOAD_HREF
                      : undefined
                  }
                  variant="primary"
                  size="md"
                  label="Download brand kit"
                  disabled={!SHOW_BRAND_KIT_DOWNLOAD}
                />
              </div>
            </div>
            <div className="col-span-12 xl:col-span-5 xl:col-start-8">
              <img
                src={CURRENT_RUBY_LOGO}
                alt="Ruby logo"
                className="w-full rounded-2xl object-contain"
              />
            </div>
          </div>
        </Grid>

        <Grid>
          <div className="col-span-12 col-start-1 flex flex-col gap-4 md:col-span-10 md:col-start-2">
            <H2>Guidelines</H2>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <P size="sm">
                <Strong>Clear space:</Strong> Keep ample space around the logo
                for legibility. Avoid crowding with text or graphics.
              </P>
              <P size="sm">
                <Strong>Do not modify:</Strong> Don't rotate, recolor, stretch,
                add effects, or alter proportions of the logo.
              </P>
              <P size="sm">
                <Strong>Minimum size:</Strong> Ensure the logo remains crisp and
                readable. Avoid rendering smaller than 24px in height.
              </P>
            </div>
          </div>
        </Grid>
      </div>
    </>
  );
}

BrandResourcesNextJS.getLayout = (
  page: ReactElement,
  pageProps: LandingLayoutProps
) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
