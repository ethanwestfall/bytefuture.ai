---
slug: gpt-6-sol-luna-token-station
lang: ko
title: "GPT-6 Sol과 Luna, 이제 Token Station에서 사용 가능"
summary: "OpenAI의 GPT-6 Sol과 GPT-6 Luna가 Token Station에 출시되었습니다. 동일한 이름의 GPT-5.6 모델보다 훨씬 저렴한 가격으로, GPT-6 Astra의 에이전트형 성능 향상을 바탕으로 만들어졌습니다. 사양, 가격, Claude Opus 5 및 Claude Fable 5 대비 벤치마크, 그리고 Astra 옆에서 Sol과 Luna가 차지하는 위치를 다룹니다."
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/gpt-6-sol-luna-token-station-cover.png
draft: false
---

GPT-6 Sol과 GPT-6 Luna가 Token Station에 `openai/gpt-6-sol`과 `openai/gpt-6-luna`로 출시되었습니다. 이미 GPT-6 Astra와 GPT-5.6 계열을 제공하고 있는 것과 동일한 OpenAI 호환 엔드포인트를 통해 이용할 수 있습니다.

OpenAI의 GPT-6 플래그십 모델인 Astra는 먼저 출시되었고, 가장 까다로운 에이전트형 작업과 컴퓨터 사용 작업에 맞춰 가격이 책정되었습니다. Sol과 Luna는 3주 뒤에 등장해, Astra의 기반 기술 상당 부분을 더 저렴하고 빠른 등급으로 가져왔습니다. Sol은 대화형 및 에이전트형 코딩을 위한 균형 잡힌 경로이고, Luna는 대량의 가벼운 작업을 위한 계열 내 최저가 옵션입니다.

## 실제로 달라진 점

동일한 이름의 GPT-5.6 모델과 비교하면, Sol의 정가는 60~67% 낮아지고 Luna의 정가는 90% 이상 낮아집니다(아래 가격 항목 참고). OpenAI 자체 벤치마크 발표는 이 향상을 단순한 성능 향상이라기보다 비용 효율성으로 설명합니다.

- **AutomationBench 1.0.6**(영업, 마케팅, 운영, 지원, 재무, 인사 전반에 걸친 47개 도구를 사용하는 비즈니스 워크플로): `xhigh` 강도의 Sol은 작업당 $0.27로 33.2%를 기록했으며, max 강도의 Claude Opus 5는 약 11배의 비용으로 26.9%를 기록했습니다.
- **Agents' Last Exam**: max 강도의 Sol은 56.4%에 도달해, Claude Opus 5의 최고 기록을 작업당 비용 약 60% 낮은 수준으로 근소하게 앞섭니다.
- **DeepSWE v1.1**(실제 코드베이스에서의 소프트웨어 엔지니어링 작업): max 강도의 Sol은 68.8%를 기록해, Claude Fable 5의 69.9%와 1.1포인트 차이로 근접하면서도 작업당 비용은 약 80% 낮습니다. 같은 벤치마크에서 medium 강도의 Luna는 66.6%에 도달해, medium 강도의 Claude Opus 5 및 Claude Fable 5와 비슷한 수준이면서 작업당 비용은 각각 93%, 96% 낮습니다.

이 중 어느 것도 Sol이나 Luna가 모든 측면에서 GPT-5.6 Sol이나 Astra보다 확실히 더 뛰어나다는 뜻은 아닙니다. 핵심은 비용입니다. 일부에 불과한 가격으로 비슷하거나 근접한 결과를 낸다는 것이며, 이는 단일한 어려운 호출보다 대량의 에이전트형 팬아웃 작업에서 더 중요합니다.

## 사양

| | GPT-6 Sol | GPT-6 Luna |
|---|---|---|
| 컨텍스트 윈도우 | 1.05M tokens | 1.05M tokens |
| 최대 입력 | 922K tokens | 922K tokens |
| 최대 출력 | 128K tokens | 128K tokens |
| 지원 모달리티 | 텍스트 및 이미지 입력, 텍스트 출력 | 텍스트 및 이미지 입력, 텍스트 출력 |
| 지식 기준일 | 2026년 4월 20일 | 2026년 5월 18일 |
| 추론 강도 | none, low, medium (default), high, xhigh, max | none, low, medium (default), high, xhigh, max |

Luna의 지식 기준일은 Sol보다, 심지어 Astra(2026년 4월 30일)보다도 더 늦습니다. 계열 내에서 가장 저렴한 등급이 가장 최신 지식을 갖추는 것은 이례적이지만, OpenAI가 이번에 출시한 것은 그런 모습입니다.

## 사용해 보기

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-6-sol",
    "messages": [
      {"role": "user", "content": "Plan a safe refactor for a pricing module and list the tests to run."}
    ]
  }'
```

`openai/gpt-6-sol`을 `openai/gpt-6-luna`로 바꾸면 동일한 요청을 더 저렴한 등급으로 옮길 수 있고, `openai/gpt-6-astra`로 바꾸면 플래그십 경로가 자신의 작업에서 더 높은 가격만큼의 값어치를 하는지 확인할 수 있습니다.

## 가격

| 모델 | 입력 | 출력 | 캐시 입력 | 캐시 쓰기 |
|---|---|---|---|---|
| GPT-6 Sol | $2/M | $10/M | $0.20/M | $2.50/M |
| GPT-6 Luna | $0.10/M | $0.50/M | $0.01/M | $0.125/M |
| GPT-6 Astra | $10/M | $50/M | $1/M | $12.50/M |
| GPT-5.6 Sol (`openai/gpt-5.6`) | $5/M | $30/M | $0.50/M | $6.25/M |
| GPT-5.6 Luna | $1/M | $6/M | - | - |

Token Station은 이 요금을 마크업 없이 그대로 전달하며, 요청 단위로 계측됩니다.

## Sol과 Luna가 맞는 자리

- **GPT-6 Sol**: 신중하고 다단계적인 검증에서 이득을 보는 대화형 및 에이전트형 코딩에 적합하며, Luna의 속도와 Astra의 장기 에이전트형 강점 사이의 중간 등급입니다.
- **GPT-6 Luna**: 대량이면서 위험 부담이 낮은 작업, 즉 분류, 선별, 탐색 패스, 그리고 더 큰 에이전트 내의 하위 작업 팬아웃에 적합합니다. 위의 DeepSWE 결과에서 보듯, 일부에 불과한 비용으로 더 비싼 모델과의 격차 대부분을 좁힙니다.
- **GPT-6 Astra**: 장시간 에이전트형 코딩 세션, 컴퓨터 사용, 터미널 위주의 운영 작업처럼 GPT-5.6 계열 대비 우위가 가장 컸던 영역에서는 여전히 선택할 만한 경로입니다.

실용적인 라우팅 패턴은 다음과 같습니다. 탐색과 팬아웃에는 기본적으로 Luna를 사용하고, 실제 구현 및 검증 작업에는 Sol로 전환하며, 작업에서 벗어나지 않고 가장 오래 실행되어야 하는 세션에는 Astra를 아껴둡니다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하세요: 카드 등록 없이, 첫 충전 시 최대 $50까지 100% 매칭을 받을 수 있습니다. 키를 내보내 기존 OpenAI 호환 연동을 `openai/gpt-6-sol` 또는 `openai/gpt-6-luna`로 지정하세요.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
