---
slug: gpt-5-6-token-station
title: "GPT-5.6 已接入 Token Station：一个模型家族，覆盖 OpenAI、Codex 和 Copilot 路由"
summary: "Token Station 现在支持 GPT-5.6，并覆盖 OpenAI、OpenAI Codex 和 GitHub Copilot 路由，包括 Sol、Terra、Luna 变体、长上下文价格阶梯和 prompt cache 计费。"
category: model-launches
date: 2026-07-13
cta: https://models.bytefuture.ai/intro.html
---

GPT-5.6 已经接入 Token Station。

重点不只是 OpenAI 又发布了一个新模型家族，而是这个模型家族现在可以出现在开发者已经在用的工作界面里：直接的 OpenAI-compatible API、OpenAI Codex 工作流，以及 GitHub Copilot 订阅路由。

对构建 AI agent 的团队来说，这很重要。模型发布不应该意味着每个工具都要重新集成一遍。Token Station 把新模型变成一个可选择、可替换的路由。

## 现在可用的模型

这次 GPT-5.6 支持包含主模型和三个命名变体：

- `openai/gpt-5.6`
- `openai/gpt-5.6-sol`
- `openai/gpt-5.6-terra`
- `openai/gpt-5.6-luna`

Token Station 也通过 OpenAI Codex 路由暴露 GPT-5.6：

- `openai-codex/gpt-5.6`
- `openai-codex/gpt-5.6-sol`
- `openai-codex/gpt-5.6-terra`
- `openai-codex/gpt-5.6-luna`

以及 GitHub Copilot 已发布支持的路由：

- `github-copilot/gpt-5.6-sol`
- `github-copilot/gpt-5.6-terra`
- `github-copilot/gpt-5.6-luna`

这样开发者可以在不同工作环境里测试同一个模型家族，而不是把每个 provider surface 都当成一个单独的集成项目。

## 为什么这对 coding agent 重要

Coding agent 不是一次 API 调用。真实工作流通常包括规划、搜索代码库、生成 patch、修测试、代码审查和子任务分发。不同工具处在这个工作流的不同位置。

Codex 可能是你的终端 coding agent。GitHub Copilot 可能是你的编辑器和 PR 助手。直接 OpenAI-compatible API 可能支撑内部 agent、benchmark harness 或评测脚本。

GPT-5.6 通过 Token Station 路由可用之后，你可以保持集成层稳定，同时测试模型在哪些环节最有价值。

## 用一个 endpoint 测试 GPT-5.6

endpoint 保持简单：

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer DEMO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-sol",
    "messages": [
      {"role": "user", "content": "Explain the tradeoff between cache writes and cached input tokens for a coding agent."}
    ]
  }'
```

想试其他路由，只需要换 model ID：

```json
{
  "model": "openai-codex/gpt-5.6-terra"
}
```

或者：

```json
{
  "model": "github-copilot/gpt-5.6-luna"
}
```

重点不是记住另一套集成方式，而是让模型路由变得明确、可替换。

## 价格和长上下文计费

Token Station 的 GPT-5.6 支持包含该模型家族已发布的价格结构，包括基础 input、cached input、cache-write、output，以及 272K tokens 以上的长上下文阶梯。

这对 agent 工作负载很重要，因为长时间 coding session 不是短聊天。Coding agent 可能反复发送代码库上下文、测试输出、diff 和规划状态。Prompt caching 可以降低重复上下文成本，但前提是 cache write 和 cached read 被分开计费。

这次更新规范化了 GPT-5.6 的 `cache_write_tokens` 用法，让 cache write 进入 cache-creation 计费桶，而不是被重复算作普通 input tokens。

对用户来说，实际含义很简单：Token Station 可以暴露新的 GPT-5.6 家族，同时保留真实 agent 运行里重要的计费细节。

## Azure 的位置

这次更新也加入了 Azure OpenAI GPT-5.6 preview 的注释模板，并通过 `azure_api_version = "v1"` 支持 Azure 的 `/openai/v1` surface。

这些模板没有用猜测的价格启用。集成时 Azure GPT-5.6 meters 还没有发布，所以 operator 需要在自己的 Azure deployment 暴露模型后补齐价格。

这是正确的默认策略：路线准备好，但不编造价格。

## 没有加入哪些 provider

并不是每个 provider catalog 在这次更新时都已经支持 GPT-5.6。

GMI Cloud 和 AWS Bedrock OpenAI catalog 没有加入，因为它们公开的 catalog 当时没有列出 GPT-5.6。Token Station 应该让模型路由更简单，而不是假装每个 surface 都在第一天支持所有模型。

## 通过 Token Station 试用 GPT-5.6

如果你已经在用 Token Station，GPT-5.6 现在就是另一个可以在 coding-agent 工作流里测试的模型路由。

想做简单 API 测试，可以从直接 OpenAI 路由开始。想评估终端 coding 任务，可以试 Codex 路由。工作流依赖 GitHub Copilot 支持目录时，可以试 Copilot 路由。

Token Station 给你一个统一位置来比较这些路由，而不用每次新模型发布都重写 agent stack。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
