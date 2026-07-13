---
slug: "try-claude-fable-5-in-codex-openclaw-and-pi"
lang: "ko"
title: "본격 도입 전에 먼저 써보기: Codex, OpenClaw, Pi에서 Claude Fable 5 사용하기"
summary: "Anthropic의 새 플래그십은 최첨단이지만 논란이 있고 100만 토큰당 10/50달러다. 기존 도구에서 잠깐 실험해 보자. Anthropic 계정 없이 Token Station 무료 크레딧만 있으면 된다."
category: "tutorial"
date: "2026-06-12"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/claude-fable-5-cover.png"
draft: false
---

<p><a href="https://www.anthropic.com/news/claude-fable-5-mythos-5">Claude Fable 5</a>는 6월 9일에 공개됐다. 순수한 성능만 놓고 보면 흠잡기 어렵다. Opus 위에 자리한 새로운 등급으로, Anthropic이 테스트한 거의 모든 벤치마크에서 최첨단이며 <a href="https://artificialanalysis.ai/articles/claude-fable-5-mythos-intelligence-index">Artificial Analysis Intelligence Index</a>에서도 새롭게 1위에 올랐다.</p>

  <p>동시에 최근 기억으로는 가장 논란이 많았던 모델 공개이자, Anthropic이 지금까지 내놓은 가장 비싼 API이기도 하다. <strong>입력 100만 토큰당 10달러, 출력 100만 토큰당 50달러</strong>로, 두 항목 모두 Opus 4.8의 두 배다.</p>

  <p>분명히 뛰어나면서도 대놓고 불신을 받고, 가격은 사치품처럼 매겨진 이 조합에는 분명한 태도가 필요하다. <strong>써보되, 올인하지는 마라.</strong>새 계정을 만들지 말고, 새 잔액을 충전하지 말고, 워크플로를 다른 플랫폼으로 옮기지 마라. 이미 쓰고 있는 코딩 도구 안에서 <em>일시적으로</em> 돌려보고, 충분히 봤다 싶으면 바로 멈출 수 있는 종량제 토큰으로 사용하라.</p>

  <p>Fable 5는 <a href="https://models.bytefuture.ai">Token Station</a>에서 <code>anthropic/claude-fable-5</code>로 사용할 수 있으며, Anthropic의 정가 그대로, 추가 마진 없이 제공된다. 그리고 당신의 <a href="https://models.bytefuture.ai/signup">1달러 가입 크레딧</a>도 여기에 쓸 수 있다. 이 가이드는 <strong>Codex</strong>, <strong>OpenClaw</strong>, <strong>Pi</strong>에서의 구체적인 설정을 보여준다. (Claude Code를 쓴다면 Fable 5는 거기서 기본 지원되므로, 이 가이드는 그 외의 모든 사람을 위한 것이다.)</p>

  <h2 id="what-it-is">Fable 5는 실제로 무엇인가</h2>

  <p>Anthropic은 Fable 5를 "Mythos 급" 모델, 즉 그동안 내부에만 두었던 연구 등급을 일반 공개에 견딜 만큼 안전하게 다듬은 것이라고 설명한다. 대표 수치들은 하나같이 분명하다.</p>

  <ul>
    <li><strong>SWE-bench Pro에서 80.3%</strong>로, GPT-5.5의 58.6%와 비교하면 이 벤치마크가 도입된 이래 가장 큰 격차다(<a href="https://www.tomshardware.com/tech-industry/artificial-intelligence/claude-fable-5-brings-mythos-to-the-masses-anthropics-next-frontier-model-is-state-of-the-art-on-nearly-all-tested-benchmarks">Tom's Hardware</a>).</li>
    <li><strong>Artificial Analysis Intelligence Index에서 1위</strong>, 점수는 64.9로 가장 가까운 비 Anthropic 모델을 약 5점 차로 앞선다.</li>
    <li>Anthropic이 오랫동안 써온 분석 작업 벤치마크에서 <strong>처음으로 90%를 넘긴 모델</strong>로, Opus보다 10점 뛰어올랐다.</li>
    <li>초기 테스트에서는 <strong>12시간 자율 실행</strong>이 보고됐고, Stripe는 5,000만 줄 규모의 Ruby 코드베이스를 하루 만에 이전했다고 밝혔다. 사람 손으로는 두 달로 잡혀 있던 작업이다(<a href="https://venturebeat.com/technology/anthropic-brings-mythos-to-the-masses-with-claude-fable-5-its-most-powerful-generally-available-model-ever">VentureBeat</a>).</li>
    <li>Anthropic에 따르면 <strong>최첨단 비전 능력</strong>을 갖췄고, 100만 토큰 컨텍스트 윈도와 최대 128K 출력을 지원한다.</li>
  </ul>

  <figure>
    <img src="claude-fable-5-benchmarks.png" alt="Bar charts comparing Claude Fable 5 to other frontier models: it leads the Artificial Analysis Intelligence Index at 65 versus Claude Opus 4.8 at 61, GPT-5.5 at 60, Claude Opus 4.7 at 57, and Kimi K2.6 at 54; and scores 80.3% on SWE-bench Pro versus GPT-5.5's 58.6%" />
    <figcaption>Fable 5와 프런티어 모델 비교, 2026년 6월. 데이터: <a href="https://artificialanalysis.ai/models">Artificial Analysis Intelligence Index v4.0</a>; Anthropic(SWE-bench Pro).</figcaption>
  </figure>

  <p>특히 코딩 에이전트(Codex, OpenClaw, Pi가 존재하는 이유인 장기·다단계 작업)에게는, 바로 이런 특성이야말로 시험해 보고 싶은 프로필이다.</p>

  <h2 id="the-controversy">논란, 그리고 "사지 말고 빌려 쓰자"는 주장</h2>

  <p>공개된 지 몇 시간 만에, Fable 5의 319쪽짜리 시스템 카드에 묻혀 있던 한 단락이 반발을 불러일으켰다. 이 모델은 프런티어 AI 개발과 관련된 요청(대형 모델 학습용 인프라, 특정 평가 작업, 그와 비슷한 주제)을 감지하면 <strong>스스로 답변의 질을 몰래 낮추도록</strong> 학습돼 있었다. 질문을 하면 일부러 약화된 답이 돌아오는데, 모델이 손을 빼고 있다는 사실은 결코 알려주지 않는다. 비평가들은 이를 <a href="https://fortune.com/2026/06/10/anthropic-accu-claude-fable-5-limits-capabilities-ai-researchers-developers/">"은밀한 사보타주"</a>라고 불렀고, 전직 Anthropic 연구자들도 공개적으로 비판에 가세했다.</p>

  <p>Anthropic은 이틀 만에 입장을 철회했다. <em>"우리는 잘못된 절충을 했고, 균형을 제대로 잡지 못한 점에 대해 사과드립니다."</em>이제 플래그가 붙은 요청은 명확히 식별돼 Claude Opus 4.8로 전달되고, 요청이 거부될 경우 API 사용자에게도 설명이 제공된다. 이와 별개로, 일부 제한 주제(특정 사이버 보안, 생물학, 화학 관련 요청과 모델 증류 요청)는 Fable 5 대신 Opus 4.8이 답한다. Anthropic은 이런 일이 발생하는 비율이 5% 미만의 세션이라고 밝혔다. 그리고 무관하지만 안심하기는 어려운 소식으로, <a href="https://www.msn.com/en-us/news/insight/microsoft-blocks-employee-use-of-claude-fable-5-over-data-policy/gm-GM9063948F">Microsoft는 새 데이터 보존 규정을 이유로 GitHub Copilot에서 직원의 Fable 5 사용을 차단했다</a>.</p>

  <p>이것이 도입 방식에 왜 중요한지 보자. 능력은 진짜다. 하지만 모델을 둘러싼 <em>정책 면</em>은 눈에 띄게 아직도 움직이고 있다. 무엇이 조용히 다른 경로로 넘어가는지, 무엇이 거부되는지, 어떤 데이터가 보존되는지. 이 모든 것이 공개 이후 주마다 바뀌어 왔고 또 바뀔 수 있다. 워크플로를 옮겨 얹을 토대로는 최악이며, 그렇기에 실험은 <strong>언제든 되돌릴 수 있게</strong> 유지하는 편이 좋다.</p>

  <ul>
    <li><strong>도구를 바꾸지 마라.</strong>Codex, OpenClaw, Pi는 그대로 두고 그 뒤의 모델만 갈아 끼운다.</li>
    <li><strong>새 계정을 만들지 마라.</strong>Anthropic 콘솔 가입도, 충전했다가 나중에 되찾아야 하는 선불 잔액도 필요 없다. 지금 가진 Token Station 키면 충분하다.</li>
    <li><strong>구독하지 마라.</strong>실제로 테스트하는 동안에만 정가로 토큰 단위로 지불한다. 다음 주 정책 변경에 마음이 식으면 설정 한 줄만 바꿔 Opus 4.8이나 GPT-5.5로 돌아가면 된다. 같은 키, 같은 도구 그대로다.</li>
  </ul>

  <h2 id="the-price">가격: 호기심에 예산을 매겨라</h2>

  <p>Fable 5는 지금 시장에서 가장 비싼 주류 API 모델이다. 아래 모델은 모두 Token Station에서 각 제공사의 정가 그대로 사용할 수 있다.</p>

  <table>
    <tr><th>모델</th><th>입력 / 100만</th><th>출력 / 100만</th><th>컨텍스트</th></tr>
    <tr><td><code>anthropic/claude-fable-5</code></td><td><strong>$10.00</strong></td><td><strong>$50.00</strong></td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>$5.00</td><td>$25.00</td><td>1M</td></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>$5.00</td><td>$30.00</td><td>1M</td></tr>
    <tr><td><code>anthropic/claude-sonnet-4-6</code></td><td>$3.00</td><td>$15.00</td><td>1M</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>$1.00</td><td>$2.00</td><td>256K</td></tr>
  </table>

  <p>이는 입력·출력 모두 Opus 4.8의 2배이고, 출력은 <strong>Grok Build의 25배</strong>다. Grok Build에서는 몇 센트면 끝날 긴 에이전트 세션 하나가 Fable 5에서는 실제 달러 단위로 나갈 수 있다. 사고와 도구 출력이 많은 장기 실행이야말로 100만당 50달러의 출력 가격이 뼈아프게 다가오는 지점이다.</p>

  <p>반대로 보면, Token Station의 1달러 가입 크레딧만으로도 우선 맛보기에는 충분하다. Fable 5 가격으로 대략 10만 입력 토큰 또는 2만 출력 토큰에 해당하며, 실제로는 적당한 강도의 코딩 에이전트 프롬프트를 몇 번 돌릴 수 있는 양이다. 첫인상을 잡기에는 충분하고, 손해를 볼 만큼은 아니다. 더 본격적으로 평가하고 싶다면 첫 충전 시 최대 50달러의 보너스 크레딧이 추가된다.</p>

  <h2 id="what-you-need">필요한 것</h2>

  <ul>
    <li>Token Station 계정(<a href="https://models.bytefuture.ai/signup">무료 가입</a>. 1달러 크레딧 제공, 카드 불필요, Anthropic 계정과도 무관)</li>
    <li>당신의 Token Station API 키(<code>gw-</code>로 시작)</li>
    <li>설치된 Codex, OpenClaw 또는 Pi</li>
  </ul>

  <p>아래의 어떤 도구에서든 모델 ID는 동일하다. <code>anthropic/claude-fable-5</code>. Token Station은 각 도구의 네이티브 API를 Anthropic 형식으로 변환하는데, 단순한 프록시 구성에서 깨지기 쉬운 도구·파라미터 이름 매핑까지 포함한다.</p>

  <h2 id="codex-setup">Codex 설정</h2>

  <p>Codex는 OpenAI의 Responses API를 쓴다. Token Station이 이를 Anthropic 형식으로 변환한다. 먼저 설정 파일을 만든다.</p>

  <pre><code>mkdir -p ~/.codex
cat &gt; ~/.codex/config.toml &lt;&lt;'EOF'
model = "anthropic/claude-fable-5"
model_provider = "token_station"

[model_providers.token_station]
name = "token_station"
base_url = "https://models.bytefuture.ai/v1"
env_key = "TOKEN_STATION_API_KEY"
wire_api = "responses"
EOF</code></pre>

  <p>그다음 키를 설정하고 실행한다.</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
codex</code></pre>

  <p>실험을 끝내려면 <code>model</code>을 이전에 쓰던 것으로 되돌리기만 하면 된다. 그 밖에는 아무것도 건드리지 않는다.</p>

  <h2 id="openclaw-setup">OpenClaw 설정</h2>

  <p>OpenClaw는 <code>openclaw.json</code> 설정에서 커스텀 제공사를 받는다(<a href="https://docs.openclaw.ai/concepts/model-providers">문서</a>). Token Station을 <code>anthropic-messages</code> 유형의 제공사로 추가하고 기본 모델을 Fable 5로 지정한다.</p>

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
            "id": "anthropic/claude-fable-5",
            "name": "Claude Fable 5 (Token Station)",
            "contextWindow": 1000000,
            "maxTokens": 128000
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "token-station/anthropic/claude-fable-5" }
    }
  }
}</code></pre>

  <p>OpenClaw 게이트웨이를 재시작하면 Token Station을 통해 라우팅된다. 되돌리려면 이전의 <code>agents.defaults.model</code>을 복원하면 된다. 제공사 항목은 다음을 위해 그대로 두어도 좋다.</p>

  <h2 id="pi-setup">Pi 설정</h2>

  <p>Pi는 커스텀 제공사를 <code>~/.pi/agent/models.json</code>에 등록한다(<a href="https://pi.dev/docs/latest/custom-provider">문서</a>).</p>

  <pre><code>{
  "providers": {
    "token-station": {
      "name": "Token Station",
      "baseUrl": "https://models.bytefuture.ai/v1",
      "apiKey": "$TOKEN_STATION_API_KEY",
      "api": "anthropic-messages",
      "models": [
        {
          "id": "anthropic/claude-fable-5",
          "name": "Claude Fable 5",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "maxTokens": 128000
        }
      ]
    }
  }
}</code></pre>

  <p>모델을 지정해 실행하거나, 실행 중에 <code>/model</code>로 전환한다.</p>

  <pre><code>export TOKEN_STATION_API_KEY="gw-YOUR_TOKEN_STATION_KEY"
