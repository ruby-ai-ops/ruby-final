'use client';

/* oxlint-disable next/no-img-element -- the demo intentionally uses remote fixture and brand images. */

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { CSSProperties, JSX } from 'react';
import { getCompanyScenarios, getPerson, getScenario, scenarioLibrary, type DemoScenario } from './demo-scenarios';
import { ConversationContent } from './conversation-content';
import { IntegrationIcon } from './integration-icon';
import { RichText } from './rich-text';
import { ScenarioArtifact } from './scenario-artifact';

type Platform = 'ruby' | 'slack' | 'teams';
type Plan = 'Pro' | 'Max';
type Theme = 'light' | 'dark';

type Company = {
  id: string;
  name: string;
  industry: string;
  icon: string;
  color: string;
  ink: string;
  radius: string;
  channels: [string, string];
  employee: {
    name: string;
    role: string;
    plan: Plan;
    avatar: string;
  };
};

const companies: Company[] = [
  {
    id: 'everglade',
    name: 'Everglade Logistics',
    industry: 'Operations',
    icon: 'fa-solid fa-truck-fast',
    color: '#b8dca8',
    ink: '#17351e',
    radius: '14px',
    channels: ['sales', 'marketing'],
    employee: {
      name: 'Maya Bennett',
      role: 'Operations Manager',
      plan: 'Max',
      avatar: 'https://i.pravatar.cc/160?img=47',
    },
  },
  {
    id: 'northstar',
    name: 'Northstar Legal',
    industry: 'Legal',
    icon: 'fa-solid fa-scale-balanced',
    color: '#dce8ff',
    ink: '#173c73',
    radius: '50%',
    channels: ['case-intake', 'client-relations'],
    employee: {
      name: 'Daniel Brooks',
      role: 'Senior Partner',
      plan: 'Pro',
      avatar: 'https://i.pravatar.cc/160?img=12',
    },
  },
  {
    id: 'meadow',
    name: 'Meadow Dairy Co.',
    industry: 'Food Production',
    icon: 'fa-solid fa-cow',
    color: '#fff0b8',
    ink: '#31563b',
    radius: '12px 22px 12px 22px',
    channels: ['production', 'quality-control'],
    employee: {
      name: 'Sofia Alvarez',
      role: 'Plant Manager',
      plan: 'Max',
      avatar: 'https://i.pravatar.cc/160?img=32',
    },
  },
  {
    id: 'vector',
    name: 'Vector Forge',
    industry: 'Technology',
    icon: 'fa-solid fa-code',
    color: '#dfd3ff',
    ink: '#4b2b91',
    radius: '13px',
    channels: ['engineering', 'product'],
    employee: {
      name: 'Elena Park',
      role: 'VP of Engineering',
      plan: 'Pro',
      avatar: 'https://i.pravatar.cc/160?img=5',
    },
  },
  {
    id: 'stonebridge',
    name: 'Stonebridge Build',
    industry: 'Construction',
    icon: 'fa-solid fa-trowel-bricks',
    color: '#ffd2aa',
    ink: '#713509',
    radius: '10px 10px 20px 20px',
    channels: ['site-ops', 'procurement'],
    employee: {
      name: 'Olivia Grant',
      role: 'Construction Director',
      plan: 'Max',
      avatar: 'https://i.pravatar.cc/160?img=44',
    },
  },
  {
    id: 'loom',
    name: 'Loom & Line',
    industry: 'Retail',
    icon: 'fa-solid fa-shirt',
    color: '#ffd1df',
    ink: '#792344',
    radius: '50% 50% 13px 13px',
    channels: ['new-arrivals', 'store-team'],
    employee: {
      name: 'Ava Sinclair',
      role: 'Retail Manager',
      plan: 'Pro',
      avatar: 'https://i.pravatar.cc/160?img=9',
    },
  },
  {
    id: 'cartly',
    name: 'Cartly Commerce',
    industry: 'E-commerce',
    icon: 'fa-solid fa-cart-shopping',
    color: '#bceffc',
    ink: '#07576b',
    radius: '18px 10px 18px 10px',
    channels: ['growth', 'fulfillment'],
    employee: {
      name: 'Noah Williams',
      role: 'E-commerce Lead',
      plan: 'Max',
      avatar: 'https://i.pravatar.cc/160?img=15',
    },
  },
  {
    id: 'harborview',
    name: 'Harborview Health',
    industry: 'Healthcare',
    icon: 'fa-solid fa-stethoscope',
    color: '#ccebe5',
    ink: '#17594f',
    radius: '50% 50% 14px 14px',
    channels: ['patient-intake', 'referrals'],
    employee: {
      name: 'Nina Patel',
      role: 'Clinic Operations Director',
      plan: 'Max',
      avatar: 'https://i.pravatar.cc/160?img=45',
    },
  },
  {
    id: 'keyline',
    name: 'Keyline Properties',
    industry: 'Property Management',
    icon: 'fa-solid fa-building',
    color: '#f1dbc8',
    ink: '#6c4028',
    radius: '12px',
    channels: ['leasing', 'maintenance'],
    employee: {
      name: 'Marcus Reed',
      role: 'Property Operations Manager',
      plan: 'Pro',
      avatar: 'https://i.pravatar.cc/160?img=11',
    },
  },
  {
    id: 'talentspring',
    name: 'TalentSpring',
    industry: 'Recruiting',
    icon: 'fa-solid fa-user-group',
    color: '#e7d9f6',
    ink: '#593575',
    radius: '18px 10px 18px 10px',
    channels: ['candidates', 'interviews'],
    employee: {
      name: 'Chloe Martin',
      role: 'Talent Acquisition Lead',
      plan: 'Max',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=85',
    },
  },
  {
    id: 'cedarshield',
    name: 'CedarShield Insurance',
    industry: 'Insurance',
    icon: 'fa-solid fa-shield-halved',
    color: '#d4e5f4',
    ink: '#244f75',
    radius: '50% 50% 16px 16px',
    channels: ['claims-intake', 'renewals'],
    employee: {
      name: 'James Foster',
      role: 'Claims Operations Manager',
      plan: 'Pro',
      avatar: 'https://i.pravatar.cc/160?img=68',
    },
  },
  {
    id: 'ledger',
    name: 'Ledger & Co.',
    industry: 'Accounting',
    icon: 'fa-solid fa-calculator',
    color: '#d9e7ce',
    ink: '#36542d',
    radius: '10px 18px 10px 18px',
    channels: ['accounts-payable', 'month-end'],
    employee: {
      name: 'Amelia Ross',
      role: 'Finance Operations Lead',
      plan: 'Max',
      avatar: 'https://i.pravatar.cc/160?img=49',
    },
  },
];

const STORAGE_KEY = 'ruby-workspace-state-v1';
const THEME_STORAGE_KEY = 'ruby-theme-v1';

function Icon({ className }: { className: string }) {
  return <i aria-hidden="true" className={className} />;
}

const podIcons = ['fa-solid fa-layer-group', 'fa-solid fa-compass-drafting', 'fa-solid fa-people-group'];

function integrationAction(scenario: DemoScenario, index: number) {
  return scenario.integrationSteps[index]?.label ?? `Verified ${scenario.copy.conversationTitle}`;
}

