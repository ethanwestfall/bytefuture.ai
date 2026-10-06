---
slug: claude-opus-5-5-token-station
lang: ja
title: "Claude Opus 5.5 が Token Station で利用可能に"
summary: "Anthropic の新しい Opus が `anthropic/claude-opus-5-5` として Token Station で利用可能になりました。Claude Opus 5 より20%安く、キャッシュ読み取りは60%低コストで、ベンチマークではかなり高価な Claude Fable 5.1 と同等かそれを上回る結果を示しています。変更点、価格、互換性を壊すAPIの変更点、そしてこれが高価な新ティアではなく素直なアップグレードである理由を解説します。"
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/claude-opus-5-5-token-station-cover.png
draft: false
---

Claude Opus 5.5 は `anthropic/claude-opus-5-5` として Token Station で利用可能になりました。すでに Claude Opus 5、Claude Sonnet 5、Claude Fable 5.1 を提供している、同じ Anthropic 互換ルートを通じて提供されます。

これは Fable 5.1 のような位置づけ、つまり最も困難な10%のタスクのために取っておく高価格な選択肢ではありません。Opus 5.5 は同じティアにおける Opus 5 の素直な後継であり、価格はより低く、Anthropic 自身のベンチマークでは、ほとんどのエージェント型タスクと知識作業タスクにおいて、かなり高価な Fable 5.1 と同等かそれを上回る結果を示しながら、トークンあたりの価格は60%低くなっています。

## Claude Opus 5 からの変更点

- **20%安い**:入出力トークン100万あたり$4/$20。$5/$25からの値下げです。
- **キャッシュ読み取りが$0.20/M**に。Opus 5の$0.50/Mから60%の低下です。キャッシュ書き込みも値下げされ、$5/M(5分)と$8/M(1時間)になりました。従来の$6.25/Mと$10/Mからの変更です。
- **出力の生成速度はOpus 5より30%以上速く**なっており、レイテンシのティアは同じです。
- **知識がより新しく**:カットオフは2026年6月。Opus 5の2026年5月からの更新です。

Opus 5 向けに書かれたコードを移行する場合、4つの点が影響を受けます。思考はどの推論強度でも無効化できなくなりました(現在は推論強度だけが制御手段であり、デフォルトは high ではなく medium になったため、Opus 5 の従来の既定動作を望む場合は明示的に設定する必要があります)。強制的なツール使用(`tool_choice: "any"` または特定のツール名の指定)はエラーを返すようになりました。思考ブロックは、それを生成したモデルと会話に紐づけられます。また Claude API と Google Cloud では、従来の `computer_20251124` コンピュータ操作ツールは受け付けられなくなりました(代わりに `computer_toolset_20260801` を使用します)。これらはいずれも Token Station を通じた最初の統合には影響せず、既存の Opus 5 用ハーネスを移植する場合にのみ関係します。

## スペック

| | |
|---|---|
| コンテキストウィンドウ | 1M tokens |
| 最大出力 | 128K tokens |
| 思考モード | 適応的、常時オン |
| デフォルトの推論強度 | 中 |
| 知識のカットオフ | 2026年6月 |

## 試してみる

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

同じリクエストで `anthropic/claude-opus-5-5` を `anthropic/claude-opus-5` に置き換えれば、本格的に切り替える前に、このアップグレードが自社のワークロードで実際に効果を発揮するかどうかを確認できます。

## 料金

| | 入力 | 出力 | キャッシュ読み取り | キャッシュ書き込み（5分） | キャッシュ書き込み（1時間） |
|---|---|---|---|---|---|
| Claude Opus 5.5 | $4/M | $20/M | $0.20/M | $5/M | $8/M |
| Claude Opus 5 | $5/M | $25/M | $0.50/M | $6.25/M | $10/M |
| Claude Fable 5.1 | $10/M | $50/M | $0.25/M | $12.50/M | $20/M |

Token Station はこれらの料金をそのまま、マークアップなしでパススルーします。リクエスト単位で計測され、自分のダッシュボードで確認できます。

## Claude Fable 5.1 と GPT-6 Astra に対する位置づけ

Anthropic 自身が公開したベンチマークでは、Opus 5.5 は測定された大半のタスクで Fable 5.1 を上回っており、価格は半分を大きく下回っています。

- **Terminal-Bench 4.0**:66.4%。Anthropic 自身の評価において、Fable 5.1 の55.8%、GPT-6 Astra の57.9%を上回っています。
- **GDPval-AA v2.1**(知識労働):1846 Elo。Fable 5.1 の1735を100ポイント以上、Astra の1542を300ポイント以上上回っています。
- **Humanity's Last Exam**:67.7%。Fable 5.1 の65.6%、Astra の57.2%を上回っています。
- **OSWorld 2.1**(コンピュータ操作):81.8%。Fable 5.1 の80.7%を上回っています。

完全な総なめというわけではありません。Astra は依然として Terminal-Bench-Science(64.6%対Opus 5.5の58.7%)とAutomationBench(41.4%対40.0%)で優位に立っており、いずれも僅差です。とはいえ、ほとんどのエージェント型コーディング、コンピュータ操作、知識労働においては、Opus 5.5 が今や2つのデフォルトのうちより強力で安価な選択肢になっています。

## はじめ方

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録してください。クレジットカードは不要で、初回のチャージには最大 $50 の 100% マッチボーナスが付きます。キーをエクスポートし、既存の Anthropic 互換の実装を `anthropic/claude-opus-5-5` に向けてください。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
