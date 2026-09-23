'use client';
import {useState} from 'react';
import {Badge,Metric,Source,WidgetHeader,usd,type WidgetProps} from '../workspace-primitives';
import {allocateCloudSpend,cloudInvoiceTotal,sharedCloudSpend,type CloudTeam} from './fixtures';

const teams:CloudTeam[]=['Product','Data','Operations'];
export function CloudChargebackLedger({scenario}:WidgetProps){
  const [weights,setWeights]=useState<Record<CloudTeam,number>>({Product:3,Data:2,Operations:1});const [selected,setSelected]=useState<CloudTeam>('Product');const rows=allocateCloudSpend(weights);const detail=rows.find(row=>row.team===selected)!;const variance=detail.allocated-detail.plan;
  return <div className="rw lg-cloud" data-widget-state={`${selected}-${teams.map(team=>weights[team]).join(':')}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Cloud chargeback · Invoice-conserving allocation"><Badge tone="info">Shared usage weights</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Invoice total" value={usd(rows.reduce((sum,row)=>sum+row.allocated,0))} id="cloud-total"/><Metric label="Direct usage" value={usd(cloudInvoiceTotal-sharedCloudSpend)}/><Metric label="Shared platform" value={usd(sharedCloudSpend)}/><Metric label="Product shared" value={usd(rows[0].shared)} id="cloud-product-shared"/></div>
    <div className="lg-cloud-main"><section className="lg-cloud-weights"><h4>Shared-cost usage weights</h4>{teams.map(team=><label key={team}>{team}<strong>{weights[team]}</strong><input aria-label={`${team} allocation weight`} type="range" min="0" max="8" value={weights[team]} onChange={event=>setWeights(current=>({...current,[team]:Number(event.target.value)}))}/></label>)}<button type="button" data-primary-action aria-label="Apply product-led usage weights" onClick={()=>setWeights({Product:5,Data:2,Operations:1})}>Apply 5 : 2 : 1 usage</button><p>Allocated rows always reconcile to {usd(cloudInvoiceTotal)}.</p></section>
      <section className="lg-cloud-bridge"><small>{selected} · Plan-to-actual bridge</small><div><span>Plan<strong>{usd(detail.plan)}</strong></span><i>+</i><span>Direct usage<strong>{usd(detail.direct)}</strong></span><i>+</i><span>Shared services<strong>{usd(detail.shared)}</strong></span><i>=</i><span>Actual<strong>{usd(detail.allocated)}</strong></span></div><p>{variance>=0?`${usd(Math.abs(variance))} above plan`:`${usd(Math.abs(variance))} below plan`} · {selected==='Product'?'GPU inference and build runners':selected==='Data'?'Warehouse compute and model training':'Shared observability and storage'}</p></section></div>
    <div className="rw-table-wrap"><table><thead><tr><th>Team</th><th>Direct</th><th>Shared allocation</th><th>Actual</th><th>Plan / Variance</th></tr></thead><tbody>{rows.map(row=><tr key={row.team} className={selected===row.team?'is-selected':''}><th scope="row"><button type="button" aria-label={`Inspect ${row.team} costs`} onClick={()=>setSelected(row.team)}>{row.team}</button></th><td>{usd(row.direct)}</td><td>{usd(row.shared)}</td><td><strong>{usd(row.allocated)}</strong></td><td>{usd(row.plan)}<small className={row.allocated>row.plan?'risk-text':'good-text'}>{row.allocated>row.plan?'+':''}{usd(row.allocated-row.plan)}</small></td></tr>)}</tbody></table></div>
    <Source>Cloud invoice INV-0904 · Direct tags plus shared platform weights · Allocation total is conserved</Source>
  </div>;
}
CloudChargebackLedger.displayName='CloudChargebackLedger';
