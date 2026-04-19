# 흔한 실수

> Hyperframes 컴포지션을 망가뜨리는 함정들.

이 문서에서 다루는 실수들은 린터로 자동 감지할 수 없는 것들입니다. 자동화된 검사를 실행하려면 `npx hyperframes lint`를 사용하세요([CLI](/packages/cli#lint) 참고).

<Warning>
  처음 두 가지 실수 — 비디오 요소의 크기를 애니메이션하는 것과 스크립트에서 미디어 재생을 직접 제어하는 것 — 가 컴포지션 오류의 가장 흔한 원인입니다. 비디오가 이상하게 보인다면 이 두 가지를 먼저 확인하세요.
</Warning>

<AccordionGroup>
  <Accordion title="비디오 요소 크기 애니메이션">
    **증상:** 비디오 프레임이 갱신되지 않거나 브라우저 성능이 크게 저하됩니다.

    **원인:** GSAP으로 `&lt;video&gt;` 요소의 `width`, `height`, `top`, `left`를 직접 애니메이션하면 브라우저가 프레임 렌더링을 중단할 수 있습니다.

    **수정 전 (오류):**

    ```javascript index.html theme={null}
    // 비디오 요소를 직접 애니메이션 — 프레임 렌더링이 중단됨
    tl.to("#el-video", { width: 500, height: 280, top: 700, left: 1400 }, 26);
    ```

    **수정 후 (정상):**

    ```html index.html theme={null}
    <!-- 비디오를 div로 감싸고 래퍼를 애니메이션 -->
    <div id="pip-wrapper" style="position: absolute; width: 1920px; height: 1080px;">
      <video id="el-video" data-start="0" data-track-index="0"
             src="./assets/video.mp4" style="width: 100%; height: 100%;"></video>
    </div>
    ```

    ```javascript index.html theme={null}
    // 래퍼를 애니메이션 — 비디오는 100%로 채워짐
    tl.to("#pip-wrapper", { width: 500, height: 280, top: 700, left: 1400 }, 26);
    ```

    화면 속 화면(PIP)과 같은 시각 효과에는 타이밍이 지정되지 않은 래퍼 `&lt;div&gt;`를 사용하세요. 래퍼를 애니메이션하고 비디오는 CSS로 채우면 됩니다.
  </Accordion>

  <Accordion title="스크립트에서 미디어 재생 제어">
    **증상:** 오디오/비디오 재생이 동기화되지 않거나, 재생되지 않아야 할 때 재생됩니다.

    **원인:** 스크립트에서 `video.play()`, `video.pause()`를 호출하거나 `audio.currentTime`을 설정하는 것. [프레임워크가 모든 미디어 재생을 관리합니다](/reference/html-schema#framework-managed-behavior).

    **수정 전 (오류):**

    ```javascript index.html theme={null}
    // 프레임워크 미디어 동기화와 충돌
    document.getElementById("el-video").play();
    document.getElementById("el-audio").currentTime = 5;
    ```

    **수정 후 (정상):**

    ```javascript index.html theme={null}
    // 미디어 재생을 직접 제어하지 마세요. 프레임워크가 처리합니다.
    // GSAP은 시각적 애니메이션에만 사용하세요:
    tl.to("#el-video", { opacity: 1, duration: 0.5 }, 0);
    ```

    프레임워크는 [`data-start`](/concepts/data-attributes#timing-attributes), [`data-media-start`](/concepts/data-attributes#media-attributes), [`data-volume`](/concepts/data-attributes#media-attributes)을 읽어 미디어의 재생 시점과 방식을 제어합니다. HTML 프리미티브와 스크립트의 역할 분리에 대해서는 [컴포지션: 두 개의 레이어](/concepts/compositions#two-layers-primitives-and-scripts)를 참고하세요.
  </Accordion>

  <Accordion title="컴포지션 길이가 비디오보다 짧은 경우">
    **증상:** 비디오가 몇 초 재생된 후 멈춥니다. 타임라인이 비디오 길이와 관계없이 8~10초로 표시됩니다.

    **원인:** 컴포지션의 길이는 비디오의 `data-duration`이 아니라 [GSAP 타임라인의 길이](/guides/gsap-animation#timeline-duration-and-composition-duration)와 같습니다. 마지막 GSAP 애니메이션이 8초에 끝나면, 비디오 소스의 길이와 관계없이 컴포지션은 8초입니다.

    **수정 전 (오류):**

    ```javascript index.html theme={null}
    // 타임라인이 7.8초밖에 안 됨 — 비디오가 7.8초 후에 잘림
    tl.to("#lower-third", { left: -640, duration: 0.6 }, 7.2);
    ```

    **수정 후 (정상):**

    ```javascript index.html theme={null}
    tl.to("#lower-third", { left: -640, duration: 0.6 }, 7.2);

    // 비디오 길이에 맞게 타임라인을 283초까지 확장
    tl.set({}, {}, 283);
    ```

    `tl.set({}, {}, TIME)`은 지정된 시간에 0초짜리 트윈을 추가하여 어떤 요소에도 영향을 주지 않으면서 타임라인을 연장합니다.

    <Tip>
      빠른 확인 방법: `npx hyperframes compositions`를 실행하면 각 컴포지션의 해석된 길이를 확인할 수 있습니다. 예상보다 짧다면 타임라인을 연장해야 합니다.
    </Tip>
  </Accordion>

  <Accordion title="타이밍이 지정된 요소에 class='clip' 누락">
    **증상:** 요소가 `data-start`와 `data-duration` 타이밍을 무시하고 항상 표시됩니다.

    **원인:** [`class="clip"`](/concepts/data-attributes#element-visibility) 속성은 런타임에 요소의 가시성 생명주기를 관리하도록 지시합니다. 이 속성이 없으면 요소가 항상 렌더링됩니다.

    **수정 전 (오류):**

    ```html index.html theme={null}
    <!-- class="clip"이 없음 — 이 요소는 항상 표시됨 -->
    <h1 id="title" data-start="2" data-duration="5" data-track-index="0">
      Hello World
    </h1>
    ```

    **수정 후 (정상):**

    ```html index.html theme={null}
    <!-- class="clip"이 있으면 런타임이 2초~7초 사이에만 이 요소를 표시함 -->
    <h1 id="title" class="clip" data-start="2" data-duration="5" data-track-index="0">
      Hello World
    </h1>
    ```

    <Note>
      린터가 이 문제를 감지합니다: `npx hyperframes lint`를 실행하면 `class="clip"`이 누락된 타이밍 요소에 경고가 표시됩니다.
    </Note>
  </Accordion>

  <Accordion title="과도하게 큰 원본 이미지">
    **증상:** 이미지가 화면에 표시되는 장면에서 미리보기가 끊깁니다. 렌더링이 예상보다 느립니다.

    **원인:** 원본 이미지의 해상도가 캔버스보다 훨씬 높은 경우. Chrome은 이미지를 표시하기 전에 원시 RGBA 비트맵으로 디코딩하며, 비트맵 크기는 `너비 × 높이 × 4` 바이트로 디스크상의 파일 크기와 무관합니다. 7000×5000 JPEG는 파일이 2MB에 불과해도 디코딩 시 140MB입니다.

    이러한 이미지를 384×1080 영역에 표시하면 메모리를 낭비하고 매 프레임마다 거대한 텍스처를 리샘플링해야 합니다.

    **수정 전 (비효율적):**

    ```html index.html theme={null}
    <!-- 7000x5000 원본, 디코딩 시 ~140MB -->
    <img class="clip" data-start="0" data-duration="3"
         src="./assets/hero-scene.jpg" />
    ```

    **수정 후 (캔버스에 맞게 조정):**

    ```bash Terminal theme={null}
    # 이미지 배치를 3840x3840 이내로 리사이즈, 비율 유지
    mkdir -p assets/resized
    mogrify -path assets/resized -resize 3840x3840\> assets/*.jpg
    ```

    ```html index.html theme={null}
    <!-- ~3840x2560 원본, 디코딩 시 ~40MB -->
    <img class="clip" data-start="0" data-duration="3"
         src="./assets/resized/hero-scene.jpg" />
    ```

    **경험 법칙:** 원본 이미지는 캔버스 크기의 최대 2배를 넘지 않도록 합니다. 1920×1080 컴포지션의 경우 3840×2160이면 충분합니다. [성능: 이미지 크기 조정](/guides/performance#image-sizing)을 참고하세요.
  </Accordion>

  <Accordion title="과도한 backdrop-filter 스택">
    **증상:** 특정 장면에서 미리보기가 5~10fps로 떨어집니다. 다른 부분은 정상입니다.

    **원인:** 큰 요소에 `backdrop-filter: blur()`를 적용하는 것, 특히 높은 반경으로 여러 겹 쌓는 경우. 각 블러 레이어는 컴포지터가 요소 뒤의 픽셀을 샘플링하고, 블러 커널을 실행하고, 결과를 합성하도록 강제합니다. 레이어가 쌓이면 비용이 배로 증가합니다.

    **수정 전 (고비용):**

    ```css theme={null}
    /* 한쪽당 8개 레이어 = 매 프레임 16번의 블러 패스 */
    .pb-1 { backdrop-filter: blur(1px); }
    .pb-2 { backdrop-filter: blur(2px); }
    .pb-3 { backdrop-filter: blur(4px); }
    .pb-4 { backdrop-filter: blur(8px); }
    .pb-5 { backdrop-filter: blur(16px); }
    .pb-6 { backdrop-filter: blur(32px); }
    .pb-7 { backdrop-filter: blur(64px); }
    .pb-8 { backdrop-filter: blur(128px); }
    ```

    **수정 후 (3개의 최적화된 레이어):**

    ```css theme={null}
    /* 적은 패스 수와 선별된 반경 — 시각적으로 유사하지만 훨씬 저렴 */
    .pb-1 { backdrop-filter: blur(4px); }
    .pb-2 { backdrop-filter: blur(16px); }
    .pb-3 { backdrop-filter: blur(48px); }
    ```

    **가이드라인:**

    * 영역당 `backdrop-filter` 스택 레이어를 2~3개로 유지
    * 넓은 영역에서 64px 이상의 반경은 피하세요 — 가장 큰 반경이 전체 비용을 지배합니다
    * 정적 블러 효과는 PNG로 한 번 사전 렌더링한 후 일반 `&lt;img&gt;`로 오버레이

    전체 분석은 [성능: backdrop-filter: blur()](/guides/performance#backdrop-filter-blur)를 참고하세요.
  </Accordion>

  <Accordion title="타임라인 키가 data-composition-id와 불일치">
    **증상:** 애니메이션이 재생되지 않습니다. 컴포지션이 정적으로 표시됩니다.

    **원인:** `window.__timelines`에 사용하는 키가 컴포지션 루트 요소의 [`data-composition-id`](/concepts/data-attributes#composition-attributes) 속성과 정확히 일치해야 합니다.

    **수정 전 (오류):**

    ```javascript index.html theme={null}
    // 불일치: HTML에는 "my-video"인데 스크립트에서는 "root"로 등록
    // &lt;div data-composition-id="my-video" ...&gt;
    window.__timelines["root"] = tl;
    ```

    **수정 후 (정상):**

    ```javascript index.html theme={null}
    // 키가 data-composition-id 속성과 일치
    // &lt;div data-composition-id="my-video" ...&gt;
    window.__timelines["my-video"] = tl;
    ```
  </Accordion>
</AccordionGroup>

## 디버깅 체크리스트

문제가 발생하면 다음 순서로 확인하세요:

1. **린터 실행:** `npx hyperframes lint` — 대부분의 구조적 문제를 감지합니다
2. **타임라인 등록 여부:** `window.__timelines["&lt;id&gt;"]`가 설정되어 있나요? 키가 [`data-composition-id`](/concepts/data-attributes#composition-attributes)와 일치하나요?
3. **GSAP 전용 애니메이션인가?** 시각적 속성(opacity, transform, color)만 애니메이션하세요 — [GSAP 애니메이션](/guides/gsap-animation#key-rules) 참고
4. **타임라인이 충분히 긴가?** 끝에 `tl.set({}, {}, DURATION)`을 추가하세요 — [타임라인 길이](/guides/gsap-animation#timeline-duration-and-composition-duration) 참고
5. **콘솔 에러가 있나?** 브라우저 콘솔을 열어보세요 — 런타임 에러는 `[Browser:ERROR]`로 표시됩니다
6. **여전히 막혔나요?** 환경 및 렌더링 문제는 [문제 해결](/guides/troubleshooting)을 참고하세요

## 다음 단계

<CardGroup cols={2}>
  <Card title="문제 해결" icon="wrench" href="/guides/troubleshooting">
    환경 및 렌더링 문제 해결
  </Card>

  <Card title="GSAP 애니메이션" icon="wand-magic-sparkles" href="/guides/gsap-animation">
    애니메이션 규칙과 패턴 복습
  </Card>

  <Card title="HTML 스키마 레퍼런스" icon="code" href="/reference/html-schema">
    전체 속성 레퍼런스 및 체크리스트
  </Card>

  <Card title="데이터 속성" icon="database" href="/concepts/data-attributes">
    타이밍, 미디어, 컴포지션 속성
  </Card>
</CardGroup>
