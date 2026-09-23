import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readSnapshot } from './snapshot.mjs';
import { mergeSnapshots } from './merge.mjs';
import { assertSafeUpdate, assertBranded, transformSnapshot } from './policy.mjs';

const git = (root, args, extra = {}) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['pipe','pipe','pipe'], ...extra }).trim();
const STATE = 'maintenance/upstream/state.json';

/** Creates a branch ref only after validation. Never checks out or changes production. */
export function createSyncCandidate(root, target, { validate = assertBranded } = {}) {
  if (!/^[0-9a-f]{40}$/.test(target)) throw new Error('Expected an exact upstream commit');
  if (git(root, ['status', '--porcelain'])) throw new Error('Sync requires a clean checkout');
  const rubyHead = git(root, ['rev-parse', 'HEAD']);
  const ruby = readSnapshot(root, rubyHead);
  const state = JSON.parse(ruby.get(STATE).toString());
  if (target === state.acceptedCommit) return { unchanged: true };
  git(root, ['merge-base', '--is-ancestor', state.acceptedCommit, target]);
  const branch = `ruby-sync/${target}`;
  if (git(root, ['for-each-ref', '--format=%(refname)', `refs/heads/${branch}`])) {
    throw new Error('Candidate already exists; reviewer edits will not be overwritten');
  }
  const oldSource = readSnapshot(root, state.acceptedCommit);
  const newSource = readSnapshot(root, target);
  const assets = JSON.parse(ruby.get('maintenance/upstream/protected-assets.json')?.toString() ?? '[]');
  assertSafeUpdate(oldSource, newSource, assets);
  const base = transformSnapshot(oldSource, assets);
  const incoming = transformSnapshot(newSource, assets);
  const productChanged = [...new Set([...base.keys(), ...incoming.keys()])].some(name => {
    const old = base.get(name), next = incoming.get(name);
    return !old || !next || !old.equals(next) || old.gitMode !== next.gitMode;
  });
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ruby-sync-'));
  try {
    const candidate = mergeSnapshots(temporary, base, ruby, incoming);
    validate(candidate);
    const commits = git(root, ['rev-list', '--reverse', `${state.acceptedCommit}..${target}`]).split('\n').filter(Boolean);
    const nextState = { ...state, acceptedCommit: target, consumedRange: { fromExclusive: state.acceptedCommit, toInclusive: target, commits } };
    fs.writeFileSync(path.join(temporary, STATE), JSON.stringify(nextState, null, 2) + '\n');
    git(temporary, ['add', STATE]);
    git(temporary, ['commit', '--quiet', '--allow-empty', '-m', 'Validated transformed snapshot']);
    const synthetic = git(temporary, ['rev-parse', 'HEAD']);
    git(root, ['fetch', '--quiet', '--no-tags', temporary, synthetic]);
    const tree = git(root, ['rev-parse', 'FETCH_HEAD^{tree}']);
    const commit = git(root, ['commit-tree', tree, '-p', rubyHead, '-m', `Sync upstream through ${target}`]);
    git(root, ['update-ref', `refs/heads/${branch}`, commit, '0000000000000000000000000000000000000000']);
    return { branch, commit, productChanged, from: state.acceptedCommit, to: target, count: commits.length };
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true, maxRetries: 3 });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const root = process.cwd();
  const state = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  if (git(root, ['branch', '--show-current']) !== state.productionBranch) throw new Error('Run automation from the accepted production branch');
  git(root, ['fetch', '--no-tags', state.upstreamUrl, state.upstreamBranch]);
  const target = git(root, ['rev-parse', 'FETCH_HEAD']);
  if (target !== state.acceptedCommit && git(root, ['ls-remote', '--heads', 'origin', `refs/heads/ruby-sync/${target}`])) {
    throw new Error('Remote candidate already exists; review or retire it explicitly before retrying');
  }
  const result = createSyncCandidate(root, target);
  process.stdout.write(JSON.stringify(result) + '\n');
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `branch=${result.branch ?? ''}\nproduct_changed=${result.productChanged ?? false}\n`);
  }
}
