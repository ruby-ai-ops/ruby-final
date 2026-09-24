// Reviewed catch-up through ca068e42. The upstream deploy workflow only
// consolidates its Slack failure notification steps; Ruby excludes all
// upstream workflows. Daily automation still stops on any workflow change.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createSyncCandidate } from '../sync.mjs';

const target = 'ca068e42baca4efb9c8acab3a8112547cd5552e3';
const reviewedWorkflowChanges = new Map([
  ['.github/workflows/deploy.yml', {
    before: '100644:ff73d39e3f89b46a732564e3ee2a117d4e22fa3c651643f61922ed9495422fdc',
    after: '100644:f96266f9a1bac1663c37663b59d049c55b323bbfc8b813871900fd443704a492',
  }],
]);
const registry = 'front/lib/api/sandbox/image/registry.test.ts';
const staged = (root, side) => execFileSync('git', ['show', `:${side}:${registry}`], {
  cwd: root,
  encoding: 'utf8',
});

const result = createSyncCandidate(process.cwd(), target, {
  reviewedWorkflowChanges,
  resolveConflicts(conflicts, temporary) {
    assert.deepEqual(conflicts, [registry]);
    const incoming = staged(temporary, 3);
    assert.match(incoming, /tag: "0\.8\.121"/);
    assert.match(incoming, /rbx-v0\.1\.66\/rbx-linux-x86_64/);

    // Ruby builds rbx from source, so only the image tag bump applies.
    const ruby = staged(temporary, 2);
    const before = 'tag: "0.8.120"';
    assert.equal(ruby.split(before).length, 2);
    assert.match(ruby, /installs the built rbx CLI/);
    fs.writeFileSync(path.join(temporary, registry), ruby.replace(before, 'tag: "0.8.121"'));
    execFileSync('git', ['add', '--', registry], { cwd: temporary });
  },
});
process.stdout.write(JSON.stringify(result) + '\n');
