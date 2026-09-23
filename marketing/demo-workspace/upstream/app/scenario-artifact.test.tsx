import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { scenarioLibrary } from './demo-scenarios';
import * as artifacts from './artifacts/registry';
import { artifactComponentNames, artifactRegistry } from './artifacts/registry';
import { ScenarioArtifact } from './scenario-artifact';

afterEach(cleanup);

const scenarios = Object.values(scenarioLibrary).flatMap((workspace) => workspace.scenarios);
const artifactScenarios = scenarios.filter((scenario) => scenario.copy.presentation === 'artifact');

describe('ScenarioArtifact', () => {
  it('registers only artifact-presented scenarios and uses real reviewed overrides', () => {
    expect(Object.keys(artifactRegistry)).toHaveLength(84);
    expect(artifactComponentNames).toHaveLength(84);
    expect(artifactComponentNames.every(Boolean)).toBe(true);
    expect(artifactRegistry['everglade-freight-cost-spike'].displayName).toBe('FreightLaneVarianceChart');
    expect(artifactRegistry['northstar-litigation-chronology'].displayName).toBe('DawsonChronology');
    expect(artifactRegistry['meadow-batch-traceability'].displayName).toBe('LotLineageTrace');
    expect(artifactRegistry['meadow-quality-deviation']).toBeUndefined();
  });

  it('renders nothing when a text-first scenario has no artifact entry', () => {
    for (const scenario of [scenarioLibrary.meadow.scenarios[0], scenarioLibrary.stonebridge.scenarios[0], scenarioLibrary.loom.scenarios[2]]) {
      const view = render(<ScenarioArtifact scenario={scenario} platform="ruby" />);
      expect(view.container).toBeEmptyDOMElement();
      view.unmount();
    }
  });

  it('gives every interactive artifact a working primary interaction', () => {
    for (const scenario of artifactScenarios.filter((item) => item.artifactBehavior === 'interactive')) {
      const view = render(<ScenarioArtifact scenario={scenario} platform="ruby" />);
      const widget = view.container.querySelector('[data-widget-state]');
      const action = view.container.querySelector<HTMLElement>('[data-primary-action]');
      expect(widget, scenario.id).toBeInTheDocument();
      expect(action, scenario.id).toBeInTheDocument();
      const before = widget?.getAttribute('data-widget-state');
      if (action instanceof HTMLInputElement && action.type === 'range') {
        fireEvent.change(action, { target: { value: String(Number(action.value) + Number(action.step || 1)) } });
      } else {
        fireEvent.click(action!);
      }
      expect(widget?.getAttribute('data-widget-state'), scenario.id).not.toBe(before);
      view.unmount();
    }
  });

  it('uses a broad artifact vocabulary instead of repeating a few card layouts', () => {
    const visualSystems = new Set<string>();
    for (const scenario of artifactScenarios) {
      const view = render(<ScenarioArtifact scenario={scenario} platform="ruby" />);
      const widget = view.container.querySelector('[data-widget-state]');
      visualSystems.add(widget?.className ?? '');
      view.unmount();
    }
    expect(visualSystems.size).toBeGreaterThanOrEqual(20);
  });

  it('renders the logistics hero as a real map with traffic and assignments', () => {
    const scenario = scenarioLibrary.everglade.scenarios[0];
    const { container } = render(<ScenarioArtifact scenario={scenario} platform="ruby" />);

    expect(screen.getByTitle('Google Maps fleet traffic')).toHaveAttribute('src', expect.stringContaining('google.com/maps'));
    expect(container.querySelector('.bespoke-map-routes')).toBeInTheDocument();
    expect(container.querySelector('.bespoke-assignment-table')).toBeInTheDocument();
  });

  it('focuses the fleet map on the selected road corridor', () => {
    render(<ScenarioArtifact scenario={scenarioLibrary.everglade.scenarios[0]} platform="ruby" />);
    expect(screen.getByTitle('Google Maps fleet traffic')).toHaveAttribute('src', expect.stringContaining('Interstate%2090'));
    fireEvent.click(screen.getByRole('button', { name: /Lowest risk/ }));
    expect(screen.getByTitle('Google Maps fleet traffic')).toHaveAttribute('src', expect.stringContaining('Interstate%20294'));
    fireEvent.click(screen.getByRole('button', { name: /Least overtime/ }));
    expect(screen.getByTitle('Google Maps fleet traffic')).toHaveAttribute('src', expect.stringContaining('Interstate%2055'));
  });

  it('keeps route decisions usable when the map embed fails', () => {
    const scenario = scenarioLibrary.everglade.scenarios[0];
    render(<ScenarioArtifact scenario={scenario} platform="ruby" />);
    fireEvent.error(screen.getByTitle('Google Maps fleet traffic'));
    expect(screen.getByText('Map unavailable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lowest risk/ })).toBeInTheDocument();
  });

  it('does not expose generic artifact metadata or repeated response labels', () => {
    const scenario = scenarioLibrary.vector.scenarios[2];
    render(<ScenarioArtifact scenario={scenario} platform="ruby" />);
    expect(screen.queryByText(/Demo data|Updated just now|What Ruby changed/i)).not.toBeInTheDocument();
  });

  it('keeps cumulative waterfall math available for untouched scenarios', () => {
    const buildWaterfallData = (artifacts as unknown as { buildWaterfallData?: (values: number[]) => unknown }).buildWaterfallData;
    expect(buildWaterfallData).toBeTypeOf('function');
    expect(buildWaterfallData?.([42, 18, -11])).toEqual([
      { name: 'Step 1', base: 0, amount: 42, delta: 42, end: 42, tone: 'positive' },
      { name: 'Step 2', base: 42, amount: 18, delta: 18, end: 60, tone: 'positive' },
      { name: 'Step 3', base: 49, amount: 11, delta: -11, end: 49, tone: 'negative' },
    ]);
  });

  it('replaces the freight waterfall with named lane comparisons', () => {
    const scenario = scenarioLibrary.everglade.scenarios[3];
    const { container } = render(<ScenarioArtifact scenario={scenario} platform="ruby" />);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    expect(screen.getByText('Chicago to Detroit')).toBeInTheDocument();
    expect(container.textContent).not.toContain('Step 1');
    expect(screen.getByRole('button', { name: /Dallas to Austin/ })).toHaveAttribute('data-primary-action');
  });

  it('renders missed-pickup recovery as a non-selectable three-of-three summary', () => {
    const view = render(<ScenarioArtifact scenario={scenarioLibrary.everglade.scenarios[1]} platform="ruby" />);
    expect(screen.getByText('3/3')).toBeInTheDocument();
    expect(view.container.querySelector('.reviewed-completion-strip')).toBeInTheDocument();
    expect(view.container.querySelector('.reviewed-completion-strip button')).not.toBeInTheDocument();
  });

  it('uses required red states in the logistics fleet view', () => {
    const { container } = render(<ScenarioArtifact scenario={scenarioLibrary.everglade.scenarios[0]} platform="ruby" />);
    expect(screen.getByRole('button', { name: /Least overtime/ })).toHaveClass('is-danger');
    expect(screen.getAllByText('Rerouted').every((node) => node.classList.contains('is-danger'))).toBe(true);
    expect(container.querySelector('.bespoke-map-routes .is-danger')).toBeInTheDocument();
  });

  it('uses canonical owner portraits inside artifacts', () => {
    const { container } = render(<ScenarioArtifact scenario={scenarioLibrary.everglade.scenarios[1]} platform="ruby" />);
    expect(container.querySelector('.inline-mention img')).toHaveAttribute('src', 'https://i.pravatar.cc/160?img=14');
  });

  it('renders the contract as a useful cited redline and filters unchanged clauses', () => {
    render(<ScenarioArtifact scenario={scenarioLibrary.northstar.scenarios[0]} platform="ruby" />);
    expect(screen.getByText('Section 12.4 · Liability cap')).toBeInTheDocument();
    expect(screen.getByText(/preceding 12 months/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show changes only' }));
    expect(screen.queryByText('Section 4.2 · Notices')).not.toBeInTheDocument();
  });

  it('makes invoice filters change the visible rows', () => {
    render(<ScenarioArtifact scenario={scenarioLibrary.northstar.scenarios[8]} platform="ruby" />);
    expect(screen.getAllByTestId('invoice-row')).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: 'Needs attention' }));
    expect(screen.getAllByTestId('invoice-row')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getAllByTestId('invoice-row')).toHaveLength(2);
  });
});
