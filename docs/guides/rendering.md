# 렌더링

> 컴포지션을 MP4, MOV, 또는 WebM으로 로컬 또는 Docker 환경에서 렌더링합니다.

Hyperframes [컴포지션](/concepts/compositions)을 [CLI](/packages/cli)를 사용하여 MP4, MOV, 또는 WebM으로 렌더링하세요. 렌더링 파이프라인은 프레임 단위로 탐색 기반(seek-driven) 방식으로 동작합니다 — 내부 동작 원리는 [결정론적 렌더링](/concepts/determinism)을 참고하세요.

## 시작하기

<Steps>
  <Step title="환경 확인">
    진단 명령어를 실행하여 필수 의존성을 확인합니다:

    ```bash Terminal theme={null}
    npx hyperframes doctor
    ```

    예상 출력:

    ```
    ✓ Node.js    v22.x
    ✓ FFmpeg      7.x
    ✓ FFprobe     7.x
    ✓ Chrome      (bundled)
    ✓ Docker      available
    ```
  </Step>

  <Step title="컴포지션 미리보기">
    렌더링 전에 브라우저에서 컴포지션을 미리 확인하여 올바르게 표시되는지 검증합니다:

    ```bash Terminal theme={null}
    npx hyperframes preview
    ```
  </Step>

  <Step title="MP4로 렌더링">
    프로젝트 디렉터리에서 렌더링 명령어를 실행합니다:

    ```bash Terminal theme={null}
    npx hyperframes render --output output.mp4
    ```

    예상 출력:

    ```
    ⠋ Rendering composition "root" (30fps, standard quality)
    ✓ Captured 240 frames in 8.2s
    ✓ Encoded to output.mp4 (8.0s, 1920x1080, 4.2MB)
    ```
  </Step>
</Steps>

## 렌더링 모드

