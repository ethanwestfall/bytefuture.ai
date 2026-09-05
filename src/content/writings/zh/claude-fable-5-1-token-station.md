---
slug: claude-fable-5-1-token-station
lang: zh
title: "Claude Fable 5.1 现已登陆 Token Station"
summary: "Anthropic 目前能力最强的模型已作为 anthropic/claude-fable-5-1 在 Token Station 上线：价格与 Claude Fable 5 相同，缓存读取费用降至四分之一，长时间运行的智能体编码与研究能力也更强。本文介绍具体变化、定价，以及何时应选择它而非 Claude Opus 5。"
category: product
date: 2026-09-05
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-fable-5-1-token-station-cover.png
draft: false
---

Claude Fable 5.1 现已在 Token Station 上线，路由为 `anthropic/claude-fable-5-1`，与已经承载 Claude Opus 5 和 Claude Sonnet 5 的 Anthropic 兼容接口相同。

Anthropic 官方的建议值得原文重申，而不是一笔带过：对于大多数工作负载，应首先使用 Claude Opus 5。只有在需要高强度推理和长周期智能体任务时，或者在提高 Opus 5 的推理强度后仍无法通过你的评测时，才应该选用 Fable 5.1。它是为那困难的 10% 任务准备的模型，而不是一次全面升级。

## 相较 Claude Fable 5 的变化

Fable 5.1 在输入和输出价格不变的基础上对 Fable 5 进行了扩展。具体改进如下：

- **缓存读取费用降至 $0.25/M**，为 Fable 5 的 $1/M 的四分之一。对于每一轮都要重新发送不断增长的对话或代码库上下文的智能体工作负载来说，这才是真正影响账单的变化，比任何能力提升都更明显。
- **更强的长时间运行智能体编码与多步骤研究能力**，文档、表格和幻灯片生成质量也有所提升。
- **按消息设置推理强度**（测试版）：可在对话中途调整推理深度，且不会使提示缓存失效。
- **工具调用之间的进度更新**（测试版）：在长时间的智能体运行过程中提供可读的状态说明，而不是让你静默等待。
- **限定单轮的系统消息**（测试版）：操作员指令仅在当前一轮生效，之后会自动从对话记录中清除。

如果你正在迁移为 Fable 5 编写的代码，还有三处变化会导致中断：强制工具调用（`tool_choice: "any"` 或指定具体工具）现在会返回错误，思考块与生成它的模型绑定，编辑对话中较早轮次的内容会使该轮次的思考块失效。这些都不会影响首次通过 Token Station 的接入，只有在移植现有的 Fable 5 程序时才需要关注。

## 规格

| | |
|---|---|
| 上下文窗口 | 1M tokens |
| 最大输出 | 128K tokens |
| 思考模式 | 自适应，始终开启 |
| 默认强度 | 高 |
| 知识截止时间 | 2026年6月 |

## 试用

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-fable-5-1",
    "messages": [
      {"role": "user", "content": "Audit this repository for a safe path to remove the deprecated auth module, and list every call site that needs to change."}
    ]
  }'
```

在同一请求中将 `anthropic/claude-fable-5-1` 替换为 `anthropic/claude-opus-5`，看看在正式采用之前，这条更贵的路线是否真的能在你的工作负载上物有所值。

## 定价

| | 输入 | 输出 | 缓存读取 | 缓存写入（5分钟） | 缓存写入（1小时） |
|---|---|---|---|---|---|
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |
| Claude Opus 5 | $5/M | $25/M | - | - | - |
| Claude Sonnet 5 | $2/M | $10/M | - | - | - |

Token Station 直接透传这些费率，不加价，按请求计量，并可在你自己的控制台中查看。

## 何时该选用它

Fable 5.1 物有所值的场景，是那些失败方式表现为过早放弃或思路中断的任务，而不是那些只是难以一次性算出答案的任务：

- **长时间运行的智能体编码**：跨多个文件的重构、全代码库审计，以及需要在大量工具调用中串联规划、实现和修复测试的会话。
- **多步骤研究**：需要汇总来自大量信息源的发现，而较短的上下文窗口或耐心不足的模型可能会过早地做出总结。
- **文档、表格和幻灯片工作**：需要在生成篇幅长、结构化的输出内容的同时，持续关注大量原始素材。

对于单个高难度问题、分类任务，或者大多数日常聊天和编码场景，将 Claude Opus 5 调至更高推理强度是更经济的起点，Anthropic 自己的对比表也印证了这一点：Opus 5 拥有与 Fable 5.1 相同的 1M 上下文和 128K 输出上限，价格却只是它的一半。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：免费获得 $1 额度，无需绑卡，首次充值最高可获得 $50 奖励额度。导出你的密钥，将现有的 Anthropic 兼容接入指向 `anthropic/claude-fable-5-1` 即可。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
