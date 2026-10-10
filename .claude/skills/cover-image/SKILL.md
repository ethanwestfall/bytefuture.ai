---
name: cover-image
description: Create and maintain branded cover images for articles as pre-rendered PNGs with the text burnt in, authored as standalone SVG sources and rasterised with headless Chrome. Covers authoring an SVG cover and the traps that make SVG differ from HTML, rendering, verifying a re-render pixel by pixel against the image that shipped, migrating existing HTML cover sources to SVG, and wiring a cover into a site's listing cards and og:image. Use when asked to add or change an article cover or social card, when a cover's text or price is out of date, when link previews show no image, or when cover sources need to move off HTML.
---

# Cover Image

A cover is the image that represents an article: the thumbnail on a listing
page and the picture in a link preview on X, LinkedIn, or Slack. This skill
covers producing them as flat PNGs from SVG sources, and proving a change
did not break the ones already published.

The default posture is conservative. Covers are published artefacts; a
re-render that shifts a baseline by two pixels is a regression even though
nobody asked for it. Always diff a re-rendered cover against the one that
shipped before committing, and read the numbers rather than trusting your
eye.

Three helper scripts live in `scripts/` next to this file:

- `./scripts/render_cover.sh <source.svg> <out.png>` rasterises a source.
  It finds Chrome or Chromium, takes the canvas size from the SVG's own
  `width`/`height`, and fails loudly if the output is not that size.
- `node scripts/compare_png.mjs stats|mask|stack <old.png> <new.png> [out.png]`
  compares two PNGs. `stats` prints how many pixels changed and exits
  non-zero on a real change; `mask` writes an image with changed pixels in
  red over a faded original; `stack` writes a before/after sheet. No
  dependencies.
- `node scripts/html_to_svg.mjs <in.html|dir> <out.svg|dir>` converts
  legacy HTML cover sources to SVG by measuring the real layout in headless
  Chrome. Needs `puppeteer-core` (`npm install puppeteer-core` in a scratch
  directory). A migration aid, not a build step.

## The rule: pre-rendered, text burnt in

**A cover ships as a flat PNG committed to the repository. The words are
pixels in that file.** Nothing about a cover is assembled when a reader
loads the page, when a card is drawn, or when a link preview is fetched.

This forbids, without limitation:

- Rendering a cover from a template at request time, or from a shared
  template that takes a slug or parameters and produces the image on the fly.
- Shipping the SVG itself as the cover, or any live HTML or canvas standing
  in for one, and text layered over a background image with CSS or JS at
  view time.
- Generated-at-view-time OG images: `/og/<slug>.png` handlers, on-demand
  image services, third-party card generators.
- Anything resolved at view time, including fonts and copy. A cover must
  look identical with no network, no fonts available, and no JavaScript.

The reason is that the consumers are not browsers you control. Link
preview crawlers fetch one URL, follow no redirects you did not plan, run
no JavaScript, and cache the result for a long time. An image that needs
anything at fetch time is an image that will sometimes be missing, and you
will not find out.

Rendering is a manual step an author runs, never part of the site build.
The build copies the finished PNG and nothing more.

## Authoring an SVG cover

One source per output image, named after it: `<name>.svg` produces
`<name>.png`. Covers are 1200×630, the Open Graph card size, which also
crops well to the 1.91:1 that most platforms use.

Each source is standalone: no shared stylesheet, no include, no parameters.
Everything the image needs is in the one file. Repeating the frame across
files is deliberate, and buys three things: the words in a cover are
readable in the diff of the file named after its PNG, re-rendering one
cover cannot disturb another, and a source opens in a browser on its own.
Factoring the common parts into a shared stylesheet trades all three away
for a saving that does not matter at this scale.

Skeleton:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <title>my-article-cover</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&amp;display=swap');
  </style>
  <defs>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="14" r="1.2" fill="rgb(24,24,27)" fill-opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#faf9f5"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <text x="72" y="178" font-family="'Space Grotesk', sans-serif" font-size="80"
        font-weight="700" letter-spacing="-2.8px" fill="rgb(24,24,27)">First line</text>
  <text x="72" y="260" font-family="'Space Grotesk', sans-serif" font-size="80"
        font-weight="700" letter-spacing="-2.8px" fill="rgb(24,24,27)">Second line</text>
</svg>
```

### The traps

These are the differences between SVG and HTML that cost real render cycles.
Each one produces a plausible-looking image that is quietly wrong.

1. **`letter-spacing` needs units.** Chrome parses the presentation
   attribute as CSS, where a unitless non-zero length is invalid, so the
   whole declaration is dropped and the text renders wider than intended.
   Write `letter-spacing="-2.8px"`, never `letter-spacing="-2.8"`. This is
   silent: no warning, no error, just wrong metrics that grow along the line.

2. **SVG does not wrap text.** There is no automatic line breaking to lean
   on. Every visual line is its own `<text>` with an explicit `y`. If you
   are converting from HTML, a single wrapped paragraph becomes several
   `<text>` elements, and emitting it as one stacks the lines on top of
   each other.

3. **`y` is the baseline, not the top.** An HTML box is positioned by its
   top edge; SVG text sits on its baseline. Converting a top coordinate
   means adding the font's ascent, which is a font metric, not a fraction
   of the font size you can guess.

4. **A transform applies to the whole subtree.** If a card is rotated, its
   text rotates about the *card's* centre, not each run's own. Give every
   element in the group the same `transform="rotate(deg cx cy)"`, or wrap
   them in one `<g>`.

5. **CSS borders sit inside the box; SVG strokes straddle the path.** A
   1.5px border on a 200×56 box covers 200×56. The equivalent stroked rect
   is inset by half the stroke width and 1.5 narrower in each dimension.

6. **Boxes do not size themselves to text.** HTML pills grow with their
   label. In SVG you set the rect width yourself, so changing a chip's text
   means re-measuring it. This is the main reason converting by hand goes
   wrong, and the reason `html_to_svg.mjs` measures rather than guesses.

7. **Nested `<svg>` keeps its own presentation attributes.** Pasting an
   inline SVG in without its root `fill="none"` makes every path inherit a
   black fill, and open curves render as filled blobs.

Fonts referenced by `@import` resolve over the network on the first render,
so the machine doing the rendering needs access. To make a source fully
self-contained, convert its text to paths; the PNG is identical either way,
since the text is burnt in regardless.

## Rendering

```sh
./scripts/render_cover.sh blog/asset-sources/my-article-cover.svg blog/my-article-cover.png
```

Or directly, if you want to see what the script does:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --virtual-time-budget=6000 --window-size=1200,630 \
  --screenshot=blog/my-article-cover.png "file://$PWD/blog/asset-sources/my-article-cover.svg"
```

