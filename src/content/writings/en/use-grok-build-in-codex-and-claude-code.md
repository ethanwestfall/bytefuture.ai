---
slug: "use-grok-build-in-codex-and-claude-code"
lang: "en"
title: "How to Use Grok Build in Codex and Claude Code"
summary: "xAI's Grok Build model is evolving fast and costs a fraction of GPT-5.5 or Claude Fable 5. Run it inside Claude Code or Codex with Token Station free credits. No xAI account needed."
category: "tutorial"
date: "2026-06-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/use-grok-build-in-codex-and-claude-code-cover.png"
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
