import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";
import { adaptStreamingSource } from "../scripts/streaming-transform.mjs";

const page = readFileSync(
  resolve(__dirname, "../../upstream/app/page.tsx"),
  "utf8"
);
const reviewed = readFileSync(
  resolve(__dirname, "../../upstream/app/artifacts/reviewed.tsx"),
  "utf8"
);
const registry = readFileSync(
  resolve(__dirname, "../../upstream/app/artifacts/registry.tsx"),
  "utf8"
);
it("rejects changed or missing integration points instead of silently skipping a chat renderer", () => {
  const adapted = adaptStreamingSource(page, "/app/page.tsx");
  expect(adapted).toContain('from "@workspace-autoplay"');
  expect(adapted.match(/<WorkspaceAutoplayProvider/g)).toHaveLength(2);
  const adaptedTree = ts.createSourceFile(
    "/app/page.tsx",
    adapted,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const wrapperText: string[] = [];
  const collectWrapperText = (node: ts.Node) => {
    if (
      ts.isJsxElement(node) &&
      node.openingElement.tagName.getText(adaptedTree) ===
        "WorkspaceAutoplayProvider"
    ) {
      wrapperText.push(
        ...node.children
          .filter(ts.isJsxText)
          .map((child) => child.getText(adaptedTree).trim())
          .filter(Boolean)
      );
    }
    ts.forEachChild(node, collectWrapperText);
  };
  collectWrapperText(adaptedTree);
  expect(wrapperText).toEqual([]);
  expect(adapted.match(/<AutoplayComposerControl/g)).toHaveLength(3);
  expect(adapted).toContain("data-autoplay-platform-control");
  expect(adapted.match(/data-autoplay-current-chat/g)).toHaveLength(3);
  expect(adapted).not.toContain('aria-disabled="true"');
  expect(adapted).toContain('from "@workspace-overrides"');
  expect(adapted).toContain("workspaceChatTitle(scenario)");
  expect(adapted).toContain("workspaceChatChannel(scenario)");
  expect(adapted).toContain("workspaceChatTeamsGroup(scenario)");
  expect(adapted).toContain("workspaceConversationScenario(scenario)");
  expect(adapted).toContain("workspaceCompanies([\n");
  expect(adapted).toContain("workspaceCompanyScenarios(company.id)");
  expect(adapted).toContain("workspaceArtifactLeadIn(scenario)");
  expect(adapted).toContain(
    "aria-description={workspaceChatDescription(scenario)}"
  );
  expect(adapted).toContain(
    "<WorkspaceChatMarquee text={workspaceChatTitle(scenario)} />"
  );
  expect(adapted).toContain(
    "<WorkspaceChatMarquee text={workspaceChatChannel(scenario)} />"
  );
  expect(adapted).toContain(
    '<WorkspaceChatMarquee as="strong" text={workspaceChatTeamsGroup(scenario)} />'
  );
  expect(adapted).not.toContain("title={workspaceChatTitle");
  expect(adapted.match(/<WorkspaceScenarioAddon/g)).toHaveLength(3);
  expect(adapted.match(/<WorkspaceChatIndicator/g)).toHaveLength(1);
  expect(() =>
    adaptStreamingSource(
      page.replace("{leadIn}", "{renamedLeadIn}"),
      "/app/page.tsx"
    )
  ).toThrow("Streaming integration points changed");
  expect(() =>
    adaptStreamingSource(
      page.replaceAll("ConversationPreview", "RenamedConversation"),
      "/app/page.tsx"
    )
  ).toThrow("Streaming integration points changed");
  expect(() =>
    adaptStreamingSource(
      page.replace('aria-disabled="true"', 'aria-disabled="false"'),
      "/app/page.tsx"
    )
  ).toThrow("Streaming integration points changed");
  expect(adaptStreamingSource(page, "/unrelated.tsx")).toBe(page);
});

it("leaves autoplay out of unstreamed page builds", () => {
  const adapted = adaptStreamingSource(page, "/app/page.tsx", {
    streaming: false,
  });
  expect(adapted).not.toContain("WorkspaceAutoplayProvider");
  expect(adapted).not.toContain("AutoplayComposerControl");
  expect(adapted).not.toContain("data-autoplay-platform-control");
  expect(adapted).not.toContain("data-autoplay-current-chat");
  expect(adapted).toContain('aria-disabled="true"');
});

it("adapts the Northstar artifact registry to content-specific widgets", () => {
  const adapted = adaptStreamingSource(registry, "/app/artifacts/registry.tsx");
  expect(adapted).toContain('from "@workspace-northstar"');
  expect(adapted).toContain(
    "'northstar-privacy-review': NorthstarClientIntakeMatrix"
  );
  expect(adapted).toContain(
    "'northstar-litigation-chronology': NorthstarDatedDocuments"
  );
  expect(adapted).toContain(
    "'northstar-clause-precedent-finder': NorthstarSignedAgreements"
  );
  expect(adapted).toContain(
    "'northstar-client-intake': NorthstarConsultationScheduler"
  );
  expect(adapted).toContain(
    "'northstar-matter-staffing': NorthstarTimeEntryMatrix"
  );
  expect(adapted).toContain(
    "'northstar-invoice-review': NorthstarDraftInvoiceReview"
  );
  expect(() =>
    adaptStreamingSource(
      registry.replace(
        "'northstar-litigation-chronology': DawsonChronology",
        "'northstar-litigation-chronology': RenamedWidget"
      ),
      "/app/artifacts/registry.tsx"
    )
  ).toThrow("Streaming integration points changed");
});

it("adapts the Meadow artifact registry to production-specific widgets", () => {
  const adapted = adaptStreamingSource(registry, "/app/artifacts/registry.tsx");
  expect(adapted).toContain('from "@workspace-meadow"');
  expect(adapted).toContain(
    "'meadow-demand-forecast': MeadowProductionOrderCalculator"
  );
  expect(adapted).toContain(
    "'meadow-cold-chain-alert': MeadowColdChainTransportExplorer"
  );
  expect(adapted).toContain(
    "'meadow-batch-traceability': MeadowPackingListFlow"
  );
  expect(adapted).toContain(
    "'meadow-production-schedule': MeadowWorkloadTimeline"
  );
  expect(adapted).toContain(
    "'meadow-supplier-certificate-audit': MeadowCheeseRecipePresentation"
  );
  expect(adapted).toContain(
    "'meadow-energy-cost-review': MeadowSupplierQuoteComparison"
  );
  expect(() =>
    adaptStreamingSource(
      registry.replace(
        "'meadow-energy-cost-review': PlantEnergyVariance",
        "'meadow-energy-cost-review': RenamedWidget"
      ),
      "/app/artifacts/registry.tsx"
    )
  ).toThrow("Streaming integration points changed");
});

it("adapts the Vector artifact registry while preserving its widget families", () => {
  const adapted = adaptStreamingSource(registry, "/app/artifacts/registry.tsx");
  expect(adapted).toContain('from "@workspace-vector"');
  expect(adapted).toContain(
    "'vector-internal-tool-prototype': VectorCustomerSetupAgent"
  );
  expect(adapted).toContain(
    "'vector-pull-request-review': VectorDataIsolationReview"
  );
  expect(adapted).toContain(
    "'vector-regression-explorer': VectorMobileSignupExplorer"
  );
  expect(adapted).toContain(
    "'vector-documentation-drift': VectorDocumentationDriftComparison"
  );
  expect(adapted).toContain(
    "'vector-cloud-spend-guard': VectorCloudSpendBreakdown"
  );
  expect(adapted).toContain(
    "'vector-feedback-signal-map': VectorFeedbackInbox"
  );
  expect(() =>
    adaptStreamingSource(
      registry.replace(
        "'vector-feedback-signal-map': FeedbackInbox",
        "'vector-feedback-signal-map': RenamedWidget"
      ),
      "/app/artifacts/registry.tsx"
    )
  ).toThrow("Streaming integration points changed");
});

it("adapts remaining industry artifact registries without silently dropping a widget", () => {
  const adapted = adaptStreamingSource(registry, "/app/artifacts/registry.tsx");
  expect(adapted).toContain('from "@workspace-industry"');
  const mappings = [
    ["loom-campaign-launch", "RemainingLoomShopifyLaunch"],
    ["loom-product-launch-room", "RemainingLoomStoreOpening"],
    ["loom-social-content-board", "RemainingLoomProductAds"],
    ["cartly-campaign-roas", "RemainingCartlyHomepageProducts"],
    ["harborview-referral-intake", "RemainingHarborviewSurgeryDocuments"],
    ["harborview-staff-rota", "RemainingHarborviewTrainingGuides"],
    [
      "harborview-compliance-evidence-pack",
      "RemainingHarborviewDischargeDocuments",
    ],
    ["harborview-operations-dashboard", "RemainingHarborviewExtraSessions"],
    ["harborview-board-operations-pack", "RemainingHarborviewScannerProposal"],
    ["keyline-maintenance-dispatch", "RemainingKeylineOpenHouseVisits"],
    ["keyline-lease-renewal-flow", "RemainingKeylineAcceptedOffers"],
    ["keyline-vendor-quote-review", "RemainingKeylineOfferNegotiation"],
    ["keyline-owner-update", "RemainingKeylineCommissionPayments"],
    ["keyline-portfolio-dashboard", "RemainingKeylineStaleListings"],
    ["cedarshield-claim-triage", "RemainingCedarAccidentInspections"],
    ["cedarshield-client-qbr", "RemainingCedarVanInsurance"],
    ["cedarshield-broker-coaching", "RemainingCedarClaimCallUpdates"],
    ["ledger-month-end-command", "RemainingLedgerAccountOpening"],
    ["ledger-expense-anomaly", "RemainingLedgerCardDispute"],
    ["ledger-cloud-cost-allocation", "RemainingLedgerBranchCosts"],
    ["ledger-cash-forecast", "RemainingLedgerBranchCash"],
    ["ledger-audit-evidence-binder", "RemainingLedgerHomeLoanDocuments"],
    ["ledger-board-reporting", "RemainingLedgerLendingReview"],
    ["ledger-duplicate-ap-detection", "RemainingLedgerTransferReview"],
    ["ledger-revenue-reconciliation", "RemainingLedgerMerchantSettlement"],
  ];
  for (const [scenarioId, component] of mappings) {
    expect(adapted).toContain(`'${scenarioId}': ${component}`);
  }
  expect(() =>
    adaptStreamingSource(
      registry.replace(
        "'ledger-board-reporting': FinancialBoardStatements",
        "'ledger-board-reporting': RenamedWidget"
      ),
      "/app/artifacts/registry.tsx"
    )
  ).toThrow("Streaming integration points changed");
});

it("removes promotion language from both dock-capacity states", () => {
  const adapted = adaptStreamingSource(reviewed, "/app/artifacts/reviewed.tsx");
  expect(adapted).toContain("New loads must move to Elmhurst.");
  expect(adapted).toContain("New loads can be accepted here.");
  expect(adapted).not.toContain("Promotion volume");
  expect(adapted).not.toContain("The promotion can be accepted here.");
});
