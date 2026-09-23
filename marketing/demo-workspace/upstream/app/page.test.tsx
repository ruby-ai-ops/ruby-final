import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Home from './page';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

function useMobileViewport() {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query.includes('(max-width: 720px)'),
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

function useResponsiveViewport(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    get matches() { return matches && query.includes('(max-width: 720px)'); },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  })));
  return (nextMatches: boolean) => {
    matches = nextMatches;
    listeners.forEach((listener) => listener({ matches: nextMatches, media: '(max-width: 720px)' } as MediaQueryListEvent));
  };
}

const companyNames = [
  ['Everglade Logistics', 'Operations'],
  ['Northstar Legal', 'Legal'],
  ['Meadow Dairy Co.', 'Food Production'],
  ['Vector Forge', 'Technology'],
  ['Stonebridge Build', 'Construction'],
  ['Loom & Line', 'Retail'],
  ['Cartly Commerce', 'E-commerce'],
] as const;

const companyExpectations = [
  ['Everglade Logistics', 'Maya Bennett', 'Operations Manager', 'Max', 'Save today’s late shipments', 'Recover missed pickups', 47],
  ['Northstar Legal', 'Daniel Brooks', 'Senior Partner', 'Pro', 'Review the supplier contract', 'Get Greenline’s agreement signed', 12],
  ['Meadow Dairy Co.', 'Sofia Alvarez', 'Plant Manager', 'Max', 'Contain the bad batch', 'Find warm deliveries', 32],
  ['Vector Forge', 'Elena Park', 'VP of Engineering', 'Pro', 'Explain the checkout outage', 'Review the risky code change', 5],
  ['Stonebridge Build', 'Olivia Grant', 'Construction Director', 'Max', 'Recover the Riverside schedule', 'Close today’s safety risks', 44],
  ['Loom & Line', 'Ava Sinclair', 'Retail Manager', 'Pro', 'Prevent weekend stockouts', 'Launch the linen collection', 9],
  ['Cartly Commerce', 'Noah Williams', 'E-commerce Lead', 'Max', 'Recover high-value carts', 'Stop risky refunds', 15],
] as const;

