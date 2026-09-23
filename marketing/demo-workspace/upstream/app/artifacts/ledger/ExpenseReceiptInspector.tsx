'use client';
import {useState} from 'react';
import {Badge,Metric,Source,WidgetHeader,usd,type WidgetProps} from '../workspace-primitives';
import {expenses} from './fixtures';

export function ExpenseReceiptInspector({scenario}:WidgetProps){
  const [selected,setSelected]=useState(expenses[0].id);const [cleared,setCleared]=useState<Set<string>>(new Set());const expense=expenses.find(row=>row.id===selected)!;const isCleared=cleared.has(expense.id);
  return <div className="rw lg-expense" data-widget-state={`${selected}-${[...cleared].sort().join(',')}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Reimbursement review · Receipt evidence"><Badge tone="risk">{expenses.length-cleared.size} exceptions</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Claims reviewed" value={expenses.length}/><Metric label="Open exceptions" value={expenses.length-cleared.size} id="expense-open"/><Metric label="Selected amount" value={usd(expense.amount)}/></div>
    <div className="lg-expense-layout"><nav aria-label="Expense exceptions">{expenses.map(row=><button type="button" key={row.id} className={selected===row.id?'selected':''} aria-pressed={selected===row.id} onClick={()=>setSelected(row.id)}><span><strong>{row.merchant}</strong><small>{row.id} · {row.employee}</small></span><b>{usd(row.amount)}</b></button>)}</nav>
      <article className="lg-receipt" aria-label={`Receipt for ${expense.merchant}`}><span>RECEIPT</span><h3>{expense.merchant}</h3><p>{expense.date}</p>{expense.lines.map(line=><div key={line.label}><span>{line.label}</span><strong>{usd(line.amount)}</strong></div>)}<div className="lg-receipt-total"><span>Total</span><strong>{usd(expense.amount)}</strong></div></article>
      <aside><small>Triggered policy check</small><h4>{expense.policy}</h4><p>{expense.reason}</p><dl><div><dt>Category</dt><dd>{expense.category}</dd></div><div><dt>Review owner</dt><dd>{expense.owner}</dd></div></dl><button type="button" className="rw-action" data-primary-action disabled={isCleared} aria-label={isCleared?'Exception cleared':'Clear supported exception'} onClick={()=>setCleared(current=>new Set(current).add(expense.id))}>{isCleared?'Exception cleared':'Clear with evidence'}</button></aside>
    </div><Source>Expense ledger · Receipt archive · Finance policy controls FIN-08, FIN-14 and FIN-22</Source>
  </div>;
}
ExpenseReceiptInspector.displayName='ExpenseReceiptInspector';
