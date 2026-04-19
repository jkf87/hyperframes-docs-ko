# @hyperframes/producer

> HTML-to-video 렌더링 파이프라인 전체를 제공하며, 인코딩, 오디오 믹싱, Docker를 지원합니다.

producer 패키지는 [engine](/packages/engine)의 프레임 캡처와 FFmpeg 인코딩을 결합하여 완전한 HTML-to-video 렌더링 파이프라인을 제공합니다. MP4(h264)와 WebM(알파 투명도를 지원하는 VP9)을 지원하며, 런타임 주입, 준비 게이트, 오디오 믹싱, 그리고 선택적인 Docker 기반 결정적 렌더링을 처리합니다.

```bash theme={null}
npm install @hyperframes/producer
```

## 사용 시기

**`@hyperframes/producer`를 사용해야 하는 경우:**

* Node.js에서 프로그래밍 방식으로 컴포지션을 MP4 또는 WebM으로 렌더링해야 하는 경우 (예: 백엔드 서비스나 CI 파이프라인)
* 파이프라인을 세밀하게 제어할 수 있는 커스텀 렌더링 서비스를 구축하는 경우
* 골든 베이스라인에 대한 시각적 회귀 테스트를 실행하는 경우
* 다양한 설정에서 렌더 성능을 벤치마킹하는 경우

**다른 패키지를 사용해야 하는 경우:**

* 코드 작성 없이 커맨드 라인에서 렌더링하려면 — [CLI](/packages/cli) (`npx hyperframes render`)를 사용하세요
* 브라우저에서 컴포지션을 미리보려면 — [CLI](/packages/cli) 또는 [studio](/packages/studio)를 사용하세요
* 인코딩 없이 프레임만 캡처하려면 — [engine](/packages/engine)을 사용하세요
* 컴포지션 HTML을 린트하거나 파싱하려면 — [core](/packages/core)를 사용하세요

<Tip>
  웹 애플리케이션이나 스크립트에서 단순히 비디오를 렌더링해야 한다면, [CLI](/packages/cli)가 가장 빠른 방법입니다. producer 패키지는 Node.js 내에서 프로그래밍 방식의 제어가 필요할 때 사용하세요.
</Tip>

## 기능 설명

producer는 전체 렌더 파이프라인을 오케스트레이션합니다:

<Steps>
  <Step title="컴포지션 HTML 로드">
    `index.html`과 참조된 모든 서브 컴포지션을 읽어들입니다.
  </Step>

  <Step title="Hyperframes 런타임 주입">
    타임라인 탐색, 클립 수명 주기, 미디어 재생을 관리하는 런타임 스크립트를 추가합니다.
  </Step>

  <Step title="준비 게이트 대기">
    `window.__playerReady`와 `window.__renderReady`를 폴링하여 캡처가 시작되기 전에 모든 에셋(폰트, 이미지, 비디오)이 로드되었는지 확인합니다.
  </Step>

  <Step title="engine을 통한 프레임 캡처">
    [engine](/packages/engine)의 BeginFrame 파이프라인을 사용하여 각 프레임을 픽셀 버퍼로 캡처합니다.
  </Step>

  <Step title="FFmpeg를 통한 MP4 또는 WebM 인코딩">
    프레임 버퍼를 선택한 품질 프리셋으로 FFmpeg에 파이프합니다. MP4는 h264를 사용하고, WebM은 알파 투명도를 지원하는 VP9를 사용합니다.
  </Step>

  <Step title="오디오 트랙 믹싱">
    비디오 클립과 오디오 요소에서 오디오를 추출하고, `data-volume`과 `data-media-start` 오프셋을 적용한 후, 최종 MP4에 믹싱합니다.
  </Step>
</Steps>

## 프로그래밍 방식 사용법

producer는 2단계 API를 사용합니다: 렌더 작업 설정을 생성한 다음 실행합니다.

```typescript theme={null}
import { createRenderJob, executeRenderJob } from '@hyperframes/producer';

const job = createRenderJob({
  input: './my-video/index.html',
  output: './output.mp4',
  fps: 30,
  quality: 'standard',
});

const result = await executeRenderJob(job);
```

### 렌더 설정

```typescript theme={null}
import type { RenderConfig } from '@hyperframes/producer';

const config: RenderConfig = {
  fps: 30,                   // 24, 30, 또는 60
  quality: 'standard',       // 'draft', 'standard', 또는 'high'
  format: 'mp4',             // 'mp4' 또는 'webm' (WebM은 투명도 지원)
  workers: 4,                // 병렬 렌더 워커 수 (1-8)
  useGpu: false,             // GPU 가속 인코딩
  debug: false,              // 디버그 로깅
};
```

