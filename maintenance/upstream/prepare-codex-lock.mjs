import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = '.artifacts/codex-source/codex-rs';
const lock = `${root}/Cargo.lock`;
const before = fs.readFileSync(lock,'utf8');
const externalPackages = text => text.split('[[package]]').filter(block => /^source = /m.test(block)).map(block=>block.trim()).sort();
// The release tag updates workspace versions but leaves them at 0.0.0 in its lockfile.
// Regenerate those entries through Cargo, then reject any third-party dependency change.
execFileSync('cargo',['update','--workspace'],{cwd:root,stdio:'inherit'});
const after = fs.readFileSync(lock,'utf8');
if (JSON.stringify(externalPackages(before)) !== JSON.stringify(externalPackages(after))) {
  throw new Error('Sandbox source lock regeneration changed third-party packages; review required');
}
const sha256 = value => createHash('sha256').update(value).digest('hex');
fs.writeFileSync('.artifacts/codex-source/ruby-lock-provenance.json',JSON.stringify({
  sourceCommit:'f028679abb30051cec2434e624cd99975986b41b',
  adaptation:'Cargo workspace version entries regenerated; all third-party package blocks unchanged',
  sourceLockSha256:sha256(before), buildLockSha256:sha256(after)
},null,2)+'\n');
