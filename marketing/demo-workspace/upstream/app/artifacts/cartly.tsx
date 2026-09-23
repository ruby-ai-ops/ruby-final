'use client';

/* oxlint-disable next/no-img-element -- bundled catalog assets and existing canonical portraits. */

import { useState, type ReactNode } from 'react';
import { getPerson, type DemoScenario } from '../demo-scenarios';
import './cartly.css';

type CartlyProps = { scenario: DemoScenario; platform: 'ruby' | 'slack' | 'teams' };
const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number = (value: number) => value.toLocaleString('en-US');

function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <header className="cartly-heading"><div><span>{eyebrow}</span><h3>{title}</h3></div>{children}</header>;
}

function Stat({ label, value, note, id, amount }: { label: string; value: string; note?: string; id?: string; amount?: number }) {
  return <div className="cartly-stat"><span>{label}</span><strong data-testid={id} data-value={amount}>{value}</strong>{note && <small>{note}</small>}</div>;
}

function Choice({ selected, children, onClick, primary = false }: { selected: boolean; children: ReactNode; onClick: () => void; primary?: boolean }) {
  return <button type="button" aria-pressed={selected} className={selected ? 'is-selected' : ''} data-primary-action={primary ? '' : undefined} onClick={onClick}>{children}</button>;
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="cartly-product-image">{failed ? <span>Product image unavailable</span> : <img src={src} alt={alt} onError={() => setFailed(true)} />}</div>;
}

const recoverySegments = [
  { name: 'Loyal customers', carts: 36, aov: 340, probability: .38, message: 'Personal reminder', eligibleForOffer: false },
  { name: 'First-time, high intent', carts: 58, aov: 275, probability: .18, message: 'Delivery reassurance', eligibleForOffer: true },
  { name: 'Shipping-sensitive', carts: 64, aov: 185, probability: .12, message: 'Shipping-cost follow-up', eligibleForOffer: true },
  { name: 'Comparison shoppers', carts: 42, aov: 120, probability: .07, message: 'Product answers', eligibleForOffer: true },
];
type Incentive = 'No discount' | 'Free shipping' | 'Targeted 10%';

export function calculateCartRecovery(threshold: number, strategy: Incentive) {
  const segments = recoverySegments.filter((segment) => segment.aov >= threshold).map((segment) => {
    const offer = segment.eligibleForOffer ? strategy : 'No discount';
    const probability = segment.probability + (offer === 'Free shipping' ? .06 : offer === 'Targeted 10%' ? .10 : 0);
    const recoveries = Math.round(segment.carts * probability);
    const gross = recoveries * segment.aov;
    const incentive = offer === 'Free shipping' ? recoveries * 6 : offer === 'Targeted 10%' ? gross * .10 : 0;
    return { ...segment, offer, probability, recoveries, gross, incentive, net: gross - incentive };
  }).sort((a, b) => b.net - a.net);
  return {
    segments,
    eligible: segments.reduce((sum, segment) => sum + segment.carts, 0),
    cartValue: segments.reduce((sum, segment) => sum + segment.carts * segment.aov, 0),
    recoveries: segments.reduce((sum, segment) => sum + segment.recoveries, 0),
    gross: segments.reduce((sum, segment) => sum + segment.gross, 0),
    incentive: segments.reduce((sum, segment) => sum + segment.incentive, 0),
    net: segments.reduce((sum, segment) => sum + segment.net, 0),
  };
}

