---
slug: "route-hermes-agent-through-token-station"
lang: "ja"
title: "Hermes Agent を Token Station に接続する：GPT-5.6 Sol と Luna"
summary: "Hermes Agent（Nous Research）は任意の OpenAI 互換カスタムエンドポイントに対応している。Token Station を指定すれば OpenAI の GPT-5.6 ファミリーが選択可能なモデルとして現れ、実際のツール呼び出しと、本当に機能する委任の設定まで確認できる。フロンティアモデルが計画を立て、安価なモデルが実行し、両方が同じ Token Station キーでそれぞれ課金される。"
category: "tutorial"
date: "2026-09-23"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-hermes-agent-through-token-station-cover.png"
draft: false
---

[Hermes Agent](https://hermes-agent.nousresearch.com/docs) は Nous Research のオープンソースの自律エージェントだ。デスクトップアプリと CLI/TUI で構成され、IDE プラグインではない。永続的なメモリ、スキルシステム、そして本物のサブエージェント委任を備えている。このシリーズの他のツールと同様、任意の OpenAI 互換カスタムエンドポイントに対応しているので、Token Station を指定すれば OpenAI の GPT-5.6 ファミリー(Sol、Terra、Luna)を選択可能なモデルとして追加でき、すべて自分の Token Station キーで課金される。

この記事を独立して書く価値がある理由はこうだ。Hermes の委任機能は、サブエージェントを親の会話とは違うモデルで実際に動かせる。これはどこでも成り立つ話ではない。Cursor シリーズでは、Cursor のサブエージェントの `model:` フィールドが有効な、文書化された構文でありながら実質的には何もしていないことを書かざるを得なかった。何を指定してもすべてのサブエージェントは黙って親の会話のモデルで動く。Hermes の `delegation.model` と `delegation.provider` の設定は、委任した作業を実際に別のモデルへルーティングする。これは以下で、両方のモデルが Token Station 自身のダッシュボードで別々に課金されて表示されることで確認する。

設定に入る前に、プロバイダーに直接課金するのではなく Token Station を経由してルーティングする、他のツールと同じ理屈がここにも当てはまる。コストの可視性(すべてのリクエストがプロバイダーの実際のレートでマークアップなしに課金され、自分のダッシュボードに表示される)と一元管理(同じキーと同じモデル ID が使っているすべてのツールで使える。Hermes も例外ではなく、ツールごとに別々のキーや請求を用意する必要がない)だ。

## 始める前に必要なもの

- Hermes Agent がインストール済みであること。デスクトップアプリは [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com) から、CLI のみのインストールは `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`(Linux/macOS/WSL2)または `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`(Windows PowerShell)。
- Token Station のアカウントと API キー。[models.bytefuture.ai](https://models.bytefuture.ai) から無料登録できる。クレジットカードは不要。

## ステップ 1：Token Station をカスタムエンドポイントとして登録する

Hermes のデスクトップアプリで **Settings → Providers → Custom Endpoints** を開き、**+ Add Endpoint** をクリックする。

- **Name**：`Token Station`
- **Provider ID**：`token-station`
- **Endpoint URL**：`https://models.bytefuture.ai/v1`
- **Default Model**：`openai/gpt-5.6-sol`
- **Context**：`1050000`(Token Station 上での Sol の実際のコンテキストウィンドウ。実際に何に解決されるか確認せずに "Auto" のままにしないこと)
- **API Key**：自分の Token Station キー
- **Use for new chats** と **Discover models** はチェックを入れたままにする

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-hermes-agent-through-token-station/register-endpoint.mp4" type="video/mp4">
  </video>
  <figcaption>Hermes のデスクトップ版の Settings で、Token Station をカスタム OpenAI 互換エンドポイントとして登録し、確認してから最初のメッセージを送る。手順:Settings → Providers → Custom Endpoints → Add Endpoint を開く。Name、Provider ID、Endpoint URL、Default Model、Context、API Key を入力する。Test をクリックする(返ってくるのは "Endpoint is reachable. Found 14 models.")。Save をクリックする。エンドポイントが Custom Endpoints のリストで Active と表示される。新しいセッションを開き、モデルピッカーの Token Station セクションから openai/gpt-5.6-sol を選び、他愛のないメッセージ("say hello")を送って実際の返信が返ってくることを確認する。</figcaption>
</figure>

**Save** の前に **Test** をクリックする。**Discover models** をオンにしていれば、正しく動作するエンドポイントはキーが見られるすべてのモデルを返す。確認メッセージは "Endpoint is reachable. Found 14 models." だった。保存すると、モデルピッカーの "TOKEN STATION" セクションに全カタログが並ぶ。Sol と Luna も含まれており、二つ目のエンドポイントは不要だ。

緑色の Test の結果だけで満足しないこと。新しいセッションを開いて実際に `openai/gpt-5.6-sol` を選び、他愛のないメッセージを送る。実際の返信こそが、キーと URL とモデル名がすべてエンドツーエンドで正しいことの唯一の証拠だ。

## ステップ 2：実際のツール呼び出しを確認する(チャットだけでなく)

チャットで返信できるモデルと、実際に行動できるモデルは同じではない。CLI(ターミナルで `hermes`)に切り替え、実際にファイルを書く必要があるタスクを与える。

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-hermes-agent-through-token-station/tool-use-demo.mp4" type="video/mp4">
  </video>
  <figcaption>openai/gpt-5.6-sol が実際に行動を取れる(単に説明するだけではない)ことを確認する。手順:ターミナルで hermes を起動する。モデルピッカーを開く(発見された 14 個の Token Station モデルすべてを完全な provider/model ID で一覧表示する)。openai/gpt-5.6-sol を選択すると "Model switched: openai/gpt-5.6-sol, Provider: token-station, Context: 1,050,000 tokens, Reasoning effort: medium" で確認される。インチをセンチメートルに変換するスクリプト unit_conversion.py を作るよう指示する。計画を立ててファイルを書き、実際のターミナルで実行する様子を見る(printf '10\n' | python unit_conversion.py)。"Created and verified... Test run with 10 inches produced 25.4 centimeters." と報告してくる。同じリクエストは Token Station のダッシュボードで openai/gpt-5.6-sol に課金されたものとして表示される。</figcaption>
</figure>

これは Cursor+OpenAI の記事で修正が入る前に陥っていたのと同じ落とし穴だ。コードを読んで議論することと、実際に編集することは同じではない。今回は修正が必要なかった。Sol は `unit_conversion.py` を書き、`printf '10\n' | python C:\Users\ethan\unit_conversion.py` を実行し、コードが何をすべきかを説明するのではなく、実際の出力("Test run with 10 inches produced 25.4 centimeters")を報告した。

## ステップ 3：委任先を安価なモデルに向ける

Hermes の委任されたサブタスクは、`delegation.model` と `delegation.provider` で設定することで、親の会話とは別のモデルで動かせる。Hermes は自前のターミナルツールを持っているので、チャットセッションから Hermes 自身にこのコマンドを実行させる形で設定できる。

```
hermes config set delegation.model openai/gpt-5.6-luna
hermes config set delegation.provider token-station
```

Hermes は両方を確認した:"Set and verified: delegation.model = openai/gpt-5.6-luna" と "Set and verified: delegation.provider = token-station"。確認メッセージの文面だけを信じるのではなく、もう一度確かめておく価値がある。

```
hermes config get delegation.model
hermes config get delegation.provider
```

| Model | Cost (input/output per M) | Role in this setup |
|---|---|---|
| `openai/gpt-5.6-sol` | $5 / $30 | メインエージェント:作業を計画し、範囲を絞ったサブタスクを委任する。 |
| `openai/gpt-5.6-luna` | $1 / $6 | 委任される側のワーカー:渡された、範囲の明確な作業を実行する。 |
| `openai/gpt-5.6-terra` | $2.50 / $15 | 同じエンドポイントで利用可能だが、このデモでは使っていない。 |

## ステップ 4：委任が実際に安価なモデルに届いていることを確認する

ステップ 2 の時点で `unit_conversion.py` はすでにあるので、範囲の明確なサブタスクの委任が明らかに必要になるタスクを与える。

```
Add input validation to unit_conversion.py. Delegate to a subagent (via delegate_task) the job of writing three test cases covering negative numbers, zero, and non-numeric input, with context that the file lives at C:\Users\ethan\unit_conversion.py and takes inches, outputs centimeters. Once the subagent returns, incorporate its test cases into a new test_unit_conversion.py, then run it and report the results.
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-hermes-agent-through-token-station/delegation-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol が範囲の明確なサブタスクを Luna に委任し、その結果を取り込む。手順:delegation.model と delegation.provider を設定し(上記のとおり)、確認する。上のプロンプトを送る。Hermes はサブエージェントを起動し("preparing delegate_task... delegate 1x: Write three unit-test cases...")、それがバックグラウンドで動いている間も作業を続ける("Background task running, I'll resume when it finishes")。ライブのステータスバーがサブエージェントの進捗を追跡する。結果が返ってくると("Subagent Task Completed")、Sol は unit_conversion.py に入力検証を当て、委任されたテストケースを test_unit_conversion.py に書き込み、テストを実行する。最終結果は "Implemented and verified" で、追加した検証内容と、負の数・ゼロ・非数値入力をカバーする三つのテストケースが列挙される。</figcaption>
</figure>

Hermes は範囲が絞られ、それ自体で完結した指示でサブエージェントを起動した:"Write three unit-test cases for unit_conversion.py covering negative numbers, zero, and non-numeric input. Return the complete test code and briefly state the expected behavior for each case. Do not modify files."。Hermes のサブエージェントは親の会話履歴を一切受け取らないため、目的とコンテキストはそれ自体で完結している必要があるが、ここではそうなっていた。サブエージェントはテストを書き、Sol はそれを `test_unit_conversion.py` に組み込み、`unit_conversion.py` に実際の入力検証を追加し、テストを実行した。

委任が実際に二つ目のモデルを使ったことの証拠は、このセッションが動いていた数分間の Token Station の Usage ページのリクエスト履歴にある。

<figure>
  <img src="/blog/route-hermes-agent-through-token-station/usage-sol-luna-interleaved.png" alt="Token Station Usage page request history showing openai/gpt-5.6-sol and openai/gpt-5.6-luna requests interleaved within the same two-minute window" />
  <figcaption>同じセッションの Token Station のリクエスト履歴:openai/gpt-5.6-sol と openai/gpt-5.6-luna のリクエストが分単位で交互に現れ、それぞれ個別に課金されている。</figcaption>
</figure>

`openai/gpt-5.6-sol` と `openai/gpt-5.6-luna` のリクエストは、同じ数分間のログの中で交互に現れ、それぞれ独自のトークン数とコストを持つ。これは、フロンティアモデルが計画し安価なモデルが実行するというパターンが、文書上の主張ではなく実際に機能している証拠だ。

## 今できること

Hermes で Token Station をカスタム OpenAI 互換エンドポイントとして登録するのは、デスクトップアプリの Settings から可能で、一つのエンドポイントから全カタログが自動的に発見される。実際のツール呼び出し、つまり実際のファイルを書いて実行することは、単純なチャットの返信を超えて `openai/gpt-5.6-sol` で確認されている。同じ Token Station キーの下で、別の安価なモデルへの委任もエンドツーエンドで動作することが確認されている。`delegation.model` と `delegation.provider` は、`delegate_task` の呼び出しを実際に `openai/gpt-5.6-luna` にルーティングし、親の会話は `openai/gpt-5.6-sol` にとどまる。両方とも同じセッションの中で、Token Station のダッシュボード上に別々に課金されて表示される。

`openai/gpt-5.6-terra` も同じエンドポイント、同じ設定で利用できるが、この記事では特に試していない。

## はじめよう

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録する。クレジットカードは不要で、初回チャージで最大 50 ドルまでの 100% マッチボーナスが付く。キーをエクスポートし、Hermes にカスタムエンドポイントとして登録し、上記のルートを追加しよう。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
