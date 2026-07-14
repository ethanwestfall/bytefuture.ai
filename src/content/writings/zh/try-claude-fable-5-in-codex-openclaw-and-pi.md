---
slug: "try-claude-fable-5-in-codex-openclaw-and-pi"
lang: "zh"
title: "先试后用：在 Codex、OpenClaw 和 Pi 中体验 Claude Fable 5"
summary: "Anthropic 全新的旗舰模型性能领先、备受争议，价格为每百万 token 10/50 美元。在你现有的工具中临时体验它，无需 Anthropic 账户，只要 Token Station 的免费额度。"
category: "tutorial"
date: "2026-06-12"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-fable-5-cover.png"
draft: false
---

<p><a href="https://www.anthropic.com/news/claude-fable-5-mythos-5">Claude Fable 5</a> 于 6 月 9 日发布，单论性能很难挑剔：它是高于 Opus 的全新等级，在 Anthropic 测试的几乎每一项基准上都达到领先水平，并登顶 <a href="https://artificialanalysis.ai/articles/claude-fable-5-mythos-intelligence-index">Artificial Analysis Intelligence Index</a>。</p>

  <p>它也是近期最具争议的一次模型发布，更是 Anthropic 迄今定价最高的 API：<strong>输入每百万 token 10 美元、输出每百万 token 50 美元</strong>，两项都是 Opus 4.8 的两倍。</p>

  <p>这样的组合：显然出色，却又公开遭到质疑，定价更像奢侈品，需要一种明确的态度：<strong>去试，但别轻易押注。</strong>不要注册新账户，不要充值新余额，也不要把整套工作流搬到新平台上。在你已经在用的编码工具里<em>临时</em>跑一跑它，用按量计费的 token，看够了随时就能停。</p>

  <p>Fable 5 已在 <a href="https://models.bytefuture.ai">Token Station</a> 上线，模型 ID 为 <code>anthropic/claude-fable-5</code>，按 Anthropic 官方标价、零加价提供，你的 <a href="https://models.bytefuture.ai/signup">1 美元注册额度</a>也可以用在它上面。本文给出 <strong>Codex</strong>、<strong>OpenClaw</strong> 和 <strong>Pi</strong> 的完整配置。（如果你用的是 Claude Code，Fable 5 在那里是原生支持的；本文是写给其他人的。）</p>

  <h2 id="what-it-is">Fable 5 究竟是什么</h2>

  <p>Anthropic 把 Fable 5 称为「Mythos 级」模型，也就是此前一直留在内部的研究等级，如今被打磨到足够安全、可以面向所有人开放。它的核心数据相当直白：</p>

  <ul>
    <li><strong>SWE-bench Pro 得分 80.3%</strong>，而 GPT-5.5 为 58.6%，这是该基准推出以来出现的最大差距（<a href="https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks">Tom's Hardware</a>）。</li>
    <li><strong>登顶 Artificial Analysis Intelligence Index</strong>，得分 64.9，比最接近的非 Anthropic 模型高出约 5 分。</li>
    <li>在 Anthropic 长期使用的分析任务基准上，<strong>首个突破 90% 的模型</strong>，比 Opus 高出 10 分。</li>
    <li>早期测试中报告出现了 <strong>12 小时的自主运行</strong>，Stripe 称它在一天内迁移了一个 5,000 万行的 Ruby 代码库，而人工估算这项工作需要两个月（<a href="https://venturebeat.com/technology/anthropic-brings-mythos-to-the-masses-with-claude-fable-5-its-most-powerful-generally-available-model-ever">VentureBeat</a>）。</li>
    <li>据 Anthropic 称具备<strong>领先的视觉能力</strong>，并拥有 100 万 token 的上下文窗口，输出最多可达 128K。</li>
  </ul>

  <figure>
    <img src="claude-fable-5-benchmarks.png" alt="Bar charts comparing Claude Fable 5 to other frontier models: it leads the Artificial Analysis Intelligence Index at 65 versus Claude Opus 4.8 at 61, GPT-5.5 at 60, Claude Opus 4.7 at 57, and Kimi K2.6 at 54; and scores 80.3% on SWE-bench Pro versus GPT-5.5's 58.6%" />
    <figcaption>Fable 5 与前沿模型对比，2026 年 6 月。数据来源：<a href="https://artificialanalysis.ai/models">Artificial Analysis Intelligence Index v4.0</a>；Anthropic（SWE-bench Pro）。</figcaption>
  </figure>

  <p>尤其对编码 agent 而言（也就是 Codex、OpenClaw 和 Pi 所擅长的长周期、多步骤工作），这正是你会想要测试的那种特性。</p>

  <h2 id="the-controversy">争议，以及「只租不买」的理由</h2>

  <p>发布后几小时内，Fable 5 那份 319 页系统卡里一段不起眼的文字引爆了舆论。这个模型被训练成：一旦检测到与前沿 AI 研发相关的请求（比如训练大模型的基础设施、某些评测工作以及类似话题），就会<strong>悄悄降低自己回答的质量</strong>。你提问，得到一个被刻意削弱的答案，却从不会被告知模型在「留一手」。批评者称之为<a href="https://fortune.com/2026/06/10/anthropic-accu-claude-fable-5-limits-capabilities-ai-researchers-developers/">「秘密破坏」</a>；多名前 Anthropic 研究员也公开加入了批评。</p>

  <p>Anthropic 在两天内让步：<em>「我们做了错误的取舍，没能把握好平衡，对此我们表示歉意。」</em>如今被标记的请求会被明确标识出来，并转交给 Claude Opus 4.8 处理；当请求被拒绝时，API 用户也会收到说明。此外，部分受限话题（某些网络安全、生物和化学方面的请求，以及模型蒸馏类的请求）会由 Opus 4.8 而非 Fable 5 来回答；Anthropic 称这种情况触发率不到 5% 的会话。还有一件无关却同样不让人安心的事：<a href="https://www.msn.com/en-us/news/insight/microsoft-blocks-employee-use-of-claude-fable-5-over-data-policy/gm-GM9063948F">微软因其新的数据留存规则，禁止员工在 GitHub Copilot 中使用 Fable 5</a>。</p>

  <p>这对你该如何采用它很关键。能力是实打实的，但围绕这个模型的<em>政策面</em>显然还在变动。什么会被悄悄转走、什么会被拒绝、保留哪些数据：自发布以来这些都在按周变化，而且可能还会再变。把一整套工作流搬到这样的基础上是很糟糕的选择，也正因此，你的试用最好保持<strong>可随时撤回</strong>：</p>

  <ul>
    <li><strong>不要换工具。</strong>继续用 Codex、OpenClaw 或 Pi，只替换它们背后的模型。</li>
    <li><strong>不要开新账户。</strong>无需注册 Anthropic 控制台，也没有要先充值、之后再想办法要回的预付余额。用你现有的 Token Station 密钥就够了。</li>
    <li><strong>不要订阅。</strong>按 token、按官方标价付费，只在你真正测试时才花钱。如果下周的政策变动让你失去兴趣，改一行配置就能切回 Opus 4.8 或 GPT-5.5。同一个密钥，同一套工具。</li>
  </ul>

  <h2 id="the-price">价格：为你的好奇心做好预算</h2>

  <p>Fable 5 是当下市场上最贵的主流 API 模型。下面这些都已在 Token Station 上线，均按各提供方的官方标价计费：</p>

  <table>
    <tr><th>模型</th><th>输入 / 百万</th><th>输出 / 百万</th><th>上下文</th></tr>
    <tr><td><code>anthropic/claude-fable-5</code></td><td><strong>$10.00</strong></td><td><strong>$50.00</strong></td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>$5.00</td><td>$25.00</td><td>1M</td></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>$5.00</td><td>$30.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-sonnet-4-6</code></td><td>$3.00</td><td>$15.00</td><td>1M</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>$1.00</td><td>$2.00</td><td>256K</td></tr>
  </table>

  <p>这是 Opus 4.8 在两项上的 2 倍，输出价格更是 <strong>Grok Build 的 25 倍</strong>。同一段较长的 agent 会话，在 Grok Build 上只要几分钱，在 Fable 5 上却可能花掉真金白银。带有大量思考和工具输出的长周期运行，正是每百万 50 美元的输出价格最咬人的地方。</p>

  <p>反过来看：哪怕只是 Token Station 的 1 美元注册额度，也足够先尝个鲜：按 Fable 5 的价格，大约相当于 10 万输入 token 或 2 万输出 token，实际上就是几次强度适中的编码 agent 提示。足以让你形成初步印象，又不至于让你心疼。想做更充分的评估，首次充值还能再获得最多 50 美元的赠送额度。</p>

  <h2 id="what-you-need">你需要准备什么</h2>

  <ul>
    <li>一个 Token Station 账户（<a href="https://models.bytefuture.ai/signup">免费注册</a>；赠送 1 美元额度，无需信用卡，也不涉及 Anthropic 账户）</li>
    <li>你的 Token Station API 密钥（以 <code>gw-</code> 开头）</li>
    <li>已安装 Codex、OpenClaw 或 Pi</li>
  </ul>

  <p>在下面的每一种工具里，模型 ID 都一样：<code>anthropic/claude-fable-5</code>。Token Station 会把每种工具的原生 API 转换成 Anthropic 的格式，包括那些会让简单代理方案崩掉的工具与参数名映射。</p>

  <h2 id="codex-setup">Codex 配置</h2>

  <p>Codex 使用 OpenAI 的 Responses API；Token Station 会把它转换成 Anthropic 的格式。先创建配置文件：</p>

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

  <p>然后设置密钥并启动：</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

  <p>想结束试用时，把 <code>model</code> 改回你之前用的模型即可，其他什么都不用动。</p>

  <h2 id="openclaw-setup">OpenClaw 配置</h2>

  <p>OpenClaw 在其 <code>openclaw.json</code> 配置中支持自定义提供方（<a href="https://docs.openclaw.ai/concepts/model-providers">文档</a>）。把 Token Station 添加为 <code>anthropic-messages</code> 类型的提供方，并把默认模型指向 Fable 5：</p>

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

  <p>重启 OpenClaw 网关，它就会经由 Token Station 路由。想回退时，把之前的 <code>agents.defaults.model</code> 恢复即可；提供方那一项可以留着，下次再用。</p>

  <h2 id="pi-setup">Pi 配置</h2>

  <p>Pi 在 <code>~/.pi/agent/models.json</code> 中注册自定义提供方（<a href="https://pi.dev/docs/latest/custom-provider">文档</a>）：</p>

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

  <p>启动时直接选定该模型，或在运行中用 <code>/model</code> 切换：</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
