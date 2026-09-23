import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIRECTORY = path.resolve(__dirname, "../../../../../.artifacts/sandbox");

/** Image assembly receives authenticated CI artifacts; it never downloads releases. */
export function readSandboxArtifact(
  name: "rbx" | "apply_patch",
  version: string,
  directory = ARTIFACT_DIRECTORY
): Buffer {
  const manifest: unknown = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json"), "utf8"));
  if (typeof manifest !== "object" || manifest === null || !(name in manifest)) {
    throw new Error(`Missing sandbox artifact manifest entry: ${name}`);
  }
  const entry = (manifest as Record<string, unknown>)[name];
  if (typeof entry !== "object" || entry === null || !("version" in entry) || entry.version !== version) {
    throw new Error(`Sandbox artifact version mismatch: ${name}; rebuild the pinned artifacts`);
  }
  const binary = fs.readFileSync(path.join(directory, `${name}-linux-x86_64`));
  const digest = createHash("sha256").update(binary).digest("hex");
  if (!("sha256" in entry) || entry.sha256 !== digest) {
    throw new Error(`Sandbox artifact checksum mismatch: ${name}`);
  }
  if (!binary.subarray(0, 4).equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46]))) {
    throw new Error(`Sandbox artifact must be a Linux ELF executable: ${name}`);
  }
  return binary;
}
