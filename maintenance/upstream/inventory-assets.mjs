import fs from 'node:fs';
import path from 'node:path';
import { readSnapshot } from './snapshot.mjs';
import { transformPath } from './rebrand.mjs';

const state=JSON.parse(fs.readFileSync('maintenance/upstream/state.json','utf8'));
const source=readSnapshot(process.cwd(),state.acceptedCommit);
const unchanged=[];
for (const [name,bytes] of source) {
  if (!/dust|sparkle|poke|dsbx/i.test(name) || !/\.(?:png|jpe?g|webp|gif|ico|zip|mp4|svg|json)$/i.test(name)) continue;
  const destination=transformPath(name);
  if (fs.existsSync(destination) && fs.readFileSync(destination).equals(bytes)) unchanged.push(destination);
}
fs.writeFileSync('.git/ruby-tools/unchanged-branded-assets.json',JSON.stringify(unchanged,null,2)+'\n');
process.stdout.write(JSON.stringify(unchanged.filter(name=>!name.startsWith('ui/')),null,2)+'\n');

if (process.argv[2]) {
  const imports=path.resolve(process.argv[2]);
  const protectedAssets=[];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
      const file=path.join(directory,entry.name);
      if(entry.isDirectory()) walk(file);
      else protectedAssets.push(transformPath('front/public/'+path.relative(imports,file).replaceAll('\\','/')));
    }
  }
  walk(imports);
  fs.writeFileSync('maintenance/upstream/protected-assets.json',JSON.stringify(protectedAssets.sort(),null,2)+'\n');
}
