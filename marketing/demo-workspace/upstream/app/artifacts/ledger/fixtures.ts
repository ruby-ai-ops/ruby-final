import type {RebuiltContent} from '../content-types';

export type CloseTask={id:string;label:string;account:string;owner:string;hours:number;dependsOn:string[];evidence:string;complete:boolean};
export const closeTasks:CloseTask[]=[
  {id:'cash',label:'Post cash receipts',account:'1000 · Operating cash',owner:'Amelia Ross',hours:0,dependsOn:[],evidence:'NetSuite cash posting batch NS-0904',complete:true},
  {id:'revenue',label:'Tie revenue subledger',account:'4000 · Store revenue',owner:'Jon Bell',hours:0,dependsOn:[],evidence:'Settlement workbook REV-SEP',complete:true},
  {id:'bank',label:'Reconcile clearing account',account:'1015 · Card clearing',owner:'Amelia Ross',hours:2.5,dependsOn:['cash','revenue'],evidence:'Missing Sep 4 processor settlement detail',complete:false},
  {id:'consolidate',label:'Run consolidated trial balance',account:'All entities',owner:'Jon Bell',hours:2,dependsOn:['bank'],evidence:'TB control can run after 1015 clears',complete:false},
  {id:'tax',label:'Release tax provision',account:'2205 · Tax payable',owner:'Amelia Ross',hours:1,dependsOn:['consolidate'],evidence:'Provision schedule TAX-09',complete:false},
];
export function closeProjection(bankEvidenceReceived:boolean){
  const remaining=closeTasks.filter(task=>!task.complete).reduce((sum,task)=>sum+task.hours,0);
  return {remainingHours:remaining,finish:bankEvidenceReceived?'Friday 4:30 PM':'Monday 10:30 AM',readyByFriday:bankEvidenceReceived,waitHours:bankEvidenceReceived?0:24};
}

export type CashWeek={week:string;opening:number;receipts:number;payments:number;closing:number};
const weeklyCash=[
  ['W1',210000,190000],['W2',180000,235000],['W3',260000,205000],['W4',215000,250000],['W5',240000,230000],['W6',195000,265000],['W7',275000,215000],
  ['W8',205000,245000],['W9',230000,225000],['W10',250000,260000],['W11',210000,230000],['W12',280000,240000],['W13',235000,255000],
] as const;
export const cashReserve=250000;
export function buildCashForecast(collectionDelayDays:number,weeklySavings:number):CashWeek[]{
  const shift=Math.max(0,Math.round(collectionDelayDays/7));
  let opening=420000;
  return weeklyCash.map(([week,,basePayments],index)=>{
    const receipts=index-shift>=0?weeklyCash[index-shift][1]:0;
    const payments=Math.max(0,basePayments-Math.max(0,weeklySavings));
    const closing=opening+receipts-payments;
    const row={week,opening,receipts,payments,closing};
    opening=closing;
    return row;
  });
}

export type ExpenseRecord={id:string;employee:string;merchant:string;date:string;amount:number;category:string;policy:string;reason:string;lines:{label:string;amount:number}[];owner:string};
export const expenses:ExpenseRecord[]=[
  {id:'EXP-4481',employee:'Mina Cole',merchant:'Northstar Hotel',date:'Sep 2, 2026',amount:842,category:'Client travel',policy:'FIN-14 · Lodging cap',reason:'Nightly room rate is $126 above the approved city cap.',lines:[{label:'Room · 2 nights',amount:700},{label:'Tax and fees',amount:142}],owner:'Amelia Ross'},
  {id:'EXP-4493',employee:'Rene Park',merchant:'Cloud Nine Bistro',date:'Sep 3, 2026',amount:486,category:'Team meal',policy:'FIN-08 · Meal attendees',reason:'Receipt has six meals but only four attendees are recorded.',lines:[{label:'Food and beverages',amount:432},{label:'Service',amount:54}],owner:'Jon Bell'},
  {id:'EXP-4502',employee:'Mina Cole',merchant:'Metro Office Supply',date:'Sep 3, 2026',amount:1240,category:'Equipment',policy:'FIN-22 · Duplicate evidence',reason:'Amount and merchant match expense EXP-4469 from two days earlier.',lines:[{label:'Two monitors',amount:1100},{label:'Delivery and tax',amount:140}],owner:'Amelia Ross'},
];

