---
slug: qwen-3-8-max-token-station
lang: ko
title: "먼저 살펴보기: Token Station에서 Qwen 3.8-Max"
summary: "Alibaba는 Qwen 3.8-Max(2.4조 파라미터, 희소 MoE, 멀티모달)를 미리보기로만 공개했을 뿐 벤치마크는 발표하지 않았습니다. 그래서 Token Station에서 동일한 세 가지 작업을 qwen3.8-max-preview, kimi-k3, gpt-5.6으로 실행해 봤습니다. 셋 다 통과했고, 레이턴시가 가장 안정적이었던 것은 Qwen 3.8-Max였습니다."
category: product
date: 2026-07-28
cta: https://models.bytefuture.ai/intro.html
cover: "blog/qwen-3-8-max-token-station-cover.png"
---

Alibaba는 2026년 7월 19일 World AI Conference(WAIC)에서 Qwen 3.8-Max를 미리보기로 공개했습니다. 2.4조 파라미터, 희소 Mixture-of-Experts, 네이티브 멀티모달, 그리고 [Claude Fable 5](/blog/try-claude-fable-5-in-codex-openclaw-and-pi-ko.html) 다음가는 성능이라는 주장입니다. 다만 벤치마크 표도, 모델 카드도, 확정된 컨텍스트 윈도도 아직 없습니다.

주장을 되풀이하는 대신 작은 비교를 진행했습니다. [Token Station](https://models.bytefuture.ai/intro.html)에서 `bailian-intl/qwen3.8-max-preview`, `kimi/kimi-k3`, `openai/gpt-5.6`에 동일한 세 가지 작업을 실행했습니다. 키는 하나, temperature는 0입니다. 두 가지는 답을 확인할 수 있는 코딩 작업이고, 하나는 확률 문제입니다.

## 세 가지 작업

- **Trapping rain water.** 투 포인터 문제입니다. 알려진 입력으로 답을 검증합니다.
- **확률.** 빨간 공 3개, 파란 공 4개, 초록 공 5개에서 비복원 추출로 3개를 뽑습니다. 세 개 모두 다른 색일 확률을 구합니다. 정확한 답은 3/11입니다.
- **버그 찾기.** 한 줄이 빠진 `merge_sorted` 함수. 수정본은 주어진 테스트 케이스를 통과해야 합니다.

모든 답은 자동으로 판정했습니다. 코드는 추출해서 실행했고, 분수는 일치 여부를 확인했습니다.

## 결과

| 작업 | qwen3.8-max-preview | kimi-k3 | gpt-5.6 |
|---|---|---|---|
| Trapping rain water | 통과, 7.6초 | 통과, 12.5초 | 통과, 5.3초 |
| 확률(3/11) | 통과, 7.3초 | 통과, 13.8초 | 통과, 13.5초 |
| 버그 찾기 | 통과, 8.0초 | 통과, 31.5초 | 통과, 4.2초 |

아홉 개 모두 통과했습니다. 이 정도 규모의 작업에서는 능력의 하한선을 보여줄 뿐입니다. 여기 있는 프런티어 모델은 모두 풀 수 있습니다. 흥미로운 신호는 레이턴시와 토큰 수에 있습니다.

Qwen 3.8-Max가 가장 안정적이었습니다. 모든 작업을 7~8초 안에 마쳤고, 추론 토큰은 문제 난이도와 관계없이 매번 142~165개였습니다. [GPT-5.6](/blog/gpt-5-6-token-station-ko.html)은 코딩 작업에서 가장 빠르고 간결했지만(4~5초, 출력 120토큰 미만), 확률 문제에는 13.5초가 걸렸습니다. [Kimi K3](/blog/kimi-k3-token-station-ko.html)는 쉬운 작업에서 추론을 가장 적게 썼고(55~86토큰), 버그 찾기 작업에서 급증했습니다. 추론 토큰 294개에 31.5초. 나머지 둘은 그대로였습니다.

솔직한 평가: 작고 자동으로 판정 가능한 작업 세트에서, 아직 미리보기 단계인 Qwen 3.8-Max는 이미 출시된 두 프런티어 모델에 뒤지지 않았고, 레이턴시는 가장 안정적이었습니다. 자신의 워크로드로 직접 시험해 볼 이유는 충분하지만, 최종 결론은 아닙니다.

## 아직 확인되지 않은 부분

위 테스트는 저희가 진행한 것입니다. 나머지 사양은 Alibaba의 설명이며, 그중 일부는 여전히 주장에 그칩니다.

- **2.4조 파라미터, 희소 MoE.** 토큰당 활성 파라미터 수는 공개되지 않았는데, 서빙 비용을 결정하는 것은 바로 그 숫자입니다.
- **멀티모달.** 텍스트와 이미지 입력은 확인됐습니다. 전체 모달리티 목록(동영상, 문서, 음성, 이미지 생성)은 확인되지 않았고, 사양서도 공개되지 않았습니다.
- **컨텍스트 윈도: 미공개.**
- **"Fable 5 다음."** Alibaba 자신의 말로, 내부 평가에 근거합니다. 벤치마크 표도 모델 카드도 없습니다. 참고로 이전 세대인 Qwen 3.7-Max는 GPQA Diamond 92.4, SWE-bench Verified 80.4, Terminal-Bench 2.0에서 69.7을 기록했습니다.
- **오픈 웨이트.** Alibaba는 Qwen 3.8이 "곧 오픈 웨이트로 공개된다"고 했지만, 날짜도 라이선스도 없습니다. Max 등급은 지금까지 비공개였고, 오픈 웨이트 라인은 Qwen 3.6까지 별도로 이어졌습니다.

2.4조 파라미터는 공개적으로 알려진 모델 중 두 번째 규모입니다. 1위는 Moonshot의 Kimi K3(2.8조)로, 같은 주에 오픈 웨이트로 출시됐습니다.

## Token Station에서 사용해보기

엔드포인트는 표준 Token Station OpenAI 호환 API입니다.

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bailian-intl/qwen3.8-max-preview",
    "messages": [
      {"role": "user", "content": "Refactor this function and explain the change."}
    ]
  }'
