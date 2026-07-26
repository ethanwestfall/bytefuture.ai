---
slug: "kimi-k3-token-station"
lang: "en"
title: "Kimi K3 is the first open-source model in the 3-trillion-parameter class. Try it free on Token Station"
summary: "Moonshot's Kimi K3 has 2.8 trillion parameters and a 1M-token context window, the first open-source model to reach the 3-trillion-parameter class. It's live on Token Station as kimi/kimi-k3 at list price, zero markup."
category: "tutorial"
date: "2026-07-25"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

Moonshot AI's Kimi K3 has 2.8 trillion parameters, the first open-source model to reach the 3-trillion-parameter class. Moonshot says a Kimi model has held the frontier for open-source model scale in 9 of the past 12 months. K3 extends that streak by a wide margin.

Scale alone would make K3 notable. What makes it useful is the rest of the spec: a 1-million-token context window, native visual understanding, and an architecture built specifically for long-horizon coding, knowledge work, and reasoning. Full model weights ship by July 27, 2026; the API is live on Moonshot's platform now, and on Token Station today.

## What's new under the hood

K3 is built on Kimi Delta Attention (KDA), a hybrid linear attention mechanism, combined with Attention Residuals (AttnRes) to help information flow through longer sequences and deeper models. On the Mixture-of-Experts side, Moonshot's Stable LatentMoE framework pushes sparsity further: K3 activates just 16 of 896 experts per token. Together with training and data improvements, Moonshot puts K3's overall scaling efficiency at roughly 2.5x its predecessor, Kimi K2.

Two workloads get explicit design attention:

- **Long-horizon coding.** K3 is built to sustain long-running engineering tasks with minimal supervision: understanding large codebases, coordinating terminal tools, and combining software engineering with visual reasoning (using screenshots and visual feedback in frontend work, game development, and CAD).
- **Knowledge work.** Moonshot reports consistent gains on internal evaluations built from recurring patterns in real user-agent collaboration, beyond what public benchmarks capture.

## Where K3 lands on benchmarks

Moonshot's own framing is direct: K3's overall performance still trails the two most capable proprietary models it compares against, Claude Fable 5 and GPT-5.6 Sol, but it beats Claude Opus 4.8 on several benchmarks. Two published numbers:

- **DeepSWE: 67.3**, using the mini-SWE-agent harness.
- **BrowseComp: 90.4**, using the full 1M-token context with no context management.

The case studies are where the 1M context and long-horizon design show up in practice. On four NVIDIA Hopper GPU kernel optimization tasks, K3 performed competitively with Fable 5 (using fallback) and outperformed Opus 4.8, GPT-5.6 Sol, and GPT-5.5. In a compiler task, it built a Triton-like compiler (MiniTriton) from scratch that matches or beats Triton and `torch.compile`, and used it to run stable end-to-end nanoGPT training. On an astrophysics research task, it worked through 300+ equations of state and finished in about two hours what the team says would normally take one to two weeks by hand.

## Try Kimi K3 free on Token Station

K3 is live on [Token Station](https://models.bytefuture.ai/intro.html) as `kimi/kimi-k3`, at Moonshot's list price with zero markup: **$3.00 per million input tokens on a cache miss, $0.30 per million on a cache hit, and $15.00 per million output tokens**, with the full 1,048,576-token context window. K3's thinking mode cannot be turned off and defaults to maximum reasoning effort, so budget reasoning tokens as output; set `reasoning_effort` to `low` in your request if you want faster, cheaper responses.

One thing Token Station removes: on Moonshot's own console, K3 is gated behind a minimum $1 top-up before it unlocks. On Token Station, your signup credit unlocks it immediately, no separate Moonshot account or top-up required.

It is free to start. [Register](https://models.bytefuture.ai/signup) and you get $1 in credit, no card needed. Your first top-up then adds up to $50 in bonus credit. Here's where K3 sits next to other models already on Token Station:

| Model | Input / 1M | Output / 1M | Context |
|---|---|---|---|
| `kimi/kimi-k3` | $3.00* | $15.00 | 1,048,576 |
| `kimi/kimi-k2.7-code` | $0.95 | $4.00 | 256K |
| `glm/glm-5.2` | $1.40 | $4.40 | 1M |
| `anthropic/claude-opus-4-8` | $5.00 | $25.00 | 1M |
| `openai/gpt-5.5` | $5.00 | $30.00 | 1M |
| `anthropic/claude-fable-5` | $10.00 | $50.00 | 1M |

\* Cache miss rate. Repeated context hits the $0.30 cache-hit rate instead, per the pricing above.

Point the coding tools you already use at `kimi/kimi-k3` and run your real work through it.

### Claude Code

Claude Code reads its model and endpoint from environment variables. Route every tier through Token Station to K3:

```bash
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="kimi/kimi-k3"
export ANTHROPIC_DEFAULT_SONNET_MODEL="kimi/kimi-k3"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi/kimi-k3"
export CLAUDE_CODE_SUBAGENT_MODEL="kimi/kimi-k3"

claude
```

### Codex

Configure Token Station as the provider and make K3 the model:

```bash
mkdir -p ~/.codex
cat > ~/.codex/config.toml <<'EOF'
model = "kimi/kimi-k3"
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

### OpenClaw

Register Token Station as a provider and set K3 as the default model:

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "token-station": {
        "baseUrl": "https://models.bytefuture.ai/v1",
        "apiKey": "${TOKEN_STATION_API_KEY}",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "kimi/kimi-k3",
            "name": "Kimi K3 (Token Station)",
            "contextWindow": 1048576,
            "maxTokens": 131072
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/kimi/kimi-k3" }
    }
  }
}
```

## Quirks worth knowing

- **`max_completion_tokens` caps out higher than the default.** It defaults to 131,072 but can be set as high as 1,048,576 for output-heavy tasks.
- **Vision input needs base64 or an uploaded file ID.** Public URLs are not supported for images or video. Send images inline as base64, or upload either media type via the Files API (`ms://<file-id>`); file upload is recommended for video.
- **Web search is being updated.** Moonshot does not recommend K3's official web-search tool for production workflows in the near term.
- **Weights land a couple of days after this API access does.** K3 is open-source, but full weights ship by July 27, 2026. Everything above works today through the hosted API; self-hosting comes shortly after.

One key, the harness you already run, and the largest open-source model shipped to date, at 2.8 trillion parameters. If K3 holds up on your repository, a free signup is all it costs to find out.

Start here: [models.bytefuture.ai](https://models.bytefuture.ai/signup)
