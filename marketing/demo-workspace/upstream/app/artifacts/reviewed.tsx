'use client';

/* oxlint-disable next/no-img-element -- demo personas use curated remote fixture portraits. */

import { useState, type ComponentType } from 'react';
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceLine,
  ResponsiveContainer, XAxis, YAxis,
} from 'recharts';
import { ArtifactTooltip as Tooltip } from './chart-tooltip';
import { getPerson, type DemoScenario } from '../demo-scenarios';
import { RichText } from '../rich-text';
import { ArtifactMediaCard, type ArtifactMedia } from './media-card';

export type ReviewedArtifactProps = { scenario: DemoScenario; platform: 'ruby' | 'slack' | 'teams' };

function titleFor(scenario: DemoScenario) {
  return <header className="reviewed-widget-header"><strong>{scenario.copy.conversationTitle}</strong></header>;
}

export function StaticCompletionSummary({ scenario }: ReviewedArtifactProps) {
  return <div className="reviewed-completion-strip" data-widget-state="3/3">{titleFor(scenario)}<span className="reviewed-count">3/3</span><div>{scenario.artifact.rows.map((row, index) => <article key={row.label}><i>{index + 1}</i><span><strong><RichText text={row.label} /></strong><small><RichText text={row.value} /></small></span><b>Complete</b></article>)}</div></div>;
}

const freightLanes = [
  { lane: 'Chicago to Detroit', planned: 2.21, actual: 2.63, driver: 'Fuel surcharge', detail: '+$0.31 per mile from the Thursday fuel reset.' },
  { lane: 'Dallas to Austin', planned: 1.84, actual: 2.02, driver: 'Detention', detail: '+$0.18 per mile from two dock holds.' },
  { lane: 'Atlanta to Nashville', planned: 2.09, actual: 1.98, driver: 'Consolidation', detail: '-$0.11 per mile after combining partial loads.' },
];

export function FreightLaneVarianceChart({ scenario }: ReviewedArtifactProps) {
  const [lane, setLane] = useState(0);
  return <div className="reviewed-freight-chart" data-widget-state={lane}>{titleFor(scenario)}<div className="reviewed-lane-tabs">{freightLanes.map((item, index) => <button key={item.lane} type="button" data-primary-action={index === 1 ? '' : undefined} className={lane === index ? 'is-selected' : ''} aria-label={`Show ${item.lane}`} onClick={() => setLane(index)}>{item.lane}</button>)}</div><div className="reviewed-chart-canvas"><ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 210 }}><BarChart data={freightLanes} layout="vertical" margin={{ top: 8, right: 18, left: 32, bottom: 4 }}><CartesianGrid horizontal={false} opacity={0.12} /><XAxis type="number" domain={[0, 3]} tickLine={false} axisLine={false} fontSize={9} unit="$" /><YAxis type="category" dataKey="lane" hide /><Tooltip formatter={(value) => [`$${Number(value).toFixed(2)} / mile`]} /><Legend /><Bar dataKey="planned" name="Planned" fill="var(--artifact-positive)" radius={3} /><Bar dataKey="actual" name="Actual" fill="var(--artifact-accent)" radius={3} /></BarChart></ResponsiveContainer></div><div className="reviewed-decision"><strong>{freightLanes[lane].driver}</strong><span>{freightLanes[lane].detail}</span></div></div>;
}

