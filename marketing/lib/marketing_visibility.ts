export const MARKETING_SURFACES = {
  announcementBanner: "announcement-banner",
  teamSportQuote: "team-sport-quote",
  testimonialCarousel: "testimonial-carousel",
  newsSection: "news-section",
  aiOperatorsEyebrow: "ai-operators-eyebrow",
  aiOperatorsHiringLink: "ai-operators-hiring-link",
  aiOperatorsCta: "ai-operators-cta",
  customerProof: "customer-proof",
  demoVideo: "demo-video",
  modelFlexibility: "model-flexibility",
  publicModelDetails: "public-model-details",
  trustCenterLink: "trust-center-link",
  partnerWaitlist: "partner-waitlist",
  contactRegionField: "contact-region-field",
  productAgentExamples: "product-agent-examples",
  productTestimonial: "product-testimonial",
  resultsClaims: "results-claims",
  trustedSection: "trusted-section",
  pricingEconomicsPill: "pricing-economics-pill",
  aboutHiringCta: "about-hiring-cta",
  aboutVideo: "about-video",
  aboutTeamRoster: "about-team-roster",
  aboutInvestors: "about-investors",
  securityCertificationBadges: "security-certification-badges",
} as const;

export type MarketingSurface =
  (typeof MARKETING_SURFACES)[keyof typeof MARKETING_SURFACES];

const HIDDEN_MARKETING_SURFACES: ReadonlySet<MarketingSurface> = new Set([
  MARKETING_SURFACES.announcementBanner,
  MARKETING_SURFACES.teamSportQuote,
  MARKETING_SURFACES.testimonialCarousel,
  MARKETING_SURFACES.newsSection,
  MARKETING_SURFACES.aiOperatorsEyebrow,
  MARKETING_SURFACES.aiOperatorsHiringLink,
  MARKETING_SURFACES.aiOperatorsCta,
  MARKETING_SURFACES.customerProof,
  MARKETING_SURFACES.demoVideo,
  MARKETING_SURFACES.modelFlexibility,
  MARKETING_SURFACES.publicModelDetails,
  MARKETING_SURFACES.trustCenterLink,
  MARKETING_SURFACES.partnerWaitlist,
  MARKETING_SURFACES.contactRegionField,
  MARKETING_SURFACES.productAgentExamples,
  MARKETING_SURFACES.productTestimonial,
  MARKETING_SURFACES.resultsClaims,
  MARKETING_SURFACES.trustedSection,
  MARKETING_SURFACES.pricingEconomicsPill,
  MARKETING_SURFACES.aboutHiringCta,
  MARKETING_SURFACES.aboutVideo,
  MARKETING_SURFACES.aboutTeamRoster,
  MARKETING_SURFACES.aboutInvestors,
  MARKETING_SURFACES.securityCertificationBadges,
]);

const HIDDEN_FOOTER_SECTIONS: ReadonlySet<string> = new Set([
  "Developers",
  "Connect",
]);

const HIDDEN_FOOTER_LINKS: ReadonlySet<string> = new Set([
  "Jobs",
  "Trust Center",
  "Vulnerability Disclosure",
]);

const HIDDEN_NAVIGATION_ITEMS: ReadonlySet<string> = new Set([
  "Academy",
  "Customer Stories",
  "Resources",
]);

const HIDDEN_EXACT_PATHS: ReadonlySet<string> = new Set(["/academy"]);

export interface AnnouncementVisibilityOptions {
  enabled: boolean;
  nowMs: number;
  visibleAfterMs: number;
  previewRequested: boolean;
}

export function isMarketingSurfaceVisible(surface: MarketingSurface): boolean {
  return !HIDDEN_MARKETING_SURFACES.has(surface);
}

export function resolveAnnouncementVisibility({
  enabled,
  nowMs,
  visibleAfterMs,
  previewRequested,
}: AnnouncementVisibilityOptions): boolean {
  return enabled && (previewRequested || nowMs >= visibleAfterMs);
}

export function getVisibleFooterSections<T extends { title: string }>(
  sections: readonly T[]
): T[] {
  return sections.filter(
    (section) => !HIDDEN_FOOTER_SECTIONS.has(section.title)
  );
}

export function getVisibleFooterLinks<
  T extends { label?: string; title?: string },
>(_sectionTitle: string, links: readonly T[]): T[] {
  return links.filter(
    (link) => !HIDDEN_FOOTER_LINKS.has(link.label ?? link.title ?? "")
  );
}

export function getVisibleNavigationItems<
  T extends { title: string; href?: string; items?: readonly T[] },
>(items: readonly T[]): T[] {
  return items.flatMap((item) => {
    if (
      HIDDEN_NAVIGATION_ITEMS.has(item.title) ||
      (item.href !== undefined && !isMarketingPathVisible(item.href))
    ) {
      return [];
    }

    if (item.items === undefined) {
      return [item];
    }

    return [
      {
        ...item,
        items: getVisibleNavigationItems(item.items),
      },
    ];
  });
}

export function isMarketingPathVisible(path: string): boolean {
  const pathname = path.split(/[?#]/, 1)[0]?.replace(/\/$/, "") || "/";
  return !(
    HIDDEN_EXACT_PATHS.has(pathname) ||
    pathname.startsWith("/academy/") ||
    pathname === "/customers" ||
    pathname.startsWith("/customers/")
  );
}
