'use client';
import { useState } from 'react';
import {
  Badge,
  Metric,
  Source,
  WidgetHeader,
  type WidgetProps,
} from '../workspace-primitives';
import { coverage } from './fixtures';
export function ClinicalCoverageBalancer({ scenario }: WidgetProps) {
  const [applied, setApplied] = useState(false),
    [message, setMessage] = useState('Review the proposed eight-hour moves.');
  const rows = coverage.map((r) => ({
    ...r,
    after:
      r.assigned +
      (applied ? (r.id === 'east' ? 1 : r.id === 'float' ? -1 : 0) : 0),
  }));
  const gap = rows.reduce((n, r) => n + Math.max(0, r.required - r.after), 0);
  return (
    <div className="rw hv-coverage" data-widget-state={`${applied}-${message}`}>
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Coverage balance · Tuesday day shift"
      >
        <Badge tone={gap ? 'risk' : 'good'}>
          {gap ? 'One coverage gap' : 'Required coverage met'}
        </Badge>
      </WidgetHeader>
      <div className="rw-metrics">
        <Metric label="Uncovered positions" value={gap} id="coverage-gap" />
        <Metric label="Available float hours" value={applied ? 0 : 8} />
        <Metric label="Added overtime" value="0 hours" />
      </div>
      <div className="rw-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Role / Shift</th>
              <th>Required</th>
              <th>Before</th>
              <th>After</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">
                  {r.role}
                  <small>{r.shift}</small>
                </th>
                <td>{r.required}</td>
                <td>{r.assigned}</td>
                <td>
                  <Badge tone={r.after < r.required ? 'risk' : 'good'}>
                    {r.after} staff
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="hv-swap-tray">
        <h4>Proposed swaps</h4>
        <article>
          <span>
            <strong>Float nurse → East clinic</strong>
            <p>Same role · 8 available hours · Float pool stays at 1 of 1</p>
          </span>
          <button
            type="button"
            data-primary-action
            className="rw-action"
            aria-label="Apply float nurse swap"
            disabled={applied}
            onClick={() => {
              setApplied(true);
              setMessage(
                'Float move applied. East has three nurses and the float pool retains its required one.',
              );
            }}
          >
            {applied ? 'Applied' : 'Apply swap'}
          </button>
        </article>
        <article>
          <span>
            <strong>West reception → East support</strong>
            <p>Different role · West has no spare coverage</p>
          </span>
          <button
            type="button"
            aria-label="Apply West reception swap"
            onClick={() =>
              setMessage(
                'Would leave West below required coverage and does not fill a nursing role. Swap rejected.',
              )
            }
          >
            Check swap
          </button>
        </article>
        <output>{message}</output>
      </section>
      <Source>
        UKG rota WK-37 · Required role coverage and eight-hour shifts supplied
        by operations
      </Source>
    </div>
  );
}
ClinicalCoverageBalancer.displayName = 'ClinicalCoverageBalancer';
