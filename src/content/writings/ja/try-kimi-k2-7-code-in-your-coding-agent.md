---
slug: "try-kimi-k2-7-code-in-your-coding-agent"
lang: "ja"
title: "Kimi K2.7 Code：試すには十分に安く、仕事を分担させるにも十分かもしれない"
summary: "Moonshot の新しい 1T オープンウェイトのコーディングモデルは 100 万トークンあたり 0.95/4 ドル。Claude Code、Codex、OpenClaw で SOTA モデルと組み合わせ、日常的な作業を任せよう。"
category: "tutorial"
date: "2026-06-13"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/kimi-k2-7-code-cover.png"
draft: false
---

<p>昨日、Moonshot AI が Hugging Face に <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Kimi K2.7 Code</a> を公開しました。1 兆パラメータの Mixture-of-Experts コーディングモデル（アクティブ 32B）で、コンテキストウィンドウは 256K、ウェイトは Modified MIT ライセンスで公開されています。</p>

  <p>私たちの <a href="/blog/try-claude-fable-5-in-codex-openclaw-and-pi.html">Claude Fable 5 の記事</a> を読んだ方なら、今回はその論理がちょうど逆向きに動いているとわかるはずです。Fable 5 では能力は実証済みで、リスクは価格にありました。K2.7 Code では価格はごくわずかで、能力こそが未解決の問いです。このモデルは公開からまだ 1 日、第三者によるベンチマークはまだなく、Moonshot 自身の数値でもフロンティアの後塵を拝しています。どちらの状況も行き着く姿勢は同じです。すでに使っているコーディング環境の中で、安く、いつでも引き返せる実験を回すことです。</p>

  <p>この実験を単なる置き換え以上に面白くしている要素が一つあります。<strong>入力 100 万トークンあたり 0.95 ドル、出力 100 万トークンあたり 4.00 ドル</strong> という価格で、K2.7 Code は入力で Claude Fable 5 のおよそ 10 分の 1、出力で 12 分の 1 のコストです。これは別の役割を与えられるほど安いということです。あなたの SOTA モデルと並んで働き、高価なモデルが難所を受け持つ間、定型的なファンアウト作業を引き受けるのです。</p>

  <p>K2.7 Code は <a href="https://models.bytefuture.ai">Token Station</a> で <code>kimi/kimi-k2.7-code</code> として利用でき、Moonshot の定価のまま上乗せゼロで提供されます。<a href="https://models.bytefuture.ai/signup">1 ドルの登録クレジット</a> でかなりの量をまかなえます。</p>

  <h2 id="what-we-know">わかっていること（そしてわからないこと）</h2>

  <p><a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">モデルカード</a> より：</p>

  <ul>
    <li><strong>コーディングエージェント向けに作られている。</strong>Kimi K2.6 のコーディング特化型の後継で、長期にわたるソフトウェアエンジニアリングに合わせて調整されています。インターリーブされた思考、複数ステップのツール呼び出し、MCP 対応、そしてターンをまたいで保持される推論が特徴です。</li>
    <li><strong>思考トークンが K2.6 より約 30% 少ない</strong>うえにコーディングスコアは高く、これは出力トークン単位で課金される場合に効いてきます。</li>
    <li><strong>総パラメータ 1T、アクティブ 32B</strong>、384 のエキスパート、INT4 のネイティブ対応、加えて画像入力用の 400M パラメータのビジョンエンコーダを備えています。</li>
    <li><strong>オープンウェイト、Modified MIT。</strong>モデル一式をダウンロードして、vLLM や SGLang で自分でホストできます。</li>
  </ul>

  <p>そして正直な部分です。Moonshot はフロンティアとの比較を自ら公開しており、そこでは K2.7 Code が負けています。</p>

  <figure>
    <img src="kimi-k2-7-code-benchmarks.png" alt="Moonshot 自己申告のベンチマークのグループ化棒グラフ：Kimi K2.7 Code は Kimi Code Bench v2 で 62.0、対する GPT-5.5 は 69.0、Claude Opus 4.8 は 67.4；ProgramBench で 53.6、対する 69.1 と 63.8；MCP Atlas で 76.0、対する 79.4 と 81.3" />
    <figcaption>Moonshot 自身が公開した数値。K2.7 Code は 3 項目すべてでフロンティアに後れを取っています。出典：<a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Kimi K2.7 Code モデルカード</a>、2026 年 6 月。</figcaption>
  </figure>

  <p>自社モデルが負けるベンチマークを公開するベンダーは、その数値が正直である良い証しです。しかも差は見苦しいものではありません。Moonshot のコーディングベンチで GPT-5.5 に約 7 ポイント差、ツール利用ではより接近しています。前回の Kimi（K2.6）は現在、Artificial Analysis Intelligence Index で最強のオープンウェイトモデルです。まだ誰も知らないのは、K2.7 Code が<em>あなたの</em>コードベースで、<em>あなたの</em>環境で、長いエージェント的セッションを通してどう振る舞うかです。この実験が解き明かすのは、まさにその未知数です。</p>

  <p>私たちの Grok Build の記事と同じ趣旨で、一点はっきりさせておきます。<strong>モデル</strong>としての K2.7 Code は、Moonshot 自身のコーディング環境である <em>Kimi Code CLI</em> 向けに最適化されています。その CLI は必要ありません。このモデルは OpenAI 互換および Anthropic 互換の API を話し、Token Station が既存の環境から送られてくるものを何であれ変換します。</p>

  <h2 id="the-price">価格：フロンティアの隣では誤差のようなもの</h2>

  <p>以下はすべて、各プロバイダーの定価のまま Token Station で利用できます。</p>

  <table>
    <tr><th>モデル</th><th>入力 / 1M</th><th>出力 / 1M</th><th>コンテキスト</th></tr>
    <tr><td><code>kimi/kimi-k2.7-code</code></td><td><strong>$0.95</strong></td><td><strong>$4.00</strong></td><td>256K</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>$1.00</td><td>$2.00</td><td>256K</td></tr>
    <tr><td><code>anthropic/claude-sonnet-4-6</code></td><td>$3.00</td><td>$15.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>$5.00</td><td>$25.00</td><td>1M</td></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>$5.00</td><td>$30.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-fable-5</code></td><td>$10.00</td><td>$50.00</td><td>1M</td></tr>
  </table>

  <p>K2.7 Code の価格なら、1 ドルの登録クレジットでおよそ 100 万の入力トークン、または 25 万の出力トークンを買えます。同じクレジットで Fable 5 なら数回のプロンプト分でしたが、ここでは本格的な評価に充てられます。この実験の下振れリスクはほぼゼロです。しかも初回チャージでは最大 50 ドルのボーナスクレジットが上乗せされ、K2.7 Code の価格なら数週間分に相当します。</p>

  <h2 id="share-the-work">本当の実験：仕事を分担させる</h2>

  <p>コーディングエージェントはすでに作業を階層に分けています。計画と難しい推論が行われるメインループがあり、そしてファンアウトがあります。ファイルを読み、検索を実行し、テストを走らせ、結果を要約するサブエージェントたちです。ファンアウトはトークンの大半を消費しますが、必要な賢さは最も少ないのです。</p>

  <p>その分担こそ、100 万あたり 4 ドルのモデルが 100 万あたり 50 ドルのモデルの隣に居場所を得る場面です。Fable 5 か Opus 4.8 を運転席に座らせ、定型作業は K2.7 Code に渡しましょう。Moonshot の数値が実運用でも持ちこたえるなら、委譲したタスクの品質低下はわずかで、委譲したトークンごとのコスト削減は 10 倍以上になります。</p>

  <h2 id="what-you-need">必要なもの</h2>

  <ul>
    <li>Token Station のアカウント（<a href="https://models.bytefuture.ai/signup">無料登録</a>。1 ドルのクレジット付き、カード不要、Moonshot のアカウントも不要）</li>
    <li>あなたの Token Station API キー（<code>gw-</code> で始まります）</li>
    <li>インストール済みの Claude Code、Codex、または OpenClaw</li>
  </ul>

  <h2 id="claude-code-setup">Claude Code の設定：2 段階の分担</h2>

  <p>Claude Code はモデルの階層を環境変数として公開しており、仕事を分担させる実験を回すのに最もすっきりした場所です。Opus 枠を Claude Fable 5 のために確保し、それ以外はすべて主力モデルに任せましょう。</p>

  <pre><code># Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

