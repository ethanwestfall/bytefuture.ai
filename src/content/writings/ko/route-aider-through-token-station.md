---
slug: "route-aider-through-token-station"
lang: "ko"
title: "Aider를 Token Station에 연결하기: GPT-5.6 Sol과 Luna"
summary: "Aider는 어떤 OpenAI 호환 엔드포인트도 지원하는, 터미널 기반 오픈소스 코딩 에이전트다. Token Station을 지정하면 architect/editor 모드가 계획과 편집을 서로 다른 두 모델로 실제로 나누어 처리한다는 것을 Token Station 자체의 사용량 로그로 확인할 수 있다. 그 과정에서 실제로 겪은 몇 가지 함정도 있었다: Python 버전 때문에 생기는 설치 함정, 이중으로 붙는 openai/ 접두사, 그리고 테스트 결과를 확인하지 않고 단정만 하는 architect."
category: "tutorial"
date: "2026-10-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-aider-through-token-station-cover.png"
draft: false
---

[Aider](https://aider.chat)는 오픈소스 터미널 기반 AI 페어 프로그래밍 도구다. 데스크톱 앱도, IDE 플러그인도 없다. 로컬 git 저장소의 파일을 편집하고 작업하면서 커밋해 나가는 CLI가 전부다. 이 시리즈의 다른 도구들과 마찬가지로 어떤 OpenAI 호환 커스텀 엔드포인트도 지원하므로, Token Station을 지정하면 OpenAI의 GPT-5.6 패밀리를 선택 가능한 모델로 추가할 수 있고, 모두 자신의 Token Station 키로 과금된다.

이 글이 따로 다룰 가치가 있는 이유는 이렇다. Aider에는 내장된 **architect/editor 모드**가 있어서, 한 모델이 변경 사항을 자연어로 계획하고 다른 모델이 그 계획을 실제 diff로 바꾼다. 이는 Hermes 글에서 다룬 서브에이전트 위임과는 다른 방식의 분담이며, 따로 확인할 가치가 있다. "문서에 두 모델을 설정할 수 있다고 적혀 있다"는 것과 "두 번째 모델이 실제로 과금되고 실제로 작업을 처리한다"는 것은 같은 주장이 아니기 때문이다.

설정에 들어가기 전에, 프로바이더에 직접 돈을 내는 대신 Token Station을 거쳐 라우팅하는 다른 도구들과 같은 이유가 여기에도 적용된다. 비용 가시성(모든 요청이 프로바이더의 실제 요율로 마진 없이 과금되어 자신의 대시보드에 그대로 나타난다)과 통합 관리(같은 키와 같은 모델 ID가 사용 중인 모든 도구에서 작동한다. Aider도 예외가 아니다)다.

## 시작하기 전에 필요한 것

- Aider 설치: `pip install aider-chat`. 직접 겪기 전에 알아두면 좋을 함정이 하나 있다. 아주 최신 Python(이 글을 쓰는 시점 기준 3.14)에서는 pip이 조용히 오래된 `aider-chat` 릴리스로 해석해버릴 수 있는데, 그 버전은 2023년 당시 의존성에 고정되어 있어 빌드가 실패한다. Python 3.12 가상 환경을 쓰면 이 문제를 완전히 피할 수 있다. 정확한 실패 내용은 아래 "알아둘 만한 특이점"을 참고하자.
- Token Station 계정과 API 키. [models.bytefuture.ai](https://models.bytefuture.ai)에서 무료로 가입할 수 있으며 카드는 필요 없다.

## 1단계: Aider 설치 후 Token Station에 연결하기

Python 3.12 가상 환경을 활성화한 상태에서 Aider를 설치하고, 프로젝트를 만들고, Token Station의 OpenAI 호환 엔드포인트를 가리키게 설정한다.

```
pip install aider-chat
mkdir aider-demo
cd aider-demo
git init
```

```powershell
$env:OPENAI_API_BASE = "https://models.bytefuture.ai/v1"
$env:OPENAI_API_KEY  = "gw-YOUR_TOKEN_STATION_KEY"
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/setup-aider.mp4" type="video/mp4">
  </video>
  <figcaption>Aider를 Python 3.12 가상 환경에 설치하고, 프로젝트를 만들고, git init을 실행한 다음 OPENAI_API_BASE와 OPENAI_API_KEY를 설정한다(화면의 키는 가려져 있다). 마지막에 하는 동작 확인용 실행, --model 플래그 없이 그냥 aider를 실행하면 Aider 자체의 기본값("Main model: gpt-4o with diff edit format, Weak model: gpt-4o-mini")으로 시작하며 아직 Token Station에 연결된 상태가 아니다. 모델 선택은 다음 단계에서 이루어진다.</figcaption>
</figure>

## 2단계: 연결이 실제로 되는지 확인하기

Aider는 모든 호출을 [litellm](https://github.com/BerriAI/litellm)을 통해 라우팅한다. `--model`에 붙는 `openai/` 접두사는 `OPENAI_API_BASE`가 가리키는 곳에 OpenAI 호환 프로토콜로 말하라는 뜻이고, litellm은 그 접두사 뒤의 문자열을 그대로 model 필드로 전달한다. Token Station 자체의 모델 ID에는 이미 벤더 접두사가 붙어 있어서(`openai/gpt-5.6-sol`), 완전한 인자는 결국 이중 접두사가 된다: `openai/openai/gpt-5.6-sol`. 오타처럼 보이지만 아니다. Aider 자체 문서가 바깥쪽 `openai/` 뒤의 문자열이 그대로 엔드포인트로 전달된다는 것을 확인해주며, 안쪽 `openai/`는 그냥 Token Station 모델 ID의 일부일 뿐 정리해야 할 실수가 아니다.

```
aider --model openai/openai/gpt-5.6-sol
```

프롬프트에 입력: `say hello and tell me what model you are`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/connectivity-test.mp4" type="video/mp4">
  </video>
  <figcaption>--model openai/openai/gpt-5.6-sol로 Aider를 실행한다. Aider는 이 이중 접두사 이름을 로컬에서 인식하지 못한다고 경고하는데("Unknown context window size and costs, using sane defaults"), 이는 무해하다. 이 경고는 Aider의 로컬 비용 추정 표에 관한 것이지 호출이 작동하는지 여부와는 상관없다. 모델의 응답: "Hello! I'm ChatGPT, an AI language model created by OpenAI. No code changes are needed."</figcaption>
</figure>

솔직히 짚고 넘어갈 부분이 있다. 이 응답은 일반적이고 틀에 박힌 자기소개다. Sol이라고 구체적으로 밝히지 않으므로, 이 응답만으로는 `gpt-5.6-sol`이 요청을 처리했다는 증거가 되지 않는다. Aider가 출력하는 토큰 집계(609 sent, 23 received)와, 더 확실한 증거인 Token Station 자체의 요청 로그가 실제로 어떤 모델이 응답했는지 확인해주는 것이지, 모델이 자신에 대해 하는 말이 아니다.

## 3단계: 실제 도구 사용 확인하기

채팅으로 답할 수 있는 모델과 실제로 작동하는 파일을 쓸 수 있는 모델은 다르다. 새 세션을 열고, 같은 모델로, 실제로 뭔가를 만들어야 하는 작업을 맡긴다.

```
aider --model openai/openai/gpt-5.6-sol
```

프롬프트: `Create temperature_converter.py with a function celsius_to_farenheit(c) that converts Celsius to Fahrenheit, plus a --main-- block that converts 100 and prints the result.`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/tool-use-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol이 temperature_converter.py를 작성한다: celsius_to_farenheit 함수와 100°C 변환 결과를 출력하는 __main__ 블록. Aider는 diff를 보여주고, 파일을 생성할지 물은 다음, 적용하고, 자동으로 커밋한다("Commit 7cea5c4 feat: add Celsius-to-Fahrenheit temperature converter"). 이 영상은 작성과 커밋까지만 보여준다. 이 코드가 실제로 실행되고 검증되는 것은 다음 단계, 실제 테스트 실행을 통해서다.</figcaption>
</figure>

```python
def celsius_to_farenheit(c):
    return (c * 9 / 5) + 32


if __name__ == "__main__":
    print(celsius_to_farenheit(100))
```

(함수 이름의 오타는 프롬프트 자체에서 온 것이지 Sol이 만들어낸 것이 아니다. 다음 단계에서 Aider의 architect 모드가 실제로 손상된 파일을 다루는 방식이 완전히 다르기 때문에, 기억해둘 가치가 있다.)

## 4단계: architect와 editor를 두 모델로 나누기

Aider의 architect/editor 모드는 계획은 한 모델에, 실제 수정은 다른 모델에 보내며, 둘은 독립적으로 설정할 수 있다.

```
aider --architect --model openai/openai/gpt-5.6-sol --editor-model openai/openai/gpt-5.6-luna
```

| Model | Cost (input/output per M) | Role in this setup |
|---|---|---|
| `openai/gpt-5.6-sol` | $5 / $30 | Architect: 파일을 읽고 자연어로 변경을 계획한다. |
| `openai/gpt-5.6-luna` | $1 / $6 | Editor: 그 계획을 실제 diff로 바꾼다. |

프롬프트: `Add input validation to celsius_to_fahrenheit so it raises ValueError on non-numeric input, then write test_temperature_converter.py with three cases: a normal conversion, 0, and a non-numeric input that should raise ValueError.`

지난 단계를 녹화한 시점과 이번 단계 사이에 `temperature_converter.py`에 진짜 사고가 하나 있었다. 엉뚱한 곳에 입력된 명령이 파일을 그 명령 자체의 텍스트로 덮어써버렸고, 파일에는 글자 그대로 `python temperature_converter.py`라는 한 줄만 남아 있었다. 실수로 남은 것이지만, 남겨둘 가치가 있다. Sol이 이 파일을 읽고 그 한 줄을 "유효한 Python 소스가 아니다"라고 정확히 짚어내고, 쓰레기 위에 패치를 얹는 대신 깔끔하게 다시 작성했기 때문이다.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/architect-editor-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol(architect)이 파일을 읽고, 엉뚱하게 남은 한 줄을 무효로 표시한 다음, Luna(editor)에게 정확한 지시를 내린다: isinstance(celsius, Real)로 검증하고, 실패하면 raise ValueError("celsius must be numeric")하고, celsius * 9 / 5 + 32를 반환할 것, 그리고 test_temperature_converter.py를 위한 pytest 테스트 세 개. Luna가 수정을 적용하고 Aider가 자동으로 커밋한다("Commit 105d10f feat: add validated Celsius-to-Fahrenheit conversion"). 이어서 Sol은 "I can't execute shell commands in this environment... the tests should pass: 3 passed"라고 말하는데, 이는 결과를 확인한 것이 아니라 단정한 것이다. 종료한 뒤 python -m pytest test_temperature_converter.py -v를 직접 실행하면 진짜 답을 얻는다: 3 passed in 0.03s. 영상은 Token Station 대시보드에서 끝나는데, gpt-5.6-sol과 gpt-5.6-luna의 요청이 같은 세션 안에서 번갈아 나타나는 모습을 보여준다.</figcaption>
</figure>

```python
from numbers import Real


def celsius_to_fahrenheit(celsius):
    if not isinstance(celsius, Real):
        raise ValueError("celsius must be numeric")
    return celsius * 9 / 5 + 32
```

```python
import pytest
from temperature_converter import celsius_to_fahrenheit


def test_normal_conversion():
    assert celsius_to_fahrenheit(25) == 77


def test_zero_celsius():
    assert celsius_to_fahrenheit(0) == 32


def test_non_numeric_input():
    with pytest.raises(ValueError):
        celsius_to_fahrenheit("not a number")
```

알아둘 만한 점: Hermes 글에서는 에이전트가 직접 명령을 실행하고 실제 출력을 보고했지만, Aider의 architect/editor 루프는 기본적으로 아무것도 실행하지 않는다. 확인하는 대신 단정한다. Aider에는 세션 내부에서 셸 명령을 실행하는 방법, `/run <command>`가 있어서 채팅을 벗어나지 않고도 테스트를 돌릴 수 있지만, 모델 스스로는 기본적으로 그걸 먼저 쓰려 하지 않는다.

이 분담이 실제로 두 모델을 사용했다는 증거: Token Station의 Usage 페이지, 이 세션이 돌아간 몇 분 동안의 요청 기록이다.

<figure>
  <img src="/blog/route-aider-through-token-station/usage-sol-luna-interleaved.jpg" alt="Token Station Usage page request history showing openai/gpt-5.6-sol and openai/gpt-5.6-luna requests interleaved within the same two-minute window" />
  <figcaption>같은 세션의 Token Station 요청 기록: 01:11:28부터 01:12:13 사이의 다섯 건의 요청에서 gpt-5.6-sol과 gpt-5.6-luna가 번갈아 나타나고, 각각 따로 과금된다(Luna의 작은 호출 한 건 $0.000235부터, Sol의 큰 호출 한 건 $0.006252까지).</figcaption>
</figure>

## 지금 되는 것

Aider를 Token Station에 범용 OpenAI 호환 엔드포인트로 연결하는 것은 작동하며, 이중으로 붙는 `openai/` 접두사가 헷갈리는 오류를 통해 알게 되기보다는 미리 알아두면 좋을 유일한 문법 포인트다. 실제 도구 사용, 즉 실제 파일을 작성하고 커밋하는 것은 `openai/gpt-5.6-sol`에서 확인되었다. Architect/editor 모드는 실제로 작업을 두 모델로 나눈다: Sol이 계획하고 Luna가 편집한다. 이는 Aider 자체가 출력하는 "Editor model:" 시작 메시지와, Token Station 대시보드에서 두 모델이 같은 세션 안에서 따로 과금되는 것으로 모두 확인된다.

## 알아둘 만한 특이점

- **아주 최신 Python이 설치를 깨뜨릴 수 있다.** Python 3.14에서 pip은 `aider-chat`을 오래된 0.16.0 릴리스로 해석했고, 그 버전은 2023년 의존성에 고정되어 있었다(`numpy==1.24.3`, `aiohttp==3.8.4`). 그 오래된 numpy를 소스에서 빌드하는 것은 그대로 실패했다. Python 3.12 가상 환경을 쓰면 현재 릴리스를 깔끔하게 설치할 수 있다.
- **모델 인자는 이중 접두사다.** `openai/`는 Aider의 litellm 레이어에 `OPENAI_API_BASE`로 OpenAI 호환 프로토콜로 말하라고 지시하며, 그 뒤의 모든 내용은 그대로 전달된다. Token Station 자체의 모델 ID가 이미 벤더 이름으로 시작하기 때문에 전체 인자가 중복처럼 보이지만(`openai/openai/gpt-5.6-sol`), 이게 맞다.
- **모델이 자기 이름을 대는 것은 아무것도 증명하지 않는다.** 무슨 모델이냐고 물었을 때 Sol은 일반적인 "I'm ChatGPT" 식 자기소개로 답했고, 모델을 특정하는 답은 아니었다. 실제로 어떤 모델이 돌고 있는지 확인해주는 것은 모델의 자기 진술이 아니라 Token Station 자체의 요청 로그다.
- **Aider 프롬프트에 셸 명령을 입력해도 실행되지 않는다.** `architect>` 프롬프트가 보내는 것은 채팅 메시지이지 터미널 명령이 아니다. 거기에 `pip install pytest`를 입력해도 그저 그 얘기를 나눌 뿐 실행되지는 않는다. 세션 내부에서 실제로 뭔가를 실행하려면 `/run <command>`를 쓰거나 별도의 터미널을 열어야 한다.
- **Architect/editor 모드는 스스로 검증하지 않는다.** Sol은 "the tests should pass: 3 passed"라고 단정했지만 아무것도 실행하지 않았다. 이를 확인하려면 그 뒤에 실제로 `pytest`를 실행해야 했다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하자. 카드는 필요 없고, 첫 충전 시 최대 50달러까지 100% 매칭 보너스를 받을 수 있다. 키를 export하고, `OPENAI_API_BASE`와 `OPENAI_API_KEY`를 설정한 다음, `--model`을 시도해보고 싶은 Token Station 모델로 향하게 하자.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
