---
slug: "codex-multi-model-subagents"
lang: "en"
title: "Orchestrate Multi-Model Subagents in Codex"
summary: "A detailed guide to routing Codex subagents by complexity, risk, and verifiability, with provider setup, role configuration, permission boundaries, a complete example, and a staged rollout plan."
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

Codex does not need to run every part of a large engineering task through one model. A capable main agent can interpret the goal, delegate bounded work to specialized subagents, and retain final responsibility for testing and acceptance.

The useful pattern is a controlled loop:

```text
目标
  → 主 Agent 拆解与路由
  → Subagent 在限定范围内执行
  → 测试与独立审查
  → 主 Agent 汇总和验收
```

This avoids spending a flagship model on mechanical changes, makes parallel work possible, and separates implementation from review. The main agent decides whether to delegate, what context and permissions each task receives, and which checks must pass.

## Main agent, subagents, and tools

The main agent handles planning, dependencies, risk, routing, conflict resolution, tests, and final delivery. Its model should be reliable at judgment and correction, even if it does not write most of the code.

Subagents work best on narrow, verifiable tasks: inspect `src/auth` without editing, add tests for one module, migrate a specified directory, extract APIs from official documentation, or compare two implementations.

Tools provide access to files, code search, tests, browsers, MCP services, and Git. Model choice cannot compensate for excessive permissions or an unclear write scope.

## Profiles are not agent roles

A named Codex profile layers configuration onto a session. It does not by itself become a role that the main agent can select automatically. Multi-agent routing also needs a role description and delegation boundary.

Codex may define roles through `[agents.<name>]` entries and separate configuration files. These fields can change between versions. Check the installed version:

```bash
codex --version
```

Use strict configuration validation so unsupported fields fail visibly:

```bash
codex --strict-config
```

If the installed version rejects a field, follow its current OpenAI Docs and CLI help instead of disabling validation.

## Configure a model provider

Token Station can expose several models through one Responses API provider and API key. Add this base configuration to `~/.codex/config.toml`:

```toml
model = "openai/gpt-5.6-sol"
model_provider = "token_station"

[model_providers.token_station]
name = "Token Station"
base_url = "https://bec.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
```

Provide the key through the environment:

```bash
export TOKEN_STATION_API_KEY='你的真实密钥'
```

PowerShell:

```powershell
$env:TOKEN_STATION_API_KEY = "你的真实密钥"
```

Keep the provider ID, environment variable name, `/v1` base URL, and `wire_api = "responses"` consistent. Use complete Token Station model IDs, including prefixes such as `openai/`, `glm/`, or `google/`.

## Define bounded agent roles

The following structure illustrates a lead agent with four roles. Feature flags and agent fields may vary by Codex version, so validate it with `--strict-config` and current OpenAI Docs.

```toml
[features]
multi_agent = true

[agents]
max_threads = 4
max_depth = 1

[agents.researcher]
description = "只读调查代码与文档，返回证据、文件位置和结论"
config_file = "agents/researcher.toml"

[agents.implementer]
description = "在明确文件范围内实现功能，并运行指定测试"
config_file = "agents/implementer.toml"

[agents.test_writer]
description = "补充测试和失败场景，不改变产品行为"
config_file = "agents/test-writer.toml"

[agents.security_reviewer]
description = "只读审查高风险改动，给出可复现场景"
config_file = "agents/security-reviewer.toml"
```

Descriptions should state the role, boundaries, and expected output. “Help with coding” is too vague to route reliably.

### Read-only researcher

```toml
model = "openai/gpt-5.6-luna"
model_provider = "token_station"
model_reasoning_effort = "low"
sandbox_mode = "read-only"

developer_instructions = """
只调查指定范围。引用文件路径、行号或文档来源。
不要修改文件，不要扩大任务范围。
明确区分事实、推断和待验证事项。
"""
```

### Implementer

```toml
model = "openai/gpt-5.6-terra"
model_provider = "token_station"
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"

developer_instructions = """
只修改任务中明确列出的目录和文件。
先阅读相邻代码和项目指令，再实现最小完整改动。
运行指定测试，并报告修改文件、测试结果和遗留风险。
"""
```

### Independent reviewer

```toml
model = "openai/gpt-5.6-sol"
model_provider = "token_station"
model_reasoning_effort = "high"
sandbox_mode = "read-only"

developer_instructions = """
独立审查实现，不沿用实现者的结论。
只报告可操作、可复现的问题，并给出准确文件位置。
重点检查权限、数据边界、错误处理和测试缺口。
"""
```

Other models can replace these examples when their complete Token Station IDs are available. Test Responses API behavior, multi-turn tool calls, and context limits before enabling automatic routing.

## Route by complexity, risk, and verifiability

