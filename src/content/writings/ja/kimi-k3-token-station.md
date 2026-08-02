---
slug: "kimi-k3-token-station"
lang: "ja"
title: "Kimi K3 は 3 兆パラメータ級に到達した初のオープンソースモデル。Token Station で無料で試そう"
summary: "Moonshot の Kimi K3 は 2.8 兆パラメータと 100 万トークンのコンテキストウィンドウを備え、3 兆パラメータ級に到達した初のオープンソースモデルです。Token Station に kimi/kimi-k3 として登場し、定価のまま上乗せゼロで提供されます。"
category: "tutorial"
date: "2026-07-25"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/kimi-k3-token-station-cover.png"
draft: false
---

Moonshot AI の Kimi K3 は 2.8 兆パラメータを持ち、3 兆パラメータ級に到達した初のオープンソースモデルです。Moonshot によれば、過去 12 か月のうち 9 か月間、Kimi モデルがオープンソースモデルの規模でフロンティアを保持してきたといいます。K3 はその記録を大きく更新しました。

規模だけでも K3 は注目に値しますが、実用性を支えているのはそれ以外の仕様です。100 万トークンのコンテキストウィンドウ、ネイティブな視覚理解、そして長時間にわたるコーディング、ナレッジワーク、推論のために設計されたアーキテクチャです。完全なモデルウェイトは 2026 年 7 月 27 日までに公開される予定で、API は現在 Moonshot のプラットフォームで稼働しており、本日 Token Station にも登場しました。

## アーキテクチャの新しい点

K3 はハイブリッド線形注意機構である Kimi Delta Attention（KDA）をベースに構築されており、これに Attention Residuals（AttnRes）を組み合わせることで、より長いシーケンスやより深いモデルでも情報がスムーズに流れるようにしています。Mixture-of-Experts の面では、Moonshot の Stable LatentMoE フレームワークがスパース性をさらに高めており、K3 は 896 個のエキスパートのうちトークンごとにわずか 16 個だけを活性化します。トレーニングとデータの改善も相まって、Moonshot は K3 全体のスケーリング効率を前世代の Kimi K2 の約 2.5 倍としています。

とくに 2 つのワークロードに設計上の重点が置かれています。

- **長時間にわたるコーディング。** K3 は最小限の監督で長時間のエンジニアリングタスクを継続できるよう設計されています。大規模なコードベースの理解、ターミナルツールの連携、そしてソフトウェアエンジニアリングと視覚的推論の組み合わせ（フロントエンド開発、ゲーム開発、CAD でのスクリーンショットや視覚的フィードバックの活用）です。
- **ナレッジワーク。** Moonshot によれば、実際のユーザーとエージェントの協働から得られる繰り返しのパターンをもとに構築した社内評価において、公開ベンチマークでは捉えきれない一貫した向上が見られるとのことです。

## ベンチマークにおける K3 の位置づけ

Moonshot 自身の位置づけは率直です。K3 の総合性能は、比較対象のうち最も高性能な 2 つのプロプライエタリモデルである Claude Fable 5 と GPT-5.6 Sol にはまだ及びませんが、複数のベンチマークで Claude Opus 4.8 を上回っています。公表されている数値は次の 2 つです。

- **DeepSWE：67.3**（mini-SWE-agent ハーネス使用）。
- **BrowseComp：90.4**（100 万トークンのフルコンテキストを使用し、コンテキスト管理なし）。

ケーススタディでは、100 万コンテキストと長時間タスク向けの設計が実際にどう活きるかが示されています。4 つの NVIDIA Hopper GPU カーネル最適化タスクでは、K3 は（フォールバックを使った）Fable 5 に匹敵する性能を発揮し、Opus 4.8、GPT-5.6 Sol、GPT-5.5 を上回りました。あるコンパイラタスクでは、Triton や `torch.compile` に匹敵するか上回る性能を持つ Triton ライクなコンパイラ（MiniTriton）をゼロから構築し、それを使ってエンドツーエンドの nanoGPT 学習を安定して実行しました。ある天体物理学の研究タスクでは、300 種類以上の状態方程式を処理し、チームが手作業なら通常 1〜2 週間かかるとする作業を約 2 時間で終えました。