const dockEvents = [
  { time: '1:42 AM', title: 'Dock controls went offline', detail: 'Doors 4 through 8 stopped reporting trailer positions.', source: 'ServiceNow INC-2841', image: '/demo-logistics/dock-controls.webp', alt: 'Dock controls failure evidence', impact: '5 doors offline', decision: 'Manual trailer checks started' },
  { time: '2:05 AM', title: 'Eleven loads were exposed', detail: 'Four customer commitments were inside the next six hours.', source: 'Fathom shift call', image: '/demo-logistics/dock-controls.webp', alt: 'Exposed dock loads evidence', impact: '11 loads exposed', decision: 'Priority sequence locked' },
  { time: '2:18 AM', title: 'Inbound freight moved to Dock C', detail: 'The dispatch team protected all priority loads without overtime.', source: 'Slack incident room', image: '/demo-logistics/dock-reroute.webp', alt: 'Dock C reroute evidence', impact: 'Priority loads protected', decision: 'Inbound freight moved to Dock C' },
  { time: '3:10 AM', title: 'Customer update published', detail: 'Statuspage confirmed recovery and the revised arrival windows.', source: 'Statuspage update', image: '/demo-logistics/dock-recovery.webp', alt: 'Recovered loading bay evidence', impact: 'All doors reporting', decision: 'Revised arrival windows published' },
];

export function DockIncidentChronology({ scenario }: ReviewedArtifactProps) {
  const [event, setEvent] = useState(0);
  const active = dockEvents[event];
  return <div className="reviewed-chronology" data-widget-state={event}>{titleFor(scenario)}<div className="dock-incident-layout"><section>{dockEvents.map((item, index) => <button key={item.time} type="button" data-primary-action={index === 1 ? '' : undefined} className={event === index ? 'is-selected' : ''} onClick={() => setEvent(index)}><time>{item.time}</time><span><strong>{item.title}</strong><small>{item.detail}</small>{event === index && <em>{item.source}</em>}</span></button>)}</section><aside className="dock-evidence"><img src={active.image} alt={active.alt} onError={(error) => error.currentTarget.classList.add('is-missing')} /><div><small>Selected evidence</small><strong>{active.impact}</strong><span>{active.decision}</span><em>{active.source}</em></div></aside></div></div>;
}

const depots = [
  { name: 'Oak Park', values: [72, 84, 91, 88, 76] },
  { name: 'Cicero', values: [65, 79, 86, 94, 82] },
  { name: 'Elmhurst', values: [58, 67, 74, 81, 69] },
];

export function DepotCapacityMatrix({ scenario }: ReviewedArtifactProps) {
  const [cell, setCell] = useState([0, 2]);
  const value = depots[cell[0]].values[cell[1]];
  return <div className="reviewed-capacity" data-widget-state={cell.join('-')}>{titleFor(scenario)}<div className="capacity-grid"><span /><>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => <strong key={day}>{day}</strong>)}</>{depots.map((depot, row) => <div className="capacity-row" key={depot.name}><b>{depot.name}</b>{depot.values.map((amount, column) => <button key={column} type="button" data-primary-action={row === 1 && column === 3 ? '' : undefined} className={`${cell[0] === row && cell[1] === column ? 'is-selected ' : ''}${amount >= 90 ? 'is-danger' : 'is-available'}`} onClick={() => setCell([row, column])}>{amount}%</button>)}</div>)}</div><p><strong>{depots[cell[0]].name}</strong> has {100 - value}% capacity remaining. {value >= 90 ? 'Promotion volume must move to Elmhurst.' : 'The promotion can be accepted here.'}</p></div>;
}