| Task | Useful model traits | Reason |
| --- | --- | --- |
| Requirements and architecture | Strong reasoning, high reliability | Early errors affect all later work |
| Renames and formatting | Fast and inexpensive | Mechanical and easy to verify |
| Multi-file implementation | Strong coding and context | Must track dependencies |
| Research | Fast, stable extraction | Coverage and evidence matter |
| Test generation | Reliable instruction following | Tests provide direct verification |
| Security review | Careful reasoning | False negatives and positives are costly |
| Final review | Different model from implementer | Reduces correlated mistakes |

Keep cross-module decisions and high-risk authentication, permissions, migrations, payments, and deletion with a strong model and independent review. Fast models fit work that tests, type checks, or formatters can verify cheaply. Tasks that depend heavily on implicit conversation context may be safer with the main agent.

## Write explicit routing rules

Add concise rules to the project `AGENTS.md`:

```markdown
当任务复杂、可并行或需要独立复核时，先判断是否需要 Subagent。

任务路由规则：
- 简单、机械、低风险工作交给 researcher 或快速角色；
- 批量代码实现交给 implementer；
- 外部资料调查交给 researcher，并要求给出来源；
- 测试补充交给 test_writer；
- 架构、安全、权限和最终验收由主 Agent 负责；
- 每个子任务必须包含明确范围、输出和验收标准；
- 不让两个可写 Agent 同时修改同一文件；
- Subagent 结果必须通过测试或独立检查；
- 小任务由主 Agent 直接完成，不为使用 Subagent 而拆分。
```

## Validate every third-party model

OpenAI-compatible APIs do not necessarily support every Codex behavior. Test each model in stages: plain text, accurate file reading, read-only search, a small temporary edit, correction after a test failure, permission and timeout errors, and the resulting Token Station activity record.

One successful text response does not establish reliable agentic coding or tool use.

## Complete example: file uploads

Suppose the project needs image validation, size limits, object storage, and unit tests. The main agent can build this task graph:

```text
主 Agent
├── Researcher：调查框架上传接口和对象存储 SDK
├── Implementer：实现上传服务和 API
├── Test Writer：编写格式、大小和异常场景测试
└── Security Reviewer：检查路径穿越、MIME 欺骗和资源滥用
```

Research task:

```text
阅读项目使用的 Web 框架和对象存储 SDK 文档。

只返回：
1. 推荐的上传处理方式；
2. 流式处理与内存限制；
3. 官方建议的错误处理方式；
4. 相关接口名称和来源。

不要修改代码。
```

Implementation task:

```text
在 src/upload 范围内实现上传服务。

要求：
- 最大文件大小 10 MB；
- 只允许 JPEG、PNG 和 WebP；
- 不信任客户端提供的 Content-Type；
- 使用现有对象存储客户端；
- 不修改数据库结构；
- 完成后列出修改文件、测试结果和待验证事项。
```

Test task:

```text
为上传功能补充测试。

必须覆盖：
- 合法 JPEG；
- 超过大小限制；
- 扩展名和实际内容不一致；
- 空文件；
- 存储服务失败；
- 并发上传时文件名冲突。
```

Security review:

```text
只审查上传实现，不修改文件。

重点检查：
- 路径穿越；
- MIME 欺骗；
- 图片解析漏洞；
- 未限制的内存占用；
- 可预测文件名；
- 错误信息泄露。

所有结论必须给出文件位置和可复现场景。
```

The main agent then inspects the diff, runs the full test suite, resolves conflicts, and makes the final security decision.

## Common failure modes

Do not create subagents for one-line work. Do not allow two writable agents to edit the same file. Treat “completed” as a claim until the main agent checks the diff and runs tests.

Keep API keys in environment variables or a credential manager. Sending work to a third-party provider may transmit prompts and source context. Private projects should review retention, training use, storage location, compliance requirements, and directories that must not leave the environment.

Cheaper tokens do not guarantee a lower total cost:

```text
有效成本 =
调用成本
+ 重试成本
+ 主 Agent 复核成本
+ 错误修改的修复成本
```

Measure success rate, latency, retries, and human rework for each task class.

## Roll out in stages

Start with a read-only researcher. Add a fast worker for formatting, test scaffolds, and bounded replacements. Grant workspace write access only after tool use is stable. Add an independent reviewer, then introduce automatic routing based on observed task results.

The mature design does not always choose the strongest or cheapest model. It selects an adequate model for each job while keeping critical decisions, permission control, and final quality with the main agent.

## References

- [OpenAI Docs: Codex Multi-agent](https://developers.openai.com/codex/multi-agent/)
- [Token Station](https://models.bytefuture.ai/intro.html)
- [Token Station model list](https://models.bytefuture.ai/models)
- [Token Station dashboard](https://models.bytefuture.ai/dashboard)
