---
slug: "genoffice-meets-token-station"
lang: "ja"
title: "GenOffice と Token Station：どのモデルでも、使った分だけ"
summary: "GenOffice にはデフォルトで Genspark が組み込まれている。接続先を Token Station に変えるだけで、スイート内のすべてのアプリが好きなモデルで動き、契約課金ではなくリクエスト課金になる。"
category: "tutorial"
date: "2026-08-08"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/genoffice-meets-token-station-cover.png"
draft: false
---

<p><a href="https://github.com/genspark-ai/genoffice">GenOffice</a> は、Electron 上に構築されたオープンソースの AI ネイティブなオフィススイートだ。ワープロ、表計算エディタ、プレゼンテーション作成ツール、PDF ビューアが、ひとつのシェルの下にタブでまとめられている。5 つのアプリすべてが共有する約束はひとつ、<strong>ファイル形式の忠実性</strong>だ。<code>.docx</code>、<code>.xlsx</code>、<code>.pptx</code> を開いて編集しても、触らなかった部分はバイト単位で完全に元のまま返ってくる。GenOffice は元のファイルを解析し、変更されたブロックだけを追跡し、保存時にはその狭い範囲のパッチを元の XML に差し込む。アーカイブの残りの部分はそのままコピーされ、手を加えられることはない。</p>

<p>すべてのアプリが同じ AI パネルを備えている。Docs ではバージョン履歴付きのブロック単位編集、Sheets ではライブのワークブックに対してツールを呼び出すエージェント、Slides では自由形式のコードではなく固定された検証済みプリミティブの集合だけを使ってプレゼンテーションを編集する、制約付きのレイアウトスクリプトエージェントだ。この 3 つはいずれも、ツール呼び出しループを担う <code>agent-core</code> と、設定されたモデルバックエンドとの通信を担う <code>ai-provider</code> という 2 つのパッケージを裏側で共有している。</p>

<p>この記事の要点はまさにそこにある。<code>ai-provider</code> はすでに素の OpenAI 互換 HTTP を話す。デフォルトでは、GenOffice はこれを Genspark に向けている。代わりに <a href="https://models.bytefuture.ai">Token Station</a> に向ければ、アプリ側は何も変わらない。変わるのはトークンの出どころだけだ。</p>

<h2 id="why-token-station">Token Station で動かす理由</h2>

<p>Genspark はサインインした瞬間から使えて、デフォルトとして正しい選択だ。ただし、それはひとつのアカウント、ひとつの固定モデルラインナップ、そして Genspark の条件でチャージするクレジット残高でもある。Token Station はこの関係の形を 2 つの点で変える。どちらも、毎日使うデスクトップアプリにとって重要な点だ。</p>

<table>
  <tr><th></th><th>Genspark（デフォルト）</th><th>Token Station</th></tr>
  <tr><td>アカウント / クレジット</td><td>単一アカウント、単一クレジットプール</td><td>使った分だけの従量課金、月額・年額契約なし</td></tr>
  <tr><td>モデル</td><td>連携先が固定するラインナップ</td><td>25 以上のプロバイダーにまたがる 250 以上のモデルをタスクごとに選択</td></tr>
  <tr><td>価格</td><td>Genspark のプランに紐づくクレジット</td><td>ひとつの API キー、プロバイダー料金そのまま、上乗せなし</td></tr>
</table>

<p><strong>従量課金であって契約ではない。</strong>Token Station にはサブスクリプション階層がない。クレジットカードなしで無料登録でき、登録直後に 1 ドル分のクレジットが付与される。そこから先は、実際に呼び出したモデルに対してプロバイダーの料金をそのまま支払うだけで、定期的な費用も解約すべきものも発生しない。NVIDIA NIM のような一部のモデルはまったくの無料だ。</p>

<p><strong>モデルを選ぶ自由。</strong>ゲートウェイアカウントはひとつのベンダーのラインナップに縛られない。GenOffice の Docs では長文編集に Claude を使い、Sheets では日常的な数式作業に安価なモデルへ切り替え、Slides ではデッキに合った画像対応モデルを選ぶ。すべて同じ API キー、同じ OpenAI 形式のエンドポイントで行え、プロバイダーごとの個別登録は不要だ。</p>

<p>Token Station は GenOffice のカスタムプロバイダー枠がもともと想定している OpenAI 互換のワイヤーフォーマットをそのまま話すので、組み込みはルーティングの変更であって、書き直しではない。</p>

<h2 id="setup">セットアップ：手元の GenOffice にパッチを当てる</h2>

<p>以下は、GenOffice の AI トラフィックを Genspark から Token Station へルーティングし直す実際の変更点だ。自分の fork やブランチにそのまま適用できる。特定の GenOffice リリースに依存する内容ではない。</p>

<h3 id="step-1">1. 前提条件をインストールし、ベースのビルドが動くことを確認する</h3>

