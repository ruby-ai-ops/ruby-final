import type {RebuiltContent} from '../content-types';

export type CandidateRequirement='Distributed systems'|'Python and SQL'|'Data platform ownership'|'On-call leadership';
export type CandidateRecord={
  id:string;
  name:string;
  currentRole:string;
  location:string;
  availability:string;
  strengths:string[];
  evidence:Record<CandidateRequirement,{claim:string;source:string}>;
};

export const candidateRequirements:CandidateRequirement[]=['Distributed systems','Python and SQL','Data platform ownership','On-call leadership'];
export const candidates:CandidateRecord[]=[
  {id:'CAN-184',name:'Maya Thompson',currentRole:'Staff Data Engineer',location:'New York · Hybrid',availability:'3 weeks',strengths:['Platform ownership','Incident leadership','Warehouse scale'],evidence:{'Distributed systems':{claim:'Led a 42-service event-stream migration with zero missed settlements.',source:'Ashby work sample · A-184'},'Python and SQL':{claim:'Submitted tested Python ingestion code and optimized a 3.1 TB SQL model.',source:'Technical exercise · TS-44'},'Data platform ownership':{claim:'Owned lakehouse reliability and quarterly capacity planning for 26 analysts.',source:'Portfolio case · PF-184'},'On-call leadership':{claim:'Ran the data reliability rotation and authored the recovery playbook.',source:'Reference note · REF-18'}}},
  {id:'CAN-207',name:'Idris Chen',currentRole:'Senior Platform Engineer',location:'Boston · Remote',availability:'4 weeks',strengths:['Streaming systems','Developer tooling','Cost controls'],evidence:{'Distributed systems':{claim:'Streaming migration reduced delayed events by 61% across three regions.',source:'Project brief · PB-207'},'Python and SQL':{claim:'Built Python schema tooling and maintained dbt quality checks.',source:'Technical exercise · TS-51'},'Data platform ownership':{claim:'Shared ownership of the ingestion platform with the infrastructure lead.',source:'Panel note · PN-207'},'On-call leadership':{claim:'Served as secondary incident lead for two quarterly rotations.',source:'Reference note · REF-21'}}},
  {id:'CAN-231',name:'Elena García',currentRole:'Analytics Engineering Lead',location:'Philadelphia · Hybrid',availability:'2 weeks',strengths:['Analytics modeling','Stakeholder leadership','Data quality'],evidence:{'Distributed systems':{claim:'Designed replay-safe pipelines for finance and product telemetry.',source:'Portfolio case · PF-231'},'Python and SQL':{claim:'Scored highest on SQL modeling and passed the Python review.',source:'Technical exercise · TS-58'},'Data platform ownership':{claim:'Owned semantic-layer standards used by six product teams.',source:'Ashby interview · A-231'},'On-call leadership':{claim:'Created the escalation guide; production incident leadership was shared.',source:'Panel note · PN-231'}}},
];

export type InterviewSlot={id:string;instant:string;label:string;maxMinutes:number;available:string[]};
export const panelists=['Maya Thompson','Chloe Martin','Aiden Lee','Ravi Shah'];
export const interviewSlots:InterviewSlot[]=[
  {id:'wed-1430',instant:'2026-09-09T14:30:00.000Z',label:'Wednesday',maxMinutes:90,available:panelists},
  {id:'wed-1800',instant:'2026-09-09T18:00:00.000Z',label:'Wednesday',maxMinutes:60,available:['Maya Thompson','Chloe Martin','Aiden Lee']},
  {id:'thu-1500',instant:'2026-09-10T15:00:00.000Z',label:'Thursday',maxMinutes:90,available:['Maya Thompson','Chloe Martin','Ravi Shah']},
];
export const interviewAgenda=[{minutes:10,label:'Introductions and role context'},{minutes:35,label:'Architecture case discussion'},{minutes:30,label:'Cross-functional working session'},{minutes:15,label:'Candidate questions'}];

