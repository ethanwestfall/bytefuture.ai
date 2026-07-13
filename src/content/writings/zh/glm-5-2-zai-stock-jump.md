---
slug: "glm-5-2-zai-stock-jump"
lang: "zh"
title: "GLM-5.2 让 Z.AI 股价大涨 33%。现在可在 Token Station 免费体验"
summary: "GLM-5.2 发布当天，智谱 AI 的香港上市股票一度上涨 48%。这是它的开源、100 万 token 上下文编程模型。本文解释股价为何大涨，以及如何注册 Token Station 免费试用 GLM-5.2。"
category: "research"
date: "2026-06-15"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/glm-5-2-zai-stock-jump-cover.png"
draft: false
---

<p>GLM-5.2 把一次看似平常的模型发布变成了一场市场事件。6 月 15 日，<a href="https://finance.yahoo.com/quote/2513.HK/">智谱 AI 的香港上市股票</a>盘中一度上涨 48%，触及 1,620 港元，收盘上涨 32.8%，报 1,457 港元。</p>

  <p>自 1 月初智谱 IPO 以来，该股已累计上涨约 820%。摩根大通将目标价上调至 1,400 港元并维持「增持」评级，美国银行也以「买入」评级启动覆盖。一次版本升级通常不会让一家公司出现这样的变动，这一次却做到了。</p>

  <p>用美元计价更能看清分量。GLM-5.2 发布前一天，Z.AI 上市股票的市值约为 600 亿美元。这次发布在一个交易日内增加了近 200 亿美元，把公司市值推高到约 800 亿美元，与 <a href="https://finance.yahoo.com/quote/ABNB/">Airbnb</a> 相当。最直观的参照是 <a href="https://finance.yahoo.com/quote/COIN/">Coinbase</a>，其 2026 年 6 月中旬市值约为 420 亿美元：GLM-5.2 让 Z.AI 在一天之内从大约 1.5 个 Coinbase 涨到接近 2 个。如今一次编程模型的发布，正在撬动一家相当于美国科技蓝筹规模的公司。</p>

  <h2 id="why-the-stock-moved">股价为何大涨</h2>

  <p>GLM-5.2 是 Z.AI 全新的旗舰编程模型，有两点让它的发布成为市场话题，而不只是一条脚注。</p>

  <p>第一，它是<strong>开源</strong>的，以 MIT 许可证发布，拥有 100 万 token 的上下文窗口，并专注于长程的智能体编程。它延续了一条不断逼近闭源前沿的脉络：GLM-5 在 SWE-bench Verified 上取得 77.8% 的成绩，此后每一次发布都在缩小差距。由于权重可以下载，这种能力无法被收回。</p>

  <p>第二，是时机。GLM-5.2 发布的同一个周末，一项美国出口管制令迫使 Anthropic 对所有用户停用其两款最强模型 Claude Fable 5 和 Mythos 5。一家前沿厂商因政府指令而停摆。与此同时，一款拥有前沿级上下文窗口的开源模型出现了，价格大约只有 Anthropic 顶级 Claude Code 和 Max 套餐的十分之一。投资者将此解读为中国开源模型正在补上这一空缺，并重新评估了推出这些模型的公司。</p>

  <p>这轮上涨能否持续，是留给市场的问题。对开发者来说，更有用的问题更具体：支撑这轮上涨的模型，在你的代码上到底好不好用？你不必买股票就能找到答案。</p>

  <h2 id="try-it-free">在 Token Station 免费试用 GLM-5.2</h2>

  <p>GLM-5.2 已在 <a href="https://models.bytefuture.ai/intro.html" onclick="gtag('event','cta_click',{label:'post_body_token_station'});">Token Station</a> 上线，模型 ID 为 <code>glm/glm-5.2</code>，提供完整的 100 万 token 上下文，按 Z.AI 的标价、零加价计费：每百万输入 token 1.40 美元，每百万输出 token 4.40 美元。有一点要预留预算：思考始终开启，因此推理 token 会按输出计费。</p>

  <p>起步是免费的。<a href="https://models.bytefuture.ai/signup" onclick="gtag('event','cta_click',{label:'post_body_signup'});">注册</a>即可获得 1 美元额度，无需信用卡，也无需开通 Z.AI 账户或 Coding Plan 订阅。首次充值还能再获得最多 50 美元的赠送额度。把你已经在用的编程工具指向 <code>glm/glm-5.2</code>，用它跑你真实的工作。</p>

  <h3>Claude Code</h3>

  <p>Claude Code 从环境变量读取模型和端点。把每个层级都通过 Token Station 路由到 GLM-5.2：</p>

  <pre><code>export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="glm/glm-5.2"
export ANTHROPIC_DEFAULT_SONNET_MODEL="glm/glm-5.2"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="glm/glm-5.2"
export CLAUDE_CODE_SUBAGENT_MODEL="glm/glm-5.2"

claude</code></pre>

  <h3>Codex</h3>

  <p>把 Token Station 配置为 provider，并将 GLM-5.2 设为模型：</p>

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

  <p>把 Token Station 注册为 provider，并将 GLM-5.2 设为默认模型：</p>

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

  <p>一把密钥、你已经在用的工具，加上这个刚被市场重新定价的模型。如果 GLM-5.2 在你的代码库上经得起考验，验证它的全部成本就是一次免费注册；如果不行，你只需改一行配置便可继续前进。</p>

  <p>从这里开始：<a href="https://models.bytefuture.ai/signup" onclick="gtag('event','cta_click',{label:'post_body_signup'});">models.bytefuture.ai</a></p>

  <hr />

  <!-- Share -->
  <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
    <span style="font-family:'Space Grotesk',sans-serif; font-size:14px; color:#71717a;">分享这篇文章</span>
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
    <a href="#" onclick="gtag('event','share_click',{label:'copy_link'});var b=this;navigator.clipboard.writeText(location.href).then(function(){var s=b.querySelector('.share-label');s.textContent='已复制！';setTimeout(function(){s.textContent='复制链接';},1500);});return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
      <span class="share-label">复制链接</span>
    </a>
  </div>
