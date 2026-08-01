---
slug: "wan-2-7-image-pro-token-station"
lang: "ja"
title: "Token Station で Wan 2.7 Image Pro を使って画像を生成・編集する"
summary: "Wan 2.7 Image Pro は Alibaba のプロ向け画像モデルです。テキストからの画像生成とプロンプトによる編集を 1 つの API でカバーし、最大 4K 出力、参照画像 9 枚、十数言語でのテキスト描画に対応します。Token Station 上で qwen/wan-2.7-image-pro として利用できます。"
category: "tutorial"
date: "2026-07-31"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/wan-2-7-image-pro-token-station-cover.png"
draft: false
---

Wan 2.7 Image Pro は、Alibaba の画像生成モデル群 Wanxiang（Wan）のプロフェッショナル版です。2026 年 4 月に、Wan 2.7 Image のアップグレード版としてリリースされました。テキストから画像を生成する処理と、プロンプトによる編集処理は同じエンドポイントで扱え、Token Station 上ですでに `qwen/wan-2.7-image-pro` として利用できます。

## このモデルにできること

- **最大 4096x4096 のテキストから画像生成。** フル 4K 出力が必要なプロンプトにはそのまま使える。ブログのサムネイルや SNS 投稿程度の小さいサイズなら、デフォルトの 1024x1024 で十分。
- **最大 2048x2048 のプロンプトによる編集。** 既存の画像と新しい指示を送ると、モデルがその場で画像を編集する。
- **バウンディングボックスによる領域指定編集。** `bbox_list` 配列(画像 1 枚につき最大 2 つ、絶対ピクセル座標で指定)を加えれば、編集を適用する場所をモデルの推測任せにせず、直接指定できる。
- **参照画像は最大 9 枚。** 編集や複数画像の生成リクエストでは、複数の入力画像を同時に参照できる。キャラクターや製品の見た目を一連の画像で揃えたいときに役立つ。
- **十数言語でのテキスト描画。** 看板、ラベル、表、簡単な数式まで、それなりの精度で描画できる。旧世代の画像モデルにありがちな崩れた文字にはならない。
- **バッチ生成。** 1 回のリクエストで最大 4 枚まで、1 枚あたりの料金は変わらない。
- **オプションの推論ステップ。** Wan 2.7 Image Pro はレンダリング前に「思考」ステップを挟むことができる。空間関係や構図、複数の要素がどう影響し合うかを、ピクセルを生成する前に整理する処理だ。複数の被写体が絡み合うプロンプトや、明確なレイアウト指定があるプロンプトでとくに効果を発揮する。レイテンシが増えるため、すべてのリクエストのデフォルトにするのではなく、複雑なプロンプトのときに使う設定と考えるとよい。

## できないこと

- **ピクセル単位のマスクによるインペインティングはない。** 変更内容はプロンプトで指示し、必要ならバウンディングボックスで対象領域を絞り込めるが、マスクツールのように置き換えるピクセルを正確に囲む方式ではない。
- **複数回の生成をまたいだキャラクターの一貫性は保証されない。** 1 回のリクエスト内で複数画像を参照すれば一貫性を保てるが、同じプロンプトでも 2 回の独立したリクエストでは結果がずれることがある。
- **複雑な多分割インフォグラフィックは弱い。** ラベル付きパネルが多い密度の高いレイアウトには、そうした用途向けに作られたモデルのほうが向いている。

## 画像を生成する

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{ "model": "qwen/wan-2.7-image-pro", "prompt": "A childrens book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter." }'
```

`$YOUR_API_KEY` はあなたの Token Station キーで、[ダッシュボード](https://models.bytefuture.ai/dashboard)から取得できる。

## 既存の画像を編集する

`image_url` 配列に元になる画像を 1 枚以上入れ、`prompt` に変更内容を書く。

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{"model": "qwen/wan-2.7-image-pro", "prompt": "Put a trophy in his hand", "image_url": ["https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg"]}'
```

生成も編集も同じエンドポイントを使う。変わるのは `image_url` を付けるかどうかだけで、ルートもモデル ID も同じ。

## パラメーター

| フィールド | 説明 |
|---|---|
| `model` | `qwen/wan-2.7-image-pro` |
| `prompt` | 必須。生成または編集の指示。 |
| `image_url` | 元画像 URL の配列（任意）。省略するとテキストから画像生成、指定すると編集になる。1 回のリクエストで最大 9 枚。 |
| `bbox_list` | 編集時のみ使用する任意項目。入力画像ごとに最大 2 つの `[x1, y1, x2, y2]` ピクセル座標を指定し、編集を適用する範囲を絞り込む。 |

## 解像度と出力

| モード | 最大解像度 | バッチ |
|---|---|---|
| テキストから画像生成 | 4096x4096 | 1 回のリクエストで最大 4 枚 |
| 編集 | 2048x2048 | 1 回のリクエストで最大 4 枚 |

4K は本物の出力であってアップスケールではないが、大判印刷やヒーローバナーより小さい用途には過剰品質になる。Web や SNS 用途はデフォルトの 1024x1024 のままにして、実際にその大きさで表示される素材にだけ高い解像度を使うとよい。

## 料金

Token Station はプロバイダーの料金をマージンなしでそのまま転送する。`qwen/wan-2.7-image-pro` の現在の 1 枚あたりの料金は[ダッシュボード](https://models.bytefuture.ai/dashboard)で確認してほしい。同じモデルを提供している他のホスティングでは、Pro ティアの価格は標準解像度 1 枚あたりおよそ 0.075 ドルで、評価時の目安になる。

## はじめよう

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録する。1 ドル分の無料クレジット、クレジットカード不要、初回チャージで最大 50 ドルのボーナスも付く。キーをエクスポートして上のリクエストを実行し、次に自分の画像で編集も試してみてほしい。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
