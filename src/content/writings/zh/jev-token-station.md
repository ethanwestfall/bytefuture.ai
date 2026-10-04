---
slug: jev-token-station
lang: zh
title: "Jev 现已登陆 Token Station"
summary: "TypeSafe 推出的 Jev 是一款「仅做决策」的模型，返回的是带类型的概率而非文本，现已登陆 Token Station，无需排队等待。本文介绍取代聊天补全的原生端点、三种回答类型（Noul、Choice、Score）、定价情况，以及 TypeSafe 自己给出的速度与成本数据与独立实测结果的对比。"
category: product
date: 2026-10-03
cta: https://models.bytefuture.ai/intro.html
cover: blog/jev-token-station-cover.png
draft: false
---

Jev 现已在 Token Station 上线，模型标识为 `typesafe/jev-1.13.0`，`typesafe/jev-latest` 则始终指向最新版本。TypeSafe 自家平台目前仍在按等待名单逐步放量；而通过 Token Station，你可以用已经在使用的同一个密钥立即调用它，无需排队。

## 它不生成文本

Jev 是 TypeSafe 推出的首款「System One Model」（系统一模型），这个名字借用自丹尼尔·卡尼曼（Daniel Kahneman）所说的那种快速、直觉式的思维模式。聊天模型读取一段对话并写出回复，而 Jev 读取的是一段状态（纯文本、JSON 对象，或是一组消息构成的数组）以及一组带类型的问题，然后返回带类型的答案：一个概率、一个被选中的选项，或一个分数，每个答案都附带一个置信度数值。TypeSafe 将其描述为一次前沿智能函数调用：输入非结构化的状态，输出带类型的概率性决策。这里没有需要解析的生成文本，因为它根本不生成文本。

在一次发布演示中，TypeSafe 的创始人展示了 Jev 从一个起始维基百科页面出发，仅凭沿途找到的链接一路抵达目标页面：每一跳都有数百到数千个候选链接，每一次选择都不能凭空编造出一个并不存在的链接。这正是 Jev 为之设计的那类高基数决策场景：换作聊天模型给出自由文本答案，事后还得解析并校验，而且很可能根本无法通过校验。

这也是 Token Station 对 Jev 的路由方式与平台上其他模型都不同的原因。Jev 通过自己的端点 `/typesafe/v1/systemone` 回答请求，而不是走 OpenAI 兼容的聊天路由。如果你把请求发往 `/v1/chat/completions`、`/v1/responses` 或 `/v1/messages`，网关会返回 400 错误，并提示你改用原生端点。Jev 也完全不出现在 OpenAI 兼容的 `/v1/models` 列表中，它自己的模型目录位于 `/typesafe/v1/models`。这两点都是刻意为之：一个决策模型如果恰好与聊天模型共用同一套接口格式，正是那种最容易被悄无声息地用错的情况。

## 三种提问方式

每个请求都会发送一个 `state`，以及一组带名称的 `questions`，每个问题都有一个 `type`。一共有三种类型。

**Noul** 以概率而非布尔值的形式回答是或否：

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": "Every customer has been unable to sign in for 30 minutes. Please restore service immediately.",
    "questions": {
      "urgent": {
        "type": "noul",
        "instructions": "Does this incident require immediate action?",
        "criteria": {
          "true": "An ongoing service outage needs immediate action",
          "false": "A routine request that can wait"
        }
      }
    }
  }'
```

**Choice** 从最多 255 个带标签的选项中选出一个键，并在给出选择的同时，返回覆盖全部选项的概率分布：

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": {
      "ticket": "My card was charged twice for the same invoice. Please refund the duplicate charge.",
      "account": {"plan": "business", "invoice_id": "example-invoice-001"}
    },
    "questions": {
      "team": {
        "type": "choice",
        "instructions": "Which team should handle the ticket?",
        "criteria": {
          "billing": "Invoices, charges and refunds",
          "technical": "Service outages, software bugs and integrations",
          "sales": "New purchases and plan upgrades"
        }
      }
    }
  }'
```

