# Ruby CLI

A command-line interface for interacting with Ruby.

## Installation

To install the Ruby CLI globally, run:

```bash
npm install -g @ruby-ai/ruby-cli
```

### Linux

Ruby CLI depends on [`keytar`](https://www.npmjs.com/package/keytar) for storing credentials. On
Linux, `keytar` requires `libsecret` to be installed.

Depending on your distribution, you will need to run the following command:

- Debian/Ubuntu: `sudo apt-get install libsecret-1-dev`
- Red Hat-based: `sudo yum install libsecret-devel`
- Arch Linux: `sudo pacman -S libsecret`

## Usage

The Ruby CLI allows you to manage your Ruby authentication session and chat with Ruby agents.

```bash
ruby [command] [options]
```

When no command is provided, the `chat` command will be used by default.

### Commands

- **`login`**: Authenticate with your Ruby account.
  - `ruby login`
  - `ruby login --force`: Force re-authentication even if already logged in.
- **`status`**: Check your current authentication status.
  - `ruby status`
- **`logout`**: Log out from your Ruby account.
  - `ruby logout`
- **`skill:init`**: Install the ruby skill for coding CLIs (Claude Code, Codex).
  - `ruby skill:init`
- **`chat`**: Chat with a Ruby agent (default command).
  - `ruby chat` or simply `ruby`
  - Optional: `--sId <sId>` or `-s <sId>` to specify the agent sId to use directly
  - Optional: `--auto` to automatically accept all file edit operations without prompting
- **`help`**: Display help information.
  - `ruby help`

### Headless Authentication

The Ruby CLI supports headless authentication for automated workflows and CI/CD environments. This allows you to authenticate without interactive prompts by providing credentials via environment variables or command-line arguments.

#### Usage

**Method 1: Environment Variables (Recommended)**

Set the following environment variables:

```bash
export RUBY_API_KEY="sk_your_api_key_here"
export RUBY_WORKSPACE_ID="ws_abc123"
```

Then run any command normally:

```bash
ruby [command]
```

**Method 2: Command-line Arguments**

Pass both required parameters with any command:

```bash
ruby [command] --workspaceId <workspace-id> --key <your-api-key>
```

#### Parameters

- `RUBY_API_KEY` (env) or `--api-key` (flag): Your API key for authentication
- `RUBY_WORKSPACE_ID` (env) or `--wId` (flag): Your workspace ID

**Note:** Command-line flags take precedence over environment variables. If both are set, the command line flags will be used.

#### Examples

**Using Environment Variables:**

```bash
# Set environment variables once
export RUBY_API_KEY="sk_your_api_key_here"
export RUBY_WORKSPACE_ID="ws_abc123"

# Chat with headless auth
ruby chat

# Install the ruby skill
ruby skill:init

# Use with specific agent
ruby chat --sId 1234567890
```

**Using Command-line Arguments:**

```bash
# Chat with headless auth
ruby chat --wId ws_abc123 --api-key sk_your_api_key_here

# Install the ruby skill with headless auth
ruby skill:init --wId ws_abc123 --api-key sk_your_api_key_here

# Use with specific agent
ruby chat --sId 1234567890 --wId ws_abc123 --api-key sk_your_api_key_here
```

#### When to Use Headless Auth

Headless authentication is particularly useful for:

- Automated scripts and workflows
- CI/CD pipelines
- Server environments without interactive terminals
- Batch processing operations

#### Security Considerations

- **Use environment variables** instead of command-line flags when possible, as command-line arguments may be visible in process lists
- Store API keys securely and avoid committing them to version control
- Consider using secrets management tools for production deployments
- Use `.env` files locally and proper secrets management in CI/CD environments

### Options

- **`-v`, `--version`**: Display the installed CLI version.
- **`-f`, `--force`**: Used with the `login` command to force re-authentication.
- **`--auto`**: Automatically accept all file edit operations without prompting for approval (chat command only).
- **`--allow-path <path>`**: Grant the file system tools access to a path outside the current directory. Repeatable.
- **`--dangerously-disable-sandbox`**: Let the file system tools reach anywhere on the machine.
- **`--help`**: Display help information for the CLI.

### File system scope

The file system tools (`read_file`, `edit_file`, `search_files`, `search_content`, `run_command`)
are scoped to the directory the CLI was started in. Paths outside it, including through symlinks,
are refused, and the scope is printed when a chat starts.

Widen the scope with `--allow-path`:

```bash
ruby chat --allow-path ~/shared/design-docs
```

`run_command` is the weak spot: its arguments are checked against the same boundary, so `ls ..` is
refused, but the CLI does not confine the process it spawns. A command that reaches outside on its
own (a shell one-liner, a script, a tool reading an absolute path from a config file) is not
stopped. Treat the boundary as a guardrail against accidents and casual prompt injection, not as
containment.

### In-Chat Commands

While chatting with an agent, you can use these commands by typing them with a forward slash:

- **`/exit`**: Exit the chat session
- **`/switch`**: Switch to a different agent
- **`/attach`**: Open file selector to attach a file
- **`/clear-files`**: Clear any attached files
- **`/auto`**: Toggle auto-approval of file edits on/off

## Examples

- `ruby` (starts a chat with a Ruby agent)
- `ruby login`
- `ruby skill:init`
- `ruby chat`
- `ruby chat --sId 1234567890`
- `ruby chat --auto` (automatically accept all file edits)
- `ruby chat --allow-path ~/notes` (let the agent read a directory outside the workspace)
- `ruby help`

## Development

To set up the development environment:

1. Make sure you have the right version of Node.js installed (`nvm use` in the CLI directory).
2. Install dependencies: `npm install`
3. Build the CLI: `npm run build` or `npm run build:dev` (or `npm run dev` for hot-reloading)
4. Run the CLI locally: `node dist/index.js <command>`