export function DeltaOnboardingReadiness({ scenario }: ReviewedArtifactProps) {
  const [resolved, setResolved] = useState(false);
  const checks = [
    ['Operating authority', 'Verified'], ['Safety packet', 'Approved'], ['Insurance certificate', resolved ? 'Received' : 'Missing'], ['EDI test', 'Passed'],
  ];
  const launchMedia: ArtifactMedia[] = [
    { src: '/demo-logistics/delta-tractor.webp', alt: 'Delta Freight tractor ready for launch', title: 'Launch tractor', metadata: ['Unit DF-210', 'Safety inspection passed'], tone: 'success' },
    { src: '/demo-logistics/delta-route-aerial.webp', alt: 'Chicago to Detroit Delta Freight route', title: 'Primary corridor', metadata: ['Chicago to Detroit', '286 miles · I-90'], tone: 'neutral' },
    { src: '/demo-logistics/delta-dock-handoff.webp', alt: 'Delta Freight Dock C handoff', title: 'Dock handoff', metadata: ['Dock C', 'EDI test passed'], tone: 'success' },
  ];
  return <div className="delta-launch-experience" data-widget-state={resolved ? '100' : '82'}><div className="delta-launch-media">{launchMedia.map((media) => <ArtifactMediaCard media={media} key={media.title} />)}</div><div className="reviewed-readiness">{titleFor(scenario)}<div className="readiness-score"><strong>{resolved ? '100%' : '82%'}</strong><span>{resolved ? 'Ready to launch' : 'One blocker remains'}</span></div><div className="readiness-checks">{checks.map(([label, status]) => <span key={label} className={status === 'Missing' ? 'is-danger' : 'is-complete'}><i /> <b>{label}</b><em>{status}</em></span>)}</div><button type="button" data-primary-action onClick={() => setResolved(true)} disabled={resolved}>{resolved ? 'Insurance received' : 'Mark insurance received'}</button></div></div>;
}

const contractClauses = [
  { title: 'Section 12.4 · Liability cap', changed: true, risk: 'High', before: 'Supplier’s aggregate liability shall not exceed fees paid in the preceding 30 days.', after: 'Supplier’s aggregate liability shall not exceed fees paid in the preceding 12 months, excluding confidentiality, data-protection, and IP indemnity obligations.', citation: 'Supplier Agreement · page 18' },
  { title: 'Section 8.2 · Security notice', changed: true, risk: 'Medium', before: 'Supplier will notify Customer of a security event without undue delay.', after: 'Supplier will notify Customer within 24 hours of discovering a security event and provide daily updates until containment.', citation: 'Data Protection Addendum · page 7' },
  { title: 'Section 4.2 · Notices', changed: false, risk: 'Low', before: 'Notices must be delivered to the addresses in Schedule A.', after: 'Notices must be delivered to the addresses in Schedule A.', citation: 'Supplier Agreement · page 6' },
];

export function SupplierClauseRedline({ scenario }: ReviewedArtifactProps) {
  const [changedOnly, setChangedOnly] = useState(false);
  const visible = contractClauses.filter((clause) => !changedOnly || clause.changed);
  return <div className="reviewed-redline" data-widget-state={changedOnly ? 'changed' : 'all'}><header><strong>{scenario.copy.conversationTitle}</strong><button type="button" data-primary-action onClick={() => setChangedOnly(!changedOnly)}>{changedOnly ? 'Show all clauses' : 'Show changes only'}</button></header>{visible.map((clause) => <article key={clause.title}><div><strong>{clause.title}</strong><em className={`risk-${clause.risk.toLowerCase()}`}>{clause.risk} risk</em><small>{clause.citation}</small></div><section><p className="is-removed"><b>Removed</b>{clause.before}</p><p className="is-added"><b>Approved</b>{clause.after}</p></section></article>)}</div>;
}

export function GreenlineSignatureFlow({ scenario }: ReviewedArtifactProps) {
  const [approved, setApproved] = useState(false);
  return <div className="reviewed-signature" data-widget-state={approved ? 'approved' : 'review'}>{titleFor(scenario)}<div className="signature-person"><img src={getPerson('eva-morales').avatar} alt="Eva Morales" /><span><strong>Eva Morales</strong><small>Review owner · Greenline NDA</small></span><em>{approved ? 'Approved' : 'Ready for review'}</em></div><div className="signature-steps"><p><i /> Correct mutual NDA template selected</p><p><i /> Signer: Jordan Lee, Greenline CFO</p><p><i /> Consultation: Monday at 10:30 AM</p></div><button type="button" data-primary-action onClick={() => setApproved(true)}>{approved ? 'Approved for signature' : 'Approve and send'}</button></div>;
}

