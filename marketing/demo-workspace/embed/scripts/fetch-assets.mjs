import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const embedRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const demoRoot = path.resolve(embedRoot, "..");
const upstreamAppRoot = path.join(demoRoot, "upstream", "app");
const bundledRoot = path.join(embedRoot, "bundled-assets");
const resolvedBundledRoot = path.resolve(bundledRoot);
const fontAwesomeCssUrl =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
const fontAwesomeLicenseUrl =
  "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.7.2/LICENSE.txt";
const bundledHosts = new Set([
  "i.pravatar.cc",
  "images.unsplash.com",
  "img.icons8.com",
]);

if (!resolvedBundledRoot.startsWith(`${embedRoot}${path.sep}`)) {
  throw new Error("Refusing to replace an unsafe bundled asset path");
}

const readSource = (file) => readFile(path.join(upstreamAppRoot, file), "utf8");
const pageSource = await readSource("page.tsx");
const scenarioSource = await readSource("demo-scenarios.ts");
const integrationSource = await readSource("integration-icon.tsx");

function extractRemoteLiterals(source) {
  return [...source.matchAll(/https:\/\/[^'"\s)]+/g)]
    .map((match) => match[0])
    .filter((url) => bundledHosts.has(new URL(url).hostname));
}

function extractIntegrationSources(source) {
  const objectStart = source.indexOf("const integrationDomains");
  const objectEnd = source.indexOf("};", objectStart);
  if (objectStart < 0 || objectEnd < 0) {
    throw new Error("Could not find the integration domain registry");
  }
  const objectSource = source.slice(objectStart, objectEnd);
  return [
    ...objectSource.matchAll(
      /(?:^|,)\s*(?:'([^']+)'|([A-Za-z][A-Za-z0-9]*)):\s*'([^']+)'/gm
    ),
  ]
    .map((match) => ({
      label: match[1] ?? match[2],
      domain: match[3],
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extensionFor(mimeType, sourceUrl) {
  const extensionByMimeType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "font/woff2": ".woff2",
    "font/woff": ".woff",
    "application/font-woff": ".woff",
    "application/octet-stream": path.extname(new URL(sourceUrl).pathname),
    "text/css": ".css",
    "text/plain": ".txt",
  };
  const extension = extensionByMimeType[mimeType];
  if (!extension) {
    throw new Error(`Unsupported asset type ${mimeType} from ${sourceUrl}`);
  }
  return extension;
}

async function downloadAsset({ source, directory, stem, kind, label }) {
  const response = await fetch(source, {
    headers: { "user-agent": "Ruby marketing workspace asset packager" },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${source}: HTTP ${response.status}`);
  }
  const contents = Buffer.from(await response.arrayBuffer());
  if (contents.length === 0) {
    throw new Error(`Downloaded an empty asset from ${source}`);
  }
  const mimeType = (response.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  const extension = extensionFor(mimeType, source);
  const relativePath = path.posix.join(directory, `${stem}${extension}`);
  const absolutePath = path.join(
    resolvedBundledRoot,
    ...relativePath.split("/")
  );
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, contents);
  return {
    kind,
    ...(label ? { label } : {}),
    source,
    localPath: path.posix.join("embed", "bundled-assets", relativePath),
    publicPath: `/static/workspace-demo/bundled/${relativePath}`,
    mimeType,
    bytes: contents.length,
    sha256: createHash("sha256").update(contents).digest("hex"),
  };
}

await rm(resolvedBundledRoot, { force: true, recursive: true });
await mkdir(resolvedBundledRoot, { recursive: true });

const assets = [];
const remoteLiterals = [
  ...new Set([
    ...extractRemoteLiterals(pageSource),
    ...extractRemoteLiterals(scenarioSource),
  ]),
].sort();
for (const source of remoteLiterals) {
  assets.push(
    await downloadAsset({
      source,
      directory: "remote",
      stem: createHash("sha256").update(source).digest("hex").slice(0, 16),
      kind: "literal",
    })
  );
}

for (const { label, domain } of extractIntegrationSources(integrationSource)) {
  const source = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  assets.push(
    await downloadAsset({
      source,
      directory: "integrations",
      stem: `${slugify(label)}-${createHash("sha256")
        .update(source)
        .digest("hex")
        .slice(0, 8)}`,
      kind: "integration-icon",
      label,
    })
  );
}

const fontAwesomeCssAsset = await downloadAsset({
  source: fontAwesomeCssUrl,
  directory: "fontawesome/css",
  stem: "all.min",
  kind: "fontawesome-css",
});
assets.push(fontAwesomeCssAsset);
const fontAwesomeCss = await readFile(
  path.join(demoRoot, ...fontAwesomeCssAsset.localPath.split("/")),
  "utf8"
);
const fontAwesomeFontFiles = [
  ...new Set(
    [...fontAwesomeCss.matchAll(/url\(\.\.\/webfonts\/([^)]+)\)/g)].map(
      (match) => match[1]
    )
  ),
].sort();
for (const filename of fontAwesomeFontFiles) {
  const source = new URL(`../webfonts/${filename}`, fontAwesomeCssUrl).href;
  assets.push(
    await downloadAsset({
      source,
      directory: "fontawesome/webfonts",
      stem: path.parse(filename).name,
      kind: "fontawesome-font",
    })
  );
}
assets.push(
  await downloadAsset({
    source: fontAwesomeLicenseUrl,
    directory: "fontawesome",
    stem: "LICENSE",
    kind: "license",
  })
);

assets.sort((left, right) => left.localPath.localeCompare(right.localPath));
await writeFile(
  path.join(demoRoot, "asset-manifest.json"),
  `${JSON.stringify({ version: 1, assets }, null, 2)}\n`,
  "utf8"
);
process.stdout.write(`Bundled and verified ${assets.length} remote assets.\n`);
