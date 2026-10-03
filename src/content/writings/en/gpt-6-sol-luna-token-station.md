---
slug: gpt-6-sol-luna-token-station
lang: en
title: "GPT-6 Sol and Luna are now on Token Station"
summary: "OpenAI's GPT-6 Sol and GPT-6 Luna are live on Token Station, priced well below their GPT-5.6 namesakes and built on GPT-6 Astra's agentic gains. Covers specs, pricing, benchmarks against Claude Opus 5 and Claude Fable 5, and where Sol and Luna fit next to Astra."
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/gpt-6-sol-luna-token-station-cover.png
draft: false
---

GPT-6 Sol and GPT-6 Luna are now available on Token Station as `openai/gpt-6-sol` and `openai/gpt-6-luna`, through the same OpenAI-compatible endpoint already serving GPT-6 Astra and the GPT-5.6 family.

Astra, OpenAI's flagship GPT-6 release, shipped first and priced itself for the hardest agentic and computer-use work. Sol and Luna arrived three weeks later, carrying much of Astra's underlying work into cheaper, faster tiers: Sol as a balanced route for interactive and agentic coding, Luna as the lowest-cost option in the family for high-volume, lighter-weight tasks.

## What's new

Measured against their GPT-5.6 namesakes, Sol's list price drops 60-67% and Luna's drops 90% or more (see Pricing below). OpenAI's own benchmark releases position the gain as cost efficiency more than a flat capability jump:

- **AutomationBench 1.0.6** (business workflows across 47 tools spanning sales, marketing, operations, support, finance, and HR): Sol at `xhigh` effort scores 33.2% at $0.27 per task, against Claude Opus 5 at max effort scoring 26.9% at roughly 11 times the cost.
- **Agents' Last Exam**: Sol at max effort reaches 56.4%, edging past Claude Opus 5's best recorded score at about 60% lower cost per task.
- **DeepSWE v1.1** (software-engineering tasks in real codebases): Sol at max effort scores 68.8%, within 1.1 points of Claude Fable 5's 69.9% at roughly 80% lower cost per task. Luna at max effort reaches 66.6% on the same benchmark, comparable to Claude Opus 5 and Claude Fable 5 at medium effort, at 93% and 96% lower cost per task respectively.

None of this makes Sol or Luna outright stronger than GPT-5.6 Sol or Astra on every axis. The pitch is cost: comparable or close results at a fraction of the price, which matters more for high-volume agentic fan-out than for a single hard call.

## Specs

| | GPT-6 Sol | GPT-6 Luna |
|---|---|---|
| Context window | 1.05M tokens | 1.05M tokens |
| Max input | 922K tokens | 922K tokens |
| Max output | 128K tokens | 128K tokens |
| Modalities | Text and image in, text out | Text and image in, text out |
| Knowledge cutoff | April 20, 2026 | May 18, 2026 |
| Reasoning effort | none, low, medium (default), high, xhigh, max | none, low, medium (default), high, xhigh, max |

Luna's knowledge cutoff lands later than Sol's and even Astra's (April 30, 2026). It's unusual for the cheapest tier in a family to carry the most current knowledge, but that's what OpenAI shipped here.

## Try it

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-6-sol",
    "messages": [
      {"role": "user", "content": "Plan a safe refactor for a pricing module and list the tests to run."}
    ]
  }'
```

Swap `openai/gpt-6-sol` for `openai/gpt-6-luna` to move the same call to the cheaper tier, or for `openai/gpt-6-astra` to see whether the flagship route earns its higher price on your own task.

## Pricing

| Model | Input | Output | Cached input | Cache writes |
|---|---|---|---|---|
| GPT-6 Sol | $2/M | $10/M | $0.20/M | $2.50/M |
| GPT-6 Luna | $0.10/M | $0.50/M | $0.01/M | $0.125/M |
| GPT-6 Astra | $10/M | $50/M | $1/M | $12.50/M |
| GPT-5.6 Sol (`openai/gpt-5.6`) | $5/M | $30/M | $0.50/M | $6.25/M |
| GPT-5.6 Luna | $1/M | $6/M | - | - |

Token Station passes these rates through directly, no markup, metered per request.

## Where Sol and Luna fit

- **GPT-6 Sol**: interactive and agentic coding that benefits from careful, multistep validation, the middle tier between Luna's speed and Astra's long-horizon agentic strength.
- **GPT-6 Luna**: high-volume, lower-stakes work: triage, classification, exploration passes, and subtask fan-out in a larger agent, where the DeepSWE results above show it closing most of the gap to pricier models at a fraction of the cost.
- **GPT-6 Astra**: still the route to reach for long agentic coding sessions, computer use, and terminal-heavy operations work, where its lead over the GPT-5.6 family was largest.

A practical routing pattern: default to Luna for exploration and fan-out, move to Sol for the actual implementation and validation work, and reserve Astra for sessions that need to run the longest without drifting off task.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): no card required, with a 100% match up to $50 on your first top-up. Export your key and point your existing OpenAI-compatible integration at `openai/gpt-6-sol` or `openai/gpt-6-luna`.

[Try Token Station](https://models.bytefuture.ai/intro.html)