export const role={
  id:'ROLE-328',title:'Senior Data Platform Engineer',location:'New York or Boston · Hybrid',compensation:'$158,000–$178,000',summary:'Build reliable data products and the platform systems that support them.',responsibilities:['Own streaming and batch reliability','Partner with analytics and product engineering','Lead incident learning and capacity planning'],details:['Approved headcount HC-328','Reports to Director of Data Platform','Target start: October 2026'],
};
export const publicationChannels=[
  {id:'careers',label:'Careers page',audience:'External applicants',cta:'Apply for this role',note:'Full responsibilities, compensation and benefits'},
  {id:'linkedin',label:'LinkedIn',audience:'Data platform community',cta:'View the open role',note:'Concise social preview linked to the full advert'},
  {id:'internal',label:'Internal channel',audience:'TalentSpring team',cta:'Refer a candidate',note:'Internal-mobility and referral context'},
];

export type WaitingCandidate={id:string;name:string;role:string;lane:'Reviewer decision'|'Interview booking'|'Offer update';days:number;owner:string;lastExchange:string;proposed:string};
export const waitingCandidates:WaitingCandidate[]=[
  {id:'WAIT-31',name:'Priya Nair',role:'Security Engineer',lane:'Reviewer decision',days:6,owner:'Ravi Shah',lastExchange:'Priya sent an updated systems-design sample on September 1.',proposed:'Thank Priya, confirm the sample is with the reviewer, and commit to a decision by tomorrow.'},
  {id:'WAIT-44',name:'Jon Bell',role:'Data Engineer',lane:'Interview booking',days:5,owner:'Chloe Martin',lastExchange:'Jon shared three available afternoons; no panel hold was created.',proposed:'Offer the Wednesday 2:30 PM ET panel and request confirmation.'},
  {id:'WAIT-52',name:'Amina Yusuf',role:'Product Analyst',lane:'Offer update',days:4,owner:'Mina Cole',lastExchange:'Amina asked whether the proposed start date can move by one week.',proposed:'Confirm the revised start date is under approval and send the next update today.'},
  {id:'WAIT-57',name:'Theo Grant',role:'Security Engineer',lane:'Reviewer decision',days:3,owner:'Ravi Shah',lastExchange:'The final interview scorecard was completed on September 2.',proposed:'Send the decision timeline and close the outstanding reviewer request.'},
];

export type WorkforceTeam={id:string;name:string;skill:string;demand:number;current:number;maxMobility:number;quarterlyHireCost:number};
export const hoursPerFte=520;
export const workforceTeams:WorkforceTeam[]=[
  {id:'data',name:'Data Platform',skill:'Distributed data systems',demand:3200,current:2360,maxMobility:240,quarterlyHireCost:48000},
  {id:'security',name:'Product Security',skill:'Cloud threat modeling',demand:2560,current:2260,maxMobility:160,quarterlyHireCost:52000},
  {id:'analytics',name:'Product Analytics',skill:'Experimentation design',demand:1840,current:1720,maxMobility:120,quarterlyHireCost:41000},
];
export const workforceGap=(team:WorkforceTeam,mobility:number,hires:number)=>Math.max(0,team.demand-team.current-mobility-hires*hoursPerFte);

export const offer={candidate:'Maya Thompson',role:'Senior Data Platform Engineer',base:165000,bonusRate:.1,benefitsRate:.24,equityAnnual:18000,start:'2026-10-05',signingBonus:8000,approvals:[{label:'Hiring manager',status:'Approved'},{label:'Compensation band',status:'Approved'},{label:'Finance',status:'Ready'}]};
export const employerCost=(base:number)=>Math.round(base+base*offer.bonusRate+base*offer.benefitsRate+offer.equityAnnual+offer.signingBonus);

