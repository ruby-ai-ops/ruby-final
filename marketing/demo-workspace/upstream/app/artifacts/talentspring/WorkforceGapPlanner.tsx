'use client';
import {useState} from 'react';
import type {ArtifactComponentProps} from '../registry';
import {Badge,Fact,Metric,Pick,Source,WidgetHeader,usd} from '../workspace-primitives';
import {hoursPerFte,workforceGap,workforceTeams} from './fixtures';

export function WorkforceGapPlanner({scenario}:ArtifactComponentProps){
  const [selected,setSelected]=useState(0);
  const [mobility,setMobility]=useState<Record<string,number>>({});
  const [hires,setHires]=useState<Record<string,number>>({});
  const team=workforceTeams[selected];
  const internal=mobility[team.id]??0;
  const planned=hires[team.id]??0;
  const gap=workforceGap(team,internal,planned);
  const totalGap=workforceTeams.reduce((sum,item)=>sum+workforceGap(item,mobility[item.id]??0,hires[item.id]??0),0);
  const addMobility=()=>setMobility(current=>({...current,[team.id]:Math.min(team.maxMobility,(current[team.id]??0)+120)}));
  const addHire=()=>setHires(current=>({...current,[team.id]:(current[team.id]??0)+1}));
  return <div className="rw ts-workforce" data-widget-state={`${selected}-${internal}-${planned}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Q4 workforce demand · Productive hours"><Badge tone={totalGap?'risk':'good'}>{totalGap.toLocaleString()} hours uncovered</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Hours per quarterly FTE" value={hoursPerFte}/><Metric label="Current demand" value={workforceTeams.reduce((sum,item)=>sum+item.demand,0).toLocaleString()}/><Metric label="Portfolio uncovered" value={totalGap.toLocaleString()}/></div>
    <div className="ts-capacity-layout">
      <section className="ts-capacity-bars" aria-label="Team capacity comparison">{workforceTeams.map((item,index)=>{const moved=mobility[item.id]??0,teamHires=hires[item.id]??0,itemGap=workforceGap(item,moved,teamHires);return <Pick key={item.id} selected={selected===index} label={`Inspect ${item.name}`} onClick={()=>setSelected(index)}><span><strong>{item.name}</strong><small>{item.skill}</small></span><span className="ts-bar" aria-label={`${item.current} current hours, ${moved} mobility hours, ${teamHires*hoursPerFte} planned hire hours, ${itemGap} hour gap`}><i className="current" style={{width:`${item.current/item.demand*100}%`}}/><i className="mobility" style={{width:`${moved/item.demand*100}%`}}/><i className="hire" style={{width:`${teamHires*hoursPerFte/item.demand*100}%`}}/></span><span><b>{itemGap.toLocaleString()} h gap</b><small>{(itemGap/hoursPerFte).toFixed(1)} FTE</small></span></Pick>;})}<footer><span><i className="current"/>Current staff</span><span><i className="mobility"/>Internal mobility</span><span><i className="hire"/>Planned hires</span></footer></section>
      <aside className="ts-gap-plan"><span><small>{team.skill}</small><h4>{team.name}</h4></span><div className="rw-flex"><Fact label="Demand">{team.demand.toLocaleString()} hours</Fact><Fact label="Current staff">{team.current.toLocaleString()} hours</Fact><Fact label="Mobility available">{team.maxMobility.toLocaleString()} hours</Fact></div><Metric label="Uncovered capacity" value={<span data-testid="team-gap">{gap.toLocaleString()} hours</span>} note={`${(gap/hoursPerFte).toFixed(1)} FTE at ${hoursPerFte} productive hours each`}/><Metric label="Planned hiring cost" value={usd(planned*team.quarterlyHireCost)} note="Estimated quarterly employer cost"/><div className="rw-flex"><button type="button" disabled={internal>=team.maxMobility} onClick={addMobility}>{internal>=team.maxMobility?'Mobility allocated':'Allocate 120 internal hours'}</button><button type="button" data-primary-action className="rw-action" aria-label="Add planned hire" onClick={addHire}>Add planned hire</button></div></aside>
    </div>
    <Source>UKG productive-hours forecast + Napta skills inventory · Planning owner: Chloe Martin</Source>
  </div>;
}
WorkforceGapPlanner.displayName='WorkforceGapPlanner';
