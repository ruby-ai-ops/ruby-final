import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  getCompanyScenarios,
  personRegistry,
  scenarioLibrary,
  verifiedIntegrations,
} from '../app/demo-scenarios';
import { artifactRegistry } from '../app/artifacts/registry';

type PlannedInlineRun =
  | { kind: 'text'; text: string }
  | { kind: 'integration'; id: string }
  | { kind: 'mention'; personId: string };

type PlannedBlock = {
  kind: 'paragraph' | 'heading' | 'bullets' | 'checklist' | 'table' | 'quote' | 'sources';
  tone?: 'opening' | 'normal' | 'completion';
  content?: PlannedInlineRun[];
  items?: PlannedInlineRun[][];
  integrations?: string[];
  columns?: string[];
  rows?: PlannedInlineRun[][];
};

type PlannedCopy = {
  conversationTitle: string;
  userPrompt: string;
  presentation: 'artifact' | 'text';
  response: PlannedBlock[];
};

const runsText = (runs: PlannedInlineRun[] = []) => runs.map((run) => run.kind === 'text' ? run.text : run.kind === 'mention' ? `@${run.personId}` : run.id).join('');

const textFirstTitles = [
  'Build the carrier claim', 'Rescue the Acme account', 'Prepare today’s operations brief',
  'Brief clients on new rules', 'Prepare the board memo',
  'Stop risky refunds', 'Protect today’s production line',
  'Explain the checkout outage', 'Fix roadmap promises', 'Ship the release package',
  'Get Monday’s crews ready', 'Finish the site meeting follow-up', 'Resolve Tower A’s HVAC complaints',
  'Invite the best customers', 'Turn reviews into product fixes', 'Prepare Monday’s trade brief',
  'Find the best search opportunities', 'Protect delayed products',
  'Answer the urgent referral question', 'Turn the quality meeting into action', 'Fix repeated patient friction',
  'Recover overdue rent', 'Resolve the resident escalation',
  'Make the hiring decision', 'Brief the hiring manager', 'Launch the sourcing campaign',
  'Prepare the renewal meeting', 'Prepare the broker call',
  'Chase overdue invoices', 'Answer the finance policy question',
  'Contain the bad batch', 'Present the electric fleet', 'Prepare the plant report', 'Run the recall response',
  'Recover the Riverside schedule', 'Fix mobile size drop-off',
].sort();

