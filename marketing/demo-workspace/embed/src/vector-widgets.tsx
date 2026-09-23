import { useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { DemoScenario } from "../../upstream/app/demo-scenarios";
import { ArtifactTooltip as Tooltip } from "../../upstream/app/artifacts/chart-tooltip";

export interface VectorWidgetProps {
  scenario: DemoScenario;
  platform: "ruby" | "slack" | "teams";
}

function VectorWidgetHeader({
  scenario,
  action,
}: {
  scenario: DemoScenario;
  action?: ReactNode;
}) {
  return (
    <header className="batch-widget-header">
      <strong>{scenario.copy.conversationTitle}</strong>
      {action}
    </header>
  );
}

export function VectorCustomerSetupAgent({ scenario }: VectorWidgetProps) {
  const [replayed, setReplayed] = useState(false);
  return (
    <div
      className="vector-webhook"
      data-widget-state={replayed ? "replayed" : "complete"}
    >
      <VectorWidgetHeader
        scenario={scenario}
        action={
          <span>
            <b className="severity-pill">Customer setup agent</b>
            <button
              type="button"
              data-primary-action
              onClick={() => setReplayed(true)}
            >
              {replayed ? "Replay complete" : "Replay setup"}
            </button>
          </span>
        }
      />
      <div className="webhook-grid">
        <section>
          <small>Customer request</small>
          <pre>{`SIGNED CUSTOMER\n{\n  "account": "Acme",\n  "plan": "Growth",\n  "administrator": "Maya Chen"\n}`}</pre>
        </section>
        <section>
          <small>Workspace created</small>
          <pre>
            {replayed
              ? `200 OK\n{\n  "workspace": "WS-208",\n  "result": "existing workspace returned"\n}`
              : `201 CREATED\n{\n  "workspace": "WS-208",\n  "plan": "Growth",\n  "welcome": "sent"\n}`}
          </pre>
        </section>
      </div>
      <div className="webhook-checks">
        <span className="is-complete">Signed plan verified</span>
        <span className="is-complete">Workspace permissions applied</span>
        <span className="is-complete">
          {replayed
            ? "Replay returned existing workspace"
            : "Welcome email sent"}
        </span>
      </div>
    </div>
  );
}

const isolationFiles = [
  {
    name: "src/tenant-query.ts",
    lines: [
      ["context", "18", "export function buildQuery(input: QueryInput) {"],
      ["added", "19", "+  assertAccountScope(input.accountId)"],
      [
        "added",
        "20",
        "+  return records.where(eq(records.accountId, input.accountId))",
      ],
      ["context", "21", "}"],
    ],
    finding: "Account scope is checked before reading a record.",
  },
  {
    name: "src/export-job.ts",
    lines: [
      ["context", "41", "export async function readResult(jobId: string) {"],
      ["added", "42", "+  assertAccountScope(job.accountId)"],
      ["added", "43", "+  return storage.read(job.outputKey)"],
      ["context", "44", "}"],
    ],
    finding: "Account scope is checked before reading a job result.",
  },
] as const;

export function VectorDataIsolationReview({ scenario }: VectorWidgetProps) {
  const [file, setFile] = useState(0);
  const active = isolationFiles[file];
  return (
    <div className="vector-code-review" data-widget-state={file}>
      <VectorWidgetHeader
        scenario={scenario}
        action={<span className="severity-pill">2 checks fixed</span>}
      />
      <div className="code-review-layout">
        <nav aria-label="Changed files">
          {isolationFiles.map((item, index) => (
            <button
              type="button"
              key={item.name}
              aria-label={`Review ${item.name}`}
              data-primary-action={index === 1 ? "" : undefined}
              className={file === index ? "is-selected" : ""}
              onClick={() => setFile(index)}
            >
              <span>{item.name}</span>
              <small>+2 −0</small>
            </button>
          ))}
        </nav>
        <section>
          <div className="code-file-title">
            <strong>{active.name}</strong>
            <span>PR #842</span>
          </div>
          <pre>
            {active.lines.map(([tone, number, code]) => (
              <code className={`is-${tone}`} key={`${number}-${code}`}>
                <b>{number}</b>
                <span>{code}</span>
              </code>
            ))}
          </pre>
          <p>
            <strong>
              {file === 0 ? "High risk fixed" : "Medium risk fixed"}
            </strong>
            {active.finding}
          </p>
        </section>
      </div>
    </div>
  );
}

const signupSeries = {
  current: [
    { device: "320px", passed: 10 },
    { device: "375px", passed: 11 },
    { device: "414px", passed: 12 },
  ],
  candidate: [
    { device: "320px", passed: 11 },
    { device: "375px", passed: 12 },
    { device: "414px", passed: 12 },
  ],
};

export function VectorMobileSignupExplorer({ scenario }: VectorWidgetProps) {
  const [release, setRelease] = useState<"current" | "candidate">("candidate");
  const isCandidate = release === "candidate";
  return (
    <div className="vector-activation" data-widget-state={release}>
      <VectorWidgetHeader
        scenario={scenario}
        action={
          <div className="batch-tabs">
            <button
              type="button"
              className={!isCandidate ? "is-selected" : ""}
              onClick={() => setRelease("current")}
            >
              Current release
            </button>
            <button
              type="button"
              aria-label="Release candidate"
              data-primary-action
              className={isCandidate ? "is-selected" : ""}
              onClick={() => setRelease("candidate")}
            >
              Release candidate
            </button>
          </div>
        }
      />
      <div className="activation-kpis">
        <span>
          <small>Release</small>
          <strong>{isCandidate ? "v4.8.0" : "v4.7.9"}</strong>
        </span>
        <span>
          <small>Checks</small>
          <strong>
            {isCandidate ? "11 of 12 checks passed" : "12 of 12 checks passed"}
          </strong>
        </span>
        <span>
          <small>Decision</small>
          <strong className={isCandidate ? "is-danger" : "is-positive"}>
            {isCandidate ? "Release held" : "Ready"}
          </strong>
        </span>
      </div>
      <div className="batch-chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 640, height: 210 }}
        >
          <AreaChart
            data={signupSeries[release]}
            margin={{ top: 12, right: 14, left: -22, bottom: 2 }}
          >
            <CartesianGrid vertical={false} opacity={0.12} />
            <XAxis
              dataKey="device"
              tickLine={false}
              axisLine={false}
              fontSize={9}
            />
            <YAxis
              domain={[0, 12]}
              tickLine={false}
              axisLine={false}
              fontSize={9}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="passed"
              name="Checks passed"
              fill="var(--artifact-accent-soft)"
              stroke="var(--artifact-accent)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p>
        {isCandidate
          ? "Release held for one small-screen fix."
          : "Current release passes the recorded signup checks."}
      </p>
    </div>
  );
}

export function VectorDocumentationDriftComparison({
  scenario,
}: VectorWidgetProps) {
  const [accepted, setAccepted] = useState(false);
  return (
    <div
      className="vector-doc-drift"
      data-widget-state={accepted ? "accepted" : "review"}
    >
      <VectorWidgetHeader
        scenario={scenario}
        action={
          <span className={accepted ? "is-positive" : ""}>
            {accepted ? "Documentation updated" : "Correction ready"}
          </span>
        }
      />
      <div className="doc-compare-grid">
        <section>
          <small>Software behavior</small>
          <pre>{`HTTP/1.1 202 Accepted\n{ "status": "queued",\n  "statusUrl": "/exports/1842" }`}</pre>
        </section>
        <section>
          <small>Published guide</small>
          <pre>{`Returns 200 OK\nwhen the export\nis complete.`}</pre>
        </section>
        <section>
          <small>Prepared correction</small>
          <pre>{`Returns 202 Accepted.\nCheck statusUrl until\nthe export is ready.`}</pre>
        </section>
      </div>
      <footer>
        <p>
          The export became asynchronous in the latest release, but two guides
          still describe the retired response.
        </p>
        <button
          type="button"
          data-primary-action
          onClick={() => setAccepted(true)}
        >
          {accepted ? "Accepted" : "Accept correction"}
        </button>
      </footer>
    </div>
  );
}

const spendData = [
  { name: "AI requests", before: 42, after: 31 },
  { name: "Idle environments", before: 18, after: 6 },
  { name: "Duplicate storage", before: 11, after: 7 },
  { name: "Core services", before: 54, after: 54 },
];

export function VectorCloudSpendBreakdown({ scenario }: VectorWidgetProps) {
  const [view, setView] = useState<"before" | "after">("after");
  const key = view === "after" ? "after" : "before";
  const total = spendData.reduce((sum, item) => sum + item[key], 0);
  const chartData = spendData.map((item) => ({
    name: item.name,
    amount: item[key],
  }));
  return (
    <div className="vector-cloud-spend" data-widget-state={view}>
      <VectorWidgetHeader
        scenario={scenario}
        action={
          <div className="batch-tabs">
            <button
              type="button"
              className={view === "before" ? "is-selected" : ""}
              onClick={() => setView("before")}
            >
              Before changes
            </button>
            <button
              type="button"
              aria-label="After changes"
              data-primary-action
              className={view === "after" ? "is-selected" : ""}
              onClick={() => setView("after")}
            >
              After changes
            </button>
          </div>
        }
      />
      <div className="cloud-summary">
        {spendData.map((item) => (
          <article key={item.name}>
            <small>{item.name}</small>
            <strong>${item[key]}k</strong>
            <i style={{ width: `${(item[key] / 54) * 100}%` }} />
          </article>
        ))}
        <article className="is-savings">
          <small>Projected reduction</small>
          <strong>$27k reduction</strong>
        </article>
      </div>
      <div className="batch-chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 640, height: 190 }}
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 12, left: -22, bottom: 0 }}
          >
            <CartesianGrid vertical={false} opacity={0.12} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={8}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={8} />
            <Tooltip />
            <Bar
              dataKey="amount"
              name="Monthly spend"
              fill="var(--artifact-accent)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p>
        <strong>
          ${total}k {view === "after" ? "projected monthly" : "current monthly"}
        </strong>
        <span>Quality and response speed checks passed.</span>
      </p>
    </div>
  );
}

