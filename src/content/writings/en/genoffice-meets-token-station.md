---
slug: "genoffice-meets-token-station"
lang: "en"
title: "GenOffice meets Token Station: any model, pay-as-you-go"
summary: "GenOffice ships with Genspark wired in by default. Point it at Token Station instead and every app in the suite runs on whatever model you choose, billed per request instead of per contract."
category: "tutorial"
date: "2026-08-08"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/genoffice-meets-token-station-cover.png"
draft: false
---

<p><a href="https://github.com/genspark-ai/genoffice">GenOffice</a> is an open-source, AI-native office suite built on Electron: a word processor, a spreadsheet editor, a presentation builder, and a PDF viewer, tabbed together under one shell. Five apps share one promise underneath them: <strong>file-format fidelity</strong>. Open a <code>.docx</code>, <code>.xlsx</code>, or <code>.pptx</code>, make your edits, and everything you didn't touch comes back byte-identical. GenOffice parses the original file, tracks only the blocks you change, and splices narrow patches back into the source XML on save; the rest of the archive is copied through untouched.</p>

<p>Every app carries the same AI panel: block-level editing with version history in Docs, a tool-calling agent over the live workbook in Sheets, and a constrained layout-scripting agent in Slides that edits presentations through a fixed set of validated primitives rather than free-form code. All three share two packages under the hood: <code>agent-core</code> for the tool-calling loop, and <code>ai-provider</code> for talking to whichever model backend is configured.</p>

<p>That last part is the hook for this article. <code>ai-provider</code> already speaks plain OpenAI-compatible HTTP. Out of the box, GenOffice points it at Genspark. Point it at <a href="https://models.bytefuture.ai">Token Station</a> instead, and nothing about the apps changes: only where the tokens come from.</p>

<h2 id="why-token-station">Why run it on Token Station</h2>

<p>Genspark works the moment you sign in, and that's the right default. But it's one account, one model roster, and a credit balance you refill on Genspark's terms. Token Station changes the shape of that relationship in two ways that matter for a desktop app you run every day.</p>

<table>
  <tr><th></th><th>Genspark (default)</th><th>Token Station</th></tr>
  <tr><td>Account / credit</td><td>Single account, single credit pool</td><td>Pay-as-you-go, no monthly or annual contract</td></tr>
  <tr><td>Models</td><td>Roster fixed by the integration</td><td>250+ models across 25+ providers, pick per task</td></tr>
  <tr><td>Pricing</td><td>Credits tied to a Genspark plan</td><td>One key, provider rates, zero markup</td></tr>
</table>

<p><strong>Pay-as-you-go, not a contract.</strong> Token Station has no subscription tier. Register free, no card required, and a $1 credit lands in your balance immediately. From there you pay provider rates on the models you actually call, nothing recurring and nothing to cancel. Some models, like NVIDIA NIM, cost nothing at all.</p>

<p><strong>Freedom to choose the model.</strong> A gateway account isn't pinned to one vendor's lineup. Run GenOffice Docs on Claude for long-form editing, switch Sheets to a cheaper model for routine formula work, and point Slides at whichever image-capable model fits the deck, all through the same key and the same OpenAI-style endpoint, with no separate signup per provider.</p>

<p>Because Token Station speaks the same OpenAI-compatible wire format GenOffice's custom provider slot already expects, wiring it in is a routing change, not a rewrite.</p>

<h2 id="setup">Setup: patch your GenOffice checkout</h2>

<p>These are the actual changes that route GenOffice's AI traffic to Token Station instead of Genspark. Apply them to your own fork or branch; nothing here depends on a specific GenOffice release.</p>

<h3 id="step-1">1. Install prerequisites and confirm the baseline build runs</h3>

<p>You'll need Node.js and npm on your machine.</p>

<pre><code>git clone &lt;your-fork-url&gt; genoffice
cd genoffice
npm install
npm run dev</code></pre>

<p>Confirm the shell launches and the AI panel opens normally. At this point it runs on Genspark by default, with no sign-in prompt unless you actually send a message while logged out.</p>

<h3 id="step-2">2. Add an environment-driven override to the shared provider package</h3>

<p><code>packages/ai-provider</code> already defines a custom provider: any OpenAI-compatible <code>baseUrl</code> / <code>apiKey</code> / <code>model</code>. Add a small function that fills it in from an environment variable, the same pattern the codebase already uses for Genspark's own key (<code>GSK_API_KEY</code>).</p>

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

<p>Export it from the package's <code>index.ts</code> alongside <code>defaultAiSettings</code> and <code>resolveAiSettings</code>.</p>

<h3 id="step-3">3. Stop each app from forcing Genspark, and apply the override</h3>

<p>Docs, Sheets, and Slides each register an <code>ai:get-settings</code> IPC handler that hard-resets the provider on every read. Remove that line and call the new override instead. Same shape in all three files:</p>

<p><code>apps/docs/src/main/docs-main.ts</code> (mirrored in <code>apps/slides/src/main/ai-ipc.ts</code> and <code>apps/sheets/src/main/sheets-main.ts</code>)</p>

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

