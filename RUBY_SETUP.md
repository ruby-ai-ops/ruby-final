# Ruby AI setup and release gate

Repository: `ruby-ai-ops/ruby-final` (private). Production branch: `ruby-main`. Node **24.16.0**, npm **11.11.0**. Install with `npm ci`; Ruby packages resolve from this repository's workspaces. The imported marketing demo installs separately through `npm -w marketing run demo:prepare` and preserves its React 19 runtime.

The rebrand does not provision infrastructure or deploy anything. Local Docker is not required. GitHub CI uses isolated service containers for database tests; application hosting remains your choice.

## Ruby configuration

Use Ruby-owned accounts and secrets. Do not reuse upstream credentials or IDs. Supply at least:

- Public URLs: `NEXT_PUBLIC_RUBY_APP_URL=https://app.ruby.ad`, `NEXT_PUBLIC_RUBY_API_URL=https://app.ruby.ad`, `NEXT_PUBLIC_RUBY_STATIC_WEBSITE_URL=https://ruby.ad`, `ADMIN_APP_URL=https://admin.ruby.ad`, `RUBY_US_URL=https://app.ruby.ad`. Set the corresponding build-time extension variables too.
- Authentication: WorkOS client ID, API key, AuthKit domain, cookie/session secrets, connector OAuth clients and callback registrations under `app.ruby.ad`. Admin requires its existing Cloudflare Access and super-user checks; configure Ruby's audience/team and authorized accounts.
- Data/services: PostgreSQL databases for front/connectors/core OAuth, Redis, Elasticsearch, Qdrant, Temporal namespaces/queues, object storage buckets and service identities. Configure `CORE_API`, `OAUTH_API`, `CONNECTORS_API`, private service secrets and encryption keys through each component's configuration module.
- AI providers: the providers you enable need Ruby-owned API keys, quotas and billing. Sandbox providers require credentials, built base images, egress policy, signing keys and storage access.
- Region/cells: the initial deployment uses `REGION=us-central1`, `CELL=cell-00000`. Additional cells require explicit URLs and services; the architecture's regional support is retained, while marketing signup goes directly to the Ruby app.
- Optional marketing: Contentful space/token for CMS content; `HUBSPOT_PORTAL_ID`, `HUBSPOT_CONTACT_FORM_ID`, `HUBSPOT_PARTNER_FORM_ID` for contact forms. Default.com scheduling uses `NEXT_PUBLIC_DEFAULT_FORM_ID` and `NEXT_PUBLIC_DEFAULT_TEAM_ID`. Missing contact configuration returns an error rather than sending leads elsewhere. Analytics uses optional Ruby PostHog/Datadog/GTM inputs.
- Extension publication: register a new Ruby extension. Set `NEXT_PUBLIC_CHROME_EXTENSION_URL` / `NEXT_PUBLIC_FIREFOX_EXTENSION_URL` after publication and `RUBY_CHROME_EXTENSION_IDS` to the approved Chrome IDs. The upstream Chrome key/store identity is removed; no unpublished Ruby store listing is assumed.

See the existing component configuration modules for provider-specific variables. Do not put secret values in tracked files. Public browser configuration belongs in build-time inputs; server secrets belong in the hosting secret store.

## Sandbox artifacts

Run the manual **Ruby sandbox artifacts** workflow. It builds `rbx` from this source and `apply_patch` from the pinned OpenAI source, preserving its notice. Download the private artifact with authenticated GitHub access into `.artifacts/sandbox/` before sandbox-image assembly. The loader verifies version, SHA-256 and ELF format before copying binaries as root-owned executables. It never downloads from nonexistent public releases. Build and register Ruby's base/bedrock images before enabling sandbox execution.

## Release checklist

1. Enable a repository rule on `ruby-main`: require a pull request, at least one human approval, dismissal of stale approvals, the **Ruby release gate** status check, and no force pushes/deletions or bypass by automation. Keep auto-merge disabled. A plan limitation that prevents enforced private-branch rules is a release blocker.
2. Run Ruby CI on the exact candidate commit. Branding/idempotence, SDK/UI builds, application/admin/API, marketing/demo, connectors, extension, viz, Rust and sandbox checks must pass. CI contains no deployment step.
3. Configure Ruby services and authenticated sandbox artifacts, then perform the separate local end-to-end stage without Docker: login, workspace creation, conversation, ingestion, connector operation, jobs and sandbox execution.
4. Validate hosting, DNS, TLS, callbacks and backups before authorizing production release. Passing a rebrand build is not deployment validation.

Hosting and paid resource creation remain deferred. This guide describes required inputs, not services that already exist.

Verified repository limitation: GitHub currently reports that private-repository rulesets are not enforced on the current account plan. Production release is blocked until enforced protection is available and configured; creating a rule alone does not satisfy this requirement.
