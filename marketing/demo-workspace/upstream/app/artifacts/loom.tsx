'use client';

/* oxlint-disable next/no-img-element -- generated product mockups are local demo assets. */

import { useState, type ComponentType, type DragEvent, type ReactNode } from 'react';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ArtifactTooltip as Tooltip } from './chart-tooltip';
import { getPerson, type DemoScenario } from '../demo-scenarios';

export type LoomArtifactProps = { scenario: DemoScenario; platform: 'ruby' | 'slack' | 'teams' };

function Header({ scenario, action }: { scenario: DemoScenario; action?: ReactNode }) {
  return <header className="batch-widget-header"><strong>{scenario.copy.conversationTitle}</strong>{action}</header>;
}

const products = [
  { name: 'Linen overshirt', image: '/demo-products/linen-overshirt.webp', price: '$129', color: 'Natural', sizes: 'M · L · XL', source: 18, destination: 3, transfer: 8 },
  { name: 'High-rise denim', image: '/demo-products/high-rise-denim.webp', price: '$98', color: 'Deep indigo', sizes: '26 · 28 · 30', source: 21, destination: 4, transfer: 7 },
  { name: 'Leather tote', image: '/demo-products/leather-tote.webp', price: '$159', color: 'Tan', sizes: 'One size', source: 12, destination: 2, transfer: 5 },
];

export function StockTransferShop({ scenario }: LoomArtifactProps) {
  const [product, setProduct] = useState(0);
  const [transferred, setTransferred] = useState(false);
  const active = products[product];
  const source = active.source - (transferred ? active.transfer : 0);
  const destination = active.destination + (transferred ? active.transfer : 0);
  const chooseProduct = (index: number) => { setProduct(index); setTransferred(false); };
  return <div className="loom-stock-shop" data-widget-state={`${product}-${transferred}` }><Header scenario={scenario} action={<span>Weekend risk · 3 products</span>} /><div className="shop-product-list">{products.map((item, index) => <button type="button" key={item.name} data-primary-action={index === 1 ? '' : undefined} className={product === index ? 'is-selected' : ''} onClick={() => chooseProduct(index)}><img src={item.image} alt={item.name} onError={(event) => event.currentTarget.classList.add('is-missing')} /><span><strong>{item.name}</strong><small>{item.color}</small></span><b>{item.price}</b></button>)}</div><div className="stock-transfer-detail"><section><img src={active.image} alt="" /><span><strong>{active.name}</strong><small>{active.color} · {active.sizes}</small><b>{active.price}</b></span></section><div className="store-stock"><article><small>Brooklyn source</small><strong>{source} units</strong></article><i className="fa-solid fa-arrow-right" /><article><small>Soho destination</small><strong data-testid="destination-stock">{destination} units</strong></article></div><button type="button" aria-label="Apply transfer" onClick={() => setTransferred(true)} disabled={transferred}>{transferred ? `${active.transfer} units transferred` : `Transfer ${active.transfer} units`}</button></div></div>;
}

const campaignChannels = {
  Instagram: { eyebrow: 'Collection preview', copy: 'Light layers for long summer evenings.', cta: 'Shop the edit' },
  Email: { eyebrow: 'Private client preview', copy: 'The linen edit has arrived', cta: 'Explore the collection' },
  Homepage: { eyebrow: 'New collection', copy: 'Naturally refined. Made for summer.', cta: 'Discover linen' },
};

export function LinenCampaignStudio({ scenario }: LoomArtifactProps) {
  const [channel, setChannel] = useState<keyof typeof campaignChannels>('Instagram');
  const active = campaignChannels[channel];
  return <div className="loom-campaign-studio" data-widget-state={channel}><Header scenario={scenario} action={<span className="is-positive">Ready for launch</span>} /><div className="campaign-studio-layout"><section className={`campaign-preview is-${channel.toLowerCase()}`}><img src="/demo-products/linen-overshirt.webp" alt="Linen overshirt campaign product" /><div><small>{active.eyebrow}</small><strong>{active.copy}</strong><span>Linen overshirt · Natural</span><b>$129</b><button type="button" aria-label={`${active.cta} from the ${channel} preview`}>{active.cta}</button></div></section><aside><div className="campaign-channel-tabs">{(Object.keys(campaignChannels) as Array<keyof typeof campaignChannels>).map((item, index) => <button type="button" key={item} aria-label={`${item} preview`} data-primary-action={index === 1 ? '' : undefined} className={channel === item ? 'is-selected' : ''} onClick={() => setChannel(item)}>{item}</button>)}</div><dl><div><dt>Creative</dt><dd>Approved</dd></div><div><dt>Audience</dt><dd>42,800 customers</dd></div><div><dt>Launch</dt><dd>Thursday · 9:00 AM</dd></div></dl></aside></div></div>;
}

