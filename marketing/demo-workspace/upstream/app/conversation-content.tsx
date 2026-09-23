import { getPerson, type ConversationBlock, type InlineRun } from './demo-scenarios';
import { IntegrationIcon } from './integration-icon';

function InlineContent({ runs }: { runs: InlineRun[] }) {
  return runs.map((run, index) => {
    if (run.kind === 'integration') {
      return <span className="inline-integration" key={`${run.id}-${index}`}><IntegrationIcon label={run.id} />{run.id}</span>;
    }
    if (run.kind === 'mention') {
      const person = getPerson(run.personId);
      // oxlint-disable-next-line next/no-img-element -- compact profile photos are deterministic demo fixtures.
      return <span className="inline-mention" key={`${run.personId}-${index}`}><img src={person.avatar} alt="" />@{person.name}</span>;
    }
    return run.text;
  });
}

export function runsToText(runs: InlineRun[]) {
  return runs.map((run) => run.kind === 'text' ? run.text : run.kind === 'integration' ? run.id : `@${getPerson(run.personId).name}`).join('');
}

function tableCells(row: InlineRun[], columnCount: number): InlineRun[][] {
  if (columnCount < 2) return [row];
  const cells = Array.from({ length: columnCount }, () => [] as InlineRun[]);
  let cellIndex = 0;
  for (const run of row) {
    if (run.kind !== 'text' || !run.text.includes(' | ')) {
      cells[cellIndex].push(run);
      continue;
    }
    const parts = run.text.split(' | ');
    parts.forEach((part, partIndex) => {
      if (part) cells[cellIndex].push({ kind: 'text', text: part });
      if (partIndex < parts.length - 1 && cellIndex < columnCount - 1) cellIndex += 1;
    });
  }
  return cells;
}

export function ConversationContent({ blocks }: { blocks: ConversationBlock[] }) {
  return (
    <div className="conversation-document">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === 'paragraph') return <p className={`conversation-paragraph is-${block.tone ?? 'normal'}`} key={key}><InlineContent runs={block.content} /></p>;
        if (block.kind === 'heading') return <h3 className="conversation-heading" key={key}><InlineContent runs={block.content} /></h3>;
        if (block.kind === 'bullets' || block.kind === 'checklist') {
          return <ul className={`conversation-list is-${block.kind}`} key={key}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{block.kind === 'checklist' && <i className="fa-solid fa-circle-check" aria-hidden="true" />}<span><InlineContent runs={item} /></span></li>)}</ul>;
        }
        if (block.kind === 'table') {
          return <div className="conversation-table-wrap" key={key}><table className="conversation-table"><thead><tr>{block.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{tableCells(row, block.columns.length).map((cell, cellIndex) => <td key={cellIndex}><InlineContent runs={cell} /></td>)}</tr>)}</tbody></table></div>;
        }
        if (block.kind === 'quote') return <blockquote className="conversation-quote" key={key}><InlineContent runs={block.content} /></blockquote>;
        return null;
      })}
    </div>
  );
}
