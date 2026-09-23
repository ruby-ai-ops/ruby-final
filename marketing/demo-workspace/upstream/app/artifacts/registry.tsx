'use client';

/* oxlint-disable next/no-img-element -- local generated media and canonical demo portraits. */

import { Fragment, useState, type ComponentType, type CSSProperties } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { ArtifactTooltip as Tooltip } from './chart-tooltip';
import { getPerson, scenarioLibrary, type DemoScenario } from '../demo-scenarios';
import { runsToText } from '../conversation-content';
import { RichText } from '../rich-text';
import {
  ColdChainDeliveryExplorer,
  CertificateRenewalCards,
  DawsonChronology,
  DeltaOnboardingReadiness,
  DepotCapacityMatrix,
  DockIncidentChronology,
  FreightLaneVarianceChart,
  GreenlineSignatureFlow,
  InvoiceAnomalyTable,
  LotLineageTrace,
  OrionStaffingMatrix,
  PartnerBookingPanel,
  PlantEnergyVariance,
  PrecedentComparison,
  StaticCompletionSummary,
  SupplierClauseRedline,
} from './reviewed';
import {
  ActivationReleaseExplorer,
  CloudSpendBreakdown,
  DocumentationDriftComparison,
  FeedbackInbox,
  PullRequestCodeReview,
  WebhookPlayground,
} from './vector';
import { ConcreteCostCalculator, RiversideOwnerBrief, SiteSafetyPlan } from './stonebridge';
import { CartRecoveryCalculator, SupportBacklogWorkbench, CampaignSpendControl, CompetitorPriceMonitor, RetentionCohortExplorer, CreatorEventCommandCenter, CommerceReviewDashboard } from './cartly';
import {ReferralDocumentIntake,AppointmentGapMatcher,ClinicalCoverageBalancer,EquipmentServiceImpact,ClinicalAuditReadiness,ClinicThroughputExplorer,HealthOperationsBoardBrief} from './harborview';
import {PropertyViewingMatchmaker,MaintenanceDispatchDesk,LeaseRenewalPlanner,BuildingHealthAtlas,ListingConversionStudio,ElevatorQuoteNormalizer,InspectionPhotoReview,LakesideOwnerStatement} from './keyline';
import {
  CandidateEvidenceComparison,
  CandidateWaitingRoom,
  FirstWeekOnboardingHub,
  JobPublicationStudio,
  OfferPackageBuilder,
  PanelOverlapScheduler,
  WorkforceGapPlanner,
} from './talentspring';
import {
  BrokerCallCoaching,
  CatastropheOperationsMap,
  ClaimDeadlineRescue,
  ClaimEvidenceConnections,
  ClaimsProcessControlGate,
  ClientRiskServiceReview,
  CoverageChangeComparator,
  StormClaimAssignment,
} from './cedarshield';
import {
  CloseDependencyPath,
  CloudChargebackLedger,
  ExpenseReceiptInspector,
  FinancialAuditEvidenceIndex,
  FinancialBoardStatements,
  PayableDuplicateReview,
  RevenueSettlementReconciler,
  ThirteenWeekCashModel,
} from './ledger';
import {
  DenimReturnPareto,
  FlagshipLaunchRoom,
  LinenCampaignStudio,
  SocialContentPlanner,
  StockTransferShop,
  StoreShiftPlanner,
} from './loom';

export type ArtifactPlatform = 'ruby' | 'slack' | 'teams';
export type ArtifactComponentProps = { scenario: DemoScenario; platform: ArtifactPlatform };

const chartVariants = /pareto|treemap|dashboard|deadline-chart|capacity/;
const timelineVariants = /timeline|chronology|journey|flow|schedule|cadence|onboarding|critical-path|dependency/;
const compareVariants = /review|ledger/;
const documentVariants = /brief|memo|binder|packet|policy|citations|digest/;
const mapVariants = /map-route|temperature-map|site-risk-map|inventory-map|viewing-map|maintenance-map|claims-map|catastrophe-map/;
const networkVariants = /network|lineage|root-cause|clusters|tree/;
const consoleVariants = /console|query-plan/;
const boardVariants = /intake|maintenance-board|recall-command|release-builder|meeting-actions|launch-room|creator-event|quality-decisions|close-board|onboarding-board|campaign-portfolio|matter-staffing|themes|overview/;
const heatmapVariants = /heatmap/;
const scatterVariants = /scatter/;
const waterfallVariants = /waterfall/;
const funnelVariants = /funnel|activation-chart/;
const calendarVariants = /calendar|availability/;
const deckVariants = /slides|deck|report|board-pack|commerce-review/;
const diffVariants = /diff|listing-compare|policy-comparison|duplicate-match|precedent-compare|price-matrix/;
const matrixVariants = /matrix|scorecard|readiness|coverage-grid|certificate-ledger/;
const queueVariants = /queue|pipeline|aging/;
const floorVariants = /floor|inspection-view|building-timeline/;
const approvalVariants = /approval|hiring-decision|signature-flow|offer-packet/;
const galleryVariants = /preview|content-calendar|campaign-launch/;
const calculatorVariants = /forecast/;

