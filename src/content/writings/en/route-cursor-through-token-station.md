---
slug: "route-cursor-through-token-station"
lang: "en"
title: "Route Cursor through Token Station: Claude Sonnet 5 and Haiku"
summary: "Cursor supports custom OpenAI-compatible providers through Settings, Models. Point it at Token Station and Claude Sonnet 5 and Haiku show up as selectable models with full Agent-mode support: real file edits, not just chat, plus cost-tiered subagents."
category: "tutorial"
date: "2026-08-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-cursor-through-token-station-cover.png"
draft: false
---

Cursor supports custom OpenAI-compatible providers through Settings → Models. Point it at Token Station's endpoint and you can add Claude Sonnet 5 and Haiku as selectable models, each billed through your own Token Station key. Unlike some other model families available through Token Station, these two fully support Cursor's Agent mode: real file edits, not just chat. This walks through the setup end to end, including two gotchas we hit doing it ourselves, and finishes with an actual coding session: Sonnet 5 implementing a real feature in an open-source project, delegating research and verification to Haiku-backed subagents.

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

## Step 2: Add Claude Sonnet 5 and Haiku as custom models

Still in Models settings, click **+ Add Custom Model** twice and add:

```
anthropic/claude-sonnet-5
anthropic/claude-haiku-4-5
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/add-models.mp4" type="video/mp4">
  </video>
  <figcaption>Adding anthropic/claude-sonnet-5 and anthropic/claude-haiku-4-5 as custom models.</figcaption>
</figure>

**The gotcha**: Cursor sends whatever name you register here verbatim as the `model` field in its request. Token Station's actual route names include the `anthropic/` prefix. Register the model as plain `claude-sonnet-5` and every request fails with `Model 'claude-sonnet-5' not found`, because that model genuinely doesn't exist without the prefix. Register it with the prefix and it works immediately.

To confirm it's actually working end to end, not just accepted by Cursor: open a chat, select one of the new models, send a trivial message, and check the [Token Station dashboard](https://models.bytefuture.ai/dashboard). A real reply plus a matching line in Recent Activity means the key, base URL, and model name are all correct.

| Model | Good for |
|---|---|
| `anthropic/claude-sonnet-5` | Main coding model: planning, implementation, and Agent-mode file edits. |
| `anthropic/claude-haiku-4-5` | Lower-cost route for subagents: exploration, triage, and verification. |

## Step 3: Define Haiku-backed subagents

Cursor supports subagents: markdown files with YAML frontmatter, defined per-project in `.cursor/agents/` or globally in `~/.cursor/agents/`, each with its own `model` field. That lets you point specific, narrowly-scoped delegations at a cheaper model than whatever your main chat is using.

Two useful roles for a coding session, both on Haiku:

**`.cursor/agents/explore.md`**
```markdown
---
name: explore
description: Searches and reads the codebase to answer questions about existing code. Use proactively before implementing anything unfamiliar.
model: anthropic/claude-haiku-4-5
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
model: anthropic/claude-haiku-4-5
---

You run the project's test command, capture output, and report which
tests passed or failed and why. Do not modify source files.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/subagents.mp4" type="video/mp4">
  </video>
  <figcaption>Creating the explore and test-runner subagents, both backed by anthropic/claude-haiku-4-5.</figcaption>
</figure>

`readonly: true` on `explore` blocks file edits and state-changing shell commands, which fits a pure research role. `test-runner` needs to actually execute the test command, so it's left without that restriction, with its instructions telling it not to touch source files.

Two ways to trigger a subagent in chat: automatic delegation, where the main agent reads the `description` field and decides on its own when to hand off, or explicit invocation with `/explore` or `/test-runner`.

If you create these files by asking the agent in chat to write them rather than doing it from a terminal, and the sidebar still shows no subagents afterward, reload the window (**Ctrl+Shift+P → "Reload Window"**): Cursor doesn't always rescan `.cursor/agents/` live.

## Step 4: Watch it implement a real feature

With the provider, models, and subagents in place, Sonnet 5 can run an actual coding session end to end: research, implementation, and verification, delegating the cheaper steps to Haiku along the way.

We used [httpie](https://github.com/httpie/httpie), a real, moderately sized, well-tested open-source project, as the target. httpie's `--meta`/`-m` flag prints the request's elapsed time; it doesn't yet show the effective URL reached after following any redirects. That's a small, well-scoped, genuinely useful feature, the kind of task that needs a look at existing code before touching anything.

The prompt we used, in Cursor's Agent mode with `anthropic/claude-sonnet-5` selected:

> Add the effective URL (the URL actually reached after following any redirects) to HTTPie's `--meta` output, next to the existing elapsed time. Look at how elapsed time is computed and displayed first, then add a test that confirms it works for both a redirected and a non-redirected request.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/demo-httpie.mp4" type="video/mp4">
  </video>
  <figcaption>Sonnet 5 delegating research to the explore subagent, implementing the change itself, then delegating verification to test-runner, all through Token Station.</figcaption>
</figure>

Watch the [Token Station dashboard](https://models.bytefuture.ai/dashboard) during a session like this: you'll see `anthropic/claude-sonnet-5` billed for the planning and implementation steps, and `anthropic/claude-haiku-4-5` billed separately for the `explore` and `test-runner` delegations, the cost-tier split actually working, not just configured.

## What works today

Chat and Agent mode both work with Sonnet 5 and Haiku through Token Station in Cursor: real replies, real file edits, correctly billed to your Token Station key, visible on the dashboard. That includes subagent delegation, as shown above.

That isn't true of every model family yet. Earlier testing with Token Station's GPT-5.6 routes (Sol, Terra, Luna) found that Agent mode could read and discuss code but consistently failed to apply actual file edits, a tool-call response format issue on Token Station's side rather than a hard Cursor limitation. Support for those routes is in progress. If you want a coding agent that reliably edits files in Cursor today, route it through `anthropic/claude-sonnet-5` and `anthropic/claude-haiku-4-5` rather than the GPT-5.6 family.

Token Station's xAI route, `xai/grok-4.6`, is also supported in Cursor through the same custom-provider setup, if you'd rather try Grok for the main coding role.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): $1 in free credit, no card required, with up to $50 in bonus credit on your first top-up. Export your key, wire it into Cursor's Models settings, and add the two routes.

[Try Token Station](https://models.bytefuture.ai/intro.html)
