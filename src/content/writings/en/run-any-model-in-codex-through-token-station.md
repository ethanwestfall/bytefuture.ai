---
slug: "run-any-model-in-codex-through-token-station"
lang: "en"
title: "Run any model in Codex through Token Station"
summary: "OpenAI's Codex can run any model, not just OpenAI's. Since February 2026 it requires the Responses API, so the platform you point it at must support that natively. The exact ~/.codex/config.toml for Token Station, verified against the OpenAI docs, plus smart routing."
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/run-any-model-in-codex-through-token-station-cover.png"
draft: false
---

<p>OpenAI made a quiet but useful point about Codex: the Codex app, CLI, and SDK can run <strong>any model</strong>, not only OpenAI's. The harness is the product; the model behind it is a choice. So you can keep Codex and point it at GPT-5.5, Claude, an open-weights model like GLM-5.2 or Kimi K2.7, or whatever fits the task.</p>

  <p>There is one catch that trips most people up. Since <strong>February 2026, Codex standardized on OpenAI's Responses API</strong>. Its provider integration expects <code>wire_api = "responses"</code>, and the old Chat Completions path is no longer the way in. That means the model platform you point Codex at has to speak the <strong>Responses API natively</strong>, not just Chat Completions. Most gateways only do the latter, and they break here.</p>

  <p><a href="https://models.bytefuture.ai">Token Station</a> exposes every model it hosts through the OpenAI <strong>Responses API</strong> at <code>/v1/responses</code>, so Codex connects directly with no shim. This guide is the exact setup, the verification command, how to swap models with one line, and how smart routing fits in.</p>

  <h2 id="why-custom-provider">Why you need a custom provider (not just env vars)</h2>

  <p>With Claude Code you can redirect to a different endpoint with environment variables alone. Codex is different. Its <strong>built-in OpenAI provider ignores <code>OPENAI_BASE_URL</code></strong> and always dials <code>api.openai.com</code>. Setting that variable does nothing for the default provider.</p>

  <p>The supported path, per OpenAI's <a href="https://developers.openai.com/codex/config-advanced">advanced configuration docs</a>, is to define your own entry under <code>[model_providers.&lt;id&gt;]</code> in <code>~/.codex/config.toml</code> and select it with <code>model_provider</code>. (To move the built-in provider you would use <code>openai_base_url</code>, and you cannot reuse the reserved <code>openai</code> id, so a named custom provider is the clean route.) Your API key stays in an environment variable, referenced from the config by <code>env_key</code> so the secret never lands in the file.</p>

  <h2 id="config">The one-time config</h2>

  <p>Create the config file. This defines a <code>token_station</code> provider on the Responses API and makes it the default:</p>

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

  <p>Then export your Token Station key (the variable name matches <code>env_key</code> above) and run a one-line check:</p>

  <pre><code>export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

