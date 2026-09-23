'use client';
import {useState} from 'react';
import type {ArtifactComponentProps} from '../registry';
import {Badge,Fact,Pick,Source,WidgetHeader} from '../workspace-primitives';
import {interviewAgenda,interviewSlots,panelists} from './fixtures';

const zones={eastern:{label:'Eastern time',zone:'America/New_York'},pacific:{label:'Pacific time',zone:'America/Los_Angeles'}} as const;
function timeLabel(instant:string,zone:string){return new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',minute:'2-digit'}).format(new Date(instant));}
export function PanelOverlapScheduler({scenario}:ArtifactComponentProps){
  const [zone,setZone]=useState<keyof typeof zones>('eastern');
  const [duration,setDuration]=useState(90);
  const [selected,setSelected]=useState(0);
  const [scheduled,setScheduled]=useState(false);
  const active=interviewSlots[selected];
  const complete=active.available.length===panelists.length&&active.maxMinutes>=duration;
  const choose=(index:number)=>{setSelected(index);setScheduled(false);};
  return <div className="rw ts-scheduler" data-widget-state={`${zone}-${duration}-${selected}-${scheduled}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Final interview · Calendar overlap"><Badge tone={scheduled?'good':complete?'info':'risk'}>{scheduled?'Scheduled':complete?'Complete overlap':'Panel conflict'}</Badge></WidgetHeader>
    <div className="ts-scheduler-controls"><fieldset className="rw-flex ts-zone-options"><legend>Time zone</legend>{Object.entries(zones).map(([key,value])=><Pick key={key} selected={zone===key} label={value.label} onClick={()=>setZone(key as keyof typeof zones)}>{value.label}</Pick>)}</fieldset><label>Interview duration<select aria-label="Interview duration" value={duration} onChange={event=>{setDuration(Number(event.target.value));setScheduled(false);}}><option value="60">60 minutes</option><option value="90">90 minutes</option></select></label></div>
    <section className="ts-overlap-bands"><header><span>Candidate + panel availability</span><small>Times shown in {zones[zone].label.toLowerCase()}</small></header>{interviewSlots.map((slot,index)=>{const eligible=slot.available.length===panelists.length&&slot.maxMinutes>=duration;return <Pick key={slot.id} primary={index===1} selected={selected===index} label={`Select ${slot.label} at ${timeLabel(slot.instant,zones[zone].zone)}`} onClick={()=>choose(index)}><time>{slot.label}<strong>{timeLabel(slot.instant,zones[zone].zone)}</strong></time><span className="ts-availability-track">{panelists.map(person=><i key={person} className={slot.available.includes(person)?'available':'missing'} title={`${person}: ${slot.available.includes(person)?'available':'unavailable'}`}/>)}</span><Badge tone={eligible?'good':'risk'}>{eligible?`${slot.maxMinutes} min overlap`:`${panelists.length-slot.available.length} unavailable`}</Badge></Pick>;})}</section>
    <div className="ts-agenda-preview"><section><small>Panel agenda · {duration} minutes</small>{interviewAgenda.filter((_,index)=>duration===90||index!==2).map(item=><p key={item.label}><span>{item.minutes} min</span><strong>{item.label}</strong></p>)}</section><aside><Fact label="Candidate">Maya Thompson</Fact><Fact label="Participants">{active.available.join(' · ')}</Fact><Fact label="Meeting instant"><span data-testid="meeting-instant">{active.instant}</span></Fact><button type="button" data-primary-action className="rw-action" disabled={!complete||scheduled} onClick={()=>setScheduled(true)}>{scheduled?'Panel scheduled':'Schedule interview panel'}</button><output>{scheduled?`Panel assembled for ${active.label} at ${timeLabel(active.instant,zones[zone].zone)} ${zones[zone].label}.` : complete?'All required participants are available.':'Choose a window containing every participant.'}</output></aside></div>
    <Source>Google Calendar + Outlook availability · Underlying instants remain in UTC · Coordinator: Chloe Martin</Source>
  </div>;
}
PanelOverlapScheduler.displayName='PanelOverlapScheduler';
