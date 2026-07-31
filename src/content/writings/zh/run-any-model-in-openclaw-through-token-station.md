---
slug: "run-any-model-in-openclaw-through-token-station"
lang: "zh"
title: "在 OpenClaw 中通过 Token Station 运行任意模型"
summary: "OpenClaw 通过引导向导和 CLI 支持自定义提供方。将其指向 Token Station 的 OpenAI 兼容端点（覆盖 21 家提供商的 250 多个模型），即可运行 GPT-5.5、Claude Opus、Kimi K2 或 Grok，无需更改你现有设置中的其他任何部分。"
category: "tutorial"
date: "2026-07-20"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/run-any-model-in-openclaw-through-token-station-cover.png"
draft: false
---

OpenClaw 通过其引导向导和 CLI 支持自定义提供方（任意 OpenAI 兼容或 Anthropic 兼容的端点）。Token Station 的统一 API 位于 `https://models.bytefuture.ai/v1`，通过一个 OpenAI 兼容接口提供 21 家提供商的 250 多个模型。把 OpenClaw 指向 Token Station，你就可以运行 GPT-5.5、Claude Opus、Kimi K2、Grok，或 Token Station 上的任何其他模型，而无需更改你设置中的其他任何部分。一个密钥，一个端点，任意模型。

## 开始之前需要准备什么

