import { inferProjectTaskSourceFromUrl } from "@app/lib/api/actions/servers/pod_tasks/source_utils";
import { describe, expect, it } from "vitest";

describe("inferProjectTaskSourceFromUrl", () => {
  it("detects Ruby conversation URLs", () => {
    const source = inferProjectTaskSourceFromUrl({
      url: "https://app.ruby.ad/w/ws123/conversation/conv456",
      title: "Kickoff",
    });
    expect(source).toEqual({
      sourceType: "project_conversation",
      sourceId: "conv456",
      sourceTitle: "Kickoff",
      sourceUrl: "https://app.ruby.ad/w/ws123/conversation/conv456",
    });
  });

  it("detects Slack URLs", () => {
    const source = inferProjectTaskSourceFromUrl({
      url: "https://rubyhq.slack.com/archives/C123/p456",
      title: "Thread",
    });
    expect(source.sourceType).toBe("slack");
    expect(source.sourceId).toBe("https://rubyhq.slack.com/archives/C123/p456");
  });

  it("detects GitHub URLs", () => {
    const source = inferProjectTaskSourceFromUrl({
      url: "https://github.com/ruby-ai-ops/ruby-final/issues/123",
      title: "Issue #123",
    });
    expect(source.sourceType).toBe("github");
  });

  it("detects current Notion URLs", () => {
    const source = inferProjectTaskSourceFromUrl({
      url: "https://app.notion.com/p/Project-12345678901234567890123456789012",
      title: "Project",
    });
    expect(source.sourceType).toBe("notion");
  });

  it("falls back to project_knowledge for unknown URLs", () => {
    const source = inferProjectTaskSourceFromUrl({
      url: "https://example.com/doc",
      title: "Doc",
    });
    expect(source.sourceType).toBe("project_knowledge");
  });
});
