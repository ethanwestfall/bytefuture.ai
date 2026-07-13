---
slug: gpt-5-6-token-station
lang: zh
title: "GPT-5.6 接入 Token Station：一个模型家族，三种 coding-agent 路由"
summary: "GPT-5.6 已在 Token Station 上线，覆盖直接 OpenAI-compatible API、OpenAI Codex 和 GitHub Copilot 路由。本文说明如何在 Sol、Terra、Luna 和 Claude Fable 5 之间做 coding-agent 选择。"
category: model-launches
date: 2026-07-13
cta: https://models.bytefuture.ai/intro.html
---

GPT-5.6 已经接入 Token Station。

这当然意味着又多了一个新模型 ID，但真正重要的不是 catalog 里多一行。重要的是，同一个 GPT-5.6 家族现在可以出现在 coding-agent 团队已经在用的工作界面里：直接的 OpenAI-compatible API、OpenAI Codex 路由，以及 GitHub Copilot 路由。

对 agent 开发者来说，采用新模型的问题就变了。你不需要在第一天就决定是否围绕新模型重建整套 stack。你可以把 GPT-5.6 当成一个 route 来试，比较它在哪些环节有价值，同时保持工作流其他部分稳定。

## 现在可用的 GPT-5.6 路由

Token Station 暴露直接 OpenAI-compatible GPT-5.6 路由：

- `openai/gpt-5.6`
- `openai/gpt-5.6-sol`
- `openai/gpt-5.6-terra`
- `openai/gpt-5.6-luna`

也暴露 OpenAI Codex 路由：

- `openai-codex/gpt-5.6`
- `openai-codex/gpt-5.6-sol`
- `openai-codex/gpt-5.6-terra`
- `openai-codex/gpt-5.6-luna`

以及 GitHub Copilot 已发布支持的路由：

- `github-copilot/gpt-5.6-sol`
- `github-copilot/gpt-5.6-terra`
- `github-copilot/gpt-5.6-luna`

这给开发者三个实际测试面，而不是一个抽象的发布公告：直接 API 用于内部 agent 和 harness，Codex 用于终端 coding workflow，Copilot route 用于已经在 GitHub developer tooling 里的团队。

## 为什么 coding agent 需要按 route 测试

Coding agent 不是一次 prompt。真实 session 可能包括规划、代码库搜索、生成 patch、修测试、代码审查和子任务分发。不同步骤的成本结构和风险等级都不一样。

所以，一个新模型家族在有多个 route 和 tier 时才更有用。你可以把最贵的 tier 用在最需要推理的地方，用便宜变体跑迭代，并在比较不同工具表现时保持 endpoint 稳定。

Token Station 把模型选择变成显式 route。你不需要换 SDK、改多个 provider config、重建 agent plumbing；改 model route 就可以测试。

## 一个 endpoint 开始实验

Endpoint 保持简单：

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer ${TOKEN_STATION_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-sol",
    "messages": [
      {"role": "user", "content": "Explain the tradeoff between cache writes and cached input tokens for a coding agent."}
    ]
  }'
```

想试另一个 surface，只改 model route：

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

重点不是记住更多 provider-specific setup，而是让 route 可以快速替换，同时 agent stack 保持稳定。

## 价格、cache 计费和长上下文

Token Station 的 GPT-5.6 支持包括 base input、cached input、cache-write、output，以及 272K input tokens 以上的 long-context tier。

这对 coding agent 很重要，因为 repo context 会反复出现。Agent 会不断发送文件摘要、diff、测试输出、任务状态和之前的计划。Prompt caching 可以降低这些循环的成本，但前提是 cache write 和 cached read 被分开计费。

Token Station 会规范 GPT-5.6 的 `cache_write_tokens` 用法，让 cache write 进入 cache-creation bucket，而不是被重复算成普通 input tokens。

当前实际价格框架是：

- GPT-5.6 Sol / `openai/gpt-5.6`：$5/M input、$30/M output、$0.50/M cached input、$6.25/M cache writes，适用于 272K input tokens 以内。
- GPT-5.6 Terra：$2.50/M input、$15/M output，适用于 272K input tokens 以内。
- GPT-5.6 Luna：$1/M input、$6/M output，适用于 272K input tokens 以内。
- Claude Fable 5：$10/M input、$50/M output、$1/M cache reads、$12.50/M prompt-cache writes、$20/M one-hour cache writes。

超过 272K input tokens 后，GPT-5.6 使用 long-context tier：Sol 的 input 和 cached-input 价格翻倍，output 变为 $45/M；Terra 变为 $5/M input 和 $22.50/M output；Luna 变为 $2/M input 和 $9/M output。Claude Fable 5 在 Token Station 中配置为 1M context window，并使用常规 $10/$50 价格。

## 如何在 GPT-5.6 和 Claude Fable 5 之间选择

Claude Fable 5 仍然是 long-running coding agent 最直接的对比对象。它贵，但定位就是长时间 agentic work。GPT-5.6 的优势不同：OpenAI-native 模型家族、多种价格 tier，以及多个工作界面。

一个实用起点：

- 想通过直接 API 或 Codex-compatible path 测旗舰 GPT-5.6，用 GPT-5.6 Sol。
- 想用更便宜的中间 route 做反复 coding-agent 实验，用 GPT-5.6 Terra。
- 想用最低成本的 GPT-5.6 loop 做探索、triage 或 subtask fan-out，用 GPT-5.6 Luna。
- 明确想要 Anthropic 的 long-running-agent 行为，并接受更高 $10/$50 价格，用 Claude Fable 5。
- 当 workflow 比模型品牌更重要时，把它们放在 Token Station 里比较：规划、patch、修测试、PR review、长 repo-context session 可能适合不同 route。

这就是 route name 有价值的地方。你可以比较 `openai/gpt-5.6-sol`、`openai-codex/gpt-5.6-terra`、`github-copilot/gpt-5.6-luna` 和 `anthropic/claude-fable-5`，而不用为每个 provider 重写 agent。

## Azure 在哪里

这次更新也包含 Azure OpenAI GPT-5.6 preview 模板注释，以及通过 `azure_api_version = "v1"` 支持 Azure 的 `/openai/v1` surface。

这些模板没有用猜测价格直接启用。集成时 Azure GPT-5.6 meter 还没有发布，所以 operator 应该在自己的 Azure deployment 暴露模型后再填入价格。

这是正确默认值：route 可以先准备好，但不要编造价格。

## 没有添加什么

不是所有 provider catalog 在这次更新时都有 GPT-5.6。

GMI Cloud 和 AWS Bedrock OpenAI catalog 没有添加，因为它们公开 catalog 当时没有列出 GPT-5.6。Token Station 应该让 model routing 更容易，而不是假装每个 surface 第一天都支持每个模型。

## 在 Token Station 里试 GPT-5.6

如果你已经使用 Token Station，GPT-5.6 现在就是另一个可以放进 coding-agent workflow 测试的模型家族。

先用直接 OpenAI route 做简单 API 测试；用 Codex route 跑终端 coding task；如果 workflow 依赖 GitHub Copilot 的 supported model catalog，就试 Copilot route。

Token Station 让你在一个地方比较这些 route，而不用为每次模型发布重写 agent stack。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
