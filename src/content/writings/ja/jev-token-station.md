---
slug: jev-token-station
lang: ja
title: "Jev が Token Station に登場"
summary: "TypeSafe の Jev は、テキストではなく型付き確率を返す意思決定専用モデルで、ウェイトリストなしで Token Station から利用可能になりました。chat completions に代わるネイティブエンドポイント、3種類の回答タイプ（Noul、Choice、Score）、価格、そして TypeSafe の速度とコストの主張が独立測定の結果とどう比較されるかを解説します。"
category: product
date: 2026-10-03
cta: https://models.bytefuture.ai/intro.html
cover: blog/jev-token-station-cover.png
draft: false
---

Jev は `typesafe/jev-1.13.0` として Token Station で利用可能になりました。`typesafe/jev-latest` は最新リリースを追随します。TypeSafe 自身のプラットフォームでは、新規登録は依然としてウェイトリストから順に受け付けていますが、Token Station 経由であれば、他のすべてのモデルで使っているのと同じキーで今すぐ利用できます。

## テキストを生成しない

Jev は TypeSafe 初の「System One Model」です。この名前は、ダニエル・カーネマンが提唱した速く直感的な思考モードに由来します。チャットモデルが会話を読んで返信を書くのに対し、Jev は state（プレーンテキスト、JSON オブジェクト、またはメッセージの配列）と、型付きの questions の集合を読み取り、型付きの回答、すなわち確率、選択されたオプション、またはスコアを、それぞれ確信度の値とともに返します。TypeSafe はこれをフロンティア級知能の関数呼び出しだと説明しています。非構造化の state を入力し、型付きの確率的決定を出力する、というものです。生成された文章を解析する必要はありません。そもそも何も生成されないからです。

発表時のデモの一つで、TypeSafe の創業者は、各ページ上のリンクだけを使って2つの Wikipedia ページを競わせました。1ホップあたり候補となるリンクは数百から数千にのぼり、そのどれもが、存在しないリンクをでっち上げるわけにはいかない選択です。これこそ Jev が得意とする高カーディナリティな意思決定であり、チャットモデルの自由形式の回答であれば事後に解析して検証する必要があり、しかもその検証に通らない可能性すらあります。

だからこそ Token Station は、プラットフォーム上の他のすべてのモデルとは異なる形で Jev をルーティングしています。Jev は OpenAI 互換のチャット用ルートではなく、専用のエンドポイント `/typesafe/v1/systemone` を通じて応答します。代わりに `/v1/chat/completions`、`/v1/responses`、`/v1/messages` に送信すると、ゲートウェイはネイティブエンドポイントを示す 400 エラーでリクエストを拒否します。Jev は OpenAI 互換の `/v1/models` 一覧からも完全に除外されており、独自のカタログは `/typesafe/v1/models` にあります。どちらも意図的な設計です。意思決定モデルがたまたまチャットモデルと同じワイヤーフォーマットを共有していたら、まさに気づかれないまま誤用されるような事態になりかねません。

## 質問を投げる3つの方法

すべてのリクエストは、`state` と、名前付きの `questions` のマップを送信します。各 question には `type` があり、タイプは3種類あります。

**Noul** は、はい・いいえをブール値ではなく確率として答えます。

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": "Every customer has been unable to sign in for 30 minutes. Please restore service immediately.",
    "questions": {
      "urgent": {
        "type": "noul",
        "instructions": "Does this incident require immediate action?"
      }
    }
  }'
```

**Choice** は、最大255個のラベル付きオプションの集合から1つのキーを選び、その選択とともに全オプションにわたる確率分布を返します。

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": {
      "ticket": "My card was charged twice for the same invoice. Please refund the duplicate charge.",
      "account": {"plan": "business", "invoice_id": "example-invoice-001"}
    },
    "questions": {
      "team": {
        "type": "choice",
        "instructions": "Which team should handle the ticket?",
        "criteria": {
          "billing": "Invoices, charges and refunds",
          "technical": "Service outages, software bugs and integrations",
          "sales": "New purchases and plan upgrades"
        }
      }
    }
  }'
```

**Score** は、state を2段階から10段階までの順序付きルーブリックに照らして評価します。結果は単純な整数ではなく、そのルーブリック上の確率加重された小数位置になります。

