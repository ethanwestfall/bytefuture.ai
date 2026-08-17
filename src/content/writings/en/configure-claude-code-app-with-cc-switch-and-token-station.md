---
slug: "configure-claude-code-app-with-cc-switch-and-token-station"
lang: "en"
title: "Configure Token Station for the Claude Code App with CC Switch"
summary: "Create and enable a Token Station provider in CC Switch, reload the configuration in the Claude Code App, and verify the route with a real request and the Token Station activity log."
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

Switching the Claude Code App between its official service, Token Station, and other model services can require repeated configuration edits. CC Switch stores each connection as a separate provider and applies the selected provider for you.

This guide configures Token Station for the Claude Code App through CC Switch, then verifies the route with a real request.

> This guide is for CC Switch and the Claude Code App. Claude Code CLI starts differently and may read configuration from different locations, so use the dedicated CLI setup for the command-line tool.

## Before you start

You need:

- CC Switch and the Claude Code App installed
- A working Token Station API key
- Access or available credit for the target model

Open the [Token Station dashboard](https://models.bytefuture.ai/dashboard) and confirm your API key and the complete target model ID. Never expose the key in screenshots, chats, or public documents.

## Configuration flow

The setup has five steps:

1. Create a Claude Code provider in CC Switch
2. Enter the Token Station URL, API key, and model ID
3. Save and enable the provider
4. Fully quit and reopen the Claude Code App
5. Send a request and confirm it in Token Station

## Add Token Station to CC Switch

Button labels may vary between CC Switch versions, but the required values stay the same.

### 1. Create a provider

Open CC Switch, select **Claude Code**, and enter provider management. Click Add, New Provider, or the plus button.

Use a clear name:

```text
Token Station
```

If CC Switch asks for a provider type, choose Claude, Anthropic, or a custom Anthropic-compatible service.

### 2. Enter the connection values

| Field | Value |
| --- | --- |
| Base URL | `https://models.bytefuture.ai` |
| API Key / Auth Token | Your Token Station API key |
| Model | Complete model ID shown by Token Station |

If the interface expects environment variables, use:

```text
ANTHROPIC_BASE_URL=https://models.bytefuture.ai
ANTHROPIC_AUTH_TOKEN=<你的 Token Station API Key>
ANTHROPIC_MODEL=<完整模型 ID>
```

Some CC Switch templates use `ANTHROPIC_API_KEY`. Follow the current template instead of setting several undocumented credential fields at once.

Do not append `/v1/messages` to the base URL. The client builds the Anthropic Messages API path, and a repeated path can return 404.

The model ID must match Token Station exactly, including the provider prefix. For example:

```text
openai/gpt-5.6-sol
```

Do not replace it with the display name shown in the Claude Code App.

### 3. Save and enable the provider

Before saving, check that:

- The base URL has no extra path or whitespace
- The API key has no leading or trailing whitespace
- The model ID includes its provider prefix
- Placeholder brackets and instructions were not copied as values

Save the provider, find **Token Station** in the list, and click Enable, Apply, or Switch. Confirm that CC Switch marks it as the current provider.

## Restart the Claude Code App

An App process that is already running usually does not load a provider selected later. Fully quit it before reopening.

### Windows

1. Close the Claude Code App window
2. Check the system tray for a background process
3. Select Quit if it is still running
4. Apply the provider in CC Switch and reopen the App

### macOS

1. Press `Command + Q` in the Claude Code App
2. Confirm that the process has quit
3. Apply the provider in CC Switch and reopen the App

Closing a window is not always the same as ending the process. Failure to restart after switching providers is the most common reason an update appears not to work.

## Verify the complete route

Create a conversation in the Claude Code App and send:

```text
请只回复：Token Station 测试成功
```

After the response arrives, open the [Token Station dashboard](https://models.bytefuture.ai/dashboard). Under `Recent Activity`, confirm:

- The new request appears
- Its time and status match
- The recorded model matches the CC Switch provider

A response in the App plus a matching Token Station record proves that the route is active. A Current Provider label in CC Switch alone does not.

## Switch back

Keep the original official provider instead of overwriting your only configuration. To restore it:

1. Select the original provider in CC Switch
2. Click Apply or Switch
3. Fully quit the Claude Code App
4. Reopen it and send a test message

## Troubleshooting

### The App still uses the old provider

Make sure the App process has ended, not just its window. Apply the Token Station provider again, then start the App.

### API key is missing

Check whether the current CC Switch template expects `ANTHROPIC_AUTH_TOKEN` or `ANTHROPIC_API_KEY`. After correcting the field, apply the provider again and restart the App.

### 401 or 403 response

The key may be wrong, expired, padded with whitespace, or missing access and available credit for the target model.

### 404 response

Use `https://models.bytefuture.ai` as the base URL and remove manually added `/messages` or other repeated paths.

### Model not found or access denied

Copy the complete ID from Token Station. Do not infer it from the display name in the App.

### The App responds, but Token Station has no record

The App may still use the original service. Check the current provider, confirm that the App restarted after the switch, and verify the Token Station account and time filter.

## Security notes

- Keep real API keys out of tutorial screenshots
- Do not commit CC Switch configuration or credentials to Git
- Revoke and replace a key immediately if it may have leaked
- Back up a working configuration before upgrading CC Switch or the Claude Code App

## References

- [Token Station dashboard](https://models.bytefuture.ai/dashboard)
- [CC Switch project](https://github.com/farion1231/cc-switch)
