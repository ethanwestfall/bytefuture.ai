---
slug: "route-cursor-through-token-station"
lang: "ja"
title: "Cursor を Token Station に接続する：GPT-5.6 の Sol、Terra、Luna"
summary: "Cursor は Settings の Models パネルからカスタム OpenAI 互換プロバイダーに対応している。Token Station を指定すれば Sol、Terra、Luna が選択可能なモデルとして現れるが、注意点が二つある。現行バージョンの入力欄のバグに対する Tab フォーカスの回避策と、Token Station のルートが実際に必要とする openai/ プレフィックスだ。"
category: "tutorial"
date: "2026-08-13"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-cursor-through-token-station-cover.png"
draft: false
---

Cursor は Settings → Models からカスタム OpenAI 互換プロバイダーに対応している。Token Station のエンドポイントを指定すれば、GPT-5.6 の三つの名前付きルート、Sol、Terra、Luna を選択可能なモデルとして追加でき、すべて自分の Token Station キーで課金される。ここでは設定を最初から最後まで説明する。実際にやってみて遭遇した二つの落とし穴、現行 Cursor の入力欄バグと、省略すると静かにリクエストが壊れるモデル命名の細部も含めて。

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

## ステップ 2：三つの GPT-5.6 ルートをカスタムモデルとして追加する

引き続き Models の設定で、**+ Add Custom Model** を三回クリックし、次を追加する。

```
openai/gpt-5.6-sol
openai/gpt-5.6-terra
openai/gpt-5.6-luna
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/add-models.mp4" type="video/mp4">
  </video>
  <figcaption>openai/gpt-5.6-sol、openai/gpt-5.6-terra、openai/gpt-5.6-luna をカスタムモデルとして追加する。</figcaption>
</figure>

**ここが落とし穴**：ここで登録した名前を、Cursor はそのままリクエストの `model` フィールドとして送信する。Token Station の実際のルート名には `openai/` プレフィックスが含まれる。プレフィックスなしの `gpt-5.6-sol` として登録すると、すべてのリクエストが `Model 'gpt-5.6-sol' not found` というエラーで失敗する。プレフィックスなしのそのモデルは実際に存在しないからだ。プレフィックス付きで登録すればすぐに動作する。

Cursor に受け付けられただけでなく実際にエンドツーエンドで動作していることを確認するには、チャットを開いて新しく追加したモデルのどれかを選び、適当なメッセージを送り、[Token Station のダッシュボード](https://models.bytefuture.ai/dashboard)を確認する。実際の返信があり、Recent Activity に対応する行が現れていれば、キー、ベース URL、モデル名のすべてが正しいということだ。

| モデル | 向いている用途 |
|---|---|
| `openai/gpt-5.6-sol` | フラッグシップルート。難しいプランニング、デバッグ、アーキテクチャに関する質問に。 |
| `openai/gpt-5.6-terra` | 中間ティア。反復的な実装やデバッグの相談に。 |
| `openai/gpt-5.6-luna` | 低コストルート。探索、トリアージ、ちょっとした質問に。 |

## ステップ 3：Luna を使うサブエージェントを定義する

Cursor はサブエージェントに対応している。YAML フロントマター付きの markdown ファイルで、プロジェクトごとに `.cursor/agents/` に置くか、グローバルに `~/.cursor/agents/` に置くことができ、それぞれが独自の `model` フィールドを持つ。これにより、特定の範囲が明確なタスクの委任先を、メインのチャットより安いモデルに向けられる。

コーディングセッションで有用な二つの役割を、どちらも Luna で構成する。

**`.cursor/agents/explore.md`**
```markdown
---
name: explore
description: Searches and reads the codebase to answer questions about existing code. Use proactively before implementing anything unfamiliar.
model: openai/gpt-5.6-luna
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
model: openai/gpt-5.6-luna
---

You run the project's test command, capture output, and report which
tests passed or failed and why. Do not modify source files.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-cursor-through-token-station/subagents.mp4" type="video/mp4">
  </video>
  <figcaption>explore と test-runner の二つのサブエージェントを作成する。どちらも openai/gpt-5.6-luna を使用。</figcaption>
</figure>

`explore` の `readonly: true` はファイル編集と状態を変更するシェルコマンドをブロックする。純粋な研究役にはこれが合っている。`test-runner` はテストコマンドを実際に実行する必要があるため、この制限は付けず、代わりに指示の中でソースファイルに触れないよう指定している。

チャットでサブエージェントを起動する方法は二つある。自動委任では、メインエージェントが `description` フィールドを読み、いつ委任するかを自分で判断する。もう一つは `/explore` や `/test-runner` による明示的な呼び出しだ。

これらのファイルを、自分でターミナルから書く代わりにチャットでエージェントに書かせた場合、サイドバーに依然としてサブエージェントが表示されないなら、ウィンドウをリロードする（**Ctrl+Shift+P → "Reload Window"**）。Cursor は常にライブで `.cursor/agents/` を再スキャンするわけではない。

## 今できること、まだできないこと

Chat モードと Ask モードで Sol、Terra、Luna を使う分には、上に書いた通り動作する。実際の返信があり、正しく Token Station のキーに課金され、ダッシュボードにも表示される。

一方、完全な Agent モードの自律性、つまりモデルが自分でコードベースを読み、変更を直接書き込む部分は話が別だ。私たちのテストでは、Override Base URL 経由で追加したカスタム OpenAI 互換モデルは、Agent モードでコードを読み議論することはできたが、どの Cursor モードを試しても実際のファイル編集を適用することは一貫してできなかった。これは同じ壁にぶつかっている他のユーザーの報告とも一致する。Cursor の Agent ツール呼び出しの仕組みは特定のリクエストとレスポンスの形を期待しており、標準的な OpenAI 互換エンドポイントが Cursor 自身がホストするモデルと同じようにその形を正しくやり取りできる保証はない。これは Token Station 固有の問題ではない。同じ `openai/gpt-5.6-*` ルートは、Codex ではすでに実際の agentic なツール呼び出しを動かしており、モデルやエンドポイント自体がここでのボトルネックではないからだ。

実際にファイルを編集できるエージェントがワークフローに必要なら、Token Station の Codex、Claude Code、OpenClaw との連携が現時点で実証済みの選択肢だ。Cursor の BYOK による Agent モード対応が追いつくまでは、Cursor はエディタの中で Sol、Terra、Luna とチャットし、コスト階層の異なるサブエージェントでチャットベースの委任を行うための、堅実な手段だと言える。

## はじめよう

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録する。1 ドル分の無料クレジット、クレジットカード不要。初回チャージで最大 50 ドルのボーナスも付く。キーをエクスポートし、Cursor の Models 設定に接続し、三つのルートを追加しよう。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