function ScenarioResult({ scenario, platform }: { scenario: DemoScenario; platform: Platform }) {
  if (scenario.copy.presentation === 'text') return <ConversationContent blocks={scenario.copy.response} />;
  const completion = scenario.copy.response.filter((block) => block.kind === 'paragraph' && block.tone === 'completion');
  const context = scenario.copy.response.filter((block) => !(block.kind === 'paragraph' && block.tone === 'completion'));
  return <><ConversationContent blocks={context} /><ScenarioArtifact scenario={scenario} platform={platform} /><ConversationContent blocks={completion} /></>;
}

const reviewedArtifactLeadIns: Record<string, string> = {
  'everglade-sla-risk-command': 'The live routes and current assignments are below.',
  'everglade-missed-pickup-recovery': 'All three recovery steps are confirmed below.',
  'everglade-freight-cost-spike': 'The lane comparison and its cost drivers are below.',
  'everglade-warehouse-incident': 'The incident chronology and affected customers are below.',
  'everglade-capacity-forecast': 'The depot capacity decision is below.',
  'everglade-supplier-onboarding': 'The remaining launch blocker is shown below.',
  'northstar-contract-risk-scan': 'The cited clause changes are below.',
  'northstar-nda-signature-flow': 'The signer flow and consultation slot are below.',
  'northstar-litigation-chronology': 'The cited Dawson chronology is below.',
  'northstar-clause-precedent-finder': 'The approved precedents and recommended clause are below.',
  'northstar-client-intake': 'The conflict result, partner match, and available times are below.',
  'northstar-matter-staffing': 'The workload and skill evidence behind the assignment is below.',
  'northstar-invoice-review': 'The filtered billing exceptions are below.',
  'meadow-cold-chain-alert': 'The delivery route and temperature excursion are below.',
  'meadow-batch-traceability': 'The complete path from supplier lot to customer order is below.',
  'meadow-energy-cost-review': 'The named energy drivers behind the variance are below.',
  'vector-pull-request-review': 'The two changed files, exact lines, and review findings are below.',
  'vector-regression-explorer': 'The release marker, regional baseline, and affected device segment are below.',
  'vector-documentation-drift': 'The observed API behavior, published guidance, and proposed correction are below.',
  'vector-cloud-spend-guard': 'The cost allocation, optimization opportunity, and retained spend trend are below.',
  'vector-feedback-signal-map': 'The source feedback previews and ranked product themes are below.',
  'vector-internal-tool-prototype': 'The request normalization, validation checks, and delivery stages are below.',
  'stonebridge-site-safety-brief': 'The Riverside work zones, critical risks, contractors, and due times are below.',
  'stonebridge-cost-overrun-analysis': 'The concrete forecast assumptions and cost contributions are below.',
  'stonebridge-client-progress-pack': 'The owner overview, budget position, and required decisions are below.',
  'loom-replenishment-watch': 'The at-risk products, prices, store stock, and recommended transfers are below.',
  'loom-campaign-launch': 'The approved product creative and channel-specific launch previews are below.',
  'loom-returns-diagnosis': 'The return reasons, counts, shares, and cumulative impact are below.',
  'loom-store-staffing': 'The Saturday coverage plan, open shift, and available associate are below.',
  'loom-product-launch-room': 'The opening countdown, readiness signals, and unresolved decisions are below.',
  'loom-social-content-board': 'The scheduled product posts, full creative preview, and engagement estimates are below.',
};

function DeliverableList({ scenario, platform }: { scenario: DemoScenario; platform: Platform }) {
  if (scenario.deliverables.length === 0) return null;
  const icons = { pdf: 'fa-solid fa-file-pdf', docx: 'fa-solid fa-file-word', xlsx: 'fa-solid fa-file-excel' };
  return <div className={`deliverable-list deliverable-list-${platform}`} aria-label="Shared deliverables">{scenario.deliverables.map((deliverable) => <div className="deliverable-card" key={deliverable.name}><span className={`deliverable-icon is-${deliverable.format}`}><Icon className={icons[deliverable.format]} /></span><span><strong>{deliverable.name}</strong><small>{deliverable.description}</small></span><Icon className="fa-solid fa-download" /></div>)}</div>;
}

function TeamsScenarioResult({ scenario }: { scenario: DemoScenario }) {
  if (scenario.copy.presentation === 'text') return <div className="teams-conversation-copy"><ConversationContent blocks={scenario.copy.response} /><DeliverableList scenario={scenario} platform="teams" /></div>;
  const completion = scenario.copy.response.filter((block) => block.kind === 'paragraph' && block.tone === 'completion');
  const context = scenario.copy.response.filter((block) => !(block.kind === 'paragraph' && block.tone === 'completion'));
  const leadIn = reviewedArtifactLeadIns[scenario.id] ?? `The completed ${scenario.copy.conversationTitle.toLowerCase()} is below.`;
  return <div className="teams-conversation-copy"><ConversationContent blocks={context} /><p className="conversation-paragraph teams-artifact-lead">{leadIn}</p><ScenarioArtifact scenario={scenario} platform="teams" /><ConversationContent blocks={completion} /><DeliverableList scenario={scenario} platform="teams" /></div>;
}

function RubyConversationList({ company, activeChannel, onSelect }: { company: Company; activeChannel: string; onSelect: (channel: string) => void }) {
  const workspace = scenarioLibrary[company.id];
  const scenarios = getCompanyScenarios(company.id);

  return (
    <nav className="channel-list ruby-conversation-list content-swap" aria-label="Ruby conversations">
      <div className="ruby-list-section-title"><span>Pods</span><Icon className="fa-solid fa-chevron-down" /></div>
      <div className="ruby-pod-list">
        {workspace.pods.map((pod, index) => (
          <span key={pod}><Icon className={podIcons[index]} />{pod}</span>
        ))}
      </div>

      <div className="ruby-list-section-title ruby-conversations-title"><span>Conversations</span><Icon className="fa-solid fa-chevron-down" /></div>
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          type="button"
          className={`ruby-history-item${activeChannel === scenario.id ? ' is-active' : ''}`}
          aria-label={`${scenario.copy.conversationTitle} channel`}
          aria-current={activeChannel === scenario.id ? 'page' : undefined}
          onClick={() => onSelect(scenario.id)}
        >
          <span>{scenario.copy.conversationTitle}</span>
        </button>
      ))}
    </nav>
  );
}

function SlackSidebarList({ company, activeChannel, onSelect }: { company: Company; activeChannel: string; onSelect: (channel: string) => void }) {
  const scenarios = getCompanyScenarios(company.id);

  return (
    <nav className="channel-list slack-sidebar-list content-swap" aria-label="Slack navigation">
      <div className="sidebar-section-heading"><span>Channels</span><Icon className="fa-solid fa-plus" /></div>
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          type="button"
          className={`channel-button slack-channel-item${activeChannel === scenario.id ? ' is-active' : ''}`}
          aria-label={`${scenario.copy.conversationTitle} channel`}
          aria-current={activeChannel === scenario.id ? 'page' : undefined}
          onClick={() => onSelect(scenario.id)}
        >
          <Icon className="channel-hash fa-solid fa-hashtag" />
          <span>{scenario.channel}</span>
        </button>
      ))}
      <span className="slack-add-channel"><Icon className="fa-solid fa-plus" /> Add channels</span>
    </nav>
  );
}

