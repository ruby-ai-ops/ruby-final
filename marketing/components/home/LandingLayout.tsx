// biome-ignore-all lint/plugin/noNextImports: Next.js-specific file
import {
  AnnouncementBanner,
  BANNER_VISIBLE_AFTER_MS,
} from "@marketing/components/home/AnnouncementBanner";
import { A } from "@marketing/components/home/ContentComponents";
import { FooterNavigation } from "@marketing/components/home/menu/FooterNavigation";
import { MainNavigation } from "@marketing/components/home/menu/MainNavigation";
import { MobileNavigation } from "@marketing/components/home/menu/MobileNavigation";
import { OpenRubyButton } from "@marketing/components/home/OpenRubyButton";
import { PromoBanner } from "@marketing/components/home/PromoBanner";
import { PublicWebsiteLogo } from "@marketing/components/home/PublicWebsiteLogo";
import { RUBY_FAVICON_PATH } from "@marketing/lib/public_branding";
import {
  MARKETING_SURFACES,
  isMarketingSurfaceVisible,
  resolveAnnouncementVisibility,
} from "@marketing/lib/marketing_visibility";
import ScrollingHeader from "@marketing/components/home/ScrollingHeader";
import { useStripUtmParams } from "@marketing/hooks/useStripUtmParams";
import {
  RUBY_COOKIES_ACCEPTED,
  RUBY_HAS_SESSION,
  hasCookiesAccepted,
  hasSessionIndicator,
  shouldCheckGeolocation,
} from "@marketing/lib/cookies";
import { useGeolocation } from "@marketing/lib/swr/geo";
import { useLandingAuthContext } from "@marketing/lib/swr/website";
import { TRACKING_AREAS, withTracking } from "@marketing/lib/tracking";
import { classNames, getFaviconPath } from "@marketing/lib/utils";
import { getOrCreateAnonymousId } from "@marketing/lib/utils/anonymous_id";
import { appendUTMParams } from "@marketing/lib/utils/utm";
import { LegacyButton as Button, cn } from "@ruby-ai/ui";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useSignUpModal } from "@marketing/hooks/useSignUpModal";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export type LandingLayoutVariant = "default" | "homepage";

export interface LandingLayoutProps {
  shape: number;
  postLoginReturnToUrl?: string;
  gtmTrackingId?: string;
  hideNavigation?: boolean;
  fullWidth?: boolean;
  layoutVariant?: LandingLayoutVariant;
}

