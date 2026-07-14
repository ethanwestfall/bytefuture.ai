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
