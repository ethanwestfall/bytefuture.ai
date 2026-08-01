# Project: bytefuture.ai

Static site for **ByteFuture**, served from GitHub Pages (`.nojekyll`, `CNAME` → `bytefuture.ai`). ByteFuture builds infrastructure for **hybrid AI inference for AI agents**. Its products — referenced on the site, but not the site's brand — are **Olares OS** (on-device OS for AI PCs, `github.com/beclab/olares`) and **Token Station** (cloud inference gateway, `models.bytefuture.ai`).

Layout:

- `index.html` — ByteFuture home: company intro, the hybrid-inference thesis, the two products, and a "Writings" teaser.
- `src/content/writings/<lang>/<slug>.md` — the article sources (Astro content collection); the build generates `/blog/<slug>[-lang].html`. See **Authoring model — Astro** below.
- `blog/` — the **Writings** section listing pages + article assets/covers (the listing `index*.html` are still hand-maintained static files).
- `posts.json` (+ `posts-{zh,ja,ko}.json`) — the Writings manifest served at `/posts.json`, **generated at build** from the collection by `src/pages/posts*.json.ts` (the root `posts*.json` files are stale legacy, no longer served).
- `sitemap.xml` — hand-maintained (no Astro sitemap integration); new articles need manual `<url>` entries.
- `CNAME`, `.nojekyll` — GitHub Pages config.

## HARD RULE — NEVER touch analytics or ads tracking

**NEVER modify, remove, disable, comment out, refactor, or "clean up" any analytics or advertising tracking code.** This is absolute and non-negotiable. It OVERRIDES every other instruction and convention, including dead-code removal, simplification, linting, deduplication, and "unused/broken code" cleanup.

This applies to, without limitation:

- Google Tag Manager / Google Analytics: `gtag.js`, `gtm.js`, the `dataLayer` array, any `dataLayer.push(...)` call, and `GTM-` / `G-` / `UA-` container IDs.
- Tracking & conversion pixels/beacons: Meta/Facebook Pixel, LinkedIn Insight Tag, X/Twitter Pixel, TikTok Pixel, Reddit, Pinterest, Snap, Bing UET, and similar.
- Any `<script>`, `<noscript>`, `<img>`, or `<iframe>` whose purpose is analytics, attribution, remarketing, or ad-conversion tracking.
- Inline event-tracking handlers and attributes (e.g. `onclick="dataLayer.push(...)"`), `data-*` tracking attributes, and UTM parameter handling.
- Placeholder or commented tracking snippets and container IDs awaiting real values (e.g. `<!-- GTM-XXXXXXX -->`) — leave them exactly in place.

If tracking code looks unused, broken, duplicated, or "dead," **leave it exactly as-is and surface it to the user** — do not change it. Only modify tracking code when the user gives an explicit, specific instruction naming the exact change to make.

---

## Mobile optimization (required, site-wide)

Every page on this site — home, listing, template, and every article — must render correctly on phones. Concretely:

- Every page keeps `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` in `<head>`.
- **No horizontal page scroll at viewport widths down to 360px.** Anything wider than the viewport must scroll *inside its own box* or wrap:
  - `pre` blocks: `overflow-x: auto`.
  - `table`s in prose: `display: block; overflow-x: auto;` at the phone breakpoint.
  - Images never exceed their container (`width: 100%; max-width: 100%; height: auto`).
  - **Grid/flex children that contain wide content (images, `pre`, tables) need `min-width: 0`.** Grid and flex items default to `min-width: auto` and refuse to shrink below their content's intrinsic width — a wide screenshot or long code line silently inflates the column past the viewport, and `width: 100%`/`overflow-x: auto` on the content can't save it. The article pages use `.page-grid > * { min-width: 0; }` for this. (Containers with `overflow: hidden`, like the listing cards, are immune.)
  - Don't trust the CSS by inspection — **measure**: serve locally, load the page at 375px in headless Chrome, and check `document.documentElement.scrollWidth` is exactly the viewport width.