const returnData = {
  'Wide-leg denim': [
    { reason: 'Inseam length', count: 42, share: 34, cumulative: 34 }, { reason: 'Waist gap', count: 31, share: 25, cumulative: 59 },
    { reason: 'Fabric feel', count: 22, share: 18, cumulative: 77 }, { reason: 'Damage', count: 16, share: 13, cumulative: 90 }, { reason: 'Other', count: 12, share: 10, cumulative: 100 },
  ],
  'Straight denim': [
    { reason: 'Waist gap', count: 37, share: 32, cumulative: 32 }, { reason: 'Inseam length', count: 28, share: 24, cumulative: 56 },
    { reason: 'Fabric feel', count: 23, share: 20, cumulative: 76 }, { reason: 'Damage', count: 15, share: 13, cumulative: 89 }, { reason: 'Other', count: 13, share: 11, cumulative: 100 },
  ],
};

export function DenimReturnPareto({ scenario }: LoomArtifactProps) {
  const [product, setProduct] = useState<keyof typeof returnData>('Wide-leg denim');
  return <div className="loom-return-pareto" data-widget-state={product}><Header scenario={scenario} action={<div className="batch-tabs"><button type="button" className={product === 'Wide-leg denim' ? 'is-selected' : ''} onClick={() => setProduct('Wide-leg denim')}>Wide-leg</button><button type="button" aria-label="Straight denim" data-primary-action className={product === 'Straight denim' ? 'is-selected' : ''} onClick={() => setProduct('Straight denim')}>Straight</button></div>} /><p>{product} returns: Fit explains more than half of all returns.</p><div className="batch-chart"><ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 210 }}><ComposedChart data={returnData[product]} margin={{ top: 12, right: 10, left: -18, bottom: 4 }}><CartesianGrid vertical={false} opacity={0.12} /><XAxis dataKey="reason" tickLine={false} axisLine={false} fontSize={8} /><YAxis yAxisId="count" tickLine={false} axisLine={false} fontSize={8} /><YAxis yAxisId="percent" orientation="right" domain={[0, 100]} hide /><Tooltip /><Legend /><Bar yAxisId="count" dataKey="count" name="Returns" fill="var(--artifact-accent)" radius={[4, 4, 0, 0]} /><Line yAxisId="percent" type="monotone" dataKey="cumulative" name="Cumulative %" stroke="var(--artifact-positive)" strokeWidth={2} /></ComposedChart></ResponsiveContainer></div></div>;
}

export function StoreShiftPlanner({ scenario }: LoomArtifactProps) {
  const [covered, setCovered] = useState(false);
  const [dragging, setDragging] = useState('');
  const dropJordan = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); if (dragging === 'Jordan') setCovered(true); };
  return <div className="loom-shift-planner" data-widget-state={covered ? 'covered' : 'gap'}><Header scenario={scenario} action={<span className={covered ? 'is-positive' : 'is-danger'}>{covered ? 'All flagship shifts covered' : '1 critical gap'}</span>} /><div className="shift-grid"><div className="shift-head"><b>Store</b><b>10 AM to 2 PM</b><b>2 PM to 6 PM</b><b>6 PM to 10 PM</b></div><div className="shift-row"><strong>Soho</strong><span className="is-covered">2 associates</span><div className={covered ? 'is-covered' : 'is-gap'} onDragOver={(event) => event.preventDefault()} onDrop={dropJordan}>{covered ? <span className="employee-chip"><img src={getPerson('james-foster').avatar} alt="" />Jordan · Keyholder</span> : <><b>Open keyholder shift</b><button type="button" data-primary-action aria-label="Move Jordan to Soho 2 PM" onClick={() => setCovered(true)}>Fill with Jordan</button></>}</div><span className="is-covered">3 associates</span></div><div className="shift-row"><strong>Brooklyn</strong><span className="is-covered">3 associates</span><span className="employee-chip" draggable onDragStart={() => setDragging('Jordan')}><img src={getPerson('james-foster').avatar} alt="" />Jordan · Keyholder</span><span className="is-covered">2 associates</span></div><div className="shift-row"><strong>Williamsburg</strong><span className="is-covered">2 associates</span><span className="is-covered">2 associates</span><span className="is-covered">2 associates</span></div></div><p>{covered ? 'Soho 2 PM is covered' : 'Move Jordan from Brooklyn after the morning overlap.'}</p></div>;
}