function TeamsSidebarList({ company, activeChannel, onSelect }: { company: Company; activeChannel: string; onSelect: (channel: string) => void }) {
  const scenarios = getCompanyScenarios(company.id);

  return (
    <nav className="channel-list teams-sidebar-list content-swap" aria-label="Teams navigation">
      <div className="teams-chat-list-header"><strong>Chat</strong><span><Icon className="fa-solid fa-filter" /><Icon className="fa-solid fa-pen-to-square" /></span></div>
      <span className="teams-recent-label"><Icon className="fa-solid fa-chevron-down" /> Recent</span>
      {scenarios.map((scenario, index) => (
        <button
          key={scenario.id}
          type="button"
          className={`teams-group-row${activeChannel === scenario.id ? ' is-active' : ''}`}
          aria-label={`${scenario.copy.conversationTitle} channel`}
          aria-current={activeChannel === scenario.id ? 'page' : undefined}
          onClick={() => onSelect(scenario.id)}
        >
          <span className="teams-group-avatar" aria-hidden="true"><span><Icon className={company.icon} /></span><img src={company.employee.avatar} alt="" /></span>
          <span className="teams-group-copy"><strong>{scenario.teamsGroup}</strong><small>{index === 0 ? `Ruby: ${scenario.receipts.length} actions completed` : `${company.employee.name}: Ready to review`}</small></span>
        </button>
      ))}
    </nav>
  );
}

function SidebarList({ platform, company, activeChannel, onSelect }: { platform: Platform; company: Company; activeChannel: string; onSelect: (channel: string) => void }) {
  if (platform === 'slack') return <SlackSidebarList company={company} activeChannel={activeChannel} onSelect={onSelect} />;
  if (platform === 'teams') return <TeamsSidebarList company={company} activeChannel={activeChannel} onSelect={onSelect} />;
  return <RubyConversationList company={company} activeChannel={activeChannel} onSelect={onSelect} />;
}

function PlatformChannelTitle({ platform, company, scenario }: { platform: Platform; company: Company; scenario: DemoScenario }) {
  if (platform === 'ruby') {
    return (
      <div key={`${company.id}-${scenario.id}`} className="channel-title ruby-channel-title content-swap">
        <span className="ruby-header-icon"><Icon className={scenario.headerIcon} /></span>
        <span className="platform-title-copy"><strong>{scenario.copy.conversationTitle}</strong><small>{company.industry}</small></span>
      </div>
    );
  }

  if (platform === 'teams') {
    return (
      <div key={`${company.id}-${scenario.id}`} className="channel-title teams-channel-title content-swap">
        <span className="teams-header-icon"><Icon className={company.icon} /></span>
        <span className="platform-title-copy"><strong>{scenario.teamsGroup}</strong><small>{company.industry}</small></span>
      </div>
    );
  }

  return (
    <div key={`${company.id}-${scenario.id}`} className="channel-title content-swap">
      <Icon className="header-hash fa-solid fa-hashtag" />
      <strong>{scenario.channel}</strong>
    </div>
  );
}

function RubyConversation({ scenario }: { scenario: DemoScenario }) {
  return (
    <div className="conversation-scroll ruby-message-stream content-swap" role="log" aria-label="Ruby conversation">
      <div className="ruby-thread">
        <div className="ruby-user-message"><RichText text={scenario.copy.userPrompt} /></div>

        <article className="ruby-response" aria-label="Ruby completed response">
          <header className="ruby-response-header">
            <img src="/ruby-logo.png" alt="Ruby assistant" />
            <span>
              <strong>Ruby</strong>
              <small>Completed in {scenario.duration} sec</small>
            </span>
          </header>

          {scenario.copy.presentation === 'artifact' && <section className="ruby-tool-run" aria-label="Completed integration actions">
            <div className="ruby-tool-grid">
              {scenario.integrations.map((integration, index) => (
                <div
                  className="ruby-tool-card"
                  key={integration}
                  aria-label={`${integrationAction(scenario, index)} completed with ${integration}`}
                >
                  <IntegrationIcon className="ruby-tool-icon" label={integration} />
                  <span className="ruby-tool-copy">
                    <strong>{integrationAction(scenario, index)}</strong>
                    <small>{integration}</small>
                  </span>
                  <Icon className="ruby-tool-check fa-regular fa-circle-check" />
                </div>
              ))}
            </div>
          </section>}

          <ScenarioResult scenario={scenario} platform="ruby" />
          <DeliverableList scenario={scenario} platform="ruby" />
        </article>
      </div>
    </div>
  );
}

