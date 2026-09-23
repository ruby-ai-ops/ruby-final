import { Fragment, useState } from "react";
import {
  getPerson,
  type ArtifactRow,
  type DemoScenario,
} from "../../upstream/app/demo-scenarios";

export interface NorthstarWidgetProps {
  scenario: DemoScenario;
  platform: "ruby" | "slack" | "teams";
}

function titleFor(scenario: DemoScenario) {
  return (
    <header className="reviewed-widget-header">
      <strong>{scenario.copy.conversationTitle}</strong>
    </header>
  );
}

function cells(value: string) {
  return value.split(" | ");
}

function personId(name: string) {
  return name.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/gu, "-");
}

function missingCount(value: string) {
  const match = value.match(/(\d+)\s+missing/u);
  return match ? Number(match[1]) : 0;
}

export function NorthstarClientIntakeMatrix({
  scenario,
}: NorthstarWidgetProps) {
  const [weight, setWeight] = useState(0);
  const headings = ["Completed", "Missing", "Request status"];

  return (
    <div className="bespoke-matrix-widget" data-widget-state={weight}>
      <header>
        <strong>{scenario.copy.conversationTitle}</strong>
        <span>Showing {headings[weight]}</span>
      </header>
      <div className="matrix-grid">
        <div />
        {headings.map((heading, index) => (
          <button
            key={heading}
            type="button"
            data-primary-action={index === 2 ? "" : undefined}
            aria-pressed={weight === index}
            className={weight === index ? "is-selected" : ""}
            onClick={() => setWeight(index)}
          >
            {heading}
          </button>
        ))}
        {scenario.artifact.rows.map((row) => {
          const [completed, missing, request] = cells(row.value);
          return (
            <Fragment key={row.label}>
              <strong>{row.label}</strong>
              <span>{completed}</span>
              <span>{missing}</span>
              <span>{request}</span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function NorthstarDatedDocuments({ scenario }: NorthstarWidgetProps) {
  const [event, setEvent] = useState(0);
  const rows = scenario.artifact.rows;
  const active = rows[event] ?? rows[0];
  const activeMessage =
    active?.label === "Date uncertain"
      ? "Date needs review before the document is relied on."
      : "Source linked to the Dawson matter record.";

  return (
    <div className="reviewed-dawson" data-widget-state={event}>
      {titleFor(scenario)}
      <ol>
        {rows.map((row, index) => (
          <li key={row.label}>
            <button
              type="button"
              data-primary-action={index === 1 ? "" : undefined}
              className={event === index ? "is-selected" : ""}
              aria-pressed={event === index}
              onClick={() => setEvent(index)}
            >
              <time>{row.label}</time>
              <span>
                <strong>{row.value}</strong>
                <small>{row.status}</small>
                {event === index && <em>{activeMessage}</em>}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function NorthstarSignedAgreements({ scenario }: NorthstarWidgetProps) {
  const [selected, setSelected] = useState(0);
  const rows = scenario.artifact.rows;
  const active = rows[selected] ?? rows[0];
  const [executedDate = ""] = cells(active?.value ?? "");

  return (
    <div className="reviewed-precedent" data-widget-state={selected}>
      {titleFor(scenario)}
      <div className="precedent-table">
        <div className="precedent-header">
          <b>Agreement</b>
          <b>Executed</b>
          <b>Amendments</b>
          <b>Status</b>
        </div>
        {rows.map((row, index) => {
          const [date, amendment = "None"] = cells(row.value);
          return (
            <button
              type="button"
              key={row.label}
              aria-pressed={selected === index}
              data-primary-action={index === 1 ? "" : undefined}
              className={`precedent-row ${selected === index ? "is-selected" : ""}`}
              onClick={() => setSelected(index)}
            >
              <strong data-label="Agreement">
                {row.label}
                <small>Executed version</small>
              </strong>
              <span data-label="Executed">{date}</span>
              <span data-label="Amendments">{amendment}</span>
              <span data-label="Status">{row.status}</span>
            </button>
          );
        })}
      </div>
      <blockquote>
        Selected executed version: {active?.label} · {executedDate}; drafts
        excluded.
      </blockquote>
    </div>
  );
}

export function NorthstarConsultationScheduler({
  scenario,
}: NorthstarWidgetProps) {
  const rows = scenario.artifact.rows;
  const firstSlot = rows[1]?.label ?? "Tue 2:30 PM";
  const slots = [firstSlot, rows[2]?.label ?? "Wed 11:00 AM", "Thu 4:00 PM"];
  const [slot, setSlot] = useState(firstSlot);
  const selectedRow = rows.find((row) => row.label === slot);
  const [assignedLawyer = "Eva Morales", jurisdiction = "Delaware"] = cells(
    rows[0]?.value ?? "Eva Morales | Delaware"
  );

  return (
    <div className="reviewed-partner" data-widget-state={slot}>
      {titleFor(scenario)}
      <div className="partner-intake">
        <span>
          <small>Inquiry</small>
          <strong>Halcyon consultation</strong>
        </span>
        <span>
          <small>Jurisdiction</small>
          <strong>{jurisdiction}</strong>
        </span>
        <span>
          <small>Conflict check</small>
          <strong className="is-clear">Clear</strong>
        </span>
      </div>
      <div className="partner-match">
        <img
          src={getPerson(personId(assignedLawyer)).avatar}
          alt={assignedLawyer}
        />
        <span>
          <strong>{assignedLawyer}</strong>
          <small>Assigned lawyer · availability matched</small>
        </span>
      </div>
      <div className="partner-slots">
        {slots.map((item, index) => (
          <button
            type="button"
            key={item}
            data-primary-action={index === 1 ? "" : undefined}
            className={slot === item ? "is-selected" : ""}
            aria-pressed={slot === item}
            onClick={() => setSlot(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p>
        Consultation{" "}
        {selectedRow?.status.toLocaleLowerCase("en-US") ?? "scheduled"} for{" "}
        {slot}.
      </p>
    </div>
  );
}

export function NorthstarTimeEntryMatrix({ scenario }: NorthstarWidgetProps) {
  const [selected, setSelected] = useState(0);
  const rows = scenario.artifact.rows;
  const active = rows[selected] ?? rows[0];
  const [matter = "Matter", missing = "0 missing"] = cells(active?.value ?? "");
  const count = missingCount(missing);

  return (
    <div className="reviewed-staffing" data-widget-state={selected}>
      {titleFor(scenario)}
      <div className="staffing-head">
        <span>Person</span>
        <span>Matter</span>
        <span>Missing</span>
        <span>Last reminder</span>
      </div>
      {rows.map((row, index) => {
        const [
          rowMatter = "Matter",
          rowMissing = "0 missing",
          rowReminder = "No reminder",
        ] = cells(row.value);
        const rowCount = missingCount(rowMissing);
        return (
          <button
            type="button"
            key={row.label}
            data-lawyer={row.label}
            data-primary-action={index === 2 ? "" : undefined}
            className={`reviewed-staffing-row ${selected === index ? "is-selected" : ""}`}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span data-label="Person">
              <img src={getPerson(personId(row.label)).avatar} alt="" />
              <strong>{row.label}</strong>
            </span>
            <span data-label="Matter">{rowMatter}</span>
            <span data-label="Missing">
              <i style={{ width: `${Math.max(20, 100 - rowCount * 20)}%` }} />
              {rowMissing}
            </span>
            <b data-label="Last reminder">{rowReminder}</b>
          </button>
        );
      })}
      <p>
        {active?.label} has {count} entries remaining for {matter}.{" "}
        {active?.status}.
      </p>
    </div>
  );
}

type InvoiceFilter = "Needs attention" | "Completed" | "All";

export function NorthstarDraftInvoiceReview({
  scenario,
}: NorthstarWidgetProps) {
  const [filter, setFilter] = useState<InvoiceFilter>("All");
  const filters: InvoiceFilter[] = ["Needs attention", "Completed", "All"];
  const visible = scenario.artifact.rows.filter(
    (row) => filter === "All" || row.status === filter
  );

  return (
    <div className="reviewed-invoice" data-widget-state={filter}>
      <header>
        <strong>{scenario.copy.conversationTitle}</strong>
        <span>
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              data-primary-action={item === "Needs attention" ? "" : undefined}
              className={filter === item ? "is-selected" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </span>
      </header>
      <div className="invoice-head">
        <b>Entry</b>
        <b>Finding</b>
        <b>Amount</b>
        <b>Status</b>
      </div>
      {visible.map((row: ArtifactRow) => {
        const [finding = "", amount = ""] = cells(row.value);
        return (
          <div data-testid="invoice-row" key={row.label}>
            <strong>{row.label}</strong>
            <span>{finding}</span>
            <span>{amount}</span>
            <em
              className={
                row.status === "Needs attention" ? "is-danger" : "is-complete"
              }
            >
              {row.status}
            </em>
          </div>
        );
      })}
      <p>{visible.length} entries shown</p>
    </div>
  );
}
