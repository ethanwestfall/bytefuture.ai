---
slug: "run-any-model-in-codex-through-token-station"
lang: "zh"
title: "在 Codex 中通过 Token Station 运行任意模型"
summary: "OpenAI 的 Codex 可以运行任意模型，不只是 OpenAI 自家的。自 2026 年 2 月起它强制使用 Responses API，所以你对接的平台必须原生支持它。本文给出对接 Token Station 的完整 ~/.codex/config.toml 配置，并与 OpenAI 官方文档逐项核对，还介绍了 smart routing。"
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/run-any-model-in-codex-through-token-station-cover.png"
draft: false
---

<p>OpenAI 提了一个不张扬却很实用的点：Codex 的 app、CLI 和 SDK 可以运行<strong>任意模型</strong>，不只是 OpenAI 自家的。真正的产品是这套工具，背后用哪个模型是你的选择。所以你完全可以继续用 Codex，把它指向 GPT-5.5、Claude，或是 GLM-5.2、Kimi K2.7 这样的开源权重模型，哪个适合当前任务就用哪个。</p>

  <p>但有一个坑，很多人会栽进去。自 <strong>2026 年 2 月起，Codex 统一改用了 OpenAI 的 Responses API</strong>。它的模型提供商对接要求 <code>wire_api = "responses"</code>，旧的 Chat Completions 通道不再是入口。这意味着你给 Codex 对接的模型平台必须<strong>原生支持 Responses API</strong>，仅支持 Chat Completions 是不够的。大多数网关只做了后者，到这里就连不上了。</p>

  <p><a href="https://models.bytefuture.ai">Token Station</a> 把它托管的每一个模型都通过 OpenAI 的 <strong>Responses API</strong>（<code>/v1/responses</code>）暴露出来，所以 Codex 可以直接连上，不需要任何中间层。本文给出完整的配置、验证命令、如何用一行切换模型，以及 smart routing 在其中的位置。</p>

  <h2 id="why-custom-provider">为什么要自定义 provider（光靠环境变量不行）</h2>

  <p>在 Claude Code 里，你只靠环境变量就能把请求重定向到别的端点。Codex 不一样。它<strong>内置的 OpenAI provider 会忽略 <code>OPENAI_BASE_URL</code></strong>，永远去连 <code>api.openai.com</code>。对默认 provider 设这个变量没有任何作用。</p>

  <p>按照 OpenAI 的<a href="https://developers.openai.com/codex/config-advanced">高级配置文档</a>，受支持的做法是在 <code>~/.codex/config.toml</code> 里用 <code>[model_providers.&lt;id&gt;]</code> 定义你自己的条目，再用 <code>model_provider</code> 选中它。（要改内置 provider 得用 <code>openai_base_url</code>，而且不能复用保留的 <code>openai</code> 这个 id，所以定义一个有名字的自定义 provider 是更干净的路径。）你的 API key 仍然放在环境变量里，配置通过 <code>env_key</code> 来引用，密钥本身永远不会落进文件。</p>

  <h2 id="config">一次性配置</h2>

  <p>创建配置文件。这会定义一个走 Responses API 的 <code>token_station</code> provider，并把它设为默认：</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
model = "openai/gpt-5.5"
model_provider = "token_station"

[model_providers.token_station]
name = "Token Station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

  <p>然后导出你的 Token Station key（变量名要和上面的 <code>env_key</code> 一致），跑一行命令验证：</p>

  <pre><code>export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

