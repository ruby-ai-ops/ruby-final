#!/usr/bin/env bun
// Runs as `ruby-fwd` (uid 3000). iptables REDIRECTs outbound TCP from this uid
// on dports 80/443 to 127.0.0.1:9990 (where `rbx forward` listens), so a
// plain `fetch("https://ruby.ad/")` here exercises the full forward -> proxy
// path. Called by smoke.ts via `runuser --preserve-environment`.

import { RubyAPI } from "@ruby-ai/client";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`missing required env: ${name}`);
    process.exit(2);
  }
  return value;
}

async function cmdFetch(): Promise<void> {
  const url = process.argv[3];
  if (!url) {
    console.error("usage: bun case.ts fetch <url>");
    process.exit(2);
  }
  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    console.log(`status=${response.status}`);
    response.body?.cancel();
    process.exit(response.status >= 200 && response.status < 400 ? 0 : 1);
  } catch (err) {
    console.error(
      `fetch error: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }
}

async function cmdStream(): Promise<void> {
  const workspaceId = requireEnv("RUBY_WORKSPACE_ID");
  const apiKey = requireEnv("RUBY_API_KEY");
  const agentId = process.env.RUBY_AGENT_ID ?? "ruby";
  const baseUrl = process.env.RUBY_API_BASE_URL ?? "https://ruby.ad";
  const prompt =
    process.env.RUBY_AGENT_PROMPT ??
    "Write a short four-line poem about the ocean.";

  const client = new RubyAPI({ workspaceId, apiKey, baseUrl });
  const stream = client.agents.streamMessage({ agentId, message: prompt });

  let tokens = 0;
  let text = "";

  try {
    for await (const event of stream) {
      switch (event.type) {
        case "text":
          tokens += 1;
          text += event.delta;
          process.stdout.write(event.delta);
          break;
        case "error":
          process.stdout.write("\n");
          console.error(
            `agent error: ${event.error?.message ?? JSON.stringify(event.error)}`
          );
          process.exit(1);
        case "done":
          process.stdout.write("\n");
          break;
        default:
          break;
      }
    }
  } catch (err) {
    process.stdout.write("\n");
    console.error(
      `stream error: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }

  if (tokens === 0 || text.trim().length === 0) {
    console.error("no tokens received from agent");
    process.exit(1);
  }
  console.log(`tokens=${tokens} chars=${text.length}`);
  process.exit(0);
}

const command = process.argv[2];
switch (command) {
  case "fetch":
    await cmdFetch();
    break;
  case "stream":
    await cmdStream();
    break;
  default:
    console.error("usage: bun case.ts <fetch|stream> [args]");
    process.exit(2);
}
