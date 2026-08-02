---
slug: "use-any-model-in-claude-code-through-token-station"
lang: "ja"
title: "Token Station 経由で Claude Code に任意のモデルを使う"
summary: "Claude Code は Token Station 経由で任意のモデルを使える。~/.claude/settings.json に保存する方法と、ANTHROPIC_* 環境変数を一時的に export する方法を示し、base URL、Token、Opus/Sonnet/Haiku/subagent のモデル設定を pong コマンドで検証する。"
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/use-any-model-in-claude-code-through-token-station-cover.png"
draft: false
---

<p>Claude Code は、追加のラッパーやプロキシなしで <a href="https://models.bytefuture.ai">Token Station</a> に接続できる。Claude Code の接続先を <code>https://models.bytefuture.ai</code> に向け、<a href="https://models.bytefuture.ai">Token Station</a> のキーを Anthropic auth token として使い、Opus、Sonnet、Haiku、subagent の各リクエストにどの <a href="https://models.bytefuture.ai">Token Station</a> モデルを使うかを指定する。</p>

  <p>設定方法は 2 つある。シェルをまたいで永続化したいなら <code>~/.claude/settings.json</code> を使う。一時的なセッション、CI ジョブ、または 1 回限りのテストなら、環境変数を export するだけでよい。</p>

  <h2 id="settings-json">方法 1：永続的な settings.json</h2>

  <p>Claude Code の設定ディレクトリを作り、<code>~/.claude/settings.json</code> に環境変数ブロックを書き込む：</p>

  <pre><code>mkdir -p ~/.claude
cat &gt; ~/.claude/settings.json &lt;&lt;'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://models.bytefuture.ai",
    "ANTHROPIC_AUTH_TOKEN": "YOUR TOKEN AT TOKEN STATION",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "openai/gpt-5.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "openai/gpt-5.4-mini",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "openai/gpt-5.4-nano",
    "CLAUDE_CODE_SUBAGENT_MODEL": "openai/gpt-5.4-mini"
  }
}
EOF</code></pre>

  <p>次に、最小のプロンプトで CLI が <a href="https://models.bytefuture.ai">Token Station</a> を使っているか確認する：</p>

  <pre><code>claude -p "Respond with exactly the word: pong"</code></pre>

  <p>出力がちょうど <code>pong</code> なら、Claude Code は <a href="https://models.bytefuture.ai">Token Station</a> に到達し、設定したモデルが応答している。</p>

  <h2 id="shell-env">方法 2：一時的な shell export</h2>

  <p>設定ファイルを書きたくない場合は、Claude Code を起動する同じ shell で同じ値を export する：</p>

  <pre><code>export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="YOUR TOKEN AT TOKEN STATION"

export ANTHROPIC_DEFAULT_OPUS_MODEL="openai/gpt-5.5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.4-mini"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="openai/gpt-5.4-nano"
export CLAUDE_CODE_SUBAGENT_MODEL="openai/gpt-5.4-mini"

