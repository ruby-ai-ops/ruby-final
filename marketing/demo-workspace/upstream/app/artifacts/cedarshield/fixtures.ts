import type { RebuiltContent } from '../content-types';

export type StormClaim = {
  id: string;
  customer: string;
  category: 'Roof' | 'Water' | 'Vehicle';
  location: string;
  deadline: string;
  image: string;
  estimate: number;
  evidence: string;
  requiredSkill: string;
};

export const stormClaims: StormClaim[] = [
  { id: 'CL-4821', customer: 'Avery Homeowners', category: 'Roof', location: 'Wilmington, NC', deadline: 'Today · 11:30 AM', image: 'roof-damage.webp', estimate: 18400, evidence: 'Eight exterior photos · Weather event ST-91', requiredSkill: 'Residential roof' },
  { id: 'CL-4828', customer: 'Mills Property Group', category: 'Water', location: 'Carolina Beach, NC', deadline: 'Today · 12:15 PM', image: 'water-intrusion.webp', estimate: 32700, evidence: 'Moisture survey · Emergency mitigation log', requiredSkill: 'Water mitigation' },
  { id: 'CL-4835', customer: 'Jordan Auto', category: 'Vehicle', location: 'Raleigh, NC', deadline: 'Today · 2:00 PM', image: 'vehicle-hail.webp', estimate: 6900, evidence: 'Fourteen vehicle photos · Repair estimate', requiredSkill: 'Auto physical damage' },
];

export type Adjuster = { id: string; name: string; skills: string[]; assigned: number; capacity: number; region: string };
export const adjusters: Adjuster[] = [
  { id: 'AJ-17', name: 'Sasha Green', skills: ['Residential roof', 'Water mitigation'], assigned: 4, capacity: 6, region: 'Coastal North Carolina' },
  { id: 'AJ-22', name: 'Leah Morgan', skills: ['Auto physical damage'], assigned: 3, capacity: 5, region: 'Central North Carolina' },
  { id: 'AJ-31', name: 'Drew Clarke', skills: ['Residential roof'], assigned: 6, capacity: 6, region: 'Coastal North Carolina' },
];

export type EvidenceConnection = { id: string; from: string; to: string; relation: string; detail: string; source: string; status: 'Unresolved signal' | 'Explained' };
export const evidenceConnections: EvidenceConnection[] = [
  { id: 'edge-vendor', from: 'CL-7714', to: 'Invoice INV-4492', relation: 'Submitted document', detail: 'The same invoice image appears in claims CL-7714 and CL-7731, but payment has not been issued.', source: 'ClaimCenter document hash · DOC-882', status: 'Unresolved signal' },
  { id: 'edge-address', from: 'CL-7731', to: '18 Harbor Lane', relation: 'Loss address', detail: 'The address is shared with an earlier plumbing claim filed by a different policyholder.', source: 'Policy administration address history · 2024–2026', status: 'Unresolved signal' },
  { id: 'edge-date', from: 'Invoice INV-4492', to: 'North Shore Repairs · Aug 31', relation: 'Vendor and document date', detail: 'The vendor confirmed the estimate was revised on August 31; the duplicate filename is explainable.', source: 'Vendor callback VC-118 · September 3', status: 'Explained' },
];

export type CoverageRow = { id: string; name: string; previous: string; current: string; deductible: string; effective: string; clause: string; wording: string; changed: boolean; example: string };
export const coverageRows: CoverageRow[] = [
  { id: 'wind', name: 'Wind and hail', previous: '$500,000 limit', current: '$750,000 limit', deductible: '2% named-storm deductible', effective: 'Oct 1, 2026', clause: 'Property form §7.2, endorsement CS-WH-14', wording: 'Covered direct physical loss caused by wind or hail is subject to the stated per-occurrence limit and named-storm deductible.', changed: true, example: 'On a $100,000 covered storm loss, the policy limit is sufficient under both versions; the named-storm deductible remains 2% of insured value.' },
  { id: 'water', name: 'Water backup', previous: '$25,000 sublimit', current: '$50,000 sublimit', deductible: '$2,500', effective: 'Oct 1, 2026', clause: 'Property form §9.4, endorsement CS-WB-08', wording: 'Covered loss caused by water backing up through a sewer or drain is limited to $50,000 per occurrence after the stated deductible.', changed: true, example: 'A covered $42,500 water-backup loss has $40,000 available after the stated deductible, within the proposed $50,000 sublimit.' },
  { id: 'income', name: 'Business income', previous: '12 months', current: '18 months', deductible: '72-hour waiting period', effective: 'Oct 1, 2026', clause: 'Business income form §3.1', wording: 'Actual loss of business income during the period of restoration is covered for up to 18 months after the 72-hour waiting period.', changed: true, example: 'The proposed period adds six months of potential indemnity, subject to the same 72-hour waiting period and policy terms.' },
  { id: 'equipment', name: 'Equipment breakdown', previous: '$250,000 limit', current: '$250,000 limit', deductible: '$5,000', effective: 'Oct 1, 2026', clause: 'Equipment form §2.5', wording: 'Covered equipment breakdown remains subject to the $250,000 per-occurrence limit and $5,000 deductible.', changed: false, example: 'No material change: the limit and deductible are unchanged.' },
];