function seedData(scenario: DemoScenario, alternate = false) {
  return scenario.artifact.series.map((value, index) => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    value: alternate ? Math.max(18, value - 14 + index * 3) : value,
    target: Math.max(22, value - 9),
  }));
}

function MapWidget({ scenario }: ArtifactComponentProps) {
  const routes = ['Fastest', 'Lowest risk', 'Least overtime'];
  const [route, setRoute] = useState(routes[0]);
  const [mapFailed, setMapFailed] = useState(false);
  const isFleet = scenario.id === 'everglade-sla-risk-command';
  const fleetRoads: Record<string, string> = {
    Fastest: 'Interstate 90 Chicago Illinois',
    'Lowest risk': 'Interstate 294 Chicago Illinois',
    'Least overtime': 'Interstate 55 Chicago Illinois',
  };
  const mapQuery = isFleet ? fleetRoads[route] : 'Chicago Illinois';
  const fleetAssignments = [
    { id: 'EG-4821', image: '/demo-logistics/truck-eg-4821.webp', driverId: 'leo-chen', tractor: 'Tractor 317', trailer: '53 ft dry van', corridor: 'I-90 · Chicago to Detroit', eta: '3:42 PM', drive: '7h 10m remaining', status: 'On time' },
    { id: 'EG-4828', image: '/demo-logistics/truck-eg-4828.webp', driverId: 'nora-patel', tractor: 'Tractor 228', trailer: 'Refrigerated trailer', corridor: 'I-294 · Cicero bypass', eta: '5:18 PM', drive: '4h 55m remaining', status: 'Rerouted' },
    { id: 'EG-4835', image: '/demo-logistics/truck-eg-4835.webp', driverId: 'owen-brooks', tractor: 'Tractor 409', trailer: 'Urban box truck', corridor: 'I-55 · Chicago south', eta: '4:06 PM', drive: '5h 35m remaining', status: 'On time' },
  ];

  return (
    <div className="bespoke-map-widget" data-widget-state={route}>
      <div className="bespoke-map-toolbar">
        <strong>{isFleet ? 'Live fleet recovery' : scenario.copy.conversationTitle}</strong>
        <span>{route}</span>
      </div>
      <div className="bespoke-map-grid">
        {mapFailed ? (
          <div className="bespoke-map-fallback"><strong>Map unavailable</strong><span>The route comparison and assignments are still available.</span></div>
        ) : (
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=10&output=embed`}
            title={isFleet ? 'Google Maps fleet traffic' : `${scenario.copy.conversationTitle} map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => setMapFailed(true)}
            onErrorCapture={() => setMapFailed(true)}
          />
        )}
        <div className="bespoke-map-routes">
          {routes.map((item, index) => (
            <button key={item} type="button" data-primary-action={index === 1 ? '' : undefined} className={`${route === item ? 'is-selected ' : ''}${index === 2 ? 'is-danger' : ''}`} onClick={() => setRoute(item)}>
              <span><i className={index === 0 ? 'is-success' : index === 1 ? 'is-info' : 'is-danger'} />{item}</span>
              <strong>{18 + index * 4} min</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="bespoke-assignment-table">
        <header><span>Assignment</span><span>Owner</span><span>Status</span></header>
        {scenario.artifact.rows.map((row, index) => (
          <div key={row.label}><span><RichText text={isFleet ? `EG-${4821 + index * 7}` : row.label} /></span><strong><RichText text={index === 0 ? scenario.owner : row.value} /></strong><em className={index === 1 ? 'is-danger' : ''}>{index === 1 ? 'Rerouted' : 'On time'}</em></div>
        ))}
      </div>
      {isFleet && <div className="fleet-assignment-cards">{fleetAssignments.map((assignment) => { const driver = getPerson(assignment.driverId); return <article key={assignment.id}><img className="fleet-truck-image" src={assignment.image} alt={`${assignment.id} assigned truck`} onError={(event) => event.currentTarget.classList.add('is-missing')} /><div><header><span><strong>{assignment.id}</strong><small>{assignment.tractor} · {assignment.trailer}</small></span><em className={assignment.status === 'Rerouted' ? 'is-danger' : ''}>{assignment.status}</em></header><span className="fleet-driver"><img src={driver.avatar} alt={driver.name} /><b>{driver.name}</b></span><p>{assignment.corridor}</p><footer><span><small>ETA</small><b>{assignment.eta}</b></span><span><small>Drive time</small><b>{assignment.drive}</b></span></footer></div></article>; })}</div>}
    </div>
  );
}

function ChartWidget({ scenario }: ArtifactComponentProps) {
  const [range, setRange] = useState<'This week' | 'Last week'>('This week');
  const data = seedData(scenario, range === 'Last week');
  const isArea = /forecast|retention|capacity/.test(scenario.artifact.variant);

  return (
    <div className="bespoke-chart-widget" data-widget-state={range}>
      <header><span><strong>{scenario.copy.conversationTitle}</strong><small>{scenario.artifact.interaction}</small></span><span className="artifact-segments">{(['This week', 'Last week'] as const).map((item, index) => <button key={item} type="button" data-primary-action={index === 1 ? '' : undefined} className={range === item ? 'is-selected' : ''} onClick={() => setRange(item)}>{item}</button>)}</span></header>
      <div className="bespoke-chart-canvas">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 180 }}>
          {isArea ? (
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -26, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={9} />
              <YAxis tickLine={false} axisLine={false} fontSize={9} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="var(--artifact-accent)" fill="var(--artifact-accent-soft)" strokeWidth={2} />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 8, left: -26, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={9} />
              <YAxis tickLine={false} axisLine={false} fontSize={9} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--artifact-accent)" radius={[3, 3, 0, 0]} maxBarSize={24} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <p><strong>Decision:</strong> <RichText text={scenario.artifact.rows[0].label} /></p>
    </div>
  );
}

function TimelineWidget({ scenario }: ArtifactComponentProps) {
  const [step, setStep] = useState(0);
  return (
    <div className="bespoke-timeline-widget" data-widget-state={step}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span>{step + 1} of {scenario.artifact.rows.length}</span></header>
      <div className="bespoke-timeline-steps">
        {scenario.artifact.rows.map((row, index) => (
          <button key={row.label} type="button" data-primary-action={index === 1 ? '' : undefined} className={step === index ? 'is-selected' : ''} onClick={() => setStep(index)}><i>{index + 1}</i><span><strong><RichText text={row.label} /></strong><small><RichText text={row.value} /></small></span></button>
        ))}
      </div>
      <p>{scenario.artifact.rows[step].status}: <RichText text={scenario.artifact.rows[step].label} /></p>
    </div>
  );
}

function CompareWidget({ scenario }: ArtifactComponentProps) {
  const filters = ['Needs attention', 'Completed', 'All'];
  const [filter, setFilter] = useState(filters[0]);
  return (
    <div className="bespoke-compare-widget" data-widget-state={filter}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span className="artifact-segments">{filters.map((item, index) => <button key={item} type="button" data-primary-action={index === 1 ? '' : undefined} className={filter === item ? 'is-selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</span></header>
      <div className="bespoke-data-grid">
        <div className="is-heading"><span>Completed work</span><span>System</span><span>Status</span></div>
        {scenario.artifact.rows.map((row, index) => <div key={row.label}><span><RichText text={row.label} /></span><strong><RichText text={row.value} /></strong><em>{filter === 'Needs attention' && index === 1 ? 'Review' : row.status}</em></div>)}
      </div>
    </div>
  );
}

function DocumentWidget({ scenario }: ArtifactComponentProps) {
  const [page, setPage] = useState(0);
  const summaryBlock = scenario.copy.response.find((block) => block.kind === 'paragraph' && block.tone === 'normal');
  const summary = summaryBlock?.kind === 'paragraph' ? runsToText(summaryBlock.content) : scenario.copy.conversationTitle;
  return (
    <div className="bespoke-document-widget" data-widget-state={page}>
      <div className="bespoke-document-page"><small>{scenario.copy.conversationTitle}</small><strong><RichText text={scenario.artifact.rows[page].label} /></strong><p><RichText text={summary} /></p><span><RichText text={scenario.artifact.rows[page].value} /></span></div>
      <div className="bespoke-document-nav"><strong>{/slides|deck/.test(scenario.artifact.variant) ? 'Presentation ready' : 'Final document ready'}</strong>{scenario.artifact.rows.map((row, index) => <button key={row.label} type="button" data-primary-action={index === 1 ? '' : undefined} className={page === index ? 'is-selected' : ''} onClick={() => setPage(index)}>0{index + 1}</button>)}</div>
    </div>
  );
}

function NetworkWidget({ scenario }: ArtifactComponentProps) {
  const [node, setNode] = useState(0);
  return (
    <div className="bespoke-network-widget" data-widget-state={node}>
      <div className="bespoke-network-canvas" aria-label="Connected evidence">
        {scenario.artifact.rows.map((row, index) => <button key={row.label} type="button" data-primary-action={index === 1 ? '' : undefined} className={`network-node node-${index}${node === index ? ' is-selected' : ''}`} onClick={() => setNode(index)}>{index + 1}</button>)}
        <i className="network-link link-one" /><i className="network-link link-two" />
      </div>
      <div className="bespoke-network-detail"><small>Selected evidence</small><strong><RichText text={scenario.artifact.rows[node].label} /></strong><span><RichText text={scenario.artifact.rows[node].value} /></span></div>
    </div>
  );
}

function ConsoleWidget({ scenario }: ArtifactComponentProps) {
  const [ran, setRan] = useState(false);
  return (
    <div className="bespoke-console-widget" data-widget-state={ran ? 'complete' : 'ready'}>
      <header><span><i className="is-red" /><i className="is-amber" /><i className="is-green" /></span><strong>{scenario.copy.conversationTitle}</strong><button type="button" data-primary-action onClick={() => setRan(true)}>{ran ? 'Run complete' : 'Run sample'}</button></header>
      <pre>{ran ? `200 OK\n${scenario.artifact.rows.map((row) => `✓ ${row.label}`).join('\n')}` : `POST /ruby/demo\n{ "scenario": "${scenario.channel}" }`}</pre>
    </div>
  );
}

function BoardWidget({ scenario }: ArtifactComponentProps) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="bespoke-board-widget" data-widget-state={selected}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span>{scenario.artifact.interaction}</span></header>
      <div>{scenario.artifact.rows.map((row, index) => <button key={row.label} type="button" data-primary-action={index === 1 ? '' : undefined} className={selected === index ? 'is-selected' : ''} onClick={() => setSelected(index)}><small>{row.status}</small><strong><RichText text={row.label} /></strong><span><RichText text={row.value} /></span></button>)}</div>
    </div>
  );
}

function HeatmapWidget({ scenario }: ArtifactComponentProps) {
  const [cell, setCell] = useState(6);
  const values = [26, 48, 71, 38, 84, 55, 92, 43, 67, 31, 76, 58, 89, 46, 63];
  return (
    <div className="bespoke-heatmap-widget" data-widget-state={cell}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span>{values[cell]}% utilization</span></header>
      <div className="heatmap-grid" aria-label="Interactive capacity heatmap">
        {values.map((value, index) => <button key={`${value}-${index}`} type="button" data-primary-action={index === 7 ? '' : undefined} className={cell === index ? 'is-selected' : ''} style={{ '--heat': value } as CSSProperties} onClick={() => setCell(index)}><span>{['M', 'T', 'W', 'T', 'F'][index % 5]}</span><strong>{value}</strong></button>)}
      </div>
      <p><RichText text={scenario.artifact.rows[cell % scenario.artifact.rows.length].label} /></p>
    </div>
  );
}

function ScatterWidget({ scenario }: ArtifactComponentProps) {
  const [band, setBand] = useState<'All' | 'High risk'>('All');
  const points = [[18, 72], [31, 42], [46, 66], [61, 28], [72, 81], [85, 53]];
  return (
    <div className="bespoke-scatter-widget" data-widget-state={band}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span className="artifact-segments"><button className={band === 'All' ? 'is-selected' : ''} onClick={() => setBand('All')} type="button">All</button><button data-primary-action className={band === 'High risk' ? 'is-selected' : ''} onClick={() => setBand('High risk')} type="button">High risk</button></span></header>
      <div className="scatter-plot"><i className="scatter-threshold" />{points.map(([x, y], index) => <button aria-label={`Open risk ${index + 1}`} key={x} className={`${band === 'High risk' && y < 55 ? 'is-muted' : ''}${index === 4 ? ' is-selected' : ''}`} style={{ left: `${x}%`, bottom: `${y}%` }} type="button"><span>{index + 1}</span></button>)}</div>
      <p>{band === 'High risk' ? 'Showing only cases above the review threshold.' : 'Every case is shown against value and confidence.'}</p>
    </div>
  );
}

export type WaterfallPoint = {
  name: string;
  base: number;
  amount: number;
  delta: number;
  end: number;
  tone: 'positive' | 'negative';
};

export function buildWaterfallData(values: number[]): WaterfallPoint[] {
  let runningTotal = 0;
  return values.map((delta, index) => {
    const end = runningTotal + delta;
    const point: WaterfallPoint = {
      name: `Step ${index + 1}`,
      base: Math.min(runningTotal, end),
      amount: Math.abs(delta),
      delta,
      end,
      tone: delta < 0 ? 'negative' : 'positive',
    };
    runningTotal = end;
    return point;
  });
}

function WaterfallWidget({ scenario }: ArtifactComponentProps) {
  const [view, setView] = useState<'All lanes' | 'Priority lanes'>('All lanes');
  const changes = view === 'All lanes' ? [42, 18, -11, 26, -8, 17] : [31, -9, 22, -14, 16, 11];
  const data = buildWaterfallData(changes);
  const chartData = data.map((point) => ({
    ...point,
    positiveAmount: point.delta >= 0 ? point.amount : 0,
    negativeAmount: point.delta < 0 ? point.amount : 0,
    positiveDelta: point.delta >= 0 ? point.delta : undefined,
    negativeDelta: point.delta < 0 ? point.delta : undefined,
  }));
  return (
    <div className="bespoke-waterfall-widget" data-widget-state={view}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span className="artifact-segments"><button className={view === 'All lanes' ? 'is-selected' : ''} onClick={() => setView('All lanes')} type="button">All lanes</button><button aria-label="Priority lanes" data-primary-action className={view === 'Priority lanes' ? 'is-selected' : ''} onClick={() => setView('Priority lanes')} type="button">Priority lanes</button></span></header>
      <div className="waterfall-chart" aria-label="Cumulative change chart">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 220 }}>
          <ComposedChart data={chartData} margin={{ top: 24, right: 12, left: -24, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={9} />
            <YAxis tickLine={false} axisLine={false} fontSize={9} />
            <Tooltip formatter={(value, name, item) => name === 'positiveAmount' || name === 'negativeAmount' ? [`${item.payload.delta > 0 ? '+' : ''}${item.payload.delta}`, 'Change'] : [value, name]} />
            <ReferenceLine y={0} stroke="currentColor" opacity={0.42} />
            <Bar dataKey="base" stackId="waterfall" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="positiveAmount" stackId="waterfall" fill="var(--artifact-accent)" radius={[3, 3, 3, 3]} isAnimationActive={false}>
              <LabelList dataKey="positiveDelta" position="top" formatter={(value) => { const numeric = Number(value); return Number.isFinite(numeric) ? `+${numeric}` : ''; }} />
            </Bar>
            <Bar dataKey="negativeAmount" stackId="waterfall" fill="var(--artifact-danger)" radius={[3, 3, 3, 3]} isAnimationActive={false}>
              <LabelList dataKey="negativeDelta" position="top" formatter={(value) => { const numeric = Number(value); return Number.isFinite(numeric) ? String(numeric) : ''; }} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p><RichText text={scenario.artifact.rows[view === 'All lanes' ? 0 : 1].label} /></p>
    </div>
  );
}

function FunnelWidget({ scenario }: ArtifactComponentProps) {
  const [stage, setStage] = useState(0);
  const stages = ['Found', 'Qualified', 'Recovered', 'Confirmed'];
  return (
    <div className="bespoke-funnel-widget" data-widget-state={stage}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span>{[184, 91, 46, 32][stage]} remain</span></header>
      <div className="funnel-stages">{stages.map((label, index) => <button key={label} data-primary-action={index === 2 ? '' : undefined} onClick={() => setStage(index)} type="button" className={stage === index ? 'is-selected' : ''} style={{ width: `${100 - index * 15}%` }}><strong>{[184, 91, 46, 32][index]}</strong><span>{label}</span></button>)}</div>
      <p>{stage === 2 ? 'Ruby has completed the recoverable work.' : scenario.artifact.interaction}</p>
    </div>
  );
}

function CalendarWidget({ scenario }: ArtifactComponentProps) {
  const [slot, setSlot] = useState(4);
  const times = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];
  return (
    <div className="bespoke-calendar-widget" data-widget-state={slot}>
      <div className="calendar-date"><small>MON</small><strong>18</strong><span>Available windows</span></div>
      <div className="calendar-slots">{times.map((time, index) => <button key={time} data-primary-action={index === 2 ? '' : undefined} className={slot === index ? 'is-selected' : ''} onClick={() => setSlot(index)} type="button"><span>{time}</span><small>{index % 2 ? '2 people free' : 'Conflict-free'}</small></button>)}</div>
      <p><strong>{times[slot]} selected.</strong> {scenario.artifact.rows[slot % 3].label}</p>
    </div>
  );
}

function DeckWidget({ scenario }: ArtifactComponentProps) {
  const [slide, setSlide] = useState(0);
  const summaryBlock = scenario.copy.response.find((block) => block.kind === 'paragraph' && block.tone === 'normal');
  const summary = summaryBlock?.kind === 'paragraph' ? runsToText(summaryBlock.content) : scenario.copy.conversationTitle;
  return (
    <div className="bespoke-deck-widget" data-widget-state={slide}>
      <aside>{scenario.artifact.rows.map((row, index) => <button key={row.label} data-primary-action={index === 1 ? '' : undefined} className={slide === index ? 'is-selected' : ''} onClick={() => setSlide(index)} type="button"><span>0{index + 1}</span><small>{row.status}</small></button>)}</aside>
      <section><small>{scenario.copy.conversationTitle}</small><strong><RichText text={scenario.artifact.rows[slide].label} /></strong><div className="deck-mini-chart"><i /><i /><i /><i /></div><p><RichText text={summary} /></p></section>
    </div>
  );
}

function DiffWidget({ scenario }: ArtifactComponentProps) {
  const [changedOnly, setChangedOnly] = useState(false);
  return (
    <div className="bespoke-diff-widget" data-widget-state={changedOnly ? 'changed' : 'all'}>
      <header><strong>{scenario.copy.conversationTitle}</strong><button data-primary-action className={changedOnly ? 'is-selected' : ''} onClick={() => setChangedOnly(!changedOnly)} type="button">{changedOnly ? 'Showing changes' : 'Show changes only'}</button></header>
      <div className="diff-columns"><section><small>BEFORE</small><p className="is-removed">− {scenario.artifact.rows[0].label}</p>{!changedOnly && <p>{scenario.artifact.rows[1].label}</p>}</section><section><small>APPROVED</small><p className="is-added">+ {scenario.artifact.rows[2].label}</p>{!changedOnly && <p><RichText text={scenario.artifact.rows[1].value} /></p>}</section></div>
    </div>
  );
}

function MatrixWidget({ scenario }: ArtifactComponentProps) {
  const [weight, setWeight] = useState(1);
  const headings = ['Speed', 'Risk', 'Value'];
  return (
    <div className="bespoke-matrix-widget" data-widget-state={weight}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span>Weight by {headings[weight]}</span></header>
      <div className="matrix-grid"><div /><>{headings.map((heading, index) => <button key={heading} data-primary-action={index === 2 ? '' : undefined} className={weight === index ? 'is-selected' : ''} onClick={() => setWeight(index)} type="button">{heading}</button>)}</>{scenario.artifact.rows.map((row, rowIndex) => <Fragment key={row.label}><strong>{row.label}</strong>{headings.map((heading, index) => <span key={heading}>{Math.min(99, 64 + rowIndex * 8 + index * 5 + (weight === index ? 7 : 0))}</span>)}</Fragment>)}</div>
    </div>
  );
}

function QueueWidget({ scenario }: ArtifactComponentProps) {
  const [priority, setPriority] = useState(0);
  return (
    <div className="bespoke-queue-widget" data-widget-state={priority}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span>{scenario.artifact.rows.length} ready</span></header>
      {scenario.artifact.rows.map((row, index) => <button key={row.label} data-primary-action={index === 1 ? '' : undefined} onClick={() => setPriority(index)} type="button" className={priority === index ? 'is-selected' : ''}><i>{index + 1}</i><span><strong><RichText text={row.label} /></strong><small><RichText text={row.value} /></small></span><em>{priority === index ? 'Next' : row.status}</em></button>)}
    </div>
  );
}

function FloorWidget({ scenario }: ArtifactComponentProps) {
  const [room, setRoom] = useState(3);
  return (
    <div className="bespoke-floor-widget" data-widget-state={room}>
      <div className="floor-plan">{Array.from({ length: 8 }, (_, index) => <button aria-label={`Inspect area ${index + 1}`} key={index} data-primary-action={index === 5 ? '' : undefined} className={`${room === index ? 'is-selected' : ''}${index === 5 ? ' is-warning' : ''}`} onClick={() => setRoom(index)} type="button"><span>{index + 1}</span></button>)}</div>
      <section><small>AREA {room + 1}</small><strong><RichText text={scenario.artifact.rows[room % 3].label} /></strong><p>{room === 5 ? 'Attention required before the next operating window.' : 'Checked and ready.'}</p></section>
    </div>
  );
}

function ApprovalWidget({ scenario }: ArtifactComponentProps) {
  const [decision, setDecision] = useState<'Reviewing' | 'Approved' | 'Returned'>('Reviewing');
  return (
    <div className="bespoke-approval-widget" data-widget-state={decision}>
      <header><span><small>DECISION READY</small><strong>{scenario.copy.conversationTitle}</strong></span><em>{decision}</em></header>
      <div>{scenario.artifact.rows.map((row) => <p key={row.label}><i className="fa-solid fa-circle-check" /><span><RichText text={row.label} /></span></p>)}</div>
      <footer><button onClick={() => setDecision('Returned')} type="button">Send back</button><button data-primary-action className="is-primary" onClick={() => setDecision('Approved')} type="button">Approve</button></footer>
    </div>
  );
}

function GalleryWidget({ scenario }: ArtifactComponentProps) {
  const [view, setView] = useState(0);
  return (
    <div className="bespoke-gallery-widget" data-widget-state={view}>
      <div className={`gallery-preview gallery-${view}`}><span>{['A', 'B', 'C'][view]}</span><strong>{scenario.copy.conversationTitle}</strong><small>Ready to publish</small></div>
      <aside>{scenario.artifact.rows.map((row, index) => <button aria-label={`Open ${row.value} preview`} key={row.label} data-primary-action={index === 1 ? '' : undefined} className={view === index ? 'is-selected' : ''} onClick={() => setView(index)} type="button"><i /><span><strong><RichText text={row.value} /></strong><small>{row.status}</small></span></button>)}</aside>
    </div>
  );
}

function CalculatorWidget({ scenario }: ArtifactComponentProps) {
  const [caseIndex, setCaseIndex] = useState(1);
  const cases = ['Conservative', 'Expected', 'Protected'];
  return (
    <div className="bespoke-calculator-widget" data-widget-state={caseIndex}>
      <header><strong>{scenario.copy.conversationTitle}</strong><span>{cases[caseIndex]}</span></header>
      <div className="calculator-result"><small>PROJECTED RESULT</small><strong>{[1.8, 2.4, 3.1][caseIndex]}×</strong><span>{[12, 18, 27][caseIndex]} weeks protected</span></div>
      <div className="calculator-options">{cases.map((label, index) => <button key={label} data-primary-action={index === 2 ? '' : undefined} className={caseIndex === index ? 'is-selected' : ''} onClick={() => setCaseIndex(index)} type="button">{label}</button>)}</div>
    </div>
  );
}

function ArtifactBody(props: ArtifactComponentProps) {
  const variant = props.scenario.artifact.variant;
  if (mapVariants.test(variant)) return <MapWidget {...props} />;
  if (heatmapVariants.test(variant)) return <HeatmapWidget {...props} />;
  if (scatterVariants.test(variant)) return <ScatterWidget {...props} />;
  if (waterfallVariants.test(variant)) return <WaterfallWidget {...props} />;
  if (funnelVariants.test(variant)) return <FunnelWidget {...props} />;
  if (calendarVariants.test(variant)) return <CalendarWidget {...props} />;
  if (deckVariants.test(variant)) return <DeckWidget {...props} />;
  if (diffVariants.test(variant)) return <DiffWidget {...props} />;
  if (matrixVariants.test(variant)) return <MatrixWidget {...props} />;
  if (queueVariants.test(variant)) return <QueueWidget {...props} />;
  if (floorVariants.test(variant)) return <FloorWidget {...props} />;
  if (approvalVariants.test(variant)) return <ApprovalWidget {...props} />;
  if (galleryVariants.test(variant)) return <GalleryWidget {...props} />;
  if (calculatorVariants.test(variant)) return <CalculatorWidget {...props} />;
  if (chartVariants.test(variant)) return <ChartWidget {...props} />;
  if (timelineVariants.test(variant)) return <TimelineWidget {...props} />;
  if (consoleVariants.test(variant)) return <ConsoleWidget {...props} />;
  if (compareVariants.test(variant)) return <CompareWidget {...props} />;
  if (documentVariants.test(variant)) return <DocumentWidget {...props} />;
  if (networkVariants.test(variant)) return <NetworkWidget {...props} />;
  if (boardVariants.test(variant)) return <BoardWidget {...props} />;
  throw new Error(`No artifact component for ${variant}`);
}

ArtifactBody.displayName = 'PreservedArtifact';

const reviewedOverrides: Partial<Record<string, ComponentType<ArtifactComponentProps>>> = {
  'everglade-missed-pickup-recovery': StaticCompletionSummary,
  'stonebridge-schedule-recovery': StaticCompletionSummary,
  'everglade-freight-cost-spike': FreightLaneVarianceChart,
  'everglade-warehouse-incident': DockIncidentChronology,
  'everglade-capacity-forecast': DepotCapacityMatrix,
  'everglade-supplier-onboarding': DeltaOnboardingReadiness,
  'northstar-contract-risk-scan': SupplierClauseRedline,
  'northstar-nda-signature-flow': GreenlineSignatureFlow,
  'northstar-litigation-chronology': DawsonChronology,
  'northstar-clause-precedent-finder': PrecedentComparison,
  'northstar-client-intake': PartnerBookingPanel,
  'northstar-matter-staffing': OrionStaffingMatrix,
  'northstar-invoice-review': InvoiceAnomalyTable,
  'meadow-cold-chain-alert': ColdChainDeliveryExplorer,
  'meadow-batch-traceability': LotLineageTrace,
  'meadow-supplier-certificate-audit': CertificateRenewalCards,
  'meadow-energy-cost-review': PlantEnergyVariance,
  'vector-pull-request-review': PullRequestCodeReview,
  'vector-regression-explorer': ActivationReleaseExplorer,
  'vector-documentation-drift': DocumentationDriftComparison,
  'vector-cloud-spend-guard': CloudSpendBreakdown,
  'vector-feedback-signal-map': FeedbackInbox,
  'vector-internal-tool-prototype': WebhookPlayground,
  'stonebridge-site-safety-brief': SiteSafetyPlan,
  'stonebridge-cost-overrun-analysis': ConcreteCostCalculator,
  'stonebridge-client-progress-pack': RiversideOwnerBrief,
  'loom-replenishment-watch': StockTransferShop,
  'loom-campaign-launch': LinenCampaignStudio,
  'loom-returns-diagnosis': DenimReturnPareto,
  'loom-store-staffing': StoreShiftPlanner,
  'loom-product-launch-room': FlagshipLaunchRoom,
  'loom-social-content-board': SocialContentPlanner,
  'cartly-cart-recovery': CartRecoveryCalculator,
  'cartly-support-swarm': SupportBacklogWorkbench,
  'cartly-campaign-roas': CampaignSpendControl,
  'cartly-competitor-price-watch': CompetitorPriceMonitor,
  'cartly-revenue-cohort-explorer': RetentionCohortExplorer,
  'cartly-creator-event-ops': CreatorEventCommandCenter,
  'cartly-commerce-qbr': CommerceReviewDashboard,
  'harborview-referral-intake':ReferralDocumentIntake,
  'harborview-no-show-recovery':AppointmentGapMatcher,
  'harborview-staff-rota':ClinicalCoverageBalancer,
  'harborview-equipment-ticket-triage':EquipmentServiceImpact,
  'harborview-compliance-evidence-pack':ClinicalAuditReadiness,
  'harborview-operations-dashboard':ClinicThroughputExplorer,
  'harborview-board-operations-pack':HealthOperationsBoardBrief,
  'keyline-lead-to-viewing':PropertyViewingMatchmaker,
  'keyline-maintenance-dispatch':MaintenanceDispatchDesk,
  'keyline-lease-renewal-flow':LeaseRenewalPlanner,
  'keyline-portfolio-dashboard':BuildingHealthAtlas,
  'keyline-listing-refresh':ListingConversionStudio,
  'keyline-vendor-quote-review':ElevatorQuoteNormalizer,
  'keyline-inspection-pack':InspectionPhotoReview,
  'keyline-owner-update':LakesideOwnerStatement,
  'talentspring-candidate-shortlist': CandidateEvidenceComparison,
  'talentspring-interview-scheduler': PanelOverlapScheduler,
  'talentspring-job-launch': JobPublicationStudio,
  'talentspring-candidate-experience': CandidateWaitingRoom,
  'talentspring-workforce-capacity': WorkforceGapPlanner,
  'talentspring-offer-packet': OfferPackageBuilder,
  'talentspring-onboarding-launch': FirstWeekOnboardingHub,
  'cedarshield-claim-triage': StormClaimAssignment,
  'cedarshield-fraud-investigation': ClaimEvidenceConnections,
  'cedarshield-policy-comparison': CoverageChangeComparator,
  'cedarshield-compliance-approval': ClaimsProcessControlGate,
  'cedarshield-catastrophe-response': CatastropheOperationsMap,
  'cedarshield-claims-sla-dashboard': ClaimDeadlineRescue,
  'cedarshield-client-qbr': ClientRiskServiceReview,
  'cedarshield-broker-coaching': BrokerCallCoaching,
  'ledger-month-end-command': CloseDependencyPath,
  'ledger-cash-forecast': ThirteenWeekCashModel,
  'ledger-expense-anomaly': ExpenseReceiptInspector,
  'ledger-cloud-cost-allocation': CloudChargebackLedger,
  'ledger-audit-evidence-binder': FinancialAuditEvidenceIndex,
  'ledger-board-reporting': FinancialBoardStatements,
  'ledger-duplicate-ap-detection': PayableDuplicateReview,
  'ledger-revenue-reconciliation': RevenueSettlementReconciler,
};

const scenarios = Object.values(scenarioLibrary)
  .flatMap((workspace) => workspace.scenarios)
  .filter((scenario) => scenario.copy.presentation === 'artifact');

export const artifactRegistry: Record<string, ComponentType<ArtifactComponentProps>> = Object.fromEntries(
  scenarios.map((scenario) => [
    scenario.id,
    reviewedOverrides[scenario.id] ?? ArtifactBody,
  ]),
);

export const artifactComponentNames = Object.values(artifactRegistry).map((component) => component.displayName ?? '');