#### 투명도 지원 WebM

투명 배경으로 VP9 알파 렌더링을 하려면 `format: 'webm'`으로 설정하세요:

```typescript theme={null}
const job = createRenderJob({
  fps: 30,
  quality: 'standard',
  format: 'webm',
});

await executeRenderJob(job, './my-overlay', './overlay.webm');
```

`format: 'webm'` 설정 시:

* 프레임은 PNG로 캡처됩니다 (알파 채널 보존)
* CDP를 통해 Chrome 페이지 배경이 투명으로 설정됩니다
* FFmpeg가 VP9 + `yuva420p` 픽셀 포맷으로 인코딩합니다
* 오디오는 Opus로 인코딩됩니다 (MP4의 AAC 대신)

### 진행 상태 콜백

```typescript theme={null}
import type { ProgressCallback, RenderStatus } from '@hyperframes/producer';

const onProgress: ProgressCallback = (status: RenderStatus) => {
  console.log(`Status: ${status}`);
  // 상태: "queued" | "preprocessing" | "rendering" | "encoding"
  //       | "assembling" | "complete" | "failed" | "cancelled"
};
```

### 취소

```typescript theme={null}
import { RenderCancelledError } from '@hyperframes/producer';

try {
  await executeRenderJob(job);
} catch (err) {
  if (err instanceof RenderCancelledError) {
    console.log(`취소됨: ${err.reason}`);
    // reason: "user_cancelled" | "timeout" | "aborted"
  }
}
```

## HTTP 서버

producer에는 렌더링 서비스로 실행하기 위한 내장 HTTP 서버가 포함되어 있습니다:

```typescript theme={null}
import { startServer } from '@hyperframes/producer/server';

await startServer({ port: 8080 });
```

### 서버 엔드포인트

| 메서드 | 경로              | 설명                              |
| ------ | ----------------- | --------------------------------- |
| `POST` | `/render`         | 블로킹 렌더 — JSON 결과 반환     |
| `POST` | `/render/stream`  | Server-Sent Events 스트리밍 렌더  |
| `POST` | `/lint`           | 컴포지션 이슈 린트                |
| `GET`  | `/health`         | 헬스 체크                         |
| `GET`  | `/outputs/:token` | 렌더링된 MP4 다운로드             |

커스텀 서버 통합을 위해 저수준 핸들러를 사용할 수 있습니다:

```typescript theme={null}
import { createRenderHandlers, createProducerApp } from '@hyperframes/producer/server';

// 개별 요청 핸들러 가져오기
const handlers = createRenderHandlers(options);

// 또는 전체 Hono 앱 가져오기
const app = createProducerApp(options);
```

## Docker 렌더링

결정적 출력을 위해 producer는 고정된 Chrome 버전과 폰트 세트가 포함된 Docker 컨테이너 내에서 렌더링할 수 있습니다. 이는 머신 간 동일한 출력을 보장하며, CI 파이프라인과 프로덕션 서비스에서 매우 중요합니다.

```bash theme={null}
# CLI를 통해 실행 (권장)
npx hyperframes render --docker --output output.mp4
```

<Info>
  Docker 모드를 사용하려면 Docker가 설치되어 실행 중이어야 합니다. `npx hyperframes doctor`를 실행하여 환경을 확인하세요. Docker 모드의 결정적 렌더링에 대한 자세한 내용은 [결정적 렌더링](/concepts/determinism)을 참조하세요.
</Info>

## 품질 프리셋

| 프리셋     | 해상도 | 인코딩           | 사용 사례                        |
| ---------- | ------ | ---------------- | -------------------------------- |
| `draft`    | 원본   | 고속 CRF         | 빠른 반복 작업, 편집 미리보기    |
| `standard` | 원본   | 균형 CRF         | 프로덕션 렌더, 공유              |
| `high`     | 원본   | 고품질 CRF       | 최종 전달, 아카이브              |

## GPU 인코딩

producer는 더 빠른 렌더링을 위한 하드웨어 가속 인코딩을 지원합니다:

| 플랫폼 | 인코더       | 플래그        |
| ------- | ------------ | ------------- |
| NVIDIA  | NVENC        | 자동 감지     |
| macOS   | VideoToolbox | 자동 감지     |
| Linux   | VAAPI        | 자동 감지     |

GPU 인코딩은 사용 가능할 때 자동으로 적용됩니다. 시스템의 지원 여부를 확인하려면:

```bash theme={null}
npx hyperframes doctor
```

## 추가 내보내기

producer는 편의를 위해 engine의 주요 기능도 재내보내기합니다:

