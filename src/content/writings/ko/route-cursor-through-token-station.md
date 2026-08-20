---
slug: "route-cursor-through-token-station"
lang: "ko"
title: "Cursor를 Token Station에 연결하기: Claude Sonnet 5와 Haiku"
summary: "Cursor는 Settings의 Models 패널에서 커스텀 OpenAI 호환 프로바이더를 지원한다. Token Station을 지정하면 Claude Sonnet 5와 Haiku가 선택 가능한 모델로 나타나며, Agent 모드까지 완전히 지원한다. 채팅뿐 아니라 실제 파일 편집이 가능하고, 비용 등급이 나뉜 서브에이전트도 쓸 수 있다."
category: "tutorial"
date: "2026-08-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-cursor-through-token-station-cover.png"
draft: false
---

Cursor는 Settings → Models에서 커스텀 OpenAI 호환 프로바이더를 지원한다. Token Station의 엔드포인트를 지정하면 Claude Sonnet 5와 Haiku를 선택 가능한 모델로 추가할 수 있고, 모두 자신의 Token Station 키로 과금된다. Token Station에 있는 다른 몇몇 모델 계열과 달리, 이 둘은 Cursor의 Agent 모드를 완전히 지원한다. 채팅뿐 아니라 실제 파일 편집이 가능하다는 뜻이다. 여기서는 설정 과정을 처음부터 끝까지 다룬다. 직접 해보면서 만난 두 가지 문제도 포함해서다. 마지막에는 실제 코딩 세션까지 보여준다. Sonnet 5가 오픈소스 프로젝트에서 실제 기능을 구현하고, 조사와 검증을 Haiku 기반 서브에이전트에 위임하는 과정이다.

## 시작하기 전에 필요한 것

