import type { InternalAllowedIconType } from "@marketing/components/resources/resources_icons";
import type { PlatformLogoName } from "@ruby-ai/ui";

export interface IntegrationShowcaseAction {
  label: string;
  icon: InternalAllowedIconType;
}

export interface IntegrationShowcaseItem {
  id: string;
  name: string;
  logo: PlatformLogoName;
  category: string;
  actions: readonly IntegrationShowcaseAction[];
}

export function getAdditionalActionCount(integrationId: string): number {
  let hash = 0;
  for (const character of integrationId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return 8 + (hash % 8);
}

export const INTEGRATION_MARQUEE_ROW_DURATIONS_SECONDS = [78, 85, 92] as const;

const action = (
  label: string,
  icon: InternalAllowedIconType
): IntegrationShowcaseAction => ({ label, icon });

export const INTEGRATION_SHOWCASE_ITEMS: readonly IntegrationShowcaseItem[] = [
  {
    id: "slack",
    name: "Slack",
    logo: "SlackLogo",
    category: "Communication",
    actions: [
      action("Search conversations", "ActionMagnifyingGlassIcon"),
      action("Post channel updates", "ActionMegaphoneIcon"),
    ],
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    logo: "MicrosoftTeamsLogo",
    category: "Communication",
    actions: [
      action("Summarize discussions", "ActionDocumentTextIcon"),
      action("Coordinate team alerts", "ActionMegaphoneIcon"),
    ],
  },
  {
    id: "discord",
    name: "Discord",
    logo: "DiscordLogo",
    category: "Communication",
    actions: [
      action("Monitor channels", "ActionScanIcon"),
      action("Answer community questions", "ActionSpeakIcon"),
    ],
  },
  {
    id: "gmail",
    name: "Gmail",
    logo: "GmailLogo",
    category: "Email",
    actions: [
      action("Search email threads", "ActionMagnifyingGlassIcon"),
      action("Draft contextual replies", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "outlook",
    name: "Outlook",
    logo: "MicrosoftOutlookLogo",
    category: "Email",
    actions: [
      action("Triage the inbox", "ActionListCheckIcon"),
      action("Draft follow-ups", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    logo: "GcalLogo",
    category: "Calendar",
    actions: [
      action("Find availability", "ActionTimeIcon"),
      action("Prepare meeting briefs", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "notion",
    name: "Notion",
    logo: "NotionLogo",
    category: "Knowledge",
    actions: [
      action("Search workspace knowledge", "ActionMagnifyingGlassIcon"),
      action("Draft structured pages", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "confluence",
    name: "Confluence",
    logo: "ConfluenceLogo",
    category: "Knowledge",
    actions: [
      action("Find technical guidance", "ActionMagnifyingGlassIcon"),
      action("Synthesize documentation", "ActionBrainIcon"),
    ],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    logo: "DriveLogo",
    category: "Storage",
    actions: [
      action("Search approved files", "ActionMagnifyingGlassIcon"),
      action("Extract document context", "ActionScanIcon"),
    ],
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    logo: "MicrosoftLogo",
    category: "Productivity",
    actions: [
      action("Connect company files", "ActionCloudArrowLeftRightIcon"),
      action("Coordinate office workflows", "ActionAtomIcon"),
    ],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    logo: "GoogleSpreadsheetLogo",
    category: "Data",
    actions: [
      action("Analyze sheet data", "ActionPieChartIcon"),
      action("Update structured rows", "ActionTableIcon"),
    ],
  },
  {
    id: "microsoft-excel",
    name: "Microsoft Excel",
    logo: "MicrosoftExcelLogo",
    category: "Data",
    actions: [
      action("Inspect workbook data", "ActionScanIcon"),
      action("Build recurring reports", "ActionTableIcon"),
    ],
  },
  {
    id: "github",
    name: "GitHub",
    logo: "GithubLogo",
    category: "Development",
    actions: [
      action("Summarize pull requests", "ActionDocumentTextIcon"),
      action("Investigate code changes", "ActionGitBranchIcon"),
    ],
  },
  {
    id: "gitlab",
    name: "GitLab",
    logo: "GitlabLogo",
    category: "Development",
    actions: [
      action("Review merge requests", "ActionGitBranchIcon"),
      action("Track delivery issues", "ActionListCheckIcon"),
    ],
  },
  {
    id: "jira",
    name: "Jira",
    logo: "JiraLogo",
    category: "Development",
    actions: [
      action("Create and update issues", "ActionAtomIcon"),
      action("Summarize sprint progress", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "linear",
    name: "Linear",
    logo: "LinearLogo",
    category: "Development",
    actions: [
      action("Triage product issues", "ActionListCheckIcon"),
      action("Draft project updates", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "datadog",
    name: "Datadog",
    logo: "DatadogLogo",
    category: "Observability",
    actions: [
      action("Investigate incidents", "ActionScanIcon"),
      action("Summarize service health", "ActionPieChartIcon"),
    ],
  },
  {
    id: "statuspage",
    name: "Statuspage",
    logo: "StatuspageLogo",
    category: "Observability",
    actions: [
      action("Monitor service status", "ActionTimeIcon"),
      action("Draft incident notices", "ActionMegaphoneIcon"),
    ],
  },
  {
    id: "vanta",
    name: "Vanta",
    logo: "VantaLogo",
    category: "Security",
    actions: [
      action("Review compliance controls", "ActionLockIcon"),
      action("Surface audit evidence", "ActionMagnifyingGlassIcon"),
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    logo: "SalesforceLogo",
    category: "CRM",
    actions: [
      action("Research account context", "ActionBrainIcon"),
      action("Update opportunity records", "ActionCloudArrowLeftRightIcon"),
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot",
    logo: "HubspotLogo",
    category: "CRM",
    actions: [
      action("Enrich contact records", "ActionCloudArrowLeftRightIcon"),
      action("Analyze pipeline signals", "ActionPieChartIcon"),
    ],
  },
  {
    id: "attio",
    name: "Attio",
    logo: "AttioLogo",
    category: "CRM",
    actions: [
      action("Organize relationship data", "ActionTableIcon"),
      action("Surface account signals", "ActionLightbulbIcon"),
    ],
  },
  {
    id: "gong",
    name: "Gong",
    logo: "GongLogo",
    category: "Revenue",
    actions: [
      action("Analyze customer calls", "ActionSpeakIcon"),
      action("Extract next steps", "ActionListCheckIcon"),
    ],
  },
  {
    id: "salesloft",
    name: "Salesloft",
    logo: "SalesloftLogo",
    category: "Revenue",
    actions: [
      action("Personalize outreach", "ActionDocumentTextIcon"),
      action("Optimize sequences", "ActionLightbulbIcon"),
    ],
  },
  {
    id: "clari",
    name: "Clari",
    logo: "ClariLogo",
    category: "Revenue",
    actions: [
      action("Inspect forecast risk", "ActionPieChartIcon"),
      action("Summarize pipeline movement", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "intercom",
    name: "Intercom",
    logo: "IntercomLogo",
    category: "Support",
    actions: [
      action("Search support history", "ActionMagnifyingGlassIcon"),
      action("Draft customer responses", "ActionSpeakIcon"),
    ],
  },
  {
    id: "zendesk",
    name: "Zendesk",
    logo: "ZendeskLogo",
    category: "Support",
    actions: [
      action("Classify incoming tickets", "ActionListCheckIcon"),
      action("Draft grounded replies", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "freshdesk",
    name: "Freshdesk",
    logo: "FreshdeskLogo",
    category: "Support",
    actions: [
      action("Triage ticket queues", "ActionScanIcon"),
      action("Summarize resolutions", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "front",
    name: "Front",
    logo: "FrontLogo",
    category: "Support",
    actions: [
      action("Coordinate shared inboxes", "ActionCloudArrowLeftRightIcon"),
      action("Route customer requests", "ActionListCheckIcon"),
    ],
  },
  {
    id: "snowflake",
    name: "Snowflake",
    logo: "SnowflakeLogo",
    category: "Data",
    actions: [
      action("Query governed data", "ActionTableIcon"),
      action("Explain business trends", "ActionPieChartIcon"),
    ],
  },
  {
    id: "bigquery",
    name: "BigQuery",
    logo: "BigQueryLogo",
    category: "Data",
    actions: [
      action("Generate SQL analysis", "ActionTableIcon"),
      action("Summarize query results", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "power-bi",
    name: "Power BI",
    logo: "PowerBiLogo",
    category: "Analytics",
    actions: [
      action("Read dashboard signals", "ActionPieChartIcon"),
      action("Draft executive insights", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "hex",
    name: "Hex",
    logo: "HexLogo",
    category: "Analytics",
    actions: [
      action("Explore data projects", "ActionMagnifyingGlassIcon"),
      action("Publish analysis summaries", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "amplitude",
    name: "Amplitude",
    logo: "AmplitudeLogo",
    category: "Analytics",
    actions: [
      action("Analyze product behavior", "ActionPieChartIcon"),
      action("Detect usage patterns", "ActionLightbulbIcon"),
    ],
  },
  {
    id: "contentsquare",
    name: "Contentsquare",
    logo: "ContentsquareLogo",
    category: "Analytics",
    actions: [
      action("Inspect digital journeys", "ActionScanIcon"),
      action("Surface experience friction", "ActionLightbulbIcon"),
    ],
  },
  {
    id: "figma",
    name: "Figma",
    logo: "FigmaLogo",
    category: "Design",
    actions: [
      action("Review design context", "ActionImageIcon"),
      action("Summarize feedback", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "miro",
    name: "Miro",
    logo: "MiroLogo",
    category: "Design",
    actions: [
      action("Synthesize workshops", "ActionBrainIcon"),
      action("Extract action items", "ActionListCheckIcon"),
    ],
  },
  {
    id: "canva",
    name: "Canva",
    logo: "CanvaLogo",
    category: "Design",
    actions: [
      action("Generate campaign concepts", "ActionLightbulbIcon"),
      action("Coordinate creative assets", "ActionImageIcon"),
    ],
  },
  {
    id: "productboard",
    name: "Productboard",
    logo: "ProductboardLogo",
    category: "Product",
    actions: [
      action("Synthesize customer feedback", "ActionBrainIcon"),
      action("Prioritize product themes", "ActionListCheckIcon"),
    ],
  },
  {
    id: "monday",
    name: "Monday.com",
    logo: "MondayLogo",
    category: "Productivity",
    actions: [
      action("Update project boards", "ActionAtomIcon"),
      action("Draft status reports", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "asana",
    name: "Asana",
    logo: "AsanaLogo",
    category: "Productivity",
    actions: [
      action("Coordinate project tasks", "ActionListCheckIcon"),
      action("Summarize team progress", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "slab",
    name: "Slab",
    logo: "SlabLogo",
    category: "Knowledge",
    actions: [
      action("Search team knowledge", "ActionMagnifyingGlassIcon"),
      action("Consolidate documentation", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "guru",
    name: "Guru",
    logo: "GuruLogo",
    category: "Knowledge",
    actions: [
      action("Retrieve verified answers", "ActionMagnifyingGlassIcon"),
      action("Identify knowledge gaps", "ActionLightbulbIcon"),
    ],
  },
  {
    id: "granola",
    name: "Granola",
    logo: "GranolaLogo",
    category: "Meetings",
    actions: [
      action("Summarize meeting notes", "ActionDocumentTextIcon"),
      action("Extract commitments", "ActionListCheckIcon"),
    ],
  },
  {
    id: "fathom",
    name: "Fathom",
    logo: "FathomLogo",
    category: "Meetings",
    actions: [
      action("Analyze call transcripts", "ActionSpeakIcon"),
      action("Create follow-up briefs", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "luma",
    name: "Luma",
    logo: "LumaLogo",
    category: "Events",
    actions: [
      action("Coordinate event schedules", "ActionTimeIcon"),
      action("Summarize attendee signals", "ActionPieChartIcon"),
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "StripeLogo",
    category: "Finance",
    actions: [
      action("Inspect payment activity", "ActionScanIcon"),
      action("Summarize revenue trends", "ActionPieChartIcon"),
    ],
  },
  {
    id: "supabase",
    name: "Supabase",
    logo: "SupabaseLogo",
    category: "Development",
    actions: [
      action("Query application data", "ActionTableIcon"),
      action("Coordinate backend workflows", "ActionAtomIcon"),
    ],
  },
  {
    id: "netsuite",
    name: "NetSuite",
    logo: "NetSuiteLogo",
    category: "Finance",
    actions: [
      action("Analyze business records", "ActionTableIcon"),
      action("Draft operational reports", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "ashby",
    name: "Ashby",
    logo: "AshbyLogo",
    category: "People",
    actions: [
      action("Review candidate context", "ActionMagnifyingGlassIcon"),
      action("Summarize hiring pipelines", "ActionPieChartIcon"),
    ],
  },
  {
    id: "ukg",
    name: "UKG",
    logo: "UkgLogo",
    category: "People",
    actions: [
      action("Retrieve workforce context", "ActionMagnifyingGlassIcon"),
      action("Coordinate people workflows", "ActionAtomIcon"),
    ],
  },
  {
    id: "napta",
    name: "Napta",
    logo: "NaptaLogo",
    category: "People",
    actions: [
      action("Match skills to projects", "ActionBrainIcon"),
      action("Analyze staffing capacity", "ActionPieChartIcon"),
    ],
  },
  {
    id: "semrush",
    name: "Semrush",
    logo: "SemrushLogo",
    category: "Marketing",
    actions: [
      action("Research search opportunities", "ActionMagnifyingGlassIcon"),
      action("Analyze campaign visibility", "ActionPieChartIcon"),
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo: "LinkedinLogo",
    category: "Marketing",
    actions: [
      action("Research professional context", "ActionMagnifyingGlassIcon"),
      action("Draft social updates", "ActionMegaphoneIcon"),
    ],
  },
  {
    id: "apify",
    name: "Apify",
    logo: "ApifyLogo",
    category: "Automation",
    actions: [
      action("Collect web data", "ActionGlobeAltIcon"),
      action("Trigger extraction workflows", "ActionAtomIcon"),
    ],
  },
  {
    id: "zapier",
    name: "Zapier",
    logo: "ZapierLogo",
    category: "Automation",
    actions: [
      action("Connect workflow triggers", "ActionCloudArrowLeftRightIcon"),
      action("Automate routine actions", "ActionAtomIcon"),
    ],
  },
  {
    id: "chrome",
    name: "Chrome",
    logo: "ChromeLogo",
    category: "Web",
    actions: [
      action("Use approved web context", "ActionGlobeAltIcon"),
      action("Assist browser workflows", "ActionRobotIcon"),
    ],
  },
  {
    id: "firefox",
    name: "Firefox",
    logo: "FirefoxLogo",
    category: "Web",
    actions: [
      action("Research public sources", "ActionGlobeAltIcon"),
      action("Summarize web content", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    logo: "OpenaiLogo",
    category: "AI Models",
    actions: [
      action("Generate structured content", "ActionDocumentTextIcon"),
      action("Reason across context", "ActionBrainIcon"),
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "AnthropicLogo",
    category: "AI Models",
    actions: [
      action("Analyze complex documents", "ActionScanIcon"),
      action("Draft nuanced responses", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    logo: "GeminiLogo",
    category: "AI Models",
    actions: [
      action("Understand multimodal context", "ActionImageIcon"),
      action("Synthesize research", "ActionBrainIcon"),
    ],
  },
  {
    id: "mistral",
    name: "Mistral",
    logo: "MistralLogo",
    category: "AI Models",
    actions: [
      action("Generate concise answers", "ActionSpeakIcon"),
      action("Process business context", "ActionBrainIcon"),
    ],
  },
  {
    id: "claude",
    name: "Claude",
    logo: "ClaudeLogo",
    category: "AI Models",
    actions: [
      action("Reason over long context", "ActionBrainIcon"),
      action("Draft polished documents", "ActionDocumentTextIcon"),
    ],
  },
  {
    id: "cohere",
    name: "Cohere",
    logo: "CohereLogo",
    category: "AI Models",
    actions: [
      action("Classify business text", "ActionListCheckIcon"),
      action("Retrieve relevant context", "ActionMagnifyingGlassIcon"),
    ],
  },
  {
    id: "hugging-face",
    name: "Hugging Face",
    logo: "HuggingFaceLogo",
    category: "AI Models",
    actions: [
      action("Discover specialist models", "ActionMagnifyingGlassIcon"),
      action("Coordinate model workflows", "ActionAtomIcon"),
    ],
  },
  {
    id: "replicate",
    name: "Replicate",
    logo: "ReplicateLogo",
    category: "AI Models",
    actions: [
      action("Run creative models", "ActionImageIcon"),
      action("Automate model pipelines", "ActionAtomIcon"),
    ],
  },
];

export const INTEGRATION_SHOWCASE_ROWS = [
  INTEGRATION_SHOWCASE_ITEMS.slice(0, 22),
  INTEGRATION_SHOWCASE_ITEMS.slice(22, 44),
  INTEGRATION_SHOWCASE_ITEMS.slice(44, 66),
] as const;
