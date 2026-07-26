---
slug: "kimi-k3-token-station"
lang: "zh"
title: "Kimi K3 是首个进入三万亿参数级别的开源模型，现已可在 Token Station 上免费试用"
summary: "Moonshot 的 Kimi K3 拥有 2.8 万亿参数和 100 万 token 的上下文窗口，是首个进入三万亿参数级别的开源模型。现已作为 kimi/kimi-k3 上线 Token Station，按标价提供，零加价。"
category: "tutorial"
date: "2026-07-25"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

Moonshot AI 的 Kimi K3 拥有 2.8 万亿参数，是首个进入三万亿参数级别的开源模型。Moonshot 表示，在过去 12 个月中有 9 个月，Kimi 系列模型都保持着开源模型规模的领先地位。K3 大幅延续了这一纪录。

规模本身就足以让 K3 引人注目，但真正让它实用的是其余的规格：100 万 token 的上下文窗口、原生视觉理解能力，以及专为长周期编码、知识工作和推理设计的架构。完整的模型权重将于 2026 年 7 月 27 日前发布；API 现已在 Moonshot 的平台上线，今天也已登陆 Token Station。

## 底层架构有哪些新变化

K3 基于 Kimi Delta Attention（KDA，一种混合线性注意力机制）构建，并结合了 Attention Residuals（AttnRes），以帮助信息在更长的序列和更深的模型中顺畅流动。在混合专家（MoE）方面，Moonshot 的 Stable LatentMoE 框架进一步提升了稀疏度：K3 每个 token 仅激活 896 个专家中的 16 个。加上训练方法和数据配方的改进，Moonshot 表示 K3 的整体扩展效率约为其前代 Kimi K2 的 2.5 倍。

有两类工作负载获得了明确的设计侧重：

- **长周期编码。** K3 的设计目标是在极少的人工监督下维持长时间运行的工程任务：理解大型代码库、协调终端工具，并将软件工程与视觉推理相结合（在前端开发、游戏开发和 CAD 中使用截图和视觉反馈）。
- **知识工作。** Moonshot 表示，在基于真实用户与智能体协作中反复出现的模式所构建的内部评估中，K3 取得了持续的提升，这是公开基准测试无法完全体现的。

## K3 在基准测试中的表现

Moonshot 的表态很直接：K3 的整体表现仍落后于其对比的两个最强闭源模型 Claude Fable 5 和 GPT-5.6 Sol，但在多项基准测试中超过了 Claude Opus 4.8。以下是两个已公布的数字：

- **DeepSWE：67.3**，使用 mini-SWE-agent 测试框架。
- **BrowseComp：90.4**，使用完整的 100 万 token 上下文，且不进行上下文管理。

案例研究正是 100 万上下文和长周期设计在实践中体现的地方。在四项 NVIDIA Hopper GPU 内核优化任务中，K3 的表现与 Fable 5（借助回退机制）相当，并超过了 Opus 4.8、GPT-5.6 Sol 和 GPT-5.5。在一项编译器任务中，它从零构建了一个类 Triton 编译器（MiniTriton），性能达到或超过 Triton 和 `torch.compile`，并用它稳定地完成了端到端的 nanoGPT 训练。在一项天体物理研究任务中，它处理了 300 多个物态方程，用大约两小时完成了团队称手动通常需要一到两周才能完成的工作。

## 在 Token Station 上免费试用 Kimi K3

K3 已经上线 [Token Station](https://models.bytefuture.ai/intro.html)，模型 ID 为 `kimi/kimi-k3`，按 Moonshot 的标价、零加价提供：**未命中缓存时输入每百万 token 3.00 美元，命中缓存时每百万 token 0.30 美元，输出每百万 token 15.00 美元**，并拥有完整的 1,048,576 token 上下文窗口。K3 的思考模式无法关闭，默认使用最高推理强度，因此推理 token 会按输出计费；如果想要更快、更便宜的响应，可以在请求中把 `reasoning_effort` 设为 `low`。

Token Station 省去了一件事：在 Moonshot 自己的控制台上，K3 需要先完成至少 1 美元的充值才能解锁。而在 Token Station 上，你的注册赠金就能立即解锁，无需单独的 Moonshot 账号或充值。

免费即可开始。[注册](https://models.bytefuture.ai/signup)即可获得 1 美元赠金，无需信用卡。首次充值后还能额外获得最多 50 美元的奖励赠金。以下是 K3 与 Token Station 上其他模型的价格对比：

| 模型 | 输入 / 100万 | 输出 / 100万 | 上下文 |
|---|---|---|---|
| `kimi/kimi-k3` | $3.00* | $15.00 | 1,048,576 |
| `kimi/kimi-k2.7-code` | $0.95 | $4.00 | 256K |
| `glm/glm-5.2` | $1.40 | $4.40 | 1M |
| `anthropic/claude-opus-4-8` | $5.00 | $25.00 | 1M |
| `openai/gpt-5.5` | $5.00 | $30.00 | 1M |
| `anthropic/claude-fable-5` | $10.00 | $50.00 | 1M |

\* 未命中缓存时的费率。重复出现的上下文将按上文所述的 0.30 美元缓存命中费率计费。

把你已经在用的编码工具指向 `kimi/kimi-k3`，让它跑一跑你的真实工作。

### Claude Code

Claude Code 通过环境变量读取模型和端点配置。将所有层级都通过 Token Station 路由到 K3：

```bash
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="kimi/kimi-k3"
export ANTHROPIC_DEFAULT_SONNET_MODEL="kimi/kimi-k3"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi/kimi-k3"
export CLAUDE_CODE_SUBAGENT_MODEL="kimi/kimi-k3"

claude
```

### Codex

将 Token Station 配置为提供方，并将 K3 设为模型：

```bash
mkdir -p ~/.codex
cat > ~/.codex/config.toml <<'EOF'
model = "kimi/kimi-k3"
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

### OpenClaw

将 Token Station 注册为提供方，并将 K3 设为默认模型：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "token-station": {
        "baseUrl": "https://models.bytefuture.ai/v1",
        "apiKey": "${TOKEN_STATION_API_KEY}",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "kimi/kimi-k3",
            "name": "Kimi K3 (Token Station)",
            "contextWindow": 1048576,
            "maxTokens": 131072
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/kimi/kimi-k3" }
    }
  }
}
```

## 需要留意的一些细节

- **`max_completion_tokens` 的上限比默认值高得多。** 默认值为 131,072，但对于输出量大的任务，最高可以设置到 1,048,576。
- **视觉输入需要 base64 或上传后的文件 ID。** 图片和视频都不支持公开 URL。可以将图片以 base64 内联发送，也可以通过 Files API（`ms://<file-id>`）上传这两种媒体类型；视频建议使用文件上传方式。
- **网页搜索功能正在更新中。** Moonshot 目前不建议在生产环境的工作流中使用 K3 的官方网页搜索工具。
- **权重会在 API 开放后几天才发布。** K3 是开源模型，但完整权重要到 2026 年 7 月 27 日才会发布。上述内容今天就可以通过托管 API 使用；自托管则要稍晚一些。

一把密钥，你已经在用的工具，再加上迄今为止发布过的最大规模开源模型：2.8 万亿参数。如果 K3 在你的代码库上表现出色，免费注册就是你唯一需要付出的成本。

从这里开始：[models.bytefuture.ai](https://models.bytefuture.ai/signup)
