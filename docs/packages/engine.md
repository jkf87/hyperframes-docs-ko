# @hyperframes/engine

> Chrome의 BeginFrame API를 활용한 시크 가능한 페이지-투-비디오 캡처 엔진.

engine 패키지는 저수준 비디오 캡처 파이프라인을 제공합니다. 헤드리스 Chrome에서 HTML 페이지를 로드하고, 각 프레임을 독립적으로 시크한 뒤, Chrome의 `HeadlessExperimental.beginFrame` API를 사용하여 픽셀 버퍼를 캡처합니다. 이 레이어가 Hyperframes 렌더링을 결정론적으로 만드는 핵심입니다.

```bash theme={null}
npm install @hyperframes/engine
```

## 사용 시기

<Warning>
  **대부분의 사용자는 engine을 직접 사용할 필요가 없습니다.** 대신 [CLI](/packages/cli) (`npx hyperframes render`) 또는 [producer](/packages/producer) 패키지를 사용하세요 — 런타임 주입, 오디오 믹싱, 인코딩을 모두 처리해 줍니다.
</Warning>

**`@hyperframes/engine`를 사용해야 하는 경우:**

* 프레임 캡처를 완전히 제어하는 커스텀 렌더링 파이프라인 구축
* 기존 비디오 처리 시스템에 Hyperframes 캡처 통합
* 비디오 인코딩 없이 개별 프레임 캡처 (예: 썸네일이나 스프라이트 시트)
* FFmpeg가 아닌 커스텀 인코딩 백엔드 구현

**다른 패키지를 사용해야 하는 경우:**

* HTML 컴포지션을 완성된 MP4 또는 WebM으로 렌더링 — [producer](/packages/producer) 또는 [CLI](/packages/cli) 사용
* 브라우저에서 컴포지션 미리보기 — [CLI](/packages/cli) 또는 [studio](/packages/studio) 사용
* 컴포지션 HTML 린트 또는 파싱 — [core](/packages/core) 사용

## 작동 방식

engine은 화면 녹화와 근본적으로 다른 **시크 앤 캡처** 루프를 구현합니다:

<Steps>
  <Step title="헤드리스 Chrome 시작">
    engine은 Chrome DevTools Protocol(CDP)을 통한 프로그래밍 방식 제어에 최적화된 최소 헤드리스 Chrome 바이너리인 `chrome-headless-shell`을 시작합니다.
  </Step>

  <Step title="컴포지션 로드">
    HTML 컴포지션이 브라우저 페이지에 로드됩니다. 타임라인 시크를 관리하기 위해 Hyperframes 런타임이 주입됩니다.
  </Step>

  <Step title="각 프레임으로 시크">
    비디오의 모든 프레임(예: 30fps에서 30초 비디오의 경우 900프레임)에 대해 engine은 `renderSeek(time)`을 호출하여 컴포지션을 정확한 타임스탬프로 이동시킵니다. 벽시계(wall clock)는 관여하지 않으며 각 프레임은 독립적으로 배치됩니다.
  </Step>

  <Step title="BeginFrame으로 캡처">
    Chrome의 `HeadlessExperimental.beginFrame` API가 컴포지터 출력을 픽셀 버퍼로 캡처합니다. 화면 녹화 아티팩트 없이 픽셀 퍼펙트 프레임을 생성합니다.
  </Step>

  <Step title="프레임 전달">
    캡처된 프레임 버퍼는 소비자에게 전달됩니다 — 일반적으로 MP4 인코딩을 위한 FFmpeg(producer 경유)이지만, 직접 소비자를 제공할 수도 있습니다.
  </Step>
</Steps>

이 접근 방식은 [결정론적 렌더링](/concepts/determinism)을 보장합니다: 동일한 HTML은 시스템 부하나 타이밍에 관계없이 항상 동일한 비디오를 생성합니다.

## 설정

```typescript theme={null}
import { resolveConfig, DEFAULT_CONFIG } from '@hyperframes/engine';
import type { EngineConfig } from '@hyperframes/engine';

// 기본값 사용
const config = DEFAULT_CONFIG;

// 또는 오버라이드를 적용하여 설정 해석
const config = resolveConfig({
  // ... 커스텀 옵션
});
```

### 품질 프리셋

| 프리셋     | 용도                                   | 속도   |
| ---------- | -------------------------------------- | ------ |
| `draft`    | 개발 중 빠른 반복 작업                 | 최고속 |
| `standard` | 품질과 속도의 균형을 갖춘 프로덕션 렌더 | 보통   |
| `high`     | 최종 납품, 최고 품질                   | 최저속 |

### FPS 옵션

| FPS  | 용도                                         |
| ---- | -------------------------------------------- |
| `24` | 시네마틱 느낌, 작은 파일 크기                |
| `30` | 표준 웹 비디오, 좋은 균형                    |
| `60` | 부드러운 모션, UI 애니메이션, 화면 녹화      |

## 프로그래밍 방식 사용

