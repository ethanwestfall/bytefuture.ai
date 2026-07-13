---
slug: "american-open-models-catching-up-nemotron-gpt55"
lang: "en"
title: "American Open Models Are Catching Up: Nemotron-3 Ultra Leads US Open Weights"
summary: "NVIDIA Nemotron-3 Ultra is the most capable American open-weights model on the Artificial Analysis Intelligence Index, and it's free for a limited time via NVIDIA NIM."
category: "research"
date: "2026-06-08"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/american-open-models-catching-up-nemotron-gpt55-cover.png"
draft: false
---

<p>Open models are getting harder to dismiss.</p>
<p>For years, the assumption was simple: if you wanted the strongest model, you used a closed frontier model. Open models were useful, but mostly for experiments, cost savings, or self-hosting.</p>
<p>That assumption is starting to break.</p>
<p>We tested <strong>NVIDIA Nemotron-3 Ultra 550B-A55B</strong>, an American open model from NVIDIA, against <strong>GPT-5.5</strong> on three real coding-agent tasks using Token Station Arena.</p>
<figure><img src="artificial_analysis_intelligence_open_models.png" alt="Artificial Analysis Intelligence chart showing Nemotron 3 Ultra near leading frontier models"><figcaption>Artificial Analysis Intelligence chart showing Nemotron 3 Ultra appearing close to leading frontier models on the Artificial Analysis Intelligence Index. Source: Artificial Analysis, captured June 8, 2026.</figcaption></figure>
<p>That standing is not just our read. On the Artificial Analysis Intelligence Index, Nemotron-3 Ultra scores 47.7, the highest of any American open-weights model and well ahead of the next US open models such as Gemma 4. It still sits behind the closed frontier and the strongest Chinese open models, but among American open weights nothing else is close.</p>
<p>The result was the story:</p>
<blockquote>Nemotron-3 Ultra completed the same mini benchmark workload as GPT-5.5.</blockquote>
<p>Both models passed <strong>9 out of 9</strong> runs.</p>
<p>This does not mean every open model beats every closed model. It means something more important for developers and companies:</p>
<blockquote>American open models are now strong enough to compete on real agent workloads, not just toy prompts.</blockquote>
<p>A note on access before we dig in: <strong>NVIDIA NIM is offering Nemotron-3 Ultra inference for free for a limited time</strong>, so <strong><a href="https://models.bytefuture.ai">Token Station</a></strong> offers it for free as well. And the free credits you get when you <a href="https://models.bytefuture.ai/signup">sign up for Token Station</a> can go toward GPT-5.5 and Claude Fable 5, so you can evaluate all three on your own coding tasks.</p>
<h2 id="why-this-matters">Why this matters</h2>
<p>The open-vs-closed model debate used to be mostly philosophical.</p>
<p>Open models gave developers more control. Closed models usually gave better performance.</p>
<p>And to be clear about the baseline: the closed frontier is still well ahead. Plot overall capability by release date, and the picture is stark:</p>
<figure><img src="overall_ai_capability_us_prc_elo.png" alt="Overall AI Capability (Elo) chart by release date: U.S. closed models lead, PRC open models trail on a lower line, and no American open models appear"><figcaption>Overall AI capability (Elo) by release date, U.S. vs PRC models. Source: U.S. Center for AI Standards and Innovation.</figcaption></figure>
<p>Two things stand out in that chart.</p>
<p>First, <strong>open models as a group still lag the closed frontier</strong>. Every model on the leading U.S. line (GPT-5.5, GPT-5.4, Anthropic's Opus series, and now Claude Fable 5, the current closed-frontier SOTA) is closed. The open-weight models that chart at all (DeepSeek, Qwen, Kimi) sit on a visibly lower trend line, hundreds of Elo points behind.</p>
<p>Second, and more striking: <strong>every open model on the chart is Chinese. American open models are nowhere to be found.</strong></p>
<p>Against that backdrop, an American open model completing the same coding-agent mini benchmark tasks as GPT-5.5 changes the conversation.</p>
<p>The question is no longer:</p>
<blockquote>Are open models useful?</blockquote>
<p>The better question is:</p>
<blockquote>Which workloads still require a closed frontier model, and which workloads can now run on a powerful open model?</blockquote>
<p>That distinction matters for real products.</p>
<p>AI agents are not just chatbots. They read files, modify code, call tools, run tests, retry failed steps, and operate across long workflows. For this kind of usage, model choice is not only about raw capability. It is also about control, cost structure, availability, and whether the model can be adapted to the business.</p>
<p>That is where open models are becoming strategically important.</p>
<h2 id="the-model-we-tested">The American open model we tested</h2>
<p>The open model in this mini benchmark was <strong>NVIDIA Nemotron-3 Ultra 550B-A55B</strong>.</p>
<p>Its model profile:</p>
<ul>
<li><strong>550B total parameters</strong></li>
<li><strong>55B active parameters</strong></li>
<li>MoE / latent-MoE style architecture</li>
<li>Developed by NVIDIA, an American AI infrastructure company</li>
<li>Inference free for a limited time via NVIDIA NIM, and served free on Token Station too</li>
</ul>
<p>This is not a small model being used only because it is inexpensive. It is a large American open model designed for serious reasoning and agent workloads.</p>
<p>GPT-5.5 remains a leading closed frontier model. It is powerful, polished, and widely useful. The same goes for <strong>Claude Fable 5</strong>, Anthropic's newest flagship and a representative of the current closed-frontier SOTA. We don't yet have head-to-head numbers for it in this mini benchmark, but it is part of the bar that open models are chasing. Nemotron-3 Ultra represents a different kind of value: a strong open model with more transparent model characteristics and a more controllable deployment profile.</p>
<p>For developers and businesses, that matters.</p>
<h2 id="benchmark-setup">The mini benchmark setup</h2>
<p>We used <strong><a href="https://github.com/hydai/token-station-arena">Token Station Arena</a></strong> to run a coding-agent mini benchmark: a small, focused test, not a leaderboard. The runner, the three tasks, and every check are open source, so you can read exactly what was tested and reproduce it yourself.</p>
<p>The setup:</p>
<ul>
<li><strong>2 models</strong>: GPT-5.5 and NVIDIA Nemotron-3 Ultra 550B-A55B</li>
<li><strong>3 coding-agent tasks</strong></li>
<li><strong>3 runs per task per model</strong></li>
<li><strong>18 total runs</strong></li>
</ul>
<p>The mini benchmark used deterministic checks such as unit tests, typecheck, clippy, and task-specific validation.</p>
<p>This is important because coding agents should not be judged only by whether their answers sound good. They need to make real code changes and pass checks.</p>
<h2 id="coding-agent-tasks">The three coding-agent tasks</h2>
<p>All three tasks live in the <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks">benchmark/tasks</a> folder of the Arena repository. Each task is a self-contained Rust fixture project plus a prompt and a set of machine-checkable success criteria. Every task requires <code>cargo test</code>, <code>cargo check</code>, and <code>cargo clippy --all-targets -- -D warnings</code> to pass, and the judge fails any run that edits files outside the task's allowed paths, so an agent cannot pass by making unrelated changes or weakening the tests.</p>

<h3>1. <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks/add-api-endpoint">Add an API endpoint</a></h3>
<p>This task tests whether the model can make a normal product development change inside an existing codebase: a small Rust workspace with a <code>catalog-core</code> library crate and a <code>catalog-api</code> Axum crate. The prompt, verbatim from the repo:</p>
<pre><code>- Add `GET /products/top?limit=&lt;n&gt;` to the Axum app.
- Return JSON products sorted by descending popularity.
- Respect the optional `limit` query parameter. If it is
  missing, return all products.
- Reuse existing catalog-core logic where possible.
- Do not remove or weaken the integration test.</code></pre>
<p>The agent has to understand the project structure, find the right route or handler, add the endpoint, return the expected response, and keep the project checks passing. This is the kind of task developers do every day. It is not a puzzle. It is practical engineering work.</p>

<h3>2. <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks/fix-failing-test">Fix a failing test</a></h3>
<p>This task tests debugging ability. The fixture ships with a broken pricing implementation in <code>catalog-core</code> and a failing unit test:</p>
<pre><code>- Fix the failing pricing unit test in `catalog-core`.
- Preserve the public function names and signatures.
- Keep the implementation simple and idiomatic.
- Do not weaken, remove, or rewrite tests to hide the bug.</code></pre>
<p>The agent has to identify the underlying issue, fix the implementation, and restore passing tests without touching the test itself. This matters because real coding agents need to recover from failures. They cannot only write new code when everything is clean and obvious.</p>

<h3>3. <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks/refactor-pricing">Refactor pricing logic</a></h3>
<p>This task tests whether the model can improve code structure without changing business behavior:</p>
<pre><code>- Refactor the duplicated discount calculation in
  `catalog-core/src/pricing.rs`.
- Introduce one shared helper for computing the discount amount.
- Preserve all public function names, signatures, and behavior.
- Do not remove or weaken tests or the custom refactor check.</code></pre>
<p>On top of the standard checks, this task adds a fourth gate: a custom <code>check-refactor.mjs</code> script that verifies the duplication is actually gone. The agent has to preserve pricing rules while passing unit tests, typecheck, clippy, and that refactor-specific validation. This is closer to real production engineering than a simple code-generation prompt. The model has to understand both code and business logic.</p>
<h2 id="results">Results</h2>
<table>
<tr><th>Metric</th><th>GPT-5.5</th><th>NVIDIA Nemotron-3 Ultra 550B-A55B</th></tr>
<tr><td>Completed runs</td><td><strong>9/9</strong></td><td><strong>9/9</strong></td></tr>
<tr><td>Average judge score</td><td><strong>5.0</strong></td><td><strong>4.8</strong></td></tr>
</table>
<p>The important result is task completion.</p>
<p>Both models completed every run.</p>
<p>That is the marketing signal:</p>
<blockquote>An American open model completed the same coding-agent workload as GPT-5.5.</blockquote>
<p>For developers, this is a meaningful shift. Open models are no longer just fallback options. They are becoming serious candidates for real agent systems.</p>
<h2 id="open-models-catching-up">Open models are catching up</h2>
<p>The broader AI market is moving toward a multi-model world.</p>
<p>Closed models still matter. They often set the frontier and remain excellent choices for many high-value tasks.</p>
<p>But open models are catching up quickly. They are becoming capable enough for practical coding, reasoning, and agent workflows. They also offer advantages that closed models cannot always provide:</p>
<ul>
<li>More control over deployment strategy</li>
<li>Better fit for private or internal workflows</li>
<li>More predictable long-term infrastructure planning</li>
<li>More flexibility for customization</li>
<li>Less dependence on a single closed provider</li>
</ul>
<p>Nemotron-3 Ultra is especially important because it is an American open model from NVIDIA. For companies that care about both AI capability and infrastructure control, that combination is strategically relevant.</p>
<h2 id="what-this-means">What this means for Token Station</h2>
<p>The future is not one model for every task.</p>
<p>Some workloads need a closed frontier model. Some workloads can now run on a powerful open model. Many teams will want to test both before deciding what to use in production.</p>
<p>That is exactly why <strong>Token Station</strong> (<a href="https://models.bytefuture.ai">models.bytefuture.ai</a>) exists.</p>
<p>With Token Station, developers can access models like Nemotron-3 Ultra, GPT-5.5, and other frontier models through one platform. Instead of choosing based on brand names or assumptions, teams can compare models on their own workloads.</p>
<p>The point is not to declare one universal winner.</p>
<p>The point is to make model choice practical.</p>
<h2 id="try-it">Run it yourself</h2>
<p>American open models are catching up with closed frontier models.</p>
<p>Nemotron-3 Ultra matching GPT-5.5 on our coding-agent mini benchmark is one more signal that the model landscape is changing.</p>
<p>And you don't have to take our word for it. The entire mini benchmark runs against any Anthropic-compatible gateway, so with a <a href="https://models.bytefuture.ai/signup">Token Station key</a> and the <code>claude</code> CLI on your PATH, reproducing our runs is four commands:</p>
<pre><code>git clone https://github.com/hydai/token-station-arena
cd token-station-arena

# point the runner at Token Station (gateway root, no /v1)
export ANTHROPIC_BASE_URL=https://models.bytefuture.ai
export ANTHROPIC_AUTH_TOKEN=&lt;your Token Station API key&gt;

# run all three tasks against the configured models
cargo run --release -- benchmark --tasks all --models all --runs 3</code></pre>
<p>The runner executes each task in an isolated fixture, applies the deterministic checks, and generates a Markdown report with tokens, cost, and timing per run. You can also drop your own tasks into <code>benchmark/tasks/</code> (a fixture, a <code>prompt.md</code>, and a <code>task.yml</code>) and find out how these models do on <em>your</em> code, not ours.</p>
<p>Try Nemotron-3 Ultra (free for a limited time, courtesy of NVIDIA NIM) alongside GPT-5.5, Claude Fable 5, and other frontier models on <strong><a href="https://models.bytefuture.ai">Token Station</a></strong>.</p>
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
