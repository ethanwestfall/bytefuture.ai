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
