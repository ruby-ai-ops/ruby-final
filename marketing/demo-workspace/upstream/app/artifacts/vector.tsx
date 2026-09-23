'use client';

import { useState, type ComponentType } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ArtifactTooltip as Tooltip } from './chart-tooltip';
import type { DemoScenario } from '../demo-scenarios';

export type VectorArtifactProps = { scenario: DemoScenario; platform: 'ruby' | 'slack' | 'teams' };

function Header({ scenario, action }: { scenario: DemoScenario; action?: React.ReactNode }) {
  return <header className="batch-widget-header"><strong>{scenario.copy.conversationTitle}</strong>{action}</header>;
}

const reviewFiles = [
  {
    name: 'src/queue.ts',
    lines: [
      ['context', '41', 'export async function dequeue(config: QueueConfig) {'],
      ['removed', '42', '-  const timeout = config.timeout || 0'],
      ['added', '42', '+  const timeout = config.timeout ?? DEFAULT_TIMEOUT'],
      ['added', '43', '+  await verifyLease(config.queueId, timeout)'],
      ['context', '44', '   return worker.next()'],
    ],
    finding: 'A zero timeout previously skipped lease verification and could dequeue the same job twice.',
  },
  {
    name: 'src/tenant-query.ts',
    lines: [
      ['context', '18', 'export function buildQuery(input: QueryInput) {'],
      ['removed', '19', '-  return db.select().from(events)'],
      ['added', '19', '+  assertTenantScope(input.tenantId)'],
      ['added', '20', '+  return db.select().from(events).where(eq(events.tenantId, input.tenantId))'],
      ['context', '21', '}'],
    ],
    finding: 'The added tenant assertion prevents a cross-workspace read before the query is constructed.',
  },
];

export function PullRequestCodeReview({ scenario }: VectorArtifactProps) {
  const [file, setFile] = useState(0);
  return <div className="vector-code-review" data-widget-state={file}><Header scenario={scenario} action={<span className="severity-pill">2 high · 1 medium</span>} /><div className="code-review-layout"><nav aria-label="Changed files">{reviewFiles.map((item, index) => <button type="button" key={item.name} aria-label={`Review ${item.name}`} data-primary-action={index === 1 ? '' : undefined} className={file === index ? 'is-selected' : ''} onClick={() => setFile(index)}><span>{item.name}</span><small>{index === 0 ? '+2 −1' : '+2 −1'}</small></button>)}</nav><section><div className="code-file-title"><strong>{reviewFiles[file].name}</strong><span>PR #842</span></div><pre>{reviewFiles[file].lines.map(([tone, number, code]) => <code className={`is-${tone}`} key={`${number}-${code}`}><b>{number}</b><span>{code}</span></code>)}</pre><p><strong>{file === 0 ? 'High risk' : 'Medium risk'}</strong>{reviewFiles[file].finding}</p></section></div></div>;
}

const activationSeries = {
  EU: [
    { day: 'Mon', activation: 71, baseline: 72 }, { day: 'Tue', activation: 70, baseline: 72 }, { day: 'Wed', activation: 69, baseline: 71 },
    { day: 'Thu', activation: 48, baseline: 72 }, { day: 'Fri', activation: 44, baseline: 71 }, { day: 'Sat', activation: 46, baseline: 72 },
  ],
  US: [
    { day: 'Mon', activation: 74, baseline: 73 }, { day: 'Tue', activation: 73, baseline: 73 }, { day: 'Wed', activation: 74, baseline: 74 },
    { day: 'Thu', activation: 72, baseline: 73 }, { day: 'Fri', activation: 73, baseline: 73 }, { day: 'Sat', activation: 74, baseline: 74 },
  ],
};