function SlackConversation({ company, scenario }: { company: Company; scenario: DemoScenario }) {
  return (
    <div className="conversation-scroll slack-message-stream content-swap" role="log" aria-label="Slack channel messages">
      <section className="slack-channel-header" aria-label="Slack channel header">
        <div className="slack-channel-header-inner">
          <div className="slack-channel-identity">
            <span className="slack-channel-name">
              <strong>#{scenario.channel}</strong>
              <Icon className="fa-solid fa-chevron-down" />
            </span>
            <span className="slack-channel-members">
              <span className="slack-member-avatars" aria-hidden="true">
                <img src={company.employee.avatar} alt="" />
                <img src="https://i.pravatar.cc/48?img=33" alt="" />
                <img src="https://i.pravatar.cc/48?img=14" alt="" />
              </span>
              <strong>48 members</strong>
              <span className="slack-huddle-icon"><Icon className="fa-solid fa-headphones" /></span>
            </span>
          </div>
          <p>{scenario.copy.conversationTitle} coordination, decisions, and completed work for {company.name}.</p>
          <nav className="slack-channel-tabs" aria-label="Slack channel tabs">
            <span className="is-active">Messages</span>
            <span>Canvas</span>
            <span>Files</span>
            <span>Pins</span>
            <span><Icon className="fa-solid fa-plus" /></span>
          </nav>
        </div>
      </section>
      <div className="slack-feed-content">
        <div className="slack-date-divider"><span>Today</span></div>
        <div className="slack-thread">
          <article className="slack-message">
            <img className="slack-avatar" src={company.employee.avatar} alt={company.employee.name} />
            <div className="slack-message-body">
              <header className="slack-message-meta">
                <strong>{company.employee.name}</strong>
                <time>9:41 AM</time>
              </header>
              <p><RichText text={scenario.copy.userPrompt} /></p>
            </div>
            <div className="slack-message-actions">
              <button type="button" aria-label="Reply in thread"><Icon className="fa-solid fa-reply" /></button>
              <button type="button" aria-label="More message actions"><Icon className="fa-solid fa-ellipsis" /></button>
            </div>
          </article>

          <article className="slack-message slack-ruby-message">
            <img className="slack-avatar slack-ruby-avatar" src="/ruby-logo.png" alt="Ruby assistant" />
            <div className="slack-message-body">
              <header className="slack-message-meta">
                <strong>Ruby</strong>
                <span className="slack-app-badge">APP</span>
                <time>9:42 AM</time>
              </header>
              <span className="slack-completion-status"><Icon className="fa-solid fa-circle-check" /> Completed in {scenario.duration} sec</span>
              <div className={`slack-result-summary${scenario.copy.presentation === 'text' ? ' is-text-first' : ''}`}>
                {scenario.copy.presentation === 'artifact' && <div className="slack-tool-receipts" aria-label="Completed actions">
                  {scenario.integrations.map((integration) => (
                    <span key={integration}>
                      <IntegrationIcon label={integration} />
                      {integration}
                      <Icon className="fa-solid fa-check" />
                    </span>
                  ))}
                </div>}
                <ScenarioResult scenario={scenario} platform="slack" />
                <DeliverableList scenario={scenario} platform="slack" />
              </div>

              <div className="slack-reactions" aria-label="Slack reactions">
                {scenario.engagement.slackReactions.map((reaction) => <span key={reaction.emoji}>{reaction.emoji} {reaction.count}</span>)}
                <span><Icon className="fa-regular fa-face-smile" /> +</span>
              </div>
              {scenario.engagement.replyCount > 0 && <div className="slack-thread-summary">
                <span className="slack-reply-avatars" aria-hidden="true">
                  {scenario.engagement.responderIds.map((personId) => <img key={personId} src={getPerson(personId).avatar} alt="" />)}
                </span>
                <strong>{scenario.engagement.replyCount} {scenario.engagement.replyCount === 1 ? 'reply' : 'replies'}</strong>
                <small>Last reply {scenario.engagement.lastReplyLabel.toLowerCase()}</small>
              </div>}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function TeamsConversation({ company, scenario }: { company: Company; scenario: DemoScenario }) {
  return (
    <div className="conversation-scroll teams-chat-stream content-swap" role="log" aria-label="Teams group chat">
      <header className="teams-group-header">
        <span className="teams-group-header-copy"><strong>{scenario.teamsGroup}</strong><small>6 participants</small></span>
        <nav className="teams-group-tabs" aria-label="Group chat tabs"><span className="is-active">Chat</span><span>Files</span><span><Icon className="fa-solid fa-plus" /></span></nav>
        <span className="teams-group-actions" aria-hidden="true"><Icon className="fa-solid fa-phone" /><Icon className="fa-solid fa-video" /><span><Icon className="fa-solid fa-user-group" /> 6</span><Icon className="fa-solid fa-ellipsis" /></span>
      </header>

      <div className="teams-chat-content">
        <div className="teams-date-divider"><span>Today</span></div>

        <article className="teams-chat-message">
          <img src={company.employee.avatar} alt={company.employee.name} />
          <div className="teams-chat-message-body">
            <header><strong>{company.employee.name}</strong><time>9:41 AM</time></header>
            <div className="teams-chat-bubble teams-user-bubble"><RichText text={scenario.copy.userPrompt} /></div>
            <div className="teams-bubble-reactions" aria-hidden="true">{scenario.engagement.teamsUserReactions.map((reaction) => <span key={reaction.emoji}>{reaction.emoji} {reaction.count}</span>)}</div>
          </div>
        </article>

        <article className="teams-chat-message teams-ruby-chat-message">
          <img className="teams-ruby-avatar" src="/ruby-logo.png" alt="Ruby assistant" />
          <div className="teams-chat-message-body">
            <header><strong>Ruby</strong><span className="teams-bot-badge">BOT</span><time>9:42 AM</time></header>
            <div className="teams-chat-bubble teams-ruby-bubble">
              <span className="teams-complete-label"><Icon className="fa-solid fa-circle-check" /> Completed in {scenario.duration} sec</span>
              {scenario.copy.presentation === 'artifact' && <div className="teams-tool-receipts" aria-label="Completed actions">
                {scenario.integrations.map((integration) => <span key={integration}><IntegrationIcon label={integration} />{integration}</span>)}
              </div>}
              <TeamsScenarioResult scenario={scenario} />
            </div>
            <span className="teams-reactions" aria-label="Teams reactions">{scenario.engagement.teamsRubyReactions.map((reaction) => <span key={reaction.emoji}>{reaction.emoji} {reaction.count}</span>)}<span><Icon className="fa-regular fa-face-smile" /> +</span></span>
          </div>
        </article>
      </div>
    </div>
  );
}

function ConversationPreview({ platform, company, scenario }: { platform: Platform; company: Company; scenario: DemoScenario }) {
  if (platform === 'slack') return <SlackConversation company={company} scenario={scenario} />;
  if (platform === 'teams') return <TeamsConversation company={company} scenario={scenario} />;
  return <RubyConversation scenario={scenario} />;
}

function RubyComposer() {
  return (
    <fieldset
      className="composer-shell ruby-composer content-swap"
      aria-label="Chat input preview"
      aria-disabled="true"
    >
      <div className="composer-prompt-row">
        <span className="composer-placeholder">Ask Ruby to help with this workspace…</span>
      </div>
      <div className="composer-toolbar" aria-hidden="true">
        <span className="composer-tools">
          <span className="agent-pill">
            <Icon className="fa-solid fa-robot" />
            <span>Agent</span>
          </span>
          <Icon className="fa-solid fa-wand-magic-sparkles" />
          <Icon className="fa-solid fa-paperclip" />
          <Icon className="fa-solid fa-ellipsis" />
        </span>
        <span className="composer-actions">
          <Icon className="fa-solid fa-microphone" />
          <span className="send-orb">
            <Icon className="fa-solid fa-arrow-up" />
          </span>
        </span>
      </div>
    </fieldset>
  );
}

function SlackComposer({ channel }: { channel: string }) {
  return (
    <fieldset
      className="composer-shell slack-composer content-swap"
      aria-label="Slack message composer"
      aria-disabled="true"
    >
      <div className="slack-input-line">
        <span>Message #{channel}</span>
      </div>
      <div className="slack-toolbar" aria-hidden="true">
        <span className="slack-toolbar-group">
          <span className="slack-plus"><Icon className="fa-solid fa-plus" /></span>
          <span className="slack-divider" />
          <span className="slack-format-aa">Aa</span>
          <Icon className="fa-solid fa-bold" />
          <Icon className="fa-solid fa-italic" />
          <Icon className="fa-solid fa-strikethrough" />
          <Icon className="fa-solid fa-link" />
          <Icon className="fa-solid fa-list-ul" />
        </span>
        <span className="slack-toolbar-group slack-toolbar-end">
          <Icon className="fa-solid fa-microphone" />
          <Icon className="fa-solid fa-video" />
          <Icon className="fa-regular fa-face-smile" />
          <Icon className="fa-solid fa-at" />
          <span className="slack-send"><Icon className="fa-solid fa-paper-plane" /></span>
        </span>
      </div>
    </fieldset>
  );
}

function TeamsComposer() {
  return (
    <fieldset
      className="composer-shell teams-composer content-swap"
      aria-label="Teams message composer"
      aria-disabled="true"
    >
      <div className="teams-input-line">Type a new message</div>
      <div className="teams-toolbar" aria-hidden="true">
        <span className="teams-toolbar-group">
          <span className="teams-format-icon"><span>A</span><Icon className="fa-solid fa-pen" /></span>
          <Icon className="fa-solid fa-paperclip" />
          <Icon className="fa-regular fa-face-smile" />
          <span className="teams-gif">GIF</span>
          <Icon className="fa-regular fa-note-sticky" />
          <Icon className="fa-solid fa-link" />
          <Icon className="fa-solid fa-ellipsis" />
        </span>
        <span className="teams-send"><Icon className="fa-solid fa-paper-plane" /></span>
      </div>
    </fieldset>
  );
}

function ComposerPreview({ platform, channel }: { platform: Platform; channel: string }) {
  if (platform === 'slack') return <SlackComposer channel={channel} />;
  if (platform === 'teams') return <TeamsComposer />;
  return <RubyComposer />;
}

type MobileSurface =
  | 'ruby-chat' | 'ruby-sidebar'
  | 'slack-channel' | 'slack-home' | 'slack-workspaces' | 'slack-dms' | 'slack-activity' | 'slack-more'
  | 'teams-chat' | 'teams-chat-list' | 'teams-organizations' | 'teams-activity' | 'teams-calendar' | 'teams-more';

const mobileChatSurface: Record<Platform, MobileSurface> = {
  ruby: 'ruby-chat',
  slack: 'slack-channel',
  teams: 'teams-chat',
};

const MOBILE_MEDIA_QUERY = '(max-width: 720px), (max-height: 460px) and (max-width: 900px)';

function useMobileLayout() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => undefined;
      const query = window.matchMedia(MOBILE_MEDIA_QUERY);
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => typeof window.matchMedia === 'function' && window.matchMedia(MOBILE_MEDIA_QUERY).matches,
    () => false,
  );
}