# Top tier: Fable 5 takes the genuinely hard problems
export ANTHROPIC_DEFAULT_OPUS_MODEL="anthropic/claude-fable-5"

# Everything else runs on the workhorse
export ANTHROPIC_DEFAULT_SONNET_MODEL="kimi/kimi-k2.7-code"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi/kimi-k2.7-code"
export CLAUDE_CODE_SUBAGENT_MODEL="kimi/kimi-k2.7-code"

claude</code></pre>

  <p>これで通常のセッションは最初から最後まで K2.7 Code で動きます。メインループ、すべてのサブエージェント、すべてのバックグラウンド検索が、出力 100 万あたり 50 ドルではなく 4 ドルで課金されます。問題が本当にフロンティア級の判断を必要とするときは <code>/model opus</code> で昇格させれば Fable 5 が引き継ぎ、難所が終わったら元に戻します。高価なモデルは、その価格にふさわしい役割、すなわち必要なときに呼ぶ専門家になります。</p>

  <p>Fable 5 の価格にひるむなら、Opus 枠の <code>anthropic/claude-fable-5</code> を <code>anthropic/claude-opus-4-8</code> に差し替えてください。この昇格パターンはどの階層でも機能します。</p>

  <h2 id="codex-setup">Codex の設定</h2>

  <p>Codex は 1 セッションにつき 1 モデルですが、<a href="https://developers.openai.com/codex/config-reference">profiles</a> を使えば呼び出し単位で同じ分担ができます。主力モデルをデフォルトにし、Fable 5 用に名前付きの昇格プロファイルを用意しておきます。</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
