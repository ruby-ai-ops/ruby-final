# ruby-hive

CLI tool for running multiple isolated Ruby development environments simultaneously.

Each environment gets its own:
- Git worktree (separate branch)
- Port range (no conflicts)
- Docker containers (isolated volumes)
- Database instances

## Prerequisites

Install these before using ruby-hive:

```bash
# Bun (runtime for ruby-hive itself)
curl -fsSL https://bun.sh/install | bash

# nvm (Node version manager for front/connectors)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Rust toolchain (for core/oauth)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Zellij (terminal multiplexer)
brew install zellij

# Docker (via OrbStack or Docker Desktop)
brew install --cask orbstack

# Temporal CLI (workflow engine)
brew install temporal

# direnv (auto-load environment variables)
brew install direnv

# Build dependencies
brew install cmake protobuf

# sccache (optional - Rust compilation cache, speeds up rebuilds)
brew install sccache

# fzf (optional - used by `ruby-hive open` when NAME is omitted)
brew install fzf

# psql (required for seed-config command)
brew install postgresql
```

> **Linux users**: Also install `lsof` if not already available (`sudo apt install lsof`)

### direnv setup

1. **Add the shell hook** to your shell config:

   **For zsh** (`~/.zshrc`):
   ```bash
   eval "$(direnv hook zsh)"
   ```

   **For bash** (`~/.bashrc`):
   ```bash
   eval "$(direnv hook bash)"
   ```

2. **Silence verbose output** by creating `~/.config/direnv/direnv.toml`:
   ```bash
   mkdir -p ~/.config/direnv
   cat > ~/.config/direnv/direnv.toml << 'EOF'
   [global]
   hide_env_diff = true
   EOF
   ```

This enables automatic environment loading when you `cd` into any ruby-hive worktree. The `.envrc` file in each worktree sources the environment variables for that environment.

After adding the hook, restart your shell or run `source ~/.zshrc` (or `~/.bashrc`).

### sccache setup

Configure cargo to use sccache by adding to `~/.cargo/config.toml`:

```toml
[build]
rustc-wrapper = "sccache"
```

## Installation

```bash
# From the ruby repo
cd x/henry/ruby-hive

# Install dependencies and link globally
bun install
bun link
```

Now `ruby-hive` is available globally. No build step needed - Bun runs TypeScript directly.

## Initial Setup

1. **Create config file** with your secrets:

```bash
mkdir -p ~/.ruby-hive
cp /path/to/your/.env ~/.ruby-hive/config.env
```

The `config.env` must use `export` statements (e.g., `export API_KEY=xxx`). It contains all the environment variables from your local dev setup (API keys, OAuth secrets, etc.).

2. **Start managed services** (temporal server + main zellij session):

```bash
# From the main Ruby repo (on main branch, clean working directory)
ruby-hive up

# Or attach to the main zellij session immediately
ruby-hive up -a
```

This runs `ruby-hive sync` to update dependencies, starts the Temporal server as a managed daemon, and creates a main zellij session with tabs for the repo shell and temporal logs.

## Quick Start

```bash
# Start managed services (temporal + test postgres + test redis + main session)
ruby-hive up

# Create a new environment
ruby-hive spawn myenv

# Start all services for one or more environments (docker, front, core, connectors, etc.)
ruby-hive warm myenv

# Open the environment's terminal UI
ruby-hive open myenv

# Get the app URL
ruby-hive url myenv
# http://localhost:10000

# Open in browser
open $(ruby-hive url myenv)

# Stop everything when done
ruby-hive down
```

## External workspace managers

See [docs/conductor.md](docs/conductor.md) for the Conductor setup. The same
pattern applies to other tools that create Git worktrees at a fixed location:
create the worktree inside the Ruby repo, run `ruby-hive adopt --path ...`, keep
the environment cold by default, and use `ruby-hive unregister` when the
external workspace is archived.

## Commands

> **Tip**: Run `ruby-hive <command> --help` for all available options.

