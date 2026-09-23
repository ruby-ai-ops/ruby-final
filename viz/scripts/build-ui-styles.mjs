import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { scopeRubyUI } from "./scope-ui.mjs";

const require = createRequire(import.meta.url);
const source = require.resolve("@ruby-ai/ui/dist/ui.css");
const output = new URL(
  "../app/styles/ui-scoped.generated.css",
  import.meta.url
);
const css = await readFile(source, "utf8");
await writeFile(output, scopeRubyUI(css));
