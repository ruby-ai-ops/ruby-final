import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const marketingRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const repositoryRoot = path.resolve(marketingRoot, "..");

test("production builds use an output directory isolated from the dev server", async () => {
  const nextConfig = await readFile(
    path.join(marketingRoot, "next.config.js"),
    "utf8"
  );
  const marketingGitignore = await readFile(
    path.join(marketingRoot, ".gitignore"),
    "utf8"
  );
  const marketingPackage = JSON.parse(
    await readFile(path.join(marketingRoot, "package.json"), "utf8")
  );
  const marketingWorkflow = await readFile(
    path.join(
      repositoryRoot,
      ".github",
      "workflows",
      "ruby-ci.yml"
    ),
    "utf8"
  );
  const dockerfile = await readFile(
    path.join(repositoryRoot, "dockerfiles", "marketing.Dockerfile"),
    "utf8"
  );

  assert.match(
    nextConfig,
    /distDir:\s*isDev\s*\?\s*"\.next"\s*:\s*"\.next-build"/
  );
  assert.match(marketingGitignore, /^\/\.next-build\/$/m);
  assert.match(dockerfile, /\/app\/marketing\/\.next-build\/standalone/);
  assert.match(dockerfile, /\/app\/marketing\/\.next-build\/static/);
  assert.doesNotMatch(dockerfile, /\/app\/marketing\/\.next\/standalone/);
  const embedBuildIndex = dockerfile.indexOf(
    "npm --prefix demo-workspace/embed run build"
  );
  const testRemovalIndex = dockerfile.indexOf(
    'RUN find . -name "*.test.ts" -delete'
  );
  assert.ok(embedBuildIndex >= 0);
  assert.ok(testRemovalIndex > embedBuildIndex);
  assert.equal(
    marketingPackage.scripts["test:workspace-demo-host"],
    "vitest run --config vitest.config.mjs components/home/content/Product/HomeWorkspaceDemo.test.tsx components/home/content/Product/HomeTeamUsageSection.test.tsx"
  );
  assert.match(marketingWorkflow, /build-component\.mjs/);
  const buildComponents = await readFile(path.join(repositoryRoot, "maintenance/upstream/build-component.mjs"), "utf8");
  assert.match(buildComponents, /test:workspace-demo-host/);
});
