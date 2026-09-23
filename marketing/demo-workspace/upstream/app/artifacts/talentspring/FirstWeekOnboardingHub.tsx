'use client';
import {useState} from 'react';
import type {ArtifactComponentProps} from '../registry';
import {Badge,Fact,Metric,Photo,Pick,Source,WidgetHeader} from '../workspace-primitives';
import {onboardingDays,onboardingTasks} from './fixtures';

export function FirstWeekOnboardingHub({scenario}:ArtifactComponentProps){
  const [day,setDay]=useState(0);
  const [complete,setComplete]=useState<string[]>([]);
  const agenda=onboardingDays[day];
  const mark=(id:string)=>setComplete(current=>current.includes(id)?current:[...current,id]);
  const readiness=Math.round(complete.length/onboardingTasks.length*100);
  return <div className="rw ts-onboarding" data-widget-state={`${day}-${complete.join()}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="New-hire cohort · Week of October 5"><Badge tone={readiness===100?'good':'info'}>{readiness}% first-week ready</Badge></WidgetHeader>
    <section className="ts-welcome"><Photo src="/demo-talentspring/onboarding-workspace.webp" alt="Prepared TalentSpring onboarding workspace"/><div><small>WELCOME TO TALENTSPRING</small><h4>Maya, Jordan and Luis</h4><p>Arrive Monday at 9:30 AM at 18 Mercer Street. Check in at reception with photo identification.</p><div className="rw-flex"><Fact label="Cohort buddy">Mina Cole</Fact><Fact label="Manager welcome">10:00 AM</Fact><Fact label="Welcome event">Friday · 4:00 PM</Fact></div></div></section>
    <div className="ts-onboarding-layout"><section><nav className="ts-day-tabs" aria-label="First-week days">{onboardingDays.map((item,index)=><Pick key={item.day} selected={day===index} label={`Open ${item.day} agenda`} onClick={()=>setDay(index)}>{item.day.slice(0,3)}</Pick>)}</nav><article className="ts-day-agenda"><small>DAY {day+1}</small><h4>{agenda.day} · {agenda.title}</h4>{agenda.items.map((item,index)=><p key={item}><span>{String(index+1).padStart(2,'0')}</span><strong>{item}</strong></p>)}</article></section><aside className="ts-setup-path"><span><small>Dependent setup path</small><h4>Access readiness</h4></span><Metric label="Tasks complete" value={`${complete.length} / ${onboardingTasks.length}`}/>{onboardingTasks.map((task,index)=>{const done=complete.includes(task.id),locked=Boolean(task.dependsOn&&!complete.includes(task.dependsOn));return <button key={task.id} type="button" data-primary-action={index===0?'':undefined} disabled={done||locked} aria-label={task.label} onClick={()=>mark(task.id)}><span>{done?'✓':locked?'○':'→'}</span><span><strong>{task.label}</strong><small>{locked?`Unlocks after ${onboardingTasks.find(item=>item.id===task.dependsOn)?.label.toLowerCase()}`:`Owner: ${task.owner}`}</small></span><Badge tone={done?'good':locked?'neutral':'info'}>{done?'Complete':locked?'Locked':'Ready'}</Badge></button>;})}</aside></div>
    <Source>Guru onboarding guide + Confluence platform handbook · Tasks remain local · Cohort owner: Aiden Lee</Source>
  </div>;
}
FirstWeekOnboardingHub.displayName='FirstWeekOnboardingHub';