export type CloudTeam='Product'|'Data'|'Operations';
export const cloudDirect:Record<CloudTeam,number>={Product:180000,Data:132000,Operations:96000};
export const sharedCloudSpend=120000;
export const cloudInvoiceTotal=Object.values(cloudDirect).reduce((sum,value)=>sum+value,0)+sharedCloudSpend;
export function allocateCloudSpend(weights:Record<CloudTeam,number>){
  const totalWeight=Math.max(1,Object.values(weights).reduce((sum,value)=>sum+Math.max(0,value),0));
  let allocatedShared=0;
  return (Object.keys(cloudDirect) as CloudTeam[]).map((team,index,teams)=>{
    const shared=index===teams.length-1?sharedCloudSpend-allocatedShared:Math.round(sharedCloudSpend*Math.max(0,weights[team])/totalWeight);
    allocatedShared+=shared;
    return {team,direct:cloudDirect[team],shared,allocated:cloudDirect[team]+shared,plan:{Product:224000,Data:168000,Operations:108000}[team]};
  });
}

export type AuditAccount={id:string;assertion:string;account:string;balance:number;workpaper:string;source:string;reviewer:string;missing?:string;reconciliation:string};
export const auditAccounts:AuditAccount[]=[
  {id:'AUD-REV',assertion:'Occurrence',account:'4000 · Store revenue',balance:668650,workpaper:'REV-09 settlement tie-out',source:'Stripe + Shopify exports',reviewer:'Jon Bell',reconciliation:'Captured sales less refunds, fees and chargebacks agrees to the revenue settlement control.'},
  {id:'AUD-CASH',assertion:'Existence',account:'1000 · Operating cash',balance:1245300,workpaper:'CASH-09 bank reconciliation',source:'NetSuite cash ledger',reviewer:'Amelia Ross',missing:'Sep 4 bank statement',reconciliation:'Ledger cash is reconciled; final statement evidence is outstanding.'},
  {id:'AUD-AP',assertion:'Completeness',account:'2000 · Accounts payable',balance:412880,workpaper:'AP-09 subsequent disbursements',source:'NetSuite AP detail',reviewer:'Amelia Ross',reconciliation:'Subsequent payments were traced to the payable population.'},
  {id:'AUD-PAY',assertion:'Accuracy',account:'6100 · Payroll expense',balance:286400,workpaper:'PAY-09 payroll rollforward',source:'Payroll register',reviewer:'Jon Bell',reconciliation:'Payroll register agrees to the general ledger and approved headcount.'},
];

