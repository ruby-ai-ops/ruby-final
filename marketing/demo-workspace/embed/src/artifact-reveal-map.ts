/**
 * Supporting cards within the original ScenarioArtifact root, for the 4.55–5.55s
 * stagger. The main artifact's separate 4.1s reveal is owned by the runtime.
 *
 * Explicitly audited against upstream artifactRegistry: no variant inference or
 * generic descendant fallback. Empty lists are intentional for tables, charts,
 * timelines, forms and document previews without a repeated supporting-card set.
 * Select whole cards, never their nested images, labels, badges or table cells.
 */
export const artifactRevealMap: Record<string, { cards: string[] }> = {
  "cartly-campaign-roas": { cards: [".campaign-stats > .cartly-stat"] },
  "cartly-cart-recovery": { cards: [".recovery-stats > .cartly-stat"] },
  "cartly-commerce-qbr": { cards: [".commerce-scorecard > .cartly-stat"] },
  "cartly-competitor-price-watch": {
    cards: [".price-product-selector > button"],
  },
  "cartly-creator-event-ops": { cards: [".event-stats > .cartly-stat"] },
  "cartly-revenue-cohort-explorer": {
    cards: [".retention-main > aside > .cartly-stat"],
  },
  "cartly-support-swarm": { cards: [".support-workbench > nav > button"] },
  "cedarshield-broker-coaching": { cards: [".cs-transcript > blockquote"] },
  "cedarshield-catastrophe-response": {
    cards: [".cs-map-summary > .rw-metric"],
  },
  "cedarshield-claim-triage": { cards: [".cs-claim-strip > .rw-pick"] },
  "cedarshield-claims-sla-dashboard": {
    cards: [".cs-deadline > .rw-metrics > .rw-metric"],
  },
  "cedarshield-client-qbr": { cards: [".cs-asset-tabs > .rw-pick"] },
  "cedarshield-compliance-approval": { cards: [] },
  "cedarshield-fraud-investigation": { cards: [] },
  "cedarshield-policy-comparison": { cards: [] },
  "everglade-capacity-forecast": { cards: [] },
  "everglade-freight-cost-spike": { cards: [] },
  "everglade-missed-pickup-recovery": {
    cards: [".reviewed-completion-strip > div > article"],
  },
  "everglade-sla-risk-command": {
    cards: [".fleet-assignment-cards > article"],
  },
  "everglade-supplier-onboarding": {
    cards: [".delta-launch-media > .artifact-media-card"],
  },
  "everglade-warehouse-incident": { cards: [] },
  "harborview-board-operations-pack": { cards: [] },
  "harborview-compliance-evidence-pack": { cards: [] },
  "harborview-equipment-ticket-triage": {
    cards: [".hv-asset-cards > .rw-pick"],
  },
  "harborview-no-show-recovery": { cards: [] },
  "harborview-operations-dashboard": {
    cards: [".hv-capacity > .rw-metrics > .rw-metric"],
  },
  "harborview-referral-intake": { cards: [".hv-intake-desk > nav > .rw-pick"] },
  "harborview-staff-rota": {
    cards: [".hv-coverage > .rw-metrics > .rw-metric"],
  },
  "keyline-inspection-pack": {
    cards: [".kl-inspection-layout > nav > .rw-pick"],
  },
  "keyline-lead-to-viewing": { cards: [".kl-property-gallery > .rw-pick"] },
  "keyline-lease-renewal-flow": { cards: [".kl-expiry-strip > .rw-pick"] },
  "keyline-listing-refresh": { cards: [] },
  "keyline-maintenance-dispatch": { cards: [] },
  "keyline-owner-update": { cards: [] },
  "keyline-portfolio-dashboard": { cards: [".kl-building-cards > .rw-pick"] },
  "keyline-vendor-quote-review": { cards: [] },
  "ledger-audit-evidence-binder": {
    cards: [".lg-audit-layout > nav > button"],
  },
  "ledger-board-reporting": { cards: [] },
  "ledger-cash-forecast": { cards: [".lg-cash > .rw-metrics > .rw-metric"] },
  "ledger-cloud-cost-allocation": {
    cards: [".lg-cloud > .rw-metrics > .rw-metric"],
  },
  "ledger-duplicate-ap-detection": { cards: [".lg-duplicate-strip > button"] },
  "ledger-expense-anomaly": { cards: [".lg-expense-layout > nav > button"] },
  "ledger-month-end-command": {
    cards: [".lg-close > .rw-metrics > .rw-metric"],
  },
  "ledger-revenue-reconciliation": {
    cards: [".lg-revenue > .rw-metrics > .rw-metric"],
  },
  "loom-campaign-launch": { cards: [] },
  "loom-product-launch-room": { cards: [".launch-items > article"] },
  "loom-replenishment-watch": {
    cards: [".shop-product-list > button", ".store-stock > article"],
  },
  "loom-returns-diagnosis": { cards: [] },
  "loom-social-content-board": { cards: [".social-calendar > div > button"] },
  "loom-store-staffing": { cards: [] },
  "meadow-batch-traceability": {
    cards: [".lineage-products > .artifact-media-card"],
  },
  "meadow-cold-chain-alert": { cards: [] },
  "meadow-demand-forecast": { cards: [] },
  "meadow-energy-cost-review": { cards: [] },
  "meadow-production-schedule": { cards: [] },
  "meadow-supplier-certificate-audit": {
    cards: [".meadow-cheese-controls > nav > button"],
  },
  "northstar-clause-precedent-finder": { cards: [] },
  "northstar-client-intake": { cards: [] },
  "northstar-contract-risk-scan": { cards: [".reviewed-redline > article"] },
  "northstar-invoice-review": { cards: [] },
  "northstar-litigation-chronology": { cards: [] },
  "northstar-matter-staffing": { cards: [] },
  "northstar-nda-signature-flow": { cards: [] },
  "northstar-privacy-review": { cards: [] },
  "stonebridge-client-progress-pack": { cards: [] },
  "stonebridge-cost-overrun-analysis": { cards: [] },
  "stonebridge-crew-allocation": { cards: [] },
  "stonebridge-rfi-decision-pack": { cards: [] },
  "stonebridge-site-safety-brief": { cards: [".site-risk-list > span"] },
  "stonebridge-vendor-quote-compare": { cards: [] },
  "talentspring-candidate-experience": {
    cards: [".ts-waiting-lanes > div > .rw-pick"],
  },
  "talentspring-candidate-shortlist": {
    cards: [".ts-candidate-dossiers > .rw-pick"],
  },
  "talentspring-interview-scheduler": { cards: [] },
  "talentspring-job-launch": { cards: [] },
  "talentspring-offer-packet": { cards: [] },
  "talentspring-onboarding-launch": { cards: [".ts-setup-path > button"] },
  "talentspring-workforce-capacity": {
    cards: [".ts-workforce > .rw-metrics > .rw-metric"],
  },
  "vector-cloud-spend-guard": { cards: [".cloud-summary > article"] },
  "vector-database-debugger": { cards: [] },
  "vector-documentation-drift": { cards: [] },
  "vector-feedback-signal-map": {
    cards: [".feedback-layout > section > article"],
  },
  "vector-internal-tool-prototype": { cards: [] },
  "vector-pull-request-review": { cards: [] },
  "vector-regression-explorer": { cards: [] },
};
