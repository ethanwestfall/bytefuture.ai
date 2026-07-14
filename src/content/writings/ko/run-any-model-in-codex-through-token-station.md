---
slug: "run-any-model-in-codex-through-token-station"
lang: "ko"
title: "Token Station을 통해 Codex에서 어떤 모델이든 실행하기"
summary: "OpenAI의 Codex는 OpenAI 모델뿐 아니라 어떤 모델이든 실행할 수 있다. 2026년 2월부터 Responses API가 필수가 되었으므로, 연결하는 플랫폼이 이를 네이티브로 지원해야 한다. Token Station용 ~/.codex/config.toml 전체 설정을 OpenAI 공식 문서와 대조하고, smart routing도 소개한다."
category: "tutorial"
date: "2026-06-18"
cta: "https://models.bytefuture.ai/intro.html"
draft: false
---

<p>OpenAI가 Codex에 대해 조용하지만 유용한 점을 짚었다. Codex의 app, CLI, SDK는 OpenAI 모델뿐 아니라 <strong>어떤 모델이든</strong> 실행할 수 있다. 제품은 이 하네스이고, 그 뒤의 모델은 선택의 문제다. 그러니 Codex는 그대로 두고 GPT-5.5, Claude, 또는 GLM-5.2나 Kimi K2.7 같은 오픈웨이트 모델 등 작업에 맞는 쪽으로 향하게 하면 된다.</p>

  <p>다만 많은 사람이 걸려 넘어지는 함정이 하나 있다. <strong>2026년 2월부터 Codex는 OpenAI의 Responses API로 통일되었다.</strong> 프로바이더 연동은 <code>wire_api = "responses"</code>를 전제로 하며, 기존 Chat Completions 경로는 더 이상 입구가 아니다. 즉, Codex를 향하게 하는 모델 플랫폼은 Chat Completions뿐 아니라 <strong>Responses API를 네이티브로</strong> 구사해야 한다. 대부분의 게이트웨이는 후자만 구현해 두어, 여기서 막힌다.</p>

  <p><a href="https://models.bytefuture.ai">Token Station</a>은 호스팅하는 모든 모델을 OpenAI <strong>Responses API</strong>(<code>/v1/responses</code>)로 노출하므로, Codex가 심(shim) 없이 바로 연결된다. 이 글은 그대로 쓸 수 있는 설정, 검증 명령, 한 줄로 모델 바꾸기, 그리고 smart routing이 어디에 들어맞는지를 다룬다.</p>

  <h2 id="why-custom-provider">왜 커스텀 프로바이더가 필요한가 (환경 변수만으로는 안 된다)</h2>

  <p>Claude Code라면 환경 변수만으로 다른 엔드포인트로 리디렉션할 수 있다. Codex는 다르다. <strong>내장 OpenAI 프로바이더는 <code>OPENAI_BASE_URL</code>을 무시하고</strong> 항상 <code>api.openai.com</code>으로 연결한다. 그 변수를 설정해도 기본 프로바이더에는 아무 효과가 없다.</p>

  <p>OpenAI의 <a href="https://developers.openai.com/codex/config-advanced">고급 설정 문서</a>에 따른 지원 경로는, <code>~/.codex/config.toml</code>의 <code>[model_providers.&lt;id&gt;]</code> 아래에 직접 항목을 정의하고 <code>model_provider</code>로 선택하는 것이다. (내장 프로바이더를 옮기려면 <code>openai_base_url</code>을 쓰며, 예약된 <code>openai</code> id는 재사용할 수 없으므로, 이름 있는 커스텀 프로바이더가 깔끔한 길이다.) API 키는 환경 변수에 남겨 두고 설정에서는 <code>env_key</code>로 참조하므로, 비밀 값이 파일에 남지 않는다.</p>

  <h2 id="config">한 번만 하는 설정</h2>

  <p>설정 파일을 만든다. 이는 Responses API를 쓰는 <code>token_station</code> 프로바이더를 정의하고 기본값으로 삼는다:</p>

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

  <p>그런 다음 Token Station 키를 export하고(변수 이름은 위의 <code>env_key</code>와 일치해야 한다), 한 줄로 확인한다:</p>

  <pre><code>export TOKEN_STATION_API_KEY="YOUR_TOKEN_STATION_KEY"

