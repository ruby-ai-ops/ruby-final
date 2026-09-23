'use client';
import {useState} from 'react';
import type {ArtifactComponentProps} from '../registry';
import {Badge,Fact,Photo,Pick,Source,WidgetHeader} from '../workspace-primitives';
import {publicationChannels,role} from './fixtures';

export function JobPublicationStudio({scenario}:ArtifactComponentProps){
  const [selected,setSelected]=useState(0);
  const [published,setPublished]=useState<string[]>([]);
  const channel=publicationChannels[selected];
  const isPublished=published.includes(channel.id);
  return <div className="rw ts-publication" data-widget-state={`${selected}-${published.join()}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow={`Approved role · ${role.id}`}><Badge tone="good">Role details approved</Badge></WidgetHeader>
    <div className="rw-tabs" role="tablist" aria-label="Publication channels">{publicationChannels.map((item,index)=><Pick key={item.id} selected={selected===index} label={item.label} onClick={()=>setSelected(index)}>{item.label}{published.includes(item.id)&&<span aria-label="published"> · ✓</span>}</Pick>)}</div>
    <div className={`ts-channel-preview is-${channel.id}`}>
      <section><Photo src="/demo-talentspring/workplace-arrival.webp" alt="TalentSpring colleagues arriving at the workplace"/><div><Badge tone="info">{channel.label}</Badge><small>{channel.audience}</small><h4>{role.title}</h4><p>{role.summary}</p><div className="rw-flex"><Fact label="Location">{role.location}</Fact><Fact label="Compensation">{role.compensation}</Fact></div><strong className="ts-channel-cta">{channel.cta}</strong></div></section>
      <aside><h4>Approved responsibilities</h4><ul>{role.responsibilities.map(item=><li key={item}>{item}</li>)}</ul><h4>Channel treatment</h4><p>{channel.note}</p><div className="ts-role-checks">{role.details.map(item=><span key={item}>✓ {item}</span>)}</div><Badge tone={isPublished?'good':'neutral'}><span data-testid="channel-status">{isPublished?'Published':'Ready'}</span></Badge><button type="button" data-primary-action className="rw-action" disabled={isPublished} aria-label={`Publish ${channel.label}`} onClick={()=>setPublished(current=>[...current,channel.id])}>{isPublished?'Published':`Publish ${channel.label}`}</button></aside>
    </div>
    <Source>Approved headcount HC-328 · Compensation and location copied from the role record · Publishing owner: Aiden Lee</Source>
  </div>;
}
JobPublicationStudio.displayName='JobPublicationStudio';
