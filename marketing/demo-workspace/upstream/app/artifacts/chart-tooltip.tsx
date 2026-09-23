'use client';

import { Tooltip as RechartsTooltip, type TooltipProps } from 'recharts';

type Props = TooltipProps<number | string | ReadonlyArray<number | string>, number | string>;

export const formatArtifactValue: NonNullable<Props['formatter']> = (value, name) => {
  switch (name) {
    case 'temperature': return [`${Number(value).toFixed(1)}°C`, 'Temperature'];
    case 'activation': return [`${String(value)}%`, 'Activation'];
    case 'baseline': return [`${String(value)}%`, 'US baseline'];
    case 'Cumulative %': return [`${String(value)}%`, 'Cumulative share'];
    case 'Current spend': case 'Optimized spend': return [`$${String(value)}k`, name];
    case 'value': return [value, 'Value'];
    default: return [value, name];
  }
};

/** Recharts retains its native mouse, touch and keyboard interaction and edge positioning. */
export function ArtifactTooltip(props: Props) {
  return <RechartsTooltip
    {...props}
    filterNull
    isAnimationActive={false}
    allowEscapeViewBox={{ x: false, y: false }}
    formatter={(value, name, item, index, payload) => {
      const formatted = (props.formatter ?? formatArtifactValue)(value, name, item, index, payload);
      const displayValue = Array.isArray(formatted) ? formatted[0] : formatted;
      const displayName = Array.isArray(formatted) ? formatted[1] ?? name : name;
      return [displayValue, displayName];
    }}
    wrapperStyle={{ zIndex: 20, maxWidth: '100%', pointerEvents: 'none' }}
    contentStyle={{ background: 'var(--artifact-tooltip-bg)', color: 'var(--artifact-tooltip-text)', border: '1px solid var(--artifact-tooltip-border)', borderRadius: 8, padding: '10px 12px', fontSize: 12, lineHeight: 1.5, maxWidth: '100%', whiteSpace: 'normal', overflowWrap: 'anywhere', boxShadow: '0 4px 16px rgb(0 0 0 / 18%)' }}
    labelStyle={{ color: 'var(--artifact-tooltip-text)', fontWeight: 700, marginBottom: 4 }}
    itemStyle={{ color: 'var(--artifact-tooltip-text)', padding: '2px 0' }}
  />;
}
