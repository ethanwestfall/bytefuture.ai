---
slug: "genoffice-meets-token-station"
lang: "zh"
title: "GenOffice 携手 Token Station：任选模型，按量付费"
summary: "GenOffice 默认接入 Genspark。把它改接到 Token Station，套件里的每个应用都能运行你选择的任意模型，按请求计费，而不是按合同计费。"
category: "tutorial"
date: "2026-08-08"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/genoffice-meets-token-station-cover.png"
draft: false
---

<p><a href="https://github.com/genspark-ai/genoffice">GenOffice</a> 是一款开源、AI 原生的办公套件，基于 Electron 构建：文字处理器、表格编辑器、演示文稿制作工具和 PDF 阅读器，全部整合在同一个外壳下。五个应用共享一个底层承诺：<strong>文件格式保真</strong>。打开一份 <code>.docx</code>、<code>.xlsx</code> 或 <code>.pptx</code>，完成编辑后，凡是你没碰过的内容都会原样返回，逐字节一致。GenOffice 会解析原始文件，只追踪你改动过的区块，保存时把窄幅补丁拼回源 XML；归档中的其余部分则原样复制，不做改动。</p>

<p>每个应用都带有同样的 AI 面板：Docs 里是带版本历史的区块级编辑，Sheets 里是对实时工作表进行工具调用的智能体，Slides 里则是一个受限的布局脚本智能体，只通过一组固定的、经过校验的操作原语来编辑演示文稿，而不是自由形式的代码。三者底层共用两个包：负责工具调用循环的 <code>agent-core</code>，以及负责对接所配置模型后端的 <code>ai-provider</code>。</p>

<p>这正是本文的切入点：<code>ai-provider</code> 本身就说标准的 OpenAI 兼容 HTTP 协议。开箱即用时，GenOffice 把它指向 Genspark。把它改指向 <a href="https://models.bytefuture.ai">Token Station</a>，各个应用不会有任何变化：变的只是 token 从哪里来。</p>

<h2 id="why-token-station">为什么要用 Token Station 来跑</h2>

<p>登录后 Genspark 立刻就能用，这也是它作为默认选项的合理之处。但它是单一账户、单一模型列表，信用额度也要按 Genspark 的条款充值。Token Station 在两个方面改变了这层关系，而这两点对每天都要用的桌面应用来说很关键。</p>

<table>
  <tr><th></th><th>Genspark（默认）</th><th>Token Station</th></tr>
  <tr><td>账户 / 额度</td><td>单一账户，单一信用池</td><td>按量付费，没有月度或年度合同</td></tr>
  <tr><td>模型</td><td>由集成方固定模型列表</td><td>25+ 家供应商、250+ 个模型，按任务挑选</td></tr>
  <tr><td>定价</td><td>额度绑定 Genspark 套餐</td><td>一把密钥，供应商原价，零加价</td></tr>
</table>

<p><strong>按量付费，不是签合同。</strong>Token Station 没有订阅档位。免费注册，无需信用卡，注册后立即到账 1 美元额度。之后你只按实际调用的模型付供应商原价，没有周期性费用，也没有需要取消的东西。像 NVIDIA NIM 这样的部分模型甚至完全免费。</p>

<p><strong>模型选择的自由。</strong>网关账户不会被锁定在某一家供应商的产品线上。GenOffice Docs 用 Claude 做长文编辑，Sheets 用更便宜的模型处理日常公式工作，Slides 则挑选适合当前演示稿的图像模型，全部通过同一把密钥、同一个 OpenAI 风格的接口完成，不需要为每家供应商单独注册。</p>

<p>因为 Token Station 使用的正是 GenOffice 自定义提供方接口本就预期的 OpenAI 兼容线上协议，接入它只是一次路由变更，不是一次重写。</p>

<h2 id="setup">配置步骤：给你的 GenOffice 代码打补丁</h2>

<p>下面是把 GenOffice 的 AI 流量从 Genspark 改路由到 Token Station 所需的实际改动。把它们应用到你自己的 fork 或分支上即可；这些改动不依赖任何特定的 GenOffice 版本。</p>

<h3 id="step-1">1. 安装依赖，确认基线版本能正常运行</h3>

<p>你需要在本机安装 Node.js 和 npm。</p>

<pre><code>git clone &lt;your-fork-url&gt; genoffice
cd genoffice
npm install
npm run dev</code></pre>

