'use client';
import { useState } from 'react';
import {
  Badge,
  Metric,
  Photo,
  Pick,
  Source,
  WidgetHeader,
  usd,
  type WidgetProps,
} from '../workspace-primitives';
import { buildings } from './fixtures';
export function BuildingHealthAtlas({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState(2);
  const active = buildings[selected];
  const units = buildings.reduce((n, b) => n + b.units, 0),
    occupied = buildings.reduce((n, b) => n + b.occupied, 0);
  return (
    <div className="rw kl-atlas" data-widget-state={selected}>
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Portfolio health · Weekly review"
      />
      <div className="rw-metrics">
        <Metric
          label="Portfolio occupancy"
          value={`${((occupied / units) * 100).toFixed(1)}%`}
          id="portfolio-occupancy"
        />
        <Metric
          label="Rent in arrears"
          value={usd(buildings.reduce((n, b) => n + b.arrears, 0))}
        />
        <Metric
          label="Open work orders"
          value={buildings.reduce((n, b) => n + b.workOrders, 0)}
        />
      </div>
      <div className="kl-building-cards">
        {buildings.map((b, i) => (
          <Pick
            key={b.id}
            primary={i === 0}
            label={`Inspect ${b.name}`}
            selected={selected === i}
            onClick={() => setSelected(i)}
          >
            <Photo src={`/demo-keyline/${b.image}`} alt={b.name} />
            <div>
              <strong>{b.name}</strong>
              <span
                className="kl-occupancy-ring"
                style={{
                  background: `conic-gradient(var(--rw-blue) ${(b.occupied / b.units) * 360}deg,var(--rw-line) 0)`,
                }}
              >
                <b>{Math.round((b.occupied / b.units) * 100)}%</b>
              </span>
              <small>
                {b.occupied} / {b.units} occupied
              </small>
              <small>
                {usd(b.arrears)} arrears · {b.workOrders} work orders
              </small>
            </div>
          </Pick>
        ))}
      </div>
      <section className="kl-building-issues" data-testid="building-issues">
        <h4>{active.name}: next actions</h4>
        <div>
          <Badge tone="risk">Priority 1</Badge>
          <strong>{active.issue}</strong>
          <span>Owner: Marcus Reed · Review Friday</span>
        </div>
        <div>
          <Badge>Priority 2</Badge>
          <strong>Follow up on {usd(active.arrears)} overdue rent</strong>
          <span>Use the existing approved outreach process.</span>
        </div>
        <div>
          <Badge>Priority 3</Badge>
          <strong>{active.units - active.occupied} vacant units</strong>
          <span>Review listing and viewing activity.</span>
        </div>
      </section>
      <Source>
        Building register · Occupancy and arrears reconcile to the
        property-level records
      </Source>
    </div>
  );
}
BuildingHealthAtlas.displayName = 'BuildingHealthAtlas';
