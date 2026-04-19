# @hyperframes/studio

> 라이브 미리보기, 타임라인 뷰, 핫 리로드를 지원하는 비주얼 컴포지션 편집기

studio 패키지는 Hyperframes 컴포지션을 만들고 미리보기할 수 있는 브라우저 기반 비주얼 편집기를 제공합니다. HTML을 편집하는 동안 실시간으로 업데이트되는 영상 미리보기, 모든 클립의 비주얼 타임라인, 탐색 및 재생을 위한 플레이어 컨트롤을 제공합니다.

```bash theme={null}
npm install @hyperframes/studio
```

## 사용 시점

**다음과 같은 경우 `@hyperframes/studio`를 사용하세요:**

* 커스텀 컴포지션 편집기 UI 구축 (예: 자체 웹 애플리케이션에 임베드)
* Hyperframes 미리보기 플레이어를 더 큰 제품에 통합
* 커스텀 패널, 툴바, 또는 통합 기능으로 편집기 확장

**다른 패키지를 사용해야 하는 경우:**

* 개발 중 컴포지션 미리보기 — [CLI](/packages/cli) (`npx hyperframes preview`)를 사용하세요. CLI가 studio를 자동으로 실행합니다
* 컴포지션을 MP4로 렌더링 — [CLI](/packages/cli) 또는 [producer](/packages/producer)를 사용하세요
* 프레임을 프로그래밍 방식으로 캡처 — [engine](/packages/engine)을 사용하세요

<Tip>
  **대부분의 개발 워크플로에서는 studio를 직접 설치할 필요가 없습니다.** `npx hyperframes preview`를 실행하면 핫 리로드와 함께 studio가 자동으로 시작됩니다. 편집기를 자체 애플리케이션에 임베드하는 경우에만 `@hyperframes/studio`를 설치하세요.
</Tip>

## Studio 실행

### CLI를 통한 실행 (권장)

```bash theme={null}
npx hyperframes preview
```

이 명령은 studio 개발 서버를 시작하고, 브라우저에서 컴포지션을 열고, 파일 변경을 감시합니다. 라이브 미리보기를 사용하는 가장 쉬운 방법입니다.

### 모노레포에서 실행

```bash theme={null}
# 루트에서
bun run dev

# 또는 studio 패키지를 직접 지정
bun run --filter @hyperframes/studio dev
```

## 패키지 익스포트

studio에는 두 개의 진입점이 있습니다:

| Import                                | 설명                                   |
| ------------------------------------- | -------------------------------------- |
| `@hyperframes/studio`                 | React 컴포넌트, 훅, 타입              |
| `@hyperframes/studio/tailwind-preset` | studio 스타일링을 위한 Tailwind CSS 프리셋 |

피어 의존성: `react` (18 또는 19), `react-dom` (18 또는 19), `zustand` (4 또는 5).

## 컴포넌트

### 레이아웃

```typescript theme={null}
import { NLELayout, NLEPreview, CompositionBreadcrumb } from '@hyperframes/studio';
import type { CompositionLevel } from '@hyperframes/studio';

// 메인 NLE (비선형 편집기) 레이아웃 컨테이너
<NLELayout>
  {/* 미리보기, 타임라인, 편집기 패널 */}
</NLELayout>

// 미리보기 패널
<NLEPreview />

// 중첩된 컴포지션을 위한 브레드크럼 내비게이션
<CompositionBreadcrumb levels={levels} />
```

### 플레이어 & 타임라인

```typescript theme={null}
import {
  Player,
  PlayerControls,
  Timeline,
  PreviewPanel,
  AgentActivityTrack,
} from '@hyperframes/studio';
import type { AgentActivity, TimelineElement, ActiveEdits } from '@hyperframes/studio';

// 미리보기 플레이어 임베드
<Player />

// 재생 컨트롤 (재생, 일시정지, 탐색, 프레임 이동)
<PlayerControls />

// 스크러버가 있는 타임라인 편집기
<Timeline />

// 미리보기 표시 영역
<PreviewPanel />

// 에이전트 워크플로를 위한 활동 시각화 트랙
<AgentActivityTrack activities={activities} />
```

### 편집기 컴포넌트

```typescript theme={null}
import { SourceEditor, PropertyPanel, FileTree } from '@hyperframes/studio';

// HTML, CSS, JavaScript용 코드 편집기 (CodeMirror 기반)
<SourceEditor />

// 선택된 요소의 속성 인스펙터
<PropertyPanel />

// 프로젝트 파일 브라우저
<FileTree />
```

### 전체 애플리케이션

```typescript theme={null}
import { StudioApp } from '@hyperframes/studio';

// 전체 studio 애플리케이션 (모든 컴포넌트를 래핑)
<StudioApp />
```

## 훅

### `useTimelinePlayer`

플레이어 상태 및 재생 제어를 관리합니다:

```typescript theme={null}
import { useTimelinePlayer } from '@hyperframes/studio';

const player = useTimelinePlayer();
// player.play(), player.pause(), player.seek(time), player.stepForward(), player.stepBackward()
```

### `usePlayerStore`

플레이어 상태를 위한 Zustand 스토어:

```typescript theme={null}
import { usePlayerStore, liveTime, formatTime } from '@hyperframes/studio';

const store = usePlayerStore();
// 현재 시간, 재생 시간, 재생 상태 등에 접근

// 표시용 시간 포맷팅
const display = formatTime(liveTime.current);
```

### `useCodeEditor`