export function CartRecoveryCalculator({ scenario }: CartlyProps) {
  const [threshold, setThreshold] = useState(150);
  const [strategy, setStrategy] = useState<Incentive>('No discount');
  const result = calculateCartRecovery(threshold, strategy);
  return <div className="cartly-widget cartly-recovery" data-widget-state={`${threshold}-${strategy}`}>
    <Heading eyebrow="Recovery model · Last 48 hours" title={scenario.copy.conversationTitle}><span className="cartly-pill">200 carts evaluated</span></Heading>
    <div className="recovery-model">
      <section className="recovery-controls">
        <label htmlFor="cart-value-threshold">Minimum cart value <strong>{money(threshold)}</strong></label>
        <input id="cart-value-threshold" aria-label="Minimum cart value" type="range" min="100" max="350" step="25" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} />
        <div className="range-ends"><span>$100</span><span>$350</span></div>
        <span className="cartly-label">Recovery strategy</span>
        <div className="cartly-choices">{(['No discount', 'Free shipping', 'Targeted 10%'] as const).map((item) => <Choice key={item} selected={strategy === item} primary={item === 'Free shipping'} onClick={() => setStrategy(item)}>{item}</Choice>)}</div>
        <p>Loyal customers receive no discount. Offers apply only to first-time or price-sensitive segments.</p>
      </section>
      <section className="recovery-result"><span>Expected net recovered revenue</span><strong data-testid="recovery-net" data-value={result.net}>{money(result.net)}</strong><p>{money(result.gross)} gross recovery − {money(result.incentive)} incentives</p><small>Projected outcomes, before fulfillment costs</small></section>
    </div>
    <div className="cartly-stats recovery-stats">
      <Stat label="Eligible carts" value={number(result.eligible)} id="recovery-eligible" />
      <Stat label="Eligible cart value" value={money(result.cartValue)} />
      <Stat label="Predicted orders" value={number(result.recoveries)} />
      <Stat label="Gross recovery" value={money(result.gross)} id="recovery-gross" amount={result.gross} />
      <Stat label="Incentive cost" value={money(result.incentive)} id="recovery-incentive" amount={result.incentive} />
    </div>
    <section className="recovery-segments"><h4>Segments ranked by net recovery</h4>{result.segments.length ? result.segments.map((segment, index) => <div key={segment.name}><b className="rank">{index + 1}</b><span><strong>{segment.name}</strong><small>{segment.carts} carts × {money(segment.aov)} average · {Math.round(segment.probability * 100)}% recovery estimate</small></span><span className="segment-action">{segment.offer === 'No discount' ? segment.message : segment.offer}</span><strong>{money(segment.net)}</strong></div>) : <p>No segment meets this threshold. Lower the minimum cart value to include eligible carts.</p>}</section>
    <details className="cartly-assumptions"><summary>Calculation assumptions</summary><p>Each segment uses its average cart value for eligibility. Expected orders = carts × recovery probability, rounded per segment. Free shipping costs $6 per recovered order and adds 6 percentage points; targeted 10% adds 10 points and costs 10% of recovered revenue. These are planning assumptions based on the last campaign, not guaranteed results.</p></details>
  </div>;
}

const supportTickets = [
  { id: 'CS-1842', name: 'Mara Jensen', initials: 'MJ', channel: 'Zendesk', subject: 'Order arrived without the tote', preview: 'The packing slip lists two items, but the parcel contained one.', minutes: 12, status: 'Assigned', owner: 'rachel-kim', evidence: 'Warehouse weight is 0.4 kg below the packed-order manifest. The tote was not scanned at dispatch.', reply: 'We found that your tote was left out of the parcel. A replacement is reserved for today’s dispatch and we will share tracking when it leaves.', duplicates: 2 },
  { id: 'CS-1846', name: 'Elliot Brooks', initials: 'EB', channel: 'Intercom', subject: 'Charged twice for one order', preview: 'Two payments appeared after checkout retried.', minutes: 24, status: 'Reply ready', owner: 'nikhil-rao', evidence: 'Two captures for one order. Stripe records CH-881 and CH-882 share the same checkout session; CH-882 is the duplicate.', reply: 'We located the duplicate charge on your order. Your original order is confirmed, and the second charge has been assigned for reversal.', duplicates: 1 },
  { id: 'CS-1851', name: 'Alex Kim', initials: 'AK', channel: 'Front', subject: 'Update my delivery address', preview: 'The order is still processing. Can you use my new address?', minutes: 86, status: 'Reply ready', owner: 'rachel-kim', evidence: 'Fulfillment has not started. The address change is validated against the shipping region and postal code.', reply: 'Your new delivery address is ready to apply before dispatch. Please confirm the apartment number in this thread.', duplicates: 0 },
  { id: 'CS-1858', name: 'Sam Rivera', initials: 'SR', channel: 'Zendesk', subject: 'Replacement denim size', preview: 'The fit is smaller than expected. Is size 30 available?', minutes: 145, status: 'Assigned', owner: 'noah-williams', evidence: 'Size 30 has 18 units in Brooklyn. The original order is inside the exchange window.', reply: 'Size 30 is available. We have prepared the exchange instructions and can reserve a pair when you confirm.', duplicates: 1 },
];
type SupportFilter = 'All tickets' | 'SLA at risk' | 'Reply ready';

