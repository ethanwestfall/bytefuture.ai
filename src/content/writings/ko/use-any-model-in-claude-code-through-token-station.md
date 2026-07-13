---
slug: "use-any-model-in-claude-code-through-token-station"
lang: "ko"
title: "Token Station을 통해 Claude Code에서 어떤 모델이든 사용하기"
summary: "Claude Code는 Token Station을 통해 어떤 모델이든 사용할 수 있다. ~/.claude/settings.json에 저장하는 방법과 ANTHROPIC_* 환경 변수를 임시로 export하는 방법, base URL, token, Opus/Sonnet/Haiku/subagent 모델 설정, pong 검증 명령을 다룬다."
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

<p>Claude Code는 별도 래퍼나 프록시 없이 <a href="https://models.bytefuture.ai">Token Station</a>에 연결할 수 있다. Claude Code의 요청 주소를 <code>https://models.bytefuture.ai</code>로 향하게 하고, <a href="https://models.bytefuture.ai">Token Station</a> 키를 Anthropic auth token으로 사용한 뒤, Opus, Sonnet, Haiku, subagent 요청에 어떤 <a href="https://models.bytefuture.ai">Token Station</a> 모델을 쓸지 지정하면 된다.</p>

  <p>방법은 두 가지다. 셸을 넘어 계속 유지하려면 <code>~/.claude/settings.json</code>을 사용한다. 임시 세션, CI 작업, 한 번만 하는 테스트라면 환경 변수를 export하면 된다.</p>

  <h2 id="settings-json">방법 1: 영구 settings.json</h2>

  <p>Claude Code 설정 디렉터리를 만들고 <code>~/.claude/settings.json</code>에 환경 변수 블록을 쓴다:</p>

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

  <p>그런 다음 최소 프롬프트로 CLI가 <a href="https://models.bytefuture.ai">Token Station</a>을 쓰는지 확인한다:</p>

  <pre><code>claude -p "Respond with exactly the word: pong"</code></pre>

  <p>출력이 정확히 <code>pong</code>이면 Claude Code가 <a href="https://models.bytefuture.ai">Token Station</a>에 도달했고, 설정한 모델이 응답하고 있는 것이다.</p>

  <h2 id="shell-env">방법 2: 임시 shell export</h2>

  <p>설정 파일을 쓰고 싶지 않다면, Claude Code를 실행할 같은 shell에서 같은 값을 export한다:</p>

  <pre><code>export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="YOUR TOKEN AT TOKEN STATION"

export ANTHROPIC_DEFAULT_OPUS_MODEL="openai/gpt-5.5"
export ANTHROPIC_DEFAULT_SONNET_MODEL="openai/gpt-5.4-mini"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="openai/gpt-5.4-nano"
export CLAUDE_CODE_SUBAGENT_MODEL="openai/gpt-5.4-mini"

