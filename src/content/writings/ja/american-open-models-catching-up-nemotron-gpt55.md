---
slug: "american-open-models-catching-up-nemotron-gpt55"
lang: "ja"
title: "アメリカのオープンモデルが追い上げる：Nemotron-3 Ultra が米国オープンウェイトを牽引"
summary: "NVIDIA Nemotron-3 Ultra は Artificial Analysis Intelligence Index で最も高性能なアメリカのオープンウェイトモデルであり、期間限定で NVIDIA NIM から無料で利用できる。"
category: "research"
date: "2026-06-08"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/american-open-models-catching-up-nemotron-gpt55-cover.png"
draft: false
---

<p>オープンモデルを軽く見ることが、ますます難しくなっている。</p>
<p>長年、前提はシンプルだった。最強のモデルが欲しければ、クローズドな最前線のモデルを使う。オープンモデルは便利だが、主に実験やコスト削減、セルフホスティングのためのものだった。</p>
<p>その前提が崩れ始めている。</p>
<p>Token Station Arena を使い、NVIDIA が手がけるアメリカのオープンモデル <strong>NVIDIA Nemotron-3 Ultra 550B-A55B</strong> を、3 つの実際のコーディングエージェントのタスクで <strong>GPT-5.5</strong> と比較検証した。</p>
<figure><img src="artificial_analysis_intelligence_open_models.png" alt="Artificial Analysis Intelligence chart showing Nemotron 3 Ultra near leading frontier models"><figcaption>Artificial Analysis のインテリジェンス図表。Nemotron 3 Ultra が Artificial Analysis Intelligence Index で先頭の最前線モデルに迫っていることを示す。出典：Artificial Analysis、2026 年 6 月 8 日取得。</figcaption></figure>
<p>この位置づけは、私たちだけの見立てではない。Artificial Analysis Intelligence Index において Nemotron-3 Ultra は 47.7 を記録し、アメリカのオープンウェイトモデルの中で最高、Gemma 4 をはじめとする次点の米国オープンモデルを大きく引き離している。クローズドな最前線や最強の中国オープンモデルにはなお及ばないが、アメリカのオープンウェイトの中で肩を並べるものはない。</p>
<p>結果こそが核心だった。</p>
<blockquote>Nemotron-3 Ultra は GPT-5.5 と同じミニベンチマークのワークロードを完遂した。</blockquote>
<p>両モデルとも <strong>9 回中 9 回</strong> をパスした。</p>
<p>これは、あらゆるオープンモデルがあらゆるクローズドモデルに勝つという意味ではない。開発者や企業にとって、もっと重要なことを意味している。</p>
<blockquote>アメリカのオープンモデルはいまや、おもちゃのようなプロンプトだけでなく、実際のエージェントのワークロードで競えるほど強くなっている。</blockquote>
<p>本題に入る前に、利用についてひとこと。<strong>NVIDIA NIM は期間限定で Nemotron-3 Ultra の推論を無料提供している</strong>。そのため <strong><a href="https://models.bytefuture.ai">Token Station</a></strong> でも無料で利用できる。さらに <a href="https://models.bytefuture.ai/signup">Token Station に登録</a>するともらえる無料クレジットは GPT-5.5 や Claude Fable 5 にも使えるので、3 つすべてを自分のコーディングタスクで評価できる。</p>
<h2 id="why-this-matters">なぜこれが重要なのか</h2>
<p>オープン対クローズドのモデル論争は、かつてはおおむね理念的なものだった。</p>
<p>オープンモデルは開発者により多くの制御を与えた。クローズドモデルはたいてい高い性能を与えた。</p>
<p>前提をはっきりさせておく。クローズドな最前線はいまも大きく先行している。総合的な能力をリリース日で並べると、構図は鮮明だ。</p>
<figure><img src="overall_ai_capability_us_prc_elo.png" alt="Overall AI Capability (Elo) chart by release date: U.S. closed models lead, PRC open models trail on a lower line, and no American open models appear"><figcaption>リリース日別の総合 AI 能力（Elo）、米国対中国のモデル。出典：U.S. Center for AI Standards and Innovation。</figcaption></figure>
<p>この図で目を引く点が 2 つある。</p>
<p>第一に、<strong>オープンモデルは全体としていまだクローズドな最前線に後れを取っている</strong>。米国の先頭ラインに乗るモデル（GPT-5.5、GPT-5.4、Anthropic の Opus シリーズ、そして現在のクローズド最前線 SOTA である Claude Fable 5）はすべてクローズドだ。図に載るオープンウェイトモデル（DeepSeek、Qwen、Kimi）は、明らかに低いトレンドラインに位置し、Elo で数百点も後ろにいる。</p>
<p>第二に、そしてより印象的なのは、<strong>図にあるオープンモデルがすべて中国製だという点だ。アメリカのオープンモデルはどこにも見当たらない。</strong></p>
<p>そうした背景の中で、アメリカのオープンモデルが GPT-5.5 と同じコーディングエージェントのミニベンチマークのタスクをこなすことは、議論の流れを変える。</p>
<p>もはや問いはこうではない。</p>
<blockquote>オープンモデルは役に立つのか。</blockquote>
<p>より良い問いはこうだ。</p>
<blockquote>どのワークロードがいまもクローズドな最前線モデルを必要とし、どのワークロードが強力なオープンモデルで動かせるようになったのか。</blockquote>
<p>この区別は、実際のプロダクトにとって重要だ。</p>
<p>AI エージェントは単なるチャットボットではない。ファイルを読み、コードを書き換え、ツールを呼び出し、テストを実行し、失敗したステップを再試行し、長いワークフローをまたいで動く。この種の用途では、モデル選択は生の能力だけの話ではない。制御、コスト構造、可用性、そしてモデルを事業に合わせて適応させられるかどうかの問題でもある。</p>
<p>まさにそこで、オープンモデルは戦略的に重要になりつつある。</p>
<h2 id="the-model-we-tested">私たちが検証したアメリカのオープンモデル</h2>
<p>このミニベンチマークでのオープンモデルは <strong>NVIDIA Nemotron-3 Ultra 550B-A55B</strong> だった。</p>
<p>そのモデルの概要は次のとおり。</p>
<ul>
<li><strong>総パラメータ 5500 億</strong></li>
<li><strong>アクティブパラメータ 550 億</strong></li>
<li>MoE / latent-MoE 系のアーキテクチャ</li>
<li>アメリカの AI インフラ企業 NVIDIA が開発</li>
<li>NVIDIA NIM 経由で期間限定の無料推論、Token Station でも無料提供</li>
</ul>
<p>これは安いという理由だけで使われる小さなモデルではない。本格的な推論やエージェントのワークロードのために設計された、大型のアメリカ製オープンモデルだ。</p>
<p>GPT-5.5 は依然として先頭を走るクローズドな最前線モデルだ。強力で、洗練され、幅広く役立つ。Anthropic の最新フラッグシップであり、現在のクローズド最前線 SOTA を代表する <strong>Claude Fable 5</strong> も同様だ。このミニベンチマークではまだ直接対決の数値はないが、オープンモデルが追いかける基準の一部である。Nemotron-3 Ultra は別種の価値を体現する。モデルの特性がより透明で、デプロイの制御性がより高い、強力なオープンモデルだ。</p>
<p>開発者やビジネスにとって、それは重要だ。</p>
<h2 id="benchmark-setup">ミニベンチマークの構成</h2>
<p><strong><a href="https://github.com/hydai/token-station-arena">Token Station Arena</a></strong> を使い、コーディングエージェントのミニベンチマークを実行した。小さく的を絞ったテストであり、リーダーボードではない。ランナー、3 つのタスク、すべてのチェックがオープンソースなので、何を検証したかを正確に読み取り、自分で再現できる。</p>
<p>構成は次のとおり。</p>
<ul>
<li><strong>2 つのモデル</strong>：GPT-5.5 と NVIDIA Nemotron-3 Ultra 550B-A55B</li>
<li><strong>3 つのコーディングエージェントのタスク</strong></li>
<li><strong>モデルごと・タスクごとに 3 回実行</strong></li>
<li><strong>合計 18 回の実行</strong></li>
</ul>
<p>このミニベンチマークでは、ユニットテスト、型チェック、clippy、タスク固有の検証といった決定論的なチェックを用いた。</p>
<p>これは重要だ。コーディングエージェントは、答えがもっともらしく聞こえるかどうかだけで評価されるべきではないからだ。実際にコードを変更し、チェックをパスする必要がある。</p>
<h2 id="coding-agent-tasks">3 つのコーディングエージェントのタスク</h2>
<p>3 つのタスクはいずれも Arena リポジトリの <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks">benchmark/tasks</a> フォルダにある。各タスクは自己完結した Rust のフィクスチャプロジェクトに、プロンプトと機械的に検証可能な成功基準の一式が付いたものだ。どのタスクも <code>cargo test</code>、<code>cargo check</code>、<code>cargo clippy --all-targets -- -D warnings</code> をすべてパスする必要があり、タスクの許可されたパス以外のファイルを編集した実行はジャッジが不合格にする。そのためエージェントは、無関係な変更やテストの弱体化でパスすることはできない。</p>

