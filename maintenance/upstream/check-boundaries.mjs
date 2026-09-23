import { execFileSync } from 'node:child_process';
import { readSnapshot } from './snapshot.mjs';
import { assertRubyBoundaries } from './boundaries.mjs';

const root = process.cwd();
const base = process.env.CI_BASE || 'refs/remotes/origin/ruby-main';
execFileSync('git', ['rev-parse', '--verify', base], { cwd: root, stdio: 'pipe' });
assertRubyBoundaries(readSnapshot(root, base), readSnapshot(root, 'HEAD'));
process.stdout.write('Ruby marketing, theme, pricing and alert boundaries preserved.\n');
