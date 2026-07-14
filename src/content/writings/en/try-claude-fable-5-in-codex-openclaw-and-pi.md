---
slug: "try-claude-fable-5-in-codex-openclaw-and-pi"
lang: "en"
title: "Try Before You Commit: Claude Fable 5 in Codex, OpenClaw, and Pi"
summary: "Anthropic's new flagship is state-of-the-art, controversial, and $10/$50 per million tokens. Experiment with it temporarily in your existing harness. No Anthropic account, just Token Station free credits."
category: "tutorial"
date: "2026-06-12"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-fable-5-cover.png"
draft: false
---

<p><a href="https://www.anthropic.com/news/claude-fable-5-mythos-5">Claude Fable 5</a> launched on June 9, and on raw capability it is hard to argue with: a new tier above Opus, state-of-the-art on nearly every benchmark Anthropic tested, and the new #1 on the <a href="https://artificialanalysis.ai/articles/claude-fable-5-mythos-intelligence-index">Artificial Analysis Intelligence Index</a>.</p>

  <p>It is also the most controversial model launch in recent memory, and the most expensive API Anthropic has ever shipped: <strong>$10 per million input tokens and $50 per million output</strong>, double Opus 4.8 on both sides.</p>

  <p>That combination, clearly brilliant yet openly distrusted and priced like a luxury good, calls for a specific posture: <strong>experiment with it, but don't commit to it.</strong> Don't sign up for a new account, don't fund a new balance, don't re-platform your workflow. Run it <em>temporarily</em> inside the coding harness you already use, on pay-as-you-go tokens you can stop spending the moment you've seen enough.</p>

  <p>Fable 5 is live on <a href="https://models.bytefuture.ai">Token Station</a> as <code>anthropic/claude-fable-5</code>, at Anthropic's list price with zero markup, and your <a href="https://models.bytefuture.ai/signup">$1 signup credit</a> works on it. This guide shows the exact setup for <strong>Codex</strong>, <strong>OpenClaw</strong>, and <strong>Pi</strong>. (If you use Claude Code, Fable 5 is native there; this guide is for everyone else.)</p>

  <h2 id="what-it-is">What Fable 5 actually is</h2>

  <p>Anthropic describes Fable 5 as a "Mythos-class" model, the research tier previously kept internal, made safe enough for general availability. The headline numbers are not subtle:</p>

  <ul>
    <li><strong>80.3% on SWE-bench Pro</strong>, versus 58.6% for GPT-5.5, the largest gap on that benchmark since it was introduced (<a href="https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks">Tom's Hardware</a>).</li>
    <li><strong>#1 on the Artificial Analysis Intelligence Index</strong> at 64.9, roughly 5 points clear of the closest non-Anthropic model.</li>
    <li><strong>First model past 90%</strong> on Anthropic's long-running analytical-tasks benchmark, a 10-point jump over Opus.</li>
    <li><strong>12-hour autonomous runs</strong> reported in early testing, and Stripe says it migrated a 50-million-line Ruby codebase in a day, work scoped at two months by hand (<a href="https://venturebeat.com/technology/anthropic-brings-mythos-to-the-masses-with-claude-fable-5-its-most-powerful-generally-available-model-ever">VentureBeat</a>).</li>
    <li><strong>State-of-the-art vision</strong>, per Anthropic, and a 1M-token context window with up to 128K output.</li>
  </ul>

  <figure>
    <img src="claude-fable-5-benchmarks.png" alt="Bar charts comparing Claude Fable 5 to other frontier models: it leads the Artificial Analysis Intelligence Index at 65 versus Claude Opus 4.8 at 61, GPT-5.5 at 60, Claude Opus 4.7 at 57, and Kimi K2.6 at 54; and scores 80.3% on SWE-bench Pro versus GPT-5.5's 58.6%" />
    <figcaption>Fable 5 vs the frontier, June 2026. Data: <a href="https://artificialanalysis.ai/models">Artificial Analysis Intelligence Index v4.0</a>; Anthropic (SWE-bench Pro).</figcaption>
  </figure>

  <p>For coding agents specifically (the long-horizon, multi-step work that Codex, OpenClaw, and Pi exist for), this is exactly the profile you'd want to test.</p>

  <h2 id="the-controversy">The controversy, and the case for renting</h2>

  <p>Within hours of launch, a paragraph buried in Fable 5's 319-page system card set off the backlash. The model had been trained to <strong>silently degrade its own answers</strong> when it detected requests related to frontier AI development: infrastructure for training large models, certain evaluation work, and similar topics. You would ask, get a deliberately weakened answer, and never be told the model was holding back. Critics called it <a href="https://fortune.com/2026/06/10/anthropic-accu-claude-fable-5-limits-capabilities-ai-researchers-developers/">"secret sabotage"</a>; former Anthropic researchers joined in publicly.</p>

  <p>Anthropic backed down within two days: <em>"We made the wrong tradeoff, and we apologize for not getting the balance right."</em> Flagged requests are now visibly identified and routed to Claude Opus 4.8, and API users get an explanation when a request is refused. Separately, some restricted topics (certain cybersecurity, biology, and chemistry requests, plus model-distillation asks) get answered by Opus 4.8 instead of Fable 5; Anthropic says this triggers in under 5% of sessions. And in an unrelated-but-not-reassuring development, <a href="https://www.msn.com/en-us/news/insight/microsoft-blocks-employee-use-of-claude-fable-5-over-data-policy/gm-GM9063948F">Microsoft blocked employee use of Fable 5</a> in GitHub Copilot over its new data-retention rules.</p>

  <p>Here is why this matters for how you adopt it. The capability is real, but the <em>policy surface</em> around the model is visibly still moving. What gets silently rerouted, what gets refused, what data is retained: all of it has changed week to week since launch and may change again. That is a terrible foundation to re-platform a workflow onto, and a great reason to keep your experiment <strong>reversible</strong>:</p>

  <ul>
    <li><strong>Don't change tools.</strong> Keep Codex, OpenClaw, or Pi and swap only the model behind them.</li>
    <li><strong>Don't open a new account.</strong> No Anthropic console signup, no prepaid balance to fund and later claw back. Your existing Token Station key covers it.</li>
    <li><strong>Don't subscribe.</strong> Pay per token, at list price, only while you're actively testing. If next week's policy change sours you on it, change one line of config and you're back on Opus 4.8 or GPT-5.5. Same key, same harness.</li>
  </ul>

  <h2 id="the-price">The price: budget your curiosity</h2>

  <p>Fable 5 is the most expensive mainstream API model on the market right now. All of these are live on Token Station at the providers' list prices:</p>

  <table>
    <tr><th>Model</th><th>Input / 1M</th><th>Output / 1M</th><th>Context</th></tr>
    <tr><td><code>anthropic/claude-fable-5</code></td><td><strong>$10.00</strong></td><td><strong>$50.00</strong></td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>$5.00</td><td>$25.00</td><td>1M</td></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>$5.00</td><td>$30.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-sonnet-4-6</code></td><td>$3.00</td><td>$15.00</td><td>1M</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>$1.00</td><td>$2.00</td><td>256K</td></tr>
  </table>

  <p>That's 2× Opus 4.8 on both sides, and <strong>25× Grok Build</strong> on output. A single long agentic session that would cost pennies on Grok Build can cost real dollars on Fable 5. Long-horizon runs with lots of thinking and tool output are exactly where the $50/M output price bites.</p>

  <p>The flip side: even the $1 Token Station signup credit is enough for a first taste: roughly 100K input tokens or 20K output tokens at Fable 5 prices, which in practice means a handful of moderate coding-agent prompts. Enough to form a first impression; not enough to get hurt. For a fuller evaluation, your first top-up adds up to $50 in bonus credit.</p>

  <h2 id="what-you-need">What you need</h2>

  <ul>
    <li>A Token Station account (<a href="https://models.bytefuture.ai/signup">sign up free</a>; $1 in credit, no card required, no Anthropic account involved)</li>
    <li>Your Token Station API key (starts with <code>gw-</code>)</li>
    <li>Codex, OpenClaw, or Pi installed</li>
  </ul>

  <p>In every harness below, the model ID is the same: <code>anthropic/claude-fable-5</code>. Token Station translates each harness's native API to Anthropic's, including the tool and parameter name mapping that breaks naive proxy setups.</p>

  <h2 id="codex-setup">Codex setup</h2>

  <p>Codex speaks OpenAI's Responses API; Token Station translates it to Anthropic's. Create the config:</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
model = "anthropic/claude-fable-5"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

  <p>Then set your key and launch:</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

  <p>To end the experiment, change <code>model</code> back to whatever you ran before. Nothing else moves.</p>

  <h2 id="openclaw-setup">OpenClaw setup</h2>

  <p>OpenClaw takes custom providers in its <code>openclaw.json</code> config (<a href="https://docs.openclaw.ai/concepts/model-providers">docs</a>). Add Token Station as an <code>anthropic-messages</code> provider and point the default model at Fable 5:</p>

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
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/anthropic/claude-fable-5" }
    }
  }
}</code></pre>

  <p>Restart the OpenClaw gateway and it routes through Token Station. To roll back, restore your previous <code>agents.defaults.model</code>; the provider entry can stay for next time.</p>

  <h2 id="pi-setup">Pi setup</h2>

  <p>Pi registers custom providers in <code>~/.pi/agent/models.json</code> (<a href="https://pi.dev/docs/latest/custom-provider">docs</a>):</p>

  <pre><code>{
  "providers": {
    "token-station": {
      "name": "Token Station",
      "baseUrl": "https://models.bytefuture.ai/v1",
      "apiKey": "$TOKEN_STATION_API_KEY",
      "api": "anthropic-messages",
      "models": [
        {
          "id": "anthropic/claude-fable-5",
          "name": "Claude Fable 5",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "maxTokens": 128000
        }
      ]
    }
  }
}</code></pre>

  <p>Launch with the model selected, or switch live with <code>/model</code>:</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
