import { Authenticator } from "@app/lib/auth";
import { describe, expect, it } from "vitest";

describe("Authenticator.fromRubySuperUser", () => {
  it("sets isRubySuperUser without a provisioned Ruby user", async () => {
    const auth = await Authenticator.fromRubySuperUser({
      adminPrincipal: { email: "seb@ruby.ad", name: "Seb" },
    });

    expect(auth.isRubySuperUser()).toBe(true);
    expect(auth.user()).toBeNull();
    expect(auth.getAdminPrincipal()).toEqual({
      email: "seb@ruby.ad",
      name: "Seb",
    });
    expect(auth.toAdminUserJSON()).toMatchObject({
      email: "seb@ruby.ad",
      firstName: "Seb",
      fullName: "Seb",
    });
  });

  it("preserves admin identity when re-scoping", async () => {
    const auth = await Authenticator.fromRubySuperUser({
      adminPrincipal: { email: "seb@ruby.ad", name: null },
    });
    const scoped = await Authenticator.fromRubySuperUser({
      adminPrincipal: auth.getAdminPrincipal(),
    });

    expect(scoped.isRubySuperUser()).toBe(true);
    expect(scoped.getAdminPrincipal().email).toBe("seb@ruby.ad");
  });
});
