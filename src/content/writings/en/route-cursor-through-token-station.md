---
slug: "route-cursor-through-token-station"
lang: "en"
title: "Route Cursor through Token Station: GPT-5.6 Sol, Terra, and Luna"
summary: "Cursor supports custom OpenAI-compatible providers through Settings, Models. Point it at Token Station and Sol, Terra, and Luna show up as selectable models, with two known gotchas: a Tab-focus workaround for a current input-field bug, and the openai/ prefix Token Station's routes actually need."
category: "tutorial"
date: "2026-08-13"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-cursor-through-token-station-cover.png"
draft: false
---

Cursor supports custom OpenAI-compatible providers through Settings → Models. Point it at Token Station's endpoint and you can add GPT-5.6's three named routes, Sol, Terra, and Luna, as selectable models, each billed through your own Token Station key. This walks through the setup end to end, including two gotchas we hit doing it ourselves: a current Cursor input-field bug, and a model-naming detail that silently breaks requests if you skip it.

## What you need before starting

- Cursor installed ([cursor.com/download](https://cursor.com/download)).
- A Token Station account and API key. Sign up free at [models.bytefuture.ai](https://models.bytefuture.ai): $1 in credit on registration, no card required.
- Cursor Pro. Custom-model selection in Agent mode is gated on the Free plan, even with your own API key, so you'll need Pro ($20/month) for anything past Chat mode.

## Step 1: Register Token Station as a custom provider

Open **Settings → Cursor Settings → Models**, scroll to **API Keys**, and set two fields:

- **OpenAI API Key**: your Token Station key.
- **Override OpenAI Base URL**: toggle it on, and replace the default with `https://models.bytefuture.ai/v1`.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/register-provider.mp4" type="video/mp4">
  </video>
  <figcaption>Registering Token Station as a custom OpenAI-compatible provider in Cursor's Models settings.</figcaption>
</figure>

**Known bug worth knowing about**: in current Cursor builds (3.15.x), these two fields sometimes don't accept keyboard input on click. If typing does nothing, click elsewhere in the panel first, then press **Tab** repeatedly until focus lands on the field. Typing and **Ctrl+V** paste both work once it's Tab-focused. This is an acknowledged regression, not something specific to your setup.

Don't rely on a "Verify" button to confirm the key and URL are correct. It isn't always present, and even when it is, it doesn't cover every path. The reliable check is Step 2: add a model and actually send it a message.

## Step 2: Add the three GPT-5.6 routes as custom models

Still in Models settings, click **+ Add Custom Model** three times and add:

```
openai/gpt-5.6-sol
openai/gpt-5.6-terra
openai/gpt-5.6-luna
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/add-models.mp4" type="video/mp4">
  </video>
  <figcaption>Adding openai/gpt-5.6-sol, openai/gpt-5.6-terra, and openai/gpt-5.6-luna as custom models.</figcaption>
</figure>

**The gotcha**: Cursor sends whatever name you register here verbatim as the `model` field in its request. Token Station's actual route names include the `openai/` prefix. Register the model as plain `gpt-5.6-sol` and every request fails with `Model 'gpt-5.6-sol' not found`, because that model genuinely doesn't exist without the prefix. Register it with the prefix and it works immediately.

To confirm it's actually working end to end, not just accepted by Cursor: open a chat, select one of the new models, send a trivial message, and check the [Token Station dashboard](https://models.bytefuture.ai/dashboard). A real reply plus a matching line in Recent Activity means the key, base URL, and model name are all correct.

| Model | Good for |
|---|---|
| `openai/gpt-5.6-sol` | Flagship route for hard planning, debugging, and architecture questions. |
| `openai/gpt-5.6-terra` | Middle tier for repeated implementation and debugging discussion. |
| `openai/gpt-5.6-luna` | Lower-cost route for exploration, triage, and quick questions. |

## Step 3: Define Luna-backed subagents

Cursor supports subagents: markdown files with YAML frontmatter, defined per-project in `.cursor/agents/` or globally in `~/.cursor/agents/`, each with its own `model` field. That lets you point specific, narrowly-scoped delegations at a cheaper model than whatever your main chat is using.

Two useful roles for a coding session, both on Luna:

**`.cursor/agents/explore.md`**
```markdown
---
name: explore
description: Searches and reads the codebase to answer questions about existing code. Use proactively before implementing anything unfamiliar.
model: openai/gpt-5.6-luna
readonly: true
---

You are a fast, read-only research agent. Find and summarize relevant
files, functions, and patterns. Never edit files or run mutating commands.
```

**`.cursor/agents/test-runner.md`**
```markdown
---
name: test-runner
description: Runs the test suite and reports pass/fail results with failure details. Use proactively after any code change.
model: openai/gpt-5.6-luna
---

You run the project's test command, capture output, and report which
tests passed or failed and why. Do not modify source files.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/subagents.mp4" type="video/mp4">
  </video>
  <figcaption>Creating the explore and test-runner subagents, both backed by openai/gpt-5.6-luna.</figcaption>
</figure>

`readonly: true` on `explore` blocks file edits and state-changing shell commands, which fits a pure research role. `test-runner` needs to actually execute the test command, so it's left without that restriction, with its instructions telling it not to touch source files.

Two ways to trigger a subagent in chat: automatic delegation, where the main agent reads the `description` field and decides on its own when to hand off, or explicit invocation with `/explore` or `/test-runner`.

If you create these files by asking the agent in chat to write them rather than doing it from a terminal, and the sidebar still shows no subagents afterward, reload the window (**Ctrl+Shift+P → "Reload Window"**): Cursor doesn't always rescan `.cursor/agents/` live.

## What works today, and what doesn't yet

Chat and Ask mode with Sol, Terra, and Luna work as described above: real replies, correctly billed to your Token Station key, visible on the dashboard.

Full Agent-mode autonomy, the model reading your codebase and writing changes directly, is a different story. In our testing, custom OpenAI-compatible models added through Override Base URL could read and discuss code in Agent mode, but consistently failed to apply any actual file edit, regardless of which Cursor mode we tried. That matches reports from other users hitting the same wall: Cursor's Agent tool-calling harness expects a specific request and response shape, and a standard OpenAI-compatible endpoint isn't guaranteed to round-trip it the way Cursor's own hosted models do. This isn't a Token Station-specific issue: the same `openai/gpt-5.6-*` routes already drive real agentic tool-calling in Codex, so the model and the endpoint aren't the limiting factor here.

If your workflow needs an agent that actually edits files, Token Station's Codex, Claude Code, and OpenClaw integrations are the proven path today. Cursor is a solid way to chat with Sol, Terra, and Luna inside your editor, with cost-tiered subagents for chat-based delegation, while its BYOK Agent-mode support catches up.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): $1 in free credit, no card required, with up to $50 in bonus credit on your first top-up. Export your key, wire it into Cursor's Models settings, and add the three routes.

[Try Token Station](https://models.bytefuture.ai/intro.html)
