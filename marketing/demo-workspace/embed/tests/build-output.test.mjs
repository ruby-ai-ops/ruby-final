import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const embedRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const demoRoot = path.resolve(embedRoot, "..");
const outputRoot = path.resolve(
  embedRoot,
  "../../public/static/workspace-demo"
);

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path.join(directory, entry.name), relativePath)));
    } else {
      files.push(relativePath);
    }
  }
  return files.sort();
}

test("the production embed is self-contained except for live Google Maps", async () => {
  const files = await listFiles(outputRoot);
  const textFiles = files.filter((file) => /\.(?:css|html|js)$/.test(file));
  let bundledText = "";
  for (const file of textFiles) {
    bundledText += await readFile(path.join(outputRoot, ...file.split("/")), "utf8");
  }

  assert.equal(files.includes("index.html"), true);
  assert.equal(files.includes("ruby-logo.png"), true);
  assert.equal(files.includes("fonts/RubySerif.ttf"), true);
  assert.equal(files.includes("fonts/Sohne-Regular.ttf"), true);
  assert.equal(files.includes("demo-logistics/truck-eg-4821.webp"), true);
  assert.match(bundledText, /workspace-demo:ready/);
  assert.match(bundledText, /https:\/\/www\.google\.com\/maps/);
  assert.doesNotMatch(
    bundledText,
    /i\.pravatar\.cc|images\.unsplash\.com|img\.icons8\.com|google\.com\/s2\/favicons|cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome/
  );
  assert.doesNotMatch(bundledText, /localhost:3000|everglade-preview/);
  assert.doesNotMatch(
    bundledText,
    /["'`]\/(?:demo-cedarshield|demo-harborview|demo-keyline)\//
  );
  const publicEntries = await readdir(
    path.join(demoRoot, "upstream", "public"),
    { withFileTypes: true }
  );
  for (const entry of publicEntries) {
    const rawAssetRoot = entry.isDirectory()
      ? `/${entry.name}/`
      : `/${entry.name}`;
    for (const quote of ['"', "'", "`"]) {
      assert.equal(
        bundledText.includes(`${quote}${rawAssetRoot}`),
        false,
        rawAssetRoot
      );
    }
  }
  for (const assetDirectory of [
    "demo-cedarshield",
    "demo-harborview",
    "demo-keyline",
  ]) {
    assert.match(
      bundledText,
      new RegExp(`/static/workspace-demo/${assetDirectory}/`)
    );
  }

  const manifest = JSON.parse(
    await readFile(path.join(demoRoot, "asset-manifest.json"), "utf8")
  );
  for (const asset of manifest.assets) {
    const relativePublicPath = asset.publicPath.replace(
      "/static/workspace-demo/",
      ""
    );
    const metadata = await stat(
      path.join(outputRoot, ...relativePublicPath.split("/"))
    );
    assert.equal(metadata.size, asset.bytes, asset.publicPath);
  }
});
