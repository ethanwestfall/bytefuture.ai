---
slug: "configure-open-webui-with-token-station"
lang: "en"
title: "Configure Open WebUI with Token Station"
summary: "Run Open WebUI in Docker, connect it to Token Station as a custom OpenAI-compatible provider, and its model list auto-populates from your key's full catalog, no manual model registration required. Covers making models available to non-admin users and switching between them from the chat interface."
category: "tutorial"
date: "2026-09-01"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/configure-open-webui-with-token-station-cover.png"
draft: false
---

[Open WebUI](https://github.com/open-webui/open-webui) is a self-hosted chat interface that runs against any OpenAI-compatible API. Point it at Token Station and its model list auto-populates directly from your key's catalog, no manual per-model registration the way some other tools require. This walks through running Open WebUI, connecting Token Station, making models available to the people who'll actually use the instance, and switching between them from the chat screen itself.

Before the setup, the same reasoning applies here as with any tool you route through Token Station rather than paying a provider directly: cost visibility (every request is metered and billed at the provider's real rate, with zero markup, visible on your own dashboard) and consolidation (the same key works across every OpenAI-compatible tool you run, Open WebUI included, instead of separate keys and separate bills per tool). Open WebUI adds a third reason specific to itself: it's the one tool in this series where the model list isn't something you configure once for yourself, it's something your whole team or userbase sees and picks from, so a single Token Station key can hand an entire instance's worth of users access to whatever models you've enabled, without each of them needing their own provider account.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/configure-open-webui-with-token-station/walkthrough.mp4" type="video/mp4">
  </video>
  <figcaption>Full walkthrough: running Open WebUI, connecting Token Station, the model catalog auto-populating, making a model public, and switching to it from the chat interface.</figcaption>
</figure>

## What you need before starting

- Docker installed and running.
- A Token Station account and API key. Sign up free at [models.bytefuture.ai](https://models.bytefuture.ai): $1 in credit on registration, no card required.

## Step 1: Run Open WebUI

Open WebUI needs no separate backend to run standalone, this starts it directly:

```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

The volume mount keeps your settings and accounts across container restarts. Once it's up, open `http://localhost:3000`. On a fresh instance there are no accounts yet: the first sign-up you create is automatically granted admin rights, so just create one rather than looking for an existing login.

## Step 2: Connect Token Station as a provider

In the admin interface: your profile menu → **Admin Panel** → **Settings** → **Connections**, then **➕ Add Connection** under **Manage OpenAI API Connections**. Set:

- **URL**: `https://models.bytefuture.ai/v1`
- **Key**: your Token Station API key

The URL field suggests well-known providers as you type; Token Station won't appear in that list, which is expected, just enter it directly. Save the connection.

## Step 3: Confirm the model catalog auto-populated

Open WebUI verifies a new connection by calling the provider's `/models` endpoint, and on success populates the model list from whatever that key can see. Under **Admin Panel → Settings → Models**, you should see your full Token Station catalog appear automatically, with no per-model entry required.

Two things worth knowing about what shows up there:

- The list includes every modality your key has access to, chat models alongside image generation, video generation, and speech models (`openai/gpt-image-2`, `xai/grok-imagine-video`, `elevenlabs/scribe-v2`, and similar). This article only verifies plain chat; a non-chat model showing up in the same list doesn't mean Open WebUI's chat interface handles it the same way.
- You may see an entry called **Arena Model**. That's an Open WebUI built-in feature (it runs a prompt against multiple models blind so you can compare responses), not something Token Station sent, don't mistake it for a misconfigured or unrecognized model ID.

## Step 4: Make models available to your users

Every model starts **Private**, visible only to admins. To let other signed-up users on your instance select a model, open **Admin Panel → Settings → Models**, find it in the list, click the **⋮** menu next to it, and choose **Make Public**. There's no bulk action: each model needs this individually. If you want finer control than all-or-nothing, the same model's full settings page (the pencil/edit icon) has an **Access** button opening an **Access Control** dialog, where instead of Public you can build an **Access List** of specific users or groups.

With 20+ models in a typical Token Station catalog, deciding which ones to expose is worth doing deliberately rather than making everything public by default, especially given the mixed modalities from Step 3.

## Step 5: Switch models from the chat interface

This is the actual point of the setup: once a model is enabled, any user (not just an admin) can pick it from the model selector on the main chat screen and switch between whatever's been made available, without touching Docker, environment variables, or admin settings.

To verify a model works end to end rather than just appearing in the list: select it, send a real message, and check the [Token Station dashboard](https://models.bytefuture.ai/dashboard). A real reply plus a matching line in Recent Activity confirms the connection, the key, and that specific model are all correctly wired, billed straight to your Token Station account regardless of which user in Open WebUI sent the message.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): $1 in free credit, no card required, with up to $50 in bonus credit on your first top-up. Export your key, run the Docker command above, and connect it.

[Try Token Station](https://models.bytefuture.ai/intro.html)
