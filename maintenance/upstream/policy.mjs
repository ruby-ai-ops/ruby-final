import { createHash } from 'node:crypto';
import { transformEntries, transformPath, isExcluded, maintenancePath, isText } from './rebrand.mjs';
import { hasLegacyBranding } from './check.mjs';

export function protectedPath(name, assets = []) {
  return name.startsWith('.github/') || name.startsWith('maintenance/') ||
    name.startsWith('vendor/') || name === '.gitattributes' ||
    name.startsWith('ui/src/logo/') || name.startsWith('ui/src/lottie/') ||
    name.startsWith('ui/src/styles/') || name === 'ui/src/components/Sheet.tsx' ||
    name === 'ui/src/icons/src/v2-stroke/intersect-ruby.svg' ||
    name === 'ui/src/icons/v2-stroke/IntersectRuby.tsx' || assets.includes(name);
}

export function transformSnapshot(entries, assets = []) {
  return transformEntries(new Map([...entries].filter(([name]) =>
    !isExcluded(name) && !protectedPath(transformPath(name), assets))));
}

const fingerprint = bytes => bytes ? `${bytes.gitMode ?? '100644'}:${createHash('sha256').update(bytes).digest('hex')}` : null;

export function assertSafeUpdate(previous, incoming, assets = [], reviewedWorkflowChanges = new Map()) {
  for (const name of new Set([...previous.keys(), ...incoming.keys()])) {
    const before = previous.get(name);
    const after = incoming.get(name);
    if (before?.equals(after ?? Buffer.alloc(0)) && before.gitMode === after?.gitMode) continue;
    if (name.startsWith('.github/')) {
      const review = reviewedWorkflowChanges.get(name);
      if (review?.before !== fingerprint(before) || review?.after !== fingerprint(after)) {
        throw new Error(`Workflow or action change requires manual review: ${name}`);
      }
      continue; // Workflows stay excluded from the transformed product snapshot.
    }
    if (after?.gitMode === '120000') throw new Error(`New or changed symlink requires manual review: ${name}`);
    if (after && !isExcluded(name) && !protectedPath(transformPath(name), assets) &&
        !/(?:^|\/)(?:tests?|fixtures)(?:\/|$)/.test(name) && (!isText(after) || /\.(?:png|jpe?g|webp|avif|heic|heif|bmp|tiff?|gif|ico|svgz?|eps|psd|ai|pdf|mp4|webm|mov|m4v|avi|lottie|zip|tar|gz|7z)$/i.test(name))) {
      throw new Error(`Changed visual asset requires branding review and an explicit mapping: ${name}`);
    }
  }
}

export function assertBranded(entries) {
  for (const [name, bytes] of entries) {
    if (maintenancePath(name)) continue;
    if (hasLegacyBranding(name) || (!bytes.includes(0) && hasLegacyBranding(bytes.toString('utf8')))) {
      throw new Error(`Unmapped branding requires review: ${name}`);
    }
  }
}