코드 편집기 상태 및 편집 함수:

```typescript theme={null}
import { useCodeEditor } from '@hyperframes/studio';

const editor = useCodeEditor();
// editor.code, editor.setCode(), editor.diff, editor.onChange()
```

### `useElementPicker`

미리보기에서 요소 선택:

```typescript theme={null}
import { useElementPicker } from '@hyperframes/studio';

const picker = useElementPicker();
// picker.selectedElement, picker.selectElement(id), picker.clearSelection()
```

## 기능

### 라이브 미리보기

studio는 Hyperframes 런타임을 사용하여 iframe 내에서 컴포지션을 렌더링합니다. 미리보기에서 보이는 것이 렌더링 시 캡처되는 것과 정확히 동일합니다 — 같은 런타임 코드, 같은 탐색 로직, 같은 클립 라이프사이클을 사용합니다.

HTML 변경 사항은 핫 리로드를 통해 자동으로 반영되므로, 편집기에서 `index.html`을 편집하면 밀리초 내에 브라우저에서 결과를 확인할 수 있습니다.

<Note>
  미리보기의 *시각적* 출력은 렌더링 결과와 정확히 일치합니다. 실시간 *재생 매끄러움*은 하드웨어에 따라 달라지는데, 미리보기는 실제로 브라우저에서 30/60fps로 컴포지션을 재생하기 때문입니다. 렌더링에는 이러한 제약이 없습니다 — 탐색 기반 파이프라인을 통해 각 프레임을 개별적으로 캡처하므로, 비용이 큰 프레임은 렌더링을 느리게 할 뿐 프레임 드롭은 발생하지 않습니다. 미리보기에서 끊김이 보이지만 렌더링된 MP4가 깨끗하다면 이는 예상된 동작입니다. 가장 흔한 원인 패턴은 [성능](/guides/performance)을 참조하세요.
</Note>

### 타임라인 뷰

타임라인 패널은 컴포지션 구조의 시각적 표현을 제공합니다:

* 각 클립은 트랙 위의 색상 막대로 표시됩니다
* 막대의 위치와 너비는 `data-start`와 `data-duration`을 반영합니다
* 트랙은 `data-track-index`에 따라 쌓입니다 (높은 트랙이 앞에 렌더링됩니다)
* 상대 타이밍 참조 (예: `data-start="intro"`)는 해석되어 절대 위치로 표시됩니다

이를 통해 여러 클립이 겹치는 복잡한 컴포지션의 시간 구조를 쉽게 이해할 수 있습니다.

### 플레이어 컨트롤

studio에는 다음과 같은 재생 컨트롤이 포함되어 있습니다:

* **재생 / 일시정지** — 재생 시작 및 정지
* **탐색** — 타임라인의 아무 곳이나 클릭하여 해당 지점으로 이동
* **스크럽** — 재생 헤드를 드래그하여 프레임 단위로 컴포지션을 탐색
* **프레임 이동** — 정밀한 위치 지정을 위해 한 프레임씩 앞뒤로 이동

### 핫 리로드

파일 변경은 서버를 재시작하지 않고도 감지 및 적용됩니다. 미리보기는 가능한 한 현재 재생 위치를 유지하므로, 5초 지점의 애니메이션을 수정할 때 저장할 때마다 다시 탐색할 필요가 없습니다.

## 아키텍처

studio는 다음과 같은 구조의 React 애플리케이션입니다:

1. **Iframe 미리보기** — 컴포지션 HTML은 Hyperframes 런타임이 주입된 격리된 iframe에 로드됩니다. 이를 통해 미리보기가 프로덕션과 동일한 렌더링 경로를 사용합니다.

2. **런타임 브릿지** — studio는 `postMessage`를 통해 iframe과 통신하여 재생을 제어(재생, 일시정지, 탐색)하고 상태 업데이트(현재 시간, 재생 시간, 준비 상태)를 수신합니다.

3. **타임라인 컴포넌트** — `@hyperframes/core`를 사용하여 컴포지션을 파싱하고 클립 타이밍 데이터를 추출한 후 비주얼 타임라인 패널을 렌더링합니다.

4. **파일 감시기** — 개발 서버(Vite 기반)가 프로젝트 파일을 감시하고 변경이 감지되면 핫 모듈 교체를 트리거합니다.

## Tailwind CSS 프리셋

studio는 일관된 스타일링을 위한 Tailwind CSS 프리셋을 익스포트합니다:

```typescript theme={null}
// tailwind.config.ts
import studioPreset from '@hyperframes/studio/tailwind-preset';

export default {
  presets: [studioPreset],
  // ... 사용자 설정
};
```

## 관련 패키지

<CardGroup cols={2}>
  <Card title="CLI" icon="terminal" href="/packages/cli">
    `npx hyperframes preview`로 studio를 실행합니다 — 컴포지션을 미리보는 가장 쉬운 방법입니다.
  </Card>

  <Card title="Core" icon="cube" href="/packages/core">
    studio가 미리보기 및 타임라인 렌더링에 사용하는 타입, 파싱, 런타임입니다.
  </Card>

  <Card title="Producer" icon="film" href="/packages/producer">
    studio에서 만든 컴포지션을 완성된 MP4 파일로 렌더링합니다.
  </Card>

  <Card title="Engine" icon="gear" href="/packages/engine">
    컴포지션의 프로덕션 렌더링을 담당하는 캡처 엔진입니다.
  </Card>
</CardGroup>
