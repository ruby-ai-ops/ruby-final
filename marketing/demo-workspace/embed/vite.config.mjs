import react from "@vitejs/plugin-react";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { adaptStreamingSource } from "./scripts/streaming-transform.mjs";

const embedRoot = path.dirname(fileURLToPath(import.meta.url));
const demoRoot = path.resolve(embedRoot, "..");
const upstreamRoot = path.join(demoRoot, "upstream");
const publicPrefix = "/static/workspace-demo";

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

export default defineConfig(async () => {
  const assetManifest = JSON.parse(
    await readFile(path.join(demoRoot, "asset-manifest.json"), "utf8")
  );
  const localPublicFiles = await listFiles(path.join(upstreamRoot, "public"));
  const localAssetReplacements = [
    ...new Map(
      localPublicFiles.map((relativePath) => {
        const [rootEntry, ...nestedPath] = relativePath.split("/");
        const source =
          nestedPath.length > 0 ? `/${rootEntry}/` : `/${rootEntry}`;
        return [
          source,
          {
            source,
            target: `${publicPrefix}${source}`,
          },
        ];
      })
    ).values(),
  ];
  const literalAssetReplacements = assetManifest.assets
    .filter((asset) => asset.kind === "literal")
    .map((asset) => ({ source: asset.source, target: asset.publicPath }));
  const integrationIconSources = Object.fromEntries(
    assetManifest.assets
      .filter((asset) => asset.kind === "integration-icon")
      .map((asset) => [asset.label, asset.publicPath])
  );
  const replacements = [
    ...localAssetReplacements,
    ...literalAssetReplacements,
  ].sort((left, right) => right.source.length - left.source.length);
  const integrationIconPath = path.normalize(
    path.join(upstreamRoot, "app", "integration-icon.tsx")
  );

  return {
    root: embedRoot,
    base: `${publicPrefix}/`,
    publicDir: path.join(embedRoot, ".generated-public"),
    plugins: [
      react(),
      {
        name: "workspace-demo-local-assets",
        enforce: "pre",
        transform(source, id) {
          const normalizedId = path.normalize(id.split("?", 1)[0]);
          if (!normalizedId.startsWith(path.normalize(upstreamRoot))) {
            return null;
          }

          let transformed = adaptStreamingSource(source, normalizedId.replaceAll(path.sep, "/"));
          for (const replacement of replacements) {
            transformed = transformed.replaceAll(
              replacement.source,
              replacement.target
            );
          }

          if (normalizedId === integrationIconPath) {
            const importMarker =
              "import type { IntegrationId } from './demo-scenarios';";
            const remoteSource =
              "const source = `https://www.google.com/s2/favicons?domain=${integrationDomains[label]}&sz=64`;";
            if (
              !transformed.includes(importMarker) ||
              !transformed.includes(remoteSource)
            ) {
              throw new Error(
                "The integration icon adapter no longer matches the copied source"
              );
            }
            transformed = transformed.replace(
              importMarker,
              `${importMarker}\n\nconst WORKSPACE_DEMO_INTEGRATION_ICONS: Record<IntegrationId, string> = ${JSON.stringify(integrationIconSources)};`
            );
            transformed = transformed.replace(
              remoteSource,
              "const source = WORKSPACE_DEMO_INTEGRATION_ICONS[label];"
            );
          }

          return { code: transformed, map: null };
        },
      },
    ],
    resolve: {
      alias: [
        { find: "@workspace-autoplay", replacement: path.join(embedRoot, "src", "autoplay.tsx") },
        { find: "@workspace-stream", replacement: path.join(embedRoot, "src", "streaming.tsx") },
        { find: "@workspace-overrides", replacement: path.join(embedRoot, "src", "scenario-overrides.tsx") },
        { find: "@workspace-northstar", replacement: path.join(embedRoot, "src", "northstar-widgets.tsx") },
        { find: "@workspace-meadow", replacement: path.join(embedRoot, "src", "meadow-widgets.tsx") },
        { find: "@workspace-vector", replacement: path.join(embedRoot, "src", "vector-widgets.tsx") },
        { find: "@workspace-industry", replacement: path.join(embedRoot, "src", "remaining-industry-widgets.tsx") },
        { find: "@", replacement: upstreamRoot },
        {
          find: "react-dom",
          replacement: path.join(embedRoot, "node_modules", "react-dom"),
        },
        {
          find: "react",
          replacement: path.join(embedRoot, "node_modules", "react"),
        },
        {
          find: "recharts",
          replacement: path.join(embedRoot, "node_modules", "recharts"),
        },
      ],
    },
    build: {
      outDir: path.resolve(embedRoot, "../../public/static/workspace-demo"),
      emptyOutDir: true,
      sourcemap: false,
    },
  };
});
