---
slug: "configure-open-webui-with-token-station"
lang: "zh"
title: "在 Open WebUI 中接入 Token Station"
summary: "在 Docker 里运行 Open WebUI，把它连接到 Token Station 作为自定义 OpenAI 兼容 provider，模型列表会直接从你 key 的完整目录自动填充，不需要逐个手动注册模型。文章还涵盖如何让非管理员用户也能使用这些模型，以及如何在聊天界面里切换模型。"
category: "tutorial"
date: "2026-09-01"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/configure-open-webui-with-token-station-cover.png"
draft: false
---

[Open WebUI](https://github.com/open-webui/open-webui) 是一个自托管的聊天界面，可以对接任何 OpenAI 兼容的 API。把它指向 Token Station，它的模型列表会直接从你 key 的目录里自动填充，不像有些工具那样需要逐个手动注册模型。下面会介绍如何运行 Open WebUI、接入 Token Station、让实际使用这套系统的用户也能用上这些模型，以及如何直接在聊天界面里切换模型。

在开始配置之前，这里的道理和本系列里通过 Token Station 而不是直接付费给某个 provider 的其他工具是一样的：成本可见性（每个请求都会按 provider 的真实费率计费，零加价，显示在你自己的控制台里）和统一管理（同一个 key 在你运行的每个 OpenAI 兼容工具上都能用，Open WebUI 也不例外，不必给每个工具单独准备 key、单独出账单）。Open WebUI 还多了一个它自己特有的理由：这是本系列里唯一一个模型列表不是只给你自己配置一次，而是你的整个团队或用户群都会看到并从中选择的工具，所以一个 Token Station key 就能让一整个实例的用户都用上你启用的模型，不需要每个人各自开一个 provider 账户。

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/configure-open-webui-with-token-station/walkthrough.mp4" type="video/mp4">
  </video>
  <figcaption>完整演示：运行 Open WebUI、接入 Token Station、模型目录自动填充、把一个模型设为公开，再从聊天界面切换到它。</figcaption>
</figure>

## 开始之前需要准备什么

- 已安装并运行 Docker。
- 一个 Token Station 账户和 API 密钥。免费注册：[models.bytefuture.ai](https://models.bytefuture.ai)，注册即送 1 美元额度，无需信用卡。

## 步骤 1：运行 Open WebUI

Open WebUI 可以独立运行，不需要额外的后端，直接这样启动：

```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

这个数据卷挂载会在容器重启后依然保留你的设置和账户。启动后，打开 `http://localhost:3000`。全新的实例还没有任何账户：你注册的第一个账户会自动获得管理员权限，所以直接注册一个就行，不用去找什么已有的登录入口。

## 步骤 2：将 Token Station 接入为 provider

在管理界面里：点击你的头像菜单 → **Admin Panel** → **Settings** → **Connections**，然后在 **Manage OpenAI API Connections** 下点击 **➕ Add Connection**。设置：

- **URL**：`https://models.bytefuture.ai/v1`
- **Key**：你的 Token Station API 密钥

输入时，URL 字段会提示一些知名 provider，Token Station 不会出现在那个列表里，这是正常的，直接手动输入即可。保存这个连接。

## 步骤 3：确认模型目录已经自动填充

Open WebUI 通过调用 provider 的 `/models` 接口来验证一个新连接，成功后会根据这个 key 能看到的内容自动填充模型列表。打开 **Admin Panel → Settings → Models**，你应该能看到你完整的 Token Station 目录自动出现，不需要逐个添加模型。

这里有两点值得注意：

- 列表里包含你的 key 能访问的每一种模态，聊天模型之外还会有图像生成、视频生成、语音相关的模型（比如 `openai/gpt-image-2`、`xai/grok-imagine-video`、`elevenlabs/scribe-v2` 之类）。这篇文章只验证了普通聊天；同一个列表里出现的非聊天模型，不代表 Open WebUI 的聊天界面会用同样的方式处理它们。
- 你可能会看到一个叫 **Arena Model** 的条目。那是 Open WebUI 自带的一个功能（把同一个提示词匿名发给多个模型，方便你对比结果），不是 Token Station 发过来的，不要把它误认为是一个配置错误或无法识别的模型 ID。

## 步骤 4：让用户能用上这些模型

每个模型默认都是 **Private**，只有管理员能看到。要让实例上的其他注册用户也能选用某个模型，打开 **Admin Panel → Settings → Models**，在列表里找到它，点击旁边的 **⋮** 菜单，选择 **Make Public**。这里没有批量操作：每个模型都需要单独设置。如果你想要比"全公开"更精细的控制，同一个模型的完整设置页（点铅笔/编辑图标进入）里有一个 **Access** 按钮，会打开一个 **Access Control** 对话框，除了 Public，你还可以在这里建一份特定用户或用户组的 **Access List**。

一个典型的 Token Station 目录会有 20 多个模型，考虑到步骤 3 里提到的模态混杂情况，值得刻意挑选要开放哪些，而不是把所有模型都默认设成公开。

## 步骤 5：在聊天界面里切换模型

这才是这套配置真正的意义所在：一旦某个模型被启用，任何用户（不只是管理员）都可以在主聊天界面的模型选择器里挑选它，并在已开放的模型之间切换，完全不用碰 Docker、环境变量或管理员设置。

要确认一个模型是真的端到端跑通了，而不只是出现在列表里：选中它，发一条真实的消息，然后去 [Token Station 控制台](https://models.bytefuture.ai/dashboard) 查看。真实的回复加上 Recent Activity 里对应的一条记录，说明连接、密钥，以及这个具体的模型都配置正确，无论是 Open WebUI 里哪个用户发的消息，费用都会直接计入你的 Token Station 账户。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：1 美元免费额度，无需信用卡，首次充值最高可再获得 50 美元奖励。导出你的密钥，运行上面的 Docker 命令，然后接入它。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
