---
slug: "kimi-k3-token-station"
lang: "ko"
title: "Kimi K3, 3조 파라미터급에 도달한 최초의 오픈소스 모델. Token Station에서 무료로 사용해보기"
summary: "Moonshot의 Kimi K3는 2.8조 파라미터와 100만 토큰 컨텍스트 윈도를 갖춘, 3조 파라미터급에 도달한 최초의 오픈소스 모델입니다. Token Station에 kimi/kimi-k3로 등장했으며, 정가 그대로 추가 마진 없이 제공됩니다."
category: "tutorial"
date: "2026-07-25"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

Moonshot AI의 Kimi K3는 2.8조 파라미터를 갖춘, 3조 파라미터급에 도달한 최초의 오픈소스 모델입니다. Moonshot에 따르면 지난 12개월 중 9개월 동안 Kimi 모델이 오픈소스 모델 규모의 최전선을 지켜왔다고 합니다. K3는 이 기록을 큰 폭으로 이어갑니다.

규모만으로도 K3는 주목할 만하지만, 이 모델을 실제로 유용하게 만드는 것은 나머지 사양입니다. 100만 토큰 컨텍스트 윈도, 네이티브 비전 이해, 그리고 장시간 코딩, 지식 작업, 추론을 위해 설계된 아키텍처입니다. 전체 모델 가중치는 2026년 7월 27일까지 공개될 예정이며, API는 현재 Moonshot 플랫폼에서, 그리고 오늘부터 Token Station에서도 이용할 수 있습니다.

## 아키텍처에서 새로워진 점

K3는 하이브리드 선형 어텐션 메커니즘인 Kimi Delta Attention(KDA)을 기반으로 하며, 여기에 Attention Residuals(AttnRes)를 결합해 더 긴 시퀀스와 더 깊은 모델에서도 정보가 원활히 흐르도록 돕습니다. Mixture-of-Experts 측면에서는 Moonshot의 Stable LatentMoE 프레임워크가 희소성을 한층 더 높여, K3는 토큰마다 896개의 전문가 중 단 16개만 활성화합니다. 학습 방식과 데이터 구성의 개선까지 더해져, Moonshot은 K3의 전반적인 스케일링 효율이 이전 세대인 Kimi K2 대비 약 2.5배라고 밝혔습니다.

특히 두 가지 워크로드에 설계상 중점을 두었습니다.

- **장시간 코딩.** K3는 최소한의 감독만으로 장시간 실행되는 엔지니어링 작업을 지속할 수 있도록 설계되었습니다. 대규모 코드베이스 이해, 터미널 도구 조율, 그리고 소프트웨어 엔지니어링과 시각적 추론의 결합(프런트엔드 작업, 게임 개발, CAD에서 스크린샷과 시각적 피드백 활용)이 여기에 포함됩니다.
- **지식 작업.** Moonshot에 따르면 실제 사용자와 에이전트의 협업에서 반복적으로 나타나는 패턴을 바탕으로 구축한 내부 평가에서, 공개 벤치마크로는 드러나지 않는 꾸준한 향상을 보였다고 합니다.

## 벤치마크에서 K3의 위치

Moonshot의 입장은 분명합니다. K3의 전반적인 성능은 비교 대상 중 가장 강력한 독점 모델인 Claude Fable 5와 GPT-5.6 Sol에는 아직 못 미치지만, 여러 벤치마크에서 Claude Opus 4.8을 능가합니다. 공개된 수치는 다음 두 가지입니다.

- **DeepSWE: 67.3**(mini-SWE-agent 하네스 사용).
- **BrowseComp: 90.4**(100만 토큰 전체 컨텍스트를 사용하고 컨텍스트 관리는 하지 않음).

케이스 스터디는 100만 컨텍스트와 장시간 작업 설계가 실제로 어떻게 발휘되는지를 보여줍니다. 4가지 NVIDIA Hopper GPU 커널 최적화 작업에서 K3는 (폴백을 사용한) Fable 5와 경쟁력 있는 성능을 보였고, Opus 4.8, GPT-5.6 Sol, GPT-5.5를 앞질렀습니다. 한 컴파일러 작업에서는 Triton 및 `torch.compile`과 동등하거나 그 이상의 성능을 내는 Triton 유사 컴파일러(MiniTriton)를 처음부터 구축했고, 이를 이용해 엔드투엔드 nanoGPT 학습을 안정적으로 실행했습니다. 한 천체물리학 연구 작업에서는 300개 이상의 상태방정식을 처리하며, 팀이 수작업으로는 보통 1~2주 걸린다고 말하는 작업을 약 2시간 만에 끝냈습니다.

## Token Station에서 Kimi K3 무료로 사용해보기

