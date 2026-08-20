---
slug: "route-cursor-through-token-station"
lang: "ja"
title: "Cursor を Token Station に接続する：Claude Sonnet 5 と Haiku"
summary: "Cursor は Settings の Models パネルからカスタム OpenAI 互換プロバイダーに対応している。Token Station を指定すれば Claude Sonnet 5 と Haiku が選択可能なモデルとして現れ、Agent モードも完全にサポートする。チャットだけでなく実際のファイル編集ができ、コスト階層のサブエージェントも使える。"
category: "tutorial"
date: "2026-08-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-cursor-through-token-station-cover.png"
draft: false
---

Cursor は Settings → Models からカスタム OpenAI 互換プロバイダーに対応している。Token Station のエンドポイントを指定すれば、Claude Sonnet 5 と Haiku を選択可能なモデルとして追加でき、すべて自分の Token Station キーで課金される。Token Station 上の他のいくつかのモデルファミリーと違い、この二つは Cursor の Agent モードを完全にサポートする。チャットだけでなく、実際のファイル編集ができるということだ。ここでは設定を最初から最後まで説明する。実際にやってみて遭遇した二つの落とし穴も含めて、最後には実際のコーディングセッションまで見せる。Sonnet 5 がオープンソースプロジェクトで実際の機能を実装し、調査と検証を Haiku ベースのサブエージェントに委任する様子だ。

## 始める前に必要なもの