## Token Station で Kimi K3 を無料で試す

K3 は [Token Station](https://models.bytefuture.ai/intro.html) で `kimi/kimi-k3` として利用でき、Moonshot の定価のまま上乗せゼロで提供されます。**キャッシュミス時は入力 100 万トークンあたり 3.00 ドル、キャッシュヒット時は 100 万トークンあたり 0.30 ドル、出力は 100 万トークンあたり 15.00 ドル**で、コンテキストウィンドウは 1,048,576 トークンまでフルに使えます。K3 の思考モードはオフにできず、デフォルトで最大の推論強度が使われるため、推論トークンは出力として課金される点を見込んでおいてください。より速く安価な応答が欲しい場合は、リクエストで `reasoning_effort` を `low` に設定してください。

Token Station が省いてくれる手間が一つあります。Moonshot 自身のコンソールでは、K3 を解放するには最低 1 ドルのチャージが必要です。Token Station では、登録クレジットだけですぐに解放され、別途 Moonshot アカウントやチャージは必要ありません。

無料で始められます。[登録](https://models.bytefuture.ai/signup)するとカード不要で 1 ドルのクレジットがもらえます。初回チャージ時にはさらに最大 50 ドルのボーナスクレジットが加算されます。K3 が Token Station 上の他のモデルと比べてどの位置にあるかは次のとおりです。

| モデル | 入力 / 100万 | 出力 / 100万 | コンテキスト |
|---|---|---|---|
| `kimi/kimi-k3` | $3.00* | $15.00 | 1,048,576 |
| `kimi/kimi-k2.7-code` | $0.95 | $4.00 | 256K |
| `glm/glm-5.2` | $1.40 | $4.40 | 1M |
| `anthropic/claude-opus-4-8` | $5.00 | $25.00 | 1M |
| `openai/gpt-5.5` | $5.00 | $30.00 | 1M |
| `anthropic/claude-fable-5` | $10.00 | $50.00 | 1M |

\* キャッシュミス時の料金です。繰り返し使われるコンテキストは、上記のキャッシュヒット料金（0.30 ドル）が適用されます。

すでに使っているコーディングツールを `kimi/kimi-k3` に向けて、実際の作業を任せてみましょう。

### Claude Code

Claude Code はモデルとエンドポイントを環境変数から読み込みます。すべてのティアを Token Station 経由で K3 にルーティングしましょう。

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

Token Station をプロバイダーとして設定し、K3 をモデルにします。

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

Token Station をプロバイダーとして登録し、K3 をデフォルトモデルに設定します。

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

## 知っておきたい癖

- **`max_completion_tokens` はデフォルトよりずっと高く設定できます。** デフォルトは 131,072 ですが、出力量の多いタスクでは最大 1,048,576 まで設定できます。
- **画像・動画の入力には base64 かアップロード済みのファイル ID が必要です。** 画像・動画のどちらも公開 URL には対応していません。画像は base64 でインライン送信できるほか、どちらのメディアタイプも Files API（`ms://<file-id>`）でアップロードできます。動画についてはファイルアップロードが推奨されます。
- **ウェブ検索は更新中です。** Moonshot は、当面の間、K3 の公式ウェブ検索ツールを本番ワークフローで使用することを推奨していません。
- **ウェイトの公開は、この API 提供開始から数日遅れます。** K3 はオープンソースですが、完全なウェイトは 2026 年 7 月 27 日までに公開される予定です。上記の内容はすべて、今日からホスト型 API で利用できます。セルフホスティングはその少し後になります。

1 つのキー、すでに使っている環境、そしてこれまでで最大規模となる 2.8 兆パラメータのオープンソースモデル。K3 があなたのリポジトリで通用するかどうかは、無料登録するだけで確かめられます。

こちらから始めましょう：[models.bytefuture.ai](https://models.bytefuture.ai/signup)
