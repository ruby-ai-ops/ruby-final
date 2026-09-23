'use client';
import { useState } from 'react';
import { Badge, Fact, Pick, Source, WidgetHeader, type WidgetProps } from '../workspace-primitives';
import { processControls } from './fixtures';

export function ClaimsProcessControlGate({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [approved, setApproved] = useState(false);
  const ready = resolved;
  const active = processControls[selected];
  const activeReady = active.id === 'notice' ? resolved : active.id === 'review' ? approved : active.ready;
  return <div className="rw cs-gate" data-widget-state={`${selected}-${resolved}-${approved}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Claims process · Evidence gate"><Badge tone={approved ? 'good' : ready ? 'info' : 'risk'}>{approved ? 'Approved for demo launch' : ready ? 'Ready for final approval' : 'One control gap'}</Badge></WidgetHeader>
    <ol className="cs-process-path">{processControls.map((control, index) => { const isReady = control.id === 'notice' ? resolved : control.id === 'review' ? approved : control.ready; return <li key={control.id}><Pick primary={index === 1} selected={selected === index} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{control.stage}</strong><small>{isReady ? 'Evidence ready' : 'Evidence required'}</small></Pick></li>; })}</ol>
    <section className="cs-control-sheet"><div><Badge tone={activeReady ? 'good' : 'risk'}>{activeReady ? 'Control satisfied' : 'Control gap'}</Badge><h4>{active.control}</h4><p>{active.evidence}</p></div><div className="rw-stack"><Fact label="Reviewer owner">{active.owner}</Fact>{active.id === 'notice' && !resolved && <button type="button" className="rw-action" data-primary-action="" onClick={() => setResolved(true)}>Attach signed notice evidence</button>}<button type="button" disabled={!ready || approved} onClick={() => setApproved(true)}>{approved ? 'Approval recorded' : 'Approve sample launch'}</button></div></section>
    <Source>Vanta control set CP-08 · Evidence references remain available for reviewer inspection</Source>
  </div>;
}
ClaimsProcessControlGate.displayName = 'ClaimsProcessControlGate';
