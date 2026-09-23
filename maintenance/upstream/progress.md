# Ruby rebrand implementation ledger

Approved specification: the implementation plan supplied in the task on 2026-09-23.
Baseline: 33ca751b3fa75e00e9dac746d5ba3d7adbc5ec54.

- Setup: fresh clone in the requested workspace; implementation branch ruby/rebrand.
- Ruling: use this fresh clone as isolation instead of creating a second worktree; no existing user checkout is modified.
- Windows checkout normalization verified: no substantive differences before implementation.
- Upstream fetch limited to main because upstream remote branches contain case collisions on Windows.
- Ruling: front/poke becomes front/admin-app, preserving the existing front/admin operational scripts.
- Task 1 implemented: deterministic transformation, collisions, encoded assets, binary preservation and idempotence checks.
- Task 2 implemented, verification ongoing: imported marketing/demo, local packages, vendored eventsource, logos and animations, sandbox artifact injection.
- Task 3 implemented locally: transformed snapshot merge, cursor-only updates, conflict stops, single PR and explicit CI dispatch. Remote branch protection remains unverified.
- Task 4 in progress: SDK/UI, front types, front API, connectors, workers, app/admin, CLI and marketing/demo builds pass. Extension compiled successfully before final asset/manifest updates; needs final rebuild. Viz Windows build path issue fixed; build running. Rust and database checks require Linux CI.
- Ruling: immutable demo and vendored font assets keep exact original bytes and Git -text attributes; their provenance checks caught newline normalization and now pass.
- Ruling: optional analytics must not require an upstream token to build. Removed old extension key/IDs, made Ruby store URLs and contact services configurable, replaced external upstream promotional videos with the supplied self-hosted demo.
- Ruling: a narrow Windows path normalization fix in the visualization declaration build is required for this no-Docker workspace; runtime semantics are unchanged.
- No production deployment, paid infrastructure, automatic merge, or existing Ruby repository mutation has occurred.

- Final independent review completed. Fixed full-candidate CI classification, Rust test-only OAuth configuration, binary artwork review coverage, and file/directory merge transitions. All 23 maintenance tests pass.
- Visual inspection confirms Ruby wordmarks and supplied artwork render on light/dark backgrounds; focused Storybook logo/spinner checks pass.
- Marketing production build, visualization build/tests and derived demo's 172 source tests pass. Source branding scan finds zero violations; rebrand repeat changes zero files.
- GitHub private repository was created. Its account plan explicitly prevents enforced private-repository rulesets; this is a confirmed production-release blocker. No billing or visibility change was made.
- Remote CI, final artifact assembly and service-backed end-to-end validation remain outstanding at this checkpoint.