<Tabs>
  <Tab title="로컬 모드">
    ### 로컬 모드 (기본값)

    Puppeteer(번들된 Chromium)와 시스템에 설치된 FFmpeg를 사용합니다. 개발 중 빠른 반복 작업에 적합합니다.

    **필요 조건:** 시스템에 FFmpeg가 설치되어 있어야 합니다. FFmpeg를 찾을 수 없는 경우 [문제 해결](/guides/troubleshooting)을 참고하세요.

    ```bash Terminal theme={null}
    npx hyperframes render --output output.mp4
    ```

    **장점:**

    * 빠른 시작, 컨테이너 오버헤드 없음
    * `--gpu` 옵션으로 시스템 GPU를 활용한 하드웨어 가속 인코딩 가능
    * 반복적인 개발 작업에 최적

    **단점:**

    * 폰트 및 Chrome 버전 차이로 인해 플랫폼마다 출력이 달라질 수 있음
    * 재현성이 필요한 CI/CD 파이프라인에는 부적합
  </Tab>

  <Tab title="Docker 모드">
    ### Docker 모드

    정확한 Chrome 버전과 폰트 세트를 사용하여 [결정론적](/concepts/determinism) 출력을 보장합니다. 프로덕션 렌더링과 CI 파이프라인에 사용하세요.

    **필요 조건:** Docker가 설치되어 실행 중이어야 합니다.

    ```bash Terminal theme={null}
    npx hyperframes render --docker --output output.mp4
    ```

    **장점:**

    * 모든 플랫폼에서 동일한 출력 — 같은 Chrome, 같은 폰트, 같은 FFmpeg
    * 프로덕션 환경과 동일한 파이프라인
    * CI/CD 및 자동화 워크플로에 이상적

    **단점:**

    * 컨테이너 초기화로 인한 시작 속도 저하
    * 컨테이너 내부에서 GPU 가속 불가

    <Note>
      Docker 모드는 프레임 단위의 정확한 결정론적 캡처를 위해 `chrome-headless-shell`과 [BeginFrame](/concepts/determinism#how-it-works) 제어를 사용합니다.
    </Note>
  </Tab>
</Tabs>

## 모드 선택 가이드

| 시나리오                     | 권장 모드 |
| ---------------------------- | --------- |
| 로컬 개발 및 반복 작업       | 로컬      |
| CI/CD 파이프라인             | Docker    |
| 팀과 렌더링 결과 공유        | Docker    |
| 빠른 미리보기 내보내기       | 로컬      |
| AI 에이전트 기반 렌더링      | Docker    |
| 성능 벤치마킹                | 로컬      |

## 옵션

| 플래그                     | 값                    | 기본값               | 설명                                                                                                   |
| -------------------------- | --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| `--output`                 | 경로                  | `renders/&lt;name&gt;.mp4` | 출력 파일 경로                                                                                         |
| `--format`                 | mp4, mov, webm        | mp4                  | 출력 형식 (아래 [투명 영상](#투명-영상) 참고)                                                          |
| `--fps`                    | 24, 30, 60            | 30                   | 초당 프레임 수                                                                                         |
| `--quality`                | draft, standard, high | standard             | 인코딩 품질 프리셋                                                                                     |
| `--crf`                    | 0–51                  | —                    | CRF 값 직접 지정 (낮을수록 높은 품질). `--video-bitrate`와 함께 사용 불가                              |
| `--video-bitrate`          | 예: `10M`, `5000k`    | —                    | 대상 비트레이트 인코딩. `--crf`와 함께 사용 불가                                                       |
| `--workers`                | 1-8 또는 `auto`       | auto                 | 병렬 렌더링 워커 수 (아래 [워커](#워커) 참고)                                                          |
| `--max-concurrent-renders` | 1-10                  | 2                    | 프로듀서 서버를 통한 최대 동시 렌더링 수 (아래 [동시 렌더링](#동시-렌더링) 참고)                       |
| `--gpu`                    | —                     | off                  | GPU 인코딩 (NVENC, VideoToolbox, VAAPI)                                                                |
| `--docker`                 | —                     | off                  | [결정론적 렌더링](/concepts/determinism)을 위한 Docker 사용                                            |
| `--quiet`                  | —                     | off                  | 상세 출력 억제                                                                                         |

## 품질 및 인코딩

`--quality` 플래그는 H.264 CRF(Constant Rate Factor)와 인코더 속도를 제어하는 프리셋을 선택합니다:

| 프리셋     | CRF | x264 프리셋 | 용도                                       |
| ---------- | --- | ----------- | ------------------------------------------ |
| `draft`    | 28  | ultrafast   | 빠른 미리보기, 반복 작업                   |
| `standard` | 18  | medium      | 범용 — 1080p에서 시각적으로 무손실         |
| `high`     | 15  | slow        | 최종 납품, 거의 무손실 품질                |

더 세밀한 제어가 필요하면 `--crf` 또는 `--video-bitrate`로 프리셋을 재정의하세요:

```bash theme={null}
# 거의 무손실 품질 (CRF 15 = 매우 높은 품질, 큰 파일 크기)
npx hyperframes render --crf 15 --output pristine.mp4

# 특정 비트레이트 지정 (파일 크기 제한이 있는 경우 유용)
npx hyperframes render --video-bitrate 10M --output controlled.mp4
```

**팁**: 기본 `standard` 프리셋(CRF 18)은 1080p에서 시각적으로 무손실입니다 — 대부분의 사람들이 원본과 구분하지 못합니다. 빠른 반복 작업에는 `--quality draft`를, 파일 크기가 중요하지 않은 경우에는 `--quality high` 또는 `--crf 10`을 사용하세요.

## 워커

각 렌더링 워커는 **별도의 Chrome 브라우저 프로세스**를 실행하여 프레임을 병렬로 캡처합니다. 워커를 늘리면 렌더링 속도가 빨라질 수 있지만, 각 워커는 약 256MB의 RAM과 상당한 CPU를 사용합니다.

### 기본 동작

기본적으로 Hyperframes는 **CPU 코어 수의 절반, 최대 4개**를 사용합니다:

| 머신             | CPU 코어 | 기본 워커 수 |
| ---------------- | -------- | ------------ |
| MacBook Air (M1) | 8        | 4            |
| MacBook Pro (M3) | 12       | 4 (상한)     |
| 4코어 노트북     | 4        | 2            |
| 2코어 VM         | 2        | 1            |

이 설정은 의도적으로 보수적입니다. 각 워커는 자체 Chrome 프로세스를 생성하므로 워커당 오버헤드가 상당합니다. 워커 수를 적게 유지하면 FFmpeg 인코딩 및 다른 애플리케이션과의 리소스 경쟁을 방지할 수 있습니다.

### 워커 수 선택

```bash Terminal theme={null}
# 워커 수 직접 지정
npx hyperframes render --workers 1 --output output.mp4

# CPU에 따라 Hyperframes가 자동 결정
npx hyperframes render --workers auto --output output.mp4

# 최대 병렬 처리 (노트북에서는 주의하여 사용)
npx hyperframes render --workers 8 --output output.mp4
```

<Tip>
  기본값으로 시작하세요. 렌더링이 느리게 느껴지고 시스템에 여유가 있다면(Activity Monitor / `htop`으로 확인) `--workers`를 늘려보세요. 메모리 압박이나 팬 소음이 발생하면 줄이세요.
</Tip>

### 워커 1개를 사용해야 하는 경우

* 짧은 컴포지션 (2초 미만 / 60프레임 이하) — 병렬 처리 오버헤드가 이점을 초과
* 메모리가 적은 머신 (4GB 이하)
* 다른 무거운 프로세스와 동시에 렌더링 실행 시 (영상 편집, 대규모 빌드)

### 워커를 늘려야 하는 경우

* 8코어 이상, 16GB 이상 RAM 머신에서의 긴 컴포지션 (30초 이상)
* 전용 렌더링 머신 또는 CI 러너
* 충분한 리소스가 확보된 호스트에서의 Docker 모드

## 동시 렌더링

여러 렌더링 요청이 프로듀서 서버에 동시에 도착하면(AI 에이전트에서 흔히 발생), 각 렌더링은 자체 Chrome 워커 프로세스 세트를 생성합니다. 동시 렌더링이 너무 많으면 CPU가 고갈되어 실패할 수 있습니다.

프로듀서 서버는 **요청 수준 세마포어**를 사용하여 렌더링을 큐에 넣습니다. 한 번에 `maxConcurrentRenders`개의 렌더링만 실행되며, 추가 요청은 슬롯이 열릴 때까지 FIFO 큐에서 대기합니다.

### 설정

```bash Terminal theme={null}
# CLI 플래그
npx hyperframes render --max-concurrent-renders 2 --output output.mp4

# 환경 변수 (프로듀서 서버용)
PRODUCER_MAX_CONCURRENT_RENDERS=2
```

기본값은 동시 렌더링 **2개**이며, 각 렌더링이 2-3개의 워커를 사용하는 8코어 머신에 적합합니다.

### 큐 상태

프로듀서 서버는 현재 상태를 반환하는 `GET /render/queue` 엔드포인트를 제공합니다:

```json theme={null}
{
  "maxConcurrentRenders": 2,
  "activeRenders": 1,
  "queuedRenders": 3
}
```

AI 에이전트는 이 엔드포인트를 폴링하여 렌더링을 제출할지 대기할지 결정할 수 있습니다.

### SSE 큐 이벤트

스트리밍 엔드포인트(`POST /render/stream`)를 사용할 때, 큐에 대기 중인 요청은 렌더링 시작 전에 `queued` 이벤트를 수신합니다:

```json theme={null}
{"type": "queued", "requestId": "...", "position": 2}
```

이를 통해 에이전트는 멈춘 것처럼 보이는 대신 사용자에게 "큐에서 대기 중"이라고 보고할 수 있습니다.

### 동시 처리 수 선택

| 머신               | CPU 코어 | 권장 제한 수 |
| ------------------ | -------- | ------------ |
| 4코어 VM           | 4        | 1            |
| 8코어 워크스테이션 | 8        | 2            |
| 16코어 서버        | 16       | 3-4          |
| 32코어 렌더링 머신 | 32       | 5-6          |

<Tip>
  확신이 없다면 1을 사용하세요. 렌더링은 큐에 쌓여 순차적으로 실행되지만, 각 렌더링이 전체 CPU를 사용하여 가능한 한 빠르게 완료됩니다. 이 방식이 3개의 렌더링이 CPU를 두고 경쟁하다가 모두 느리게 끝나거나 실패하는 것보다 낫습니다.
</Tip>

## 투명 영상

Hyperframes는 투명 배경으로 렌더링하는 것을 지원합니다 — 영상 편집기에서 다른 영상 위에 합성할 오버레이, 하단 자막, 구독 카드 등의 요소에 유용합니다.

### 권장 형식: MOV (ProRes 4444)

```bash Terminal theme={null}
npx hyperframes render --format mov --output overlay.mov
```

**ProRes 4444를 사용하는 MOV**는 투명 영상의 업계 표준입니다. 모든 주요 영상 편집기에서 지원됩니다:

* CapCut
* Final Cut Pro
* Adobe Premiere Pro
* DaVinci Resolve
* After Effects

<Warning>
  ProRes MOV 파일은 크기가 큽니다(짧은 클립의 경우 일반적으로 5-40MB). ProRes는 전달용이 아닌 편집에 최적화된 고품질 중간 코덱이기 때문입니다. 이는 예상된 동작이며, Remotion 및 전문 파이프라인에서도 동일한 트레이드오프를 적용합니다.
</Warning>

### 형식 비교

| 형식     | 코덱        | 투명도 | 영상 편집기                                         | 브라우저        | 파일 크기 |
| -------- | ----------- | ------ | --------------------------------------------------- | --------------- | --------- |
| **MOV**  | ProRes 4444 | 지원   | CapCut, Final Cut, Premiere, DaVinci, After Effects | 미지원          | 큼        |
| **WebM** | VP9         | 지원   | 미지원 (검은 배경으로 표시)                         | Chrome, Firefox | 작음      |
| **MP4**  | H.264       | 미지원 | 전체                                                | 전체            | 작음      |

<Note>
  **WebM VP9 알파**는 기술적으로 지원되지만, 모든 주요 영상 편집기에서 알파 채널을 무시하고 투명 영역을 검은색으로 렌더링합니다. Chromium 기반 브라우저(Chrome, Arc, Brave, Edge)만 VP9 알파를 올바르게 디코딩합니다. Safari는 지원하지 않습니다. 편집기 워크플로에는 MOV를, 브라우저 기반 재생에만 WebM을 사용하세요.
</Note>

### 동작 원리

`--format mov` 또는 `--format webm`으로 렌더링하면 Hyperframes는:

1. 각 프레임을 **알파 채널이 포함된 PNG**로 캡처합니다 (MP4의 경우 JPEG 대신)
2. `Emulation.setDefaultBackgroundColorOverride`를 통해 Chrome의 페이지 배경을 투명으로 설정합니다
3. 알파를 지원하는 코덱으로 인코딩합니다 (MOV의 경우 ProRes 4444, WebM의 경우 VP9)

컴포지션의 HTML에서 `html`이나 `body`에 `background`를 설정하지 **마세요** — 투명 배경이 적용되도록 설정하지 않은 상태로 두세요.

### 투명 컴포지션 작성

```html theme={null}
<style>
  /* html/body에 배경을 설정하지 마세요 — 투명 상태를 유지합니다 */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  [data-composition-id="my-overlay"] {
    position: relative;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    /* 여기에도 배경을 설정하지 마세요 */
  }
</style>
```

보이는 요소(카드, 텍스트, 이미지)만 최종 영상에 나타납니다. 그 외 모든 영역은 투명하게 처리됩니다.

### 투명도 확인

* **브라우저에서:** MOV 파일을 열면 재생되지 않습니다 (ProRes는 브라우저 코덱이 아닙니다). 대신 WebM 사본을 렌더링하고 Chrome에서 체커보드 배경 페이지 위에 열어보세요.
* **영상 편집기에서:** MOV 파일을 가져와 다른 영상 위의 트랙에 배치합니다. 투명 영역에 아래 영상이 보여야 합니다.
* **온라인 도구:** [rotato.app/tools/transparent-video](https://rotato.app/tools/transparent-video)를 사용하여 MOV 또는 WebM의 투명도가 정상 작동하는지 확인하세요.

## 팁

<Tip>
  개발 중에는 빠른 미리보기를 위해 `draft` 품질을 사용하세요. 최종 출력에는 `standard` 또는 `high`로 전환하세요.
</Tip>

* `npx hyperframes benchmark`를 사용하여 시스템에 최적화된 설정을 찾으세요
* Docker 모드는 느리지만 플랫폼 간 [동일한 출력](/concepts/determinism)을 보장합니다
* 프레임이 많은 컴포지션의 경우 `--gpu` 옵션으로 로컬 인코딩 속도를 크게 높일 수 있습니다

## 다음 단계

<CardGroup cols={2}>
  <Card title="결정론적 렌더링" icon="lock" href="/concepts/determinism">
    결정론적 보장 이해하기
  </Card>

  <Card title="CLI 레퍼런스" icon="terminal" href="/packages/cli">
    CLI 명령어 및 플래그 전체 목록
  </Card>

  <Card title="문제 해결" icon="wrench" href="/guides/troubleshooting">
    일반적인 렌더링 문제 해결
  </Card>

  <Card title="흔한 실수" icon="triangle-exclamation" href="/guides/common-mistakes">
    렌더링 출력에 영향을 주는 함정 피하기
  </Card>
</CardGroup>