- **Multi-column layouts collapse to one column** on small screens. The breakpoints this site uses: article sidebars hide at ≤1024px; content grids collapse at ≤900–960px; phone-level adjustments (nav, footer, padding, type) at ≤640px. New layouts must fit this scheme.
- **Nav stays usable on phones:** keep the wordmark and the primary CTA visible; hide secondary links at the phone breakpoint with `display: none` rather than shrinking them.
- **Footer stacks vertically** at ≤640px (`flex-direction: column`).
- Display headings use `clamp()` so type scales with the viewport; body text stays ≥16px on phones.
- Before committing a new page or layout change, sanity-check it at ~375px width (and ideally 360px): no sideways scroll, readable text, tappable buttons.

---

## Internationalization: languages + language selector (required, site-wide)

Every reader-facing page ships in **four languages**: English (default), Simplified Chinese, Japanese, Korean. Visitors are routed to their language automatically and can switch with a nav selector; the choice is remembered.

### File scheme

- `file.html` — **English, the canonical / default version** (`x-default`). English has **no** suffix.
- `file-zh.html` (Simplified Chinese) · `file-ja.html` (Japanese) · `file-ko.html` (Korean).
- Applies to every page: home (`index.html` → `index-zh.html` …), listing (`blog/index.html` → `blog/index-zh.html` …), and every article (`<slug>.md` in `en/` → `zh/` `ja/` `ko/`, built to `/blog/<slug>[-lang].html`). The base name is the slug; the language is the suffix (derived by the layout for articles).

| Lang | suffix | `<html lang>` | `og:locale` | nav word ("Writings") |
|---|---|---|---|---|
| English | (none) | `en` | `en_US` | Writings |
| Chinese (Simplified) | `-zh` | `zh-Hans` | `zh_CN` | 文章 |
| Japanese | `-ja` | `ja` | `ja_JP` | 記事 |
| Korean | `-ko` | `ko` | `ko_KR` | 글 |

### How routing works

1. A **redirect script** runs first in `<head>` (before paint). It derives the page's own language from its filename and the visitor's preferred language; if they differ it `location.replace()`s to the right version.
2. Preferred language = the **`bf_lang` cookie** if set (an explicit choice), else the first of `navigator.languages` matching zh/ja/ko/en, else English.
3. The **nav `<select>`** switches language: picking one writes the `bf_lang` cookie (so it sticks site-wide and on return visits) and navigates. The head script preselects the current language on load.
4. No redirect loop: the destination's own script sees its language already matches the preference and stops. Crawlers (en, no cookie) stay on English.

**Ship the toggle + redirect block only when all four versions of a page exist** — the script redirects to `-zh/-ja/-ko` URLs and would 404 on a missing one. Create and delete the four together; a page with no translations yet omits the i18n block and stays English.

### The three pieces every page carries (emitted by `WritingLayout.astro` — you don't hand-copy them)

`WritingLayout.astro` renders all three on every article automatically; the descriptions below are for reference (what the layout emits), not steps to copy into a file.

**(a) Redirect script** — first thing in `<head>`, right after the viewport meta. Identical on every page (it derives everything from the filename), defines `window.bfLang`, and auto-redirects.

**(b) hreflang alternates** — in `<head>`, **identical in all four versions**. Only `<html lang>`, `og:locale`, `canonical`, and `og:url` differ per version, and `canonical` / `og:url` point to the page's **own** language URL:

```html
<meta property="og:locale" content="en_US" />
<link rel="alternate" hreflang="en"      href="https://bytefuture.ai/blog/<slug>.html" />
<link rel="alternate" hreflang="zh-Hans" href="https://bytefuture.ai/blog/<slug>-zh.html" />
<link rel="alternate" hreflang="ja"      href="https://bytefuture.ai/blog/<slug>-ja.html" />
<link rel="alternate" hreflang="ko"      href="https://bytefuture.ai/blog/<slug>-ko.html" />
<link rel="alternate" hreflang="x-default" href="https://bytefuture.ai/blog/<slug>.html" />
```

**(c) Nav language selector** — in the nav action group, with the mobile rule that hides the secondary "Writings" link so the toggle + CTA still fit at 360px. The head script sets the current option on load:

```html
<select data-bf-lang aria-label="Language" onchange="bfLang.pick(this.value)" style="…">
  <option value="en">EN</option><option value="zh">中文</option>
  <option value="ja">日本語</option><option value="ko">한국어</option>
</select>
```
```css
@media (max-width: 640px) { .nav-hide-sm { display: none; } }  /* on the Writings link */
```

