import type { RubyAppSecretType } from "@app/types/ruby_app_secret";

export type GetRubyAppSecretsResponseBody = {
  secrets: RubyAppSecretType[];
};

export type PostRubyAppSecretsResponseBody = {
  secret: RubyAppSecretType;
};