claude -p "Respond with exactly the word: pong"</code></pre>

  <p>保存済みの Claude Code 設定を変えずに、別のモデル割り当てを試したいときに向いている。</p>

  <h2 id="what-each-variable-does">各変数の意味</h2>

  <table>
    <tr><th>変数</th><th>意味</th></tr>
    <tr><td><code>ANTHROPIC_BASE_URL</code></td><td>Claude Code がリクエストを送る API エンドポイント。<a href="https://models.bytefuture.ai">Token Station</a> では <code>https://models.bytefuture.ai</code> を使う。</td></tr>
    <tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td><a href="https://models.bytefuture.ai">Token Station</a> の API キー。ソース管理には入れない。</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>Opus クラスのリクエストに使うモデル。</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>Sonnet クラスのリクエストに使うモデル。</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>Haiku クラスのリクエストに使うモデル。</td></tr>
    <tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>Claude Code の subagent に使うモデル。</td></tr>
  </table>

  <h2 id="choosing-models">モデルの選び方</h2>

  <p>上のモデル ID は単なる割り当てだ。Claude Code の各スロットを別々の <a href="https://models.bytefuture.ai">Token Station</a> モデルに向けてもよいし、すべて同じモデルにしてもよい。実用的な初期値は、Opus に強いモデルを置き、Sonnet、Haiku、subagent にはより速く安いモデルを置くことだ。</p>

  <p><a href="https://models.bytefuture.ai">Token Station</a> での出発点として使いやすいモデル：</p>

  <table>
    <tr><th>Claude Code スロット</th><th><a href="https://models.bytefuture.ai">Token Station</a> モデル</th><th>使う理由</th></tr>
    <tr><td><code>Opus</code></td><td><code>openai/gpt-5.5</code></td><td>難しい設計、デバッグ、アーキテクチャ、長い編集の強い既定値。</td></tr>
    <tr><td><code>Sonnet</code></td><td><code>openai/gpt-5.4-mini</code></td><td>日常的なコーディング、レビュー、リポジトリ調査、リファクタリング向けのバランス型。</td></tr>
    <tr><td><code>Haiku</code></td><td><code>openai/gpt-5.4-nano</code></td><td>短いプロンプト、素早い確認、低コスト・低レイテンシのタスク向け。</td></tr>
    <tr><td><code>Subagent</code></td><td><code>openai/gpt-5.4-mini</code></td><td>委任された調査に十分強く、すべてのサブタスクをフラッグシップ価格にしない。</td></tr>
    <tr><td><code>Alternative Opus</code></td><td><code>anthropic/claude-opus-4-8</code></td><td>長期的なコーディングで Claude 系の挙動を明確に使いたいとき。</td></tr>
    <tr><td><code>Budget coding</code></td><td><code>kimi/kimi-k2.7-code</code></td><td>最大の推論深度よりコストを重視する定型的な実装作業に向く。</td></tr>
  </table>

  <p>これらの model ID は、上の対応する <code>ANTHROPIC_DEFAULT_*</code> 変数にそのまま入れられる。まずは設定ブロックのバランス型の割り当てから始め、タスクが本当に必要とするときだけ Opus を上げる、または Haiku をさらに安いモデルへ下げるとよい。</p>

  <h2 id="troubleshooting">うまくつながらないとき</h2>

  <ul>
    <li><strong>まだ既定の Anthropic エンドポイントを使う。</strong><code>ANTHROPIC_BASE_URL</code> が <code>claude</code> を起動する shell にあるか、または <code>~/.claude/settings.json</code> に入っているか確認する。</li>
    <li><strong>401 / 認証エラー。</strong><code>YOUR TOKEN AT TOKEN STATION</code> を実際の <a href="https://models.bytefuture.ai">Token Station</a> キーに置き換える。</li>
    <li><strong>違うモデルが応答する。</strong>Opus、Sonnet、Haiku、subagent のモデル変数を確認する。Claude Code はリクエスト種別に応じてこれらのスロットを選ぶ。</li>
    <li><strong>settings ファイルが効かない。</strong><code>~/.claude/settings.json</code> が正しい JSON であることを確認し、編集後に Claude Code コマンドを実行し直す。</li>
  </ul>

  <h2 id="wrap">はじめよう</h2>

  <p>恒久的に使うなら <code>~/.claude/settings.json</code>。一時的に使うなら現在の shell で変数を export する。どちらの場合も確認方法は同じで、<code>claude -p "Respond with exactly the word: pong"</code> を実行し、<code>pong</code> が返るかを見る。</p>

  <p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a> で登録し（無料クレジット 1 ドル、カード不要、初回チャージで最大 50 ドルのボーナス）、<a href="https://models.bytefuture.ai">Token Station</a> キーを Claude Code に入れ、Claude Code の各モデルスロットを実際に使いたいモデルへ向けよう。</p>
