---
slug: "configure-open-webui-with-token-station"
lang: "ja"
title: "Open WebUI を Token Station に接続する"
summary: "Docker で Open WebUI を起動し、カスタム OpenAI 互換プロバイダーとして Token Station に接続すると、モデルリストがキーの全カタログから自動的に埋まる。モデルを一つずつ手動登録する必要はない。管理者以外のユーザーにモデルを使えるようにする方法と、チャット画面からモデルを切り替える方法も扱う。"
category: "tutorial"
date: "2026-09-01"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/configure-open-webui-with-token-station-cover.png"
draft: false
---

[Open WebUI](https://github.com/open-webui/open-webui) は、任意の OpenAI 互換 API に対して動くセルフホスト型のチャットインターフェースだ。Token Station を指定すれば、モデルリストはキーのカタログから直接自動的に埋まる。一部のツールのようにモデルを一つずつ手動登録する必要はない。ここでは Open WebUI の起動、Token Station への接続、実際にこのインスタンスを使う人たちにモデルを使えるようにする方法、そしてチャット画面自体からモデルを切り替える方法まで扱う。

設定に入る前に、Token Station を経由してプロバイダーに直接課金するのではなくルーティングするという、このシリーズの他のツールと同じ理屈がここにも当てはまる。コストの可視性(すべてのリクエストがプロバイダーの実際のレートでマークアップなしに課金され、自分のダッシュボードに表示される)と一元管理(同じキーが、実行しているすべての OpenAI 互換ツールで使える。Open WebUI も例外ではなく、ツールごとに別々のキーや別々の請求を用意する必要がない)だ。Open WebUI にはさらに、それ自身に特有のもう一つの理由がある。このシリーズの中で唯一、モデルリストが自分一人のために一度だけ設定するものではなく、チームやユーザー全体が目にして選ぶものになるツールだということだ。だから一つの Token Station キーで、有効化したモデルへのアクセスをインスタンス全体のユーザーに与えられる。各ユーザーが自分のプロバイダーアカウントを持つ必要はない。

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/configure-open-webui-with-token-station/walkthrough.mp4" type="video/mp4">
  </video>
  <figcaption>一通りのデモ：Open WebUI の起動、Token Station への接続、モデルカタログの自動入力、モデルを公開にする操作、そしてチャットインターフェースからその切り替えまで。</figcaption>
</figure>

## 始める前に必要なもの

- Docker がインストールされ、動作していること。
- Token Station のアカウントと API キー。[models.bytefuture.ai](https://models.bytefuture.ai) から無料登録できる。登録時に 1 ドル分のクレジットが付与され、クレジットカードは不要。

## ステップ 1：Open WebUI を起動する

Open WebUI は単体で動かすのに別のバックエンドを必要としない。これで直接起動できる。

```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

このボリュームマウントによって、コンテナを再起動しても設定とアカウントが保持される。起動したら `http://localhost:3000` を開く。まっさらなインスタンスにはまだアカウントがないので、最初に作ったサインアップが自動的に管理者権限を得る。既存のログインを探す必要はなく、そのまま一つ作ればいい。

## ステップ 2：Token Station をプロバイダーとして接続する

管理画面で、プロフィールメニュー → **Admin Panel** → **Settings** → **Connections** と進み、**Manage OpenAI API Connections** の下にある **➕ Add Connection** をクリックする。次を設定する。

- **URL**：`https://models.bytefuture.ai/v1`
- **Key**：あなたの Token Station API キー

URL フィールドは入力中によく知られたプロバイダーを候補として表示するが、Token Station はそのリストには出てこない。これは想定どおりで、そのまま直接入力すればよい。接続を保存する。

## ステップ 3：モデルカタログが自動入力されたことを確認する

Open WebUI はプロバイダーの `/models` エンドポイントを呼び出すことで新しい接続を検証し、成功するとそのキーが見えるモデルからリストを埋める。**Admin Panel → Settings → Models** を開くと、Token Station の全カタログが自動的に現れているはずで、モデルを一つずつ入力する必要はない。

そこに表示される内容について、二つ知っておく価値がある。

- リストにはそのキーがアクセスできるあらゆるモダリティが含まれる。チャットモデルに加えて、画像生成、動画生成、音声関連のモデル(`openai/gpt-image-2`、`xai/grok-imagine-video`、`elevenlabs/scribe-v2` など)も並ぶ。この記事で確認しているのは通常のチャットだけであり、同じリストにチャット以外のモデルが表示されているからといって、Open WebUI のチャットインターフェースが同じように扱ってくれるとは限らない。
- **Arena Model** という項目が見えることがある。これは Open WebUI 自体の組み込み機能(同じプロンプトを複数のモデルに匿名で投げて結果を比較できる)であり、Token Station から送られてきたものではない。設定ミスや認識されないモデル ID だと誤解しないように。

## ステップ 4：ユーザーがモデルを使えるようにする

すべてのモデルは最初 **Private** で、管理者にしか見えない。インスタンス上の他の登録ユーザーにモデルを選べるようにするには、**Admin Panel → Settings → Models** を開き、リストからそのモデルを見つけて隣の **⋮** メニューをクリックし、**Make Public** を選ぶ。一括操作はないので、モデルごとに個別に行う必要がある。全公開よりも細かい制御をしたい場合は、同じモデルの設定ページ全体(鉛筆/編集アイコンから開く)に **Access** ボタンがあり、そこから開く **Access Control** ダイアログで、Public の代わりに特定のユーザーやグループの **Access List** を作ることもできる。

典型的な Token Station のカタログには 20 以上のモデルがあるので、ステップ 3 で触れたモダリティの混在も踏まえると、すべてを既定で公開にするのではなく、どれを公開するか意図的に決める価値がある。

## ステップ 5：チャットインターフェースからモデルを切り替える

これがこの設定の本当の目的だ。あるモデルが有効化されれば、管理者に限らずどのユーザーでも、メインのチャット画面にあるモデルセレクターからそれを選び、公開されているモデルの間を切り替えられる。Docker や環境変数、管理者設定に触れる必要は一切ない。

あるモデルがリストに出ているだけでなく実際にエンドツーエンドで動作していることを確認するには、そのモデルを選んで実際にメッセージを送り、[Token Station のダッシュボード](https://models.bytefuture.ai/dashboard)を確認する。実際の返信があり、Recent Activity に対応する行が現れていれば、接続とキー、そしてそのモデル自体が正しく設定されていることになる。Open WebUI 上でどのユーザーがメッセージを送ったかにかかわらず、費用はそのまま自分の Token Station アカウントに課金される。

## はじめよう

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録する。1 ドル分の無料クレジット、クレジットカード不要。初回チャージで最大 50 ドルのボーナスも付く。キーをエクスポートし、上記の Docker コマンドを実行して接続しよう。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
