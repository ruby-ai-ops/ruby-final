import { autoInternalMCPServerNameToSId } from "@app/lib/actions/mcp_helper";
import { toggleFeatureFlagPlugin } from "@app/lib/api/admin/plugins/workspaces/toggle_feature_flag";
import { Authenticator } from "@app/lib/auth";
import { RUBY_COMPANY_PLAN_CODE } from "@app/lib/plans/plan_codes";
import { FeatureFlagResource } from "@app/lib/resources/feature_flag_resource";
import { MCPServerViewResource } from "@app/lib/resources/mcp_server_view_resource";
import { PlanFactory } from "@app/tests/utils/PlanFactory";
import { SpaceFactory } from "@app/tests/utils/SpaceFactory";
import { WorkspaceFactory } from "@app/tests/utils/WorkspaceFactory";
import {
  WHITELISTABLE_FEATURES,
  WHITELISTABLE_FEATURES_CONFIG,
} from "@app/types/shared/feature_flags";
import { describe, expect, it, vi } from "vitest";

function findFeatureFlagByRubyOnlyStatus(rubyOnly: boolean) {
  const feature = WHITELISTABLE_FEATURES.find(
    (feature) =>
      (WHITELISTABLE_FEATURES_CONFIG[feature].stage === "ruby_only") ===
      rubyOnly
  );

  if (!feature) {
    throw new Error(
      `Expected at least one ${rubyOnly ? "Ruby-only" : "non-Ruby-only"} feature flag.`
    );
  }

  return feature;
}

describe("toggleFeatureFlagPlugin.execute", () => {
  it("ensures auto MCP server views when enabling a feature flag", async () => {
    const plan = await PlanFactory.enterprise(RUBY_COMPANY_PLAN_CODE);
    const workspace = await WorkspaceFactory.fromPlan(plan);
    const auth = await Authenticator.internalAdminForWorkspace(workspace.sId);
    await SpaceFactory.defaults(auth);

    await MCPServerViewResource.ensureAllAutoToolsAreCreated(auth);

    const planModeMCPServerId = autoInternalMCPServerNameToSId({
      name: "plan_mode",
      workspaceId: workspace.id,
    });

    await expect(
      MCPServerViewResource.getMCPServerViewForSystemSpace(
        auth,
        planModeMCPServerId
      )
    ).resolves.toBeNull();
    await expect(
      MCPServerViewResource.getMCPServerViewForGlobalSpace(
        auth,
        planModeMCPServerId
      )
    ).resolves.toBeNull();

    const enableResult = await toggleFeatureFlagPlugin.execute(auth, null, {
      features: ["plan_mode"],
    });

    expect(enableResult.isOk()).toBe(true);
    if (!enableResult.isOk()) {
      throw enableResult.error;
    }

    const systemViewAfterEnable =
      await MCPServerViewResource.getMCPServerViewForSystemSpace(
        auth,
        planModeMCPServerId
      );
    const globalViewAfterEnable =
      await MCPServerViewResource.getMCPServerViewForGlobalSpace(
        auth,
        planModeMCPServerId
      );
    expect(systemViewAfterEnable).not.toBeNull();
    expect(globalViewAfterEnable).not.toBeNull();

    const disableResult = await toggleFeatureFlagPlugin.execute(auth, null, {
      features: [],
    });
    expect(disableResult.isOk()).toBe(true);
    if (!disableResult.isOk()) {
      throw disableResult.error;
    }

    const reenableResult = await toggleFeatureFlagPlugin.execute(auth, null, {
      features: ["plan_mode"],
    });
    expect(reenableResult.isOk()).toBe(true);
    if (!reenableResult.isOk()) {
      throw reenableResult.error;
    }

    // Re-enabling must not create new views: the system/global view sIds
    // should match the ones returned right after the first enable.
    const systemViewAfterReenable =
      await MCPServerViewResource.getMCPServerViewForSystemSpace(
        auth,
        planModeMCPServerId
      );
    const globalViewAfterReenable =
      await MCPServerViewResource.getMCPServerViewForGlobalSpace(
        auth,
        planModeMCPServerId
      );
    expect(systemViewAfterReenable?.sId).toBe(systemViewAfterEnable?.sId);
    expect(globalViewAfterReenable?.sId).toBe(globalViewAfterEnable?.sId);
  });

  it("rejects enabling Ruby-only feature flags on other plans", async () => {
    const workspace = await WorkspaceFactory.basic();
    const auth = await Authenticator.internalAdminForWorkspace(workspace.sId);
    const rubyOnlyFeature = findFeatureFlagByRubyOnlyStatus(true);

    const result = await toggleFeatureFlagPlugin.execute(auth, null, {
      features: [rubyOnlyFeature],
    });

    expect(result.isErr()).toBe(true);
    if (!result.isErr()) {
      throw new Error("Expected enabling the feature flag to fail.");
    }
    expect(result.error.message).toContain(
      "Ruby-only feature flags can only be enabled on Ruby or Friends & Family plans."
    );
    await expect(
      FeatureFlagResource.isEnabledForWorkspace(workspace, rubyOnlyFeature)
    ).resolves.toBe(false);
  });

  it("allows enabling Ruby-only feature flags on Friends & Family plans", async () => {
    const plan = await PlanFactory.enterprise("FREE_FRIENDSAMILY");
    const workspace = await WorkspaceFactory.fromPlan(plan);
    const auth = await Authenticator.internalAdminForWorkspace(workspace.sId);
    const rubyOnlyFeature = findFeatureFlagByRubyOnlyStatus(true);

    const result = await toggleFeatureFlagPlugin.execute(auth, null, {
      features: [rubyOnlyFeature],
    });

    expect(result.isOk()).toBe(true);
    await expect(
      FeatureFlagResource.isEnabledForWorkspace(workspace, rubyOnlyFeature)
    ).resolves.toBe(true);
  });

  it("allows enabling Ruby-only feature flags on any plan in development", async () => {
    vi.stubEnv("IS_DEVELOPMENT", "true");
    try {
      const workspace = await WorkspaceFactory.basic();
      const auth = await Authenticator.internalAdminForWorkspace(workspace.sId);
      const rubyOnlyFeature = findFeatureFlagByRubyOnlyStatus(true);

      const result = await toggleFeatureFlagPlugin.execute(auth, null, {
        features: [rubyOnlyFeature],
      });

      expect(result.isOk()).toBe(true);
      await expect(
        FeatureFlagResource.isEnabledForWorkspace(workspace, rubyOnlyFeature)
      ).resolves.toBe(true);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("allows enabling non-Ruby-only feature flags on other plans", async () => {
    const workspace = await WorkspaceFactory.basic();
    const auth = await Authenticator.internalAdminForWorkspace(workspace.sId);
    const nonRubyOnlyFeature = findFeatureFlagByRubyOnlyStatus(false);

    const result = await toggleFeatureFlagPlugin.execute(auth, null, {
      features: [nonRubyOnlyFeature],
    });

    expect(result.isOk()).toBe(true);
    await expect(
      FeatureFlagResource.isEnabledForWorkspace(workspace, nonRubyOnlyFeature)
    ).resolves.toBe(true);
  });
});
