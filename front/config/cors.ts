import { EnvironmentConfig } from "@app/types/shared/utils/config";

const STATIC_ALLOWED_ORIGINS = [
  // Front edge.
  "https://front-edge.ruby.ad",
  "https://eu.front-edge.ruby.ad",
  // Marketing edge.
  "https://marketing-edge.ruby.ad",
  // Front extension.
  "https://front-ext.ruby.ad",
  // Chrome extension.
  // Documentation website.
  "https://docs.ruby.ad",
  // Microsoft Power Automate.
  "https://make.powerautomate.com",
  "https://office-addins.ruby.ad",
  // Admin SPA (backoffice).
  "https://admin.ruby.ad",
  // Main app (front-spa).
  "https://app.ruby.ad",
  // Next.js server (landing page, OAuth, API routes).
  "https://ruby.ad",
  "https://app.ruby.ad",
  // Marketing edge (standalone marketing Next.js app).
  "https://marketing-edge.ruby.ad",
] as const;

const ALLOWED_ORIGIN_PATTERNS = [
  // Zendesk domains
  new RegExp("^https://.+\\.zendesk\\.com$"),
  // Staging apps - allow all builds from *.preview.ruby.ad .
  new RegExp("^https://.*\\.preview\\.ruby\\.ad$"),
  // Firefox Internal UUID is not stable, allow all moz-extension origins.
  new RegExp("^moz-extension://"),
] as const;

type StaticAllowedOriginType = (typeof STATIC_ALLOWED_ORIGINS)[number];

export function isAllowedOrigin(origin: string): boolean {
  return (
    STATIC_ALLOWED_ORIGINS.includes(origin as StaticAllowedOriginType) ||
    (EnvironmentConfig.getOptionalEnvVariable("RUBY_CHROME_EXTENSION_IDS") ?? "").split(",").map(id => id.trim()).filter(id => /^[a-p]{32}$/.test(id)).some(id => origin === `chrome-extension://${id}`) ||
    ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))
  );
}

/**
 * @cc [owner:flvndvd,label:api] conditional-file-write-preflight
 * Browser preflights MUST allow X-Ruby-If-Revision-Match for revision-checked file saves.
 */
export const ALLOWED_HEADERS = [
  "authorization",
  "content-type",
  "mcp-protocol-version",
  "mcp-session-id",
  "x-commit-hash",
  "x-ruby-extension-version",
  "x-ruby-if-revision-match",
  "x-build-date",
  "x-hackerone-research",
  "x-request-origin",
  // Marketing site (academy quiz/progress endpoints).
  "x-academy-browser-id",
  "x-csrf-token",
  // Datadog RUM tracing headers (injected automatically by the browser SDK).
  "traceparent",
  "tracestate",
  "x-datadog-origin",
  "x-datadog-parent-id",
  "x-datadog-sampling-priority",
  "x-datadog-trace-id",
] as const;
type AllowedHeaderType = (typeof ALLOWED_HEADERS)[number];

export function isAllowedHeader(header: string): header is AllowedHeaderType {
  return ALLOWED_HEADERS.includes(header as AllowedHeaderType);
}
