import config from "@app/lib/api/config";
import type { Authenticator } from "@app/lib/auth";
import { ProviderCredentialResource } from "@app/lib/resources/provider_credential_resource";
import type { ByokModelProviderIdType } from "@app/types/assistant/models/types";
import type {
  ApiKeyCredentialContentSchema,
  LLMCredentialsType,
  ProviderCredentialKey,
} from "@app/types/provider_credential";
import { PROVIDER_TO_CREDENTIAL_KEY } from "@app/types/provider_credential";
import { assertNever } from "@app/types/shared/utils/assert_never";
import { EnvironmentConfig } from "@app/types/shared/utils/config";
import assert from "assert";
import type { z } from "zod";

export const MISSING_EMBEDDING_API_KEY_ERROR_MESSAGE =
  "An OpenAI API key is required to perform this action. Please configure it in your workspace settings or contact an admin.";

const env = (key: string) =>
  EnvironmentConfig.getOptionalEnvVariable(key) ?? "";

function rubyManagedByokProviderKeys(): Record<ProviderCredentialKey, string> {
  return {
    ANTHROPIC_API_KEY: env("RUBY_MANAGED_ANTHROPIC_API_KEY"),
    OPENAI_API_KEY: env("RUBY_MANAGED_OPENAI_API_KEY"),
    GOOGLE_AI_STUDIO_API_KEY: env("RUBY_MANAGED_GOOGLE_AI_STUDIO_API_KEY"),
  };
}

function rubyManagedOtherProviderKeys() {
  return {
    // Vertex authenticates with a Ruby service account scoped to this project, so the project id
    // is itself a Ruby-managed credential and must never reach a BYOK workspace.
    AGENT_PLATFORM_PROJECT_ID: config.getVertexAiProjectId(),
    AZURE_OPENAI_API_KEY: env("RUBY_MANAGED_AZURE_OPENAI_API_KEY"),
    AZURE_OPENAI_ENDPOINT: env("RUBY_MANAGED_AZURE_OPENAI_ENDPOINT"),
    MISTRAL_API_KEY: env("RUBY_MANAGED_MISTRAL_API_KEY"),
    TEXTSYNTH_API_KEY: env("RUBY_MANAGED_TEXTSYNTH_API_KEY"),
    GOOGLE_AI_STUDIO_API_KEY: env("RUBY_MANAGED_GOOGLE_AI_STUDIO_API_KEY"),
    DEEPSEEK_API_KEY: env("RUBY_MANAGED_DEEPSEEK_API_KEY"),
    FIREWORKS_API_KEY: env("RUBY_MANAGED_FIREWORKS_API_KEY"),
    XAI_API_KEY: env("RUBY_MANAGED_XAI_API_KEY"),
  };
}

// Safer to always point to the same hosting region while we handle US first,
// avoid region switching issues when welcoming EU BYOK workspaces later.
function baseCredentialVariables() {
  return {
    OPENAI_USE_EU_ENDPOINT:
      config.getRegion() === "europe-west1" ? "true" : "false",
    OPENAI_BASE_URL: env("RUBY_MANAGED_OPENAI_BASE_URL"),
  };
}

/**
 * The Ruby-managed keys, resolved from the environment alone.
 *
 * This is what a non-BYOK workspace gets, factored out so callers that have no
 * `Authenticator` at all -- the model health probe running in a Temporal worker
 * -- can reach Ruby's own credentials without inventing a workspace.
 *
 * Dangerous because it answers for no workspace: it skips `plan.isByok`, so a
 * BYOK workspace's inference would run on Ruby's keys, in Ruby's provider
 * accounts. If you hold an `Authenticator`, call `getLlmCredentials(auth)`.
 */
export function dangerouslyGetRubyManagedLlmCredentials(): LLMCredentialsType {
  return {
    ...baseCredentialVariables(),
    ...rubyManagedOtherProviderKeys(),
    ...rubyManagedByokProviderKeys(),
  };
}

