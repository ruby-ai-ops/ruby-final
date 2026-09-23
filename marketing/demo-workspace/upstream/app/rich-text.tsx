import { Fragment } from 'react';
import { getPerson, verifiedIntegrations, type IntegrationId } from './demo-scenarios';
import { IntegrationIcon } from './integration-icon';

const integrationNames = [...verifiedIntegrations].sort((left, right) => right.length - left.length);
const integrationSet = new Set<string>(integrationNames);
const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tokenPattern = new RegExp(`(${integrationNames.map(escapePattern).join('|')}|@[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)`, 'g');

export function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(tokenPattern).filter(Boolean).map((part, index) => {
        if (integrationSet.has(part)) {
          return <span className="inline-integration" key={`${part}-${index}`}><IntegrationIcon label={part as IntegrationId} />{part}</span>;
        }
        if (part.startsWith('@')) {
          const name = part.slice(1);
          const person = getPerson(name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
          // oxlint-disable-next-line next/no-img-element -- compact profile photos are intentionally remote demo fixtures.
          return <span className="inline-mention" key={`${part}-${index}`}><img src={person.avatar} alt="" />@{person.name}</span>;
        }
        return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
      })}
    </>
  );
}
