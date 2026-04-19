# @hyperframes/core

> 타입, HTML 생성, 런타임, 린터 — 모든 패키지가 의존하는 기반 패키지입니다.

core 패키지는 다른 모든 Hyperframes 패키지가 기반으로 사용하는 기본 타입, HTML 파싱/생성, 런타임, 컴포지션 린터를 제공합니다. 도구를 구축하거나, 커스텀 통합을 작성하거나, Hyperframes 자체를 확장하는 경우에 필요한 패키지입니다.

```bash theme={null}
npm install @hyperframes/core
```

## 사용 시기

<Tip>
  **대부분의 사용자는 `@hyperframes/core`를 직접 설치할 필요가 없습니다.** [CLI](/packages/cli), [producer](/packages/producer), [studio](/packages/studio) 패키지가 내부적으로 core에 의존합니다. 아래 나열된 작업 중 하나를 수행하는 경우에만 필요합니다.
</Tip>

**`@hyperframes/core`가 필요한 경우:**

* 프로그래밍 방식으로 컴포지션 린트 (CI 파이프라인, 에디터 플러그인)
* HTML 컴포지션을 구조화된 TypeScript 객체로 파싱
* 데이터에서 컴포지션 HTML 생성 (예: API 또는 AI 에이전트에서)
* 자체 도구를 위한 Hyperframes 타입 시스템 접근
* 커스텀 플레이어에 Hyperframes 런타임 임베드

**다른 패키지를 사용해야 하는 경우:**

* 브라우저에서 컴포지션 미리보기 — [CLI](/packages/cli) (`npx hyperframes preview`) 또는 [studio](/packages/studio) 사용
* 컴포지션을 MP4로 렌더링 — [CLI](/packages/cli) (`npx hyperframes render`) 또는 [producer](/packages/producer) 사용
* 헤드리스 브라우저에서 프레임 캡처 — [engine](/packages/engine) 사용

## 패키지 내보내기

core 패키지에는 네 개의 진입점이 있습니다:

| Import                       | 설명                                             |
| ---------------------------- | ------------------------------------------------------- |
| `@hyperframes/core`          | 타입, 파서, 생성기, 어댑터, 런타임 유틸리티 |
| `@hyperframes/core/lint`     | 컴포지션 린터                                      |
| `@hyperframes/core/compiler` | 타이밍 컴파일러, HTML 컴파일러, 번들러, 정적 가드   |
| `@hyperframes/core/runtime`  | 브라우저 주입을 위한 사전 빌드된 IIFE 런타임            |

## 타입

core 타입 시스템은 컴포지션, 타임라인 요소, 변수를 모델링합니다:

```typescript theme={null}
import type {
  TimelineElement,
  TimelineMediaElement,
  TimelineTextElement,
  TimelineCompositionElement,
  TimelineElementType,       // "video" | "image" | "text" | "audio" | "composition"
  CompositionSpec,
  CompositionVariable,
  CanvasResolution,          // "landscape" | "portrait"
  Orientation,               // "16:9" | "9:16"
  FrameAdapter,
  FrameAdapterContext,
} from '@hyperframes/core';

// 타입 가드
import {
  isTextElement,
  isMediaElement,
  isCompositionElement,
  isStringVariable,
  isNumberVariable,
  isColorVariable,
  isBooleanVariable,
  isEnumVariable,
} from '@hyperframes/core';

// 상수
import {
  CANVAS_DIMENSIONS,        // { landscape: { width, height }, portrait: { width, height } }
  TIMELINE_COLORS,
  DEFAULT_DURATIONS,
} from '@hyperframes/core';
```

### 변수 타입

컴포지션은 동적 콘텐츠를 위해 타입이 지정된 변수를 노출할 수 있습니다:

```typescript theme={null}
import type {
  CompositionVariableType,   // "string" | "number" | "color" | "boolean" | "enum"
  StringVariable,
  NumberVariable,
  ColorVariable,
  BooleanVariable,
  EnumVariable,
} from '@hyperframes/core';
```