codex exec "Respond with exactly the word: pong"</code></pre>

  <p><code>pong</code>이 출력되면 Codex가 Responses API로 Token Station과 통신하고 있는 것이다. 여기서부터 <code>codex</code>를 실행하면 같은 프로바이더로 대화형 세션이 열린다.</p>

  <h3 id="fields">각 필드의 의미</h3>

  <table>
    <tr><th>키</th><th>의미</th></tr>
    <tr><td><code>model</code></td><td>Codex가 기본으로 요청하는 모델 ID. <code>provider/model</code> 형식(여기서는 <code>openai/gpt-5.5</code>).</td></tr>
    <tr><td><code>model_provider</code></td><td>어느 프로바이더 블록을 쓸지. <code>[model_providers.&lt;id&gt;]</code>의 id와 일치해야 한다.</td></tr>
    <tr><td><code>name</code></td><td>사람이 읽는 라벨. 자유 텍스트이며 id가 아니다.</td></tr>
    <tr><td><code>base_url</code></td><td>Token Station의 OpenAI 호환 베이스 <code>https://models.bytefuture.ai/v1</code>. Codex가 <code>/responses</code>를 덧붙인다.</td></tr>
    <tr><td><code>env_key</code></td><td>Codex가 키를 읽는 환경 변수. 비밀 값은 파일 밖에 둔다.</td></tr>
    <tr><td><code>wire_api</code></td><td><code>"responses"</code>. 바로 이 부분이 핵심이다. Responses API를 선택하며, Codex가 요구하고 Token Station이 네이티브로 지원한다.</td></tr>
  </table>

  <h3 id="matches-docs">OpenAI 공식 문서와 일치한다</h3>

  <p>위의 모든 키는 OpenAI가 문서화한 커스텀 프로바이더 schema 그대로다. 최상위의 <code>model</code>과 <code>model_provider</code>, 그다음 <code>name</code>, <code>base_url</code>, <code>env_key</code>, <code>wire_api</code>를 가진 <code>[model_providers.&lt;id&gt;]</code> 테이블. <code>token_station</code>이라는 id가 허용되는 것은 예약 id(<code>openai</code>, <code>ollama</code>, <code>lmstudio</code>)가 아니기 때문이다. 오늘의 Codex에서 정확히 맞춰야 하는 유일한 값은 <code>wire_api = "responses"</code>다. 이 블록에 Token Station 고유 문법은 전혀 없으며, 어떤 프로바이더에든 쓰는 형태와 동일하다.</p>

  <h2 id="swap">한 줄로 모델 바꾸기</h2>

  <p>Token Station의 모든 모델이 같은 키, 같은 Responses 엔드포인트 뒤에 있으므로, 모델 전환은 설정의 <code>model</code> 한 곳을 고치거나 실행 시 플래그 하나면 된다:</p>

  <pre><code>codex --model anthropic/claude-opus-4-8 exec "Summarize git diff and suggest a commit message"</code></pre>

  <p>같은 설정 그대로 지금 바로 <code>model</code>에 넣을 수 있는 모델 ID 몇 가지:</p>

  <table>
    <tr><th>모델 ID</th><th>적합한 용도</th></tr>
    <tr><td><code>openai/gpt-5.5</code></td><td>OpenAI의 플래그십. Codex의 네이티브 기본값.</td></tr>
    <tr><td><code>anthropic/claude-opus-4-8</code></td><td>장기 호흡의 에이전트 코딩과 리팩터링.</td></tr>
    <tr><td><code>glm/glm-5.2</code></td><td>오픈웨이트, 100만 토큰 컨텍스트, 낮은 가격에 코드에 강함.</td></tr>
    <tr><td><code>kimi/kimi-k2.7-code</code></td><td>일상 작업용 저렴한 오픈웨이트 코딩 모델.</td></tr>
    <tr><td><code>xai/grok-build-0.1</code></td><td>빠르고 저렴하며, 출력 비용은 플래그십의 일부 수준.</td></tr>
  </table>

  <p>OpenAI가 말하려던 점이 여기서 분명해진다. Codex는 모델에 구애받지 않는다. 어려운 작업에는 비싼 모델을, 보일러플레이트에는 저렴한 오픈웨이트 모델을. 하네스를 떠나지 않고, 바꾸는 것도 한 줄뿐이다.</p>

  <h2 id="smart-routing">Smart routing: ID 하나에 모델 선택을 맡기기</h2>

  <p>작업마다 모델을 고정하는 것도 괜찮지만, Token Station에서는 이름이 아니라 <strong>규칙으로 라우팅</strong>할 수도 있다. 워크로드에 정책을 정의하면(품질 하한을 통과하는 가장 저렴한 모델, 임계값 이하의 지연에 프로바이더 허용 목록을 둔 경우, 또는 기본 모델 뒤에 예비를 두는 엄격한 폴백 체인 등), Token Station이 요청마다 모델을 고른다.</p>

  <p>Codex에는 이게 편리하다. Codex 자체는 모델 ID를 하나만 보내기 때문이다. <code>model</code>을 라우팅된 워크로드로 향하게 하면 결정이 서버 쪽으로 옮겨 간다. 기본 모델이 느리거나 쓸 수 없으면 예비가 응답하고, Codex 세션은 그 사실을 알 필요조차 없다. 라우팅은 <code>config.toml</code>이 아니라 Token Station에서 바꾸므로, 같은 Codex 설정이 정책의 변화에 자동으로 따라간다.</p>

  <blockquote>
    <p>Codex는 모델 ID 하나를 보낸다. 실제로 누가 응답할지는 smart routing이 결정하므로, 비용과 폴백 로직은 설정에 고정되지 않고 Token Station에 자리한다.</p>
  </blockquote>

  <h2 id="troubleshooting">연결이 안 될 때</h2>

  <ul>
    <li><strong>여전히 <code>api.openai.com</code>으로 간다.</strong> <code>OPENAI_BASE_URL</code>을 설정하고 내장 프로바이더가 따라오리라 기대했는가. 그러지 않는다. 위의 커스텀 프로바이더를 쓰고 <code>model_provider = "token_station"</code>을 설정하라.</li>
    <li><strong>401 / 인증 오류.</strong> export한 변수 이름이 <code>env_key</code>(<code>TOKEN_STATION_API_KEY</code>)와 정확히 일치해야 하며, 키는 <code>codex</code>를 실행하는 같은 셸에서 export해야 한다.</li>
    <li><strong>모델에서 프로토콜 오류 또는 404.</strong> <code>wire_api = "responses"</code>를 확인하라. Codex는 Responses API를 요구하며, Chat Completions만 지원하는 게이트웨이로는 충족할 수 없다.</li>
    <li><strong>모델 id가 틀렸다.</strong> <code>provider/model</code> 형식(예: <code>anthropic/claude-opus-4-8</code>)을 쓰고, 모델 이름만 단독으로 쓰지 마라.</li>
  </ul>

  <h2 id="wrap">시작하기</h2>

  <p>Codex로 어떤 모델이든 실행하는 일은 결국 TOML 네 줄과 환경 변수 하나로 귀결되며, 발목을 잡는 유일한 요건은 Responses API다. Token Station은 호스팅하는 모든 모델을 이 API로 제공하므로, 위 설정은 GPT-5.5, Claude, GLM-5.2, 또는 라우팅된 워크로드 어느 쪽을 돌리든 그대로 작동한다.</p>

  <p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a>에서 가입하고($1 무료 크레딧, 카드 불필요, 첫 충전 시 최대 50달러 보너스), 키를 <code>TOKEN_STATION_API_KEY</code>에 넣은 뒤 <code>pong</code> 체크를 실행하라. 키 하나, 엔드포인트 하나로 Codex 세션에 필요한 모든 모델이 갖춰진다.</p>
