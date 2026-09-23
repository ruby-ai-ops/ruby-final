import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const demoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const upstreamRoot = path.join(demoRoot, "upstream");
const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".vinext",
  ".wrangler",
  "dist",
  "node_modules",
  "work",
  ".openai",
]);

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }
    const relativePath = path.posix.join(prefix, entry.name);
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await listFiles(absolutePath, relativePath)));
    } else {
      paths.push(relativePath);
    }
  }
  return paths.sort();
}

test("the copied demo matches its recorded source snapshot", async () => {
  const provenance = JSON.parse(
    await readFile(path.join(demoRoot, "provenance.json"), "utf8")
  );
  const copiedFiles = await listFiles(upstreamRoot);

  assert.equal(provenance.sourceCommit.length, 40);
  assert.deepEqual(
    copiedFiles,
    provenance.files.map((file) => file.path)
  );

  for (const file of provenance.files) {
    const absolutePath = path.join(upstreamRoot, ...file.path.split("/"));
    const contents = await readFile(absolutePath);
    const metadata = await stat(absolutePath);
    assert.equal(metadata.size, file.bytes, file.path);
    assert.equal(
      createHash("sha256").update(contents).digest("hex"),
      file.sha256,
      file.path
    );
  }
});

test("the source snapshot excludes generated, installed, and hosted state", async () => {
  const copiedFiles = await listFiles(upstreamRoot);
  const forbiddenSegments = [
    "/.git/",
    "/.next/",
    "/.vinext/",
    "/.wrangler/",
    "/dist/",
    "/node_modules/",
    "/work/",
    "/.openai/",
  ];

  for (const copiedFile of copiedFiles) {
    const normalizedPath = `/${copiedFile}/`;
    assert.equal(
      forbiddenSegments.some((segment) => normalizedPath.includes(segment)),
      false,
      copiedFile
    );
    assert.equal(/(^|\/)\.env(?:\.|$)/.test(copiedFile), false, copiedFile);
  }

  for (const requiredPath of [
    "app/page.tsx",
    "app/demo-scenarios.ts",
    "app/globals.css",
    "package.json",
    "package-lock.json",
    "public/fonts/RubySerif.ttf",
    "public/fonts/Sohne-Regular.ttf",
    "tests/scenario-library.test.ts",
  ]) {
    assert.equal(copiedFiles.includes(requiredPath), true, requiredPath);
  }
});
