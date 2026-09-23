// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
import {
  buildMarketingPageMetadata,
  RUBY_PUBLIC_ORIGIN,
} from "@marketing/lib/public_branding";
import Head from "next/head";

interface PageMetadataProps {
  title: string;
  description: string;
  pathname: string;
  ogImage?: string;
}

export function PageMetadata({
  title,
  description,
  pathname,
  ogImage,
}: PageMetadataProps) {
  const {
    fullTitle,
    canonicalUrl,
    ogImage: resolvedOgImage,
  } = buildMarketingPageMetadata({
    title,
    pathname,
    siteOrigin: RUBY_PUBLIC_ORIGIN,
    ogImage,
  });

  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={description} />
      <link key="canonical" rel="canonical" href={canonicalUrl} />
      <meta key="og:title" property="og:title" content={fullTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:url" property="og:url" content={canonicalUrl} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:image" property="og:image" content={resolvedOgImage} />
    </Head>
  );
}
