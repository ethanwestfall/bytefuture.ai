---
slug: "genoffice-meets-token-station"
lang: "ko"
title: "GenOffice와 Token Station의 만남: 어떤 모델이든, 쓴 만큼만"
summary: "GenOffice에는 기본적으로 Genspark가 연결되어 있다. Token Station으로 연결 대상을 바꾸면 스위트 안의 모든 앱이 원하는 모델로 동작하며, 계약 단위가 아니라 요청 단위로 과금된다."
category: "tutorial"
date: "2026-08-08"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/genoffice-meets-token-station-cover.png"
draft: false
---

<p><a href="https://github.com/genspark-ai/genoffice">GenOffice</a>는 Electron 위에 구축된 오픈소스 AI 네이티브 오피스 스위트다. 워드프로세서, 스프레드시트 편집기, 프레젠테이션 제작 도구, PDF 뷰어가 하나의 셸 아래 탭으로 묶여 있다. 다섯 개 앱이 공유하는 하나의 약속은 <strong>파일 형식 충실도</strong>다. <code>.docx</code>, <code>.xlsx</code>, <code>.pptx</code>를 열어 편집해도 손대지 않은 부분은 바이트 단위로 원본과 동일하게 돌아온다. GenOffice는 원본 파일을 파싱하고 변경된 블록만 추적한 뒤, 저장 시 그 좁은 범위의 패치만 원본 XML에 이어 붙인다. 아카이브의 나머지 부분은 그대로 복사될 뿐 손대지 않는다.</p>

<p>모든 앱은 동일한 AI 패널을 갖추고 있다. Docs에서는 버전 기록이 있는 블록 단위 편집, Sheets에서는 실시간 워크북에 대해 도구를 호출하는 에이전트, Slides에서는 자유 형식 코드가 아니라 고정된 검증 완료 원시 명령(primitive) 집합만으로 프레젠테이션을 편집하는 제한된 레이아웃 스크립팅 에이전트다. 세 앱 모두 내부적으로 두 개의 패키지를 공유한다. 도구 호출 루프를 담당하는 <code>agent-core</code>와, 설정된 모델 백엔드와의 통신을 담당하는 <code>ai-provider</code>다.</p>

<p>바로 이 지점이 이 글의 핵심이다. <code>ai-provider</code>는 이미 순수한 OpenAI 호환 HTTP를 사용한다. 기본 설정에서 GenOffice는 이를 Genspark로 연결한다. 대신 <a href="https://models.bytefuture.ai">Token Station</a>으로 연결하면 앱 자체는 아무것도 바뀌지 않는다. 바뀌는 것은 토큰이 어디서 오느냐뿐이다.</p>

<h2 id="why-token-station">Token Station으로 구동해야 하는 이유</h2>

<p>Genspark는 로그인하는 순간 바로 쓸 수 있고, 그래서 기본값으로 적절하다. 하지만 하나의 계정, 고정된 하나의 모델 목록, 그리고 Genspark의 조건대로 충전하는 크레딧 잔액이라는 한계도 있다. Token Station은 이 관계의 형태를 두 가지 지점에서 바꾼다. 매일 쓰는 데스크톱 앱에서는 둘 다 중요한 차이다.</p>

<table>
  <tr><th></th><th>Genspark(기본값)</th><th>Token Station</th></tr>
  <tr><td>계정 / 크레딧</td><td>단일 계정, 단일 크레딧 풀</td><td>쓴 만큼만 지불, 월간·연간 계약 없음</td></tr>
  <tr><td>모델</td><td>연동 방식이 정한 고정 목록</td><td>25개 이상 제공사, 250개 이상 모델 중 작업별 선택</td></tr>
  <tr><td>가격</td><td>Genspark 요금제에 묶인 크레딧</td><td>키 하나, 제공사 원가, 마진 없음</td></tr>
</table>

<p><strong>쓴 만큼만 지불, 계약이 아니다.</strong> Token Station에는 구독 등급이 없다. 카드 없이 무료로 가입하면 즉시 1달러 크레딧이 지급된다. 이후에는 실제로 호출한 모델에 대해 제공사 가격을 그대로 지불할 뿐, 정기적으로 나가는 비용도 해지할 것도 없다. NVIDIA NIM 같은 일부 모델은 아예 무료다.</p>

<p><strong>모델을 고를 수 있는 자유.</strong> 게이트웨이 계정은 특정 벤더의 라인업에 묶이지 않는다. GenOffice Docs에서는 장문 편집에 Claude를 쓰고, Sheets에서는 일상적인 수식 작업에 더 저렴한 모델로 바꾸고, Slides에서는 덱에 맞는 이미지 지원 모델을 고르면 된다. 모두 같은 키, 같은 OpenAI 방식 엔드포인트로 처리되며 제공사별로 따로 가입할 필요가 없다.</p>