type FeedbackSource = "Zendesk" | "Intercom" | "Test runs";

const feedbackData: Record<
  FeedbackSource,
  Array<[string, string, string, string, string]>
> = {
  Zendesk: [
    [
      "Ticket #1842",
      "Enterprise account",
      "The checkout filter resets after I return to the order list.",
      "High impact",
      "6 replies",
    ],
    [
      "Ticket #1907",
      "Growth account",
      "The mobile size picker covers the Continue button.",
      "Release blocker",
      "4 replies",
    ],
  ],
  Intercom: [
    [
      "Conversation #881",
      "Active customer",
      "Bulk invitations stop after the first invalid address.",
      "High impact",
      "8 messages",
    ],
    [
      "Conversation #904",
      "Trial customer",
      "The export link says it is ready before the file exists.",
      "Needs test",
      "5 messages",
    ],
  ],
  "Test runs": [
    [
      "Reproduction #1",
      "Checkout filter",
      "Failing test reproduces the reset after returning to the list.",
      "Reproduced",
      "Linear candidate",
    ],
    [
      "Reproduction #2",
      "Mobile size picker",
      "Failing test reproduces the covered Continue button at 320px.",
      "Reproduced",
      "Linear candidate",
    ],
  ],
};

export function VectorFeedbackInbox({ scenario }: VectorWidgetProps) {
  const [source, setSource] = useState<FeedbackSource>("Zendesk");
  const [created, setCreated] = useState(false);
  return (
    <div className="vector-feedback" data-widget-state={`${source}-${created}`}>
      <VectorWidgetHeader
        scenario={scenario}
        action={
          <button
            type="button"
            data-primary-action
            onClick={() => setCreated(true)}
          >
            Create Linear issues
          </button>
        }
      />
      <div className="feedback-source-tabs">
        {(Object.keys(feedbackData) as FeedbackSource[]).map((item, index) => (
          <button
            type="button"
            key={item}
            aria-label={item}
            data-primary-action={index === 1 ? "" : undefined}
            className={source === item ? "is-selected" : ""}
            onClick={() => setSource(item)}
          >
            <i
              className={
                item === "Zendesk"
                  ? "fa-solid fa-z"
                  : item === "Intercom"
                    ? "fa-solid fa-message"
                    : "fa-solid fa-flask"
              }
            />
            {item}
          </button>
        ))}
      </div>
      <div className="feedback-layout">
        <section>
          {feedbackData[source].map(([author, place, copy, metric, detail]) => (
            <article key={author}>
              <header>
                <strong>{author}</strong>
                <small>{place}</small>
              </header>
              <p>{copy}</p>
              <footer>
                <span>{metric}</span>
                <span>{detail}</span>
              </footer>
            </article>
          ))}
        </section>
        <aside>
          <strong>Reproduction status</strong>
          <ol>
            <li>
              <span>Reports grouped</span>
              <b>12 → 3</b>
            </li>
            <li>
              <span>Tests reproduced</span>
              <b>2</b>
            </li>
            <li>
              <span>Awaiting browser details</span>
              <b>1</b>
            </li>
          </ol>
          <p>
            {created ? "3 Linear issues created" : "2 reproduced · 1 follow-up"}
          </p>
        </aside>
      </div>
    </div>
  );
}