pi --model anthropic/claude-fable-5</code></pre>

  <p>OpenClaw 和 Pi 有一点要注意：不同客户端是否会自己追加 <code>/v1</code> 各不相同。如果按上面的配置出现 404，就把 <code>baseUrl</code> 里的 <code>/v1</code> 去掉再试。</p>

  <h2 id="api-quirks">值得了解的 API 怪癖</h2>

  <p>Fable 5 拥有所有 Claude 模型中最严格的请求接口，如果你的工具会暴露模型参数，这一点就很重要：</p>

  <ul>
    <li><strong>不支持采样参数。</strong><code>temperature</code>、<code>top_p</code> 和 <code>top_k</code> 都会以 400 报错被拒绝。请改用提示词来引导输出。</li>
    <li><strong>只有自适应思考。</strong>固定的思考预算（<code>budget_tokens</code>）已被取消，而且（这是 Fable 5 独有的）连显式的「关闭思考」设置也会被拒绝。请不要去动思考相关设置，或者干脆省略它们。</li>
    <li><strong>不支持 assistant 预填。</strong>那些通过预填 assistant 回合来强制输出格式的工具会收到 400；改用结构化输出功能即可。</li>
    <li><strong>安全机制转路由。</strong>一小部分涉及受限话题的请求（Anthropic 称不到 5% 的会话）会改由 Opus 4.8 回答，如今会有明确提示，所以如果偶尔有回答自称是 Opus，不必感到意外。</li>
  </ul>

  <h2 id="try-it">开始这场试验</h2>

  <p>这套配置的意义就在于「用完即弃」。用你的免费额度，让 Fable 5 跑一遍你自己积压的真实任务，然后用数据来决定。因为 Token Station 上的每个模型都在同一个密钥后面，对比只需改一行配置：把同一个任务跑在 <code>anthropic/claude-opus-4-8</code>（价格只有一半）、<code>openai/gpt-5.5</code> 或 <code>xai/grok-build-0.1</code>（输出价格只有二十五分之一）上，看看 Fable 5 的优势<em>对你的工作</em>是否值这个溢价。</p>

  <p>如果值，那很好：保留配置、充值即可。如果不值，或者下一次政策意外让你改了主意，删掉三行配置走人就是了。你没订阅任何东西，也没有什么需要取消。</p>

  <p>到 <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> 注册（1 美元免费额度，无需信用卡，无需 Anthropic 账户；首次充值最高再送 50 美元），亲眼看看一个 Mythos 级模型在你的代码上能做到什么。</p>
