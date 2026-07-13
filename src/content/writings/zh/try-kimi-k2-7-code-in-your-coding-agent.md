---
slug: "try-kimi-k2-7-code-in-your-coding-agent"
lang: "zh"
title: "Kimi K2.7 Code：便宜到值得一试，或许好到可以分担工作"
summary: "Moonshot 全新的 1T 开源权重编程模型，价格为每百万 token 0.95/4 美元。在 Claude Code、Codex 或 OpenClaw 中把它与你的 SOTA 模型搭配，让它分担日常工作。"
category: "tutorial"
date: "2026-06-13"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/kimi-k2-7-code-cover.png"
draft: false
---

<p>昨天 Moonshot AI 在 Hugging Face 上发布了 <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Kimi K2.7 Code</a>：一个 1 万亿参数的混合专家（MoE）编码模型（激活参数 32B），上下文窗口 256K，权重以 Modified MIT 许可证开放。</p>

  <p>如果你读过我们那篇 <a href="/blog/try-claude-fable-5-in-codex-openclaw-and-pi.html">Claude Fable 5 的文章</a>，这次的逻辑正好反过来。Fable 5 的能力已被验证，风险在于价格。而 K2.7 Code 的价格微不足道，能力才是悬而未决的问题。这个模型才发布一天，还没有任何第三方对它做过基准测试，连 Moonshot 自己公布的数字都把它排在前沿模型之后。但这两种情形最终都指向同一种做法：在你已经在用的编码工具里，跑一个便宜且可随时回退的实验。</p>

  <p>有一点让这个实验比单纯的替换更有意思。在 <strong>每百万输入 token 0.95 美元、每百万输出 token 4.00 美元</strong> 的价格下，K2.7 Code 的输入价格约为 Claude Fable 5 的十分之一，输出价格约为十二分之一。这便宜到足以让它担任另一种角色：和你的 SOTA 模型并肩工作，承担那些常规的分发任务，而把难啃的部分留给昂贵的模型。</p>

  <p>K2.7 Code 已经上线 <a href="https://models.bytefuture.ai">Token Station</a>，模型 ID 为 <code>kimi/kimi-k2.7-code</code>，按 Moonshot 的标价、零加价提供，而你的 <a href="https://models.bytefuture.ai/signup">1 美元注册赠金</a> 足够用上很久。</p>

  <h2 id="what-we-know">我们已知的（以及未知的）</h2>

  <p>来自<a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">模型卡</a>：</p>

  <ul>
    <li><strong>为编码 agent 而生。</strong>它是 Kimi K2.6 面向编码的后继版本，针对长周期的软件工程做了调优：交错思考、多步工具调用、MCP 支持，以及跨轮次保留的推理过程。</li>
    <li><strong>思考 token 比 K2.6 少约 30%</strong>，同时编码得分更高，这在按输出 token 计费时很关键。</li>
    <li><strong>总参数 1T，激活参数 32B</strong>，384 个专家，原生支持 INT4，外加一个 400M 参数的视觉编码器用于图像输入。</li>
    <li><strong>开放权重，Modified MIT 许可。</strong>你可以把整个模型下载下来，用 vLLM 或 SGLang 自行部署。</li>
  </ul>

  <p>还有坦诚的一面。Moonshot 公布了它和前沿模型的对比，而 K2.7 Code 落了下风：</p>

  <figure>
    <img src="kimi-k2-7-code-benchmarks.png" alt="Moonshot 自报基准的分组柱状图：Kimi K2.7 Code 在 Kimi Code Bench v2 上得 62.0，对比 GPT-5.5 的 69.0 和 Claude Opus 4.8 的 67.4；在 ProgramBench 上得 53.6，对比 69.1 和 63.8；在 MCP Atlas 上得 76.0，对比 79.4 和 81.3" />
    <figcaption>Moonshot 自己公布的数字。K2.7 Code 在这三项上都落后于前沿模型。数据来源：<a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Kimi K2.7 Code 模型卡</a>，2026 年 6 月。</figcaption>
  </figure>

  <p>一家厂商公布自己模型落败的基准，是这些数字诚实可信的好迹象，而且差距并不难看：在 Moonshot 的编码基准上比 GPT-5.5 落后约 7 分，在工具使用上更接近。上一代 Kimi（K2.6）目前是 Artificial Analysis Intelligence Index 上最强的开放权重模型。眼下没人知道的是，K2.7 Code 在<em>你的</em>代码库、<em>你的</em>工具里、经过一段长时间的 agent 会话之后表现如何。这正是这个实验要回答的未知数。</p>

  <p>有一点需要厘清，和我们那篇 Grok Build 文章的思路一致：K2.7 Code 这个<strong>模型</strong>是针对 Moonshot 自家的 <em>Kimi Code CLI</em>（他们的编码工具）做优化的。但你并不需要那个 CLI。这个模型支持 OpenAI 和 Anthropic 兼容的 API，而 Token Station 会把你现有工具发出的请求翻译成它能理解的格式。</p>

  <h2 id="the-price">价格：在前沿模型面前几乎可以忽略不计</h2>

  <p>下面这些模型都已在 Token Station 上线，按各家厂商的标价提供：</p>

  <table>
    <tr><th>模型</th><th>输入 / 1M</th><th>输出 / 1M</th><th>上下文</th></tr>
    <tr><td><code>kimi/kimi-k2.7-code</code></td><td><strong>$0.95</strong></td><td><strong>$4.00</strong></td><td>256K</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>$1.00</td><td>$2.00</td><td>256K</td></tr>
    <tr><td><code>anthropic/claude-sonnet-4-6</code></td><td>$3.00</td><td>$15.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>$5.00</td><td>$25.00</td><td>1M</td></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>$5.00</td><td>$30.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-fable-5</code></td><td>$10.00</td><td>$50.00</td><td>1M</td></tr>
  </table>

  <p>按 K2.7 Code 的价格，1 美元注册赠金大约能买 100 万个输入 token 或 25 万个输出 token。同样一笔赠金，用 Fable 5 只够跑几次提示，用它却能撑起一次真正的评测。这个实验的下行风险几乎为零。而且首次充值最高还能再获得 50 美元赠送额度，按 K2.7 Code 的价格足够用上好几周。</p>

  <h2 id="share-the-work">真正的实验：分担工作</h2>

  <p>编码 agent 早就把工作分成了不同层级。一边是主循环，负责规划和高难度推理；另一边是分发任务：子 agent 读取文件、执行搜索、运行测试、汇总结果。分发任务消耗了绝大部分 token，却最不需要聪明才智。</p>

  <p>正是在这种分工下，一个每百万 4 美元的模型才有理由和每百万 50 美元的模型并肩而立。让 Fable 5 或 Opus 4.8 坐镇主驾，把常规工作交给 K2.7 Code。如果 Moonshot 的数字在实际中站得住脚，那么委派任务上的质量下降很小，而每个被委派的 token 成本下降都超过 10 倍。</p>

  <h2 id="what-you-need">你需要准备什么</h2>

  <ul>
    <li>一个 Token Station 账号（<a href="https://models.bytefuture.ai/signup">免费注册</a>；1 美元赠金，无需信用卡，也不需要 Moonshot 账号）</li>
    <li>你的 Token Station API 密钥（以 <code>gw-</code> 开头）</li>
    <li>已安装 Claude Code、Codex 或 OpenClaw</li>
  </ul>

  <h2 id="claude-code-setup">Claude Code 配置：两层分工</h2>

  <p>Claude Code 把它的模型层级以环境变量的形式暴露出来，因此它是跑这个分担工作实验最干净利落的地方。把 Opus 这一档留给 Claude Fable 5，其余全部交给这匹主力模型：</p>

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

  <p>现在一次普通的会话会全程跑在 K2.7 Code 上：主循环、每个子 agent、每次后台搜索，全部按每百万输出 4 美元计费，而不是 50 美元。当某个问题确实需要前沿级判断时，用 <code>/model opus</code> 升级，Fable 5 就会接手；难啃的部分搞定后再降回来。这样昂贵的模型就回到了它在那个价位上本该扮演的角色：一位被你请来的专家。</p>

  <p>如果 Fable 5 的价格让你心疼，就把 Opus 档里的 <code>anthropic/claude-fable-5</code> 换成 <code>anthropic/claude-opus-4-8</code>；这套升级模式在任何档位都适用。</p>

  <h2 id="codex-setup">Codex 配置</h2>

  <p>Codex 每次会话只跑一个模型，但它的 <a href="https://developers.openai.com/codex/config-reference">profiles</a> 能在调用层面实现同样的分工：把主力模型设为默认，再为 Fable 5 单独保留一个命名的升级 profile。</p>

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

  <p>日常你直接运行 <code>codex</code>，按主力模型的价格付费。当某个任务值得动用前沿模型时，<code>codex --profile deep</code> 仅在这一次调用中请出 Fable 5。配置里其他部分一概不动。</p>

  <h2 id="openclaw-setup">OpenClaw 配置</h2>

  <p>OpenClaw 把这种分工做成了一等公民的设置。除非 <code>agents.defaults.subagents.model</code> 另有指定，否则子 agent 会继承调用方的模型（<a href="https://docs.openclaw.ai/tools/subagents">文档</a>），因此可以让 Fable 5 坐镇主驾，而每个派生出来的子 agent 都跑在 K2.7 Code 上：</p>

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

  <p>主 agent 保留前沿级判断；并行的分发任务（也就是烧 token 的那部分）按主力模型的价格计费。如果想让整套流程全部跑在 K2.7 Code 上，就把 <code>agents.defaults.model.primary</code> 指向它；无论哪种方式，两个模型都在同一个密钥背后。</p>

  <h2 id="quirks">值得了解的几个特性</h2>

  <ul>
    <li><strong>思考始终开启。</strong>K2.7 Code 在回答前会先推理，并把推理过程带入后续轮次；你无法关闭它。要把推理 token 算进输出账单，好在相比 K2.6 减少了 30%，压力会小一些。</li>
    <li><strong>256K 上下文。</strong>已经很慷慨，但只有前沿 Claude 和 GPT 模型 1M 窗口的四分之一。较长的 agent 会话会更早触发压缩。</li>
    <li><strong>它有自己的主场工具。</strong>Moonshot 是针对 Kimi Code CLI 调优的，所以在别处偶尔会遇到一些粗糙之处。Token Station 对工具和参数名的翻译会处理掉协议层面的不匹配。</li>
    <li><strong>退出之路两头都通。</strong>如果实验失败，删掉配置就行。如果成功，权重以 Modified MIT 许可放在 <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Hugging Face</a> 上：你最终可以在自己的硬件上部署一模一样的模型。一个能够升级为自托管的云端实验，正是混合推理故事的缩影。</li>
  </ul>

  <h2 id="try-it">开始这个实验</h2>

  <p>把那些你那昂贵模型大材小用的活儿交给 K2.7 Code：子 agent 搜索、测试运行、样板代码、内容汇总。观察一周，看它在哪里站得住、在哪里掉链子，然后据此确定分工。同一个 Token Station 密钥能并排跑 <code>anthropic/claude-fable-5</code>、<code>anthropic/claude-opus-4-8</code> 和 <code>kimi/kimi-k2.7-code</code>，所以对比是天然内置的。</p>

  <p>到 <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> 注册（1 美元免费赠金，无需信用卡；首次充值最高再送 50 美元），亲自看看一个才发布一天的开放权重模型，能否以十分之一的价格扛起你 agent 一半的工作量。</p>

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