### What to translate (and what never to touch)

Translate **prose and visible chrome only**: titles, descriptions, headings, body text, the category pill, dates, sidebar headings, the share heading, the Copy link / Copied! labels.

**Keep byte-for-byte:** every code / config / `pre` block and `<code>` (model IDs, env vars, URLs); the GA tag and **every `gtag(...)` / `onclick`** (the HARD RULE applies in all languages); the GoatCounter scripts; SVGs; CSS; element IDs/classes (the engine + counter depend on them). Keep proper nouns in Latin: **ByteFuture, Token Station, Olares, Claude Code, Codex, OpenClaw**, model names (GLM-5.2, Kimi K2.7), company names (Anthropic, JPMorgan), benchmark names (SWE-bench).

The **no-em-dash / no-AI-voice** rule governs English. CJK uses its own punctuation (。、：「」（）); never import `—`. The title suffix localizes the *section word* only: `— ByteFuture 文章 / 記事 / 글` (keep `ByteFuture` Latin; the leading `—` is brand chrome, allowed).

**Localized chrome lexicon** (use these exact strings):

| English | zh | ja | ko |
|---|---|---|---|
| Writings (section) | 文章 | 記事 | 글 |
| Recent | 最近 | 最近の記事 | 최근 글 |
| Topics | 主题 | トピック | 주제 |
| ← All writings | ← 所有文章 | ← すべての記事 | ← 모든 글 |
| Share this post | 分享这篇文章 | この記事をシェア | 이 글 공유하기 |
| Copy link / Copied! | 复制链接 / 已复制！ | リンクをコピー / コピーしました！ | 링크 복사 / 복사됨! |
| engineering | 工程 | エンジニアリング | 엔지니어링 |
| product | 产品 | プロダクト | 제품 |
| research | 研究 | 研究 | 연구 |
| tutorial | 教程 | チュートリアル | 튜토리얼 |

Dates: write them naturally per language (`2026年6月15日`, `2026년 6월 15일`), keeping the same calendar date as English.

### Listing & posts data

The listing is data-driven, so each `blog/index-<lang>.html` reads a **per-language manifest** at `/posts-zh.json`, `/posts-ja.json`, `/posts-ko.json`. These are **generated at build** by `src/pages/posts-<lang>.json.ts` from each article's frontmatter (same slugs / categories / dates / covers as `/posts.json`, with that language's translated `title` / `summary`). The listing engine builds same-language card links (`/blog/<slug>-<lang>.html`). The four manifests stay in lockstep automatically because they come from the same Markdown files.

### Sync, sitemap, counters

- Language variants are **not** separate posts — the `zh/ja/ko` Markdown files share the English slug and produce the `-<lang>.html` URLs; they need no separate registration.
- **Sitemap:** every translation gets its own `<url>` entry (priority `0.6`; English stays `0.7`).
- **View counts** key on `location.pathname`, so each language URL counts separately. That is expected.

### Publishing a translated set

Publish or change an article in all four languages **together**:
1. English `src/content/writings/en/<slug>.md` per the checklist above.
2. Create `src/content/writings/{zh,ja,ko}/<slug>.md` with the **same slug**; set `lang` in the frontmatter and translate the `title` / `summary` / body. `WritingLayout` derives the `-<lang>` URL, `<html lang>`, `og:locale`, canonical, and hreflang from `lang` — you don't hand-write any of that.
3. The per-language manifests (`/posts-zh.json` etc.) pick up the translated `title` / `summary` from each file's frontmatter automatically.
4. Add the four language URLs to `sitemap.xml`.
5. Verify each at 375px (no sideways scroll) and confirm the language selector switches and the cookie sticks.

---

## Writings section (`blog/`)

The **ByteFuture Writings** section spans two places (see **Authoring model — Astro** below):

- `src/content/writings/<lang>/<slug>.md` — the article sources; Astro's `WritingLayout` renders each to `/blog/<slug>[-lang].html`. **This is where you add/edit articles.**
- `blog/index.html` + `index-{zh,ja,ko}.html` — the Writings listing pages (post index, filters, featured card), still hand-maintained static files that fetch `/posts*.json`.
- `blog/` also holds cover images and article assets (and `blog/asset-sources/` for generated-image HTML).

