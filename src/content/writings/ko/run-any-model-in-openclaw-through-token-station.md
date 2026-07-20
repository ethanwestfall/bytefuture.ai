---
slug: "run-any-model-in-openclaw-through-token-station"
lang: "ko"
title: "Token Station을 통해 OpenClaw에서 어떤 모델이든 실행하기"
summary: "OpenClaw는 온보딩 위저드와 CLI를 통해 커스텀 프로바이더를 지원한다. Token Station의 OpenAI 호환 엔드포인트(21개 프로바이더에 걸친 250개 이상의 모델)를 가리키기만 하면, 기존 설정의 다른 부분을 전혀 바꾸지 않고 GPT-5.5, Claude Opus, Kimi K2, Grok을 실행할 수 있다."
category: "tutorial"
date: "2026-07-20"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

OpenClaw는 온보딩 위저드와 CLI를 통해 커스텀 프로바이더(어떤 OpenAI 호환 또는 Anthropic 호환 엔드포인트든)를 지원한다. Token Station의 통합 API는 `https://models.bytefuture.ai/v1`에 있으며, OpenAI 호환 인터페이스를 통해 21개 프로바이더에 걸친 250개 이상의 모델을 제공한다. OpenClaw를 Token Station으로 향하게 하면 GPT-5.5, Claude Opus, Kimi K2, Grok, 그 밖에 Token Station에 있는 어떤 모델이든 설정의 다른 부분을 전혀 바꾸지 않고 실행할 수 있다. 키 하나, 엔드포인트 하나, 어떤 모델이든.

## 시작하기 전에 필요한 것