```

Token Station은 Anthropic API 형태도 제공하므로, 같은 경로를 Claude Code에 그대로 넣을 수 있습니다.

## 코딩 에이전트에 연결하기

Claude Code에서는 Opus 슬롯에 넣으세요.

```bash
# Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="bailian-intl/qwen3.8-max-preview"
export ANTHROPIC_DEFAULT_SONNET_MODEL="bailian-intl/qwen3.8-max-preview"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="bailian-intl/qwen3.8-max-preview"
export CLAUDE_CODE_SUBAGENT_MODEL="bailian-intl/qwen3.8-max-preview"

claude
```

Codex에서는 기본 모델로 지정하세요.

```bash
mkdir -p ~/.codex
cat > ~/.codex/config.toml <<'EOF'
model = "bailian-intl/qwen3.8-max-preview"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF

export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex
```

## 요금

Qwen 3.8-Max는 미리보기 단계이며, Alibaba는 표준 API 요금을 공개하지 않았습니다. Token Station은 프로바이더 요금을 마진 없이 그대로 전달합니다. 현재 백만 토큰당 요금은 대시보드에서 확인하세요. 가입 크레딧 1달러로 첫 평가를 실행하기에 충분합니다.

요점:

- Base URL(OpenAI 호환): `https://models.bytefuture.ai/v1`
- Base URL(Anthropic 호환): `https://models.bytefuture.ai`
- 모델: `bailian-intl/qwen3.8-max-preview`
- API 키: `gw-`로 시작하며, [Token Station 대시보드](https://models.bytefuture.ai/dashboard)에서 발급받습니다.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
