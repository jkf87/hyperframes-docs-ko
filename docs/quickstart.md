# 빠른 시작

> 2분 안에 첫 번째 Hyperframes 비디오를 만들고, 미리 보고, 렌더링하세요.

AI 에이전트에 프롬프트를 입력하거나 프로젝트를 직접 시작해, 아무것도 없는 상태에서 렌더링된 MP4까지 빠르게 완성할 수 있습니다.

## 옵션 1: AI 코딩 에이전트와 함께하기 (권장)

HyperFrames 스킬을 설치한 다음, 원하는 비디오를 설명하세요.

```bash
npx skills add heygen-com/hyperframes
```

이 스킬은 에이전트(Claude Code, Cursor, Gemini CLI, Codex)가 올바른 컴포지션과 GSAP 애니메이션을 작성하는 방법을 익히게 해줍니다. Claude Code에서는 스킬이 슬래시 커맨드로 등록됩니다. 컴포지션 작성은 `/hyperframes`, CLI 명령은 `/hyperframes-cli`, 애니메이션 도움말은 `/gsap`을 사용합니다. 슬래시 커맨드를 호출하면 스킬 컨텍스트가 명시적으로 로드되므로 처음부터 정확한 결과를 얻기 쉽습니다.

### 직접 해보기: 예시 프롬프트

아래 예시 중 하나를 복사해 에이전트에 붙여 넣고 시작하세요.

#### 콜드 스타트, 원하는 것을 설명하기

- `Using /hyperframes, create a 10-second product intro with a fade-in title over a dark background and subtle background music.`

#### 웜 스타트, 기존 컨텍스트를 비디오로 바꾸기

- `Take a look at this GitHub repo https://github.com/heygen-com/hyperframes and explain its uses and architecture to me using /hyperframes.`
- `Summarize the attached PDF into a 45-second pitch video using /hyperframes.`
- `Turn this CSV into an animated bar chart race using /hyperframes.`

#### 포맷별 요청

- `Make a 9:16 TikTok-style hook video about [topic] using /hyperframes, with bouncy captions synced to a TTS narration.`

#### 반복 수정, 에이전트를 비디오 편집자처럼 대하기

- `Make the title 2x bigger, swap to dark mode, and add a fade-out at the end.`
- `Add a lower third at 0:03 with my name and title.`

에이전트가 스캐폴딩, 애니메이션, 렌더링을 모두 처리합니다. 더 많은 패턴은 [프롬프팅 가이드](/guides/prompting)를 참고하세요.

> 스킬에는 일반적인 웹 문서에는 없는 HyperFrames 고유 패턴이 담겨 있습니다. 예를 들어 시간 기반 요소에 필요한 `class="clip"`, GSAP 타임라인 등록, `data-*` 속성 시맨틱스 등이 있습니다. 스킬을 사용하면 처음부터 올바른 컴포지션을 만들 수 있습니다.

## 옵션 2: 프로젝트를 직접 시작하기

### 사전 준비

- **Node.js 22+**: CLI와 개발 서버를 실행하기 위한 런타임
- **FFmpeg**: 로컬 렌더링 시 비디오 인코딩에 필요

### 설치 방법

#### 1. Node.js 22+ 설치

Hyperframes는 Node.js 22 이상이 필요합니다. 현재 버전을 확인하세요.

```bash
node --version
```

예상 출력:

```bash
v22.0.0   # 또는 22 이상 버전
```

#### 2. FFmpeg 설치

FFmpeg는 로컬 비디오 렌더링에 필요합니다. 캡처한 프레임을 MP4로 인코딩할 때 사용됩니다.

**macOS**

```bash
brew install ffmpeg
```

**Ubuntu / Debian**

```bash
sudo apt install ffmpeg
```

**Windows**

```bash
# https://ffmpeg.org/download.html 에서 다운로드하거나
# winget으로 설치:
winget install ffmpeg
```

설치를 확인하세요.

```bash
ffmpeg -version
```

예상 출력:

```bash
ffmpeg version 7.x ...
```

### 첫 번째 비디오 만들기

#### 1. 프로젝트 스캐폴딩

```bash
npx hyperframes init my-video
cd my-video
```

이렇게 하면 예제 선택과 미디어 가져오기를 안내하는 대화형 마법사가 시작됩니다. 프롬프트를 건너뛰려면, 예를 들어 CI나 에이전트에서 실행할 때 `--non-interactive`를 사용하세요.

```bash
npx hyperframes init my-video --non-interactive --example blank
```