const additionalCompanyExpectations = [
  ['Harborview Health', 'Healthcare', 'Nina Patel', 'Clinic Operations Director', 'Max', 'Clear the referral backlog', 'Fill tomorrow’s empty appointments', 'https://i.pravatar.cc/160?img=45'],
  ['Keyline Properties', 'Property Management', 'Marcus Reed', 'Property Operations Manager', 'Pro', 'Turn leads into viewings', 'Dispatch maintenance today', 'https://i.pravatar.cc/160?img=11'],
  ['TalentSpring', 'Recruiting', 'Chloe Martin', 'Talent Acquisition Lead', 'Max', 'Find the best candidates', 'Book the interview panel', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=85'],
  ['CedarShield Insurance', 'Insurance', 'James Foster', 'Claims Operations Manager', 'Pro', 'Route storm claims', 'Prepare the renewal meeting', 'https://i.pravatar.cc/160?img=68'],
  ['Ledger & Co.', 'Accounting', 'Amelia Ross', 'Finance Operations Lead', 'Max', 'Finish month-end close', 'Chase overdue invoices', 'https://i.pravatar.cc/160?img=49'],
] as const;

describe('Everglade workspace preview', () => {
  it('uses scenario-specific integration action titles', () => {
    render(<Home />);
    const tools = screen.getByRole('region', { name: 'Completed integration actions' });
    expect(within(tools).getByText('Updated 14 dispatch records')).toBeInTheDocument();
    expect(within(tools).queryByText(/Read source data|Cross-checked|Applied decision|Shared outcome/)).not.toBeInTheDocument();
  });
  it('renders a Claude-style Ruby mobile chat without duplicate desktop navigation', async () => {
    useMobileViewport();
    render(<Home />);
    expect(await screen.findByRole('region', { name: 'Ruby mobile chat' })).toBeInTheDocument();
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 720px), (max-height: 460px) and (max-width: 900px)');
    expect(screen.queryByRole('complementary', { name: 'Workspace navigation' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open Ruby menu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open platform switcher' })).toBeInTheDocument();
    expect(document.querySelector('.mobile-switcher-reserve')).not.toBeInTheDocument();
  });

  it('opens the Ruby conversation drawer and closes it after selection', async () => {
    useMobileViewport();
    render(<Home />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open Ruby menu' }));
    const drawer = screen.getByRole('dialog', { name: 'Ruby navigation' });
    expect(within(drawer).getByText('New chat')).toBeInTheDocument();
    expect(within(drawer).getByText('Pods')).toBeInTheDocument();
    fireEvent.click(within(drawer).getByRole('button', { name: 'Recover missed pickups channel' }));
    expect(screen.queryByRole('dialog', { name: 'Ruby navigation' })).not.toBeInTheDocument();
    expect(screen.getAllByText('Recover missed pickups').length).toBeGreaterThan(0);
  });

  it('uses Slack mobile Home, workspace drawer, and bottom tabs', async () => {
    useMobileViewport();
    localStorage.setItem('ruby-workspace-state-v1', JSON.stringify({ companyId: 'everglade', channel: 'everglade-sla-risk-command', platform: 'slack' }));
    render(<Home />);
    expect(await screen.findByRole('region', { name: 'Slack mobile channel' })).toBeInTheDocument();
    const slackTabs = screen.getByRole('navigation', { name: 'Slack mobile tabs' });
    expect(within(slackTabs).getByRole('button', { name: 'Home' })).toBeEnabled();
    for (const label of ['DMs', 'Activity', 'More']) expect(within(slackTabs).getByRole('button', { name: label })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Back to Slack home' }));
    expect(screen.getByRole('region', { name: 'Slack mobile home' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open platform switcher' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open Slack workspaces' }));
    expect(screen.getByRole('dialog', { name: 'Slack workspaces' })).toBeInTheDocument();
  });

  it('uses a Teams group-chat list, organization drawer, and bottom tabs without personal DMs', async () => {
    useMobileViewport();
    localStorage.setItem('ruby-workspace-state-v1', JSON.stringify({ companyId: 'everglade', channel: 'everglade-sla-risk-command', platform: 'teams' }));
    render(<Home />);
    expect(await screen.findByRole('region', { name: 'Teams mobile group chat' })).toBeInTheDocument();
    const teamsTabs = screen.getByRole('navigation', { name: 'Teams mobile tabs' });
    expect(within(teamsTabs).getByRole('button', { name: 'Chat' })).toBeEnabled();
    for (const label of ['Activity', 'Calendar', 'More']) expect(within(teamsTabs).getByRole('button', { name: label })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Back to Teams chats' }));
    expect(screen.getByRole('region', { name: 'Teams mobile chat list' })).toBeInTheDocument();
    expect(screen.queryByText(/Direct message/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open Teams organizations' }));
    const organizations = screen.getByRole('dialog', { name: 'Teams organizations' });
    expect(within(organizations).getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
    expect(within(organizations).getByText('Settings')).toBeInTheDocument();
  });

  it('switches mobile platforms from a floating control while preserving the conversation', async () => {
    useMobileViewport();
    render(<Home />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open platform switcher' }));
    const switcher = screen.getByRole('group', { name: 'Mobile platform switcher' });
    fireEvent.click(within(switcher).getByRole('button', { name: 'Use Slack' }));
    expect(await screen.findByRole('region', { name: 'Slack mobile channel' })).toBeInTheDocument();
    expect(screen.getAllByText(/save.today.s late shipments/i).length).toBeGreaterThan(0);
  });

  it('resets mobile overlays when crossing the desktop breakpoint', async () => {
    const setMobile = useResponsiveViewport(true);
    render(<Home />);
    fireEvent.click(await screen.findByRole('button', { name: 'Open Ruby menu' }));
    expect(screen.getByRole('dialog', { name: 'Ruby navigation' })).toBeInTheDocument();
    act(() => setMobile(false));
    expect(await screen.findByRole('complementary', { name: 'Workspace navigation' })).toBeInTheDocument();
    act(() => setMobile(true));
    expect(await screen.findByRole('region', { name: 'Ruby mobile chat' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Ruby navigation' })).not.toBeInTheDocument();
  });
  it('renders seven selectable company servers with hover labels', () => {
    render(<Home />);

    for (const [companyName, industry] of companyNames) {
      expect(
        screen.getByRole('button', { name: `${companyName} server` }),
      ).toHaveAttribute('data-tooltip', `${industry} · ${companyName}`);
    }

    expect(
      screen.getByRole('button', { name: 'Everglade Logistics server' }),
    ).toHaveStyle('--company-color: #b8dca8');
    expect(
      screen
        .getByRole('button', { name: 'Stonebridge Build server' })
        .querySelector('.fa-trowel-bricks'),
    ).toBeInTheDocument();
  });

  it('keeps workspace switching scrollable while Download apps stays outside the scroll region', () => {
    render(<Home />);
    const rail = screen.getByRole('complementary', { name: 'Workspace navigation' });
    const scrollRegion = rail.querySelector('.server-list-scroll');
    const download = within(rail).getByRole('button', { name: 'Download apps' });
    expect(scrollRegion).toBeInTheDocument();
    expect(scrollRegion).not.toContainElement(download);
  });

  it('shows an unclipped workspace tooltip and active rail marker without a header tooltip', () => {
    render(<Home />);
    const button = screen.getByRole('button', { name: 'Everglade Logistics server' });
    expect(button.parentElement).toHaveClass('server-tile-shell', 'is-active');
    fireEvent.mouseEnter(button);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Operations · Everglade Logistics');
    fireEvent.mouseLeave(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(document.querySelector('.server-title-meta')).not.toHaveAttribute('data-industry-tooltip');
  });

  it('shows the default Everglade workspace and employee identity', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: 'Everglade Logistics' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save today’s late shipments channel' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Maya Bennett')).toBeInTheDocument();
    expect(screen.getByText('Operations Manager')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Maya Bennett' })).toHaveAttribute(
      'src',
      'https://i.pravatar.cc/160?img=47',
    );
    const composer = screen.getByRole('group', { name: 'Chat input preview' });
    expect(composer).toHaveTextContent('Ask Ruby to help with this workspace…');
    expect(within(composer).queryByText('Post Call Process')).not.toBeInTheDocument();
    expect(within(composer).getByText('Agent')).toBeInTheDocument();
    expect(composer.querySelector('.fa-robot')).toBeInTheDocument();
    expect(composer.querySelector('.fa-ellipsis')).toBeInTheDocument();
    expect(composer).not.toHaveAttribute('contenteditable');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders a completed Ruby workflow with the supplied Ruby identity', () => {
    render(<Home />);

    const conversation = screen.getByRole('log', { name: 'Ruby conversation' });
    expect(within(conversation).getByText('Ruby')).toBeInTheDocument();
    expect(within(conversation).getByRole('img', { name: 'Ruby assistant' })).toHaveAttribute(
      'src',
      '/ruby-logo.png',
    );
    expect(within(conversation).getByText(/Completed in \d+ sec/)).toBeInTheDocument();
    expect(within(conversation).getByRole('region', { name: 'Scenario artifact: Save today’s late shipments' })).toBeInTheDocument();
    expect(within(conversation).getAllByText(/updated 14 dispatch records/i)).toHaveLength(2);
    expect(within(conversation).getByText('Ruby')).toBeInTheDocument();
    expect(within(conversation).queryByText('Dispatch recovery completed')).not.toBeInTheDocument();
    const leadIn = conversation.querySelector('.conversation-document')!;
    const artifact = within(conversation).getByRole('region', { name: 'Scenario artifact: Save today’s late shipments' });
    expect(leadIn.compareDocumentPosition(artifact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(conversation).queryByText('What Ruby changed')).not.toBeInTheDocument();

    const netsuiteAction = within(conversation).getByLabelText(
      'Updated 14 dispatch records completed with NetSuite',
    );
    expect(within(netsuiteAction).getByRole('img', { name: 'NetSuite' })).toHaveAttribute('src', expect.stringMatching(/^https:\/\//));
    const sheetsAction = within(conversation).getByLabelText('Posted the owner-tagged exception list to Slack completed with Google Sheets');
    expect(within(sheetsAction).getByRole('img', { name: 'Google Sheets' })).toHaveAttribute('src', expect.stringContaining('google.com/s2/favicons'));
    expect(conversation.querySelectorAll('.inline-integration img').length).toBeGreaterThan(0);
    expect(conversation.querySelector('.inline-mention img')).toBeInTheDocument();
  });

  it('renders connection logos from the brand CDN', () => {
    render(<Home />);

    const action = screen.getByLabelText('Updated 14 dispatch records completed with NetSuite');
    expect(within(action).getByRole('img', { name: 'NetSuite' })).toHaveAttribute('src', expect.stringMatching(/^https:\/\//));
  });

  it('keeps the inert composer outside the scrollable message log', () => {
    render(<Home />);

    const canvas = screen.getByRole('region', { name: 'Conversation canvas' });
    const conversation = within(canvas).getByRole('log', { name: 'Ruby conversation' });
    const composer = within(canvas).getByRole('group', { name: 'Chat input preview' });

    expect(canvas).toContainElement(conversation);
    expect(canvas).toContainElement(composer);
    expect(conversation).not.toContainElement(composer);
    expect(composer).toHaveAttribute('aria-disabled', 'true');
  });

  it('changes the completed Ruby workflow with the selected workspace', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Northstar Legal server' }));

    const conversation = screen.getByRole('log', { name: 'Ruby conversation' });
    expect(within(conversation).getByText('Review the supplier contract')).toBeInTheDocument();
    expect(within(conversation).queryByText('Save today’s late shipments')).not.toBeInTheDocument();
  });

  it('switches company title, channels, and employee together', () => {
    render(<Home />);

    for (const [company, employee, role, plan, firstChannel, secondChannel, avatarId] of companyExpectations) {
      const companyButton = screen.getByRole('button', { name: `${company} server` });
      fireEvent.click(companyButton);

      expect(screen.getByRole('heading', { name: company })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: `${firstChannel} channel` }),
      ).toHaveAttribute('aria-current', 'page');
      expect(
        screen.getByRole('button', { name: `${secondChannel} channel` }),
      ).toBeInTheDocument();
      expect(screen.getByText(employee)).toBeInTheDocument();
      expect(screen.getByText(role)).toBeInTheDocument();
      expect(screen.getByText(plan)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: employee })).toHaveAttribute(
        'src',
        `https://i.pravatar.cc/160?img=${avatarId}`,
      );
      expect(
        within(
          screen.getByRole('region', { name: `${firstChannel} channel` }),
        ).getAllByText(firstChannel).length,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it('lets the active channel change without adding a message', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Northstar Legal server' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Get Greenline’s agreement signed channel' }),
    );

    expect(
      screen.getByRole('button', { name: 'Get Greenline’s agreement signed channel' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('region', { name: 'Get Greenline’s agreement signed channel' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Conversation canvas' }),
    ).toContainElement(screen.getByRole('group', { name: 'Chat input preview' }));
  });

  it('renders Ruby first in the three-platform switch and changes selection', () => {
    render(<Home />);

    const group = screen.getByRole('group', { name: 'Workspace platform' });
    const buttons = within(group).getAllByRole('button');
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Use Ruby',
      'Use Slack',
      'Use Teams',
    ]);
    expect(screen.getByRole('img', { name: 'Ruby logo' })).toHaveAttribute(
      'src',
      '/ruby-logo.png',
    );
    expect(buttons.filter((button) => button.getAttribute('aria-pressed') === 'true')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Use Ruby' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Use Teams' }));
    expect(screen.getByRole('button', { name: 'Use Teams' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('shows AI-style conversation history for the Ruby platform', () => {
    render(<Home />);

    const conversations = screen.getByRole('navigation', { name: 'Ruby conversations' });
    expect(within(conversations).queryByText('Search')).not.toBeInTheDocument();
    expect(within(conversations).queryByText('New')).not.toBeInTheDocument();
    expect(within(conversations).queryByText('Skill suggestions')).not.toBeInTheDocument();
    expect(within(conversations).getByText('Pods')).toBeInTheDocument();
    expect(within(conversations).getByText('Fleet')).toBeInTheDocument();
    expect(within(conversations).getByText('Warehousing')).toBeInTheDocument();
    expect(within(conversations).getByText('Leadership')).toBeInTheDocument();
    expect(within(conversations).getByText('Conversations')).toBeInTheDocument();
    expect(within(conversations).getByText('Save today’s late shipments')).toBeInTheDocument();
    expect(within(conversations).getByText('Present the electric fleet')).toBeInTheDocument();
    expect(within(conversations).queryByText(/Ruby/i)).not.toBeInTheDocument();
    expect(conversations.querySelector('.fa-hashtag')).not.toBeInTheDocument();
    expect(conversations.querySelector('.ruby-history-item i')).not.toBeInTheDocument();
  });

  it('keeps one selected scenario across ten-item Ruby, Slack, and Teams content lists', () => {
    render(<Home />);

    const rubyNavigation = screen.getByRole('navigation', { name: 'Ruby conversations' });
    expect(within(rubyNavigation).getByText('Fleet')).toBeInTheDocument();
    expect(within(rubyNavigation).getByText('Warehousing')).toBeInTheDocument();
    expect(within(rubyNavigation).getByText('Leadership')).toBeInTheDocument();
    expect(within(rubyNavigation).getAllByRole('button')).toHaveLength(10);
    expect(screen.getAllByText('Save today’s late shipments').length).toBeGreaterThanOrEqual(2);
    expect(document.querySelector('.ruby-header-icon .fa-route')).toBeInTheDocument();

    fireEvent.click(within(rubyNavigation).getByRole('button', { name: 'Recover missed pickups channel' }));
    expect(screen.getByText(/recover today’s missed pickups without creating overtime/i)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Scenario artifact: Recover missed pickups' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Use Slack' }));
    expect(screen.getByText(/recover today’s missed pickups without creating overtime/i)).toBeInTheDocument();
    expect(screen.getByText('#recover-missed-pickups')).toBeInTheDocument();
    expect(within(screen.getByRole('navigation', { name: 'Slack navigation' })).getAllByRole('button')).toHaveLength(10);

    fireEvent.click(screen.getByRole('button', { name: 'Use Teams' }));
    expect(screen.getByText(/recover today’s missed pickups without creating overtime/i)).toBeInTheDocument();
    expect(within(screen.getByRole('navigation', { name: 'Teams navigation' })).getAllByRole('button')).toHaveLength(10);
  });

  it('renders approved text-first scenarios as rich conversation content without artifact or tool cards', () => {
    render(<Home />);
    const rubyNavigation = screen.getByRole('navigation', { name: 'Ruby conversations' });
    fireEvent.click(within(rubyNavigation).getByRole('button', { name: 'Build the carrier claim channel' }));

    const conversation = screen.getByRole('log', { name: 'Ruby conversation' });
    expect(within(conversation).queryByRole('region', { name: /Scenario artifact/ })).not.toBeInTheDocument();
    expect(conversation.querySelector('.ruby-tool-grid')).not.toBeInTheDocument();
    expect(conversation.querySelector('.conversation-heading')).toBeInTheDocument();
    expect(conversation.querySelector('.conversation-list')).toBeInTheDocument();
    expect(conversation.querySelector('.inline-integration img')).toBeInTheDocument();
    expect(within(conversation).queryByText('Sources')).not.toBeInTheDocument();
    expect(conversation.querySelector('.inline-mention img')).toBeInTheDocument();
    expect(within(conversation).getByText('EG-4821-carrier-claim.pdf')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Use Slack' }));
    expect(screen.queryByRole('region', { name: /Scenario artifact/ })).not.toBeInTheDocument();
    expect(screen.getByText('EG-4821-carrier-claim.pdf')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Use Teams' }));
    expect(screen.queryByRole('region', { name: /Scenario artifact/ })).not.toBeInTheDocument();
    expect(document.querySelector('.teams-tool-receipts')).not.toBeInTheDocument();
    expect(screen.getByText('EG-4821-carrier-claim.pdf')).toBeInTheDocument();
  });

  it('shows a Slack-native shortcut and channel list', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Slack' }));
    const slackNavigation = screen.getByRole('navigation', { name: 'Slack navigation' });
    expect(within(slackNavigation).queryByText('Threads')).not.toBeInTheDocument();
    expect(within(slackNavigation).queryByText('Drafts & sent')).not.toBeInTheDocument();
    expect(within(slackNavigation).queryByText('Later')).not.toBeInTheDocument();
    expect(within(slackNavigation).getByText('Channels')).toBeInTheDocument();
    expect(within(slackNavigation).getByRole('button', { name: 'Save today’s late shipments channel' })).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Everglade Logistics workspace' })).toHaveClass('platform-slack');
  });

  it('shows company demo groups in a Teams-style chat list', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Teams' }));
    const teamsNavigation = screen.getByRole('navigation', { name: 'Teams navigation' });
    expect(within(teamsNavigation).getByText('Chat')).toBeInTheDocument();
    expect(within(teamsNavigation).getByText('Recent')).toBeInTheDocument();
    expect(within(teamsNavigation).getByText('Save today’s late shipments')).toBeInTheDocument();
    expect(within(teamsNavigation).getByText('Recover missed pickups')).toBeInTheDocument();
    expect(within(teamsNavigation).queryByText('9:42 AM')).not.toBeInTheDocument();
    expect(within(teamsNavigation).queryByText('Yesterday')).not.toBeInTheDocument();
    expect(within(teamsNavigation).queryByText('Teams and channels')).not.toBeInTheDocument();
    expect(within(teamsNavigation).queryByText('Favorites')).not.toBeInTheDocument();
    expect(within(teamsNavigation).getByRole('button', { name: 'Save today’s late shipments channel' })).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Everglade Logistics workspace' })).toHaveClass('platform-teams');
  });

  it('changes the static composer to match Slack and Teams', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Slack' }));
    const slackComposer = screen.getByRole('group', { name: 'Slack message composer' });
    expect(slackComposer).toHaveTextContent('Message #save-todays-late-shipments');
    expect(slackComposer.querySelector('.slack-format-aa')).toBeInTheDocument();
    expect(slackComposer.querySelector('.fa-plus')).toBeInTheDocument();
    expect(slackComposer.querySelector('.fa-face-smile')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Use Teams' }));
    const teamsComposer = screen.getByRole('group', { name: 'Teams message composer' });
    expect(teamsComposer).toHaveTextContent('Type a new message');
    expect(teamsComposer).toHaveTextContent('GIF');
    expect(teamsComposer.querySelector('.teams-format-icon')).toBeInTheDocument();
    expect(teamsComposer.querySelector('.fa-paperclip')).toBeInTheDocument();
    expect(teamsComposer.querySelector('.fa-paper-plane')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('toggles and persists the workspace color mode', async () => {
    render(<Home />);

    const darkToggle = screen.getByRole('button', { name: 'Switch to dark mode' });
    fireEvent.click(darkToggle);

    expect(screen.getByRole('main', { name: 'Everglade Logistics workspace' })).toHaveClass('theme-dark');
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
    await waitFor(() => expect(localStorage.getItem('ruby-theme-v1')).toBe('dark'));
  });

  it('renders the completed workflow as native-looking Slack channel messages', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Slack' }));

    const canvas = screen.getByRole('region', { name: 'Conversation canvas' });
    const messages = within(canvas).getByRole('log', { name: 'Slack channel messages' });
    const channelHeader = within(messages).getByRole('region', { name: 'Slack channel header' });
    expect(within(channelHeader).getByText('#save-todays-late-shipments')).toBeInTheDocument();
    expect(within(channelHeader).getByText('48 members')).toBeInTheDocument();
    const channelTabs = within(channelHeader).getByRole('navigation', { name: 'Slack channel tabs' });
    expect(within(channelTabs).getByText('Messages')).toBeInTheDocument();
    expect(within(channelTabs).getByText('Canvas')).toBeInTheDocument();
    expect(within(channelTabs).getByText('Files')).toBeInTheDocument();
    expect(within(channelTabs).getByText('Pins')).toBeInTheDocument();
    expect(messages.querySelector('.slack-feed-content')).toBeInTheDocument();
    expect(within(messages).getByText('Maya Bennett')).toBeInTheDocument();
    expect(within(messages).getByRole('button', { name: 'Reply in thread' })).toBeInTheDocument();
    expect(within(messages).getByRole('button', { name: 'More message actions' })).toBeInTheDocument();
    expect(within(messages).getByText('Ruby')).toBeInTheDocument();
    expect(within(messages).getByText('APP')).toBeInTheDocument();
    expect(within(messages).getByText(/Completed in \d+ sec/)).toBeInTheDocument();
    expect(messages.querySelector('.slack-completion-status')).toHaveTextContent(/Completed in \d+ sec/);
    expect(within(messages).getByRole('region', { name: 'Scenario artifact: Save today’s late shipments' })).toBeInTheDocument();
    expect(messages.querySelector('.deliverable-list')).not.toBeInTheDocument();
    expect(within(messages).queryByLabelText('Ruby workflow receipt')).not.toBeInTheDocument();
    const slackReactions = within(messages).getByLabelText('Slack reactions');
    expect(slackReactions.children.length).toBeGreaterThanOrEqual(3);
    expect(within(messages).getByRole('img', { name: 'Ruby assistant' })).toHaveAttribute(
      'src',
      '/ruby-logo.png',
    );
    expect(within(messages).getByText('Ruby')).toBeInTheDocument();
    expect(messages).not.toContainElement(
      within(canvas).getByRole('group', { name: 'Slack message composer' }),
    );
  });

  it('renders the completed workflow as a Teams group chat', () => {
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Teams' }));

    const canvas = screen.getByRole('region', { name: 'Conversation canvas' });
    const chat = within(canvas).getByRole('log', { name: 'Teams group chat' });
    expect(chat.querySelector('.teams-chat-content')).toBeInTheDocument();
    expect(within(chat).getByText('Chat')).toBeInTheDocument();
    expect(within(chat).getByText('Files')).toBeInTheDocument();
    expect(within(chat).getByText('Maya Bennett')).toBeInTheDocument();
    expect(within(chat).getByText('Ruby')).toBeInTheDocument();
    expect(within(chat).getByText('BOT')).toBeInTheDocument();
    expect(within(chat).getByText(/Completed in \d+ sec/)).toBeInTheDocument();
    expect(within(chat).getByRole('region', { name: 'Scenario artifact: Save today’s late shipments' })).toBeInTheDocument();
    expect(chat.querySelector('.teams-conversation-copy')).toBeInTheDocument();
    expect(chat.querySelectorAll('.teams-conversation-copy .conversation-paragraph').length).toBeGreaterThanOrEqual(3);
    expect(within(chat).queryByText('3 actions completed')).not.toBeInTheDocument();
    const teamsReactions = within(chat).getByLabelText('Teams reactions');
    expect(teamsReactions.children.length).toBeGreaterThanOrEqual(3);
    expect(within(chat).queryByText('3 replies')).not.toBeInTheDocument();
    expect(within(chat).getByRole('img', { name: 'Ruby assistant' })).toHaveAttribute(
      'src',
      '/ruby-logo.png',
    );
    expect(within(chat).getByText('Ruby')).toBeInTheDocument();
    expect(chat).not.toContainElement(
      within(canvas).getByRole('group', { name: 'Teams message composer' }),
    );
  });

  it('uses the canonical Sofia portrait for the Meadow workspace', () => {
    render(<Home />);
    fireEvent.click(screen.getByRole('button', { name: /Meadow Dairy Co\./ }));
    expect(screen.getByRole('img', { name: 'Sofia Alvarez' })).toHaveAttribute('src', 'https://i.pravatar.cc/160?img=32');
  });

  it('uses full-color raster CDN images for Slack and Teams', () => {
    render(<Home />);

    const platformSwitch = screen.getByRole('group', { name: 'Workspace platform' });

    expect(within(platformSwitch).getByRole('img', { name: 'Slack' })).toHaveAttribute(
      'src',
      'https://img.icons8.com/color/48/slack-new.png',
    );
    expect(within(platformSwitch).getByRole('img', { name: 'Teams' })).toHaveAttribute(
      'src',
      'https://img.icons8.com/color/48/microsoft-teams.png',
    );
  });

  it('shows a blue verified mark and accessible utility controls', () => {
    render(<Home />);

    expect(screen.getByRole('img', { name: 'Verified company' })).toBeInTheDocument();
    for (const name of ['Download apps', 'Server menu', 'Search', 'Help', 'User settings']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });

  it('restores the selected company, channel, and platform after a refresh', async () => {
    const firstView = render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: 'Vector Forge server' }));
    fireEvent.click(screen.getByRole('button', { name: 'Review the risky code change channel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use Teams' }));

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('ruby-workspace-state-v1') ?? '{}')).toEqual({
        companyId: 'vector',
        channel: 'vector-pull-request-review',
        platform: 'teams',
      });
    });

    firstView.unmount();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Vector Forge' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Review the risky code change channel' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByRole('button', { name: 'Use Teams' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(
        screen.getByRole('group', { name: 'Teams message composer' }),
      ).toBeInTheDocument();
    });
  });

  it('shows industry context under and above each workspace title', () => {
    render(<Home />);

    expect(screen.getAllByText('Operations').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText('Operations · Everglade Logistics')).not.toHaveAttribute('data-industry-tooltip');

    fireEvent.click(screen.getByRole('button', { name: 'Northstar Legal server' }));
    expect(screen.getAllByText('Legal').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText('Legal · Northstar Legal')).not.toHaveAttribute('data-industry-tooltip');
  });

  it('shows five additional industry demos directly in the server rail', () => {
    render(<Home />);

    expect(
      screen.queryByRole('button', { name: 'More demo workspaces' }),
    ).not.toBeInTheDocument();

    for (const [company, industry, employee, role, plan, firstChannel, secondChannel, avatarUrl] of additionalCompanyExpectations) {
      const companyButton = screen.getByRole('button', { name: `${company} server` });
      expect(companyButton).toHaveAttribute('data-tooltip', `${industry} · ${company}`);
      fireEvent.click(companyButton);

      expect(screen.getByRole('heading', { name: company })).toBeInTheDocument();
      expect(screen.getByLabelText(`${industry} · ${company}`)).toBeInTheDocument();
      expect(screen.getAllByText(employee).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(role)).toBeInTheDocument();
      expect(screen.getByText(plan)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: employee })).toHaveAttribute(
        'src',
        avatarUrl,
      );
      expect(
        screen.getByRole('button', { name: `${firstChannel} channel` }),
      ).toHaveAttribute('aria-current', 'page');
      expect(
        screen.getByRole('button', { name: `${secondChannel} channel` }),
      ).toBeInTheDocument();
    }
  });
});