export function SupportBacklogWorkbench({ scenario }: CartlyProps) {
  const [filter, setFilter] = useState<SupportFilter>('All tickets');
  const [selected, setSelected] = useState(supportTickets[0].id);
  const visible = supportTickets.filter((ticket) => filter === 'All tickets' || (filter === 'SLA at risk' ? ticket.minutes <= 30 : ticket.status === 'Reply ready'));
  const active = visible.find((ticket) => ticket.id === selected) ?? visible[0];
  const owner = getPerson(active.owner);
  return <div className="cartly-widget cartly-support" data-widget-state={`${filter}-${selected}`}>
    <Heading eyebrow="Support desk · Campaign cutoff 12:00 PM" title={scenario.copy.conversationTitle}><span className="cartly-pill risk">2 SLA risks</span></Heading>
    <div className="cartly-stats support-stats"><Stat label="Urgent cases" value="4" /><Stat label="Duplicates merged" value="4" /><Stat label="Replies ready" value="2" /><Stat label="Owners assigned" value="4 / 4" /></div>
    <div className="cartly-choices support-filters">{(['All tickets', 'SLA at risk', 'Reply ready'] as const).map((item) => <Choice key={item} selected={filter === item} primary={item === 'SLA at risk'} onClick={() => setFilter(item)}>{item}</Choice>)}</div>
    <div className="support-workbench"><nav aria-label="Support tickets">{visible.map((ticket) => <button type="button" data-testid="support-ticket" key={ticket.id} aria-label={`Open ${ticket.id}: ${ticket.subject}`} aria-pressed={active.id === ticket.id} className={active.id === ticket.id ? 'is-selected' : ''} onClick={() => setSelected(ticket.id)}><span className="customer-monogram">{ticket.initials}</span><span><small>{ticket.id} · {ticket.channel}</small><strong>{ticket.subject}</strong><em className={ticket.minutes <= 30 ? 'risk-text' : ''}>{ticket.minutes} min to SLA · {ticket.status}</em></span></button>)}</nav>
      <article className="support-case"><header><span className="customer-monogram">{active.initials}</span><div><strong>{active.name}</strong><small>{active.channel} · {active.id}</small></div><span className="cartly-pill">{active.status}</span></header><blockquote>{active.preview}</blockquote><h4>Evidence checked</h4><p data-testid="support-evidence">{active.evidence}</p><small>{active.duplicates} duplicate {active.duplicates === 1 ? 'thread merged' : 'threads merged'}</small><div className="support-reply"><h4>Proposed reply</h4><p data-testid="support-reply">{active.reply}</p></div><footer><img src={owner.avatar} alt="" /><span>{owner.name}<small>Responsible owner · Resolution pending</small></span></footer></article>
    </div>
  </div>;
}

const campaigns = [
  { name: 'Summer linen prospecting', channel: 'Meta · Broad audience', spend: 2800, revenue: 3360, target: 2.5, remaining: 850 },
  { name: 'Denim video discovery', channel: 'TikTok · New customers', spend: 1900, revenue: 3040, target: 2.5, remaining: 600 },
  { name: 'Brand search', channel: 'Google · High intent', spend: 1600, revenue: 7840, target: 3, remaining: 400 },
  { name: 'Returning customer retargeting', channel: 'Meta · Existing customers', spend: 1200, revenue: 5040, target: 3, remaining: 350 },
];

