# Ruby upstream maintenance

Accepted specification: the Ruby AI One-Pass Rebrand and Upstream Sync plan approved on 2026-09-23. The initial source commit is `33ca751b3fa75e00e9dac746d5ba3d7adbc5ec54` from `https://github.com/dust-tt/dust.git`.

This directory is the designated provenance and transformation boundary. Original identifiers are permitted here and in Git history, never in Ruby-owned shipped code. Archived workflows are reference material and do not execute.

`rebrand.mjs` applies the versioned naming rules; `policy.mjs` protects imported assets, marketing, workflows, maintenance and vendored dependencies. `protected-assets.json` lists imported/replaced assets. Verified demo source and vendor assets retain their exact bytes, including line endings.

Run `npm run branding:check`, `npm run test:maintenance`, and `npm run branding:apply`. Applying twice must produce zero changes. `sync-brand-assets.mjs` regenerates UI logos from the supplied assets; `complete-brand-assets.mjs` updates extension/mobile copies. The one-time import helpers are retained for provenance; they are not run by the sync workflow.

The daily 03:17 UTC workflow reads the accepted cursor from `state.json`, fetches upstream's default `main` branch, transforms both snapshots, then three-way merges their difference against Ruby. It creates a new branch ref only after validation, without changing the production checkout. Additions, deletions and renames use Git's merge semantics. The complete consumed commit range is recorded in the candidate state; production accepts it only when the PR merges.

An existing open sync PR is left intact. Conflicts, workflow changes, changed symlinks, unmapped branding, installation or build failures require review. To retry a failed candidate, fix it on its PR branch and manually run Ruby CI for that branch. Never force-push over reviewer edits. A rejected/closed candidate must be investigated before its branch is removed and regeneration is attempted.

CI is explicitly dispatched after bot-created PRs because pushes made using `GITHUB_TOKEN` do not ordinarily trigger another workflow. CI has read-only repository permissions and no deployment job. The sync job can create PR branches but must be prevented from pushing production by a repository rule requiring the `Ruby release gate` check and human approval. If GitHub cannot enforce that rule for this private repository, release remains blocked.

Third-party notices remain in the vendored Rust library, fonts and demo assets. Upstream-owned licenses/authors were removed under the permission stated by the repository owner in the task. No third-party license grant is inferred from that permission.