export type FinancialStatement='Income statement'|'Balance sheet'|'Cash flow';
export const financialStatements:Record<FinancialStatement,{check:string;rows:{label:string,current:number,prior:number,schedule:string,decision:string}[]}>= {
  'Income statement':{check:'Net income agrees to retained earnings movement: $184,250',rows:[
    {label:'Revenue',current:1248000,prior:1174000,schedule:'REV-09 · Revenue by store',decision:'No decision — 6.3% growth is within plan.'},
    {label:'Gross profit',current:712000,prior:654000,schedule:'COGS-09 · Margin bridge',decision:'Protect 57.1% gross margin while vendor pricing resets.'},
    {label:'Operating expenses',current:527750,prior:498400,schedule:'OPEX-09 · Department detail',decision:'Approve the $18,000 hiring deferral.'},
    {label:'Net income',current:184250,prior:155600,schedule:'TB-09 · Consolidated trial balance',decision:'Retain earnings for the Q4 inventory commitment.'},
  ]},
  'Balance sheet':{check:'Assets equal liabilities plus equity: $2,816,400',rows:[
    {label:'Cash and receivables',current:1686300,prior:1515400,schedule:'BS-01 · Cash and AR detail',decision:'Maintain the $250,000 minimum cash reserve.'},
    {label:'Inventory and other assets',current:1130100,prior:1088400,schedule:'BS-02 · Inventory aging',decision:'Release $96,000 of slow-moving inventory.'},
    {label:'Liabilities',current:987150,prior:932250,schedule:'BS-03 · Liability rollforward',decision:'Hold the duplicate payable exceptions.'},
    {label:'Equity',current:1829250,prior:1671550,schedule:'EQ-09 · Retained earnings',decision:'No distribution is proposed this period.'},
  ]},
  'Cash flow':{check:'Opening cash plus net cash movement equals closing cash: $1,245,300',rows:[
    {label:'Operating cash flow',current:238500,prior:196200,schedule:'CF-01 · Operating cash bridge',decision:'Accelerate the two overdue enterprise collections.'},
    {label:'Investing cash flow',current:-74000,prior:-52000,schedule:'CF-02 · Capital purchases',decision:'Defer $20,000 of noncritical equipment.'},
    {label:'Financing cash flow',current:0,prior:-25000,schedule:'CF-03 · Financing activity',decision:'No financing action is required.'},
    {label:'Closing cash',current:1245300,prior:1080800,schedule:'CASH-09 · Bank reconciliation',decision:'Keep the forecast above the $250,000 reserve.'},
  ]},
};

export type DuplicatePair={id:string;vendor:string;match:string;original:{invoice:string;date:string;amount:number;status:string};duplicate:{invoice:string;date:string;amount:number;status:string};owner:string};
export const duplicatePairs:DuplicatePair[]=[
  {id:'DUP-41',vendor:'Blue Harbor Freight',match:'Same vendor, amount and invoice digits; one scan includes a leading zero.',original:{invoice:'BHF-7718',date:'Aug 28',amount:18400,status:'Approved'},duplicate:{invoice:'BHF-07718',date:'Sep 2',amount:18400,status:'In payment run'},owner:'Amelia Ross'},
  {id:'DUP-52',vendor:'Northline Packaging',match:'Same purchase order and amount submitted through email and supplier portal.',original:{invoice:'NP-4401',date:'Aug 30',amount:12600,status:'Approved'},duplicate:{invoice:'NP-4401-COPY',date:'Sep 3',amount:12600,status:'In payment run'},owner:'Jon Bell'},
  {id:'DUP-64',vendor:'Metro Facilities',match:'Credit-card payable duplicates an invoice already posted to accounts payable.',original:{invoice:'MF-9082',date:'Sep 1',amount:6240,status:'Approved'},duplicate:{invoice:'CARD-MF-9082',date:'Sep 2',amount:6240,status:'In payment run'},owner:'Amelia Ross'},
];
export const basePaymentRun=312450;
export function heldDuplicateTotal(held:Set<string>){return duplicatePairs.filter(pair=>held.has(pair.id)).reduce((sum,pair)=>sum+pair.duplicate.amount,0);}

export type RevenueTransaction={id:string;processor:'Stripe'|'Shopify';status:'Timing'|'Unresolved';date:string;amount:number;reason:string;source:string};
export const revenueTransactions:RevenueTransaction[]=[
  {id:'TX-8841',processor:'Stripe',status:'Timing',date:'Sep 4',amount:4300,reason:'Settlement initiated after the bank cut-off; processor batch is supported.',source:'Stripe batch ST-0904-18'},
  {id:'TX-8852',processor:'Shopify',status:'Unresolved',date:'Sep 4',amount:1800,reason:'Store deposit has no matching settlement identifier.',source:'Shopify order export'},
  {id:'TX-8860',processor:'Stripe',status:'Unresolved',date:'Sep 4',amount:900,reason:'Chargeback fee is absent from the processor fee detail.',source:'Stripe dispute export'},
];
export const revenueEquation={captured:728400,refunds:32400,fees:19250,chargebacks:8100,bankReceipts:652650,unsettled:9000};
export function reconcileRevenue(accountedTiming:Set<string>){
  const expected=revenueEquation.captured-revenueEquation.refunds-revenueEquation.fees-revenueEquation.chargebacks;
  const timing=revenueTransactions.filter(tx=>accountedTiming.has(tx.id)).reduce((sum,tx)=>sum+tx.amount,0);
  const accounted=revenueEquation.bankReceipts+revenueEquation.unsettled+timing;
  return {expected,accounted,unexplained:expected-accounted,timing};
}

