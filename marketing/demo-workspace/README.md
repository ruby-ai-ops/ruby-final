# Marketing workspace demo

`upstream/` is an immutable snapshot of the standalone workspace demo. Its
source commit, dirty working-tree inventory, file sizes, and SHA-256 hashes are
recorded in `provenance.json`. Keep integration code outside that directory.

`embed/` supplies the separate React 19 runtime, local asset adapter, readiness
message, tests, and Vite build used by the Marketing iframe. The generated
browser files are written to `marketing/public/static/workspace-demo/` and are
intentionally ignored by Git because local startup, CI, and Docker rebuild them.

To refresh the snapshot from an explicitly selected demo checkout:

```powershell
node scripts/import-upstream.mjs --source C:\path\to\demo
npm --prefix embed install
npm --prefix embed run assets:fetch
npm --prefix embed run test
npm --prefix embed run build
```

Normal Marketing startup runs `demo:prepare`, which installs the locked embed
dependencies, verifies the source and assets, and rebuilds the browser bundle
before starting Next.js.

The desktop embed animates the existing conversation over 5.85 seconds with a
six-second completion deadline. The host sends same-origin visibility updates;
playback waits for saved selections and 25% visibility, then replays on chat or
platform selection. Reduced motion shows the complete conversation immediately.
Only presentation changes: the upstream snapshot, response text, image URLs,
completion durations, element order, and artifact interactions remain intact.

The build inserts the streaming wrapper and word spans through a validated
TypeScript syntax adaptation. `embed/src/artifact-reveal-map.ts` explicitly maps
supporting cards for each original artifact. Adapter tests compare all 360
completed scenario/platform views with their unanimated content and check timing,
replay, visibility, and scrolling interruption.
# Derived Ruby snapshot

The original provenance record is preserved in `maintenance/upstream/demo-original-provenance.json`. The current `provenance.json` records a derived snapshot correcting three imported test assertions that incorrectly expected Ruby's name to be absent. No demo runtime source changed for this correction. Source and bundled asset hash checks remain enabled.
