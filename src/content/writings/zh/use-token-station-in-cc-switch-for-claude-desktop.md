---
slug: "use-token-station-in-cc-switch-for-claude-desktop"
lang: "zh"
title: "在 CC Switch 里用 Token Station 配置 Claude Desktop"
summary: "先了解 CC Switch 如何集中管理不同 AI 工具的 Provider，再用 Token Station 配置 Claude Desktop：添加 Provider，填写 Token Station API key，开启 model mapping 和本地路由。Claude Code 推荐使用专门的 Token Station 配置方式。"
category: "tutorial"
date: "2026-06-19"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/use-token-station-in-cc-switch-cover.png"
draft: false
---

<p><a href="https://github.com/farion1231/cc-switch">CC Switch</a> 是一个桌面工具，用来管理 Claude Code、Claude Desktop、Codex、Gemini CLI 等工具的 Provider。平时你要换 API 服务商，往往要去不同工具里改不同格式的配置；CC Switch 把这些入口放到同一个界面里，切到对应工具，再启用对应 Provider。</p>

  <p>这篇文章用 <a href="https://models.bytefuture.ai">Token Station</a> 做例子。Token Station 提供上游模型入口；CC Switch 负责把这个入口写进具体客户端。这里重点是 Claude Desktop，因为它和 Claude Code 是两个独立入口：Claude Desktop 走 3P profile、model mapping 和本地路由；Claude Code 更适合走 <code>settings.json</code> 或环境变量。</p>

  <h2 id="install">先准备 CC Switch 和 Token Station key</h2>

  <p>先安装 CC Switch。macOS 用户可以用 Homebrew：</p>

  <pre><code>brew install --cask cc-switch</code></pre>

  <p>Windows、Linux 或手动安装，可以去 <a href="https://github.com/farion1231/cc-switch/releases">CC Switch Releases</a> 下载对应安装包。Token Station 这边只需要准备一枚可用的 API key，后面会填到 CC Switch 的 Provider 里。</p>

  <p>下面先把 Claude Desktop 这条线跑通。Claude Code 的做法已经单独写在 <a href="use-any-model-in-claude-code-through-token-station-zh.html">《在 Claude Code 中通过 Token Station 使用任意模型》</a> 里。</p>

  <h2 id="claude-desktop">配置 Claude Desktop</h2>

  <p>打开 CC Switch，在顶部工具栏切到 <strong>Claude Desktop</strong> 图标对应的面板。面板里会看到 <strong>Claude Desktop Official</strong> 这类已有 Provider。</p>

  <figure>
    <img src="cc-switch-claude-desktop-provider-panel.png" alt="CC Switch 的 Claude Desktop 面板，顶部工具栏选中 Claude Desktop，列表里有 Claude Desktop Official 和 tokenstation Provider" />
    <figcaption>在顶部工具栏切到 Claude Desktop 面板后，可以看到官方 Provider 和新增的 Token Station Provider。</figcaption>
  </figure>

  <p>接下来点右上角的 <strong>+</strong> 新增 Provider。这里添加的是 Token Station，不是 Claude Desktop 官方登录账号。字段可以按下面填写：</p>

  <table>
    <tr><th>字段</th><th>建议填写</th></tr>
    <tr><td>名称</td><td><code>Token Station</code></td></tr>
    <tr><td>API Key</td><td>你的 Token Station key</td></tr>
    <tr><td>请求地址</td><td><code>https://models.bytefuture.ai</code></td></tr>
    <tr><td>API 格式</td><td><code>Anthropic Messages（原生）</code></td></tr>
    <tr><td>Needs model mapping</td><td>开启</td></tr>
  </table>

  <figure>
    <img src="cc-switch-token-station-provider-settings.png" alt="CC Switch 的 Token Station Provider 详情页，已填写 provider 名称、API Key、请求地址 https://models.bytefuture.ai，并开启需要模型映射" />
    <figcaption>Token Station Provider 详情页：填入 API key，请求地址使用 <code>https://models.bytefuture.ai</code>，并开启“需要模型映射”。</figcaption>
  </figure>

  <p>这里有两个细节容易填错。请求地址用 <code>https://models.bytefuture.ai</code>，末尾不要加斜杠；<strong>Needs model mapping</strong> 要打开，因为 Claude Desktop 不会直接接受 <code>openai/gpt-5.5</code> 这样的模型名。</p>

  <h2 id="desktop-model-mapping">给 Claude Desktop 配 model mapping</h2>

  <p>Claude Desktop 的模型菜单认的是 Sonnet、Opus、Haiku 这几类 role。这里不用让 Claude Desktop 直接认识 GPT 模型，而是让 CC Switch 在中间做一次映射：Claude Desktop 选择 Sonnet，CC Switch 实际请求 Token Station 上的某个模型。</p>

  <p>在 Token Station Provider 里打开 <strong>Needs model mapping</strong> 后，可以先按这个组合填：</p>

  <table>
    <tr><th>Claude Desktop role</th><th>菜单显示名</th><th>Requested model</th><th>说明</th></tr>
    <tr><td>Sonnet</td><td>GPT-5.4 Mini</td><td><code>openai/gpt-5.4-mini</code></td><td>日常对话、写代码、读文档。</td></tr>
    <tr><td>Opus</td><td>GPT-5.5</td><td><code>openai/gpt-5.5</code></td><td>复杂推理、长上下文、架构设计。</td></tr>
    <tr><td>Haiku</td><td>GPT-5.4 Nano</td><td><code>openai/gpt-5.4-nano</code></td><td>短任务、低延迟、低成本。</td></tr>
  </table>

  <p>想先确认能不能跑通的话，只填 Sonnet 也可以。空白 role 会继承第一个已填写的模型（优先 Sonnet），所以不用一开始就把所有角色配得很完整。等 Claude Desktop 能正常发消息后，再补 Opus 和 Haiku。</p>

  <h2 id="desktop-local-routing">打开 Claude Desktop 本地路由</h2>

  <p>Model mapping 需要 CC Switch 在本机接住 Claude Desktop 的请求，再转发给 Token Station。先回到 CC Switch 首页，点击设置，进入 <strong>路由</strong> 页面。</p>

  <figure>
    <img src="cc-switch-local-routing-settings.png" alt="CC Switch 设置里的路由页面，本地路由正在运行，首页显示本地路由开关已开启，Claude 路由启用，服务地址为 http://127.0.0.1:15721" />
    <figcaption>在首页 → 设置 → 路由里确认本地路由运行中，并开启首页显示开关和 Claude 路由。</figcaption>
  </figure>

  <p>这个页面里有三处要确认：<strong>在主页显示本地路由开关</strong> 要打开，<strong>路由总开关</strong> 要保持运行，<strong>路由启用</strong> 里要打开 Claude。然后回到 Claude Desktop 面板，把顶部的 local routing toggle 切到 On。之后只要走 Token Station + Model Mapping，CC Switch 就需要一直开着。</p>

  <h2 id="desktop-enable">启用 Provider，然后重启 Claude Desktop</h2>

  <p>回到 Token Station Provider 卡片，点击 <strong>Enable</strong>。这一步会让 CC Switch 把当前 Provider 写入 Claude Desktop 的 3P profile。</p>

  <p>接下来要完全退出 Claude Desktop，再重新打开。这里和很多命令行工具不一样：Claude Desktop 通常只在启动时读取 3P profile，所以切换 Provider 后不重启，经常看不到变化。重启后，模型菜单里应该能看到刚才 model mapping 里填写的显示名，比如 <code>GPT-5.4 Mini</code>、<code>GPT-5.5</code>、<code>GPT-5.4 Nano</code>。</p>

  <p>选一个模型，发一条简单消息：</p>

  <pre><code>请只回复：pong</code></pre>

  <figure>
    <img src="claude-client-gateway-token-station-model.png" alt="Claude 客户端显示正在使用 Gateway，模型菜单中选中 openai/gpt-5.5" />
    <figcaption>配置生效后，Claude 客户端会显示正在使用 Gateway，模型菜单里也会出现通过 Token Station 映射出来的模型。</figcaption>
  </figure>

  <p>如果返回 <code>pong</code>，说明这条链路已经通了：Claude Desktop 先连到 CC Switch 的本地网关，再由 CC Switch 带着 Token Station key 去请求真实模型。</p>

  <h2 id="claude-code">配置 Claude Code</h2>

  <p>Claude Code 不走 Claude Desktop 的 3P profile，也不需要 Claude Desktop 这套 model mapping 和本地路由。它更像命令行工具，直接配置 <code>~/.claude/settings.json</code> 或当前 shell 的环境变量会更清楚。</p>

  <p>如果你的目标是让 Claude Code 使用 Token Station，建议直接看 <a href="use-any-model-in-claude-code-through-token-station-zh.html">在 Claude Code 中通过 Token Station 使用任意模型</a>。那篇文章会完整讲持久配置、临时 export、Opus / Sonnet / Haiku / subagent 模型选择，以及怎么用 <code>pong</code> 命令验证。</p>

  <h2 id="troubleshooting">常见问题</h2>

  <ul>
    <li><strong>Claude Desktop 里没有变化。</strong>先看 Token Station Provider 有没有 Enable，再完全退出并重新打开 Claude Desktop。</li>
    <li><strong>模型菜单里看不到 GPT 模型。</strong>检查 <strong>Needs model mapping</strong> 是否开启，以及 Sonnet / Opus / Haiku 至少有没有填一个 Requested model。</li>
    <li><strong>发消息失败。</strong>先确认 CC Switch 还在运行、本地路由是 On，再检查 Token Station API key 和 <code>https://models.bytefuture.ai</code> 有没有填错。</li>
    <li><strong>Direct mode 不工作。</strong>Direct mode 要求模型名能被 Claude Desktop 识别。Token Station 这里更稳的方式是开启 Model Mapping Mode。</li>
    <li><strong>Claude Code 还是没走 Token Station。</strong>不要套用 Claude Desktop 的 3P profile。按 <a href="use-any-model-in-claude-code-through-token-station-zh.html">Claude Code 专文</a> 配 <code>~/.claude/settings.json</code> 或 shell 环境变量。</li>
    <li><strong>想切回 Claude Desktop 官方登录。</strong>在 CC Switch 里选择 <strong>Claude Desktop Official</strong>，点 Enable，然后重启 Claude Desktop。</li>
  </ul>

  <h2 id="wrap">总结</h2>

  <p>这套配置里最重要的点，是把 Claude Desktop 和 Claude Code 分开看。它们都可以用 <a href="https://models.bytefuture.ai">Token Station</a>，但入口和配置文件不是一套。</p>

  <p>Claude Desktop 走 CC Switch Provider、Model Mapping、本地路由和重启；Claude Code 则更推荐用 <a href="use-any-model-in-claude-code-through-token-station-zh.html">Claude Code 专文</a>里的 <code>settings.json</code> / <code>export</code> 方式。配置完成后，你就可以在 Claude Desktop 里使用 Token Station 上的 <code>openai/gpt-5.5</code>、<code>openai/gpt-5.4-mini</code>、<code>openai/gpt-5.4-nano</code>，或者账号里可用的其他模型。</p>

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
