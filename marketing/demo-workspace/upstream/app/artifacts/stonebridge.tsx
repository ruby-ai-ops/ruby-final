'use client';

import { useState, type ComponentType } from 'react';
import type { DemoScenario } from '../demo-scenarios';

export type StonebridgeArtifactProps = { scenario: DemoScenario; platform: 'ruby' | 'slack' | 'teams' };

function Header({ scenario, action }: { scenario: DemoScenario; action?: React.ReactNode }) {
  return <header className="batch-widget-header"><strong>{scenario.copy.conversationTitle}</strong>{action}</header>;
}

const siteRisks = [
  { zone: 'Loading bay', issue: 'Unprotected delivery edge', severity: 'Critical', owner: 'Atlas Scaffolding', due: '10:30 AM', x: 78, y: 68 },
  { zone: 'Tower crane', issue: 'Wind limit approaching', severity: 'Critical', owner: 'Riverside Crane Co.', due: '11:00 AM', x: 47, y: 28 },
  { zone: 'Level 4 housekeeping', issue: 'Access route obstruction', severity: 'Medium', owner: 'North Core Crew', due: '1:00 PM', x: 24, y: 49 },
  { zone: 'South hoist', issue: 'Inspection tag expires today', severity: 'Medium', owner: 'Metro Lift', due: '3:30 PM', x: 65, y: 43 },
];

export function SiteSafetyPlan({ scenario }: StonebridgeArtifactProps) {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [selected, setSelected] = useState(0);
  const visible = siteRisks.filter((risk) => !criticalOnly || risk.severity === 'Critical');
  const active = siteRisks[selected];
  return <div className="stone-site-safety" data-widget-state={`${criticalOnly}-${selected}`}><Header scenario={scenario} action={<div className="batch-tabs"><button type="button" className={!criticalOnly ? 'is-selected' : ''} onClick={() => setCriticalOnly(false)}>All risks</button><button type="button" aria-label="Critical risks" data-primary-action className={criticalOnly ? 'is-selected' : ''} onClick={() => { setCriticalOnly(true); setSelected(0); }}>Critical risks</button></div>} /><div className="site-safety-layout"><div className="site-plan" aria-label="Riverside site risk plan"><span className="site-building is-west">West tower</span><span className="site-building is-east">East tower</span><span className="site-road">Delivery road</span>{visible.map((risk) => { const index = siteRisks.indexOf(risk); return <button type="button" key={risk.zone} aria-label={`Inspect ${risk.zone}`} className={`${risk.severity === 'Critical' ? 'is-critical ' : ''}${selected === index ? 'is-selected' : ''}`} style={{ left: `${risk.x}%`, top: `${risk.y}%` }} onClick={() => setSelected(index)}><i className="fa-solid fa-triangle-exclamation" /></button>; })}</div><aside><small>{active.severity} risk</small><strong>{active.zone}</strong><p>{active.issue}</p><dl><div><dt>Contractor</dt><dd>{active.owner}</dd></div><div><dt>Due</dt><dd>{active.due}</dd></div></dl></aside></div><div className="site-risk-list">{visible.map((risk) => <span key={risk.zone}><b>{risk.zone}</b><small>{risk.owner}</small><em className={risk.severity === 'Critical' ? 'is-danger' : ''}>{risk.severity}</em></span>)}</div></div>;
}

export function ConcreteCostCalculator({ scenario }: StonebridgeArtifactProps) {
  const [volume, setVolume] = useState(1200);
  const [price, setPrice] = useState(185);
  const material = volume * price;
  const waste = Math.round(material * 0.047);
  const overtime = 23800;
  const changeOrders = 41000;
  const forecast = material + waste + overtime + changeOrders;
  const budget = 248000;
  const currency = (value: number) => `$${Math.round(value / 1000)}k`;
  return <div className="stone-concrete-cost" data-widget-state={`${volume}-${price}`}><Header scenario={scenario} action={<span className="cost-variance">{currency(forecast - budget)} over budget</span>} /><div className="cost-summary"><span><small>Budget</small><strong>{currency(budget)}</strong></span><span><small>Committed</small><strong>$276k</strong></span><span><small>Forecast</small><strong data-testid="concrete-forecast">{currency(forecast)}</strong></span></div><div className="cost-controls"><label>Concrete volume <strong>{volume.toLocaleString()} m³</strong><input aria-label="Concrete volume" data-primary-action type="range" min="950" max="1500" step="25" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label><label>Unit price <strong>${price}/m³</strong><input aria-label="Concrete unit price" type="range" min="160" max="220" step="5" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label></div><div className="cost-breakdown"><span><b>Ready-mix concrete</b><em>{currency(material)}</em><i style={{ width: '72%' }} /></span><span><b>Waste allowance</b><em>{currency(waste)}</em><i style={{ width: '18%' }} /></span><span><b>Overtime</b><em>{currency(overtime)}</em><i style={{ width: '26%' }} /></span><span><b>Change orders</b><em>{currency(changeOrders)}</em><i style={{ width: '39%' }} /></span></div></div>;
}

const ownerSections = {
  Overview: <div className="owner-overview"><strong>72% complete</strong><span>Structure and envelope remain on the recovered path.</span><div><i style={{ width: '72%' }} /></div><ul><li>East tower topped out</li><li>Envelope 64% installed</li><li>Commissioning starts Nov 11</li></ul></div>,
  Budget: <div className="owner-budget"><strong>$18.4M forecast</strong><span>$0.3M above the approved control budget</span><dl><div><dt>Committed</dt><dd>$17.8M</dd></div><div><dt>Contingency</dt><dd>$0.9M</dd></div><div><dt>Remaining risk</dt><dd>$0.4M</dd></div></dl></div>,
  Decisions: <div className="owner-decisions"><strong>2 decisions required</strong><span>Glazing alternate · Due Friday</span><span>Lobby stone sample · Due Monday</span><small>Neither decision changes the owner handover date today.</small></div>,
};

export function RiversideOwnerBrief({ scenario }: StonebridgeArtifactProps) {
  const [section, setSection] = useState<keyof typeof ownerSections>('Overview');
  return <div className="stone-owner-brief" data-widget-state={section}><Header scenario={scenario} action={<span>Handover · Dec 12</span>} /><nav aria-label="Owner report sections">{(Object.keys(ownerSections) as Array<keyof typeof ownerSections>).map((item) => <button type="button" key={item} data-primary-action={item === 'Budget' ? '' : undefined} className={section === item ? 'is-selected' : ''} aria-label={item} onClick={() => setSection(item)}>{item}</button>)}</nav><section>{ownerSections[section]}</section></div>;
}

const stonebridgeComponents: Array<ComponentType<StonebridgeArtifactProps>> = [SiteSafetyPlan, ConcreteCostCalculator, RiversideOwnerBrief];
for (const component of stonebridgeComponents) component.displayName = component.name;
