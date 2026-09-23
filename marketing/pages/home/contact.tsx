import { ContactForm } from "@marketing/components/home/ContactForm";
import { HeaderContentBlock } from "@marketing/components/home/ContentBlocks";
import { Grid } from "@marketing/components/home/ContentComponents";
import type { LandingLayoutProps } from "@marketing/components/home/LandingLayout";
import LandingLayout from "@marketing/components/home/LandingLayout";
import { PageMetadata } from "@marketing/components/home/PageMetadata";
import {
  MARKETING_SURFACES,
  isMarketingSurfaceVisible,
} from "@marketing/lib/marketing_visibility";
import TrustedBy from "@marketing/components/home/TrustedBy";
import { isString } from "@marketing/types/shared/utils/general";
import type { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

const ANNOTATED_HEADING_STYLE = {
  fontFamily: '"RubySerif", var(--font-display)',
  letterSpacing: "-0.05em",
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      gtmTrackingId: process.env.NEXT_PUBLIC_GTM_TRACKING_ID ?? null,
      shape: 0,
    },
  };
};

export default function ContactNextJS() {
  const router = useRouter();
  const { company, email, company_headcount_form, headquarters_region } =
    router.query;

  const companyName = isString(company) ? company : null;
  const prefillEmail = isString(email) ? email : undefined;
  const prefillHeadcount = isString(company_headcount_form)
    ? company_headcount_form
    : undefined;
  const prefillRegion = isString(headquarters_region)
    ? headquarters_region
    : undefined;

  const partnerNotice = (
    <span className="mt-3 block">
      If you're looking to sell implementation services based on Ruby or partner
      with us, please contact us{" "}
      <Link
        href="https://ruby.ad/home/partner"
        className="underline underline-offset-2"
      >
        here
      </Link>
      .
    </span>
  );

  const subtitle = companyName ? (
    <>
      We're excited to show you how Ruby can help <strong>{companyName}</strong>
      . To prepare for our demo call, please share a bit about yourself and the
      challenges you're hoping to address.
      {partnerNotice}
    </>
  ) : (
    <>
      To prepare for our demo call, please share a bit about yourself and the
      challenges you're hoping to address with Ruby.
      {partnerNotice}
    </>
  );

  return (
    <>
      <PageMetadata
        title="Contact Ruby: Schedule a Demo for AI Agents"
        description="Get in touch with the Ruby team. Schedule a demo call to learn how AI agents can help address your team's challenges and improve productivity."
        pathname={router.asPath}
      />
      <div className="flex w-full flex-col justify-center gap-12 pb-24">
        <HeaderContentBlock
          title={<span style={ANNOTATED_HEADING_STYLE}>Contact Ruby</span>}
          hasCTA={false}
          subtitle={subtitle}
        />
        <Grid>
          <div className="col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-8 lg:col-start-2 xl:col-span-8 xl:col-start-2 2xl:col-start-3">
            <ContactForm
              prefillEmail={prefillEmail}
              prefillHeadcount={prefillHeadcount}
              prefillRegion={prefillRegion}
              showHeadquartersRegion={false}
            />
          </div>
        </Grid>
        {isMarketingSurfaceVisible(MARKETING_SURFACES.trustedSection) && (
          <TrustedBy />
        )}
      </div>
    </>
  );
}

ContactNextJS.getLayout = (
  page: ReactElement,
  pageProps: LandingLayoutProps
) => {
  return <LandingLayout pageProps={pageProps}>{page}</LandingLayout>;
};