const dawsonEvents = [
  ['Feb 3, 2026', 'Breach notice received', 'Dawson email · page 1'],
  ['Feb 7, 2026', 'Delivery confirmation recorded', 'Carrier receipt · exhibit B'],
  ['Mar 1, 2026', 'Cure period expired', 'Supplier agreement §9.3'],
  ['Mar 4, 2026', 'Termination letter approved', 'Matter memo · page 12'],
];

export function DawsonChronology({ scenario }: ReviewedArtifactProps) {
  const [event, setEvent] = useState(0);
  return <div className="reviewed-dawson" data-widget-state={event}>{titleFor(scenario)}<ol>{dawsonEvents.map(([date, title, source], index) => <li key={date}><button type="button" data-primary-action={index === 1 ? '' : undefined} className={event === index ? 'is-selected' : ''} onClick={() => setEvent(index)}><time>{date}</time><span><strong>{title}</strong><small>{source}</small>{event === index && <em>Evidence verified and linked to the matter record.</em>}</span></button></li>)}</ol></div>;
}

const precedents = [
  { matter: 'Atlas / Northwind', cap: '12 months fees', exclusions: 'IP, privacy, fraud', law: 'New York', citation: '§11.2 · 2025' },
  { matter: 'Orion / Westmere', cap: '2× annual fees', exclusions: 'Security, indemnity', law: 'Delaware', citation: '§14.6 · 2024' },
  { matter: 'Halcyon / Ridge', cap: '$2.5M', exclusions: 'Confidentiality, fraud', law: 'California', citation: '§9.4 · 2025' },
];

export function PrecedentComparison({ scenario }: ReviewedArtifactProps) {
  const [selected, setSelected] = useState(0);
  return <div className="reviewed-precedent" data-widget-state={selected}>{titleFor(scenario)}<div className="precedent-table"><div className="precedent-header"><b>Matter</b><b>Cap</b><b>Exclusions</b><b>Law</b></div>{precedents.map((row, index) => <button type="button" key={row.matter} aria-pressed={selected === index} data-primary-action={index === 1 ? '' : undefined} className={`precedent-row ${selected === index ? 'is-selected' : ''}`} onClick={() => setSelected(index)}><strong data-label="Matter">{row.matter}<small>{row.citation}</small></strong><span data-label="Cap">{row.cap}</span><span data-label="Exclusions">{row.exclusions}</span><span data-label="Law">{row.law}</span></button>)}</div><blockquote>Recommended language: Liability is capped at {precedents[selected].cap}, excluding {precedents[selected].exclusions.toLowerCase()}.</blockquote></div>;
}

export function PartnerBookingPanel({ scenario }: ReviewedArtifactProps) {
  const [slot, setSlot] = useState('Tue 2:30 PM');
  const slots = ['Tue 2:30 PM', 'Wed 11:00 AM', 'Thu 4:00 PM'];
  return <div className="reviewed-partner" data-widget-state={slot}>{titleFor(scenario)}<div className="partner-intake"><span><small>Inquiry</small><strong>Halcyon data licensing dispute</strong></span><span><small>Jurisdiction</small><strong>Delaware</strong></span><span><small>Conflict check</small><strong className="is-clear">Clear</strong></span></div><div className="partner-match"><img src={getPerson('eva-morales').avatar} alt="Eva Morales" /><span><strong>Eva Morales</strong><small>Privacy · Commercial disputes · 94% match</small></span></div><div className="partner-slots">{slots.map((item, index) => <button type="button" key={item} data-primary-action={index === 1 ? '' : undefined} className={slot === item ? 'is-selected' : ''} onClick={() => setSlot(item)}>{item}</button>)}</div><p>Consultation held for {slot}.</p></div>;
}

const lawyers = [
  ['Eva Morales', 'Privacy · Fintech', 68, 12], ['Daniel Brooks', 'Commercial · Board', 91, 4], ['Priya Rao', 'Privacy · Contracts', 74, 9],
];

