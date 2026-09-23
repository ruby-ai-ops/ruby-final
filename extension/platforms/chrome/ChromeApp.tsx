import { RootLayout } from "@app/components/app/RootLayout";
import { CellProvider, useCellContext } from "@app/lib/auth/CellContext";
import { ClientTypeProvider } from "@app/lib/context/clientType";
import { RubyUIContext } from "@ruby-ai/ui";
import { ChromeExtensionWrapper } from "@extension/platforms/chrome/ChromeExtensionWrapper";
import { PortProvider } from "@extension/platforms/chrome/context/PortContext";
import { ChromePlatformService } from "@extension/platforms/chrome/services/platform";
import { AuthenticatedImage } from "@extension/shared/AuthenticatedImage";
import { PlatformProvider } from "@extension/shared/context/PlatformContext";
import { useCaptureActions } from "@extension/shared/hooks/useCaptureActions";
import { ExtensionFetcherProvider } from "@extension/shared/lib/ExtensionFetcherProvider";
import { ReactRouterLinkWrapper } from "@extension/shared/ReactRouterLinkWrapper";
import { ExtensionAuthProvider } from "@extension/ui/components/auth/AuthProvider";
import { routes } from "@extension/ui/pages/routes";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const ChromeApp = () => {
  return (
    <ClientTypeProvider value="extension">
      <CellProvider>
        <ChromeAppInner />
      </CellProvider>
    </ClientTypeProvider>
  );
};

const ChromeAppInner = () => {
  const { cells } = useCellContext();
  const platformService = useMemo(() => {
    const service = new ChromePlatformService(cells);
    service.useCaptureActions = useCaptureActions;
    return service;
  }, [cells]);
  const router = useMemo(() => createBrowserRouter(routes), []);

  const uiContextValue = useMemo(
    () => ({
      components: {
        link: ReactRouterLinkWrapper,
        image: AuthenticatedImage,
      },
    }),
    []
  );

  return (
    <PlatformProvider platformService={platformService}>
      <PortProvider>
        <ExtensionAuthProvider>
          <ExtensionFetcherProvider>
            <RubyUIContext.Provider value={uiContextValue}>
              <RootLayout>
                <ChromeExtensionWrapper>
                  <RouterProvider router={router} />
                </ChromeExtensionWrapper>
              </RootLayout>
            </RubyUIContext.Provider>
          </ExtensionFetcherProvider>
        </ExtensionAuthProvider>
      </PortProvider>
    </PlatformProvider>
  );
};