- Cursor 설치([cursor.com/download](https://cursor.com/download)).
- Token Station 계정과 API 키. [models.bytefuture.ai](https://models.bytefuture.ai)에서 무료로 가입할 수 있다. 가입 시 1달러 크레딧이 지급되며 카드는 필요 없다.
- Cursor Pro. Agent 모드에서의 커스텀 모델 선택은 자신의 API 키가 있어도 무료 플랜에서는 막혀 있어서, Chat 모드를 넘어서는 모든 용도에 Pro(월 20달러)가 필요하다.

## 1단계: Token Station을 커스텀 프로바이더로 등록하기

**Settings → Cursor Settings → Models**를 열고 **API Keys**까지 스크롤한 다음, 두 필드를 설정한다.

- **OpenAI API Key**: Token Station 키를 입력한다.
- **Override OpenAI Base URL**: 토글을 켜고, 기본값을 `https://models.bytefuture.ai/v1`로 바꾼다.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/register-provider.mp4" type="video/mp4">
  </video>
  <figcaption>Cursor의 Models 설정에서 Token Station을 커스텀 OpenAI 호환 프로바이더로 등록하는 과정.</figcaption>
</figure>

**알아두면 좋은 알려진 버그**: 현재 Cursor 빌드(3.15.x 계열)에서는 이 두 필드가 클릭해도 키보드 입력을 받지 않을 때가 있다. 입력해도 아무 반응이 없다면, 먼저 패널의 다른 부분을 클릭한 다음 **Tab** 키를 반복해서 눌러 포커스가 해당 필드로 오게 한다. Tab으로 포커스가 온 뒤에는 입력과 **Ctrl+V** 붙여넣기 모두 정상 작동한다. 이는 공식적으로 인정된 회귀 버그이며, 특정 사용자 환경의 문제가 아니다.

키와 URL이 올바른지 확인할 때 "Verify" 버튼에 의존하지 말자. 항상 나타나는 것도 아니고, 나타나더라도 모든 경로를 커버하지는 않는다. 믿을 만한 확인 방법은 2단계다: 모델을 추가하고 실제로 메시지를 보내보는 것.

## 2단계: Claude Sonnet 5와 Haiku를 커스텀 모델로 추가하기

여전히 Models 설정에서, **+ Add Custom Model**을 두 번 클릭해 다음을 추가한다.

```
anthropic/claude-sonnet-5
anthropic/claude-haiku-4-5
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/add-models.mp4" type="video/mp4">
  </video>
  <figcaption>anthropic/claude-sonnet-5와 anthropic/claude-haiku-4-5를 커스텀 모델로 추가하는 과정.</figcaption>
</figure>

**여기가 함정이다**: 여기서 등록한 이름을 Cursor는 그대로 요청의 `model` 필드로 보낸다. Token Station의 실제 라우트 이름에는 `anthropic/` 접두사가 붙어 있다. 접두사 없이 `claude-sonnet-5`로 등록하면 모든 요청이 `Model 'claude-sonnet-5' not found` 오류로 실패하는데, 접두사가 없는 그 모델은 실제로 존재하지 않기 때문이다. 접두사를 붙여 등록하면 바로 작동한다.

Cursor에 받아들여진 것뿐 아니라 실제로 엔드투엔드로 작동하는지 확인하려면, 채팅을 열어 새로 추가한 모델 중 하나를 선택하고 아무 메시지나 보낸 다음 [Token Station 대시보드](https://models.bytefuture.ai/dashboard)를 확인한다. 실제 응답과 함께 Recent Activity에 해당하는 항목이 나타난다면, 키와 base URL, 모델 이름이 모두 올바르다는 뜻이다.

| 모델 | 적합한 용도 |
|---|---|
| `anthropic/claude-sonnet-5` | 메인 코딩 모델. 플래닝, 구현, Agent 모드에서의 파일 편집에. |
| `anthropic/claude-haiku-4-5` | 서브에이전트용 저비용 라우트. 탐색, 우선순위 판단, 검증에. |

## 3단계: Haiku 기반 서브에이전트 정의하기

Cursor는 서브에이전트를 지원한다. YAML 프론트매터가 있는 마크다운 파일로, 프로젝트별로 `.cursor/agents/`에 두거나 전역으로 `~/.cursor/agents/`에 둘 수 있으며, 각각 자체 `model` 필드를 가진다. 이를 통해 범위가 명확한 특정 위임 작업을 메인 채팅보다 저렴한 모델로 향하게 할 수 있다.

코딩 세션에 유용한 두 가지 역할을, 둘 다 Haiku로 구성한다.

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
  <figcaption>explore와 test-runner 두 서브에이전트를 만드는 과정. 둘 다 anthropic/claude-haiku-4-5를 사용한다.</figcaption>
</figure>

`explore`의 `readonly: true`는 파일 편집과 상태를 변경하는 셸 명령을 막는데, 순수 조사 역할에 딱 맞는다. `test-runner`는 테스트 명령을 실제로 실행해야 하므로 이 제한을 두지 않았고, 대신 지시문에서 소스 파일을 건드리지 말라고 명시했다.

채팅에서 서브에이전트를 실행하는 방법은 두 가지다. 자동 위임은 메인 에이전트가 `description` 필드를 읽고 언제 위임할지 스스로 판단하는 방식이고, `/explore`나 `/test-runner`로 명시적으로 호출하는 방법도 있다.

이 파일들을 터미널에서 직접 만드는 대신 채팅에서 에이전트에게 작성해달라고 요청했는데도 사이드바에 여전히 서브에이전트가 표시되지 않는다면, 창을 새로고침한다(**Ctrl+Shift+P → "Reload Window"**). Cursor가 `.cursor/agents/`를 항상 실시간으로 다시 스캔하지는 않는다.

## 4단계: 실제 기능을 구현하는 과정 지켜보기

프로바이더, 모델, 서브에이전트가 모두 준비되면 Sonnet 5는 조사, 구현, 검증까지 포함하는 실제 코딩 세션을 처음부터 끝까지 실행할 수 있다. 그 사이 비용이 낮은 단계는 Haiku에 위임하면서다.

대상으로는 [httpie](https://github.com/httpie/httpie)를 사용했다. 실제로 존재하고, 규모도 적당하며, 테스트도 잘 갖춰진 오픈소스 프로젝트다. httpie의 `--meta`/`-m` 플래그는 요청의 경과 시간을 출력하지만, 리다이렉트를 따라간 뒤 실제로 도달한 URL은 아직 보여주지 않는다. 이는 작고 범위가 명확하며 실제로 유용한 기능으로, 손대기 전에 기존 코드를 먼저 살펴봐야 하는 종류의 작업이다.

Cursor의 Agent 모드에서 `anthropic/claude-sonnet-5`를 선택한 상태로 사용한 프롬프트다.

> Add the effective URL (the URL actually reached after following any redirects) to HTTPie's `--meta` output, next to the existing elapsed time. Look at how elapsed time is computed and displayed first, then add a test that confirms it works for both a redirected and a non-redirected request.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/demo-httpie.mp4" type="video/mp4">
  </video>
  <figcaption>Sonnet 5가 조사를 explore 서브에이전트에 위임하고, 직접 변경 사항을 구현한 다음, 검증을 test-runner에 위임한다. 전 과정이 Token Station을 통해 이루어진다.</figcaption>
</figure>

이런 세션이 진행되는 동안 [Token Station 대시보드](https://models.bytefuture.ai/dashboard)를 지켜보면, 플래닝과 구현 단계에는 `anthropic/claude-sonnet-5`가, `explore`와 `test-runner` 위임에는 `anthropic/claude-haiku-4-5`가 각각 따로 과금되는 것을 볼 수 있다. 비용 등급 분리가 설정만 되어 있는 게 아니라 실제로 작동하고 있다는 뜻이다.

## 지금 되는 것

Chat 모드와 Agent 모드 모두에서 Sonnet 5와 Haiku는 Token Station을 통해 Cursor 안에서 사용할 수 있다. 실제 응답, 실제 파일 편집이 이루어지고, Token Station 키에 정확히 과금되며, 대시보드에서도 확인된다. 위에서 보여준 서브에이전트 위임도 포함해서다.

다만 모든 모델 계열이 아직 이렇지는 않다. 이전에 Token Station의 GPT-5.6 라우트(Sol, Terra, Luna)를 테스트했을 때는, Agent 모드에서 코드를 읽고 논의할 수는 있었지만 실제 파일 편집을 적용하는 데는 계속 실패했다. 이는 Cursor 쪽의 고정된 제약이 아니라 Token Station 쪽의 도구 호출 응답 형식 문제였다. 이 라우트들에 대한 지원은 현재 진행 중이다. 지금 당장 Cursor에서 안정적으로 파일을 편집하는 코딩 에이전트가 필요하다면, GPT-5.6 계열 대신 `anthropic/claude-sonnet-5`와 `anthropic/claude-haiku-4-5`를 사용하자.

Token Station의 xAI 라우트인 `xai/grok-4.6`도 같은 커스텀 프로바이더 설정으로 Cursor에서 사용할 수 있다. 메인 코딩 역할에 Grok을 써보고 싶다면 이 라우트를 쓰면 된다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하자. 1달러 무료 크레딧, 카드 불필요, 첫 충전 시 최대 50달러 보너스도 받을 수 있다. 키를 export하고 Cursor의 Models 설정에 연결한 다음, 두 가지 라우트를 추가하자.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
