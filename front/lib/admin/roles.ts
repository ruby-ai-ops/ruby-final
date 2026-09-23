import { z } from "zod";

const AdminRoleSchema = z.enum([
  "admin",
  "billing",
  "engineering",
  "support",
  "talent",
]);

export type AdminRole = z.infer<typeof AdminRoleSchema>;

export const ALL_ROLES: AdminRole[] = AdminRoleSchema.options;

/**
 * IdP group names that grant each admin role. Keying by `AdminRole` forces a new
 * role to declare its groups instead of silently granting nothing.
 */
const ACCESS_GROUPS_BY_ROLE: Record<AdminRole, readonly string[]> = {
  admin: ["admin-admin"],
  billing: ["admin-billing"],
  engineering: ["admin-engineering"],
  support: ["admin-support"],
  talent: ["admin-talent"],
};

const ROLE_BY_ACCESS_GROUP = new Map<string, AdminRole>(
  ALL_ROLES.flatMap((role) =>
    ACCESS_GROUPS_BY_ROLE[role].map(
      (group) => [group.toLowerCase(), role] as const
    )
  )
);

export function mapAccessGroupNamesToAdminRoles(
  groupNames: readonly string[]
): AdminRole[] {
  const granted = new Set<AdminRole>();

  for (const groupName of groupNames) {
    const normalized = groupName.trim().toLowerCase();
    const at = normalized.indexOf("@");
    const localPart =
      at === -1 ? normalized : normalized.slice(0, at).trimEnd();
    if (at !== -1 && !/^[^@\s]+$/.test(normalized.slice(at + 1))) {
      continue;
    }

    const role = ROLE_BY_ACCESS_GROUP.get(localPart);
    if (role) {
      granted.add(role);
    }
  }

  return ALL_ROLES.filter((role) => granted.has(role));
}

export function hasAdminRole(
  userRoles: AdminRole[],
  requiredRoles: AdminRole[]
): boolean {
  const userRoleSet = new Set(userRoles);
  return requiredRoles.some((r) => userRoleSet.has(r));
}
