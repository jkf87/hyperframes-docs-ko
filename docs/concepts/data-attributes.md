# 데이터 속성

> 요소의 타이밍과 동작을 제어하는 핵심 속성

Hyperframes는 HTML 데이터 속성을 사용하여 타이밍, 미디어 재생, [컴포지션](/concepts/compositions) 구조를 제어합니다. 이 속성들은 모든 영상의 선언적 구성 요소입니다.

## 타이밍 속성

| 속성               | 예시               | 설명                                                                                                                       |
| ------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `data-start`       | `"0"` 또는 `"intro"` | 초 단위 시작 시간 또는 [상대적 타이밍](#상대적-타이밍)을 위한 클립 ID 참조                                                      |
| `data-duration`    | `"5"`              | 초 단위 재생 시간. 이미지에는 필수. 비디오/오디오에는 선택 사항(기본값: 소스 재생 시간). 컴포지션에는 사용하지 않음.                    |
| `data-track-index` | `"0"`              | 타임라인 트랙 번호. z-순서를 제어하며(높을수록 앞), 클립을 행으로 그룹화합니다. 같은 트랙의 클립은 겹칠 수 없습니다.                    |

## 미디어 속성

| 속성               | 예시     | 설명                                                        |
| ------------------ | -------- | ----------------------------------------------------------- |
| `data-media-start` | `"2"`    | 미디어 재생 오프셋 / 트림 포인트(초 단위). 기본값: `0`           |
| `data-volume`      | `"0.8"`  | 오디오/비디오 볼륨, 0~1                                       |
| `data-has-audio`   | `"true"` | 비디오에 오디오 트랙이 있음을 표시                               |

## 컴포지션 속성

| 속성                   | 예시             | 설명                                                                              |
| ---------------------- | ---------------- | --------------------------------------------------------------------------------- |
| `data-composition-id`  | `"root"`         | [컴포지션](/concepts/compositions) 래퍼의 고유 ID (모든 컴포지션에 필수)               |
| `data-width`           | `"1920"`         | 컴포지션 너비(픽셀)                                                                |
| `data-height`          | `"1080"`         | 컴포지션 높이(픽셀)                                                                |
| `data-composition-src` | `"./intro.html"` | 외부 [컴포지션](/concepts/compositions) HTML 파일 경로                               |

## 요소 가시성

모든 타이밍 요소에 `class="clip"`을 추가하여 런타임이 가시성 라이프사이클을 관리할 수 있도록 하세요:

```html index.html theme={null}
<h1 id="title" class="clip"
    data-start="0" data-duration="5" data-track-index="0">
  Hello World
</h1>
```

## 상대적 타이밍

절대 시작 시간을 직접 계산하는 대신, 클립의 `data-start` 속성에서 다른 클립의 `id`를 참조할 수 있습니다. 이는 "해당 클립이 끝날 때 시작"을 의미합니다:

```html index.html theme={null}
<video id="intro" data-start="0" data-duration="10" data-track-index="0" src="..."></video>
<video id="main" data-start="intro" data-duration="20" data-track-index="0" src="..."></video>
<video id="outro" data-start="main" data-duration="5" data-track-index="0" src="..."></video>
```

`main`은 10초 시점으로 해석되고, `outro`는 30초 시점으로 해석됩니다. `intro`의 재생 시간이 변경되면 후속 클립도 자동으로 이동합니다.

### 오프셋 (갭과 오버랩)

참조된 클립의 끝 지점에서 오프셋을 적용하려면 ID 뒤에 `+ N` 또는 `- N`을 추가하세요:

```html index.html theme={null}
<!-- intro 후 2초 간격 -->
<video id="scene-a" data-start="intro + 2" data-duration="20"
       data-track-index="0" src="..."></video>

<!-- intro와 0.5초 오버랩 (크로스페이드) -->
<video id="scene-b" data-start="intro - 0.5" data-duration="20"
       data-track-index="1" src="..."></video>
```

<Note>
  겹치는 클립은 반드시 서로 다른 트랙에 있어야 합니다. 같은 트랙의 클립은 시간적으로 겹칠 수 없습니다.
</Note>

<Accordion title="상대적 타이밍 규칙 및 제약 조건">
  **같은 컴포지션 내에서만** -- 참조는 클립의 상위 [컴포지션](/concepts/compositions) 내에서만 해석됩니다. 형제 또는 상위 컴포지션의 클립을 참조할 수 없습니다.

  **순환 참조 불가** -- B가 A 다음에 시작하는데 A도 B 다음에 시작하는 구조는 불가능합니다. 리졸버가 순환을 감지하면 오류를 발생시킵니다.

  **참조된 클립의 재생 시간이 알려져 있어야 합니다** -- 명시적인 `data-duration`이나 소스 미디어에서 추론된 재생 시간이 필요합니다. 참조된 클립에 알려진 재생 시간이 없으면 참조를 해석할 수 없습니다.

  **파싱 규칙** -- 값이 유효한 숫자이면 절대 초로 처리됩니다. 그렇지 않으면 다음 중 하나로 파싱됩니다:

  * `&lt;id&gt;` -- 해당 클립이 끝날 때 시작
  * `&lt;id&gt; + &lt;number&gt;` -- 해당 클립 종료 후 N초 뒤에 시작
  * `&lt;id&gt; - &lt;number&gt;` -- 해당 클립 종료 N초 전에 시작

  **체인 길이** -- 참조를 체인으로 연결할 수 있지만(`A` -> `B` -> `C`), 깊은 중첩 체인은 타임라인을 이해하기 어렵게 만듭니다. 가독성을 위해 체인을 3~4단계 이하로 유지하세요.
</Accordion>

## 다음 단계

<CardGroup cols={2}>
  <Card title="컴포지션" icon="layer-group" href="/concepts/compositions">
    컴포지션이 데이터 속성을 사용하여 영상 구조를 정의하는 방법
  </Card>

  <Card title="HTML 스키마 레퍼런스" icon="book" href="/reference/html-schema">
    요소별 상세 정보가 포함된 전체 속성 레퍼런스
  </Card>

  <Card title="GSAP 애니메이션" icon="wand-magic-sparkles" href="/guides/gsap-animation">
    데이터 속성 기반 타이밍과 함께 요소 애니메이션 적용하기
  </Card>

  <Card title="흔한 실수" icon="triangle-exclamation" href="/guides/common-mistakes">
    타이밍과 속성 설정 시 피해야 할 함정
  </Card>
</CardGroup>
