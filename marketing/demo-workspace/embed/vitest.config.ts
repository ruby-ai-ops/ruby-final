import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { adaptStreamingSource } from "./scripts/streaming-transform.mjs";

const embedRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: embedRoot,
  plugins: [
    react(),
    {
      name: "test-streaming-adapter",
      enforce: "pre",
      transform(source, id) {
        return adaptStreamingSource(
          source,
          id.split("?", 1)[0].replaceAll(path.sep, "/"),
          { streaming: !id.includes("?unstreamed") }
        );
      },
    },
  ],
  resolve: {
    alias: [
      {
        find: "@workspace-autoplay",
        replacement: path.join(embedRoot, "src", "autoplay.tsx"),
      },
      {
        find: "@workspace-stream",
        replacement: path.join(embedRoot, "src", "streaming.tsx"),
      },
      {
        find: "@workspace-overrides",
        replacement: path.join(embedRoot, "src", "scenario-overrides.tsx"),
      },
      {
        find: "@workspace-northstar",
        replacement: path.join(embedRoot, "src", "northstar-widgets.tsx"),
      },
      {
        find: "@workspace-meadow",
        replacement: path.join(embedRoot, "src", "meadow-widgets.tsx"),
      },
      {
        find: "@workspace-vector",
        replacement: path.join(embedRoot, "src", "vector-widgets.tsx"),
      },
      {
        find: "@workspace-industry",
        replacement: path.join(
          embedRoot,
          "src",
          "remaining-industry-widgets.tsx"
        ),
      },
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
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: [path.join(embedRoot, "tests/setup.ts")],
  },
});
