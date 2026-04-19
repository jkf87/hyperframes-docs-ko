# GSAP 애니메이션

> GSAP으로 Hyperframes 컴포지션에 애니메이션을 추가합니다.

Hyperframes는 애니메이션을 위해 [GSAP](https://gsap.com/)을 사용합니다. 타임라인은 일시정지 상태로 생성되며 런타임이 재생을 제어합니다 — 여러분은 애니메이션을 정의하고, 프레임워크는 재생을 처리합니다. 애니메이션 런타임이 Hyperframes에 어떻게 연결되는지에 대한 배경 지식은 [Frame Adapters](/concepts/frame-adapters)를 참고하세요.

## 설정

GSAP을 포함시키고 일시정지된 타임라인을 생성합니다:

```html index.html theme={null}
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script>
  // 1. 일시정지된 타임라인 생성 — 프레임워크가 재생을 제어합니다
  const tl = gsap.timeline({ paused: true });

  // 2. position 파라미터(3번째 인자)로 절대 타이밍 애니메이션 추가
  tl.to("#title", { opacity: 1, duration: 0.5 }, 0);

  // 3. 전역 타임라인 레지스트리 초기화 (이미 있으면 건너뜀)
  window.__timelines = window.__timelines || {};

  // 4. data-composition-id를 키로 하여 타임라인 등록
  window.__timelines["root"] = tl;
</script>
```

<Note>
  `window.__timelines`에 사용하는 키는 컴포지션 루트 요소의 `data-composition-id` 속성과 일치해야 합니다. 루트 요소가 어떻게 구성되는지는 [Compositions](/concepts/compositions)를 참고하세요.
</Note>

## 주요 규칙

1. **타임라인은 항상 `{ paused: true }`로 생성하세요** — 프레임워크가 [결정론적 시킹](/concepts/determinism)을 통해 재생을 제어합니다
2. **타임라인은 `window.__timelines`에 등록하세요**. 키는 [`data-composition-id`](/concepts/data-attributes#composition-attributes)를 사용합니다
3. **절대 타이밍에는 position 파라미터**(3번째 인자)를 사용하세요: `tl.to(el, vars, 1.5)`
4. **시각적 속성만 애니메이션하세요** — 스크립트에서 미디어 재생을 제어하지 마세요

## 지원되는 메서드

| 메서드                                           | 설명                    |
| ------------------------------------------------ | ----------------------- |
| `tl.to(target, vars, position)`                  | 지정 값까지 애니메이션  |
| `tl.from(target, vars, position)`                | 지정 값에서부터 애니메이션 |
| `tl.fromTo(target, fromVars, toVars, position)`  | from/to 값으로 애니메이션 |
| `tl.set(target, vars, position)`                 | 값을 즉시 설정          |

## 지원되는 속성

`opacity`, `x`, `y`, `scale`, `scaleX`, `scaleY`, `rotation`, `width`, `height`, `visibility`, `color`, `backgroundColor`와 CSS로 애니메이션 가능한 모든 속성.

## 타임라인 길이와 컴포지션 길이

컴포지션의 길이는 GSAP 타임라인의 길이와 같습니다. 둘은 직접적으로 연결되어 있습니다:

```javascript compositions/intro-anim.html theme={null}
// 마지막 애니메이션이 3초에 끝나면...
tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
tl.to("#title", { opacity: 0, duration: 1 }, 2);
// ...이 컴포지션의 길이는 정확히 3초가 됩니다.
```

컴포지션에 283초짜리 비디오 클립이 있지만 마지막 GSAP 애니메이션이 8초에 끝난다면, 컴포지션은 8초로 끝나버리고 비디오는 잘리게 됩니다. 타임라인을 비디오 길이에 맞추려면:

```javascript index.html theme={null}
// 모든 시각적 애니메이션
tl.to("#lower-third", { left: -640, duration: 0.6 }, 7.2);

// 비디오 길이에 맞춰 타임라인을 283초로 연장합니다.
// 요소에 영향을 주지 않는 0초짜리 tween을 283초 지점에 추가합니다.
tl.set({}, {}, 283);
```

<Warning>
  Hyperframes에서 가장 흔한 실수 중 하나입니다. 비디오가 일찍 잘려 나간다면 타임라인이 너무 짧은 것입니다. 자세한 내용은 [흔한 실수: 컴포지션 길이가 비디오보다 짧음](/guides/common-mistakes)을 참고하세요.
</Warning>

## 하지 말아야 할 것

다음 패턴은 컴포지션을 깨뜨리거나 동기화 문제를 일으킵니다:

```javascript index.html theme={null}
// 잘못됨: 스크립트에서 미디어 재생 — 미디어 재생은 프레임워크가 담당합니다
document.getElementById("el-video").play();
document.getElementById("el-audio").currentTime = 5;

// 잘못됨: 일시정지되지 않은 타임라인 생성
const tl = gsap.timeline(); // { paused: true }가 빠짐!

// 잘못됨: <video> 요소의 크기를 직접 애니메이션
tl.to("#el-video", { width: 500, height: 280 }, 5);

// 잘못됨: 서브 타임라인을 수동으로 중첩
const masterTL = window.__timelines["root"];
masterTL.add(window.__timelines["intro-anim"], 0);
```

프레임워크가 [미디어 재생](/reference/html-schema#framework-managed-behavior), [클립 생명주기](/concepts/compositions#two-layers-primitives-and-scripts), [서브 컴포지션 중첩](#sub-composition-timelines)을 자동으로 관리합니다. 이 동작을 중복으로 수행하는 스크립트는 충돌을 일으킵니다.

## 서브 컴포지션 타임라인

[중첩된 컴포지션](/concepts/compositions#nested-compositions)은 각자 자신의 타임라인을 등록합니다. 프레임워크는 [`data-start`](/concepts/data-attributes#timing-attributes)를 기준으로 서브 컴포지션 타임라인을 부모에 자동으로 중첩시킵니다:

```javascript compositions/intro-anim.html theme={null}
// compositions/intro-anim.html 내부
const tl = gsap.timeline({ paused: true });
tl.from(".title", { opacity: 0, y: -50, duration: 1 });
window.__timelines["intro-anim"] = tl;

// 서브 타임라인을 마스터에 수동으로 추가하지 마세요:
// masterTL.add(window.__timelines["intro-anim"], 0); // 불필요
```

<Warning>
  `&lt;video&gt;` 요소의 `width`, `height`, `top`, `left`를 직접 애니메이션하지 마세요. 브라우저가 프레임 렌더링을 중단시킬 수 있습니다. 비디오를 `&lt;div&gt;`로 감싸고 래퍼를 애니메이션하세요. 자세한 설명은 [흔한 실수](/guides/common-mistakes)를 참고하세요.
</Warning>

## 다음 단계

<CardGroup cols={2}>
  <Card title="컴포지션" icon="layer-group" href="/concepts/compositions">
    타임라인이 애니메이션하는 구성 요소를 이해합니다
  </Card>

  <Card title="Frame Adapters" icon="plug" href="/concepts/frame-adapters">
    GSAP이 렌더 파이프라인에 어떻게 연결되는지 배웁니다
  </Card>

  <Card title="흔한 실수" icon="triangle-exclamation" href="/guides/common-mistakes">
    애니메이션을 깨뜨리는 함정을 피합니다
  </Card>

  <Card title="HTML 스키마 레퍼런스" icon="code" href="/reference/html-schema">
    컴포지션 속성의 전체 레퍼런스
  </Card>
</CardGroup>