**Score** 依据一份包含两到十个等级的有序评分标准对状态进行评分，结果是该标准上一个按概率加权的小数位置，而不是一个整数：

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": [
      {"role": "customer", "content": "The checkout service fails for every customer."},
      {"role": "operator", "content": "Confirmed: all purchases have failed for the last 20 minutes."}
    ],
    "questions": {
      "impact": {
        "type": "score",
        "instructions": "Rate the current operational impact described in these reports.",
        "criteria": [
          "No disruption: all functions work normally",
          "Partial disruption: some customers or functions are affected",
          "Complete outage: a critical function fails for all customers"
        ]
      }
    }
  }'
```

单次请求可以混合使用全部三种类型，因此对 `/typesafe/v1/systemone` 的一次调用，就能在一次推理中完成工单路由、严重程度评分，以及是否紧急的判断，而不必拆成三次。

## 规格

| | |
|---|---|
| 上下文窗口 | 32,000 tokens |
| 每个问题的 Choice 选项数 | 最多 255 个 |
| 每个问题的 Score 等级数 | 2 到 10 级 |
| 延迟 | 端到端 70-500ms（TypeSafe 数据） |
| 训练方式 | Reinforcement Learning for Calibrated Decisions（RLCD，校准决策强化学习） |

## 定价

| | 输入 | 输出 |
|---|---|---|
| Jev | $0.042/M | 免费 |

由于实际上没有需要生成的内容，输出端自然也就没有费用。Token Station 上已有的每一款聊天模型，仅输入端的单 token 价格就都比它高，从 GPT-6 Luna 的 $0.10/M 到 Claude Fable 5.1 的 $10/M 不等。Token Station 原价透传 TypeSafe 的费率，不加价。

## 它真正派上用场的地方

把分类或路由这类决策丢给一个完整的聊天模型去做当然可行，但这意味着要为一个本来就只会是少数几个选项之一的答案，去等待一连串按顺序生成的 token。这种取舍在以下几个场景中体现得尤为直接：

- **模型路由**：在决定一个请求是否真的需要前沿模型之前，先对其难度进行分类，而不是用一次完整的 Opus 级别调用，去区分「重置我的密码」和「迁移我们的计费架构」这两类请求。
- **工具调用把关**：在一次有风险的工具调用（shell 访问、一笔支出、一次删除）执行之前，对其进行批准、拦截或升级处理，并给出一个代码可以直接设阈值判断的置信度分数。
- **RAG 重排序**：以足够快的速度为查询与文本块之间的相关性打分，从而对庞大的候选集合进行重排序，把聊天模型的上下文预算留给综合整理，而不是花在搜索上。
- **工单与请求分诊**：按队列、优先级或负责人对大批量、低创造性的流量进行路由，而不必为每一条都开启一次完整对话。
- **循环与轨迹检查**：判断一个智能体刚执行的那一步是否真的取得了进展，尽早叫停一个失控的循环，而不是继续在上面消耗轮次。

TypeSafe 自己的基准测试声称，在这类任务上，相比同类 LLM 最高可达 193.6 倍的速度和 444.6 倍更低的成本，对比基准是 GPT-6 Astra 与 Claude Fable 5.1 的平均水平。这两款模型都已经在 Token Station 上线，如果你想自己验证，只需换一个密钥就能对比。发布周的独立追踪数据则呈现出一个更保守的结果：在数千条用户上报的结果中，中位数大约是快 7 倍、便宜 30 倍，而不是 193 倍和 444 倍。在合适的工作负载上，这仍然是一个实实在在的优势，只是比宣传数字要小一些。

TypeSafe 还将其称为 0% 的幻觉率，在一个狭义的层面上这是准确的：`choice` 类型的答案会与你提供的 `criteria` 键进行核对，因此 Jev 不可能返回一个你没有提供过的选项。这保证的是答案有效，而不是答案正确。它本质上是一个输出约束比聊天模型更严格的分类器，仍然值得你用自己的数据，像评估其他任何模型一样去评估它。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：无需绑卡，首次充值可获 100% 匹配、最高 $50 奖励。导出你的密钥，直接向 `typesafe/jev-1.13.0` 发送你的第一个请求，无需排队等待。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
