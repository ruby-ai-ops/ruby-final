import { PostHogTracker } from "@ruby-ai/front/components/app/PostHogTracker";
import { ErrorBoundary } from "@ruby-ai/front/components/error_boundary/ErrorBoundary";
import { SharedFilePage } from "@ruby-ai/front/components/pages/share/SharedFilePage";
import { SharedFramePage } from "@ruby-ai/front/components/pages/share/SharedFramePage";
import { ShareOgPage } from "@ruby-ai/front/components/pages/share/ShareOgPage";
import { CellProvider } from "@ruby-ai/front/lib/auth/CellContext";
import { FetcherProvider } from "@ruby-ai/front/lib/swr/FetcherContext";
import { fetcher, fetcherWithBody } from "@ruby-ai/front/lib/swr/fetcher";
import { GlobalErrorFallback } from "@spa/app/components/GlobalErrorFallback";
import { RootRouterLayout } from "@spa/app/layouts/RootRouterLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      element: <RootRouterLayout />,
      errorElement: <GlobalErrorFallback />,
      children: [
        // Frame: /share/frame/:token
        {
          path: "/share/frame/:token",
          element: <SharedFramePage />,
        },
        // File: /share/file/:token (redirects to frame)
        {
          path: "/share/file/:token",
          element: <SharedFilePage />,
        },
        // OG card: /share/og/:wId, rendered by Gotenberg for og:image generation
        {
          path: "/share/og/:wId",
          element: <ShareOgPage />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env?.VITE_BASE_PATH ?? "",
  }
);

export default function ShareApp() {
  return (
    <CellProvider>
      <FetcherProvider fetcher={fetcher} fetcherWithBody={fetcherWithBody}>
        <PostHogTracker>
          <ErrorBoundary fallback={<GlobalErrorFallback />}>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </PostHogTracker>
      </FetcherProvider>
    </CellProvider>
  );
}
