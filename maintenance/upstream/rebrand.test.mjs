import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { transformText, transformPath, isExcluded, transformEntries, retiredServiceIdentifiers, rebrand } from './rebrand.mjs';

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
  assert.equal(isExcluded('front/lib/api/marketing/integrations.ts'), true);
  assert.equal(isExcluded('front-api/routes/marketing/integrations.ts'), true);
  assert.equal(isExcluded('front/public/static/landing/ebook/cover.svg'), true);
  assert.equal(isExcluded('front/public/static/guides/intro.pdf'), true);
  assert.equal(isExcluded('front/public/static/downloads/guide.epub'), true);
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

test('applying branding leaves all marketing bytes untouched', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ruby-brand-boundary-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  execFileSync('git', ['init', '-q'], { cwd: root });
  fs.mkdirSync(path.join(root, 'marketing'), { recursive: true });
  fs.mkdirSync(path.join(root, 'front/lib/api/marketing'), { recursive: true });
  fs.mkdirSync(path.join(root, 'front-api/routes/marketing'), { recursive: true });
  fs.writeFileSync(path.join(root, 'marketing', 'page.tsx'), 'Dust marketing reference');
  fs.writeFileSync(path.join(root, 'front/lib/api/marketing/integrations.ts'), 'Dust public catalog');
  fs.writeFileSync(path.join(root, 'front-api/routes/marketing/integrations.ts'), 'Dust public route');
  fs.writeFileSync(path.join(root, 'app.ts'), 'Dust application reference');
  execFileSync('git', ['add', '.'], { cwd: root });
  assert.equal(rebrand(root), 1);
  assert.equal(fs.readFileSync(path.join(root, 'marketing', 'page.tsx'), 'utf8'), 'Dust marketing reference');
  assert.equal(fs.readFileSync(path.join(root, 'front/lib/api/marketing/integrations.ts'), 'utf8'), 'Dust public catalog');
  assert.equal(fs.readFileSync(path.join(root, 'front-api/routes/marketing/integrations.ts'), 'utf8'), 'Dust public route');
  assert.equal(fs.readFileSync(path.join(root, 'app.ts'), 'utf8'), 'Ruby application reference');
});