<h3>1. <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks/add-api-endpoint">API エンドポイントを追加する</a></h3>
<p>このタスクは、既存のコードベースの中で通常のプロダクト開発の変更を行えるかどうかを試す。<code>catalog-core</code> ライブラリ crate と <code>catalog-api</code> Axum crate を含む小さな Rust ワークスペースだ。プロンプトはリポジトリから原文のまま引用する。</p>
<pre><code>- Add `GET /products/top?limit=&lt;n&gt;` to the Axum app.
- Return JSON products sorted by descending popularity.
- Respect the optional `limit` query parameter. If it is
  missing, return all products.
- Reuse existing catalog-core logic where possible.
- Do not remove or weaken the integration test.</code></pre>
<p>エージェントはプロジェクト構造を理解し、正しいルートやハンドラを見つけ、エンドポイントを追加し、期待されるレスポンスを返し、プロジェクトのチェックをパスし続けなければならない。これは開発者が日々こなす類のタスクだ。パズルではない。実務的なエンジニアリング作業だ。</p>

<h3>2. <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks/fix-failing-test">失敗しているテストを修正する</a></h3>
<p>このタスクはデバッグ能力を試す。フィクスチャには <code>catalog-core</code> の壊れた価格計算の実装と、失敗するユニットテストが含まれている。</p>
<pre><code>- Fix the failing pricing unit test in `catalog-core`.
- Preserve the public function names and signatures.
- Keep the implementation simple and idiomatic.
- Do not weaken, remove, or rewrite tests to hide the bug.</code></pre>
<p>エージェントは根本原因を特定し、実装を修正し、テスト自体には手を付けずにテストを再び通る状態に戻さなければならない。これが重要なのは、実際のコーディングエージェントは失敗から立ち直る必要があるからだ。すべてが整っていて明白なときにだけ新しいコードを書く、というわけにはいかない。</p>

