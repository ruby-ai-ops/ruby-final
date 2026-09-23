import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const output = '.artifacts/sandbox';
fs.mkdirSync(output,{recursive:true});
const version = fs.readFileSync('cli/ruby-sandbox/Cargo.toml','utf8').match(/^version = "([^"]+)"/m)?.[1];
if (!version) throw new Error('Missing rbx version');
const sources = {
  rbx: {path:'cli/ruby-sandbox/target/x86_64-unknown-linux-musl/release/rbx',version,commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()},
  apply_patch: {path:'.artifacts/codex-source/codex-rs/target/x86_64-unknown-linux-musl/release/apply_patch',version:'0.1.0',commit:'f028679abb30051cec2434e624cd99975986b41b'},
};
const manifest = {};
for (const [name,source] of Object.entries(sources)) {
  const bytes=fs.readFileSync(source.path);
  fs.writeFileSync(`${output}/${name}-linux-x86_64`,bytes,{mode:0o755});
  manifest[name]={version:source.version,commit:source.commit,sha256:createHash('sha256').update(bytes).digest('hex')};
}
fs.copyFileSync('.artifacts/codex-source/LICENSE',`${output}/apply_patch-LICENSE`);
fs.copyFileSync('.artifacts/codex-source/ruby-lock-provenance.json',`${output}/apply_patch-lock-provenance.json`);
fs.writeFileSync(`${output}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
