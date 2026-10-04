---
slug: jev-token-station
lang: ko
title: "Jev, 이제 Token Station에서 사용할 수 있습니다"
summary: "텍스트 대신 타입이 지정된 확률을 반환하는 결정 전용 모델, TypeSafe의 Jev가 대기자 명단 없이 Token Station에 추가되었습니다. 채팅 완성 경로를 대체하는 전용 엔드포인트, 세 가지 답변 유형(Noul, Choice, Score), 가격, 그리고 TypeSafe의 속도 및 비용 주장이 독립적으로 측정된 결과와 어떻게 비교되는지를 다룹니다."
category: product
date: 2026-10-03
cta: https://models.bytefuture.ai/intro.html
cover: blog/jev-token-station-cover.png
draft: false
---

Jev가 `typesafe/jev-1.13.0`으로 Token Station에서 사용 가능해졌으며, `typesafe/jev-latest`는 최신 릴리스를 추적합니다. TypeSafe 자체 플랫폼은 아직 대기자 명단을 통해 신규 가입을 받고 있지만, Token Station을 통하면 이미 다른 모든 모델에 사용하고 있는 것과 동일한 키로 지금 바로 이용할 수 있습니다.

## 텍스트를 생성하지 않습니다

Jev는 TypeSafe의 첫 "System One Model"로, 이 이름은 대니얼 카너먼(Daniel Kahneman)이 말한 빠르고 직관적인 사고 방식에서 따온 것입니다. 채팅 모델이 대화를 읽고 답변을 작성하는 것과 달리, Jev는 상태 정보(평범한 텍스트, JSON 객체, 또는 메시지 배열) 한 조각과 타입이 지정된 질문 집합을 읽은 뒤, 타입이 지정된 답변, 즉 확률, 선택된 옵션, 또는 점수를 각각의 신뢰도 값과 함께 반환합니다. TypeSafe는 이를 프런티어 지능의 함수 호출이라고 설명합니다. 구조화되지 않은 상태 정보가 들어가고, 타입이 지정된 확률적 결정이 나옵니다. 파싱할 생성된 글이 없는 이유는, 애초에 아무것도 생성되지 않기 때문입니다.

출시 데모 중 하나에서 TypeSafe의 창업자는 각 페이지에 있는 링크만을 사용해 두 위키백과 페이지를 서로 경주시켰습니다. 한 번의 이동마다 수백에서 수천 개의 후보 링크가 있고, 그중 하나를 선택할 때마다 존재하지 않는 링크를 지어내서는 안 됩니다. 이것이 바로 Jev가 만들어진 고차원(high-cardinality) 의사결정의 종류이며, 채팅 모델이라면 자유 텍스트 답변을 사후에 파싱하고 검증해야 하고, 그마저도 검증을 통과하지 못할 수 있습니다.

바로 이 때문에 Token Station은 플랫폼의 다른 모든 모델과 달리 Jev를 별도의 경로로 라우팅합니다. Jev는 OpenAI 호환 채팅 경로가 아니라 전용 엔드포인트인 `/typesafe/v1/systemone`을 통해 답변합니다. 대신 `/v1/chat/completions`, `/v1/responses`, 또는 `/v1/messages`로 요청을 보내면, 게이트웨이는 전용 엔드포인트를 안내하는 400 오류로 요청을 거부합니다. Jev는 OpenAI 호환 `/v1/models` 목록에서도 완전히 제외되어 있으며, 자체 카탈로그는 `/typesafe/v1/models`에 있습니다. 둘 다 의도된 설계입니다. 채팅 모델과 우연히 같은 통신 형식을 공유하는 결정 모델이 있다면, 그것이야말로 조용히 오용되기 딱 좋은 상황이기 때문입니다.

## 질문을 던지는 세 가지 방법

모든 요청은 `state`와 이름이 지정된 `questions` 맵을 전송하며, 각 질문에는 `type`이 있습니다. 유형은 세 가지입니다.

**Noul**은 예/아니오를 불리언이 아니라 확률로 답합니다.

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": "Every customer has been unable to sign in for 30 minutes. Please restore service immediately.",
    "questions": {
      "urgent": {
        "type": "noul",
        "instructions": "Does this incident require immediate action?"
      }
    }
  }'
```

**Choice**는 최대 255개의 레이블이 붙은 옵션 집합에서 하나의 키를 선택하며, 선택한 결과와 함께 전체 옵션에 대한 확률 분포도 함께 반환합니다.

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": {
      "ticket": "My card was charged twice for the same invoice. Please refund the duplicate charge.",
      "account": {"plan": "business", "invoice_id": "example-invoice-001"}
    },
    "questions": {
      "team": {
        "type": "choice",
        "instructions": "Which team should handle the ticket?",
        "criteria": {
          "billing": "Invoices, charges and refunds",
          "technical": "Service outages, software bugs and integrations",
          "sales": "New purchases and plan upgrades"
        }
      }
    }
  }'
```

