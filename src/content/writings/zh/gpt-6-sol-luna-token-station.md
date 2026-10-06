---
slug: gpt-6-sol-luna-token-station
lang: zh
title: "GPT-6 Sol 与 Luna 现已登陆 Token Station"
summary: "OpenAI 的 GPT-6 Sol 与 GPT-6 Luna 已在 Token Station 上线，价格远低于各自的 GPT-5.6 同名模型，并延续了 GPT-6 Astra 在智能体能力上的提升。本文介绍规格参数、定价、对比 Claude Opus 5 与 Claude Fable 5 的基准测试表现，以及 Sol 和 Luna 相对 Astra 的定位。"
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/gpt-6-sol-luna-token-station-cover.png
draft: false
---

GPT-6 Sol 与 GPT-6 Luna 现已在 Token Station 上线，模型标识分别为 `openai/gpt-6-sol` 和 `openai/gpt-6-luna`，通过已经在为 GPT-6 Astra 和 GPT-5.6 系列提供服务的同一个 OpenAI 兼容端点接入。

Astra 作为 OpenAI 的 GPT-6 旗舰版本率先发布，定价面向最高难度的智能体与计算机操作类工作。Sol 和 Luna 在三周后发布，把 Astra 底层能力的大部分带入了更便宜、更快的档位：Sol 是面向交互式与智能体编程的均衡路线，Luna 则是该系列中面向高并发、轻量级任务的最低成本选项。

## 有哪些新变化

与各自的 GPT-5.6 同名模型相比，Sol 的标价下降 60%-67%，Luna 的标价下降 90% 以上（详见下文定价部分）。OpenAI 自己发布的基准测试把这一提升定位为成本效率的改善，而非能力上的直接跃升：

- **AutomationBench 1.0.6**（覆盖销售、市场营销、运营、客服、财务和人力资源等 47 种工具的业务工作流）：Sol 在 `xhigh` 推理强度下得分 33.2%，单任务成本 $0.27；而 Claude Opus 5 在 max 强度下得分 26.9%，成本约为前者的 11 倍。
- **Agents' Last Exam**：Sol 在 max 强度下达到 56.4%，略微超过 Claude Opus 5 记录中的最佳成绩，单任务成本却低约 60%。
- **DeepSWE v1.1**（真实代码库中的软件工程任务）：Sol 在 max 强度下得分 68.8%，与 Claude Fable 5 的 69.9% 仅相差 1.1 个百分点，单任务成本却低约 80%。Luna 在同一基准测试中、max 强度下达到 66.6%，与 Claude Opus 5 和 Claude Fable 5 在 medium 强度下的成绩相当，单任务成本则分别低 93% 和 96%。

这并不意味着 Sol 或 Luna 在每一项上都全面强于 GPT-5.6 Sol 或 Astra。它们的卖点在于成本：以相近或接近的结果，换取一小部分的价格，这对高并发的智能体任务分发而言，比单次高难度调用更有意义。

## 规格参数

| | GPT-6 Sol | GPT-6 Luna |
|---|---|---|
| 上下文窗口 | 1.05M tokens | 1.05M tokens |
| 最大输入 | 922K tokens | 922K tokens |
| 最大输出 | 128K tokens | 128K tokens |
| 支持模态 | 输入文本与图像，输出文本 | 输入文本与图像，输出文本 |
| 知识截止日期 | 2026年4月20日 | 2026年5月18日 |
| 推理强度 | none, low, medium（默认）, high, xhigh, max | none, low, medium（默认）, high, xhigh, max |

Luna 的知识截止日期比 Sol 更晚，甚至比 Astra（2026年4月30日）更晚。同一系列中最便宜的档位反而拥有最新的知识，这并不常见，但 OpenAI 这次确实是这样发布的。

## 立即尝试

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-6-sol",
    "messages": [
      {"role": "user", "content": "Plan a safe refactor for a pricing module and list the tests to run."}
    ]
  }'
```

把 `openai/gpt-6-sol` 换成 `openai/gpt-6-luna`，就能将同一个请求切换到更便宜的档位；换成 `openai/gpt-6-astra`，则可以检验旗舰路线在你自己的任务上是否真的值回更高的价格。

## 定价

| 模型 | 输入 | 输出 | 缓存输入 | 缓存写入 |
|---|---|---|---|---|
| GPT-6 Sol | $2/M | $10/M | $0.20/M | $2.50/M |
| GPT-6 Luna | $0.10/M | $0.50/M | $0.01/M | $0.125/M |
| GPT-6 Astra | $10/M | $50/M | $1/M | $12.50/M |
| GPT-5.6 Sol（`openai/gpt-5.6`） | $5/M | $30/M | $0.50/M | $6.25/M |
| GPT-5.6 Luna | $1/M | $6/M | - | - |

Token Station 原价透传这些费率，不加价，按请求计量。

## Sol 与 Luna 分别适合什么场景

- **GPT-6 Sol**：适合需要仔细、多步骤验证的交互式与智能体编程工作，是介于 Luna 的速度与 Astra 长周期智能体能力之间的中间档位。
- **GPT-6 Luna**：适合高并发、低风险的工作：分诊、分类、探索性尝试，以及更大型智能体中的子任务分发。上文的 DeepSWE 结果表明，它能以一小部分的成本，弥补与更昂贵模型之间的大部分差距。
- **GPT-6 Astra**：仍然是长时间智能体编程会话、计算机操作以及高强度终端运维工作的首选路线，它相对 GPT-5.6 系列的领先优势在这些场景中最为明显。

一种实用的路由方式：探索和任务分发默认使用 Luna，实际实现与验证工作切换到 Sol，而把 Astra 留给那些需要长时间运行且不能偏离任务轨道的会话。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：无需绑卡，首次充值可获 100% 匹配、最高 $50 奖励。导出你的密钥，把现有的 OpenAI 兼容集成指向 `openai/gpt-6-sol` 或 `openai/gpt-6-luna` 即可。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