<p>マシンに Node.js と npm が必要だ。</p>

<pre><code>git clone &lt;your-fork-url&gt; genoffice
cd genoffice
npm install
npm run dev</code></pre>

<p>シェルが起動し、AI パネルが正常に開くことを確認する。この時点ではデフォルトで Genspark 上で動いており、ログアウト状態でメッセージを送信しない限りサインインを求められることはない。</p>

<h3 id="step-2">2. 共有 provider パッケージに環境変数ベースの上書きを追加する</h3>

<p><code>packages/ai-provider</code> にはすでにカスタムプロバイダーが定義されている。任意の OpenAI 互換の <code>baseUrl</code> / <code>apiKey</code> / <code>model</code> だ。環境変数からそれを埋める小さな関数を追加する。これは、Genspark 自身のキー（<code>GSK_API_KEY</code>）に対してコードベースがすでに使っているのと同じパターンだ。</p>

<p><code>packages/ai-provider/src/providers.ts</code></p>

<pre><code>export const TOKEN_STATION_BASE_URL = 'https://models.bytefuture.ai/v1'
const TOKEN_STATION_DEFAULT_MODEL = 'anthropic/claude-opus-4-8'

export function applyTokenStationEnvOverride(
  settings: AiSettings,
  env: NodeJS.ProcessEnv = process.env,
): AiSettings {
  const apiKey = env.TOKEN_STATION_API_KEY
  if (!apiKey) return settings
  return {
    provider: 'custom',
    providers: {
      ...settings.providers,
      custom: {
        apiKey,
        model: env.TOKEN_STATION_MODEL || TOKEN_STATION_DEFAULT_MODEL,
        baseUrl: TOKEN_STATION_BASE_URL,
      },
    },
  }
}</code></pre>

<p>これを <code>defaultAiSettings</code> や <code>resolveAiSettings</code> と並べて、パッケージの <code>index.ts</code> からエクスポートする。</p>

<h3 id="step-3">3. 各アプリで Genspark 強制をやめ、上書き関数を呼び出す</h3>

<p>Docs、Sheets、Slides はそれぞれ <code>ai:get-settings</code> という IPC ハンドラーを登録しており、読み込みのたびに provider を Genspark へハードリセットしている。その行を削除し、代わりに新しい上書き関数を呼び出す。3 つのファイルすべてで形はまったく同じだ。</p>

<p><code>apps/docs/src/main/docs-main.ts</code>（<code>apps/slides/src/main/ai-ipc.ts</code> と <code>apps/sheets/src/main/sheets-main.ts</code> でも同様）</p>

<pre><code>// before
ipcMain.handle('ai:get-settings', (): AiSettings => {
  const stored = readJson&lt;Partial&lt;AiSettings&gt; &amp; LegacyAiSettings&gt;(SETTINGS_PATH(), {})
  const settings = resolveAiSettings(stored, defaultAiSettings())
  settings.provider = 'genspark'   // ← delete this
  return settings
})

// after
ipcMain.handle('ai:get-settings', (): AiSettings => {
  const stored = readJson&lt;Partial&lt;AiSettings&gt; &amp; LegacyAiSettings&gt;(SETTINGS_PATH(), {})
  return applyTokenStationEnvOverride(resolveAiSettings(stored, defaultAiSettings()))
})</code></pre>

<p>Sheets のハンドラーは 2 点だけ見た目が異なる。文字列リテラルではなく IPC チャンネル定数を受け取ること、そして最初に <code>sessionFor(event)</code> のチェックを呼ぶことだ。だが本質は同じで、genspark 強制の行を削除し、新しい上書き関数を呼ぶだけでよい。</p>

<h3 id="step-4">4. API キーを取得し、環境変数に設定する</h3>

<p><a href="https://models.bytefuture.ai/signup">Token Station</a> に登録し、ダッシュボードから API キーを取得したら、それを永続的な環境変数として設定し、ターミナルを再起動する（環境変数はそれ以降に起動したプロセスにのみ適用される）。</p>

<pre><code># Windows (PowerShell)
[Environment]::SetEnvironmentVariable("TOKEN_STATION_API_KEY", "gw_...", "User")

# macOS / Linux — add to your shell profile
export TOKEN_STATION_API_KEY=gw_...</code></pre>

<p>任意設定として、<code>TOKEN_STATION_MODEL</code> に Token Station 上の provider/model 形式の ID（例えば <code>openai/gpt-5.5</code>）を設定すればデフォルトモデルを上書きできる。GenOffice を再起動すれば、Docs、Sheets、Slides でのチャット・編集・プランニングはすべて Token Station 上で動くようになる。Slides のワンショットのデッキ生成だけは追加のパッチが必要な機能で、これはステップ 5 で扱う。</p>

<h3 id="step-5">5. Slides のデッキ生成にはもうひとつパッチが必要</h3>

