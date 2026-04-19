# HTML 스키마 레퍼런스

> Hyperframes HTML 컴포지션 작성을 위한 완전한 레퍼런스입니다.

이 문서는 Hyperframes 컴포지션의 전체 스키마 레퍼런스입니다. 보다 쉬운 입문 자료는 [컴포지션](/concepts/compositions)과 [데이터 속성](/concepts/data-attributes)을 참고하세요.

## 개요

Hyperframes는 HTML을 영상 구성의 단일 진실 공급원(source of truth)으로 사용합니다:

* **HTML 클립** = 비디오, 이미지, 오디오, 컴포지션
* **[데이터 속성](/concepts/data-attributes)** = 타이밍, 메타데이터, 스타일링
* **CSS** = 위치 지정 및 외형
* **GSAP 타임라인** = 애니메이션 및 재생 동기화 ([GSAP 애니메이션](/guides/gsap-animation) 참고)

## 프레임워크 자동 관리 동작

프레임워크는 데이터 속성을 읽고 다음을 자동으로 관리합니다:

* **기본 클립 타임라인 항목** — 클립에서 `data-start`, `data-duration`, `data-track-index`를 읽어 GSAP 타임라인에 추가합니다
* **미디어 재생** (`&lt;video&gt;` 및 `&lt;audio&gt;`의 재생, 일시정지, 탐색)
* **클립 라이프사이클** — `data-start`와 `data-duration`에 따라 클립을 마운트/언마운트합니다
* **타임라인 동기화** — 미디어를 GSAP 마스터 타임라인과 동기 상태로 유지합니다
* **미디어 로딩** — 타이밍을 확정하기 전에 모든 미디어가 로드될 때까지 대기합니다

마운트/언마운트는 **존재 여부**를 제어하며, 외형을 제어하지 않습니다. 트랜지션(페이드 인, 슬라이드 인)은 스크립트에서 애니메이션으로 처리합니다.

<Warning>
  스크립트에서 `video.play()`, `video.pause()`, `audio.currentTime` 설정, 클립 마운트/언마운트를 직접 호출하지 마세요. 미디어 재생과 클립 라이프사이클은 프레임워크가 관리합니다. 자세한 내용은 [자주 하는 실수](/guides/common-mistakes)를 참고하세요.
</Warning>

## 뷰포트

모든 컴포지션은 루트 요소에 `data-width`와 `data-height`를 포함해야 합니다:

```html theme={null}
<div id="main" data-composition-id="my-video"
     data-start="0" data-width="1920" data-height="1080">
  <!-- clips -->
</div>
```

일반적인 크기:

* **가로 모드**: `data-width="1920" data-height="1080"`
* **세로 모드**: `data-width="1080" data-height="1920"`

## 모든 클립 속성

