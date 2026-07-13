---
slug: "use-grok-build-in-codex-and-claude-code"
lang: "ja"
title: "Codex と Claude Code で Grok Build を使う方法"
summary: "xAI の Grok Build モデルは進化が速く、価格は GPT-5.5 や Claude Fable 5 のほんの一部。Token Station の無料クレジットで Claude Code や Codex 内で動かせる。xAI アカウントは不要。"
category: "tutorial"
date: "2026-06-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-code-grok-build.png"
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
