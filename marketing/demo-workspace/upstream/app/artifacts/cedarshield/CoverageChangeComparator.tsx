'use client';
import { useState } from 'react';
import { Badge, Fact, Source, WidgetHeader, type WidgetProps } from '../workspace-primitives';
import { coverageRows } from './fixtures';

export function CoverageChangeComparator({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState('wind');
  const [materialOnly, setMaterialOnly] = useState(false);
  const rows = coverageRows.filter((row) => !materialOnly || row.changed);
  const active = coverageRows.find((row) => row.id === selected) ?? rows[0];
  return <div className="rw cs-policy" data-widget-state={`${selected}-${materialOnly}`}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Renewal comparison · Effective October 1"><button type="button" data-primary-action="" aria-pressed={materialOnly} onClick={() => setMaterialOnly((value) => !value)}>{materialOnly ? 'Showing material changes' : 'Show material changes only'}</button></WidgetHeader>
    <div className="rw-table-wrap"><table><thead><tr><th>Coverage</th><th>Previous</th><th>Current</th><th>Deductible</th><th>Effective</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className={active.id === row.id ? 'selected-row' : ''} onClick={() => setSelected(row.id)}><th scope="row"><button type="button" onClick={() => setSelected(row.id)}>{row.name}</button></th><td>{row.previous}</td><td>{row.current}<small>{row.changed ? 'Material change' : 'Unchanged'}</small></td><td>{row.deductible}</td><td>{row.effective}</td></tr>)}</tbody></table></div>
    <section className="cs-clause"><span><Badge tone={active.changed ? 'info' : 'neutral'}>{active.changed ? 'Changed' : 'Unchanged'}</Badge><h4>{active.name}</h4><p className="cs-wording">“{active.wording}”</p><p>{active.example}</p></span><Fact label="Exact wording reference">{active.clause}</Fact></section>
    <Source>Renewal proposal RN-204 · Illustration is not a coverage determination</Source>
  </div>;
}
CoverageChangeComparator.displayName = 'CoverageChangeComparator';
