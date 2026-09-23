'use client';
import { useState } from 'react';
import { Badge, Fact, Metric, Photo, Source, WidgetHeader, type WidgetProps } from '../workspace-primitives';
import { catRegions } from './fixtures';

export function CatastropheOperationsMap({ scenario }: WidgetProps) {
  const [selected, setSelected] = useState(0);
  const region = catRegions[selected];
  return <div className="rw cs-cat-map" data-widget-state={selected}>
    <WidgetHeader title={scenario.copy.conversationTitle} eyebrow="Cape Fear storm · Updated 9:25 AM"><Badge tone="risk">Access constraints active</Badge></WidgetHeader>
    <div className="cs-map-summary"><Metric label="Reported claims" value={catRegions.reduce((sum, item) => sum + item.claims, 0)}/><Metric label="Field teams" value={catRegions.reduce((sum, item) => sum + item.teams, 0)}/><Metric label="Service regions" value={catRegions.length}/></div>
    <div className="cs-map-body"><figure className="cs-regional-map" aria-label="Operational service map of the Cape Fear region"><div className="cs-coastline"/><span className="cs-water-label">Atlantic Ocean</span>{catRegions.map((item, index) => <button key={item.id} type="button" className={selected === index ? 'selected' : ''} style={{ left: `${item.position[0]}%`, top: `${item.position[1]}%` }} aria-label={`Show ${item.name}`} data-primary-action={index === 1 ? '' : undefined} onClick={() => setSelected(index)}><b>{item.claims}</b><small>{item.name}</small></button>)}</figure><Photo src="/demo-cedarshield/response-staging.webp" alt="CedarShield catastrophe response vehicles staged for deployment"/></div>
    <section className="cs-region-brief"><div><Badge tone="info">{region.update} update</Badge><h4>{region.name}</h4><p>{region.message}</p></div><div className="rw-flex"><Fact label="Coordinates">{region.coordinates}</Fact><Fact label="Access">{region.access}</Fact><Fact label="Response resources">{region.teams} field teams</Fact><Fact label="Staging point">{region.staging}</Fact></div></section>
    <Source>Catastrophe response area CAT-26-09 · Geographic positions are fictional demo data</Source>
  </div>;
}
CatastropheOperationsMap.displayName = 'CatastropheOperationsMap';