function MobileDrawer({ label, closeLabel, onClose, children }: { label: string; closeLabel: string; onClose: () => void; children: ReactNode }) {
  const drawerRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(drawer.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'));
    focusable()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [onClose]);
  return (
    <div className="mobile-drawer-layer">
      <button type="button" className="mobile-drawer-scrim" aria-label={closeLabel} onClick={onClose} />
      <dialog open ref={drawerRef} className="mobile-drawer" aria-modal="true" aria-label={label}>
        <button type="button" className="mobile-drawer-close" aria-label={closeLabel} onClick={onClose}><Icon className="fa-solid fa-xmark" /></button>
        {children}
      </dialog>
    </div>
  );
}

function MobilePlatformSwitcher({ platform, open, onToggle, onSelect }: { platform: Platform; open: boolean; onToggle: () => void; onSelect: (platform: Platform) => void }) {
  return (
    <div className={`mobile-platform-float${open ? ' is-open' : ''}`}>
      {open && <fieldset className="mobile-platform-options" aria-label="Mobile platform switcher">
        {(['ruby', 'slack', 'teams'] as Platform[]).map((item) => <button type="button" key={item} aria-label={`Use ${item === 'ruby' ? 'Ruby' : item === 'slack' ? 'Slack' : 'Teams'}`} aria-pressed={platform === item} onClick={() => onSelect(item)}>{item === 'ruby' ? <img src="/ruby-logo.png" alt="" /> : item === 'slack' ? <img src="https://img.icons8.com/color/48/slack-new.png" alt="" /> : <img src="https://img.icons8.com/color/48/microsoft-teams.png" alt="" />}<span>{item === 'ruby' ? 'Ruby' : item === 'slack' ? 'Slack' : 'Teams'}</span></button>)}
      </fieldset>}
      <button type="button" className="mobile-platform-trigger" aria-label={open ? 'Close platform switcher' : 'Open platform switcher'} aria-expanded={open} onClick={onToggle}>{platform === 'ruby' ? <img src="/ruby-logo.png" alt="" /> : platform === 'slack' ? <img src="https://img.icons8.com/color/48/slack-new.png" alt="" /> : <img src="https://img.icons8.com/color/48/microsoft-teams.png" alt="" />}<Icon className={`fa-solid fa-chevron-${open ? 'down' : 'up'}`} /></button>
    </div>
  );
}

function MobileCompanyList({ activeCompany, onSelect }: { activeCompany: Company; onSelect: (company: Company) => void }) {
  return <div className="mobile-company-list">{companies.map((company) => <button type="button" key={company.id} className={company.id === activeCompany.id ? 'is-active' : ''} aria-label={`${company.name} workspace`} onClick={() => onSelect(company)}><span style={{ '--company-color': company.color, '--company-ink': company.ink } as CSSProperties}><Icon className={company.icon} /></span><span><strong>{company.name}</strong><small>{company.industry}</small></span>{company.id === activeCompany.id && <Icon className="fa-solid fa-check" />}</button>)}</div>;
}

function MobileChatCanvas({ platform, company, scenario, bottomTabs }: { platform: Platform; company: Company; scenario: DemoScenario; bottomTabs?: ReactNode }) {
  return <><div className="mobile-chat-canvas"><ConversationPreview platform={platform} company={company} scenario={scenario} /><div className="mobile-composer"><ComposerPreview platform={platform} channel={scenario.channel} /></div></div>{bottomTabs}</>;
}

function RubyMobileShell({ company, scenario, surface, theme, onSurface, onScenario, onCompany, onTheme }: { company: Company; scenario: DemoScenario; surface: MobileSurface; theme: Theme; onSurface: (surface: MobileSurface) => void; onScenario: (id: string) => void; onCompany: (company: Company) => void; onTheme: () => void }) {
  const drawerOpen = surface === 'ruby-sidebar';
  return <section className="mobile-shell ruby-mobile-shell" aria-label="Ruby mobile chat">
    <header className="mobile-app-bar ruby-mobile-app-bar"><button type="button" aria-label="Open Ruby menu" onClick={() => onSurface('ruby-sidebar')}><Icon className="fa-solid fa-bars" /></button><span><strong>{scenario.copy.conversationTitle}</strong><small>{company.name}</small></span><button type="button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={onTheme}><Icon className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} /></button></header>
    <MobileChatCanvas platform="ruby" company={company} scenario={scenario} />
    {drawerOpen && <MobileDrawer label="Ruby navigation" closeLabel="Close Ruby menu" onClose={() => onSurface('ruby-chat')}><div className="ruby-mobile-drawer-head"><img src="/ruby-logo.png" alt="Ruby" /><strong>Ruby</strong></div><button type="button" className="mobile-primary-action"><Icon className="fa-solid fa-plus" /> New chat</button><label className="mobile-search"><Icon className="fa-solid fa-magnifying-glass" /><input aria-label="Search Ruby conversations" placeholder="Search chats" /></label><strong className="mobile-section-label">Pods</strong><div className="ruby-mobile-pods">{scenarioLibrary[company.id].pods.map((pod, index) => <span key={pod}><Icon className={podIcons[index]} />{pod}</span>)}</div><strong className="mobile-section-label">Conversations</strong><nav className="mobile-conversation-list" aria-label="Ruby mobile conversations">{getCompanyScenarios(company.id).map((item) => <button type="button" key={item.id} className={item.id === scenario.id ? 'is-active' : ''} aria-label={`${item.copy.conversationTitle} channel`} onClick={() => onScenario(item.id)}>{item.copy.conversationTitle}</button>)}</nav><strong className="mobile-section-label">Workspaces</strong><MobileCompanyList activeCompany={company} onSelect={onCompany} /><div className="mobile-account-row"><img src={company.employee.avatar} alt="" /><span><strong>{company.employee.name}</strong><small>{company.employee.role}</small></span></div></MobileDrawer>}
  </section>;
}

function SlackMobileTabs({ surface, onSurface }: { surface: MobileSurface; onSurface: (surface: MobileSurface) => void }) {
  const tabs: [MobileSurface, string, string][] = [['slack-home', 'Home', 'fa-solid fa-house'], ['slack-dms', 'DMs', 'fa-regular fa-comment'], ['slack-activity', 'Activity', 'fa-regular fa-bell'], ['slack-more', 'More', 'fa-solid fa-ellipsis']];
  const active = surface === 'slack-channel' || surface === 'slack-workspaces' ? 'slack-home' : surface;
  return <nav className="mobile-bottom-tabs slack-mobile-tabs" aria-label="Slack mobile tabs">{tabs.map(([target, label, icon]) => { const disabled = target !== 'slack-home'; return <button type="button" key={target} disabled={disabled} className={active === target ? 'is-active' : ''} aria-label={label} aria-current={active === target ? 'page' : undefined} onClick={disabled ? undefined : () => onSurface(target)}><Icon className={icon} /><span>{label}</span></button>; })}</nav>;
}