codex exec "Respond with exactly the word: pong"</code></pre>

  <p>如果它打印出 <code>pong</code>，说明 Codex 已经通过 Responses API 连上了 Token Station。之后直接运行 <code>codex</code> 就会用同一个 provider 打开交互式会话。</p>

  <h3 id="fields">每个字段的含义</h3>

  <table>
    <tr><th>字段</th><th>含义</th></tr>
    <tr><td><code>model</code></td><td>Codex 默认请求的模型 ID，采用 <code>provider/model</code> 形式（这里是 <code>openai/gpt-5.5</code>）。</td></tr>
    <tr><td><code>model_provider</code></td><td>使用哪个 provider 块，必须和 <code>[model_providers.&lt;id&gt;]</code> 里的 id 一致。</td></tr>
    <tr><td><code>name</code></td><td>给人看的标签，自由文本，不是 id。</td></tr>
    <tr><td><code>base_url</code></td><td>Token Station 的 OpenAI 兼容根地址 <code>https://models.bytefuture.ai/v1</code>，Codex 会自动拼上 <code>/responses</code>。</td></tr>
    <tr><td><code>env_key</code></td><td>Codex 从哪个环境变量读取 key，密钥本身不进文件。</td></tr>
    <tr><td><code>wire_api</code></td><td><code>"responses"</code>。这一项才是关键：它选定了 Responses API，正是 Codex 强制要求、而 Token Station 原生支持的协议。</td></tr>
  </table>

  <h3 id="matches-docs">它与 OpenAI 官方文档一致</h3>

  <p>上面每一个字段都直接来自 OpenAI 文档里自定义 provider 的 schema：顶层的 <code>model</code> 和 <code>model_provider</code>，然后是一个带 <code>name</code>、<code>base_url</code>、<code>env_key</code> 和 <code>wire_api</code> 的 <code>[model_providers.&lt;id&gt;]</code> 表。<code>token_station</code> 这个 id 是允许的，因为它不属于保留 id（<code>openai</code>、<code>ollama</code>、<code>lmstudio</code>）。对今天的 Codex 而言，唯一必须填准的值就是 <code>wire_api = "responses"</code>。这一块里没有任何 Token Station 专有的语法，它和你为任何 provider 写的配置形状完全一样。</p>

  <h2 id="swap">一行切换模型</h2>

  <p>因为 Token Station 上的每个模型都在同一个 key、同一个 Responses 端点后面，切换模型只需要改配置里的一处 <code>model</code>，或者在启动时加一个参数：</p>

  <pre><code>codex --model anthropic/claude-opus-4-8 exec "Summarize git diff and suggest a commit message"</code></pre>

  <p>下面这些模型 ID 现在就能直接填进 <code>model</code>，全部基于同一份配置：</p>

  <table>
    <tr><th>模型 ID</th><th>适合</th></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>OpenAI 的旗舰，也是 Codex 的原生默认模型。</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>长链路的智能体编码与大规模重构。</td></tr>
    <tr><td><code>glm/glm-5.2</code></td><td>开源权重、100 万 token 上下文，代码能力强且价格低。</td></tr>
    <tr><td><code>kimi/kimi-k2.7-code</code></td><td>便宜的开源权重编码模型，适合日常活儿。</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>又快又便宜，输出成本只有旗舰的一小部分。</td></tr>
  </table>

  <p>OpenAI 想说的那个点在这里落地了：Codex 与模型无关。难活交给贵的模型，样板代码交给便宜的开源权重模型，全程不用离开这套工具，改的也只是一行而已。</p>

  <h2 id="smart-routing">Smart routing：让一个 ID 自动挑模型</h2>

  <p>给每个任务写死一个模型当然可以，但 Token Station 还允许你<strong>按规则路由</strong>，而不是按名字。你为某个工作负载定义一条策略（达到质量底线的前提下选最便宜的、把延迟压在某个阈值内并限定 provider 白名单、或者一条严格的回退链，比如主模型背后挂一个备用模型），Token Station 就会逐请求地替你挑模型。</p>

  <p>对 Codex 来说这很顺手，因为 Codex 本身只发出一个模型 ID。把 <code>model</code> 指向你配好路由的工作负载，决策就移到了服务端：如果主模型慢或不可用，备用模型来应答，而你的 Codex 会话完全无需知情。你在 Token Station 里改路由，而不是动 <code>config.toml</code>，所以同一套 Codex 配置会随着你的策略演进而自动跟上。</p>

  <blockquote>
    <p>Codex 只发出一个模型 ID。Smart routing 决定实际由谁应答，于是成本和回退逻辑都放在 Token Station 里，而不是写死在你的配置里。</p>
  </blockquote>

  <h2 id="troubleshooting">如果连不上</h2>

  <ul>
    <li><strong>它还是去连 <code>api.openai.com</code>。</strong>你设了 <code>OPENAI_BASE_URL</code>，指望内置 provider 跟着走，它不会。请用上面的自定义 provider，并设 <code>model_provider = "token_station"</code>。</li>
    <li><strong>401 / 鉴权错误。</strong>导出的变量名必须和 <code>env_key</code> 完全一致（<code>TOKEN_STATION_API_KEY</code>），而且 key 要在运行 <code>codex</code> 的同一个 shell 里导出。</li>
    <li><strong>模型报协议错误或 404。</strong>确认 <code>wire_api = "responses"</code>。Codex 强制要求 Responses API，只支持 Chat Completions 的网关满足不了它。</li>
    <li><strong>模型 id 写错了。</strong>要用 <code>provider/model</code> 形式（例如 <code>anthropic/claude-opus-4-8</code>），不要只写一个裸的模型名。</li>
  </ul>

  <h2 id="wrap">开始上手</h2>

  <p>让 Codex 运行任意模型，归根结底就是四行 TOML 加一个环境变量，唯一会绊住你的要求就是 Responses API。Token Station 把它托管的每个模型都通过这个 API 提供，所以上面的配置原封不动就能用，无论你跑的是 GPT-5.5、Claude、GLM-5.2，还是一个配了路由的工作负载。</p>

  <p>到 <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> 注册（1 美元免费额度，无需信用卡；首次充值最高再送 50 美元），把 key 填进 <code>TOKEN_STATION_API_KEY</code>，跑一下 <code>pong</code> 验证。一个 key、一个端点，你的 Codex 会话需要的每个模型都在这里。</p>
