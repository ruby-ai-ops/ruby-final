'use client';
import {useState} from 'react';
import {Badge,Metric,Source,WidgetHeader,usd,type WidgetProps} from '../workspace-primitives';
import {buildCashForecast,cashReserve} from './fixtures';

function cashPath(values:number[]){const min=Math.min(...values,cashReserve)-50000,max=Math.max(...values,cashReserve)+50000;return values.map((value,index)=>`${index?'L':'M'} ${28+index*49} ${176-((value-min)/(max-min))*132}`).join(' ');}
export function ThirteenWeekCashModel({scenario}:WidgetProps){
  const [delay,setDelay]=useState(0);const [savings,setSavings]=useState(0);const forecast=buildCashForecast(delay,savings);const lowest=Math.min(...forecast.map(week=>week.closing));const breach=forecast.find(week=>week.closing<cashReserve);
  return <div className="rw lg-cash" data-widget-state={`${delay}-${savings}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Rolling cash model · 13 weeks"><Badge tone={breach?'risk':'good'}>{breach?`Reserve breach ${breach.week}`:'Reserve protected'}</Badge></WidgetHeader>
    <div className="rw-metrics"><Metric label="Opening cash" value={usd(forecast[0].opening)}/><Metric label="Lowest balance" value={usd(lowest)}/><Metric label="Closing cash" value={usd(forecast[12].closing)}/><Metric label="First reserve breach" value={breach?`Week ${breach.week.slice(1)}`:'No breach'} id="cash-breach"/></div>
    <div className="lg-cash-controls"><label>Collection delay<strong>{delay} days</strong><select aria-label="Collection delay" value={delay} onChange={event=>setDelay(Number(event.target.value))}><option value="0">No delay</option><option value="7">7 days</option><option value="14">14 days</option></select></label><label>Weekly discretionary reduction<strong>{usd(savings)}</strong><input aria-label="Weekly discretionary reduction" type="range" min="0" max="20000" step="5000" value={savings} onChange={event=>setSavings(Number(event.target.value))}/></label><button type="button" data-primary-action onClick={()=>setDelay(7)} aria-label="Model a seven day collection delay">Stress collections by 7 days</button></div>
    <div className="lg-cash-chart"><svg aria-label="Thirteen week closing cash forecast" viewBox="0 0 660 210"><line x1="26" y1="126" x2="632" y2="126" className="lg-reserve-line"/><text x="32" y="119">$250k reserve</text><path d={cashPath(forecast.map(week=>week.closing))}/>{forecast.map((week,index)=><g key={week.week}><circle cx={28+index*49} cy={176-((week.closing-(Math.min(...forecast.map(item=>item.closing),cashReserve)-50000))/((Math.max(...forecast.map(item=>item.closing),cashReserve)+50000)-(Math.min(...forecast.map(item=>item.closing),cashReserve)-50000)))*132} r="4"/><text x={28+index*49} y="201" textAnchor="middle">{week.week}</text></g>)}</svg></div>
    <div className="rw-table-wrap"><table><thead><tr><th>Week</th><th>Opening</th><th>Receipts</th><th>Payments</th><th>Closing</th></tr></thead><tbody>{forecast.map(week=><tr key={week.week}><th scope="row">{week.week}</th><td>{usd(week.opening)}</td><td className="good-text">+{usd(week.receipts)}</td><td>−{usd(week.payments)}</td><td className={week.closing<cashReserve?'risk-text':''}><strong>{usd(week.closing)}</strong></td></tr>)}</tbody></table></div>
    <Source>Opening + receipts − payments = closing cash · Each closing balance becomes the next week’s opening balance</Source>
  </div>;
}
ThirteenWeekCashModel.displayName='ThirteenWeekCashModel';