pi --model anthropic/claude-fable-5</code></pre>

  <p>One note for OpenClaw and Pi: clients differ on whether they append <code>/v1</code> themselves. If you see 404s with the config above, drop the <code>/v1</code> from <code>baseUrl</code> and retry.</p>

  <h2 id="api-quirks">API quirks worth knowing</h2>

  <p>Fable 5 has the strictest request surface of any Claude model, which matters if your harness exposes model parameters:</p>

  <ul>
    <li><strong>No sampling parameters.</strong> <code>temperature</code>, <code>top_p</code>, and <code>top_k</code> are rejected with a 400. Steer with prompting instead.</li>
    <li><strong>Adaptive thinking only.</strong> Fixed thinking budgets (<code>budget_tokens</code>) are gone, and (unique to Fable 5) even an explicit "thinking disabled" setting is rejected. Leave thinking settings alone or omit them.</li>
    <li><strong>No assistant prefills.</strong> Harnesses that prefill the assistant turn to force output shapes will get 400s; structured-output features work instead.</li>
    <li><strong>Safeguard rerouting.</strong> A small share of requests (Anthropic says under 5% of sessions) on restricted topics are answered by Opus 4.8 instead, now with visible notice, so don't be surprised if an occasional response identifies itself as Opus.</li>
  </ul>

  <h2 id="try-it">Run the experiment</h2>

  <p>The point of this setup is that it's disposable. Spend your free credit putting Fable 5 through your own backlog, then decide with data. Because every model on Token Station sits behind the same key, the comparison is one config line: run the same task on <code>anthropic/claude-opus-4-8</code> (half the price), <code>openai/gpt-5.5</code>, or <code>xai/grok-build-0.1</code> (a twenty-fifth the output price) and see whether Fable 5's edge is worth its premium <em>for your work</em>.</p>

  <p>If it is, great: keep the config and add funds. If it isn't, or the next policy surprise changes your mind, you delete three lines of config and walk away. Nothing was subscribed to. Nothing needs canceling.</p>

  <p>Sign up at <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> ($1 in free credit, no card, no Anthropic account; up to $50 bonus on your first top-up) and find out what a Mythos-class model does on your code.</p>
