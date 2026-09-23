import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const removedFiles = new Set(['LICENSE', '.authors', 'AUTHORS.md', 'authors.md', 'cli/dust-cli/LICENSE', 'cli/ruby-cli/LICENSE']);
export const maintenancePath = (name) => name.startsWith('maintenance/upstream/');
export const retiredServiceIdentifiers = JSON.parse(fs.readFileSync(new URL('./retired-service-identifiers.json', import.meta.url), 'utf8'));

export function transformText(text) {
  for (const identity of retiredServiceIdentifiers) text = text.replaceAll(identity, '');
  const encoded = [];
  const protectedText = text.replace(/data:[^\s"'<>;,]+(?:;[^\s"'<>;,]+)*;base64,[a-zA-Z0-9+/=\r\n]+|sha(?:256|384|512)-[a-zA-Z0-9+/=]+/g, value => {
    encoded.push(value);
    return `__RUBY_ENCODED_${encoded.length - 1}__`;
  });
  return protectedText
    .replaceAll('\r\n', '\n')
    .replaceAll('github.com/dust-tt/dust', 'github.com/ruby-ai-ops/ruby-final')
    .replaceAll('@dust-frame-runtime/', '@ruby-ai/frame-runtime-')
    .replaceAll('@dust-tt/', '@ruby-ai/')
    .replaceAll('@dust/', '@ruby-ai/')
    .replaceAll('front/poke/', 'front/admin-app/')
    .replaceAll('"poke/temporal"', '"admin-app/temporal"')
    .replaceAll('@app/poke/', '@app/admin-app/')
    .replaceAll('@dust-tt/front/poke/', '@ruby-ai/front/admin-app/')
    .replaceAll('@ruby-ai/front/poke/', '@ruby-ai/front/admin-app/')
    .replaceAll('poke.dust.tt', 'admin.ruby.ad')
    .replaceAll('app.dust.tt', 'app.ruby.ad')
    .replaceAll('eu.dust.tt', 'app.ruby.ad')
    .replaceAll('dust.tt', 'ruby.ad')
    .replaceAll('dust\\.tt', 'ruby\\.ad')
    .replaceAll('dust\\\\.tt', 'ruby\\\\.ad')
    .replaceAll('ruby\\.tt', 'ruby\\.ad')
    .replaceAll('ruby\\\\.tt', 'ruby\\\\.ad')
    .replace(/https:\/\/ruby\.ad\/(api|w|oauth|login|welcome)(?=\/|[?"'`\s]|$)/g, 'https://app.ruby.ad/$1')
    .replaceAll('dust-tt', 'ruby-ai')
    .replaceAll('Dust', 'Ruby')
    .replaceAll('DUST', 'RUBY')
    .replaceAll('cdust', 'cruby')
    .replace(/(?<![a-z])dust/g, 'ruby')
    .replaceAll('DSBX', 'RBX').replaceAll('Dsbx', 'Rbx').replaceAll('dsbx', 'rbx')
    .replace(/Sparkle(?![a-z])/g, 'RubyUI')
    .replace(/SPARKLE(?![A-Z])/g, 'RUBY_UI')
    .replace(/sparkle(?![a-z])/g, 'ui')
    .replace(/Poke(?![a-z])/g, 'Admin')
    .replaceAll('Pokefy', 'Adminify').replaceAll('pokefy', 'adminify')
    .replace(/POKE(?![A-Z])/g, 'ADMIN')
    .replace(/(?<![a-z])poke(?![a-z])/g, 'admin')
    .replace(/__RUBY_ENCODED_(\d+)__/g, (_, index) => encoded[Number(index)]);
}

export const transformPath = (name) => transformText(name.replace(/^front\/poke(?=\/|$)/, 'front/admin-app'));

export const isText = bytes => !bytes.includes(0) && Buffer.from(bytes.toString('utf8')).equals(bytes);

export function isExcluded(name) {
  return removedFiles.has(name) || name.startsWith('marketing/') || maintenancePath(name);
}

export function transformEntries(entries, { filter = true } = {}) {
  const result = new Map();
  for (const [name, bytes] of entries) {
    if (filter && isExcluded(name)) continue;
    const destination = transformPath(name);
    if (result.has(destination)) throw new Error(`Path collision: ${name} -> ${destination}`);
    const transformed = isText(bytes) ? Buffer.from(transformText(bytes.toString('utf8'))) : Buffer.from(bytes);
    if (bytes.gitMode) Object.defineProperty(transformed, 'gitMode', { value: bytes.gitMode });
    result.set(destination, transformed);
  }
  return result;
}

export function ownedFiles(root) {
  return execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, maxBuffer: 32 * 1024 * 1024 })
    .toString().split('\0').filter(Boolean).filter(name => {
      if (maintenancePath(name) || name.endsWith('.ruby-rebrand-tmp')) return false;
      try { fs.lstatSync(path.join(root,name)); return true; }
      catch (error) { if (error.code === 'ENOENT') return false; throw error; }
    });
}

// Inspect the link text itself, including dangling links; never follow it outside the tree.
export function readOwnedFile(file) {
  return fs.lstatSync(file).isSymbolicLink() ? Buffer.from(fs.readlinkSync(file)) : fs.readFileSync(file);
}

export function rebrand(root) {
  const names = ownedFiles(root);
  const destinations = new Set();
  for (const name of names) {
    if (removedFiles.has(name)) continue;
    const destination = transformPath(name);
    if (destinations.has(destination.toLowerCase())) throw new Error(`Path collision: ${name} -> ${destination}`);
    destinations.add(destination.toLowerCase());
  }
  let changed = 0;
  for (const name of names) {
    const source = path.join(root, name);
    if (name.startsWith('marketing/demo-workspace/upstream/') || name.startsWith('marketing/demo-workspace/embed/bundled-assets/') || name.startsWith('marketing/public/static/workspace-demo/bundled/')) continue;
    if (removedFiles.has(name)) { fs.unlinkSync(source); changed++; continue; }
    const destination = path.join(root, transformPath(name));
    const sourceStat = fs.lstatSync(source);
    const bytes = readOwnedFile(source);
    const next = isText(bytes) ? Buffer.from(transformText(bytes.toString('utf8'))) : bytes;
    if (source !== destination || !bytes.equals(next)) {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      const temporary = `${destination}.ruby-rebrand-tmp`;
      if (sourceStat.isSymbolicLink()) fs.symlinkSync(next.toString('utf8'), temporary);
      else fs.writeFileSync(temporary, next, { mode: sourceStat.mode });
      for (let attempt = 0; ; attempt++) {
        try { fs.renameSync(temporary, destination); break; }
        catch (error) {
          if (process.platform !== 'win32' || !['EPERM', 'EBUSY', 'EACCES', 'UNKNOWN'].includes(error.code) || attempt >= 20) throw error;
          Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
        }
      }
      if (source !== destination) fs.unlinkSync(source);
      changed++;
    }
  }
  return changed;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.stdout.write(JSON.stringify({ changed: rebrand(process.cwd()) }) + '\n');
}