claude -p "Respond with exactly the word: pong"</code></pre>

  <p>저장된 Claude Code 설정을 바꾸지 않고 다른 모델 매핑을 시험할 때 유용하다.</p>

  <h2 id="what-each-variable-does">각 변수의 의미</h2>

  <table>
    <tr><th>변수</th><th>의미</th></tr>
    <tr><td><code>ANTHROPIC_BASE_URL</code></td><td>Claude Code가 요청을 보내는 API 엔드포인트. <a href="https://models.bytefuture.ai">Token Station</a>에서는 <code>https://models.bytefuture.ai</code>를 사용한다.</td></tr>
    <tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td><a href="https://models.bytefuture.ai">Token Station</a> API 키. 소스 관리에 넣지 않는다.</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>Opus급 요청에 Claude Code가 사용할 모델.</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>Sonnet급 요청에 Claude Code가 사용할 모델.</td></tr>
    <tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>Haiku급 요청에 Claude Code가 사용할 모델.</td></tr>
    <tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>Claude Code subagent가 사용할 모델.</td></tr>
  </table>

  <h2 id="choosing-models">모델 고르기</h2>

  <p>위의 모델 ID는 단순한 매핑이다. Claude Code의 각 슬롯을 서로 다른 <a href="https://models.bytefuture.ai">Token Station</a> 모델로 향하게 할 수도 있고, 모두 같은 모델로 둘 수도 있다. 실용적인 기본값은 Opus에는 강한 모델을, Sonnet, Haiku, subagent에는 더 빠르고 저렴한 모델을 두는 것이다.</p>

  <p><a href="https://models.bytefuture.ai">Token Station</a>에서 시작점으로 쓰기 좋은 모델:</p>

  <table>
    <tr><th>Claude Code 슬롯</th><th><a href="https://models.bytefuture.ai">Token Station</a> 모델</th><th>쓰는 이유</th></tr>
    <tr><td><code>Opus</code></td><td><code>openai/gpt-5.5</code></td><td>어려운 계획, 디버깅, 아키텍처, 긴 편집에 적합한 강한 기본값.</td></tr>
    <tr><td><code>Sonnet</code></td><td><code>openai/gpt-5.4-mini</code></td><td>일상 코딩, 리뷰, 저장소 탐색, 리팩터링에 알맞은 균형형 주력 모델.</td></tr>
    <tr><td><code>Haiku</code></td><td><code>openai/gpt-5.4-nano</code></td><td>짧은 프롬프트, 빠른 확인, 저비용·저지연 작업에 적합.</td></tr>
    <tr><td><code>Subagent</code></td><td><code>openai/gpt-5.4-mini</code></td><td>위임된 조사를 처리하기에 충분하면서 모든 하위 작업을 플래그십 가격으로 만들지 않는다.</td></tr>
    <tr><td><code>Alternative Opus</code></td><td><code>anthropic/claude-opus-4-8</code></td><td>장기 코딩에서 Claude 계열의 동작을 명확히 원할 때 사용.</td></tr>
    <tr><td><code>Budget coding</code></td><td><code>kimi/kimi-k2.7-code</code></td><td>최대 추론 깊이보다 비용이 더 중요한 일반 구현 작업에 적합.</td></tr>
  </table>

  <p>이 model ID들은 위의 해당 <code>ANTHROPIC_DEFAULT_*</code> 변수에 그대로 넣을 수 있다. 먼저 설정 블록의 균형 잡힌 매핑으로 시작하고, 작업이 정말 요구할 때만 Opus를 올리거나 Haiku를 더 저렴한 모델로 낮추면 된다.</p>

  <h2 id="troubleshooting">연결이 안 될 때</h2>

  <ul>
    <li><strong>여전히 기본 Anthropic 엔드포인트를 쓴다.</strong> <code>ANTHROPIC_BASE_URL</code>이 <code>claude</code>를 실행하는 shell에 있거나 <code>~/.claude/settings.json</code> 안에 있는지 확인하라.</li>
    <li><strong>401 / 인증 오류.</strong> <code>YOUR TOKEN AT TOKEN STATION</code>을 실제 <a href="https://models.bytefuture.ai">Token Station</a> 키로 바꿔라.</li>
    <li><strong>다른 모델이 응답한다.</strong> Opus, Sonnet, Haiku, subagent 모델 변수를 확인하라. Claude Code는 요청 유형에 따라 이 슬롯들 중 하나를 선택한다.</li>
    <li><strong>settings 파일이 적용되지 않는 것 같다.</strong> <code>~/.claude/settings.json</code>이 올바른 JSON인지 확인하고, 수정 후 Claude Code 명령을 다시 실행하라.</li>
  </ul>

  <h2 id="wrap">시작하기</h2>

  <p>영구 설정에는 <code>~/.claude/settings.json</code>을 쓰고, 임시 설정에는 현재 shell에서 변수를 export하면 된다. 두 경우 모두 확인 방법은 같다. <code>claude -p "Respond with exactly the word: pong"</code>을 실행하고 <code>pong</code>이 돌아오는지 보면 된다.</p>

  <p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a>에서 가입하고($1 무료 크레딧, 카드 불필요, 첫 충전 시 최대 50달러 보너스), <a href="https://models.bytefuture.ai">Token Station</a> 키를 Claude Code에 넣은 뒤 Claude Code의 모델 슬롯들을 실제로 쓰고 싶은 모델에 연결하라.</p>

      <hr />

      <!-- Share (leave exactly as-is; the buttons fire share_click GA events) -->
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <span style="font-family:'Space Grotesk',sans-serif; font-size:14px; color:#71717a;">이 글 공유하기</span>
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
        <a href="#" onclick="gtag('event','share_click',{label:'copy_link'});var b=this;navigator.clipboard.writeText(location.href).then(function(){var s=b.querySelector('.share-label');s.textContent='복사됨!';setTimeout(function(){s.textContent='링크 복사';},1500);});return false;" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid #e4e4e7; border-radius:50px; text-decoration:none; color:#18181b; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:500; transition:border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='#18181b'" onmouseout="this.style.borderColor='#e4e4e7'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
          <span class="share-label">링크 복사</span>
        </a>
      </div>
