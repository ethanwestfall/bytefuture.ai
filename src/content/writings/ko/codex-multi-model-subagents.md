---
slug: "codex-multi-model-subagents"
lang: "ko"
title: "Codex에서 다중 모델 Subagent 구성하기"
summary: "Codex 주 Agent가 복잡도, 위험, 검증 가능성에 따라 Subagent를 배정하는 방법을 Provider 설정, 역할과 권한, 전체 사례, 단계별 도입 절차와 함께 설명합니다."
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

큰 개발 작업을 한 모델이 모두 처리할 필요는 없습니다. 신뢰도 높은 주 Agent가 목표를 이해하고 범위가 명확한 작업을 서로 다른 모델의 Subagent에 위임한 뒤 테스트와 최종 검수를 담당할 수 있습니다.

핵심은 Agent 수가 아니라 통제 가능한 흐름입니다.

```text
目标
  → 主 Agent 拆解与路由
  → Subagent 在限定范围内执行
  → 测试与独立审查
  → 主 Agent 汇总和验收
```

주 Agent는 계획, 의존성, 위험, 라우팅, 충돌 해결, 테스트, 최종 결과를 책임집니다. Subagent에는 특정 모듈 테스트, 제한된 디렉터리 마이그레이션, 읽기 전용 조사처럼 입력과 검증 조건이 분명한 작업을 배정합니다.

## Profile과 Agent 역할 구분

Codex의 이름 있는 profile은 세션에 설정을 겹쳐 적용하는 기능입니다. 주 Agent가 자동 선택하는 역할 자체는 아닙니다. 다중 Agent 라우팅에는 역할 설명과 위임 경계가 추가로 필요합니다.

버전을 확인합니다.

```bash
codex --version
```

지원하지 않는 필드를 놓치지 않도록 엄격한 설정 검증을 사용합니다.

```bash
codex --strict-config
```

설치된 버전이 필드를 거부하면 해당 버전의 OpenAI Docs와 CLI 도움말을 따르세요.

## 모델 Provider 설정

Token Station에서는 하나의 Responses API Provider와 API key로 여러 모델을 사용할 수 있습니다. `~/.codex/config.toml`에 추가합니다.

```toml
model = "openai/gpt-5.6-sol"
model_provider = "token_station"

[model_providers.token_station]
name = "Token Station"
base_url = "https://bec.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
```

환경 변수로 key를 제공합니다.

```bash
export TOKEN_STATION_API_KEY='你的真实密钥'
```

PowerShell:

```powershell
$env:TOKEN_STATION_API_KEY = "你的真实密钥"
```

Provider ID, 환경 변수 이름, `/v1`까지의 Base URL, `wire_api = "responses"`를 일치시키세요. 모델 ID에는 `openai/` 같은 제공자 접두사를 유지합니다.

## Agent 역할 정의

다음은 네 역할을 등록하는 구성 예시입니다. feature flag와 Agent 필드는 Codex 버전에 따라 바뀔 수 있으므로 `--strict-config`로 검증하세요.

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

`description`에는 역할, 금지 사항, 기대 출력을 구체적으로 적어야 합니다.

### 읽기 전용 Researcher

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

### 독립 Reviewer

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

다른 모델을 사용하려면 Token Station의 전체 ID를 지정하고 Responses API, 여러 차례의 도구 호출, 컨텍스트 제한을 먼저 검증하세요.

## 모델 선택 기준

요구 사항 분석, 설계, 인증, 권한, 마이그레이션, 결제, 삭제는 강한 모델과 독립 검토에 맡깁니다. 이름 변경, 포맷 정리, 테스트 생성처럼 테스트나 타입 검사로 저렴하게 검증할 수 있는 작업은 빠른 모델에 적합합니다.

판단 기준은 복잡도, 위험, 검증 가능성, 암묵적 컨텍스트 의존성입니다. 이전 대화에 크게 의존하는 작업은 위임 과정에서 정보가 손실될 수 있으므로 주 Agent가 직접 처리하는 편이 안전합니다.

## 명확한 라우팅 규칙 작성

프로젝트의 `AGENTS.md`에 짧고 실행 가능한 규칙을 추가합니다.

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

## 서드파티 모델 단계별 검증

OpenAI 호환 API라고 해서 Codex의 모든 동작을 지원하는 것은 아닙니다. 순수 텍스트, 정확한 파일 인용, 읽기 전용 검색, 작은 임시 수정, 테스트 실패 후 수정, 권한과 타임아웃 보고, Token Station 활동 기록 순서로 확인하세요.

## 전체 사례: 파일 업로드

이미지 형식, 크기 제한, 오브젝트 스토리지, 단위 테스트를 추가한다면 주 Agent는 다음 작업 그래프를 만들 수 있습니다.

```text
主 Agent
├── Researcher：调查框架上传接口和对象存储 SDK
├── Implementer：实现上传服务和 API
├── Test Writer：编写格式、大小和异常场景测试
└── Security Reviewer：检查路径穿越、MIME 欺骗和资源滥用
```

Researcher:

```text
阅读项目使用的 Web 框架和对象存储 SDK 文档。

只返回：
1. 推荐的上传处理方式；
2. 流式处理与内存限制；
3. 官方建议的错误处理方式；
4. 相关接口名称和来源。

不要修改代码。
```

Implementer:

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

Test Writer:

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

Security Reviewer:

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

마지막으로 주 Agent가 diff, 전체 테스트, 충돌, 보안 결정을 확인합니다.

## 자주 발생하는 문제

한 줄 수정에 Subagent를 만들지 마세요. 여러 쓰기 Agent가 같은 파일을 수정하게 하지 말고, “완료”라는 보고는 diff와 테스트로 검증하세요.

API key는 환경 변수나 자격 증명 관리자에 저장합니다. 서드파티 Provider로 전송되는 프롬프트와 코드에 대해 보존, 학습 사용, 저장 지역, 규정 준수, 외부 전송 금지 디렉터리를 확인해야 합니다.

저렴한 모델도 재시도와 재작업 때문에 총비용이 커질 수 있습니다.

```text
有效成本 =
调用成本
+ 重试成本
+ 主 Agent 复核成本
+ 错误修改的修复成本
```

읽기 전용 Researcher부터 시작하고, 빠른 작업 Agent, 쓰기 Agent, 독립 Reviewer 순으로 추가하세요. 실제 성공률, 지연, 재시도, 사람의 재작업 시간을 기록한 뒤 자동 라우팅을 활성화합니다.

## 참고 자료

- [OpenAI Docs: Codex Multi-agent](https://developers.openai.com/codex/multi-agent/)
- [Token Station](https://models.bytefuture.ai/intro.html)
- [Token Station 모델 목록](https://models.bytefuture.ai/models)
- [Token Station 대시보드](https://models.bytefuture.ai/dashboard)
