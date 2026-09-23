const preservedDeclarations = new Map([
  ['front/lib/plans/pricing.ts', [
    'CP_ENTERPRISE_BASIS',
    'CP_ENTERPRISE_PRO_SEAT_COST_YEARLY_DOLLARS',
    'CP_ENTERPRISE_MAX_SEAT_COST_YEARLY_DOLLARS',
    'CP_PRO_SEAT_COST_MONTHLY', 'CP_PRO_SEAT_COST_YEARLY',
    'CP_MAX_SEAT_COST_MONTHLY', 'CP_MAX_SEAT_COST_YEARLY',
  ]],
  ['front/lib/metronome/constants.ts', [
    'FREE_SEAT_LIFETIME_AWU_CREDITS',
    'PRO_SEAT_MONTHLY_AWU_CREDITS',
    'MAX_SEAT_MONTHLY_AWU_CREDITS',
    'NEAR_LIMIT_FRACTION',
  ]],
]);
const preservedAlertSlots = ['seatLowPro', 'seatLowMax'];
const preservedFiles = [
  'front/styles/product-theme.css',
  'front/public/static/fonts/Sohne-Regular.ttf',
  'front/public/static/fonts/RubySerif.ttf',
];
const preservedMarkers = new Map([
  ['front-spa/src/app/main.tsx', ['import "@ruby-ai/front/styles/product-theme.css";']],
  ['front-spa/src/admin/main.tsx', ['import "@ruby-ai/front/styles/product-theme.css";']],
  ['front/scripts/metronome_setup.ts', [
    'default-low-seat-balance-8000-awu',
    'default-low-seat-balance-1600-awu',
    'await archiveReplacedDefaultAlerts();',
  ]],
]);

function equalEntry(before, after) {
  return !!before && !!after && before.equals(after) && before.gitMode === after.gitMode;
}

function assignment(bytes, name) {
  const expression = new RegExp(`\\b${name}\\s*[:=]\\s*([^,;\\n]+)`);
  return bytes?.toString('utf8').match(expression)?.[1]?.trim();
}

/** Protects Ruby-owned product values while permitting unrelated upstream edits. */
export function assertRubyBoundaries(ruby, candidate) {
  for (const name of new Set([...ruby.keys(), ...candidate.keys()])) {
    if (name.startsWith('marketing/') && !equalEntry(ruby.get(name), candidate.get(name))) {
      throw new Error(`Ruby boundary changed: ${name}`);
    }
  }
  for (const name of preservedFiles) {
    if (ruby.has(name) && !equalEntry(ruby.get(name), candidate.get(name))) {
      throw new Error(`Ruby boundary changed: ${name}`);
    }
  }
  for (const [name, markers] of preservedMarkers) {
    if (!ruby.has(name)) continue;
    const text = candidate.get(name)?.toString('utf8') ?? '';
    for (const marker of markers) {
      if (!text.includes(marker)) throw new Error(`Ruby boundary changed: ${name} ${marker}`);
    }
  }
  for (const [name, declarations] of preservedDeclarations) {
    if (!ruby.has(name)) continue;
    for (const declaration of declarations) {
      const before = assignment(ruby.get(name), declaration);
      const after = assignment(candidate.get(name), declaration);
      if (before !== undefined && before !== after) {
        throw new Error(`Ruby boundary changed: ${name} ${declaration}`);
      }
    }
  }
  const alertFile = 'front/lib/metronome/alerts/default_alerts.ts';
  if (ruby.has(alertFile)) {
    for (const slot of preservedAlertSlots) {
      const before = assignment(ruby.get(alertFile), slot);
      const after = assignment(candidate.get(alertFile), slot);
      if (before !== undefined && before !== after) {
        throw new Error(`Ruby boundary changed: ${alertFile} ${slot}`);
      }
    }
  }
}
