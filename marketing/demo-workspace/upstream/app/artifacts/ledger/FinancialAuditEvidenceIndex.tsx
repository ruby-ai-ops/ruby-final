'use client';
import {useState} from 'react';
import {Badge,Metric,Source,WidgetHeader,usd,type WidgetProps} from '../workspace-primitives';
import {auditAccounts} from './fixtures';

export function FinancialAuditEvidenceIndex({scenario}:WidgetProps){
  const [selected,setSelected]=useState('AUD-CASH');const [received,setReceived]=useState(false);const account=auditAccounts.find(row=>row.id===selected)!;const complete=(row:typeof account)=>!row.missing||(row.id==='AUD-CASH'&&received);const count=auditAccounts.filter(complete).length;
  return <div className="rw lg-audit" data-widget-state={`${selected}-${received?'received':'missing'}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Financial audit · Assertion index"><Badge tone={count===auditAccounts.length?'good':'risk'}>{count===auditAccounts.length?'Cover sheet ready':'One source missing'}</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Evidence coverage" value={`${count} / ${auditAccounts.length}`} id="audit-coverage"/><Metric label="Selected balance" value={usd(account.balance)}/><Metric label="Reviewer" value={account.reviewer}/></div>
    <div className="lg-audit-layout"><nav aria-label="Audit binder index">{auditAccounts.map(row=><button type="button" key={row.id} className={selected===row.id?'selected':''} aria-pressed={selected===row.id} onClick={()=>setSelected(row.id)}><span>{row.assertion}</span><strong>{row.account}</strong><small>{row.workpaper}</small><Badge tone={complete(row)?'good':'risk'}>{complete(row)?'Complete':'Missing source'}</Badge></button>)}</nav>
      <article><header><span><small>{account.assertion} assertion</small><h3>{account.account}</h3></span><strong>{usd(account.balance)}</strong></header><dl><div><dt>Workpaper</dt><dd>{account.workpaper}</dd></div><div><dt>Source system</dt><dd>{account.source}</dd></div><div><dt>Reviewer</dt><dd>{account.reviewer}</dd></div></dl><section><small>Reconciliation conclusion</small><p>{account.reconciliation}</p></section>{account.missing&&<div className={complete(account)?'lg-audit-received':'lg-audit-missing'}><strong>{complete(account)?'Received':'Required source'}</strong><span>{account.missing}</span></div>}{account.id==='AUD-CASH'&&<button type="button" className="rw-action" data-primary-action disabled={received} aria-label={received?'Bank statement received':'Mark bank statement received'} onClick={()=>setReceived(true)}>{received?'Source linked':'Mark source received'}</button>}</article>
    </div><Source>Audit binder FY26-09 · Account balances reconcile to the final trial balance</Source>
  </div>;
}
FinancialAuditEvidenceIndex.displayName='FinancialAuditEvidenceIndex';