```bash
curl https://models.bytefuture.ai/typesafe/v1/systemone \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "typesafe/jev-1.13.0",
    "state": [
      {"role": "customer", "content": "The checkout service fails for every customer."},
      {"role": "operator", "content": "Confirmed: all purchases have failed for the last 20 minutes."}
    ],
    "questions": {
      "impact": {
        "type": "score",
        "instructions": "Rate the current operational impact described in these reports.",
        "criteria": [
          "No disruption: all functions work normally",
          "Partial disruption: some customers or functions are affected",
          "Complete outage: a critical function fails for all customers"
        ]
      }
    }
  }'
```

1回のリクエストで3つのタイプすべてを混在させることができるため、`/typesafe/v1/systemone` への1回の呼び出しで、チケットのルーティング、重大度のスコアリング、緊急かどうかのフラグ付けを、3回ではなく1回の推論で行えます。

## スペック

| | |
|---|---|
| コンテキストウィンドウ | 32,000 tokens |
| Choice のオプション数（質問あたり） | 最大255 |
| Score の段階数（質問あたり） | 2 から 10 |
| レイテンシ | TypeSafe によるとエンドツーエンドで70-500ms |
| トレーニング | Reinforcement Learning for Calibrated Decisions（RLCD） |

## 価格

| | 入力 | 出力 |
|---|---|---|
| Jev | $0.042/M | 無料 |

生成するものが実質的に何もないため、出力側で課金する対象がありません。Token Station にすでにあるチャットモデルはどれも、入力側だけで見てもこれより高額で、GPT-6 Luna の $0.10/M から Claude Fable 5.1 の $10/M まで幅があります。Token Station は TypeSafe の料金をマークアップなしでそのまま適用しています。

## 実際に役立つ場面

分類やルーティングの判断をフルサイズのチャットモデルに任せることもできますが、それはもともと少数の選択肢の中から1つを選ぶだけの答えを、逐次的なトークンストリームで待つことを意味します。このトレードオフが直接現れる場面がいくつかあります。

- **モデルルーティング**：「パスワードをリセットして」と「請求スキーマを移行して」を見分けるためだけにフル規模の Opus クラスの呼び出しを費やす代わりに、フロンティアモデルが本当に必要かどうかを判断する前に、リクエストの難易度を分類します。
- **ツール呼び出しのゲーティング**：リスクのあるツール呼び出し（シェルアクセス、支払い、削除）を実行する前に、コード側で閾値判定できる確信度スコアとともに、承認・ブロック・エスカレーションを行います。
- **RAG の再ランキング**：クエリとチャンクの関連度を、大規模な候補集合を再ランキングできるほど高速にスコアリングし、チャットモデルのコンテキスト予算を検索ではなく統合のために温存します。
- **チケットやリクエストのトリアージ**：1件ごとにフルの会話を開くことなく、大量で創造性の低いトラフィックをキュー、優先度、担当者別にルーティングします。
- **ループと軌道のチェック**：エージェントの直前のステップが実際に前進したかどうかを確認し、ターンを浪費する前に暴走したループを早期に停止します。

TypeSafe 自身のベンチマークでは、こうしたタスクにおいて、比較対象の LLM に対して最大193.6倍の速度と444.6倍のコスト低減を謳っています。比較対象は GPT-5.6 Terra、GPT-6 Astra、Claude Fable 5.1 です。この3つはすべてすでに Token Station にあるため、自分で確かめたければキー一つで比較できます。発表週の独立した追跡調査はもう少し控えめな結果を示しており、数千件のユーザー報告された結果全体では、中央値はおよそ7倍の高速化と30倍のコスト削減にとどまり、193倍や444倍ではありませんでした。それでも、適したワークロードにおいては本物の勝利であり、ただ見出しの数字よりは小さいというだけです。

TypeSafe はこれをハルシネーション率0%とも呼んでおり、狭い意味では正確です。`choice` の回答は、あなたが指定した `criteria` のキーと照合されるため、Jev は提示していない選択肢を返すことはできません。しかしこれが保証するのは、有効な回答であって、正しい回答ではありません。これはチャットモデルより厳格な出力契約を持つ分類器であり、他のどのモデルとも同様に、自分のデータで評価する価値は変わらずあります。

## 始めるには

[models.bytefuture.ai](https://models.bytefuture.ai/signup)でサインアップしてください。カード登録は不要で、初回チャージ時には最大$50の100%マッチボーナスが付きます。キーをエクスポートし、`typesafe/jev-1.13.0`へ最初のリクエストを送信してください。ウェイトリストは不要です。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
