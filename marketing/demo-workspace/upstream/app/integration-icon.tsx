'use client';

import { useState } from 'react';
import type { IntegrationId } from './demo-scenarios';

const integrationDomains: Record<IntegrationId, string> = {
  Adomik: 'adomik.com', Amplitude: 'amplitude.com', 'Amplitude Europe': 'amplitude.com', Apify: 'apify.com',
  Asana: 'asana.com', Canva: 'canva.com', 'Clari Copilot': 'clari.com', Contentsquare: 'contentsquare.com',
  Costory: 'costory.io', Gamma: 'gamma.app', Gong: 'gong.io', 'Google Sheets': 'docs.google.com', Guru: 'getguru.com',
  Lemlist: 'lemlist.com', Luma: 'lu.ma', 'Microsoft Excel': 'microsoft.com', Miro: 'miro.com', 'Monday.com': 'monday.com',
  Napta: 'napta.io', NetSuite: 'netsuite.com', Notion: 'notion.so', 'Power BI': 'powerbi.microsoft.com',
  Productboard: 'productboard.com', Semrush: 'semrush.com', Shopify: 'shopify.com', Slab: 'slab.com',
  Statuspage: 'statuspage.io', Youtrust: 'youtrust.com', Ashby: 'ashbyhq.com', 'Ukg Ready': 'ukg.com',
  Attio: 'attio.com', HubSpot: 'hubspot.com', Salesforce: 'salesforce.com', Salesloft: 'salesloft.com',
  Stripe: 'stripe.com', BigQuery: 'cloud.google.com', Databricks: 'databricks.com', Hex: 'hex.tech',
  Snowflake: 'snowflake.com', Confluence: 'atlassian.com', GitHub: 'github.com', Jira: 'atlassian.com',
  Linear: 'linear.app', Supabase: 'supabase.com', 'Val Town': 'val.town', Fathom: 'fathom.video',
  'Google Meet': 'meet.google.com', Granola: 'granola.ai', Modjo: 'modjo.ai', Praiz: 'praiz.io',
  Freshservice: 'freshservice.com', Front: 'front.com', Intercom: 'intercom.com', ServiceNow: 'servicenow.com',
  Zendesk: 'zendesk.com', Gmail: 'mail.google.com', Outlook: 'outlook.com', 'Google Calendar': 'calendar.google.com',
  'Outlook Calendar': 'outlook.com', 'Google Drive': 'drive.google.com', Microsoft: 'microsoft.com',
  'Microsoft OneDrive': 'onedrive.live.com', 'Web Crawler': 'firecrawl.dev', 'Microsoft Teams': 'teams.microsoft.com',
  Slack: 'slack.com', Vanta: 'vanta.com',
};

function initials(label: string) {
  const capitals = label.match(/[A-Z0-9]/g) ?? [];
  if (capitals.length > 1) return capitals.slice(0, 2).join('');
  const words = label.split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words.map((word) => word[0]).join('') : label.slice(0, 2)).toUpperCase();
}

export function IntegrationIcon({ label, className = '' }: { label: IntegrationId; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span aria-label={label} className={`integration-icon-fallback ${className}`.trim()}>{initials(label)}</span>;

  const source = `https://www.google.com/s2/favicons?domain=${integrationDomains[label]}&sz=64`;
  // oxlint-disable-next-line next/no-img-element -- connection marks intentionally come from a CDN favicon endpoint.
  return <img src={source} alt={label} className={`integration-brand-icon ${className}`.trim()} onError={() => setFailed(true)} />;
}