engine은 프레임 캡처를 위한 세션 기반 API를 사용합니다:

```typescript theme={null}
import {
  createCaptureSession,
  initializeSession,
  captureFrame,
  captureFrameToBuffer,
  getCompositionDuration,
  closeCaptureSession,
} from '@hyperframes/engine';

// 1. 캡처 세션 생성
const session = await createCaptureSession({ fps: 30, width: 1920, height: 1080 });

// 2. 컴포지션으로 초기화
await initializeSession(session, './my-video/index.html');

// 3. 전체 재생 시간 조회
const duration = getCompositionDuration(session);

// 4. 프레임 캡처
const totalFrames = Math.ceil(duration * 30);
for (let i = 0; i < totalFrames; i++) {
  // 디스크에 캡처
  const result = await captureFrame(session, i);
  // result.path, result.captureTimeMs

  // 또는 버퍼로 캡처 (인메모리)
  const bufResult = await captureFrameToBuffer(session, i);
  // bufResult.buffer, bufResult.captureTimeMs
}

// 5. 정리
await closeCaptureSession(session);
```

### 브라우저 관리

```typescript theme={null}
import {
  acquireBrowser,
  releaseBrowser,
  resolveHeadlessShellPath,
  buildChromeArgs,
} from '@hyperframes/engine';

// 브라우저 인스턴스 획득 (생성하거나 풀에서 재사용)
const browser = await acquireBrowser();

// Chrome 바이너리 경로 조회
const chromePath = await resolveHeadlessShellPath();

// 사용 완료 후 해제
await releaseBrowser(browser);
```

### 인코딩

engine은 MP4(h264) 및 WebM(알파 지원 VP9) 인코딩을 위한 FFmpeg 유틸리티를 포함합니다:

```typescript theme={null}
import {
  encodeFramesFromDir,
  muxVideoWithAudio,
  applyFaststart,
  detectGpuEncoder,
  getEncoderPreset,
  ENCODER_PRESETS,
} from '@hyperframes/engine';

// 포맷 인식 인코더 설정 조회
const mp4Preset = getEncoderPreset('standard', 'mp4');
// { codec: "h264", pixelFormat: "yuv420p", preset: "medium", quality: 23 }

const webmPreset = getEncoderPreset('standard', 'webm');
// { codec: "vp9", pixelFormat: "yuva420p", preset: "good", quality: 23 }

// 캡처된 프레임을 비디오로 인코딩
await encodeFramesFromDir(framesDir, 'frame_%06d.png', outputPath, {
  fps: 30,
  ...webmPreset,
});

// 비디오와 오디오 합성 (WebM은 Opus, MP4는 AAC 사용)
await muxVideoWithAudio(videoPath, audioPath, outputPath);

// MP4 faststart 적용 (스트리밍용, WebM에서는 무시)
await applyFaststart(inputPath, outputPath);

// GPU 인코딩 지원 감지
const gpu = await detectGpuEncoder();
// gpu: "nvenc" | "videotoolbox" | "vaapi" | null
```

#### 알파 채널이 있는 WebM (VP9)

투명도를 포함한 인코딩 시, `format: "webm"`과 함께 `getEncoderPreset()`을 사용하세요. 다음을 설정합니다:

* 알파 지원 `yuva420p` 픽셀 포맷의 **VP9 코덱** (`libvpx-vp9`)
* 올바른 알파 인코딩을 위한 **`-auto-alt-ref 0`** 및 **`alpha_mode=1`** 메타데이터
* 멀티스레드 VP9 인코딩을 위한 **`-row-mt 1`**
* mux 단계에서 **Opus 오디오** (MP4의 AAC 대신)

### 스트리밍 인코더

프레임을 디스크에 쓰지 않고 메모리 효율적으로 인코딩하려면:

```typescript theme={null}
import { spawnStreamingEncoder } from '@hyperframes/engine';

const encoder = await spawnStreamingEncoder({
  outputPath: './output.mp4',
  fps: 30,
  width: 1920,
  height: 1080,
});

// 프레임을 인코더에 직접 전달
encoder.writeFrame(frameBuffer);
// ...
const result = await encoder.finalize();
```

### 비디오 프레임 추출

소스 비디오 파일에서 프레임을 추출하여 브라우저에 주입합니다:

```typescript theme={null}
import {
  parseVideoElements,
  extractAllVideoFrames,
  getFrameAtTime,
  createFrameLookupTable,
  FrameLookupTable,
} from '@hyperframes/engine';

// HTML에서 비디오 요소 파싱
const videos = parseVideoElements(html);

// 비디오에서 모든 프레임 추출
const frames = await extractAllVideoFrames(videoPath, { fps: 30 });

// 빠른 프레임 접근을 위한 룩업 테이블 생성
const lookup = createFrameLookupTable(frames);
const frame = lookup.getFrameAtTime(5.0);
```

### 오디오 처리

