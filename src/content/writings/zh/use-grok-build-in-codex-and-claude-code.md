---
slug: "use-grok-build-in-codex-and-claude-code"
lang: "zh"
title: "如何在 Codex 和 Claude Code 中使用 Grok Build"
summary: "xAI 的 Grok Build 模型迭代很快，价格只有 GPT-5.5 或 Claude Fable 5 的零头。用 Token Station 的免费额度在 Claude Code 或 Codex 中运行它，无需 xAI 账户。"
category: "tutorial"
date: "2026-06-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-code-grok-build.png"
draft: false
---

<p>Grok Build 是 xAI 的编程<strong>模型</strong>：<code>grok-build-0.1</code>，详情见<a href="https://docs.x.ai/docs/models/grok-build-0.1">它的模型卡</a>。不要把它和同名的 xAI 编程工具 <em>Grok Build CLI</em> 混淆；本文讲的是这个模型。它进化飞快，每次发布都在真实编程任务上有可见的提升，而且价格为<strong>每百万输入 token 1 美元、每百万输出 token 2 美元</strong>，只是 GPT-5.5、Claude Fable 5 这类前沿旗舰的零头。</p>

<p>一个进步飞快、价格又只是零头的模型，正是值得一试的东西。但几乎没有人愿意仅仅为了测试一个模型就换工具。xAI 给出的答案是它自家的 Grok Build CLI；而大多数开发者更想把这个模型直接放进自己每天都在用的工具里：<strong>Claude Code</strong> 或 <strong>Codex</strong>。问题就出在这里：这两者都无法直接和 xAI 的 API 对话。问题不止于 API 的格式。例如 Codex 发送工具调用时，会带上 xAI 端点无法识别的内置工具名称和参数，于是请求在模型还没看到你的提示词之前就失败了。</p>

<p><a href="https://models.bytefuture.ai/signup">Token Station</a> 位于你的编程智能体和 xAI 之间，用四点补上这道缺口：</p>

<ul>
<li><strong>Grok Build 可用的免费额度。</strong>注册即得的 1 美元额度可用于 Grok Build。无需信用卡，无需订阅。</li>
<li><strong>无需 xAI 账户。</strong>你不必再单独创建并充值一个 xAI 账户；一把 Token Station 密钥就够了。</li>
<li><strong>Claude Code：API 转换。</strong>Claude Code 使用 Anthropic 的 Messages API。Token Station 把这些请求转换成 xAI 端点所期望的格式，再把响应转换回来。</li>
<li><strong>Codex：工具与参数名转换。</strong>Codex 的内置工具调用使用了 xAI 无法识别的名称和参数。Token Station 在两个方向上重写它们，让工具调用真正可用。</li>
</ul>

<p>你无需自己改动任何代码，就能让 Grok Build 在 Codex 或 Claude Code 中跑起来。本教程涵盖两种配置，每种大约两分钟。</p>

<h2 id="what-you-need">你需要什么</h2>

<ul>
<li>一个 Token Station 账户（<a href="https://models.bytefuture.ai/signup">免费注册</a>；获得 1 美元额度，无需信用卡）</li>
<li>你的 Token Station API 密钥（以 <code>gw-</code> 开头）</li>
<li>已安装 Claude Code 或 Codex</li>
</ul>

<h2 id="claude-code-setup">配置 Claude Code</h2>

<p>Claude Code 从环境变量读取配置。要把所有模型槽位都通过 Token Station 路由到 Grok Build，请在启动前设置以下变量：</p>

<pre><code># Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

# Route every Claude Code model slot to Grok Build
export ANTHROPIC_DEFAULT_OPUS_MODEL="xai/grok-build-0.1"
export ANTHROPIC_DEFAULT_SONNET_MODEL="xai/grok-build-0.1"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="xai/grok-build-0.1"
export CLAUDE_CODE_SUBAGENT_MODEL="xai/grok-build-0.1"

# Launch
claude --model "xai/grok-build-0.1"</code></pre>

<figure><img src="claude-code-grok-build.png" alt="Claude Code terminal showing Grok Build model xai/grok-build-0.1 running and responding to prompts"><figcaption>Claude Code 通过 Token Station 运行 Grok Build。模型确认自己由 xai/grok-build-0.1 驱动。</figcaption></figure>

<p>配置到此结束。Claude Code 会把每一个请求都发往 Token Station，由它转换给 xAI 端点。工具调用、流式输出和多轮对话全都正常工作。</p>

<h3>这些环境变量的作用</h3>

<table>
<tr><th>变量</th><th>作用</th></tr>
<tr><td><code>ANTHROPIC_BASE_URL</code></td><td>让 Claude Code 指向 Token Station，而不是 Anthropic 的 API</td></tr>
<tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td>你的 Token Station API 密钥</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>用 Grok Build 替换 Opus 模型槽位</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>用 Grok Build 替换 Sonnet 模型槽位</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>用 Grok Build 替换 Haiku 模型槽位</td></tr>
<tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>也把子智能体调用路由到 Grok Build</td></tr>
</table>

<p>你可以自由搭配。例如，主模型仍用 Sonnet，只把子智能体路由到 Grok Build 以节省成本。</p>

<h2 id="codex-setup">配置 Codex</h2>

<p>Codex 使用一个 TOML 配置文件。用两条命令即可创建：</p>

<pre><code>mkdir -p ~/.codex
cat > ~/.codex/config.toml &lt;&lt;'EOF'
model = "xai/grok-build-0.1"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

<p>然后设置你的 API 密钥并启动：</p>

<pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

<figure><img src="codex-grok-build.png" alt="OpenAI Codex terminal showing model set to xai/grok-build-0.1 via Token Station"><figcaption>Codex 通过 Token Station 运行 Grok Build。model 字段确认 xai/grok-build-0.1 已生效。</figcaption></figure>

<p>现在 Codex 的所有请求都会使用 Grok Build。Token Station 负责 API 转换，包括工具与参数名的重写；否则 Codex 直接对接 xAI 时就会失败。</p>

<h2 id="why-you-need-a-gateway">为什么这件事需要一个网关</h2>

<p>你可能会想：为什么不干脆让 Codex 直接指向 xAI 的 API 呢？</p>

<p>两个原因：</p>

<ol>
<li><strong>API 格式不匹配。</strong>Claude Code 使用 Anthropic 的 Messages API，Codex 则以 OpenAI 的 Responses API 格式发送请求。而 xAI 端点期望的结构与两者都不同。Token Station 对两者都进行转换：请求进来，响应出去。</li>
<li><strong>工具与参数名转换。</strong>Codex 发送的内置工具调用带有 xAI 无法识别的名称和参数。Token Station 会重写它们，让模型真正能用上这些工具。没有这一步，Codex 的工具调用会悄然失败或直接报错。</li>
</ol>

<p>这不是一个理论上的问题。试图把 Codex 直接连到 Grok Build 的开发者，会在第一次工具调用时就撞上莫名其妙的错误。</p>

<h2 id="try-it">动手试试</h2>

<p>在 <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> 注册，即可获得 1 美元免费额度。无需信用卡，无需订阅，也无需创建或充值 xAI 账户。首次充值还能再获得最多 50 美元的赠送额度。这笔免费额度适用于平台上的每一个模型，包括 Grok Build、GPT-5.5、Claude、Gemini 以及其他 200 多个模型。而且由于 Grok Build 每 token 的价格只是前沿旗舰的零头，这笔额度能用很久。</p>

<p>两分钟配置，然后你就在用 Grok Build 写代码了。如果 Grok Build 不太合适，这 1 美元额度也适用于平台上的其他每一个模型。</p>

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
