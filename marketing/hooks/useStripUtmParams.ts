import { hasCookiesAccepted } from "@marketing/lib/cookies";
import { useAppRouter } from "@marketing/lib/platform";
import { getOrCreateAnonymousId } from "@marketing/lib/utils/anonymous_id";
import {
  extractUTMParams,
  MARKETING_PARAMS,
  persistClickIdCookies,
  persistRubyAidFromURL,
  persistLandingContext,
  persistUTMCookies,
} from "@marketing/lib/utils/utm";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

const RUBY_COOKIES_ACCEPTED_NAME = "ruby-cookies-accepted";

/**
 * Captures UTM parameters from the URL, stores them in sessionStorage,
 * then strips them from the URL bar via a shallow router replace.
 * Also ensures the `_ruby_aid` anonymous device ID cookie exists once
 * cookies have been accepted (consent banner or non-GDPR auto-accept).
 */
export function useStripUtmParams() {
  const router = useAppRouter();
  const [cookies] = useCookies([RUBY_COOKIES_ACCEPTED_NAME]);
  const cookiesAccepted = hasCookiesAccepted(
    cookies[RUBY_COOKIES_ACCEPTED_NAME]
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    try {
      // Re-establish anonymous device ID from email CTA links (?ruby_aid=...).
      persistRubyAidFromURL();

      // Capture first-touch landing context (referrer, host, url, pathname).
      persistLandingContext();

      const params = Object.fromEntries(
        new URLSearchParams(window.location.search)
      );
      const utmData = extractUTMParams(params);
      if (Object.keys(utmData).length > 0) {
        sessionStorage.setItem("utm_data", JSON.stringify(utmData));
        persistClickIdCookies(utmData);
        persistUTMCookies(utmData);
      }

      // Strip tracking params (UTMs, click IDs, ruby_aid) from the URL bar.
      const url = new URL(window.location.href);
      let hasTrackingParam = false;
      for (const key of MARKETING_PARAMS) {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          hasTrackingParam = true;
        }
      }
      if (url.searchParams.has("ruby_aid")) {
        url.searchParams.delete("ruby_aid");
        hasTrackingParam = true;
      }
      if (hasTrackingParam) {
        window.history.replaceState(window.history.state, "", url.toString());
      }
    } catch {
      // Ignore errors (e.g. sessionStorage unavailable).
    }
  }, [router.isReady]);

  // Create the anonymous device ID cookie once consent is given.
  useEffect(() => {
    if (cookiesAccepted) {
      getOrCreateAnonymousId();
    }
  }, [cookiesAccepted]);
}