export default function LandingLayout({
  children,
  pageProps,
}: {
  children: React.ReactNode;
  pageProps: LandingLayoutProps;
}) {
  const {
    postLoginReturnToUrl = "/api/login",
    gtmTrackingId,
    hideNavigation,
    fullWidth,
    layoutVariant = "default",
  } = pageProps;
  const isHomepageLayout = layoutVariant === "homepage";

  const { openSignUpModal } = useSignUpModal();

  const router = useRouter();
  const announcementVisible = isMarketingSurfaceVisible(
    MARKETING_SURFACES.announcementBanner
  );
  // Initialize from the timestamp so there's no layout shift on first render.
  // ?preview_banner in the URL forces it on for pre-launch testing.
  const [showBanner, setShowBanner] = useState(() =>
    resolveAnnouncementVisibility({
      enabled: announcementVisible,
      nowMs: Date.now(),
      visibleAfterMs: BANNER_VISIBLE_AFTER_MS,
      previewRequested: false,
    })
  );
  useEffect(() => {
    setShowBanner(
      resolveAnnouncementVisibility({
        enabled: announcementVisible,
        nowMs: Date.now(),
        visibleAfterMs: BANNER_VISIBLE_AFTER_MS,
        previewRequested: "preview_banner" in router.query,
      })
    );
  }, [announcementVisible, router.query]);

  useStripUtmParams();

  const [cookies, setCookie] = useCookies(
    [RUBY_COOKIES_ACCEPTED, RUBY_HAS_SESSION],
    {
      doNotParse: true,
    }
  );
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const cookieValue = cookies[RUBY_COOKIES_ACCEPTED];
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState<boolean>(
    hasCookiesAccepted(cookieValue, null)
  );

  // Check session cookie only on client to avoid hydration mismatch.
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    setHasSession(hasSessionIndicator(cookies[RUBY_HAS_SESSION]));
  }, [cookies]);

  // Verify actual auth state when session cookie is present. SWR deduplicates
  // this call with the one in OpenRubyButton, so there's no extra request.
  const { isAuthenticated, isLoading: isAuthLoading } = useLandingAuthContext({
    hasSessionCookie: hasSession,
  });

  const shouldCheckGeo = shouldCheckGeolocation(cookieValue);

  const { geoData, isGeoDataLoading } = useGeolocation({
    disabled: !shouldCheckGeo,
  });

  const setCookieApproval = useCallback(
    (type: "true" | "auto" | "false") => {
      // true is when the user accepts all cookies.
      // auto is when not in GDPR region
      if (type === "true" || type === "auto") {
        setHasAcceptedCookies(true);
      }
      setShowCookieBanner(false);
      setCookie(RUBY_COOKIES_ACCEPTED, type, {
        path: "/",
        maxAge: 183 * 24 * 60 * 60, // 6 months
        sameSite: "lax",
      });
    },
    [setCookie]
  );

  // If you come back to the public site (e.g. pricing page) with browser's back button from the app,
  // you can have dark theme so we need to remove them manually
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (cookieValue !== undefined) {
      setShowCookieBanner(false);
      return;
    }

    if (isGeoDataLoading) {
      return;
    }

    if (geoData && geoData.isGDPR === false) {
      // For non-GDPR countries (like US), show banner and set cookies to auto
      setShowCookieBanner(true);
      setHasAcceptedCookies(true); // Enable cookies immediately for non-GDPR
      getOrCreateAnonymousId();
    } else {
      // For GDPR countries, just show the banner
      setShowCookieBanner(true);
    }
  }, [geoData, isGeoDataLoading, cookieValue]);

  return (
    <>
      <Header />
      {hideNavigation ? (
        <div className="flex w-full justify-center pt-12 pb-2">
          <div className="container flex items-center justify-center px-6">
            <PublicWebsiteLogo />
          </div>
        </div>
      ) : (
        <>
          <AnnouncementBanner show={showBanner} />
          <ScrollingHeader
            hasBanner={showBanner}
            hideAfterSelector={
              isHomepageLayout ? ".home-integrations-showcase" : undefined
            }
          >
            <div
              className={classNames(
                "flex h-full w-full items-center xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-4 xl:px-5",
                isHomepageLayout
                  ? "gap-1 px-1 xs:gap-4 xs:px-6"
                  : "gap-4 px-2 xs:px-6"
              )}
            >
              <div
                className={classNames(
                  "hidden h-[24px] w-[96px]",
                  "xl:block xl:justify-self-start"
                )}
              >
                <PublicWebsiteLogo />
              </div>
              <div
                className={classNames(
                  "xl:hidden",
                  isHomepageLayout &&
                    "homepage-mobile-menu-target [&_button]:min-h-11 [&_button]:min-w-11 xl:[&_button]:min-h-0 xl:[&_button]:min-w-0"
                )}
              >
                <MobileNavigation />
              </div>
              <div
                className={classNames(
                  "block xl:hidden",
                  isHomepageLayout &&
                    "homepage-mobile-logo-target [&_a]:inline-flex [&_a]:min-h-11 [&_a]:min-w-11 [&_a]:items-center xl:[&_a]:min-h-0 xl:[&_a]:min-w-0"
                )}
              >
                <PublicWebsiteLogo
                  size={isHomepageLayout ? "small" : "default"}
                />
              </div>
              <MainNavigation />
              <div
                className={classNames(
                  "flex flex-grow items-center justify-end xs:gap-4 xl:flex-grow-0 xl:justify-self-end",
                  isHomepageLayout ? "gap-0 xs:gap-4" : "gap-1"
                )}
              >
                {hasSession && (isAuthLoading || isAuthenticated) ? (
                  <div
                    className={classNames(
                      isHomepageLayout &&
                        "homepage-mobile-open-ruby-target [&_a]:min-h-11 [&_button]:min-h-11 xl:[&_a]:min-h-0 xl:[&_button]:min-h-0"
                    )}
                  >
                    <OpenRubyButton
                      variant="highlight"
                      size="sm"
                      trackingArea={TRACKING_AREAS.NAVIGATION}
                      trackingObject="go_to_app"
                    />
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      label="Sign in"
                      className={
                        isHomepageLayout
                          ? "homepage-mobile-sign-in-target min-h-11 xl:min-h-0"
                          : undefined
                      }
                      href={appendUTMParams(
                        `/api/workos/login?returnTo=${encodeURIComponent(postLoginReturnToUrl)}`
                      )}
                      onClick={withTracking(
                        TRACKING_AREAS.NAVIGATION,
                        "sign_in"
                      )}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      label="Get started"
                      className={
                        isHomepageLayout
                          ? "homepage-mobile-get-started-target min-h-11 xl:min-h-0"
                          : undefined
                      }
                      onClick={withTracking(
                        TRACKING_AREAS.NAVIGATION,
                        "sign_up",
                        openSignUpModal
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </ScrollingHeader>
        </>
      )}
      <main className="z-10 flex w-full flex-col items-center">
        <div
          className={classNames(
            "flex w-full flex-col",
            fullWidth || isHomepageLayout ? "" : "container",
            isHomepageLayout
              ? "gap-6 px-0 md:gap-24 lg:px-6"
              : "gap-6 px-6 md:gap-24",
            hideNavigation ? "pt-6" : showBanner ? "pt-[136px]" : "pt-[96px]",
            "xl:gap-16",
            "2xl:gap-24"
          )}
        >
          {children}
        </div>
        <PromoBanner />
        <CookieBanner
          show={showCookieBanner}
          onClickAccept={() => {
            setCookieApproval("true");
          }}
          onClickRefuse={() => {
            setCookieApproval("false");
          }}
        />
        {hasAcceptedCookies && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmTrackingId}');
            `}
          </Script>
        )}
        {cookieValue === "true" && (
          // Marketing tier requires explicit Accept; skip the geo-based "auto" consent path.
          <Script
            id="claydar"
            src="https://static.claydar.com/init.v1.js?id=clmYho8v0U"
            strategy="afterInteractive"
          />
        )}
        {!hideNavigation && <FooterNavigation />}
      </main>
    </>
  );
}

const CookieBanner = ({
  show,
  onClickAccept,
  onClickRefuse,
  className,
}: {
  show: boolean;
  onClickAccept: () => void;
  onClickRefuse: () => void;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-labelledby="cookie-consent-title"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md sm:p-5",
        "transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="flex max-w-xl flex-col gap-2">
          <h2
            id="cookie-consent-title"
            className="m-0 text-lg font-normal text-foreground"
          >
            We use cookies
          </h2>
          <p className="m-0 text-sm leading-relaxed text-muted-foreground">
            We use essential cookies to keep Ruby working. With your permission,
            we also use optional cookies to understand site usage and improve
            your experience. View our{" "}
            <A variant="primary" href="/home/platform-privacy">
              Privacy Policy
            </A>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="md"
            label="Only necessary"
            className="w-full sm:w-auto"
            onClick={() => {
              setIsVisible(false);
              onClickRefuse();
            }}
          />
          <Button
            variant="primary"
            size="md"
            label="Accept all"
            className="w-full sm:w-auto"
            onClick={() => {
              setIsVisible(false);
              onClickAccept();
            }}
          />
        </div>
      </div>
    </section>
  );
};

const Header = () => {
  const faviconPath = getFaviconPath();

  return (
    <Head>
      <link rel="icon" type="image/png" href={faviconPath} />
      <link
        rel="preload"
        href="/static/fonts/Sohne-Regular.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/static/fonts/RubySerif.ttf"
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <meta name="apple-mobile-web-app-title" content="Ruby" />
      <link rel="apple-touch-icon" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="60x60" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="76x76" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="120x120" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="152x152" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="167x167" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="180x180" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="192x192" href={RUBY_FAVICON_PATH} />
      <link rel="apple-touch-icon" sizes="228x228" href={RUBY_FAVICON_PATH} />
    </Head>
  );
};