<h3>3. <a href="https://github.com/hydai/token-station-arena/tree/master/benchmark/tasks/refactor-pricing">価格計算ロジックをリファクタリングする</a></h3>
<p>このタスクは、ビジネス上の挙動を変えずにコード構造を改善できるかどうかを試す。</p>
<pre><code>- Refactor the duplicated discount calculation in
  `catalog-core/src/pricing.rs`.
- Introduce one shared helper for computing the discount amount.
- Preserve all public function names, signatures, and behavior.
- Do not remove or weaken tests or the custom refactor check.</code></pre>
<p>標準のチェックに加えて、このタスクには 4 つ目の関門がある。重複が実際に解消されたかを検証する独自の <code>check-refactor.mjs</code> スクリプトだ。エージェントは価格計算のルールを保ちつつ、ユニットテスト、型チェック、clippy、そしてそのリファクタリング固有の検証をパスしなければならない。これは単純なコード生成のプロンプトよりも、実際の本番エンジニアリングに近い。モデルはコードとビジネスロジックの両方を理解する必要がある。</p>
<h2 id="results">結果</h2>
<table>
<tr><th>指標</th><th>GPT-5.5</th><th>NVIDIA Nemotron-3 Ultra 550B-A55B</th></tr>
<tr><td>完了した実行</td><td><strong>9/9</strong></td><td><strong>9/9</strong></td></tr>
<tr><td>ジャッジ平均スコア</td><td><strong>5.0</strong></td><td><strong>4.8</strong></td></tr>
</table>
<p>重要な結果はタスクの完遂率だ。</p>
<p>両モデルともすべての実行を完遂した。</p>
<p>これこそが、打ち出すべきシグナルだ。</p>
<blockquote>アメリカのオープンモデルが、GPT-5.5 と同じコーディングエージェントのワークロードを完遂した。</blockquote>
<p>開発者にとって、これは意味のある転換だ。オープンモデルはもはや次善の選択肢ではない。実際のエージェントシステムにとって本命の候補になりつつある。</p>
<h2 id="open-models-catching-up">オープンモデルが追い上げている</h2>
<p>より広い AI 市場は、マルチモデルの世界へと向かっている。</p>
<p>クローズドモデルは依然として重要だ。最前線を切り開くことが多く、価値の高い多くのタスクにとって優れた選択肢であり続ける。</p>
<p>だがオープンモデルは急速に追い上げている。実用的なコーディングや推論、エージェントのワークフローに十分な能力を備えつつある。さらに、クローズドモデルが常に提供できるとは限らない利点もある。</p>
<ul>
<li>デプロイ戦略をより制御できる</li>
<li>プライベートや社内のワークフローに適している</li>
<li>長期的なインフラ計画がより見通せる</li>
<li>カスタマイズの自由度が高い</li>
<li>単一のクローズドな提供元への依存が少ない</li>
</ul>
<p>Nemotron-3 Ultra がとりわけ重要なのは、それが NVIDIA によるアメリカのオープンモデルだからだ。AI の能力とインフラの制御の両方を重視する企業にとって、この組み合わせは戦略的に意味を持つ。</p>
<h2 id="what-this-means">これが Token Station にとって意味すること</h2>
<p>未来は、あらゆるタスクに一つのモデル、ではない。</p>
<p>クローズドな最前線モデルを必要とするワークロードもある。強力なオープンモデルで動かせるようになったワークロードもある。多くのチームは、本番で何を使うかを決める前に、両方を試したいと考えるだろう。</p>
<p>だからこそ <strong>Token Station</strong>（<a href="https://models.bytefuture.ai">models.bytefuture.ai</a>）が存在する。</p>
<p>Token Station を使えば、開発者は Nemotron-3 Ultra や GPT-5.5 など、最前線のモデルに一つのプラットフォームからアクセスできる。ブランド名や思い込みで選ぶのではなく、自分のワークロードでモデルを比較できる。</p>
<p>狙いは、唯一絶対の勝者を宣言することではない。</p>
<p>狙いは、モデル選択を実践的なものにすることだ。</p>
<h2 id="try-it">自分で実行してみる</h2>
<p>アメリカのオープンモデルは、クローズドな最前線モデルに追いついてきている。</p>
<p>Nemotron-3 Ultra が私たちのコーディングエージェントのミニベンチマークで GPT-5.5 と肩を並べたことは、モデルの勢力図が変わりつつあることを示すもう一つの兆しだ。</p>
<p>しかも、私たちの言葉をうのみにする必要はない。ミニベンチマーク一式は Anthropic 互換のゲートウェイなら何にでも対して走るので、<a href="https://models.bytefuture.ai/signup">Token Station のキー</a>と、PATH に通した <code>claude</code> CLI があれば、私たちの実行を再現するのに必要なのは 4 つのコマンドだ。</p>
<pre><code>git clone https://github.com/hydai/token-station-arena
cd token-station-arena

# point the runner at Token Station (gateway root, no /v1)
export ANTHROPIC_BASE_URL=https://models.bytefuture.ai
export ANTHROPIC_AUTH_TOKEN=&lt;your Token Station API key&gt;

# run all three tasks against the configured models
cargo run --release -- benchmark --tasks all --models all --runs 3</code></pre>
<p>ランナーは各タスクを隔離されたフィクスチャ内で実行し、決定論的なチェックを適用し、実行ごとのトークン数・コスト・所要時間を記した Markdown レポートを生成する。<code>benchmark/tasks/</code> に自分のタスク（フィクスチャ、<code>prompt.md</code>、<code>task.yml</code>）を置けば、私たちのコードではなく<em>あなた</em>のコードでこれらのモデルがどう振る舞うかを確かめられる。</p>
<p><strong><a href="https://models.bytefuture.ai">Token Station</a></strong> で Nemotron-3 Ultra（NVIDIA NIM 提供により期間限定で無料）を、GPT-5.5 や Claude Fable 5、その他の最前線モデルと並べて試してみてほしい。</p>
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