<p>Token Station은 GenOffice의 커스텀 provider 슬롯이 원래 기대하는 것과 같은 OpenAI 호환 통신 방식을 그대로 사용하므로, 이를 연결하는 작업은 재작성이 아니라 라우팅 변경에 가깝다.</p>

<h2 id="setup">설정: GenOffice 체크아웃에 패치 적용하기</h2>

<p>아래는 GenOffice의 AI 트래픽을 Genspark에서 Token Station으로 라우팅하도록 바꾸는 실제 변경 사항이다. 자신의 fork나 브랜치에 그대로 적용하면 된다. 특정 GenOffice 릴리스에 종속된 내용은 없다.</p>

<h3 id="step-1">1. 사전 준비물을 설치하고 기본 빌드가 동작하는지 확인한다</h3>

<p>Node.js와 npm이 설치되어 있어야 한다.</p>

<pre><code>git clone &lt;your-fork-url&gt; genoffice
cd genoffice
npm install
npm run dev</code></pre>

<p>셸이 실행되고 AI 패널이 정상적으로 열리는지 확인한다. 이 시점에는 기본값인 Genspark로 동작하며, 로그아웃 상태에서 실제로 메시지를 보내지 않는 한 로그인 요청은 뜨지 않는다.</p>

<h3 id="step-2">2. 공유 provider 패키지에 환경 변수 기반 오버라이드 추가</h3>

<p><code>packages/ai-provider</code>에는 이미 커스텀 provider가 정의되어 있다. 임의의 OpenAI 호환 <code>baseUrl</code> / <code>apiKey</code> / <code>model</code>이다. 환경 변수에서 값을 읽어 이를 채우는 작은 함수를 추가한다. Genspark 자체 키(<code>GSK_API_KEY</code>)에 대해 코드베이스가 이미 쓰고 있는 것과 동일한 패턴이다.</p>

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

<p>이 함수를 <code>defaultAiSettings</code>, <code>resolveAiSettings</code>와 함께 패키지의 <code>index.ts</code>에서 내보낸다.</p>

<h3 id="step-3">3. 각 앱이 Genspark를 강제하지 않도록 하고, 오버라이드를 적용한다</h3>

<p>Docs, Sheets, Slides는 각각 <code>ai:get-settings</code> IPC 핸들러를 등록해 두었는데, 읽을 때마다 provider를 Genspark로 강제 리셋한다. 그 줄을 지우고 새 오버라이드 함수를 호출하도록 바꾼다. 세 파일 모두 형태는 동일하다.</p>

<p><code>apps/docs/src/main/docs-main.ts</code> (<code>apps/slides/src/main/ai-ipc.ts</code>, <code>apps/sheets/src/main/sheets-main.ts</code>도 동일)</p>

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

<p>Sheets의 핸들러는 두 가지 사소한 차이가 있다. 문자열 리터럴 대신 IPC 채널 상수를 받는다는 점, 그리고 맨 앞에서 <code>sessionFor(event)</code> 검사를 한 번 먼저 호출한다는 점이다. 본질은 동일하다. genspark 강제 줄을 지우고 새 오버라이드를 호출하면 된다.</p>

<h3 id="step-4">4. 키를 발급받아 환경 변수에 넣는다</h3>

<p><a href="https://models.bytefuture.ai/signup">Token Station</a>에 가입하고 대시보드에서 API 키를 받은 뒤, 이를 영구 환경 변수로 설정하고 터미널을 재시작한다(환경 변수는 이후에 실행되는 프로세스에만 적용된다).</p>

<pre><code># Windows (PowerShell)
[Environment]::SetEnvironmentVariable("TOKEN_STATION_API_KEY", "gw_...", "User")

# macOS / Linux — add to your shell profile
export TOKEN_STATION_API_KEY=gw_...</code></pre>

<p>선택 사항으로, <code>TOKEN_STATION_MODEL</code>에 Token Station의 provider/model 형식 ID(예: <code>openai/gpt-5.5</code>)를 설정하면 기본 모델을 바꿀 수 있다. GenOffice를 재실행하면 Docs, Sheets, Slides 전반의 채팅, 편집, 계획 기능이 모두 Token Station 위에서 동작한다. Slides의 원샷 덱 생성 기능만 추가 패치가 필요한데, 이는 5단계에서 다룬다.</p>

<h3 id="step-5">5. Slides 덱 생성에는 패치가 하나 더 필요하다</h3>

<p>Slides의 <code>generate_deck</code>/<code>regenerate_slide</code> 도구는 원래 provider 시스템을 완전히 우회해 Genspark 전용 클라우드 엔드포인트를 직접 호출했다. 이 둘에는 세 부분으로 이루어진 별도 패치가 필요하다. Docs와 Sheets만 라우팅할 생각이라면 4단계에서 멈춰도 된다.</p>

