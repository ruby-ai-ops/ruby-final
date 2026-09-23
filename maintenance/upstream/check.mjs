import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ownedFiles, removedFiles, readOwnedFile, retiredServiceIdentifiers } from './rebrand.mjs';

export function hasLegacyBranding(text) {
  if (retiredServiceIdentifiers.some(value => text.includes(value))) return true;
  const meaningful = text
    .replace(/data:[^\s"'<>;,]+(?:;[^\s"'<>;,]+)*;base64,[a-zA-Z0-9+/=\r\n]+|sha(?:256|384|512)-[a-zA-Z0-9+/=]+/g, '')
    .replace(/industr(?:y|ies|ial\w*|ious\w*)|sawdust|stardust/gi, '');
  return /dust|dsbx|sparkle(?!s)|\bpoke\b/i.test(meaningful);
}

export function check(root) {
  const findings = [];
  for (const name of ownedFiles(root)) {
    if (hasLegacyBranding(name) || removedFiles.has(name)) findings.push(`${name}: forbidden path`);
    const bytes = readOwnedFile(path.join(root, name));
    if (bytes.includes(0)) continue;
    const lines = bytes.toString('utf8').split('\n');
    lines.forEach((line, index) => { if (hasLegacyBranding(line)) findings.push(`${name}:${index + 1}: legacy reference`); });
  }
  return findings;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const findings = check(process.cwd());
  process.stdout.write(findings.join('\n') + `\nBranding findings: ${findings.length}\n`);
  process.exitCode = findings.length ? 1 : 0;
}
