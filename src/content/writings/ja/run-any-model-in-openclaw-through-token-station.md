---
slug: "run-any-model-in-openclaw-through-token-station"
lang: "ja"
title: "Token Station 経由で OpenClaw に任意のモデルを使う"
summary: "OpenClaw はオンボーディングウィザードと CLI からカスタムプロバイダーに対応する。Token Station の OpenAI 互換エンドポイント（21 プロバイダーにまたがる 250 以上のモデル）を指定すれば、GPT-5.5、Claude Opus、Kimi K2、Grok を、既存の設定を一切変えずに実行できる。"
category: "tutorial"
date: "2026-07-20"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/run-any-model-in-openclaw-through-token-station-cover.png"
draft: false
---

OpenClaw はオンボーディングウィザードと CLI から、カスタムプロバイダー（任意の OpenAI 互換または Anthropic 互換のエンドポイント）に対応している。Token Station の統一 API は `https://models.bytefuture.ai/v1` にあり、OpenAI 互換インターフェースを通じて 21 プロバイダーにまたがる 250 以上のモデルを提供する。OpenClaw を Token Station に向ければ、GPT-5.5、Claude Opus、Kimi K2、Grok、その他 Token Station 上のどのモデルでも、設定の他の部分を一切変えずに実行できる。1 つのキー、1 つのエンドポイント、あらゆるモデル。

## 始める前に必要なもの