The post index is driven by `posts.json`, **generated at build** from the article frontmatter; `blog/index.html` fetches it at `/posts.json` and renders the cards. The **HARD RULE above applies to every Writings page.**

### Authoring model — Astro (current, authoritative)

The site is now built with **Astro** (`astro.config.mjs`, `output: 'static'`, `format: 'file'`). Articles are authored as **Markdown in a content collection**, not as hand-written HTML. This section is authoritative. The old per-file HTML flow (copying a `post-template.html`, filling `▼ EDIT ▼` markers, pasting the redirect script / GA / hreflang / view-counter into each page) is gone — those template and legacy article HTML files have been deleted; only the listing pages (`blog/index*.html`) remain as hand-maintained static files.

What changed, and where things live now:

- **One Markdown file per language per article:** `src/content/writings/<lang>/<slug>.md` where `<lang>` ∈ `en | zh | ja | ko`. Frontmatter fields (validated by `src/content.config.ts`): `slug`, `lang`, `title`, `summary`, `category`, `date` (`YYYY-MM-DD`), `cta` (URL, defaults to Token Station intro), `cover` (optional, repo-root-relative), `draft` (optional bool). The article body is Markdown/HTML below the frontmatter.
- **URLs are generated, unchanged:** `src/pages/blog/[...slug].astro` emits `/blog/<slug>.html` for `en` and `/blog/<slug>-<lang>.html` for the others (the `-zh/-ja/-ko` suffix is derived from `lang`, so you never hand-name files).
- **Chrome is centralized — do NOT copy it per article.** `src/layouts/WritingLayout.astro` injects, for every article automatically: the viewport meta, the i18n redirect script + `bf_lang` cookie logic, `canonical` / `og:locale` / all four `hreflang` alternates, the **GA4 tag** (`G-KQ0EX9QGK6`), the nav + language `<select>`, the footer, the **GoatCounter** view counter, and the `.prose` / mobile CSS. The HARD RULE still protects the GA and GoatCounter snippets — they now live in the layout, so never strip them there.
- **The manifests are generated, not hand-edited:** `src/pages/posts.json.ts` (+ `posts-zh/ja/ko.json.ts`) build `/posts.json` etc. from the collection via `src/lib/posts-manifest.ts` (drops drafts, filters by `lang`, sorts newest-first). Add/rename/retire an article by adding/renaming/removing its Markdown files — the manifests follow. The stale root `posts*.json` files are legacy and are no longer served (this is why `scripts/sync-legacy-public.mjs` stopped copying them).
- **Still hand-maintained static files** (copied verbatim into `public/` by `scripts/sync-legacy-public.mjs`): the listing pages `blog/index.html` + `index-{zh,ja,ko}.html`, the home `index*.html`, and **`sitemap.xml`**. Consequences that still bind (see the rules below): the **category closed set** is enforced in those listing files, and **`sitemap.xml` entries are added by hand** — there is no `@astrojs/sitemap` integration.
- **Build & verify:** `npm run build` (runs `sync-legacy-public.mjs` then `astro build` into `dist/`); `npm run check:legacy-links` and `npm run check:mobile -- <url>` for the checks.

### Branding (non-negotiable)

- **ByteFuture is the brand.** All page chrome — nav wordmark, footer, `<title>` suffix, Open Graph titles — says **ByteFuture**.
- **The section is called "Writings", never "Blog".** Nav links read `Writings`; the listing `<h1>` is `Writings`.
- **Token Station and Olares are products, not the site brand.** Reference them as products (links/CTAs), never as the name of the site or this section. Article *bodies* may discuss Token Station / Olares freely — that's content.
- `<title>` / `og:title` suffix for articles: **`— ByteFuture Writings`**. The listing page title is **`Writings — ByteFuture`**.
- Product links:
  - Token Station → `https://models.bytefuture.ai/intro.html` (signup: `https://models.bytefuture.ai/signup`). **Do not link `tokens.bytefuture.ai`** — that host now redirects to the ByteFuture home.
  - Olares → `https://github.com/beclab/olares`

#### Logo (use this exact mark everywhere)

Inline SVG used in nav (30×30) and footer (22×22):

