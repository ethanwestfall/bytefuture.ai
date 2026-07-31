---
slug: "use-any-model-in-claude-code-through-token-station"
lang: "zh"
title: "在 Claude Code 中通过 Token Station 使用任意模型"
summary: "Claude Code 可以通过 Token Station 运行任意模型。你可以把配置写入 ~/.claude/settings.json，也可以临时 export ANTHROPIC_* 环境变量，设置 base URL、Token、Opus/Sonnet/Haiku 模型和 subagent 模型，再用一行 pong 命令验证。"
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/use-any-model-in-claude-code-through-token-station-cover.png"
draft: false
---

<p>Claude Code 可以不通过额外代理，直接连到 <a href="https://models.bytefuture.ai">Token Station</a>。把 Claude Code 的请求地址指向 <code>https://models.bytefuture.ai</code>，把 <a href="https://models.bytefuture.ai">Token Station</a> 的 key 当作 Anthropic auth token，再分别指定 Opus、Sonnet、Haiku 和 subagent 请求由哪些 <a href="https://models.bytefuture.ai">Token Station</a> 模型来回答。</p>

  <p>有两种干净的配置方式。想长期生效，就写入 <code>~/.claude/settings.json</code>。只想临时试一次、跑 CI、或者切一个测试会话，就用 shell 里的环境变量。</p>

  <h2 id="settings-json">方式一：持久化 settings.json</h2>

  <p>先创建 Claude Code 的配置目录，然后把环境变量块写入 <code>~/.claude/settings.json</code>：</p>

  <pre><code>mkdir -p ~/.claude
cat &gt; ~/.claude/settings.json &lt;&lt;'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://models.bytefuture.ai",
    "ANTHROPIC_AUTH_TOKEN": "YOUR TOKEN AT TOKEN STATION",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "openai/gpt-5.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "openai/gpt-5.4-mini",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "openai/gpt-5.4-nano",
    "CLAUDE_CODE_SUBAGENT_MODEL": "openai/gpt-5.4-mini"
  }
}
EOF</code></pre>

  <p>然后用一个最小 prompt 验证 CLI 是否已经在走 <a href="https://models.bytefuture.ai">Token Station</a>：</p>

  <pre><code>claude -p "Respond with exactly the word: pong"</code></pre>

  <p>如果输出正好是 <code>pong</code>，说明 Claude Code 已经连上 <a href="https://models.bytefuture.ai">Token Station</a>，并且由你配置的模型返回了结果。</p>

  <h2 id="shell-env">方式二：临时 export 环境变量</h2>

  <p>如果不想写配置文件，可以在启动 Claude Code 的同一个 shell 里导出同样的值：</p>

  <pre><code>export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="YOUR TOKEN AT TOKEN STATION"

export ANTHROPIC_DEFAULT_OPUS_MODEL="openai/gpt-5.5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.4-mini"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="openai/gpt-5.4-nano"
export CLAUDE_CODE_SUBAGENT_MODEL="openai/gpt-5.4-mini"

claude -p "Respond with exactly the word: pong"</code></pre>

  <p>这适合临时测试一组新的模型映射，而不改你已经保存的 Claude Code 配置。</p>

  <h2 id="what-each-variable-does">每个变量的含义</h2>

  <table>
    <tr><th>变量</th><th>含义</th></tr>
    <tr><td><code>ANTHROPIC_BASE_URL</code></td><td>Claude Code 发送请求的 API 地址。<a href="https://models.bytefuture.ai">Token Station</a> 使用 <code>https://models.bytefuture.ai</code>。</td></tr>
    <tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td>你的 <a href="https://models.bytefuture.ai">Token Station</a> API key。不要把它提交到代码仓库。</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>Claude Code 处理 Opus 档请求时使用的模型。</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>Claude Code 处理 Sonnet 档请求时使用的模型。</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>Claude Code 处理 Haiku 档请求时使用的模型。</td></tr>
    <tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>Claude Code 给 subagent 使用的模型。</td></tr>
  </table>

  <h2 id="choosing-models">怎么选模型</h2>

  <p>上面的模型 ID 只是一个映射。你可以给 Claude Code 的每个档位分配不同的 <a href="https://models.bytefuture.ai">Token Station</a> 模型，也可以全部指向同一个模型。实用的默认方案是：Opus 给强模型，Sonnet、Haiku 和 subagent 给更快、更便宜的模型。</p>

  <p>几个适合作为起点的 <a href="https://models.bytefuture.ai">Token Station</a> 模型：</p>

  <table>
    <tr><th>Claude Code 档位</th><th><a href="https://models.bytefuture.ai">Token Station</a> 模型</th><th>为什么用它</th></tr>
    <tr><td><code>Opus</code></td><td><code>openai/gpt-5.5</code></td><td>复杂规划、调试、架构设计和长编辑的默认强模型。</td></tr>
    <tr><td><code>Sonnet</code></td><td><code>openai/gpt-5.4-mini</code></td><td>适合作为日常编码、代码审查、仓库导航和重构的均衡主力。</td></tr>
    <tr><td><code>Haiku</code></td><td><code>openai/gpt-5.4-nano</code></td><td>适合短 prompt、快速检查、低成本和低延迟任务。</td></tr>
    <tr><td><code>Subagent</code></td><td><code>openai/gpt-5.4-mini</code></td><td>足够处理委派调查，又不会让每个子任务都按旗舰模型计价。</td></tr>
    <tr><td><code>Alternative Opus</code></td><td><code>anthropic/claude-opus-4-8</code></td><td>当你明确想要 Claude 系模型处理长链路编码时使用。</td></tr>
    <tr><td><code>Budget coding</code></td><td><code>kimi/kimi-k2.7-code</code></td><td>适合常规实现工作，尤其是成本比最高推理深度更重要时。</td></tr>
  </table>

  <p>这些 model ID 都可以复制到上面对应的 <code>ANTHROPIC_DEFAULT_*</code> 变量里。先用配置块里的均衡映射开始，只有任务真的需要时，再把 Opus 往上调，或把 Haiku 往更便宜的模型调。</p>

  <h2 id="troubleshooting">如果连不上</h2>

  <ul>
    <li><strong>还是走默认 Anthropic endpoint。</strong>确认 <code>ANTHROPIC_BASE_URL</code> 出现在启动 <code>claude</code> 的 shell 里，或者已经写进 <code>~/.claude/settings.json</code>。</li>
    <li><strong>401 / 鉴权错误。</strong>把 <code>YOUR TOKEN AT TOKEN STATION</code> 换成真实的 <a href="https://models.bytefuture.ai">Token Station</a> key。</li>
    <li><strong>回答的模型不对。</strong>检查 Opus、Sonnet、Haiku 和 subagent 的模型变量。Claude Code 会根据请求类型在这些档位之间选择。</li>
    <li><strong>settings 文件看起来没生效。</strong>确认 <code>~/.claude/settings.json</code> 是合法 JSON，并在修改后重新运行 Claude Code 命令。</li>
  </ul>

  <h2 id="wrap">开始上手</h2>

  <p>想长期使用，就写 <code>~/.claude/settings.json</code>。想临时使用，就在当前 shell 里 export 这些变量。两种方式的验证命令都一样：运行 <code>claude -p "Respond with exactly the word: pong"</code>，看它是否返回 <code>pong</code>。</p>

  <p>到 <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> 注册（1 美元免费额度，无需信用卡；首次充值最高再送 50 美元），把 <a href="https://models.bytefuture.ai">Token Station</a> key 放进 Claude Code，再把 Claude Code 的各个模型档位指向你真正想用的模型。</p>
