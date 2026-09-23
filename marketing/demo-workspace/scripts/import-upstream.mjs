import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const demoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const upstreamRoot = path.join(demoRoot, "upstream");
const sourceFlagIndex = process.argv.indexOf("--source");
const sourceArgument =
  sourceFlagIndex >= 0 ? process.argv[sourceFlagIndex + 1] : undefined;

if (!sourceArgument) {
  throw new Error("Usage: node scripts/import-upstream.mjs --source <directory>");
}

const sourceRoot = path.resolve(sourceArgument);
const resolvedUpstreamRoot = path.resolve(upstreamRoot);
if (
  !resolvedUpstreamRoot.startsWith(`${demoRoot}${path.sep}`) ||
  resolvedUpstreamRoot === sourceRoot
) {
  throw new Error("Refusing to replace an unsafe upstream snapshot path");
}

const sourceEntries = [
  "app",
  "components",
  "hooks",
  "lib",
  "public",
  "tests",
  ".gitignore",
  ".oxfmtrc.json",
  ".oxlintrc.json",
  "components.json",
  "next.config.ts",
  "package-lock.json",
  "package.json",
  "tsconfig.json",
  "vite.config.ts",
  "vitest.config.ts",
];

await rm(resolvedUpstreamRoot, { force: true, recursive: true });
await mkdir(resolvedUpstreamRoot, { recursive: true });

for (const entry of sourceEntries) {
  const sourcePath = path.join(sourceRoot, entry);
  const destinationPath = path.join(resolvedUpstreamRoot, entry);
  await cp(sourcePath, destinationPath, {
    errorOnExist: true,
    force: false,
    recursive: true,
  });
}

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name);
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, relativePath)));
    } else {
      files.push(relativePath);
    }
  }
  return files.sort();
}

const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: sourceRoot,
  encoding: "utf8",
}).trim();
const sourceStatus = execFileSync("git", ["status", "--short"], {
  cwd: sourceRoot,
  encoding: "utf8",
})
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);
const files = [];
for (const relativePath of await listFiles(resolvedUpstreamRoot)) {
  const absolutePath = path.join(
    resolvedUpstreamRoot,
    ...relativePath.split("/")
  );
  const contents = await readFile(absolutePath);
  const metadata = await stat(absolutePath);
  files.push({
    path: relativePath,
    bytes: metadata.size,
    sha256: createHash("sha256").update(contents).digest("hex"),
  });
}

await writeFile(
  path.join(demoRoot, "provenance.json"),
  `${JSON.stringify(
    {
      sourcePath: sourceRoot.replaceAll(path.sep, "/"),
      sourceCommit,
      sourceStatus,
      files,
    },
    null,
    2
  )}\n`,
  "utf8"
);

process.stdout.write(
  `Copied ${files.length} files from ${sourceRoot} at ${sourceCommit}.\n`
);
