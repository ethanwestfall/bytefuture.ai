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
