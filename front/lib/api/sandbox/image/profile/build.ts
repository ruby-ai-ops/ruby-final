import { runCachedBunBuild } from "@app/lib/api/sandbox/image/bun_build";
import path from "path";

const PROFILE_SRC_DIR = path.join(__dirname, "src");
const FRONT_ROOT_DIR = path.resolve(__dirname, "../../../../..");
const RUBY_TOOLS_ENTRYPOINT = path.join(PROFILE_SRC_DIR, "index.ts");

export function buildRubyToolsBinary(): Buffer {
  return runCachedBunBuild({
    name: "the sandbox ruby-tools binary",
    entrypoint: RUBY_TOOLS_ENTRYPOINT,
    srcDir: PROFILE_SRC_DIR,
    // Dependency bumps in front change the compiled binary.
    extraHashFiles: [path.join(FRONT_ROOT_DIR, "package.json")],
    cwd: FRONT_ROOT_DIR,
    bunArgs: ["--compile", "--target=bun-linux-x64"],
  });
}
