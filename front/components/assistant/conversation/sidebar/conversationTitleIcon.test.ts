import { getConversationTitleIcon } from "@app/components/assistant/conversation/sidebar/conversationTitleIcon";
import {
  Bank,
  BarChart01,
  BarLineChart,
  Code01,
  CodeBrowser,
  CurrencyDollarCircle,
  Dataflow01,
  GitBranch01,
  GraduationHat01,
  Mail01,
  MessageTextCircle01,
  Palette,
  PlaneTakeoff,
  SearchMd,
  Settings02,
  ShieldTick,
  Table,
  UsersPlus,
} from "@ruby-ai/ui";
import { describe, expect, it } from "vitest";

describe("getConversationTitleIcon", () => {
  it.each([
    ["Sales revenue plan", CurrencyDollarCircle],
    ["Revenue forecasting", BarLineChart],
    ["LinkedIn prospect outreach", UsersPlus],
    ["Google Sheets data entry", Table],
    ["Monthly performance chart", BarChart01],
    ["GitHub repository update", GitBranch01],
    ["Browser website issue", CodeBrowser],
    ["Python code review", Code01],
    ["Research sources", SearchMd],
    ["Automate the daily trigger", Dataflow01],
    ["Dark theme colors", Palette],
    ["Email reply", Mail01],
    ["Operations process", Settings02],
    ["Security policy", ShieldTick],
    ["Budget planning", Bank],
    ["Travel itinerary", PlaneTakeoff],
    ["Education course", GraduationHat01],
  ])("chooses a topic icon for %s", (title, icon) => {
    expect(getConversationTitleIcon(title)).toBe(icon);
  });

  it("uses a neutral icon when no topic matches", () => {
    expect(getConversationTitleIcon("Welcome to Ruby")).toBe(
      MessageTextCircle01
    );
    expect(getConversationTitleIcon(null)).toBe(MessageTextCircle01);
  });

  it("uses a stable priority when a title has multiple topics", () => {
    expect(getConversationTitleIcon("Sales dashboard")).toBe(
      CurrencyDollarCircle
    );
  });
});