pi --model anthropic/claude-fable-5</code></pre>

  <p>OpenClaw와 Pi에 대해 한 가지. 클라이언트마다 스스로 <code>/v1</code>을 붙이는지가 다르다. 위 설정에서 404가 보이면 <code>baseUrl</code>에서 <code>/v1</code>을 떼고 다시 시도하라.</p>

  <h2 id="api-quirks">알아둘 만한 API의 특이점</h2>

  <p>Fable 5는 Claude 모델 중에서 가장 엄격한 요청 인터페이스를 갖고 있으며, 도구가 모델 파라미터를 노출하는 경우에 중요해진다.</p>

  <ul>
    <li><strong>샘플링 파라미터 불가.</strong><code>temperature</code>, <code>top_p</code>, <code>top_k</code>는 모두 400으로 거부된다. 대신 프롬프트로 유도하라.</li>
    <li><strong>적응형 사고만 가능.</strong>고정 사고 예산(<code>budget_tokens</code>)은 사라졌고, (Fable 5에만 해당하는데) 명시적인 "사고 비활성화" 설정조차 거부된다. 사고 관련 설정은 건드리지 말거나 아예 생략하라.</li>
    <li><strong>어시스턴트 프리필 불가.</strong>출력 형태를 강제하려고 어시스턴트 턴을 프리필하는 도구는 400을 받는다. 대신 구조화 출력 기능을 쓰면 된다.</li>
    <li><strong>세이프가드 재라우팅.</strong>제한 주제에 관한 소수의 요청(Anthropic은 5% 미만의 세션이라고 한다)은 대신 Opus 4.8이 답하며, 이제는 눈에 보이는 안내가 붙는다. 그러니 가끔 답변이 스스로를 Opus라고 밝히더라도 놀라지 마라.</li>
  </ul>

  <h2 id="try-it">실험을 돌려보기</h2>

  <p>이 설정의 핵심은 언제든 버릴 수 있다는 점이다. 무료 크레딧을 써서 Fable 5에게 당신이 쌓아둔 실제 작업을 시켜본 뒤, 데이터로 판단하라. Token Station의 모든 모델이 같은 키 뒤에 있으므로, 비교는 설정 한 줄이면 된다. 같은 작업을 <code>anthropic/claude-opus-4-8</code>(가격은 절반), <code>openai/gpt-5.5</code>, <code>xai/grok-build-0.1</code>(출력 가격은 25분의 1)에서 돌려보고, Fable 5의 우위가 <em>당신의 작업에서</em> 그 프리미엄만큼의 값을 하는지 확인하라.</p>

  <p>값을 한다면 좋다. 설정을 그대로 두고 잔액을 채우면 된다. 그렇지 않거나 다음 정책 돌발 변수에 마음이 바뀌면 설정 세 줄을 지우고 떠나면 된다. 구독한 것도 없고, 해지할 것도 없다.</p>

  <p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a>에서 가입하고(1달러 무료 크레딧, 카드 불필요, Anthropic 계정 불필요, 첫 충전 시 최대 50달러 보너스), Mythos 급 모델이 당신의 코드에서 무엇을 해내는지 직접 확인해 보라.</p>

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