export function CampaignSpendControl({ scenario }: CartlyProps) {
  const [paused, setPaused] = useState(false);
  const underTarget = (campaign: (typeof campaigns)[number]) => campaign.revenue / campaign.spend < campaign.target;
  const active = campaigns.filter((campaign) => !paused || !underTarget(campaign));
  const spend = active.reduce((sum, item) => sum + item.spend, 0);
  const revenue = active.reduce((sum, item) => sum + item.revenue, 0);
  const protectedSpend = paused ? campaigns.filter(underTarget).reduce((sum, item) => sum + item.remaining, 0) : 0;
  return <div className="cartly-widget cartly-campaigns" data-widget-state={paused ? 'paused' : 'review'}>
    <Heading eyebrow="Campaign decisions · Seven-day attribution" title={scenario.copy.conversationTitle}><button className="cartly-primary" type="button" data-primary-action disabled={paused} onClick={() => setPaused(true)}>{paused ? 'Under-target campaigns paused' : 'Pause under target'}</button></Heading>
    <div className="cartly-stats campaign-stats"><Stat label="Active portfolio ROAS" value={`${(revenue / spend).toFixed(2)}×`} id="campaign-roas" note={`${active.length} active campaigns`} /><Stat label="Remaining spend protected" value={money(protectedSpend)} id="campaign-protected" note="Through today’s cutoff" /><Stat label="Historical attributed revenue" value="$19,280" note="Seven-day total, unchanged" /></div>
    <div className="cartly-table-wrap"><table className="cartly-table campaign-table"><thead><tr><th>Campaign</th><th>Spend / Revenue</th><th>ROAS / Target</th><th>Avoidable spend</th><th>Decision</th></tr></thead><tbody>{campaigns.map((campaign) => { const risk = underTarget(campaign); const roas = campaign.revenue / campaign.spend; return <tr key={campaign.name}><th scope="row">{campaign.name}<small>{campaign.channel}</small></th><td>{money(campaign.spend)}<small>{money(campaign.revenue)} revenue</small></td><td><strong>{roas.toFixed(1)}×</strong><small>Target {campaign.target.toFixed(1)}×</small><span className="roas-track"><i className={risk ? 'is-risk' : ''} style={{ width: `${Math.min(100, roas / 5 * 100)}%` }} /><b style={{ left: `${campaign.target / 5 * 100}%` }} /></span></td><td>{risk ? money(campaign.remaining) : '$0'}</td><td><span className={`cartly-pill ${risk && !paused ? 'risk' : 'success'}`}>{risk ? paused ? 'Paused' : 'Pause' : 'Keep running'}</span></td></tr>; })}</tbody></table></div>
    <p className="cartly-footnote">Active portfolio ROAS = attributed revenue ÷ spend for campaigns still running. Pausing protects future budget; it does not rewrite historical results. Attribution window: seven-day click, one-day view.</p>
  </div>;
}

const priceProducts = [
  { id: 'linen', name: 'Linen overshirt', image: '/demo-products/linen-overshirt.webp', price: 129, history: [139, 139, 129, 119], recommendation: 'Hold at $129. The lowest competing offer has limited sizes; our full size run and free shipping preserve value.', competitors: [{ name: 'Northfield Goods', previous: 129, current: 119, stock: 'M / L only', shipping: 6 }, { name: 'Everyday Supply', previous: 135, current: 135, stock: 'Full size run', shipping: 0 }, { name: 'Field & Form', previous: 139, current: 129, stock: 'Low stock', shipping: 8 }] },
  { id: 'denim', name: 'High-rise denim', image: '/demo-products/high-rise-denim.webp', price: 98, history: [104, 104, 98, 89], recommendation: 'Keep the $98 list price. Test a free-exchange message against the $89 competitor offer before reducing margin.', competitors: [{ name: 'Northfield Goods', previous: 98, current: 89, stock: 'Full size run', shipping: 6 }, { name: 'Everyday Supply', previous: 105, current: 99, stock: 'Sizes 26–30', shipping: 0 }, { name: 'Field & Form', previous: 110, current: 110, stock: 'Full size run', shipping: 8 }] },
  { id: 'tote', name: 'Leather tote', image: '/demo-products/leather-tote.webp', price: 159, history: [149, 149, 159, 169], recommendation: 'Retain $159. Northfield increased to $169 and Cartly remains $10 lower before shipping.', competitors: [{ name: 'Northfield Goods', previous: 159, current: 169, stock: 'In stock', shipping: 6 }, { name: 'Everyday Supply', previous: 165, current: 165, stock: 'Out of stock', shipping: 0 }, { name: 'Field & Form', previous: 179, current: 179, stock: 'In stock', shipping: 8 }] },
];

