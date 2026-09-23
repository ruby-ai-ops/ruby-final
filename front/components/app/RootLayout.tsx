import { ConfirmPopupArea } from "@app/components/Confirm";
import { NoOpDesktopNavigationProvider } from "@app/components/navigation/DesktopNavigationContext";
import { ConversationFontProvider } from "@app/components/ui/ConversationFontContext";
import { SidebarProvider } from "@app/components/ui/SidebarContext";
import { ThemeProvider } from "@app/components/ui/ThemeContext";
import { useStripUtmParams } from "@app/hooks/useStripUtmParams";
import { Notification } from "@ruby-ai/ui";
import { ConversationSidePanelProvider } from "../assistant/conversation/ConversationSidePanelContext";

/**
 * This layout is used in _app only
 */
export function RootLayout({ children }: { children: React.ReactNode }) {
  useStripUtmParams();

  return (
    <ThemeProvider>
      <ConversationFontProvider>
        <SidebarProvider>
          <NoOpDesktopNavigationProvider>
            <ConfirmPopupArea>
              <ConversationSidePanelProvider>
                <Notification.Area>{children}</Notification.Area>
              </ConversationSidePanelProvider>
            </ConfirmPopupArea>
          </NoOpDesktopNavigationProvider>
        </SidebarProvider>
      </ConversationFontProvider>
    </ThemeProvider>
  );
}
