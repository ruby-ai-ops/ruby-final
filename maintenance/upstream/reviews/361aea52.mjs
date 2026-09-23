// Reviewed resolution for the upstream range ending at 361aea52. The daily
// sync never loads this file and continues to stop on every conflict.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createSyncCandidate } from '../sync.mjs';

const target = '361aea52f1dd726a92c9c4dc5f330b11b26aca5a';
const registry = 'front/lib/api/sandbox/image/registry.test.ts';
const lockfile = 'package-lock.json';
const expectedConflicts = [registry, lockfile];

function stagedRubyFile(root, name) {
  return execFileSync('git', ['show', `:2:${name}`], {
    cwd: root,
    maxBuffer: 64 * 1024 * 1024,
  });
}

function replaceOnce(content, before, after) {
  assert.equal(content.split(before).length, 2, `Expected exactly one ${before}`);
  return content.replace(before, after);
}

const result = createSyncCandidate(process.cwd(), target, {
  resolveConflicts(conflicts, temporary) {
    assert.deepEqual(conflicts.sort(), expectedConflicts.sort());

    // Keep Ruby's source-built rbx assertion; take upstream's image and pod
    // version bumps. The upstream release-download assertion is inapplicable.
    let test = stagedRubyFile(temporary, registry).toString('utf8');
    test = replaceOnce(test, 'tag: "0.8.118"', 'tag: "0.8.119"');
    test = replaceOnce(test, 'name: "@ruby-ai/pod", version: "0.5.0"', 'name: "@ruby-ai/pod", version: "0.6.0"');
    fs.writeFileSync(path.join(temporary, registry), test);

    // Preserve Ruby workspace names and marketing entries. Regenerate this
    // lockfile from the merged package manifests in the candidate checkout.
    fs.writeFileSync(path.join(temporary, lockfile), stagedRubyFile(temporary, lockfile));
    execFileSync('git', ['add', '--', registry, lockfile], { cwd: temporary });
  },
});

process.stdout.write(JSON.stringify(result) + '\n');
