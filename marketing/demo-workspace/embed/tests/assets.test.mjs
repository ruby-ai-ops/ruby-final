import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const embedRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const demoRoot = path.resolve(embedRoot, "..");
const upstreamAppRoot = path.join(demoRoot, "upstream", "app");
const bundledHosts = new Set([
  "i.pravatar.cc",
  "images.unsplash.com",
  "img.icons8.com",
]);

async function sourceText(file) {
  return readFile(path.join(upstreamAppRoot, file), "utf8");
}

function remoteLiterals(source) {
  return [...source.matchAll(/https:\/\/[^'"\s)]+/g)]
    .map((match) => match[0])
    .filter((url) => bundledHosts.has(new URL(url).hostname));
}

function integrationLabels(source) {
  const objectStart = source.indexOf("const integrationDomains");
  const objectEnd = source.indexOf("};", objectStart);
  const objectSource = source.slice(objectStart, objectEnd);
  return [
    ...objectSource.matchAll(
      /(?:^|,)\s*(?:'([^']+)'|([A-Za-z][A-Za-z0-9]*)):\s*'([^']+)'/gm
    ),
  ]
    .map((match) => match[1] ?? match[2])
    .sort();
}

test("all remote image and font dependencies are bundled with verified hashes", async () => {
  const manifest = JSON.parse(
    await readFile(path.join(demoRoot, "asset-manifest.json"), "utf8")
  );
  const pageSource = await sourceText("page.tsx");
  const scenarioSource = await sourceText("demo-scenarios.ts");
  const integrationSource = await sourceText("integration-icon.tsx");
  const requiredRemoteUrls = [
    ...new Set([
      ...remoteLiterals(pageSource),
      ...remoteLiterals(scenarioSource),
    ]),
  ].sort();
  const literalAssets = manifest.assets
    .filter((asset) => asset.kind === "literal")
    .map((asset) => asset.source)
    .sort();
  const iconLabels = manifest.assets
    .filter((asset) => asset.kind === "integration-icon")
    .map((asset) => asset.label)
    .sort();

  assert.deepEqual(literalAssets, requiredRemoteUrls);
  const requiredIconLabels = integrationLabels(integrationSource);
  assert.equal(requiredIconLabels.length, 66);
  assert.deepEqual(iconLabels, requiredIconLabels);
  assert.equal(
    manifest.assets.some(
      (asset) =>
        asset.source ===
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    ),
    true
  );

  for (const asset of manifest.assets) {
    assert.match(asset.publicPath, /^\/static\/workspace-demo\/bundled\//);
    const absolutePath = path.join(
      demoRoot,
      ...asset.localPath.split("/")
    );
    const contents = await readFile(absolutePath);
    const metadata = await stat(absolutePath);
    assert.equal(metadata.size, asset.bytes, asset.localPath);
    assert.equal(
      createHash("sha256").update(contents).digest("hex"),
      asset.sha256,
      asset.localPath
    );
  }
});
