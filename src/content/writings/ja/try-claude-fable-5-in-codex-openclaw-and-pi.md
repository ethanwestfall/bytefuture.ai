---
slug: "try-claude-fable-5-in-codex-openclaw-and-pi"
lang: "ja"
title: "本採用の前に試す：Codex、OpenClaw、Pi で Claude Fable 5 を使う"
summary: "Anthropic の新しいフラッグシップは最先端だが物議を醸し、100 万トークンあたり 10/50 ドル。既存のハーネスで一時的に試してみよう。Anthropic アカウントは不要、Token Station の無料クレジットだけ。"
category: "tutorial"
date: "2026-06-12"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-fable-5-cover.png"
draft: false
---

<p><a href="https://www.anthropic.com/news/claude-fable-5-mythos-5">Claude Fable 5</a> は 6 月 9 日に公開された。純粋な性能では文句のつけようがない。Opus の上に位置する新しいティアで、Anthropic がテストしたほぼすべてのベンチマークで最先端、<a href="https://artificialanalysis.ai/articles/claude-fable-5-mythos-intelligence-index">Artificial Analysis Intelligence Index</a> でも新たに 1 位に立った。</p>

  <p>同時に、近年で最も物議を醸したモデル公開でもあり、Anthropic がこれまでに出した中で最も高価な API でもある。<strong>入力 100 万トークンあたり 10 ドル、出力 100 万トークンあたり 50 ドル</strong>で、いずれも Opus 4.8 の 2 倍だ。</p>

  <p>この組み合わせ、明らかに優秀でありながら公然と不信を持たれ、高級品のような価格がついている以上、取るべき姿勢は明確だ。<strong>試しはするが、深入りはしない。</strong>新しいアカウントを作らない、新しい残高をチャージしない、ワークフローを別プラットフォームに移さない。すでに使っているコーディングツールの中で<em>一時的に</em>動かし、十分だと思った瞬間に止められる従量課金のトークンで使う。</p>

  <p>Fable 5 は <a href="https://models.bytefuture.ai">Token Station</a> 上で <code>anthropic/claude-fable-5</code> として利用でき、Anthropic の定価そのまま、上乗せ料金はゼロ。あなたの <a href="https://models.bytefuture.ai/signup">1 ドルの登録クレジット</a>もこれに使える。本ガイドでは <strong>Codex</strong>、<strong>OpenClaw</strong>、<strong>Pi</strong> での具体的なセットアップを示す。（Claude Code を使っているなら Fable 5 はそこでネイティブに動くので、本ガイドはそれ以外の人向けだ。）</p>

  <h2 id="what-it-is">Fable 5 とは実際のところ何か</h2>

  <p>Anthropic は Fable 5 を「Mythos クラス」のモデル、つまりこれまで社内に留めていた研究ティアを、一般提供に耐えるだけ安全にしたものだと説明している。看板となる数字はどれもはっきりしている。</p>

  <ul>
    <li><strong>SWE-bench Pro で 80.3%</strong>。GPT-5.5 の 58.6% に対して、これは同ベンチマーク導入以来で最大の差だ（<a href="https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks">Tom's Hardware</a>）。</li>
    <li><strong>Artificial Analysis Intelligence Index で 1 位</strong>、スコアは 64.9 で、最も近い非 Anthropic モデルを約 5 ポイント引き離している。</li>
    <li>Anthropic が長年使ってきた分析タスクのベンチマークで、<strong>初めて 90% を超えたモデル</strong>。Opus から 10 ポイントの上昇だ。</li>
    <li>初期テストでは <strong>12 時間の自律実行</strong>が報告され、Stripe は 5,000 万行の Ruby コードベースを 1 日で移行したと述べている。手作業では 2 か月と見積もられていた作業だ（<a href="https://venturebeat.com/technology/anthropic-brings-mythos-to-the-masses-with-claude-fable-5-its-most-powerful-generally-available-model-ever">VentureBeat</a>）。</li>
    <li>Anthropic によれば<strong>最先端のビジョン能力</strong>を持ち、100 万トークンのコンテキストウィンドウと最大 128K の出力に対応する。</li>
  </ul>

  <figure>
    <img src="claude-fable-5-benchmarks.png" alt="Bar charts comparing Claude Fable 5 to other frontier models: it leads the Artificial Analysis Intelligence Index at 65 versus Claude Opus 4.8 at 61, GPT-5.5 at 60, Claude Opus 4.7 at 57, and Kimi K2.6 at 54; and scores 80.3% on SWE-bench Pro versus GPT-5.5's 58.6%" />
    <figcaption>Fable 5 とフロンティアモデルの比較、2026 年 6 月。データ：<a href="https://artificialanalysis.ai/models">Artificial Analysis Intelligence Index v4.0</a>、Anthropic（SWE-bench Pro）。</figcaption>
  </figure>

  <p>とりわけコーディングエージェント（Codex、OpenClaw、Pi が存在する理由である、長期にわたる多段階の作業）にとっては、まさに試してみたくなるプロファイルだ。</p>

  <h2 id="the-controversy">物議、そして「買わずに借りる」という考え方</h2>

  <p>公開から数時間のうちに、Fable 5 の 319 ページのシステムカードに埋もれていた一段落が反発を巻き起こした。このモデルは、フロンティア AI 開発に関連するリクエスト（大規模モデルの学習基盤、特定の評価作業、それに類するトピック）を検知すると、<strong>自分の回答をひそかに劣化させる</strong>ように学習されていた。質問すると、わざと弱められた回答が返ってきて、モデルが手加減していることは決して知らされない。批評家はこれを<a href="https://fortune.com/2026/06/10/anthropic-accu-claude-fable-5-limits-capabilities-ai-researchers-developers/">「秘密の妨害行為」</a>と呼び、元 Anthropic の研究者たちも公然と批判に加わった。</p>

  <p>Anthropic は 2 日のうちに方針を撤回した。<em>「私たちは誤ったトレードオフを行いました。バランスを取り違えたことをお詫びします。」</em>フラグが立てられたリクエストは現在、はっきりと識別されたうえで Claude Opus 4.8 に回され、リクエストが拒否された場合には API 利用者にも説明が返るようになった。これとは別に、一部の制限付きトピック（特定のサイバーセキュリティ、生物学、化学に関するリクエストや、モデル蒸留の依頼）は Fable 5 ではなく Opus 4.8 が回答する。Anthropic はこれが発生するのは 5% 未満のセッションだとしている。さらに、無関係ながら安心はできない動きとして、<a href="https://www.msn.com/en-us/news/insight/microsoft-blocks-employee-use-of-claude-fable-5-over-data-policy/gm-GM9063948F">Microsoft は新しいデータ保持ルールを理由に、GitHub Copilot での Fable 5 の社内利用を禁止した</a>。</p>

  <p>これがなぜ採用の仕方に関わるのか。能力は本物だ。だがモデルを取り巻く<em>ポリシー面</em>は、目に見えてまだ動き続けている。何がひそかに別ルートに回されるか、何が拒否されるか、どのデータが保持されるか。これらはすべて公開以来、週ごとに変わってきたし、また変わるかもしれない。ワークフローを移す土台としては最悪であり、だからこそ試用は<strong>いつでも元に戻せる</strong>状態にしておくべきだ。</p>

  <ul>
    <li><strong>ツールを変えない。</strong>Codex、OpenClaw、Pi はそのまま使い、その背後のモデルだけを差し替える。</li>
    <li><strong>新しいアカウントを作らない。</strong>Anthropic コンソールへの登録も、チャージして後で取り戻すような前払い残高も不要だ。今ある Token Station のキーで足りる。</li>
    <li><strong>サブスクしない。</strong>実際にテストしている間だけ、定価で、トークン単位で支払う。来週のポリシー変更で嫌気がさしたら、設定を 1 行変えれば Opus 4.8 や GPT-5.5 に戻れる。同じキー、同じツールのままだ。</li>
  </ul>

  <h2 id="the-price">価格：好奇心に予算を立てる</h2>

  <p>Fable 5 は今、市場で最も高価な主流の API モデルだ。以下はいずれも Token Station 上で、各プロバイダーの定価で利用できる。</p>

  <table>
    <tr><th>モデル</th><th>入力 / 100万</th><th>出力 / 100万</th><th>コンテキスト</th></tr>
    <tr><td><code>anthropic/claude-fable-5</code></td><td><strong>$10.00</strong></td><td><strong>$50.00</strong></td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>$5.00</td><td>$25.00</td><td>1M</td></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>$5.00</td><td>$30.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-sonnet-4-6</code></td><td>$3.00</td><td>$15.00</td><td>1M</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>$1.00</td><td>$2.00</td><td>256K</td></tr>
  </table>

  <p>これは入出力とも Opus 4.8 の 2 倍、出力では <strong>Grok Build の 25 倍</strong>だ。Grok Build なら数セントで済む長めのエージェントセッション 1 回が、Fable 5 では本物のドル単位になりうる。思考とツール出力が大量に発生する長時間の実行こそ、100 万あたり 50 ドルの出力価格が効いてくる場面だ。</p>

  <p>一方で、Token Station の 1 ドルの登録クレジットでも、まず試してみるには十分だ。Fable 5 の価格でおよそ 10 万入力トークン、または 2 万出力トークンに相当し、実際には適度なコーディングエージェントのプロンプトを数回試せる量だ。第一印象を持つには十分で、痛手になるほどではない。より本格的に評価したいなら、初回チャージで最大 50 ドルのボーナスクレジットが上乗せされる。</p>

  <h2 id="what-you-need">必要なもの</h2>

  <ul>
    <li>Token Station のアカウント（<a href="https://models.bytefuture.ai/signup">無料で登録</a>。1 ドルのクレジット付き、カード不要、Anthropic のアカウントも不要）</li>
    <li>あなたの Token Station API キー（<code>gw-</code> で始まる）</li>
    <li>インストール済みの Codex、OpenClaw、または Pi</li>
  </ul>

  <p>以下のどのツールでも、モデル ID は同じだ。<code>anthropic/claude-fable-5</code>。Token Station は各ツールのネイティブ API を Anthropic の形式に変換する。単純なプロキシ構成では壊れがちな、ツール名やパラメータ名のマッピングも含めてだ。</p>

  <h2 id="codex-setup">Codex のセットアップ</h2>

  <p>Codex は OpenAI の Responses API を話す。Token Station がそれを Anthropic の形式に変換する。まず設定ファイルを作る。</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
