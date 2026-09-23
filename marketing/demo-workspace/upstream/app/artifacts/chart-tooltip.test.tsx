import { describe, expect, it } from 'vitest';
import { ArtifactTooltip, formatArtifactValue } from './chart-tooltip';

describe('artifact tooltip theme contract', () => {
  it('retains zero with the appropriate unit', () => {
    const item = { graphicalItemId: 'test-series' };
    expect(formatArtifactValue(0, 'temperature', item, 0, [])).toEqual(['0.0°C', 'Temperature']);
    expect(formatArtifactValue(0, 'activation', item, 0, [])).toEqual(['0%', 'Activation']);
    expect(formatArtifactValue(27, 'Optimized spend', item, 0, [])).toEqual(['$27k', 'Optimized spend']);
    expect(formatArtifactValue(40, 'Cumulative %', item, 0, [])).toEqual(['40%', 'Cumulative share']);
  });
  it('preserves supplied formatters and constrains the tooltip to the chart', () => {
    const formatter = () => ['$2.40 / mile', 'Actual'];
    const element = ArtifactTooltip({ formatter });
    expect(element.props.formatter(2.4, 'actual', { graphicalItemId: 'test' }, 0, [])[0]).toBe('$2.40 / mile');
    expect(element.props.filterNull).toBe(true);
    expect(element.props.allowEscapeViewBox).toEqual({ x: false, y: false });
    expect(element.props.contentStyle.whiteSpace).toBe('normal');
    expect(element.props.labelStyle.color).toBe('var(--artifact-tooltip-text)');
  });
});
