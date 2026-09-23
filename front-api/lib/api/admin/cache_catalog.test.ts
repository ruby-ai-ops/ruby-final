import {
  getAdminCacheCatalog,
  getAdminCacheOperations,
} from "@front-api/lib/api/admin/cache_catalog";
import { describe, expect, it } from "vitest";

describe("Admin cache catalog", () => {
  it("uses owner-defined operations for migrated caches", () => {
    const workspace = getAdminCacheOperations("workspace_by_sid");
    const activeSeats = getAdminCacheOperations("workspace_active_seats");

    expect(workspace?.buildKey({ wId: "workspace-1" })).toBe(
      "cacheWithRedis-workspace_by_sid-v3:workspace-1"
    );
    expect(workspace?.keyPattern).toBe("cacheWithRedis-workspace_by_sid-v3:*");
    expect(workspace?.buildKeysToDelete({ wId: "workspace-1" })).toEqual([
      "cacheWithRedis-workspace_by_sid-v3:workspace-1",
      "cacheWithRedis-_fetchByIdUncached-workspace:v2:workspace-1",
    ]);
    expect(workspace?.keyPatternsToDelete).toEqual([
      "cacheWithRedis-workspace_by_sid-v3:*",
      "cacheWithRedis-_fetchByIdUncached-workspace:v2:*",
    ]);
    expect(activeSeats?.buildKey({ workspaceId: "workspace-1" })).toBe(
      "cacheWithRedis-_countActiveSeatsInWorkspaceUncached-count-active-seats-in-workspace:workspace-1"
    );
  });

  it("keeps legacy cache descriptors available during migration", () => {
    const user = getAdminCacheOperations("user_by_workos_id");

    expect(user?.buildKey({ workOSUserId: "workos-user-1" })).toBe(
      "cacheWithRedis-_fetchByWorkOSUserIdUncached-user:workos:workos-user-1"
    );
  });

  it("lists each cache exactly once", () => {
    const catalog = getAdminCacheCatalog();
    const ids = catalog.map((entry) => entry.id);

    expect(ids.filter((id) => id === "workspace_by_sid")).toHaveLength(1);
    expect(ids.filter((id) => id === "workspace_active_seats")).toHaveLength(1);
  });

  it("keeps the previous active-seats id as a compatibility alias", () => {
    const activeSeats = getAdminCacheOperations("membership_seats");

    expect(activeSeats?.description.id).toBe("workspace_active_seats");
  });
});
