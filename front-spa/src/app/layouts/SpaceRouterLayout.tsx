import { SpaceLayout } from "@ruby-ai/front/components/spaces/SpaceLayout";
import { Outlet } from "react-router-dom";

export function SpaceRouterLayout() {
  return (
    <SpaceLayout>
      <Outlet />
    </SpaceLayout>
  );
}
