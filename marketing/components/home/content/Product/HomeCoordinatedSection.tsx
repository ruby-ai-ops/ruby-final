import { H2, P } from "@marketing/components/home/ContentComponents";
import { HomeReveal } from "@marketing/components/home/content/Product/HomeReveal";
import {
  CONTEXT_ACTIONS,
  CONTEXT_BOARD_CLASS,
  CONTEXT_FLOW_DASH_OFFSET,
  CONTEXT_FLOW_DASH_PATTERN,
  CONTEXT_SECTION_LABEL_CLASS,
  CONTEXT_SOURCES,
} from "@marketing/components/home/content/Product/homeContextFlowData";
import {
  ResourceAvatar,
  getIcon,
} from "@marketing/components/resources/resources_icons";
import { RubyLogoSquare } from "@ruby-ai/ui";

const CONTEXT_FLOW_CSS = `
@keyframes home-context-flow-dash {
  to { stroke-dashoffset: ${CONTEXT_FLOW_DASH_OFFSET}; }
}
.home-context-flow-base {
  opacity: 0.42;
}
.home-context-flow-line {
  animation: home-context-flow-dash 3.4s linear infinite;
  will-change: stroke-dashoffset;
}
@media (prefers-reduced-motion: reduce) {
  .home-context-flow-line { display: none; animation: none; }
}
`;

const CONTEXT_FLOW_PATHS = [
  ...[84, 215, 346].map((y) => ({
    id: `source-${y}`,
    d: `M230 ${y} C350 ${y}, 360 215, 470 215`,
    color: "rgba(91,141,196,0.46)",
  })),
  ...[84, 215, 346].map((y) => ({
    id: `action-${y}`,
    d: `M530 215 C640 215, 650 ${y}, 770 ${y}`,
    color: "rgba(117,112,176,0.42)",
  })),
];

function ContextNode({
  label,
  description,
  icon,
  align,
}: {
  label: string;
  description: string;
  icon: Parameters<typeof getIcon>[0];
  align: "source" | "action";
}) {
  const NodeIcon = getIcon(icon);

  return (
    <div
      className={`relative z-10 flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white/95 p-3.5 shadow-[0_14px_35px_-24px_rgba(15,23,42,0.45)] backdrop-blur-sm ${
        align === "action" ? "lg:flex-row-reverse lg:text-right" : ""
      }`}
    >
      <ResourceAvatar icon={NodeIcon} size="sm" backgroundColor="bg-white" />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        <div className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
}

export function HomeCoordinatedSection() {
  return (
    <section className="w-full bg-background py-14 lg:py-24">
      <style dangerouslySetInnerHTML={{ __html: CONTEXT_FLOW_CSS }} />
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <HomeReveal>
            <H2 className="max-w-[720px] text-balance font-semibold leading-[1.04] tracking-[-0.035em] text-foreground">
              Your company&apos;s knowledge, deeply understood and actioned on
            </H2>
          </HomeReveal>
          <HomeReveal delay={80}>
            <P
              size="sm"
              className="max-w-[480px] leading-[1.65] text-muted-foreground lg:pb-1"
            >
              Any tool can pull from Slack or your CRM. Ruby goes further – with
              a semantic layer that synthesizes your company&apos;s knowledge so
              agents don&apos;t just retrieve information – they understand it.
            </P>
          </HomeReveal>
        </div>

        <HomeReveal variant="photo" delay={120}>
          <div className={CONTEXT_BOARD_CLASS}>
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/20 blur-3xl" />

            <svg
              aria-hidden="true"
              viewBox="0 0 1000 430"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-10 hidden h-[calc(100%-5rem)] w-[calc(100%-5rem)] lg:block"
            >
              <g fill="none" strokeLinecap="round" strokeWidth="2">
                {CONTEXT_FLOW_PATHS.map((path, index) => (
                  <g key={path.id}>
                    <path
                      d={path.d}
                      stroke={path.color}
                      strokeWidth="1.25"
                      className="home-context-flow-base"
                    />
                    <path
                      d={path.d}
                      stroke={path.color}
                      strokeDasharray={CONTEXT_FLOW_DASH_PATTERN}
                      className="home-context-flow-line"
                      style={{ animationDelay: `${index * -0.38}s` }}
                    />
                  </g>
                ))}
              </g>
            </svg>

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_0.75fr_1fr] lg:gap-16">
              <div className="relative flex flex-col gap-3">
                <div className={CONTEXT_SECTION_LABEL_CLASS}>
                  Company context
                </div>
                {CONTEXT_SOURCES.map((source) => (
                  <ContextNode key={source.label} {...source} align="source" />
                ))}
              </div>

              <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="relative flex h-40 w-40 items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
                  <div className="absolute inset-0 rounded-full border border-blue-200/80 bg-white/50 shadow-[0_0_0_18px_rgba(219,234,254,0.38)]" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-blue-200 bg-white shadow-[0_20px_50px_-20px_rgba(37,99,235,0.5)]">
                    <RubyLogoSquare className="h-11 w-11" />
                  </div>
                </div>
                <div className="home-context-copy mt-5 lg:absolute lg:left-1/2 lg:top-[calc(50%+96px)] lg:mt-0 lg:w-64 lg:-translate-x-1/2">
                  <div className="text-base font-semibold text-foreground">
                    Ruby context layer
                  </div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">
                    Understands relationships,
                    <br /> intent, and history
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col gap-3">
                <div className={`${CONTEXT_SECTION_LABEL_CLASS} lg:text-right`}>
                  Coordinated actions
                </div>
                {CONTEXT_ACTIONS.map((action) => (
                  <ContextNode key={action.label} {...action} align="action" />
                ))}
              </div>
            </div>
          </div>
        </HomeReveal>
      </div>
    </section>
  );
}