### 키프레임 타입

```typescript theme={null}
import type {
  Keyframe,
  KeyframeProperties,
  ElementKeyframes,
  StageZoom,
  StageZoomKeyframe,
} from '@hyperframes/core';

import { getDefaultStageZoom } from '@hyperframes/core';
```

## HTML 파싱 및 생성

HTML과 구조화된 데이터 간의 양방향 변환:

```typescript theme={null}
import { parseHtml, generateHyperframesHtml } from '@hyperframes/core';
import type { ParsedHtml, CompositionMetadata } from '@hyperframes/core';

// HTML을 구조화된 데이터로 파싱
const parsed: ParsedHtml = parseHtml(htmlString);
// parsed.elements, parsed.gsapScript, parsed.styles, parsed.resolution, parsed.keyframes

// 컴포지션 메타데이터 추출
import { extractCompositionMetadata } from '@hyperframes/core';
const meta: CompositionMetadata = extractCompositionMetadata(htmlString);
// meta.id, meta.duration, meta.width, meta.height, meta.variables

// 구조화된 데이터에서 HTML 생성
const html = generateHyperframesHtml(elements, {
  animations,
  styles,
  resolution: 'landscape',
  compositionId: 'my-video',
});
```

### HTML 수정

```typescript theme={null}
import {
  updateElementInHtml,
  addElementToHtml,
  removeElementFromHtml,
  validateCompositionHtml,
} from '@hyperframes/core';

// 요소의 속성 업데이트
const updatedHtml = updateElementInHtml(html, 'el-1', { start: 5 });

// 새 요소 추가
const newHtml = addElementToHtml(html, newElement);

// 요소 제거
const cleanHtml = removeElementFromHtml(html, 'el-1');

// HTML 구조 유효성 검사
const result = validateCompositionHtml(html);
// result.valid, result.errors
```

### GSAP 스크립트 파싱

```typescript theme={null}
import {
  parseGsapScript,
  serializeGsapAnimations,
  updateAnimationInScript,
  addAnimationToScript,
  removeAnimationFromScript,
  getAnimationsForElement,
  validateCompositionGsap,
  keyframesToGsapAnimations,
  gsapAnimationsToKeyframes,
  SUPPORTED_PROPS,            // 애니메이션 가능한 속성
  SUPPORTED_EASES,            // 사용 가능한 이징 함수
} from '@hyperframes/core';
import type { GsapAnimation, GsapMethod, ParsedGsap } from '@hyperframes/core';

// GSAP 스크립트를 구조화된 애니메이션으로 파싱
const parsed: ParsedGsap = parseGsapScript(scriptContent);
// parsed.animations, parsed.timelineVar, parsed.preamble, parsed.postamble

// 스크립트로 다시 직렬화
const script = serializeGsapAnimations(parsed.animations);
```

### HTML 생성

```typescript theme={null}
import {
  generateHyperframesHtml,
  generateGsapTimelineScript,
  generateHyperframesStyles,
} from '@hyperframes/core';

// 완전한 HTML 컴포지션 생성
const html = generateHyperframesHtml(elements, options);

// GSAP 스크립트만 생성
const script = generateGsapTimelineScript(animations, options);

// CSS 스타일 생성
const { coreCss, customCss, googleFontsLink } = generateHyperframesStyles(
  elements, 'landscape', customStyles
);
```

### 템플릿 유틸리티

```typescript theme={null}
import {
  generateBaseHtml,
  getStageStyles,
  GSAP_CDN,
  BASE_STYLES,
  ELEMENT_BASE_STYLES,
  MEDIA_STYLES,
  TEXT_STYLES,
  ZOOM_CONTAINER_STYLES,
} from '@hyperframes/core';

// 해상도에 맞는 기본 HTML 구조 생성
const baseHtml = generateBaseHtml('landscape');
const styles = getStageStyles('portrait');
```

