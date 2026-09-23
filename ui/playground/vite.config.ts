import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3008,
    open: true,
  },
  resolve: {
    alias: {
      "@ruby-ai/ui": path.resolve(__dirname, "../src"),
      "@ui": path.resolve(__dirname, "../src"),
    },
  },
});
