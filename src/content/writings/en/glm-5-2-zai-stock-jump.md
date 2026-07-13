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

  <hr />

  <!-- Share -->
  <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
    <span style="font-family:'Space Grotesk',sans-serif; font-size:14px; color:#71717a;">Share this post</span>
    <a href="#" onclick="gtag('event','share_click',{label:'x'});window.open('https://x.com/intent/tweet?text='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href),'_blank','width=550,height=420');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Post
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'linkedin'});window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.href),'_blank','width=550,height=550');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
      LinkedIn
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'facebook'});window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),'_blank','width=550,height=550');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      Facebook
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'hackernews'});window.open('https://news.ycombinator.com/submitlink?u='+encodeURIComponent(location.href)+'&t='+encodeURIComponent(document.title),'_blank');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z"/></svg>
      Hacker News
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'reddit'});window.open('https://www.reddit.com/submit?url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title),'_blank');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.745-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
      Reddit
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'copy_link'});var b=this;navigator.clipboard.writeText(location.href).then(function(){var s=b.querySelector('.share-label');s.textContent='Copied!';setTimeout(function(){s.textContent='Copy link';},1500);});return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
      <span class="share-label">Copy link</span>
    </a>
  </div>
