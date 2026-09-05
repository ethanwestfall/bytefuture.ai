---
slug: claude-fable-5-1-token-station
lang: en
title: "Claude Fable 5.1 is now on Token Station"
summary: "Anthropic's most capable model is live on Token Station as anthropic/claude-fable-5-1: the same price as Claude Fable 5, cache reads at a quarter of the cost, and stronger long-running agentic coding and research. Covers what changed, pricing, and when to reach for it over Claude Opus 5."
category: product
date: 2026-09-05
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-fable-5-1-token-station-cover.png
draft: false
---

Claude Fable 5.1 is now available on Token Station as `anthropic/claude-fable-5-1`, through the same Anthropic-compatible route already serving Claude Opus 5 and Claude Sonnet 5.

Anthropic's own guidance is worth repeating rather than glossing over: for most workloads, start with Claude Opus 5. Reach for Fable 5.1 specifically for demanding reasoning and long-horizon agentic work, or when Opus 5 at higher effort still falls short on your evals. It's a model for the hard 10% of tasks, not a blanket upgrade.

## What changed from Claude Fable 5

Fable 5.1 extends Fable 5 at the same input and output price. The concrete improvements:

- **Cache reads at $0.25/M**, a quarter of Fable 5's $1/M. For agentic workloads that resend a growing conversation or repository context on every turn, this is the change that actually moves a bill, more than any capability gain.
- **Stronger long-running agentic coding and multistep research**, plus better document, spreadsheet, and slide generation.
- **Per-message effort** (beta): change reasoning depth mid-conversation without invalidating the prompt cache.
- **Progress updates between tool calls** (beta): readable status notes during long agentic runs instead of a silent wait.
- **Turn-scoped system messages** (beta): operator instructions that apply for one turn and then clear themselves from the transcript.

Three things also break if you're migrating code written for Fable 5: forced tool use (`tool_choice: "any"` or a named tool) now returns an error, thinking blocks are tied to the model that produced them, and editing earlier turns in a conversation invalidates its thinking blocks. None of that affects a first integration through Token Station, it only matters if you're porting an existing Fable 5 harness.

## Specs

| | |
|---|---|
| Context window | 1M tokens |
| Max output | 128K tokens |
| Thinking | Adaptive, always on |
| Default effort | High |
| Knowledge cutoff | June 2026 |

## Try it

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-fable-5-1",
    "messages": [
      {"role": "user", "content": "Audit this repository for a safe path to remove the deprecated auth module, and list every call site that needs to change."}
    ]
  }'
```

Swap `anthropic/claude-fable-5-1` for `anthropic/claude-opus-5` in the same request to see whether the harder route actually earns its price on your workload before committing to it.

## Pricing

| | Input | Output | Cache read | Cache write (5m) | Cache write (1h) |
|---|---|---|---|---|---|
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |
| Claude Opus 5 | $5/M | $25/M | - | - | - |
| Claude Sonnet 5 | $2/M | $10/M | - | - | - |

Token Station passes these rates through directly, no markup, metered per request and visible on your own dashboard.

## When to reach for it

Fable 5.1 is worth its price on tasks where the failure mode is giving up early or losing the thread, not tasks where the answer is simply hard to compute in one shot:

- **Long-running agentic coding**: multi-file refactors, repository-wide audits, and sessions that chain planning, implementation, and test repair across many tool calls.
- **Multistep research**: pulling together findings across many sources where a shorter context window or a less patient model would summarize too early.
- **Document, spreadsheet, and slide work** that requires holding a large amount of source material in view while producing a long, structured output.

For a single hard question, a classification task, or most day-to-day chat and coding, Claude Opus 5 at a higher effort setting is the cheaper starting point, and Anthropic's own comparison table backs that up: Opus 5 shares the same 1M context and 128K output ceiling at half Fable 5.1's price.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): $1 in free credit, no card required, with up to $50 in bonus credit on your first top-up. Export your key and point your existing Anthropic-compatible integration at `anthropic/claude-fable-5-1`.

[Try Token Station](https://models.bytefuture.ai/intro.html)
