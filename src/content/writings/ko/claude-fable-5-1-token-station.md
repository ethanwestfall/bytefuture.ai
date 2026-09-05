---
slug: claude-fable-5-1-token-station
lang: ko
title: "Claude Fable 5.1, 이제 Token Station에서 사용할 수 있습니다"
summary: "Anthropic의 가장 강력한 모델이 anthropic/claude-fable-5-1로 Token Station에 추가되었습니다. 가격은 Claude Fable 5와 동일하지만, 캐시 읽기 비용은 4분의 1로 줄었고, 장시간 실행되는 에이전트형 코딩과 리서치 성능도 더 강화되었습니다. 무엇이 달라졌는지, 가격은 어떻게 되는지, 그리고 Claude Opus 5 대신 이 모델을 선택해야 하는 상황은 언제인지 다룹니다."
category: product
date: 2026-09-05
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-fable-5-1-token-station-cover.png
draft: false
---

Claude Fable 5.1이 `anthropic/claude-fable-5-1`로 Token Station에서 사용 가능해졌습니다. 이미 Claude Opus 5와 Claude Sonnet 5를 제공하고 있는 것과 동일한 Anthropic 호환 경로를 통해 제공됩니다.

Anthropic 자체 가이드는 그냥 넘기지 말고 다시 한번 짚어볼 가치가 있습니다. 대부분의 워크로드에서는 Claude Opus 5로 시작하라는 것입니다. Fable 5.1은 까다로운 추론과 장기간에 걸친 에이전트형 작업이 필요할 때, 또는 Opus 5의 추론 강도를 높여도 자체 평가 기준을 통과하지 못할 때 선택하는 모델입니다. 어려운 10%의 작업을 위한 모델이지, 전면적인 업그레이드가 아닙니다.

## Claude Fable 5 대비 달라진 점

Fable 5.1은 입력 및 출력 가격을 그대로 유지하면서 Fable 5를 확장한 모델입니다. 구체적인 개선 사항은 다음과 같습니다.

- **캐시 읽기 비용이 $0.25/M**로, Fable 5의 $1/M의 4분의 1입니다. 대화나 저장소 컨텍스트가 매 턴마다 점점 커지며 다시 전송되는 에이전트형 워크로드에서는, 어떤 성능 향상보다 실제로 청구 비용에 영향을 주는 변화입니다.
- **장시간 실행되는 에이전트형 코딩과 다단계 리서치 능력이 강화**되었고, 문서, 스프레드시트, 슬라이드 생성 품질도 개선되었습니다.
- **메시지 단위 추론 강도**(베타): 프롬프트 캐시를 무효화하지 않고도 대화 도중에 추론 깊이를 변경할 수 있습니다.
- **도구 호출 사이의 진행 상황 업데이트**(베타): 긴 에이전트 실행 중에 조용히 기다리는 대신 읽을 수 있는 상태 메모를 제공합니다.
- **턴 단위 시스템 메시지**(베타): 해당 턴에만 적용되고 이후 대화 기록에서 자동으로 사라지는 운영자 지시입니다.

Fable 5용으로 작성된 코드를 마이그레이션하는 경우 세 가지가 달라집니다. 강제 도구 사용(`tool_choice: "any"` 또는 특정 도구 지정)은 이제 오류를 반환하고, 사고 블록은 이를 생성한 모델에 종속되며, 대화의 이전 턴을 수정하면 해당 턴의 사고 블록이 무효화됩니다. 이는 Token Station을 통한 최초 연동에는 영향을 주지 않으며, 기존 Fable 5 기반 구현을 이전하는 경우에만 관련이 있습니다.

## 사양

| | |
|---|---|
| 컨텍스트 윈도우 | 1M tokens |
| 최대 출력 | 128K tokens |
| 사고 모드 | 적응형, 항상 켜짐 |
| 기본 추론 강도 | 높음 |
| 지식 기준일 | 2026년 6월 |

## 사용해 보기

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-fable-5-1",
    "messages": [
      {"role": "user", "content": "Audit this repository for a safe path to remove the deprecated auth module, and list every call site that needs to change."}
    ]
  }'
```

동일한 요청에서 `anthropic/claude-fable-5-1`을 `anthropic/claude-opus-5`로 바꿔보면, 본격적으로 도입하기 전에 더 비싼 경로가 실제로 자신의 워크로드에서 그만한 값어치를 하는지 확인할 수 있습니다.

## 가격

| | 입력 | 출력 | 캐시 읽기 | 캐시 쓰기 (5분) | 캐시 쓰기 (1시간) |
|---|---|---|---|---|---|
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |
| Claude Opus 5 | $5/M | $25/M | - | - | - |
| Claude Sonnet 5 | $2/M | $10/M | - | - | - |

Token Station은 이 요금을 마크업 없이 그대로 전달하며, 요청 단위로 계측되어 자신의 대시보드에서 확인할 수 있습니다.

## 언제 선택해야 할까

Fable 5.1은 실패의 원인이 너무 일찍 포기하거나 맥락을 놓치는 데 있는 작업에서 값어치를 하며, 단순히 한 번에 계산하기 어려운 문제에서는 그렇지 않습니다.

- **장시간 실행되는 에이전트형 코딩**: 여러 파일에 걸친 리팩터링, 저장소 전체 감사, 그리고 많은 도구 호출에 걸쳐 계획, 구현, 테스트 수정을 이어가는 세션.
- **다단계 리서치**: 여러 출처에 걸친 조사 결과를 종합하는 작업으로, 컨텍스트 윈도우가 짧거나 인내심이 부족한 모델이라면 너무 일찍 요약해버릴 만한 상황.
- **문서, 스프레드시트, 슬라이드 작업**: 대량의 원본 자료를 계속 참조하면서 길고 구조화된 결과물을 만들어야 하는 작업.

단일한 어려운 질문이나 분류 작업, 또는 대부분의 일상적인 채팅과 코딩에서는 추론 강도를 높인 Claude Opus 5가 더 저렴한 출발점입니다. Anthropic 자체 비교표도 이를 뒷받침합니다. Opus 5는 Fable 5.1과 동일한 1M 컨텍스트와 128K 출력 상한을 가지면서 가격은 절반입니다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하면 카드 등록 없이 $1의 무료 크레딧을 받을 수 있고, 첫 충전 시 최대 $50의 보너스 크레딧도 제공됩니다. 키를 내보낸 뒤 기존 Anthropic 호환 연동을 `anthropic/claude-fable-5-1`로 지정하세요.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
