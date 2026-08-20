---
slug: "configure-claude-code-app-with-cc-switch-and-token-station"
lang: "en"
title: "Configure Claude Desktop with CC Switch and Token Station"
summary: "Learn about and install CC Switch, configure a Token Station provider for Claude Desktop, enable model mapping and local routing, then verify the complete route."
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/configure-claude-code-app-with-cc-switch-and-token-station-cover.png"
draft: false
---

This guide explains how to install CC Switch and use it to connect Claude Desktop to Token Station. Once configured, CC Switch maps the Sonnet, Opus, and Haiku roles requested by Claude Desktop to selected models in Token Station.

> This guide is for the **Claude Desktop** panel in CC Switch. Claude Desktop and the Claude Code CLI use different configuration paths. Do not apply the Claude Code CLI instructions to this setup.

## What is CC Switch?

[CC Switch](https://github.com/farion1231/cc-switch) is a desktop application for managing providers used by AI tools, including Claude Desktop, Claude Code, Codex, and Gemini CLI.

Without it, changing providers often means editing separate configuration files or environment variables for each tool. CC Switch puts those settings in one graphical interface, where you can save several providers and switch between them without repeatedly entering endpoints and credentials.

In this setup, CC Switch does three things:

1. Stores the Token Station endpoint and API key
2. Maps Claude's Sonnet, Opus, and Haiku roles to Token Station models
3. Runs a local routing service that forwards Claude Desktop requests to Token Station

The complete request path is:

```text
Claude Desktop
  → CC Switch local routing
  → model mapping
  → Token Station
  → selected model
```

Because the local routing service performs the mapping and forwarding, CC Switch must remain running while you use this setup.

## Install CC Switch

### macOS

If you have [Homebrew](https://brew.sh/) installed, run:

```bash
brew install --cask cc-switch
```

Open CC Switch from Applications or Launchpad when installation finishes. You can also download the macOS installer from [CC Switch Releases](https://github.com/farion1231/cc-switch/releases).

### Windows

Open [CC Switch Releases](https://github.com/farion1231/cc-switch/releases) and download the Windows installer from the latest release. Run the installer, then open CC Switch from the Start menu. If Windows shows a security prompt on first launch, verify the download source before continuing.

### Linux

Open [CC Switch Releases](https://github.com/farion1231/cc-switch/releases), choose the package for your distribution, and follow the instructions on the release page. Available package formats may change between releases, so use the files and instructions provided with the current release.

### Confirm the installation

Open CC Switch and confirm that its main window shows tool entries such as **Claude Desktop**, Claude Code, Codex, and Gemini CLI.

For this guide, select **Claude Desktop**. Do not select Claude Code, because the two entries write different settings and use different configuration paths.

<figure>
  <img src="/blog/cc-switch-claude-desktop-entry.png" alt="The Claude Desktop entry is selected in the CC Switch toolbar, and the Claude Desktop Official provider is visible" />
  <figcaption>Select the Claude Desktop icon in the CC Switch toolbar. The panel then shows Claude Desktop providers such as Claude Desktop Official.</figcaption>
</figure>

## Before you start

You need the following in place:

- CC Switch installed and able to open
- Claude Desktop installed and able to start
- A valid Token Station API key
- Access to the models you plan to use, and credit to spend on them

Open the [Token Station dashboard](https://models.bytefuture.ai/dashboard), copy the API key, and confirm the complete IDs of the models you plan to use. Keep the API key out of screenshots, chat messages, and version control.

## Configuration flow

The complete setup is:

1. Create a Claude Desktop provider in CC Switch
2. Enter the Token Station endpoint and API key
3. Turn on **Needs model mapping**
4. Map Sonnet, Opus, and Haiku to Token Station model IDs
5. Enable the CC Switch routing service and Claude routing
6. Enable the provider and fully restart Claude Desktop
7. Send a request and verify it in Token Station

Skipping model mapping or local routing can leave the app on its previous service even when CC Switch shows Token Station as the current provider.

## Add the Token Station provider

Button labels can differ slightly between CC Switch releases, but the required settings are the same.

### 1. Create a provider

Open CC Switch, select **Claude Desktop**, enter provider management, and click Add, New Provider, or the plus button. Give the provider a recognizable name:

```text
Token Station
```

If a provider type or API format is required, select Claude, Anthropic, or **Anthropic Messages (native)**.

### 2. Enter the connection settings

| Field | Value |
| --- | --- |
| Request URL / Base URL | `https://models.bytefuture.ai` |
| API Key / Auth Token | Your Token Station API key |
| API format | Anthropic Messages (native) |
| Needs model mapping | On |

<figure>
  <img src="/blog/cc-switch-token-station-provider-settings.png" alt="Token Station provider settings in CC Switch with an API key, request URL, Anthropic Messages format, and model mapping enabled" />
  <figcaption>Use the Token Station root URL and the native Anthropic Messages format.</figcaption>
</figure>

Do not append `/v1/messages` to the base URL. The client builds the request path, and duplicating it can cause a 404 response.

If your CC Switch version displays environment variables, use:

```text
ANTHROPIC_BASE_URL=https://models.bytefuture.ai
ANTHROPIC_AUTH_TOKEN=<YOUR_TOKEN_STATION_API_KEY>
ANTHROPIC_MODEL=<FULL_MODEL_ID>
```

Some templates use `ANTHROPIC_API_KEY` instead of `ANTHROPIC_AUTH_TOKEN`. Follow the fields shown by your current template. Do not fill several undocumented credential fields at the same time.

### 3. Turn on Needs model mapping

The **Needs model mapping** switch must be On. Claude Desktop requests models by Claude roles such as Sonnet, Opus, and Haiku. CC Switch must translate those roles into the full model IDs understood by Token Station.

<figure>
  <img src="/blog/cc-switch-needs-model-mapping.png" alt="CC Switch provider form with the Needs model mapping option enabled" />
  <figcaption>Enable “Needs model mapping” before saving the Token Station provider.</figcaption>
</figure>

If this option is disabled, selecting a Claude role can send an unmapped model name and produce a model-not-found error, or the app may continue using an unintended route.

## Configure model mapping

Open the model mapping area for the Token Station provider and assign each Claude role to a complete Token Station model ID. A practical starting point is:

| Claude role | Token Station model |
| --- | --- |
| Sonnet | `openai/gpt-5.6-terra` |
| Opus | `openai/gpt-5.6-sol` |
| Haiku | `openai/gpt-5.6-luna` |

These IDs are examples. Model availability changes, so confirm the current IDs and your account access in Token Station before saving. Preserve the provider prefix, such as `openai/`:

```text
openai/gpt-5.6-sol
```

Sonnet is normally used for the default general-purpose role, Opus for more demanding work, and Haiku for faster or lighter tasks. You can map them differently according to cost, latency, and model availability. The important point is that every requested role resolves to a valid Token Station model.

## Enable CC Switch local routing

This is the step most often skipped, and skipping it is why the app keeps answering from its old service. Enabling the provider is not enough on its own: the mapping is applied by the CC Switch service running on your computer, so that service has to be up.

1. Open **CC Switch Settings → Routing**
2. Turn on **Show local routing switch on the home page**
3. Start or keep the routing master switch running
4. Enable **Claude** under routing
5. Return to the Claude Desktop panel and turn its local routing toggle On

<figure>
  <img src="/blog/cc-switch-local-routing-settings.png" alt="CC Switch routing settings with local routing running and Claude routing enabled" />
  <figcaption>Keep the routing service running, expose the home-page switch, and enable Claude routing.</figcaption>
</figure>

CC Switch must remain open while this route is in use. Quitting it stops the local gateway and Claude Desktop can no longer reach Token Station through this configuration.

The active request path is:

```text
Claude Desktop
  → CC Switch local routing
  → model mapping
  → Token Station
  → selected model
```

## Save, enable, and restart

Before saving, confirm that the URL has no extra path, the API key has no surrounding whitespace, **Needs model mapping** is On, and every model ID includes its provider prefix.

Save the provider, select **Token Station**, and click Enable, Apply, or Switch. Then completely quit Claude Desktop and reopen it. Closing only the window may leave the process running with its old configuration.

On Windows, check the system tray and choose Quit if necessary. On macOS, use `Command + Q`. Keep CC Switch and its routing service running when you reopen Claude Desktop.

## Use Claude Desktop without an Anthropic account

After configuring CC Switch, you can connect Claude Desktop to its local gateway through the third-party inference feature without first signing in to an Anthropic account. The steps below use Claude Desktop for Windows. Menu locations may differ slightly on other systems or versions.

### 1. Enable Developer Mode

Open the menu in the upper-left corner of Claude Desktop, then select **Help → Troubleshooting → Enable Developer Mode**.

<figure>
  <img src="/blog/claude-desktop-enable-developer-mode.png" alt="The Claude Desktop Help menu is open, with Troubleshooting expanded and Enable Developer Mode selected" />
  <figcaption>Select Enable Developer Mode under Help → Troubleshooting.</figcaption>
</figure>

The **Developer** entry should now appear in the main menu. If it does not appear immediately, completely quit Claude Desktop and reopen it.

### 2. Open the third-party inference settings

From the upper-left menu, select **Developer → Configure Third-Party Inference...**.

<figure>
  <img src="/blog/claude-desktop-configure-third-party-inference.png" alt="Configure Third-Party Inference is selected in the Claude Desktop Developer menu" />
  <figcaption>Open the third-party inference settings from the Developer menu.</figcaption>
</figure>

### 3. Apply the CC Switch configuration

On the settings page, confirm that **CC Switch** appears in the upper-right corner and that Connection is set to **Gateway**. If the provider and local routing were configured correctly, CC Switch automatically fills the Gateway base URL, API key, and authentication scheme.

Do not enter or change anything on this page. Click **Apply locally** at the bottom.

<figure>
  <img src="/blog/claude-desktop-apply-cc-switch-locally.png" alt="The Claude Desktop third-party inference page contains local Gateway settings supplied by CC Switch and an Apply locally button" />
  <figcaption>After confirming that CC Switch supplied the settings, leave the generated Gateway fields unchanged and click Apply locally.</figcaption>
</figure>

Claude Desktop will now send inference requests through the CC Switch local gateway. Keep CC Switch and local routing running while you use it. Treat the Gateway API key as sensitive even when CC Switch generated it automatically. Do not publish screenshots that reveal it or share it with anyone.

## Verify the complete route

Start a new conversation in Claude Desktop and send:

```text
Reply only: Token Station test succeeded
```

After the response arrives, open the [Token Station dashboard](https://models.bytefuture.ai/dashboard) and check `Recent Activity` or the request log. Confirm that:

- The new request appears at the expected time
- The request completed successfully
- The recorded model matches the role mapping in CC Switch

A response in the app and a matching Token Station record together prove that the complete route is active. The Current Provider label in CC Switch is not sufficient evidence by itself.

## Switch back to the original provider

Keep the official provider instead of overwriting it. To restore it, select the original provider, click Apply or Switch, turn off the Token Station route if it is no longer needed, fully quit Claude Desktop, and reopen it.

## Troubleshooting

### The app still uses the old provider

Fully quit the app, apply the Token Station provider again, confirm local routing and Claude routing are On, then reopen the app.

### Model mapping is disabled

Edit the provider, enable **Needs model mapping**, and verify that Sonnet, Opus, and Haiku point to valid Token Station model IDs. Save and reapply the provider.

### Local routing is off

Open **Settings → Routing**, start the routing service, enable Claude routing, and turn on the local routing switch in the Claude Desktop panel.

### CC Switch is not running

The local gateway exists only while CC Switch is running. Reopen CC Switch, start routing, and retry the request.

### API key is missing, or the response is 401 or 403

Check whether the template expects `ANTHROPIC_AUTH_TOKEN` or `ANTHROPIC_API_KEY`. Verify that the key is valid, contains no extra whitespace, and has access and credit for the selected model.

### The response is 404

Use `https://models.bytefuture.ai` as the base URL and remove manually appended `/messages`, `/v1/messages`, or other repeated paths.

### Model not found or access denied

Copy the complete model ID from Token Station and verify the corresponding Sonnet, Opus, or Haiku mapping. Do not infer an ID from the app's display name.

### The app responds, but Token Station has no record

The request may still be using the original service. Check the active provider, model mapping, both routing switches, the app restart, the Token Station account, and the activity time filter.

## Security notes

- Keep real API keys out of tutorial screenshots
- Do not commit CC Switch configuration files or credentials to Git
- Revoke and replace a key immediately if it may have leaked
- Back up a working provider before upgrading CC Switch or Claude Desktop

## Summary

This setup depends on four parts working together: a Token Station provider, **Needs model mapping**, CC Switch local and Claude routing, and a complete restart of Claude Desktop. Verify the result in the Token Station activity log so you know which service and model handled the request.

## References

- [Token Station dashboard](https://models.bytefuture.ai/dashboard)
- [CC Switch project](https://github.com/farion1231/cc-switch)
