import fs from 'node:fs';
import path from 'node:path';
import { hasLegacyBranding } from './check.mjs';
import { retiredServiceIdentifiers } from './rebrand.mjs';
const roots = ['sdks/js/dist','ui/dist','front/dist','front-api/dist','front-spa/dist','marketing/.next-build','marketing/public/static/workspace-demo','connectors/dist','extension/platforms/chrome/build','extension/platforms/firefox/build','extension/platforms/front/build','viz/.next','cli/ruby-cli/dist'];
const findings=[];
function scan(root) {
  if (!fs.existsSync(root)) return;
  for (const entry of fs.readdirSync(root,{withFileTypes:true})) {
    const name=path.join(root,entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'cache' && entry.name !== 'node_modules') scan(name); continue; }
    if (hasLegacyBranding(entry.name)) findings.push(name);
    if (!/\.(?:[cm]?js|json|html|css|svg|txt|ts|map)$/.test(entry.name)) continue;
    // Bundles can include third-party prose (e.g. dust particles); original owned identities remain forbidden.
    const text=fs.readFileSync(name,'utf8').replace(/data:[^\s"'<>;,]+(?:;[^\s"'<>;,]+)*;base64,[a-zA-Z0-9+/=\r\n]+/g,'');
    if (/@dust(?:-tt)?\/|dust\.tt|dust-tt|DustAPI|DustHive|DUST_|\bdsbx\b|@ruby-ai\/sparkle/.test(text) || retiredServiceIdentifiers.some(value=>text.includes(value))) findings.push(name);
  }
}
roots.forEach(scan);
if (findings.length) throw new Error(`Legacy identities in built artifacts:\n${[...new Set(findings)].join('\n')}`);
process.stdout.write('Built artifact branding check passed.\n');
