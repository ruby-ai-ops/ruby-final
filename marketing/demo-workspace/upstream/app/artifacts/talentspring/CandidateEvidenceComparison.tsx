'use client';
import {useState} from 'react';
import type {ArtifactComponentProps} from '../registry';
import {Badge,Fact,Metric,Pick,Source,WidgetHeader} from '../workspace-primitives';
import {candidateRequirements,candidates} from './fixtures';

export function CandidateEvidenceComparison({scenario}:ArtifactComponentProps){
  const [selected,setSelected]=useState(0);
  const [requirement,setRequirement]=useState(0);
  const [shortlist,setShortlist]=useState<string[]>([]);
  const active=candidates[selected];
  const evidence=active.evidence[candidateRequirements[requirement]];
  const toggle=()=>setShortlist(current=>current.includes(active.id)?current.filter(id=>id!==active.id):[...current,active.id]);
  return <div className="rw ts-candidates" data-widget-state={`${selected}-${requirement}-${shortlist.join()}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Data platform search · Evidence review"><Badge tone="info"><span data-testid="shortlist-count">{shortlist.length}</span> shortlisted</Badge></WidgetHeader>
    <div className="ts-candidate-layout">
      <nav className="ts-candidate-dossiers" aria-label="Candidate dossiers">
        {candidates.map((candidate,index)=><Pick key={candidate.id} primary={index===1} selected={selected===index} label={`Review ${candidate.name}`} onClick={()=>setSelected(index)}>
          <span className="ts-avatar" aria-hidden="true">{candidate.name.split(' ').map(part=>part[0]).join('')}</span>
          <span><strong>{candidate.name}</strong><small>{candidate.currentRole}</small><small>{candidate.location} · Available in {candidate.availability}</small></span>
          {shortlist.includes(candidate.id)&&<Badge tone="good">Shortlisted</Badge>}
        </Pick>)}
      </nav>
      <section className="ts-evidence-panel" data-testid="candidate-evidence">
        <div className="ts-evidence-title"><span><small>{active.id}</small><h4>{active.name}</h4></span><Metric label="Requirements evidenced" value={`${Object.keys(active.evidence).length} / ${candidateRequirements.length}`}/></div>
        <fieldset className="ts-requirement-tabs"><legend>Role requirements</legend>
          {candidateRequirements.map((item,index)=><Pick key={item} selected={requirement===index} onClick={()=>setRequirement(index)}>{item}</Pick>)}
        </fieldset>
        <article><Badge tone="good">Cited evidence</Badge><h4>{candidateRequirements[requirement]}</h4><p>{evidence.claim}</p><Fact label="Source record">{evidence.source}</Fact></article>
        <div className="ts-strengths"><small>Demonstrated strengths</small>{active.strengths.map(item=><span key={item}>{item}</span>)}</div>
        <button type="button" className="rw-action" aria-label={`${shortlist.includes(active.id)?'Remove':'Add'} ${active.name} ${shortlist.includes(active.id)?'from':'to'} shortlist`} onClick={toggle}>{shortlist.includes(active.id)?'Remove from shortlist':'Add to shortlist'}</button>
      </section>
    </div>
    <Source>Ashby candidate records · Technical exercises TS-44, TS-51 and TS-58 · Reviewer: Chloe Martin</Source>
  </div>;
}
CandidateEvidenceComparison.displayName='CandidateEvidenceComparison';
