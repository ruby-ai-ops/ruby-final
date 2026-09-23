import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["migrations/*.ts", "scripts/**/*.ts", "src/admin/db.ts"],
  ignoreFiles: [
    "src/connectors/ruby_project/**",
    "src/resources/ruby_project_configuration_resource.ts",
    "src/resources/ruby_project_conversation_resource.ts",
    "src/resources/ruby_project_mount_file_resource.ts",
    "src/lib/conversation_rendering.ts",
  ],
  project: ["**/*.{js,jsx,ts,tsx}"],
  rules: {
    binaries: "off",
    exports: "off",
  },
  ignoreDependencies: [
    "@types/eslint",
    "@typescript-eslint/parser",
    "@ruby-ai/client",
    "@eslint/js",
    "pino-pretty",
    "danger",
    "tsconfig-paths-webpack-plugin",
  ],
  paths: {
    "@connectors/*": ["./src/*"],
  },
};

export default config;