**Score**는 state를 2단계에서 10단계로 이루어진 순서가 있는 루브릭에 대해 평가하며, 결과는 단순한 정수가 아니라 해당 루브릭 상의 확률 가중치가 반영된 소수 위치로 나옵니다.

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": [
      {"role": "customer", "content": "The checkout service fails for every customer."},
      {"role": "operator", "content": "Confirmed: all purchases have failed for the last 20 minutes."}
    ],
    "questions": {
      "impact": {
        "type": "score",
        "instructions": "Rate the current operational impact described in these reports.",
        "criteria": [
          "No disruption: all functions work normally",
          "Partial disruption: some customers or functions are affected",
          "Complete outage: a critical function fails for all customers"
        ]
      }
    }
  }'
```

하나의 요청에서 세 가지 유형을 모두 섞어 사용할 수 있으므로, `/typesafe/v1/systemone`에 대한 한 번의 호출로 티켓을 라우팅하고, 심각도를 점수화하고, 긴급 여부를 표시하는 작업을 세 번이 아니라 한 번의 추론으로 처리할 수 있습니다.

## 사양

| | |
|---|---|
| 컨텍스트 윈도우 | 32,000 tokens |
| 질문당 Choice 옵션 수 | 최대 255개 |
| 질문당 Score 단계 수 | 2~10 |
| 지연 시간 | TypeSafe 발표 기준 종단간 70-500ms |
| 학습 방식 | Reinforcement Learning for Calibrated Decisions (RLCD) |

## 가격

| | 입력 | 출력 |
|---|---|---|
| Jev | $0.042/M | 무료 |

생성되는 것이 사실상 없으므로, 출력 쪽에서 청구할 비용도 없습니다. Token Station에 이미 올라와 있는 모든 채팅 모델은 입력 쪽 가격만으로도 이보다 비쌉니다. GPT-6 Luna의 $0.10/M부터 Claude Fable 5.1의 $10/M까지입니다. Token Station은 TypeSafe의 요금을 마크업 없이 그대로 전달합니다.

## 실제로 도움이 되는 지점

분류나 라우팅 결정을 완전한 채팅 모델에 맡겨도 작동은 하지만, 결국 몇 가지 선택지 중 하나로 정해질 답변을 얻기 위해 순차적인 토큰 스트림을 기다려야 한다는 뜻입니다. 이런 교환이 직접적으로 드러나는 몇 가지 지점이 있습니다.

- **모델 라우팅**: "비밀번호를 재설정해 달라"는 요청과 "청구 스키마를 마이그레이션해 달라"는 요청을 구분하는 데 Opus급 호출 전체를 쓰는 대신, 프런티어 모델이 애초에 필요한지 판단하기 전에 요청의 난이도부터 분류합니다.
- **도구 호출 게이팅**: 위험한 도구 호출(셸 접근, 지출, 삭제)이 실행되기 전에 승인, 차단, 또는 에스컬레이션하며, 코드가 임계값으로 사용할 수 있는 신뢰도 점수를 함께 제공합니다.
- **RAG 재순위화**: 쿼리와 청크 간의 관련성을 충분히 빠르게 점수화해 대규모 후보 집합을 재순위화하고, 채팅 모델의 컨텍스트 예산을 검색이 아니라 종합에 쓰도록 아낍니다.
- **티켓 및 요청 트리아지**: 매번 전체 대화를 열지 않고도, 대량이면서 창의성이 거의 필요 없는 트래픽을 큐, 우선순위, 담당자별로 라우팅합니다.
- **루프 및 궤적 점검**: 에이전트의 마지막 단계가 실제로 진전을 이뤘는지 확인하고, 턴을 낭비하는 대신 폭주하는 루프를 조기에 중단시킵니다.

TypeSafe 자체 벤치마크에 따르면 이런 작업에서 비교 가능한 LLM 대비 최대 193.6배 빠르고 비용은 444.6배 낮다고 주장하며, 이는 GPT-5.6 Terra, GPT-6 Astra, Claude Fable 5.1을 기준으로 측정한 수치입니다. 세 모델 모두 이미 Token Station에 있으므로, 직접 확인해 보고 싶다면 키 하나만 바꾸면 됩니다. 출시 주간에 대한 독립적인 집계는 좀 더 수수한 결과를 보여줬습니다. 수천 건의 사용자 제보 결과 전반에서 중앙값은 193배와 444배가 아니라 대략 7배 빠르고 30배 저렴한 수준으로 나타났습니다. 적합한 워크로드에서는 여전히 실질적인 이득이지만, 헤드라인 수치보다는 작은 폭입니다.

TypeSafe는 이를 환각률 0%라고도 부르는데, 좁은 의미에서는 정확한 표현입니다. `choice` 답변은 사용자가 제공한 `criteria` 키에 대해 검증되므로, Jev는 제공하지 않은 옵션을 반환할 수 없습니다. 이는 유효한 답변을 보장하는 것이지, 정확한 답변을 보장하는 것은 아닙니다. 채팅 모델보다 더 엄격한 출력 계약을 가진 분류기일 뿐이며, 다른 모델과 마찬가지로 자신의 데이터로 직접 평가해 볼 가치가 있습니다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하세요. 카드 등록이 필요 없고, 첫 충전 시 최대 $50의 보너스도 받을 수 있습니다. 키를 내보낸 뒤 대기자 명단 없이 바로 `typesafe/jev-1.13.0`으로 첫 요청을 보내 보세요.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