export function CompetitorPriceMonitor({ scenario }: CartlyProps) {
  const [selected, setSelected] = useState(0);
  const product = priceProducts[selected];
  return <div className="cartly-widget cartly-prices" data-widget-state={product.id}>
    <Heading eyebrow="Price watch · Sep 4 to Sep 5" title={scenario.copy.conversationTitle}><span className="cartly-pill">Matched products · USD</span></Heading>
    <div className="price-product-selector">{priceProducts.map((item, index) => <button key={item.id} type="button" aria-label={`Compare ${item.name}`} aria-pressed={selected === index} className={selected === index ? 'is-selected' : ''} data-primary-action={index === 1 ? '' : undefined} onClick={() => setSelected(index)}><ProductImage src={item.image} alt={item.name} /><span><strong>{item.name}</strong><small>Cartly price</small><b>{money(item.price)}</b></span></button>)}</div>
    <div className="cartly-table-wrap"><table className="cartly-table"><thead><tr><th>Competitor</th><th>Yesterday</th><th>Today</th><th>Movement</th><th>Availability</th></tr></thead><tbody>{product.competitors.map((competitor) => { const change = (competitor.current - competitor.previous) / competitor.previous * 100; return <tr key={competitor.name}><th scope="row">{competitor.name}<small>{competitor.shipping ? `${money(competitor.shipping)} shipping` : 'Free shipping'}</small></th><td>{money(competitor.previous)}</td><td><strong>{money(competitor.current)}</strong><small>{money(competitor.current + competitor.shipping)} delivered</small></td><td className={change < 0 ? 'risk-text' : change > 0 ? 'success-text' : ''}>{change > 0 ? '+' : ''}{change.toFixed(1)}%</td><td>{competitor.stock}</td></tr>; })}</tbody></table></div>
    <section className="price-bottom"><div className="price-history" data-testid="price-history" data-product={product.id}><span className="cartly-label">Northfield price history</span><div>{product.history.map((price, index) => <span key={index}><b>{money(price)}</b><i style={{ height: `${price / 180 * 56}px` }} /><small>Sep {index + 2}</small></span>)}</div></div><div className="price-recommendation"><h4>Pricing decision</h4><p data-testid="price-recommendation">{product.recommendation}</p><small>Matched material, size and pack count. Captured Sep 5, 9:15 AM.</small></div></section>
  </div>;
}