- Node 22.22.3+、24.15+、または 25.9+（推奨デフォルトは Node 24）。`node --version` で確認する。
- Token Station のアカウントと API キー。[models.bytefuture.ai](https://models.bytefuture.ai) から無料登録できる。登録時に 1 ドル分のクレジットが付与され、クレジットカードは不要。
- OpenClaw のインストール（以下のステップ 1 を参照）。

## ステップ 1：OpenClaw をインストールする

**macOS / Linux / WSL2**：`--no-onboard` フラグは自動起動するウィザードをスキップするので、ステップ 2 で Token Station を個別に設定できる。

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

**Windows（PowerShell）、または npm を使う任意のプラットフォーム**：npm install はオンボーディングを自動起動しない。

```bash
npm install -g openclaw@latest
```

バイナリが動作しているか確認する。

```bash
openclaw --version
```

## ステップ 2：Token Station をプロバイダーとして設定する

Token Station のキーをエクスポートし、カスタムプロバイダーのフラグを付けてオンボーディングを実行する。

```bash
# macOS / Linux / WSL2
export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

# Windows PowerShell
$env:TOKEN_STATION_API_KEY = "YOUR_TOKEN_STATION_KEY"
```

```bash
openclaw onboard --install-daemon --non-interactive --accept-risk \
  --auth-choice custom-api-key \
  --custom-base-url "https://models.bytefuture.ai/v1" \
  --custom-model-id "openai/gpt-5.4-mini" \
  --custom-api-key "$TOKEN_STATION_API_KEY" \
  --secret-input-mode plaintext \
  --custom-compatibility openai
```

これで OpenClaw に Token Station がプロバイダーとして設定され、バックグラウンドデーモンがインストールされ、デフォルトモデルとして `openai/gpt-5.4-mini` が設定される。

**各フラグの意味**

| フラグ | 意味 |
|---|---|
| `--auth-choice custom-api-key` | 名前付きプロバイダー（OpenAI、Anthropic など）ではなく、カスタム API キーのプロバイダー経路を選択する。 |
| `--custom-base-url` | OpenClaw がリクエストを送るエンドポイント。Token Station の OpenAI 互換ベースは `https://models.bytefuture.ai/v1`。 |
| `--custom-model-id` | OpenClaw が使用するデフォルトモデル ID。`provider/model` の形式。 |
| `--custom-api-key` | あなたの Token Station API キー。`$TOKEN_STATION_API_KEY` という参照にしておけば、シークレットがシェル履歴に残らない。 |
| `--secret-input-mode` | OpenClaw が API キーを保存する方式。`plaintext` はキーをエージェントの認証プロファイルにそのまま保存する。 |
| `--custom-compatibility` | ワイヤープロトコルを制御する。`openai` は標準の chat completions を使い、Token Station には正しい選択。`/v1/responses` はサポートするが `/v1/chat/completions` はサポートしないエンドポイントに限り `openai-responses` を使う。Anthropic ネイティブのエンドポイントには `anthropic` を使う。 |
| `--install-daemon` | OpenClaw をバックグラウンドサービスとしてインストールする（macOS では LaunchAgent、Linux/WSL2 では systemd、Windows ではタスクスケジューラ。タスク作成が拒否された場合はスタートアップフォルダにフォールバックする）。 |

**対話型ウィザードの方がよければ**、他のフラグなしで `openclaw onboard --install-daemon` を実行する。ウィザードが Model/Auth のステップに達したら、カスタムプロバイダーのオプションを選び、OpenAI 互換を選択し、ベース URL に `https://models.bytefuture.ai/v1` を、API キーに Token Station のキーを入力する。

## ステップ 3：ゲートウェイが動いているか確認する

```bash
openclaw gateway status
```

ステップ 2 でインストールしたデーモンが、すでにゲートウェイを起動しているはずだ。動いていなければ、ステータスコマンドが何が問題かを教えてくれる。

## ステップ 4：コントロール UI を開いて確認する

```bash
openclaw dashboard
```

ダッシュボードはブラウザで `http://127.0.0.1:18789/` に開く。チャットを始めてみよう。エージェントが応答すれば、OpenClaw が Token Station と通信しており、モデルが答えているということだ。

## モデルを 1 コマンドで切り替える

Token Station 上のすべてのモデルは同じエンドポイント、同じキーの背後にある。デフォルトモデルを変更するには次のようにする。

```bash
openclaw configure --section model
```

または `--custom-model-id` を変えてオンボーディングを再実行する。選べるモデル ID の例：

| モデル ID | 向いている用途 |
|---|---|
| `openai/gpt-5.5` | プレミアムなフラッグシップ。難しいプランニング、デバッグ、アーキテクチャ設計に。 |
| `openai/gpt-5.4` | フラッグシップより低価格で高い推論力。 |
| `openai/gpt-5.4-mini` | 多くのタスクに向くバランス型の日常使いモデルで、コストも低い。 |
| `anthropic/claude-opus-4-8` | 長時間にわたるエージェント的推論と深い分析に。 |
| `kimi/kimi-k2.7-code` | 深さよりコストを優先したい日常的なコーディングタスクに。 |
| `xai/grok-build-0.1` | 高速で手頃、素早い応答に向く。 |
| `glm/glm-5.2` | 100 万トークンのコンテキストウィンドウ。コードに強く低価格。 |

モデルを切り替えても、ゲートウェイ、チャネル、デーモンは変わらない。変わるのは Token Station に送られるモデル ID だけだ。

## スマートルーティング：ポリシーにモデルを選ばせる

ほとんどの環境ではモデルをハードコードするだけで十分だ。Token Station ではサーバー側でルーティングポリシーを定義することもできる。品質の下限を満たす中で最も安いモデル、プロバイダーの許可リスト付きでレイテンシに上限を設けたもの、あるいはプライマリモデルに自動フォールバックを組み合わせたものなどだ。

OpenClaw の場合、`--custom-model-id` を Token Station 上のルーティング対象ワークロードに向ければ、ルーティングのロジックは Token Station 側に留まる。プライマリモデルがダウンしても、フォールバックが応答し、OpenClaw 側は何も気づく必要がない。ポリシーは Token Station 側で更新するだけで、OpenClaw の設定は何も変わらない。

## 便利な環境変数

デフォルト以外の場所を使いたい場合は、デーモンを起動する前に次を設定する。

| 変数 | 用途 |
|---|---|
| `OPENCLAW_HOME` | 内部のパス解決に使われるホームディレクトリを上書きする。 |
| `OPENCLAW_STATE_DIR` | 状態ディレクトリを上書きする。 |
| `OPENCLAW_CONFIG_PATH` | 設定ファイルのパスを上書きする。 |

## 接続できないとき

**401 / 認証エラー。** Token Station のキーが正しいか確認する。修正した `--custom-api-key` でオンボーディングコマンドを再実行するか、`openclaw configure --section model` で対話的に認証情報を更新する。

**モデルが違う、または見つからない。** [models.bytefuture.ai/models](https://models.bytefuture.ai/models) の Token Station カタログに記載されたモデル ID と完全に一致しているか確認する。`openclaw configure --section model` でモデル ID を更新する。

**ゲートウェイが起動していない。** `openclaw gateway status` を実行する。ゲートウェイを再起動するには `openclaw gateway restart` を使う。デーモンをゼロから再インストールするには `openclaw onboard --install-daemon` を再実行する。

**ダッシュボードが読み込まれない。** まずゲートウェイが起動している必要がある。`openclaw gateway status` で確認してから、`openclaw dashboard` を再試行する。

**設定の問題や予期しない動作。** `openclaw doctor` を実行して、無効な設定や古い設定を診断し、見つかった問題を直すために `openclaw configure` を再実行する。

## はじめよう

OpenClaw に Token Station を設定するのは、コマンド 1 つと環境変数 1 つだけで済む。デーモンが起動すれば、モデルの切り替えも `openclaw configure --section model` を 1 回呼ぶだけで、設定の他の部分は何も変わらない。

[models.bytefuture.ai](https://models.bytefuture.ai) で登録し（1 ドル分の無料クレジット、クレジットカード不要。初回チャージで最大 50 ドルのボーナスも）、キーをエクスポートし、オンボーディングコマンドを実行し、ダッシュボードを開こう。1 つのキー、1 つのエンドポイントで、あなたの OpenClaw 環境に必要なすべてのモデルが揃う。
