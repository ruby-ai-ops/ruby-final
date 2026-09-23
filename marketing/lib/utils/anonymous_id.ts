import { v4 as uuidv4 } from "uuid";

export const RUBY_ANONYMOUS_ID_COOKIE = "_ruby_aid";

const ANONYMOUS_ID_MAX_AGE_SECONDS = 31536000;

export function getRootCookieDomain(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.location.hostname === "localhost") {
    return null;
  }

  return ".ruby.ad";
}

export function getPostHogCookieDomain(): string | undefined {
  const domain = getRootCookieDomain();
  return domain ?? undefined;
}

export function buildRubyAidCookieString(value: string): string {
  const domain = getRootCookieDomain();
  const domainPart = domain ? `; domain=${domain}` : "";
  return `${RUBY_ANONYMOUS_ID_COOKIE}=${value}; path=/${domainPart}; SameSite=Lax; Secure; max-age=${ANONYMOUS_ID_MAX_AGE_SECONDS}`;
}

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

function readAnonymousIdFromDocumentCookie(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  return parseRubyAidFromCookieString(document.cookie);
}

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
