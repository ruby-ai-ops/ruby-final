import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { check } from './check.mjs';
import { rebrand } from './rebrand.mjs';

test('directory and dangling links are scanned and transformed without following targets', {skip:process.platform === 'win32'}, t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'ruby-links-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  execFileSync('git',['init','-q'],{cwd:root});
  fs.mkdirSync(path.join(root,'skills'));
  fs.writeFileSync(path.join(root,'skills','guide.md'),'Ruby instructions');
  fs.symlinkSync('skills',path.join(root,'skills-link'));
  fs.symlinkSync('dust-target',path.join(root,'missing-link'));
  assert.equal(check(root).length,1);
  assert.equal(rebrand(root),1);
  assert.equal(fs.readlinkSync(path.join(root,'missing-link')),'ruby-target');
  assert.equal(fs.readlinkSync(path.join(root,'skills-link')),'skills');
  assert.equal(check(root).length,0);
  assert.equal(rebrand(root),0);
});