<p>Slides の <code>generate_deck</code> / <code>regenerate_slide</code> ツールは、もともと provider システムを完全に迂回して Genspark 専用のクラウドエンドポイントを直接呼び出していた。これらには 3 部構成の独自パッチが必要になる。Docs と Sheets だけをルーティングするなら、ステップ 4 で止めてよい。</p>

<p><strong><code>apps/slides/src/renderer/ai/slides-skill.ts</code></strong>：<code>DeckAccess</code> インターフェースにオプションのフィールドを 2 つ追加する。同期の <code>aiProvider()</code> ゲッターと、HTML マーカーの代わりに検証済みの要素リストを返す <code>composePageElements()</code> メソッドだ。そのうえで、両方のツールの判定を「Genspark 専用のハードコード」から現在の provider ベースの判定に切り替える。</p>

<pre><code>const useCloud = cloudAvailable
  &amp;&amp; (access.aiProvider?.() ?? 'genspark') === 'genspark'
if (!useCloud) {
  // fall back to runLocalDeckGeneration() / runLocalRegenerateSlide()
}</code></pre>

<p><strong><code>apps/slides/src/renderer/ai/local-deck-gen.ts</code></strong>（新規ファイル）：実際に構成処理を行うモジュールで、設定された provider に各ページのレイアウトを JSON（図形、テキストボックス、チャート、画像）として要求し、それを検証したうえで、アプリ自身のエージェントツールがすでに使っている <code>add_shape</code> / <code>add_text_box</code> / <code>add_chart</code> / <code>insert_web_image</code> のプリミティブで構築する。</p>

<p><strong><code>apps/slides/src/renderer/ai/AiPanel.tsx</code></strong>：新しく追加した 2 つの <code>DeckAccess</code> フィールドを、<code>generateStyleSkill</code> / <code>planDeckOutline</code> がすでに使っているのと同じリクエストパスに接続する。ここは見落としやすい部分だ。接続しないと <code>aiProvider</code> が undefined のままになり、上記の判定が静かに Genspark へフォールバックしてしまう。</p>

<pre><code>aiProvider: () => settingsRef.current.provider,
composePageElements: async (args) => {
  const { system, user } = buildPageComposePrompt(args)
  const r = await runLlmOnce(system, user, undefined, true, args.signal)
  if (!r.ok || !r.text) return { ok: false, error: r.error ?? tGlobal('aiErrEmptyOutput') }
  return parsePageElementsJson(r.text, args.canvasW, args.canvasH)
},</code></pre>

<p><strong>ローカルパス v1 の既知の制約：</strong>現状は追加専用で、新しいページは常に現在の最後のスライドを複製する。「デッキ全体の置き換え」にはまだ対応していない。ローカル版の <code>regenerate_slide</code> もコンテンツ要素のみを置き換え、背景とテーマの継承には手を加えない点がクラウド版と異なる。</p>

<h2 id="demos">実際の動作</h2>

<p>アプリごとに 1 本、合計 3 本の短いデモ。すべて Token Station 上で動いている。</p>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-docs.mp4" type="video/mp4">
  </video>
  <figcaption>デモ1・Docs：プロジェクト概要。GenOffice Docs が AI パネルでプロジェクト概要ドキュメントを作成・編集する様子。Genspark へのサインインは一切なく、最初から最後まで Token Station 上で動いている。</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-sheets.mp4" type="video/mp4">
  </video>
  <figcaption>デモ2・Sheets：プロジェクト予算。GenOffice Sheets がプロジェクト予算表を構築する様子。数式、書式設定、そしてライブのワークブックに対する AI 支援編集まで、すべて Token Station 経由でルーティングされている。</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-slides.mp4" type="video/mp4">
  </video>
  <figcaption>デモ3・Slides：プロジェクトデッキ。GenOffice Slides がプレゼンテーション全体を生成する様子。ステップ 5 の追加パッチが必要になった機能で、Genspark のクラウドサービスの代わりに Token Station を通じてページごとに生成している。</figcaption>
</figure>

<h2 id="learn-more">もっと詳しく</h2>

<ul>
  <li>Token Station：<a href="https://models.bytefuture.ai/signup">料金・登録</a></li>
  <li>Token Station：<a href="https://models.bytefuture.ai/models">モデルカタログ全体</a></li>
  <li>GenOffice：<a href="https://github.com/genspark-ai/genoffice">GitHub ソースコード</a></li>
  <li>GenOffice：<a href="https://github.com/genspark-ai/genoffice/blob/main/CONTRIBUTING.md">コントリビューションガイド</a></li>
</ul>

<p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> で登録し（1 ドル分の無料クレジット、クレジットカード不要）、<code>TOKEN_STATION_API_KEY</code> をエクスポートしたら、GenOffice を再起動する。ひとつの API キー、ひとつのエンドポイントで、Docs・Sheets・Slides のセッションに必要なすべてのモデルが使える。</p>
