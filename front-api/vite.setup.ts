// front-api tests reuse front's vitest setup, then register a shared config mock
// so honoApp can load MCP routes and tests get stable config values.
import { vi } from "vitest";

import "../front/vite.setup.ts";

// Front-api tests exercise server behavior and do not enable browser development mode.
vi.mock("@app/components/dev/devModeConstants", () => {
  return {
    DEV_MODE_ACTIVE: false,
    DEV_MODE_STORAGE_KEY: "ruby_dev_mode",
  };
});

vi.mock("@app/lib/api/config", async (importOriginal) => {
  const { createAppConfigMock } = await import(
    "@app/tests/utils/mocks/app_config"
  );
  return createAppConfigMock(importOriginal, {
    getAcademyJwtSecret: () => "test-academy-jwt-secret",
    getApiBaseUrl: () => "http://localhost:3000",
    getAppUrl: () => "http://localhost:3000",
    getCoreAPIConfig: () => ({
      url: "http://localhost:9999",
      apiKey: "foo",
    }),
    getConnectorsAPIConfig: () => ({
      url: "http://localhost:0",
      secret: "test",
      webhookSecret: "test",
    }),
    getDocumentRendererUrl: () => "http://localhost:3100",
    getEgressPolicyBucket: () => "test-egress-policy-bucket",
    getRubyInviteTokenSecret: () => "test-invite-secret-32chars!!!!!",
    getInvitationEmailTemplate: () => "d-test",
    getOAuthAPIConfig: () => ({
      url: "https://oauth-api.example.com",
      apiKey: "test-api-key",
    }),
    getAdminAppUrl: () => "http://localhost:3000/admin",
    getSendgridApiKey: () => "SG.test",
    getSupportEmailAddress: () => ({
      name: "Ruby team",
      email: "test@ruby.ad",
    }),
    getVizJwtSecret: () => "test-secret",
    getVizPublicUrl: () => "https://viz.ruby.ad",
  });
});

vi.mock("@app/lib/api/mcp_server/urls", async (importOriginal) => {
  return {
    ...(await importOriginal()),
    getMcpResourceServerUrl: () => "http://localhost:3000/mcp",
  };
});