export type Control = { id: string; stage: string; control: string; evidence: string; owner: string; ready: boolean };
export const processControls: Control[] = [
  { id: 'intake', stage: 'First notice', control: 'Consent and identity recorded', evidence: 'Sample FNOL-4821 · fields 2–6', owner: 'Sasha Green', ready: true },
  { id: 'triage', stage: 'Coverage triage', control: 'Authority threshold applied', evidence: 'Decision rule CR-18 · test run 42', owner: 'James Foster', ready: true },
  { id: 'notice', stage: 'Customer notice', control: 'Approved notice template attached', evidence: 'Template CS-NOT-7 is awaiting reviewer signature', owner: 'Leah Morgan', ready: false },
  { id: 'review', stage: 'Compliance review', control: 'Launch evidence signed', evidence: 'Control cover sheet · pending', owner: 'James Foster', ready: false },
];

export type CatRegion = { id: string; name: string; claims: number; access: string; teams: number; staging: string; update: string; message: string; coordinates: string; position: [number, number] };
export const catRegions: CatRegion[] = [
  { id: 'coast', name: 'Cape Fear coast', claims: 186, access: 'US-421 limited southbound', teams: 7, staging: 'Wilmington service yard', update: '9:20 AM', message: 'Prioritize emergency mitigation and confirm safe access before site visits.', coordinates: '34.2104° N, 77.8868° W', position: [72, 62] },
  { id: 'inland', name: 'Lower Cape Fear inland', claims: 94, access: 'Primary roads open', teams: 4, staging: 'Elizabethtown field office', update: '9:10 AM', message: 'Begin roof inspections and hold two teams for overflow from the coast.', coordinates: '34.6293° N, 78.6053° W', position: [45, 42] },
  { id: 'north', name: 'Jacksonville corridor', claims: 63, access: 'NC-24 debris clearance', teams: 3, staging: 'Jacksonville partner lot', update: '8:55 AM', message: 'Send digital inspection guidance while the eastern corridor is cleared.', coordinates: '34.7541° N, 77.4302° W', position: [68, 20] },
];

export type DeadlineClaim = { id: string; hours: number; work: string; owner: string; ownerLoad: number; proposed: string; achievable: boolean };
export const deadlineClaims: DeadlineClaim[] = [
  { id: 'CL-5902', hours: 7, work: 'Coverage letter and supervisor review', owner: 'Drew Clarke', ownerLoad: 9, proposed: 'Move letter drafting to Sasha Green', achievable: false },
  { id: 'CL-5887', hours: 18, work: 'Repair estimate reconciliation', owner: 'Leah Morgan', ownerLoad: 5, proposed: 'Keep with Leah; reserve one review hour', achievable: true },
  { id: 'CL-5844', hours: 41, work: 'Customer statement and payment authority', owner: 'Sasha Green', ownerLoad: 6, proposed: 'Move statement call to Drew Clarke', achievable: false },
  { id: 'CL-5819', hours: 68, work: 'Final invoice review', owner: 'Leah Morgan', ownerLoad: 5, proposed: 'Keep with Leah Morgan', achievable: true },
];

export type ClientAsset = { id: string; name: string; image: string; count: number; frequency: string; paid: number; incurred: number; response: string; open: string[]; trend: number[] };
export const clientAssets: ClientAsset[] = [
  { id: 'property', name: 'Commercial property', image: 'roof-damage.webp', count: 18, frequency: '3.8 claims / 100 locations', paid: 284000, incurred: 376000, response: '92% contacted within target', open: ['Complete roof-condition surveys at 12 coastal sites', 'Confirm water-shutoff signage at 8 locations'], trend: [180, 260, 376] },
  { id: 'vehicle', name: 'Fleet vehicles', image: 'vehicle-hail.webp', count: 42, frequency: '6.1 claims / 100 vehicles', paid: 146000, incurred: 172000, response: '96% contacted within target', open: ['Expand sheltered parking for 26 vehicles', 'Add quarterly driver glass checks'], trend: [202, 188, 172] },
  { id: 'water', name: 'Water exposure', image: 'water-intrusion.webp', count: 9, frequency: '1.9 claims / 100 locations', paid: 97000, incurred: 131000, response: '89% contacted within target', open: ['Complete leak-sensor pilot at 5 sites', 'Close two mitigation vendor reviews'], trend: [88, 104, 131] },
];