<p>Sheets' handler looks slightly different in two harmless ways: it takes an IPC channel constant instead of a string literal, and calls a <code>sessionFor(event)</code> check first. The substance is identical: delete the forced-genspark line, call the new override.</p>

<h3 id="step-4">4. Get a key and point the environment at it</h3>

<p>Register at <a href="https://models.bytefuture.ai/signup">Token Station</a>, grab an API key from the dashboard, then set it as a persistent environment variable and restart your terminal (environment variables only apply to processes launched afterward).</p>

<pre><code># Windows (PowerShell)
[Environment]::SetEnvironmentVariable("TOKEN_STATION_API_KEY", "gw_...", "User")

# macOS / Linux — add to your shell profile
export TOKEN_STATION_API_KEY=gw_...</code></pre>

<p>Optional: set <code>TOKEN_STATION_MODEL</code> to any Token Station provider/model id (for example <code>openai/gpt-5.5</code>) to override the default. Relaunch GenOffice: chat, editing, and planning across Docs, Sheets, and Slides now all run on Token Station. Slides' one-shot deck generation is the one feature that needs an additional patch, in step 5.</p>

<h3 id="step-5">5. One more patch for Slides' deck generation</h3>

<p>Slides' <code>generate_deck</code>/<code>regenerate_slide</code> tools originally called a Genspark-only cloud endpoint directly, bypassing the provider system entirely. They need their own patch, in three parts. If you're only routing Docs and Sheets, you can stop at step 4.</p>

<p><strong><code>apps/slides/src/renderer/ai/slides-skill.ts</code></strong>: add two optional fields to the <code>DeckAccess</code> interface: a sync <code>aiProvider()</code> getter, and a <code>composePageElements()</code> method that returns a validated element list instead of an HTML marker. Then gate both tools on the active provider instead of a hard Genspark-only check:</p>

<pre><code>const useCloud = cloudAvailable
  &amp;&amp; (access.aiProvider?.() ?? 'genspark') === 'genspark'
if (!useCloud) {
  // fall back to runLocalDeckGeneration() / runLocalRegenerateSlide()
}</code></pre>

<p><strong><code>apps/slides/src/renderer/ai/local-deck-gen.ts</code></strong> (new file): the module that actually does the composing: asks the configured provider for each page's layout as JSON (shapes, text boxes, charts, images), validates it, and builds it with the same <code>add_shape</code> / <code>add_text_box</code> / <code>add_chart</code> / <code>insert_web_image</code> primitives the app's own agent tools already use.</p>

<p><strong><code>apps/slides/src/renderer/ai/AiPanel.tsx</code></strong>: wire the two new <code>DeckAccess</code> fields to the same request path <code>generateStyleSkill</code>/<code>planDeckOutline</code> already use. This piece is easy to miss: without it, <code>aiProvider</code> stays undefined and the gate above silently falls back to Genspark.</p>

<pre><code>aiProvider: () => settingsRef.current.provider,
composePageElements: async (args) => {
  const { system, user } = buildPageComposePrompt(args)
  const r = await runLlmOnce(system, user, undefined, true, args.signal)
  if (!r.ok || !r.text) return { ok: false, error: r.error ?? tGlobal('aiErrEmptyOutput') }
  return parsePageElementsJson(r.text, args.canvasW, args.canvasH)
},</code></pre>

<p><strong>Known limits of the local path, v1:</strong> it's append-only, new pages clone the current last slide, and "replace whole deck" isn't supported yet. Local <code>regenerate_slide</code> also replaces content elements only; background and theme inheritance are left untouched, unlike the cloud version.</p>

<h2 id="demos">See it running</h2>

<p>Three short demos, one per app, all running on Token Station.</p>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-docs.mp4" type="video/mp4">
  </video>
  <figcaption>Demo 1 · Docs: Project Overview. GenOffice Docs drafting and editing a project overview document with the AI panel, running on Token Station end to end, no Genspark sign-in involved.</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-sheets.mp4" type="video/mp4">
  </video>
  <figcaption>Demo 2 · Sheets: Project Budget. GenOffice Sheets building out a project budget: formulas, formatting, and AI-assisted edits against the live workbook, all routed through Token Station.</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-slides.mp4" type="video/mp4">
  </video>
  <figcaption>Demo 3 · Slides: Project Deck. GenOffice Slides generating a full presentation deck, the feature that needed the extra patch in step 5, composed page by page through Token Station instead of Genspark's cloud service.</figcaption>
</figure>

<h2 id="learn-more">Where to learn more</h2>

<ul>
  <li>Token Station: <a href="https://models.bytefuture.ai/signup">pricing &amp; signup</a></li>
  <li>Token Station: <a href="https://models.bytefuture.ai/models">full model catalog</a></li>
  <li>GenOffice: <a href="https://github.com/genspark-ai/genoffice">source on GitHub</a></li>
  <li>GenOffice: <a href="https://github.com/genspark-ai/genoffice/blob/main/CONTRIBUTING.md">contributing guide</a></li>
</ul>

<p>Sign up at <a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> ($1 in free credit, no card required), export <code>TOKEN_STATION_API_KEY</code>, and relaunch GenOffice. One key, one endpoint, every model your Docs, Sheets, and Slides sessions need.</p>
