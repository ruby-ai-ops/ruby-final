import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { readSnapshot } from './snapshot.mjs';

const git = (root, args, extra = {}) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024, ...extra }).trim();

function writeSnapshot(root, entries) {
  const tracked = git(root, ['ls-files', '-z']).split('\0').filter(Boolean);
  for (const name of tracked) fs.rmSync(path.join(root, name), { force: true });
  // Git does not track directories; remove empty parents before file/directory transitions.
  const parents = new Set();
  for (const name of tracked) {
    for (let dir = path.dirname(name); dir !== '.'; dir = path.dirname(dir)) parents.add(dir);
  }
  for (const dir of [...parents].sort((a,b) => b.length - a.length)) {
    try { fs.rmdirSync(path.join(root, dir)); }
    catch (error) { if (!['ENOENT','ENOTEMPTY','EEXIST'].includes(error.code)) throw error; }
  }
  for (const [name, bytes] of entries) {
    const target = path.resolve(root, name);
    if (!target.startsWith(path.resolve(root) + path.sep) || name.split('/').includes('.git')) throw new Error(`Unsafe snapshot path: ${name}`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
  git(root, ['add', '--all', '--force', '.']);
  const staged = git(root, ['ls-files', '--stage', '-z']).split('\0').filter(Boolean);
  const modes = staged.map(record => {
    const tab = record.indexOf('\t');
    const name = record.slice(tab + 1);
    const hash = record.slice(0, tab).split(' ')[1];
    return `${entries.get(name)?.gitMode ?? '100644'} ${hash}\t${name}\0`;
  }).join('');
  if (modes) git(root, ['update-index', '-z', '--index-info'], { input: modes });
}

/** Merges in a disposable repository; callers receive no candidate on conflict. */
export function mergeSnapshots(root, base, ruby, incoming) {
  fs.mkdirSync(root, { recursive: true });
  git(root, ['init', '--quiet']);
  git(root, ['config', 'user.name', 'Ruby Upstream Sync']);
  git(root, ['config', 'user.email', 'sync@ruby.ad']);
  git(root, ['config', 'core.autocrlf', 'false']);
  git(root, ['config', 'core.longpaths', 'true']);
  git(root, ['config', 'gc.auto', '0']);
  writeSnapshot(root, base);
  git(root, ['commit', '--quiet', '--allow-empty', '-m', 'Transformed baseline']);
  const baseCommit = git(root, ['rev-parse', 'HEAD']);
  writeSnapshot(root, ruby);
  git(root, ['commit', '--quiet', '--allow-empty', '-m', 'Ruby changes']);
  const rubyCommit = git(root, ['rev-parse', 'HEAD']);
  git(root, ['checkout', '--quiet', '--detach', baseCommit]);
  writeSnapshot(root, incoming);
  git(root, ['commit', '--quiet', '--allow-empty', '-m', 'Transformed upstream update']);
  const incomingCommit = git(root, ['rev-parse', 'HEAD']);
  git(root, ['checkout', '--quiet', '--detach', rubyCommit]);
  const merged = spawnSync('git', ['merge', '--no-commit', '--no-ff', incomingCommit], { cwd: root, encoding: 'utf8' });
  if (merged.status !== 0) {
    const conflicts = git(root, ['diff', '--name-only', '--diff-filter=U']);
    throw new Error(`Upstream conflict; production and cursor unchanged.\n${conflicts || merged.stderr}`);
  }
  return readSnapshot(root);
}