사용 가능한 모든 예제는 [Examples](/examples)에서 확인하세요.

생성되는 프로젝트 구조는 다음과 같습니다.

```text
my-video/
├── meta.json
├── index.html
├── compositions/
│   ├── intro.html
│   └── captions.html
└── assets/
    └── video.mp4
```

| Path | Purpose |
| --- | --- |
| `meta.json` | 프로젝트 메타데이터(이름, ID, 생성일) |
| `index.html` | 루트 컴포지션, 비디오의 진입점 |
| `compositions/` | `data-composition-src`로 불러오는 하위 컴포지션 |
| `assets/` | 미디어 파일(비디오, 오디오, 이미지) |

소스 비디오가 있다면 `--video`로 전달하면 자동 전사와 자막이 생성됩니다.

```bash
npx hyperframes init my-video --example warm-grain --video ./intro.mp4
```

`hyperframes init`은 AI 에이전트 스킬도 자동으로 설치하므로, 어느 시점에서든 AI 에이전트에게 작업을 넘길 수 있습니다.

#### 2. 브라우저에서 미리보기

```bash
npx hyperframes preview
```

그러면 Hyperframes Studio가 시작되고 브라우저에서 컴포지션이 열립니다. `index.html`을 수정하면 자동으로 다시 로드됩니다.

> 개발 서버는 핫 리로드를 지원합니다. HTML 파일을 저장하면 수동 새로고침 없이 미리보기가 즉시 업데이트됩니다.

#### 3. 컴포지션 편집

AI 코딩 에이전트(Claude Code, Cursor 등)로 프로젝트를 열어 작업할 수 있습니다. 스킬이 자동으로 설치되므로 에이전트가 컴포지션을 만들고 편집하는 방법을 알고 있습니다.

또는 `index.html`을 직접 편집할 수 있습니다. 아래는 최소 구성 예시입니다.

```html
<div id="root" data-composition-id="my-video"
     data-start="0" data-width="1920" data-height="1080">

  <!-- 1. 트랙 0에 타이밍이 지정된 텍스트 클립 정의 -->
  <h1 id="title" class="clip"
      data-start="0" data-duration="5" data-track-index="0"
      style="font-size: 72px; color: white; text-align: center;
             position: absolute; top: 50%; left: 50%;
             transform: translate(-50%, -50%);">
    Hello, Hyperframes!
  </h1>

  <!-- 2. 애니메이션을 위해 GSAP 로드 -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

  <!-- 3. 일시정지된 타임라인 생성 후 등록 -->
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
    window.__timelines = window.__timelines || {};
    window.__timelines["my-video"] = tl;
  </script>
</div>
```

기억해야 할 세 가지 규칙은 다음과 같습니다.

- **루트 요소**에는 `data-composition-id`, `data-width`, `data-height`가 있어야 합니다.
- **타이밍이 지정된 요소**에는 `data-start`, `data-duration`, `data-track-index`, `class="clip"`이 필요합니다.
- **GSAP 타임라인**은 `{ paused: true }`로 생성하고 `window.__timelines`에 등록해야 합니다.

#### 4. MP4로 렌더링

```bash
npx hyperframes render --output output.mp4
```

예상 출력:

```bash
✔ Capturing frames... 150/150
✔ Encoding MP4...
✔ output.mp4 (1920x1080, 5.0s, 30fps)
```

이제 비디오는 `output.mp4`에 생성됩니다. 원하는 미디어 플레이어로 열어 보세요.

## 요구 사항 요약

| Dependency | Required | Notes |
| --- | --- | --- |
| **Node.js** 22+ | Yes | CLI와 개발 서버를 위한 런타임 |
| **npm** or bun | Yes | 패키지 매니저 |
| **FFmpeg** | Yes | 로컬 렌더링을 위한 비디오 인코딩 |
| **Docker** | No | 선택 사항, 결정론적이고 재현 가능한 렌더링용 |

## 다음 단계

- [카탈로그 둘러보기](/catalog/blocks/data-chart): 바로 사용할 수 있는 50개 이상의 블록, 전환 효과, 오버레이, 데이터 시각화, 이펙트를 살펴보세요.
- [GSAP 애니메이션](/guides/gsap-animation): 페이드, 슬라이드, 스케일, 커스텀 애니메이션을 비디오에 추가해 보세요.
- [예제](/examples): Warm Grain, Swiss Grid 같은 내장 예제로 시작해 보세요.
- [렌더링](/guides/rendering): 품질 프리셋, Docker 모드, GPU 인코딩 등 렌더링 옵션을 살펴보세요.