| 내보내기                                                | 설명                                     |
| ------------------------------------------------------- | ---------------------------------------- |
| `createCaptureSession()`                                | 프레임 캡처 세션 생성                    |
| `initializeSession()`                                   | 컴포지션으로 세션 초기화                 |
| `captureFrame()` / `captureFrameToBuffer()`             | 개별 프레임 캡처                         |
| `closeCaptureSession()`                                 | 캡처 세션 정리                           |
| `getCompositionDuration()`                              | 전체 컴포지션 길이 가져오기              |
| `getCapturePerfSummary()`                               | 캡처 성능 지표 가져오기                  |
| `createFileServer()`                                    | 에셋 제공을 위한 HTTP 파일 서버 생성     |
| `createVideoFrameInjector()`                            | 페이지용 비디오 프레임 인젝터 생성       |
| `resolveConfig()` / `DEFAULT_CONFIG`                    | producer 설정                            |
| `createConsoleLogger()` / `defaultLogger`               | 로깅 유틸리티                            |
| `quantizeTimeToFrame()`                                 | 시간을 프레임 경계로 변환                |
| `resolveRenderPaths()`                                  | 렌더 디렉토리 경로 해석                  |
| `prepareHyperframeLintBody()` / `runHyperframeLint()`   | 린트 유틸리티                            |

## 회귀 테스트

producer에는 렌더 출력을 골든 베이스라인과 비교하기 위한 회귀 테스트 하네스가 포함되어 있습니다. 이는 런타임, engine, 또는 렌더링 파이프라인을 변경할 때 시각적 회귀를 감지하는 데 유용합니다.

```bash theme={null}
cd packages/producer

# 테스트 Docker 이미지 빌드
bun run docker:build:test

# 회귀 테스트 실행 (골든 베이스라인과 출력 비교)
bun run docker:test

# 의도적인 변경 후 골든 베이스라인 재생성
bun run docker:test:update
```

## 벤치마킹

하드웨어에 최적화된 렌더 설정을 찾으세요:

```bash theme={null}
# CLI를 통해
npx hyperframes benchmark

# producer 패키지에서 직접
cd packages/producer
bun run benchmark
```

벤치마크는 여러 컴포지션을 다양한 품질과 FPS 설정으로 실행하고, 각 조합에 대한 소요 시간을 보고합니다.

## 외부 에셋 (`projectDir` 외부 파일)

컴포지션은 프로젝트 디렉토리 외부의 에셋에 대한 절대 경로를 참조할 수 있습니다 — `~/Downloads`에 있는 로컬 보이스오버, 공유 드라이브의 이미지, 절대 경로에 생성된 픽스처 등. producer는 다음과 같이 이를 처리합니다:

1. **감지.** 컴파일 중에 HTML 컴파일러가 모든 `[src]` / `[href]`와 `&lt;style&gt;` 내의 모든 `url(...)`을 탐색합니다. `projectDir` 외부의 파일로 해석되는 경로는 `externalAssets` 맵에 수집됩니다.
2. **정규화된 키.** 각 절대 경로는 `hf-ext/` 접두사가 붙은 안전한 크로스 플랫폼 상대 키로 변환됩니다. Windows 드라이브 문자의 콜론은 제거됩니다 (`D:\foo\x.wav` → `hf-ext/D/foo/x.wav`). 이를 통해 모든 OS에서 `path.join(compileDir, key)`가 컴파일 디렉토리 내에 유지됩니다.
3. **복사 + 재작성.** 오케스트레이터가 `&lt;compileDir&gt;/hf-ext/...` 아래에 파일을 복사하고, HTML은 정규화된 키를 가리키도록 재작성됩니다. 파일 서버는 동일한 루트에서 프로젝트 내부 에셋과 외부 에셋을 모두 제공합니다.

포함 여부 확인은 하드코딩된 구분자가 아닌 `path.relative()`를 사용하므로, macOS, Linux, Windows에서 동일하게 동작합니다. 관련 헬퍼는 `packages/producer/src/utils/paths.ts`를 참조하세요.

## 관련 패키지

<CardGroup cols={2}>
  <Card title="CLI" icon="terminal" href="/packages/cli">
    렌더링, 미리보기 등을 위해 producer를 래핑하는 커맨드 라인 인터페이스입니다.
  </Card>

  <Card title="Engine" icon="gear" href="/packages/engine">
    producer가 프레임을 캡처하는 데 사용하는 저수준 캡처 파이프라인입니다.
  </Card>

  <Card title="Core" icon="cube" href="/packages/core">
    producer가 의존하는 타입, 런타임, 린터입니다.
  </Card>

  <Card title="Studio" icon="palette" href="/packages/studio">
    producer로 렌더링하기 전에 컴포지션을 만들 수 있는 비주얼 에디터입니다.
  </Card>
</CardGroup>
