---
slug: "use-grok-build-in-codex-and-claude-code"
lang: "en"
title: "How to Use Grok Build in Codex and Claude Code"
summary: "xAI's Grok Build model is evolving fast and costs a fraction of GPT-5.5 or Claude Fable 5. Run it inside Claude Code or Codex with Token Station free credits. No xAI account needed."
category: "tutorial"
date: "2026-06-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-code-grok-build.png"
draft: false
---

<p>Grok Build is xAI's coding <strong>model</strong>: <code>grok-build-0.1</code>, detailed on <a href="https://docs.x.ai/docs/models/grok-build-0.1">its model card</a>. Don't confuse it with the <em>Grok Build CLI</em>, xAI's coding harness that shares the name; this article is about the model. It is evolving fast, with each release a visible step up on real coding work, and at <strong>$1 per million input tokens and $2 per million output</strong>, it costs a fraction of frontier flagships like GPT-5.5 and Claude Fable 5.</p>

<p>A fast-improving model at a fraction of the price is exactly the kind of thing worth testing. But almost nobody wants to switch tools just to test a model. xAI's answer is its own Grok Build CLI; most developers would rather drop the model into the harness they already live in: <strong>Claude Code</strong> or <strong>Codex</strong>. And that is where the problem starts: neither of them can talk to xAI's API directly. The issue goes beyond API shape. Codex, for example, sends tool calls with built-in tool names and parameters that xAI's endpoint does not recognize, so the request fails before the model even sees your prompt.</p>

<p><a href="https://models.bytefuture.ai/signup">Token Station</a> sits between your coding agent and xAI, and closes the gap with four things:</p>

<ul>
<li><strong>Free credits for Grok Build.</strong> The $1 you get at signup works with Grok Build. No card, no subscription.</li>
<li><strong>No xAI account needed.</strong> You skip creating and then funding a separate xAI account; your one Token Station key covers it.</li>
<li><strong>Claude Code: API translation.</strong> Claude Code speaks Anthropic's Messages API. Token Station translates those requests into what xAI's endpoint expects, and translates the responses back.</li>
<li><strong>Codex: tool and parameter name translation.</strong> Codex's built-in tool calls use names and parameters xAI does not recognize. Token Station rewrites them in both directions so tool use actually works.</li>
</ul>

<p>You get Grok Build running in Codex or Claude Code without patching anything yourself. This tutorial covers both setups. Total time: about two minutes each.</p>

<h2 id="what-you-need">What you need</h2>

<ul>
<li>A Token Station account (<a href="https://models.bytefuture.ai/signup">sign up free</a>; you get $1 in credit, no card required)</li>
<li>Your Token Station API key (starts with <code>gw-</code>)</li>
<li>Claude Code or Codex installed</li>
</ul>

<h2 id="claude-code-setup">Claude Code setup</h2>

<p>Claude Code reads its configuration from environment variables. To route all model slots to Grok Build through Token Station, set these before launching:</p>

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

<figure><img src="claude-code-grok-build.png" alt="Claude Code terminal showing Grok Build model xai/grok-build-0.1 running and responding to prompts"><figcaption>Claude Code running Grok Build through Token Station. The model confirms it is powered by xai/grok-build-0.1.</figcaption></figure>

<p>That is the entire setup. Claude Code will send every request through Token Station, which translates it for xAI's endpoint. Tool calls, streaming, and multi-turn conversations all work.</p>

<h3>What the environment variables do</h3>

<table>
<tr><th>Variable</th><th>Purpose</th></tr>
<tr><td><code>ANTHROPIC_BASE_URL</code></td><td>Points Claude Code at Token Station instead of Anthropic's API</td></tr>
<tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td>Your Token Station API key</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>Replaces the Opus model slot with Grok Build</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>Replaces the Sonnet model slot with Grok Build</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>Replaces the Haiku model slot with Grok Build</td></tr>
<tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>Routes subagent calls to Grok Build too</td></tr>
</table>

<p>You can mix and match. For example, keep Sonnet for the main model and only route subagents to Grok Build for cost savings.</p>

<h2 id="codex-setup">Codex setup</h2>

<p>Codex uses a TOML config file. Create it in two commands:</p>

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

<p>Then set your API key and launch:</p>

<pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

<figure><img src="codex-grok-build.png" alt="OpenAI Codex terminal showing model set to xai/grok-build-0.1 via Token Station"><figcaption>Codex running Grok Build through Token Station. The model field confirms xai/grok-build-0.1 is active.</figcaption></figure>

<p>Codex will now use Grok Build for all requests. Token Station handles the API translation, including the tool and parameter name rewriting that would otherwise cause Codex to fail against xAI directly.</p>

<h2 id="why-you-need-a-gateway">Why you need a gateway for this</h2>

<p>You might wonder: why not just point Codex at xAI's API directly?</p>

<p>Two reasons:</p>

<ol>
<li><strong>API shape mismatch.</strong> Claude Code speaks Anthropic's Messages API, and Codex sends requests in OpenAI's Responses API format. xAI's endpoint expects a different structure than either. Token Station translates both: requests in, responses out.</li>
<li><strong>Tool and parameter name translation.</strong> Codex sends built-in tool calls with names and parameters that xAI does not recognize. Token Station rewrites them so the model can actually use the tools. Without this, Codex tool calls fail silently or error out.</li>
</ol>

<p>This is not a theoretical problem. Developers who try to connect Codex to Grok Build directly hit cryptic errors on the first tool call.</p>

<h2 id="try-it">Try it</h2>

<p>Sign up at <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> and get $1 in free credit. No card, no subscription, no xAI account to create or fund. Your first top-up adds up to $50 in bonus credit. The free credit works with every model on the platform, including Grok Build, GPT-5.5, Claude, Gemini, and 200+ others. And since Grok Build costs a fraction of the frontier flagships per token, that credit goes a long way.</p>

<p>Two minutes of config. Then you are coding with Grok Build. And if Grok Build is not the right fit, the $1 credit works with every other model on the platform.</p>

      <hr />

      <!-- Share -->
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
