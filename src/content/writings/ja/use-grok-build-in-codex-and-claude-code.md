---
slug: "use-grok-build-in-codex-and-claude-code"
lang: "ja"
title: "Codex と Claude Code で Grok Build を使う方法"
summary: "xAI の Grok Build モデルは進化が速く、価格は GPT-5.5 や Claude Fable 5 のほんの一部。Token Station の無料クレジットで Claude Code や Codex 内で動かせる。xAI アカウントは不要。"
category: "tutorial"
date: "2026-06-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/use-grok-build-in-codex-and-claude-code-cover.png"
draft: false
---

<p>Grok Build は xAI のコーディング<strong>モデル</strong>です。<code>grok-build-0.1</code> という名前で、<a href="https://docs.x.ai/docs/models/grok-build-0.1">モデルカード</a>に詳細があります。同名の xAI のコーディングツール <em>Grok Build CLI</em> と混同しないでください。この記事で扱うのはモデルのほうです。進化が速く、リリースのたびに実際のコーディング作業で目に見えて性能が上がっています。価格は<strong>入力 100 万トークンあたり 1 ドル、出力 100 万トークンあたり 2 ドル</strong>で、GPT-5.5 や Claude Fable 5 のようなフロンティアのフラッグシップのごく一部のコストです。</p>

<p>急速に改善していて、しかも価格はごく一部。まさに試す価値のあるモデルです。とはいえ、モデルを試すためだけにツールを乗り換えたい人はほとんどいません。xAI の答えは自社の Grok Build CLI ですが、多くの開発者は普段から使っているツール、つまり <strong>Claude Code</strong> や <strong>Codex</strong> にそのモデルを差し込みたいと考えます。そこで問題が始まります。どちらも xAI の API と直接やり取りできないのです。問題は API の形だけにとどまりません。たとえば Codex は、xAI のエンドポイントが認識しない組み込みのツール名やパラメータを付けてツール呼び出しを送るため、モデルがプロンプトを見る前にリクエストが失敗します。</p>

<p><a href="https://models.bytefuture.ai/signup">Token Station</a> はあなたのコーディングエージェントと xAI の間に入り、4 つの形でこのギャップを埋めます。</p>

<ul>
<li><strong>Grok Build に使える無料クレジット。</strong>登録時にもらえる 1 ドルは Grok Build に使えます。カード不要、サブスク不要。</li>
<li><strong>xAI アカウント不要。</strong>別途 xAI アカウントを作成して入金する手間が省けます。Token Station のキー 1 つで足ります。</li>
<li><strong>Claude Code：API の変換。</strong>Claude Code は Anthropic の Messages API を話します。Token Station はそれらのリクエストを xAI のエンドポイントが期待する形に変換し、レスポンスを元に戻します。</li>
<li><strong>Codex：ツール名とパラメータ名の変換。</strong>Codex の組み込みツール呼び出しは、xAI が認識しない名前やパラメータを使います。Token Station は双方向でそれらを書き換え、ツール呼び出しが実際に動くようにします。</li>
</ul>

<p>自分で何かにパッチを当てることなく、Grok Build を Codex や Claude Code で動かせます。このチュートリアルでは両方のセットアップを扱います。所要時間はそれぞれ約 2 分です。</p>

<h2 id="what-you-need">必要なもの</h2>

<ul>
<li>Token Station アカウント（<a href="https://models.bytefuture.ai/signup">無料登録</a>。1 ドル分のクレジットがもらえ、カードは不要）</li>
<li>Token Station の API キー（<code>gw-</code> で始まる）</li>
<li>Claude Code または Codex がインストール済みであること</li>
</ul>

<h2 id="claude-code-setup">Claude Code のセットアップ</h2>

<p>Claude Code は設定を環境変数から読み取ります。すべてのモデルスロットを Token Station 経由で Grok Build にルーティングするには、起動前に次を設定します。</p>

<pre><code># Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

# Route every Claude Code model slot to Grok Build
export ANTHROPIC_DEFAULT_OPUS_MODEL="xai/grok-build-0.1"
export ANTHROPIC_DEFAULT_SONNET_MODEL="xai/grok-build-0.1"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="xai/grok-build-0.1"
export CLAUDE_CODE_SUBAGENT_MODEL="xai/grok-build-0.1"

