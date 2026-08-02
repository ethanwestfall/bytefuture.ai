---
slug: "run-any-model-in-openclaw-through-token-station"
lang: "en"
title: "Run any model in OpenClaw through Token Station"
summary: "OpenClaw supports custom providers through its onboarding wizard and CLI. Point it at Token Station's OpenAI-compatible endpoint, covering 250+ models across 21 providers, and run GPT-5.5, Claude Opus, Kimi K2, or Grok without changing anything else in your setup."
category: "tutorial"
date: "2026-07-20"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/run-any-model-in-openclaw-through-token-station-cover.png"
draft: false
---

OpenClaw supports custom providers (any OpenAI-compatible or Anthropic-compatible endpoint) through its onboarding wizard and CLI. Token Station's unified API lives at `https://models.bytefuture.ai/v1` and exposes over 250 models across 21 providers through an OpenAI-compatible interface. Point OpenClaw at Token Station and you can run GPT-5.5, Claude Opus, Kimi K2, Grok, or any other model on Token Station without changing anything else in your setup. One key, one endpoint, any model.

## What you need before starting

- Node 22.22.3+, 24.15+, or 25.9+ (Node 24 is the recommended default). Check with `node --version`.
- A Token Station account and API key. Sign up free at [models.bytefuture.ai](https://models.bytefuture.ai): $1 in credit on registration, no card required.
- OpenClaw installed (see Step 1 below).

## Step 1: Install OpenClaw

**macOS / Linux / WSL2**: the `--no-onboard` flag skips the auto-launched wizard so you can configure Token Station specifically in Step 2:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

**Windows (PowerShell) or any platform via npm**: npm install does not auto-launch onboarding:

```bash
npm install -g openclaw@latest
```

Verify the binary is working:

```bash
openclaw --version
```

## Step 2: Configure Token Station as your provider

Export your Token Station key, then run onboarding with the custom provider flags:

```bash
# macOS / Linux / WSL2
export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

# Windows PowerShell
$env:TOKEN_STATION_API_KEY = "YOUR_TOKEN_STATION_KEY"
```

```bash
openclaw onboard --install-daemon --non-interactive --accept-risk \
  --auth-choice custom-api-key \
  --custom-base-url "https://models.bytefuture.ai/v1" \
  --custom-model-id "openai/gpt-5.4-mini" \
  --custom-api-key "$TOKEN_STATION_API_KEY" \
  --secret-input-mode plaintext \
  --custom-compatibility openai
```

This configures OpenClaw with Token Station as the provider, installs the background daemon, and sets `openai/gpt-5.4-mini` as the default model.

**What each flag does**

| Flag | Meaning |
|---|---|
| `--auth-choice custom-api-key` | Selects the custom API key provider path instead of a named provider (OpenAI, Anthropic, etc.). |
| `--custom-base-url` | The endpoint OpenClaw sends requests to. Token Station's OpenAI-compatible base is `https://models.bytefuture.ai/v1`. |
| `--custom-model-id` | The default model ID OpenClaw will use, in `provider/model` form. |
| `--custom-api-key` | Your Token Station API key. The `$TOKEN_STATION_API_KEY` reference keeps the secret out of your shell history. |
| `--secret-input-mode` | How OpenClaw stores the API key. `plaintext` stores it directly in the agent's auth profile on disk. |
| `--custom-compatibility` | Controls the wire protocol. `openai` uses standard chat completions, correct for Token Station. Only use `openai-responses` for endpoints that support `/v1/responses` but not `/v1/chat/completions`. Use `anthropic` for Anthropic-native endpoints. |
| `--install-daemon` | Installs OpenClaw as a background service (LaunchAgent on macOS, systemd on Linux/WSL2, Scheduled Task on Windows, with a Startup-folder fallback if task creation is denied). |

**Prefer the interactive wizard?** Run `openclaw onboard --install-daemon` without the other flags. When the wizard reaches the Model/Auth step, choose the custom provider option and select OpenAI-compatible, then enter `https://models.bytefuture.ai/v1` as the base URL and your Token Station key as the API key.

## Step 3: Verify the gateway is running

```bash
openclaw gateway status
```

The daemon installed in Step 2 should have the gateway running already. If not, the status command will tell you what's wrong.

## Step 4: Open the Control UI and confirm

```bash
openclaw dashboard
```

The dashboard opens at `http://127.0.0.1:18789/` in your browser. Start a chat. If the agent responds, OpenClaw is talking to Token Station and the model is answering.

## Swap the model with one command

Every model on Token Station sits behind the same endpoint and the same key. To change the default model:

```bash
openclaw configure --section model
```

Or re-run onboarding with a different `--custom-model-id`. Some IDs to choose from:

| Model ID | Good for |
|---|---|
| `openai/gpt-5.5` | Premium flagship; hard planning, debugging, and architecture. |
| `openai/gpt-5.4` | Strong reasoning at a lower price than the flagship. |
| `openai/gpt-5.4-mini` | Balanced daily driver for most tasks at lower cost. |
| `anthropic/claude-opus-4-8` | Long-horizon agentic reasoning and deep analysis. |
| `kimi/kimi-k2.7-code` | Routine coding tasks when cost matters more than depth. |
| `xai/grok-build-0.1` | Fast and affordable for quick responses. |
| `glm/glm-5.2` | 1M context window; strong on code at a low price. |

The gateway, channels, and daemon don't change when you swap the model. Only the model ID sent to Token Station changes.

## Smart routing: let a policy pick the model

Hardcoding a model is fine for most setups. Token Station also lets you define routing policies server-side: cheapest model above a quality floor, latency-capped with a provider allowlist, or a primary model with an automatic fallback if the primary is unavailable.

For OpenClaw this means you point `--custom-model-id` at a routed workload on Token Station and the routing logic stays on Token Station's side. If your primary model goes down, the fallback answers and OpenClaw never has to know. You update the policy in Token Station; nothing in your OpenClaw config changes.

## Useful environment variables

Set these before starting the daemon if you need non-default locations:

| Variable | Purpose |
|---|---|
| `OPENCLAW_HOME` | Overrides the home directory used for internal path resolution. |
| `OPENCLAW_STATE_DIR` | Overrides the state directory. |
| `OPENCLAW_CONFIG_PATH` | Overrides the config file path. |

## If something does not connect

**401 / auth error.** Confirm your Token Station key is correct. Re-run the onboard command with the corrected `--custom-api-key`, or run `openclaw configure --section model` to update credentials interactively.

**Wrong model or model not found.** Confirm the model ID exactly as it appears in the Token Station catalog at [models.bytefuture.ai/models](https://models.bytefuture.ai/models). Run `openclaw configure --section model` to update the model ID.

**The gateway is not running.** Run `openclaw gateway status`. To restart the gateway, use `openclaw gateway restart`. To reinstall the daemon from scratch, re-run `openclaw onboard --install-daemon`.

**The dashboard does not load.** The gateway must be running first. Confirm with `openclaw gateway status`, then retry `openclaw dashboard`.

**Config issues or unexpected behavior.** Run `openclaw doctor` to diagnose invalid or legacy config, then re-run `openclaw configure` to fix what it finds.

## Get started

Setting up Token Station in OpenClaw is one command and one environment variable. Once the daemon is running, switching models is a single `openclaw configure --section model` call and nothing else in your setup changes.

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai) ($1 in free credit, no card; up to $50 bonus on your first top-up), export your key, run the onboard command, and open the dashboard. One key, one endpoint, every model your OpenClaw setup needs.
