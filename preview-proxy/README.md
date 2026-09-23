# SPA Preview Proxy

Cloudflare Worker that proxies `<branch>.preview.ruby.ad` to the corresponding Cloudflare Pages preview deployment at `<branch>.app-ruby-ai.pages.dev`.

This allows testing SPA branches on a `.ruby.ad` subdomain so that cookies (auth, sessions) are sent to the API.

## How it works

```
Browser → my-branch.preview.ruby.ad → CF Worker → my-branch.app-ruby-ai.pages.dev
                                          ↑
                                cookies on .ruby.ad are sent ✅
```

The `*.preview.ruby.ad` DNS record and Zero Trust access policy are managed in `ruby-infra` (Terraform). The Worker is deployed separately via Wrangler.

## Deploy

```bash
npm install
npx wrangler login   # one-time
npx wrangler deploy
```

## Local dev

```bash
npx wrangler dev
```
