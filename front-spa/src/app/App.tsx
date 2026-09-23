import { PostHogTracker } from "@ruby-ai/front/components/app/PostHogTracker";
import { RootLayout } from "@ruby-ai/front/components/app/RootLayout";
import { ErrorBoundary } from "@ruby-ai/front/components/error_boundary/ErrorBoundary";
import { CellProvider } from "@ruby-ai/front/lib/auth/CellContext";
import { FetcherProvider } from "@ruby-ai/front/lib/swr/FetcherContext";
import { fetcher, fetcherWithBody } from "@ruby-ai/front/lib/swr/fetcher";
import { RubyUIContext } from "@ruby-ai/ui";
import { GlobalErrorFallback } from "@spa/app/components/GlobalErrorFallback";
import { AppReadyProvider } from "@spa/app/contexts/AppReadyContext";
import { routes } from "@spa/app/routes";
import { ReactRouterLinkWrapper } from "@spa/lib/ReactRouterLinkWrapper";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(routes, {
  basename: import.meta.env?.VITE_BASE_PATH ?? "",
});

export default function App() {
  const uiContextValue = useMemo(
    () => ({ components: { link: ReactRouterLinkWrapper } }),
    []
  );

  return (
    <AppReadyProvider>
      <CellProvider>
        <FetcherProvider fetcher={fetcher} fetcherWithBody={fetcherWithBody}>
          <PostHogTracker authenticated>
            <RubyUIContext.Provider value={uiContextValue}>
              <RootLayout>
                <ErrorBoundary fallback={<GlobalErrorFallback />}>
                  <RouterProvider router={router} />
                </ErrorBoundary>
              </RootLayout>
            </RubyUIContext.Provider>
          </PostHogTracker>
        </FetcherProvider>
      </CellProvider>
    </AppReadyProvider>
  );
}
