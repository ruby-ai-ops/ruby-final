'use client';
import {useState} from 'react';
import type {ArtifactComponentProps} from '../registry';
import {Badge,Metric,Source,WidgetHeader,usd} from '../workspace-primitives';
import {employerCost,offer} from './fixtures';

export function OfferPackageBuilder({scenario}:ArtifactComponentProps){
  const [base,setBase]=useState(offer.base);
  const [start,setStart]=useState(offer.start);
  const [stage,setStage]=useState<'Ready to route'|'Finance review'>('Ready to route');
  const cost=employerCost(base);
  const bonus=Math.round(base*offer.bonusRate);
  const benefits=Math.round(base*offer.benefitsRate);
  return <div className="rw ts-offer" data-widget-state={`${base}-${start}-${stage}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Offer package · Approved candidate"><Badge tone={stage==='Finance review'?'info':'good'}><span data-testid="approval-stage">{stage}</span></Badge></WidgetHeader>
    <div className="ts-offer-layout"><article className="ts-offer-document"><header><span className="ts-offer-mark">TS</span><span><small>TalentSpring offer of employment</small><h4>{offer.candidate}</h4></span></header><p>Dear Maya,</p><p>We are pleased to offer you the position of <strong>{offer.role}</strong>, with an anticipated start date of <strong>{new Date(`${start}T12:00:00`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</strong>.</p><dl><div><dt>Annual base compensation</dt><dd>{usd(base)}</dd></div><div><dt>Target annual bonus</dt><dd>{usd(bonus)} · {offer.bonusRate*100}%</dd></div><div><dt>Annual equity value</dt><dd>{usd(offer.equityAnnual)}</dd></div><div><dt>Signing bonus</dt><dd>{usd(offer.signingBonus)}</dd></div></dl><p className="ts-offer-note">This demonstration preview uses the approved fictional compensation assumptions shown in the review panel.</p><footer>Prepared September 5, 2026 · Candidate record CAN-184</footer></article>
      <aside className="ts-offer-controls"><label>Base compensation<input type="number" aria-label="Base compensation" min="158000" max="178000" step="1000" value={base} onChange={event=>setBase(Math.max(158000,Math.min(178000,Number(event.target.value)||158000)))}/></label><label>Start date<input type="date" aria-label="Offer start date" min="2026-09-28" max="2026-11-02" value={start} onChange={event=>setStart(event.target.value)}/></label><Metric label="Annual employer cost" value={<span data-testid="employer-cost">{usd(cost)}</span>} note={`${usd(benefits)} benefits + bonus, equity and signing allowance`}/><section className="ts-approval-trail"><h4>Approval trail</h4>{offer.approvals.map(item=><p key={item.label}><span>{item.label}</span><Badge tone={item.status==='Approved'?'good':'info'}>{item.status}</Badge></p>)}</section><section className="ts-packet-checks"><h4>Packet completeness</h4><span>✓ Candidate and role</span><span>✓ Compensation schedule</span><span>✓ Start date and approvals</span></section><button type="button" data-primary-action className="rw-action" disabled={stage==='Finance review'} onClick={()=>setStage('Finance review')}>{stage==='Finance review'?'Routed to finance':'Route for approval'}</button></aside></div>
    <Source>Ashby CAN-184 · Approved compensation band CB-17 · Local preview only · Owner: Chloe Martin</Source>
  </div>;
}
OfferPackageBuilder.displayName='OfferPackageBuilder';