### Managed Services

| Command | Description |
|---------|-------------|
| `up [-a] [-f]` | Start temporal + test postgres + test redis + sync + create main session (from main repo) |
| `down [-f]` | Stop all envs, temporal, test postgres, test redis, and sessions |
| `temporal start\|stop\|restart\|status\|logs` | Manage Temporal server |

### Environment Commands

| Command | Description |
|---------|-------------|
| `spawn [NAME] [--no-open] [--no-attach] [--warm] [--wait]` | Create new environment |
| `adopt NAME --path PATH` | Register an existing Git worktree as an environment |
| `warm [NAME...] [--no-forward] [--force-ports]` | Start docker + all services |
| `cool [NAME...]` | Pause services + docker, keep SDK (fast restart) |
| `start [NAME...]` | Resume stopped environments |
| `stop [NAME] [SERVICE]` | Full stop + remove docker containers, or stop one service |
| `destroy [NAME] [--force]` | Remove environment completely (multi-select if NAME omitted) |
| `unregister [NAME] [--force]` | Remove Hive resources while keeping the worktree and branch |
| `restart [NAME] SERVICE` | Restart a single service (`front` restarts all front-* services) |
| `open [NAME]` | Open zellij terminal session |
| `reload [NAME]` | Kill and reopen zellij session |
| `list` | Show all environments |
| `status [NAME]` | Show service health |
| `logs [NAME] [SERVICE] [-f]` | View service logs |
| `url [NAME]` | Print front URL |
| `kibana [NAME]` | Start Kibana for a warm environment and open it in the default browser |

### Utilities

| Command | Description |
|---------|-------------|
| `setup [-y]` | Check prerequisites and guide initial setup (run this first!) |
| `doctor` | Check prerequisites (non-interactive) |
| `cache` | Show binary cache status |
| `forward [NAME\|status\|stop]` | Manage OAuth port forwarding |
| `sync [-f]` | Pull latest main, rebuild binaries, refresh deps |
| `seed-config <postgres-uri>` | Extract user data from existing DB for seeding |

**Aliases**: Most commands have short aliases (e.g., `s` for spawn, `o` for open, `w` for warm). Run `ruby-hive --help` to see all aliases.

When you source the shell completion script, it also defines shorthand commands:

| Shorthand | Equivalent |
|-----------|------------|
| `dh` | `ruby-hive` |
| `dhs` | `ruby-hive spawn -C -c "claude --dangerously-skip-permissions"` |
| `dho` | `ruby-hive open -C` |
| `dhl` | `ruby-hive list` |
| `dhd` | `ruby-hive destroy` |
| `dhw` | `ruby-hive warm` |
| `dhc` | `ruby-hive cool` |
| `dhx` | `ruby-hive spawn -C -c "codex"` |
| `dhb [query]` | Open the matched environment app URL in your browser. Defaults to the current hive when run from its worktree. |
| `dhdb [query] [database] [psql-args...]` | Open `psql` on the matched environment database. Defaults to the current hive when run from its worktree and to `ruby_front`; `front`, `connectors`, and `core` complete to `ruby_front`, `ruby_connectors`, and `ruby_api`. |
| `dhcd` | Change directory into the environment worktree |

