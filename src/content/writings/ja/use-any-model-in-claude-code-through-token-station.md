---
slug: "use-any-model-in-claude-code-through-token-station"
lang: "ja"
title: "Token Station 経由で Claude Code に任意のモデルを使う"
summary: "Claude Code は Token Station 経由で任意のモデルを使える。~/.claude/settings.json に保存する方法と、ANTHROPIC_* 環境変数を一時的に export する方法を示し、base URL、Token、Opus/Sonnet/Haiku/subagent のモデル設定を pong コマンドで検証する。"
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
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
