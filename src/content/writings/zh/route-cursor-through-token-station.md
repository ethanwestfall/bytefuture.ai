---
slug: "route-cursor-through-token-station"
lang: "zh"
title: "在 Cursor 中接入 Token Station：Claude Sonnet 5 和 Haiku"
summary: "Cursor 在设置里的 Models 面板支持自定义 OpenAI 兼容 provider。把它指向 Token Station，Claude Sonnet 5 和 Haiku 就会作为可选模型出现，并且完整支持 Agent 模式：真正的文件编辑，不只是聊天，还带有分成本档位的 subagent。"
category: "tutorial"
date: "2026-08-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-cursor-through-token-station-cover.png"
draft: false
---

Cursor 在 Settings → Models 里支持自定义 OpenAI 兼容 provider。把它指向 Token Station 的端点，就能把 Claude Sonnet 5 和 Haiku 添加为可选模型，全部通过你自己的 Token Station key 计费。和 Token Station 上的其他一些模型家族不同，这两个模型完整支持 Cursor 的 Agent 模式：真正的文件编辑，不只是聊天。下面是完整的配置流程，包括我们自己踩过的两个坑，最后还会跑一次真实的编码会话：Sonnet 5 在一个开源项目里实现一个真实功能，把研究和验证工作委派给 Haiku 驱动的 subagent。

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

## 步骤 2：将 Claude Sonnet 5 和 Haiku 添加为自定义模型

还是在 Models 设置里，点击 **+ Add Custom Model** 两次，依次添加：

```
anthropic/claude-sonnet-5
anthropic/claude-haiku-4-5
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/add-models.mp4" type="video/mp4">
  </video>
  <figcaption>添加 anthropic/claude-sonnet-5 和 anthropic/claude-haiku-4-5 两个自定义模型。</figcaption>
</figure>

**这里的坑**：你在这里注册的名字，Cursor 会原样作为请求里的 `model` 字段发出去。Token Station 真实的路由名称里包含 `anthropic/` 前缀。如果你把模型注册成不带前缀的 `claude-sonnet-5`，每个请求都会失败，报错 `Model 'claude-sonnet-5' not found`，因为不带前缀的这个模型确实不存在。带上前缀注册，立刻就能用。

要确认这套流程真的端到端跑通了，而不只是被 Cursor 接受了：打开一个对话，选中新添加的某个模型，发一条无关紧要的消息，然后去 [Token Station 控制台](https://models.bytefuture.ai/dashboard) 查看。真实的回复加上 Recent Activity 里对应的一条记录，说明密钥、base URL 和模型名都是对的。

| 模型 | 适用场景 |
|---|---|
| `anthropic/claude-sonnet-5` | 主力编码模型：规划、实现，以及 Agent 模式下的文件编辑。 |
| `anthropic/claude-haiku-4-5` | 低成本路由，用于 subagent：探索、初步排查和验证。 |

## 步骤 3：定义基于 Haiku 的 subagent

Cursor 支持 subagent：带 YAML frontmatter 的 markdown 文件，可以按项目放在 `.cursor/agents/` 下，也可以全局放在 `~/.cursor/agents/` 下，每个都有自己的 `model` 字段。这让你可以把特定的、范围明确的委派任务指向比主对话更便宜的模型。

对编码场景来说，有两个角色很实用，都用 Haiku：

**`.cursor/agents/explore.md`**
```markdown
---
name: explore
description: Searches and reads the codebase to answer questions about existing code. Use proactively before implementing anything unfamiliar.
model: anthropic/claude-haiku-4-5
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
model: anthropic/claude-haiku-4-5
---

You run the project's test command, capture output, and report which
tests passed or failed and why. Do not modify source files.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/subagents.mp4" type="video/mp4">
  </video>
  <figcaption>创建 explore 和 test-runner 两个 subagent，都使用 anthropic/claude-haiku-4-5。</figcaption>
</figure>

`explore` 上的 `readonly: true` 会阻止文件编辑和会改变状态的 shell 命令，这正好符合纯研究角色的定位。`test-runner` 需要真正执行测试命令，所以没有加这个限制，而是在指令里告诉它不要碰源代码文件。

在对话里触发 subagent 有两种方式：自动委派，即主 agent 读取 `description` 字段自行判断何时该交给它；或者用 `/explore`、`/test-runner` 显式调用。

如果你是在对话里让 agent 帮你写这两个文件，而不是自己在终端里写，写完后侧边栏依然显示没有 subagent，重新加载一下窗口（**Ctrl+Shift+P → "Reload Window"**）：Cursor 不会总是实时重新扫描 `.cursor/agents/`。

## 步骤 4：看它实现一个真实功能

有了 provider、模型和 subagent，Sonnet 5 就能跑一次完整的编码会话：研究、实现、验证，中间较便宜的步骤都交给 Haiku。

我们用 [httpie](https://github.com/httpie/httpie) 作为目标，一个真实的、规模适中、测试完善的开源项目。httpie 的 `--meta`/`-m` 参数会打印请求的耗时，但目前还不会显示跟随重定向后实际到达的 URL。这是一个很小、范围明确、真正有用的功能，也正是那种需要先看一眼现有代码，再动手实现的任务。

我们在 Cursor 的 Agent 模式下、选中 `anthropic/claude-sonnet-5` 时用的提示词：

> Add the effective URL (the URL actually reached after following any redirects) to HTTPie's `--meta` output, next to the existing elapsed time. Look at how elapsed time is computed and displayed first, then add a test that confirms it works for both a redirected and a non-redirected request.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/demo-httpie.mp4" type="video/mp4">
  </video>
  <figcaption>Sonnet 5 把研究工作委派给 explore subagent，自己实现改动，再把验证工作委派给 test-runner，全程通过 Token Station。</figcaption>
</figure>

在这样的会话过程中留意 [Token Station 控制台](https://models.bytefuture.ai/dashboard)：你会看到 `anthropic/claude-sonnet-5` 为规划和实现步骤计费，`anthropic/claude-haiku-4-5` 单独为 `explore` 和 `test-runner` 的委派任务计费，成本分层不只是配置出来的，是真的在起作用。

## 目前能用的

Chat 模式和 Agent 模式下，Sonnet 5 和 Haiku 通过 Token Station 在 Cursor 里都能用：真实的回复、真实的文件编辑，正确计入你的 Token Station 密钥，并显示在控制台里。这也包括上面演示的 subagent 委派。

但并不是每个模型家族现在都是这样。早些时候对 Token Station 的 GPT-5.6 路由（Sol、Terra、Luna）的测试发现，Agent 模式下它们能读取和讨论代码，但始终无法真正应用文件编辑，这是 Token Station 一侧的工具调用响应格式问题，而不是 Cursor 的硬性限制。对这几个路由的支持正在推进中。如果你现在就需要一个能在 Cursor 里可靠编辑文件的编码 agent，请使用 `anthropic/claude-sonnet-5` 和 `anthropic/claude-haiku-4-5`，而不是 GPT-5.6 系列。

Token Station 的 xAI 路由 `xai/grok-4.6`，也可以通过同样的自定义 provider 设置在 Cursor 里使用，如果你想让 Grok 来担任主力编码模型的话。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：1 美元免费额度，无需信用卡，首次充值最高可再获得 50 美元奖励。导出你的密钥，接入 Cursor 的 Models 设置，添加这两个路由。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