function SlackMobileHome({ company, scenario, onSurface, onScenario }: { company: Company; scenario: DemoScenario; onSurface: (surface: MobileSurface) => void; onScenario: (id: string) => void }) {
  return <section className="mobile-list-surface slack-mobile-home" aria-label="Slack mobile home"><header><button type="button" className="mobile-workspace-button" aria-label="Open Slack workspaces" onClick={() => onSurface('slack-workspaces')}><span style={{ '--company-color': company.color, '--company-ink': company.ink } as CSSProperties}><Icon className={company.icon} /></span></button><strong>Home</strong><button type="button" aria-label="Search Slack"><Icon className="fa-solid fa-magnifying-glass" /></button></header><div className="slack-mobile-quick"><button type="button"><Icon className="fa-solid fa-bolt" /> Catch up</button><button type="button"><Icon className="fa-solid fa-at" /> Threads</button><button type="button"><Icon className="fa-regular fa-clock" /> Later</button></div><h2>Channels</h2><nav className="mobile-conversation-list" aria-label="Slack mobile channels">{getCompanyScenarios(company.id).map((item) => <button type="button" key={item.id} className={item.id === scenario.id ? 'is-active' : ''} aria-label={`${item.copy.conversationTitle} channel`} onClick={() => onScenario(item.id)}><Icon className="fa-solid fa-hashtag" /><span><strong>{item.channel}</strong><small>{item.id === scenario.id ? 'Ruby completed the workflow' : 'Ready to review'}</small></span></button>)}</nav></section>;
}

function MobileSecondarySurface({ platform, title, icon, theme, onTheme }: { platform: 'slack' | 'teams'; title: string; icon: string; theme?: Theme; onTheme?: () => void }) {
  return <section className={`mobile-list-surface ${platform}-mobile-secondary`} aria-label={`${platform === 'slack' ? 'Slack' : 'Teams'} mobile ${title.toLowerCase()}`}><header><strong>{title}</strong><button type="button" aria-label={`Search ${title}`}><Icon className="fa-solid fa-magnifying-glass" /></button></header>{title === 'More' ? <div className="mobile-settings-menu"><button type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={onTheme}><Icon className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} /><span>Appearance</span><small>{theme === 'dark' ? 'Dark' : 'Light'}</small></button><button type="button"><Icon className="fa-solid fa-gear" /><span>Settings</span><Icon className="fa-solid fa-chevron-right" /></button><button type="button"><Icon className="fa-regular fa-bell" /><span>Notifications</span><Icon className="fa-solid fa-chevron-right" /></button></div> : <div className="mobile-secondary-hero"><Icon className={icon} /><strong>{title}</strong><p>{title === 'Activity' ? 'Workflow updates and mentions appear here.' : 'Today’s company events and handoffs.'}</p></div>}</section>;
}

function SlackMobileShell({ company, scenario, surface, theme, onSurface, onScenario, onCompany, onTheme }: { company: Company; scenario: DemoScenario; surface: MobileSurface; theme: Theme; onSurface: (surface: MobileSurface) => void; onScenario: (id: string) => void; onCompany: (company: Company) => void; onTheme: () => void }) {
  const tabs = <SlackMobileTabs surface={surface} onSurface={onSurface} />;
  return <section className="mobile-shell slack-mobile-shell">
    {surface === 'slack-channel' ? <section className="mobile-chat-view" aria-label="Slack mobile channel"><header className="mobile-app-bar slack-mobile-app-bar"><button type="button" aria-label="Back to Slack home" onClick={() => onSurface('slack-home')}><Icon className="fa-solid fa-chevron-left" /></button><span><strong>#{scenario.channel}</strong><small>{company.name}</small></span><span className="mobile-header-actions"><Icon className="fa-solid fa-headphones" /><Icon className="fa-solid fa-user-group" /></span></header><MobileChatCanvas platform="slack" company={company} scenario={scenario} bottomTabs={tabs} /></section> : surface === 'slack-home' || surface === 'slack-workspaces' ? <><SlackMobileHome company={company} scenario={scenario} onSurface={onSurface} onScenario={onScenario} />{tabs}</> : <><MobileSecondarySurface platform="slack" title={surface === 'slack-dms' ? 'DMs' : surface === 'slack-activity' ? 'Activity' : 'More'} icon={surface === 'slack-dms' ? 'fa-regular fa-comment' : surface === 'slack-activity' ? 'fa-regular fa-bell' : 'fa-solid fa-sliders'} theme={theme} onTheme={onTheme} />{tabs}</>}
    {surface === 'slack-workspaces' && <MobileDrawer label="Slack workspaces" closeLabel="Close Slack workspaces" onClose={() => onSurface('slack-home')}><div className="slack-mobile-drawer-head"><img src="https://img.icons8.com/color/48/slack-new.png" alt="Slack" /><span><strong>Switch workspace</strong><small>{company.name}</small></span></div><MobileCompanyList activeCompany={company} onSelect={onCompany} /></MobileDrawer>}
  </section>;
}

function TeamsMobileTabs({ surface, onSurface }: { surface: MobileSurface; onSurface: (surface: MobileSurface) => void }) {
  const tabs: [MobileSurface, string, string][] = [['teams-activity', 'Activity', 'fa-regular fa-bell'], ['teams-chat-list', 'Chat', 'fa-regular fa-comment-dots'], ['teams-calendar', 'Calendar', 'fa-regular fa-calendar'], ['teams-more', 'More', 'fa-solid fa-ellipsis']];
  const active = surface === 'teams-chat' || surface === 'teams-organizations' ? 'teams-chat-list' : surface;
  return <nav className="mobile-bottom-tabs teams-mobile-tabs" aria-label="Teams mobile tabs">{tabs.map(([target, label, icon]) => { const disabled = target !== 'teams-chat-list'; return <button type="button" key={target} disabled={disabled} className={active === target ? 'is-active' : ''} aria-label={label} aria-current={active === target ? 'page' : undefined} onClick={disabled ? undefined : () => onSurface(target)}><Icon className={icon} /><span>{label}</span></button>; })}</nav>;
}

function TeamsMobileChatList({ company, scenario, onSurface, onScenario }: { company: Company; scenario: DemoScenario; onSurface: (surface: MobileSurface) => void; onScenario: (id: string) => void }) {
  return <section className="mobile-list-surface teams-mobile-list" aria-label="Teams mobile chat list"><header><button type="button" aria-label="Open Teams organizations" onClick={() => onSurface('teams-organizations')}><img src={company.employee.avatar} alt="" /></button><strong>Chat</strong><span><button type="button" aria-label="Filter chats"><Icon className="fa-solid fa-filter" /></button><button type="button" aria-label="New group chat"><Icon className="fa-solid fa-pen-to-square" /></button></span></header><label className="mobile-search"><Icon className="fa-solid fa-magnifying-glass" /><input aria-label="Search Teams chats" placeholder="Search" /></label><nav className="teams-mobile-groups" aria-label="Teams group chats">{getCompanyScenarios(company.id).map((item) => <button type="button" key={item.id} className={item.id === scenario.id ? 'is-active' : ''} aria-label={`${item.copy.conversationTitle} channel`} onClick={() => onScenario(item.id)}><span className="teams-mobile-group-avatar"><Icon className={company.icon} /></span><span><strong>{item.copy.conversationTitle}</strong><small>{company.employee.name}: Ready to review</small></span><time>{item.id === scenario.id ? 'Now' : 'Yesterday'}</time></button>)}</nav></section>;
}

function TeamsMobileShell({ company, scenario, surface, theme, onSurface, onScenario, onCompany, onTheme }: { company: Company; scenario: DemoScenario; surface: MobileSurface; theme: Theme; onSurface: (surface: MobileSurface) => void; onScenario: (id: string) => void; onCompany: (company: Company) => void; onTheme: () => void }) {
  const tabs = <TeamsMobileTabs surface={surface} onSurface={onSurface} />;
  return <section className="mobile-shell teams-mobile-shell">
    {surface === 'teams-chat' ? <section className="mobile-chat-view" aria-label="Teams mobile group chat"><header className="mobile-app-bar teams-mobile-app-bar"><button type="button" aria-label="Back to Teams chats" onClick={() => onSurface('teams-chat-list')}><Icon className="fa-solid fa-chevron-left" /></button><span><strong>{scenario.copy.conversationTitle}</strong><small>6 participants</small></span><span className="mobile-header-actions"><Icon className="fa-solid fa-video" /><Icon className="fa-solid fa-phone" /><Icon className="fa-solid fa-ellipsis" /></span></header><MobileChatCanvas platform="teams" company={company} scenario={scenario} bottomTabs={tabs} /></section> : surface === 'teams-chat-list' || surface === 'teams-organizations' ? <><TeamsMobileChatList company={company} scenario={scenario} onSurface={onSurface} onScenario={onScenario} />{tabs}</> : <><MobileSecondarySurface platform="teams" title={surface === 'teams-activity' ? 'Activity' : surface === 'teams-calendar' ? 'Calendar' : 'More'} icon={surface === 'teams-activity' ? 'fa-regular fa-bell' : surface === 'teams-calendar' ? 'fa-regular fa-calendar' : 'fa-solid fa-sliders'} theme={theme} onTheme={onTheme} />{tabs}</>}
    {surface === 'teams-organizations' && <MobileDrawer label="Teams organizations" closeLabel="Close Teams organizations" onClose={() => onSurface('teams-chat-list')}><div className="teams-mobile-drawer-head"><img src="https://img.icons8.com/color/48/microsoft-teams.png" alt="Teams" /><span><strong>Accounts and organizations</strong><small>{company.name}</small></span></div><MobileCompanyList activeCompany={company} onSelect={onCompany} /><div className="mobile-settings-menu"><button type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={onTheme}><Icon className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} /><span>Appearance</span><small>{theme === 'dark' ? 'Dark' : 'Light'}</small></button><button type="button"><Icon className="fa-solid fa-gear" /><span>Settings</span><Icon className="fa-solid fa-chevron-right" /></button></div></MobileDrawer>}
  </section>;
}

