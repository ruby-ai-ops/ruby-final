'use client';
import { useState } from 'react';
import {
  Badge,
  Fact,
  Photo,
  Pick,
  Source,
  WidgetHeader,
  usd,
  type WidgetProps,
} from '../workspace-primitives';
import { buildings, renterLeads } from './fixtures';
export function PropertyViewingMatchmaker({ scenario }: WidgetProps) {
  const [lead, setLead] = useState(0),
    [property, setProperty] = useState('lakeside'),
    [holds, setHolds] = useState<Record<string, string>>({}),
    [notice, setNotice] = useState(
      'Choose a suitable property and available viewing time.',
    );
  const activeLead = renterLeads[lead];
  const matches = buildings.filter(
    (b) => b.rent <= activeLead.budget && b.beds >= activeLead.beds,
  );
  const active = matches.find((b) => b.id === property) ?? matches[0];
  return (
    <div
      className="rw kl-viewings"
      data-widget-state={`${lead}-${property}-${Object.keys(holds).join()}`}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Viewing matches · Available homes"
      />
      <div className="rw-tabs">
        {renterLeads.map((r, i) => (
          <Pick
            key={r.name}
            primary={i === 1}
            selected={lead === i}
            label={`Select ${r.name}`}
            onClick={() => {
              setLead(i);
              setNotice(
                'Choose a suitable property and available viewing time.',
              );
            }}
          >
            {r.name}
          </Pick>
        ))}
      </div>
      <div className="kl-renter-brief">
        <Fact label="Budget ceiling">{usd(activeLead.budget)} / month</Fact>
        <Fact label="Bedrooms">{activeLead.beds} or more</Fact>
        <Fact label="Move date">{activeLead.move}</Fact>
      </div>
      {active ? (
        <>
          <div className="kl-property-gallery">
            {matches.map((b) => (
              <Pick
                key={b.id}
                selected={active.id === b.id}
                onClick={() => setProperty(b.id)}
              >
                <Photo src={`/demo-keyline/${b.image}`} alt={b.name} />
                <span>
                  <strong>{b.name}</strong>
                  <b>{usd(b.rent)} / month</b>
                  <small>{b.beds} bedrooms · Available now</small>
                </span>
              </Pick>
            ))}
          </div>
          <section className="kl-viewing-details">
            <Photo
              src={`/demo-keyline/${active.interior}`}
              alt={`${active.name} living space`}
            />
            <div className="rw-stack">
              <h4>{active.address}</h4>
              <p>{active.amenities.join(' · ')}</p>
              <Badge tone="good">Matches stated requirements</Badge>
              <div className="rw-flex">
                {['11:00 AM', '3:00 PM'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    aria-label={`Hold viewing at ${time}`}
                    disabled={Boolean(holds[`${active.id}-${time}`])}
                    onClick={() => {
                      const key = `${active.id}-${time}`;
                      setHolds((h) => ({ ...h, [key]: activeLead.name }));
                      setNotice(
                        `Viewing held: ${activeLead.name}, ${active.name}, tomorrow at ${time}.`,
                      );
                    }}
                  >
                    {holds[`${active.id}-${time}`] ? 'Held' : time}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <p className="rw-empty">
          No properties match the stated budget and bedroom requirement.
        </p>
      )}
      <output className="rw-foot">
        {notice}
      </output>
      <Source>
        Available-property register · Enquiries LE-201–203 · Leasing owner:
        Marcus Reed
      </Source>
    </div>
  );
}
PropertyViewingMatchmaker.displayName = 'PropertyViewingMatchmaker';
