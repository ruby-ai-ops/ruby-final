'use client';
import { useState } from 'react';
import {
  Badge,
  Fact,
  Photo,
  Pick,
  Source,
  WidgetHeader,
  type WidgetProps,
} from '../workspace-primitives';
import { workOrders, technicians, canDispatch } from './fixtures';
const time = (n: number) =>
  `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
export function MaintenanceDispatchDesk({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState(0),
    [tech, setTech] = useState('Jordan'),
    [assigned, setAssigned] = useState<{ id: string; tech: string }[]>([]),
    [message, setMessage] = useState('Review the trade and travel window.');
  const active = workOrders[selected];
  const done = assigned.some((a) => a.id === active.id);
  function assign() {
    const reason = canDispatch(
      active,
      technicians.find((t) => t.name === tech)!,
      assigned,
    );
    if (reason) {
      setMessage(reason);
      return;
    }
    if (!done) {
      setAssigned((a) => [...a, { id: active.id, tech }]);
      setMessage(
        `Assigned ${active.id} to ${tech}. Travel begins at ${time(active.start - active.travel)}.`,
      );
    }
  }
  return (
    <div
      className="rw kl-dispatch"
      data-widget-state={`${selected}-${tech}-${assigned.length}-${message}`}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Morning maintenance dispatch"
      >
        <Badge>{workOrders.length - assigned.length} unassigned</Badge>
      </WidgetHeader>
      <div className="rw-tabs">
        {workOrders.map((w, i) => (
          <Pick
            key={w.id}
            primary={i === 1}
            selected={selected === i}
            onClick={() => setSelected(i)}
          >
            {w.id} · {w.unit}
          </Pick>
        ))}
      </div>
      <div className="kl-dispatch-main">
        <Photo src={`/demo-keyline/${active.image}`} alt={active.issue} />
        <section className="rw-stack">
          <h4>{active.issue}</h4>
          <div className="rw-flex">
            <Fact label="Trade">{active.trade}</Fact>
            <Fact label="Access window">{active.access}</Fact>
            <Fact label="Repair / Travel">
              {active.duration} / {active.travel} min
            </Fact>
          </div>
          <label>
            Technician
            <select
              aria-label="Technician"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
            >
              {technicians.map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
          <small>
            {technicians.find((t) => t.name === tech)!.trades.join(' · ')}
          </small>
          <button
            type="button"
            className="rw-action"
            disabled={done}
            onClick={assign}
          >
            {done ? 'Work order assigned' : 'Assign work order'}
          </button>
        </section>
      </div>
      <section className="kl-itinerary">
        <h4>Technician itinerary</h4>
        <div>
          <time>9:00–10:00</time>
          <strong>Jordan</strong>
          <span>Existing boiler service</span>
        </div>
        {assigned.map((a) => {
          const w = workOrders.find((o) => o.id === a.id)!;
          return (
            <div key={a.id}>
              <time>
                {time(w.start - w.travel)}–{time(w.start + w.duration)}
              </time>
              <strong>{a.tech}</strong>
              <span>
                {a.id} · Travel + {w.issue}
              </span>
            </div>
          );
        })}
        <output>{message}</output>
      </section>
      <Source>
        ServiceNow work orders · Recorded tenant access windows · Dispatch
        owner: Marcus Reed
      </Source>
    </div>
  );
}
MaintenanceDispatchDesk.displayName = 'MaintenanceDispatchDesk';