```html
<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-label="ByteFuture logo" role="img">
  <rect x="2.5" y="2.5" width="27" height="27" rx="8" fill="#2563EB" fill-opacity="0.10" stroke="#2563EB" stroke-width="1.6"/>
  <circle cx="12" cy="16" r="3.4" fill="#2563EB"/>
  <circle cx="21.5" cy="16" r="3.4" fill="none" stroke="#0D9488" stroke-width="1.8"/>
  <path d="M15.4 16h2.7" stroke="#0D9488" stroke-width="1.8" stroke-linecap="round"/>
</svg>
```

Favicon (same mark, in `<head>`):

```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='2.5' y='2.5' width='27' height='27' rx='8' fill='%232563EB' fill-opacity='0.10' stroke='%232563EB' stroke-width='1.6'/><circle cx='12' cy='16' r='3.4' fill='%232563EB'/><circle cx='21.5' cy='16' r='3.4' fill='none' stroke='%230D9488' stroke-width='1.8'/><path d='M15.4 16h2.7' stroke='%230D9488' stroke-width='1.8' stroke-linecap='round'/></svg>" />
```

### Design system

| Token | Value |
|---|---|
| Background | `#faf9f5` |
| Surface / cards | `#ffffff`, border `#e4e4e7`, radius `12–14px` |
| Ink / muted | `#18181b` / `#71717a`, secondary `#52525b` |
| Accent blue / teal | `#2563EB` / `#0D9488` (purple `#7C3AED` for gradients) |
| Headings | `Space Grotesk` |
| Article body | `Source Serif 4` (serif — articles are for reading) |
| Nav / UI | `DM Sans` |
| Code / labels | `JetBrains Mono` |

Article prose uses the `.prose` styles in `src/layouts/WritingLayout.astro` (h2/h3, blockquote, `pre`/`code` with copy button, tables, figures). Don't reinvent them.

**List markers — keep `list-style: revert`.** Every page loads Tailwind via CDN, whose Preflight reset sets `ul, ol { list-style: none }`, which kills the bullets/numbers in article lists. The `.prose ul, .prose ol` rule counteracts this with `list-style: revert` (reverts to the browser default: `disc` for `<ul>`, `decimal` for `<ol>`). **Never drop that declaration** when copying or editing `.prose` CSS, and confirm any new page's `.prose ul, .prose ol` rule still carries it — without it, `<li>` bullets silently disappear even though indentation looks correct. To verify, the computed `list-style-type` on a `.prose li` must be `disc`/`decimal`, not `none`.

### Writing style: no "AI voice" (required, site-wide)

Applies to everything reader-facing on the whole site, the home page included: article bodies, titles, page copy, `posts.json` summaries, meta descriptions, figure captions, and text baked into cover images. It does not apply to code blocks, config snippets, or HTML comments (the `───` box-drawing rulers are layout, not prose).

- **No em-dashes (`—`).** They are the single loudest AI tell. Rewrite with a period, comma, colon, or parentheses. Hyphens in compound words and en-dashes in ranges (2024-2026) are fine. One exception: the mandated `— ByteFuture Writings` / `Writings — ByteFuture` title suffixes are brand chrome, defined under Branding; keep those.
- **No stock AI phrases.** Banned outright: delve, landscape (metaphorical), game-changer, revolutionize, unleash, harness the power, seamlessly, effortlessly, elevate, supercharge, "in today's fast-paced world", "let's dive in", "buckle up", "it's worth noting", "it's important to note", "at the end of the day".
- **Go easy on the reversal pattern.** "It isn't just X. It's Y." and "not X, but Y" read as TED-talk filler when repeated. At most one per article, and only when the contrast is the actual point.
- **No rhetorical-question scaffolding.** Don't open sections with "So what does this mean for you?". Just say the thing.
- **No hollow intensifiers.** truly, incredibly, remarkably, deeply, "powerful" as a bare adjective. Use a number, a name, or a concrete consequence instead.
- **Specifics beat adjectives.** "80.3% on SWE-bench Pro" earns its place; "impressive benchmark results" does not. If a sentence could appear unchanged in any tech blog about any product, cut it or sharpen it.
- Short declarative sentences are the default. Vary length for rhythm, not to pad.

When editing an existing article for any reason, fix style violations you touch. A dedicated sweep should rewrite each em-dash by hand; a blind find-and-replace produces broken sentences.

