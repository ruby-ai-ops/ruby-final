export const RUBY_FAVICON_PATH = "/static/favicon.png";
export const RUBY_OG_IMAGE_PATH = "/static/ruby-og-image.svg";
export const RUBY_PUBLIC_ORIGIN = "https://ruby.ad";

export interface MarketingPageMetadataInput {
  title: string;
  pathname: string;
  siteOrigin: string;
  ogImage?: string;
}

export interface MarketingPageMetadata {
  fullTitle: string;
  canonicalUrl: string;
  ogImage: string;
}

export function buildMarketingPageMetadata({
  title,
  pathname,
  siteOrigin,
  ogImage,
}: MarketingPageMetadataInput): MarketingPageMetadata {
  const fullTitle = title.includes("Ruby") ? title : `${title} | Ruby`;
  const normalizedOrigin =
    siteOrigin === RUBY_PUBLIC_ORIGIN ? siteOrigin : RUBY_PUBLIC_ORIGIN;
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  return {
    fullTitle,
    canonicalUrl: `${normalizedOrigin}${normalizedPathname}`,
    ogImage: ogImage ?? `${RUBY_PUBLIC_ORIGIN}${RUBY_OG_IMAGE_PATH}`,
  };
}