- Node 22.22.3+、24.15+ 或 25.9+（推荐默认使用 Node 24）。用 `node --version` 检查版本。
- 一个 Token Station 账户和 API 密钥。免费注册：[models.bytefuture.ai](https://models.bytefuture.ai)，注册即送 1 美元额度，无需信用卡。
- 已安装 OpenClaw（见下方步骤 1）。

## 步骤 1：安装 OpenClaw

**macOS / Linux / WSL2**：`--no-onboard` 参数会跳过自动启动的向导，这样你可以在步骤 2 中专门配置 Token Station：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

**Windows（PowerShell）或通过 npm 安装（任意平台）**：通过 npm 安装不会自动启动引导流程：

```bash
npm install -g openclaw@latest
```

验证程序是否可用：

```bash
openclaw --version
```

## 步骤 2：将 Token Station 配置为你的提供方

先导出你的 Token Station 密钥，然后带上自定义提供方参数运行引导流程：

```bash
# macOS / Linux / WSL2
export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

# Windows PowerShell
$env:TOKEN_STATION_API_KEY = "YOUR_TOKEN_STATION_KEY"
```

```bash
openclaw onboard --install-daemon --non-interactive --accept-risk \
  --auth-choice custom-api-key \
  --custom-base-url "https://models.bytefuture.ai/v1" \
  --custom-model-id "openai/gpt-5.4-mini" \
  --custom-api-key "$TOKEN_STATION_API_KEY" \
  --secret-input-mode plaintext \
  --custom-compatibility openai
```

这会把 Token Station 配置为 OpenClaw 的提供方，安装后台守护进程，并将 `openai/gpt-5.4-mini` 设为默认模型。

**每个参数的作用**

| 参数 | 含义 |
|---|---|
| `--auth-choice custom-api-key` | 选择自定义 API 密钥的提供方路径，而不是使用具名提供方（OpenAI、Anthropic 等）。 |
| `--custom-base-url` | OpenClaw 发送请求的目标端点。Token Station 的 OpenAI 兼容基础地址是 `https://models.bytefuture.ai/v1`。 |
| `--custom-model-id` | OpenClaw 使用的默认模型 ID，格式为 `provider/model`。 |
| `--custom-api-key` | 你的 Token Station API 密钥。使用 `$TOKEN_STATION_API_KEY` 变量引用可以避免密钥出现在 shell 历史记录中。 |
| `--secret-input-mode` | OpenClaw 存储 API 密钥的方式。`plaintext` 会将密钥直接存储在磁盘上的 agent 认证配置文件中。 |
| `--custom-compatibility` | 控制通信协议。`openai` 使用标准的 chat completions，这是 Token Station 的正确选项。仅当端点支持 `/v1/responses` 而不支持 `/v1/chat/completions` 时才使用 `openai-responses`。Anthropic 原生端点请使用 `anthropic`。 |
| `--install-daemon` | 将 OpenClaw 安装为后台服务（macOS 上为 LaunchAgent，Linux/WSL2 上为 systemd，Windows 上为计划任务；若任务创建被拒绝，则回退到启动文件夹方式）。 |

**更喜欢交互式向导？** 不带其他参数运行 `openclaw onboard --install-daemon` 即可。当向导进行到 Model/Auth 步骤时，选择自定义提供方选项并选择 OpenAI 兼容，然后输入 `https://models.bytefuture.ai/v1` 作为基础地址，并把你的 Token Station 密钥作为 API 密钥。

## 步骤 3：验证网关是否正在运行

```bash
openclaw gateway status
```

步骤 2 中安装的守护进程应该已经让网关处于运行状态。如果没有，该状态命令会告诉你问题出在哪里。

## 步骤 4：打开控制界面并确认

```bash
openclaw dashboard
```

控制面板会在你的浏览器中打开 `http://127.0.0.1:18789/`。发起一次对话。如果 agent 有回应，说明 OpenClaw 正在与 Token Station 通信，模型也在正常应答。

## 一条命令切换模型

Token Station 上的每个模型都在同一个端点、同一个密钥背后。要更改默认模型：

```bash
openclaw configure --section model
```

或者用不同的 `--custom-model-id` 重新运行引导流程。可选的一些模型 ID：

| 模型 ID | 适用场景 |
|---|---|
| `openai/gpt-5.5` | 高端旗舰模型；适合复杂规划、调试与架构设计。 |
| `openai/gpt-5.4` | 推理能力强，价格低于旗舰版本。 |
| `openai/gpt-5.4-mini` | 大多数日常任务的均衡之选，成本更低。 |
| `anthropic/claude-opus-4-8` | 长周期 agent 推理与深度分析。 |
| `kimi/kimi-k2.7-code` | 当成本比深度更重要时，适合日常编码任务。 |
| `xai/grok-build-0.1` | 快速且实惠，适合快速响应。 |
| `glm/glm-5.2` | 100 万 token 上下文窗口；代码能力强，价格低。 |

切换模型时，网关、频道和守护进程都不会改变。改变的只是发送给 Token Station 的模型 ID。

## 智能路由：让策略来选择模型

对大多数场景来说，硬编码一个模型就够用了。Token Station 还允许你在服务端定义路由策略：在满足质量下限的前提下选择最便宜的模型、结合提供商白名单的延迟上限策略，或是主模型加自动回退的方案。

对 OpenClaw 而言，这意味着你把 `--custom-model-id` 指向 Token Station 上的一个路由型工作负载，路由逻辑留在 Token Station 一侧。如果主模型出现故障，会由回退模型来应答，OpenClaw 完全无需知晓。你只需在 Token Station 中更新策略，OpenClaw 配置无需任何改动。

## 常用环境变量

如果你需要使用非默认路径，请在启动守护进程之前设置以下变量：

| 变量 | 作用 |
|---|---|
| `OPENCLAW_HOME` | 覆盖内部路径解析所使用的主目录。 |
| `OPENCLAW_STATE_DIR` | 覆盖状态目录。 |
| `OPENCLAW_CONFIG_PATH` | 覆盖配置文件路径。 |

## 如果无法连接

**401 / 认证错误。** 确认你的 Token Station 密钥是正确的。用修正后的 `--custom-api-key` 重新运行引导命令，或运行 `openclaw configure --section model` 以交互方式更新凭据。

**模型错误或找不到模型。** 请对照 Token Station 目录 [models.bytefuture.ai/models](https://models.bytefuture.ai/models) 核实模型 ID 是否完全一致。运行 `openclaw configure --section model` 来更新模型 ID。

**网关未运行。** 运行 `openclaw gateway status`。要重启网关，使用 `openclaw gateway restart`。要从头重新安装守护进程，重新运行 `openclaw onboard --install-daemon`。

**控制面板无法加载。** 网关必须先处于运行状态。用 `openclaw gateway status` 确认后，再重试 `openclaw dashboard`。

**配置问题或异常行为。** 运行 `openclaw doctor` 来诊断无效或过时的配置，然后重新运行 `openclaw configure` 修复发现的问题。

## 开始使用

在 OpenClaw 中设置 Token Station，只需要一条命令和一个环境变量。守护进程运行起来之后，切换模型只需一次 `openclaw configure --section model` 调用，你设置中的其他部分都不会改变。

前往 [models.bytefuture.ai](https://models.bytefuture.ai) 注册（1 美元免费额度，无需信用卡；首次充值最高可再获得 50 美元奖励），导出你的密钥，运行引导命令，打开控制面板。一个密钥，一个端点，满足你 OpenClaw 设置所需的每一个模型。
