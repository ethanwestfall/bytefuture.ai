---
slug: "glm-5-2-zai-stock-jump"
lang: "ja"
title: "GLM-5.2 で Z.AI の株価が 33% 急騰。Token Station で今すぐ無料で試せる"
summary: "オープンソースで 100 万トークンのコンテキストを持つコーディングモデル GLM-5.2 の公開当日、Zhipu AI の香港上場株は一時 48% 上昇した。なぜ動いたのか、そして Token Station に登録して GLM-5.2 を無料で試す方法。"
category: "research"
date: "2026-06-15"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/glm-5-2-zai-stock-jump-cover.png"
draft: false
---

<p>GLM-5.2 は、一見ありふれたモデルの公開を市場を動かす出来事に変えた。6 月 15 日、<a href="https://finance.yahoo.com/quote/2513.HK/">Zhipu AI の香港上場株</a>は取引時間中に一時 48% 上昇して 1,620 香港ドルを付け、32.8% 高の 1,457 香港ドルで引けた。</p>

  <p>同株は 1 月初旬の Zhipu の IPO 以来、約 820% 上昇している。JPモルガンは目標株価を 1,400 香港ドルに引き上げて「オーバーウェイト」を維持し、バンク・オブ・アメリカは「買い」でカバレッジを開始した。バージョンアップが企業をここまで動かすことは普通ない。今回はそれが起きた。</p>

  <p>ドル建てで見ると規模がはっきりする。GLM-5.2 の公開前日、Z.AI の上場株の時価総額は約 600 億ドルだった。今回の公開は 1 営業日で 200 億ドル近くを上乗せし、同社を約 800 億ドル、<a href="https://finance.yahoo.com/quote/ABNB/">Airbnb</a> とほぼ同じ規模へ押し上げた。最も分かりやすい物差しは <a href="https://finance.yahoo.com/quote/COIN/">Coinbase</a> で、2026 年 6 月中旬の時価総額は約 420 億ドル。GLM-5.2 は Z.AI を 1 日で「Coinbase 約 1.5 個分」から「2 個分近く」へ引き上げた。いまやコーディングモデルの公開が、米テックの優良株に匹敵する規模の企業を動かしている。</p>

  <h2 id="why-the-stock-moved">なぜ株価は動いたのか</h2>

  <p>GLM-5.2 は Z.AI の新しいフラッグシップ・コーディングモデルであり、その公開を脚注ではなく市場の話題にした要因が二つある。</p>

  <p>第一に、これは<strong>オープンソース</strong>である。MIT ライセンスで公開され、100 万トークンのコンテキストウィンドウを備え、長期的なエージェント型コーディングに重点を置く。クローズドな最前線に迫り続けてきた系譜を引き継ぐものだ。GLM-5 は SWE-bench Verified で 77.8% を記録し、その後の各リリースで差を詰めてきた。重みをダウンロードできるため、この能力が取り消されることはない。</p>

  <p>第二に、タイミングだ。GLM-5.2 が登場したのと同じ週末、米国の輸出管理命令により Anthropic は最も強力な二つのモデル、Claude Fable 5 と Mythos 5 を全ユーザー向けに停止せざるを得なくなった。ある最前線のベンダーが政府の指示で止まった。一方で、最前線級のコンテキストウィンドウを備えたオープンモデルが、Anthropic の最上位 Claude Code および Max プランのおよそ 10 分の 1 の価格で現れた。投資家はこれを、中国のオープンモデルがその空白に入り込んでいると読み、こうしたモデルを世に出す企業を再評価した。</p>

  <p>この上昇が続くかどうかは市場が決める問題だ。開発者にとってより有用な問いはもっと狭い。その裏にあるモデルは、あなたのコードで本当に役立つのか。それを確かめるのに株を買う必要はない。</p>

  <h2 id="try-it-free">Token Station で GLM-5.2 を無料で試す</h2>

  <p>GLM-5.2 は <a href="https://models.bytefuture.ai/intro.html" onclick="gtag('event','cta_click',{label:'post_body_token_station'});">Token Station</a> で <code>glm/glm-5.2</code> として利用でき、100 万トークンのフルコンテキストに対応し、Z.AI の定価そのまま、上乗せなしで課金される。入力 100 万トークンあたり 1.40 ドル、出力 100 万トークンあたり 4.40 ドルだ。予算で見込んでおくべき点が一つある。思考は常に有効なので、推論トークンは出力として課金される。</p>

  <p>無料で始められる。<a href="https://models.bytefuture.ai/signup" onclick="gtag('event','cta_click',{label:'post_body_signup'});">登録</a>すると 1 ドル分のクレジットがもらえる。カードは不要で、Z.AI のアカウントや Coding Plan の契約も必要ない。初回チャージでは最大 50 ドルのボーナスクレジットが上乗せされる。すでに使っているコーディングツールを <code>glm/glm-5.2</code> に向けて、実際の作業をそのまま流してみてほしい。</p>

  <h3>Claude Code</h3>

  <p>Claude Code はモデルとエンドポイントを環境変数から読み込む。すべてのティアを Token Station 経由で GLM-5.2 にルーティングする。</p>

  <pre><code>export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

export ANTHROPIC_DEFAULT_OPUS_MODEL="glm/glm-5.2"
export ANTHROPIC_DEFAULT_SONNET_MODEL="glm/glm-5.2"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="glm/glm-5.2"
export CLAUDE_CODE_SUBAGENT_MODEL="glm/glm-5.2"

claude</code></pre>

  <h3>Codex</h3>

  <p>Token Station をプロバイダーとして設定し、GLM-5.2 をモデルにする。</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
model = "glm/glm-5.2"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF

export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

  <h3>OpenClaw</h3>

  <p>Token Station をプロバイダーとして登録し、GLM-5.2 をデフォルトモデルに設定する。</p>

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
            "id": "glm/glm-5.2",
            "name": "GLM-5.2 (Token Station)",
            "contextWindow": 1000000,
            "maxTokens": 131072
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/glm/glm-5.2" }
    }
  }
}</code></pre>

  <p>鍵が一つ、すでに使っているハーネス、そして市場が再評価したばかりのモデル。GLM-5.2 があなたのリポジトリで通用するなら、それを確かめるコストは無料登録だけだ。通用しないなら、設定を 1 行変えて先に進めばいい。</p>

  <p>ここから始めよう：<a href="https://models.bytefuture.ai/signup" onclick="gtag('event','cta_click',{label:'post_body_signup'});">models.bytefuture.ai</a></p>

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
