import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { scenarioLibrary } from '../../demo-scenarios';
import {
  BrokerCallCoaching,
  CatastropheOperationsMap,
  ClaimDeadlineRescue,
  ClaimEvidenceConnections,
  ClaimsProcessControlGate,
  ClientRiskServiceReview,
  CoverageChangeComparator,
  StormClaimAssignment,
} from '.';

afterEach(cleanup);

const scenarios = scenarioLibrary.cedarshield.scenarios;
const props = (index: number) => ({ scenario: scenarios[index], platform: 'ruby' as const });

describe('CedarShield purpose-built interactions', () => {
  it('assigns a compatible adjuster and updates workload totals', () => {
    render(<StormClaimAssignment {...props(0)} />);
    expect(screen.getByText('3 unassigned')).toBeInTheDocument();
    expect(screen.getByText(/Residential roof experience/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Assign Sasha Green' }));
    expect(screen.getByText('2 unassigned')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Assigned to Sasha Green' })).toBeDisabled();
  });

  it('exposes the cited record behind an evidence connection', () => {
    render(<ClaimEvidenceConnections {...props(2)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Inspect connection between CL-7731 and 18 Harbor Lane' }));
    expect(screen.getByText(/shared with an earlier plumbing claim/)).toBeInTheDocument();
    expect(screen.getByText(/Policy administration address history/)).toBeInTheDocument();
  });

  it('filters unchanged policy rows and changes the impact evidence', () => {
    render(<CoverageChangeComparator {...props(3)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show material changes only' }));
    expect(screen.queryByRole('button', { name: 'Equipment breakdown' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Water backup' }));
    expect(screen.getByText(/covered \$42,500 water-backup loss/)).toBeInTheDocument();
  });

  it('keeps process approval gated until evidence is attached', () => {
    render(<ClaimsProcessControlGate {...props(5)} />);
    expect(screen.getByRole('button', { name: 'Approve sample launch' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Customer notice/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Attach signed notice evidence' }));
    fireEvent.click(screen.getByRole('button', { name: 'Approve sample launch' }));
    expect(screen.getByText('Approved for demo launch')).toBeInTheDocument();
  });

  it('updates catastrophe resources from the selected region', () => {
    render(<CatastropheOperationsMap {...props(6)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show Lower Cape Fear inland' }));
    expect(screen.getByText('Elizabethtown field office')).toBeInTheDocument();
    expect(screen.getByText('Primary roads open')).toBeInTheDocument();
  });

  it('reassigns an at-risk deadline and recalculates achievable commitments', () => {
    render(<ClaimDeadlineRescue {...props(7)} />);
    expect(screen.getByText('2 of 4 achievable')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Apply reassignment' }));
    expect(screen.getByText('3 of 4 achievable')).toBeInTheDocument();
  });

  it('changes the client loss evidence by asset class', () => {
    render(<ClientRiskServiceReview {...props(8)} />);
    fireEvent.click(screen.getByRole('button', { name: /Fleet vehicles/ }));
    expect(screen.getByText(/Expand sheltered parking/)).toBeInTheDocument();
    expect(screen.getAllByText('$172,000')).toHaveLength(2);
  });

  it('assigns practice to the selected broker skill once', () => {
    render(<BrokerCallCoaching {...props(9)} />);
    fireEvent.click(screen.getByRole('button', { name: /Set a precise next step/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Assign practice' }));
    expect(screen.getByRole('button', { name: 'Practice assigned' })).toBeDisabled();
    expect(screen.getByText('1 practice task assigned')).toBeInTheDocument();
  });
});