export const ledgerContent:Record<string,RebuiltContent>={
  'ledger-month-end-command':{kind:'timeline',summary:'The card-clearing reconciliation is the only blocker preventing a Friday close.',explanation:'Receiving the Sep 4 processor settlement detail removes a 24-hour evidence wait and leaves 5.5 hours of dependent close work.',intro:'Trace the close dependency path and resolve the blocking evidence.',actions:['Mapped close account dependencies','Verified completed account evidence','Assigned the clearing-account blocker']},
  'ledger-cash-forecast':{kind:'chart',summary:'The baseline 13-week forecast stays above the $250,000 reserve and closes at $360,000.',explanation:'Every week rolls its prior closing balance forward. Collection delay moves receipts to later weeks while discretionary savings reduce weekly payments.',intro:'Change the collection and spending assumptions to test cash resilience.',actions:['Reconciled weekly cash sources','Modeled collection timing sensitivities','Published the rolling cash forecast']},
  'ledger-expense-anomaly':{kind:'record',summary:`${expenses.length} expense claims need review against a specific finance-policy control.`,explanation:'The review links each ledger record to a readable receipt and states the exact cap, attendee or duplicate-evidence exception.',intro:'Select an expense to inspect its receipt and policy evidence.',actions:['Matched expenses to receipts','Applied exact policy checks','Assigned reimbursement reviews']},
  'ledger-cloud-cost-allocation':{kind:'dashboard',summary:`The ${cloudInvoiceTotal.toLocaleString('en-US')} dollar cloud invoice includes ${sharedCloudSpend.toLocaleString('en-US')} dollars of shared platform spend.`,explanation:'Shared spend is distributed by explicit usage weights; changing weights reallocates cost without changing the invoice total.',intro:'Adjust usage weights and inspect the team-level variance drivers.',actions:['Reconciled the cloud invoice','Allocated shared platform costs','Prepared team variance explanations']},
  'ledger-audit-evidence-binder':{kind:'table',summary:'Three of four sampled financial assertions have complete source evidence. Operating cash still needs the Sep 4 bank statement.',explanation:'Each index entry connects an account balance, assertion, workpaper, source system and reviewer sign-off.',intro:'Select an account to review its reconciliation and complete the missing source.',actions:['Indexed account-level workpapers','Linked authoritative source evidence','Prepared reviewer cover-sheet status']},
  'ledger-board-reporting':{kind:'document',summary:'The board finance report connects the income statement, balance sheet and cash-flow statement to their supporting schedules.',explanation:'Statement checks reconcile net income, the accounting equation and closing cash before leadership decisions are presented.',intro:'Choose a statement and material line to inspect its schedule and decision.',actions:['Reconciled connected statements','Linked material supporting schedules','Prepared leadership finance decisions']},
  'ledger-duplicate-ap-detection':{kind:'table',summary:`Three duplicate payable pairs put ${heldDuplicateTotal(new Set(duplicatePairs.map(pair=>pair.id))).toLocaleString('en-US')} dollars at risk in the payment run.`,explanation:'Prevention counts the extra payable once per pair. Holding an exception reduces the payment run by only the duplicate invoice amount.',intro:'Compare each invoice pair and hold the duplicate before payment.',actions:['Matched duplicate payable evidence','Calculated preventable payment value','Assigned payment-hold ownership']},
  'ledger-revenue-reconciliation':{kind:'table',summary:'Expected settled revenue is $668,650. Bank receipts and known unsettled balances leave $7,000 to classify.',explanation:'A supported $4,300 processor timing item can move from unexplained to accounted variance without changing captured sales or cash.',intro:'Filter the settlement records and classify supported timing differences.',actions:['Rebuilt the revenue equation','Matched processor settlement records','Assigned unresolved cash differences']},
};
