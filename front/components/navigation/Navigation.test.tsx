import { Navigation } from "@app/components/navigation/Navigation";
import type { SubscriptionType } from "@app/types/plan";
import type { WorkspaceType } from "@app/types/user";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@app/lib/auth/AuthContext", () => ({
  useAuth: () => ({ user: { sId: "user-1", firstName: "Ruby" } }),
}));

vi.mock("@app/lib/swr/user", () => ({
  useUser: () => ({ user: null }),
}));

vi.mock("@app/components/navigation/NavigationSidebar", () => ({
  NavigationSidebar: ({
    user,
  }: {
    user: { firstName: string; workspaces: { sId: string }[] };
  }) => (
    <div data-testid="profile-menu-user">
      {user.firstName}:{user.workspaces.map((workspace) => workspace.sId)}
    </div>
  ),
  ToggleNavigationSidebarButton: () => null,
}));

describe("Navigation", () => {
  it("keeps the profile menu available when user details fail to load", () => {
    render(
      <Navigation
        hideSidebar={false}
        owner={{ sId: "workspace-1" } as WorkspaceType}
        subscription={{} as SubscriptionType}
        isNavigationBarOpen={true}
        setNavigationBarOpen={() => {}}
        isFullScreen={false}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("profile-menu-user").textContent).toBe(
      "Ruby:workspace-1"
    );
  });
});
