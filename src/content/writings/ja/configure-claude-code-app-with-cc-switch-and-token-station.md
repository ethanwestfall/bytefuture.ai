---
slug: "configure-claude-code-app-with-cc-switch-and-token-station"
lang: "ja"
title: "CC SwitchでClaude Code AppにToken Stationを設定する"
summary: "CC SwitchでToken Station Providerを作成して有効化し、Claude Code Appに設定を再読み込みさせ、実際のリクエストと利用履歴で経路を確認します。"
category: "tutorial"
date: "2026-08-17"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

Claude Code Appを公式サービス、Token Station、ほかのモデルサービスの間で切り替えるたびに設定を編集するのは手間がかかります。CC Switchは接続情報を個別のProviderとして保存し、選択した設定を適用できます。

ここではCC SwitchからClaude Code AppにToken Stationを設定し、実際のリクエストで経路を確認します。

> このガイドはCC SwitchとClaude Code App向けです。Claude Code CLIは起動方法と設定元が異なるため、CLI用の手順を使ってください。

## 事前準備

次のものを用意してください。

- CC SwitchとClaude Code App
- 利用可能なToken Station API key
- 対象モデルの利用権限または残高

[Token Stationダッシュボード](https://models.bytefuture.ai/dashboard)でAPI keyと完全なモデルIDを確認します。実際のkeyをスクリーンショット、チャット、公開文書に載せないでください。

## 設定の流れ

1. CC SwitchでClaude Code Providerを作成する
2. Token StationのURL、API key、モデルIDを入力する
3. Providerを保存して有効にする
4. Claude Code Appを完全に終了して開き直す
5. リクエストを送り、Token Stationで記録を確認する

## CC SwitchにToken Stationを追加する

CC Switchのバージョンによってボタン名は異なりますが、必要な値は同じです。

### 1. Providerを作成する

CC Switchを開き、**Claude Code**を選択してProvider管理に移動します。追加、新規Provider、またはプラスボタンをクリックします。

わかりやすい名前を付けます。

```text
Token Station
```

種類を選ぶ場合はClaude、Anthropic、またはカスタムAnthropic互換サービスを使います。

### 2. 接続情報を入力する

| フィールド | 値 |
| --- | --- |
| Base URL | `https://models.bytefuture.ai` |
| API Key / Auth Token | Token Station API key |
| Model | Token Stationに表示される完全なモデルID |

環境変数を入力する画面では次を使います。

```text
ANTHROPIC_BASE_URL=https://models.bytefuture.ai
ANTHROPIC_AUTH_TOKEN=<你的 Token Station API Key>
ANTHROPIC_MODEL=<完整模型 ID>
```

一部のCC Switchテンプレートは`ANTHROPIC_API_KEY`を使います。現在のテンプレートに従い、根拠のない複数の認証変数を同時に設定しないでください。

Base URLに`/v1/messages`を追加しないでください。クライアントがAnthropic Messages APIのパスを組み立てるため、重複すると404になる場合があります。

モデルIDにはプロバイダー接頭辞を含めます。

```text
openai/gpt-5.6-sol
```

Claude Code Appの表示名で置き換えないでください。

### 3. 保存して有効化する

保存前に確認します。

- Base URLに余分なパスや空白がない
- API keyの前後に空白や改行がない
- モデルIDにプロバイダー接頭辞がある
- プレースホルダーの記号や説明文を値としてコピーしていない

保存後、一覧の**Token Station**でEnable、Apply、またはSwitchをクリックし、現在のProviderになったことを確認します。

## Claude Code Appを再起動する

すでに動いているAppは、あとから選択したProviderを通常は読み込みません。

### Windows

1. Claude Code Appのウィンドウを閉じる
2. システムトレイにプロセスが残っていないか確認する
3. 残っていれば終了する
4. CC Switchで設定を適用してAppを開き直す

### macOS

1. Claude Code Appで`Command + Q`を押す
2. プロセスが終了したことを確認する
3. CC Switchで設定を適用してAppを開き直す

ウィンドウを閉じるだけではプロセスが終了しない場合があります。

## 経路を確認する

Claude Code Appで新しい会話を作成し、次を送ります。

```text
请只回复：Token Station 测试成功
```

応答後、[Token Stationダッシュボード](https://models.bytefuture.ai/dashboard)の`Recent Activity`で確認します。

- 新しいリクエストがある
- 時刻と状態が一致する
- 記録されたモデルがCC Switchの設定と一致する

Appの応答とToken Stationの記録がそろえば、経路が有効です。CC Switchの「現在のProvider」表示だけでは十分ではありません。

## 元の設定に戻す

公式Providerを上書きせずに残しておきます。戻す場合は元のProviderを選び、ApplyまたはSwitchをクリックし、Claude Code Appを完全に終了して開き直します。

## トラブルシューティング

### Appが古いProviderを使う

ウィンドウだけでなくプロセスが終了したことを確認します。Token Station Providerをもう一度適用してAppを起動します。

### API keyがないと表示される

テンプレートが`ANTHROPIC_AUTH_TOKEN`と`ANTHROPIC_API_KEY`のどちらを要求しているか確認します。修正後にProviderを再適用し、Appを再起動します。

### 401または403

keyが無効、期限切れ、余分な空白を含む、または対象モデルの権限や残高がない可能性があります。

### 404

Base URLを`https://models.bytefuture.ai`にし、手動で追加した`/messages`などの重複パスを削除します。

### モデルがない、または権限がない

Token Stationから完全なIDをコピーします。Appの表示名から推測しないでください。

### Appは応答するがToken Stationに記録がない

元のサービスを使っている可能性があります。現在のProvider、再起動、Token Stationのアカウントと時間フィルターを確認します。

## セキュリティ

- 実際のAPI keyをチュートリアルの画像に載せない
- CC Switchの設定や認証情報をGitにコミットしない
- 漏えいの可能性があればkeyを直ちに無効化して再発行する
- CC SwitchやClaude Code Appの更新前に設定をバックアップする

## 参考資料

- [Token Stationダッシュボード](https://models.bytefuture.ai/dashboard)
- [CC Switchプロジェクト](https://github.com/farion1231/cc-switch)