const retentionSegments = [
  { label: 'All June customers', count: 1240, aov: 112, may: [0, 3, 8, 14, 21, 26, 29, 31, 32], june: [0, 3, 7, 13, 19, 23, 23, 23, 23], product: 'Denim-heavy first orders', device: 'All devices', acquisition: 'Mixed channels', diagnosis: 'June denim buyers stopped returning after week six. Late exchanges delayed their second order; 64% of affected customers opened a fit-related support case.', evidence: 'Denim exchange median: 11 days versus 4 in May. The repeat-purchase gap is concentrated in customers awaiting exchanges.' },
  { label: 'Paid social · Mobile', count: 620, aov: 98, may: [0, 2, 6, 11, 17, 22, 26, 28, 29], june: [0, 2, 5, 10, 15, 18, 18, 18, 18], product: 'Denim and linen', device: 'Mobile', acquisition: 'Paid social', diagnosis: 'The first-order discount attracted lower-intent mobile buyers. Their week-six repeat rate stalls at 18%, even after excluding exchange delays.', evidence: 'Coupon-led acquisition accounts for 71% of the gap in this segment. Test product education before a second incentive.' },
  { label: 'Returning · Desktop', count: 280, aov: 159, may: [0, 5, 12, 21, 31, 39, 44, 47, 49], june: [0, 5, 12, 20, 30, 38, 42, 45, 47], product: 'Leather accessories', device: 'Desktop', acquisition: 'Direct / Email', diagnosis: 'Returning desktop customers are broadly stable. The two-point gap is small and does not explain the overall June decline.', evidence: 'Delivery and exchange times are unchanged. Prioritize the mobile acquisition and denim-exchange segments.' },
];

function CohortCurves({ may, june }: { may: number[]; june: number[] }) {
  const points = (values: number[]) => values.map((value, index) => `${42 + index * 58},${192 - value * 3}`).join(' ');
  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an inline SVG chart needs an accessible image role and title.
  return <svg className="retention-curve" viewBox="0 0 550 224" role="img" aria-label="May and June repeat purchase percentage by week"><title>Repeat purchase by cohort age, weeks zero through eight</title>{[0, 20, 40, 60].map((value) => <g key={value}><line x1="42" x2="510" y1={192 - value * 3} y2={192 - value * 3} /><text x="30" y={196 - value * 3} textAnchor="end">{value}%</text></g>)}<line className="week-marker" x1="390" x2="390" y1="15" y2="193" /><text className="marker-label" x="397" y="24">Week 6</text><polyline className="may-curve" points={points(may)} /><polyline className="june-curve" points={points(june)} />{june.map((value, index) => <circle key={index} cx={42 + index * 58} cy={192 - value * 3} r="3"><title>Week {index}: June {value}%, May {may[index]}%</title></circle>)}{[0, 2, 4, 6, 8].map((week) => <text key={week} x={42 + week * 58} y="214" textAnchor="middle">W{week}</text>)}</svg>;
}

export function RetentionCohortExplorer({ scenario }: CartlyProps) {
  const [selected, setSelected] = useState(0);
  const segment = retentionSegments[selected];
  const gap = segment.may[8] - segment.june[8];
  const exposure = segment.count * gap / 100 * segment.aov;
  return <div className="cartly-widget cartly-retention" data-widget-state={selected}>
    <Heading eyebrow="Cohort analysis · Eight weeks after first order" title={scenario.copy.conversationTitle}><span className="cartly-pill risk">−{gap} percentage points</span></Heading>
    <div className="cartly-choices retention-filters">{retentionSegments.map((item, index) => <Choice key={item.label} selected={selected === index} primary={index === 1} onClick={() => setSelected(index)}>{item.label}</Choice>)}</div>
    <div className="retention-main"><section><div className="cohort-legend"><span><i />June cohort</span><span><i />May baseline</span><small>Repeat purchase %</small></div><div data-testid="retention-chart" data-series={segment.june.join(',')}><CohortCurves may={segment.may} june={segment.june} /></div></section><aside><Stat label="Customers in segment" value={number(segment.count)} /><Stat label="Eight-week repeat rate" value={`${segment.june[8]}%`} note={`May baseline: ${segment.may[8]}%`} /><Stat label="Revenue exposure" value={money(exposure)} id="retention-exposure" note="Repeat-order gap × average order value" /></aside></div>
    <div className="retention-segment-facts"><span><small>Product</small><strong>{segment.product}</strong></span><span><small>Device</small><strong>{segment.device}</strong></span><span><small>Acquisition</small><strong>{segment.acquisition}</strong></span></div>
    <section className="retention-diagnosis"><h4>What explains the gap</h4><p data-testid="retention-diagnosis">{segment.diagnosis}</p><small>{segment.evidence}</small></section>
  </div>;
}

