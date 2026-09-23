import { mkdir } from "node:fs/promises";
import { CONFIG_ENV_PATH, RUBY_HIVE_ENVS, RUBY_HIVE_HOME } from "./paths";

// Ensure all required directories exist
// Note: Multiplexer layout directories are created by the multiplexer adapter when needed
// Note: Hives directory (.hives/) is created per-repo at worktree creation time
export async function ensureDirectories(): Promise<void> {
  await mkdir(RUBY_HIVE_HOME, { recursive: true });
  await mkdir(RUBY_HIVE_ENVS, { recursive: true });
}

// Check if global config.env exists
export async function configEnvExists(): Promise<boolean> {
  const file = Bun.file(CONFIG_ENV_PATH);
  return file.exists();
}
