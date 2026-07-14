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