| 속성                   | 적용 대상          | 필수 여부       | 설명                                                                                                                           |
| ---------------------- | ----------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | 전체              | 예              | 고유 식별자 (예: `"el-1"`). 상대적 타이밍 참조와 CSS 타겟팅에 사용됩니다.                                                          |
| `class="clip"`         | 시각적 요소        | 예              | 런타임 가시성 관리를 활성화합니다. 오디오 전용 클립에는 생략합니다.                                                                   |
| `data-start`           | 전체              | 예              | 시작 시간(초 단위, 예: `"0"`, `"5.5"`), 또는 [상대적 타이밍](#상대적-타이밍)을 위한 클립 ID 참조 (예: `"intro"`).                      |
| `data-duration`        | video, img, audio | 아래 참고        | 재생 시간(초 단위). 이미지에는 **필수**. 비디오/오디오에는 선택 사항(소스 재생 시간이 기본값). 컴포지션에는 사용하지 않습니다.               |
| `data-track-index`     | 전체              | 예              | 타임라인 트랙 번호. z-순서를 제어합니다(높을수록 앞에 표시). 같은 트랙의 클립은 겹칠 수 없습니다.                                        |
| `data-media-start`     | video, audio      | 아니오           | 소스 파일의 재생 오프셋/트림 지점(초 단위). 기본값: `0`. [데이터 속성](/concepts/data-attributes) 참고.                                |
| `data-volume`          | audio, video      | 아니오           | `0`에서 `1` 사이의 볼륨 레벨. 기본값: `1`.                                                                                        |
| `data-composition-id`  | div               | 컴포지션에서 필수  | 고유 컴포지션 ID. `window.__timelines`에서 사용하는 키와 일치해야 합니다.                                                             |
| `data-composition-src` | div               | 아니오           | 외부 컴포지션 HTML 파일 경로 ([중첩 컴포지션](#컴포지션-클립-중첩) 참고).                                                             |
| `data-width`           | div               | 컴포지션에서 필수  | 컴포지션 너비(픽셀).                                                                                                              |
| `data-height`          | div               | 컴포지션에서 필수  | 컴포지션 높이(픽셀).                                                                                                              |

## 클립 유형

<AccordionGroup>
  <Accordion title="비디오 클립">
    비디오 클립은 타이밍 및 재생 속성을 가진 `&lt;video&gt;` 요소를 포함합니다.

    ```html theme={null}
    <video
      id="el-1"
      data-start="0"
      data-duration="15"
      data-track-index="0"
      data-media-start="0"
      src="./assets/video.mp4"
    ></video>
    ```

    **주요 동작:**

    * `data-duration`은 **선택 사항**입니다 — `data-media-start` 이후 소스 파일의 남은 재생 시간이 기본값입니다
    * 소스 미디어가 `data-duration`보다 먼저 끝나면, 클립은 마지막 프레임을 표시합니다(정지 프레임)
    * `data-media-start`는 소스 비디오의 시작 부분을 트리밍합니다 — `data-media-start="5"`는 소스 파일의 5초 지점부터 재생을 시작합니다
    * `data-volume`은 비디오의 오디오 볼륨을 제어합니다 — 무음 비디오로 설정하려면 `"0"`을 사용하세요
    * `&lt;video&gt;` 요소에는 `class="clip"`을 추가하지 **마세요** — 프레임워크가 가시성을 직접 관리합니다

    <Warning>
      GSAP으로 `&lt;video&gt;` 요소의 `width`, `height`, `top`, `left`를 직접 애니메이션하지 마세요. Chrome에서 비디오 프레임 렌더링이 중단될 수 있습니다. 비디오를 `&lt;div&gt;`로 감싸고 래퍼를 애니메이션하세요. [자주 하는 실수](/guides/common-mistakes)를 참고하세요.
    </Warning>
  </Accordion>

  <Accordion title="이미지 클립">
    이미지 클립은 제어된 타이밍으로 정적 이미지를 표시합니다.

    ```html theme={null}
    <img
      id="el-2"
      class="clip"
      data-start="5"
      data-duration="4"
      data-track-index="1"
      src="./assets/overlay.png"
    />
    ```

    **주요 동작:**

    * `data-duration`은 이미지에 **필수**입니다 (비디오/오디오와 달리 기본값으로 사용할 소스 재생 시간이 없습니다)
    * `class="clip"`은 **필수**입니다 — 런타임이 타이밍에 따라 이미지를 표시/숨기는 데 필요합니다
    * 지원 형식: PNG, JPG, WebP, SVG, GIF (첫 번째 프레임만)
    * CSS로 위치와 크기를 지정하세요 — 스타일을 지정하지 않으면 이미지는 원본 크기로 렌더링됩니다
  </Accordion>

  <Accordion title="오디오 클립">
    오디오 클립은 시각적 요소 없이 컴포지션에 사운드를 추가합니다.

    ```html theme={null}
    <audio
      id="el-4"
      data-start="0"
      data-duration="30"
      data-track-index="2"
      src="./assets/music.mp3"
    ></audio>
    ```

    **주요 동작:**

    * `data-duration`은 **선택 사항**입니다 — `data-media-start` 이후 소스 파일의 남은 재생 시간이 기본값입니다
    * 오디오 클립은 보이지 않습니다 — `class="clip"`을 추가하지 마세요 (표시/숨길 대상이 없습니다)
    * `data-volume`은 볼륨을 제어합니다 — 배경 음악을 50% 볼륨으로 재생하려면 `"0.5"`를 사용하세요
    * `data-media-start`는 비디오와 마찬가지로 오디오 소스의 시작 부분을 트리밍합니다
    * 여러 오디오 클립을 서로 다른 트랙에 배치하여 레이어드 사운드 디자인이 가능합니다
  </Accordion>

  <Accordion title="컴포지션 클립 (중첩)">
    컴포지션 클립은 하나의 컴포지션 안에 다른 컴포지션을 포함시켜 모듈식, 재사용 가능한 영상 빌딩 블록을 구현합니다.

    ```html theme={null}
    <div
      id="el-5"
      data-composition-id="intro-anim"
      data-composition-src="compositions/intro-anim.html"
      data-start="0"
      data-track-index="3"
    ></div>
    ```

    **주요 동작:**

    * 컴포지션은 `data-duration`을 사용하지 **않습니다** — 재생 시간은 컴포지션의 GSAP 타임라인(`tl.duration()`)에 의해 결정됩니다
    * 외부 컴포지션은 `data-composition-src`에서 로드되며 `&lt;template&gt;` 태그로 감싸집니다
    * 각 중첩 컴포지션은 자체 `window.__timelines` 항목을 가지며, 자체 `&lt;script&gt;` 블록에 의해 등록됩니다
    * 프레임워크가 서브 타임라인을 자동으로 중첩합니다 — 수동으로 부모 타임라인에 추가하지 마세요
    * 모든 컴포지션은 다른 컴포지션 안에 중첩될 수 있습니다 — 특별한 "루트" 유형은 없습니다

    컴포지션의 작동 방식에 대한 자세한 내용은 [컴포지션](/concepts/compositions)을 참고하세요.
  </Accordion>
</AccordionGroup>

## 상대적 타이밍

다른 클립의 ID를 `data-start`에 참조하면 "해당 클립이 끝날 때 시작"을 의미합니다:

```html theme={null}
<video id="intro" data-start="0" data-duration="10" data-track-index="0" src="..."></video>
<video id="main" data-start="intro" data-duration="20" data-track-index="0" src="..."></video>
```

`main`은 10초에 시작합니다 (`intro`가 끝나는 시점).

**오프셋**을 사용하면 간격이나 겹침을 추가할 수 있습니다:

```html theme={null}
<!-- intro 이후 2초 간격 -->
<video id="main" data-start="intro + 2" data-duration="20" data-track-index="0" src="..."></video>

<!-- intro와 0.5초 겹침 -->
<video id="main" data-start="intro - 0.5" data-duration="20" data-track-index="0" src="..."></video>
```

자세한 설명은 데이터 속성 개념 페이지의 [상대적 타이밍 섹션](/concepts/data-attributes#relative-timing)을 참고하세요.

## 타임라인 계약

프레임워크는 모든 스크립트가 실행되기 전에 `window.__timelines = {}`를 초기화합니다. 모든 컴포지션은 `data-composition-id`와 일치하는 키에 GSAP 타임라인을 등록해야 합니다:

```javascript theme={null}
const tl = gsap.timeline({ paused: true });

// 애니메이션 추가
tl.to("#title", { opacity: 1, duration: 0.5 }, 0);
tl.to("#title", { opacity: 0, duration: 0.5 }, 4.5);

// 타임라인 등록
window.__timelines["<data-composition-id>"] = tl;
```

### 규칙

* 모든 컴포지션에는 타임라인을 생성하고 등록하는 `&lt;script&gt;` 블록이 필요합니다
* 모든 타임라인은 일시정지 상태로 시작해야 합니다 (`{ paused: true }`)
* 프레임워크가 서브 타임라인을 부모에 자동 중첩합니다 — 수동으로 추가하지 **마세요**
* 재생 시간은 `tl.duration()`에서 결정됩니다 — 컴포지션 요소에 `data-duration`을 추가하지 **마세요**
* 타임라인은 유한해야 합니다 (무한 루프나 반복 불가)
* 타임라인 ID는 루트 요소의 `data-composition-id` 속성과 정확히 일치해야 합니다

GSAP 타임라인 작업에 대한 완전한 가이드는 [GSAP 애니메이션](/guides/gsap-animation)을 참고하세요.

## 자막 검색 가능성

자막 컴포지션의 경우, 프레임워크가 자막 렌더링을 식별하고 특별 처리할 수 있도록 루트 노드에 다음 속성을 추가하세요:

```html theme={null}
<div
  data-composition-id="captions"
  data-timeline-role="captions"
  data-caption-root="true"
  ...
>
```

## 출력 체크리스트

<Check>
  렌더링 전에 컴포지션이 다음 요구 사항을 충족하는지 확인하세요:

  * 모든 컴포지션의 루트 요소에 `data-width`와 `data-height`가 있는지 확인
  * 각 재사용 가능한 컴포지션이 자체 HTML 파일에 있는지 확인
  * 외부 컴포지션이 `data-composition-src`를 통해 로드되는지 확인
  * 각 외부 컴포지션 파일이 `&lt;template&gt;` 래퍼를 사용하는지 확인
  * 모든 GSAP 타임라인이 올바른 ID로 `window.__timelines`에 등록되어 있는지 확인
  * 타이밍이 지정된 시각적 요소(이미지, div)에 `class="clip"`이 있는지 확인
  * 비디오 요소에는 `class="clip"`이 **없는지** 확인 (프레임워크가 직접 관리)
  * 모든 `data-start` 참조가 기존 클립 ID를 가리키는지 확인
  * `npx hyperframes lint`를 실행하여 구조적 문제를 자동으로 검출
</Check>
