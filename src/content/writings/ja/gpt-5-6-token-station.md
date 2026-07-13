---
slug: gpt-5-6-token-station
lang: ja
title: "GPT-5.6 が Token Station に登場：coding agent のルートでそのまま試す"
summary: "Token Station は GPT-5.6 を OpenAI-compatible API、Codex、Copilot などの coding-agent ルートでサポートしました。1 つの endpoint から Sol、Terra、Luna、Claude Fable 5 を実際の workflow で比較できます。"
category: product
date: 2026-07-13
cta: https://models.bytefuture.ai/intro.html
cover: blog/gpt-5-6-token-station-cover.png
---

GPT-5.6 が Token Station で使えるようになりました。

coding-agent チームにとって重要なのは、GPT-5.6 を開発者がすでに使っているルートで試せることです。直接の OpenAI-compatible API、OpenAI Codex スタイルの workflow、そして対応 catalog が公開している GitHub Copilot ルートです。

つまり GPT-5.6 は単なる発表ではなく、agent stack を作り直さずに route して、比較して、採用を判断できる選択肢になります。

## Token Station がサポートするルート

直接の OpenAI-compatible ルート：

- `openai/gpt-5.6`
- `openai/gpt-5.6-sol`
- `openai/gpt-5.6-terra`
- `openai/gpt-5.6-luna`

GitHub Copilot catalog で公開されているルート：

- `github-copilot/gpt-5.6-sol`
- `github-copilot/gpt-5.6-terra`
- `github-copilot/gpt-5.6-luna`

OpenAI Codex スタイルの workflow は上記と同じ `openai/` ルートを使うため、別途 Codex 専用ルートを設定する必要はありません。

同じモデルファミリーを、自分の workflow に合う surface から試せます。

## 1 つの endpoint から GPT-5.6 を試す

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

Copilot ルートなら：

```json
{
  "model": "github-copilot/gpt-5.6-luna"
}
```

endpoint は同じです。変えるのは route だけです。

## GPT-5.6 Sol、Terra、Luna

coding agent は 1 回の API call ではありません。計画、repository search、patch generation、test repair、code review、delegated subtasks などが続きます。すべての step が同じ model tier を必要とするわけではありません。

3 つの named variant はチームに実用的なテストの階段を与えます。

- **GPT-5.6 Sol**：最も難しい coding-agent step に使う flagship route。
- **GPT-5.6 Terra**：implementation や debugging loop に使う middle route。
- **GPT-5.6 Luna**：exploration、triage、subtask fan-out に使う lower-cost route。

実用的な routing はこうです。

- 探索、triage、反復には安い route を使う。
- 難しい reasoning、高リスク patch、final review では強い route に上げる。
- endpoint を安定させ、harness、agent、evaluation scripts を毎回書き換えない。

agent workload は均一ではありません。全 repository の計画、微妙な失敗テスト、boilerplate の編集を同じ cost tier で動かす必要はありません。モデル選択は route name になり、新しい integration project ではなくなります。

## Pricing と cache accounting

Token Station は GPT-5.6 の input、output、cached input、cache writes、そして 272K input tokens を超える long-context tier を扱います。

coding agent は repository context を何度も送ります。file summaries、diff、test output、task state、previous plans などです。Prompt caching はこの繰り返しコストを下げられますが、cache writes と cached reads を分けて扱う必要があります。

Token Station は GPT-5.6 の `cache_write_tokens` を cache-creation bucket に正規化し、ordinary input tokens と二重計上しないようにします。

実用的な価格フレーム：

- GPT-5.6 Sol / `openai/gpt-5.6`: $5/M input、$30/M output、$0.50/M cached input、$6.25/M cache writes（272K input tokens まで）。
- GPT-5.6 Terra: $2.50/M input、$15/M output（272K まで）。
- GPT-5.6 Luna: $1/M input、$6/M output（272K まで）。
- Claude Fable 5: $10/M input、$50/M output、$1/M cache reads、$12.50/M prompt-cache writes、$20/M one-hour cache writes。

272K input tokens を超えると GPT-5.6 は long-context tier になります。Sol は input と cached-input が倍になり、output は $45/M。Terra は $5/M input と $22.50/M output、Luna は $2/M input と $9/M output です。

## Claude Fable 5 との比較

Claude Fable 5 は long-running coding agent の自然な比較対象です。Token Station では 1M context window と $10/$50 の高い price profile で設定されています。

GPT-5.6 は別の運用形を持ちます。OpenAI-native route、Codex/Copilot surface、そして同じ family 内の複数 price tier です。

まずはこう選べます。

- OpenAI-native route、Codex や Copilot surface、あるいは高頻度な step に安い tier が欲しいなら GPT-5.6 ファミリー。Sol、Terra、Luna は上記のとおりタスクごとに選ぶ。
- Anthropic の long-running-agent behavior と 1M context を重視し、高い価格を許容するなら Claude Fable 5。
- workflow fit が model brand より重要なら Token Station 内で比較する。

## Azure と未対応 catalog

Azure OpenAI GPT-5.6 preview template と `azure_api_version = "v1"` による `/openai/v1` surface の support も含まれます。

ただし Azure pricing は推測で有効化していません。統合時点では Azure GPT-5.6 meter が公開されていなかったため、operator が deployment 側でモデルを公開した時点で価格を埋めるべきです。

GMI Cloud と AWS Bedrock OpenAI catalog は、公開 catalog に GPT-5.6 がなかったため追加していません。

## Token Station で GPT-5.6 を試す

Token Station を使っているなら、GPT-5.6 は coding-agent workflow に追加できる新しい route family です。

direct OpenAI route で API check を行い、Codex では同じ `openai/` ルートを設定して terminal coding task を試し、GitHub Copilot catalog に依存する workflow なら Copilot route を試せます。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
