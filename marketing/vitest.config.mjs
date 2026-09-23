import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const marketingRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: marketingRoot,
  plugins: [react()],
  resolve: {
    alias: {
      "@marketing": marketingRoot,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
