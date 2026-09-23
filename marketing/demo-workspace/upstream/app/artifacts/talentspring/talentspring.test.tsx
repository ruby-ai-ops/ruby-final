import '@testing-library/jest-dom/vitest';
import {afterEach, describe, expect, it} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {scenarioLibrary} from '../../demo-scenarios';
import {
  CandidateEvidenceComparison,
  CandidateWaitingRoom,
  FirstWeekOnboardingHub,
  JobPublicationStudio,
  OfferPackageBuilder,
  PanelOverlapScheduler,
  WorkforceGapPlanner,
} from '.';

afterEach(cleanup);

const scenarios=scenarioLibrary.talentspring.scenarios;
const show=(Component:typeof CandidateEvidenceComparison,index:number)=>render(<Component scenario={scenarios[index]} platform="ruby"/>);

describe('TalentSpring purpose-built interactions',()=>{
  it('builds a shortlist from cited candidate evidence',()=>{
    show(CandidateEvidenceComparison,0);
    fireEvent.click(screen.getByRole('button',{name:'Add Maya Thompson to shortlist'}));
    expect(screen.getByTestId('shortlist-count')).toHaveTextContent('1');
    fireEvent.click(screen.getByRole('button',{name:'Review Idris Chen'}));
    expect(screen.getByTestId('candidate-evidence')).toHaveTextContent('Streaming migration');
  });

  it('books an eligible overlap and preserves its instant across time zones',()=>{
    show(PanelOverlapScheduler,1);
    fireEvent.click(screen.getByRole('button',{name:/Select Wednesday.*10:30 AM/}));
    fireEvent.click(screen.getByRole('button',{name:'Schedule interview panel'}));
    expect(screen.getByRole('status')).toHaveTextContent('Panel assembled');
    fireEvent.click(screen.getByRole('button',{name:'Pacific time'}));
    expect(screen.getByTestId('meeting-instant')).toHaveTextContent('2026-09-09T14:30:00.000Z');
  });

  it('publishes only the selected role channel',()=>{
    show(JobPublicationStudio,5);
    fireEvent.click(screen.getByRole('button',{name:'Publish Careers page'}));
    expect(screen.getByTestId('channel-status')).toHaveTextContent('Published');
    fireEvent.click(screen.getByRole('button',{name:'LinkedIn'}));
    expect(screen.getByTestId('channel-status')).toHaveTextContent('Ready');
  });

  it('moves a candidate out of the stalled waiting room',()=>{
    show(CandidateWaitingRoom,6);
    expect(screen.getByTestId('stalled-count')).toHaveTextContent('4');
    fireEvent.click(screen.getByRole('button',{name:'Schedule next step'}));
    expect(screen.getByTestId('stalled-count')).toHaveTextContent('3');
  });

  it('recalculates uncovered workforce hours when a hire is planned',()=>{
    show(WorkforceGapPlanner,7);
    expect(screen.getByTestId('team-gap')).toHaveTextContent('840');
    fireEvent.click(screen.getByRole('button',{name:'Add planned hire'}));
    expect(screen.getByTestId('team-gap')).toHaveTextContent('320');
  });

  it('updates offer cost and routes the package',()=>{
    show(OfferPackageBuilder,8);
    const before=screen.getByTestId('employer-cost').textContent;
    fireEvent.change(screen.getByLabelText('Base compensation'),{target:{value:'175000'}});
    expect(screen.getByTestId('employer-cost').textContent).not.toBe(before);
    fireEvent.click(screen.getByRole('button',{name:'Route for approval'}));
    expect(screen.getByTestId('approval-stage')).toHaveTextContent('Finance review');
  });

  it('unlocks dependent onboarding work after setup completes',()=>{
    show(FirstWeekOnboardingHub,9);
    expect(screen.getByRole('button',{name:'Enable security enrollment'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'Complete laptop setup'}));
    expect(screen.getByRole('button',{name:'Enable security enrollment'})).toBeEnabled();
  });
});
