---
slug: claude-fable-5-1-token-station
lang: ja
title: "Claude Fable 5.1 が Token Station で利用可能に"
summary: "Anthropic の最も高性能なモデルが、anthropic/claude-fable-5-1 として Token Station で利用可能になりました。価格は Claude Fable 5 と同じで、キャッシュ読み取りは4分の1のコストになり、長時間実行されるエージェント型コーディングやリサーチもより強力になっています。変更点、料金、そして Claude Opus 5 ではなくこちらを選ぶべき場面について解説します。"
category: product
date: 2026-09-05
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-fable-5-1-token-station-cover.png
draft: false
---

Claude Fable 5.1 は `anthropic/claude-fable-5-1` として Token Station で利用可能になりました。すでに Claude Opus 5 や Claude Sonnet 5 を提供している、同じ Anthropic 互換ルートを通じて提供されます。

Anthropic 自身のガイダンスは、読み流さずにきちんと繰り返しておく価値があります。ほとんどのワークロードでは、まず Claude Opus 5 から始めるべきだということです。Fable 5.1 を使うべきなのは、高度な推論や長時間にわたるエージェント型タスクが求められる場合、あるいは Opus 5 の推論強度を上げても自社の評価基準を満たせない場合に限られます。これは困難な10%のタスクのためのモデルであり、一律のアップグレードではありません。

## Claude Fable 5 からの変更点

Fable 5.1 は、入力と出力の価格を据え置いたまま Fable 5 を拡張したものです。具体的な改善点は次のとおりです。

- **キャッシュ読み取りが $0.25/M に**。Fable 5 の $1/M の4分の1です。会話やリポジトリのコンテキストが増え続け、それを毎ターン再送信するエージェント型ワークロードでは、能力向上以上に請求額へ直接効いてくる変更です。
- **長時間実行のエージェント型コーディングと複数ステップのリサーチが強化**され、文書、スプレッドシート、スライドの生成品質も向上しています。
- **メッセージ単位の推論強度**（ベータ版）：会話の途中で、プロンプトキャッシュを無効にすることなく推論の深さを変更できます。
- **ツール呼び出し間の進捗更新**（ベータ版）：長時間のエージェント実行中に、黙って待たされる代わりに読みやすい状態メッセージが表示されます。
- **ターン限定のシステムメッセージ**（ベータ版）：そのターンだけ適用される運用者向けの指示で、適用後は会話履歴から自動的に消去されます。

Fable 5 向けに書かれたコードを移行する場合、さらに3点が影響を受けます。強制的なツール使用（`tool_choice: "any"` や特定のツール名の指定）はエラーを返すようになったこと、思考ブロックはそれを生成したモデルに紐づくこと、会話の以前のターンを編集するとそのターンの思考ブロックが無効になることです。これらは Token Station を通じた最初の統合には影響せず、既存の Fable 5 用の実装を移植する場合にのみ関係します。

## スペック

| | |
|---|---|
| コンテキストウィンドウ | 1M tokens |
| 最大出力 | 128K tokens |
| 思考モード | 適応的、常時オン |
| デフォルトの推論強度 | 高 |
| 知識のカットオフ | 2026年6月 |

## 試してみる

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

同じリクエストで `anthropic/claude-fable-5-1` を `anthropic/claude-opus-5` に置き換えれば、本採用の前に、より高価なルートが自社のワークロードでその価格に見合う価値を発揮するかどうかを確認できます。

## 料金

| | 入力 | 出力 | キャッシュ読み取り | キャッシュ書き込み（5分） | キャッシュ書き込み（1時間） |
|---|---|---|---|---|---|
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |
| Claude Opus 5 | $5/M | $25/M | - | - | - |
| Claude Sonnet 5 | $2/M | $10/M | - | - | - |

Token Station はこれらの料金をそのまま、マークアップなしでパススルーします。リクエスト単位で計測され、自分のダッシュボードで確認できます。

## こんな場面で選ぶ

Fable 5.1 が価格に見合うのは、失敗のパターンが早々に諦めてしまうことや話の筋を見失うことにあるタスクであり、単に一度で答えを出すのが難しいタスクではありません。

- **長時間実行のエージェント型コーディング**：複数ファイルにまたがるリファクタリング、リポジトリ全体の監査、そして多数のツール呼び出しにわたって計画、実装、テスト修正を連鎖させるセッション。
- **複数ステップのリサーチ**：多数の情報源にまたがる調査結果をまとめる作業。コンテキストウィンドウが短いモデルや、根気のないモデルでは早々に要約してしまうような場面。
- **文書、スプレッドシート、スライドの作成**：大量の元資料を参照し続けながら、長く構造化された出力を作成する必要がある作業。

単発の難しい質問や分類タスク、あるいは日々のチャットやコーディングの大半については、推論強度を上げた Claude Opus 5 の方が安価な出発点になります。Anthropic 自身の比較表もこれを裏づけており、Opus 5 は Fable 5.1 と同じ 1M のコンテキストと 128K の出力上限を持ちながら、価格はその半分です。

## はじめ方

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録すると、クレジットカード不要で $1 分の無料クレジットがもらえ、初回のチャージでは最大 $50 分のボーナスクレジットも付与されます。キーをエクスポートし、既存の Anthropic 互換の実装を `anthropic/claude-fable-5-1` に向けてください。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