function MobileWorkspace({ platform, company, scenario, surface, platformSwitcherOpen, theme, onSurface, onScenario, onCompany, onTheme, onTogglePlatform, onPlatform }: { platform: Platform; company: Company; scenario: DemoScenario; surface: MobileSurface; platformSwitcherOpen: boolean; theme: Theme; onSurface: (surface: MobileSurface) => void; onScenario: (id: string) => void; onCompany: (company: Company) => void; onTheme: () => void; onTogglePlatform: () => void; onPlatform: (platform: Platform) => void }) {
  const showPlatformSwitcher = surface === 'ruby-chat' || surface === 'slack-channel' || surface === 'teams-chat';
  return <div className={`mobile-workspace mobile-platform-${platform}`}>{platform === 'ruby' ? <RubyMobileShell company={company} scenario={scenario} surface={surface} theme={theme} onSurface={onSurface} onScenario={onScenario} onCompany={onCompany} onTheme={onTheme} /> : platform === 'slack' ? <SlackMobileShell company={company} scenario={scenario} surface={surface} theme={theme} onSurface={onSurface} onScenario={onScenario} onCompany={onCompany} onTheme={onTheme} /> : <TeamsMobileShell company={company} scenario={scenario} surface={surface} theme={theme} onSurface={onSurface} onScenario={onScenario} onCompany={onCompany} onTheme={onTheme} />}{showPlatformSwitcher && <MobilePlatformSwitcher platform={platform} open={platformSwitcherOpen} onToggle={onTogglePlatform} onSelect={onPlatform} />}</div>;
}

function MobileWorkspaceController({ platform, company, scenario, theme, onScenario, onCompany, onTheme, onPlatform }: { platform: Platform; company: Company; scenario: DemoScenario; theme: Theme; onScenario: (id: string) => void; onCompany: (company: Company) => void; onTheme: () => void; onPlatform: (platform: Platform) => void }) {
  const [surface, setSurface] = useState<MobileSurface>(mobileChatSurface[platform]);
  const [platformSwitcherOpen, setPlatformSwitcherOpen] = useState(false);
  const effectiveSurface = surface.startsWith(`${platform}-`) ? surface : mobileChatSurface[platform];
  const selectScenario = (scenarioId: string) => { onScenario(scenarioId); setSurface(mobileChatSurface[platform]); };
  const selectCompany = (nextCompany: Company) => { onCompany(nextCompany); setSurface(mobileChatSurface[platform]); };
  const selectPlatform = (nextPlatform: Platform) => { onPlatform(nextPlatform); setSurface(mobileChatSurface[nextPlatform]); setPlatformSwitcherOpen(false); };
  return <MobileWorkspace platform={platform} company={company} scenario={scenario} surface={effectiveSurface} platformSwitcherOpen={platformSwitcherOpen} theme={theme} onSurface={setSurface} onScenario={selectScenario} onCompany={selectCompany} onTheme={onTheme} onTogglePlatform={() => setPlatformSwitcherOpen((open) => !open)} onPlatform={selectPlatform} />;
}