<p><strong><code>apps/slides/src/renderer/ai/slides-skill.ts</code></strong>: <code>DeckAccess</code> 인터페이스에 선택적 필드 두 개를 추가한다. 동기 방식의 <code>aiProvider()</code> getter와, HTML 마커 대신 검증된 요소 목록을 반환하는 <code>composePageElements()</code> 메서드다. 그런 다음 두 도구의 판단 기준을 "Genspark 전용 하드코딩"에서 현재 provider 기반 판단으로 바꾼다.</p>

<pre><code>const useCloud = cloudAvailable
  &amp;&amp; (access.aiProvider?.() ?? 'genspark') === 'genspark'
if (!useCloud) {
  // fall back to runLocalDeckGeneration() / runLocalRegenerateSlide()
}</code></pre>

<p><strong><code>apps/slides/src/renderer/ai/local-deck-gen.ts</code></strong>(신규 파일): 실제 구성을 담당하는 모듈로, 설정된 provider에 각 페이지의 레이아웃을 JSON(도형, 텍스트 박스, 차트, 이미지)으로 요청하고 검증한 뒤, 앱 자체 에이전트 도구가 이미 쓰고 있는 <code>add_shape</code> / <code>add_text_box</code> / <code>add_chart</code> / <code>insert_web_image</code> 원시 명령으로 페이지를 구성한다.</p>

<p><strong><code>apps/slides/src/renderer/ai/AiPanel.tsx</code></strong>: 새로 추가한 두 <code>DeckAccess</code> 필드를 <code>generateStyleSkill</code>/<code>planDeckOutline</code>이 이미 쓰고 있는 것과 같은 요청 경로에 연결한다. 이 부분은 놓치기 쉽다. 연결하지 않으면 <code>aiProvider</code>가 계속 undefined로 남아, 위의 판단 로직이 조용히 Genspark로 되돌아간다.</p>

<pre><code>aiProvider: () => settingsRef.current.provider,
composePageElements: async (args) => {
  const { system, user } = buildPageComposePrompt(args)
  const r = await runLlmOnce(system, user, undefined, true, args.signal)
  if (!r.ok || !r.text) return { ok: false, error: r.error ?? tGlobal('aiErrEmptyOutput') }
  return parsePageElementsJson(r.text, args.canvasW, args.canvasH)
},</code></pre>

<p><strong>로컬 경로 v1의 알려진 한계:</strong> 현재는 추가 전용이라 새 페이지는 항상 현재 마지막 슬라이드를 복제하며, "덱 전체 교체"는 아직 지원하지 않는다. 로컬 버전의 <code>regenerate_slide</code> 역시 콘텐츠 요소만 교체하며, 배경과 테마 상속은 건드리지 않는다는 점이 클라우드 버전과 다르다.</p>

<h2 id="demos">실제 동작 확인</h2>

<p>앱마다 하나씩, 총 세 개의 짧은 데모다. 모두 Token Station 위에서 동작한다.</p>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-docs.mp4" type="video/mp4">
  </video>
  <figcaption>데모 1 · Docs: 프로젝트 개요. GenOffice Docs가 AI 패널로 프로젝트 개요 문서를 작성하고 편집하는 모습. Genspark 로그인은 전혀 관여하지 않고 처음부터 끝까지 Token Station 위에서 동작한다.</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-sheets.mp4" type="video/mp4">
  </video>
  <figcaption>데모 2 · Sheets: 프로젝트 예산. GenOffice Sheets가 프로젝트 예산표를 구성하는 모습. 수식, 서식 지정, 실시간 워크북에 대한 AI 지원 편집까지 모두 Token Station을 거쳐 처리된다.</figcaption>
</figure>

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/genoffice-meets-token-station/demo-slides.mp4" type="video/mp4">
  </video>
  <figcaption>데모 3 · Slides: 프로젝트 덱. GenOffice Slides가 프레젠테이션 전체를 생성하는 모습. 5단계의 추가 패치가 필요했던 기능으로, Genspark의 클라우드 서비스 대신 Token Station을 통해 페이지 단위로 생성된다.</figcaption>
</figure>

<h2 id="learn-more">더 알아보기</h2>

<ul>
  <li>Token Station: <a href="https://models.bytefuture.ai/signup">요금제 및 가입</a></li>
  <li>Token Station: <a href="https://models.bytefuture.ai/models">전체 모델 카탈로그</a></li>
  <li>GenOffice: <a href="https://github.com/genspark-ai/genoffice">GitHub 소스코드</a></li>
  <li>GenOffice: <a href="https://github.com/genspark-ai/genoffice/blob/main/CONTRIBUTING.md">기여 가이드</a></li>
</ul>

<p><a href="https://models.bytefuture.ai/signup">models.bytefuture.ai</a>에서 가입하고(카드 없이 1달러 무료 크레딧), <code>TOKEN_STATION_API_KEY</code>를 내보낸 뒤 GenOffice를 재실행한다. 키 하나, 엔드포인트 하나로 Docs, Sheets, Slides 세션에 필요한 모든 모델을 쓸 수 있다.</p>
