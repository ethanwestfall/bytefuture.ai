---
slug: "configure-claude-code-app-with-cc-switch-and-token-station"
lang: "zh"
title: "用 CC Switch 为 Claude Code App 配置 Token Station"
summary: "介绍如何在 CC Switch 中创建并启用 Token Station Provider，让 Claude Code App 读取新配置，并通过真实请求和控制台记录完成验证。"
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

当你需要在官方服务、Token Station 和其他模型服务之间切换时，反复修改 Claude Code App 的配置并不方便。CC Switch 可以将每组连接参数保存为独立 Provider，切换时直接应用对应配置。

本文介绍如何通过 CC Switch 为 Claude Code App 配置 Token Station，并用一次真实请求完成端到端验证。

> 本文面向 CC Switch 与 Claude Code App。命令行版 Claude Code CLI 的启动方式和变量来源不同，请使用专门的 CLI 配置方法。

## 开始之前

请准备：

- 已安装 CC Switch 和 Claude Code App；
- 一个可用的 Token Station API Key；
- 目标模型的调用权限或可用额度。

打开 [Token Station 控制台](https://models.bytefuture.ai/dashboard)，确认 API Key 和目标模型的完整 ID。不要在截图、聊天记录或公开文档中展示真实密钥。

## 配置流程

整个过程分为五步：

1. 在 CC Switch 中新建 Claude Code Provider；
2. 填写 Token Station 地址、API Key 和模型 ID；
3. 保存并启用该 Provider；
4. 完全退出并重新打开 Claude Code App；
5. 发起请求，并在 Token Station 控制台核对记录。

## 在 CC Switch 中添加 Token Station

不同版本的 CC Switch 可能使用不同的按钮名称，但核心字段相同。

### 1. 新建 Provider

打开 CC Switch，选择 **Claude Code**，进入 Provider 管理页面。点击“添加”“新增 Provider”或加号按钮，创建一条配置。

配置名称可以填写：

```text
Token Station
```

如果需要选择类型，使用 Claude、Anthropic 或自定义 Anthropic 兼容服务。

### 2. 填写连接参数

| 字段 | 填写内容 |
| --- | --- |
| Base URL | `https://models.bytefuture.ai` |
| API Key / Auth Token | 你的 Token Station API Key |
| Model | Token Station 显示的完整模型 ID |

如果界面要求填写环境变量，使用：

```text
ANTHROPIC_BASE_URL=https://models.bytefuture.ai
ANTHROPIC_AUTH_TOKEN=<你的 Token Station API Key>
ANTHROPIC_MODEL=<完整模型 ID>
```

部分 CC Switch 模板可能使用 `ANTHROPIC_API_KEY`。这时应按当前模板填写，不要同时设置多个来源不明的密钥字段。

Base URL 不要手动添加 `/v1/messages`。客户端会根据 Anthropic Messages API 自动拼接请求路径，重复添加可能导致 404。

模型 ID 必须与 Token Station 显示的值完全一致，包括提供方前缀。例如：

```text
openai/gpt-5.6-sol
```

不要使用 Claude Code App 中的展示名称代替完整 ID。

### 3. 保存并启用

保存前检查：

- Base URL 没有多余路径或空格；
- API Key 前后没有换行或空格；
- 模型 ID 包含完整提供方前缀；
- 示例中的尖括号和说明文字没有被复制进去。

保存后，在 Provider 列表中找到 **Token Station**，点击“启用”“应用”或“切换”。确认 CC Switch 显示它是当前配置。

## 重启 Claude Code App

已经运行的 App 通常不会自动读取后来切换的配置，因此需要完全退出后再启动。

### Windows

1. 关闭 Claude Code App 窗口；
2. 检查系统托盘，确认应用没有在后台运行；
3. 如仍在运行，选择“退出”；
4. 从 CC Switch 应用配置后重新打开 App。

### macOS

1. 在 Claude Code App 中按 `Command + Q`；
2. 确认程序已经退出；
3. 从 CC Switch 应用配置后重新打开 App。

只关闭窗口不一定会结束进程。切换 Provider 后不重启，是最常见的配置未生效原因。

## 端到端验证

在 Claude Code App 中新建会话，发送：

```text
请只回复：Token Station 测试成功
```

收到回复后，打开 [Token Station 控制台](https://models.bytefuture.ai/dashboard)，在 `Recent Activity` 或调用记录页面检查：

- 是否出现了刚才的请求；
- 请求时间和状态是否正确；
- 实际模型是否与 CC Switch 中的配置一致。

只有 App 正常返回结果，并且控制台出现对应记录，才能证明请求确实经过 Token Station。CC Switch 界面显示“当前配置”本身并不是完整验证。

## 切回原配置

建议保留原来的官方 Provider，不要直接覆盖唯一配置。需要恢复时：

1. 在 CC Switch 中选择原 Provider；
2. 点击“应用”或“切换”；
3. 完全退出 Claude Code App；
4. 重新打开 App 并发送测试消息。

## 常见问题

### 已切换 Provider，但 App 仍使用旧配置

确认 App 已完全退出，而不是只关闭窗口。重新应用 Token Station Provider，再启动 App。

### 提示缺少 API Key

检查 CC Switch 模板要求的是 `ANTHROPIC_AUTH_TOKEN` 还是 `ANTHROPIC_API_KEY`，并确认密钥字段没有留空。修改后重新应用 Provider 并重启 App。

### 返回 401 或 403

通常是 API Key 错误、已经失效、含有多余空格，或账户没有目标模型的权限和额度。

### 返回 404

检查 Base URL 是否为 `https://models.bytefuture.ai`，并确认没有手动添加 `/messages` 或其他重复路径。

### 返回模型不存在或无权限

复制 Token Station 模型列表中的完整 ID，不要根据 App 的展示名称推测模型 ID。

### App 有回复，但 Token Station 没有记录

App 可能仍在使用原服务。检查当前 Provider、App 是否在切换后重启，以及控制台账号和筛选时间是否正确。

## 安全建议

- 不要在教程截图中展示真实 API Key；
- 不要把 CC Switch 配置文件或密钥提交到 Git；
- 密钥疑似泄露时，立即在 Token Station 中撤销并重新生成；
- 升级 CC Switch 或 Claude Code App 前，备份当前可用配置。

## 参考资料

- [Token Station 控制台](https://models.bytefuture.ai/dashboard)
- [CC Switch 项目](https://github.com/farion1231/cc-switch)