export default function Home(): JSX.Element {
  const [platform, setPlatform] = useState<Platform>('ruby');
  const [theme, setTheme] = useState<Theme>('light');
  const [activeCompanyId, setActiveCompanyId] = useState(companies[0].id);
  const activeCompany =
    companies.find((company) => company.id === activeCompanyId) ?? companies[0];
  const [activeChannel, setActiveChannel] = useState(getCompanyScenarios(companies[0].id)[0].id);
  const activeScenario =
    getScenario(activeCompany.id, activeChannel) ?? getCompanyScenarios(activeCompany.id)[0];
  const [hasRestored, setHasRestored] = useState(false);
  const [hasRestoredTheme, setHasRestoredTheme] = useState(false);
  const [railTooltip, setRailTooltip] = useState<{ companyId: string; label: string; top: number } | null>(null);
  const isMobile = useMobileLayout();

  useEffect(() => {
    try {
      if (localStorage.getItem(THEME_STORAGE_KEY) === 'dark') setTheme('dark');
    } finally {
      setHasRestoredTheme(true);
    }
  }, []);

  useEffect(() => {
    if (hasRestoredTheme) localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [hasRestoredTheme, theme]);

  useEffect(() => {
    try {
      const savedValue = localStorage.getItem(STORAGE_KEY);
      if (savedValue) {
        const saved = JSON.parse(savedValue) as {
          companyId?: string;
          channel?: string;
          platform?: Platform;
        };
        const savedCompany =
          companies.find((company) => company.id === saved.companyId) ?? companies[0];
        const savedScenarios = getCompanyScenarios(savedCompany.id);
        const savedChannel = savedScenarios.some((scenario) => scenario.id === saved.channel)
          ? saved.channel!
          : savedScenarios[0].id;
        const savedPlatform = ['ruby', 'slack', 'teams'].includes(saved.platform ?? '')
          ? saved.platform!
          : 'ruby';

        // oxlint-disable-next-line react/react-compiler -- restore validated browser state after hydration.
        setActiveCompanyId(savedCompany.id);
        setActiveChannel(savedChannel);
        setPlatform(savedPlatform);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!hasRestored) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        companyId: activeCompanyId,
        channel: activeChannel,
        platform,
      }),
    );
  }, [activeChannel, activeCompanyId, hasRestored, platform]);

  function selectCompany(company: Company) {
    setActiveCompanyId(company.id);
    setActiveChannel(getCompanyScenarios(company.id)[0].id);
  }

  function selectMobileCompany(company: Company) {
    const currentIndex = Math.max(0, getCompanyScenarios(activeCompany.id).findIndex((item) => item.id === activeScenario.id));
    const scenarios = getCompanyScenarios(company.id);
    setActiveCompanyId(company.id);
    setActiveChannel(scenarios[currentIndex]?.id ?? scenarios[0].id);
  }

  function showRailTooltip(company: Company, target: HTMLButtonElement) {
    const rail = target.closest('.server-rail');
    if (!rail) return;
    const targetRect = target.getBoundingClientRect();
    const railRect = rail.getBoundingClientRect();
    setRailTooltip({
      companyId: company.id,
      label: `${company.industry} · ${company.name}`,
      top: targetRect.top - railRect.top + targetRect.height / 2,
    });
  }

  const mainClassName = `app-stage platform-${platform} theme-${theme} ${hasRestored ? 'is-restored' : 'is-restoring'}`;

  if (isMobile) {
    return <main className={mainClassName} aria-label={`${activeCompany.name} workspace`}><MobileWorkspaceController platform={platform} company={activeCompany} scenario={activeScenario} theme={theme} onScenario={setActiveChannel} onCompany={selectMobileCompany} onTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} onPlatform={setPlatform} /></main>;
  }

  return (
    <main
      className={mainClassName}
      aria-label={`${activeCompany.name} workspace`}
    >
      <div className="workspace-frame">
        <aside className="server-rail" aria-label="Workspace navigation">
          <div className="server-list-scroll">
            {companies.map((company) => (
              <div key={company.id} className={`server-tile-shell${activeCompany.id === company.id ? ' is-active' : ''}`}>
                <button
                  type="button"
                  className="server-logo server-tile"
                  aria-label={`${company.name} server`}
                  aria-pressed={activeCompany.id === company.id}
                  data-tooltip={`${company.industry} · ${company.name}`}
                  aria-describedby={railTooltip?.companyId === company.id ? 'workspace-rail-tooltip' : undefined}
                  onClick={() => selectCompany(company)}
                  onMouseEnter={(event) => showRailTooltip(company, event.currentTarget)}
                  onMouseLeave={() => setRailTooltip(null)}
                  onFocus={(event) => showRailTooltip(company, event.currentTarget)}
                  onBlur={() => setRailTooltip(null)}
                  style={
                    {
                      '--company-color': company.color,
                      '--company-ink': company.ink,
                      '--company-radius': company.radius,
                    } as CSSProperties
                  }
                >
                  <Icon className={company.icon} />
                </button>
              </div>
            ))}
          </div>

          {railTooltip && <span id="workspace-rail-tooltip" role="tooltip" className="workspace-rail-tooltip" style={{ '--tooltip-top': `${railTooltip.top}px` } as CSSProperties}>{railTooltip.label}</span>}

          <button
            type="button"
            className="rail-button"
            aria-label="Download apps"
          >
            <Icon className="fa-solid fa-arrow-down" />
          </button>
        </aside>

        <aside className="channel-sidebar" aria-label={`${activeCompany.name} channels`}>
          <header key={`server-${activeCompany.id}`} className="server-header content-swap">
            <div
              className="server-title-meta"
              aria-label={`${activeCompany.industry} · ${activeCompany.name}`}
            >
              <div className="server-title-row">
                <h1>{activeCompany.name}</h1>
                {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- icon font has no image source. */}
                <span className="verified-badge" role="img" aria-label="Verified company">
                  <Icon className="fa-solid fa-circle-check" />
                </span>
              </div>
              <span className="industry-tag">{activeCompany.industry}</span>
            </div>
            <button type="button" className="icon-button" aria-label="Server menu">
              <Icon className="fa-solid fa-chevron-down" />
            </button>
          </header>

          <SidebarList
            key={`${platform}-channels-${activeCompany.id}`}
            platform={platform}
            company={activeCompany}
            activeChannel={activeChannel}
            onSelect={setActiveChannel}
          />

          <footer key={`user-${activeCompany.id}`} className="user-panel content-swap">
            <span className="avatar">
              <img src={activeCompany.employee.avatar} alt={activeCompany.employee.name} />
              <span className="status-dot" />
            </span>
            <span className="user-copy">
              <span className="user-name-line">
                <strong>{activeCompany.employee.name}</strong>
                <span className={`plan-tag plan-${activeCompany.employee.plan.toLowerCase()}`}>
                  {activeCompany.employee.plan}
                </span>
              </span>
              <small>{activeCompany.employee.role}</small>
            </span>
            <button type="button" className="icon-button" aria-label="User settings">
              <Icon className="fa-solid fa-gear" />
            </button>
          </footer>
        </aside>

        <section className="chat-panel" aria-label={`${activeScenario.copy.conversationTitle} channel`}>
          <header className="chat-header">
            <PlatformChannelTitle platform={platform} company={activeCompany} scenario={activeScenario} />

            <div className="header-controls">
              <fieldset className="platform-switcher" aria-label="Workspace platform">
                <button
                  type="button"
                  aria-label="Use Ruby"
                  aria-pressed={platform === 'ruby'}
                  onClick={() => setPlatform('ruby')}
                >
                  <img className="platform-icon platform-icon-ruby" src="/ruby-logo.png" alt="Ruby logo" />
                  <span>Ruby</span>
                </button>
                <button
                  type="button"
                  aria-label="Use Slack"
                  aria-pressed={platform === 'slack'}
                  onClick={() => setPlatform('slack')}
                >
                  <img
                    className="platform-icon"
                    src="https://img.icons8.com/color/48/slack-new.png"
                    alt="Slack"
                  />
                  <span>Slack</span>
                </button>
                <button
                  type="button"
                  aria-label="Use Teams"
                  aria-pressed={platform === 'teams'}
                  onClick={() => setPlatform('teams')}
                >
                  <img
                    className="platform-icon"
                    src="https://img.icons8.com/color/48/microsoft-teams.png"
                    alt="Teams"
                  />
                  <span>Teams</span>
                </button>
              </fieldset>

              <button
                type="button"
                className="theme-toggle"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
              >
                <Icon className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} />
              </button>

              <span className="header-divider" aria-hidden="true" />

              <button type="button" className="icon-button" aria-label="Search">
                <Icon className="fa-solid fa-magnifying-glass" />
              </button>
              <button type="button" className="icon-button" aria-label="Help">
                <Icon className="fa-regular fa-circle-question" />
              </button>
            </div>
          </header>

          <section className={`conversation conversation-${platform}`} aria-label="Conversation canvas">
            <ConversationPreview key={`${platform}-${activeScenario.id}`} platform={platform} company={activeCompany} scenario={activeScenario} />
            <div className="composer-dock">
              <ComposerPreview key={`${platform}-${activeScenario.id}`} platform={platform} channel={activeScenario.channel} />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
