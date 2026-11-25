# GitHub mirror accelerator

A bundled skill that makes the agent accelerate GitHub downloads in restricted networks.

## What it does

When a GitHub URL is slow or times out, the agent learns a **probe → validate → fallback** workflow and rewrites URLs in the gh-proxy prefix form (from [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy), 9k+ stars):

- Release files, branch/tag source archives
- Blob pages (auto-converted to raw) and `raw.githubusercontent.com` files
- Gist raw files
- `git clone`, optionally with a token for private repos (with caveats)

## Default mirror list

The skill probes mirrors in order and picks the fastest one that returns 2xx:

1. `https://ghfast.top/`
2. `https://gh-proxy.com/`
3. `https://hub.gitmirror.com/`
4. `https://gitclone.com/` (clone only, path-style)

Mirrors are third-party public services and break frequently; the skill reports when all fail and suggests self-hosting gh-proxy. The skill never mutates global git configuration or proxy settings unless explicitly asked.

## Install and activation

- Install via the plugin manager (`install_bundle` in a session, or **Plugins → Add plugin**; the repository URL works too).
- Restart required: **yes**. DSH loads this plugin after a restart; open a new session afterwards so the skill appears in the skill list. Upgrading the plugin also requires a restart.

## Scope

- Skill name: `github-mirror-accelerator` (model- and user-invocable)
- No configuration required; no dependencies; ships only instructions
