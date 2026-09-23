import assert from 'node:assert/strict';
import test from 'node:test';
import { transformText, transformPath, isExcluded, transformEntries, retiredServiceIdentifiers } from './rebrand.mjs';

test('encoded artwork and integrity hashes remain byte-for-byte unchanged', () => {
  const content = 'Dust data:image/png;base64,AAADustAAAdsBxAAAA== sha512-AAADUSTAAAA==';
  assert.equal(transformText(content), 'Ruby data:image/png;base64,AAADustAAAdsBxAAAA== sha512-AAADUSTAAAA==');
});

test('binary assets without NUL bytes are preserved', () => {
  const bytes=Buffer.from([0xff,0xfe,68,117,115,116]);
  assert.deepEqual(transformEntries(new Map([['asset.png',bytes]])).get('asset.png'),bytes);
});

test('upstream public service identities become empty Ruby configuration inputs', () => {
  for (const value of retiredServiceIdentifiers) assert.equal(transformText(`CONFIG="${value}"`),'CONFIG=""');
});

test('renames owned identifiers without corrupting industry words or third-party icons', () => {
  assert.equal(transformText('DustAPI DUST_KEY dustClient dsbx industry industrial industries Sparkles'),
    'RubyAPI RUBY_KEY rubyClient rbx industry industrial industries Sparkles');
});
test('resolves owned scopes, UI exports, and private repository references together', () => {
  assert.equal(transformText('@dust-tt/sparkle @dust/pod @dust-frame-runtime/motion https://github.com/dust-tt/dust'),
    '@ruby-ai/ui @ruby-ai/pod @ruby-ai/frame-runtime-motion https://github.com/ruby-ai-ops/ruby-final');
});
test('avoids merging the admin application into existing administration scripts', () => {
  assert.equal(transformPath('front/poke/temporal/index.ts'), 'front/admin-app/temporal/index.ts');
  assert.equal(transformText('path.join(baseDir, "poke/temporal")'), 'path.join(baseDir, "admin-app/temporal")');
  assert.equal(transformPath('cli/dust-sandbox/src/main.rs'), 'cli/ruby-sandbox/src/main.rs');
});
test('filters marketing and promotional documents but retains document processing fixtures', () => {
  assert.equal(isExcluded('marketing/pages/index.tsx'), true);
  assert.equal(isExcluded('marketing/assets/gated/guide.pdf'), true);
  assert.equal(isExcluded('core/tests/example.pdf'), false);
  assert.equal(isExcluded('LICENSE'), true);
  assert.equal(isExcluded('front/public/static/fonts/LICENSES.md'), false);
});
test('transform is repeatable, handles deletes through snapshots, and refuses collisions', () => {
  const original = new Map([['front/dust.ts', Buffer.from('DustAPI')]]);
  const once = transformEntries(original);
  assert.equal(once.get('front/ruby.ts').toString(), 'RubyAPI');
  assert.deepEqual(transformEntries(once), once);
  assert.throws(() => transformEntries(new Map([...original, ['front/ruby.ts', Buffer.from('different')]])), /collision/i);
});