export function ActivationReleaseExplorer({ scenario }: VectorArtifactProps) {
  const [region, setRegion] = useState<'EU' | 'US'>('EU');
  return <div className="vector-activation" data-widget-state={region}><Header scenario={scenario} action={<div className="batch-tabs"><button type="button" className={region === 'EU' ? 'is-selected' : ''} onClick={() => setRegion('EU')}>EU activation</button><button type="button" aria-label="US baseline" data-primary-action className={region === 'US' ? 'is-selected' : ''} onClick={() => setRegion('US')}>US baseline</button></div>} /><div className="activation-kpis"><span><small>Release</small><strong>v4.7.2</strong></span><span><small>Affected devices</small><strong>320px mobile</strong></span><span><small>Activation change</small><strong className={region === 'EU' ? 'is-danger' : 'is-positive'}>{region === 'EU' ? '-38%' : '+1%'}</strong></span></div><div className="batch-chart"><ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 210 }}><AreaChart data={activationSeries[region]} margin={{ top: 12, right: 14, left: -22, bottom: 2 }}><CartesianGrid vertical={false} opacity={0.12} /><XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={9} /><YAxis domain={[35, 80]} tickLine={false} axisLine={false} fontSize={9} /><Tooltip /><ReferenceLine x="Thu" label="v4.7.2" stroke="var(--artifact-danger)" strokeDasharray="4 3" /><Area type="monotone" dataKey="activation" fill="var(--artifact-accent-soft)" stroke="var(--artifact-accent)" strokeWidth={2} /><Line type="monotone" dataKey="baseline" stroke="var(--artifact-positive)" dot={false} /></AreaChart></ResponsiveContainer></div><p>{region === 'EU' ? 'The 320px size selector stopped emitting size_selected after v4.7.2.' : 'US activation remained stable because the compact checkout drawer was not enabled.'}</p></div>;
}

export function DocumentationDriftComparison({ scenario }: VectorArtifactProps) {
  const [accepted, setAccepted] = useState(false);
  return <div className="vector-doc-drift" data-widget-state={accepted ? 'accepted' : 'review'}><Header scenario={scenario} action={<span className={accepted ? 'is-positive' : ''}>{accepted ? 'Documentation updated' : 'Correction ready'}</span>} /><div className="doc-compare-grid"><section><small>Observed API</small><pre>{`HTTP/1.1 202 Accepted\n{ "status": "queued",\n  "retryAfter": 30 }`}</pre></section><section><small>Published docs</small><pre>{`Returns 200 OK when the\nexport is complete.`}</pre></section><section><small>Proposed correction</small><pre>{`Returns 202 Accepted.\nPoll statusUrl after\nretryAfter seconds.`}</pre></section></div><footer><p>The endpoint became asynchronous in v4.6, but the guide still describes the retired synchronous response.</p><button type="button" data-primary-action aria-label="Accept correction" onClick={() => setAccepted(true)}>{accepted ? 'Accepted' : 'Accept correction'}</button></footer></div>;
}

const spendCurrent = [
  { name: 'GPU inference', current: 42, optimized: 31 }, { name: 'Idle clusters', current: 18, optimized: 6 },
  { name: 'Duplicate retention', current: 11, optimized: 7 }, { name: 'Core workloads', current: 54, optimized: 54 },
];

export function CloudSpendBreakdown({ scenario }: VectorArtifactProps) {
  const [optimized, setOptimized] = useState(false);
  const total = spendCurrent.reduce((sum, item) => sum + (optimized ? item.optimized : item.current), 0);
  return <div className="vector-cloud-spend" data-widget-state={optimized ? 'optimized' : 'current'}><Header scenario={scenario} action={<div className="batch-tabs"><button type="button" className={!optimized ? 'is-selected' : ''} onClick={() => setOptimized(false)}>Current</button><button type="button" aria-label="Optimized" data-primary-action className={optimized ? 'is-selected' : ''} onClick={() => setOptimized(true)}>Optimized</button></div>} /><div className="cloud-summary">{spendCurrent.map((item) => <article key={item.name}><small>{item.name}</small><strong>${optimized ? item.optimized : item.current}k</strong><i style={{ width: `${(optimized ? item.optimized : item.current) / 54 * 100}%` }} /></article>)}<article className="is-savings"><small>Projected savings</small><strong>{optimized ? '$27k saved' : '$27k available'}</strong></article></div><div className="batch-chart"><ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 190 }}><BarChart data={spendCurrent} margin={{ top: 10, right: 12, left: -22, bottom: 0 }}><CartesianGrid vertical={false} opacity={0.12} /><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={8} /><YAxis tickLine={false} axisLine={false} fontSize={8} /><Tooltip /><Legend /><Bar dataKey={optimized ? 'optimized' : 'current'} name={optimized ? 'Optimized spend' : 'Current spend'} fill="var(--artifact-accent)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div><p><strong>${total}k monthly</strong><span>Owners and savings actions are assigned.</span></p></div>;
}

