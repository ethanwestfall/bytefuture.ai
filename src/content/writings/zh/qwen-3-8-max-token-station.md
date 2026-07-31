---
slug: qwen-3-8-max-token-station
lang: zh
title: "上手实测：在 Token Station 跑 Qwen 3.8-Max"
summary: "Alibaba 只是预览了 Qwen 3.8-Max（2.4T 参数、稀疏 MoE、多模态），还没公布 benchmark。于是我们在 Token Station 上用同样的三道题跑了 qwen3.8-max-preview、kimi-k3 和 gpt-5.6。三者全部通过；Qwen 3.8-Max 的延迟最稳。"
category: product
date: 2026-07-28
cta: https://models.bytefuture.ai/intro.html
cover: "blog/qwen-3-8-max-token-station-cover.png"
---

Alibaba 在 2026 年 7 月 19 日的世界人工智能大会（WAIC）上预览了 Qwen 3.8-Max：2.4 万亿参数、稀疏 Mixture-of-Experts、原生多模态，号称仅次于 [Claude Fable 5](/blog/try-claude-fable-5-in-codex-openclaw-and-pi-zh.html)。但它目前还没有 benchmark 表、没有 model card，上下文窗口也没确认。

我们没有照搬厂商说法，而是自己跑了个小对比：在 [Token Station](https://models.bytefuture.ai/intro.html) 上用同一个 key、temperature 0，把同样的三道题分别发给 `bailian-intl/qwen3.8-max-preview`、`kimi/kimi-k3` 和 `openai/gpt-5.6`。两道是编程题、答案可验证，一道是概率题。

## 三道题

- **接雨水（Trapping rain water）。** 经典双指针题；用已知输入验证答案。
- **概率。** 从 3 红、4 蓝、5 绿共 12 个球里不放回地抽 3 个，求三个颜色全不相同的概率。精确答案：3/11。
- **找 bug。** 一个 `merge_sorted` 函数少了一行；修好后必须通过给定测试用例。

每个答案都自动判定：代码提取后直接运行，分数做字符串匹配。

## 结果

| 题目 | qwen3.8-max-preview | kimi-k3 | gpt-5.6 |
|---|---|---|---|
| 接雨水 | 通过，7.6s | 通过，12.5s | 通过，5.3s |
| 概率（3/11） | 通过，7.3s | 通过，13.8s | 通过，13.5s |
| 找 bug | 通过，8.0s | 通过，31.5s | 通过，4.2s |

九道全过。对这种规模的题，这只是能力下限：这里的每个 frontier 模型都能解。真正有信息量的是各自的延迟和 token 用量。

Qwen 3.8-Max 最稳。它每道题都在 7 到 8 秒内完成，reasoning token 用量稳定在 142 到 165，不分题目难易。[GPT-5.6](/blog/gpt-5-6-token-station-zh.html) 在编程题上最快最简洁（4 到 5 秒，output 不到 120 token），但概率题花了 13.5 秒。[Kimi K3](/blog/kimi-k3-token-station-zh.html) 简单题 reasoning 最省（55 到 86 token），但在找 bug 那题上猛涨到 294 reasoning token、耗时 31.5 秒，而另外两个保持平稳。

老实说：在一组小规模、可自动判定的题上，这个还在 preview 的 Qwen 3.8-Max 和两个已正式发布的 frontier 模型打平，而且延迟最稳。这值得你拿自己的 workload 再试，但不是定论。

## 还没确认的部分

上面是我们的测试。其余规格都来自 Alibaba，其中一部分仍属单方宣称。

- **2.4 万亿参数，稀疏 MoE。** 每 token 激活参数未披露，而那才是决定 serving 成本的数字。
- **多模态。** 文本+视觉已确认。完整模态清单（视频、文档、语音、图像生成）未确认，没有 spec sheet。
- **上下文窗口：未公布。**
- **"仅次于 Fable 5"。** Alibaba 自己的原话，基于内部评测。没有 benchmark 表、没有 model card。参照：前代 Qwen 3.7-Max 在 GPQA Diamond 拿 92.4、SWE-bench Verified 80.4、Terminal-Bench 2.0 69.7。
- **开源。** Alibaba 说 Qwen 3.8"很快开源权重"，但没给日期也没给 license。Max 系列至今闭源；开源路线则单独延续到 Qwen 3.6。

按 2.4 万亿参数算，它是已知第二大公开模型，仅次于同周开源的 Moonshot Kimi K3（2.8 万亿）。

## 在 Token Station 上试

endpoint 是标准的 Token Station OpenAI 兼容 API：

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bailian-intl/qwen3.8-max-preview",
    "messages": [
      {"role": "user", "content": "Refactor this function and explain the change."}
    ]
  }'
```

Token Station 也提供 Anthropic API 形态，所以同一个 route 可以直接接进 Claude Code。

## 接进你的 coding agent

在 Claude Code 里把它放进 Opus slot：

```bash
# Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="bailian-intl/qwen3.8-max-preview"
export ANTHROPIC_DEFAULT_SONNET_MODEL="bailian-intl/qwen3.8-max-preview"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="bailian-intl/qwen3.8-max-preview"
export CLAUDE_CODE_SUBAGENT_MODEL="bailian-intl/qwen3.8-max-preview"

claude
```

在 Codex 里设为默认 model：

```bash
mkdir -p ~/.codex
cat > ~/.codex/config.toml <<'EOF'
model = "bailian-intl/qwen3.8-max-preview"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF

export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex
```

## 价格

Qwen 3.8-Max 处于 preview，Alibaba 还没公布标准 API 定价。Token Station 以零 markup 透传 provider 价格；当前每百万 token 单价见 dashboard。$1 注册额度够跑一次初步评估。

要点：

- Base URL（OpenAI 兼容）：`https://models.bytefuture.ai/v1`
- Base URL（Anthropic 兼容）：`https://models.bytefuture.ai`
- Model：`bailian-intl/qwen3.8-max-preview`
- API key：以 `gw-` 开头，在 [Token Station dashboard](https://models.bytefuture.ai/dashboard) 获取

[试用 Token Station](https://models.bytefuture.ai/intro.html)
