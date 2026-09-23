import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const workspace of ['.', ...manifest.workspaces]) {
  const file = path.join(root, workspace, 'package.json');
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  value.private = true;
  if (value.author) value.author = 'Ruby AI';
  delete value.license;
  if (workspace === 'ui') value.description = 'Ruby UI — the Ruby AI component library';
  if (workspace === '.') {
    value.scripts['branding:check'] = 'node maintenance/upstream/check.mjs';
    value.scripts['branding:apply'] = 'node maintenance/upstream/rebrand.mjs';
    value.scripts['test:maintenance'] = 'node --test maintenance/upstream/*.test.mjs';
  }
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}
