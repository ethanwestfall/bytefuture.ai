---
slug: "use-grok-build-in-codex-and-claude-code"
lang: "ko"
title: "Codex와 Claude Code에서 Grok Build 사용하는 방법"
summary: "xAI의 Grok Build 모델은 빠르게 진화하며 가격은 GPT-5.5나 Claude Fable 5의 일부에 불과하다. Token Station 무료 크레딧으로 Claude Code나 Codex에서 실행하자. xAI 계정은 필요 없다."
category: "tutorial"
date: "2026-06-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-code-grok-build.png"
draft: false
---

<p>Grok Build은 xAI의 코딩 <strong>모델</strong>입니다. 이름은 <code>grok-build-0.1</code>이며 <a href="https://docs.x.ai/docs/models/grok-build-0.1">모델 카드</a>에 자세히 나와 있습니다. 같은 이름을 쓰는 xAI의 코딩 도구 <em>Grok Build CLI</em>와 혼동하지 마세요. 이 글에서 다루는 것은 모델입니다. 발전이 빨라서 릴리스마다 실제 코딩 작업에서 눈에 띄게 좋아지고 있으며, 가격은 <strong>입력 100만 토큰당 1달러, 출력 100만 토큰당 2달러</strong>로 GPT-5.5나 Claude Fable 5 같은 프런티어 플래그십의 극히 일부에 불과합니다.</p>

<p>빠르게 좋아지면서 가격은 극히 일부인 모델, 바로 시험해 볼 만한 대상입니다. 하지만 모델 하나 테스트하려고 도구를 바꾸고 싶은 사람은 거의 없습니다. xAI의 답은 자사 Grok Build CLI지만, 대부분의 개발자는 이미 매일 쓰는 도구, 즉 <strong>Claude Code</strong>나 <strong>Codex</strong> 안에 그 모델을 그냥 넣고 싶어 합니다. 바로 여기서 문제가 시작됩니다. 둘 다 xAI의 API와 직접 통신할 수 없습니다. 문제는 API 형식에 그치지 않습니다. 예를 들어 Codex는 xAI 엔드포인트가 인식하지 못하는 내장 도구 이름과 파라미터를 붙여 도구 호출을 보내기 때문에, 모델이 프롬프트를 보기도 전에 요청이 실패합니다.</p>

<p><a href="https://models.bytefuture.ai/signup">Token Station</a>은 당신의 코딩 에이전트와 xAI 사이에 자리 잡고, 네 가지로 이 간극을 메웁니다.</p>

<ul>
<li><strong>Grok Build에 쓸 수 있는 무료 크레딧.</strong> 가입 시 받는 1달러를 Grok Build에 쓸 수 있습니다. 카드도, 구독도 필요 없습니다.</li>
<li><strong>xAI 계정 불필요.</strong> 별도의 xAI 계정을 만들고 충전하는 과정을 건너뜁니다. Token Station 키 하나면 충분합니다.</li>
<li><strong>Claude Code: API 변환.</strong> Claude Code는 Anthropic의 Messages API로 말합니다. Token Station은 그 요청을 xAI 엔드포인트가 기대하는 형식으로 변환하고, 응답을 다시 되돌려 변환합니다.</li>
<li><strong>Codex: 도구 및 파라미터 이름 변환.</strong> Codex의 내장 도구 호출은 xAI가 인식하지 못하는 이름과 파라미터를 씁니다. Token Station은 이를 양방향으로 다시 써서 도구 호출이 실제로 작동하게 합니다.</li>
</ul>

<p>직접 무언가를 패치할 필요 없이 Grok Build을 Codex나 Claude Code에서 실행할 수 있습니다. 이 튜토리얼은 두 가지 설정을 모두 다룹니다. 각각 약 2분이면 됩니다.</p>

<h2 id="what-you-need">준비물</h2>

<ul>
<li>Token Station 계정 (<a href="https://models.bytefuture.ai/signup">무료 가입</a>, 1달러 크레딧 제공, 카드 불필요)</li>
<li>Token Station API 키 (<code>gw-</code>로 시작)</li>
<li>Claude Code 또는 Codex 설치 완료</li>
</ul>

<h2 id="claude-code-setup">Claude Code 설정</h2>

<p>Claude Code는 설정을 환경 변수에서 읽습니다. 모든 모델 슬롯을 Token Station을 통해 Grok Build로 라우팅하려면 실행 전에 다음을 설정하세요.</p>

<pre><code># Token Station endpoint + auth
export ANTHROPIC_BASE_URL="https://models.bytefuture.ai"
export ANTHROPIC_AUTH_TOKEN="gw-YOUR_TOKEN_STATION_KEY"

# Route every Claude Code model slot to Grok Build
export ANTHROPIC_DEFAULT_OPUS_MODEL="xai/grok-build-0.1"
export ANTHROPIC_DEFAULT_SONNET_MODEL="xai/grok-build-0.1"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="xai/grok-build-0.1"
export CLAUDE_CODE_SUBAGENT_MODEL="xai/grok-build-0.1"

# Launch
claude --model "xai/grok-build-0.1"</code></pre>

