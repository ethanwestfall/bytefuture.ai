---
slug: qwen-3-8-max-token-station
lang: ja
title: "実測：Token Station で Qwen 3.8-Max を試す"
summary: "Alibaba は Qwen 3.8-Max（2.4 兆パラメータ、スパース MoE、マルチモーダル）をプレビューしただけで、ベンチマークは一切公開していません。そこで Token Station で同じ 3 つのタスクを qwen3.8-max-preview、kimi-k3、gpt-5.6 に実行させました。3 つとも合格。レイテンシが最も安定していたのは Qwen 3.8-Max でした。"
category: product
date: 2026-07-28
cta: https://models.bytefuture.ai/intro.html
cover: "blog/qwen-3-8-max-token-station-cover.png"
---

Alibaba は 2026 年 7 月 19 日の World AI Conference（WAIC）で Qwen 3.8-Max をプレビューしました。2.4 兆パラメータ、スパース Mixture-of-Experts、ネイティブマルチモーダル、そして [Claude Fable 5](/blog/try-claude-fable-5-in-codex-openclaw-and-pi-ja.html) に次ぐ性能という主張です。ただし、ベンチマーク表もモデルカードも、確定したコンテキストウィンドウもまだ公開されていません。

主張を繰り返す代わりに、小さな比較を行いました。[Token Station](https://models.bytefuture.ai/intro.html) 上で `bailian-intl/qwen3.8-max-preview`、`kimi/kimi-k3`、`openai/gpt-5.6` に同じ 3 つのタスクを実行させました。キーは 1 つ、temperature は 0 です。2 つは答えを確認できるコーディングタスク、1 つは確率の問題です。

## 3 つのタスク

- **Trapping rain water。** ツーポインタの問題です。既知の入力で答えを検証します。
- **確率。** 赤 3 個、青 4 個、緑 5 個の球から、戻さずに 3 個取り出します。3 つすべてが違う色である確率を求めます。正確な答えは 3/11 です。
- **バグ探し。** 1 行足りない `merge_sorted` 関数。修正は指定されたテストケースを通過しなければなりません。

すべての答えは自動的にチェックしました。コードは抽出して実行し、分数は一致を確認しました。

## 結果

| タスク | qwen3.8-max-preview | kimi-k3 | gpt-5.6 |
|---|---|---|---|
| Trapping rain water | 合格、7.6 秒 | 合格、12.5 秒 | 合格、5.3 秒 |
| 確率（3/11） | 合格、7.3 秒 | 合格、13.8 秒 | 合格、13.5 秒 |
| バグ探し | 合格、8.0 秒 | 合格、31.5 秒 | 合格、4.2 秒 |

9 つすべて合格しました。この規模のタスクでは、これは能力の下限を示しているだけです。ここにあるフロンティアモデルはどれも解けます。興味深いシグナルは、レイテンシとトークン数のほうにあります。

Qwen 3.8-Max が最も安定していました。どのタスクも 7〜8 秒で終え、推論トークンは問題の難易度に関係なく毎回 142〜165 トークンでした。[GPT-5.6](/blog/gpt-5-6-token-station-ja.html) はコーディングタスクで最速かつ最も簡潔（4〜5 秒、出力 120 トークン未満）でしたが、確率の問題には 13.5 秒かかりました。[Kimi K3](/blog/kimi-k3-token-station-ja.html) は簡単なタスクでは推論が最も少なく（55〜86 トークン）、バグ探しのタスクで急増しました。推論トークン 294、31.5 秒。他の 2 つは横ばいのままです。

率直な評価を言えば、小さく自動チェック可能なタスクセットにおいて、プレビュー段階の Qwen 3.8-Max は出荷済みの 2 つのフロンティアモデルと渡り合い、しかも最も安定したレイテンシでした。自分のワークロードを向けてみる理由にはなりますが、最終判定ではありません。

## まだ確認できていないこと

上記は私たちのテストです。残りの仕様は Alibaba によるもので、その一部はまだ主張にとどまります。

- **2.4 兆パラメータ、スパース MoE。** トークンあたりのアクティブパラメータ数は非公開です。サービングコストを決めるのはその数字です。
- **マルチモーダル。** テキストと画像入力は確認されています。完全なモダリティ一覧（動画、ドキュメント、音声、画像生成）は未確認で、仕様書も公開されていません。
- **コンテキストウィンドウ：未公開。**
- **「Fable 5 に次ぐ」。** Alibaba 自身の言葉で、社内評価に基づくものです。ベンチマーク表もモデルカードも存在しません。参考として、前世代の Qwen 3.7-Max は GPQA Diamond で 92.4、SWE-bench Verified で 80.4、Terminal-Bench 2.0 で 69.7 を記録しています。
- **オープンウェイト。** Alibaba は Qwen 3.8 が「まもなくオープンウェイト化」としていますが、日付もライセンスも示されていません。Max 層はこれまでクローズドで、オープンウェイトの系統は Qwen 3.6 まで別途続いています。

2.4 兆パラメータは、一般に知られているモデルとしては 2 番目の規模です。1 番は Moonshot の Kimi K3（2.8 兆）で、同じ週にオープンウェイトで出荷されました。

## Token Station で試す

エンドポイントは標準の Token Station OpenAI 互換 API です。

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

Token Station は Anthropic API 形式も提供しているため、同じルートで Claude Code にそのまま組み込めます。

## コーディングエージェントに組み込む

Claude Code では Opus スロットに入れます。

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

Codex ではデフォルトモデルにします。

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

## 料金

Qwen 3.8-Max はプレビュー段階で、Alibaba は標準の API 料金を公開していません。Token Station はプロバイダーの料金を上乗せゼロでそのまま転送します。現在の 100 万トークンあたりの料金はダッシュボードで確認してください。登録時の 1 ドルクレジットで、初回評価を実行できます。

要点：

- Base URL（OpenAI 互換）：`https://models.bytefuture.ai/v1`
- Base URL（Anthropic 互換）：`https://models.bytefuture.ai`
- モデル：`bailian-intl/qwen3.8-max-preview`
- API キー：`gw-` で始まります。[Token Station ダッシュボード](https://models.bytefuture.ai/dashboard)から取得します。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
