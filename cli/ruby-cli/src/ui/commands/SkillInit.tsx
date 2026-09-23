import fs from "fs/promises";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import os from "os";
import path from "path";
import type { FC } from "react";
import React, { useCallback, useState } from "react";

const SKILL_NAME = "ruby";

const SKILL_CONTENT = `---
name: ${SKILL_NAME}
description: Call a Ruby agent to get information, perform actions, or answer questions using the company's connected tools and knowledge bases.
---

## What is Ruby?

Ruby (https://ruby.ad) is an AI agent platform that connects to a company's internal tools and knowledge bases (Slack, Notion, Google Drive, GitHub, etc.). It provides specialized AI agents that have context on the company's data and can perform actions on behalf of users. The Ruby CLI allows you to interact with these agents programmatically.

## Non-interactive usage

Send a message to a Ruby agent and get a JSON response:

\`\`\`bash
ruby chat -a <agent-name> -m "<message>"
\`\`\`

If no specific agent is needed, route the question to the default \`ruby\` agent. Otherwise, use the agent name given by the user.

\`\`\`bash
# Use the default "ruby" agent for general questions
ruby chat -a ruby -m "What are the main topics discussed in #engineering this week?"

# Use a specific agent when one is specified
ruby chat -a issueBot -m "Create an issue for: login page returns 500 on Safari"
\`\`\`

### JSON output format

Non-interactive calls output JSON to stdout:

\`\`\`json
{
  "agentId": "agent_sId",
  "agentAnswer": "The agent's full text response",
  "conversationId": "convId123",
  "messageId": "msgId456"
}
\`\`\`

Parse the output with jq or your language's JSON parser to extract the answer.

### Multi-turn conversations

Continue an existing conversation by passing \`-c <conversationId>\` (returned in the JSON from the initial call):

\`\`\`bash
ruby chat -a issueBot -c "convId123" -m "Also add a follow-up issue about the fix"
\`\`\`

### Additional flags

- \`-d, --details\`: Include detailed event history and full agent message object in the JSON output.
- \`--messageId <id>\` with \`-c <conversationId>\`: Fetch a specific agent message from an existing conversation (read-only, no new message sent).

### Authentication

The CLI must be authenticated before use. If you encounter a login or authentication error, explain to the user that they need to run \`ruby login\` (interactive browser-based flow) or set environment variables \`RUBY_API_KEY\` and \`RUBY_WORKSPACE_ID\` for headless environments.
`;

const CLI_TARGETS = [
  {
    id: "claude-code",
    label: "Claude Code",
    dir: path.join(os.homedir(), ".claude", "skills", SKILL_NAME),
  },
  {
    id: "codex",
    label: "Codex (OpenAI)",
    dir: path.join(os.homedir(), ".agents", "skills", SKILL_NAME),
  },
  {
    id: "copilot",
    label: "Copilot (GitHub)",
    dir: path.join(os.homedir(), ".copilot", "skills", SKILL_NAME),
  },
];

const ITEMS = CLI_TARGETS.map((t) => ({
  label: `${t.label} - ${t.dir.replace(os.homedir(), "~")}/`,
  value: t.id,
}));

const SkillInit: FC = () => {
  const [result, setResult] = useState<{
    label: string;
    path: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = useCallback(
    async (item: { label: string; value: string }) => {
      const target = CLI_TARGETS.find((t) => t.id === item.value);
      if (!target) {
        return;
      }

      try {
        const destFile = path.join(target.dir, "SKILL.md");
        await fs.mkdir(target.dir, { recursive: true });
        await fs.writeFile(destFile, SKILL_CONTENT);
        const shortDir = target.dir.replace(os.homedir(), "~");
        setResult({ label: target.label, path: `${shortDir}/` });
      } catch (err) {
        setError(`Failed to install skill: ${err}`);
      }
    },
    []
  );

  if (error) {
    return (
      <Box>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  if (result) {
    return (
      <Box>
        <Text color="green">
          {result.label} - <Text dimColor>{result.path}</Text>
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text>Select a target CLI to install the skill for:</Text>
      <SelectInput items={ITEMS} onSelect={handleSelect} />
    </Box>
  );
};

export default SkillInit;
