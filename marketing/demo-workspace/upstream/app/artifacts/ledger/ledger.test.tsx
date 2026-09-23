import '@testing-library/jest-dom/vitest';
import {afterEach,describe,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {scenarioLibrary} from '../../demo-scenarios';
import {
  CloseDependencyPath,
  ThirteenWeekCashModel,
  ExpenseReceiptInspector,
  CloudChargebackLedger,
  FinancialAuditEvidenceIndex,
  FinancialBoardStatements,
  PayableDuplicateReview,
  RevenueSettlementReconciler,
} from './index';

afterEach(cleanup);
const ledger=scenarioLibrary.ledger.scenarios;
const props=(index:number)=>({scenario:ledger[index],platform:'ruby' as const});

describe('Ledger purpose-built widgets',()=>{
  it('recalculates Friday close readiness after the missing evidence arrives',()=>{
    render(<CloseDependencyPath {...props(0)}/>);
    expect(screen.getByTestId('close-finish')).toHaveTextContent('Monday 10:30 AM');
    fireEvent.click(screen.getByRole('button',{name:'Resolve reconciliation evidence'}));
    expect(screen.getByTestId('close-finish')).toHaveTextContent('Friday 4:30 PM');
  });

  it('updates the 13-week reserve signal when collections move',()=>{
    render(<ThirteenWeekCashModel {...props(2)}/>);
    expect(screen.getByTestId('cash-breach')).toHaveTextContent('No breach');
    fireEvent.click(screen.getByRole('button',{name:'Model a seven day collection delay'}));
    expect(screen.getByTestId('cash-breach')).toHaveTextContent('Week 1');
  });

  it('clears an expense exception only once',()=>{
    render(<ExpenseReceiptInspector {...props(3)}/>);
    expect(screen.getByTestId('expense-open')).toHaveTextContent('3');
    fireEvent.click(screen.getByRole('button',{name:'Clear supported exception'}));
    expect(screen.getByTestId('expense-open')).toHaveTextContent('2');
    expect(screen.getByRole('button',{name:'Exception cleared'})).toBeDisabled();
  });

  it('reallocates shared cloud cost while preserving the invoice total',()=>{
    render(<CloudChargebackLedger {...props(4)}/>);
    expect(screen.getByTestId('cloud-total')).toHaveTextContent('$528,000');
    fireEvent.click(screen.getByRole('button',{name:'Apply product-led usage weights'}));
    expect(screen.getByTestId('cloud-product-shared')).toHaveTextContent('$75,000');
    expect(screen.getByTestId('cloud-total')).toHaveTextContent('$528,000');
  });

  it('completes the audit index and readies the cover sheet',()=>{
    render(<FinancialAuditEvidenceIndex {...props(5)}/>);
    expect(screen.getByTestId('audit-coverage')).toHaveTextContent('3 / 4');
    fireEvent.click(screen.getByRole('button',{name:'Mark bank statement received'}));
    expect(screen.getByTestId('audit-coverage')).toHaveTextContent('4 / 4');
    expect(screen.getByText('Cover sheet ready')).toBeInTheDocument();
  });

  it('switches the connected board statement and supporting decision',()=>{
    render(<FinancialBoardStatements {...props(6)}/>);
    fireEvent.click(screen.getByRole('tab',{name:'Balance sheet'}));
    expect(screen.getByTestId('statement-check')).toHaveTextContent('Assets equal liabilities plus equity');
  });

  it('counts the held duplicate once in the payment run',()=>{
    render(<PayableDuplicateReview {...props(7)}/>);
    fireEvent.click(screen.getByRole('button',{name:'Hold duplicate payable'}));
    expect(screen.getByTestId('duplicates-prevented')).toHaveTextContent('$18,400');
    expect(screen.getByTestId('payment-run')).toHaveTextContent('$294,050');
  });

  it('reclassifies supported settlement timing without changing expected revenue',()=>{
    render(<RevenueSettlementReconciler {...props(8)}/>);
    expect(screen.getByTestId('revenue-expected')).toHaveTextContent('$668,650');
    fireEvent.click(screen.getByRole('button',{name:'Mark as supported timing difference'}));
    expect(screen.getByTestId('revenue-unexplained')).toHaveTextContent('$2,700');
    expect(screen.getByTestId('revenue-expected')).toHaveTextContent('$668,650');
  });
});
