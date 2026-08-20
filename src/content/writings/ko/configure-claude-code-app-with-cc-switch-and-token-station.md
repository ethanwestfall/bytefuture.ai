---
slug: "configure-claude-code-app-with-cc-switch-and-token-station"
lang: "ko"
title: "CC Switch와 Token Station으로 Claude Desktop 설정하기"
summary: "CC Switch를 알아보고 설치한 뒤 Claude Desktop용 Token Station Provider, 모델 매핑, 로컬 라우팅을 설정하고 전체 경로를 검증합니다."
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/configure-claude-code-app-with-cc-switch-and-token-station-cover.png"
draft: false
---

이 글에서는 CC Switch를 설치하고 Claude Desktop을 Token Station에 연결하는 방법을 설명합니다. 설정이 완료되면 Claude Desktop이 요청하는 Sonnet, Opus, Haiku 역할을 CC Switch가 Token Station의 지정 모델에 매핑합니다.

> 이 글은 CC Switch의 **Claude Desktop** 패널을 대상으로 합니다. Claude Desktop과 Claude Code CLI는 설정 경로가 다르므로 Claude Code CLI 지침을 이 설정에 그대로 적용하지 마세요.

## CC Switch 설치하기

[CC Switch](https://github.com/farion1231/cc-switch)는 AI 도구의 Provider를 관리하는 데스크톱 앱입니다. Claude Desktop, Claude Code, Codex, Gemini CLI 등의 도구를 지원합니다.

이러한 도구를 직접 설정하려면 일반적으로 도구마다 별도의 설정 파일이나 환경 변수를 수정해야 합니다. CC Switch는 도구와 Provider를 하나의 그래픽 화면에 모아 여러 설정을 저장하고, API URL과 Key를 반복해서 입력하지 않고 전환할 수 있게 합니다.

macOS 사용자는 Homebrew로 설치할 수 있습니다.

```bash
brew install --cask cc-switch
```

Windows, Linux 또는 수동 설치를 원하는 macOS 사용자는 [CC Switch Releases](https://github.com/farion1231/cc-switch/releases)에서 현재 시스템에 맞는 패키지를 내려받고 릴리스 페이지의 안내에 따라 설치하세요.

## 시작하기 전에

다음을 준비하세요.

- 설치되어 정상적으로 열리는 CC Switch
- 설치되어 정상적으로 실행되는 Claude Desktop
- 유효한 Token Station API Key
- 사용할 모델에 대한 접근 권한과 사용 가능한 크레딧

[Token Station 대시보드](https://models.bytefuture.ai/dashboard)를 열어 API Key를 복사하고 사용할 모델의 전체 ID를 확인합니다. API Key를 스크린샷, 채팅 메시지, Git 저장소에 노출하지 마세요.

## 전체 설정 흐름

필요한 단계는 다음과 같습니다.

1. CC Switch에서 Claude Desktop Provider 만들기
2. Token Station URL과 API Key 입력하기
3. **Needs model mapping** 켜기
4. Sonnet, Opus, Haiku를 Token Station 모델 ID에 매핑하기
5. CC Switch 로컬 라우팅과 Claude 라우팅 켜기
6. Provider를 활성화하고 Claude Desktop을 완전히 재시작하기
7. 요청을 보내고 Token Station에서 기록 확인하기

모델 매핑이나 로컬 라우팅을 빠뜨리면 CC Switch에 Token Station이 현재 Provider로 표시되어도 App이 이전 서비스를 계속 사용할 수 있습니다.

## Token Station Provider 추가하기

### 1. Provider 만들기

CC Switch를 열고 상단 도구 모음에서 **Claude Desktop**을 선택한 뒤 Provider 관리 화면으로 이동합니다. Add, New Provider 또는 더하기 버튼을 클릭합니다.

<figure>
  <img src="/blog/cc-switch-claude-desktop-entry.png" alt="CC Switch 상단 도구 모음에서 Claude Desktop이 선택되어 있고 Claude Desktop Official Provider가 표시된 화면" />
  <figcaption>CC Switch 상단 도구 모음에서 Claude Desktop을 선택합니다.</figcaption>
</figure>

### 2. 연결 설정 입력하기

알아보기 쉬운 Provider 이름을 사용하세요.

```text
Token Station
```

Provider 유형이나 API 형식을 선택해야 한다면 Claude, Anthropic 또는 **Anthropic Messages (native)**를 선택합니다.

| 항목 | 설정값 |
| --- | --- |
| Request URL / Base URL | `https://models.bytefuture.ai` |
| API Key / Auth Token | Token Station API Key |
| API 형식 | Anthropic Messages (native) |
| Needs model mapping | 켬 |

<figure>
  <img src="/blog/cc-switch-token-station-provider-settings.png" alt="API Key와 요청 URL, Anthropic Messages 형식을 입력하고 모델 매핑을 활성화한 CC Switch의 Token Station Provider 설정" />
  <figcaption>Token Station 루트 URL과 Anthropic Messages native 형식을 사용합니다.</figcaption>
</figure>

Base URL 뒤에 `/v1/messages`를 추가하지 마세요. 클라이언트가 요청 경로를 생성하므로 중복 경로가 생기면 404가 반환될 수 있습니다.

현재 CC Switch 버전이 환경 변수를 표시한다면 다음을 사용합니다.

```text
ANTHROPIC_BASE_URL=https://models.bytefuture.ai
ANTHROPIC_AUTH_TOKEN=<Token Station API Key 입력>
ANTHROPIC_MODEL=<전체 모델 ID 입력>
```

일부 템플릿은 `ANTHROPIC_AUTH_TOKEN` 대신 `ANTHROPIC_API_KEY`를 사용합니다. 현재 템플릿에 표시된 필드를 따르고, 출처가 불분명한 여러 인증 필드를 동시에 입력하지 마세요.

### 3. Needs model mapping을 반드시 켜기

**Needs model mapping**은 반드시 켜야 합니다. Claude Desktop은 Sonnet, Opus, Haiku 같은 Claude 역할로 모델을 요청합니다. CC Switch가 이 역할을 Token Station이 인식하는 전체 모델 ID로 변환해야 합니다.

<figure>
  <img src="/blog/cc-switch-needs-model-mapping.png" alt="Needs model mapping 옵션을 활성화한 CC Switch Provider 양식" />
  <figcaption>Token Station Provider를 저장하기 전에 “Needs model mapping”을 명확히 활성화합니다.</figcaption>
</figure>

이 옵션이 꺼져 있으면 매핑되지 않은 Claude 역할 이름이 그대로 전송되어 모델을 찾을 수 없다는 오류가 발생하거나 App이 의도하지 않은 경로를 계속 사용할 수 있습니다.

## 모델 매핑 설정하기

Token Station Provider의 모델 매핑 영역을 열고 각 Claude 역할에 전체 Token Station 모델 ID를 할당합니다. 다음 조합으로 시작할 수 있습니다.

| Claude 역할 | Token Station 모델 |
| --- | --- |
| Sonnet | `openai/gpt-5.6-terra` |
| Opus | `openai/gpt-5.6-sol` |
| Haiku | `openai/gpt-5.6-luna` |

위 ID는 설정 예시입니다. 사용 가능한 모델은 달라질 수 있으므로 저장하기 전에 Token Station에서 현재 모델 ID와 계정 권한을 확인하세요. `openai/` 같은 Provider 접두사도 반드시 포함해야 합니다.

```text
openai/gpt-5.6-sol
```

일반적으로 Sonnet은 기본 범용 작업, Opus는 더 복잡한 작업, Haiku는 빠르고 가벼운 작업에 사용할 수 있습니다. 비용, 지연 시간, 모델 가용성에 따라 다르게 매핑해도 됩니다. 중요한 점은 요청될 모든 역할이 유효한 Token Station 모델로 연결되어야 한다는 것입니다.

## CC Switch 로컬 라우팅 활성화하기

이 단계는 가장 자주 건너뛰는 단계이고, 건너뛰면 앱이 계속 이전 서비스로 응답하게 됩니다. Provider만 활성화하는 것으로는 부족합니다. 모델 매핑은 컴퓨터에서 실행되는 CC Switch 서비스가 적용하므로 그 서비스가 실행 중이어야 합니다.

1. **CC Switch Settings → Routing** 열기
2. **Show local routing switch on the home page** 켜기
3. 라우팅 마스터 스위치를 실행 상태로 유지하기
4. 라우팅 대상에서 **Claude** 활성화하기
5. Claude Desktop 패널로 돌아가 로컬 라우팅 토글을 On으로 전환하기

<figure>
  <img src="/blog/cc-switch-local-routing-settings.png" alt="로컬 라우팅이 실행 중이고 Claude 라우팅이 활성화된 CC Switch 라우팅 설정" />
  <figcaption>라우팅 서비스를 실행 상태로 유지하고 홈 화면 스위치와 Claude 라우팅을 활성화합니다.</figcaption>
</figure>

이 경로를 사용하는 동안 CC Switch를 계속 실행해야 합니다. CC Switch를 종료하면 로컬 게이트웨이가 중지되고 Claude Desktop은 이 설정을 통해 Token Station에 접근할 수 없습니다.

## 저장, 활성화, 재시작

저장하기 전에 URL에 불필요한 경로가 없는지, API Key 앞뒤에 공백이 없는지, **Needs model mapping**이 켜져 있는지, 각 모델 ID에 Provider 접두사가 포함되어 있는지 확인합니다.

Provider를 저장하고 **Token Station**을 선택한 뒤 Enable, Apply 또는 Switch를 클릭합니다. 그런 다음 Claude Desktop을 완전히 종료하고 다시 엽니다. 창만 닫으면 이전 설정을 유지하는 프로세스가 남을 수 있습니다.

Windows에서는 시스템 트레이를 확인하고 필요하면 Quit을 선택합니다. macOS에서는 `Command + Q`를 사용합니다. Claude Desktop을 다시 열 때도 CC Switch와 라우팅 서비스가 실행 중이어야 합니다.

## Anthropic 계정 없이 Claude Desktop 사용하기

CC Switch 설정을 마치면 Anthropic 계정에 먼저 로그인하지 않고 Claude Desktop의 타사 추론 기능을 통해 로컬 게이트웨이에 연결할 수 있습니다. 아래 단계는 Windows용 Claude Desktop을 기준으로 하며, 운영체제나 버전에 따라 메뉴 위치가 조금 다를 수 있습니다.

### 1. Developer Mode 활성화하기

Claude Desktop 왼쪽 위 메뉴를 열고 **Help → Troubleshooting → Enable Developer Mode**를 선택합니다.

<figure>
  <img src="/blog/claude-desktop-enable-developer-mode.png" alt="Claude Desktop Help 메뉴에서 Troubleshooting을 펼치고 Enable Developer Mode를 선택한 화면" />
  <figcaption>Help → Troubleshooting에서 Enable Developer Mode를 선택합니다.</figcaption>
</figure>

활성화하면 메인 메뉴에 **Developer** 항목이 나타납니다. 바로 표시되지 않으면 Claude Desktop을 완전히 종료한 뒤 다시 여세요.

### 2. 타사 추론 설정 열기

왼쪽 위 메뉴에서 **Developer → Configure Third-Party Inference...**를 선택합니다.

<figure>
  <img src="/blog/claude-desktop-configure-third-party-inference.png" alt="Claude Desktop Developer 메뉴에서 Configure Third-Party Inference를 선택한 화면" />
  <figcaption>Developer 메뉴에서 타사 추론 설정을 엽니다.</figcaption>
</figure>

### 3. CC Switch 설정 적용하기

설정 화면 오른쪽 위에 **CC Switch**가 표시되고 Connection이 **Gateway**로 설정되어 있는지 확인합니다. Provider와 로컬 라우팅이 올바르게 구성되었다면 Gateway base URL, API Key, 인증 방식은 CC Switch가 자동으로 입력합니다.

이 화면에서는 아무것도 입력하거나 변경하지 말고 아래쪽의 **Apply locally**를 클릭합니다.

<figure>
  <img src="/blog/claude-desktop-apply-cc-switch-locally.png" alt="CC Switch가 로컬 Gateway 정보를 입력한 Claude Desktop 타사 추론 설정 화면과 Apply locally 버튼" />
  <figcaption>설정 출처가 CC Switch인지 확인한 뒤 자동 생성된 Gateway 정보를 변경하지 말고 Apply locally를 클릭합니다.</figcaption>
</figure>

적용 후 Claude Desktop은 CC Switch 로컬 게이트웨이를 통해 추론 요청을 보냅니다. 사용하는 동안 CC Switch와 로컬 라우팅을 계속 실행하세요. 자동 생성된 Gateway API Key도 민감한 정보이므로 키가 보이는 스크린샷을 공개하거나 다른 사람과 공유하지 마세요.

## 전체 경로 검증하기

Claude Desktop에서 새 대화를 시작하고 다음을 전송합니다.

```text
Token Station 테스트 성공이라고만 답하세요
```

응답을 받은 후 [Token Station 대시보드](https://models.bytefuture.ai/dashboard)의 `Recent Activity` 또는 요청 로그에서 다음을 확인합니다.

- 요청한 시간에 새 기록이 나타나는지
- 요청이 성공적으로 완료되었는지
- 기록된 모델이 CC Switch 역할 매핑과 일치하는지

App의 응답과 일치하는 Token Station 기록이 모두 있어야 전체 경로가 활성화되었다고 판단할 수 있습니다. CC Switch의 Current Provider 표시만으로는 충분하지 않습니다.

## 원래 Provider로 되돌리기

공식 Provider를 덮어쓰지 말고 그대로 보관하세요. 복원하려면 원래 Provider를 선택하고 Apply 또는 Switch를 클릭합니다. Token Station 경로가 더 이상 필요 없다면 관련 라우팅을 끄고 Claude Desktop을 완전히 종료한 다음 다시 엽니다.

## 문제 해결

### App이 이전 Provider를 계속 사용함

App을 완전히 종료하고 Token Station Provider를 다시 적용하세요. 로컬 라우팅과 Claude 라우팅이 모두 켜져 있는지 확인한 뒤 App을 다시 엽니다.

### 모델 매핑이 꺼져 있음

Provider를 편집해 **Needs model mapping**을 켜고 Sonnet, Opus, Haiku가 유효한 Token Station 모델 ID를 가리키는지 확인합니다. 저장한 뒤 Provider를 다시 적용하세요.

### 로컬 라우팅이 꺼져 있음

**Settings → Routing**에서 라우팅 서비스를 시작하고 Claude 라우팅을 활성화합니다. Claude Desktop 패널로 돌아가 로컬 라우팅 스위치도 켭니다.

### CC Switch가 실행 중이 아님

로컬 게이트웨이는 CC Switch가 실행되는 동안에만 존재합니다. CC Switch를 다시 열고 라우팅을 시작한 뒤 요청을 재시도하세요.

### API Key 누락 또는 401 / 403

템플릿이 `ANTHROPIC_AUTH_TOKEN`과 `ANTHROPIC_API_KEY` 중 어느 것을 요구하는지 확인합니다. Key의 유효성, 불필요한 공백, 대상 모델에 대한 권한과 크레딧도 확인하세요.

### 404 응답

Base URL을 `https://models.bytefuture.ai`로 설정하고 직접 추가한 `/messages`, `/v1/messages` 또는 다른 중복 경로를 제거합니다.

### 모델을 찾을 수 없거나 접근 권한이 없음

Token Station에서 전체 모델 ID를 복사하고 해당 Sonnet, Opus, Haiku 매핑을 확인합니다. App에 표시된 이름으로 ID를 추측하지 마세요.

### App은 응답하지만 Token Station에 기록이 없음

요청이 여전히 원래 서비스를 사용할 수 있습니다. 현재 Provider, 모델 매핑, 두 라우팅 스위치, App 재시작 여부, Token Station 계정과 활동 시간 필터를 차례로 확인합니다.

## 보안 참고 사항

- 실제 API Key를 튜토리얼 스크린샷에 포함하지 마세요
- CC Switch 설정 파일이나 인증 정보를 Git에 커밋하지 마세요
- 유출 가능성이 있으면 Key를 즉시 폐기하고 새로 발급하세요
- CC Switch 또는 Claude Desktop을 업그레이드하기 전에 작동하는 Provider를 백업하세요

## 정리

이 설정은 Token Station Provider, **Needs model mapping**, CC Switch 로컬 라우팅과 Claude 라우팅, Claude Desktop의 완전한 재시작이라는 네 요소가 함께 작동해야 합니다. 마지막으로 Token Station 활동 로그에서 요청을 확인해 실제로 어떤 서비스와 모델이 처리했는지 검증하세요.

## 참고 자료

- [Token Station 대시보드](https://models.bytefuture.ai/dashboard)
- [CC Switch 프로젝트](https://github.com/farion1231/cc-switch)
