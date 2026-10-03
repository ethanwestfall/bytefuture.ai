---
slug: claude-opus-5-5-token-station
lang: ko
title: "Claude Opus 5.5, 이제 Token Station에서 사용할 수 있습니다"
summary: "Anthropic의 새로운 Opus가 anthropic/claude-opus-5-5로 Token Station에 출시되었습니다. Claude Opus 5보다 20% 저렴하고, 캐시 읽기 비용은 60% 낮으며, 훨씬 더 비싼 Claude Fable 5.1과 맞먹거나 그보다 나은 벤치마크 결과를 보여줍니다. 무엇이 달라졌는지, 가격은 어떻게 되는지, API에서 호환성이 깨지는 변경 사항, 그리고 이번 모델이 비싼 새 등급이 아니라 단순한 업그레이드인 이유를 다룹니다."
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-opus-5-5-token-station-cover.png
draft: false
---

Claude Opus 5.5가 Token Station에 `anthropic/claude-opus-5-5`로 출시되었습니다. 이미 Claude Opus 5, Claude Sonnet 5, Claude Fable 5.1을 제공하고 있는 것과 동일한 Anthropic 호환 경로를 통해 이용할 수 있습니다.

이는 가장 까다로운 10%의 작업을 위해 마련된 더 비싼 선택지인 Fable 5.1과 같은 방식으로 자리매김된 것이 아닙니다. Opus 5.5는 같은 등급 안에서 Opus 5의 직계 후속 모델이면서 가격은 더 낮습니다. Anthropic 자체 벤치마크에 따르면, 대부분의 에이전트형 작업과 지식 작업에서 훨씬 더 비싼 Fable 5.1과 맞먹거나 그보다 나으면서 토큰당 비용은 60% 더 저렴합니다.

## Claude Opus 5 대비 달라진 점

- **20% 더 저렴**: 백만 토큰당 입력/출력 가격이 $5/$25에서 $4/$20로 낮아졌습니다.
- **캐시 읽기 비용은 $0.20/M**로, Opus 5의 $0.50/M보다 60% 낮습니다. 캐시 쓰기 비용도 낮아져, $6.25/M와 $10/M이던 것이 각각 $5/M(5분)과 $8/M(1시간)이 되었습니다.
- **출력 생성 속도가 Opus 5보다 30% 이상 빠르며**, 지연 시간 등급은 동일합니다.
- **더 최신 지식**: 2026년 6월 기준이며, Opus 5의 2026년 5월 기준보다 늦습니다.

Opus 5용으로 작성된 코드를 마이그레이션하는 경우 네 가지가 달라집니다. 사고(thinking)는 더 이상 어떤 강도에서도 비활성화할 수 없고(이제는 강도만 조절할 수 있으며 기본값이 높음이 아니라 보통이므로, Opus 5의 기존 기본 동작을 원한다면 명시적으로 설정해야 합니다), 강제 도구 사용(`tool_choice: "any"` 또는 특정 도구 지정)은 이제 오류를 반환하며, 사고 블록은 이를 생성한 모델과 대화에 종속되고, Claude API와 Google Cloud에서는 더 이상 예전의 `computer_20251124` 컴퓨터 사용 도구를 받아들이지 않습니다(대신 `computer_toolset_20260801`을 사용하세요). 이 중 어느 것도 Token Station을 통한 최초 연동에는 영향을 주지 않으며, 기존 Opus 5 하네스를 이전하는 경우에만 관련이 있습니다.

## 사양

| | |
|---|---|
| 컨텍스트 윈도우 | 1M tokens |
| 최대 출력 | 128K tokens |
| 사고 모드 | 적응형, 항상 켜짐 |
| 기본 추론 강도 | 보통 |
| 지식 기준일 | 2026년 6월 |

## 사용해 보기

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-opus-5-5",
    "messages": [
      {"role": "user", "content": "Audit this repository for a safe path to remove the deprecated auth module, and list every call site that needs to change."}
    ]
  }'
```

동일한 요청에서 `anthropic/claude-opus-5-5`를 `anthropic/claude-opus-5`로 바꿔보면, 완전히 전환하기 전에 이번 업그레이드가 실제로 자신의 워크로드에서 의미 있는 차이를 만드는지 확인할 수 있습니다.

## 가격

| | 입력 | 출력 | 캐시 읽기 | 캐시 쓰기 (5분) | 캐시 쓰기 (1시간) |
|---|---|---|---|---|---|
| Claude Opus 5.5 | $4/M | $20/M | $0.20/M | $5/M | $8/M |
| Claude Opus 5 | $5/M | $25/M | $0.50/M | $6.25/M | $10/M |
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |

Token Station은 이 요금을 마크업 없이 그대로 전달하며, 요청 단위로 계측되어 자신의 대시보드에서 확인할 수 있습니다.

## Claude Fable 5.1과 GPT-6 Astra 대비 위치

Anthropic이 공개한 자체 벤치마크에 따르면, Opus 5.5는 측정된 대부분의 작업에서 가격이 절반에도 못 미치면서 Fable 5.1을 앞섭니다.

- **Terminal-Bench 4.0**: 66.4%로, Anthropic 자체 평가에서 Fable 5.1의 55.8%와 GPT-6 Astra의 57.9%를 앞섭니다.
- **GDPval-AA v2.1**(지식 작업): 1846 Elo로, Fable 5.1의 1735보다 100점 이상, Astra의 1542보다 300점 이상 앞섭니다.
- **Humanity's Last Exam**: 67.7%로, Fable 5.1의 65.6%와 Astra의 57.2%를 앞섭니다.
- **OSWorld 2.1**(컴퓨터 사용): 81.8%로, Fable 5.1의 80.7%를 앞섭니다.

완승은 아닙니다. Astra는 여전히 Terminal-Bench-Science(64.6% 대 Opus 5.5의 58.7%)와 AutomationBench(41.4% 대 40.0%)에서 앞서 있지만, 두 경우 모두 격차는 근소합니다. 그래도 대부분의 에이전트형 코딩, 컴퓨터 사용, 지식 작업에서는 이제 Opus 5.5가 두 기본 모델 중 더 강력하고 저렴한 쪽입니다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하세요: 카드 등록 없이, 첫 충전 시 최대 $50까지 100% 매칭을 받을 수 있습니다. 키를 내보내 기존 Anthropic 호환 연동을 `anthropic/claude-opus-5-5`로 지정하세요.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