<figure><img src="claude-code-grok-build.png" alt="Claude Code terminal showing Grok Build model xai/grok-build-0.1 running and responding to prompts"><figcaption>Token Station을 통해 Grok Build을 실행하는 Claude Code. 모델이 xai/grok-build-0.1로 구동되고 있음을 확인합니다.</figcaption></figure>

<p>설정은 이게 전부입니다. Claude Code는 모든 요청을 Token Station을 통해 보내고, Token Station이 이를 xAI 엔드포인트에 맞게 변환합니다. 도구 호출, 스트리밍, 멀티턴 대화가 모두 작동합니다.</p>

<h3>각 환경 변수의 역할</h3>

<table>
<tr><th>변수</th><th>역할</th></tr>
<tr><td><code>ANTHROPIC_BASE_URL</code></td><td>Claude Code를 Anthropic의 API 대신 Token Station으로 향하게 함</td></tr>
<tr><td><code>ANTHROPIC_AUTH_TOKEN</code></td><td>당신의 Token Station API 키</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_OPUS_MODEL</code></td><td>Opus 모델 슬롯을 Grok Build으로 교체</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_SONNET_MODEL</code></td><td>Sonnet 모델 슬롯을 Grok Build으로 교체</td></tr>
<tr><td><code>ANTHROPIC_DEFAULT_HAIKU_MODEL</code></td><td>Haiku 모델 슬롯을 Grok Build으로 교체</td></tr>
<tr><td><code>CLAUDE_CODE_SUBAGENT_MODEL</code></td><td>서브에이전트 호출도 Grok Build으로 라우팅</td></tr>
</table>

<p>자유롭게 조합할 수 있습니다. 예를 들어 메인 모델은 Sonnet으로 두고, 비용 절감을 위해 서브에이전트만 Grok Build으로 라우팅할 수도 있습니다.</p>

<h2 id="codex-setup">Codex 설정</h2>

<p>Codex는 TOML 설정 파일을 사용합니다. 두 개의 명령으로 만들 수 있습니다.</p>

<pre><code>mkdir -p ~/.codex
cat > ~/.codex/config.toml &lt;&lt;'EOF'
model = "xai/grok-build-0.1"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

<p>그런 다음 API 키를 설정하고 실행합니다.</p>

<pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

<figure><img src="codex-grok-build.png" alt="OpenAI Codex terminal showing model set to xai/grok-build-0.1 via Token Station"><figcaption>Token Station을 통해 Grok Build을 실행하는 Codex. model 필드가 xai/grok-build-0.1이 활성화되어 있음을 확인합니다.</figcaption></figure>

<p>이제 Codex는 모든 요청에 Grok Build을 사용합니다. Token Station이 API 변환을 처리하며, 여기에는 그것이 없으면 Codex가 xAI에 직접 연결할 때 실패하게 만드는 도구 및 파라미터 이름 재작성도 포함됩니다.</p>

<h2 id="why-you-need-a-gateway">왜 여기에 게이트웨이가 필요한가</h2>

<p>이런 의문이 들 수 있습니다. 그냥 Codex를 xAI의 API로 바로 향하게 하면 안 되나?</p>

<p>두 가지 이유가 있습니다.</p>

<ol>
<li><strong>API 형식 불일치.</strong> Claude Code는 Anthropic의 Messages API로 말하고, Codex는 OpenAI의 Responses API 형식으로 요청을 보냅니다. xAI 엔드포인트는 둘 중 어느 것과도 다른 구조를 기대합니다. Token Station은 둘 다 변환합니다. 요청은 들어가고, 응답은 나옵니다.</li>
<li><strong>도구 및 파라미터 이름 변환.</strong> Codex는 xAI가 인식하지 못하는 이름과 파라미터로 내장 도구 호출을 보냅니다. Token Station은 이를 다시 써서 모델이 실제로 도구를 쓸 수 있게 합니다. 이것이 없으면 Codex 도구 호출은 조용히 실패하거나 오류를 냅니다.</li>
</ol>

<p>이것은 이론상의 문제가 아닙니다. Codex를 Grok Build에 직접 연결하려는 개발자는 첫 도구 호출에서 알 수 없는 오류에 부딪힙니다.</p>

<h2 id="try-it">직접 해보기</h2>

<p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a>에서 가입하면 1달러의 무료 크레딧을 받습니다. 카드도, 구독도, 만들고 충전할 xAI 계정도 필요 없습니다. 첫 충전 시 최대 50달러의 보너스 크레딧이 더해집니다. 이 무료 크레딧은 Grok Build, GPT-5.5, Claude, Gemini를 비롯해 200개 이상을 포함한 플랫폼의 모든 모델에서 쓸 수 있습니다. 게다가 Grok Build은 토큰당 비용이 프런티어 플래그십의 극히 일부라서, 이 크레딧은 오래갑니다.</p>

<p>2분 설정. 그러면 Grok Build으로 코딩하게 됩니다. 그리고 Grok Build이 맞지 않더라도, 1달러 크레딧은 플랫폼의 다른 모든 모델에서 쓸 수 있습니다.</p>

      <hr />

      <!-- Share -->
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