**Images.** The rule covers text in images ByteFuture generates: cover images, charts, diagrams. Two kinds of article images are exempt as factual captures: screenshots (terminal output, product UI) and third-party figures reproduced with attribution (e.g. Artificial Analysis charts).

**HARD RULE — every cover image ships pre-rendered, with its text burnt in.** A cover is a flat PNG committed to `blog/`. The words are pixels in that file. Nothing about a cover is assembled when a reader loads the page, when a card is drawn, or when a link preview is fetched.

That forbids, without limitation:

- Rendering a cover from a template at request time, or from a shared template that takes a slug/params and produces the image on the fly.
- Shipping the SVG itself as the cover, or any live HTML or canvas standing in for one, and text layered over a background image with CSS or JS at view time. SVG is the authoring source; the reader only ever gets the rasterized PNG.
- Any generated-at-view-time OG image (`/og/<slug>.png` handlers, on-demand image services, third-party card generators).
- Fonts, colours, or copy resolved at view time. A cover must look identical with no network, no fonts available, and no JS.

The listing cards and `og:image` therefore point at a committed PNG and nothing else. The single output artifact is the PNG; anything used to produce it is authoring-time only and never reaches a reader.

**Generate the PNG from an SVG.** Every generated image has exactly one source, an **SVG** in `blog/asset-sources/` named after the output PNG (`<name>.svg` → `blog/<name>.png`). Rasterize it once with headless Chrome, which burns the text into the pixels:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 \
  --window-size=1200,630 \
  --screenshot=blog/<name>.png "file://$PWD/blog/asset-sources/<name>.svg"