const audiences = [
  { label: 'All creators', invited: 180, confirmed: 92, pending: 54, declined: 34, waitlist: 14, showRate: .82, pendingRate: .35, note: 'Balance local attendance with category reach. Keep the waitlist warm until the final capacity check.' },
  { label: 'Local creators', invited: 90, confirmed: 61, pending: 17, declined: 12, waitlist: 8, showRate: .90, pendingRate: .55, note: 'Local creators have the strongest attendance outlook. Prioritize the remaining 17 invitations for confirmation.' },
  { label: 'Category specialists', invited: 90, confirmed: 31, pending: 37, declined: 22, waitlist: 6, showRate: .72, pendingRate: .25, note: 'Offer remote briefing slots to specialists who cannot travel. Follow up with the 37 pending invitees.' },
];

export function CreatorEventCommandCenter({ scenario }: CartlyProps) {
  const [selected, setSelected] = useState(0);
  const audience = audiences[selected];
  const projected = Math.round(audience.confirmed * audience.showRate + audience.pending * audience.pendingRate);
  return <div className="cartly-widget cartly-event" data-widget-state={selected}>
    <Heading eyebrow="Creator launch · September 18, 2026" title={scenario.copy.conversationTitle}><span className="cartly-pill">12 days to doors open</span></Heading>
    <div className="event-command-layout"><section className="creator-event-pass"><span>Cartly Studio Sessions</span><strong>Meet the next<br />collection.</strong><p>Brooklyn Studio · 6:00–9:00 PM</p><div className="event-capacity"><strong>{projected}<small>/ 120 seats</small></strong><span>Projected attendance</span><progress max="120" value={projected} aria-label="Projected event attendance" /></div><span className="event-pass-footer">Product previews · Creator demos · Studio Q&A</span></section><section className="event-audience"><span className="cartly-label">Audience planning</span><div className="cartly-choices">{audiences.map((item, index) => <Choice key={item.label} selected={selected === index} primary={index === 1} onClick={() => setSelected(index)}>{item.label}</Choice>)}</div><div className="cartly-stats event-stats"><Stat label="Invitations sent" value={number(audience.invited)} id="event-invitations" /><Stat label="Confirmed creators" value={number(audience.confirmed)} /><Stat label="Projected attendance" value={number(projected)} id="event-attendance" /><Stat label="Waitlist" value={number(audience.waitlist)} /></div><div className="event-invite-breakdown"><span>Confirmed {audience.confirmed}</span><span>Pending {audience.pending}</span><span>Declined {audience.declined}</span></div><p>{audience.note}</p><small>Projection: {Math.round(audience.showRate * 100)}% of confirmed + {Math.round(audience.pendingRate * 100)}% of pending. Audience filters do not change the 120-seat venue capacity.</small></section></div>
    <div className="event-run-sheet"><h4>Session readiness</h4><div><time>6:00 PM</time><strong>Welcome and product preview</strong><span className="success-text">Ready · Iris Chen</span></div><div><time>7:00 PM</time><strong>Creator demo tables</strong><span className="risk-text">2 samples due Sep 12</span></div><div><time>8:15 PM</time><strong>Studio Q&A</strong><span className="success-text">Ready · Noah Williams</span></div></div><p className="cartly-footnote">Follow-up: September 19 at 10:00 AM. Send attendees the product guide; send no-shows the recorded preview. Owner: Iris Chen.</p>
  </div>;
}