## 린터

컴포지션 린터는 렌더링 실패나 예기치 않은 동작을 유발할 수 있는 구조적 문제를 검사합니다. CLI에서 `npx hyperframes lint`로 실행하거나, 프로그래밍 방식으로 호출할 수 있습니다:

```typescript theme={null}
import { lintHyperframeHtml, lintMediaUrls } from '@hyperframes/core/lint';
import type {
  HyperframeLintResult,
  HyperframeLintFinding,
  HyperframeLintSeverity,     // "error" | "warning"
  HyperframeLinterOptions,
} from '@hyperframes/core/lint';

const result: HyperframeLintResult = lintHyperframeHtml(html, { filePath: 'index.html' });
// result.ok, result.errorCount, result.warningCount, result.findings

for (const finding of result.findings) {
  console.log(finding.severity, finding.code, finding.message);
  // finding.file, finding.selector, finding.elementId, finding.fixHint, finding.snippet
}

// 추가 미디어 URL 유효성 검사
const mediaFindings = lintMediaUrls(result.findings);
```

감지되는 문제는 다음과 같습니다:

* 타임라인 등록 누락 (`window.__timelines`)
* 음소거되지 않은 비디오 요소 (자동 재생 실패 원인)
* 시간 지정된 표시 요소에 `class="clip"` 누락
* 더 이상 사용되지 않는 속성 이름
* 컴포지션 크기 누락 (`data-width`, `data-height`)
* 존재하지 않는 클립 ID를 참조하는 잘못된 `data-start`

<Info>
  린터가 감지하는 전체 목록과 각 문제 해결 방법은 [자주 하는 실수](/guides/common-mistakes)와 [문제 해결](/guides/troubleshooting)을 참조하세요.
</Info>

## 컴파일러

컴파일러 하위 패키지는 타이밍 해석, HTML 컴파일, 번들링을 처리합니다:

```typescript theme={null}
// 타이밍 컴파일러 (브라우저 안전 — Node.js 의존성 없음)
import {
  compileTimingAttrs,
  injectDurations,
  extractResolvedMedia,
  clampDurations,
} from '@hyperframes/core/compiler';
import type {
  UnresolvedElement,
  ResolvedDuration,
  ResolvedMediaElement,
  CompilationResult,
} from '@hyperframes/core/compiler';

// HTML에서 타이밍 속성 컴파일
const compiled: CompilationResult = compileTimingAttrs(html);

// 해석된 재생 시간을 HTML에 다시 주입
const updatedHtml = injectDurations(html, compiled.durations);

// 해석된 미디어 요소 추출
const media: ResolvedMediaElement[] = extractResolvedMedia(html);
```

```typescript theme={null}
// HTML 컴파일러 (Node.js — 미디어 프로빙 필요)
import { compileHtml } from '@hyperframes/core/compiler';
import type { MediaDurationProber } from '@hyperframes/core/compiler';

const prober: MediaDurationProber = async (src) => getDuration(src);
const compiledHtml = await compileHtml(html, prober);
```

```typescript theme={null}
// HTML 번들러 (Node.js — 단일 파일로 번들링)
import { bundleToSingleHtml } from '@hyperframes/core/compiler';
import type { BundleOptions } from '@hyperframes/core/compiler';

const bundled = await bundleToSingleHtml({ entryPath: './index.html', inline: true });
```

```typescript theme={null}
// 정적 가드 — HTML 계약 유효성 검사
import { validateHyperframeHtmlContract } from '@hyperframes/core/compiler';
import type {
  HyperframeStaticGuardResult,
  HyperframeStaticFailureReason,
} from '@hyperframes/core/compiler';

const guard: HyperframeStaticGuardResult = validateHyperframeHtmlContract(html);
// guard.ok, guard.failures[]
// 실패 사유: "missing_composition_id" | "missing_composition_dimensions"
//   | "missing_timeline_registry" | "invalid_script_syntax"
//   | "invalid_static_hyperframe_contract"
```

