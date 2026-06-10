# Project: bytefuture.ai

Static site for **ByteFuture**, served from GitHub Pages (`.nojekyll`, `CNAME` → `bytefuture.ai`). ByteFuture builds infrastructure for **hybrid AI inference for AI agents**. Its products — referenced on the site, but not the site's brand — are **Olares OS** (on-device OS for AI PCs, `github.com/beclab/olares`) and **Token Station** (cloud inference gateway, `models.bytefuture.ai`).

Layout:

- `index.html` — ByteFuture home: company intro, the hybrid-inference thesis, the two products, and a "Writings" teaser.
- `blog/` — the **Writings** section (listing + articles). Rules below.
- `posts.json` — content manifest for Writings (repo root; the site fetches it at `/posts.json`).
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

## Writings section (`blog/`)

The `blog/` folder is the **ByteFuture Writings** section. It contains:

- `blog/index.html` — the Writings listing (post index, filters, featured card).
- `blog/post-template.html` — the starting point for every new article. **Never publish this file itself**; copy it.
- `blog/<slug>.html` — one file per published article.
- cover images and article assets, also under `blog/`.

The post index is driven by `posts.json` (repo root); `blog/index.html` fetches it at `/posts.json` and renders the cards. The **HARD RULE above applies to every page under `blog/`.**

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

Article prose uses the `.prose` styles already in `blog/post-template.html` (h2/h3, blockquote, `pre`/`code`, tables, figures). Don't reinvent them.

### Publishing a new article

1. **Copy the template:** `cp blog/post-template.html blog/<slug>.html`.
   `<slug>` is lowercase-kebab-case and is the **single source of truth**: it must equal the filename (minus `.html`) **and** the `slug` in `posts.json`.
2. **Fill every `▼ EDIT ▼` marker** in `blog/<slug>.html`:
   - `<title>` + `og:title` (keep the `— ByteFuture Writings` suffix).
   - `meta[name=description]` + `og:description`.
   - `canonical` + `og:url` → replace `POST_SLUG` with the real slug.
   - Header category pill text + `<time>`.
   - `<h1>` title and the article body.
3. **Leave the nav, footer, favicon, and the GA `<script>` exactly as the template ships them.**
4. **Register it in `posts.json`** (see schema below). The article will not appear in the listing until it's there.
5. **Cover image (optional):** drop the file in `blog/` and set `"cover": "blog/<file>"` in `posts.json` (root-relative — see Linking).
6. **Mobile check:** verify the article at ~375px width per the **Mobile optimization** rule — wide tables/code/images must scroll inside their box, never the page.

> Keep `posts.json` and the article files in strict 1:1 sync — see **[Keep `posts.json` and articles in sync](#keep-postsjson-and-articles-in-sync-required)** below. Never register a post whose file doesn't exist, and never publish a file you haven't registered.

### `posts.json` schema (the listing contract)

Root-level `posts.json` is a JSON array. Each object:

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | ✅ | Matches the `blog/<slug>.html` filename exactly. |
| `title` | string | ✅ | Card + featured heading. |
| `summary` | string | ✅ | 1–2 sentences; shown on the card. |
| `category` | string | ✅ | One of `engineering`, `product`, `research`, `tutorial`. |
| `date` | string | ✅ | `YYYY-MM-DD`. Sorting + display derive from this. |
| `cover` | string | optional | Repo-root-relative, e.g. `blog/foo.png`. Omit for an auto gradient cover. |
| `featured` | boolean | optional | **At most one** post may be `true`. |

Rules:

- **Categories are a closed set.** They must match the filter pills in `blog/index.html` (`#cat-filter` `data-cat`) **and** the `validCats` map in its posts engine. To add a category, update all three.
- **Exactly one `featured: true`** (or none). The featured post renders in the hero on the **All** tab and is pulled out of the grid.
- Dates are real publish dates; newest sorts first.

### Keep `posts.json` and articles in sync (required)

`posts.json` and the article files in `blog/` must stay in **strict 1:1 correspondence**. This is what keeps the listing free of dead links and keeps every published article discoverable.

- **Every** `posts.json` entry MUST have a matching `blog/<slug>.html` file, and **every** article file MUST have a matching `posts.json` entry. `blog/index.html` and `blog/post-template.html` are infrastructure, **not** articles — never list them.
- `slug` is the join key: it equals the filename minus `.html`. Exactly one entry per slug, one file per slug.
- **Add together, remove together.** Never publish an article without registering it, and never register an entry whose file doesn't exist — no "draft" or "coming soon" placeholders in `posts.json`. An entry with no file 404s from the listing and can even land in the featured hero.
- **Metadata must stay in sync with the article content, not just the filename.** The entry's `title`, `summary`, `category`, and `date` must accurately reflect what the article currently says — the cards on the listing and home page are built from `posts.json`, not from the article. Whenever you edit an article in a way that changes its title, framing, key claims, or terminology (e.g. renaming a "benchmark" to a "mini benchmark", adding a major offer or result), update the `posts.json` entry in the **same change**. A card that promises something the article no longer says is a sync violation just like a missing file.
- A cover referenced by an entry (`"cover": "blog/<file>"`) must exist in `blog/`.

**Verify before every commit** — run from the repo root; this should print only `in sync`:

```sh
# slugs registered in posts.json
jq -r '.[].slug' posts.json | sort > /tmp/ts_entries
# article files on disk (excluding the listing + template)
ls blog/*.html | sed 's#blog/##; s#\.html$##' | grep -vxE 'index|post-template' | sort > /tmp/ts_files
diff /tmp/ts_entries /tmp/ts_files && echo "in sync"
```

A line only in `ts_entries` = registered but missing its file (broken link). A line only in `ts_files` = published but unregistered (invisible). Both are violations — fix one side until `diff` is clean.

The script only verifies slug ↔ file existence. The **metadata-content sync** (title/summary/category/date matching what the article actually says) can't be checked mechanically — when an article changes, re-read its `posts.json` entry and confirm it still describes the article truthfully.

### Linking & engine invariants

- **Use root-absolute paths in the pages.** Articles `/blog/<slug>.html`, data `/posts.json`, covers `/blog/...`. (The listing prefixes `cover` with `/` automatically, so keep `posts.json` covers root-relative like `blog/foo.png`.)
- **Deep link:** `/blog/?cat=<category>` opens the listing with that filter active. In-article "Topics" links use this form.
- **Do not rename** the listing's element IDs (`#cat-filter`, `#featured-section`, `#posts-grid`, `#load-more-wrap`, `#load-more-btn`) or the `.post-card` / `.featured-card` / `.cat-pill` / `.post-tag` classes — the posts engine depends on them.
- All dynamic text rendered into the DOM is passed through the `esc()` helper. Keep it that way (XSS safety on titles/summaries).

### SEO / meta

- `canonical` and `og:url`: `https://bytefuture.ai/blog/<slug>.html`.
- `og:image`: an **absolute** `https://bytefuture.ai/...` URL.
- Listing canonical: `https://bytefuture.ai/blog/`.

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
