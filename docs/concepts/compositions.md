# 컴포지션

> HyperFrames 영상의 기본 구성 요소입니다.

컴포지션은 비디오 타임라인을 정의하는 HTML 문서입니다. 모든 클립(비디오, 이미지, 오디오)은 컴포지션 안에 존재합니다.

## 구조

모든 컴포지션에는 `data-composition-id`가 있는 루트 요소가 필요합니다:

```html index.html theme={null}
<div id="root" data-composition-id="root"
     data-start="0" data-width="1920" data-height="1080">
  <!-- 요소를 여기에 배치합니다 -->
</div>
```

`index.html` 파일이 최상위 컴포지션입니다. 이 안에 중첩 컴포지션을 포함할 수 있습니다. 어떤 컴포지션이든 다른 컴포지션으로 가져올 수 있으며, 별도의 "루트" 타입은 존재하지 않습니다.

## 클립 유형

클립은 타임라인 위의 개별 블록으로, [data 속성](/concepts/data-attributes)이 지정된 HTML 요소로 표현됩니다:

* `&lt;video&gt;` -- 비디오 클립, B-roll, A-roll
* `&lt;img&gt;` -- 정적 이미지, 오버레이
* `&lt;audio&gt;` -- 음악, 효과음
* `&lt;div data-composition-id="..."&gt;` -- 중첩 컴포지션 (애니메이션, 그룹화된 시퀀스)

각 클립 유형의 전체 속성 목록은 [HTML 스키마 레퍼런스](/reference/html-schema)를 참고하세요.

## 중첩 컴포지션

컴포지션을 다른 컴포지션 안에 삽입하는 방법은 두 가지입니다: 외부 파일에서 불러오기 또는 인라인으로 정의하기. 재사용 가능한 컴포지션에는 외부 파일 방식을 권장합니다.

### 외부 파일

`data-composition-src`로 다른 HTML 파일을 참조합니다. 프레임워크가 자동으로 파일을 가져오고, `&lt;template&gt;` 콘텐츠를 추출하여 마운트하고, 스크립트를 실행하고, 타임라인을 등록합니다.

```html index.html theme={null}
<div
  id="el-5"
  data-composition-id="intro-anim"
  data-composition-src="compositions/intro-anim.html"
  data-start="0"
  data-track-index="3"
></div>
```

각 외부 컴포지션 파일은 콘텐츠를 `&lt;template&gt;` 태그로 감쌉니다:

```html compositions/intro-anim.html theme={null}
<template id="intro-anim-template">
  <div data-composition-id="intro-anim" data-width="1920" data-height="1080">
    <div class="title">Welcome!</div>

    <style>
      [data-composition-id="intro-anim"] .title {
        font-size: 72px; color: white; text-align: center;
      }
    </style>

    <script>
      const tl = gsap.timeline({ paused: true });
      tl.from(".title", { opacity: 0, y: -50, duration: 1 });
      window.__timelines["intro-anim"] = tl;
    </script>
  </div>
</template>
```

### 인라인

부모 안에 중첩 컴포지션을 직접 정의합니다. 재사용할 필요가 없는 일회성 컴포지션에 적합합니다.

```html index.html theme={null}
<div id="root" data-composition-id="root"
     data-start="0" data-width="1920" data-height="1080">

  <!-- 인라인 중첩 컴포지션 -->
  <div id="el-5" data-composition-id="intro-anim"
       data-start="0" data-track-index="3"
       data-width="1920" data-height="1080">
    <div class="title">Welcome!</div>
  </div>

  <script>
    // 인라인 컴포지션의 타임라인
    const introTl = gsap.timeline({ paused: true });
    introTl.from(".title", { opacity: 0, y: -50, duration: 1 });
    window.__timelines["intro-anim"] = introTl;
  </script>
</div>
```

인라인 컴포지션은 `&lt;template&gt;` 태그나 `data-composition-src`를 사용하지 않습니다.

### 프로젝트 구조

```text
project/
├─ index.html
├─ compositions/
│  ├─ intro-anim.html
│  ├─ caption-overlay.html
│  └─ outro-title.html
└─ assets/
   ├─ video.mp4
   ├─ music.mp3
   └─ logo.png
```

## 두 가지 레이어: 프리미티브와 스크립트

모든 컴포지션에는 두 가지 레이어가 있습니다:

* **HTML** -- 프리미티브 클립 (`video`, `img`, `audio`, 중첩 컴포지션). 무엇을 재생하고, 언제, 어느 트랙에서 재생할지를 정의하는 선언적 구조입니다. [data 속성](/concepts/data-attributes)으로 제어됩니다.
* **스크립트** -- 이펙트, 트랜지션, 동적 DOM, 캔버스, SVG 등 [GSAP](/guides/gsap-animation)을 활용한 크리에이티브 애니메이션. 스크립트는 미디어 재생이나 클립 가시성을 제어하지 **않습니다**.

<Warning>
  스크립트로 미디어 요소를 재생/일시정지/탐색하거나, 타이밍에 따라 클립을 표시/숨기지 마세요. 프레임워크가 data 속성을 기반으로 이를 자동 처리합니다. 이 동작을 중복 구현하는 스크립트는 프레임워크와 충돌합니다. 예시는 [흔한 실수](/guides/common-mistakes)를 참고하세요.
</Warning>

## 변수

컴포지션은 동적 콘텐츠를 위한 변수를 노출할 수 있습니다:

```html compositions/card.html theme={null}
<div data-composition-id="card" data-var-title="string" data-var-color="color">
```

변수를 사용하면 컴포지션을 [예제](/examples)로 재사용할 수 있습니다. 동일한 컴포지션이 렌더링 시 변수 값을 주입하여 다른 콘텐츠를 표현할 수 있습니다.

## 컴포지션 목록 보기

[CLI](/packages/cli)를 사용하여 프로젝트의 모든 컴포지션을 확인할 수 있습니다:

```bash theme={null}
npx hyperframes compositions
```

## 다음 단계

- [Data 속성](/concepts/data-attributes): 타이밍, 미디어, 컴포지션 속성의 전체 레퍼런스
- [GSAP 애니메이션](/guides/gsap-animation): GSAP 타임라인으로 컴포지션에 애니메이션 추가하기
- [예제](/examples): 일반적인 비디오 패턴을 위한 내장 예제로 시작하기
- [HTML 스키마 레퍼런스](/reference/html-schema): 컴포지션 작성을 위한 전체 스키마