model = "anthropic/claude-fable-5"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

  <p>続いてキーを設定して起動する。</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

  <p>試用を終えるには、<code>model</code> を以前使っていたものに戻すだけでよい。それ以外は何も動かさない。</p>

  <h2 id="openclaw-setup">OpenClaw のセットアップ</h2>

  <p>OpenClaw は <code>openclaw.json</code> 設定でカスタムプロバイダーを受け付ける（<a href="https://docs.openclaw.ai/concepts/model-providers">ドキュメント</a>）。Token Station を <code>anthropic-messages</code> 型のプロバイダーとして追加し、デフォルトモデルを Fable 5 に向ける。</p>

  <pre><code>{
  "models": {
    "mode": "merge",
    "providers": {
      "token-station": {
        "baseUrl": "https://models.bytefuture.ai/v1",
        "apiKey": "${TOKEN_STATION_API_KEY}",
        "api": "anthropic-messages",
        "models": [
          {
            "id": "anthropic/claude-fable-5",
            "name": "Claude Fable 5 (Token Station)",
            "contextWindow": 1000000,
            "maxTokens": 128000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/anthropic/claude-fable-5" }
    }
  }
}</code></pre>

  <p>OpenClaw のゲートウェイを再起動すれば、Token Station 経由でルーティングされる。元に戻すには、以前の <code>agents.defaults.model</code> を復元すればよい。プロバイダーの項目は次回のために残しておける。</p>

  <h2 id="pi-setup">Pi のセットアップ</h2>

  <p>Pi はカスタムプロバイダーを <code>~/.pi/agent/models.json</code> に登録する（<a href="https://pi.dev/docs/latest/custom-provider">ドキュメント</a>）。</p>

  <pre><code>{
  "providers": {
    "token-station": {
      "name": "Token Station",
      "baseUrl": "https://models.bytefuture.ai/v1",
      "apiKey": "$TOKEN_STATION_API_KEY",
      "api": "anthropic-messages",
      "models": [
        {
          "id": "anthropic/claude-fable-5",
          "name": "Claude Fable 5",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "maxTokens": 128000
        }
      ]
    }
  }
}</code></pre>

  <p>モデルを指定して起動するか、実行中に <code>/model</code> で切り替える。</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
pi --model anthropic/claude-fable-5</code></pre>

  <p>OpenClaw と Pi について一点。クライアントによって、自分で <code>/v1</code> を付けるかどうかが異なる。上の設定で 404 が出る場合は、<code>baseUrl</code> から <code>/v1</code> を外して再試行してほしい。</p>

  <h2 id="api-quirks">知っておきたい API の癖</h2>

  <p>Fable 5 は Claude モデルの中で最も厳格なリクエスト仕様を持っており、ツールがモデルパラメータを露出している場合に効いてくる。</p>

  <ul>
    <li><strong>サンプリングパラメータは使えない。</strong><code>temperature</code>、<code>top_p</code>、<code>top_k</code> はいずれも 400 で拒否される。代わりにプロンプトで誘導する。</li>
    <li><strong>思考は適応型のみ。</strong>固定の思考予算（<code>budget_tokens</code>）は廃止され、（Fable 5 特有だが）明示的な「思考を無効化」する設定すら拒否される。思考まわりの設定はいじらないか、省略すること。</li>
    <li><strong>アシスタントのプリフィルは不可。</strong>出力形式を強制するためにアシスタントのターンをプリフィルするツールは 400 を受け取る。代わりに構造化出力の機能を使えばよい。</li>
    <li><strong>セーフガードによる再ルーティング。</strong>制限付きトピックに関する一部のリクエスト（Anthropic は 5% 未満のセッションだとしている）は代わりに Opus 4.8 が回答し、現在は明示的な通知が付く。たまに回答が自分を Opus だと名乗っても驚かないでほしい。</li>
  </ul>

  <h2 id="try-it">実験してみる</h2>

  <p>このセットアップの肝は、使い捨てにできることだ。無料クレジットを使って、Fable 5 に自分の積み残しタスクを実際にこなさせ、データで判断する。Token Station 上のどのモデルも同じキーの背後にあるので、比較は設定 1 行で済む。同じタスクを <code>anthropic/claude-opus-4-8</code>（価格は半分）、<code>openai/gpt-5.5</code>、<code>xai/grok-build-0.1</code>（出力価格は 25 分の 1）で走らせ、Fable 5 の優位性が<em>あなたの仕事において</em>その割増に見合うかを確かめればよい。</p>

  <p>見合うなら結構、設定をそのまま残して残高を足せばよい。見合わないなら、あるいは次のポリシーの不意打ちで気が変わったなら、設定を 3 行消して立ち去ればいい。何も契約していないし、解約する必要もない。</p>

  <p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> で登録して（1 ドルの無料クレジット、カード不要、Anthropic アカウント不要、初回チャージで最大 50 ドルのボーナス）、Mythos クラスのモデルがあなたのコードで何をやってのけるか、その目で確かめてほしい。</p>
