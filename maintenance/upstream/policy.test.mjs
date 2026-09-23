import assert from 'node:assert/strict';
import test from 'node:test';
import { assertSafeUpdate, assertBranded, transformSnapshot } from './policy.mjs';
const snapshot = object => new Map(Object.entries(object).map(([k,v]) => [k, Buffer.from(v)]));

test('mixed changes retain app changes and exclude marketing and protected artwork', () => {
  const result = transformSnapshot(snapshot({'front/dust.ts':'DustAPI', 'marketing/home.ts':'old campaign', 'front/lib/api/marketing/integrations.ts':'old registry', 'front-api/routes/marketing/index.ts':'old public route', 'sparkle/src/logo/a.svg':'old art', 'sparkle/src/components/Sheet.tsx':'upstream sheet'}));
  assert.deepEqual([...result.keys()], ['front/ruby.ts']);
  assert.equal(result.get('front/ruby.ts').toString(), 'RubyAPI');
});
test('unknown capitalization fails branding validation instead of being accepted', () => {
  assert.throws(() => assertBranded(transformSnapshot(snapshot({'app.ts':'dUsT product'}))), /Unmapped/);
  assert.doesNotThrow(() => assertBranded(snapshot({'maintenance/upstream/state.json':'dust-tt'})));
});
test('changed workflow policy requires review even if it would otherwise be excluded', () => {
  assert.throws(() => assertSafeUpdate(snapshot({'.github/workflows/a.yml':'safe'}), snapshot({'.github/workflows/a.yml':'unsafe'})), /manual review/);
});
test('new artwork cannot bypass branding checks by using a generic filename', () => {
  assert.throws(()=>assertSafeUpdate(new Map(),snapshot({'front/public/banner.png':'pixels'})),/branding review/);
  assert.doesNotThrow(()=>assertSafeUpdate(new Map(),snapshot({'marketing/banner.png':'pixels'})));
});

test('other visual formats and unclassified binaries require review', () => {
  for (const name of ['hero.avif','hero.webm','guide.pdf','unknown.data']) {
    assert.throws(()=>assertSafeUpdate(new Map(),snapshot({[`front/public/${name}`]:'\0pixels'})),/branding review/);
  }
});