- Node 22.22.3+, 24.15+, 또는 25.9+(기본값으로는 Node 24를 권장). `node --version`으로 확인한다.
- Token Station 계정과 API 키. [models.bytefuture.ai](https://models.bytefuture.ai)에서 무료로 가입할 수 있다. 가입 시 1달러 크레딧이 지급되며 카드는 필요 없다.
- OpenClaw 설치(아래 1단계 참고).

## 1단계: OpenClaw 설치하기

**macOS / Linux / WSL2**: `--no-onboard` 플래그는 자동으로 실행되는 위저드를 건너뛰어, 2단계에서 Token Station을 따로 설정할 수 있게 해준다.

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

**Windows(PowerShell) 또는 npm을 쓰는 모든 플랫폼**: npm install은 온보딩을 자동으로 실행하지 않는다.

```bash
npm install -g openclaw@latest
```

바이너리가 제대로 동작하는지 확인한다.

```bash
openclaw --version
```

## 2단계: Token Station을 프로바이더로 설정하기

Token Station 키를 export한 다음, 커스텀 프로바이더 플래그와 함께 온보딩을 실행한다.

```bash
# macOS / Linux / WSL2
export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

# Windows PowerShell
$env:TOKEN_STATION_API_KEY = "YOUR_TOKEN_STATION_KEY"
```

```bash
openclaw onboard --install-daemon --non-interactive --accept-risk \
  --auth-choice custom-api-key \
  --custom-base-url "https://models.bytefuture.ai/v1" \
  --custom-model-id "openai/gpt-5.4-mini" \
  --custom-api-key "$TOKEN_STATION_API_KEY" \
  --secret-input-mode plaintext \
  --custom-compatibility openai
```

이 명령은 OpenClaw에 Token Station을 프로바이더로 설정하고, 백그라운드 데몬을 설치하고, 기본 모델로 `openai/gpt-5.4-mini`를 지정한다.

**각 플래그의 역할**

| 플래그 | 의미 |
|---|---|
| `--auth-choice custom-api-key` | 이름이 지정된 프로바이더(OpenAI, Anthropic 등) 대신 커스텀 API 키 프로바이더 경로를 선택한다. |
| `--custom-base-url` | OpenClaw가 요청을 보내는 엔드포인트. Token Station의 OpenAI 호환 베이스는 `https://models.bytefuture.ai/v1`이다. |
| `--custom-model-id` | OpenClaw가 사용할 기본 모델 ID로, `provider/model` 형식이다. |
| `--custom-api-key` | 당신의 Token Station API 키. `$TOKEN_STATION_API_KEY` 참조를 쓰면 시크릿이 셸 히스토리에 남지 않는다. |
| `--secret-input-mode` | OpenClaw가 API 키를 저장하는 방식. `plaintext`는 키를 에이전트의 인증 프로필에 그대로 디스크에 저장한다. |
| `--custom-compatibility` | 와이어 프로토콜을 제어한다. `openai`는 표준 chat completions를 사용하며, Token Station에는 이것이 맞는 선택이다. `/v1/responses`는 지원하지만 `/v1/chat/completions`는 지원하지 않는 엔드포인트에서만 `openai-responses`를 사용한다. Anthropic 네이티브 엔드포인트에는 `anthropic`을 사용한다. |
| `--install-daemon` | OpenClaw를 백그라운드 서비스로 설치한다(macOS에서는 LaunchAgent, Linux/WSL2에서는 systemd, Windows에서는 예약 작업이며, 작업 생성이 거부되면 시작 프로그램 폴더로 대체된다). |

**대화형 위저드를 선호한다면**, 다른 플래그 없이 `openclaw onboard --install-daemon`을 실행하면 된다. 위저드가 Model/Auth 단계에 도달하면 커스텀 프로바이더 옵션을 선택하고 OpenAI 호환을 고른 다음, 베이스 URL에 `https://models.bytefuture.ai/v1`을, API 키에 Token Station 키를 입력한다.

## 3단계: 게이트웨이가 실행 중인지 확인하기

```bash
openclaw gateway status
```

2단계에서 설치한 데몬이 이미 게이트웨이를 실행 중이어야 한다. 그렇지 않다면 상태 명령이 무엇이 문제인지 알려준다.

## 4단계: 컨트롤 UI를 열어 확인하기

```bash
openclaw dashboard
```

대시보드는 브라우저에서 `http://127.0.0.1:18789/`로 열린다. 채팅을 시작해 보자. 에이전트가 응답하면 OpenClaw가 Token Station과 통신하고 있고 모델이 답하고 있다는 뜻이다.

## 명령 하나로 모델 바꾸기

Token Station의 모든 모델은 같은 엔드포인트, 같은 키 뒤에 있다. 기본 모델을 바꾸려면:

```bash
openclaw configure --section model
```

또는 다른 `--custom-model-id`로 온보딩을 다시 실행한다. 선택할 수 있는 모델 ID 몇 가지:

| 모델 ID | 적합한 용도 |
|---|---|
| `openai/gpt-5.5` | 프리미엄 플래그십. 어려운 플래닝, 디버깅, 아키텍처 설계에 적합. |
| `openai/gpt-5.4` | 플래그십보다 낮은 가격에 강력한 추론력. |
| `openai/gpt-5.4-mini` | 대부분의 작업에 균형 잡힌 일상용 모델로, 비용도 낮다. |
| `anthropic/claude-opus-4-8` | 장기간에 걸친 에이전트형 추론과 깊이 있는 분석에 적합. |
| `kimi/kimi-k2.7-code` | 깊이보다 비용이 중요한 일상적인 코딩 작업에 적합. |
| `xai/grok-build-0.1` | 빠르고 저렴해서 빠른 응답에 적합. |
| `glm/glm-5.2` | 100만 토큰 컨텍스트 윈도우. 코드에 강하고 저렴. |

모델을 바꿔도 게이트웨이, 채널, 데몬은 그대로다. 바뀌는 것은 Token Station으로 전송되는 모델 ID뿐이다.

## 스마트 라우팅: 정책이 모델을 고르게 하기

대부분의 설정에서는 모델을 하드코딩하는 것으로 충분하다. Token Station은 서버 측에서 라우팅 정책을 정의할 수도 있게 해준다. 품질 하한선을 만족하는 가장 저렴한 모델, 프로바이더 허용 목록과 함께 지연 시간에 상한을 둔 정책, 또는 주 모델에 자동 폴백을 붙인 방식 등이다.

OpenClaw의 경우, `--custom-model-id`를 Token Station의 라우팅 대상 워크로드로 향하게 하면 라우팅 로직은 Token Station 쪽에 남는다. 주 모델이 다운되면 폴백이 대신 응답하고, OpenClaw는 그 사실을 알 필요조차 없다. 정책은 Token Station에서 업데이트하면 되고, OpenClaw 설정은 아무것도 바뀌지 않는다.

## 유용한 환경 변수

기본이 아닌 위치를 써야 한다면 데몬을 시작하기 전에 다음을 설정한다.

| 변수 | 용도 |
|---|---|
| `OPENCLAW_HOME` | 내부 경로 해석에 쓰이는 홈 디렉터리를 재정의한다. |
| `OPENCLAW_STATE_DIR` | 상태 디렉터리를 재정의한다. |
| `OPENCLAW_CONFIG_PATH` | 설정 파일 경로를 재정의한다. |

## 연결이 안 될 때

**401 / 인증 오류.** Token Station 키가 올바른지 확인한다. 수정한 `--custom-api-key`로 온보딩 명령을 다시 실행하거나, `openclaw configure --section model`로 대화형으로 자격 증명을 업데이트한다.

**모델이 틀렸거나 찾을 수 없음.** [models.bytefuture.ai/models](https://models.bytefuture.ai/models)의 Token Station 카탈로그에 나온 그대로 모델 ID가 일치하는지 확인한다. `openclaw configure --section model`로 모델 ID를 업데이트한다.

**게이트웨이가 실행되고 있지 않음.** `openclaw gateway status`를 실행한다. 게이트웨이를 재시작하려면 `openclaw gateway restart`를 사용한다. 데몬을 처음부터 다시 설치하려면 `openclaw onboard --install-daemon`을 다시 실행한다.

**대시보드가 로드되지 않음.** 게이트웨이가 먼저 실행 중이어야 한다. `openclaw gateway status`로 확인한 다음 `openclaw dashboard`를 다시 시도한다.

**설정 문제 또는 예기치 않은 동작.** `openclaw doctor`를 실행해 잘못되었거나 오래된 설정을 진단한 다음, 발견된 문제를 고치기 위해 `openclaw configure`를 다시 실행한다.

## 시작하기

OpenClaw에 Token Station을 설정하는 것은 명령 하나와 환경 변수 하나로 끝난다. 데몬이 실행되면, 모델을 바꾸는 것도 `openclaw configure --section model` 호출 한 번이면 되고 설정의 다른 부분은 아무것도 바뀌지 않는다.

[models.bytefuture.ai](https://models.bytefuture.ai)에서 가입하고(1달러 무료 크레딧, 카드 불필요, 첫 충전 시 최대 50달러 보너스), 키를 export하고, 온보딩 명령을 실행하고, 대시보드를 열어보자. 키 하나, 엔드포인트 하나로 당신의 OpenClaw 환경에 필요한 모든 모델을 쓸 수 있다.