```

Match `--window-size` to the SVG's `width`/`height`: covers are 1200×630, charts vary. Commit the PNG; it is what the site serves.

Authoring an SVG cover:

- Set `width`, `height`, and a matching `viewBox` on the root `<svg>`, and give it `xmlns="http://www.w3.org/2000/svg"`.
- Text is native `<text>`, never `<foreignObject>` with HTML inside. SVG does not wrap text, so **each line is its own `<text>` with an explicit `y`** — there is no automatic line breaking to lean on.
- Style with a `<style>` block and classes. Brand fonts come from the Google Fonts `@import`; inside SVG the `&` in that URL must be written `&amp;`.
- `letter-spacing` in SVG is a length, so use px (`-2.8px`), not the em values CSS uses.
- Colours, the dot grid, washes, chips, and the ByteFuture mark are drawn with ordinary SVG shapes and gradients.

Rendering needs network access the first time so the webfonts resolve; check the PNG after rendering rather than trusting the SVG preview. To make a source fully self-contained, convert its text to paths — the PNG is identical either way, since the text is burnt in regardless.

To change an image's text, edit its SVG and re-render; keep the source and the PNG in the same commit. Re-rendering is a manual step an author runs, never part of `npm run build` — the build copies the finished PNG and nothing more. `blog/asset-sources/` is not an article directory and holds no published pages.

**Legacy HTML sources.** The cover sources in `blog/asset-sources/` are currently `.html` rendered the same way, sharing `_cover.css` for the common frame. They are legacy and are to be migrated to SVG. Until a given cover is migrated, edit and re-render it as it stands; do not add new `.html` sources.

### Publishing a new article

1. **Create the Markdown file(s):** `src/content/writings/<lang>/<slug>.md`. `<slug>` is lowercase-kebab-case and is the **single source of truth** (the filename minus `.md`, the frontmatter `slug`, and the built `/blog/<slug>[-lang].html` all share it). English lives in `en/`; each translation is the **same slug** in `zh/` `ja/` `ko/`.
2. **Fill the frontmatter** (validated by `src/content.config.ts`): `slug`, `lang`, `title`, `summary`, `category` (closed set, see below), `date` (`YYYY-MM-DD`), optional `cover` (root-relative, e.g. `blog/<file>.png`) and `cta`. Then write the article body below it. **No page chrome goes in the body** — `WritingLayout` supplies the `<title>`/OG tags, canonical, hreflang, nav, footer, GA tag, view counter, and the share row automatically. Do not paste a share row, GA snippet, or counter into the Markdown.
3. **The listing updates itself:** `/posts.json` (+ per-language manifests) is generated from the frontmatter at build, so there is no `posts.json` to hand-edit and no 1:1 file/registry sync to maintain. Category/title/summary/date on the card come straight from the frontmatter.
4. **Cover image (optional):** drop the file in `blog/` and set `cover: blog/<file>.png` in the frontmatter. It becomes the listing card thumbnail **and** the article's `og:image`, so make it 1200×630.
5. **Mobile check:** verify the built article at ~375px per the **Mobile optimization** rule — wide tables/code/images must scroll inside their box, never the page.
6. **Sitemap:** `sitemap.xml` is hand-maintained (no Astro sitemap integration) — add a `<url>` for each language URL (English `priority` 0.7, translations 0.6), `lastmod` = publish date.
7. **Build & ship:** `npm run build`; a push to `main` deploys via GitHub Actions.

Publish an article in **all four languages together** (create the four Markdown files with the same slug; add all four sitemap URLs). A slug with no translations yet stays English-only; the language selector still works and simply has no target for the missing languages, so ship the set together.

### Frontmatter / manifest schema (the listing contract)

`/posts*.json` is generated from each article's frontmatter, so these are the **frontmatter** fields (validated by `src/content.config.ts`) and also the shape of each manifest entry:

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | ✅ | Equals the `<slug>.md` filename and the built `/blog/<slug>[-lang].html`. |
| `title` | string | ✅ | Card + featured heading. |
| `summary` | string | ✅ | 1–2 sentences; shown on the card. |
| `category` | string | ✅ | One of `engineering`, `product`, `research`, `tutorial`. |
| `date` | string | ✅ | `YYYY-MM-DD`. Sorting + display derive from this. |
| `cover` | string | optional | Repo-root-relative, e.g. `blog/foo.png`. Drives the listing card **and** `og:image`. 1200×630. Omit for an auto gradient card and a text-only link preview. |

Rules:

- **Categories are a closed set** (`engineering`, `product`, `research`, `tutorial`) and it's the `category` frontmatter field. This still binds under Astro: the value must match, in each `blog/index*.html` listing, the filter pills (`#cat-filter` `data-cat`), the `validCats` map, **and** the `CAT_LABELS` table (all four languages) in its posts engine. On top of that, `WritingLayout.astro` prints the raw `category` string in the article header and uses it as the Topics-link label + `?cat=` param — so an off-list value leaks as untranslated literal text (e.g. `model-launches`), can't be filtered, and its Topics link dead-ends to **All**. To add a genuinely new category, update the pills + `validCats` + `CAT_LABELS` (×4 langs) in every `index*.html`; otherwise pick one of the four.
- **The hero is automatic: the newest post by `date` always leads.** On the **All** tab the most recent post renders in the hero and is pulled out of the grid; the rest follow newest-first. There is no manual `featured` flag (the engine ignores it) — to put an article on top, give it the latest `date`.
- Dates are real publish dates; newest sorts first.

### Article ↔ listing consistency (automatic under Astro)

`/posts.json` is **generated from the article frontmatter**, so there is no separate registry to keep in 1:1 sync and no hand-maintained `posts.json` — an article's card and its page read the **same** file. What still matters:

- **Frontmatter is the card.** `title`, `summary`, `category`, and `date` on the listing/home card come straight from the article's frontmatter. Keep them truthful to what the body actually says: when you change an article's title, framing, or key claims (e.g. renaming a "benchmark" to a "mini benchmark", adding a major offer or result), edit the frontmatter in the **same change**. A card that promises something the body no longer says is the violation to avoid.
- **`slug` is the join key.** It equals the filename minus `.md` and is identical across the four language files. One slug per article.
- **No drafts in production.** Set `draft: true` to keep a file out of the build/listing; don't ship half-written frontmatter.
- A `cover` referenced in frontmatter (`cover: blog/<file>.png`) must exist in `blog/`.

`npm run check:legacy-links` guards that every already-published `/blog/*.html` URL still exists in the build.

### Linking & engine invariants