K3는 [Token Station](https://models.bytefuture.ai/intro.html)에서 `kimi/kimi-k3`로 이용할 수 있으며, Moonshot의 정가 그대로 추가 마진 없이 제공됩니다. **캐시 미스 시 입력 100만 토큰당 3.00달러, 캐시 히트 시 100만 토큰당 0.30달러, 출력은 100만 토큰당 15.00달러**이며, 1,048,576 토큰 전체 컨텍스트 윈도를 그대로 사용할 수 있습니다. K3의 사고 모드는 끌 수 없고 기본값이 최대 추론 강도이므로, 추론 토큰이 출력으로 과금된다는 점을 감안해야 합니다. 더 빠르고 저렴한 응답을 원한다면 요청에서 `reasoning_effort`를 `low`로 설정하세요.

Token Station이 없애주는 절차가 하나 있습니다. Moonshot 자체 콘솔에서는 K3를 해제하려면 최소 1달러를 충전해야 합니다. Token Station에서는 가입 크레딧만으로 즉시 해제되며, 별도의 Moonshot 계정이나 충전이 필요 없습니다.

무료로 시작할 수 있습니다. [가입](https://models.bytefuture.ai/signup)하면 카드 없이 1달러 크레딧을 받습니다. 첫 충전 시에는 최대 50달러의 보너스 크레딧이 추가로 지급됩니다. Token Station에 이미 있는 다른 모델들과 비교했을 때 K3의 위치는 다음과 같습니다.

| 모델 | 입력 / 100만 | 출력 / 100만 | 컨텍스트 |
|---|---|---|---|
| `kimi/kimi-k3` | $3.00* | $15.00 | 1,048,576 |
| `kimi/kimi-k2.7-code` | $0.95 | $4.00 | 256K |
| `glm/glm-5.2` | $1.40 | $4.40 | 1M |
| `anthropic/claude-opus-4-8` | $5.00 | $25.00 | 1M |
| `openai/gpt-5.5` | $5.00 | $30.00 | 1M |
| `anthropic/claude-fable-5` | $10.00 | $50.00 | 1M |

\* 캐시 미스 시 요금입니다. 반복되는 컨텍스트는 위에서 설명한 0.30달러의 캐시 히트 요금이 적용됩니다.

이미 사용 중인 코딩 도구를 `kimi/kimi-k3`로 연결하고, 실제 작업을 맡겨 보세요.

### Claude Code

Claude Code는 모델과 엔드포인트를 환경 변수에서 읽어옵니다. 모든 티어를 Token Station을 통해 K3로 라우팅하세요.

```bash
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="kimi/kimi-k3"
export ANTHROPIC_DEFAULT_SONNET_MODEL="kimi/kimi-k3"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi/kimi-k3"
export CLAUDE_CODE_SUBAGENT_MODEL="kimi/kimi-k3"

claude
```

### Codex

Token Station을 프로바이더로 설정하고 K3를 모델로 지정하세요.

```bash
mkdir -p ~/.codex
cat > ~/.codex/config.toml <<'EOF'
model = "kimi/kimi-k3"
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

### OpenClaw

Token Station을 프로바이더로 등록하고 K3를 기본 모델로 설정하세요.

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "token-station": {
        "baseUrl": "https://models.bytefuture.ai/v1",
        "apiKey": "${TOKEN_STATION_API_KEY}",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "kimi/kimi-k3",
            "name": "Kimi K3 (Token Station)",
            "contextWindow": 1048576,
            "maxTokens": 131072
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/kimi/kimi-k3" }
    }
  }
}
```

## 알아두면 좋은 특이사항

- **`max_completion_tokens`는 기본값보다 훨씬 높게 설정할 수 있습니다.** 기본값은 131,072이지만, 출력이 많은 작업에서는 최대 1,048,576까지 설정할 수 있습니다.
- **비전 입력에는 base64 또는 업로드된 파일 ID가 필요합니다.** 이미지와 동영상 모두 공개 URL은 지원되지 않습니다. 이미지는 base64로 인라인 전송할 수 있고, 두 미디어 유형 모두 Files API(`ms://<file-id>`)로 업로드할 수 있습니다. 동영상은 파일 업로드 방식이 권장됩니다.
- **웹 검색 기능은 업데이트 중입니다.** Moonshot은 당분간 K3의 공식 웹 검색 도구를 프로덕션 워크플로에 사용하는 것을 권장하지 않습니다.
- **가중치는 이 API 제공 시점보다 며칠 늦게 공개됩니다.** K3는 오픈소스이지만, 전체 가중치는 2026년 7월 27일까지 공개될 예정입니다. 위 내용은 모두 오늘부터 호스팅 API로 이용할 수 있으며, 셀프 호스팅은 그보다 조금 뒤에 가능해집니다.

하나의 키, 이미 사용 중인 환경, 그리고 지금까지 출시된 것 중 가장 큰 규모인 2.8조 파라미터짜리 오픈소스 모델. K3가 여러분의 저장소에서 통하는지는 무료 가입만으로 확인할 수 있습니다.

여기서 시작하세요: [models.bytefuture.ai](https://models.bytefuture.ai/signup)