const reviews = {
  Growth: { label: 'Revenue', value: '$1.84M', unit: '$k', change: '+12.2% versus Q1', data: [490, 535, 615, 560, 610, 670], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], comparison: [480, 510, 560, 580, 600, 620], decision: 'Approve the high-intent acquisition test. Keep the $1,450 daily low-ROAS budget paused until creative performance recovers.', evidence: 'Q2 revenue: $560k + $610k + $670k. Repeat orders contributed 28% of Q2 sales.', owner: 'Noah Williams', secondary: 'Orders: 16,430 · Average order: $112' },
  Margin: { label: 'Contribution margin', value: '34.2%', unit: '%', change: '−1.8 points versus Q1', data: [36.8, 36.1, 35.2, 34.9, 34.1, 33.6], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], comparison: [36, 36, 36, 36, 36, 36], decision: 'Approve freight consolidation for the next inbound cycle. Reduce split shipments before funding a broader discount campaign.', evidence: 'Shipping cost per order rose from $6.10 to $7.40. Returns added 0.7 points of margin pressure.', owner: 'Iris Chen', secondary: 'Contribution: $629k · Margin target: 36%' },
  Retention: { label: 'Eight-week repeat rate', value: '23%', unit: '%', change: '−9 points versus May cohort', data: [30, 31, 31, 32, 32, 23], labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], comparison: [32, 32, 32, 32, 32, 32], decision: 'Fund a second-order education test and a faster denim exchange path. Review the June cohort again after two weeks.', evidence: 'The decline is concentrated in paid-social mobile buyers and denim customers with delayed exchanges.', owner: 'Noah Williams', secondary: 'June cohort: 1,240 customers · Exposed revenue: $12.5k' },
};
type ReviewTab = keyof typeof reviews;

export function CommerceReviewDashboard({ scenario }: CartlyProps) {
  const [tab, setTab] = useState<ReviewTab>('Growth');
  const review = reviews[tab];
  const maximum = Math.max(...review.data, ...review.comparison) * 1.12;
  return <div className="cartly-widget cartly-commerce-review" data-widget-state={tab}>
    <Heading eyebrow="Leadership review · Q2 2026" title={scenario.copy.conversationTitle}><span className="cartly-pill">Owner: Noah Williams</span></Heading>
    <div className="commerce-scorecard"><Stat label="Revenue" value="$1.84M" note="+12.2% quarter over quarter" /><Stat label="Contribution margin" value="34.2%" note="−1.8 percentage points" /><Stat label="June repeat rate" value="23%" note="At eight weeks" /><Stat label="Inventory exposure" value="$86k" note="Linen / Denim · 3 SKUs" /></div>
    <div className="commerce-report-body"><nav aria-label="Commerce review sections">{(Object.keys(reviews) as ReviewTab[]).map((item) => <Choice key={item} selected={tab === item} primary={item === 'Margin'} onClick={() => setTab(item)}>{item}</Choice>)}</nav><section className="commerce-report-section"><header><span><small>{review.label}</small><strong>{review.value}</strong></span><span>{review.change}<small>{review.secondary}</small></span></header><div className="commerce-trend" data-testid="commerce-trend" data-series={review.data.join(',')} aria-label={`${review.label} trend in ${review.unit}`}><div className="commerce-bars">{review.data.map((value, index) => <div key={review.labels[index]}><strong>{review.unit === '$k' ? `$${value}k` : `${value}%`}</strong><div><i style={{ height: `${value / maximum * 112}px` }} /><b style={{ bottom: `${review.comparison[index] / maximum * 112}px` }} title={`Plan: ${review.comparison[index]} ${review.unit}`} /></div><small>{review.labels[index]}</small></div>)}</div><span className="commerce-chart-key"><i />Actual <b />Plan / Baseline</span></div><p>{review.evidence}</p></section></div>
    <footer className="commerce-decision"><span className="cartly-label">Decision required · {review.owner}</span><p data-testid="commerce-decision">{review.decision}</p></footer>
  </div>;
}

CartRecoveryCalculator.displayName = 'CartRecoveryCalculator';
SupportBacklogWorkbench.displayName = 'SupportBacklogWorkbench';
CampaignSpendControl.displayName = 'CampaignSpendControl';
CompetitorPriceMonitor.displayName = 'CompetitorPriceMonitor';
RetentionCohortExplorer.displayName = 'RetentionCohortExplorer';
CreatorEventCommandCenter.displayName = 'CreatorEventCommandCenter';
CommerceReviewDashboard.displayName = 'CommerceReviewDashboard';