<p>确认外壳能正常启动，AI 面板也能正常打开。此时它默认跑在 Genspark 上，只要不在未登录状态下发送消息，就不会弹出登录提示。</p>

<h3 id="step-2">2. 给共享的 provider 包加上环境变量覆盖逻辑</h3>

<p><code>packages/ai-provider</code> 里已经定义了一个自定义提供方：任意 OpenAI 兼容的 <code>baseUrl</code> / <code>apiKey</code> / <code>model</code>。我们添加一个小函数，从环境变量里读取这些值来填充它，这与代码库里给 Genspark 自身密钥（<code>GSK_API_KEY</code>）用的模式完全一致。</p>

<p><code>packages/ai-provider/src/providers.ts</code></p>

<pre><code>export const TOKEN_STATION_BASE_URL = 'https://models.bytefuture.ai/v1'
const TOKEN_STATION_DEFAULT_MODEL = 'anthropic/claude-opus-4-8'

export function applyTokenStationEnvOverride(
  settings: AiSettings,
  env: NodeJS.ProcessEnv = process.env,
): AiSettings {
  const apiKey = env.TOKEN_STATION_API_KEY
  if (!apiKey) return settings
  return {
    provider: 'custom',
    providers: {
      ...settings.providers,
      custom: {
        apiKey,
        model: env.TOKEN_STATION_MODEL || TOKEN_STATION_DEFAULT_MODEL,
        baseUrl: TOKEN_STATION_BASE_URL,
      },
    },
  }
}</code></pre>

<p>把它和 <code>defaultAiSettings</code>、<code>resolveAiSettings</code> 一起从包的 <code>index.ts</code> 中导出。</p>

<h3 id="step-3">3. 让每个应用不再强制使用 Genspark，改为调用新的覆盖函数</h3>

<p>Docs、Sheets、Slides 各自注册了一个 <code>ai:get-settings</code> IPC 处理函数，每次读取时都会硬性把 provider 重置回 Genspark。删掉那一行，改为调用新的覆盖函数。三个文件里的改法完全一致：</p>

<p><code>apps/docs/src/main/docs-main.ts</code>（<code>apps/slides/src/main/ai-ipc.ts</code> 和 <code>apps/sheets/src/main/sheets-main.ts</code> 中的改法与此相同）</p>

<pre><code>// before
ipcMain.handle('ai:get-settings', (): AiSettings => {
  const stored = readJson&lt;Partial&lt;AiSettings&gt; &amp; LegacyAiSettings&gt;(SETTINGS_PATH(), {})
  const settings = resolveAiSettings(stored, defaultAiSettings())
  settings.provider = 'genspark'   // ← delete this
  return settings
})

// after
ipcMain.handle('ai:get-settings', (): AiSettings => {
  const stored = readJson&lt;Partial&lt;AiSettings&gt; &amp; LegacyAiSettings&gt;(SETTINGS_PATH(), {})
  return applyTokenStationEnvOverride(resolveAiSettings(stored, defaultAiSettings()))
})</code></pre>

<p>Sheets 的处理函数在两处写法上略有不同：它接收的是一个 IPC 通道常量而不是字符串字面量，而且开头会先调用一次 <code>sessionFor(event)</code> 检查。但改动的实质完全一样：删掉强制 genspark 的那一行，改为调用新的覆盖函数。</p>

<h3 id="step-4">4. 获取密钥，配置到环境变量中</h3>

<p>在 <a href="https://models.bytefuture.ai/signup">Token Station</a> 注册，从控制台拿到一个 API 密钥，然后把它设为持久化的环境变量，并重启终端（环境变量只对之后启动的进程生效）。</p>

<pre><code># Windows (PowerShell)
[Environment]::SetEnvironmentVariable("TOKEN_STATION_API_KEY", "gw_...", "User")

# macOS / Linux — add to your shell profile
export TOKEN_STATION_API_KEY=gw_...</code></pre>

<p>可选：设置 <code>TOKEN_STATION_MODEL</code> 为 Token Station 上任意 provider/model 形式的 ID（例如 <code>openai/gpt-5.5</code>）来覆盖默认模型。重新启动 GenOffice：Docs、Sheets、Slides 里的聊天、编辑和规划功能现在都跑在 Token Station 上了。Slides 的一键生成整套演示稿功能是唯一还需要额外打补丁的功能，见第 5 步。</p>

<h3 id="step-5">5. Slides 生成演示稿功能还需要一个补丁</h3>

