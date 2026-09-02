---
slug: "configure-open-webui-with-token-station"
lang: "ko"
title: "Open WebUI를 Token Station에 연결하기"
summary: "Docker에서 Open WebUI를 실행하고 커스텀 OpenAI 호환 프로바이더로 Token Station에 연결하면, 모델 목록이 키의 전체 카탈로그에서 자동으로 채워진다. 모델을 하나씩 수동으로 등록할 필요가 없다. 관리자가 아닌 사용자도 모델을 쓸 수 있게 하는 방법과, 채팅 화면에서 모델을 전환하는 방법까지 다룬다."
category: "tutorial"
date: "2026-09-01"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/configure-open-webui-with-token-station-cover.png"
draft: false
---

[Open WebUI](https://github.com/open-webui/open-webui)는 어떤 OpenAI 호환 API에도 붙일 수 있는 셀프 호스팅 채팅 인터페이스다. Token Station을 지정하면 모델 목록이 키의 카탈로그에서 바로 자동으로 채워진다. 일부 다른 도구처럼 모델을 하나씩 수동으로 등록할 필요가 없다. 여기서는 Open WebUI 실행, Token Station 연결, 실제로 이 인스턴스를 쓰는 사람들에게 모델을 사용할 수 있게 하는 방법, 그리고 채팅 화면 자체에서 모델을 전환하는 방법까지 다룬다.

설정에 들어가기 전에, 프로바이더에 직접 돈을 내는 대신 Token Station을 거쳐 라우팅하는 이 시리즈의 다른 도구들과 같은 이유가 여기에도 적용된다. 비용 가시성(모든 요청이 프로바이더의 실제 요율로 마진 없이 과금되어 자신의 대시보드에 그대로 나타난다)과 통합 관리(같은 키가 실행 중인 모든 OpenAI 호환 도구에서 작동한다. Open WebUI도 예외가 아니며, 도구마다 별도의 키와 별도의 청구서를 준비할 필요가 없다)다. Open WebUI에는 그 자체에 특유한 세 번째 이유가 하나 더 있다. 이 시리즈에서 유일하게, 모델 목록이 자신만을 위해 한 번 설정하는 것이 아니라 팀이나 전체 사용자가 보고 선택하는 것이 되는 도구라는 점이다. 그래서 Token Station 키 하나로, 활성화한 모델에 대한 접근 권한을 인스턴스 전체 사용자에게 줄 수 있다. 각 사용자가 자기만의 프로바이더 계정을 가질 필요가 없다.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/configure-open-webui-with-token-station/walkthrough.mp4" type="video/mp4">
  </video>
  <figcaption>전체 과정: Open WebUI 실행, Token Station 연결, 모델 카탈로그 자동 채우기, 모델을 공개로 전환하기, 채팅 인터페이스에서 그 모델로 전환하기.</figcaption>
</figure>

## 시작하기 전에 필요한 것

- Docker 설치 및 실행 중일 것.
- Token Station 계정과 API 키. [models.bytefuture.ai](https://models.bytefuture.ai)에서 무료로 가입할 수 있다. 가입 시 1달러 크레딧이 지급되며 카드는 필요 없다.

## 1단계: Open WebUI 실행하기

Open WebUI는 별도의 백엔드 없이 단독으로 실행할 수 있다. 다음 명령으로 바로 시작한다.

```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

이 볼륨 마운트 덕분에 컨테이너를 재시작해도 설정과 계정이 유지된다. 실행되면 `http://localhost:3000`을 연다. 새 인스턴스에는 아직 계정이 없으므로, 처음 만드는 가입 계정이 자동으로 관리자 권한을 받는다. 기존 로그인을 찾으려 하지 말고 그냥 하나 만들면 된다.

## 2단계: Token Station을 프로바이더로 연결하기

관리자 화면에서 프로필 메뉴 → **Admin Panel** → **Settings** → **Connections**로 들어간 다음, **Manage OpenAI API Connections** 아래의 **➕ Add Connection**을 클릭한다. 다음을 설정한다.

- **URL**: `https://models.bytefuture.ai/v1`
- **Key**: Token Station API 키

URL 필드는 입력하는 동안 잘 알려진 프로바이더를 후보로 보여주는데, Token Station은 그 목록에 나오지 않는다. 이는 정상이며, 그냥 직접 입력하면 된다. 연결을 저장한다.

## 3단계: 모델 카탈로그가 자동으로 채워졌는지 확인하기

Open WebUI는 프로바이더의 `/models` 엔드포인트를 호출해 새 연결을 검증하고, 성공하면 그 키가 볼 수 있는 모델로 목록을 채운다. **Admin Panel → Settings → Models**를 열면, Token Station의 전체 카탈로그가 자동으로 나타나 있을 것이다. 모델을 하나씩 입력할 필요가 없다.

여기서 나타나는 내용에 대해 알아둘 점이 두 가지 있다.

- 목록에는 키가 접근할 수 있는 모든 모달리티가 포함된다. 채팅 모델뿐 아니라 이미지 생성, 동영상 생성, 음성 관련 모델(`openai/gpt-image-2`, `xai/grok-imagine-video`, `elevenlabs/scribe-v2` 등)도 함께 나타난다. 이 글은 일반 채팅만 검증했으므로, 같은 목록에 채팅이 아닌 모델이 나타난다고 해서 Open WebUI의 채팅 인터페이스가 그것들을 똑같이 처리해준다는 뜻은 아니다.
- **Arena Model**이라는 항목이 보일 수 있다. 이는 Open WebUI 자체의 내장 기능(같은 프롬프트를 여러 모델에 익명으로 보내 응답을 비교할 수 있게 해준다)이며, Token Station에서 보낸 것이 아니다. 설정 오류나 인식되지 않는 모델 ID로 착각하지 말자.

## 4단계: 사용자가 모델을 쓸 수 있게 하기

모든 모델은 처음에 **Private**로 시작하며, 관리자에게만 보인다. 인스턴스의 다른 가입 사용자가 모델을 선택할 수 있게 하려면, **Admin Panel → Settings → Models**를 열고 목록에서 해당 모델을 찾은 다음 옆의 **⋮** 메뉴를 클릭해 **Make Public**을 선택한다. 일괄 처리 기능은 없으므로 모델마다 개별적으로 해줘야 한다. 전체 공개보다 더 세밀한 제어를 원한다면, 같은 모델의 전체 설정 페이지(연필/편집 아이콘으로 진입)에 **Access** 버튼이 있어, 여기서 여는 **Access Control** 대화상자를 통해 Public 대신 특정 사용자나 그룹으로 이루어진 **Access List**를 만들 수도 있다.

일반적인 Token Station 카탈로그에는 20개가 넘는 모델이 있으므로, 3단계에서 언급한 모달리티가 섞여 있다는 점까지 고려하면, 모든 모델을 기본값으로 공개하기보다는 어떤 모델을 공개할지 의도적으로 정하는 편이 좋다.

## 5단계: 채팅 인터페이스에서 모델 전환하기

이것이 이 설정의 실제 목적이다. 어떤 모델이 활성화되면, 관리자뿐 아니라 어떤 사용자든 메인 채팅 화면의 모델 선택기에서 그 모델을 고를 수 있고, 공개된 모델들 사이를 전환할 수 있다. Docker나 환경 변수, 관리자 설정을 건드릴 필요가 전혀 없다.

어떤 모델이 목록에 나타나는 것을 넘어 실제로 엔드투엔드로 작동하는지 확인하려면, 그 모델을 선택해 실제 메시지를 보내고 [Token Station 대시보드](https://models.bytefuture.ai/dashboard)를 확인한다. 실제 응답과 함께 Recent Activity에 해당하는 행이 나타난다면, 연결과 키, 그리고 그 모델 자체가 모두 올바르게 설정됐다는 뜻이다. Open WebUI에서 어떤 사용자가 메시지를 보냈든, 비용은 그대로 자신의 Token Station 계정에 과금된다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하자. 1달러 무료 크레딧, 카드 불필요, 첫 충전 시 최대 50달러 보너스도 받을 수 있다. 키를 export하고, 위의 Docker 명령을 실행한 다음 연결하자.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