export type CoachingSkill = { id: string; name: string; observed: string; improved: string; practice: string; citations: { time: string; speaker: string; line: string }[] };
export const coachingSkills: CoachingSkill[] = [
  { id: 'scope', name: 'Explain coverage scope', observed: 'The call moved to reassurance before confirming what the policy wording actually covered.', improved: '“I can confirm the reported damage is recorded. I’ll now compare it with the wind-and-hail wording and explain what evidence we still need.”', practice: 'Use the coverage–evidence–next step structure in two paired role-plays.', citations: [{ time: '04:18', speaker: 'Broker', line: 'This should all be covered, so the customer can start repairs.' }, { time: '04:37', speaker: 'Coach note', line: 'Separate claim intake from the coverage decision.' }] },
  { id: 'deadline', name: 'Set a precise next step', observed: 'The customer received a general promise rather than a named action and time.', improved: '“Sasha will call by 2:00 PM today after the adjuster reviews the four roof photos.”', practice: 'Close three sample calls with an owner, action, and deadline.', citations: [{ time: '07:42', speaker: 'Broker', line: 'Someone will get back to you soon.' }, { time: '07:49', speaker: 'Customer', line: 'Can you tell me when?' }] },
  { id: 'empathy', name: 'Acknowledge operational impact', observed: 'The response repeated process steps without reflecting the customer’s interrupted operation.', improved: '“I hear that closing the loading area is affecting today’s deliveries. We’ll prioritize the safety decision and give you the next update at noon.”', practice: 'Rewrite two process-first responses around the customer’s stated impact.', citations: [{ time: '11:05', speaker: 'Customer', line: 'We cannot use the loading area until this is inspected.' }, { time: '11:12', speaker: 'Broker', line: 'The claim is in the standard review queue.' }] },
];

export const cedarshieldContent: Record<string, RebuiltContent> = {
  'cedarshield-claim-triage': { kind: 'record', summary: `${stormClaims.length} storm claims are ready for skill- and capacity-matched assignment.`, explanation: 'Each recommendation pairs the reported damage category and location with an adjuster who has relevant experience and available workload.', intro: 'Review the claim photography and assignment reason before placing the work.', actions: ['Matched storm claims to skills', 'Checked adjuster workloads', 'Prepared contact assignments'] },
  'cedarshield-fraud-investigation': { kind: 'dashboard', summary: 'Two unresolved evidence connections require investigation; one duplicate-document signal has been explained by the vendor.', explanation: 'The links identify shared records and cited sources. They do not label a claim as fraudulent or convert an unresolved signal into a finding.', intro: 'Select a relationship to inspect the shared record and its evidence source.', actions: ['Linked shared claim records', 'Separated signals from findings', 'Prepared evidence review tasks'] },
  'cedarshield-policy-comparison': { kind: 'table', summary: 'Three material coverage changes increase limits or indemnity periods; equipment-breakdown terms are unchanged.', explanation: 'The comparison keeps limits, deductibles, effective dates, exclusions and exact clause citations together with an illustrative impact.', intro: 'Filter the material changes and open a coverage category for the complete wording reference.', actions: ['Compared policy wording', 'Calculated illustrative impacts', 'Prepared coverage-change summary'] },
  'cedarshield-compliance-approval': { kind: 'timeline', summary: 'The claims process has one missing notice-template approval before the compliance gate can open.', explanation: 'Each process stage is linked to its control, evidence and reviewer. Approval remains disabled until required evidence is present.', intro: 'Inspect the gated process and resolve the sample evidence gap below.', actions: ['Mapped process controls', 'Checked launch evidence', 'Prepared compliance approval gate'] },
  'cedarshield-catastrophe-response': { kind: 'map', summary: '343 storm claims are distributed across three North Carolina response regions, with seven teams concentrated on the Cape Fear coast.', explanation: 'The operational map uses named service areas, access constraints, staging points and current update times to coordinate local response.', intro: 'Select a region to review its resources and customer communication.', actions: ['Mapped regional claim demand', 'Checked road access constraints', 'Prepared response-team deployment'] },
  'cedarshield-claims-sla-dashboard': { kind: 'timeline', summary: 'Two claims are outside achievable workload at current ownership; the seven-hour case needs immediate reassignment.', explanation: 'The rescue view connects time remaining to unfinished work and owner workload. Reassignment recalculates which commitments can be met.', intro: 'Filter the deadline band and apply the proposed capacity move.', actions: ['Prioritized deadline cases', 'Modeled adjuster reassignments', 'Prepared rescue commitments'] },
  'cedarshield-client-qbr': { kind: 'dashboard', summary: 'The client review reconciles property, vehicle and water losses with response performance and open risk-reduction actions.', explanation: 'Paid and incurred values come from the displayed asset records. Selecting an asset class changes the loss trend and service recommendation.', intro: 'Explore each insured asset class and its supporting service evidence.', actions: ['Reconciled client loss results', 'Compared response performance', 'Prepared risk-service actions'] },
  'cedarshield-broker-coaching': { kind: 'document', summary: 'Three broker coaching skills are supported by timestamped call evidence and a worked improved response.', explanation: 'The review distinguishes the observed behavior from the recommended language and gives each skill a concrete practice assignment.', intro: 'Select a coaching skill to inspect its cited call moments and assign practice locally.', actions: ['Reviewed cited call moments', 'Drafted improved responses', 'Prepared broker practice tasks'] },
};