describe('Ruby scenario library', () => {
  const workspaces = Object.values(scenarioLibrary);
  const scenarios = workspaces.flatMap((workspace) => workspace.scenarios);

  it('contains twelve workspaces and ten scenarios per workspace', () => {
    expect(workspaces).toHaveLength(12);
    for (const workspace of workspaces) expect(workspace.scenarios).toHaveLength(10);
    expect(scenarios).toHaveLength(120);
    expect(new Set(scenarios.map((scenario) => scenario.id)).size).toBe(120);
  });

  it('keeps every scenario complete and grounded in verified integrations', () => {
    for (const scenario of scenarios) {
      const copy = scenario.copy as unknown as PlannedCopy;
      expect(copy.userPrompt.length).toBeGreaterThan(12);
      expect(copy.presentation ?? '').toMatch(/^(artifact|text)$/);
      expect((copy.response ?? []).length).toBeGreaterThanOrEqual(3);
      expect((copy.response ?? []).some((block) => block.kind === 'paragraph' && block.tone === 'opening')).toBe(true);
      expect((copy.response ?? []).some((block) => block.kind === 'paragraph' && block.tone === 'completion')).toBe(true);
      expect(scenario.integrations.length).toBeGreaterThanOrEqual(2);
      expect(scenario.integrations.length).toBeLessThanOrEqual(5);
      expect(scenario.receipts).toHaveLength(3);
      expect(scenario.owner).toMatch(/^@/);
      expect(scenario.headerIcon).toMatch(/^fa-/);
      expect(scenario.artifactId).toBe(scenario.id);
      if (copy.presentation === 'artifact') expect(artifactRegistry[scenario.artifactId]).toBeTypeOf('function');
      else expect(artifactRegistry[scenario.artifactId]).toBeUndefined();
      for (const integration of scenario.integrations) {
        expect(verifiedIntegrations).toContain(integration);
      }
    }
  });

  it('provides industry-specific Pods and all visual artifact families', () => {
    const podSignatures = new Set(workspaces.map((workspace) => workspace.pods.join('|')));
    expect(podSignatures.size).toBe(12);
    for (const workspace of workspaces) expect(workspace.pods).toHaveLength(3);
    expect(Object.keys(artifactRegistry)).toHaveLength(84);
  });

  it('returns a stable ordered scenario list for each company', () => {
    const firstPreview = getCompanyScenarios('everglade')[0];
    expect(firstPreview.copy.conversationTitle).toBe('Save today’s late shipments');
    expect(firstPreview.artifact.kind).toBe('map');
    expect(firstPreview.copy.userPrompt).toMatch(/reroute.*traffic.*assign.*notify/i);
    expect(firstPreview.artifact.rows[0].label).toMatch(/dispatch/i);
    expect(getCompanyScenarios('ledger')[9].copy.conversationTitle).toBe('Answer the finance policy question');
    expect(getCompanyScenarios('missing')).toEqual([]);
  });

  it('never exposes the reference vendor in runtime content', () => {
    expect(JSON.stringify(scenarioLibrary)).not.toMatch(/\bDu\x73t\b/i);
  });

  it('uses sentence-case titles while preserving genuine proper nouns', () => {
    const titles = scenarios.map((scenario) => scenario.copy.conversationTitle);
    expect(new Set(titles).size).toBe(120);
    const properTitleWords = new Set(['Acme', 'Greenline’s', 'Dawson', 'Orion', 'Delta', 'Freight', 'Monday’s', 'Saturday’s', 'Riverside', 'Tower', 'A’s', 'HVAC']);
    for (const title of titles) {
      expect(title.split(/\s+/).length).toBeGreaterThanOrEqual(3);
      expect(title.split(/\s+/).length).toBeLessThanOrEqual(7);
      expect(title).not.toMatch(/\b(SLA|QBR|RFI|AP|FinOps|cohort)\b/i);
      for (const word of title.split(/\s+/).slice(1)) {
        if (/^[A-Z]/.test(word)) expect(properTitleWords).toContain(word);
      }
    }
    expect(JSON.stringify(scenarios)).not.toMatch(/What Ruby changed|Demo data|Updated just now/i);
  });

  it('uses the approved thirty-six text-first conversations', () => {
    const textTitles = scenarios
      .filter((scenario) => (scenario.copy as unknown as PlannedCopy).presentation === 'text')
      .map((scenario) => scenario.copy.conversationTitle)
      .sort();
    expect(textTitles).toEqual(textFirstTitles);
    expect(scenarios.filter((scenario) => (scenario.copy as unknown as PlannedCopy).presentation === 'artifact')).toHaveLength(84);
  });

  it('uses contextual integration-step titles in every scenario', () => {
    const banned = new Set(['Read source data', 'Cross-checked', 'Applied decision', 'Shared outcome']);
    for (const scenario of scenarios as Array<(typeof scenarios)[number] & { integrationSteps: Array<{ integrationId: string; label: string }> }>) {
      expect(scenario.integrationSteps, scenario.id).toHaveLength(scenario.integrations.length);
      expect(scenario.integrationSteps.map((step) => step.integrationId), scenario.id).toEqual(scenario.integrations);
      expect(new Set(scenario.integrationSteps.map((step) => step.label)).size, scenario.id).toBe(scenario.integrationSteps.length);
      for (const step of scenario.integrationSteps) {
        expect(banned.has(step.label), scenario.id).toBe(false);
        expect(step.label, scenario.id).toMatch(/^[A-Z0-9]/);
        expect(step.label.split(/\s+/).length, scenario.id).toBeGreaterThanOrEqual(2);
        expect(step.label.split(/\s+/).length, scenario.id).toBeLessThanOrEqual(7);
      }
    }
  });

  it('does not append detached periods after inline tags', () => {
    for (const scenario of scenarios) {
      const copy = scenario.copy as unknown as PlannedCopy;
      for (const block of copy.response) {
        for (const runs of [block.content, ...(block.items ?? []), ...(block.rows ?? [])].filter(Boolean) as PlannedInlineRun[][]) {
          const last = runs.at(-1);
          const previous = runs.at(-2);
          expect(last?.kind === 'text' && /^\s*\.\s*$/.test(last.text) && previous && previous.kind !== 'text', scenario.id).toBeFalsy();
        }
      }
    }
  });

  it('removes em dashes and capitalizes visible scenario actions', () => {
    expect(JSON.stringify(scenarioLibrary)).not.toContain('—');
    expect(readFileSync('app/layout.tsx', 'utf8')).not.toContain('—');
    for (const scenario of scenarios) {
      for (const row of scenario.artifact.rows) expect(row.label, scenario.id).toMatch(/^[A-Z0-9@]/);
      for (const receipt of scenario.receipts) expect(receipt, scenario.id).toMatch(/^[A-Z0-9@]/);
      const copy = scenario.copy as unknown as PlannedCopy;
      for (const block of copy.response) {
        for (const runs of [block.content, ...(block.items ?? []), ...(block.rows ?? [])].filter(Boolean) as PlannedInlineRun[][]) {
          const text = runsText(runs).trim();
          if (text) expect(text, scenario.id).toMatch(/^[A-Z0-9@]/);
        }
      }
    }
  });

  it('provides canonical people, engagement, deliverables, and artifact behavior', () => {
    const typed = scenarios as unknown as Array<{ id: string; ownerId: string; participantIds: string[]; engagement: { slackReactions: unknown[]; teamsUserReactions: unknown[]; teamsRubyReactions: unknown[]; replyCount: number; responderIds: string[] }; deliverables: Array<{ name: string }>; artifactBehavior: string; copy: PlannedCopy }>;
    for (const scenario of typed) {
      expect(scenario.ownerId, scenario.id).toBeTruthy();
      expect(scenario.participantIds.length, scenario.id).toBeGreaterThanOrEqual(3);
      expect(scenario.engagement.slackReactions.length, scenario.id).toBeGreaterThanOrEqual(2);
      expect(scenario.engagement.teamsUserReactions.length, scenario.id).toBeGreaterThanOrEqual(1);
      expect(scenario.engagement.teamsRubyReactions.length, scenario.id).toBeGreaterThanOrEqual(2);
      expect(scenario.engagement.replyCount, scenario.id).toBeGreaterThanOrEqual(0);
      expect(scenario.engagement.replyCount, scenario.id).toBeLessThanOrEqual(5);
      if (scenario.copy.presentation === 'text') expect(scenario.artifactBehavior, scenario.id).toBe('none');
      else expect(scenario.artifactBehavior, scenario.id).toMatch(/^(interactive|static-complete)$/);
    }
    expect(new Set(typed.map((scenario) => JSON.stringify(scenario.engagement.slackReactions))).size).toBeGreaterThan(20);
    for (const workspace of workspaces) {
      const replyCounts = workspace.scenarios.map((scenario) => scenario.engagement.replyCount);
      expect(new Set(replyCounts).size, workspace.id).toBeGreaterThanOrEqual(4);
      for (let index = 1; index < replyCounts.length; index += 1) expect(replyCounts[index], workspace.id).not.toBe(replyCounts[index - 1]);
    }
    expect(typed.find((scenario) => scenario.id === 'everglade-carrier-claim-packet')?.deliverables[0]?.name).toBe('EG-4821-carrier-claim.pdf');
    expect(typed.find((scenario) => scenario.id === 'everglade-missed-pickup-recovery')?.artifactBehavior).toBe('static-complete');
    expect(typed.find((scenario) => scenario.id === 'stonebridge-schedule-recovery')?.artifactBehavior).toBe('none');
    expect(Object.keys(personRegistry)).toHaveLength(27);
    expect(new Set(Object.values(personRegistry).map((person) => person.avatar)).size).toBe(27);
    expect(personRegistry['sofia-alvarez'].avatar).toBe('https://i.pravatar.cc/160?img=32');
  });

  it('uses purpose-written text briefs for rejected Meadow and fleet widgets', () => {
    const byTitle = (title: string) => scenarios.find((scenario) => scenario.copy.conversationTitle === title)?.copy as unknown as PlannedCopy;
    expect(JSON.stringify(byTitle('Contain the bad batch').response)).toMatch(/M-184|Protein variance|Containment/i);
    expect(JSON.stringify(byTitle('Present the electric fleet').response)).toMatch(/Zero-emission|Depot|CO2/i);
    expect(JSON.stringify(byTitle('Run the recall response').response)).toMatch(/Recall|Regulator|Deadline/i);
    expect(JSON.stringify(byTitle('Prepare the plant report').response)).toMatch(/Production|Quality|Next week/i);
  });

  it('keeps first-person openings rare and removes mechanical completion phrases', () => {
    const openingTexts: string[] = [];
    for (const scenario of scenarios) {
      const copy = scenario.copy as unknown as PlannedCopy;
      const paragraphTexts = (copy.response ?? [])
        .filter((block) => block.kind === 'paragraph')
        .map((block) => runsText(block.content));
      openingTexts.push(paragraphTexts[0]);
      expect(paragraphTexts.filter((text) => /^I\b/.test(text))).toHaveLength(0);
      expect(paragraphTexts.join(' ')).not.toMatch(/\bis ready\b|I checked|I put the view/i);
    }
    expect(new Set(openingTexts).size).toBe(120);
  });

  it('writes each explanation as a complete sentence', () => {
    for (const scenario of scenarios) {
      const copy = scenario.copy as unknown as PlannedCopy;
      const explanation = (copy.response ?? []).find((block) => block.kind === 'paragraph' && block.tone === 'normal');
      const text = runsText(explanation?.content);
      expect(text, scenario.id).toMatch(/^[A-Z0-9]/);
      expect(text, scenario.id).toMatch(/\.$/);
    }
  });

  it('uses context-specific text-first headings and mentions the final owner once', () => {
    for (const scenario of scenarios) {
      const copy = scenario.copy as unknown as PlannedCopy;
      const completion = (copy.response ?? []).find((block) => block.kind === 'paragraph' && block.tone === 'completion');
      expect((completion?.content ?? []).filter((run) => run.kind === 'mention'), scenario.id).toHaveLength(1);
    }
    const invitation = scenarios.find((scenario) => scenario.copy.conversationTitle === 'Invite the best customers');
    expect(invitation).toBeDefined();
    const heading = (invitation?.copy as unknown as PlannedCopy | undefined)?.response.find((block) => block.kind === 'heading');
    expect(runsText(heading?.content)).toBe('Guest plan');
  });

  it('does not repeat text-first opening or completion actions inside the detail list', () => {
    for (const scenario of scenarios) {
      const copy = scenario.copy as unknown as PlannedCopy;
      if (copy.presentation !== 'text') continue;
      const opening = (copy.response ?? []).find((block) => block.kind === 'paragraph' && block.tone === 'opening');
      const completion = (copy.response ?? []).find((block) => block.kind === 'paragraph' && block.tone === 'completion');
      const details = (copy.response ?? []).flatMap((block) => [
        ...(block.items ?? []).map((item) => runsText(item)),
        ...(block.rows ?? []).map((row) => runsText(row)),
      ]).map((text) => text.replace(/\.$/, '').toLowerCase());
      const openingAction = runsText(opening?.content).split(': ').at(-1)?.replace(/\.$/, '').toLowerCase() ?? '';
      const completionText = runsText(completion?.content).toLowerCase();
      expect(details, scenario.id).not.toContain(openingAction);
      expect(details.some((detail) => detail.length > 8 && completionText.includes(detail)), scenario.id).toBe(false);
    }
  });

  it('uses structural integration and person tokens without a standalone Sources list', () => {
    for (const scenario of scenarios) {
      const copy = scenario.copy as unknown as PlannedCopy;
      const serialized = JSON.stringify(copy.response) ?? '';
      const structuralIntegrations = (copy.response ?? []).flatMap((block) => [
        ...(block.content ?? []).filter((run) => run.kind === 'integration').map((run) => run.kind === 'integration' ? run.id : ''),
        ...(block.items ?? []).flat().filter((run) => run.kind === 'integration').map((run) => run.kind === 'integration' ? run.id : ''),
        ...(block.rows ?? []).flat().filter((run) => run.kind === 'integration').map((run) => run.kind === 'integration' ? run.id : ''),
      ]);
      expect((copy.response ?? []).some((block) => block.kind === 'sources')).toBe(false);
      for (const integration of structuralIntegrations) expect(verifiedIntegrations).toContain(integration);
      if (copy.presentation === 'text') expect(structuralIntegrations.length, scenario.id).toBeGreaterThan(0);
      expect(serialized, scenario.id).toContain('"kind":"mention"');
    }
  });
});
