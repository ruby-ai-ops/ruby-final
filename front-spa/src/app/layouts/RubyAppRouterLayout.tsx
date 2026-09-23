import { RubyAppPageLayout } from "@ruby-ai/front/components/apps/RubyAppPageLayout";
import { Outlet } from "react-router-dom";

export function RubyAppRouterLayout() {
  return (
    <RubyAppPageLayout>
      <Outlet />
    </RubyAppPageLayout>
  );
}
