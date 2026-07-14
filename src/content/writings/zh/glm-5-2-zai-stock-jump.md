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
