---
slug: "run-any-model-in-codex-through-token-station"
lang: "ja"
title: "Token Station 経由で Codex に任意のモデルを使う"
summary: "OpenAI の Codex は OpenAI 製に限らず任意のモデルを動かせる。2026 年 2 月以降は Responses API が必須となったため、対接するプラットフォームはそれをネイティブにサポートする必要がある。Token Station 向けの ~/.codex/config.toml をそのまま掲載し、OpenAI 公式ドキュメントと照合。smart routing も紹介する。"
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/run-any-model-in-codex-through-token-station-cover.png"
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
