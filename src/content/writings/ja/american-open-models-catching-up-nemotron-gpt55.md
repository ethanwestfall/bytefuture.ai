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
