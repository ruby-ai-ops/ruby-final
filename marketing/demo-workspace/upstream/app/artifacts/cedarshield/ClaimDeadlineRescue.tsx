'use client';
import { useState } from 'react';
import { Badge, Fact, Metric, Pick, Source, WidgetHeader, type WidgetProps } from '../workspace-primitives';
import { deadlineClaims } from './fixtures';

type Band = 'All' | 'Under 24 hours' | '24–72 hours';
export function ClaimDeadlineRescue({ scenario }: WidgetProps) {
  const [band, setBand] = useState<Band>('All');
  const [selected, setSelected] = useState('CL-5902');
  const [reassigned, setReassigned] = useState<string[]>([]);
  const visible = deadlineClaims.filter((claim) => band === 'All' || (band === 'Under 24 hours' ? claim.hours < 24 : claim.hours >= 24));
  const active = deadlineClaims.find((claim) => claim.id === selected) ?? visible[0];
  const isAchievable = active.achievable || reassigned.includes(active.id);
  const achievableCount = deadlineClaims.filter((claim) => claim.achievable || reassigned.includes(claim.id)).length;
  return <div className="rw cs-deadline" data-widget-state={`${band}-${selected}-${reassigned.join()}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Deadline rescue · Next 72 hours"><Badge tone={achievableCount === deadlineClaims.length ? 'good' : 'risk'}>{achievableCount} of {deadlineClaims.length} achievable</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Claims in window" value={deadlineClaims.length}/><Metric label="Under 24 hours" value={deadlineClaims.filter((claim) => claim.hours < 24).length}/><Metric label="Commitments protected" value={achievableCount}/></div>
    <div className="rw-tabs">{(['All', 'Under 24 hours', '24–72 hours'] as Band[]).map((item, index) => <Pick key={item} primary={index === 1} selected={band === item} onClick={() => setBand(item)}>{item}</Pick>)}</div>
    <section className="cs-deadline-lanes">{visible.map((claim) => <Pick key={claim.id} selected={active.id === claim.id} onClick={() => setSelected(claim.id)}><span><strong>{claim.id}</strong><small>{claim.work}</small></span><span className="cs-time-track"><i style={{ width: `${Math.max(8, 100 - claim.hours)}%` }}/><b>{claim.hours}h remaining</b></span><Badge tone={claim.achievable || reassigned.includes(claim.id) ? 'good' : 'risk'}>{claim.achievable || reassigned.includes(claim.id) ? 'Achievable' : 'At risk'}</Badge></Pick>)}</section>
    <section className="cs-rescue-proposal"><div><h4>{active.id} capacity move</h4><p>{active.proposed}</p><div className="rw-flex"><Fact label="Current owner">{active.owner}</Fact><Fact label="Open workload">{active.ownerLoad} active items</Fact></div></div><button type="button" className="rw-action" disabled={isAchievable} onClick={() => setReassigned((items) => [...items, active.id])}>{isAchievable ? 'Commitment achievable' : 'Apply reassignment'}</button></section>
    <Source>Claims deadline register · Workload snapshot 9:15 AM · Rescue owner: Sasha Green</Source>
  </div>;
}
ClaimDeadlineRescue.displayName = 'ClaimDeadlineRescue';
