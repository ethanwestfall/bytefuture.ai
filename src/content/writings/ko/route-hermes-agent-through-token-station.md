---
slug: "route-hermes-agent-through-token-station"
lang: "ko"
title: "Hermes Agent를 Token Station에 연결하기: GPT-5.6 Sol과 Luna"
summary: "Hermes Agent(Nous Research)는 어떤 OpenAI 호환 커스텀 엔드포인트도 지원한다. Token Station을 지정하면 OpenAI의 GPT-5.6 패밀리가 선택 가능한 모델로 나타나고, 실제 도구 사용과 제대로 작동하는 위임 설정까지 확인할 수 있다. 프런티어 모델이 계획을 세우고 저렴한 모델이 실행하며, 둘 다 같은 Token Station 키로 각각 과금된다."
category: "tutorial"
date: "2026-09-23"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-hermes-agent-through-token-station-cover.png"
draft: false
---

[Hermes Agent](https://hermes-agent.nousresearch.com/docs)는 Nous Research의 오픈소스 자율 에이전트다. 데스크톱 앱과 CLI/TUI로 구성되며, IDE 플러그인이 아니다. 영구 메모리, 스킬 시스템, 그리고 진짜 서브에이전트 위임 기능을 갖추고 있다. 이 시리즈의 다른 도구들과 마찬가지로 어떤 OpenAI 호환 커스텀 엔드포인트도 지원하므로, Token Station을 지정하면 OpenAI의 GPT-5.6 패밀리(Sol, Terra, Luna)를 선택 가능한 모델로 추가할 수 있고, 모두 자신의 Token Station 키로 과금된다.

이 글이 따로 다룰 가치가 있는 이유는 이렇다. Hermes의 위임 기능은 서브에이전트를 부모 대화와 다른 모델에서 실제로 실행할 수 있게 해준다. 이게 어디서나 성립하는 이야기는 아니다. Cursor 시리즈에서는 Cursor의 서브에이전트 `model:` 필드가 유효하고 문서화된 문법이지만 실제로는 아무 동작도 하지 않는다는 점을 기록해야 했다. 무엇을 지정하든 모든 서브에이전트는 조용히 부모 대화의 모델로 실행된다. Hermes의 `delegation.model`과 `delegation.provider` 설정은 위임한 작업을 실제로 다른 모델로 라우팅한다. 이는 아래에서 두 모델이 Token Station 자체 대시보드에 각각 따로 과금되어 나타나는 것으로 확인한다.

설정에 들어가기 전에, 프로바이더에 직접 돈을 내는 대신 Token Station을 거쳐 라우팅하는 다른 도구들과 같은 이유가 여기에도 적용된다. 비용 가시성(모든 요청이 프로바이더의 실제 요율로 마진 없이 과금되어 자신의 대시보드에 그대로 나타난다)과 통합 관리(같은 키와 같은 모델 ID가 사용 중인 모든 도구에서 작동한다. Hermes도 예외가 아니며, 도구마다 별도의 키와 청구서를 준비할 필요가 없다)다.

## 시작하기 전에 필요한 것

- Hermes Agent 설치. 데스크톱 앱은 [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com)에서, CLI만 설치하려면 `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`(Linux/macOS/WSL2) 또는 `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`(Windows PowerShell).
- Token Station 계정과 API 키. [models.bytefuture.ai](https://models.bytefuture.ai)에서 무료로 가입할 수 있으며 카드는 필요 없다.

## 1단계: Token Station을 커스텀 엔드포인트로 등록하기

Hermes 데스크톱 앱에서 **Settings → Providers → Custom Endpoints**를 열고 **+ Add Endpoint**를 클릭한다:

- **Name**: `Token Station`
- **Provider ID**: `token-station`
- **Endpoint URL**: `https://models.bytefuture.ai/v1`
- **Default Model**: `openai/gpt-5.6-sol`
- **Context**: `1050000`(Token Station에서 Sol의 실제 컨텍스트 윈도우다. 실제로 어떤 값으로 해석되는지 확인하지 않은 채 "Auto"로 두지 말 것)
- **API Key**: 자신의 Token Station 키
- **Use for new chats**와 **Discover models**는 체크된 상태로 둔다

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-hermes-agent-through-token-station/register-endpoint.mp4" type="video/mp4">
  </video>
  <figcaption>Hermes 데스크톱 버전의 Settings에서 Token Station을 커스텀 OpenAI 호환 엔드포인트로 등록한 다음, 확인하고 첫 메시지를 보내는 과정. 단계: Settings → Providers → Custom Endpoints → Add Endpoint를 연다. Name, Provider ID, Endpoint URL, Default Model, Context, API Key를 입력한다. Test를 클릭한다(반환값은 "Endpoint is reachable. Found 14 models."). Save를 클릭한다. 이제 Custom Endpoints 목록에서 엔드포인트가 Active로 표시된다. 새 세션을 열고 모델 선택기의 Token Station 섹션에서 openai/gpt-5.6-sol을 선택한 다음, 사소한 메시지("say hello")를 보내 실제 응답이 돌아오는지 확인한다.</figcaption>
</figure>

**Save**를 누르기 전에 **Test**를 클릭하자. **Discover models**가 켜져 있으면, 정상 작동하는 엔드포인트는 자신의 키가 볼 수 있는 모든 모델을 반환한다. 확인 메시지는 "Endpoint is reachable. Found 14 models."였다. 저장하면 모델 선택기의 "TOKEN STATION" 섹션에 전체 카탈로그가 나타난다. Sol과 Luna도 포함되어 있으며 두 번째 엔드포인트는 필요 없다.

초록색 Test 결과만 보고 멈추지 말자. 새 세션을 열어 실제로 `openai/gpt-5.6-sol`을 선택하고 사소한 메시지를 보내보자. 실제 응답만이 키와 URL, 모델 이름이 엔드투엔드로 모두 올바르다는 유일한 증거다.

## 2단계: 실제 도구 사용 확인하기(채팅뿐 아니라)

채팅에서 응답하는 모델과 실제로 행동할 수 있는 모델은 다르다. CLI(터미널에서 `hermes`)로 전환해서 실제 파일 작성이 필요한 작업을 맡겨보자:

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-hermes-agent-through-token-station/tool-use-demo.mp4" type="video/mp4">
  </video>
  <figcaption>openai/gpt-5.6-sol이 실제로 행동을 취할 수 있는지(단순히 설명만 하는 게 아니라) 확인하는 과정. 단계: 터미널에서 hermes를 실행한다. 모델 선택기를 연다(발견된 14개의 Token Station 모델 전체를 완전한 provider/model ID로 나열한다). openai/gpt-5.6-sol을 선택하면 "Model switched: openai/gpt-5.6-sol, Provider: token-station, Context: 1,050,000 tokens, Reasoning effort: medium"으로 확인된다. 인치를 센티미터로 변환하는 스크립트인 unit_conversion.py를 만들도록 지시한다. 계획을 세우고 파일을 작성한 다음 실제 터미널에서 실행하는 과정을 지켜본다(printf '10\n' | python unit_conversion.py). "Created and verified... Test run with 10 inches produced 25.4 centimeters."라고 보고한다. 같은 요청이 Token Station 대시보드에서 openai/gpt-5.6-sol에 과금된 것으로 나타난다.</figcaption>
</figure>

이는 Cursor+OpenAI 글에서 수정이 들어가기 전에 겪었던 것과 같은 함정이다. 코드를 읽고 논의하는 것과 실제로 편집하는 것은 다르다. 이번에는 수정이 필요 없었다. Sol은 `unit_conversion.py`를 작성하고 `printf '10\n' | python C:\Users\ethan\unit_conversion.py`를 실행한 다음, 코드가 무엇을 해야 하는지 설명하는 대신 실제 출력("Test run with 10 inches produced 25.4 centimeters")을 보고했다.

## 3단계: 위임을 더 저렴한 모델로 지정하기

Hermes에서 위임된 하위 작업은 `delegation.model`과 `delegation.provider`로 설정해서 부모 대화와 다른 모델에서 실행할 수 있다. Hermes는 자체 터미널 도구를 가지고 있으므로, 채팅 세션에서 Hermes에게 직접 이 명령을 실행해달라고 요청하는 방식으로 설정할 수 있다:

```
hermes config set delegation.model openai/gpt-5.6-luna
hermes config set delegation.provider token-station
```

Hermes는 둘 다 확인해주었다: "Set and verified: delegation.model = openai/gpt-5.6-luna"와 "Set and verified: delegation.provider = token-station". 확인 메시지 텍스트만 믿기보다 다시 한번 확인해볼 가치가 있다:

```
hermes config get delegation.model
hermes config get delegation.provider
```

| Model | Cost (input/output per M) | Role in this setup |
|---|---|---|
| `openai/gpt-5.6-sol` | $5 / $30 | 메인 에이전트: 작업을 계획하고, 범위가 명확한 하위 작업을 위임한다. |
| `openai/gpt-5.6-luna` | $1 / $6 | 위임받는 워커: 넘겨받은, 범위가 명확한 작업을 실행한다. |
| `openai/gpt-5.6-terra` | $2.50 / $15 | 같은 엔드포인트에서 사용할 수 있지만, 이 데모에서는 쓰지 않았다. |

## 4단계: 위임이 실제로 더 저렴한 모델에 도달하는지 확인하기

2단계에서 이미 `unit_conversion.py`가 만들어져 있으니, 범위가 명확한 하위 작업의 위임이 분명히 필요한 작업을 줘보자:

```
Add input validation to unit_conversion.py. Delegate to a subagent (via delegate_task) the job of writing three test cases covering negative numbers, zero, and non-numeric input, with context that the file lives at C:\Users\ethan\unit_conversion.py and takes inches, outputs centimeters. Once the subagent returns, incorporate its test cases into a new test_unit_conversion.py, then run it and report the results.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-hermes-agent-through-token-station/delegation-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol이 범위가 명확한 하위 작업을 Luna에게 위임하고, 그 결과를 통합하는 과정. 단계: delegation.model과 delegation.provider를 설정하고(위에서 보인 대로) 확인한다. 위의 프롬프트를 보낸다. Hermes는 서브에이전트를 생성하고("preparing delegate_task... delegate 1x: Write three unit-test cases..."), 그것이 백그라운드에서 실행되는 동안 계속 작업한다("Background task running, I'll resume when it finishes"). 실시간 상태 표시줄이 서브에이전트의 진행 상황을 추적한다. 결과가 돌아오면("Subagent Task Completed"), Sol은 unit_conversion.py에 입력 검증을 패치하고, 위임받은 테스트 케이스를 test_unit_conversion.py에 작성한 다음 실행한다. 최종 결과: "Implemented and verified"이며, 추가된 검증 내용과 음수, 0, 비숫자 입력을 다루는 세 가지 테스트 케이스가 나열된다.</figcaption>
</figure>

Hermes는 범위가 명확하고 그 자체로 완결된 지시로 서브에이전트를 생성했다: "Write three unit-test cases for unit_conversion.py covering negative numbers, zero, and non-numeric input. Return the complete test code and briefly state the expected behavior for each case. Do not modify files." Hermes의 서브에이전트는 부모 대화의 기록을 전혀 받지 않으므로 목표와 맥락이 그 자체로 완결되어 있어야 하는데, 여기서는 그랬다. 서브에이전트가 테스트를 작성했고, Sol은 그것을 `test_unit_conversion.py`에 통합하고 `unit_conversion.py`에 실제 입력 검증을 추가한 다음 테스트를 실행했다.

위임이 실제로 두 번째 모델을 사용했다는 증거는, 이 세션이 실행된 몇 분 동안의 Token Station Usage 페이지 요청 기록에 있다.

<figure>
  <img src="/blog/route-hermes-agent-through-token-station/usage-sol-luna-interleaved.png" alt="Token Station Usage page request history showing openai/gpt-5.6-sol and openai/gpt-5.6-luna requests interleaved within the same two-minute window" />
  <figcaption>같은 세션의 Token Station 요청 기록: openai/gpt-5.6-sol과 openai/gpt-5.6-luna 요청이 분 단위로 교차하며 나타나고, 각각 따로 과금된다.</figcaption>
</figure>

`openai/gpt-5.6-sol`과 `openai/gpt-5.6-luna` 요청은 같은 몇 분 사이 로그에서 번갈아 나타나며, 각각 고유한 토큰 수와 비용을 갖는다. 이는 프런티어 모델이 계획하고 저렴한 모델이 실행하는 패턴이 문서상의 주장이 아니라 실제로 작동한다는 증거다.

## 지금 되는 것

Hermes에서 Token Station을 커스텀 OpenAI 호환 엔드포인트로 등록하는 과정은 데스크톱 앱의 Settings에서 작동하며, 엔드포인트 하나로 전체 카탈로그가 자동으로 발견된다. 실제 도구 사용, 즉 실제 파일을 작성하고 실행하는 것은 단순한 채팅 응답을 넘어 `openai/gpt-5.6-sol`에서 확인되었다. 같은 Token Station 키로 더 저렴한 다른 모델에 위임하는 것도 엔드투엔드로 작동함이 확인되었다. `delegation.model`과 `delegation.provider`는 `delegate_task` 호출을 실제로 `openai/gpt-5.6-luna`로 라우팅하며, 부모 대화는 `openai/gpt-5.6-sol`에 그대로 남는다. 같은 세션 안에서 둘 다 Token Station 대시보드에 따로 과금되어 나타난다.

`openai/gpt-5.6-terra`도 같은 엔드포인트, 같은 설정으로 사용할 수 있지만, 이 글에서 따로 테스트하지는 않았다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하자. 카드는 필요 없고, 첫 충전 시 최대 50달러까지 100% 매칭 보너스를 받을 수 있다. 키를 export하고 Hermes에 커스텀 엔드포인트로 등록한 다음, 위의 라우트를 추가하자.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
