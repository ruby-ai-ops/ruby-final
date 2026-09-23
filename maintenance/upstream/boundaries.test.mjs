import assert from 'node:assert/strict';
import test from 'node:test';
import { assertRubyBoundaries } from './boundaries.mjs';

const entry = (value, mode = '100644') => {
  const bytes = Buffer.from(value);
  Object.defineProperty(bytes, 'gitMode', { value: mode });
  return bytes;
};
const source = new Map([
  ['marketing/page.tsx', entry('Ruby page')],
  ['front/lib/api/marketing/integrations.ts', entry('Ruby integration registry')],
  ['front-api/routes/marketing/integrations.ts', entry('Ruby public route')],
  ['front/styles/product-theme.css', entry('Ruby dark theme')],
  ['front-spa/src/app/main.tsx', entry('import "@ruby-ai/front/styles/product-theme.css";')],
  ['front-spa/src/admin/main.tsx', entry('import "@ruby-ai/front/styles/product-theme.css";')],
  ['front/lib/plans/pricing.ts', entry('export const CP_PRO_SEAT_COST_MONTHLY = 20;\nexport const CP_MAX_SEAT_COST_YEARLY = 32;')],
  ['front/lib/metronome/constants.ts', entry('export const FREE_SEAT_LIFETIME_AWU_CREDITS = 100;')],
  ['front/lib/metronome/alerts/default_alerts.ts', entry('seatLowPro: "default-low-seat-balance-100-awu",')],
]);

test('preserves Ruby marketing, theme, pricing and alert values', () => {
  assert.doesNotThrow(() => assertRubyBoundaries(source, new Map(source)));
  for (const [name, changed] of [
    ['marketing/page.tsx', 'upstream page'],
    ['front/lib/api/marketing/integrations.ts', 'upstream registry'],
    ['front-api/routes/marketing/integrations.ts', 'upstream public route'],
    ['front/styles/product-theme.css', 'upstream palette'],
    ['front-spa/src/app/main.tsx', 'missing theme import'],
    ['front/lib/plans/pricing.ts', 'export const CP_PRO_SEAT_COST_MONTHLY = 29;\nexport const CP_MAX_SEAT_COST_YEARLY = 32;'],
    ['front/lib/metronome/constants.ts', 'export const FREE_SEAT_LIFETIME_AWU_CREDITS = 19;'],
    ['front/lib/metronome/alerts/default_alerts.ts', 'seatLowPro: "default-low-seat-balance-1600-awu",'],
  ]) {
    assert.throws(() => assertRubyBoundaries(source, new Map([...source].map(([path, bytes]) =>
      [path, path === name ? entry(changed) : bytes]))), /Ruby boundary/);
  }
});

test('rejects marketing additions, deletes, and mode changes', () => {
  assert.throws(() => assertRubyBoundaries(source, new Map([...source, ['marketing/new.tsx', entry('new')]])), /Ruby boundary/);
  assert.throws(() => assertRubyBoundaries(source, new Map([...source].filter(([name]) => name !== 'marketing/page.tsx'))), /Ruby boundary/);
  assert.throws(() => assertRubyBoundaries(source, new Map([...source].map(([name, bytes]) =>
    [name, name === 'marketing/page.tsx' ? entry(bytes, '100755') : bytes]))), /Ruby boundary/);
});