<p>Slides 的 <code>generate_deck</code>/<code>regenerate_slide</code> 工具最初直接调用一个只支持 Genspark 的云端接口，完全绕过了 provider 系统。它们需要单独打三部分补丁。如果你只想接通 Docs 和 Sheets，做到第 4 步就可以停下。</p>

<p><strong><code>apps/slides/src/renderer/ai/slides-skill.ts</code></strong>：给 <code>DeckAccess</code> 接口加两个可选字段，一个同步的 <code>aiProvider()</code> getter，以及一个返回校验过的元素列表（而不是 HTML 标记）的 <code>composePageElements()</code> 方法。然后把两个工具的判断逻辑从「硬编码只认 Genspark」改为按当前 provider 判断：</p>

<pre><code>const useCloud = cloudAvailable
  &amp;&amp; (access.aiProvider?.() ?? 'genspark') === 'genspark'
if (!useCloud) {
  // fall back to runLocalDeckGeneration() / runLocalRegenerateSlide()
}</code></pre>

<p><strong><code>apps/slides/src/renderer/ai/local-deck-gen.ts</code></strong>（新文件）：这是真正负责组合内容的模块，向所配置的 provider 请求每一页的布局 JSON（形状、文本框、图表、图片），校验之后用应用自身智能体工具已经在用的 <code>add_shape</code> / <code>add_text_box</code> / <code>add_chart</code> / <code>insert_web_image</code> 原语来构建页面。</p>

<p><strong><code>apps/slides/src/renderer/ai/AiPanel.tsx</code></strong>：把新增的两个 <code>DeckAccess</code> 字段接到 <code>generateStyleSkill</code>/<code>planDeckOutline</code> 已经在用的同一条请求路径上。这一步很容易漏掉：不接的话 <code>aiProvider</code> 会一直是 undefined，上面的判断逻辑会悄悄退回到 Genspark。</p>

<pre><code>aiProvider: () => settingsRef.current.provider,
composePageElements: async (args) => {
  const { system, user } = buildPageComposePrompt(args)
  const r = await runLlmOnce(system, user, undefined, true, args.signal)
  if (!r.ok || !r.text) return { ok: false, error: r.error ?? tGlobal('aiErrEmptyOutput') }
  return parsePageElementsJson(r.text, args.canvasW, args.canvasH)
},</code></pre>

<p><strong>本地路径 v1 版本的已知限制：</strong>目前只支持追加，新页面会克隆当前最后一页，还不支持「替换整套演示稿」。本地版的 <code>regenerate_slide</code> 也只替换内容元素，背景和主题继承部分不会被改动，这一点与云端版本不同。</p>

<h2 id="demos">实际运行效果</h2>

<p>三段简短演示，每个应用一段，全部跑在 Token Station 上。</p>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-docs.mp4" type="video/mp4">
  </video>
  <figcaption>演示一 · Docs：项目概述。GenOffice Docs 用 AI 面板起草并编辑一份项目概述文档，全程跑在 Token Station 上，不涉及 Genspark 登录。</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-sheets.mp4" type="video/mp4">
  </video>
  <figcaption>演示二 · Sheets：项目预算。GenOffice Sheets 搭建一份项目预算表：公式、格式设置、以及针对实时工作表的 AI 辅助编辑，全部通过 Token Station 路由。</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-slides.mp4" type="video/mp4">
  </video>
  <figcaption>演示三 · Slides：项目演示稿。GenOffice Slides 生成一整套演示文稿，这正是第 5 步额外补丁所支持的功能，通过 Token Station 而不是 Genspark 的云端服务逐页生成。</figcaption>
</figure>

<h2 id="learn-more">延伸阅读</h2>

<ul>
  <li>Token Station：<a href="https://models.bytefuture.ai/signup">定价与注册</a></li>
  <li>Token Station：<a href="https://models.bytefuture.ai/models">完整模型目录</a></li>
  <li>GenOffice：<a href="https://github.com/genspark-ai/genoffice">GitHub 源码</a></li>
  <li>GenOffice：<a href="https://github.com/genspark-ai/genoffice/blob/main/CONTRIBUTING.md">贡献指南</a></li>
</ul>

<p>前往 <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> 注册（1 美元免费额度，无需信用卡），导出 <code>TOKEN_STATION_API_KEY</code>，然后重新启动 GenOffice。一把密钥、一个接口，满足你 Docs、Sheets、Slides 会话需要的所有模型。</p>
