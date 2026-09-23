import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { readSandboxArtifact } from "./artifacts";

const temporaryDirectories: string[] = [];
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("sandbox artifacts", () => {
  it("rejects missing artifacts before image assembly", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ruby-artifact-"));
    temporaryDirectories.push(directory);
    expect(() => readSandboxArtifact("rbx", "1", directory)).toThrow();
  });

  it("accepts the pinned binary and rejects stale versions or tampering", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ruby-artifact-"));
    temporaryDirectories.push(directory);
    const binary = Buffer.from([0x7f, 0x45, 0x4c, 0x46, 1]);
    fs.writeFileSync(path.join(directory, "rbx-linux-x86_64"), binary);
    fs.writeFileSync(path.join(directory, "manifest.json"), JSON.stringify({
      rbx: { version: "1", sha256: createHash("sha256").update(binary).digest("hex") },
    }));
    expect(readSandboxArtifact("rbx", "1", directory)).toEqual(binary);
    expect(() => readSandboxArtifact("rbx", "2", directory)).toThrow(/version/);
    fs.appendFileSync(path.join(directory, "rbx-linux-x86_64"), "changed");
    expect(() => readSandboxArtifact("rbx", "1", directory)).toThrow(/checksum/);
  });
});
