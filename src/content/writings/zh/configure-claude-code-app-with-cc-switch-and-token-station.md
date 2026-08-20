---
slug: "configure-claude-code-app-with-cc-switch-and-token-station"
lang: "zh"
title: "用 CC Switch 和 Token Station 配置 Claude Desktop"
summary: "了解并安装 CC Switch，然后为 Claude Desktop 配置 Token Station Provider、模型映射和本地路由，并通过真实请求验证完整链路。"
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/configure-claude-code-app-with-cc-switch-and-token-station-cover.png"
draft: false
---

本文介绍如何安装 CC Switch，并用它把 Claude Desktop 接入 Token Station。配置完成后，Claude Desktop 发出的 Sonnet、Opus 和 Haiku 请求会由 CC Switch 映射到 Token Station 中的指定模型。

> 本文针对 CC Switch 中的 **Claude Desktop** 面板。Claude Desktop 和 Claude Code CLI 使用不同的配置路径，不要直接套用 Claude Code CLI 的配置步骤。

## 什么是 CC Switch

[CC Switch](https://github.com/farion1231/cc-switch) 是一个用于管理 AI 工具 Provider 的桌面应用，支持 Claude Desktop、Claude Code、Codex 和 Gemini CLI 等工具。

如果直接配置这些工具，通常需要分别修改配置文件或环境变量。CC Switch 将不同工具和 Provider 集中到一个图形界面中，可以保存多组配置，并在需要时快速切换，不必反复输入 API 地址和密钥。

在本文的配置中，CC Switch 主要负责三件事：

1. 保存 Token Station 的请求地址和 API Key
2. 将 Claude 的 Sonnet、Opus、Haiku 角色映射到 Token Station 模型
3. 在本机运行路由服务，把 Claude Desktop 的请求转发到 Token Station

完整请求链路如下：

```text
Claude Desktop
  → CC Switch 本地路由
  → 模型映射
  → Token Station
  → 指定模型
```

由于模型映射和转发由本地路由服务完成，使用这套配置时需要保持 CC Switch 运行。

## 安装 CC Switch

### macOS

已安装 [Homebrew](https://brew.sh/) 的用户可以运行：

```bash
brew install --cask cc-switch
```

安装完成后，从“应用程序”目录或 Launchpad 打开 CC Switch。也可以前往 [CC Switch Releases](https://github.com/farion1231/cc-switch/releases)，下载适用于 macOS 的安装包并手动安装。

### Windows

打开 [CC Switch Releases](https://github.com/farion1231/cc-switch/releases)，下载最新版本中适用于 Windows 的安装包。下载完成后运行安装程序，然后从开始菜单打开 CC Switch。

首次启动时，如果 Windows 显示安全确认窗口，请先核对下载来源，再决定是否继续。

### Linux

前往 [CC Switch Releases](https://github.com/farion1231/cc-switch/releases)，根据当前发行版选择对应的软件包，并按照 Release 页面中的说明安装和启动。不同版本提供的软件包格式可能发生变化，应以最新 Release 中列出的文件和安装说明为准。

### 确认安装成功

启动 CC Switch 后，确认主界面能够正常打开，并且可以看到 **Claude Desktop**、Claude Code、Codex 或 Gemini CLI 等工具入口。

本文接下来使用的是 **Claude Desktop** 入口。不要误选 Claude Code，因为两者写入的配置和使用的路由方式不同。

<figure>
  <img src="/blog/cc-switch-claude-desktop-entry.png" alt="CC Switch 顶部工具栏中已选中 Claude Desktop 入口，页面显示 Claude Desktop Official Provider" />
  <figcaption>在 CC Switch 顶部工具栏选择 Claude Desktop 图标。选中后，页面会显示 Claude Desktop 的 Provider，例如 Claude Desktop Official。</figcaption>
</figure>

## 开始之前

请准备：

- 已安装并能正常打开的 CC Switch
- 已安装并能正常启动的 Claude Desktop
- 有效的 Token Station API Key
- 目标模型的调用权限和可用额度

打开 [Token Station 控制台](https://models.bytefuture.ai/dashboard)，复制 API Key，并确认准备使用的模型完整 ID。不要在截图、聊天记录或 Git 仓库中暴露真实 API Key。

## 完整配置流程

整个过程包括：

1. 在 CC Switch 中新建 Claude Desktop Provider
2. 填写 Token Station 地址和 API Key
3. 开启 **需要模型映射（Needs model mapping）**
4. 将 Sonnet、Opus、Haiku 映射到 Token Station 模型 ID
5. 开启 CC Switch 本地路由和 Claude 路由
6. 启用 Provider，并完全重启 Claude Desktop
7. 发起真实请求，在 Token Station 中核对记录

如果遗漏模型映射或本地路由，即使 CC Switch 显示 Token Station 是当前 Provider，Claude Desktop 仍可能继续使用原来的服务。

## 添加 Token Station Provider

不同版本的 CC Switch 按钮名称可能略有不同，但核心设置一致。

### 1. 新建 Provider

打开 CC Switch，选择 **Claude Desktop**，进入 Provider 管理页，然后点击“添加”“新建 Provider”或加号按钮。建议使用容易辨认的名称：

```text
Token Station
```

如果界面要求选择 Provider 类型或 API 格式，请选择 Claude、Anthropic 或 **Anthropic Messages（原生）**。

### 2. 填写连接设置

| 字段 | 填写内容 |
| --- | --- |
| 请求地址 / Base URL | `https://models.bytefuture.ai` |
| API Key / Auth Token | 你的 Token Station API Key |
| API 格式 | Anthropic Messages（原生） |
| 需要模型映射 | 开启 |

<figure>
  <img src="/blog/cc-switch-token-station-provider-settings.png" alt="CC Switch 中的 Token Station Provider 设置，已填写 API Key、请求地址和 Anthropic Messages 格式，并开启模型映射" />
  <figcaption>请求地址使用 Token Station 根地址，API 格式选择 Anthropic Messages（原生）。</figcaption>
</figure>

Base URL 后不要追加 `/v1/messages`。客户端会自动拼接请求路径，重复添加可能返回 404。

如果当前版本以环境变量方式展示配置，请使用：

```text
ANTHROPIC_BASE_URL=https://models.bytefuture.ai
ANTHROPIC_AUTH_TOKEN=<你的 Token Station API Key>
ANTHROPIC_MODEL=<完整模型 ID>
```

部分模板使用 `ANTHROPIC_API_KEY` 而不是 `ANTHROPIC_AUTH_TOKEN`。应以当前模板显示的字段为准，不要同时填写多个来源不明的密钥字段。

### 3. 必须开启“需要模型映射”

**需要模型映射（Needs model mapping）** 必须保持开启。Claude Desktop 会以 Sonnet、Opus、Haiku 等 Claude 角色请求模型，CC Switch 需要把这些角色转换成 Token Station 能识别的完整模型 ID。

<figure>
  <img src="/blog/cc-switch-needs-model-mapping.png" alt="CC Switch Provider 表单中已开启需要模型映射选项" />
  <figcaption>保存 Token Station Provider 前，明确开启“需要模型映射”。</figcaption>
</figure>

如果关闭该选项，Claude 角色名可能未经映射直接发出，导致“模型不存在”，也可能让 App 继续走非预期的链路。

## 配置模型映射

进入 Token Station Provider 的模型映射区域，把每个 Claude 角色指向一个完整的 Token Station 模型 ID。可以先使用下面这组配置：

| Claude 角色 | Token Station 模型 |
| --- | --- |
| Sonnet | `openai/gpt-5.6-terra` |
| Opus | `openai/gpt-5.6-sol` |
| Haiku | `openai/gpt-5.6-luna` |

这些 ID 是配置示例。模型供应会变化，保存前应在 Token Station 中确认当前可用的模型 ID 和账号权限。必须保留 `openai/` 这样的提供方前缀：

```text
openai/gpt-5.6-sol
```

通常可以让 Sonnet 承担默认通用任务，Opus 处理更复杂的工作，Haiku 处理更快、更轻的任务。你也可以根据价格、速度和模型可用性调整映射。关键是每个会被请求的角色都要解析到有效的 Token Station 模型。

## 开启 CC Switch 本地路由

这一步最容易被跳过，而跳过它正是应用继续用旧服务回复的原因。模型映射由本机运行的 CC Switch 服务完成，因此只启用 Provider 还不够。

1. 打开 **CC Switch 设置 → 路由**
2. 开启 **在主页显示本地路由开关**
3. 启动并保持路由总开关运行
4. 在路由启用列表中打开 **Claude**
5. 回到 Claude Desktop 面板，把本地路由开关切换为 On

<figure>
  <img src="/blog/cc-switch-local-routing-settings.png" alt="CC Switch 路由设置，本地路由正在运行，并已启用 Claude 路由" />
  <figcaption>保持路由服务运行，显示主页开关，并明确启用 Claude 路由。</figcaption>
</figure>

使用这条链路期间，CC Switch 必须保持运行。退出 CC Switch 会停止本地网关，Claude Desktop 也就无法通过该配置访问 Token Station。

实际请求路径是：

```text
Claude Desktop
  → CC Switch local routing
  → model mapping
  → Token Station
  → selected model
```

## 保存、启用并重启

保存前确认：地址没有多余路径，API Key 前后没有空格，**需要模型映射** 已开启，并且每个模型 ID 都包含提供方前缀。

保存 Provider，选择 **Token Station**，点击“启用”“应用”或“切换”。然后完全退出 Claude Desktop 再重新打开。只关闭窗口可能仍会保留使用旧配置的后台进程。

Windows 用户应检查系统托盘，必要时选择“退出”；macOS 用户可以使用 `Command + Q`。重新打开 Claude Desktop 时，CC Switch 和路由服务都要保持运行。

## 无需 Anthropic 账号使用 Claude Desktop

CC Switch 配置完成后，可以通过 Claude Desktop 的第三方推理功能连接本地网关，无需先登录 Anthropic 账号。下面以 Windows 版 Claude Desktop 为例；不同系统或版本的菜单位置可能略有差异。

### 1. 开启开发者模式

打开 Claude Desktop 左上角的菜单，依次选择 **Help → Troubleshooting → Enable Developer Mode**。

<figure>
  <img src="/blog/claude-desktop-enable-developer-mode.png" alt="Claude Desktop 的 Help 菜单中依次展开 Troubleshooting，并选中 Enable Developer Mode" />
  <figcaption>在 Help → Troubleshooting 中选择 Enable Developer Mode。</figcaption>
</figure>

开启后，主菜单中会出现 **Developer** 入口。如果没有立即显示，可以完全退出 Claude Desktop，再重新打开。

### 2. 打开第三方推理设置

在左上角菜单中选择 **Developer → Configure Third-Party Inference...**。

<figure>
  <img src="/blog/claude-desktop-configure-third-party-inference.png" alt="Claude Desktop 的 Developer 菜单中选中 Configure Third-Party Inference" />
  <figcaption>通过 Developer 菜单打开第三方推理设置。</figcaption>
</figure>

### 3. 应用 CC Switch 配置

进入设置页后，确认右上角显示 **CC Switch**，Connection 选择 **Gateway**。如果前面的 Provider 和本地路由已经配置正确，Gateway base URL、API Key 和认证方式会由 CC Switch 自动写入。

此处无需手动填写或修改任何字段，直接点击页面底部的 **Apply locally**。

<figure>
  <img src="/blog/claude-desktop-apply-cc-switch-locally.png" alt="Claude Desktop 的第三方推理设置页已由 CC Switch 填入本地 Gateway 信息，底部显示 Apply locally 按钮" />
  <figcaption>确认配置来源为 CC Switch 后，不要修改自动生成的 Gateway 信息，直接点击 Apply locally。</figcaption>
</figure>

应用完成后，Claude Desktop 会使用 CC Switch 的本地网关发送推理请求。使用期间应保持 CC Switch 和本地路由运行。Gateway API Key 属于敏感信息，即使由 CC Switch 自动生成，也不要截图公开或复制给他人。

## 验证完整链路

在 Claude Desktop 中新建会话并发送：

```text
请只回复：Token Station 测试成功
```

收到回复后，打开 [Token Station 控制台](https://models.bytefuture.ai/dashboard)，进入 `Recent Activity` 或请求记录，确认：

- 对应时间出现了新请求
- 请求状态为成功
- 实际记录的模型与 CC Switch 中的角色映射一致

Claude Desktop 正常回复，并且 Token Station 出现匹配记录，才能证明整条链路已经生效。仅看到 CC Switch 的“当前 Provider”标签并不足以完成验证。

## 切回原 Provider

建议保留官方 Provider，不要覆盖唯一配置。需要恢复时，选择原 Provider，点击“应用”或“切换”；如果不再需要 Token Station 路由，可以关闭相应开关；然后完全退出并重新打开 Claude Desktop。

## 常见问题

### Claude Desktop 仍在使用旧 Provider

完全退出 Claude Desktop，重新应用 Token Station Provider，确认本地路由和 Claude 路由均已开启，再启动 Claude Desktop。

### 没有开启模型映射

编辑 Provider，开启 **需要模型映射**，并检查 Sonnet、Opus、Haiku 是否指向有效的 Token Station 模型 ID。保存后重新应用 Provider。

### 本地路由未开启

进入 **设置 → 路由**，启动路由服务，开启 Claude 路由，再回到 Claude Desktop 面板打开本地路由开关。

### CC Switch 没有运行

本地网关只在 CC Switch 运行时存在。重新打开 CC Switch，启动路由服务后再测试。

### 提示缺少 API Key，或返回 401、403

检查模板要求的是 `ANTHROPIC_AUTH_TOKEN` 还是 `ANTHROPIC_API_KEY`。确认密钥有效、没有多余空格，并且账号对目标模型有权限和额度。

### 返回 404

Base URL 应为 `https://models.bytefuture.ai`。删除手动追加的 `/messages`、`/v1/messages` 或其他重复路径。

### 返回模型不存在或无权限

从 Token Station 复制完整模型 ID，并检查对应的 Sonnet、Opus 或 Haiku 映射。不要根据 Claude Desktop 的展示名称猜测模型 ID。

### Claude Desktop 有回复，但 Token Station 没有记录

请求可能仍在使用原服务。逐项检查当前 Provider、模型映射、两个路由开关、Claude Desktop 是否已重启，以及 Token Station 账号和活动记录的时间筛选。

## 安全建议

- 不要在教程截图中显示真实 API Key
- 不要把 CC Switch 配置文件或密钥提交到 Git
- 密钥疑似泄露时，立即撤销并重新生成
- 升级 CC Switch 或 Claude Desktop 前备份可用 Provider

## 总结

这套配置需要四部分共同生效：Token Station Provider、**需要模型映射**、CC Switch 本地路由与 Claude 路由，以及 Claude Desktop 的完全重启。最后应在 Token Station 活动记录中核对请求，确认实际处理请求的服务和模型。

## 参考资料

- [Token Station 控制台](https://models.bytefuture.ai/dashboard)
- [CC Switch 项目](https://github.com/farion1231/cc-switch)
