---
slug: claude-opus-5-5-token-station
lang: zh
title: "Claude Opus 5.5 现已登陆 Token Station"
summary: "Anthropic 的新 Opus 已作为 anthropic/claude-opus-5-5 在 Token Station 上线：价格比 Claude Opus 5 便宜 20%，缓存读取费用降低 60%，基准测试成绩追平甚至超过价格高得多的 Claude Fable 5.1。本文介绍具体变化、定价、会导致中断的 API 变更，以及为什么这是一次直接的升级，而非新的高价档位。"
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-opus-5-5-token-station-cover.png
draft: false
---

Claude Opus 5.5 现已在 Token Station 上线，模型标识为 `anthropic/claude-opus-5-5`，通过已经在为 Claude Opus 5、Claude Sonnet 5 和 Claude Fable 5.1 提供服务的同一个 Anthropic 兼容路由接入。

它的定位和 Fable 5.1 不同，后者是留给最难的那 10% 任务、价格更高的选项。Opus 5.5 则是 Opus 5 在同一档位上的直接继任者，价格更低，而且 Anthropic 自己的基准测试显示，它在大多数智能体和知识型工作任务上追平甚至超过价格高得多的 Fable 5.1，单 token 成本却低 60%。

## 相较 Claude Opus 5 的变化

- **价格降低 20%**：每百万输入/输出 token 为 $4/$20，此前为 $5/$25。
- **缓存读取费用为 $0.20/M**，比 Opus 5 的 $0.50/M 低 60%。缓存写入费用也有所下降：$5/M（5分钟）和 $8/M（1小时），此前分别为 $6.25/M 和 $10/M。
- **输出生成速度比 Opus 5 快 30% 以上**，延迟档位保持不变。
- **知识更新**：知识截止时间为 2026年6月，此前 Opus 5 为 2026年5月。

如果你正在迁移为 Opus 5 编写的代码，有四处变化会导致中断：思考功能在任何推理强度下都无法再被关闭（强度现在是唯一的控制项，且默认值为 medium 而非 high，如果你想保留 Opus 5 原来的默认行为，需要显式设置强度）；强制工具调用（`tool_choice: "any"` 或指定具体工具）现在会返回错误；思考块与生成它的模型及对话绑定；在 Claude API 和 Google Cloud 上，旧版的 `computer_20251124` 计算机操作工具不再被接受（请改用 `computer_toolset_20260801`）。这些都不会影响首次通过 Token Station 的接入，只有在移植现有的 Opus 5 程序时才需要关注。

## 规格

| | |
|---|---|
| 上下文窗口 | 1M tokens |
| 最大输出 | 128K tokens |
| 思考模式 | 自适应，始终开启 |
| 默认强度 | 中 |
| 知识截止时间 | 2026年6月 |

## 试用

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-opus-5-5",
    "messages": [
      {"role": "user", "content": "Audit this repository for a safe path to remove the deprecated auth module, and list every call site that needs to change."}
    ]
  }'
```

在同一请求中把 `anthropic/claude-opus-5-5` 换成 `anthropic/claude-opus-5`，在正式切换之前，先确认这次升级在你自己的工作负载上确实带来了实质性的提升。

## 定价

| | 输入 | 输出 | 缓存读取 | 缓存写入（5分钟） | 缓存写入（1小时） |
|---|---|---|---|---|---|
| Claude Opus 5.5 | $4/M | $20/M | $0.20/M | $5/M | $8/M |
| Claude Opus 5 | $5/M | $25/M | $0.50/M | $6.25/M | $10/M |
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |

Token Station 直接透传这些费率，不加价，按请求计量，并可在你自己的控制台中查看。

## 相较 Claude Fable 5.1 与 GPT-6 Astra 的表现

Anthropic 自己公布的基准测试显示，Opus 5.5 在大多数测试任务上领先于 Fable 5.1，价格却不到后者的一半：

- **Terminal-Bench 4.0**：66.4%，在 Anthropic 自己的评测中领先于 Fable 5.1 的 55.8% 和 GPT-6 Astra 的 57.9%。
- **GDPval-AA v2.1**（知识型工作）：1846 Elo，比 Fable 5.1 的 1735 高出 100 多分，比 Astra 的 1542 高出 300 多分。
- **Humanity's Last Exam**：67.7%，领先于 Fable 5.1 的 65.6% 和 Astra 的 57.2%。
- **OSWorld 2.1**（计算机操作）：81.8%，领先于 Fable 5.1 的 80.7%。

这并非全面胜出：Astra 在 Terminal-Bench-Science（64.6% 对 Opus 5.5 的 58.7%）和 AutomationBench（41.4% 对 40.0%）上仍然领先，但差距都不大。不过在大多数智能体编程、计算机操作和知识型工作场景中，Opus 5.5 如今是这两个默认模型里更强也更便宜的那一个。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：无需绑卡，首次充值可获 100% 匹配、最高 $50 奖励。导出你的密钥，把现有的 Anthropic 兼容集成指向 `anthropic/claude-opus-5-5` 即可。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
