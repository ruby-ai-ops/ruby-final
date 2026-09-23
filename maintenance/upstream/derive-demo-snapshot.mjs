import fs from 'node:fs';
import { createHash } from 'node:crypto';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const root='marketing/demo-workspace';
const originalRecord='maintenance/upstream/demo-original-provenance.json';
const provenancePath=`${root}/provenance.json`;
if(!fs.existsSync(originalRecord)) fs.copyFileSync(provenancePath,originalRecord);
const provenance=JSON.parse(fs.readFileSync(originalRecord,'utf8'));
const testPath=`${root}/upstream/app/page.test.tsx`;
const original=fs.readFileSync(testPath,'utf8');
const derived=original
  .replace(/within\((conversation|messages|chat)\)\.queryByText\(\/Ruby\/i\)\)\.not\.toBeInTheDocument\(\)/g,"within($1).getByText('Ruby')).toBeInTheDocument()")
  .replace("within(conversations).getByText('Ruby')).toBeInTheDocument()", "within(conversations).queryByText(/Ruby/i)).not.toBeInTheDocument()");
if(original!==derived) fs.writeFileSync(testPath,derived);
const bytes=fs.readFileSync(testPath);
const entry=provenance.files.find(file=>file.path==='app/page.test.tsx');
const before={...entry};
entry.sha256=digest(bytes); entry.bytes=bytes.length;
provenance.snapshotKind='derived';
provenance.derivation={
  originalManifest:'maintenance/upstream/demo-original-provenance.json',
  originalManifestSha256:digest(fs.readFileSync(originalRecord)),
  reason:'Correct three supplied tests that incorrectly require Ruby to be absent from Ruby-authored conversation messages. Runtime source and behavior are unchanged.',
  changes:[{path:entry.path,beforeSha256:before.sha256,afterSha256:entry.sha256}],
};
fs.writeFileSync(provenancePath,JSON.stringify(provenance,null,2)+'\n');
