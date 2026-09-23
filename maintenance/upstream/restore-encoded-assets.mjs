import fs from 'node:fs';
import path from 'node:path';
import { readSnapshot } from './snapshot.mjs';
import { transformPath, transformText } from './rebrand.mjs';
const root = process.cwd();
const original = readSnapshot(root, JSON.parse(fs.readFileSync('maintenance/upstream/state.json')).acceptedCommit);
let restored = 0;
for (const [name, bytes] of original) {
  if (!name.endsWith('.svg')) continue;
  const destination = transformPath(name);
  if (!fs.existsSync(destination)) continue;
  const imported = path.resolve(root, '..', 'Imports', destination);
  const source = fs.existsSync(imported) ? fs.readFileSync(imported, 'utf8') : bytes.toString('utf8');
  fs.writeFileSync(destination, transformText(source));
  restored++;
}
process.stdout.write(`Restored ${restored} SVG sources with encoded payloads preserved.\n`);
