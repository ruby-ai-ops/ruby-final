import ts from "typescript";

// Build-time adaptations; recorded upstream files remain untouched.
export function adaptStreamingSource(source, filename, options = {}) {
  if (filename.endsWith("/app/scenario-artifact.tsx")) {
    const classPrefix = 'className={`scenario-artifact ';
    if (!source.includes(classPrefix)) {
      throw new Error("Industry widget styling integration point changed");
    }
    return source.replace(
      classPrefix,
      'className={`scenario-artifact ${/^(stonebridge|loom|cartly|harborview|keyline|talentspring|cedarshield|ledger)-/.test(scenario.id) ? "industry-widget-polish" : ""} '
    );
  }
  const streamingEnabled = options.streaming !== false;
  const isPage = filename.endsWith("/app/page.tsx");
  const isContent = filename.endsWith("/app/conversation-content.tsx");
  const isReviewedArtifacts = filename.endsWith("/app/artifacts/reviewed.tsx");
  const isArtifactRegistry = filename.endsWith("/app/artifacts/registry.tsx");
  if (!isPage && !isContent && !isReviewedArtifacts && !isArtifactRegistry) {
    return source;
  }
  const tree = ts.createSourceFile(
    filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX
  );
  const edits = [];
  const matches = {
    conversation: 0,
    leadIn: 0,
    words: 0,
    uiTitle: 0,
    uiChannel: 0,
    uiTeamsGroup: 0,
    conversationOverride: 0,
    addon: 0,
    alert: 0,
    description: 0,
    capacityCopy: 0,
    companyOrder: 0,
    scenarioOrder: 0,
    artifactLeadIn: 0,
    hoverTitle: 0,
    registry: 0,
    autoplayProvider: 0,
    composerControl: 0,
    composerDisabled: 0,
    composerToolbar: 0,
    platformControl: 0,
    mobileCurrentChat: 0,
  };
  const titleFunctions = new Set([
    "RubyConversationList",
    "SlackSidebarList",
    "TeamsSidebarList",
    "PlatformChannelTitle",
    "SlackConversation",
    "RubyMobileShell",
    "SlackMobileHome",
    "TeamsMobileChatList",
    "TeamsMobileShell",
    "Home",
  ]);
  const channelFunctions = new Set([
    "SlackSidebarList",
    "PlatformChannelTitle",
    "SlackConversation",
    "MobileChatCanvas",
    "SlackMobileHome",
    "SlackMobileShell",
    "Home",
  ]);
  const teamsGroupFunctions = new Set([
    "TeamsSidebarList",
    "PlatformChannelTitle",
    "TeamsConversation",
  ]);
  function enclosingFunctionName(node) {
    let current = node.parent;
    while (current) {
      if (ts.isFunctionDeclaration(current)) {
        return current.name?.text ?? "";
      }
      current = current.parent;
    }
    return "";
  }
  function edit(node, text) {
    edits.push({ start: node.getStart(tree), end: node.end, text });
  }
  function replaceWithHoverMarquee(element, textExpression, _titleExpression, as) {
    const tagProp = as ? ` as="${as}"` : "";
    edit(
      element,
      `<WorkspaceChatMarquee${tagProp} text={${textExpression}} />`
    );
    matches.hoverTitle += 1;
  }
  if (isArtifactRegistry) {
    const registryReplacements = [
      [
        "'northstar-litigation-chronology': DawsonChronology",
        "'northstar-litigation-chronology': NorthstarDatedDocuments",
      ],
      [
        "'northstar-clause-precedent-finder': PrecedentComparison",
        "'northstar-clause-precedent-finder': NorthstarSignedAgreements",
      ],
      [
        "'northstar-client-intake': PartnerBookingPanel",
        "'northstar-client-intake': NorthstarConsultationScheduler",
      ],
      [
        "'northstar-matter-staffing': OrionStaffingMatrix",
        "'northstar-matter-staffing': NorthstarTimeEntryMatrix",
      ],
      [
        "'northstar-invoice-review': InvoiceAnomalyTable",
        "'northstar-invoice-review': NorthstarDraftInvoiceReview",
      ],
      [
        "  'northstar-nda-signature-flow': GreenlineSignatureFlow,\n",
        "  'northstar-nda-signature-flow': GreenlineSignatureFlow,\n  'northstar-privacy-review': NorthstarClientIntakeMatrix,\n",
      ],
      [
        "'meadow-cold-chain-alert': ColdChainDeliveryExplorer",
        "'meadow-cold-chain-alert': MeadowColdChainTransportExplorer",
      ],
      [
        "'meadow-batch-traceability': LotLineageTrace",
        "'meadow-batch-traceability': MeadowPackingListFlow",
      ],
      [
        "'meadow-supplier-certificate-audit': CertificateRenewalCards",
        "'meadow-supplier-certificate-audit': MeadowCheeseRecipePresentation",
      ],
      [
        "  'meadow-energy-cost-review': PlantEnergyVariance,\n",
        "  'meadow-energy-cost-review': MeadowSupplierQuoteComparison,\n  'meadow-demand-forecast': MeadowProductionOrderCalculator,\n  'meadow-production-schedule': MeadowWorkloadTimeline,\n",
      ],
      [
        "'vector-internal-tool-prototype': WebhookPlayground",
        "'vector-internal-tool-prototype': VectorCustomerSetupAgent",
      ],
      [
        "'vector-pull-request-review': PullRequestCodeReview",
        "'vector-pull-request-review': VectorDataIsolationReview",
      ],
      [
        "'vector-regression-explorer': ActivationReleaseExplorer",
        "'vector-regression-explorer': VectorMobileSignupExplorer",
      ],
      [
        "'vector-documentation-drift': DocumentationDriftComparison",
        "'vector-documentation-drift': VectorDocumentationDriftComparison",
      ],
      [
        "'vector-cloud-spend-guard': CloudSpendBreakdown",
        "'vector-cloud-spend-guard': VectorCloudSpendBreakdown",
      ],
      [
        "'vector-feedback-signal-map': FeedbackInbox",
        "'vector-feedback-signal-map': VectorFeedbackInbox",
      ],
      [
        "'loom-campaign-launch': LinenCampaignStudio",
        "'loom-campaign-launch': RemainingLoomShopifyLaunch",
      ],
      [
        "'loom-product-launch-room': FlagshipLaunchRoom",
        "'loom-product-launch-room': RemainingLoomStoreOpening",
      ],
      [
        "'loom-social-content-board': SocialContentPlanner",
        "'loom-social-content-board': RemainingLoomProductAds",
      ],
      [
        "'cartly-campaign-roas': CampaignSpendControl",
        "'cartly-campaign-roas': RemainingCartlyHomepageProducts",
      ],
      [
        "'harborview-referral-intake':ReferralDocumentIntake",
        "'harborview-referral-intake': RemainingHarborviewSurgeryDocuments",
      ],
      [
        "'harborview-staff-rota':ClinicalCoverageBalancer",
        "'harborview-staff-rota': RemainingHarborviewTrainingGuides",
      ],
      [
        "'harborview-compliance-evidence-pack':ClinicalAuditReadiness",
        "'harborview-compliance-evidence-pack': RemainingHarborviewDischargeDocuments",
      ],
      [
        "'harborview-operations-dashboard':ClinicThroughputExplorer",
        "'harborview-operations-dashboard': RemainingHarborviewExtraSessions",
      ],
      [
        "'harborview-board-operations-pack':HealthOperationsBoardBrief",
        "'harborview-board-operations-pack': RemainingHarborviewScannerProposal",
      ],
      [
        "'keyline-maintenance-dispatch':MaintenanceDispatchDesk",
        "'keyline-maintenance-dispatch': RemainingKeylineOpenHouseVisits",
      ],
      [
        "'keyline-lease-renewal-flow':LeaseRenewalPlanner",
        "'keyline-lease-renewal-flow': RemainingKeylineAcceptedOffers",
      ],
      [
        "'keyline-vendor-quote-review':ElevatorQuoteNormalizer",
        "'keyline-vendor-quote-review': RemainingKeylineOfferNegotiation",
      ],
      [
        "'keyline-owner-update':LakesideOwnerStatement",
        "'keyline-owner-update': RemainingKeylineCommissionPayments",
      ],
      [
        "'keyline-portfolio-dashboard':BuildingHealthAtlas",
        "'keyline-portfolio-dashboard': RemainingKeylineStaleListings",
      ],
      [
        "'cedarshield-claim-triage': StormClaimAssignment",
        "'cedarshield-claim-triage': RemainingCedarAccidentInspections",
      ],
      [
        "'cedarshield-client-qbr': ClientRiskServiceReview",
        "'cedarshield-client-qbr': RemainingCedarVanInsurance",
      ],
      [
        "'cedarshield-broker-coaching': BrokerCallCoaching",
        "'cedarshield-broker-coaching': RemainingCedarClaimCallUpdates",
      ],
      [
        "'ledger-month-end-command': CloseDependencyPath",
        "'ledger-month-end-command': RemainingLedgerAccountOpening",
      ],
      [
        "'ledger-expense-anomaly': ExpenseReceiptInspector",
        "'ledger-expense-anomaly': RemainingLedgerCardDispute",
      ],
      [
        "'ledger-cloud-cost-allocation': CloudChargebackLedger",
        "'ledger-cloud-cost-allocation': RemainingLedgerBranchCosts",
      ],
      [
        "'ledger-cash-forecast': ThirteenWeekCashModel",
        "'ledger-cash-forecast': RemainingLedgerBranchCash",
      ],
      [
        "'ledger-audit-evidence-binder': FinancialAuditEvidenceIndex",
        "'ledger-audit-evidence-binder': RemainingLedgerHomeLoanDocuments",
      ],
      [
        "'ledger-board-reporting': FinancialBoardStatements",
        "'ledger-board-reporting': RemainingLedgerLendingReview",
      ],
      [
        "'ledger-duplicate-ap-detection': PayableDuplicateReview",
        "'ledger-duplicate-ap-detection': RemainingLedgerTransferReview",
      ],
      [
        "'ledger-revenue-reconciliation': RevenueSettlementReconciler",
        "'ledger-revenue-reconciliation': RemainingLedgerMerchantSettlement",
      ],
    ];
    for (const [from, to] of registryReplacements) {
      const start = source.indexOf(from);
      if (start >= 0) {
        matches.registry += 1;
        edits.push({ start, end: start + from.length, text: to });
      }
    }
  }
  function visit(node) {
    if (
      streamingEnabled && isPage && ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText(tree) === "ConversationPreview" &&
      node.attributes.properties.some((property) =>
        ts.isJsxAttribute(property) &&
        property.name.getText(tree) === "scenario" &&
        ["{activeScenario}", "{scenario}"].includes(
          property.initializer?.getText(tree) ?? ""
        )
      )
    ) {
      matches.conversation += 1;
      const mobileConversation =
        node.attributes.properties.some(
          (property) =>
            ts.isJsxAttribute(property) &&
            property.name.getText(tree) === "scenario" &&
            property.initializer?.getText(tree) === "{scenario}"
        );
      edits.push({
        start: node.getStart(tree), end: node.end,
        text: `<StreamConversation scenario={${mobileConversation ? "scenario" : "activeScenario"}} platform={platform} restored={${mobileConversation ? "true" : "hasRestored && hasRestoredTheme"}}>` + node.getText(tree) + '</StreamConversation>',
      });
    }
    if (isPage) {
      const functionName = enclosingFunctionName(node);
      const nodeText = node.getText(tree);
      if (
        streamingEnabled &&
        functionName === "Home" &&
        ts.isReturnStatement(node) &&
        node.expression
      ) {
        matches.autoplayProvider += 1;
        const returnedElement = ts.isParenthesizedExpression(node.expression)
          ? node.expression.expression
          : node.expression;
        const start = returnedElement.getStart(tree);
        edits.push({
          start,
          end: start,
          text: '<WorkspaceAutoplayProvider orderedCompanyIds={companies.map((company) => company.id)} activeCompanyId={activeCompanyId} activeScenario={activeScenario} activePlatform={platform} restored={hasRestored && hasRestoredTheme} onNavigate={({ companyId, scenarioId }) => { setActiveCompanyId(companyId); setActiveChannel(scenarioId); }}>',
        });
        edits.push({
          start: returnedElement.end,
          end: returnedElement.end,
          text: "</WorkspaceAutoplayProvider>",
        });
      }
      if (
        streamingEnabled &&
        ["RubyComposer", "SlackComposer", "TeamsComposer"].includes(
          functionName
        ) &&
        ts.isJsxAttribute(node) &&
        node.name.getText(tree) === "aria-disabled" &&
        node.initializer?.getText(tree) === '"true"'
      ) {
        matches.composerDisabled += 1;
        edit(node, "");
      }
      if (
        streamingEnabled &&
        ["RubyComposer", "SlackComposer", "TeamsComposer"].includes(
          functionName
        ) &&
        ts.isJsxAttribute(node) &&
        node.name.getText(tree) === "aria-hidden" &&
        node.initializer?.getText(tree) === '"true"' &&
        ts.isJsxOpeningElement(node.parent.parent) &&
        node.parent.parent.tagName.getText(tree) === "div"
      ) {
        matches.composerToolbar += 1;
        edit(node, "");
      }
      if (
        streamingEnabled &&
        ["RubyComposer", "SlackComposer", "TeamsComposer"].includes(
          functionName
        ) &&
        ts.isJsxOpeningElement(node) &&
        node.tagName.getText(tree) === "span"
      ) {
        const className = node.attributes.properties.find(
          (property) =>
            ts.isJsxAttribute(property) &&
            property.name.getText(tree) === "className"
        )?.initializer?.getText(tree);
        const decorative =
          className === '"composer-tools"' ||
          className === '"composer-actions"' ||
          className === '"slack-toolbar-group"' ||
          className === '"slack-toolbar-group slack-toolbar-end"' ||
          className === '"teams-toolbar-group"' ||
          className === '"teams-send"';
        if (decorative) {
          edits.push({
            start: node.end - 1,
            end: node.end - 1,
            text: ' aria-hidden="true"',
          });
        }
        if (
          className === '"composer-actions"' ||
          className === '"slack-toolbar-group slack-toolbar-end"' ||
          className === '"teams-send"'
        ) {
          matches.composerControl += 1;
          edits.push({
            start: node.parent.getStart(tree),
            end: node.parent.getStart(tree),
            text: "<AutoplayComposerControl />",
          });
        }
      }
      if (
        streamingEnabled &&
        ((functionName === "Home" &&
          ts.isJsxOpeningElement(node) &&
          node.getText(tree).includes('className="platform-switcher"')) ||
          (functionName === "MobilePlatformSwitcher" &&
            ts.isJsxOpeningElement(node) &&
            node.getText(tree).includes("mobile-platform-float")))
      ) {
        matches.platformControl += 1;
        edits.push({
          start: node.end - 1,
          end: node.end - 1,
          text: ' data-autoplay-platform-control=""',
        });
      }
      if (
        streamingEnabled &&
        ["RubyMobileShell", "SlackMobileHome", "TeamsMobileChatList"].includes(
          functionName
        ) &&
        ts.isJsxOpeningElement(node) &&
        node.tagName.getText(tree) === "button" &&
        node.getText(tree).includes("item.id === scenario.id ? 'is-active'")
      ) {
        matches.mobileCurrentChat += 1;
        edits.push({
          start: node.end - 1,
          end: node.end - 1,
          text: ' data-autoplay-current-chat={item.id === scenario.id ? "" : undefined}',
        });
      }
      if (ts.isJsxElement(node)) {
        const tagName = node.openingElement.tagName.getText(tree);
        const childExpression =
          node.children.length === 1 && ts.isJsxExpression(node.children[0])
            ? node.children[0].expression?.getText(tree)
            : undefined;
        if (
          functionName === "SlackSidebarList" &&
          tagName === "span" &&
          childExpression === "scenario.channel"
        ) {
          replaceWithHoverMarquee(
            node,
            "workspaceChatChannel(scenario)",
            "workspaceChatTitle(scenario)"
          );
          return;
        }
        if (
          functionName === "TeamsSidebarList" &&
          tagName === "strong" &&
          childExpression === "scenario.teamsGroup"
        ) {
          replaceWithHoverMarquee(
            node,
            "workspaceChatTeamsGroup(scenario)",
            "workspaceChatTitle(scenario)",
            "strong"
          );
          return;
        }
        if (
          functionName === "PlatformChannelTitle" &&
          tagName === "strong" &&
          [
            "scenario.copy.conversationTitle",
            "scenario.teamsGroup",
            "scenario.channel",
          ].includes(childExpression ?? "")
        ) {
          const visibleExpression =
            childExpression === "scenario.copy.conversationTitle"
              ? "workspaceChatTitle(scenario)"
              : childExpression === "scenario.teamsGroup"
                ? "workspaceChatTeamsGroup(scenario)"
                : "workspaceChatChannel(scenario)";
          replaceWithHoverMarquee(
            node,
            visibleExpression,
            "workspaceChatTitle(scenario)",
            "strong"
          );
          return;
        }
        if (
          functionName === "RubyMobileShell" &&
          tagName === "strong" &&
          childExpression === "scenario.copy.conversationTitle"
        ) {
          replaceWithHoverMarquee(
            node,
            "workspaceChatTitle(scenario)",
            "workspaceChatTitle(scenario)",
            "strong"
          );
          return;
        }
        if (
          functionName === "RubyMobileShell" &&
          tagName === "button" &&
          childExpression === "item.copy.conversationTitle"
        ) {
          edit(
            node.children[0],
            "<WorkspaceChatMarquee text={workspaceChatTitle(item)} />"
          );
          if (streamingEnabled) {
            edits.push({
              start: node.openingElement.end - 1,
              end: node.openingElement.end - 1,
              text: ' data-autoplay-current-chat={item.id === scenario.id ? "" : undefined}',
            });
            matches.mobileCurrentChat += 1;
          }
          matches.hoverTitle += 1;
          return;
        }
        if (
          functionName === "SlackMobileHome" &&
          tagName === "strong" &&
          childExpression === "item.channel"
        ) {
          replaceWithHoverMarquee(
            node,
            "workspaceChatChannel(item)",
            "workspaceChatTitle(item)",
            "strong"
          );
          return;
        }
        if (
          functionName === "TeamsMobileChatList" &&
          tagName === "strong" &&
          childExpression === "item.copy.conversationTitle"
        ) {
          replaceWithHoverMarquee(
            node,
            "workspaceChatTitle(item)",
            "workspaceChatTitle(item)",
            "strong"
          );
          return;
        }
        if (
          functionName === "TeamsMobileShell" &&
          tagName === "strong" &&
          childExpression === "scenario.copy.conversationTitle"
        ) {
          replaceWithHoverMarquee(
            node,
            "workspaceChatTitle(scenario)",
            "workspaceChatTitle(scenario)",
            "strong"
          );
          return;
        }
        if (
          functionName === "SlackMobileShell" &&
          tagName === "strong" &&
          childExpression === "scenario.channel"
        ) {
          replaceWithHoverMarquee(
            node,
            "workspaceChatChannel(scenario)",
            "workspaceChatTitle(scenario)",
            "strong"
          );
          return;
        }
      }
      if (
        ts.isVariableDeclaration(node) &&
        node.name.getText(tree) === "companies" &&
        node.initializer &&
        ts.isArrayLiteralExpression(node.initializer)
      ) {
        matches.companyOrder += 1;
        edit(
          node.initializer,
          `workspaceCompanies(${node.initializer.getText(tree)})`
        );
      }
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(tree) === "getCompanyScenarios"
      ) {
        matches.scenarioOrder += 1;
        edit(node.expression, "workspaceCompanyScenarios");
      }
      if (
        functionName === "TeamsScenarioResult" &&
        ts.isVariableDeclaration(node) &&
        node.name.getText(tree) === "leadIn" &&
        node.initializer
      ) {
        matches.artifactLeadIn += 1;
        edit(
          node.initializer,
          `workspaceArtifactLeadIn(scenario) ?? ${node.initializer.getText(tree)}`
        );
      }
      if (
        ts.isPropertyAccessExpression(node) &&
        titleFunctions.has(functionName) &&
        [
          "scenario.copy.conversationTitle",
          "item.copy.conversationTitle",
          "activeScenario.copy.conversationTitle",
        ].includes(nodeText)
      ) {
        matches.uiTitle += 1;
        const target = nodeText.startsWith("item.")
          ? "item"
          : nodeText.startsWith("activeScenario.")
            ? "activeScenario"
            : "scenario";
        edit(node, `workspaceChatTitle(${target})`);
      }
      if (
        ts.isPropertyAccessExpression(node) &&
        channelFunctions.has(functionName) &&
        ["scenario.channel", "item.channel", "activeScenario.channel"].includes(nodeText)
      ) {
        matches.uiChannel += 1;
        const target = nodeText.startsWith("item.")
          ? "item"
          : nodeText.startsWith("activeScenario.")
            ? "activeScenario"
            : "scenario";
        edit(node, `workspaceChatChannel(${target})`);
      }
      if (
        ts.isPropertyAccessExpression(node) &&
        teamsGroupFunctions.has(functionName) &&
        nodeText === "scenario.teamsGroup"
      ) {
        matches.uiTeamsGroup += 1;
        edit(node, "workspaceChatTeamsGroup(scenario)");
      }
      if (
        functionName === "ConversationPreview" &&
        ts.isJsxAttribute(node) &&
        node.name.getText(tree) === "scenario" &&
        node.initializer?.getText(tree) === "{scenario}"
      ) {
        matches.conversationOverride += 1;
        edit(node.initializer, "{workspaceConversationScenario(scenario)}");
      }
      if (
        ts.isJsxSelfClosingElement(node) &&
        ((functionName === "RubyConversation" &&
          node.getText(tree) ===
            '<ScenarioResult scenario={scenario} platform="ruby" />') ||
          (functionName === "SlackConversation" &&
            node.getText(tree) ===
              '<ScenarioResult scenario={scenario} platform="slack" />') ||
          (functionName === "TeamsConversation" &&
            node.getText(tree) ===
              "<TeamsScenarioResult scenario={scenario} />"))
      ) {
        matches.addon += 1;
        edit(node, `${nodeText}<WorkspaceScenarioAddon scenario={scenario} />`);
      }
      if (
        functionName === "RubyConversationList" &&
        ts.isJsxOpeningElement(node) &&
        node.tagName.getText(tree) === "button" &&
        node.attributes.properties.some(
          (property) =>
            ts.isJsxAttribute(property) &&
            property.name.getText(tree) === "className" &&
            property.initializer?.getText(tree).includes("ruby-history-item")
        )
      ) {
        matches.description += 1;
        edits.push({
          start: node.end - 1,
          end: node.end - 1,
          text: " aria-description={workspaceChatDescription(scenario)}",
        });
      }
      if (
        functionName === "RubyConversationList" &&
        ts.isJsxElement(node) &&
        node.getText(tree) === "<span>{scenario.copy.conversationTitle}</span>"
      ) {
        matches.alert += 1;
        // This replaces the title expression too, so discard its nested edit.
        const childStart = node.getStart(tree);
        const childEnd = node.end;
        for (let index = edits.length - 1; index >= 0; index -= 1) {
          if (edits[index].start > childStart && edits[index].end < childEnd) {
            edits.splice(index, 1);
            matches.uiTitle -= 1;
          }
        }
        edit(
          node,
          "<WorkspaceChatMarquee text={workspaceChatTitle(scenario)} /><WorkspaceChatIndicator scenario={scenario} />"
        );
        matches.uiTitle += 1;
        matches.hoverTitle += 1;
        return;
      }
    }
    if (
      isReviewedArtifacts &&
      ts.isStringLiteral(node) &&
      node.text === "Promotion volume must move to Elmhurst."
    ) {
      matches.capacityCopy += 1;
      edit(node, "'New loads must move to Elmhurst.'");
    }
    if (
      isReviewedArtifacts &&
      ts.isStringLiteral(node) &&
      node.text === "The promotion can be accepted here."
    ) {
      matches.capacityCopy += 1;
      edit(node, "'New loads can be accepted here.'");
    }
    if (
      streamingEnabled && isContent && ts.isReturnStatement(node) &&
      node.expression?.getText(tree) === "run.text"
    ) {
      matches.words += 1;
      edits.push({
        start: node.expression.getStart(tree), end: node.expression.end,
        text: "<StreamWords text={run.text} />",
      });
    }
    if (
      streamingEnabled && isPage && ts.isJsxExpression(node) &&
      node.expression?.getText(tree) === "leadIn"
    ) {
      matches.leadIn += 1;
      edits.push({
        start: node.getStart(tree), end: node.end,
        text: "<StreamWords text={leadIn} />",
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  if (
    (isPage &&
      (matches.conversation !== (streamingEnabled ? 2 : 0) ||
        matches.leadIn !== (streamingEnabled ? 1 : 0) ||
        matches.uiTitle !== 8 ||
        matches.uiChannel !== 4 ||
        matches.uiTeamsGroup !== 1 ||
        matches.conversationOverride !== 3 ||
        matches.addon !== 3 ||
        matches.alert !== 1 ||
        matches.description !== 1 ||
        matches.companyOrder !== 1 ||
        matches.scenarioOrder !== 12 ||
        matches.artifactLeadIn !== 1 ||
        matches.hoverTitle !== 11 ||
        matches.autoplayProvider !== (streamingEnabled ? 2 : 0) ||
        matches.composerControl !== (streamingEnabled ? 3 : 0) ||
        matches.composerDisabled !== (streamingEnabled ? 3 : 0) ||
        matches.composerToolbar !== (streamingEnabled ? 3 : 0) ||
        matches.platformControl !== (streamingEnabled ? 2 : 0) ||
        matches.mobileCurrentChat !== (streamingEnabled ? 3 : 0))) ||
    (isContent && matches.words !== (streamingEnabled ? 1 : 0)) ||
    (isReviewedArtifacts && matches.capacityCopy !== 2) ||
    (isArtifactRegistry && matches.registry !== 41)
  ) {
    throw new Error(
      `Streaming integration points changed in ${filename}: ${JSON.stringify(matches)}`
    );
  }
  let adapted = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    adapted = adapted.slice(0, edit.start) + edit.text + adapted.slice(edit.end);
  }
  const overrideImport = isPage
    ? 'import { WorkspaceChatIndicator, WorkspaceChatMarquee, WorkspaceScenarioAddon, workspaceArtifactLeadIn, workspaceChatChannel, workspaceChatDescription, workspaceChatTeamsGroup, workspaceChatTitle, workspaceCompanies, workspaceCompanyScenarios, workspaceConversationScenario } from "@workspace-overrides";\n'
    : "";
  const registryImport = isArtifactRegistry
    ? 'import { NorthstarClientIntakeMatrix, NorthstarConsultationScheduler, NorthstarDatedDocuments, NorthstarDraftInvoiceReview, NorthstarSignedAgreements, NorthstarTimeEntryMatrix } from "@workspace-northstar";\nimport { MeadowCheeseRecipePresentation, MeadowColdChainTransportExplorer, MeadowPackingListFlow, MeadowProductionOrderCalculator, MeadowSupplierQuoteComparison, MeadowWorkloadTimeline } from "@workspace-meadow";\nimport { VectorCloudSpendBreakdown, VectorCustomerSetupAgent, VectorDataIsolationReview, VectorDocumentationDriftComparison, VectorFeedbackInbox, VectorMobileSignupExplorer } from "@workspace-vector";\nimport { RemainingCartlyHomepageProducts, RemainingCedarAccidentInspections, RemainingCedarClaimCallUpdates, RemainingCedarVanInsurance, RemainingHarborviewDischargeDocuments, RemainingHarborviewExtraSessions, RemainingHarborviewScannerProposal, RemainingHarborviewSurgeryDocuments, RemainingHarborviewTrainingGuides, RemainingKeylineAcceptedOffers, RemainingKeylineCommissionPayments, RemainingKeylineOfferNegotiation, RemainingKeylineOpenHouseVisits, RemainingKeylineStaleListings, RemainingLedgerAccountOpening, RemainingLedgerBranchCash, RemainingLedgerBranchCosts, RemainingLedgerCardDispute, RemainingLedgerHomeLoanDocuments, RemainingLedgerLendingReview, RemainingLedgerMerchantSettlement, RemainingLedgerTransferReview, RemainingLoomProductAds, RemainingLoomShopifyLaunch, RemainingLoomStoreOpening } from "@workspace-industry";\n'
    : "";
  const streamingImport =
    streamingEnabled && (isPage || isContent)
      ? `import { ${isPage ? "StreamConversation, StreamWords" : "StreamWords"} } from "@workspace-stream";\n`
      : "";
  const autoplayImport =
    streamingEnabled && isPage
      ? 'import { AutoplayComposerControl, WorkspaceAutoplayProvider } from "@workspace-autoplay";\n'
      : "";
  return `${autoplayImport}${streamingImport}${overrideImport}${registryImport}${adapted}`;
}
