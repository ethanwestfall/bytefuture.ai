---
slug: "glm-5-2-zai-stock-jump"
lang: "en"
title: "GLM-5.2 sent Z.AI's stock up 33%. Now try it free on Token Station"
summary: "Zhipu AI's Hong Kong-listed shares jumped as much as 48% the day GLM-5.2 shipped, its open-source 1M-context coding model. Why it moved, and how to try GLM-5.2 free with a Token Station signup."
category: "research"
date: "2026-06-15"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/glm-5-2-zai-stock-jump-cover.png"
draft: false
---

<p>GLM-5.2 turned a routine-looking model release into a market event. On June 15, <a href="https://finance.yahoo.com/quote/2513.HK/">Zhipu AI's Hong Kong-listed shares</a> jumped as much as 48% intraday to HK$1,620 and closed up 32.8% at HK$1,457.</p>

  <p>The stock is now up roughly 820% since Zhipu's IPO in early January. JPMorgan raised its price target to HK$1,400 and kept an overweight rating, and Bank of America started coverage at buy. A version bump does not usually move a company like that. This one did.</p>

  <p>The dollar figures put it in perspective. The day before GLM-5.2 shipped, Z.AI's listed shares were worth around $60 billion. The launch added close to $20 billion in a single session and lifted the company to roughly $80 billion, about the size of <a href="https://finance.yahoo.com/quote/ABNB/">Airbnb</a>. The easiest yardstick is <a href="https://finance.yahoo.com/quote/COIN/">Coinbase</a>, worth about $42 billion in mid-June 2026: GLM-5.2 took Z.AI from roughly one and a half Coinbases to nearly two in a single day. A coding-model release is now moving a company the size of a US tech blue chip.</p>

  <h2 id="why-the-stock-moved">Why the stock moved</h2>

  <p>GLM-5.2 is Z.AI's new flagship coding model, and two things made its launch a market story rather than a footnote.</p>

  <p>First, it is <strong>open source</strong>, released under the MIT license with a 1-million-token context window and a focus on long-horizon agentic coding. It extends a lineage that has been closing on the closed frontier: GLM-5 scored 77.8% on SWE-bench Verified, and each release since has narrowed the gap. Because the weights are downloadable, the capability cannot be revoked.</p>

  <p>Second, the timing. GLM-5.2 arrived the same weekend a US export-control order forced Anthropic to disable its two most powerful models, Claude Fable 5 and Mythos 5, for every user. One frontier vendor went dark by government directive. An open model with a frontier-class context window showed up at roughly a tenth of the price of Anthropic's top Claude Code and Max tiers. Investors read that as Chinese open models stepping into the gap, and re-rated the company that ships them.</p>

  <p>Whether the rally holds is a question for the market. The more useful question for a developer is narrower: is the model behind it actually good on your code? You do not have to buy the stock to find out.</p>

  <h2 id="try-it-free">Try GLM-5.2 free on Token Station</h2>

  <p>GLM-5.2 is live on <a href="https://models.bytefuture.ai/intro.html" onclick="gtag('event','cta_click',{label:'post_body_token_station'});">Token Station</a> as <code>glm/glm-5.2</code>, with the full 1M-token context, at Z.AI's list price and zero markup: $1.40 per million input tokens and $4.40 per million output. One thing to budget for: thinking is always on, so reasoning tokens bill as output.</p>

  <p>It is free to start. <a href="https://models.bytefuture.ai/signup" onclick="gtag('event','cta_click',{label:'post_body_signup'});">Register</a> and you get $1 in credit, with no card and no Z.AI account or Coding Plan subscription to set up. Your first top-up then adds up to $50 in bonus credit. Point the coding tools you already use at <code>glm/glm-5.2</code> and run your real work through it.</p>

  <h3>Claude Code</h3>

  <p>Claude Code reads its model and endpoint from environment variables. Route every tier through Token Station to GLM-5.2:</p>

  <pre><code>export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="glm/glm-5.2"
export ANTHROPIC_DEFAULT_SONNET_MODEL="glm/glm-5.2"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="glm/glm-5.2"
export CLAUDE_CODE_SUBAGENT_MODEL="glm/glm-5.2"

claude</code></pre>

  <h3>Codex</h3>

  <p>Configure Token Station as the provider and make GLM-5.2 the model:</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
model = "glm/glm-5.2"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF

export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

  <h3>OpenClaw</h3>

  <p>Register Token Station as a provider and set GLM-5.2 as the default model:</p>

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
            "id": "glm/glm-5.2",
            "name": "GLM-5.2 (Token Station)",
            "contextWindow": 1000000,
            "maxTokens": 131072
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/glm/glm-5.2" }
    }
  }
}</code></pre>

  <p>One key, the harness you already run, and the model the market just re-rated. If GLM-5.2 holds up on your repository, a free signup is all it costs to find out. If it does not, you change one line of config and move on.</p>

  <p>Start here: <a href="https://models.bytefuture.ai/signup" onclick="gtag('event','cta_click',{label:'post_body_signup'});">models.bytefuture.ai</a></p>
