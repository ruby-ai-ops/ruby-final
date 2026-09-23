'use client';
import { useState } from 'react';
import { Badge, Fact, Metric, Photo, Pick, Source, WidgetHeader, usd, type WidgetProps } from '../workspace-primitives';
import { clientAssets } from './fixtures';

export function ClientRiskServiceReview({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState(0);
  const asset = clientAssets[selected];
  const max = Math.max(...asset.trend);
  return <div className="rw cs-client-review" data-widget-state={selected}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Hawthorne Distribution · Service year"><Badge tone="info">Client review</Badge></WidgetHeader>
    <div className="cs-asset-tabs">{clientAssets.map((item, index) => <Pick key={item.id} primary={index === 1} selected={selected === index} onClick={() => setSelected(index)}><Photo src={`/demo-cedarshield/${item.image}`} alt={`${item.name} risk evidence for the client review`}/><span><strong>{item.name}</strong><small>{item.count} covered assets</small></span></Pick>)}</div>
    <div className="rw-metrics"><Metric label="Paid losses" value={usd(asset.paid)}/><Metric label="Total incurred" value={usd(asset.incurred)}/><Metric label="Claim frequency" value={asset.frequency}/><Metric label="Response performance" value={asset.response}/></div>
    <section className="cs-loss-review"><div className="cs-loss-bars"><h4>Three-year incurred loss</h4>{asset.trend.map((value, index) => <span key={index}><small>{2024 + index}</small><i style={{ height: `${Math.max(18, value / max * 100)}%` }}/><b>{usd(value * 1000)}</b></span>)}</div><div className="cs-client-actions"><h4>Open recommendations</h4>{asset.open.map((item) => <p key={item}>✓ {item}</p>)}<div className="rw-flex"><Fact label="Asset class">{asset.name}</Fact><Fact label="Covered records">{asset.count}</Fact></div></div></section>
    <Source>Client service review SR-118 · Paid and incurred values reconciled September 1</Source>
  </div>;
}
ClientRiskServiceReview.displayName = 'ClientRiskServiceReview';

