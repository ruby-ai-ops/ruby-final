// Reviewed resolution for the upstream range ending at 624dc47. Daily sync
// does not load this file and continues to stop on every conflict.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createSyncCandidate } from '../sync.mjs';

const target = '624dc47cfee42601222ff978e4cd6677ffeb32f5';
const registry = 'front/lib/api/sandbox/image/registry.test.ts';

const staged = (root, side) => execFileSync('git', ['show', `:${side}:${registry}`], {
  cwd: root,
  encoding: 'utf8',
});

const result = createSyncCandidate(process.cwd(), target, {
  resolveConflicts(conflicts, temporary) {
    assert.deepEqual(conflicts, [registry]);
    const upstream = staged(temporary, 3);
    assert.match(upstream, /tag: "0\.8\.120"/);
    assert.match(upstream, /rbx-v0\.1\.65\/rbx-linux-x86_64/);

    // Ruby builds rbx from source, so its test must keep asserting that path.
    // Import the upstream base-image tag bump without its release download test.
    const ruby = staged(temporary, 2);
    const before = 'tag: "0.8.119"';
    assert.equal(ruby.split(before).length, 2);
    assert.match(ruby, /installs the built rbx CLI/);
    const resolved = ruby.replace(before, 'tag: "0.8.120"');
    fs.writeFileSync(path.join(temporary, registry), resolved);
    execFileSync('git', ['add', '--', registry], { cwd: temporary });
  },
});

process.stdout.write(JSON.stringify(result) + '\n');
