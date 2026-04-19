# 예제

> 일반적인 영상 패턴을 위한 내장 예제입니다. 마우스를 올리면 애니메이션을 미리 볼 수 있습니다.

Hyperframes에는 컴포지션을 빠르게 구성할 수 있도록 도와주는 스타터 예제가 포함되어 있습니다. 각 예제는 올바른 [컴포지션 구조](/concepts/compositions), [데이터 속성](/concepts/data-attributes), 그리고 [GSAP 타임라인](/guides/gsap-animation)이 이미 연결된 작동 가능한 프로젝트를 제공합니다.

```bash Terminal theme={null}
npx hyperframes init my-video --example <name>
```

## 가로형 템플릿

<div class="not-prose grid grid-cols-2 gap-4 my-6">
  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full aspect-video object-cover block" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/warm-grain.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/warm-grain.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.7));"><strong class="text-sm font-semibold text-white block">Warm Grain</strong><span class="text-xs text-zinc-300">브랜딩 & 라이프스타일</span></div>
  </div>

  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full aspect-video object-cover block" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/play-mode.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/play-mode.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.75));"><strong class="text-sm font-semibold text-white block">Play Mode</strong><span class="text-xs text-zinc-300">소셜 미디어</span></div>
  </div>

  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full aspect-video object-cover block" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/swiss-grid.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/swiss-grid.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.75));"><strong class="text-sm font-semibold text-white block">Swiss Grid</strong><span class="text-xs text-zinc-300">기업 & 기술</span></div>
  </div>

  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full aspect-video object-cover block" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/kinetic-type.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/kinetic-type.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.75));"><strong class="text-sm font-semibold text-white block">Kinetic Type</strong><span class="text-xs text-zinc-300">프로모션 & 타이틀 카드</span></div>
  </div>

  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full aspect-video object-cover block" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/decision-tree.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/decision-tree.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.75));"><strong class="text-sm font-semibold text-white block">Decision Tree</strong><span class="text-xs text-zinc-300">설명 & 튜토리얼</span></div>
  </div>

  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full aspect-video object-cover block" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/product-promo.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/product-promo.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.75));"><strong class="text-sm font-semibold text-white block">Product Promo</strong><span class="text-xs text-zinc-300">제품 쇼케이스</span></div>
  </div>

  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full aspect-video object-cover block" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/nyt-graph.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/nyt-graph.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.75));"><strong class="text-sm font-semibold text-white block">NYT Graph</strong><span class="text-xs text-zinc-300">데이터 스토리</span></div>
  </div>
</div>

## 세로형 템플릿

<div class="not-prose grid grid-cols-3 gap-3 my-6">
  <div class="tpl-card relative rounded-xl overflow-hidden bg-zinc-900 transition-transform hover:-translate-y-0.5 hover:shadow-xl">
    <video class="w-full object-cover block" style="aspect-ratio: 9/16;" src="https://static.heygen.ai/hyperframes-oss/docs/images/templates/vignelli.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/templates/vignelli.png" muted loop playsinline preload="metadata" />

    <div class="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.75));"><strong class="text-sm font-semibold text-white block">Vignelli</strong><span class="text-xs text-zinc-300">헤드라인 & 공지</span></div>
  </div>
</div>

<Tip>
  최소한의 시작점을 찾고 계신가요? **blank**를 사용하세요 — 비주얼 디자인 없이 스캐폴딩만 포함된 빈 컴포지션을 제공합니다.

  ```bash Terminal theme={null}
  npx hyperframes init my-video --example blank
  ```
</Tip>

## 예제 선택하기

| 예제            | 스타일              | 포맷      | 적합한 용도                     |
| --------------- | ------------------- | --------- | ------------------------------ |
| `warm-grain`    | 유기적, 텍스처      | 가로형    | 라이프스타일, 브랜딩, 에디토리얼 |
| `play-mode`     | 역동적, 탄성        | 가로형    | 소셜 미디어, 제품 출시          |
| `swiss-grid`    | 깔끔, 구조적        | 가로형    | 기업, 데이터, 기술              |
| `kinetic-type`  | 드라마틱 타이포      | 가로형    | 프로모션, 인트로, 타이틀 카드    |
| `decision-tree` | 다이어그램           | 가로형    | 설명, 튜토리얼                  |
| `product-promo` | 멀티 씬             | 가로형    | 제품 쇼케이스, 데모             |
| `nyt-graph`     | 에디토리얼 데이터    | 가로형    | 데이터 스토리, 리포트            |
| `vignelli`      | 대담한 타이포그래피  | 세로형    | 헤드라인, 공지                  |
| `blank`         | 최소 스캐폴딩        | —         | 완전 제어, 에이전트 생성         |

## 예제 상세 정보

