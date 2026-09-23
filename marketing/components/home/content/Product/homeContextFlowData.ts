import type { InternalAllowedIconType } from "@marketing/components/resources/resources_icons";

interface ContextFlowNode {
  label: string;
  description: string;
  icon: InternalAllowedIconType;
}

export const CONTEXT_BOARD_CLASS =
  "relative overflow-hidden rounded-[32px] border border-blue-200/90 bg-[radial-gradient(circle_at_50%_48%,rgba(147,197,253,0.34),transparent_38%),linear-gradient(135deg,rgba(239,246,255,0.98),rgba(219,234,254,0.92)_48%,rgba(238,242,255,0.94))] p-5 shadow-[0_34px_90px_-48px_rgba(37,99,235,0.58)] md:p-10 lg:p-12";

export const CONTEXT_SECTION_LABEL_CLASS =
  "mb-2 text-xs font-semibold uppercase text-foreground/65";

export const CONTEXT_FLOW_DASH_PATTERN = "10 12";
export const CONTEXT_FLOW_DASH_OFFSET = -44;

export const CONTEXT_SOURCES: readonly ContextFlowNode[] = [
  {
    label: "Slack",
    description: "Conversations and decisions",
    icon: "SlackLogo",
  },
  {
    label: "CRM",
    description: "Accounts and relationships",
    icon: "ActionGlobeAltIcon",
  },
  {
    label: "Zendesk",
    description: "Tickets and support history",
    icon: "ZendeskLogo",
  },
];

export const CONTEXT_ACTIONS: readonly ContextFlowNode[] = [
  {
    label: "Classify request",
    description: "Understand intent and urgency",
    icon: "ActionListCheckIcon",
  },
  {
    label: "Update CRM",
    description: "Keep account context current",
    icon: "ActionCloudArrowLeftRightIcon",
  },
  {
    label: "Draft response",
    description: "Reply with grounded context",
    icon: "ActionDocumentTextIcon",
  },
];
