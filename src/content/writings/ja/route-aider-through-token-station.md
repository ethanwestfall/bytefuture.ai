---
slug: "route-aider-through-token-station"
lang: "ja"
title: "Aider を Token Station に接続する：GPT-5.6 Sol と Luna"
summary: "Aider は任意の OpenAI 互換エンドポイントに対応する、ターミナルベースのオープンソースコーディングエージェントだ。Token Station を指定すれば、その architect/editor モードが計画と編集を本当に二つの異なるモデルへ分担させることを、Token Station 自身の利用ログで確認できる。途中にはいくつか本物の落とし穴もあった:Python バージョンによるインストールの罠、二重の openai/ プレフィックス、そしてテスト結果を確認せず断言するだけの architect。"
category: "tutorial"
date: "2026-10-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-aider-through-token-station-cover.png"
draft: false
---

[Aider](https://aider.chat) はオープンソースの、ターミナルベースの AI ペアプログラミングツールだ。デスクトップアプリもなく、IDE プラグインもない。ローカルの git リポジトリ内のファイルを編集し、進めながらコミットしていく CLI があるだけだ。このシリーズの他のツールと同様、任意の OpenAI 互換カスタムエンドポイントに対応しているので、Token Station を指定すれば OpenAI の GPT-5.6 ファミリーを選択可能なモデルとして追加でき、すべて自分の Token Station キーで課金される。

この記事を独立して書く価値がある理由はこうだ。Aider には組み込みの **architect/editor モード**があり、一方のモデルが変更内容を自然言語で計画し、もう一方のモデルがその計画を実際の diff に変換する。これは Hermes の記事で扱ったサブエージェント委任とは違う分担の仕方であり、別途確認する価値がある。「ドキュメントには二つのモデルを設定できると書いてある」ことと「二つ目のモデルが実際に課金され、実際に作業をこなしている」ことは、同じ主張ではないからだ。

設定に入る前に、プロバイダーに直接課金するのではなく Token Station を経由してルーティングする、他のツールと同じ理屈がここにも当てはまる。コストの可視性(すべてのリクエストがプロバイダーの実際のレートでマークアップなしに課金され、自分のダッシュボードに表示される)と一元管理(同じキーと同じモデル ID が使っているすべてのツールで使える。Aider も例外ではない)だ。

## 始める前に必要なもの

- Aider のインストール:`pip install aider-chat`。実際にぶつかる前に知っておく価値がある落とし穴が一つある。非常に新しい Python(この記事を書いている時点では 3.14)では、pip が黙って古い `aider-chat` のリリースを解決してしまうことがあり、それは 2023 年当時の依存関係に固定されていてビルドに失敗する。Python 3.12 の仮想環境を使えば完全に回避できる。具体的な失敗の様子は下の「知っておくべき癖」を参照。
- Token Station のアカウントと API キー。[models.bytefuture.ai](https://models.bytefuture.ai) から無料登録できる。クレジットカードは不要。

## ステップ 1:Aider をインストールし、Token Station に接続する

Python 3.12 の仮想環境を有効にした状態で、Aider をインストールし、プロジェクトを用意し、Token Station の OpenAI 互換エンドポイントを指定する。

```
pip install aider-chat
mkdir aider-demo
cd aider-demo
git init
```

```powershell
$env:OPENAI_API_BASE = "https://models.bytefuture.ai/v1"
$env:OPENAI_API_KEY  = "gw-YOUR_TOKEN_STATION_KEY"
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/setup-aider.mp4" type="video/mp4">
  </video>
  <figcaption>Aider を Python 3.12 の仮想環境にインストールし、プロジェクトを作成し、git init を実行し、OPENAI_API_BASE と OPENAI_API_KEY を設定する(キーは画面上でマスクしてある)。最後に行う動作確認の起動、--model フラグなしの素の aider は、Aider 自身に組み込まれたデフォルト("Main model: gpt-4o with diff edit format, Weak model: gpt-4o-mini")で始まり、まだ Token Station には接続していない。モデルの選択は次のステップで行う。</figcaption>
</figure>

## ステップ 2:接続が実際に機能しているか確認する

Aider はすべての呼び出しを [litellm](https://github.com/BerriAI/litellm) 経由でルーティングする。`--model` に付けた `openai/` プレフィックスは、`OPENAI_API_BASE` が指す先に OpenAI 互換プロトコルで話すよう指示するもので、litellm はそのプレフィックスより後ろの文字列をそのまま model フィールドとして渡す。Token Station 自身のモデル ID にはすでにベンダープレフィックスが付いている(`openai/gpt-5.6-sol`)ため、完全な引数は二重プレフィックスになる:`openai/openai/gpt-5.6-sol`。誤字のように見えるが、そうではない。Aider 自身のドキュメントが、外側の `openai/` より後ろの文字列はそのままエンドポイントへ渡されると確認しており、内側の `openai/` は単に Token Station のモデル ID の一部であって、掃除すべき誤りではない。

```
aider --model openai/openai/gpt-5.6-sol
```

プロンプトに入力:`say hello and tell me what model you are`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/connectivity-test.mp4" type="video/mp4">
  </video>
  <figcaption>--model openai/openai/gpt-5.6-sol で Aider を起動する。Aider はこの二重プレフィックスの名前をローカルで認識できないと警告する("Unknown context window size and costs, using sane defaults")が、これは無害で、Aider のローカルなコスト見積もり表についての警告であり、呼び出しが成功するかどうかとは関係がない。モデルの返答:"Hello! I'm ChatGPT, an AI language model created by OpenAI. No code changes are needed."</figcaption>
</figure>

正直に言っておくべきことがある。この返答は汎用的な、テンプレート化された自己紹介だ。Sol だと具体的に名乗っているわけではないので、これだけでは `gpt-5.6-sol` がリクエストを処理したという証拠にはならない。Aider が表示するトークン集計(609 sent, 23 received)、そしてより説得力のある Token Station 自身のリクエストログこそが、どのモデルが応答したかを実際に確認するものであり、モデル自身の自己申告ではない。

## ステップ 3:実際のツール呼び出しを確認する

チャットで返信できるモデルと、動くファイルを実際に書けるモデルは同じではない。新しいセッションを開き、同じモデルで、何か実在するものを作る必要があるタスクを与える。

```
aider --model openai/openai/gpt-5.6-sol
```

プロンプト:`Create temperature_converter.py with a function celsius_to_farenheit(c) that converts Celsius to Fahrenheit, plus a --main-- block that converts 100 and prints the result.`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/tool-use-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol が temperature_converter.py を書く:celsius_to_farenheit 関数と、100°C の変換結果を表示する __main__ ブロック。Aider は diff を表示し、ファイルを作成するか尋ね、適用し、自動でコミットする("Commit 7cea5c4 feat: add Celsius-to-Fahrenheit temperature converter")。この動画は書き込みとコミットまでを示している。実際にコードが動かされ、検証されるのは次のステップ、本物のテスト実行を通してだ。</figcaption>
</figure>

```python
def celsius_to_farenheit(c):
    return (c * 9 / 5) + 32


if __name__ == "__main__":
    print(celsius_to_farenheit(100))
```

(関数名の誤字はプロンプト自体に由来するもので、Sol が持ち込んだものではない。次のステップで、Aider の architect モードが実際に壊れたファイルをどう扱うかがまったく違ってくるので、覚えておく価値がある。)

## ステップ 4:architect と editor を二つのモデルに分担させる

Aider の architect/editor モードは、計画を一方のモデルへ、実際の編集をもう一方のモデルへ送る。それぞれ独立して設定できる。

```
aider --architect --model openai/openai/gpt-5.6-sol --editor-model openai/openai/gpt-5.6-luna
```

| Model | Cost (input/output per M) | Role in this setup |
|---|---|---|
| `openai/gpt-5.6-sol` | $5 / $30 | Architect:ファイルを読み、自然言語で変更を計画する。 |
| `openai/gpt-5.6-luna` | $1 / $6 | Editor:その計画を実際の diff に変換する。 |

プロンプト:`Add input validation to celsius_to_fahrenheit so it raises ValueError on non-numeric input, then write test_temperature_converter.py with three cases: a normal conversion, 0, and a non-numeric input that should raise ValueError.`

前のステップを録画してからこのステップまでの間に、`temperature_converter.py` に本物のアクシデントが起きた。間違った場所で入力されたコマンドがファイルをその文字列自体で上書きしてしまい、ファイルの中身は文字どおり一行、`python temperature_converter.py` だけになっていた。これは不注意で残ってしまったものだが、残しておく価値がある。Sol はこのファイルを読み、その一行を「有効な Python のソースではない」と正しく見抜き、ゴミにパッチを当てるのではなく、きれいに書き直したからだ。

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/architect-editor-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol(architect)がファイルを読み、紛れ込んだ一行を無効だと指摘し、Luna(editor)に正確な指示を渡す:isinstance(celsius, Real) で検証し、失敗したら raise ValueError("celsius must be numeric")、celsius * 9 / 5 + 32 を返す、さらに test_temperature_converter.py 向けの pytest ケースを三つ。Luna が修正を適用し、Aider が自動でコミットする("Commit 105d10f feat: add validated Celsius-to-Fahrenheit conversion")。続けて Sol は "I can't execute shell commands in this environment... the tests should pass: 3 passed" と言う。これは結果を確認しているのではなく、断言しているだけだ。終了して python -m pytest test_temperature_converter.py -v を手動で実行すると、本当の答えが得られる:3 passed in 0.03s。動画の最後は Token Station のダッシュボードで終わり、gpt-5.6-sol と gpt-5.6-luna のリクエストが同じセッションの中で交互に現れている様子が映る。</figcaption>
</figure>

```python
from numbers import Real


def celsius_to_fahrenheit(celsius):
    if not isinstance(celsius, Real):
        raise ValueError("celsius must be numeric")
    return celsius * 9 / 5 + 32
```

```python
import pytest
from temperature_converter import celsius_to_fahrenheit


def test_normal_conversion():
    assert celsius_to_fahrenheit(25) == 77


def test_zero_celsius():
    assert celsius_to_fahrenheit(0) == 32


def test_non_numeric_input():
    with pytest.raises(ValueError):
        celsius_to_fahrenheit("not a number")
```

知っておく価値があること:Hermes の記事とは違い、あちらではエージェントが自分でコマンドを実行し、実際の出力を報告していたが、Aider の architect/editor ループはデフォルトでは何も実行しない。確認するのではなく、断言するだけだ。Aider にはセッション内部からシェルコマンドを実行する方法、`/run <command>` があり、これを使えばチャットを離れずにテストを実行できる。ただしモデル自身はデフォルトでそれを自分から使おうとはしない。

この分担が本当に二つのモデルを使っていたことの証拠:Token Station の Usage ページ、このセッションが動いていた数分間のリクエスト履歴だ。

<figure>
  <img src="/blog/route-aider-through-token-station/usage-sol-luna-interleaved.jpg" alt="Token Station Usage page request history showing openai/gpt-5.6-sol and openai/gpt-5.6-luna requests interleaved within the same two-minute window" />
  <figcaption>同じセッションの Token Station のリクエスト履歴:01:11:28 から 01:12:13 までの五つのリクエストで、gpt-5.6-sol と gpt-5.6-luna が交互に現れ、それぞれ個別に課金されている(Luna の小さな呼び出し一件の $0.000235 から、Sol の大きな呼び出し一件の $0.006252 まで)。</figcaption>
</figure>

## 今できること

Aider を Token Station に汎用の OpenAI 互換エンドポイントとして接続することはうまくいき、二重の `openai/` プレフィックスが、分かりにくいエラーで発見するよりも前もって知っておく価値のある唯一の構文のポイントだ。実際のツール呼び出し、つまり実在するファイルを書いてコミットすることは、`openai/gpt-5.6-sol` で確認されている。Architect/editor モードは本当に作業を二つのモデルへ分担させている:Sol が計画し、Luna が編集する。これは Aider 自身が表示する "Editor model:" という起動時の表示と、Token Station のダッシュボードで両方のモデルが同じセッション内で別々に課金されていることの両方で確認できる。

## 知っておくべき癖

- **非常に新しい Python がインストールを壊すことがある。** Python 3.14 では、pip が `aider-chat` を古い 0.16.0 リリースまで解決してしまい、それは 2023 年当時の依存関係に固定されていた(`numpy==1.24.3`、`aiohttp==3.8.4`)。その古い numpy をソースからビルドしようとすると、そのまま失敗した。Python 3.12 の仮想環境なら、現行リリースをきれいにインストールできる。
- **モデルの引数は二重プレフィックスになっている。** `openai/` は Aider の litellm 層に、`OPENAI_API_BASE` へ OpenAI 互換プロトコルで話すよう指示するもので、それ以降の文字列はそのまま渡される。Token Station 自身のモデル ID がすでにベンダー名で始まっているため、完全な引数は冗長に見える(`openai/openai/gpt-5.6-sol`)が、これが正しい。
- **モデルが自分の名前を名乗っても、それは何も証明しない。** 何のモデルかと尋ねると、Sol は汎用的な「I'm ChatGPT」という自己紹介で答え、モデルを特定する答えではなかった。実際にどのモデルが動いているかを本当に確認できるのは、Token Station 自身のリクエストログであって、モデルの自己申告ではない。
- **Aider のプロンプトでシェルコマンドを入力しても、それは実行されない。** `architect>` プロンプトが送るのはチャットメッセージであって、ターミナルコマンドではない。そこで `pip install pytest` と入力しても、話題にされるだけで実行はされない。セッション内部で実際に何かを実行するには `/run <command>` を使うか、別のターミナルを開く。
- **Architect/editor モードは自分で検証しない。** Sol は "the tests should pass: 3 passed" と断言したが、何も実行してはいなかった。それを確認するには、その後に実際の `pytest` 実行が必要だった。

## はじめよう

[models.bytefuture.ai](https://models.bytefuture.ai/signup) で登録する。クレジットカードは不要で、初回チャージで最大 50 ドルまでの 100% マッチボーナスが付く。キーをエクスポートし、`OPENAI_API_BASE` と `OPENAI_API_KEY` を設定し、`--model` を試したい Token Station のモデルに向けよう。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
