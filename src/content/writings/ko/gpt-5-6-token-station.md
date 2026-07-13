---
slug: gpt-5-6-token-station
lang: ko
title: "GPT-5.6이 Token Station에 추가되었습니다: coding agent route에서 바로 테스트하기"
summary: "Token Station은 GPT-5.6을 OpenAI-compatible API, Codex, Copilot 같은 coding-agent route에서 지원합니다. 하나의 endpoint로 Sol, Terra, Luna, Claude Fable 5를 실제 workflow에서 비교할 수 있습니다."
category: model-launches
date: 2026-07-13
cta: https://models.bytefuture.ai/intro.html
---

GPT-5.6을 이제 Token Station에서 사용할 수 있습니다.

coding-agent 팀에게 중요한 점은 새로운 OpenAI 모델 패밀리가 하나 더 생겼다는 사실만이 아닙니다. 중요한 점은 GPT-5.6을 개발자가 이미 쓰는 route에서 테스트할 수 있다는 것입니다. 직접 OpenAI-compatible API, OpenAI Codex 스타일 workflow, 그리고 지원 catalog가 공개한 GitHub Copilot route입니다.

즉 GPT-5.6은 단순한 출시 소식이 아니라, agent stack을 다시 만들지 않고 route하고 비교하고 도입을 판단할 수 있는 선택지가 됩니다.

## Token Station이 지원하는 route

직접 OpenAI-compatible route:

- `openai/gpt-5.6`
- `openai/gpt-5.6-sol`
- `openai/gpt-5.6-terra`
- `openai/gpt-5.6-luna`

GitHub Copilot catalog가 공개한 route:

- `github-copilot/gpt-5.6-sol`
- `github-copilot/gpt-5.6-terra`
- `github-copilot/gpt-5.6-luna`

같은 모델 패밀리를 workflow에 맞는 surface에서 테스트할 수 있습니다.

## AI coding agent에 중요한 이유

coding agent는 API call 한 번이 아닙니다. planning, repository search, patch generation, test repair, code review, delegated subtasks가 이어집니다. 모든 step이 같은 model tier를 필요로 하지는 않습니다.

실용적인 routing pattern은 이렇습니다.

- exploration, triage, 반복 작업에는 더 저렴한 route를 사용합니다.
- 어려운 reasoning, 위험한 patch, final review에는 더 강한 route로 올립니다.
- endpoint를 안정적으로 유지해 harness, agent, evaluation script를 매번 바꾸지 않습니다.

Token Station에서는 모델 선택이 route name이 됩니다. 새 integration project가 아닙니다.

## 하나의 endpoint로 GPT-5.6 테스트

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-sol",
    "messages": [
      {"role": "user", "content": "Plan a safe refactor for a pricing module and list the tests to run."}
    ]
  }'
```

Codex route를 시험하려면 model만 바꾸면 됩니다.

```json
{
  "model": "openai-codex/gpt-5.6-terra"
}
```

Copilot route는 다음처럼 사용합니다.

```json
{
  "model": "github-copilot/gpt-5.6-luna"
}
```

endpoint는 그대로입니다. 바뀌는 것은 route입니다.

## GPT-5.6 Sol, Terra, Luna

- **GPT-5.6 Sol** — 가장 어려운 coding-agent step에 쓰는 flagship route.
- **GPT-5.6 Terra** — implementation과 debugging loop에 쓰는 middle route.
- **GPT-5.6 Luna** — exploration, triage, subtask fan-out에 쓰는 lower-cost route.

agent workload는 균일하지 않기 때문에 tier 차이가 중요합니다.

## Pricing과 cache accounting

Token Station은 GPT-5.6의 input, output, cached input, cache writes, 그리고 272K input tokens를 넘는 long-context tier를 다룹니다.

coding agent는 repository context를 반복해서 보냅니다. file summaries, diff, test output, task state, previous plans가 계속 등장합니다. Prompt caching은 반복 context 비용을 낮출 수 있지만, cache writes와 cached reads를 분리해서 처리해야 합니다.

Token Station은 GPT-5.6 `cache_write_tokens`를 cache-creation bucket으로 정규화해 ordinary input tokens와 이중 계산되지 않게 합니다.

실용적인 가격 프레임:

- GPT-5.6 Sol / `openai/gpt-5.6`: $5/M input, $30/M output, $0.50/M cached input, $6.25/M cache writes up to 272K input tokens.
- GPT-5.6 Terra: $2.50/M input, $15/M output up to 272K.
- GPT-5.6 Luna: $1/M input, $6/M output up to 272K.
- Claude Fable 5: $10/M input, $50/M output, $1/M cache reads, $12.50/M prompt-cache writes, $20/M one-hour cache writes.

272K input tokens를 넘으면 GPT-5.6은 long-context tier를 사용합니다. Sol은 input과 cached-input이 두 배가 되고 output은 $45/M, Terra는 $5/M input과 $22.50/M output, Luna는 $2/M input과 $9/M output입니다.

## Claude Fable 5와 비교하기

Claude Fable 5는 long-running coding agent의 자연스러운 비교 대상입니다. Token Station에서는 1M context window와 더 높은 $10/$50 price profile로 설정되어 있습니다.

GPT-5.6은 다른 운영 형태를 제공합니다. OpenAI-native route, Codex/Copilot surface, 그리고 같은 family 안의 여러 price tier입니다.

시작점은 간단합니다.

- 가장 강한 GPT-5.6 route가 필요하면 Sol.
- implementation loop의 중간 route가 필요하면 Terra.
- exploration 또는 subagent fan-out의 low-cost route가 필요하면 Luna.
- Anthropic의 long-running-agent behavior가 필요하고 더 높은 가격을 감수한다면 Claude Fable 5.
- workflow fit이 model brand보다 중요하면 Token Station 안에서 비교합니다.

## Azure와 아직 지원하지 않는 catalog

Azure OpenAI GPT-5.6 preview template과 `azure_api_version = "v1"` 기반 `/openai/v1` surface support도 포함됩니다.

하지만 Azure pricing은 추측으로 활성화하지 않았습니다. 통합 시점에는 Azure GPT-5.6 meter가 공개되지 않았기 때문에, operator가 자신의 Azure deployment에서 모델을 노출할 때 pricing을 채워야 합니다.

GMI Cloud와 AWS Bedrock OpenAI catalog는 당시 공개 catalog에 GPT-5.6이 없었기 때문에 추가하지 않았습니다.

## Token Station에서 GPT-5.6 테스트하기

이미 Token Station을 사용하고 있다면 GPT-5.6은 coding-agent workflow에 추가할 수 있는 새로운 route family입니다.

direct OpenAI route로 API check를 하고, Codex route로 terminal coding task를 테스트하고, GitHub Copilot catalog에 의존하는 workflow라면 Copilot route를 시험할 수 있습니다.

[Token Station 사용해 보기](https://models.bytefuture.ai/intro.html)