const launchItems = [
  ['Occupancy permit', 'Approved', false], ['Visual merchandising', '92% staged', false], ['Opening-week staffing', '14 of 16 confirmed', true],
  ['Linen collection delivery', 'Arrives Tuesday', false], ['VIP event capacity', 'Decision needed', true], ['Store systems', 'Passed', false],
] as const;

export function FlagshipLaunchRoom({ scenario }: LoomArtifactProps) {
  const [decisionsOnly, setDecisionsOnly] = useState(false);
  const visible = launchItems.filter((item) => !decisionsOnly || item[2]);
  return <div className="loom-launch-room" data-widget-state={decisionsOnly ? 'decisions' : 'all'}><Header scenario={scenario} action={<div className="launch-countdown"><strong>18 days</strong><small>until opening</small></div>} /><div className="launch-summary"><span><small>Overall readiness</small><strong>86%</strong><i><b style={{ width: '86%' }} /></i></span><button type="button" data-primary-action aria-label="Needs decision" className={decisionsOnly ? 'is-selected' : ''} onClick={() => setDecisionsOnly(!decisionsOnly)}>Needs decision</button></div><div className="launch-items">{visible.map(([label, status, decision]) => <article data-testid="launch-item" key={label} className={decision ? 'is-decision' : ''}><i className={decision ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check'} /><span><strong>{label}</strong><small>{status}</small></span></article>)}</div></div>;
}

const socialPosts = [
  { id: 'linen', day: 'Wednesday', platform: 'Instagram', title: 'Linen launch', caption: 'Light layers, naturally refined.', image: '/demo-products/linen-overshirt.webp', estimate: '8.4k reach' },
  { id: 'denim', day: 'Thursday', platform: 'TikTok', title: 'Denim fit guide', caption: 'Three fits. One perfect pair.', image: '/demo-products/high-rise-denim.webp', estimate: '12.1k views' },
  { id: 'tote', day: 'Friday', platform: 'Instagram', title: 'Leather tote', caption: 'The carry-everywhere edit.', image: '/demo-products/leather-tote.webp', estimate: '6.7k reach' },
];

export function SocialContentPlanner({ scenario }: LoomArtifactProps) {
  const [linenDay, setLinenDay] = useState('Wednesday');
  const [selected, setSelected] = useState('linen');
  const [dragging, setDragging] = useState('');
  const active = socialPosts.find((post) => post.id === selected) ?? socialPosts[0];
  const moveLinen = () => { setLinenDay('Friday'); setSelected('linen'); };
  return <div className="loom-social-planner" data-widget-state={`${linenDay}-${selected}`}><Header scenario={scenario} action={<span>3 posts · 2 channels</span>} /><div className="social-layout"><section className="social-calendar">{['Wednesday', 'Thursday', 'Friday'].map((day) => <div key={day} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragging === 'linen' && day === 'Friday') moveLinen(); }}><strong>{day}</strong>{socialPosts.filter((post) => (post.id === 'linen' ? linenDay : post.day) === day).map((post) => <button type="button" key={post.id} aria-label={`Preview ${post.title} scheduled for ${post.id === 'linen' ? linenDay : post.day}`} draggable onDragStart={() => setDragging(post.id)} className={selected === post.id ? 'is-selected' : ''} onClick={() => setSelected(post.id)}><img src={post.image} alt="" /><span><small>{post.platform}</small><b>{post.title}</b><em>{post.estimate}</em></span></button>)}</div>)}</section><aside className="social-preview"><img src={active.image} alt={`${active.title} preview`} /><small>{active.platform} preview</small><strong>{active.caption}</strong><span>{active.estimate} · Ready for review</span><button type="button" data-primary-action aria-label="Move linen post to Friday" onClick={moveLinen}>Move linen post to Friday</button></aside></div><p>{linenDay === 'Friday' ? 'Linen post moved to Friday' : 'Drag a card to reschedule it.'}</p></div>;
}

const loomComponents: Array<ComponentType<LoomArtifactProps>> = [StockTransferShop, LinenCampaignStudio, DenimReturnPareto, StoreShiftPlanner, FlagshipLaunchRoom, SocialContentPlanner];
for (const component of loomComponents) component.displayName = component.name;
