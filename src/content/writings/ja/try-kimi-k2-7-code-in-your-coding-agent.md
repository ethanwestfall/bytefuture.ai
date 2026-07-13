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

  <hr />

  <!-- Share -->
  <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
    <span style="font-family:'Space Grotesk',sans-serif; font-size:14px; color:#71717a;">この記事をシェア</span>
    <a href="#" onclick="gtag('event','share_click',{label:'x'});window.open('https://x.com/intent/tweet?text='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href),'_blank','width=550,height=420');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Post
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'linkedin'});window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(location.href),'_blank','width=550,height=550');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
      LinkedIn
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'facebook'});window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),'_blank','width=550,height=550');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      Facebook
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'hackernews'});window.open('https://news.ycombinator.com/submitlink?u='+encodeURIComponent(location.href)+'&t='+encodeURIComponent(document.title),'_blank');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.064h1.583v-4.972l4.148-7.799h-1.749l-2.457 4.875c-.372.745-.688 1.434-.688 1.434s-.297-.708-.651-1.434L8.831 5.896h-1.88z"/></svg>
      Hacker News
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'reddit'});window.open('https://www.reddit.com/submit?url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title),'_blank');return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.745-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
      Reddit
    </a>
    <a href="#" onclick="gtag('event','share_click',{label:'copy_link'});var b=this;navigator.clipboard.writeText(location.href).then(function(){var s=b.querySelector('.share-label');s.textContent='コピーしました！';setTimeout(function(){s.textContent='リンクをコピー';},1500);});return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
      <span class="share-label">リンクをコピー</span>
    </a>
  </div>