codex exec "Respond with exactly the word: pong"</code></pre>

  <p>If it prints <code>pong</code>, Codex is talking to Token Station over the Responses API. From here, <code>codex</code> opens the interactive session against the same provider.</p>

  <h3 id="fields">What each field does</h3>

  <table>
    <tr><th>Key</th><th>Meaning</th></tr>
    <tr><td><code>model</code></td><td>The default model ID Codex requests, in <code>provider/model</code> form (here <code>openai/gpt-5.5</code>).</td></tr>
    <tr><td><code>model_provider</code></td><td>Which provider block to use. Must match the id in <code>[model_providers.&lt;id&gt;]</code>.</td></tr>
    <tr><td><code>name</code></td><td>A human-readable label. Free text; not an id.</td></tr>
    <tr><td><code>base_url</code></td><td>Token Station's OpenAI-compatible base, <code>https://models.bytefuture.ai/v1</code>. Codex appends <code>/responses</code>.</td></tr>
    <tr><td><code>env_key</code></td><td>The environment variable Codex reads the key from. The secret stays out of the file.</td></tr>
    <tr><td><code>wire_api</code></td><td><code>"responses"</code>. This is the part that matters: it selects the Responses API, which Codex requires and Token Station supports natively.</td></tr>
  </table>

  <h3 id="matches-docs">It matches the OpenAI docs</h3>

  <p>Every key above is straight from OpenAI's documented schema for custom providers: <code>model</code> and <code>model_provider</code> at the top level, then a <code>[model_providers.&lt;id&gt;]</code> table with <code>name</code>, <code>base_url</code>, <code>env_key</code>, and <code>wire_api</code>. The id <code>token_station</code> is allowed because it is not one of the reserved ids (<code>openai</code>, <code>ollama</code>, <code>lmstudio</code>). The only value that has to be exactly right for Codex today is <code>wire_api = "responses"</code>. Nothing in the block is Token Station specific syntax; it is the same shape you would use for any provider.</p>

  <h2 id="swap">Swap the model with one line</h2>

  <p>Because every model on Token Station sits behind the same key and the same Responses endpoint, switching models is a single edit to <code>model</code> in the config, or a flag at launch:</p>

  <pre><code>codex --model anthropic/claude-opus-4-8 exec "Summarize git diff and suggest a commit message"</code></pre>

  <p>Some model IDs you can drop into <code>model</code> right now, all on the same config:</p>

  <table>
    <tr><th>Model ID</th><th>Good for</th></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>OpenAI's flagship; the native Codex default.</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>Long-horizon agentic coding and refactors.</td></tr>
    <tr><td><code>glm/glm-5.2</code></td><td>Open-weights, 1M context, strong on code at a low price.</td></tr>
    <tr><td><code>kimi/kimi-k2.7-code</code></td><td>Cheap open-weights coding model for routine work.</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>Fast and inexpensive, a fraction of flagship output cost.</td></tr>
  </table>

  <p>The point OpenAI was making lands here: Codex is model agnostic. Run the expensive model on the hard task and a cheap open-weights model on the boilerplate, without leaving the harness or touching anything but one line.</p>

  <h2 id="smart-routing">Smart routing: let one ID pick the model</h2>

  <p>Hardcoding a model per task is fine, but Token Station also lets you <strong>route by rule</strong> instead of by name. You define a policy on your workload (cheapest model that clears a quality floor, latency capped under a threshold with a provider allowlist, or a strict fallback chain like a primary model with a backup behind it) and Token Station picks the model per request.</p>

  <p>For Codex this is handy because Codex itself only sends one model ID. Point <code>model</code> at your routed workload and the decision moves server side: if the primary model is slow or unavailable, the fallback answers, and your Codex session never has to know. You change the routing in Token Station, not in <code>config.toml</code>, so the same Codex setup follows your policy as it evolves.</p>

  <blockquote>
    <p>Codex sends one model ID. Smart routing decides what actually answers, so cost and fallback logic live in Token Station instead of being hardcoded in your config.</p>
  </blockquote>

  <h2 id="troubleshooting">If something does not connect</h2>

  <ul>
    <li><strong>It still hits <code>api.openai.com</code>.</strong> You set <code>OPENAI_BASE_URL</code> and expected the built-in provider to follow. It will not. Use the custom provider above and set <code>model_provider = "token_station"</code>.</li>
    <li><strong>401 / auth errors.</strong> The exported variable name must match <code>env_key</code> exactly (<code>TOKEN_STATION_API_KEY</code>), and the key must be exported in the same shell that runs <code>codex</code>.</li>
    <li><strong>Protocol or 404 errors on the model.</strong> Confirm <code>wire_api = "responses"</code>. Codex requires the Responses API; a Chat Completions only gateway cannot satisfy it.</li>
    <li><strong>Wrong model id.</strong> Use the <code>provider/model</code> form (for example <code>anthropic/claude-opus-4-8</code>), not a bare model name.</li>
  </ul>

  <h2 id="wrap">Get started</h2>

  <p>Codex running any model comes down to four lines of TOML and one environment variable, and the only requirement that bites is the Responses API. Token Station serves every model it hosts over that API, so the config above works unchanged whether you run GPT-5.5, Claude, GLM-5.2, or a routed workload.</p>

  <p>Sign up at <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> ($1 in free credit, no card; up to $50 bonus on your first top-up), drop your key into <code>TOKEN_STATION_API_KEY</code>, and run the <code>pong</code> check. One key, one endpoint, every model your Codex sessions need.</p>
