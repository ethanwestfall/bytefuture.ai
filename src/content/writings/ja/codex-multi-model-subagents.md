---
slug: "codex-multi-model-subagents"
lang: "ja"
title: "Codexで複数モデルのSubagentを編成する"
summary: "Codexの主Agentが複雑さ、リスク、検証可能性に応じてSubagentを振り分ける方法を、Provider、役割、権限、実例、段階的な導入手順とともに解説します。"
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

大きな開発作業を1つのモデルだけで処理する必要はありません。強い主Agentが目的を理解し、境界の明確な作業を異なるモデルのSubagentへ委任し、最後のテストと受け入れを担当できます。

重要なのはAgentの数ではなく、制御できる流れです。

```text
目标
  → 主 Agent 拆解与路由
  → Subagent 在限定范围内执行
  → 测试与独立审查
  → 主 Agent 汇总和验收
```

主Agentは計画、依存関係、リスク、ルーティング、競合解決、テスト、最終成果を担当します。Subagentには、特定モジュールのテスト、限定ディレクトリの移行、読み取り専用の調査など、入力と検証条件が明確な仕事を渡します。

## ProfileとAgentの役割を区別する

Codexの名前付きprofileはセッションに設定を重ねる仕組みであり、主Agentが自動選択する役割そのものではありません。複数Agentのルーティングには、役割の説明と委任境界が必要です。

まずバージョンを確認します。

```bash
codex --version
```

未対応フィールドを見逃さないよう、厳格な設定検証を使います。

```bash
codex --strict-config
```

現在のバージョンが拒否するフィールドは、そのバージョンのOpenAI DocsとCLIヘルプに合わせてください。

## モデルProviderを設定する

Token Stationでは1つのResponses API ProviderとAPI keyから複数モデルを利用できます。`~/.codex/config.toml`に追加します。

```toml
model = "openai/gpt-5.6-sol"
model_provider = "token_station"

[model_providers.token_station]
name = "Token Station"
base_url = "https://bec.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
```

環境変数でkeyを渡します。

```bash
export TOKEN_STATION_API_KEY='你的真实密钥'
```

PowerShell：

```powershell
$env:TOKEN_STATION_API_KEY = "你的真实密钥"
```

Provider ID、環境変数名、`/v1`までのBase URL、`wire_api = "responses"`を一致させます。モデルIDには`openai/`などの接頭辞を残します。

## Agentの役割を定義する

次は4つの役割を登録する構成例です。feature flagやAgentフィールドはCodexのバージョンで変わる可能性があるため、`--strict-config`で検証してください。

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

`description`には役割、禁止事項、期待する出力を具体的に書きます。

### 読み取り専用Researcher

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

### 独立Reviewer

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

別のモデルを使う場合はToken Stationの完全なIDを指定し、Responses API、複数回のツール呼び出し、コンテキスト制限を先に確認します。

## モデル選択の基準

要件分析、設計、認証、権限、移行、決済、削除は強いモデルと独立レビューに残します。リネーム、整形、テスト生成など、テストや型チェックで安く検証できる仕事は高速モデルに向いています。

判断軸は複雑さ、リスク、検証可能性、暗黙のコンテキスト依存です。会話履歴に強く依存する仕事は、委任による情報損失を避けるため主Agentが直接処理する方が安全です。

## ルーティング規則を書く

プロジェクトの`AGENTS.md`に短く実行可能な規則を追加します。

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

## 第三者モデルを段階的に検証する

OpenAI互換APIでもCodexのすべての動作を保証するわけではありません。純粋な文章、正確なファイル参照、読み取り専用検索、小さな一時編集、テスト失敗後の修正、権限やタイムアウトの報告、Token Stationの履歴という順番で確認します。

## 完全な例：ファイルアップロード

画像形式、サイズ制限、オブジェクトストレージ、単体テストを追加する場合、主Agentは次のタスクグラフを作れます。

```text
主 Agent
├── Researcher：调查框架上传接口和对象存储 SDK
├── Implementer：实现上传服务和 API
├── Test Writer：编写格式、大小和异常场景测试
└── Security Reviewer：检查路径穿越、MIME 欺骗和资源滥用
```

Researcher：

```text
阅读项目使用的 Web 框架和对象存储 SDK 文档。

只返回：
1. 推荐的上传处理方式；
2. 流式处理与内存限制；
3. 官方建议的错误处理方式；
4. 相关接口名称和来源。

不要修改代码。
```

Implementer：

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

Test Writer：

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

Security Reviewer：

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

最後に主Agentがdiff、全テスト、競合、セキュリティ判断を確認します。

## 失敗しやすい点

1行の変更にSubagentを作らないでください。複数の書き込みAgentに同じファイルを触らせず、「完了」という報告はdiffとテストで確認します。

API keyは環境変数や認証情報管理に保存します。第三者Providerへ送るプロンプトとコードについて、保持、学習利用、保存地域、コンプライアンス、外部送信禁止ディレクトリを確認してください。

安いモデルでも、再試行と手戻りで総コストが上がる場合があります。

```text
有效成本 =
调用成本
+ 重试成本
+ 主 Agent 复核成本
+ 错误修改的修复成本
```

最初は読み取り専用Researcherから始め、次に高速な作業Agent、書き込みAgent、独立Reviewerの順で追加します。実績データを集めてから自動ルーティングを有効にしてください。

## 参考資料

- [OpenAI Docs：Codex Multi-agent](https://developers.openai.com/codex/multi-agent/)
- [Token Station](https://models.bytefuture.ai/intro.html)
- [Token Stationモデル一覧](https://models.bytefuture.ai/models)
- [Token Stationダッシュボード](https://models.bytefuture.ai/dashboard)
