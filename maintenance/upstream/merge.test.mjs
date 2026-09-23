import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { mergeSnapshots } from './merge.mjs';

const snapshot = (object) => new Map(Object.entries(object).map(([name, text]) => [name, Buffer.from(text)]));
function merge(base, ruby, incoming) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ruby-merge-test-'));
  try { return mergeSnapshots(root, snapshot(base), snapshot(ruby), snapshot(incoming)); }
  finally { fs.rmSync(root, { recursive: true, force: true }); }
}
test('upstream edits merge while Ruby marketing and unrelated customization survive', () => {
  const result = merge({'app.ts': 'old\n'}, {'app.ts':'old\n', 'marketing/index.ts':'Ruby page\n', 'own.ts':'custom\n'}, {'app.ts':'new\n'});
  assert.equal(result.get('app.ts').toString(), 'new\n');
  assert.equal(result.get('marketing/index.ts').toString(), 'Ruby page\n');
  assert.equal(result.get('own.ts').toString(), 'custom\n');
});
test('conflicting edits fail without returning a candidate', () => {
  assert.throws(() => merge({'app.ts':'base\n'}, {'app.ts':'Ruby edit\n'}, {'app.ts':'upstream edit\n'}), /conflict/i);
});
test('upstream deletion and rename remove old paths', () => {
  const result = merge({'old.ts':'same\n', 'deleted.ts':'bye\n'}, {'old.ts':'same\n', 'deleted.ts':'bye\n'}, {'new.ts':'same\n'});
  assert.equal(result.has('old.ts'), false);
  assert.equal(result.has('deleted.ts'), false);
  assert.equal(result.get('new.ts').toString(), 'same\n');
});
test('excluded-only or repeated snapshots preserve Ruby content', () => {
  const ruby = {'app.ts':'custom\n', 'marketing/index.ts':'Ruby\n'};
  const result = merge({'app.ts':'base\n'}, ruby, {'app.ts':'base\n'});
  assert.deepEqual(result, snapshot(ruby));
});

test('file and directory replacements merge without false conflicts', () => {
  for (const [before, after] of [[{'entry/value':'old\n'}, {'entry':'new\n'}], [{'entry':'old\n'}, {'entry/value':'new\n'}]]) {
    assert.deepEqual(merge(before, before, after), snapshot(after));
  }
});
