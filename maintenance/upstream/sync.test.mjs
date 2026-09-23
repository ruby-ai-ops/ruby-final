import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createSyncCandidate } from './sync.mjs';
import { productChanged } from './ci-changes.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ruby-sync-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
  const write = (file, text) => { fs.mkdirSync(path.dirname(path.join(root,file)), {recursive:true}); fs.writeFileSync(path.join(root,file),text); };
  const commit = () => { git('add','--all'); git('commit','-qm','fixture'); return git('rev-parse','HEAD'); };
  git('init','-q'); git('config','user.name','test'); git('config','user.email','test@ruby.ad'); git('config','core.autocrlf','false');
  write('app.ts','original\n'); const baseline = commit();
  git('checkout','-qb','ruby-main');
  write('maintenance/upstream/state.json', JSON.stringify({acceptedCommit:baseline,productionBranch:'ruby-main'}));
  write('marketing/home.ts','Ruby custom\n'); const production = commit();
  git('checkout','-q','--detach',baseline);
  return { root, git, write, commit, baseline, production };
}

test('ordinary update makes a candidate; accepted branch and cursor do not move', t => {
  const f=fixture(t); f.write('app.ts','updated\n'); const target=f.commit(); f.git('checkout','-q','ruby-main');
  const result=createSyncCandidate(f.root,target);
  assert.equal(result.productChanged,true);
  assert.equal(f.git('rev-parse','HEAD'),f.production);
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.root,'maintenance/upstream/state.json'))).acceptedCommit,f.baseline);
  assert.equal(f.git('show',`${result.branch}:app.ts`),'updated');
  assert.equal(JSON.parse(f.git('show',`${result.branch}:maintenance/upstream/state.json`)).acceptedCommit,target);
  assert.throws(()=>createSyncCandidate(f.root,target),/already exists/);
});
test('excluded-only updates record their range without changing the product', t => {
  const f=fixture(t); f.write('marketing/home.ts','upstream campaign\n'); const target=f.commit(); f.git('checkout','-q','ruby-main');
  const result=createSyncCandidate(f.root,target);
  assert.equal(result.productChanged,false);
  assert.equal(f.git('show',`${result.branch}:marketing/home.ts`),'Ruby custom');
  assert.equal(f.git('diff','--name-only',f.production,result.branch),'maintenance/upstream/state.json');
});
test('failed validation creates no branch, production change, or cursor change', t => {
  const f=fixture(t); f.write('app.ts','broken\n'); const target=f.commit(); f.git('checkout','-q','ruby-main');
  assert.throws(()=>createSyncCandidate(f.root,target,{validate(){throw new Error('Failed build');}}),/Failed build/);
  assert.equal(f.git('for-each-ref','--format=%(refname)','refs/heads/ruby-sync/'),'');
  assert.equal(f.git('rev-parse','HEAD'),f.production);
  assert.equal(f.git('status','--porcelain'),'');
});
test('unchanged upstream does no merge or branch work', t => {
  const f=fixture(t); f.git('checkout','-q','ruby-main');
  assert.deepEqual(createSyncCandidate(f.root,f.baseline),{unchanged:true});
});

test('CI validates product edits even when the last commit only advances the cursor', t => {
  const f=fixture(t); f.git('checkout','-q','ruby-main');
  f.write('app.ts','changed\n'); f.commit();
  f.write('maintenance/upstream/state.json',JSON.stringify({acceptedCommit:'new'})); f.commit();
  assert.equal(productChanged(f.root,f.production),true);
});

test('CI skips product builds only for a complete cursor-only candidate', t => {
  const f=fixture(t); f.git('checkout','-q','ruby-main');
  f.write('maintenance/upstream/state.json',JSON.stringify({acceptedCommit:'new'})); f.commit();
  assert.equal(productChanged(f.root,f.production),false);
  assert.equal(productChanged(f.root,'refs/remotes/missing'),true);
});
