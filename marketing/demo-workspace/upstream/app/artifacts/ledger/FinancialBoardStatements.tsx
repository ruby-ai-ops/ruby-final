'use client';
import {useState} from 'react';
import {Badge,Source,WidgetHeader,usd,type WidgetProps} from '../workspace-primitives';
import {financialStatements,type FinancialStatement} from './fixtures';

const statementNames=Object.keys(financialStatements) as FinancialStatement[];
export function FinancialBoardStatements({scenario}:WidgetProps){
  const [statement,setStatement]=useState<FinancialStatement>('Income statement');const [line,setLine]=useState(0);const [period,setPeriod]=useState<'current'|'prior'>('current');const report=financialStatements[statement];const selected=report.rows[line]??report.rows[0];
  const total=statement==='Balance sheet'?report.rows.slice(0,2).reduce((sum,row)=>sum+row[period],0):report.rows.at(-1)![period];
  return <div className="rw lg-statements" data-widget-state={`${statement}-${line}-${period}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Board finance · Connected statements"><Badge tone="good">Reconciled</Badge></WidgetHeader>
    <div className="rw-tabs" role="tablist" aria-label="Financial statement">{statementNames.map(name=><button type="button" role="tab" key={name} data-primary-action={name==='Balance sheet'?'':undefined} aria-selected={statement===name} className={statement===name?'selected':''} onClick={()=>{setStatement(name);setLine(0);}}>{name}</button>)}<button type="button" className={period==='prior'?'selected':''} onClick={()=>setPeriod(value=>value==='current'?'prior':'current')}>{period==='current'?'Current period':'Prior period'}</button></div>
    <div className="lg-statement-check" data-testid="statement-check"><i className="fa-solid fa-scale-balanced"/><span><small>Reconciliation check</small><strong>{report.check}</strong></span></div>
    <div className="lg-statement-layout"><article className="lg-financial-sheet"><header><span><small>Ledger &amp; Co. · September 2026</small><h3>{statement}</h3></span><strong>{usd(total)}</strong></header>{report.rows.map((row,index)=><button type="button" key={row.label} className={line===index?'selected':''} onClick={()=>setLine(index)}><span>{row.label}</span><strong>{usd(row[period])}</strong><small>{period==='current'?'Prior ': 'Current '}{usd(row[period==='current'?'prior':'current'])}</small></button>)}</article>
      <aside><small>Supporting schedule</small><h4>{selected.schedule}</h4><div className="lg-statement-spark" aria-label={`${selected.label} period comparison`}><span style={{height:`${Math.max(15,Math.abs(selected.prior)/Math.max(Math.abs(selected.current),Math.abs(selected.prior))*100)}%`}}/><span style={{height:`${Math.max(15,Math.abs(selected.current)/Math.max(Math.abs(selected.current),Math.abs(selected.prior))*100)}%`}}/></div><dl><div><dt>Prior</dt><dd>{usd(selected.prior)}</dd></div><div><dt>Current</dt><dd>{usd(selected.current)}</dd></div></dl><section><small>Leadership decision</small><p>{selected.decision}</p></section></aside></div>
    <Source>Final trial balance TB-09 · Statement schedules REV-09, BS-01–03 and CF-01–03</Source>
  </div>;
}
FinancialBoardStatements.displayName='FinancialBoardStatements';
