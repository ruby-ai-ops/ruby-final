'use client';
import {useState} from 'react';
import type {ArtifactComponentProps} from '../registry';
import {Badge,Fact,Metric,Pick,Source,WidgetHeader} from '../workspace-primitives';
import {waitingCandidates} from './fixtures';

const lanes=['Reviewer decision','Interview booking','Offer update'] as const;
export function CandidateWaitingRoom({scenario}:ArtifactComponentProps){
  const [selected,setSelected]=useState(waitingCandidates[0].id);
  const [scheduled,setScheduled]=useState<string[]>([]);
  const activeCandidates=waitingCandidates.filter(candidate=>!scheduled.includes(candidate.id));
  const active=activeCandidates.find(candidate=>candidate.id===selected)??activeCandidates[0];
  const schedule=()=>{if(!active)return;setScheduled(current=>[...current,active.id]);setSelected(activeCandidates.find(candidate=>candidate.id!==active.id)?.id??'');};
  return <div className="rw ts-waiting" data-widget-state={`${selected}-${scheduled.join()}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Candidate experience · Action owed"><Badge tone={activeCandidates.length?'risk':'good'}><span data-testid="stalled-count">{activeCandidates.length}</span> stalled</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Longest wait" value={`${Math.max(0,...activeCandidates.map(item=>item.days))} days`}/><Metric label="Reviewer decisions" value={activeCandidates.filter(item=>item.lane==='Reviewer decision').length}/><Metric label="Next steps committed" value={scheduled.length}/></div>
    <div className="ts-waiting-layout"><section className="ts-waiting-lanes">{lanes.map(lane=><div key={lane}><header><strong>{lane}</strong><small>{activeCandidates.filter(item=>item.lane===lane).length} waiting</small></header>{activeCandidates.filter(item=>item.lane===lane).map(candidate=><Pick key={candidate.id} selected={active?.id===candidate.id} label={`Review ${candidate.name}`} onClick={()=>setSelected(candidate.id)}><span><strong>{candidate.name}</strong><small>{candidate.role}</small></span><Badge tone={candidate.days>=5?'risk':'neutral'}>{candidate.days} days</Badge></Pick>)}{!activeCandidates.some(item=>item.lane===lane)&&<p>Queue recovered</p>}</div>)}</section>
      <aside className="ts-followup-card">{active?<><span><small>{active.id}</small><h4>{active.name}</h4></span><div className="rw-flex"><Fact label="Action owner">{active.owner}</Fact><Fact label="Days waiting">{active.days}</Fact></div><section><small>Last exchange</small><p>{active.lastExchange}</p></section><section className="ts-message-preview"><small>Proposed follow-up</small><p>{active.proposed}</p></section><button type="button" data-primary-action className="rw-action" aria-label="Schedule next step" onClick={schedule}>Schedule next step</button></>:<p className="rw-empty">Every waiting candidate now has a committed next step.</p>}</aside></div>
    <Source>Ashby stage history + Front and Gmail correspondence · Recovery owner: Chloe Martin</Source>
  </div>;
}
CandidateWaitingRoom.displayName='CandidateWaitingRoom';
