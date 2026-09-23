import '@testing-library/jest-dom/vitest';
import { existsSync } from 'node:fs';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { scenarioLibrary } from './demo-scenarios';
import { artifactRegistry } from './artifacts/registry';
import { ScenarioArtifact } from './scenario-artifact';

afterEach(cleanup);

const renderScenario = (workspace: keyof typeof scenarioLibrary, index: number) =>
  render(<ScenarioArtifact scenario={scenarioLibrary[workspace].scenarios[index]} platform="ruby" />);

describe('next reviewed artifact batch', () => {
  it('registers real unique components for rejected scenarios', () => {
    const expected = {
      'vector-pull-request-review': 'PullRequestCodeReview',
      'vector-regression-explorer': 'ActivationReleaseExplorer',
      'vector-documentation-drift': 'DocumentationDriftComparison',
      'vector-cloud-spend-guard': 'CloudSpendBreakdown',
      'vector-feedback-signal-map': 'FeedbackInbox',
      'vector-internal-tool-prototype': 'WebhookPlayground',
      'stonebridge-site-safety-brief': 'SiteSafetyPlan',
      'stonebridge-cost-overrun-analysis': 'ConcreteCostCalculator',
      'stonebridge-client-progress-pack': 'RiversideOwnerBrief',
      'loom-replenishment-watch': 'StockTransferShop',
      'loom-campaign-launch': 'LinenCampaignStudio',
      'loom-returns-diagnosis': 'DenimReturnPareto',
      'loom-store-staffing': 'StoreShiftPlanner',
      'loom-product-launch-room': 'FlagshipLaunchRoom',
      'loom-social-content-board': 'SocialContentPlanner',
    };
    for (const [id, name] of Object.entries(expected)) expect(artifactRegistry[id]?.displayName, id).toBe(name);
    expect(new Set(Object.keys(expected).map((id) => artifactRegistry[id])).size).toBe(Object.keys(expected).length);
  });

  it('shows actual code changes and switches reviewed files', () => {
    renderScenario('vector', 1);
    expect(screen.getAllByText('src/queue.ts').length).toBeGreaterThan(0);
    expect(screen.getByText(/DEFAULT_TIMEOUT/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Review src/tenant-query.ts' }));
    expect(screen.getByText(/assertTenantScope/)).toBeInTheDocument();
  });

  it('shows release impact instead of a generic funnel', () => {
    const { container } = renderScenario('vector', 2);
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    expect(screen.getAllByText('v4.7.2').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'US baseline' }));
    expect(screen.getByText(/US activation remained stable/i)).toBeInTheDocument();
  });

  it('uses a distinct documentation comparison and accepts the correction', () => {
    renderScenario('vector', 4);
    expect(screen.getByText('Observed API')).toBeInTheDocument();
    expect(screen.getByText('Published docs')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Accept correction' }));
    expect(screen.getByText('Documentation updated')).toBeInTheDocument();
  });

  it('adds a simple cloud breakdown above the retained graph', () => {
    renderScenario('vector', 6);
    expect(screen.getAllByText('GPU inference').length).toBeGreaterThan(0);
    expect(screen.getByText('Projected savings')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Optimized' }));
    expect(screen.getByText('$27k saved')).toBeInTheDocument();
  });

  it('renders source-specific feedback previews and creates product work', () => {
    renderScenario('vector', 8);
    expect(screen.getByText('Reddit')).toBeInTheDocument();
    expect(screen.getByText(/checkout redesign/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Zendesk feedback' }));
    expect(screen.getByText(/ticket #1842/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Create Productboard items' }));
    expect(screen.getByText('3 Productboard items created')).toBeInTheDocument();
  });

  it('runs the dedicated webhook playground', () => {
    renderScenario('vector', 9);
    expect(screen.getByText('Normalized response')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Run test' }));
    expect(screen.getByText(/^200 OK/m)).toBeInTheDocument();
    expect(screen.getByText('Delivered to Supabase')).toBeInTheDocument();
  });

  it('filters the site safety plan and recalculates concrete cost', () => {
    const safety = renderScenario('stonebridge', 1);
    expect(screen.getAllByText('Loading bay').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Critical risks' }));
    expect(screen.queryByText('Level 4 housekeeping')).not.toBeInTheDocument();
    safety.unmount();

    const concrete = renderScenario('stonebridge', 3);
    const forecast = screen.getByTestId('concrete-forecast').textContent;
    fireEvent.change(screen.getByLabelText('Concrete volume'), { target: { value: '1450' } });
    expect(screen.getByTestId('concrete-forecast').textContent).not.toBe(forecast);
    concrete.unmount();
  });

  it('switches owner-report sections', () => {
    renderScenario('stonebridge', 8);
    expect(screen.getByText('72% complete')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Budget' }));
    expect(screen.getByText('$18.4M forecast')).toBeInTheDocument();
  });

  it('uses local product cards and applies a stock transfer', () => {
    renderScenario('loom', 0);
    expect(screen.getAllByText('Linen overshirt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$129').length).toBeGreaterThan(0);
    expect(screen.getByRole('img', { name: 'Linen overshirt' })).toHaveAttribute('src', '/demo-products/linen-overshirt.webp');
    const stock = screen.getByTestId('destination-stock').textContent;
    fireEvent.click(screen.getByRole('button', { name: 'Apply transfer' }));
    expect(screen.getByTestId('destination-stock').textContent).not.toBe(stock);
  });

  it('switches campaign channels and denim return evidence', () => {
    const campaign = renderScenario('loom', 1);
    fireEvent.click(screen.getByRole('button', { name: 'Email preview' }));
    expect(screen.getByText('The linen edit has arrived')).toBeInTheDocument();
    campaign.unmount();
    const returns = renderScenario('loom', 4);
    expect(screen.getAllByText('Inseam length').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Straight denim' }));
    expect(screen.getByText(/Straight denim returns/i)).toBeInTheDocument();
    returns.unmount();
  });

  it('supports staffing and social-card movement with click fallbacks', () => {
    const staffing = renderScenario('loom', 5);
    fireEvent.click(screen.getByRole('button', { name: 'Move Jordan to Soho 2 PM' }));
    expect(screen.getByText('Soho 2 PM is covered')).toBeInTheDocument();
    staffing.unmount();
    const social = renderScenario('loom', 7);
    fireEvent.click(screen.getByRole('button', { name: 'Move linen post to Friday' }));
    expect(screen.getByText('Linen post moved to Friday')).toBeInTheDocument();
    social.unmount();
  });

  it('filters the flagship launch room', () => {
    renderScenario('loom', 6);
    expect(screen.getByText('18 days')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Needs decision' }));
    expect(screen.getAllByTestId('launch-item')).toHaveLength(2);
  });

  it('ships the three generated local product assets', () => {
    for (const file of ['linen-overshirt.webp', 'high-rise-denim.webp', 'leather-tote.webp']) {
      expect(existsSync(`public/demo-products/${file}`), file).toBe(true);
    }
  });
});
