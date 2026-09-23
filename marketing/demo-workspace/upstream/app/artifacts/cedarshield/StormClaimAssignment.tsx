'use client';
import { useMemo, useState } from 'react';
import { Badge, Fact, Metric, Photo, Pick, Source, WidgetHeader, usd, type WidgetProps } from '../workspace-primitives';
import { adjusters, stormClaims } from './fixtures';

export function StormClaimAssignment({ scenario }: WidgetProps) {
  const [claimIndex, setClaimIndex] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const claim = stormClaims[claimIndex];
  const currentLoads = useMemo(() => Object.fromEntries(adjusters.map((a) => [a.id, a.assigned + Object.values(assignments).filter((id) => id === a.id).length])), [assignments]);
  const compatible = adjusters.filter((a) => a.skills.includes(claim.requiredSkill) && currentLoads[a.id] < a.capacity);
  const recommended = compatible[0];
  const assignedId = assignments[claim.id];
  return <div className="rw cs-storm" data-widget-state={`${claim.id}-${Object.keys(assignments).length}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Storm desk · Contact deadlines"><Badge tone={stormClaims.length - Object.keys(assignments).length ? 'risk' : 'good'}>{stormClaims.length - Object.keys(assignments).length} unassigned</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Reported storm claims" value={stormClaims.length}/><Metric label="Estimated damage" value={usd(stormClaims.reduce((sum, row) => sum + row.estimate, 0))}/><Metric label="Placed locally" value={Object.keys(assignments).length}/></div>
    <div className="cs-claim-strip">{stormClaims.map((row, index) => <Pick key={row.id} selected={claimIndex === index} onClick={() => setClaimIndex(index)}><Photo src={`/demo-cedarshield/${row.image}`} alt={`${row.category.toLowerCase()} damage for claim ${row.id}`}/><span><strong>{row.id} · {row.category}</strong><small>{row.location}</small><small>{row.deadline}</small></span></Pick>)}</div>
    <section className="cs-assignment-body"><div className="cs-loss-evidence"><Photo src={`/demo-cedarshield/${claim.image}`} alt={`Claim evidence showing ${claim.category.toLowerCase()} damage in ${claim.location}`}/><div className="rw-flex"><Fact label="Policyholder">{claim.customer}</Fact><Fact label="Initial estimate">{usd(claim.estimate)}</Fact><Fact label="Required skill">{claim.requiredSkill}</Fact></div><p>{claim.evidence}</p></div><div className="cs-adjuster-list"><h4>Compatible adjusters</h4>{compatible.length ? compatible.map((person) => <article key={person.id}><span><strong>{person.name}</strong><small>{person.region}</small></span><span><b>{currentLoads[person.id]} / {person.capacity}</b><small>assigned capacity</small></span></article>) : <p className="rw-empty">No compatible capacity is currently available.</p>}{recommended && !assignedId && <p className="cs-assignment-reason"><strong>Why {recommended.name}:</strong> {claim.requiredSkill} experience, coverage in {recommended.region}, and {recommended.capacity - currentLoads[recommended.id]} available claim slots.</p>}<button type="button" className="rw-action" data-primary-action="" disabled={!recommended || Boolean(assignedId)} onClick={() => recommended && setAssignments((current) => ({ ...current, [claim.id]: recommended.id }))}>{assignedId ? `Assigned to ${adjusters.find((a) => a.id === assignedId)?.name}` : recommended ? `Assign ${recommended.name}` : 'No assignment available'}</button></div></section>
    <Source>ClaimCenter event ST-91 · Workload snapshot 9:25 AM · Assignment owner: James Foster</Source>
  </div>;
}
StormClaimAssignment.displayName = 'StormClaimAssignment';
