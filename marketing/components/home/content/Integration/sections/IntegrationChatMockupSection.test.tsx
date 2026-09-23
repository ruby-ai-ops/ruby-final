import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => ({
    fillStyle: "",
    fillRect: () => undefined,
  }),
});

const integration = {
  slug: "clari_copilot",
  name: "Clari Copilot",
  type: "mcp_server" as const,
  description: "Search and summarize sales calls.",
  icon: "ClariCopilotLogo",
  documentationUrl: null,
  authorizationRequired: true,
  tools: [
    {
      name: "search_calls",
      displayName: "Search calls",
      description: "Find call recordings.",
      isWriteAction: false,
    },
  ],
  category: "transcripts" as const,
};

const storyline = {
  userPrompt: "Give me a recap of recent calls in Clari Copilot.",
  toolCalls: ["search_calls"],
  completedInSeconds: 12,
  responseIntro: "Here is the short version.",
  responseSections: [],
};

describe("IntegrationChatMockupSection", () => {
  it("renders the agent header with Ruby capitalized", async () => {
    const { IntegrationChatMockupSection } = await import(
      "./IntegrationChatMockupSection"
    );

    render(
      <IntegrationChatMockupSection
        integration={integration}
        storyline={storyline}
      />
    );

    expect(screen.getByText("Ruby", { exact: true })).toBeInTheDocument();
  });
});
