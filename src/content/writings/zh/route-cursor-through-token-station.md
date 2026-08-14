---
slug: "route-cursor-through-token-station"
lang: "zh"
title: "在 Cursor 中接入 Token Station：GPT-5.6 的 Sol、Terra 和 Luna"
summary: "Cursor 在设置里的 Models 面板支持自定义 OpenAI 兼容 provider。把它指向 Token Station，Sol、Terra、Luna 就会作为可选模型出现，但有两个坑要注意：一个是当前版本输入框的 Tab 聚焦变通方法，另一个是 Token Station 路由实际需要的 openai/ 前缀。"
category: "tutorial"
date: "2026-08-13"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-cursor-through-token-station-cover.png"
draft: false
---

Cursor 在 Settings → Models 里支持自定义 OpenAI 兼容 provider。把它指向 Token Station 的端点，就能把 GPT-5.6 的三个命名路由，Sol、Terra、Luna，添加为可选模型，全部通过你自己的 Token Station key 计费。下面是完整的配置流程，包括我们自己踩过的两个坑：一个是 Cursor 当前版本的输入框 bug，另一个是模型命名上一个不注意就会让请求全部失败的细节。

## 开始之前需要准备什么

- 已安装 Cursor（[cursor.com/download](https://cursor.com/download)）。
- 一个 Token Station 账户和 API 密钥。免费注册：[models.bytefuture.ai](https://models.bytefuture.ai)，注册即送 1 美元额度，无需信用卡。
- Cursor Pro。免费版即使填了自己的 API key，Agent 模式下的自定义模型选择依然是锁死的，所以除了 Chat 模式之外的任何用法都需要 Pro（每月 20 美元）。

## 步骤 1：将 Token Station 注册为自定义 provider

打开 **Settings → Cursor Settings → Models**，滚动到 **API Keys**，设置两个字段：

- **OpenAI API Key**：填入你的 Token Station 密钥。
- **Override OpenAI Base URL**：打开开关，把默认值替换成 `https://models.bytefuture.ai/v1`。

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/register-provider.mp4" type="video/mp4">
  </video>
  <figcaption>在 Cursor 的 Models 设置里，把 Token Station 注册为自定义 OpenAI 兼容 provider。</figcaption>
</figure>

**值得了解的已知 bug**：在当前的 Cursor 版本（3.15.x）中，这两个字段有时点击后无法接受键盘输入。如果打字没反应，先点一下面板里的其他地方，然后连续按 **Tab** 键，直到焦点落在目标字段上。一旦通过 Tab 聚焦，打字和 **Ctrl+V** 粘贴都能正常工作。这是一个官方承认的回归问题，不是你的设置出了什么问题。

不要指望靠一个"Verify"按钮来确认密钥和地址是否正确。它不一定总会出现，即使出现了也不能覆盖所有路径。真正可靠的确认方式是步骤 2：添加一个模型，然后真的给它发一条消息。

## 步骤 2：将三个 GPT-5.6 路由添加为自定义模型

还是在 Models 设置里，点击 **+ Add Custom Model** 三次，依次添加：

```
openai/gpt-5.6-sol
openai/gpt-5.6-terra
openai/gpt-5.6-luna
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/add-models.mp4" type="video/mp4">
  </video>
  <figcaption>添加 openai/gpt-5.6-sol、openai/gpt-5.6-terra、openai/gpt-5.6-luna 三个自定义模型。</figcaption>
</figure>

**这里的坑**：你在这里注册的名字，Cursor 会原样作为请求里的 `model` 字段发出去。Token Station 真实的路由名称里包含 `openai/` 前缀。如果你把模型注册成不带前缀的 `gpt-5.6-sol`，每个请求都会失败，报错 `Model 'gpt-5.6-sol' not found`，因为不带前缀的这个模型确实不存在。带上前缀注册，立刻就能用。

要确认这套流程真的端到端跑通了，而不只是被 Cursor 接受了：打开一个对话，选中新添加的某个模型，发一条无关紧要的消息，然后去 [Token Station 控制台](https://models.bytefuture.ai/dashboard) 查看。真实的回复加上 Recent Activity 里对应的一条记录，说明密钥、base URL 和模型名都是对的。

| 模型 | 适用场景 |
|---|---|
| `openai/gpt-5.6-sol` | 旗舰路由，适合高难度规划、调试和架构相关问题。 |
| `openai/gpt-5.6-terra` | 中间档位，适合反复的实现和调试讨论。 |
| `openai/gpt-5.6-luna` | 低成本路由，适合探索、初步排查和快速提问。 |

## 步骤 3：定义基于 Luna 的 subagent

Cursor 支持 subagent：带 YAML frontmatter 的 markdown 文件，可以按项目放在 `.cursor/agents/` 下，也可以全局放在 `~/.cursor/agents/` 下，每个都有自己的 `model` 字段。这让你可以把特定的、范围明确的委派任务指向比主对话更便宜的模型。

对编码场景来说，有两个角色很实用，都用 Luna：

**`.cursor/agents/explore.md`**
```markdown
---
name: explore
description: Searches and reads the codebase to answer questions about existing code. Use proactively before implementing anything unfamiliar.
model: openai/gpt-5.6-luna
readonly: true
---

You are a fast, read-only research agent. Find and summarize relevant
files, functions, and patterns. Never edit files or run mutating commands.
```

**`.cursor/agents/test-runner.md`**
```markdown
---
name: test-runner
description: Runs the test suite and reports pass/fail results with failure details. Use proactively after any code change.
model: openai/gpt-5.6-luna
---

You run the project's test command, capture output, and report which
tests passed or failed and why. Do not modify source files.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/subagents.mp4" type="video/mp4">
  </video>
  <figcaption>创建 explore 和 test-runner 两个 subagent，都使用 openai/gpt-5.6-luna。</figcaption>
</figure>

`explore` 上的 `readonly: true` 会阻止文件编辑和会改变状态的 shell 命令，这正好符合纯研究角色的定位。`test-runner` 需要真正执行测试命令，所以没有加这个限制，而是在指令里告诉它不要碰源代码文件。

在对话里触发 subagent 有两种方式：自动委派，即主 agent 读取 `description` 字段自行判断何时该交给它；或者用 `/explore`、`/test-runner` 显式调用。

如果你是在对话里让 agent 帮你写这两个文件，而不是自己在终端里写，写完后侧边栏依然显示没有 subagent，重新加载一下窗口（**Ctrl+Shift+P → "Reload Window"**）：Cursor 不会总是实时重新扫描 `.cursor/agents/`。

## 目前能用的，和目前还不能用的

Chat 和 Ask 模式下用 Sol、Terra、Luna，效果和上面描述的一致：真实的回复，正确计入你的 Token Station 密钥，并显示在控制台里。

完整的 Agent 模式自主性，也就是模型直接读取你的代码库并写入改动，则是另一回事。在我们的测试中，通过 Override Base URL 添加的自定义 OpenAI 兼容模型，在 Agent 模式下可以读取和讨论代码，但无论我们试过哪种 Cursor 模式，都始终无法真正应用任何文件编辑。这和其他用户遇到同一堵墙的反馈是一致的：Cursor 的 Agent 工具调用机制需要特定的请求和响应格式，而标准的 OpenAI 兼容端点不一定能像 Cursor 自家托管的模型那样完整地往返这套格式。这不是 Token Station 特有的问题：同样的 `openai/gpt-5.6-*` 路由已经在 Codex 里驱动真实的 agentic 工具调用，模型和端点本身都不是这里的瓶颈。

如果你的工作流需要一个真正能编辑文件的 agent，Token Station 在 Codex、Claude Code 和 OpenClaw 上的集成是目前已验证可行的路径。在 Cursor 的 BYOK Agent 模式支持跟上之前，Cursor 是一个在编辑器里和 Sol、Terra、Luna 对话、并用分成本档位的 subagent 做对话式委派的可靠方式。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：1 美元免费额度，无需信用卡，首次充值最高可再获得 50 美元奖励。导出你的密钥，接入 Cursor 的 Models 设置，添加这三个路由。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
