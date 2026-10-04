---
slug: jev-token-station
lang: en
title: "Jev is now on Token Station"
summary: "TypeSafe's Jev, a decision-only model that returns typed probabilities instead of text, is now on Token Station with no waitlist. Covers the native endpoint that replaces chat completions, the three answer types (Noul, Choice, Score), pricing, and how TypeSafe's speed and cost claims compare to independently measured results."
category: product
date: 2026-10-03
cta: https://models.bytefuture.ai/intro.html
cover: blog/jev-token-station-cover.png
draft: false
---

Jev is now available on Token Station as `typesafe/jev-1.13.0`, with `typesafe/jev-latest` tracking the newest release. TypeSafe's own platform is still bringing new signups off a waitlist; through Token Station, it's available now with the same key you already use for every other model.

## It doesn't write text

Jev is TypeSafe's first "System One Model," a name borrowed from Daniel Kahneman's fast, intuitive mode of thinking. Where a chat model reads a conversation and writes a reply, Jev reads a piece of state (plain text, a JSON object, or an array of messages) and a set of typed questions, then returns typed answers: a probability, a chosen option, or a score, each with a confidence value. TypeSafe describes it as a frontier-intelligence function call: unstructured state in, typed probabilistic decisions out. There is no generated prose to parse, because none is generated.

In one of the launch demos, TypeSafe's founder raced two Wikipedia pages against each other using only the links on each page: hundreds to thousands of candidate links per hop, each one a choice that can't afford to invent a link that doesn't exist. That's the kind of high-cardinality decision Jev is built for, where a chat model's free-text answer would need to be parsed and validated after the fact, and might not validate at all.

It's also why Token Station routes Jev differently from every other model on the platform. Jev answers through its own endpoint, `/typesafe/v1/systemone`, not the OpenAI-compatible chat routes. Send it to `/v1/chat/completions`, `/v1/responses`, or `/v1/messages` instead, and the gateway rejects the request with a 400 that points you at the native endpoint. Jev is also left out of the OpenAI-compatible `/v1/models` listing entirely; its own catalog lives at `/typesafe/v1/models`. Both are deliberate: a decision model that happened to share a wire format with chat models would be exactly the kind of thing that gets silently misused.

## Three ways to ask a question

Every request sends a `state` and a map of named `questions`, each with a `type`. There are three.

**Noul** answers yes or no as a probability, not a boolean:

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": "Every customer has been unable to sign in for 30 minutes. Please restore service immediately.",
    "questions": {
      "urgent": {
        "type": "noul",
        "instructions": "Does this incident require immediate action?"
      }
    }
  }'
```

**Choice** picks one key from a set of up to 255 labeled options, and returns a probability distribution across all of them alongside the pick:

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": {
      "ticket": "My card was charged twice for the same invoice. Please refund the duplicate charge.",
      "account": {"plan": "business", "invoice_id": "example-invoice-001"}
    },
    "questions": {
      "team": {
        "type": "choice",
        "instructions": "Which team should handle the ticket?",
        "criteria": {
          "billing": "Invoices, charges and refunds",
          "technical": "Service outages, software bugs and integrations",
          "sales": "New purchases and plan upgrades"
        }
      }
    }
  }'
```

**Score** rates state against an ordered rubric of two to ten levels, and the result is a fractional, probability-weighted position on that rubric rather than a flat integer:

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": [
      {"role": "customer", "content": "The checkout service fails for every customer."},
      {"role": "operator", "content": "Confirmed: all purchases have failed for the last 20 minutes."}
    ],
    "questions": {
      "impact": {
        "type": "score",
        "instructions": "Rate the current operational impact described in these reports.",
        "criteria": [
          "No disruption: all functions work normally",
          "Partial disruption: some customers or functions are affected",
          "Complete outage: a critical function fails for all customers"
        ]
      }
    }
  }'
```

A single request can mix all three types, so one call to `/typesafe/v1/systemone` can route a ticket, score its severity, and flag whether it's urgent, in one inference instead of three.

## Specs

| | |
|---|---|
| Context window | 32,000 tokens |
| Choice options per question | Up to 255 |
| Score levels per question | 2 to 10 |
| Latency | 70-500ms end to end, per TypeSafe |
| Training | Reinforcement Learning for Calibrated Decisions (RLCD) |

## Pricing

| | Input | Output |
|---|---|---|
| Jev | $0.042/M | Free |

There's effectively nothing to generate, so there's nothing to charge for on the output side. Every chat model already on Token Station costs more per token on the input side alone, from GPT-6 Luna's $0.10/M up to Claude Fable 5.1's $10/M. Token Station passes TypeSafe's rate through directly, no markup.

## Where it actually helps

Dropping a classification or routing decision into a full chat model works, but it means waiting on a sequential token stream for an answer that was always going to be one of a handful of options. A few places that trade shows up directly:

- **Model routing**: classify a request's difficulty before deciding whether it needs a frontier model at all, instead of spending a full Opus-class call to tell "reset my password" apart from "migrate our billing schema."
- **Tool-call gating**: approve, block, or escalate a risky tool call (shell access, a spend, a delete) before it runs, with a confidence score code can threshold on.
- **RAG reranking**: score query-to-chunk relevance fast enough to rerank a large candidate set, saving the chat model's context budget for synthesis instead of search.
- **Ticket and request triage**: route high-volume, low-creativity traffic by queue, priority, or owner without opening a full conversation for each one.
- **Loop and trajectory checks**: ask whether an agent's last step actually made progress, and stop a runaway loop early instead of burning turns on it.

TypeSafe's own benchmarks claim up to 193.6x the speed and 444.6x lower cost than comparable LLMs on tasks like these, measured against GPT-5.6 Terra, GPT-6 Astra, and Claude Fable 5.1. All three are already on Token Station, so the comparison is one key away if you want to check it yourself. Independent tracking of launch week told a more modest story: across thousands of user-reported results, the median came out to roughly 7x faster and 30x cheaper, not 193x and 444x. Still a real win on the right workload, just a smaller one than the headline number.

TypeSafe also calls this a 0% hallucination rate, and in a narrow sense that's accurate: a `choice` answer is checked against the `criteria` keys you provided, so Jev cannot return an option you didn't offer. That guarantees a valid answer, not a correct one. It's a classifier with a stricter output contract than a chat model, still worth evaluating on your own data the same way you would any other model.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): no card required, with a 100% match up to $50 on your first top-up. Export your key and send your first request to `typesafe/jev-1.13.0`, no waitlist required.

[Try Token Station](https://models.bytefuture.ai/intro.html)