- Cursor がインストール済みであること（[cursor.com/download](https://cursor.com/download)）。
- Token Station のアカウントと API キー。[models.bytefuture.ai](https://models.bytefuture.ai) から無料登録できる。登録時に 1 ドル分のクレジットが付与され、クレジットカードは不要。
- Cursor Pro。Agent モードでのカスタムモデル選択は、自分の API キーを設定していても無料プランではロックされているため、Chat モード以外の用途にはすべて Pro（月額 20 ドル)が必要になる。

## ステップ 1：Token Station をカスタムプロバイダーとして登録する

**Settings → Cursor Settings → Models** を開き、**API Keys** までスクロールして、二つのフィールドを設定する。

- **OpenAI API Key**：Token Station のキーを入力する。
- **Override OpenAI Base URL**：トグルをオンにし、デフォルト値を `https://models.bytefuture.ai/v1` に置き換える。

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/register-provider.mp4" type="video/mp4">
  </video>
  <figcaption>Cursor の Models 設定で、Token Station をカスタム OpenAI 互換プロバイダーとして登録する。</figcaption>
</figure>

**知っておくべき既知のバグ**：現行の Cursor（3.15.x 系）では、この二つのフィールドがクリックしてもキーボード入力を受け付けないことがある。入力しても何も起きない場合は、まずパネル内の別の場所をクリックし、その後 **Tab** キーを繰り返し押してフォーカスを対象フィールドに移す。Tab でフォーカスが当たった後は、入力も **Ctrl+V** による貼り付けも問題なく動作する。これは公式に認められているリグレッションであり、あなたの環境固有の問題ではない。

キーとURLが正しいことの確認を「Verify」ボタンに頼らないこと。常に表示されるわけではなく、表示されていてもすべての経路をカバーしているわけではない。信頼できる確認方法はステップ 2 だ。モデルを追加して、実際にメッセージを送ってみる。

## ステップ 2：Claude Sonnet 5 と Haiku をカスタムモデルとして追加する

引き続き Models の設定で、**+ Add Custom Model** を二回クリックし、次を追加する。

```
anthropic/claude-sonnet-5
anthropic/claude-haiku-4-5
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/add-models.mp4" type="video/mp4">
  </video>
  <figcaption>anthropic/claude-sonnet-5 と anthropic/claude-haiku-4-5 をカスタムモデルとして追加する。</figcaption>
</figure>

**ここが落とし穴**：ここで登録した名前を、Cursor はそのままリクエストの `model` フィールドとして送信する。Token Station の実際のルート名には `anthropic/` プレフィックスが含まれる。プレフィックスなしの `claude-sonnet-5` として登録すると、すべてのリクエストが `Model 'claude-sonnet-5' not found` というエラーで失敗する。プレフィックスなしのそのモデルは実際に存在しないからだ。プレフィックス付きで登録すればすぐに動作する。

Cursor に受け付けられただけでなく実際にエンドツーエンドで動作していることを確認するには、チャットを開いて新しく追加したモデルのどれかを選び、適当なメッセージを送り、[Token Station のダッシュボード](https://models.bytefuture.ai/dashboard)を確認する。実際の返信があり、Recent Activity に対応する行が現れていれば、キー、ベース URL、モデル名のすべてが正しいということだ。

| モデル | 向いている用途 |
|---|---|
| `anthropic/claude-sonnet-5` | メインのコーディングモデル。プランニング、実装、Agent モードでのファイル編集に。 |
| `anthropic/claude-haiku-4-5` | サブエージェント向けの低コストルート。探索、トリアージ、検証に。 |

## ステップ 3：Haiku を使うサブエージェントを定義する

Cursor はサブエージェントに対応している。YAML フロントマター付きの markdown ファイルで、プロジェクトごとに `.cursor/agents/` に置くか、グローバルに `~/.cursor/agents/` に置くことができ、それぞれが独自の `model` フィールドを持つ。これにより、特定の範囲が明確なタスクの委任先を、メインのチャットより安いモデルに向けられる。

コーディングセッションで有用な二つの役割を、どちらも Haiku で構成する。

**`.cursor/agents/explore.md`**
```markdown
---
name: explore
description: Searches and reads the codebase to answer questions about existing code. Use proactively before implementing anything unfamiliar.
model: anthropic/claude-haiku-4-5
readonly: true
---

You are a fast, read-only research agent. Find and summarize relevant
files, functions, and patterns. Never edit files or run mutating commands.
```

**`.cursor/agents/test-runner.md`**
```markdown
---
name: test-runner
description: Runs the test suite and reports pass/fail results with failure details. Use proactively after any code change.
model: anthropic/claude-haiku-4-5
---

You run the project's test command, capture output, and report which
tests passed or failed and why. Do not modify source files.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/subagents.mp4" type="video/mp4">
  </video>
  <figcaption>explore と test-runner の二つのサブエージェントを作成する。どちらも anthropic/claude-haiku-4-5 を使用。</figcaption>
</figure>

`explore` の `readonly: true` はファイル編集と状態を変更するシェルコマンドをブロックする。純粋な研究役にはこれが合っている。`test-runner` はテストコマンドを実際に実行する必要があるため、この制限は付けず、代わりに指示の中でソースファイルに触れないよう指定している。

チャットでサブエージェントを起動する方法は二つある。自動委任では、メインエージェントが `description` フィールドを読み、いつ委任するかを自分で判断する。もう一つは `/explore` や `/test-runner` による明示的な呼び出しだ。

これらのファイルを、自分でターミナルから書く代わりにチャットでエージェントに書かせた場合、サイドバーに依然としてサブエージェントが表示されないなら、ウィンドウをリロードする（**Ctrl+Shift+P → "Reload Window"**）。Cursor は常にライブで `.cursor/agents/` を再スキャンするわけではない。

## ステップ 4：実際の機能を実装するところを見る

プロバイダー、モデル、サブエージェントがそろえば、Sonnet 5 は調査、実装、検証まで含む実際のコーディングセッションを最初から最後まで実行できる。コストの低いステップは途中で Haiku に委任しながらだ。

対象には [httpie](https://github.com/httpie/httpie) を使った。実在する、規模もほどよく、テストも整った OSS プロジェクトだ。httpie の `--meta`/`-m` フラグはリクエストの経過時間を表示するが、リダイレクトをたどった後に実際に到達した URL はまだ表示しない。これは小さく、範囲が明確で、実際に役立つ機能であり、手を付ける前に既存のコードをひと目見る必要があるタイプのタスクだ。

Cursor の Agent モードで `anthropic/claude-sonnet-5` を選択した状態で使ったプロンプト。

> Add the effective URL (the URL actually reached after following any redirects) to HTTPie's `--meta` output, next to the existing elapsed time. Look at how elapsed time is computed and displayed first, then add a test that confirms it works for both a redirected and a non-redirected request.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/demo-httpie.mp4" type="video/mp4">
  </video>
  <figcaption>Sonnet 5 が調査を explore サブエージェントに委任し、自分で変更を実装し、検証を test-runner に委任する。すべて Token Station 経由。</figcaption>
</figure>

このようなセッションの最中に [Token Station のダッシュボード](https://models.bytefuture.ai/dashboard)を見てみるとよい。プランニングと実装のステップには `anthropic/claude-sonnet-5` が、`explore` と `test-runner` への委任には `anthropic/claude-haiku-4-5` が、それぞれ別々に課金される。コスト階層は設定しただけでなく、実際に機能している。

## 今できること

Chat モードと Agent モードのどちらでも、Sonnet 5 と Haiku は Token Station 経由で Cursor の中で使える。実際の返信、実際のファイル編集があり、正しく Token Station のキーに課金され、ダッシュボードにも表示される。上で示したサブエージェントの委任も含めてだ。

ただし、すべてのモデルファミリーがまだこうというわけではない。以前 Token Station の GPT-5.6 ルート(Sol、Terra、Luna)をテストしたところ、Agent モードでコードを読み議論することはできたが、実際のファイル編集を適用することには一貫して失敗した。これは Cursor 側の硬い制限ではなく、Token Station 側のツール呼び出しレスポンス形式の問題だった。これらのルートへの対応は現在進行中だ。今すぐ Cursor で確実にファイルを編集できるコーディングエージェントが必要なら、GPT-5.6 系ではなく `anthropic/claude-sonnet-5` と `anthropic/claude-haiku-4-5` を使ってほしい。

Token Station の xAI ルート `xai/grok-4.6` も、同じカスタムプロバイダーの設定で Cursor から使える。メインのコーディング役に Grok を試したい場合はこちらだ。

## はじめよう

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録する。1 ドル分の無料クレジット、クレジットカード不要。初回チャージで最大 50 ドルのボーナスも付く。キーをエクスポートし、Cursor の Models 設定に接続し、二つのルートを追加しよう。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
