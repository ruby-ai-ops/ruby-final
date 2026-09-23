'use client';
import {useState} from 'react';
import {Badge,Metric,Source,WidgetHeader,usd,type WidgetProps} from '../workspace-primitives';
import {basePaymentRun,duplicatePairs,heldDuplicateTotal} from './fixtures';

export function PayableDuplicateReview({scenario}:WidgetProps){
  const [selected,setSelected]=useState(duplicatePairs[0].id);const [held,setHeld]=useState<Set<string>>(new Set());const pair=duplicatePairs.find(row=>row.id===selected)!;const prevented=heldDuplicateTotal(held);const isHeld=held.has(pair.id);
  return <div className="rw lg-duplicates" data-widget-state={`${selected}-${[...held].sort().join(',')}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Payment run · Matched invoice pairs"><Badge tone="risk">{duplicatePairs.length-held.size} need review</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Payment run" value={usd(basePaymentRun-prevented)} id="payment-run"/><Metric label="Duplicate prevented" value={usd(prevented)} id="duplicates-prevented"/><Metric label="Pairs held" value={`${held.size} / ${duplicatePairs.length}`}/></div>
    <div className="lg-duplicate-strip" aria-label="Duplicate payable exceptions">{duplicatePairs.map(row=><button type="button" key={row.id} className={selected===row.id?'selected':''} onClick={()=>setSelected(row.id)}><span><small>{row.id}</small><strong>{row.vendor}</strong></span><b>{usd(row.duplicate.amount)}</b><Badge tone={held.has(row.id)?'good':'risk'}>{held.has(row.id)?'Held':'In run'}</Badge></button>)}</div>
    <div className="lg-duplicate-compare"><article><header><small>Original payable</small><Badge tone="good">{pair.original.status}</Badge></header><h3>{pair.vendor}</h3><dl><div><dt>Invoice</dt><dd>{pair.original.invoice}</dd></div><div><dt>Date</dt><dd>{pair.original.date}</dd></div><div><dt>Amount</dt><dd>{usd(pair.original.amount)}</dd></div></dl></article><i className="fa-solid fa-equals"/><article><header><small>Extra payable</small><Badge tone={isHeld?'good':'risk'}>{isHeld?'Payment held':pair.duplicate.status}</Badge></header><h3>{pair.vendor}</h3><dl><div><dt>Invoice</dt><dd>{pair.duplicate.invoice}</dd></div><div><dt>Date</dt><dd>{pair.duplicate.date}</dd></div><div><dt>Amount</dt><dd>{usd(pair.duplicate.amount)}</dd></div></dl></article></div>
    <div className="lg-duplicate-reason"><div><small>Why this pair matched</small><strong>{pair.match}</strong><span>Owner · {pair.owner}</span></div><button type="button" className="rw-action" data-primary-action disabled={isHeld} aria-label={isHeld?'Duplicate payable held':'Hold duplicate payable'} onClick={()=>setHeld(current=>new Set(current).add(pair.id))}>{isHeld?'Duplicate held':'Hold extra payable'}</button></div>
    <Source>NetSuite AP detail · Payment run PR-0905 · Prevented value counts only the extra payable</Source>
  </div>;
}
PayableDuplicateReview.displayName='PayableDuplicateReview';
