---
slug: claude-opus-5-5-token-station
lang: en
title: "Claude Opus 5.5 is now on Token Station"
summary: "Anthropic's new Opus is live on Token Station as anthropic/claude-opus-5-5: 20% cheaper than Claude Opus 5, cache reads at 60% less, and benchmarks that match or beat the considerably pricier Claude Fable 5.1. Covers what changed, pricing, breaking API changes, and why this is a straightforward upgrade rather than a new expensive tier."
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-opus-5-5-token-station-cover.png
draft: false
---

Claude Opus 5.5 is now available on Token Station as `anthropic/claude-opus-5-5`, through the same Anthropic-compatible route already serving Claude Opus 5, Claude Sonnet 5, and Claude Fable 5.1.

This isn't positioned like Fable 5.1, a pricier option reserved for the hardest 10% of tasks. Opus 5.5 is a straight successor to Opus 5 in the same tier, at a lower price, and Anthropic's own benchmarks show it matching or beating the considerably pricier Fable 5.1 on most agentic and knowledge-work tasks, at 60% less per token.

## What changed from Claude Opus 5

- **20% cheaper**: $4/$20 per million input/output tokens, down from $5/$25.
- **Cache reads at $0.20/M**, 60% below Opus 5's $0.50/M. Cache writes drop too: $5/M (5-minute) and $8/M (1-hour), versus $6.25/M and $10/M.
- **Output generates more than 30% faster** than Opus 5, at the same latency tier.
- **Newer knowledge**: June 2026 cutoff, versus Opus 5's May 2026.

Four things break if you're migrating code written for Opus 5: thinking can no longer be disabled at any effort level (effort is the only control now, and it defaults to medium rather than high, so set it explicitly if you want Opus 5's old baseline behavior); forced tool use (`tool_choice: "any"` or a named tool) now returns an error; thinking blocks are tied to the model and conversation that produced them; and, on the Claude API and Google Cloud, the older `computer_20251124` computer-use tool is no longer accepted (use `computer_toolset_20260801` instead). None of this affects a first integration through Token Station, it only matters when porting an existing Opus 5 harness.

## Specs

| | |
|---|---|
| Context window | 1M tokens |
| Max output | 128K tokens |
| Thinking | Adaptive, always on |
| Default effort | Medium |
| Knowledge cutoff | June 2026 |

## Try it

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-opus-5-5",
    "messages": [
      {"role": "user", "content": "Audit this repository for a safe path to remove the deprecated auth module, and list every call site that needs to change."}
    ]
  }'
```

Swap `anthropic/claude-opus-5-5` for `anthropic/claude-opus-5` in the same request to confirm the upgrade actually moves the needle on your own workload before switching over for good.

## Pricing

| | Input | Output | Cache read | Cache write (5m) | Cache write (1h) |
|---|---|---|---|---|---|
| Claude Opus 5.5 | $4/M | $20/M | $0.20/M | $5/M | $8/M |
| Claude Opus 5 | $5/M | $25/M | $0.50/M | $6.25/M | $10/M |
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |

Token Station passes these rates through directly, no markup, metered per request and visible on your own dashboard.

## Where it lands against Claude Fable 5.1 and GPT-6 Astra

Anthropic's own published benchmarks put Opus 5.5 ahead of Fable 5.1 on most measured tasks, at well under half the price:

- **Terminal-Bench 4.0**: 66.4%, ahead of Fable 5.1's 55.8% and GPT-6 Astra's 57.9% in Anthropic's own evaluation.
- **GDPval-AA v2.1** (knowledge work): 1846 Elo, more than 100 points ahead of Fable 5.1's 1735 and over 300 ahead of Astra's 1542.
- **Humanity's Last Exam**: 67.7%, ahead of Fable 5.1's 65.6% and Astra's 57.2%.
- **OSWorld 2.1** (computer use): 81.8%, ahead of Fable 5.1's 80.7%.

It isn't a clean sweep: Astra still leads on Terminal-Bench-Science (64.6% against Opus 5.5's 58.7%) and AutomationBench (41.4% against 40.0%), both narrow margins. For most agentic coding, computer use, and knowledge work, though, Opus 5.5 is now the stronger and cheaper of the two defaults.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): no card required, with a 100% match up to $50 on your first top-up. Export your key and point your existing Anthropic-compatible integration at `anthropic/claude-opus-5-5`.

[Try Token Station](https://models.bytefuture.ai/intro.html)
