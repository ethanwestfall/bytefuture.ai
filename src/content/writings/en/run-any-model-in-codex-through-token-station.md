---
slug: "run-any-model-in-codex-through-token-station"
lang: "en"
title: "Run any model in Codex through Token Station"
summary: "OpenAI's Codex can run any model, not just OpenAI's. Since February 2026 it requires the Responses API, so the platform you point it at must support that natively. The exact ~/.codex/config.toml for Token Station, verified against the OpenAI docs, plus smart routing."
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
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

      <hr />

      <!-- Share (leave exactly as-is; the buttons fire share_click GA events) -->
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-family:'Space Grotesk',sans-serif; font-size:14px; color:#71717a;">Share this post</span>
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
        <a href="#" onclick="gtag('event','share_click',{label:'copy_link'});var b=this;navigator.clipboard.writeText(location.href).then(function(){var s=b.querySelector('.share-label');s.textContent='Copied!';setTimeout(function(){s.textContent='Copy link';},1500);});return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
          <span class="share-label">Copy link</span>
        </a>
      </div>
