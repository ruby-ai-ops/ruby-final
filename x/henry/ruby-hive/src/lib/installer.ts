// Installation helpers for ruby-hive setup

import { logger } from "./logger";

// Create config.env template
export async function createConfigEnvTemplate(configPath: string): Promise<boolean> {
  // Template uses export statements as required by env.sh sourcing
  // See local-dev-setup.md for the full list of required variables
  const template = `# ruby-hive configuration
# This file is sourced by env.sh - use 'export VAR=value' syntax
# See local-dev-setup.md for the full list of required variables

# Copy your environment variables from your existing .env file here
# Example:
# export OPENAI_API_KEY=sk-...
# export RUBY_API_KEY=...
`;

  await Bun.write(configPath, template);
  logger.success(`Created config template at ${configPath}`);
  logger.info("→ Please copy your environment variables from your existing .env file");
  return true;
}
