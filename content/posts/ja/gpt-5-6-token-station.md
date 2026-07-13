---
slug: gpt-5-6-token-station
title: "GPT-5.6 が Token Station に登場：OpenAI、Codex、Copilot ルートをまたぐ 1 つのモデルファミリー"
summary: "Token Station は GPT-5.6 を OpenAI、OpenAI Codex、GitHub Copilot ルートで利用可能にしました。Sol、Terra、Luna バリアント、長文コンテキストの価格階層、prompt cache の会計にも対応します。"
category: model-launches
date: 2026-07-13
cta: https://models.bytefuture.ai/intro.html
---

GPT-5.6 が Token Station で利用可能になりました。

重要なのは、OpenAI の新しいモデルファミリーが追加されたことだけではありません。同じ GPT-5.6 世代を、開発者がすでに使っている複数の作業面――直接の OpenAI-compatible API、OpenAI Codex ワークフロー、GitHub Copilot サブスクリプションルート――から使えるようになったことです。

AI agent を構築するチームにとって、これは大きな意味があります。新モデルの登場は、毎回 provider SDK を差し替え、各ツールが追いつくのを待つ作業であるべきではありません。Token Station は新しいモデルを、明示的に選べるルートにします。

## 利用できるモデル

今回の GPT-5.6 対応には、メインモデルと 3 つの名前付きバリアントが含まれます。

- `openai/gpt-5.6`
- `openai/gpt-5.6-sol`
- `openai/gpt-5.6-terra`
- `openai/gpt-5.6-luna`

Token Station は OpenAI Codex ルートでも GPT-5.6 を公開します。

- `openai-codex/gpt-5.6`
- `openai-codex/gpt-5.6-sol`
- `openai-codex/gpt-5.6-terra`
- `openai-codex/gpt-5.6-luna`

さらに、公開 catalog で対応が確認できる GitHub Copilot ルートも利用できます。

- `github-copilot/gpt-5.6-sol`
- `github-copilot/gpt-5.6-terra`
- `github-copilot/gpt-5.6-luna`

これにより、開発者は provider surface ごとに別々の統合作業をするのではなく、同じモデルファミリーを複数の作業環境で試せます。

## Coding agent にとって重要な理由

Coding agent は単発の API 呼び出しではありません。実際のワークフローには、計画、リポジトリ検索、patch 生成、テスト修正、コードレビュー、サブタスクの委任などが含まれます。ツールごとに、そのワークフロー内の役割は異なります。

Codex はターミナル上の coding agent かもしれません。GitHub Copilot はエディタや pull request の伴走者かもしれません。直接の OpenAI-compatible API は、社内 agent、benchmark harness、評価スクリプトを支えるかもしれません。

GPT-5.6 が Token Station ルートで使えるようになると、統合レイヤーを安定させたまま、どの場面でモデルが最も価値を出すかを試せます。

## 1 つの endpoint で GPT-5.6 を試す

endpoint はシンプルです。

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer DEMO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-sol",
    "messages": [
      {"role": "user", "content": "Explain the tradeoff between cache writes and cached input tokens for a coding agent."}
    ]
  }'
```

別のルートを試すには、model ID を変えるだけです。

```json
{
  "model": "openai-codex/gpt-5.6-terra"
}
```

または、次のように指定できます。

```json
{
  "model": "github-copilot/gpt-5.6-luna"
}
```

目的は、新しい統合手順を覚えることではありません。モデルルートを明示的にし、簡単に差し替えられるようにすることです。

## 価格と長文コンテキスト会計

Token Station の GPT-5.6 対応には、モデルファミリーに公開された価格構造が含まれます。基本 input、cached input、cache-write、output、そして 272K tokens を超える長文コンテキスト階層です。

これは agent workload で重要です。長い coding session は短い chatbot prompt ではありません。Coding agent は、リポジトリ文脈、テスト出力、diff、計画状態を繰り返し送ることがあります。Prompt caching は繰り返し文脈のコストを下げられますが、そのためには cache write と cached read を別々に扱う必要があります。

今回の更新では、GPT-5.6 の `cache_write_tokens` usage を正規化し、cache write を通常 input tokens と二重計上せず、cache creation の bucket で課金するようにしています。

ユーザーにとっての実用的な意味は明確です。Token Station は新しい GPT-5.6 ファミリーを公開しつつ、実際の agent run で重要な課金の細部を保ちます。

## Azure の位置づけ

この更新には、Azure OpenAI GPT-5.6 preview のコメント付きテンプレートと、`azure_api_version = "v1"` による Azure の `/openai/v1` surface 対応も含まれます。

これらのテンプレートは、推測の価格では有効化されていません。統合時点では Azure GPT-5.6 meters がまだ公開されていなかったため、operator は自分の Azure deployment でモデルが公開された時点で価格を入力する必要があります。

これは正しいデフォルトです。ルートは準備するが、価格は作りません。

## 追加されなかった provider

今回の更新時点で、すべての provider catalog が GPT-5.6 を公開していたわけではありません。

GMI Cloud と AWS Bedrock OpenAI catalog は追加されていません。公開 catalog に GPT-5.6 support が掲載されていなかったためです。Token Station はモデル routing を簡単にするべきであり、すべての surface が初日からすべてのモデルに対応しているように見せるべきではありません。

## Token Station で GPT-5.6 を試す

すでに Token Station を使っているなら、GPT-5.6 は coding-agent ワークフローで試せる新しいモデルルートです。

シンプルな API テストなら direct OpenAI route から始められます。ターミナルベースの coding task を評価するなら Codex route を試せます。ワークフローが GitHub Copilot の supported model catalog に依存しているなら Copilot route を試せます。

Token Station は、これらのルートを 1 か所で比較できるようにします。新モデルが出るたびに agent stack を書き換える必要はありません。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
