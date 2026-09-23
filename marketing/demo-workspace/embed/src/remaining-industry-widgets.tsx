import { useState } from "react";
import {
  Badge,
  Metric,
  Photo,
  Pick,
  Source,
  WidgetHeader,
  type WidgetProps,
  usd,
} from "../../upstream/app/artifacts/workspace-primitives";
import type { ArtifactRow } from "../../upstream/app/demo-scenarios";

type RemainingWidgetProps = WidgetProps;
type RemainingWidgetScenarioProps = Pick<RemainingWidgetProps, "scenario">;

function rowsFor(scenario: RemainingWidgetProps["scenario"]) {
  return scenario.artifact.rows;
}

function SimpleTable({
  rows,
  headers,
}: {
  rows: ArtifactRow[];
  headers: string[];
}) {
  return (
    <div className="rw-table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
              <td>
                <Badge
                  tone={
                    /approval|pending|blocked|open|review/iu.test(row.status)
                      ? "risk"
                      : "good"
                  }
                >
                  {row.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleRowsWidget({
  scenario,
  rootClass,
  eyebrow,
  headers = ["Work item", "Evidence", "Status"],
  detailLabel = "Selected work",
  actionLabel,
  source,
  tabsClass,
  tabsElement = "div",
  tabsParentClass,
}: RemainingWidgetScenarioProps & {
  rootClass: string;
  eyebrow: string;
  headers?: string[];
  detailLabel?: string;
  actionLabel?: string;
  source: string;
  tabsClass?: string;
  tabsElement?: "div" | "nav";
  tabsParentClass?: string;
}) {
  const rows = rowsFor(scenario);
  const [selected, setSelected] = useState(0);
  const [applied, setApplied] = useState(false);
  const active = rows[selected] ?? rows[0];
  return (
    <div
      className={`rw industry-record-widget ${rootClass}`}
      data-widget-state={`${selected}-${applied}`}
    >
      <WidgetHeader title={scenario.copy.conversationTitle} eyebrow={eyebrow}>
        <Badge tone={applied ? "good" : "info"}>
          {applied ? "Updated" : `${rows.length} records`}
        </Badge>
      </WidgetHeader>
      <div className="rw-metrics">
        <Metric label="Records" value={rows.length} />
        <Metric label="Selected" value={active?.label ?? "None"} />
        <Metric
          label="Current status"
          value={applied ? "Updated" : (active?.status ?? "Pending")}
        />
      </div>
      {tabsParentClass ? (
        <div className={tabsParentClass}>
          {tabsElement === "nav" ? (
            <nav
              className={`rw-tabs${tabsClass ? ` ${tabsClass}` : ""}`}
              aria-label={`${eyebrow} records`}
            >
              {rows.map((row, index) => (
                <Pick
                  key={row.label}
                  selected={index === selected}
                  primary={index === 1}
                  onClick={() => setSelected(index)}
                >
                  {row.label}
                </Pick>
              ))}
            </nav>
          ) : (
            <div className={`rw-tabs${tabsClass ? ` ${tabsClass}` : ""}`}>
              {rows.map((row, index) => (
                <Pick
                  key={row.label}
                  selected={index === selected}
                  primary={index === 1}
                  onClick={() => setSelected(index)}
                >
                  {row.label}
                </Pick>
              ))}
            </div>
          )}
        </div>
      ) : tabsElement === "nav" ? (
        <nav
          className={`rw-tabs${tabsClass ? ` ${tabsClass}` : ""}`}
          aria-label={`${eyebrow} records`}
        >
          {rows.map((row, index) => (
            <Pick
              key={row.label}
              selected={index === selected}
              primary={index === 1}
              onClick={() => setSelected(index)}
            >
              {row.label}
            </Pick>
          ))}
        </nav>
      ) : (
        <div className={`rw-tabs${tabsClass ? ` ${tabsClass}` : ""}`}>
          {rows.map((row, index) => (
            <Pick
              key={row.label}
              selected={index === selected}
              primary={index === 1}
              onClick={() => setSelected(index)}
            >
              {row.label}
            </Pick>
          ))}
        </div>
      )}
      <SimpleTable rows={rows} headers={headers} />
      <section className="rw-detail">
        <small>{detailLabel}</small>
        <h4>{active?.label}</h4>
        <p>{active?.value}</p>
        {actionLabel && (
          <button
            type="button"
            className="rw-action"
            data-primary-action
            onClick={() => setApplied(true)}
            disabled={applied}
          >
            {applied ? "Updated" : actionLabel}
          </button>
        )}
      </section>
      <Source>{source}</Source>
    </div>
  );
}

export function RemainingLedgerAccountOpening({
  scenario,
}: RemainingWidgetProps) {
  const [approved, setApproved] = useState(false);
  const steps = [
    {
      label: "Identity checked",
      evidence: "Two customer records matched",
      status: "Complete",
      state: "complete",
    },
    {
      label: "Approval attached",
      evidence: "Recorded approval for two accounts",
      status: approved ? "Complete" : "Needs approval",
      state: approved ? "complete" : "current",
    },
    {
      label: "Accounts opened",
      evidence: "CB-1842 and CB-1843",
      status: approved ? "Complete" : "Waiting",
      state: approved ? "complete" : "waiting",
    },
    {
      label: "Welcome sent",
      evidence: "Customer instructions through Outlook",
      status: approved ? "Sent" : "Queued",
      state: approved ? "complete" : "waiting",
    },
  ];
  return (
    <div
      className="rw lg-close lg-account-opening"
      data-widget-state={approved ? "approved" : "ready"}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Account opening"
      >
        <Badge tone={approved ? "good" : "info"}>
          {approved ? "Completed" : "2 ready · 1 approval needed"}
        </Badge>
      </WidgetHeader>
      <div className="rw-metrics">
        <Metric label="Accounts ready" value="2" />
        <Metric label="Approval needed" value={approved ? "0" : "1"} />
        <Metric
          label="Welcome messages"
          value={approved ? "2 sent" : "Queued"}
          note="After account creation"
        />
      </div>
      <section
        className="lg-account-opening-summary"
        aria-label="Opening run summary"
      >
        <div className="lg-account-opening-summary-copy">
          <span>Today’s account run</span>
          <strong>
            {approved
              ? "Two customer accounts are open"
              : "Two customer accounts are ready"}
          </strong>
          <p>
            {approved
              ? "Both welcome confirmations are ready to send."
              : "One approval is the only thing between these customers and their new accounts."}
          </p>
        </div>
        <div className="lg-account-opening-summary-stats">
          <strong>{approved ? "2 accounts open" : "2 accounts ready"}</strong>
          <strong>
            {approved ? "0 approvals needed" : "1 approval needed"}
          </strong>
        </div>
      </section>
      <ol
        className="lg-account-opening-progress"
        aria-label="Account opening progress"
      >
        {steps.map((step, index) => (
          <li key={step.label} className={`is-${step.state}`}>
            <span className="lg-account-opening-step-marker">{index + 1}</span>
            <div className="lg-account-opening-step-copy">
              <div>
                <strong>{step.label}</strong>
                <Badge
                  tone={
                    step.state === "complete"
                      ? "good"
                      : step.state === "current"
                        ? "info"
                        : "neutral"
                  }
                >
                  {step.status}
                </Badge>
              </div>
              <small>{step.evidence}</small>
            </div>
          </li>
        ))}
      </ol>
      <section
        className="lg-account-opening-customers"
        aria-labelledby="lg-account-opening-customers-title"
      >
        <header>
          <div>
            <small>Approved customer records</small>
            <h4 id="lg-account-opening-customers-title">
              {approved ? "Accounts opened" : "Accounts ready to open"}
            </h4>
          </div>
          <span>{approved ? "2 of 2 open" : "2 of 2 approved"}</span>
        </header>
        <div className="lg-account-opening-customer-list">
          {[
            ["Acme Retail", "CB-1842", "Business account"],
            ["Northside Foods", "CB-1843", "Business account"],
          ].map(([name, reference, kind]) => (
            <article key={reference} className="lg-account-opening-customer">
              <span
                className="lg-account-opening-customer-icon"
                aria-hidden="true"
              >
                <i className="fa-solid fa-building" />
              </span>
              <div>
                <strong>{name}</strong>
                <small>{kind}</small>
              </div>
              <span className="lg-account-opening-reference">
                <small>{approved ? "Open account" : "Account record"}</small>
                <strong>{reference}</strong>
              </span>
              <Badge tone={approved ? "good" : "info"}>
                {approved ? "Open" : "Ready"}
              </Badge>
            </article>
          ))}
          <article className="lg-account-opening-exception">
            <span
              className="lg-account-opening-customer-icon"
              aria-hidden="true"
            >
              <i className="fa-solid fa-circle-exclamation" />
            </span>
            <div>
              <strong>River Market</strong>
              <small>Application held before account creation</small>
            </div>
            <span className="lg-account-opening-reference">
              <small>Next requirement</small>
              <strong>Identity approval</strong>
            </span>
            <Badge tone="risk">Approval missing</Badge>
          </article>
        </div>
      </section>
      <div
        className={`lg-close-decision lg-account-opening-decision ${approved ? "is-complete" : "is-pending"}`}
        data-testid="account-opening-decision"
        aria-live="polite"
      >
        <div className="lg-account-opening-decision-copy">
          <span
            className={`lg-account-opening-decision-icon ${approved ? "is-complete" : "is-pending"}`}
            aria-hidden="true"
          >
            <i
              className={
                approved
                  ? "fa-solid fa-check"
                  : "fa-solid fa-circle-exclamation"
              }
            />
          </span>
          <div>
            <small>{approved ? "Completed" : "Needs approval"}</small>
            <strong>
              {approved
                ? "Two approved customer accounts are open."
                : "Attach the approval record to open these accounts."}
            </strong>
            <p>
              {approved
                ? "Welcome confirmations are ready for both customers."
                : "River Market remains paused until its identity approval arrives."}
            </p>
          </div>
        </div>
        {approved ? (
          <span className="lg-account-opening-status" role="status">
            <i className="fa-solid fa-check" aria-hidden="true" />
            Accounts opened
          </span>
        ) : (
          <button
            type="button"
            className="rw-action"
            data-primary-action
            onClick={() => setApproved(true)}
          >
            Attach approval
          </button>
        )}
      </div>
      <Source>
        Core-banking workflow · Identity register KYC-1842 · Welcome messages
        through Outlook
      </Source>
    </div>
  );
}

export function RemainingLedgerCardDispute({ scenario }: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="lg-expense lg-expense-layout"
      tabsElement="nav"
      eyebrow="Card payment dispute · Evidence review"
      detailLabel="Selected transaction"
      actionLabel="Submit evidence"
      source="Card transaction record · Receipt archive · Dispute case DP-8821"
    />
  );
}

export function RemainingLedgerBranchCosts({ scenario }: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="lg-cloud"
      eyebrow="Branch cost allocation · Source bill matched"
      detailLabel="Selected allocation"
      actionLabel="Post approved allocation"
      source="Shared bank bill · Branch allocation rules · Allocation total reconciled"
    />
  );
}

export function RemainingLedgerHomeLoanDocuments({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="lg-audit lg-audit-layout"
      tabsElement="nav"
      eyebrow="Home-loan application · Document checklist"
      detailLabel="Selected application document"
      actionLabel="Mark document received"
      source="Home-loan checklist · Applicant document folder · Loan officer review"
    />
  );
}

export function RemainingLedgerLendingReview({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="lg-statements"
      eyebrow="Bank lending · Performance review"
      detailLabel="Selected lending measure"
      source="Bank lending workbook · Branch results · Reconciled reporting period"
    />
  );
}

export function RemainingLedgerTransferReview({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="lg-duplicates"
      tabsClass="lg-duplicate-strip"
      eyebrow="Payment operations · Transfer review"
      detailLabel="Selected transfer"
      actionLabel="Hold repeated transfer"
      source="Transfer register · Payment operations review · Duplicate instruction evidence"
    />
  );
}

const branchNames = [
  "Central branch",
  "North branch",
  "Harbor branch",
] as const;
const branchClosingDollarsByName: Record<
  (typeof branchNames)[number],
  readonly number[]
> = {
  "Central branch": [
    420000, 408000, 396000, 384000, 372000, 360000, 348000, 336000, 324000,
    312000, 300000, 288000, 276000,
  ],
  "North branch": [
    214000, 198000, 182000, 166000, 150000, 134000, 118000, 126000, 144000,
    162000, 180000, 198000, 216000,
  ],
  "Harbor branch": [
    310000, 302000, 294000, 286000, 278000, 270000, 262000, 254000, 246000,
    238000, 230000, 222000, 214000,
  ],
};

function branchCashPath(
  valuesDollars: readonly number[],
  reserveDollars: number
) {
  const minDollars = Math.min(...valuesDollars, reserveDollars) - 50000;
  const maxDollars = Math.max(...valuesDollars, reserveDollars) + 50000;
  return valuesDollars
    .map(
      (valueDollars, index) =>
        `${index === 0 ? "M" : "L"} ${28 + index * 49} ${176 - ((valueDollars - minDollars) / (maxDollars - minDollars)) * 132}`
    )
    .join(" ");
}

export function RemainingLedgerBranchCash({ scenario }: RemainingWidgetProps) {
  const [branchName, setBranchName] = useState<(typeof branchNames)[number]>(
    branchNames[0]
  );
  const [reserveDollars, setReserveDollars] = useState(250000);
  const [previewed, setPreviewed] = useState(false);
  const closingDollars = branchClosingDollarsByName[branchName];
  const lowestDollars = Math.min(...closingDollars);
  const reserveBreachIndex = closingDollars.findIndex(
    (valueDollars) => valueDollars < reserveDollars
  );
  return (
    <div
      className="rw lg-cash"
      data-widget-state={`${branchName}-${reserveDollars}-${previewed}`}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Branch cash plan"
      >
        <Badge tone={reserveBreachIndex >= 0 ? "risk" : "good"}>
          {reserveBreachIndex >= 0
            ? `Review week ${reserveBreachIndex + 1}`
            : "Reserve protected"}
        </Badge>
      </WidgetHeader>
      <div className="rw-metrics">
        <Metric label="Branch" value={branchName} />
        <Metric label="Lowest projected cash" value={usd(lowestDollars)} />
        <Metric label="Reserve buffer" value={usd(reserveDollars)} />
        <Metric
          label="Treasury decision"
          value={previewed ? "Previewed" : "Pending"}
          id="cash-breach"
        />
      </div>
      <div className="lg-cash-controls">
        <label>
          Branch<strong>{branchName}</strong>
          <select
            aria-label="Branch"
            value={branchName}
            onChange={(event) => {
              const nextBranch =
                branchNames.find((name) => name === event.target.value) ??
                branchNames[0];
              setBranchName(nextBranch);
            }}
          >
            <option value="Central branch">Central branch</option>
            <option value="North branch">North branch</option>
            <option value="Harbor branch">Harbor branch</option>
          </select>
        </label>
        <label>
          Required reserve<strong>{usd(reserveDollars)}</strong>
          <input
            aria-label="Required reserve"
            type="range"
            min="150000"
            max="350000"
            step="25000"
            value={reserveDollars}
            onChange={(event) => setReserveDollars(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          data-primary-action
          onClick={() => setPreviewed(true)}
        >
          {previewed ? "Cash plan previewed" : "Preview cash movement"}
        </button>
      </div>
      <div className="lg-cash-chart">
        <svg aria-label="Thirteen week branch cash plan" viewBox="0 0 660 210">
          <line
            x1="26"
            y1="126"
            x2="632"
            y2="126"
            className="lg-reserve-line"
          />
          <text x="32" y="119">
            {usd(reserveDollars)} reserve
          </text>
          <path d={branchCashPath(closingDollars, reserveDollars)} />
          {closingDollars.map((valueDollars, index) => {
            const minDollars =
              Math.min(...closingDollars, reserveDollars) - 50000;
            const maxDollars =
              Math.max(...closingDollars, reserveDollars) + 50000;
            return (
              <g key={`W${index + 1}`}>
                <circle
                  cx={28 + index * 49}
                  cy={
                    176 -
                    ((valueDollars - minDollars) / (maxDollars - minDollars)) *
                      132
                  }
                  r="4"
                />
                <text x={28 + index * 49} y="201" textAnchor="middle">
                  W{index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="rw-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Opening</th>
              <th>Expected movement</th>
              <th>Closing</th>
            </tr>
          </thead>
          <tbody>
            {closingDollars.map((closingDollarsValue, index) => {
              const openingDollars =
                index === 0
                  ? closingDollarsValue + 18000
                  : closingDollars[index - 1];
              const movementDollars = closingDollarsValue - openingDollars;
              return (
                <tr key={`W${index + 1}`}>
                  <th scope="row">W{index + 1}</th>
                  <td>{usd(openingDollars)}</td>
                  <td
                    className={movementDollars >= 0 ? "good-text" : "risk-text"}
                  >
                    {movementDollars >= 0 ? "+" : "−"}
                    {usd(Math.abs(movementDollars))}
                  </td>
                  <td
                    className={
                      closingDollarsValue < reserveDollars ? "risk-text" : ""
                    }
                  >
                    <strong>{usd(closingDollarsValue)}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Source>
        Branch withdrawals · Expected deposits · Treasury reserve rule · No
        money is moved by this demo
      </Source>
    </div>
  );
}

type SettlementView = "All" | "Sales" | "Deductions";

export function RemainingLedgerMerchantSettlement({
  scenario,
}: RemainingWidgetProps) {
  const [settlementView, setSettlementView] = useState<SettlementView>("All");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [explanationSent, setExplanationSent] = useState(false);
  const rows = rowsFor(scenario);
  const visibleRows =
    settlementView === "All"
      ? rows
      : rows.filter((row) =>
          settlementView === "Sales"
            ? /sales/iu.test(row.label)
            : !/sales/iu.test(row.label)
        );
  const active = visibleRows[selectedIndex] ?? visibleRows[0];
  const capturedSalesDollars = 84200;
  const refundsDollars = 3480;
  const feesDollars = 2280;
  const adjustmentsDollars = 1520;
  const depositedDollars =
    capturedSalesDollars - refundsDollars - feesDollars - adjustmentsDollars;
  return (
    <div
      className="rw lg-revenue"
      data-widget-state={`${settlementView}-${selectedIndex}-${explanationSent}`}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Merchant settlement"
      >
        <Badge tone="good">Reconciled</Badge>
      </WidgetHeader>
      <div
        className="lg-revenue-equation"
        aria-label="Merchant settlement equation"
      >
        <span>
          <small>Gross sales</small>
          <strong>{usd(capturedSalesDollars)}</strong>
        </span>
        <b>−</b>
        <span>
          <small>Refunds</small>
          <strong>{usd(refundsDollars)}</strong>
        </span>
        <b>−</b>
        <span>
          <small>Processing fees</small>
          <strong>{usd(feesDollars)}</strong>
        </span>
        <b>−</b>
        <span>
          <small>Adjustments</small>
          <strong>{usd(adjustmentsDollars)}</strong>
        </span>
        <b>=</b>
        <span className="is-result">
          <small>Bank deposit</small>
          <strong data-testid="revenue-expected">
            {usd(depositedDollars)}
          </strong>
        </span>
      </div>
      <div className="rw-metrics">
        <Metric label="Gross sales" value={usd(capturedSalesDollars)} />
        <Metric
          label="Deductions"
          value={usd(refundsDollars + feesDollars + adjustmentsDollars)}
        />
        <Metric label="Bank deposit" value={usd(depositedDollars)} />
        <Metric
          label="Explanation"
          value={explanationSent ? "Sent" : "Ready"}
          id="revenue-unexplained"
        />
      </div>
      <div className="lg-revenue-filters">
        <label>
          Settlement view
          <select
            aria-label="Settlement view"
            value={settlementView}
            onChange={(event) => {
              const nextView =
                event.target.value === "Sales" ||
                event.target.value === "Deductions"
                  ? event.target.value
                  : "All";
              setSettlementView(nextView);
              setSelectedIndex(0);
            }}
          >
            <option>All</option>
            <option>Sales</option>
            <option>Deductions</option>
          </select>
        </label>
      </div>
      <div className="lg-revenue-work">
        <div className="rw-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Settlement step</th>
                <th>Amount or source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, index) => (
                <tr
                  key={row.label}
                  className={selectedIndex === index ? "is-selected" : ""}
                >
                  <th scope="row">
                    <button
                      type="button"
                      aria-label={`Inspect ${row.label}`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      {row.label}
                    </button>
                  </th>
                  <td>{row.value}</td>
                  <td>
                    <Badge tone="good">{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside>
          <small>{active?.label}</small>
          <h4>Verified merchant explanation</h4>
          <p>{active?.value}</p>
          <button
            type="button"
            className="rw-action"
            data-primary-action
            onClick={() => setExplanationSent(true)}
            disabled={explanationSent}
          >
            {explanationSent ? "Explanation sent" : "Send explanation"}
          </button>
        </aside>
      </div>
      <Source>
        Sales register · Refund and fee records · Bank settlement reference ·
        Merchant explanation remains a demo action
      </Source>
    </div>
  );
}

function CartlyStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="cartly-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

export function RemainingCartlyHomepageProducts({
  scenario,
}: RemainingWidgetProps) {
  const [previewed, setPreviewed] = useState(false);
  const rows = rowsFor(scenario);
  return (
    <div
      className="cartly-widget cartly-campaigns"
      data-widget-state={previewed ? "previewed" : "ready"}
    >
      <header className="cartly-heading">
        <div>
          <span>Homepage product proposal</span>
          <small>Shopify</small>
          <h3>{scenario.copy.conversationTitle}</h3>
        </div>
        <button
          className="cartly-primary"
          type="button"
          data-primary-action
          onClick={() => setPreviewed(true)}
        >
          {previewed ? "Proposal previewed" : "Preview homepage proposal"}
        </button>
      </header>
      <div className="cartly-stats campaign-stats">
        <CartlyStat
          label="Products selected"
          value="2"
          note="Best-selling items"
        />
        <CartlyStat
          label="Stock checked"
          value="3"
          note="Current availability"
        />
        <CartlyStat
          label="Margin floor"
          value="Protected"
          note="Approved rule"
        />
        <CartlyStat
          label="Decision"
          value={previewed ? "Previewed" : "Pending"}
          note="Merchandising approval"
        />
      </div>
      <div className="cartly-table-wrap">
        <table className="cartly-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Evidence</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cartly-footnote">
        Homepage exposure is a proposal until merchandising approval. Shopify
        publishing remains a separate action.
      </p>
    </div>
  );
}

export function RemainingHarborviewSurgeryDocuments({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="hv-intake"
      tabsParentClass="hv-intake-desk"
      tabsElement="nav"
      eyebrow="Surgery preparation · Administrative documents"
      detailLabel="Selected document"
      actionLabel="Request missing document"
      source="Clinician-defined checklist · Patient document folder · Surgery coordinator"
    />
  );
}

export function RemainingHarborviewTrainingGuides({
  scenario,
}: RemainingWidgetProps) {
  const [applied, setApplied] = useState(false);
  const rows = rowsFor(scenario);
  return (
    <div
      className="rw hv-coverage"
      data-widget-state={applied ? "applied" : "ready"}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Training guide assignments"
      >
        <Badge tone={applied ? "good" : "risk"}>
          {applied ? "Applied" : "Training lead review"}
        </Badge>
      </WidgetHeader>
      <div className="rw-metrics">
        <Metric label="Guides prepared" value="3" />
        <Metric label="Staff groups" value="3" />
        <Metric label="Approval" value={applied ? "Applied" : "Pending"} />
      </div>
      <SimpleTable rows={rows} headers={["Role", "Guide", "Status"]} />
      <section className="hv-swap-tray">
        <h4>Training distribution</h4>
        <article>
          <span>
            <strong>Send approved guides to staff</strong>
            <p>
              Three role groups · Sources attached · Recorded completion dates
            </p>
          </span>
          <button
            type="button"
            className="rw-action"
            data-primary-action
            onClick={() => setApplied(true)}
            disabled={applied}
          >
            {applied ? "Training plan applied" : "Apply training plan"}
          </button>
        </article>
      </section>
      <Source>
        Approved hospital procedures · Training guide folder · Training lead
        review
      </Source>
    </div>
  );
}

export function RemainingHarborviewDischargeDocuments({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="hv-audit"
      eyebrow="Patient discharge · Care-team review"
      detailLabel="Selected discharge document"
      actionLabel="Send for care-team review"
      source="Clinician-approved discharge record · Medication list · Follow-up calendar"
    />
  );
}

export function RemainingHarborviewExtraSessions({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="hv-capacity"
      eyebrow="Extra clinic sessions · Doctor and room matching"
      detailLabel="Selected session"
      actionLabel="Send for clinical approval"
      source="Doctor availability · Room requirements · Clinic calendar"
    />
  );
}

export function RemainingHarborviewScannerProposal({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="hv-board"
      eyebrow="Capital request · Hospital scanner proposal"
      detailLabel="Selected scanner option"
      source="Equipment comparison · Examination demand · Installation and service estimates"
    />
  );
}

export function RemainingKeylineOpenHouseVisits({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="kl-dispatch"
      eyebrow="Open-house visits · Sales agent schedule"
      detailLabel="Selected property visit"
      actionLabel="Confirm open-house route"
      source="Property listing register · Seller access records · Agent calendar"
    />
  );
}

export function RemainingKeylineAcceptedOffers({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="kl-renewals"
      tabsClass="kl-expiry-strip"
      eyebrow="Accepted offers · Sale progression"
      detailLabel="Selected sale step"
      actionLabel="Request missing sale document"
      source="Accepted-offer register · Survey calendar · Buyer solicitor documents"
    />
  );
}

const staleListingImages = [
  "/static/workspace-demo/demo-keyline/lakeside-exterior.webp",
  "/static/workspace-demo/demo-keyline/parkview-exterior.webp",
  "/static/workspace-demo/demo-keyline/millhouse-exterior.webp",
];

export function RemainingKeylineStaleListings({
  scenario,
}: RemainingWidgetProps) {
  const [selected, setSelected] = useState(0);
  const rows = rowsFor(scenario);
  const active = rows[selected] ?? rows[0];
  return (
    <div className="rw kl-atlas" data-widget-state={selected}>
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Stale listings"
      >
        <Badge tone="risk">Seller approval needed</Badge>
      </WidgetHeader>
      <div className="rw-metrics">
        <Metric label="Homes reviewed" value={rows.length} />
        <Metric label="Listing updates ready" value="2" />
        <Metric label="Price decisions" value="1 pending" />
      </div>
      <div className="kl-building-cards">
        {rows.map((row, index) => (
          <Pick
            key={row.label}
            primary={index === 0}
            label={`Review ${row.label} listing`}
            selected={selected === index}
            onClick={() => setSelected(index)}
          >
            <Photo
              src={staleListingImages[index % staleListingImages.length]}
              alt={`${row.label} listing`}
            />
            <div>
              <strong>{row.label}</strong>
              <span
                className="kl-occupancy-ring"
                style={{
                  background: `conic-gradient(var(--rw-blue) ${(index + 2) * 90}deg,var(--rw-line) 0)`,
                }}
              >
                <b>{row.status}</b>
              </span>
              <small>{row.value}</small>
              <small>{index === 2 ? "Price decision" : "Listing update"}</small>
            </div>
          </Pick>
        ))}
      </div>
      <section className="kl-building-issues" data-testid="building-issues">
        <h4>{active?.label}: next buyer-facing action</h4>
        <div>
          <Badge tone={active?.status === "Seller approval" ? "risk" : "good"}>
            {active?.status}
          </Badge>
          <strong>{active?.value}</strong>
          <span>Owner: seller · Buyer response review</span>
        </div>
        <div>
          <Badge>Next</Badge>
          <strong>
            Refresh the listing details and send the approved change to buyers.
          </strong>
          <span>Existing property and buyer records remain linked.</span>
        </div>
      </section>
      <Source>
        Property listing register · Viewing feedback · Seller approval record
      </Source>
    </div>
  );
}

export function RemainingKeylineOfferNegotiation({
  scenario,
}: RemainingWidgetProps) {
  const [priceDollars, setPriceDollars] = useState(638000);
  const rows = rowsFor(scenario);
  return (
    <div className="rw kl-quotes" data-widget-state={priceDollars}>
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="House counteroffer · Seller-authorized terms"
      >
        <Badge tone="risk">Seller approval needed</Badge>
      </WidgetHeader>
      <div className="kl-quote-assumption">
        <label>
          Proposed house price <strong>{usd(priceDollars)}</strong>
          <input
            aria-label="Proposed house price"
            data-primary-action
            type="range"
            min="600000"
            max="680000"
            step="1000"
            value={priceDollars}
            onChange={(event) => setPriceDollars(Number(event.target.value))}
          />
        </label>
        <p>Adjust the proposed price inside the seller’s recorded authority.</p>
      </div>
      <SimpleTable
        rows={rows}
        headers={["Term", "Buyer offer", "Proposed counter"]}
      />
      <div className="kl-quote-recommendation">
        <h4>Counteroffer proposal</h4>
        <p>
          {usd(priceDollars)} with the recorded completion date and included
          items. Send only after seller approval.
        </p>
      </div>
      <Source>
        Buyer offer register · Seller authority · Counteroffer remains a demo
        proposal
      </Source>
    </div>
  );
}

export function RemainingKeylineCommissionPayments({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="kl-owner-statement"
      eyebrow="Weekly agent commissions · Completed sales"
      detailLabel="Selected commission"
      actionLabel="Confirm commission payment"
      source="Completed-sale register · Commission agreements · Payment confirmations"
    />
  );
}

export function RemainingCedarAccidentInspections({
  scenario,
}: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="cs-storm"
      tabsClass="cs-claim-strip"
      eyebrow="Accident desk · Vehicle inspection schedule"
      detailLabel="Selected accident claim"
      actionLabel="Confirm inspection"
      source="Accident claim register · Assessor availability · Customer appointments"
    />
  );
}

export function RemainingCedarClaimCallUpdates({
  scenario,
}: RemainingWidgetProps) {
  const rows = rowsFor(scenario);
  const [selected, setSelected] = useState(0);
  const [assigned, setAssigned] = useState(false);
  const active = rows[selected] ?? rows[0];
  return (
    <div
      className="rw cs-coaching"
      data-widget-state={`${selected}-${assigned}`}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="Customer calls · Claim detail updates"
      >
        <Badge tone={assigned ? "good" : "neutral"}>
          {assigned ? "Follow-up created" : `${rows.length} call details`}
        </Badge>
      </WidgetHeader>
      <div className="cs-coaching-shell">
        <nav aria-label="Claim call details">
          {rows.map((row, index) => (
            <Pick
              key={row.label}
              primary={index === 1}
              selected={index === selected}
              onClick={() => setSelected(index)}
            >
              <strong>{row.label}</strong>
              <small>{row.value}</small>
            </Pick>
          ))}
        </nav>
        <section className="cs-transcript">
          <header>
            <span>
              <small>Verified call detail</small>
              <h4>{active?.label}</h4>
            </span>
            <Badge tone="info">Timestamped evidence</Badge>
          </header>
          {rows.map((row) => (
            <blockquote key={row.label}>
              <time>{row.value.split(" · ")[1] ?? row.value}</time>
              <span>
                <strong>{row.label}</strong>
                <p>{row.status}</p>
              </span>
            </blockquote>
          ))}
          <p className="cs-observation">
            Required claim details are recorded separately from the claims
            decision.
          </p>
        </section>
      </div>
      <section className="cs-coaching-example">
        <div>
          <small>Next claim action</small>
          <p>{active?.value}</p>
        </div>
        <aside>
          <small>Follow-up assignment</small>
          <p>Send the recorded detail to the claim owner.</p>
          <button
            type="button"
            className="rw-action"
            onClick={() => setAssigned(true)}
            disabled={assigned}
          >
            {assigned ? "Follow-up created" : "Create claim follow-up"}
          </button>
        </aside>
      </section>
      <Source>
        Recorded customer calls · Claim records · Callback calendar
      </Source>
    </div>
  );
}

export function RemainingCedarVanInsurance({ scenario }: RemainingWidgetProps) {
  return (
    <SimpleRowsWidget
      scenario={scenario}
      rootClass="cs-client-review"
      tabsClass="cs-asset-tabs"
      eyebrow="Delivery vans · Insurance submission"
      detailLabel="Selected coverage item"
      actionLabel="Send customer acceptance"
      source="Vehicle schedule · Driver records · Insurer offer"
    />
  );
}

export function RemainingLoomShopifyLaunch({ scenario }: RemainingWidgetProps) {
  const [channel, setChannel] = useState("Shopify");
  const channels = ["Shopify", "Email", "Homepage"];
  return (
    <div className="loom-campaign-studio" data-widget-state={channel}>
      <header className="batch-widget-header">
        <strong>{scenario.copy.conversationTitle}</strong>
        <span className="is-positive">Published</span>
      </header>
      <div className="campaign-studio-layout">
        <section className="campaign-preview is-shopify">
          <Photo
            src="/static/workspace-demo/demo-products/linen-overshirt.webp"
            alt="New collection product"
          />
          <div>
            <small>New collection</small>
            <strong>Approved products are live.</strong>
            <span>Shopify collection /new</span>
            <b>Published</b>
            <button type="button">Open collection</button>
          </div>
        </section>
        <aside>
          <div className="campaign-channel-tabs">
            {channels.map((item) => (
              <button
                type="button"
                key={item}
                aria-label={`${item} preview`}
                className={channel === item ? "is-selected" : ""}
                onClick={() => setChannel(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <dl>
            <div>
              <dt>Creative</dt>
              <dd>Approved</dd>
            </div>
            <div>
              <dt>Products</dt>
              <dd>Matched</dd>
            </div>
            <div>
              <dt>Launch</dt>
              <dd>Published</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export function RemainingLoomProductAds({ scenario }: RemainingWidgetProps) {
  const [selected, setSelected] = useState(0);
  const rows = rowsFor(scenario);
  return (
    <div className="loom-social-planner" data-widget-state={selected}>
      <header className="batch-widget-header">
        <strong>{scenario.copy.conversationTitle}</strong>
        <span>7 ads · Scheduled</span>
      </header>
      <div className="social-layout">
        <section className="social-calendar">
          {rows.map((row, index) => (
            <div key={row.label}>
              <strong>{["Monday", "Wednesday", "Friday"][index % 3]}</strong>
              <button
                type="button"
                className={selected === index ? "is-selected" : ""}
                onClick={() => setSelected(index)}
              >
                <span>
                  <small>Product ad</small>
                  <b>{row.label}</b>
                  <em>{row.status}</em>
                </span>
              </button>
            </div>
          ))}
        </section>
        <aside className="social-preview">
          <small>Product ad preview</small>
          <strong>{rows[selected]?.label}</strong>
          <span>{rows[selected]?.value}</span>
          <button type="button">Scheduled</button>
        </aside>
      </div>
    </div>
  );
}

export function RemainingLoomStoreOpening({ scenario }: RemainingWidgetProps) {
  const [decisionsOnly, setDecisionsOnly] = useState(false);
  const rows = rowsFor(scenario);
  const visible = rows.filter(
    (row) =>
      !decisionsOnly || /approval|awaiting|pending|open/iu.test(row.status)
  );
  return (
    <div
      className="loom-launch-room"
      data-widget-state={decisionsOnly ? "decisions" : "all"}
    >
      <WidgetHeader
        title={scenario.copy.conversationTitle}
        eyebrow="New store · Opening readiness"
      >
        <div className="launch-countdown">
          <strong>Ready for review</strong>
          <small>before opening</small>
        </div>
      </WidgetHeader>
      <div className="launch-summary">
        <span>
          <small>Overall readiness</small>
          <strong>
            {
              rows.filter((row) =>
                /complete|published|confirmed/iu.test(row.status)
              ).length
            }{" "}
            / {rows.length}
          </strong>
          <i>
            <b
              style={{
                width: `${Math.round((rows.filter((row) => /complete|published|confirmed/iu.test(row.status)).length / Math.max(rows.length, 1)) * 100)}%`,
              }}
            />
          </i>
        </span>
        <button
          type="button"
          data-primary-action
          aria-label="Needs decision"
          className={decisionsOnly ? "is-selected" : ""}
          onClick={() => setDecisionsOnly((current) => !current)}
        >
          Needs approval
        </button>
      </div>
      <div className="launch-items">
        {visible.map((row) => (
          <article
            key={row.label}
            className={
              /approval|awaiting|pending|open/iu.test(row.status)
                ? "is-decision"
                : ""
            }
          >
            <i
              className={
                /approval|awaiting|pending|open/iu.test(row.status)
                  ? "fa-solid fa-circle-exclamation"
                  : "fa-solid fa-circle-check"
              }
            />
            <span>
              <strong>{row.label}</strong>
              <small>{row.value}</small>
            </span>
            <Badge
              tone={
                /approval|awaiting|pending|open/iu.test(row.status)
                  ? "risk"
                  : "good"
              }
            >
              {row.status}
            </Badge>
          </article>
        ))}
      </div>
      <Source>Store opening register · Till tests · Facilities sign-off</Source>
    </div>
  );
}
