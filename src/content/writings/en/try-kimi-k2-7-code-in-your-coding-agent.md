---
slug: "try-kimi-k2-7-code-in-your-coding-agent"
lang: "en"
title: "Kimi K2.7 Code: Cheap Enough to Try, Maybe Good Enough to Share the Work"
summary: "Moonshot's new 1T open-weights coding model costs $0.95/$4 per million tokens. Pair it with your SOTA model in Claude Code, Codex, or OpenClaw and let it carry the routine work."
category: "tutorial"
date: "2026-06-13"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/kimi-k2-7-code-cover.png"
draft: false
---

<p>Yesterday Moonshot AI dropped <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Kimi K2.7 Code</a> on Hugging Face: a 1-trillion-parameter Mixture-of-Experts coding model (32B active) with a 256K context window, open weights under a Modified MIT license.</p>

  <p>If you read our <a href="/blog/try-claude-fable-5-in-codex-openclaw-and-pi.html">Claude Fable 5 piece</a>, this is the same logic running in reverse. With Fable 5, the capability was proven and the price was the risk. With K2.7 Code, the price is trivial and the capability is the open question. The model is one day old, no third party has benchmarked it, and Moonshot's own numbers put it behind the frontier. Both situations end in the same posture: run a cheap, reversible experiment inside the coding harness you already use.</p>

  <p>There is one twist that makes this experiment more interesting than a simple swap. At <strong>$0.95 per million input tokens and $4.00 per million output</strong>, K2.7 Code costs about a tenth of Claude Fable 5 on input and a twelfth on output. That is cheap enough to give it a different job: working alongside your SOTA model, taking the routine fan-out work while the expensive model keeps the hard parts.</p>

  <p>K2.7 Code is on <a href="https://models.bytefuture.ai">Token Station</a> as <code>kimi/kimi-k2.7-code</code>, at Moonshot's list price with zero markup, and your <a href="https://models.bytefuture.ai/signup">$1 signup credit</a> covers a lot of it.</p>

  <h2 id="what-we-know">What we know (and what we don't)</h2>

  <p>From the <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">model card</a>:</p>

  <ul>
    <li><strong>Built for coding agents.</strong> It is a coding-focused successor to Kimi K2.6, tuned for long-horizon software engineering: interleaved thinking, multi-step tool calls, MCP support, and reasoning preserved across turns.</li>
    <li><strong>About 30% fewer thinking tokens</strong> than K2.6 at higher coding scores, which matters when you pay per output token.</li>
    <li><strong>1T total parameters, 32B active</strong>, 384 experts, native INT4 support, plus a 400M-parameter vision encoder for image input.</li>
    <li><strong>Open weights, Modified MIT.</strong> You can download the whole thing and serve it yourself with vLLM or SGLang.</li>
  </ul>

  <p>And the honest part. Moonshot published its own comparison against the frontier, and K2.7 Code loses:</p>

  <figure>
    <img src="kimi-k2-7-code-benchmarks.png" alt="Grouped bar chart of Moonshot's self-reported benchmarks: Kimi K2.7 Code scores 62.0 on Kimi Code Bench v2 versus 69.0 for GPT-5.5 and 67.4 for Claude Opus 4.8; 53.6 on ProgramBench versus 69.1 and 63.8; and 76.0 on MCP Atlas versus 79.4 and 81.3" />
    <figcaption>Moonshot's own published numbers. K2.7 Code trails the frontier on all three. Data: <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Kimi K2.7 Code model card</a>, June 2026.</figcaption>
  </figure>

  <p>A vendor publishing benchmarks where its model loses is a good sign for the numbers' honesty, and the gaps are not embarrassing: roughly 7 points behind GPT-5.5 on Moonshot's coding bench, closer on tool use. The previous Kimi release (K2.6) is currently the best open-weights model on the Artificial Analysis Intelligence Index. What nobody knows yet is how K2.7 Code behaves on <em>your</em> codebase, in <em>your</em> harness, over a long agentic session. That is the unknown this experiment resolves.</p>

  <p>One disambiguation, in the same spirit as our Grok Build article: K2.7 Code the <strong>model</strong> is optimized for Moonshot's own <em>Kimi Code CLI</em>, their coding harness. You do not need that CLI. The model speaks OpenAI- and Anthropic-compatible APIs, and Token Station translates whatever your existing harness sends.</p>

  <h2 id="the-price">The price: a rounding error next to the frontier</h2>

  <p>All of these are live on Token Station at the providers' list prices:</p>

  <table>
    <tr><th>Model</th><th>Input / 1M</th><th>Output / 1M</th><th>Context</th></tr>
    <tr><td><code>kimi/kimi-k2.7-code</code></td><td><strong>$0.95</strong></td><td><strong>$4.00</strong></td><td>256K</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>$1.00</td><td>$2.00</td><td>256K</td></tr>
    <tr><td><code>anthropic/claude-sonnet-4-6</code></td><td>$3.00</td><td>$15.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>$5.00</td><td>$25.00</td><td>1M</td></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>$5.00</td><td>$30.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-fable-5</code></td><td>$10.00</td><td>$50.00</td><td>1M</td></tr>
  </table>

  <p>The $1 signup credit buys roughly 1 million input tokens or 250K output tokens at K2.7 Code prices. Where the same credit barely covers a few Fable 5 prompts, here it covers a real evaluation. The downside risk of this experiment rounds to zero. And your first top-up adds up to $50 in bonus credit, which at K2.7 Code prices is weeks of evaluation.</p>

  <h2 id="share-the-work">The real experiment: share the work</h2>

  <p>Coding agents already split their work into tiers. There is the main loop, where planning and hard reasoning happen, and there is the fan-out: subagents reading files, running searches, executing tests, summarizing results. The fan-out burns most of the tokens and needs the least brilliance.</p>

  <p>That split is exactly where a $4-per-million model earns a place next to a $50-per-million one. Keep Fable 5 or Opus 4.8 in the driver's seat and hand the routine work to K2.7 Code. If Moonshot's numbers hold up in practice, the quality drop on delegated tasks is small and the cost drop is more than 10x on every delegated token.</p>

  <h2 id="what-you-need">What you need</h2>

  <ul>
    <li>A Token Station account (<a href="https://models.bytefuture.ai/signup">sign up free</a>; $1 in credit, no card, no Moonshot account needed)</li>
    <li>Your Token Station API key (starts with <code>gw-</code>)</li>
    <li>Claude Code, Codex, or OpenClaw installed</li>
  </ul>

  <h2 id="claude-code-setup">Claude Code setup: the two-tier split</h2>

  <p>Claude Code exposes its model tiers as environment variables, which makes it the cleanest place to run the share-the-work experiment. Reserve the Opus slot for Claude Fable 5 and give everything else to the workhorse:</p>

  <pre><code># Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

# Top tier: Fable 5 takes the genuinely hard problems
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-fable-5"

# Everything else runs on the workhorse
export ANTHROPIC_DEFAULT_SONNET_MODEL="kimi/kimi-k2.7-code"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi/kimi-k2.7-code"
export CLAUDE_CODE_SUBAGENT_MODEL="kimi/kimi-k2.7-code"

claude</code></pre>

  <p>An ordinary session now runs K2.7 Code end to end: the main loop, every subagent, every background search, all billing at $4 per million output instead of $50. When a problem actually needs frontier judgment, escalate with <code>/model opus</code> and Fable 5 takes over; drop back down when the hard part is done. The expensive model becomes what it should be at that price, a specialist you call in.</p>

  <p>Swap <code>anthropic/claude-fable-5</code> for <code>anthropic/claude-opus-4-8</code> in the Opus slot if Fable 5's price makes you wince; the escalation pattern works at any tier.</p>

  <h2 id="codex-setup">Codex setup</h2>

  <p>Codex runs one model per session, but its <a href="https://developers.openai.com/codex/config-reference">profiles</a> give you the same split at the invocation level: make the workhorse the default and keep a named escalation profile for Fable 5.</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
# Default: the workhorse
model = "kimi/kimi-k2.7-code"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"

# Escalation: Fable 5 on demand
[profiles.deep]
model = "anthropic/claude-fable-5"
EOF

export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"

codex                  # routine work on K2.7 Code
codex --profile deep   # hard problems on Fable 5</code></pre>

  <p>Day to day you launch plain <code>codex</code> and pay workhorse rates. When a task deserves the frontier model, <code>codex --profile deep</code> brings in Fable 5 for that invocation only. Nothing else in the config moves.</p>

  <h2 id="openclaw-setup">OpenClaw setup</h2>

  <p>OpenClaw makes the split a first-class setting. Sub-agents inherit the caller's model unless <code>agents.defaults.subagents.model</code> says otherwise (<a href="https://docs.openclaw.ai/tools/subagents">docs</a>), so Fable 5 can drive while every spawned sub-agent runs on K2.7 Code:</p>

  <pre><code>{
  "models": {
    "mode": "merge",
    "providers": {
      "token-station": {
        "baseUrl": "https://models.bytefuture.ai/v1",
        "apiKey": "${TOKEN_STATION_API_KEY}",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "anthropic/claude-fable-5",
            "name": "Claude Fable 5 (Token Station)",
            "contextWindow": 1000000,
            "maxTokens": 128000
          },
          {
            "id": "kimi/kimi-k2.7-code",
            "name": "Kimi K2.7 Code (Token Station)",
            "contextWindow": 256000,
            "maxTokens": 32768
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/anthropic/claude-fable-5" },
      "subagents": { "model": "token-station/kimi/kimi-k2.7-code" }
    }
  }
}</code></pre>

  <p>The main agent keeps frontier judgment; the parallel fan-out (the part that burns tokens) bills at workhorse rates. To run the whole thing on K2.7 Code instead, point <code>agents.defaults.model.primary</code> at it; both models sit behind the same key either way.</p>

  <h2 id="quirks">Quirks worth knowing</h2>

  <ul>
    <li><strong>Thinking is always on.</strong> K2.7 Code reasons before answering and carries that reasoning across turns; you cannot turn it off. Budget for reasoning tokens in the output bill, softened by the 30% reduction over K2.6.</li>
    <li><strong>256K context.</strong> Generous, but a quarter of the 1M window on frontier Claude and GPT models. Long agentic sessions will compact sooner.</li>
    <li><strong>It has a home-team harness.</strong> Moonshot tunes it for the Kimi Code CLI, so expect occasional rough edges elsewhere. Token Station's tool and parameter name translation handles the wire-level mismatches.</li>
    <li><strong>The exit path goes both ways.</strong> If the experiment fails, delete the config. If it succeeds, the weights are Modified MIT on <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Hugging Face</a>: you can eventually serve the exact same model on your own hardware. A cloud experiment that can graduate to self-hosting is the hybrid-inference story in miniature.</li>
  </ul>

  <h2 id="try-it">Run the experiment</h2>

  <p>Give K2.7 Code the work your expensive model is overqualified for: subagent searches, test runs, boilerplate, summaries. Watch for a week where it holds up and where it drops the ball, then settle the split accordingly. The same Token Station key runs <code>anthropic/claude-fable-5</code>, <code>anthropic/claude-opus-4-8</code>, and <code>kimi/kimi-k2.7-code</code> side by side, so the comparison is built in.</p>

  <p>Sign up at <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> ($1 in free credit, no card; up to $50 bonus on your first top-up) and find out whether a one-day-old open-weights model can carry half your agent's workload at a tenth of the price.</p>
