---
slug: "use-any-model-in-claude-code-through-token-station"
lang: "en"
title: "Use any model in Claude Code through Token Station"
summary: "Claude Code can run through Token Station with either a persistent ~/.claude/settings.json file or temporary ANTHROPIC_* environment variables. Set the base URL, token, Opus/Sonnet/Haiku model aliases, and subagent model, then verify with a one-line pong check."
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

<p>Claude Code can talk to <a href="https://models.bytefuture.ai">Token Station</a> without a wrapper or proxy. Point Claude Code at <code>https://models.bytefuture.ai</code>, use your <a href="https://models.bytefuture.ai">Token Station</a> key as the Anthropic auth token, and choose which <a href="https://models.bytefuture.ai">Token Station</a> model should answer Opus, Sonnet, Haiku, and subagent requests.</p>

  <p>There are two clean ways to do it:</p>

  <ul>
    <li>Use <code>~/.claude/settings.json</code> when you want the setup to persist across shells.</li>
    <li>Use exported environment variables when you want a temporary session, a CI job, or a one-off test.</li>
  </ul>

  <h2 id="settings-json">Option 1: persistent settings.json</h2>

  <p>Create Claude Code's settings directory and write the environment block into <code>~/.claude/settings.json</code>:</p>

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

  <p>Then run a minimal prompt to confirm the CLI is using <a href="https://models.bytefuture.ai">Token Station</a>:</p>

  <pre><code>claude -p "Respond with exactly the word: pong"</code></pre>

  <p>If the output is exactly <code>pong</code>, Claude Code is reaching <a href="https://models.bytefuture.ai">Token Station</a> and the selected model is responding.</p>

  <h2 id="shell-env">Option 2: temporary shell exports</h2>

  <p>If you do not want to write a settings file, export the same values in the shell that will launch Claude Code:</p>

  <pre><code>export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="YOUR TOKEN AT TOKEN STATION"

export ANTHROPIC_DEFAULT_OPUS_MODEL="openai/gpt-5.5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.4-mini"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="openai/gpt-5.4-nano"
export CLAUDE_CODE_SUBAGENT_MODEL="openai/gpt-5.4-mini"

claude -p "Respond with exactly the word: pong"</code></pre>

  <p>This is useful when you want to test a different model mapping without changing your saved Claude Code configuration.</p>

  <h2 id="what-each-variable-does">What each variable does</h2>

  <table>
    <tr><th>Variable</th><th>Meaning</th></tr>
    <tr><td><code>ANTHROPIC_BASE_URL</code></td><td>The API endpoint Claude Code sends requests to. For <a href="https://models.bytefuture.ai">Token Station</a>, use <code>https://models.bytefuture.ai</code>.</td></tr>
    <tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td>Your <a href="https://models.bytefuture.ai">Token Station</a> API key. Keep it out of source control.</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>The model Claude Code should use for Opus-class requests.</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>The model Claude Code should use for Sonnet-class requests.</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>The model Claude Code should use for Haiku-class requests.</td></tr>
    <tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>The model Claude Code should use for subagents.</td></tr>
  </table>

  <h2 id="choosing-models">Choosing models</h2>

  <p>The model IDs above are just a mapping. You can point each Claude Code tier at a different <a href="https://models.bytefuture.ai">Token Station</a> model, or use the same model everywhere. The practical default is a strong model for Opus and a faster, cheaper model for Sonnet, Haiku, and subagents.</p>

  <p>Good <a href="https://models.bytefuture.ai">Token Station</a> starting points:</p>

  <table>
    <tr><th>Claude Code slot</th><th><a href="https://models.bytefuture.ai">Token Station</a> model</th><th>Why use it</th></tr>
    <tr><td><code>Opus</code></td><td><code>openai/gpt-5.5</code></td><td>Best default for hard planning, debugging, architecture, and long edits.</td></tr>
    <tr><td><code>Sonnet</code></td><td><code>openai/gpt-5.4-mini</code></td><td>Balanced daily driver for coding, reviews, repo navigation, and refactors.</td></tr>
    <tr><td><code>Haiku</code></td><td><code>openai/gpt-5.4-nano</code></td><td>Low-cost, low-latency option for short prompts and quick checks.</td></tr>
    <tr><td><code>Subagent</code></td><td><code>openai/gpt-5.4-mini</code></td><td>Strong enough for delegated investigation without making every subtask flagship-priced.</td></tr>
    <tr><td><code>Alternative Opus</code></td><td><code>anthropic/claude-opus-4-8</code></td><td>Use when you specifically want Claude-family behavior for long-horizon coding.</td></tr>
    <tr><td><code>Budget coding</code></td><td><code>kimi/kimi-k2.7-code</code></td><td>Good fit for routine implementation work when cost matters more than maximum reasoning depth.</td></tr>
  </table>

  <p>You can copy any of these model IDs into the corresponding <code>ANTHROPIC_DEFAULT_*</code> variable above. Start with the balanced mapping in the config block, then move Opus up or Haiku down only when the task actually needs it.</p>

  <h2 id="troubleshooting">If something does not connect</h2>

  <ul>
    <li><strong>It still uses the default Anthropic endpoint.</strong> Confirm <code>ANTHROPIC_BASE_URL</code> is present in the shell that launches <code>claude</code>, or inside <code>~/.claude/settings.json</code>.</li>
    <li><strong>401 / auth errors.</strong> Replace <code>YOUR TOKEN AT TOKEN STATION</code> with your real <a href="https://models.bytefuture.ai">Token Station</a> key.</li>
    <li><strong>The wrong model answers.</strong> Check the Opus, Sonnet, Haiku, and subagent model variables. Claude Code chooses between these slots depending on the request type.</li>
    <li><strong>The settings file does not seem to apply.</strong> Validate that <code>~/.claude/settings.json</code> is valid JSON and restart the Claude Code command after editing it.</li>
  </ul>

  <h2 id="wrap">Get started</h2>

  <p>For a permanent setup, use <code>~/.claude/settings.json</code>. For a temporary setup, export the variables in your current shell. In both cases the check is the same: run <code>claude -p "Respond with exactly the word: pong"</code> and look for <code>pong</code>.</p>

  <p>Sign up at <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> ($1 in free credit, no card; up to $50 bonus on your first top-up), put your <a href="https://models.bytefuture.ai">Token Station</a> key into Claude Code, and route Claude Code's model slots to the models you actually want to use.</p>
