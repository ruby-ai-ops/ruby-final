import { useState, type KeyboardEvent } from "react";
import cheeseConcept from "./herb-cheese-concept.png";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { DemoScenario } from "../../upstream/app/demo-scenarios";
import {
  ArtifactMediaCard,
  type ArtifactMedia,
} from "../../upstream/app/artifacts/media-card";
import { ArtifactTooltip as Tooltip } from "../../upstream/app/artifacts/chart-tooltip";

export interface MeadowWidgetProps {
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

export function MeadowProductionOrderCalculator({
  scenario,
}: MeadowWidgetProps) {
  const [caseIndex, setCaseIndex] = useState(1);
  const cases = [
    {
      label: "Confirmed orders",
      quantity: "6,000 cups",
      detail: "Comparison only",
    },
    {
      label: "Expected demand",
      quantity: "8,000 cups",
      detail: "MO-6201 created",
    },
    {
      label: "Higher demand",
      quantity: "10,000 cups",
      detail: "1,000 cups above capacity",
    },
  ];
  const active = cases[caseIndex];

  return (
    <div className="bespoke-calculator-widget" data-widget-state={caseIndex}>
      <header>
        <strong>{scenario.copy.conversationTitle}</strong>
        <span>{active.label}</span>
      </header>
      <div className="calculator-result">
        <small>PRODUCTION ORDER</small>
        <strong>{active.quantity}</strong>
        <span>{active.detail}</span>
      </div>
      <div className="calculator-options">
        {cases.map((item, index) => (
          <button
            key={item.label}
            type="button"
            data-primary-action={index === 2 ? "" : undefined}
            aria-pressed={caseIndex === index}
            className={caseIndex === index ? "is-selected" : ""}
            onClick={() => setCaseIndex(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const transportTemperatures = [
  [3.1, 3.4, 3.5, 3.4, 3.3, 3.2],
  [3.0, 3.2, 3.3, 3.4, 3.2, 3.1],
  [2.9, 3.1, 3.2, 3.3, 3.1, 3.0],
];

export function MeadowColdChainTransportExplorer({
  scenario,
}: MeadowWidgetProps) {
  const [delivery, setDelivery] = useState(0);
  const rows = scenario.artifact.rows;
  const active = rows[delivery] ?? rows[0];
  const [
    destination = "Destination",
    collection = "Collection pending",
    carrier = "Carrier pending",
  ] = cells(active?.value ?? "");
  const readings = (
    transportTemperatures[delivery] ?? transportTemperatures[0]
  ).map((temperature, index) => ({ time: `${8 + index}:00`, temperature }));

  return (
    <div className="reviewed-cold-chain" data-widget-state={delivery}>
      {titleFor(scenario)}
      <div className="cold-chain-tabs">
        {rows.map((row, index) => {
          const [rowDestination = "Destination"] = cells(row.value);
          return (
            <button
              type="button"
              key={row.label}
              data-primary-action={index === 1 ? "" : undefined}
              aria-pressed={delivery === index}
              className={delivery === index ? "is-selected" : ""}
              onClick={() => setDelivery(index)}
            >
              <strong>{row.label}</strong>
              <small>{rowDestination}</small>
            </button>
          );
        })}
      </div>
      <div className="cold-chain-grid">
        <iframe
          title="Refrigerated collection route"
          src={`https://www.google.com/maps?q=${encodeURIComponent(destination)}&z=8&output=embed`}
        />
        <div>
          <ResponsiveContainer
            width="100%"
            height="100%"
            initialDimension={{ width: 360, height: 180 }}
          >
            <LineChart
              data={readings}
              margin={{ top: 12, right: 12, left: -22, bottom: 0 }}
            >
              <CartesianGrid vertical={false} opacity={0.12} />
              <XAxis dataKey="time" tickLine={false} fontSize={8} />
              <YAxis tickLine={false} fontSize={8} unit="°" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="var(--artifact-accent)"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p>
        <span>{active?.status}</span>
        <span>{collection}</span>
        <span>{carrier}</span>
      </p>
    </div>
  );
}

const packingMedia: ArtifactMedia[] = [
  {
    src: "/static/workspace-demo/demo-dairy/whole-milk.webp",
    alt: "Whole milk cases prepared for store deliveries",
    title: "Whole milk",
    metadata: ["60 cases", "Reserved stock"],
    tone: "success",
  },
  {
    src: "/static/workspace-demo/demo-dairy/chocolate-milk.webp",
    alt: "Chocolate milk cases prepared for store deliveries",
    title: "Chocolate milk",
    metadata: ["30 cases", "Reserved stock"],
    tone: "success",
  },
];

export function MeadowPackingListFlow({ scenario }: MeadowWidgetProps) {
  const [step, setStep] = useState(0);
  const rows = scenario.artifact.rows;
  const active = rows[step] ?? rows[0];

  return (
    <div className="reviewed-lineage" data-widget-state={step}>
      {titleFor(scenario)}
      <div className="lineage-flow">
        {rows.map((row, index) => (
          <button
            type="button"
            key={row.label}
            data-primary-action={index === 2 ? "" : undefined}
            aria-pressed={step === index}
            className={step === index ? "is-selected" : ""}
            onClick={() => setStep(index)}
          >
            <i>{index + 1}</i>
            <span>
              <small>{row.label}</small>
              <strong>{row.value}</strong>
            </span>
            {index < rows.length - 1 && <b>→</b>}
          </button>
        ))}
      </div>
      <div className="lineage-products">
        {packingMedia.map((media) => (
          <ArtifactMediaCard media={media} key={media.title} />
        ))}
      </div>
      <div className="lineage-detail">
        <strong>{active?.label}</strong>
        <span>{active?.value}</span>
        <small>{active?.status}</small>
      </div>
    </div>
  );
}

export function MeadowWorkloadTimeline({ scenario }: MeadowWidgetProps) {
  const [step, setStep] = useState(0);
  const rows = scenario.artifact.rows;
  const active = rows[step] ?? rows[0];

  return (
    <div className="bespoke-timeline-widget" data-widget-state={step}>
      <header>
        <strong>{scenario.copy.conversationTitle}</strong>
        <span>3 tasks moved</span>
      </header>
      <div className="bespoke-timeline-steps">
        {rows.map((row, index) => (
          <button
            key={row.label}
            type="button"
            data-primary-action={index === 1 ? "" : undefined}
            aria-pressed={step === index}
            className={step === index ? "is-selected" : ""}
            onClick={() => setStep(index)}
          >
            <i>{index + 1}</i>
            <span>
              <strong>{row.label}</strong>
              <small>{row.value}</small>
            </span>
          </button>
        ))}
      </div>
      <p>
        <strong>{active?.status}</strong> {active?.value}
      </p>
    </div>
  );
}

function slideSources(index: number) {
  const sources = [
    ["Approved recipe notes", "Packaging concept"],
    ["Previous approved trial", "Recipe comparison"],
    ["Batch CH-041 record", "Measured yield sheet"],
    ["Seven-person tasting notes", "Feedback summary"],
    ["Current cost sheet", "Ingredient price assumptions"],
    ["Product meeting brief", "Proposed trial schedule"],
  ];
  return sources[index] ?? sources[0];
}

function moveSlideFromKey(
  event: KeyboardEvent<HTMLButtonElement>,
  current: number,
  count: number,
  setSlide: (index: number) => void
) {
  let next = current;
  switch (event.key) {
    case "ArrowRight":
      next = Math.min(count - 1, current + 1);
      break;
    case "ArrowLeft":
      next = Math.max(0, current - 1);
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = count - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  setSlide(next);
}

export function MeadowCheeseRecipePresentation({
  scenario,
}: MeadowWidgetProps) {
  const [slide, setSlide] = useState(0);
  const [notice, setNotice] = useState("");
  const rows = scenario.artifact.rows;
  const active = rows[slide] ?? rows[0];
  const sources = slideSources(slide);

  return (
    <div className="meadow-cheese-presentation" data-widget-state={slide}>
      <header className="meadow-cheese-presentation-header">
        <span>
          <strong>{scenario.copy.conversationTitle}</strong>
          <small>Created in Gamma</small>
        </span>
        <b>
          {slide + 1} / {rows.length}
        </b>
      </header>
      <article
        className={`meadow-cheese-slide is-slide-${slide}`}
        aria-label={`Slide ${slide + 1}: ${active?.label}`}
      >
        <div className="meadow-cheese-slide-copy">
          <span className="meadow-cheese-slide-kicker">
            {String(slide + 1).padStart(2, "0")} · {active?.status}
          </span>
          <h3>{active?.label}</h3>
          <p>{active?.value}</p>
          <div className="meadow-cheese-slide-detail">
            {slide === 0 && (
              <>
                <span>MEADOW DAIRY CO.</span>
                <strong>A fresh take on the deli counter.</strong>
              </>
            )}
            {slide === 1 && (
              <>
                <span>RECIPE DEVELOPMENT</span>
                <strong>Fresh herbs</strong>
                <span>Refined blend · Less salt</span>
              </>
            )}
            {slide === 2 && (
              <>
                <span>TRIAL BATCH</span>
                <strong>CH-041</strong>
                <span>Yield recorded · Texture reviewed</span>
              </>
            )}
            {slide === 3 && (
              <>
                <span>TASTING PANEL</span>
                <strong>7 tasters</strong>
                <span>Milder herb finish preferred</span>
              </>
            )}
            {slide === 4 && (
              <>
                <span>ESTIMATED UNIT COST</span>
                <strong>
                  $1.84 <small>/ 200g</small>
                </strong>
                <span>Based on current cost-sheet assumptions</span>
              </>
            )}
            {slide === 5 && (
              <>
                <span>PROPOSED · SEPTEMBER 12</span>
                <strong>Test a firmer texture</strong>
                <span>Owner · Sofia Alvarez</span>
              </>
            )}
          </div>
        </div>
        <figure className="meadow-cheese-slide-photo">
          <img
            src={cheeseConcept}
            alt="Herb cheese with fresh dill and chives on a ceramic plate, conceptual product imagery"
          />
          <figcaption>AI-generated product concept</figcaption>
        </figure>
      </article>
      <div className="meadow-cheese-controls">
        <button
          type="button"
          aria-label="Previous slide"
          disabled={slide === 0}
          onClick={() => setSlide(Math.max(0, slide - 1))}
        >
          ←
        </button>
        <nav aria-label="Presentation slides">
          {rows.map((row, index) => (
            <button
              type="button"
              key={row.label}
              aria-label={`Slide ${index + 1}: ${row.label}`}
              aria-current={slide === index ? "true" : undefined}
              className={slide === index ? "is-selected" : ""}
              onClick={() => setSlide(index)}
              onKeyDown={(event) =>
                moveSlideFromKey(event, index, rows.length, setSlide)
              }
            >
              <img src={cheeseConcept} alt="" />
              <span>
                {String(index + 1).padStart(2, "0")} · {row.label}
              </span>
            </button>
          ))}
        </nav>
        <button
          type="button"
          aria-label="Next slide"
          disabled={slide === rows.length - 1}
          onClick={() => setSlide(Math.min(rows.length - 1, slide + 1))}
        >
          →
        </button>
      </div>
      <details className="meadow-cheese-sources">
        <summary>Sources for this slide</summary>
        <ul>
          {sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </details>
      <footer className="meadow-cheese-actions">
        <button
          type="button"
          onClick={() => setNotice("Presentation preview opened in this chat.")}
        >
          Open presentation
        </button>
        <button
          type="button"
          onClick={() =>
            setNotice("PDF export is available from the shared Drive card.")
          }
        >
          Download PDF
        </button>
      </footer>
      <p className="meadow-cheese-notice" aria-live="polite">
        {notice}
      </p>
    </div>
  );
}

function dollars(value: string) {
  return Number(value.replace(/[$,]/gu, ""));
}

export function MeadowSupplierQuoteComparison({ scenario }: MeadowWidgetProps) {
  const [supplier, setSupplier] = useState(0);
  const rows = scenario.artifact.rows;
  const active = rows[supplier] ?? rows[0];
  const [productCostLabel = "$0", deliveryLabel = "$0", totalLabel = "$0"] =
    cells(active?.value ?? "");
  const chartData = [
    { name: "Product cost", value: dollars(productCostLabel) },
    { name: "Delivery", value: dollars(deliveryLabel) },
    { name: "Order total", value: dollars(totalLabel) },
  ];

  return (
    <div className="reviewed-energy" data-widget-state={supplier}>
      {titleFor(scenario)}
      <div className="energy-summary">
        <span>
          <small>Product cost</small>
          <strong>{productCostLabel}</strong>
        </span>
        <span>
          <small>Delivery</small>
          <strong>{deliveryLabel}</strong>
        </span>
        <span>
          <small>Total</small>
          <strong>{totalLabel}</strong>
        </span>
        <div>
          {rows.map((row, index) => (
            <button
              type="button"
              key={row.label}
              data-primary-action={index === 1 ? "" : undefined}
              aria-pressed={supplier === index}
              className={supplier === index ? "is-selected" : ""}
              onClick={() => setSupplier(index)}
            >
              {row.label}
            </button>
          ))}
        </div>
      </div>
      <div className="reviewed-chart-canvas">
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 640, height: 220 }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 18, left: 72, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} opacity={0.12} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              fontSize={8}
              tickFormatter={(value) =>
                `$${Number(value).toLocaleString("en-US")}`
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={70}
              fontSize={8}
            />
            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString("en-US")}`,
                "Amount",
              ]}
            />
            <Bar
              dataKey="value"
              name="Quote amount"
              fill="var(--artifact-accent)"
              radius={3}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p>
        <strong>{active?.status}</strong>
        <span>
          {active?.label} total: {totalLabel}
        </span>
        <span>
          {active?.status === "PO-645 placed"
            ? "Supplier order notice sent."
            : "Comparison only; no order created."}
        </span>
      </p>
    </div>
  );
}
