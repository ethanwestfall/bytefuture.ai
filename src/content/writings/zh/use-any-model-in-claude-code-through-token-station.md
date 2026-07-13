---
slug: "use-any-model-in-claude-code-through-token-station"
lang: "zh"
title: "在 Claude Code 中通过 Token Station 使用任意模型"
summary: "Claude Code 可以通过 Token Station 运行任意模型。你可以把配置写入 ~/.claude/settings.json，也可以临时 export ANTHROPIC_* 环境变量，设置 base URL、Token、Opus/Sonnet/Haiku 模型和 subagent 模型，再用一行 pong 命令验证。"
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
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

      <hr />

      <!-- Share (leave exactly as-is; the buttons fire share_click GA events) -->
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
