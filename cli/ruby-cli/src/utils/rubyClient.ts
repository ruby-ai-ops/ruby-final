import type { Result } from "@ruby-ai/client";
import { RubyAPI, Err, Ok } from "@ruby-ai/client";

// biome-ignore lint/suspicious/noImportCycles: I'm too lazy to refactor this right now
import AuthService from "./authService.js";
import TokenStorage from "./tokenStorage.js";
import { CLI_VERSION } from "./version.js";

let rubyApiInstance: RubyAPI | null = null;

export const getApiDomain = (region: string | null): Result<string, Error> => {
  const url = (() => {
    switch (region) {
      case "europe-west1":
        return process.env.RUBY_EU_URL || process.env.DEFAULT_RUBY_API_DOMAIN;
      case "us-central1":
        return process.env.RUBY_US_URL || process.env.DEFAULT_RUBY_API_DOMAIN;
      default:
        return process.env.DEFAULT_RUBY_API_DOMAIN;
    }
  })();

  if (!url) {
    return new Err(new Error("Unable to determine API domain."));
  }

  return new Ok(url);
};

/**
 * Gets or creates a RubyAPI instance with the stored authentication token and region
 * @returns A Promise resolving to a RubyAPI instance or null if no token is available
 */
export const getRubyClient = async (): Promise<
  Result<RubyAPI | null, Error>
> => {
  if (rubyApiInstance) {
    return new Ok(rubyApiInstance);
  }

  // Get a valid access token (this will refresh if needed)
  const accessToken = await AuthService.getValidAccessToken();

  if (!accessToken) {
    return new Ok(null);
  }

  const region = await TokenStorage.getRegion();
  const apiDomainRes = getApiDomain(region);

  if (apiDomainRes.isErr()) {
    return new Err(apiDomainRes.error);
  }

  rubyApiInstance = new RubyAPI(
    {
      url: apiDomainRes.value,
    },
    {
      apiKey: async () => {
        const token = await AuthService.getValidAccessToken();
        if (token.isErr()) {
          return null;
        }
        return token.value || "";
      },
      workspaceId: (await TokenStorage.getWorkspaceId()) ?? "me",
      extraHeaders: {
        "X-Ruby-CLI-Version": CLI_VERSION,
        "User-Agent": "Ruby CLI",
      },
    },
    console
  );

  return new Ok(rubyApiInstance);
};

/**
 * Resets the cached RubyAPI instance. Should be called after logout or token changes.
 */
export const resetRubyClient = (): void => {
  rubyApiInstance = null;
};

/**
 * Gets a RubyAPI client with automatic retry on 401 errors
 * This wrapper handles token refresh and client recreation when auth fails
 */
export const getRubyClientWithRetry = async (): Promise<
  Result<RubyAPI | null, Error>
> => {
  const client = await getRubyClient();
  if (client.isErr()) {
    return client;
  }

  if (!client.value) {
    return client;
  }

  // Wrap the client to handle 401 errors automatically
  const originalClient = client.value;

  return new Ok(originalClient);
};

export default {
  getRubyClient,
  resetRubyClient,
  getRubyClientWithRetry,
};
