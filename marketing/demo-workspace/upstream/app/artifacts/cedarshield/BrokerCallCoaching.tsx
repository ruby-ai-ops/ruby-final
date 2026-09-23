'use client';
import { useState } from 'react';
import { Badge, Pick, Source, WidgetHeader, type WidgetProps } from '../workspace-primitives';
import { coachingSkills } from './fixtures';

export function BrokerCallCoaching({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState(0);
  const [assigned, setAssigned] = useState<string[]>([]);
  const skill = coachingSkills[selected];
  const isAssigned = assigned.includes(skill.id);
  return <div className="rw cs-coaching" data-widget-state={`${selected}-${assigned.join()}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Broker coaching · Three cited skills"><Badge tone={assigned.length ? 'good' : 'neutral'}>{assigned.length} practice task{assigned.length === 1 ? '' : 's'} assigned</Badge></WidgetHeader>
    <div className="cs-coaching-shell"><nav aria-label="Coaching skills">{coachingSkills.map((item, index) => <Pick key={item.id} primary={index === 1} selected={selected === index} onClick={() => setSelected(index)}><strong>{item.name}</strong><small>{item.citations[0].time} and {item.citations[1].time}</small></Pick>)}</nav><section className="cs-transcript"><header><span><small>Observed behavior</small><h4>{skill.name}</h4></span><Badge tone="info">Cited call evidence</Badge></header>{skill.citations.map((citation) => <blockquote key={citation.time}><time>{citation.time}</time><span><strong>{citation.speaker}</strong><p>{citation.line}</p></span></blockquote>)}<p className="cs-observation">{skill.observed}</p></section></div>
    <section className="cs-coaching-example"><div><small>Worked improved response</small><p>“{skill.improved}”</p></div><aside><small>Practice assignment</small><p>{skill.practice}</p><button type="button" className="rw-action" disabled={isAssigned} onClick={() => setAssigned((items) => [...items, skill.id])}>{isAssigned ? 'Practice assigned' : 'Assign practice'}</button></aside></section>
    <Source>Gong calls CS-204 and CS-211 · Coaching record remains local to this demo</Source>
  </div>;
}
BrokerCallCoaching.displayName = 'BrokerCallCoaching';