/**
 * Whether `getLlmCredentials(auth)` answers with credentials the workspace provided rather than
 * Ruby's. Recorded per usage row on `run_usages.useWorkspaceCredentials`, so billed usage can be
 * traced back to whose provider account paid for it.
 */
export function usesWorkspaceProvidedCredentials(auth: Authenticator): boolean {
  return auth.getNonNullablePlan().isByok;
}

/**
 * Returns LLM credentials for the workspace.
 *
 * - Non-BYOK workspaces: returns Ruby-managed keys from environment variables.
 * - BYOK workspaces: resolves customer-provided keys from OAuth credentials, with no fallback on
 *   Ruby-managed keys.
 *
 * `OPENAI_EMBEDDING_API_KEY` is set separately from `OPENAI_API_KEY` so Ruby apps
 * don't accidentally use the customer's LLM key for embeddings.
 *
 * By default, BYOK workspaces must have `OPENAI_EMBEDDING_API_KEY` configured
 * (used by search, upsert, data source creation).
 * Pass `skipEmbeddingApiKeyRequirement: true` for call sites that only need LLM
 * keys (agent loop, token counting, image generation, etc.).
 */
/**
 * @cc [owner:pmilliotte,label:security;product] byok-credentials-are-customer-owned
 * For a workspace whose plan has `isByok`, every provider credential in the returned object MUST
 * come from the keys that workspace configured (`ProviderCredentialResource`), and the object MUST
 * carry `RUBY_BYOK: "true"` so downstream consumers can refuse a Ruby-managed substitute.
 *
 * Nothing that authenticates to a provider may be read from Ruby's environment into it: no API key,
 * and no identifier Ruby's own service account authenticates against such as
 * `AGENT_PLATFORM_PROJECT_ID`. Routing configuration that carries no identity -- the
 * `baseCredentialVariables()` endpoint selectors -- is allowed, since it decides which host the
 * customer's own key is presented to.
 */
export async function getLlmCredentials(
  auth: Authenticator,
  { skipEmbeddingApiKeyRequirement } = {
    skipEmbeddingApiKeyRequirement: false,
  }
): Promise<LLMCredentialsType> {
  const plan = auth.getNonNullablePlan();

  if (!plan.isByok) {
    return dangerouslyGetRubyManagedLlmCredentials();
  }

  const providerCredentials =
    await ProviderCredentialResource.listByWorkspace(auth);

  const credentials = mapOauthCredentialsToLlmCredentials(
    providerCredentials.map((cred) => ({
      providerId: cred.providerId,
      content: cred.credentials,
    }))
  );

  if (!skipEmbeddingApiKeyRequirement) {
    assert(
      credentials.OPENAI_EMBEDDING_API_KEY,
      "[BYOK] This action requires OPENAI_EMBEDDING_API_KEY to be configured."
    );
  }

  return {
    ...baseCredentialVariables(),
    RUBY_BYOK: "true",
    ...credentials,
  };
}

function mapOauthCredentialsToLlmCredentials(
  oauthCredentials: {
    providerId: ByokModelProviderIdType;
    content: z.infer<typeof ApiKeyCredentialContentSchema>;
  }[]
): LLMCredentialsType {
  const result: LLMCredentialsType = {};

  for (const { providerId, content } of oauthCredentials) {
    switch (providerId) {
      case "openai": {
        result.OPENAI_API_KEY = content.api_key;
        result.OPENAI_EMBEDDING_API_KEY = content.api_key;
        // TODO(BYOK): add support openai EU host
        break;
      }
      case "anthropic": {
        result[PROVIDER_TO_CREDENTIAL_KEY[providerId]] = content.api_key;
        break;
      }
      case "google_ai_studio": {
        result[PROVIDER_TO_CREDENTIAL_KEY[providerId]] = content.api_key;
        break;
      }
      default:
        assertNever(providerId);
    }
  }

  return result;
}
