import { v4 as uuidv4 } from "uuid";

export const RUBY_ANONYMOUS_ID_COOKIE = "_ruby_aid";

const ANONYMOUS_ID_MAX_AGE_SECONDS = 31536000; // 1 year

/**
 * Returns the cookie domain for cross-subdomain sharing.
 * On production (any *.ruby.ad host) returns `.ruby.ad`;
 * on localhost/dev returns null (no domain attribute needed).
 */
export function getRootCookieDomain(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.location.hostname === "localhost") {
    return null;
  }

  return ".ruby.ad";
}

/**
 * Returns the root cookie domain for PostHog cross-subdomain tracking.
 * On production returns `.ruby.ad`; on localhost/dev returns `undefined`.
 */
export function getPostHogCookieDomain(): string | undefined {
  const domain = getRootCookieDomain();
  return domain ?? undefined;
}

/**
 * Builds the cookie string for `_ruby_aid` including the domain attribute
 * when applicable (production multi-subdomain setup).
 */
export function buildRubyAidCookieString(value: string): string {
  const domain = getRootCookieDomain();
  const domainPart = domain ? `; domain=${domain}` : "";
  return `${RUBY_ANONYMOUS_ID_COOKIE}=${value}; path=/${domainPart}; SameSite=Lax; Secure; max-age=${ANONYMOUS_ID_MAX_AGE_SECONDS}`;
}

/**
 * Reads the `_ruby_aid` cookie from `document.cookie`; if absent, generates a
 * UUIDv4, sets it as a first-party cookie, and returns it.
 *
 * The cookie is set with `domain=.ruby.ad` (derived at runtime) so it is
 * shared between `ruby.ad` (marketing site) and `app.ruby.ad` (app).
 *
 * Client-side only. Returns `null` when called outside a browser context.
 */
export function getOrCreateAnonymousId(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const existing = readAnonymousIdFromDocumentCookie();
  if (existing) {
    return existing;
  }

  const id = uuidv4();
  document.cookie = buildRubyAidCookieString(id);
  return id;
}

/**
 * Reads the `_ruby_aid` value from `document.cookie`.
 * Returns `null` if the cookie is not present or we're not in a browser.
 */
function readAnonymousIdFromDocumentCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  return parseRubyAidFromCookieString(document.cookie);
}

/**
 * Server-side helper: parses the `_ruby_aid` value from a raw `Cookie` header.
 * Returns `null` if not found.
 */
export function readAnonymousIdFromCookies(
  cookieHeader: string | undefined
): string | null {
  if (!cookieHeader) {
    return null;
  }
  return parseRubyAidFromCookieString(cookieHeader);
}

function parseRubyAidFromCookieString(cookies: string): string | null {
  const prefix = `${RUBY_ANONYMOUS_ID_COOKIE}=`;
  const match = cookies.split("; ").find((c) => c.startsWith(prefix));
  return match ? match.slice(prefix.length) : null;
}
