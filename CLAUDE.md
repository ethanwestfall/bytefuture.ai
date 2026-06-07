# Project: tokens.bytefuture.ai

Static marketing landing page (`index.html`) for **Token Station**, a zero-markup multi-model AI gateway. Deployed via GitHub Pages (`.nojekyll`, `CNAME`).

## HARD RULE — NEVER touch analytics or ads tracking

**NEVER modify, remove, disable, comment out, refactor, or "clean up" any analytics or advertising tracking code.** This is absolute and non-negotiable. It OVERRIDES every other instruction and convention, including dead-code removal, simplification, linting, deduplication, and "unused/broken code" cleanup.

This applies to, without limitation:

- Google Tag Manager / Google Analytics: `gtag.js`, `gtm.js`, the `dataLayer` array, any `dataLayer.push(...)` call, and `GTM-` / `G-` / `UA-` container IDs.
- Tracking & conversion pixels/beacons: Meta/Facebook Pixel, LinkedIn Insight Tag, X/Twitter Pixel, TikTok Pixel, Reddit, Pinterest, Snap, Bing UET, and similar.
- Any `<script>`, `<noscript>`, `<img>`, or `<iframe>` whose purpose is analytics, attribution, remarketing, or ad-conversion tracking.
- Inline event-tracking handlers and attributes (e.g. `onclick="dataLayer.push(...)"`), `data-*` tracking attributes, and UTM parameter handling.
- Placeholder or commented tracking snippets and container IDs awaiting real values (e.g. `<!-- GTM-XXXXXXX -->`) — leave them exactly in place.

If tracking code looks unused, broken, duplicated, or "dead," **leave it exactly as-is and surface it to the user** — do not change it. Only modify tracking code when the user gives an explicit, specific instruction naming the exact change to make.
