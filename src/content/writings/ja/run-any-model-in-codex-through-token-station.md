---
slug: "run-any-model-in-codex-through-token-station"
lang: "ja"
title: "Token Station 経由で Codex に任意のモデルを使う"
summary: "OpenAI の Codex は OpenAI 製に限らず任意のモデルを動かせる。2026 年 2 月以降は Responses API が必須となったため、対接するプラットフォームはそれをネイティブにサポートする必要がある。Token Station 向けの ~/.codex/config.toml をそのまま掲載し、OpenAI 公式ドキュメントと照合。smart routing も紹介する。"
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

<p>OpenAI が Codex について控えめながら有用な点を示した。Codex の app、CLI、SDK は OpenAI 製に限らず<strong>任意のモデル</strong>を動かせる。プロダクトはこのハーネスであり、背後のモデルは選択肢にすぎない。だから Codex はそのままに、GPT-5.5、Claude、あるいは GLM-5.2 や Kimi K2.7 のようなオープンウェイトモデルなど、タスクに合うものに向ければよい。</p>

  <p>ただし多くの人がつまずく落とし穴がひとつある。<strong>2026 年 2 月以降、Codex は OpenAI の Responses API に統一された</strong>。プロバイダ連携は <code>wire_api = "responses"</code> を前提とし、旧来の Chat Completions 経路はもう入口ではない。つまり Codex を向けるモデルプラットフォームは、Chat Completions だけでなく <strong>Responses API をネイティブに話せる</strong>必要がある。多くのゲートウェイは後者しか実装しておらず、ここで動かなくなる。</p>

  <p><a href="https://models.bytefuture.ai">Token Station</a> はホストするすべてのモデルを OpenAI の <strong>Responses API</strong>（<code>/v1/responses</code>）で公開しているため、Codex はシムなしで直接つながる。本記事ではそのままの設定、検証コマンド、1 行でのモデル切り替え、そして smart routing の位置づけを示す。</p>

  <h2 id="why-custom-provider">なぜカスタムプロバイダが必要か（環境変数だけでは不十分）</h2>

  <p>Claude Code なら環境変数だけで別のエンドポイントへリダイレクトできる。Codex は違う。<strong>組み込みの OpenAI プロバイダは <code>OPENAI_BASE_URL</code> を無視し</strong>、常に <code>api.openai.com</code> に接続する。この変数を設定してもデフォルトプロバイダには何の効果もない。</p>

  <p>OpenAI の<a href="https://developers.openai.com/codex/config-advanced">高度な設定ドキュメント</a>によれば、サポートされる方法は <code>~/.codex/config.toml</code> の <code>[model_providers.&lt;id&gt;]</code> に独自エントリを定義し、<code>model_provider</code> で選択することだ。（組み込みプロバイダを変えるには <code>openai_base_url</code> を使い、予約済みの <code>openai</code> という id は再利用できないため、名前付きのカスタムプロバイダがすっきりした道筋になる。）API キーは環境変数に置いたままで、設定からは <code>env_key</code> で参照するので、秘密の値がファイルに残ることはない。</p>

  <h2 id="config">一度きりの設定</h2>

  <p>設定ファイルを作る。これは Responses API を使う <code>token_station</code> プロバイダを定義し、デフォルトにする：</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
model = "openai/gpt-5.5"
model_provider = "token_station"

[model_providers.token_station]
name = "Token Station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

  <p>次に Token Station のキーをエクスポートし（変数名は上の <code>env_key</code> と一致させる）、1 行で確認する：</p>

  <pre><code>export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

