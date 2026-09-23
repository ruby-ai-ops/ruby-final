// Tailwind base globals (preflight/theme/tokens/keyframes; emits no utilities).
import "@marketing/styles/global.css";
// Single unified Tailwind build: scans marketing + ui/src in one pass.
// Replaces the old precompiled `@ruby-ai/ui/dist/ui.css` concat.
import "@marketing/styles/components.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

// Important: avoid destructuring process.env on the client.
// Next.js replaces direct property access (process.env.NEXT_PUBLIC_*) at build time,
// but destructuring `process.env` does not get inlined.
const NODE_ENV = process.env.NODE_ENV;
const DATADOG_CLIENT_TOKEN = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;
const DATADOG_SERVICE = process.env.NEXT_PUBLIC_DATADOG_SERVICE;
const COMMIT_HASH = process.env.NEXT_PUBLIC_COMMIT_HASH;


// Client-only: as a wrapper this would strip the page tree from the SSR output.
const PostHogTrackerEffects = dynamic(
  () =>
    import("@marketing/components/app/PostHogTracker").then(
      (m) => m.PostHogTrackerEffects
    ),
  { ssr: false }
);
import { NextLinkWrapper } from "@marketing/components/platform/NextLinkWrapper";
import { FetcherProvider } from "@marketing/components/swr/FetcherContext";
import { SignUpModalProvider } from "@marketing/hooks/useSignUpModal";
import { fetcher, fetcherWithBody } from "@marketing/lib/swr/fetcher";
import { initDatadogLogs } from "@marketing/logger/datadogLogger";
import { RubyUIContext } from "@ruby-ai/ui";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useMemo } from "react";

if (DATADOG_CLIENT_TOKEN) {
  initDatadogLogs({
    clientToken: DATADOG_CLIENT_TOKEN,
    env: NODE_ENV === "production" ? "prod" : "dev",
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    service: `${DATADOG_SERVICE || "front"}-browser`,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    version: COMMIT_HASH || "",
  });
}

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    page: React.ReactElement,
    pageProps: AppProps
  ) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// biome-ignore lint/plugin/nextjsPageComponentNaming: pre-existing
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available.
  const getLayout = Component.getLayout ?? ((page) => page);
  const uiContextValue = useMemo(
    () => ({ components: { link: NextLinkWrapper } }),
    []
  );

  return (
    <FetcherProvider fetcher={fetcher} fetcherWithBody={fetcherWithBody}>
      <PostHogProvider client={posthog}>
        <PostHogTrackerEffects />
        <RubyUIContext.Provider value={uiContextValue}>
          <SignUpModalProvider>
            {getLayout(<Component {...pageProps} />, pageProps)}
          </SignUpModalProvider>
        </RubyUIContext.Provider>
      </PostHogProvider>
    </FetcherProvider>
  );
}
