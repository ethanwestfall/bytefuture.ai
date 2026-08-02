---
slug: "wan-2-7-image-pro-token-station"
lang: "en"
title: "Generate and edit images with Wan 2.7 Image Pro on Token Station"
summary: "Wan 2.7 Image Pro is Alibaba's professional image model: one API for text-to-image and prompt-guided editing, up to 4K output, nine reference images, and text rendering in a dozen languages. It's live on Token Station as qwen/wan-2.7-image-pro."
category: "tutorial"
date: "2026-07-31"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/wan-2-7-image-pro-token-station-cover.png"
draft: false
---

Wan 2.7 Image Pro is the professional tier of Alibaba's Wanxiang (Wan) image family, released in April 2026 as the upgrade to Wan 2.7 Image. It handles text-to-image generation and prompt-guided editing through the same endpoint, and it's live on Token Station today as `qwen/wan-2.7-image-pro`.

## What the model does

- **Text-to-image at up to 4096x4096.** Full 4K output for prompts that need it; 1024x1024 is the default for anything smaller, like a blog thumbnail or a social post.
- **Prompt-guided editing at up to 2048x2048.** Send an existing image and a new instruction; the model edits it in place.
- **Bounding-box editing for precise regions.** Add a `bbox_list` array (up to two boxes per image, as absolute pixel coordinates) to point at exactly where an edit should happen instead of relying on the model to find the right region from the prompt alone.
- **Up to nine reference images.** Editing and multi-image generation calls can pull from several inputs at once, useful for keeping a character or a product consistent across a set.
- **Text rendering in about a dozen languages.** Signs, labels, tables, and simple formulas render with real accuracy, not the garbled text older image models are known for.
- **Batch generation.** Up to four images per request at the same per-image cost.
- **An optional reasoning pass.** Wan 2.7 Image Pro can run a "thinking" step before rendering: it works out spatial relationships, composition, and how multiple elements interact before committing to pixels. It helps most on prompts with several interacting subjects or a specific layout, and it adds latency, so treat it as a setting to reach for on complex prompts rather than the default for everything.

## What it doesn't do

- **No pixel-mask inpainting.** You describe the change in a prompt, optionally aimed at a bounding box; you don't paint a mask over the exact pixels to replace.
- **Character consistency isn't guaranteed across separate generations.** Multi-image reference calls help within one request; two independent calls with the same prompt can still drift.
- **Complex multi-section infographics are a weaker fit.** For dense layouts with many labeled panels, a model built specifically for that use case will do better.

## Generate an image

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{ "model": "qwen/wan-2.7-image-pro", "prompt": "A childrens book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter." }'
```

`$YOUR_API_KEY` is your Token Station key, from the [dashboard](https://models.bytefuture.ai/dashboard).

## Edit an existing image

Add an `image_url` array with one or more source images and describe the change in `prompt`:

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{"model": "qwen/wan-2.7-image-pro", "prompt": "Put a trophy in his hand", "image_url": ["https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg"]}'
```

The same endpoint handles both calls. What changes is whether `image_url` is present, not the route or the model ID.

## Parameters

| Field | Notes |
|---|---|
| `model` | `qwen/wan-2.7-image-pro` |
| `prompt` | Required. The generation or edit instruction. |
| `image_url` | Optional array of source image URLs. Omit for text-to-image; include for editing. Up to nine images per call. |
| `bbox_list` | Optional, editing only. One list of up to two `[x1, y1, x2, y2]` pixel boxes per input image, to target where the edit applies. |

## Resolution and output

| Mode | Max resolution | Batch |
|---|---|---|
| Text-to-image | 4096x4096 | Up to 4 images per request |
| Editing | 2048x2048 | Up to 4 images per request |

4K is real output, not upscaling, but it's wasted on anything smaller than a large print or a hero banner. Default to 1024x1024 for web and social use and reserve the higher resolutions for assets that will actually be viewed at that size.

## Pricing

Token Station passes provider pricing straight through with no markup. Check the [dashboard](https://models.bytefuture.ai/dashboard) for the current per-image rate on `qwen/wan-2.7-image-pro`; other hosts serving the same model price the Pro tier around $0.075 per standard-resolution image, which is a reasonable ballpark while you evaluate it.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): $1 in free credit, no card required, with up to $50 in bonus credit on your first top-up. Export your key, run the generation call above, then try an edit against one of your own images.

[Try Token Station](https://models.bytefuture.ai/intro.html)
