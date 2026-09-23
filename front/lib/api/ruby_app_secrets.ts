import type { Authenticator } from "@app/lib/auth";
import { RubyAppSecretModel } from "@app/lib/models/ruby_app_secret";
import type { RubyAppSecretType } from "@app/types/ruby_app_secret";
import { decrypt } from "@app/types/shared/utils/encryption";
import { redactString } from "@app/types/shared/utils/string_utils";

export async function getRubyAppSecrets(
  auth: Authenticator,
  clear = false
): Promise<RubyAppSecretType[]> {
  const owner = auth.workspace();
  if (!owner) {
    return [];
  }

  const secrets = await RubyAppSecretModel.findAll({
    where: {
      workspaceId: owner.id,
    },
    order: [["name", "DESC"]],
  });

  return secrets.map((s) => {
    const clearSecret = decrypt({
      encrypted: s.hash,
      key: owner.sId,
      useCase: "developer_secret",
    });
    return {
      name: s.name,
      value: clear ? clearSecret : redactString(clearSecret, 1),
    };
  });
}

export async function getRubyAppSecret(
  auth: Authenticator,
  name: string
): Promise<RubyAppSecretModel | null> {
  const owner = auth.workspace();
  if (!owner) {
    return null;
  }

  const secret = await RubyAppSecretModel.findOne({
    where: {
      name: name,
      workspaceId: owner.id,
    },
  });

  if (!secret) {
    return null;
  }

  return secret;
}
