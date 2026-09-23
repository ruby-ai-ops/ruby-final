# `rbx forward` end-to-end tests

Dockerised bun tests that exercise `rbx forward` against the live production
egress-proxy. The container sets up iptables `REDIRECT` rules for a dedicated
`ruby-fwd` uid so plain `fetch("https://ruby.ad/")` calls from within the test
transparently flow through the forwarder and the proxy — the same path a
production sandbox will take.

The tests replace the old `egress-proxy/scripts/smoke.ts` helper: everything
now runs through `rbx forward`.

## What it covers

- **Matrix** (6 cases): valid JWT + allowed domain (ALLOW), valid JWT + denied
  domain (DENY + JSON deny log entry with `reason: proxy_denied`), expired JWT,
  wrong `iss`, wrong `aud`, bad signature. All DENY cases additionally verify
  `/tmp/ruby-egress-denied.log` contains a structured JSON entry for the
  denied target.
- **Streaming**: real agent call — POST a "write a short poem" message to the
  Ruby agent (`sId=ruby` by default) on your workspace, iterate the streamed
  `generation_tokens` events via the `@ruby-ai/client` SDK, assert at least
  one token was received. Uses your workspace API key; the request flows
  `fetch → iptables REDIRECT → rbx forward → egress-proxy → ruby.ad`.

## Required env

| var | purpose |
| --- | --- |
| `EGRESS_PROXY_JWT_SECRET` | HS256 secret shared with the proxy. Fetch from GCP Secret Manager. |
| `RUBY_API_KEY` | workspace API key (streaming test only) |
| `RUBY_WORKSPACE_ID` | target workspace sId (streaming test only) |

## Optional env (all have sensible defaults)

| var | default |
| --- | --- |
| `EGRESS_PROXY_HOST` | `eu.sandbox-egress.ruby.ad` |
| `EGRESS_PROXY_PORT` | `4443` |
| `EGRESS_PROXY_TLS_NAME` | same as `EGRESS_PROXY_HOST` |
| `EGRESS_PROXY_ALLOWED_DOMAIN` | `ruby.ad` |
| `EGRESS_PROXY_DENIED_DOMAIN` | `example.com` |
| `EGRESS_PROXY_JWT_TTL_SECONDS` | `300` |
| `EGRESS_PROXY_SB_ID` | `e2e-<timestamp>` |
| `RUBY_AGENT_ID` | `ruby` |
| `RUBY_API_BASE_URL` | `https://ruby.ad` |
| `RUBY_AGENT_PROMPT` | short "write a poem" prompt |
| `RUST_LOG` | `info` (tracing filter for `rbx forward`) |

## Running

From the monorepo root:

```bash
export EGRESS_PROXY_JWT_SECRET="$(gcloud secrets versions access latest \
  --project=<proj> --secret=egress-proxy-jwt-secret)"
export RUBY_API_KEY=sk-...
export RUBY_WORKSPACE_ID=...

./cli/ruby-sandbox/e2e/run.sh         # matrix + streaming
./cli/ruby-sandbox/e2e/run.sh matrix  # just the matrix
./cli/ruby-sandbox/e2e/run.sh streaming
```

`run.sh` builds the image on each invocation (docker layer cache makes
subsequent builds fast) and runs with `--cap-add=NET_ADMIN` so iptables works
inside the container.

## How it works

- Stage 1 of the Dockerfile builds the `rbx` binary from the current tree.
- Stage 2 (the runtime image) installs `iptables` + `bun`, creates a `ruby-fwd`
  system user (uid 3000), and copies in `rbx`, `smoke.ts`, `case.ts`, and
  `entrypoint.sh`.
- `entrypoint.sh` (root) installs the iptables `REDIRECT` rules, then execs
  the bun orchestrator (`smoke.ts`).
- `smoke.ts` (root) mints a per-case JWT, writes it to the forwarder's token
  file, spawns `rbx forward`, then uses
  `runuser --preserve-environment -u ruby-fwd -- bun /app/case.ts …` to drop
  to `ruby-fwd` and issue the actual HTTPS request. Between JWT-variant cases
  it tears down and respawns `rbx forward` so the new token is picked up
  (token-file hot-reload is out of scope in the forwarder for now).
- For every DENY case, `smoke.ts` reads `/tmp/ruby-egress-denied.log` and
  asserts the expected structured JSON entry is present.
