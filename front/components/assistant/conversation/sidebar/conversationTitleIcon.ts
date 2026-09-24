import {
  Bank,
  BarChart01,
  BarLineChart,
  BookOpen01,
  CalendarCheck01,
  Clipboard,
  Code01,
  CodeBrowser,
  CurrencyDollarCircle,
  Dataflow01,
  FolderTable,
  GitBranch01,
  Globe01,
  GraduationHat01,
  Image01,
  Lightbulb01,
  Mail01,
  MessageChatCircle,
  MessageChatSquare,
  MessageQuestionCircle,
  MessageTextCircle01,
  Palette,
  PlaneTakeoff,
  Route,
  SearchMd,
  Settings02,
  ShieldTick,
  Table,
  Terminal,
  ThumbsUp,
  Users01,
  UsersPlus,
} from "@ruby-ai/ui";

// Specific titles come first so, for example, a sales dashboard keeps its
// sales icon and a forecast does not get the generic revenue icon.
const TITLE_ICON_RULES = [
  {
    pattern: /\b(?:excel|xlsx?|spreadsheet|spread sheets?|google sheets?)\b/i,
    icon: Table,
  },
  { pattern: /\b(?:csv|tsv)\b/i, icon: FolderTable },
  { pattern: /\b(?:data entry|enter data|form filling)\b/i, icon: Clipboard },
  {
    pattern: /\b(?:forecasts?|forecasting|projections?)\b/i,
    icon: BarLineChart,
  },
  {
    pattern: /\b(?:sales|revenue|pricing|deals?|profits?|quotas?)\b/i,
    icon: CurrencyDollarCircle,
  },
  {
    pattern: /\b(?:linkedin|linked in|outreach|prospects?|lead generation)\b/i,
    icon: UsersPlus,
  },
  { pattern: /\b(?:customers?|clients?|crm)\b/i, icon: Users01 },
  {
    pattern:
      /\b(?:charts?|graphs?|dashboards?|analytics|metrics?|kpis?|performance)\b/i,
    icon: BarChart01,
  },
  {
    pattern: /\b(?:repositories|repository|repos?|git|github|gitlab)\b/i,
    icon: GitBranch01,
  },
  { pattern: /\b(?:browsers?|chrome|firefox)\b/i, icon: CodeBrowser },
  {
    pattern: /\b(?:websites?|webpages?|landing pages?|domains?)\b/i,
    icon: Globe01,
  },
  { pattern: /\b(?:scripts?|terminal|shell|command line)\b/i, icon: Terminal },
  {
    pattern:
      /\b(?:code|coding|programming|typescript|javascript|python|apis?|bugs?|debugging)\b/i,
    icon: Code01,
  },
  {
    pattern: /\b(?:research|investigations?|search|sources?)\b/i,
    icon: SearchMd,
  },
  {
    pattern: /\b(?:clarify|clarification|questions?|why)\b/i,
    icon: MessageQuestionCircle,
  },
  {
    pattern: /\b(?:explain|explanation|understand|how does)\b/i,
    icon: Lightbulb01,
  },
  {
    pattern: /\b(?:documentation|docs?|guides?|manuals?)\b/i,
    icon: BookOpen01,
  },
  {
    pattern: /\b(?:automations?|automate|workflows?|triggers?)\b/i,
    icon: Dataflow01,
  },
  {
    pattern: /\b(?:schedules?|deadlines?|calendars?|reminders?)\b/i,
    icon: CalendarCheck01,
  },
  {
    pattern:
      /\b(?:design|themes?|colors?|palette|branding|fonts?|creative|ui|ux)\b/i,
    icon: Palette,
  },
  {
    pattern: /\b(?:images?|photos?|illustrations?|graphics?)\b/i,
    icon: Image01,
  },
  { pattern: /\b(?:emails?|gmail|inbox|newsletters?)\b/i, icon: Mail01 },
  {
    pattern: /\b(?:slack|microsoft teams|team chat)\b/i,
    icon: MessageChatSquare,
  },
  {
    pattern: /\b(?:messages?|chats?|replies|reply)\b/i,
    icon: MessageChatCircle,
  },
  { pattern: /\b(?:feedback|reviews?)\b/i, icon: ThumbsUp },
  {
    pattern: /\b(?:logistics|deliveries|shipping|supply chain)\b/i,
    icon: Route,
  },
  { pattern: /\b(?:operations?|processes?)\b/i, icon: Settings02 },
  { pattern: /\b(?:teams?|staff|employees?|hiring)\b/i, icon: Users01 },
  {
    pattern: /\b(?:security|privacy|compliance|authentication|permissions?)\b/i,
    icon: ShieldTick,
  },
  {
    pattern: /\b(?:finance|billing|budgets?|invoices?|expenses?)\b/i,
    icon: Bank,
  },
  {
    pattern: /\b(?:travel|trips?|flights?|destinations?)\b/i,
    icon: PlaneTakeoff,
  },
  {
    pattern: /\b(?:education|learning|courses?|lessons?|schools?|students?)\b/i,
    icon: GraduationHat01,
  },
] as const;

/**
 * @cc [owner:ruby-ai,label:product] conversation-icons-from-title
 * Sidebar conversation icons depend only on the display title and fixed rule
 * order. Empty or unmatched titles use the neutral message icon.
 */
export function getConversationTitleIcon(title: string | null) {
  const match = TITLE_ICON_RULES.find(({ pattern }) =>
    pattern.test(title ?? "")
  );
  return match?.icon ?? MessageTextCircle01;
}