```typescript theme={null}
import { parseAudioElements, processCompositionAudio } from '@hyperframes/engine';

// HTML에서 오디오 요소 파싱
const audioElements = parseAudioElements(html);

// 모든 오디오 트랙 처리 및 믹싱
const mixResult = await processCompositionAudio({ audioElements, duration, fps });
```

### 병렬 렌더링

```typescript theme={null}
import {
  calculateOptimalWorkers,
  distributeFrames,
  executeParallelCapture,
  getSystemResources,
} from '@hyperframes/engine';

// 시스템 리소스 확인
const resources = getSystemResources();

// 최적 워커 수 계산
const workers = calculateOptimalWorkers(totalFrames);

// 워커에 프레임 분배
const tasks = distributeFrames(totalFrames, workers);

// 병렬 캡처 실행
const results = await executeParallelCapture(tasks);
```

### 파일 서버

브라우저에서 로드할 수 있도록 컴포지션 파일을 HTTP로 서빙합니다:

```typescript theme={null}
import { createFileServer } from '@hyperframes/engine';

const server = await createFileServer({ root: './my-video', port: 0 });
// server.url, server.port
// ... server.url을 컴포지션 URL로 사용
await server.close();
```

## `window.__hf` 프로토콜

engine은 `window.__hf` 프로토콜을 통해 브라우저 페이지와 통신합니다. 이 프로토콜을 구현하는 모든 페이지는 engine으로 캡처할 수 있습니다 — Hyperframes 컴포지션에만 제한되지 않습니다.

```typescript theme={null}
// 페이지는 window.__hf에 이 인터페이스를 노출해야 합니다
interface HfProtocol {
  duration: number;                  // 전체 재생 시간(초)
  seek(time: number): void;         // 특정 시간으로 시크
  media?: HfMediaElement[];         // 선택적 미디어 요소 선언
}

interface HfMediaElement {
  elementId: string;                 // DOM 요소 ID
  src: string;                       // 미디어 소스 URL
  startTime: number;                 // 타임라인상 시작 시간
  endTime: number;                   // 타임라인상 종료 시간
  mediaOffset?: number;              // 소스 내 재생 오프셋
  volume?: number;                   // 볼륨 (0-1)
  hasAudio?: boolean;                // 오디오 포함 여부
}
```

## 핵심 개념

### BeginFrame 렌더링

기존 화면 캡처는 벽시계(wall-clock) 속도로 녹화합니다 — 시스템 부하가 걸리면 프레임이 드롭됩니다. engine은 Chrome의 `HeadlessExperimental.beginFrame`을 사용하여 컴포지터를 명시적으로 진행시키고, 각 프레임을 요청 시 생성합니다. 이는 다음을 의미합니다:

* **프레임 드롭 없음** — 모든 프레임이 캡처됩니다
* **타이밍 의존성 없음** — 60초 비디오를 캡처하는 데 60초가 걸리지 않습니다
* **픽셀 퍼펙트 출력** — 컴포지터가 표시할 정확한 픽셀을 생성합니다

결정론적 출력에 대한 자세한 내용은 [결정론적 렌더링](/concepts/determinism)을 참조하세요.

### 시크 계약

engine은 Hyperframes 런타임의 `renderSeek(time)` 함수에 의존합니다. 호출 시, `renderSeek`은 다음을 수행합니다:

1. 모든 GSAP 타임라인을 일시 정지
2. 모든 타임라인을 정확한 타임스탬프로 시크
3. 모든 미디어 요소(비디오, 오디오)를 일치하도록 업데이트
4. `data-start`와 `data-duration`에 따라 클립을 마운트/언마운트

이 계약이 프레임별 캡처를 가능하게 합니다 — 각 프레임은 해당 시점에서의 컴포지션의 완전하고 독립적인 스냅샷입니다.

### Chrome 요구사항

engine은 `chrome-headless-shell`이 필요하며, 패키지 설치 시 포함됩니다. 환경 간 일관된 렌더링을 보장하기 위해 고정된 Chrome 버전을 사용합니다. 폰트를 포함한 완전한 결정론적 출력을 위해서는 [producer](/packages/producer)를 통한 Docker 모드를 사용하세요.

## 관련 패키지

<CardGroup cols={2}>
  <Card title="Producer" icon="film" href="/packages/producer">
    engine을 런타임 주입, FFmpeg 인코딩, 오디오 믹싱으로 감싸서 완성된 MP4를 출력합니다.
  </Card>

  <Card title="Core" icon="cube" href="/packages/core">
    engine이 의존하는 타입, 런타임, 린터를 제공합니다.
  </Card>

  <Card title="CLI" icon="terminal" href="/packages/cli">
    가장 쉬운 렌더링 방법 — 내부적으로 producer(및 engine)를 호출합니다.
  </Card>

  <Card title="Studio" icon="palette" href="/packages/studio">
    engine으로 렌더링하기 전에 컴포지션을 구성하는 비주얼 에디터입니다.
  </Card>
</CardGroup>
