import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ConversationBlock } from './demo-scenarios';
import { ConversationContent } from './conversation-content';

describe('ConversationContent', () => {
  it('renders rich inline integrations and avatar mentions without a Sources inventory', () => {
    const blocks: ConversationBlock[] = [
      { kind: 'paragraph', tone: 'opening', content: [
        { kind: 'text', text: 'Updated ' },
        { kind: 'integration', id: 'Salesforce' },
        { kind: 'text', text: ' with ' },
        { kind: 'mention', personId: 'maya-bennett' },
        { kind: 'text', text: '.' },
      ] },
    ];
    const { container } = render(<ConversationContent blocks={blocks} />);
    expect(screen.getByRole('img', { name: 'Salesforce' })).toBeInTheDocument();
    expect(container.querySelector('.inline-mention img')).toHaveAttribute('src', 'https://i.pravatar.cc/160?img=47');
    expect(screen.queryByText('Sources')).not.toBeInTheDocument();
  });

  it('renders compact markdown tables with one cell per declared column', () => {
    const blocks: ConversationBlock[] = [{
      kind: 'table',
      columns: ['Completed work', 'System'],
      rows: [[{ kind: 'text', text: 'Updated the account | ' }, { kind: 'integration', id: 'Salesforce' }]],
    }];
    render(<ConversationContent blocks={blocks} />);
    const bodyRow = screen.getAllByRole('row')[1];
    const cells = within(bodyRow).getAllByRole('cell');
    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveTextContent('Updated the account');
    expect(within(cells[1]).getByRole('img', { name: 'Salesforce' })).toBeInTheDocument();
  });

  it('splits every declared table column without dropping later values', () => {
    render(<ConversationContent blocks={[{
      kind: 'table',
      columns: ['Milestone', 'Before', 'Recovered'],
      rows: [[{ kind: 'text', text: 'Envelope watertight | Nov 18 | Nov 11' }]],
    }]} />);

    const rows = screen.getAllByRole('row');
    const cells = within(rows.at(-1)!).getAllByRole('cell');
    expect(cells.map((cell) => cell.textContent)).toEqual(['Envelope watertight', 'Nov 18', 'Nov 11']);
  });
});