## 런타임

Hyperframes 런타임은 브라우저에서 재생, 탐색, 클립 생명주기를 관리합니다. core 패키지는 런타임을 빌드하고 로드하기 위한 유틸리티를 제공합니다:

```typescript theme={null}
import {
  loadHyperframeRuntimeSource,
  buildHyperframesRuntimeScript,
  HYPERFRAME_RUNTIME_ARTIFACTS,
  HYPERFRAME_RUNTIME_CONTRACT,
  HYPERFRAME_RUNTIME_GLOBALS,
  HYPERFRAME_BRIDGE_SOURCES,
  HYPERFRAME_CONTROL_ACTIONS,
} from '@hyperframes/core';
import type {
  HyperframeControlAction,
  HyperframesRuntimeBuildOptions,
} from '@hyperframes/core';

// 사전 빌드된 런타임 IIFE 로드
const runtimeSource = loadHyperframeRuntimeSource();

// 커스텀 런타임 스크립트 빌드
const script = buildHyperframesRuntimeScript(options);
```

사전 빌드된 런타임 IIFE는 직접 import로 사용할 수 있습니다:

```typescript theme={null}
import runtime from '@hyperframes/core/runtime';
```

## 프레임 어댑터

core 패키지는 [프레임 어댑터](/concepts/frame-adapters) 인터페이스를 정의하고 내장 GSAP 어댑터를 제공합니다:

```typescript theme={null}
import { createGSAPFrameAdapter } from '@hyperframes/core';
import type {
  FrameAdapter,
  FrameAdapterContext,
  GSAPTimelineLike,
  CreateGSAPFrameAdapterOptions,
} from '@hyperframes/core';

// GSAP 프레임 어댑터 생성
const adapter: FrameAdapter = createGSAPFrameAdapter({
  id: 'my-composition',
  fps: 30,
  timeline: gsapTimeline,
});

// 어댑터 생명주기
await adapter.init?.(context);
const durationFrames = adapter.getDurationFrames();
await adapter.seekFrame(42);
await adapter.destroy?.();
```

## 미디어 유틸리티

```typescript theme={null}
import {
  MEDIA_VISUAL_STYLE_PROPERTIES,
  copyMediaVisualStyles,
  quantizeTimeToFrame,
} from '@hyperframes/core';
import type { MediaVisualStyleProperty } from '@hyperframes/core';

// 시간 값을 가장 가까운 프레임 경계로 양자화
const frameTime = quantizeTimeToFrame(5.033, 30); // → 5.033... 프레임에 맞춤

// 미디어 요소 간 시각 스타일 복사
copyMediaVisualStyles(fromElement, toElement);
```

## Picker API

에디터 UI의 요소 선택용:

```typescript theme={null}
import type {
  HyperframePickerApi,
  HyperframePickerBoundingBox,
  HyperframePickerElementInfo,
} from '@hyperframes/core';
```

## 관련 패키지

<CardGroup cols={2}>
  <Card title="CLI" icon="terminal" href="/packages/cli">
    컴포지션을 생성, 미리보기, 린트, 렌더링하는 가장 쉬운 방법입니다.
  </Card>

  <Card title="Engine" icon="gear" href="/packages/engine">
    core 타입과 런타임을 사용하는 저수준 프레임 캡처 파이프라인입니다.
  </Card>

  <Card title="Producer" icon="film" href="/packages/producer">
    core와 engine 위에 구축된 전체 렌더링 파이프라인입니다.
  </Card>

  <Card title="Studio" icon="palette" href="/packages/studio">
    미리보기를 위해 core 런타임을 임베드하는 시각적 컴포지션 에디터입니다.
  </Card>
</CardGroup>