export function OrionStaffingMatrix({ scenario }: ReviewedArtifactProps) {
  const [lawyer, setLawyer] = useState(0);
  return <div className="reviewed-staffing" data-widget-state={lawyer}>{titleFor(scenario)}<div className="staffing-head"><span>Lawyer</span><span>Skill match</span><span>Utilization</span><span>Available</span></div>{lawyers.map(([name, skills, utilization, hours], index) => <button type="button" key={String(name)} data-lawyer={name} data-primary-action={index === 2 ? '' : undefined} className={`reviewed-staffing-row ${lawyer === index ? 'is-selected' : ''}`} onClick={() => setLawyer(index)}><span data-label="Lawyer"><img src={getPerson(String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-')).avatar} alt="" /><strong>{name}</strong></span><span data-label="Skill match">{skills}</span><span data-label="Utilization"><i style={{ width: `${utilization}%` }} />{utilization}%</span><b data-label="Available">{hours}h</b></button>)}<p>{lawyers[lawyer][0]} has the strongest balance of privacy experience and available capacity.</p></div>;
}

const certificateSuppliers = [
  { supplier: 'Meadow West Creamery', certificate: 'SQF certificate', expiry: 'Expired Aug 31', owner: 'Sofia Alvarez', due: 'Due Sep 5', source: 'Vanta evidence record', history: 'Request sent September 2. Supplier confirmed the renewal audit is complete.' },
  { supplier: 'Prairie Cultures', certificate: 'Allergen control certificate', expiry: 'Expired Sep 1', owner: 'Lena Ortiz', due: 'Due Sep 6', source: 'Google Drive evidence folder', history: 'Request sent September 3. Upload reminder delivered September 4.' },
  { supplier: 'North Ridge Packaging', certificate: 'Food-contact declaration', expiry: 'Expired Aug 29', owner: 'Sofia Alvarez', due: 'Due Sep 5', source: 'OneDrive supplier folder', history: 'Request sent September 1. Quality owner escalated the missing declaration.' },
];

export function CertificateRenewalCards({ scenario }: ReviewedArtifactProps) {
  const [selected, setSelected] = useState(0);
  const [received, setReceived] = useState<number[]>([]);
  const active = certificateSuppliers[selected];
  const activeReceived = received.includes(selected);
  return <div className="certificate-renewal-cards" data-widget-state={`${selected}-${received.join('.')}`}>{titleFor(scenario)}<div className="certificate-card-grid">{certificateSuppliers.map((supplier, index) => <button type="button" key={supplier.supplier} data-testid="certificate-card" data-primary-action={index === 1 ? '' : undefined} className={selected === index ? 'is-selected' : ''} aria-label={`Review ${supplier.supplier} certificate`} onClick={() => setSelected(index)}><i className="fa-solid fa-file-shield" /><span><strong>{supplier.supplier}</strong><small>{supplier.certificate}</small><em>{received.includes(index) ? 'Received' : supplier.expiry}</em></span><b>{supplier.due}</b></button>)}</div><section className="certificate-history"><span><small>Renewal history</small><strong>{active.supplier}</strong><p>{active.history}</p><em>{active.source} · Owner: {active.owner}</em></span><button type="button" aria-label={`Mark ${active.supplier} certificate received`} disabled={activeReceived} onClick={() => setReceived((current) => [...current, selected])}>{activeReceived ? 'Received' : 'Mark received'}</button></section></div>;
}

const invoiceRows = [
  ['INV-2841', 'Duplicate research entry', '$1,240', 'Needs attention'],
  ['INV-2848', 'Outside agreed scope', '$860', 'Needs attention'],
  ['INV-2852', 'Partner review', '$2,100', 'Completed'],
  ['INV-2859', 'Filing fee evidence', '$430', 'Completed'],
];

export function InvoiceAnomalyTable({ scenario }: ReviewedArtifactProps) {
  const [filter, setFilter] = useState('All');
  const visible = invoiceRows.filter((row) => filter === 'All' || row[3] === filter);
  return <div className="reviewed-invoice" data-widget-state={filter}><header><strong>{scenario.copy.conversationTitle}</strong><span>{['Needs attention', 'Completed', 'All'].map((item) => <button type="button" key={item} data-primary-action={item === 'Needs attention' ? '' : undefined} className={filter === item ? 'is-selected' : ''} onClick={() => setFilter(item)}>{item}</button>)}</span></header><div className="invoice-head"><b>Entry</b><b>Finding</b><b>Amount</b><b>Status</b></div>{visible.map((row) => <div data-testid="invoice-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><em className={row[3] === 'Needs attention' ? 'is-danger' : 'is-complete'}>{row[3]}</em></div>)}<p>{visible.length} entries shown</p></div>;
}

const deliveries = [
  { id: 'DL-204', city: 'Madison', breach: '27 min', peak: '7.2°C', query: 'Madison Wisconsin', values: [3.1, 3.4, 4.2, 5.8, 7.2, 4.7] },
  { id: 'DL-219', city: 'Milwaukee', breach: '14 min', peak: '6.1°C', query: 'Milwaukee Wisconsin', values: [3.0, 3.2, 3.8, 5.1, 6.1, 4.1] },
  { id: 'DL-227', city: 'Green Bay', breach: '9 min', peak: '5.4°C', query: 'Green Bay Wisconsin', values: [2.9, 3.1, 3.6, 4.8, 5.4, 3.9] },
];

export function ColdChainDeliveryExplorer({ scenario }: ReviewedArtifactProps) {
  const [delivery, setDelivery] = useState(0);
  const active = deliveries[delivery];
  const data = active.values.map((temperature, index) => ({ time: `${8 + index}:00`, temperature }));
  return <div className="reviewed-cold-chain" data-widget-state={delivery}>{titleFor(scenario)}<div className="cold-chain-tabs">{deliveries.map((item, index) => <button type="button" key={item.id} data-primary-action={index === 1 ? '' : undefined} className={delivery === index ? 'is-selected' : ''} onClick={() => setDelivery(index)}><strong>{item.id}</strong><small>{item.city}</small></button>)}</div><div className="cold-chain-grid"><iframe title="Wisconsin cold-chain route" src={`https://www.google.com/maps?q=${encodeURIComponent(active.query)}&z=10&output=embed`} /><div><ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 360, height: 180 }}><LineChart data={data} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}><CartesianGrid vertical={false} opacity={0.12} /><XAxis dataKey="time" tickLine={false} fontSize={8} /><YAxis tickLine={false} fontSize={8} unit="°" /><ReferenceLine y={4} stroke="var(--artifact-danger)" strokeDasharray="4 3" /><Tooltip /><Line type="monotone" dataKey="temperature" stroke="var(--artifact-accent)" strokeWidth={2} dot /></LineChart></ResponsiveContainer></div></div><p><strong>{active.peak} peak</strong><span>{active.breach} above 4°C</span><span>Customer hold placed and replacement assigned.</span></p></div>;
}

const lineageStages = [
  ['Supplier lot', 'MILK-9A · Meadow West'], ['Pasteurizer run', 'P-184 · Line 2'], ['Packaging batches', 'PK-771, PK-772'], ['Customer orders', '14 orders · 3 customers'],
];

export function LotLineageTrace({ scenario }: ReviewedArtifactProps) {
  const [stage, setStage] = useState(0);
  const affectedProducts: ArtifactMedia[] = [
    { src: '/demo-dairy/whole-milk.webp', alt: 'Affected Whole Milk 1 L', title: 'Whole Milk 1 L', metadata: ['PK-771', '1,420 units · 8 orders · 2 customers', 'Customer hold active'], tone: 'risk' },
    { src: '/demo-dairy/chocolate-milk.webp', alt: 'Affected Chocolate Milk 500 mL', title: 'Chocolate Milk 500 mL', metadata: ['PK-772', '860 units · 6 orders · 1 customer', 'Customer hold active'], tone: 'risk' },
  ];
  return <div className="reviewed-lineage" data-widget-state={stage}>{titleFor(scenario)}<div className="lineage-flow">{lineageStages.map(([label, value], index) => <button type="button" key={label} data-primary-action={index === 2 ? '' : undefined} className={stage === index ? 'is-selected' : ''} onClick={() => setStage(index)}><i>{index + 1}</i><span><small>{label}</small><strong>{value}</strong></span>{index < lineageStages.length - 1 && <b>→</b>}</button>)}</div><div className="lineage-products">{affectedProducts.map((media) => <ArtifactMediaCard media={media} key={media.title} />)}</div><div className="lineage-detail"><strong>{lineageStages[stage][0]}</strong><span>{lineageStages[stage][1]}</span><small>Verified against Snowflake, NetSuite, and the production workbook.</small></div></div>;
}

const energyPlants = {
  'Plant A': [{ name: 'Refrigeration', value: 18 }, { name: 'CIP heating', value: 9 }, { name: 'Peak demand', value: 12 }, { name: 'Schedule recovery', value: -7 }, { name: 'Compressors', value: -5 }],
  'Plant B': [{ name: 'Refrigeration', value: 42 }, { name: 'CIP heating', value: 18 }, { name: 'Peak demand', value: 26 }, { name: 'Schedule recovery', value: -11 }, { name: 'Compressors', value: -8 }],
  'Plant C': [{ name: 'Refrigeration', value: 16 }, { name: 'CIP heating', value: 7 }, { name: 'Peak demand', value: 11 }, { name: 'Schedule recovery', value: -9 }, { name: 'Compressors', value: -6 }],
};

export function PlantEnergyVariance({ scenario }: ReviewedArtifactProps) {
  const [plant, setPlant] = useState<keyof typeof energyPlants>('Plant B');
  const data = energyPlants[plant].map((item) => ({ ...item, increase: item.value > 0 ? item.value : 0, saving: item.value < 0 ? Math.abs(item.value) : 0 }));
  return <div className="reviewed-energy" data-widget-state={plant}>{titleFor(scenario)}<div className="energy-summary"><span><small>Plan</small><strong>$184k</strong></span><span><small>Actual</small><strong>$251k</strong></span><span><small>Variance</small><strong className="is-danger">+$67k</strong></span><div>{(Object.keys(energyPlants) as Array<keyof typeof energyPlants>).map((item) => <button type="button" key={item} data-primary-action={item === 'Plant C' ? '' : undefined} className={plant === item ? 'is-selected' : ''} onClick={() => setPlant(item)}>{item}</button>)}</div></div><div className="reviewed-chart-canvas"><ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 220 }}><BarChart data={data} layout="vertical" margin={{ top: 8, right: 18, left: 72, bottom: 4 }}><CartesianGrid horizontal={false} opacity={0.12} /><XAxis type="number" tickLine={false} axisLine={false} fontSize={8} unit="k" /><YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={70} fontSize={9} /><Tooltip formatter={(value) => [`$${Number(value)}k`]} /><Legend /><Bar dataKey="increase" name="Added cost" fill="var(--artifact-danger)" radius={3} /><Bar dataKey="saving" name="Savings" fill="var(--artifact-positive)" radius={3} /></BarChart></ResponsiveContainer></div></div>;
}

const named: Array<ComponentType<ReviewedArtifactProps>> = [
  StaticCompletionSummary, FreightLaneVarianceChart, DockIncidentChronology, DepotCapacityMatrix,
  DeltaOnboardingReadiness, SupplierClauseRedline, GreenlineSignatureFlow, DawsonChronology,
  PrecedentComparison, PartnerBookingPanel, OrionStaffingMatrix, InvoiceAnomalyTable,
  ColdChainDeliveryExplorer, LotLineageTrace, PlantEnergyVariance, CertificateRenewalCards,
];

for (const component of named) component.displayName = component.name;