const feedbackPosts = {
  Reddit: [
    ['u/parcelpilot', 'r/ecommerce', 'The checkout redesign looks cleaner, but saved addresses now take three taps.', '428', '96'],
    ['u/smallbatchsam', 'r/startups', 'Please bring back bulk selection in the order list. We use it every morning.', '211', '43'],
  ],
  Zendesk: [
    ['Ticket #1842', 'Enterprise account', 'Bulk selection disappeared after the redesign and our team is losing twenty minutes per shift.', 'P1', '14 replies'],
    ['Ticket #1907', 'Growth plan', 'Saved address editing is buried on mobile.', 'P2', '6 replies'],
  ],
  Intercom: [
    ['Conversation #881', 'Active customer', 'I expected the filter to stay when I came back to orders.', 'High intent', '8 messages'],
    ['Conversation #904', 'Trial user', 'The size picker covers the checkout button on my phone.', 'Blocked', '5 messages'],
  ],
};

export function FeedbackInbox({ scenario }: VectorArtifactProps) {
  const [source, setSource] = useState<keyof typeof feedbackPosts>('Reddit');
  const [created, setCreated] = useState(false);
  return <div className="vector-feedback" data-widget-state={`${source}-${created}`}><Header scenario={scenario} action={<button type="button" onClick={() => setCreated(true)}>Create Productboard items</button>} /><div className="feedback-source-tabs">{(Object.keys(feedbackPosts) as Array<keyof typeof feedbackPosts>).map((item, index) => <button type="button" key={item} aria-label={`${item} feedback`} data-primary-action={index === 1 ? '' : undefined} className={source === item ? 'is-selected' : ''} onClick={() => setSource(item)}><i className={item === 'Reddit' ? 'fa-brands fa-reddit' : item === 'Zendesk' ? 'fa-solid fa-z' : 'fa-solid fa-message'} />{item}</button>)}</div><div className="feedback-layout"><section>{feedbackPosts[source].map(([author, place, text, votes, comments]) => <article key={author}><header><strong>{author}</strong><small>{place}</small></header><p>{text}</p><footer><span>▲ {votes}</span><span>◯ {comments}</span></footer></article>)}</section><aside><strong>Ranked themes</strong><ol><li><span>Bulk actions</span><b>38%</b></li><li><span>Saved addresses</span><b>27%</b></li><li><span>Persistent filters</span><b>19%</b></li></ol><p>{created ? '3 Productboard items created' : '3 themes ready for Productboard'}</p></aside></div></div>;
}

export function WebhookPlayground({ scenario }: VectorArtifactProps) {
  const [ran, setRan] = useState(false);
  return <div className="vector-webhook" data-widget-state={ran ? 'complete' : 'ready'}><Header scenario={scenario} action={<button type="button" data-primary-action onClick={() => setRan(true)}>Run test</button>} /><div className="webhook-grid"><section><small>Incoming request</small><pre>{`POST /support/events\n{\n  "type": "ticket.updated",\n  "priority": "urgent",\n  "customerId": "cus_1842"\n}`}</pre></section><section><small>Normalized response</small><pre>{ran ? `200 OK\n{\n  "event": "support.ticket.updated",\n  "severity": "high",\n  "customer": "cus_1842"\n}` : 'Run the deterministic sample to validate the response.'}</pre></section></div><div className="webhook-checks"><span className={ran ? 'is-complete' : ''}>Schema validated</span><span className={ran ? 'is-complete' : ''}>Signature verified</span><span className={ran ? 'is-complete' : ''}>{ran ? 'Delivered to Supabase' : 'Awaiting delivery'}</span></div></div>;
}

const vectorComponents: Array<ComponentType<VectorArtifactProps>> = [PullRequestCodeReview, ActivationReleaseExplorer, DocumentationDriftComparison, CloudSpendBreakdown, FeedbackInbox, WebhookPlayground];
for (const component of vectorComponents) component.displayName = component.name;
