'use client';
import { useState } from 'react';
import { Badge, Fact, Pick, Source, WidgetHeader, type WidgetProps } from '../workspace-primitives';
import { evidenceConnections } from './fixtures';

export function ClaimEvidenceConnections({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState(0);
  const edge = evidenceConnections[selected];
  const nodes = Array.from(new Set(evidenceConnections.flatMap((item) => [item.from, item.to])));
  return <div className="rw cs-connections" data-widget-state={selected}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Evidence connections · Review, not determination"><Badge tone="info">{evidenceConnections.filter((item) => item.status === 'Unresolved signal').length} unresolved signals</Badge></WidgetHeader>
    <div className="cs-graph" aria-label="Claim evidence relationship diagram"><div className="cs-node-field">{nodes.map((node, index) => <span key={node} className={`cs-node n${index}`}>{node}</span>)}</div><div className="cs-edge-list">{evidenceConnections.map((item, index) => <Pick key={item.id} primary={index === 1} selected={selected === index} onClick={() => setSelected(index)} label={`Inspect connection between ${item.from} and ${item.to}`}><span>{item.from}</span><i aria-hidden="true">↔</i><span>{item.to}</span><small>{item.relation}</small></Pick>)}</div></div>
    <section className="cs-connection-evidence"><div><Badge tone={edge.status === 'Explained' ? 'good' : 'risk'}>{edge.status}</Badge><h4>{edge.from} ↔ {edge.to}</h4><p>{edge.detail}</p></div><Fact label="Cited source">{edge.source}</Fact></section>
    <Source>Investigation workspace FI-204 · Signals require human review before any claim decision</Source>
  </div>;
}
ClaimEvidenceConnections.displayName = 'ClaimEvidenceConnections';

