'use client';
import {useState} from 'react';
import {Fact,Pick,Photo,Source,WidgetHeader,type WidgetProps} from '../workspace-primitives';
import {boardDecisions} from './fixtures';
export function HealthOperationsBoardBrief({scenario}:WidgetProps){
 const [selected,setSelected]=useState(0);const active=boardDecisions[selected];
 return <div className="rw hv-board" data-widget-state={selected}><WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Monthly operations · August 2026"/><section className="hv-board-overview"><Photo src="/demo-harborview/exam-room.webp" alt="Harborview clinical operating environment"/><div><h4>Three decisions for September</h4><p>Protect access while restoring service reliability. Each request has a measurable target and accountable owner.</p></div></section><div className="hv-board-scorelines">{boardDecisions.map((d,i)=><Pick key={d.id} selected={selected===i} primary={i===1} label={`Review ${d.name.toLowerCase()}`} onClick={()=>setSelected(i)}><strong>{d.name}</strong><span className="hv-bullet"><i style={{width:`${d.actual/Math.max(d.actual,d.target)*85}%`}}/><b style={{left:`${d.target/Math.max(d.actual,d.target)*85}%`}}/></span><small>{d.actual} actual / {d.target} target · {d.unit}</small></Pick>)}</div><section className="hv-board-decision"><h4>{active.name}</h4><p data-testid="health-board-decision">{active.action}</p><div className="rw-flex"><Fact label="Resource request">{active.resource}</Fact><Fact label="Accountable owner">{active.owner}</Fact></div><blockquote>{active.trend}</blockquote></section><Source>Monthly operations workbook · Board review September 10 · Target marker shown against actual</Source></div>;
}
HealthOperationsBoardBrief.displayName='HealthOperationsBoardBrief';
