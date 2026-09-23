import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const embedRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const demoRoot = path.resolve(embedRoot, "..");
const generatedPublicRoot = path.join(embedRoot, ".generated-public");
const resolvedGeneratedPublicRoot = path.resolve(generatedPublicRoot);

if (!resolvedGeneratedPublicRoot.startsWith(`${embedRoot}${path.sep}`)) {
  throw new Error("Refusing to replace an unsafe generated public path");
}

await rm(resolvedGeneratedPublicRoot, { force: true, recursive: true });
await mkdir(resolvedGeneratedPublicRoot, { recursive: true });
await cp(
  path.join(demoRoot, "upstream", "public"),
  resolvedGeneratedPublicRoot,
  { recursive: true }
);
await cp(
  path.join(embedRoot, "bundled-assets"),
  path.join(resolvedGeneratedPublicRoot, "bundled"),
  { recursive: true }
);

process.stdout.write("Prepared the workspace demo public asset tree.\n");
