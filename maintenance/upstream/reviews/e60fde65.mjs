// Reviewed resolution for the upstream range ending at e60fde65. The daily
// sync does not load this file and continues to stop on every conflict.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createSyncCandidate } from '../sync.mjs';

const target = 'e60fde655d6251684a8150e4300460789e63f138';
const assertionFile = 'front/tests/conversational-building-evals/lib/assertions.ts';

const result = createSyncCandidate(process.cwd(), target, {
  resolveConflicts(conflicts, temporary) {
    assert.deepEqual(conflicts, [assertionFile]);

    const staged = (side) => execFileSync('git', ['show', `:${side}:${assertionFile}`], {
      cwd: temporary,
      encoding: 'utf8',
    });
    const ruby = staged(2);
    const incoming = staged(3);

    // Ruby added this assertion in the previous sync. Upstream independently
    // added the same check and factored its agent-id lookup into a helper.
    assert.match(ruby, /if \(assertion\.type === "suggestAgentInstructionsChange"\) \{/);
    assert.match(ruby, /mentionedIds\(responseText, BUILD_AGENT_REGEX\)/);
    assert.match(incoming, /if \(assertion\.type === "suggestAgentInstructionsChange"\) \{/);
    assert.match(incoming, /resolveAgentId\(scenario, assertion\.agentKey\)/);
    assert.match(incoming, /mentionedIds\(responseText, BUILD_AGENT_REGEX\)/);

    fs.writeFileSync(path.join(temporary, assertionFile), incoming);
    execFileSync('git', ['add', '--', assertionFile], { cwd: temporary });
  },
});

process.stdout.write(JSON.stringify(result) + '\n');
