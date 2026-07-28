---
slug: qwen-3-8-max-token-station
lang: en
title: "First look: Qwen 3.8-Max on Token Station"
summary: "Alibaba has only previewed Qwen 3.8-Max (2.4T parameters, sparse MoE, multimodal) and published no benchmarks. So we ran the same three tasks through qwen3.8-max-preview, kimi-k3, and gpt-5.6 on Token Station. All three passed; Qwen 3.8-Max was the most consistent on latency."
category: product
date: 2026-07-28
cta: https://models.bytefuture.ai/intro.html
---

Alibaba previewed Qwen 3.8-Max at the World AI Conference on July 19, 2026: 2.4 trillion parameters, a sparse Mixture-of-Experts, native multimodality, and a claim that it trails only [Claude Fable 5](/blog/try-claude-fable-5-in-codex-openclaw-and-pi.html). What it does not have yet is a benchmark table, a model card, or a confirmed context window.

Rather than repeat the claim, we ran a small comparison. We sent the same three tasks through `bailian-intl/qwen3.8-max-preview`, `kimi/kimi-k3`, and `openai/gpt-5.6` on [Token Station](https://models.bytefuture.ai/intro.html), one key, temperature 0. Two are coding tasks with checkable answers; one is a probability problem.

## The tasks

- **Trapping rain water.** A two-pointer problem; the answer is verified against known inputs.
- **Probability.** Three balls drawn without replacement from 3 red, 4 blue, and 5 green. Probability all three are different colors. Exact answer: 3/11.
- **Find the bug.** A `merge_sorted` function missing one line; the fix must pass the given test cases.

Each answer was checked automatically. The code was extracted and run; the fraction was matched.

## Results

| Task | qwen3.8-max-preview | kimi-k3 | gpt-5.6 |
|---|---|---|---|
| Trapping rain water | pass, 7.6s | pass, 12.5s | pass, 5.3s |
| Probability (3/11) | pass, 7.3s | pass, 13.8s | pass, 13.5s |
| Find the bug | pass, 8.0s | pass, 31.5s | pass, 4.2s |

All nine passed. On tasks this small, that is a capability floor: every frontier model here solves them. The interesting signal is in the latency and token counts.

Qwen 3.8-Max was the most consistent. It finished every task in 7 to 8 seconds and used 142 to 165 reasoning tokens each time, regardless of the problem. [GPT-5.6](/blog/gpt-5-6-token-station.html) was the fastest and tersest on the coding tasks (4 to 5 seconds, under 120 output tokens) but took 13.5 seconds on the probability question. [Kimi K3](/blog/kimi-k3-token-station.html) spent the least reasoning on the easy tasks (55 to 86 tokens) then ramped hard on the debugging task: 294 reasoning tokens and 31.5 seconds, where the other two stayed flat.

The honest read: on a small, automatically checkable set, Qwen 3.8-Max, still in preview, held its own with two shipping frontier models, and did it with the steadiest latency. That is a reason to point your own workload at it, not a verdict.

## What is still unconfirmed

The test above is ours. The rest of the spec is Alibaba's, and parts of it are still claims.

- **2.4 trillion parameters, sparse MoE.** Active parameters per token are not disclosed, which is the number that determines serving cost.
- **Multimodal.** Text and visual inputs are confirmed. The full modality list (video, documents, speech, image generation) is not, with no spec sheet published.
- **Context window: not published.**
- **"Second only to Fable 5."** Alibaba's own words, from internal evaluations. No benchmark table or model card exists. For calibration, the predecessor Qwen 3.7-Max scored 92.4 on GPQA Diamond, 80.4 on SWE-bench Verified, and 69.7 on Terminal-Bench 2.0.
- **Open weights.** Alibaba says Qwen 3.8 is "going open-weight soon," with no date or license. The Max tier has been closed so far; the open-weight line continued separately through Qwen 3.6.

At 2.4 trillion parameters it is the second-largest publicly known model, behind Moonshot's Kimi K3 at 2.8 trillion, which shipped open-weight the same week.

## Try it on Token Station

The endpoint is the standard Token Station OpenAI-compatible API:

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bailian-intl/qwen3.8-max-preview",
    "messages": [
      {"role": "user", "content": "Refactor this function and explain the change."}
    ]
  }'
```

Token Station also exposes the Anthropic API shape, so the same route drops into Claude Code.

## Route it in your coding agent

In Claude Code, put it in the Opus slot:

```bash
# Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="bailian-intl/qwen3.8-max-preview"
export ANTHROPIC_DEFAULT_SONNET_MODEL="bailian-intl/qwen3.8-max-preview"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="bailian-intl/qwen3.8-max-preview"
export CLAUDE_CODE_SUBAGENT_MODEL="bailian-intl/qwen3.8-max-preview"

claude
```

In Codex, make it the default model:

```bash
mkdir -p ~/.codex
cat > ~/.codex/config.toml <<'EOF'
model = "bailian-intl/qwen3.8-max-preview"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF

export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex
```

## Pricing

Qwen 3.8-Max is in preview and Alibaba has not published standard API pricing. Token Station passes the provider's rate through at zero markup; check the dashboard for the current per-million rate. The $1 signup credit is enough to run a first evaluation.

The essentials:

- Base URL (OpenAI-compatible): `https://models.bytefuture.ai/v1`
- Base URL (Anthropic-compatible): `https://models.bytefuture.ai`
- Model: `bailian-intl/qwen3.8-max-preview`
- API key: starts with `gw-`, from the [Token Station dashboard](https://models.bytefuture.ai/dashboard)

[Try Token Station](https://models.bytefuture.ai/intro.html)