codex exec "Respond with exactly the word: pong"</code></pre>

  <p><code>pong</code> と表示されれば、Codex は Responses API 経由で Token Station と通信できている。ここから <code>codex</code> を実行すれば、同じプロバイダで対話セッションが開く。</p>

  <h3 id="fields">各フィールドの意味</h3>

  <table>
    <tr><th>キー</th><th>意味</th></tr>
    <tr><td><code>model</code></td><td>Codex が既定で要求するモデル ID。<code>provider/model</code> 形式（ここでは <code>openai/gpt-5.5</code>）。</td></tr>
    <tr><td><code>model_provider</code></td><td>どのプロバイダブロックを使うか。<code>[model_providers.&lt;id&gt;]</code> の id と一致させる。</td></tr>
    <tr><td><code>name</code></td><td>人間向けのラベル。自由なテキストで、id ではない。</td></tr>
    <tr><td><code>base_url</code></td><td>Token Station の OpenAI 互換ベース <code>https://models.bytefuture.ai/v1</code>。Codex が <code>/responses</code> を付け足す。</td></tr>
    <tr><td><code>env_key</code></td><td>Codex がキーを読み取る環境変数。秘密の値はファイルに入れない。</td></tr>
    <tr><td><code>wire_api</code></td><td><code>"responses"</code>。ここが肝心：Responses API を選択する。Codex が必須とし、Token Station がネイティブに対応する。</td></tr>
  </table>

  <h3 id="matches-docs">OpenAI 公式ドキュメントと一致する</h3>

  <p>上のキーはすべて、OpenAI がドキュメント化したカスタムプロバイダの schema そのままだ。トップレベルの <code>model</code> と <code>model_provider</code>、続いて <code>name</code>・<code>base_url</code>・<code>env_key</code>・<code>wire_api</code> を持つ <code>[model_providers.&lt;id&gt;]</code> テーブル。<code>token_station</code> という id が許されるのは、予約済み id（<code>openai</code>、<code>ollama</code>、<code>lmstudio</code>）ではないからだ。今日の Codex でひとつだけ正確に合わせる必要がある値は <code>wire_api = "responses"</code>。このブロックに Token Station 固有の構文は一切なく、どのプロバイダでも書く形と同じだ。</p>

  <h2 id="swap">1 行でモデルを切り替える</h2>

  <p>Token Station のすべてのモデルは同じキー、同じ Responses エンドポイントの背後にあるため、モデルの切り替えは設定の <code>model</code> を一箇所書き換えるだけ、または起動時のフラグで済む：</p>

  <pre><code>codex --model anthropic/claude-opus-4-8 exec "Summarize git diff and suggest a commit message"</code></pre>

  <p>同じ設定のまま、いますぐ <code>model</code> に入れられるモデル ID をいくつか：</p>

  <table>
    <tr><th>モデル ID</th><th>向いている用途</th></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>OpenAI のフラッグシップ。Codex のネイティブな既定。</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>長期的なエージェントコーディングとリファクタリング。</td></tr>
    <tr><td><code>glm/glm-5.2</code></td><td>オープンウェイト、100 万トークンの文脈、低価格でコードに強い。</td></tr>
    <tr><td><code>kimi/kimi-k2.7-code</code></td><td>定型作業向けの安価なオープンウェイトコーディングモデル。</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>高速かつ安価。出力コストはフラッグシップのごく一部。</td></tr>
  </table>

  <p>OpenAI が示したかった点がここに着地する。Codex はモデル非依存だ。難しいタスクには高価なモデルを、定型コードには安価なオープンウェイトモデルを。ハーネスを離れることなく、書き換えるのも 1 行だけだ。</p>

  <h2 id="smart-routing">Smart routing：1 つの ID にモデルを選ばせる</h2>

  <p>タスクごとにモデルを固定するのも構わないが、Token Station では名前ではなく<strong>ルールで振り分ける</strong>こともできる。ワークロードにポリシーを定義し（品質の下限を満たす最も安いモデル、しきい値以下のレイテンシでプロバイダ許可リスト付き、あるいは主モデルの背後に予備を置く厳格なフォールバックチェーンなど）、Token Station がリクエストごとにモデルを選ぶ。</p>

  <p>Codex にとってこれは好都合だ。Codex 自身はモデル ID を 1 つ送るだけだから。<code>model</code> をルーティング済みのワークロードに向ければ、判断はサーバ側に移る。主モデルが遅い、または使えない場合は予備が応答し、Codex セッションはそれを知る必要すらない。ルーティングは <code>config.toml</code> ではなく Token Station 側で変えるので、同じ Codex 設定がポリシーの進化に自動で追従する。</p>

  <blockquote>
    <p>Codex はモデル ID を 1 つ送る。実際に応答するのは誰かを smart routing が決めるので、コストやフォールバックのロジックは設定に固定されず Token Station 側に置かれる。</p>
  </blockquote>

  <h2 id="troubleshooting">うまくつながらないとき</h2>

  <ul>
    <li><strong>まだ <code>api.openai.com</code> につながる。</strong><code>OPENAI_BASE_URL</code> を設定して組み込みプロバイダが従うと思っていないか。従わない。上のカスタムプロバイダを使い、<code>model_provider = "token_station"</code> を設定する。</li>
    <li><strong>401 / 認証エラー。</strong>エクスポートした変数名は <code>env_key</code>（<code>TOKEN_STATION_API_KEY</code>）と完全に一致し、かつ <code>codex</code> を実行する同じシェルでエクスポートする必要がある。</li>
    <li><strong>モデルでプロトコルエラーまたは 404。</strong><code>wire_api = "responses"</code> を確認する。Codex は Responses API を必須とし、Chat Completions だけのゲートウェイでは満たせない。</li>
    <li><strong>モデル id が間違っている。</strong><code>provider/model</code> 形式（例：<code>anthropic/claude-opus-4-8</code>）を使い、裸のモデル名は使わない。</li>
  </ul>

  <h2 id="wrap">はじめよう</h2>

  <p>Codex で任意のモデルを動かすのは、結局 4 行の TOML と環境変数 1 つに尽きる。唯一引っかかる要件が Responses API だ。Token Station はホストするすべてのモデルをこの API で提供するので、上の設定は GPT-5.5、Claude、GLM-5.2、あるいはルーティング済みのワークロードでも、そのまま動く。</p>

  <p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> で登録し（無料クレジット 1 ドル、カード不要、初回チャージで最大 50 ドルのボーナス）、キーを <code>TOKEN_STATION_API_KEY</code> に入れて <code>pong</code> チェックを実行しよう。キー 1 つ、エンドポイント 1 つで、Codex セッションに必要なすべてのモデルが手に入る。</p>

      <hr />

      <!-- Share (leave exactly as-is; the buttons fire share_click GA events) -->
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