> **Tip**: When `NAME` is omitted, you'll get an interactive picker to select an environment.
> It pre-selects the current environment (if you're in a worktree) or the last one you used.

### Services

Available services for `logs` command:
- `sdk` - TypeScript SDK watcher
- `front` - Next.js frontend
- `core` - Rust core API
- `oauth` - Rust OAuth service
- `connectors` - TypeScript connectors
- `front-workers` - Temporal workers

## Environment States

| State | Description |
|-------|-------------|
| **stopped** | Nothing running |
| **cold** | Only SDK watch running |
| **warm** | All services running |

## Port Allocation

Each environment gets a 1000-port range:

| Environment | Port Range | Front | Core | Connectors |
|-------------|------------|-------|------|------------|
| 1st env | 10000-10999 | 10000 | 10001 | 10002 |
| 2nd env | 11000-11999 | 11000 | 11001 | 11002 |
| 3rd env | 12000-12999 | 12000 | 12001 | 12002 |

## OAuth Forwarding

OAuth providers (WorkOS, Google, GitHub, etc.) are configured to redirect to `http://localhost:3000`. Since ruby-hive uses different ports per environment, a TCP forwarder routes standard ports to the active environment:

| Standard Port | Service | Environment Port |
|---------------|---------|------------------|
| 3000 | front | base + 0 |
| 3001 | core | base + 1 |
| 3002 | connectors | base + 2 |
| 3006 | oauth | base + 6 |
| 3007 | viz | base + 7 |
| 3010 | front-spa-admin | base + 10 |
| 3011 | front-spa-app | base + 11 |
| 6006 | storybook (ui) | base + 8 |

**Automatic**: When you run `ruby-hive warm`, these ports are automatically forwarded to that environment.
The forwarder listens on `127.0.0.1` by default; set `RUBY_HIVE_FORWARD_LISTEN_HOST=0.0.0.0` to expose it to your LAN.

```bash
# Manual control
ruby-hive forward status    # Check current forwarding
ruby-hive forward env-b     # Switch to a different environment
ruby-hive forward stop      # Stop forwarding

# Skip auto-forward on warm
ruby-hive warm myenv --no-forward

# Force-kill any processes blocking service ports during warm
ruby-hive warm myenv --force-ports
```

When working with multiple environments, use `forward` to switch which one receives OAuth callbacks:

```bash
# env-a is warm and receiving OAuth at :3000
ruby-hive forward env-b     # Switch OAuth to env-b
```

If the ports are already owned by another ruby-hive forwarder, `ruby-hive forward NAME` will switch it automatically.
If those ports are owned by a different process, the command will fail with details so you can stop it.

## Preconditions

### `ruby-hive up` and `ruby-hive sync`

These commands must be run from the **main Ruby repository** (not a worktree):

1. **Not in a worktree**: Run from `~/path/to/ruby` (the main clone)
2. **On main branch**: Run `git checkout main` first
3. **Clean working directory**: Commit or stash changes (untracked files OK)

If you see errors about "cannot run from worktree" or "checkout main first", these preconditions aren't met.

## Configuration settings

You can customize the behavior of `ruby-hive` by editing `~/.ruby-hive/settings.json`:

```json
{
  "multiplexer": "zellij",
  "branchPrefix": "tom-",
  "useGitSpice": false
}
```

* **multiplexer**: Terminal multiplexer to use (`"zellij"` or `"tmux"`, default: `"zellij"`)
* **branchPrefix**: Prefix to add to branch names (e.g., `"tom-"` creates branches like `"tom-myenv"`)
* **useGitSpice**: Use git-spice to manage stacks (requires git-spice installed and configured)

## Terminal Sessions (zellij/tmux)

> **Note**: The following describes the default zellij experience. If you set `"multiplexer": "tmux"` in settings, sessions use tmux instead (with different shortcuts).

### Main Session

When you run `ruby-hive up`, a main session (`ruby-hive-main`) is created with:

- **main** - Shell at the repo root
- **temporal** - Temporal server logs (runs `ruby-hive temporal logs`)

Attach to it with `ruby-hive up -a` or by running zellij directly: `zellij attach ruby-hive-main`.

### Environment Sessions

When you run `ruby-hive open`, you get a terminal with tabs:

- **shell** - Interactive shell with environment loaded
- **sdk** - SDK build logs
- **front** - Next.js logs
- **core** - Core API logs
- **oauth** - OAuth service logs
- **connectors** - Connectors logs
- **workers** - Temporal worker logs

If you want to start warming while you work in the shell, use:

```bash
ruby-hive spawn myenv --warm
```

This opens zellij with an extra **warm** tab that runs `ruby-hive warm myenv`.

To create the session in the background without attaching (useful for scripts or CI):

```bash
ruby-hive spawn myenv --warm --no-attach
```

This creates the zellij session and starts services, but leaves you in your current terminal. Use `ruby-hive open myenv` to attach later.

## Workflow Examples

### Working on a feature

```bash
# Create environment
ruby-hive spawn my-feature

# Start everything
ruby-hive warm my-feature

# Open terminal
ruby-hive open my-feature

# ... work on your feature ...

# When done for the day
ruby-hive stop my-feature
```

### Adopting an externally managed worktree

Some workspace managers need to create the Git worktree themselves. Ruby-hive can adopt that
worktree while still managing ports, environment variables, dependency links, Docker resources, and
service daemons.

Configure the external tool's workspace root inside the main Ruby repo, for example:

```text
/path/to/ruby/.hives/external/<tool-name>
```

Then call ruby-hive from the tool's setup, run, and teardown hooks:

```bash
ruby-hive adopt --path "$WORKSPACE_PATH" --name "$WORKSPACE_NAME"
ruby-hive start "$WORKSPACE_NAME"
ruby-hive unregister "$WORKSPACE_NAME"
```

`adopt` registers the worktree and starts the cold services. Use `start` when the workspace is
opened again so a stopped environment returns to the cold state. Do not run `warm` from workspace
creation hooks; use it only when the full app stack is needed.

#### Example: Conductor

Set the Conductor workspace root to `/path/to/ruby/.hives/external/conductor`, then wire the same
hooks as repository scripts:

```toml
[scripts]
setup = "ruby-hive adopt --path \"$CONDUCTOR_WORKSPACE_PATH\" --name \"$CONDUCTOR_WORKSPACE_NAME\""
run = "ruby-hive start \"$CONDUCTOR_WORKSPACE_NAME\""
archive = "ruby-hive unregister \"$CONDUCTOR_WORKSPACE_NAME\""
run_mode = "concurrent"
```

`adopt` requires the worktree to live inside the main Ruby repo root. This keeps the existing
shallow `node_modules` strategy working: workspace packages resolve through the worktree while
third-party dependencies can still resolve from the main repo cache. Adopted worktrees are treated
as externally owned, so `unregister` and `destroy` keep the worktree and branch.

Pass `--wait` to `adopt` only when the external tool must block until the cold services have
finished their initial builds.

### Running multiple environments

```bash
# Create and warm two environments
ruby-hive spawn env-a --warm
ruby-hive spawn env-b --warm

# Both running simultaneously
ruby-hive list
# env-a    warm    http://localhost:10000
# env-b    warm    http://localhost:11000

# Access both
open http://localhost:10000  # env-a
open http://localhost:11000  # env-b
```

### Cleaning up

```bash
# Stop and remove an environment
ruby-hive destroy my-feature

# If there are uncommitted changes
ruby-hive destroy my-feature --force
```

## Troubleshooting

### "Environment not found"

Check if it exists:
```bash
ruby-hive list
```

### Services not starting

Check prerequisites:
```bash
ruby-hive doctor
```

### Docker issues

Make sure Docker/OrbStack is running:
```bash
docker ps
```

### Zellij "Waiting to run"

Reload the session:
```bash
ruby-hive reload myenv
```

### Check service health

```bash
ruby-hive status myenv
```

### View logs

```bash
# Last 500 lines
ruby-hive logs myenv front

# Follow logs
ruby-hive logs myenv front -f
```

### Running `npm install`

To run `npm install` in a ruby-hive worktree, you must first delete `node_modules`:
```bash
rm -rf node_modules && npm install
```
This is necessary because ruby-hive uses a shallow copy structure (symlinks) that is incompatible with npm's expectations.

## Development

```bash
# Run directly (no build step)
bun run src/index.ts <command>

# Run all checks
bun run check

# Individual checks
bun run typecheck    # TypeScript
bun run lint         # Biome linter
bun run test         # Unit tests
```
