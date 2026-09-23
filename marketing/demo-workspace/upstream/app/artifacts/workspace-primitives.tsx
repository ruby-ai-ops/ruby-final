'use client';
/* oxlint-disable next/no-img-element -- all scenario photography is bundled locally. */
import { useState, type ReactNode } from 'react';
import type { DemoScenario } from '../demo-scenarios';
import './workspace-widgets.css';

export type WidgetProps = {
  scenario: DemoScenario;
  platform: 'ruby' | 'slack' | 'teams';
};
export const usd = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
export function WidgetHeader({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children?: ReactNode;
}) {
  return (
    <header className="rw-heading">
      <span>
        <small>{eyebrow}</small>
        <h3>{title}</h3>
      </span>
      {children}
    </header>
  );
}
export function Metric({
  label,
  value,
  note,
  id,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  id?: string;
}) {
  return (
    <div className="rw-metric">
      <span>{label}</span>
      <strong data-testid={id}>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'risk' | 'info';
}) {
  return <span className={`rw-badge ${tone}`}>{children}</span>;
}
export function Pick({
  children,
  selected,
  onClick,
  primary = false,
  label,
  disabled = false,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
  primary?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rw-pick ${selected ? 'selected' : ''}`}
      aria-pressed={selected}
      aria-label={label}
      disabled={disabled}
      data-primary-action={primary ? '' : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export function Photo({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`rw-photo ${className}`}>
      {failed ? (
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='3' height='2' viewBox='0 0 3 2'%3E%3C/svg%3E"
          alt={alt}
          width="960"
          height="640"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          width="960"
          height="640"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </figure>
  );
}
export function Fact({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="rw-fact">
      <small>{label}</small>
      <strong>{children}</strong>
    </span>
  );
}
export function Source({ children }: { children: ReactNode }) {
  return <p className="rw-source">{children}</p>;
}