export type OnboardingTask={id:string;label:string;owner:string;dependsOn?:string};
export const onboardingDays=[
  {day:'Monday',title:'Arrive and connect',items:['9:30 AM workplace welcome','Laptop and identity setup','Lunch with buddy Mina Cole']},
  {day:'Tuesday',title:'Understand the platform',items:['Data platform architecture','Security and privacy fundamentals','First manager check-in']},
  {day:'Wednesday',title:'Meet the partners',items:['Product and analytics introductions','Shadow the data reliability review','Team working agreement']},
  {day:'Thursday',title:'Practice the workflow',items:['Development environment walkthrough','Guided change and code review','Incident simulation']},
  {day:'Friday',title:'Set the first outcomes',items:['30-day plan workshop','Cohort retrospective','4:00 PM welcome gathering']},
];
export const onboardingTasks:OnboardingTask[]=[
  {id:'laptop',label:'Complete laptop setup',owner:'Workplace IT'},
  {id:'security',label:'Enable security enrollment',owner:'Security',dependsOn:'laptop'},
  {id:'identity',label:'Confirm email and calendar access',owner:'People Ops'},
  {id:'repo',label:'Grant data-platform repository access',owner:'Engineering',dependsOn:'security'},
];

export const talentSpringContent:Record<string,RebuiltContent>={
  'talentspring-candidate-shortlist':{kind:'table',summary:'Three data-platform candidates were compared against the four approved role requirements with source evidence for every claim.',explanation:'Maya Thompson demonstrates the broadest ownership and on-call leadership. Reviewer shortlisting remains visible and local.',intro:'Compare the candidate dossiers and inspect the evidence behind each requirement.',actions:['Matched approved role requirements','Cited candidate work evidence','Prepared reviewer shortlist']},
  'talentspring-interview-scheduler':{kind:'calendar',summary:'One 90-minute window includes the candidate and all three interviewers: Wednesday at 10:30 AM Eastern.',explanation:'Time-zone controls relabel the same meeting instant. Only overlaps that cover the selected duration can be scheduled.',intro:'Choose a complete overlap to assemble the panel agenda and invitation preview.',actions:['Compared panel calendar windows','Validated interview duration','Prepared participant invitations']},
  'talentspring-job-launch':{kind:'record',summary:'The approved Senior Data Platform Engineer role has complete content for the careers page, LinkedIn and the internal referral channel.',explanation:'Every channel uses the same compensation, location and approved responsibilities while adapting its presentation to the audience.',intro:'Review each native channel preview and publish its approved role content locally.',actions:['Confirmed approved role details','Adapted channel job previews','Prepared publishing checklist']},
  'talentspring-candidate-experience':{kind:'timeline',summary:'Four candidates are waiting on a reviewer decision, interview booking or offer update.',explanation:'Each record shows the last exchange, responsible owner and a concrete follow-up. Scheduling a next step removes only that candidate from the stalled count.',intro:'Select a waiting candidate and commit the next recovery step.',actions:['Measured candidate waiting time','Drafted contextual follow-ups','Assigned next-step ownership']},
  'talentspring-workforce-capacity':{kind:'dashboard',summary:'Data Platform has the largest next-quarter workforce gap: 840 productive hours before mobility or new hiring.',explanation:`Capacity uses ${hoursPerFte} productive hours per quarterly FTE and separates current staff, internal mobility and proposed hires.`,intro:'Reallocate available skills or add planned hires to close the uncovered demand.',actions:['Calculated next-quarter skill demand','Separated internal mobility capacity','Modeled planned hiring cost']},
  'talentspring-offer-packet':{kind:'document',summary:'Maya Thompson’s offer packet is complete and ready to enter finance review.',explanation:'Base compensation and start date update the offer preview and derived employer-cost estimate while preserving the approved bonus, benefits and equity assumptions.',intro:'Review the offer document, approval trail and packet completeness before routing.',actions:['Applied approved compensation terms','Checked offer packet completeness','Prepared finance approval route']},
  'talentspring-onboarding-launch':{kind:'timeline',summary:'The new-hire cohort now has arrival instructions, a five-day agenda, a buddy and sequenced access work.',explanation:'Dependent access tasks unlock only after their prerequisite is complete. First-week readiness is derived from the same task records shown below.',intro:'Select a day and complete setup dependencies to prepare the first week.',actions:['Published first-week arrival details','Sequenced dependent access tasks','Prepared cohort welcome agenda']},
};
