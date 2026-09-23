import {describe,expect,it} from 'vitest';
import {
  allocateCloudSpend,
  buildCashForecast,
  cloudInvoiceTotal,
  duplicatePairs,
  heldDuplicateTotal,
  reconcileRevenue,
} from './fixtures';

describe('Ledger financial fixture calculations',()=>{
  it('chains every cash opening balance from the prior closing balance',()=>{
    const forecast=buildCashForecast(0,0);
    expect(forecast).toHaveLength(13);
    forecast.slice(1).forEach((week,index)=>expect(week.opening).toBe(forecast[index].closing));
    forecast.forEach(week=>expect(week.closing).toBe(week.opening+week.receipts-week.payments));
  });

  it('moves collections later and applies weekly discretionary savings to every week',()=>{
    const baseline=buildCashForecast(0,0);
    const stressed=buildCashForecast(7,10000);
    expect(stressed[0].receipts).toBe(0);
    expect(stressed[1].receipts).toBe(baseline[0].receipts);
    expect(stressed[0].payments).toBe(baseline[0].payments-10000);
    expect(stressed[12].payments).toBe(baseline[12].payments-10000);
  });

  it('preserves the cloud invoice total after changing allocation weights',()=>{
    const allocations=allocateCloudSpend({Product:5,Data:2,Operations:1});
    expect(allocations.reduce((sum,row)=>sum+row.allocated,0)).toBe(cloudInvoiceTotal);
    expect(allocations.find(row=>row.team==='Product')?.shared).toBe(75000);
  });

  it('counts only one extra payable per held duplicate pair',()=>{
    expect(heldDuplicateTotal(new Set(duplicatePairs.map(pair=>pair.id)))).toBe(37240);
    expect(heldDuplicateTotal(new Set([duplicatePairs[0].id,duplicatePairs[0].id]))).toBe(18400);
  });

  it('moves supported timing differences from unexplained to accounted variance',()=>{
    const before=reconcileRevenue(new Set());
    const after=reconcileRevenue(new Set(['TX-8841']));
    expect(before.expected).toBe(668650);
    expect(before.unexplained).toBe(7000);
    expect(after.accounted).toBe(before.accounted+4300);
    expect(after.unexplained).toBe(2700);
  });
});