- **Use root-absolute paths in the pages.** Articles `/blog/<slug>.html`, data `/posts.json`, covers `/blog/...`. (The listing prefixes `cover` with `/` automatically, so keep `posts.json` covers root-relative like `blog/foo.png`.)
- **Deep link:** `/blog/?cat=<category>` opens the listing with that filter active. In-article "Topics" links use this form.
- **Do not rename** the listing's element IDs (`#cat-filter`, `#featured-section`, `#posts-grid`, `#load-more-wrap`, `#load-more-btn`) or the `.post-card` / `.featured-card` / `.cat-pill` / `.post-tag` classes — the posts engine depends on them.
- All dynamic text rendered into the DOM is passed through the `esc()` helper. Keep it that way (XSS safety on titles/summaries).

### SEO / meta

- `canonical` and `og:url`: `https://bytefuture.ai/blog/<slug>.html`.
- `og:image`: emitted by `WritingLayout` from the `cover` frontmatter, as an **absolute** `https://bytefuture.ai/...` URL, with `og:image:width` 1200 / `og:image:height` 630 and `og:image:alt` set to the title. It points at the committed PNG in `blog/`, never at a generated-on-demand image — see the hard rule under **Images**. All four language versions share the one English-language cover. An article with no `cover` emits no `og:image`, and its `twitter:card` drops from `summary_large_image` to `summary`.
- Listing canonical: `https://bytefuture.ai/blog/`.

### View counter (every article)

Every article page shows a public view counter in the header meta row, next to the date. It is served by **GoatCounter** (site code `bytefuture`; dashboard at `https://bytefuture.goatcounter.com`) — a hosted service, no database or backend of ours.

The template ships all the pieces; **keep them in every article**:

1. `<span id="view-count">` in the header meta row (styled like the `<time>` next to it). It starts empty and is filled by JS.
2. The `VIEW COUNTER` block just before `</body>`, which contains **two** scripts:
   - the GoatCounter tracker (counts the visit), verbatim:
     ```html
     <script data-goatcounter="https://bytefuture.goatcounter.com/count"
             async src="//gc.zgo.at/count.js"></script>
     ```
   - a small inline script that fetches `https://bytefuture.goatcounter.com/counter/<pathname>.json` and renders `N views` into the span (GoatCounter formats thousands with thin spaces; the script converts them to commas).

Invariants:

- **The page path is the counter key** (`location.pathname`, e.g. `/blog/foo.html`) — no per-article editing, which is why new articles get a working counter just by copying the template. Renaming an article's file starts its count over.
- **Dev-safe by default:** `count.js` does not record visits from `localhost` or `file://` (GoatCounter's default), and the display endpoint is read-only — local reloads never inflate counts.
- **The GoatCounter setting _"Allow using the visitor counter"_ must stay enabled** (GoatCounter → Settings). If it's turned off, the JSON endpoint returns 403 and the number silently disappears from every page — the site still works, but the counters show nothing.
- **Failure is silent.** If the API is down, blocked, or the path has no views yet, the span just stays empty. Never let the counter block rendering or show an error. (GoatCounter returns a 404 with a `{"count":"0"}` body for never-visited paths; the script checks `r.ok` before parsing so that body never renders as "0 views".)
- **Your own visits don't count.** GoatCounter ignores pageviews from any browser logged into the dashboard, headless/automated browsers, and ad-blocked sessions. A new article showing no count for a while is normal; judge traffic from the dashboard, not by refreshing your own page.
- **The GA4 HARD RULE applies unchanged** — the GoatCounter snippets are additive and must never replace, move, or modify the GA tag. And being analytics themselves, the GoatCounter snippets get the same protection: don't remove or "clean up" either script.
- To switch providers later, change the two scripts in the `VIEW COUNTER` block on each page; keep the same span, path-as-key scheme, and silent-failure behavior.
- Known trade-offs (accepted): counts start from the day GoatCounter was installed, and ad blockers may block counting and/or display.

### Analytics

Every page under `blog/` **must** keep the GA4 tag in `<head>`, verbatim:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-KQ0EX9QGK6"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-KQ0EX9QGK6');
</script>
```

Never remove, comment out, "clean up", or refactor this snippet or the `gtag('event', …)` calls (`blog_click`, `blog_filter`, `blog_load_more`, `scroll`, `cta_click`). This is the **HARD RULE above** applied to the blog — it overrides any dead-code/linting instinct. If tracking looks broken or unused, **leave it and surface it to the user** — don't change it.
