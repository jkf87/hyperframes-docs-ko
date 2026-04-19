# 소개

> HTML을 작성하고, 영상을 렌더링하세요. 에이전트를 위해 만들어졌습니다.

Hyperframes는 HTML을 결정론적(deterministic)으로 프레임 단위 렌더링된 영상으로 변환하는 오픈소스 프레임워크입니다. 웹 페이지를 만드는 것과 동일한 방식으로 영상을 정의할 수 있습니다.

## 실제 동작 확인

다음은 HTML로만 정의된 영상입니다:

```html theme={null}
<div id="root" data-composition-id="demo"
     data-start="0" data-width="1920" data-height="1080">

  <video id="clip-1" data-start="0" data-duration="5"
         data-track-index="0" src="intro.mp4" muted playsinline></video>

  <h1 id="title" class="clip"
      data-start="1" data-duration="4" data-track-index="1"
      style="font-size: 72px; color: white;">
    Welcome to Hyperframes
  </h1>

  <audio id="bg-music" data-start="0" data-duration="5"
         data-track-index="2" data-volume="0.5" src="music.wav"></audio>
</div>
```

`npx hyperframes render --output demo.mp4`를 실행하면 결정론적으로 프레임 단위 캡처된 MP4가 생성됩니다. 동일한 입력, 동일한 출력, 매번 같은 결과. 타임라인 편집기도 없고, 독점 포맷도 없습니다. 오직 HTML뿐입니다.

<CardGroup cols={2}>
  <Card title="카탈로그 둘러보기" icon="grid-2" href="/catalog/blocks/data-chart">
    50개 이상의 바로 사용 가능한 블록과 컴포넌트 — 소셜 오버레이, 셰이더 트랜지션, 데이터 시각화, 시네마틱 이펙트. 하나의 명령어로 설치할 수 있습니다.
  </Card>

  <Card title="빠른 시작" icon="rocket" href="/quickstart">
    5분 이내에 영상 렌더링까지 완료하세요.
  </Card>
</CardGroup>

## 왜 Hyperframes인가?

<Tabs>
  <Tab title="개발자를 위해">
    **이미 알고 있는 기술 스택입니다.** 컴포지션은 데이터 속성이 포함된 HTML 파일입니다. 애니메이션은 GSAP, Lottie, CSS 또는 특정 프레임으로 이동(seek)할 수 있는 모든 런타임을 사용합니다. 커스텀 DSL도, 독점 컴포넌트 시스템도, React 의존성도 없습니다. 웹 페이지를 만들 수 있다면, 영상을 만들 수 있습니다.
  </Tab>

  <Tab title="AI 에이전트를 위해">
    **에이전트는 이미 HTML을 사용합니다.** 대부분의 영상 도구는 에이전트가 조작할 수 없는 복잡한 API나 드래그 앤 드롭 인터페이스가 필요합니다. Hyperframes 컴포지션은 순수 HTML 문서 — LLM이 가장 잘 생성할 수 있는 형식입니다. CLI는 기본적으로 비대화형(non-interactive)으로 동작합니다 — 모든 입력은 플래그로, 출력은 일반 텍스트로, 오류 시 즉시 실패합니다 — 따라서 에이전트가 프롬프트나 파싱 없이 모든 명령을 실행할 수 있습니다.
  </Tab>

  <Tab title="자동화 파이프라인을 위해">
    **설계부터 결정론적입니다.** 렌더링 파이프라인은 시크(seek) 기반으로 벽시계 시간(wall-clock)에 의존하지 않습니다. `frame = floor(time * fps)` — 모든 프레임은 Chrome의 `beginFrame` API를 통해 독립적으로 캡처되고 FFmpeg으로 인코딩됩니다. 동일한 입력은 항상 동일한 출력을 생성하여, CI 테스트와 일괄 렌더링이 안정적입니다.
  </Tab>
</Tabs>

<Tip>
  Hyperframes는 처음부터 AI 에이전트 통합을 위해 설계되었습니다. 컴포지션은 모든 LLM이 생성할 수 있는 순수 HTML입니다. CLI는 기본적으로 비대화형 — 플래그 기반에 일반 텍스트 출력 — 이므로 에이전트가 대화형 프롬프트 없이 스캐폴딩, 렌더링, 린트를 수행할 수 있습니다. 대화형 터미널 UI를 사용하려면 `--human-friendly`를 추가하세요. 자세한 내용은 [CLI](/packages/cli)를 참조하세요.
</Tip>

## 동작 방식

<Steps>
  <Step title="HTML 작성">
    영상을 HTML 문서로 정의합니다. 각 요소에 타이밍(`data-start`, `data-duration`)과 레이아웃(`data-track-index`)을 위한 데이터 속성을 부여합니다. GSAP, Lottie, CSS 트랜지션 또는 Frame Adapter 패턴을 통해 시크 가능한 모든 런타임으로 애니메이션을 추가합니다.
  </Step>

  <Step title="브라우저에서 미리보기">
    `npx hyperframes preview`를 실행하여 브라우저에서 실시간 미리보기를 엽니다. HTML을 편집하면 변경 사항이 즉시 반영됩니다 — 빌드 단계도, 컴파일도 없습니다.
  </Step>

  <Step title="MP4로 렌더링">
    `npx hyperframes render --output output.mp4`를 실행하여 최종 영상을 생성합니다. 엔진은 헤드리스 Chrome에서 각 프레임을 시크하고 `beginFrame`으로 캡처한 후 FFmpeg을 통해 결과를 처리합니다. 로컬 또는 Docker에서 실행하여 완전히 재현 가능한 출력을 얻을 수 있습니다.
  </Step>
</Steps>

## 패키지

<CardGroup cols={2}>
  <Card title="@hyperframes/core" icon="cube" href="/packages/core">
    타입, HTML 파싱, 런타임, 컴포지션 린터 — 다른 모든 것이 기반으로 하는 핵심 패키지입니다.
  </Card>

  <Card title="@hyperframes/engine" icon="gear" href="/packages/engine">
    시크 가능한 페이지-투-비디오 캡처 엔진. 헤드리스 Chrome에서 HTML을 로드하고 프레임 단위로 캡처합니다.
  </Card>

  <Card title="@hyperframes/producer" icon="video" href="/packages/producer">
    캡처와 FFmpeg 인코딩을 단일 API 호출로 결합한 전체 렌더링 파이프라인입니다.
  </Card>

  <Card title="@hyperframes/studio" icon="palette" href="/packages/studio">
    타임라인을 대화형으로 구성하고 미리볼 수 있는 비주얼 컴포지션 편집기 UI입니다.
  </Card>

  <Card title="hyperframes (CLI)" icon="terminal" href="/packages/cli">
    컴포지션을 생성, 미리보기, 렌더링하는 커맨드라인 도구입니다.
  </Card>
</CardGroup>

## 다음 단계

<CardGroup cols={2}>
  <Card title="빠른 시작" icon="rocket" href="/quickstart">
    60초 안에 첫 번째 영상을 만들고 렌더링하세요
  </Card>

  <Card title="컴포지션" icon="layer-group" href="/concepts/compositions">
    모든 영상의 기반이 되는 HTML 기반 데이터 모델을 이해합니다
  </Card>

  <Card title="GSAP 애니메이션" icon="wand-magic-sparkles" href="/guides/gsap-animation">
    GSAP으로 타임라인 기반 애니메이션을 추가합니다
  </Card>

  <Card title="렌더링" icon="film" href="/guides/rendering">
    로컬, Docker 또는 CI 파이프라인에서 렌더링합니다
  </Card>
</CardGroup>
