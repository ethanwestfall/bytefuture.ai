---
slug: "configure-claude-code-app-with-cc-switch-and-token-station"
lang: "ko"
title: "CC Switch로 Claude Code App에 Token Station 설정하기"
summary: "CC Switch에서 Token Station Provider를 만들고 활성화한 뒤 Claude Code App이 새 설정을 읽도록 재시작하고 실제 요청과 활동 기록으로 경로를 검증합니다."
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

Claude Code App을 공식 서비스, Token Station, 다른 모델 서비스 사이에서 전환할 때마다 설정을 직접 바꾸는 것은 번거롭습니다. CC Switch는 연결 정보를 개별 Provider로 저장하고 선택한 설정을 적용합니다.

이 글에서는 CC Switch를 통해 Claude Code App에 Token Station을 설정하고 실제 요청으로 전체 경로를 검증합니다.

> 이 글은 CC Switch와 Claude Code App용입니다. Claude Code CLI는 실행 방식과 설정 위치가 다르므로 CLI 전용 절차를 사용하세요.

## 준비 사항

- CC Switch와 Claude Code App
- 사용 가능한 Token Station API key
- 대상 모델의 사용 권한 또는 잔액

[Token Station 대시보드](https://models.bytefuture.ai/dashboard)에서 API key와 전체 모델 ID를 확인하세요. 실제 key를 스크린샷, 채팅 또는 공개 문서에 표시하지 마세요.

## 설정 순서

1. CC Switch에서 Claude Code Provider 만들기
2. Token Station URL, API key, 모델 ID 입력하기
3. Provider 저장 및 활성화하기
4. Claude Code App 완전히 종료 후 다시 열기
5. 요청을 보내고 Token Station 기록 확인하기

## CC Switch에 Token Station 추가

CC Switch 버전에 따라 버튼 이름은 다를 수 있지만 필요한 값은 같습니다.

### 1. Provider 만들기

CC Switch에서 **Claude Code**를 선택하고 Provider 관리로 이동합니다. 추가, 새 Provider 또는 더하기 버튼을 누릅니다.

이름은 다음처럼 설정할 수 있습니다.

```text
Token Station
```

유형을 선택해야 한다면 Claude, Anthropic 또는 사용자 지정 Anthropic 호환 서비스를 선택하세요.

### 2. 연결 정보 입력

| 필드 | 값 |
| --- | --- |
| Base URL | `https://models.bytefuture.ai` |
| API Key / Auth Token | Token Station API key |
| Model | Token Station에 표시되는 전체 모델 ID |

환경 변수를 입력하는 화면에서는 다음을 사용합니다.

```text
ANTHROPIC_BASE_URL=https://models.bytefuture.ai
ANTHROPIC_AUTH_TOKEN=<你的 Token Station API Key>
ANTHROPIC_MODEL=<完整模型 ID>
```

일부 CC Switch 템플릿은 `ANTHROPIC_API_KEY`를 사용합니다. 현재 템플릿을 따르고 출처가 불분명한 여러 인증 변수를 동시에 설정하지 마세요.

Base URL에 `/v1/messages`를 추가하지 마세요. 클라이언트가 Anthropic Messages API 경로를 구성하므로 중복 경로는 404를 일으킬 수 있습니다.

모델 ID에는 제공자 접두사를 포함해야 합니다.

```text
openai/gpt-5.6-sol
```

Claude Code App의 표시 이름으로 대체하지 마세요.

### 3. 저장하고 활성화하기

저장 전에 확인하세요.

- Base URL에 불필요한 경로나 공백이 없음
- API key 앞뒤에 공백이나 줄바꿈이 없음
- 모델 ID에 제공자 접두사가 있음
- 자리표시자 기호와 설명을 값으로 복사하지 않음

저장 후 목록의 **Token Station**에서 Enable, Apply 또는 Switch를 누르고 현재 Provider로 표시되는지 확인합니다.

## Claude Code App 재시작

이미 실행 중인 App은 나중에 선택한 Provider를 자동으로 읽지 않는 경우가 많습니다.

### Windows

1. Claude Code App 창 닫기
2. 시스템 트레이에 프로세스가 남았는지 확인하기
3. 남아 있으면 종료하기
4. CC Switch에서 설정을 적용한 뒤 App 다시 열기

### macOS

1. Claude Code App에서 `Command + Q` 누르기
2. 프로세스가 끝났는지 확인하기
3. CC Switch에서 설정을 적용한 뒤 App 다시 열기

창만 닫는 것으로 프로세스가 끝나지 않을 수 있습니다.

## 전체 경로 검증

Claude Code App에서 새 대화를 만들고 다음을 보냅니다.

```text
请只回复：Token Station 测试成功
```

응답 후 [Token Station 대시보드](https://models.bytefuture.ai/dashboard)의 `Recent Activity`에서 확인하세요.

- 새 요청이 표시됨
- 시간과 상태가 일치함
- 기록된 모델이 CC Switch 설정과 일치함

App 응답과 Token Station 기록이 모두 있어야 경로가 활성화된 것입니다. CC Switch의 현재 Provider 표시만으로는 충분하지 않습니다.

## 이전 설정으로 돌아가기

공식 Provider를 덮어쓰지 말고 보관하세요. 복원할 때 원래 Provider를 선택하고 Apply 또는 Switch를 누른 뒤 Claude Code App을 완전히 종료하고 다시 엽니다.

## 문제 해결

### App이 이전 Provider를 사용함

창뿐 아니라 프로세스가 끝났는지 확인하세요. Token Station Provider를 다시 적용한 뒤 App을 실행합니다.

### API key가 없다고 표시됨

템플릿이 `ANTHROPIC_AUTH_TOKEN`과 `ANTHROPIC_API_KEY` 중 무엇을 요구하는지 확인하세요. 수정 후 Provider를 다시 적용하고 App을 재시작합니다.

### 401 또는 403

key가 잘못되었거나 만료되었거나 공백이 포함되었거나 대상 모델의 권한 또는 잔액이 없을 수 있습니다.

### 404

Base URL을 `https://models.bytefuture.ai`로 설정하고 직접 추가한 `/messages` 같은 중복 경로를 제거하세요.

### 모델을 찾을 수 없거나 권한이 없음

Token Station에서 전체 ID를 복사하세요. App의 표시 이름으로 추측하지 마세요.

### App은 응답하지만 Token Station 기록이 없음

원래 서비스를 계속 사용 중일 수 있습니다. 현재 Provider, App 재시작 여부, Token Station 계정과 시간 필터를 확인하세요.

## 보안

- 실제 API key를 튜토리얼 이미지에 표시하지 않기
- CC Switch 설정이나 인증 정보를 Git에 커밋하지 않기
- 유출 가능성이 있으면 key를 즉시 폐기하고 다시 발급하기
- CC Switch나 Claude Code App 업데이트 전 설정 백업하기

## 참고 자료

- [Token Station 대시보드](https://models.bytefuture.ai/dashboard)
- [CC Switch 프로젝트](https://github.com/farion1231/cc-switch)
