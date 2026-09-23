'use client';
import {useState} from 'react';
import {Badge,Metric,Source,WidgetHeader,type WidgetProps} from '../workspace-primitives';
import {closeProjection,closeTasks} from './fixtures';

export function CloseDependencyPath({scenario}:WidgetProps){
  const [evidenceReceived,setEvidenceReceived]=useState(false);
  const projection=closeProjection(evidenceReceived);
  return <div className="rw lg-close" data-widget-state={evidenceReceived?'evidence-received':'blocked'}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="September close · Critical dependency"><Badge tone={projection.readyByFriday?'good':'risk'}>{projection.readyByFriday?'Friday close ready':'Evidence blocked'}</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Earliest finish" value={projection.finish} id="close-finish"/><Metric label="Remaining work" value={`${projection.remainingHours} h`} note="After evidence arrives"/><Metric label="External wait" value={`${projection.waitHours} h`}/></div>
    <div className="lg-close-path" aria-label="Close dependency path">
      {closeTasks.map((task,index)=>{const complete=task.complete||(evidenceReceived&&task.id==='bank');const blocked=!evidenceReceived&&['bank','consolidate','tax'].includes(task.id);return <section key={task.id} className={`${complete?'is-complete':''} ${blocked?'is-blocked':''}`}>
        <span className="lg-close-step">{index+1}</span><div><small>{task.account}</small><h4>{task.label}</h4><p>{task.evidence}</p><span>{task.owner} · {task.hours?`${task.hours} h`:'Complete'}</span></div><Badge tone={complete?'good':blocked?'risk':'neutral'}>{complete?'Complete':blocked?'Blocked':'Queued'}</Badge>
      </section>;})}
    </div>
    <div className="lg-close-decision"><div><small>Downstream consequence</small><strong>{evidenceReceived?'Trial balance and tax provision can complete today.':'Trial balance, tax provision and cover review cannot start.'}</strong></div><button type="button" className="rw-action" data-primary-action aria-label="Resolve reconciliation evidence" disabled={evidenceReceived} onClick={()=>setEvidenceReceived(true)}>{evidenceReceived?'Evidence attached':'Attach processor evidence'}</button></div>
    <Source>Close checklist CL-SEP · NetSuite accounts · Processor settlement batch ST-0904</Source>
  </div>;
}
CloseDependencyPath.displayName='CloseDependencyPath';
