import { ALL_ROLES } from "@app/lib/admin/roles";
import type { TestWorkspacePlan } from "@app/tests/utils/WorkspaceFactory";
import type { MembershipRoleType } from "@app/types/memberships";
import type { WorkspaceType } from "@app/types/user";
import type { RequestMethod } from "node-mocks-http";
import { vi } from "vitest";

import { createPrivateApiMockRequest } from "./generic_private_api_tests";

const TEST_CF_ACCESS_TOKEN = "test-cf-access-jwt";
const TEST_CF_ACCESS_CONFIG = {
  teamDomain: "https://ruby.cloudflareaccess.com",
  aud: "test-aud",
};

// Admin auth prefers Cloudflare Access. Mock token resolution / JWT verify /
// role lookup the same way private-api tests mock WorkOS session resolution, so
// callers keep using bare `honoApp.request(...)` without attaching headers.
vi.mock(
  import("../../lib/api/admin/cloudflare_access"),
  async (importOriginal) => {
    const mod = await importOriginal();
    return {
      ...mod,
      getCloudflareAccessConfig: vi.fn(),
      resolveCloudflareAccessToken: vi.fn(),
      verifyCloudflareAccessJwt: vi.fn(),
      getAdminRolesForUserViaCloudflareAccess: vi.fn(),
    };
  }
);

import {
  getCloudflareAccessConfig,
  getAdminRolesForUserViaCloudflareAccess,
  resolveCloudflareAccessToken,
  verifyCloudflareAccessJwt,
} from "../../lib/api/admin/cloudflare_access";

/**
 * Sets up workspace fixtures and mocks Cloudflare Access for admin route tests.
 *
 * When `isSuperUser` is true, adminAuth accepts requests as a Ruby internal
 * Access identity with all admin roles. When false, Access token resolution
 * returns nothing so adminAuth rejects with 401 (matching production behavior
 * outside development when CF Access is configured).
 */
export const createAdminApiMockRequest = async ({
  method = "GET",
  role = "user",
  isSuperUser = false,
  plan = "basic",
  workspace: existingWorkspace,
}: {
  method?: RequestMethod;
  role?: MembershipRoleType;
  isSuperUser?: boolean;
  plan?: TestWorkspacePlan;
  workspace?: WorkspaceType;
} = {}) => {
  const result = await createPrivateApiMockRequest({
    method,
    role,
    isSuperUser,
    plan,
    workspace: existingWorkspace,
  });

  vi.mocked(getCloudflareAccessConfig).mockReturnValue(TEST_CF_ACCESS_CONFIG);

  if (isSuperUser) {
    vi.mocked(resolveCloudflareAccessToken).mockReturnValue(
      TEST_CF_ACCESS_TOKEN
    );
    vi.mocked(verifyCloudflareAccessJwt).mockResolvedValue({
      email: result.user.email,
      name: result.user.fullName(),
      sub: "test-cf-access-sub",
    });
    vi.mocked(getAdminRolesForUserViaCloudflareAccess).mockResolvedValue(
      ALL_ROLES
    );
  } else {
    vi.mocked(resolveCloudflareAccessToken).mockReturnValue(undefined);
    vi.mocked(verifyCloudflareAccessJwt).mockResolvedValue(null);
    vi.mocked(getAdminRolesForUserViaCloudflareAccess).mockResolvedValue([]);
  }

  return result;
};