# Default: the workhorse
model = "kimi/kimi-k2.7-code"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"

# Escalation: Fable 5 on demand
[profiles.deep]
model = "anthropic/claude-fable-5"
EOF

export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"

codex                  # routine work on K2.7 Code
codex --profile deep   # hard problems on Fable 5</code></pre>

  <p>普段は素の <code>codex</code> を起動し、主力モデルの料金で済ませます。タスクがフロンティアモデルに値するときだけ、<code>codex --profile deep</code> がその呼び出しに限って Fable 5 を呼び込みます。設定の他の部分は一切動きません。</p>

  <h2 id="openclaw-setup">OpenClaw の設定</h2>

  <p>OpenClaw はこの分担を第一級の設定にしています。<code>agents.defaults.subagents.model</code> で別途指定しない限り、サブエージェントは呼び出し元のモデルを継承します（<a href="https://docs.openclaw.ai/tools/subagents">ドキュメント</a>）。したがって Fable 5 が運転席に座りつつ、生成されたすべてのサブエージェントを K2.7 Code で動かせます。</p>

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
          },
          {
            "id": "kimi/kimi-k2.7-code",
            "name": "Kimi K2.7 Code (Token Station)",
            "contextWindow": 256000,
            "maxTokens": 32768
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/anthropic/claude-fable-5" },
      "subagents": { "model": "token-station/kimi/kimi-k2.7-code" }
    }
  }
}</code></pre>

  <p>メインエージェントはフロンティア級の判断を保ち、並列のファンアウト（トークンを食う部分）は主力モデルの料金で課金されます。全体を代わりに K2.7 Code で動かしたい場合は、<code>agents.defaults.model.primary</code> をそれに向ければよいだけです。いずれにせよ両モデルは同じキーの背後にあります。</p>

  <h2 id="quirks">知っておきたいクセ</h2>

  <ul>
    <li><strong>思考は常にオン。</strong>K2.7 Code は回答の前に推論し、その推論をターンをまたいで持ち越します。これをオフにはできません。推論トークンを出力の請求に見込んでおきましょう。K2.6 比で 30% 削減されているぶん、負担はやわらぎます。</li>
    <li><strong>256K のコンテキスト。</strong>十分に広いものの、フロンティアの Claude や GPT モデルの 1M ウィンドウの 4 分の 1 です。長いエージェント的セッションはより早く圧縮が起こります。</li>
    <li><strong>ホームの環境がある。</strong>Moonshot は Kimi Code CLI 向けに調整しているので、それ以外の場所では時折ざらつきが出ると考えておきましょう。Token Station のツール名・パラメータ名の変換が、プロトコルレベルの食い違いを処理します。</li>
    <li><strong>出口の道は両方向に開いている。</strong>実験が失敗したら、設定を削除すればよいだけです。成功したら、ウェイトは <a href="https://huggingface.co/moonshotai/Kimi-K2.7-Code">Hugging Face</a> 上で Modified MIT として公開されています。いずれまったく同じモデルを自分のハードウェアでホストできます。自己ホストへと昇格しうるクラウド実験は、ハイブリッド推論の物語を小さくしたものです。</li>
  </ul>

  <h2 id="try-it">実験を回す</h2>

  <p>あなたの高価なモデルには過剰な仕事を K2.7 Code に与えましょう。サブエージェントの検索、テスト実行、定型コード、要約などです。1 週間ほど様子を見て、どこで持ちこたえ、どこでつまずくかを見極め、それに応じて分担を決めます。同じ Token Station キーで <code>anthropic/claude-fable-5</code>、<code>anthropic/claude-opus-4-8</code>、<code>kimi/kimi-k2.7-code</code> を並べて動かせるので、比較は最初から組み込まれています。</p>

  <p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> で登録し（1 ドルの無料クレジット、カード不要、初回チャージで最大 50 ドルのボーナス）、公開からまだ 1 日のオープンウェイトモデルが、10 分の 1 の価格であなたのエージェントの仕事量の半分を担えるかどうか、確かめてみてください。</p>
