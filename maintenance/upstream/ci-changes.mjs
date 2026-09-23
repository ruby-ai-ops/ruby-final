import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

export function productChanged(root, base = 'refs/remotes/origin/ruby-main') {
  if (spawnSync('git', ['rev-parse','--verify',base], {cwd:root,stdio:'ignore'}).status !== 0) return true;
  const changed = execFileSync('git', ['diff','--name-only',`${base}...HEAD`], {cwd:root,encoding:'utf8'}).trim();
  // Empty diffs still validate a manual production run; only cursor-only changes skip builds.
  return changed !== 'maintenance/upstream/state.json';
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const changed = productChanged(process.cwd(), process.env.CI_BASE || undefined);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `product_changed=${changed}\n`);
}