<Tabs>
  <Tab title="warm-grain">
    ### warm-grain

    그레인 텍스처 오버레이가 적용된 크림톤 미학.

    **생성 결과:** 따뜻한 색감 그레이딩, 텍스처 그레인, 부드러운 전환이 포함된 컴포지션입니다. 인트로 서브 컴포지션과 자막 지원이 포함됩니다.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    ├── compositions/
    │   ├── intro.html
    │   ├── graphics.html
    │   └── captions.html
    └── assets/
    ```
  </Tab>

  <Tab title="play-mode">
    ### play-mode

    대담하고 역동적인 모션의 탄성 애니메이션.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    ├── compositions/
    │   ├── intro.html
    │   ├── stats.html
    │   └── captions.html
    └── assets/
    ```
  </Tab>

  <Tab title="swiss-grid">
    ### swiss-grid

    스위스/국제 타이포그래피 스타일에서 영감을 받은 구조적 그리드 레이아웃.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    ├── compositions/
    │   ├── intro.html
    │   ├── graphics.html
    │   └── captions.html
    └── assets/
    ```
  </Tab>

  <Tab title="vignelli">
    ### vignelli

    레드 강조색이 적용된 대담한 타이포그래피 (1080×1920 세로형).

    ```
    my-video/
    ├── meta.json
    ├── index.html
    ├── compositions/
    │   ├── overlays.html
    │   └── captions.html
    └── assets/
    ```
  </Tab>

  <Tab title="kinetic-type">
    ### kinetic-type

    드라마틱한 텍스트 애니메이션이 적용된 대담한 키네틱 타이포그래피 프로모션.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    └── compositions/
        └── main-graphics.html
    ```
  </Tab>

  <Tab title="decision-tree">
    ### decision-tree

    분기 경로와 순차적 표시가 포함된 애니메이션 플로우차트.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    └── compositions/
        └── decision_tree.html
    ```
  </Tab>

  <Tab title="product-promo">
    ### product-promo

    SVG 에셋이 포함된 멀티 씬 제품 쇼케이스.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    ├── compositions/
    │   ├── scene1-logo-intro.html
    │   ├── scene2-4-canvas.html
    │   └── scene5-logo-outro.html
    └── assets/
        ├── figma-cursors.svg
        ├── figma-logo-pieces.svg
        └── figma-logo-pills.svg
    ```
  </Tab>

  <Tab title="nyt-graph">
    ### nyt-graph

    인쇄 에디토리얼 스타일의 애니메이션 데이터 차트.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    └── compositions/
        └── nyt-chart.html
    ```
  </Tab>

  <Tab title="blank">
    ### blank

    스캐폴딩만 포함된 빈 컴포지션.

    ```
    my-video/
    ├── meta.json
    ├── index.html
    └── compositions/
        └── captions.html
    ```
  </Tab>
</Tabs>

## 소스 영상 전달하기

```bash Terminal theme={null}
npx hyperframes init my-video --example warm-grain --video ./my-clip.mp4
```

CLI가 영상의 재생 시간, 해상도, 코덱을 분석합니다. 영상이 호환되지 않는 코덱을 사용하는 경우, FFmpeg가 설치되어 있으면 자동으로 H.264 MP4로 트랜스코딩됩니다.

## 커스텀 예제

`index.html`이 포함된 모든 디렉토리는 예제로 사용할 수 있습니다. 커스텀 예제에 필요한 항목은 다음과 같습니다:

1. [`data-composition-id`](/concepts/data-attributes#composition-attributes) 루트 엘리먼트가 포함된 `index.html`
2. `window.__timelines`에 등록된 [GSAP 타임라인](/guides/gsap-animation)
3. 동일 디렉토리 또는 하위 디렉토리에 위치한 에셋

```html index.html theme={null}
<div id="root" data-composition-id="my-example"
     data-start="0" data-width="1920" data-height="1080">

  <!-- 여기에 엘리먼트를 추가하세요 -->

  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    // 애니메이션을 추가하세요...
    window.__timelines = window.__timelines || {};
    window.__timelines["my-example"] = tl;
  </script>
</div>
```

커스텀 예제를 생성한 후, [린터](/packages/cli#lint)로 유효성을 검사하세요:

```bash Terminal theme={null}
npx hyperframes lint
```

## 다음 단계

<CardGroup cols={2}>
  <Card title="빠른 시작" icon="rocket" href="/quickstart">
    첫 번째 영상을 생성, 미리보기, 렌더링하세요
  </Card>

  <Card title="GSAP 애니메이션" icon="wand-magic-sparkles" href="/guides/gsap-animation">
    예제에 애니메이션을 추가하세요
  </Card>

  <Card title="컴포지션" icon="layer-group" href="/concepts/compositions">
    컴포지션 데이터 모델을 이해하세요
  </Card>

  <Card title="렌더링" icon="film" href="/guides/rendering">
    컴포지션을 MP4로 렌더링하세요
  </Card>
</CardGroup>