# Launch
claude --model "xai/grok-build-0.1"</code></pre>

<figure><img src="claude-code-grok-build.png" alt="Claude Code terminal showing Grok Build model xai/grok-build-0.1 running and responding to prompts"><figcaption>Token Station を通じて Grok Build を動かす Claude Code。モデルが xai/grok-build-0.1 で動作していることを確認しています。</figcaption></figure>

<p>セットアップはこれで全部です。Claude Code はすべてのリクエストを Token Station 経由で送り、Token Station がそれを xAI のエンドポイント向けに変換します。ツール呼び出し、ストリーミング、複数ターンの会話、すべて動作します。</p>

<h3>各環境変数の役割</h3>

<table>
<tr><th>変数</th><th>役割</th></tr>
<tr><td><code>ANTHROPIC_BASE_URL</code></td><td>Claude Code を Anthropic の API ではなく Token Station に向ける</td></tr>
<tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td>あなたの Token Station API キー</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>Opus モデルスロットを Grok Build に置き換える</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>Sonnet モデルスロットを Grok Build に置き換える</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>Haiku モデルスロットを Grok Build に置き換える</td></tr>
<tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>サブエージェントの呼び出しも Grok Build にルーティングする</td></tr>
</table>

<p>組み合わせは自由です。たとえばメインモデルは Sonnet のままにして、コスト削減のためにサブエージェントだけ Grok Build にルーティングすることもできます。</p>

<h2 id="codex-setup">Codex のセットアップ</h2>

<p>Codex は TOML の設定ファイルを使います。2 つのコマンドで作成できます。</p>

<pre><code>mkdir -p ~/.codex
cat > ~/.codex/config.toml &lt;&lt;'EOF'
model = "xai/grok-build-0.1"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

<p>続いて API キーを設定して起動します。</p>

<pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

<figure><img src="codex-grok-build.png" alt="OpenAI Codex terminal showing model set to xai/grok-build-0.1 via Token Station"><figcaption>Token Station を通じて Grok Build を動かす Codex。model フィールドが xai/grok-build-0.1 が有効であることを示しています。</figcaption></figure>

<p>これで Codex はすべてのリクエストで Grok Build を使います。Token Station が API の変換を処理します。これには、なければ Codex が xAI に直接つなぐと失敗してしまうツール名・パラメータ名の書き換えも含まれます。</p>

<h2 id="why-you-need-a-gateway">なぜここでゲートウェイが必要なのか</h2>

<p>こう思うかもしれません。Codex を xAI の API に直接向ければいいのでは、と。</p>

<p>理由は 2 つあります。</p>

<ol>
<li><strong>API の形の不一致。</strong>Claude Code は Anthropic の Messages API を話し、Codex は OpenAI の Responses API 形式でリクエストを送ります。xAI のエンドポイントは、どちらとも異なる構造を期待します。Token Station は両方を変換します。リクエストは入り、レスポンスは出ていきます。</li>
<li><strong>ツール名とパラメータ名の変換。</strong>Codex は xAI が認識しない名前やパラメータで組み込みツール呼び出しを送ります。Token Station はそれらを書き換え、モデルが実際にツールを使えるようにします。これがないと、Codex のツール呼び出しは黙って失敗するか、エラーになります。</li>
</ol>

<p>これは机上の問題ではありません。Codex を Grok Build に直接つなごうとした開発者は、最初のツール呼び出しで意味不明なエラーにぶつかります。</p>

<h2 id="try-it">試してみる</h2>

<p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> で登録すると、1 ドル分の無料クレジットがもらえます。カード不要、サブスク不要、作成・入金が必要な xAI アカウントも不要です。初回チャージでは最大 50 ドルのボーナスクレジットが上乗せされます。この無料クレジットは、Grok Build、GPT-5.5、Claude、Gemini をはじめ 200 以上を含む、プラットフォーム上のすべてのモデルで使えます。さらに Grok Build はトークンあたりの価格がフロンティアのフラッグシップのごく一部なので、このクレジットは長く持ちます。</p>

<p>設定は 2 分。あとは Grok Build でコーディングするだけです。もし Grok Build が合わなくても、1 ドルのクレジットはプラットフォーム上の他のすべてのモデルでも使えます。</p>