Always look at the PNG afterwards rather than trusting the SVG preview in
an editor, which uses different font fallbacks. Keep the source and the PNG
in the same commit; a PNG whose source no longer produces it is worse than
no source at all.

## Verifying a change

When you re-render a cover that already shipped, prove the change is what
you intended:

```sh
./scripts/render_cover.sh blog/asset-sources/my-cover.svg /tmp/new.png
node scripts/compare_png.mjs stats blog/my-cover.png /tmp/new.png
```

Reading the output:

- `changed>8` counts pixels that moved at all. Antialiasing lives here.
  Under about 1% is normal even for an identical render on a different
  machine.
- `changed>64` counts pixels that changed visibly. **This is the number
  that matters.** For a re-render that should be identical, expect 0.00%.
  Sub-pixel rasterisation of rotated text can reach ~0.15%. Anything past
  half a percent is a layout or colour change, and `stats` exits non-zero.
- `max delta` at 255 means something appeared or vanished outright.

When the numbers are worse than expected, do not squint at the two images.
Get the mask:

```sh
node scripts/compare_png.mjs mask blog/my-cover.png /tmp/new.png /tmp/mask.png
```

Red pixels are the changed ones over a faded original, which localises the
problem immediately. Doubled text drifting wider along a line is trap 1.
Two lines on one baseline is trap 2. A whole block offset vertically is
trap 3. Text correct at the left and increasingly wrong to the right,
inside a tilted card, is trap 4.

For showing a human a before and after, `stack` writes both into one image:

```sh
node scripts/compare_png.mjs stack blog/my-cover.png /tmp/new.png /tmp/sheet.png
```

## Migrating HTML cover sources to SVG

Do not retype the artwork. HTML sizes boxes from their content, so the
coordinates you need do not appear anywhere in the source, and hand
conversion drifts. Measure the real layout instead:

```sh
npm install puppeteer-core                       # in a scratch directory
node scripts/html_to_svg.mjs blog/asset-sources blog/asset-sources
```

Then, for every converted cover, render it and diff against the PNG that
shipped. Expect 0.00% on `changed>64` for flat artwork, and up to ~0.15%
where a rotated element is involved. Investigate anything higher before
committing; every trap listed above was found this way, not by looking.

Two things to watch during a migration:

- **Convert the source in place**, with any stylesheet it links still
  beside it. An HTML source that depends on a sibling `.css` renders
  unstyled when copied elsewhere, and the body collapses to the viewport
  size. `render_cover.sh` catches this by checking the output dimensions,
  but the converted SVG will be silently wrong if you skip that check.
- **The PNG on the branch may not match its own source.** Render the HTML
  and diff that against the committed PNG before you start. If they
  already differ, the artwork drifted from its source at some point, and
  you are reconciling two things rather than one.

Delete the HTML source and any shared stylesheet only once its SVG
reproduces the shipped PNG. Charts and one-off diagrams can be migrated the
same way, but they are lower value: they change rarely and their text is
usually axis labels.

## Wiring a cover into a site

Two consumers, and they are easy to confuse:

- **The listing card.** Usually a manifest field (`cover: blog/foo.png`)
  read by the index page. This is the only consumer many sites have.
- **`og:image`.** A separate `<meta>` tag. If the page does not emit it, a
  shared link gets a text-only preview no matter how good the cover is.
  Check with `curl -s <url> | grep og:image` rather than assuming.

An image in the article body is neither. A `![](...)` in the body renders
inside the article only; it does not populate the card and is not the link
preview. If an article's cover is currently a screenshot doing double duty,
that is a sign the two roles were never separated.

When adding `og:image`, emit the absolute URL, plus `og:image:width`,
`og:image:height`, and `og:image:alt`, and set `twitter:card` to
`summary_large_image` when a cover exists and `summary` when it does not.
Translations share the one image unless the cover has text that needs
translating, in which case it needs its own render per language.

## What to check before calling it done

- The PNG is committed, is the size you expect, and the source that
  produces it is in the same commit.
- A fresh render of the source reproduces the committed PNG.
- Text baked into the image says the same thing as the article. A price or
  model name in a cover is a claim, and it goes stale the same way body
  text does. Verify each against the article body, not from memory.
- The cover is wired to both consumers, and `og:image` is actually in the
  built HTML.
- Copy in the image does not repeat itself. A headline and a badge saying
  the same thing in different words is the most common cover defect, and it
  is invisible until you read the image as text.
