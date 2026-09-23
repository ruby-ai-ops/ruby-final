# ruby-sandbox — Ruby Sandbox CLI

A CLI for interacting with Ruby from within sandboxes.

## Authentication

`ruby-sandbox` authenticates using short-lived sandbox JWT tokens:

- Token is minted per `SandboxResource.exec()` call
- JWT claims: `{wId, cId, uId, sbId}`
- Injected as the `RUBY_SANDBOX_TOKEN` environment variable with a 2-minute TTL
- The API authenticates tokens via the `sbt-` prefix branch in `withPublicAPIAuthentication`
- Builds a scoped `Authenticator` with `isSandboxToken: true`

## Commands

```
rbx version       Print version information
rbx forward       Forward sandbox egress traffic to the Ruby egress proxy
rbx resolve       Run the local synthetic DNS resolver for proxied traffic
rbx healthcheck   Report sandbox egress enforcement health as JSON
rbx tools         Interact with MCP servers and tools
rbx function      Run a sandbox function (run) or print its schema (get)
```

## Build

The functions runner bundle (`functions-runner/runner.js`) is a generated
artifact and is **not committed**. Build it once before compiling `rbx`:

```sh
cd cli/ruby-sandbox/functions-runner
bun install
bun run build
```

Then build the CLI:

```sh
cd cli/ruby-sandbox
cargo build
./target/debug/rbx --help
```

(If the bundle is missing, `build.rs` fails the build with this instruction.)

## Functions

Functions are self-contained Bun bundles in `$RUBY_FUNCTIONS_DIR`, named
`<name>.ts`. `rbx` executes them via an embedded runner (`bun` required).

- `rbx function run <name>` — request envelope JSON on stdin → a protocol v3 result envelope
  on stdout (`{protocolVersion, delivery, outcome, timingsMs?}`), exit 0 whenever an envelope
  was written, so the caller classifies from `outcome` rather than the exit code.
- `rbx function get <name>` — prints `{name, description, userIdentity,
  input_schema, output_schema}` (JSON Schema).

Set `schema.userIdentity` when a function needs a caller identity:

```ts
export const schema = {
  userIdentity: "workspace_user_required",
  input: z.object({}),
  output: z.object({}),
};
```

- `optional` (or omit the field): no user is required.
- `workspace_user_required`: require a current workspace member.
- `interactive_workspace_user_required`: require a workspace member calling
  directly from a live Ruby session, rather than through an agent, schedule, or
  API client acting on that member's behalf.
- `frame_author_required`: for Frame v2 functions, require write access to the
  Frame's source files.

Adding a policy requires a runner-first rollout. Publish a `rbx` release that
parses the policy, then update `RBX_CLI_VERSION` in
`front/lib/api/sandbox/image/registry.ts` before exposing the policy to Frame
authors. During a mixed-version rollout, servers deny unknown persisted
policies, so invocation fails closed until all revisions understand the policy.

### Unprivileged execution

Function code is untrusted, so the `bun` child (runner harness + bundle) runs as
the sandbox's unprivileged, egress-proxied `agent-proxied` user (uid `1003` —
the `skuid` enforced by `rbx healthcheck`), not as whoever launched `rbx`.
This is automatic and needs no flags: when `rbx` is invoked as root (e.g. by
the sandbox resource), it downgrades the child to that user before exec — its
primary group and supplementary groups are looked up at runtime (the user's
group is `agent`, not `1003`), so the function gets the same network containment
(egress proxy: domain allowlisting + DSEC secret substitution) and group-based
file access (`/files` etc.) as agent code.

`rbx` itself may stay root: it chowns the runner and stages the bundle into a
temp dir owned by the agent user, so the dropped child can read both even when
the originals are root-only. When `rbx` runs unprivileged (local dev), there is
nothing to contain and no privilege to `setuid`, so the child runs as the
current user.

The runner is bundled (Zod inlined) into `functions-runner/runner.js`, a
generated artifact that is **not committed** (it is `.gitignore`d). `rbx`
embeds it via `include_str!`, so it must be built with `bun run build` before
compiling `rbx`; `build.rs` fails early with instructions if it is missing. CI,
the release workflow, and `upsert_rbx_to_sandbox.sh` build it on the host
first. Rebuild it after changing any runner source (`protocol.ts`, `invoke.ts`,
`schema.ts`, `runner.ts`).

## The `@ruby-ai/pod` runtime package

`pod/` is the runtime library sandbox function code imports (`db()`,
`currentUser()`). It is not part of `rbx`: the image vendors it into
`/opt/npm-global/lib/node_modules/@ruby-ai/pod` at image build time (see
`front/lib/api/sandbox/image/pod_package.ts`), and published bundles keep it as
an external import. So neither rebuilding `rbx` nor republishing a function
picks up a change to it — only a new image does, gated by
`RUBY_BASE_IMAGE_VERSION`.

For the dev loop, `upsert_pod_package_to_sandbox.sh` builds it and pushes it
into one running sandbox, then drops the warm function servers so the next
invocation re-imports it (a resident server holds the module it started with).
