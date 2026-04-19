# 빠른 시작

> 2분 안에 첫 번째 HyperFrames 영상을 만들고, 미리 보고, 렌더링하세요.

AI 에이전트에게 프롬프트를 입력하거나 프로젝트를 직접 시작해서, 아무것도 없는 상태에서 렌더링된 MP4까지 빠르게 완성할 수 있습니다.

원문: [HyperFrames Quickstart](https://hyperframes.heygen.com/quickstart)

## 옵션 1: AI 코딩 에이전트 사용 (권장)

HyperFrames 스킬을 설치한 다음, 원하는 영상을 설명하세요.

```bash
npx skills add heygen-com/hyperframes
```

이 스킬은 에이전트(Claude Code, Cursor, Gemini CLI, Codex)가 올바른 컴포지션과 GSAP 애니메이션을 작성하도록 도와줍니다. Claude Code에서는 슬래시 커맨드로 등록됩니다. `/hyperframes`는 컴포지션 작성, `/hyperframes-cli`는 CLI 명령, `/gsap`는 애니메이션 관련 도움말에 대응합니다. 슬래시 커맨드를 호출하면 스킬 컨텍스트가 명시적으로 로드되어 처음부터 정확한 결과물을 만들기 쉬워집니다.

### 직접 해보기: 예시 프롬프트

- **콜드 스타트, 원하는 것을 바로 설명하기**
  - `/hyperframes`를 사용해서, 어두운 배경 위에 페이드인 타이틀과 은은한 배경 음악이 있는 10초짜리 제품 소개 영상을 만들어 줘.
- **웜 스타트, 기존 컨텍스트를 영상으로 바꾸기**
  - 이 GitHub 저장소 <https://github.com/heygen-com/hyperframes>를 살펴보고, `/hyperframes`를 사용해서 용도와 아키텍처를 설명하는 영상을 만들어 줘.
  - 첨부된 PDF를 `/hyperframes`를 사용해서 45초짜리 피치 영상으로 요약해 줘.
  - 이 CSV를 `/hyperframes`를 사용해서 애니메이션 막대 차트 레이스로 만들어 줘.
- **포맷별 요청**
  - `/hyperframes`를 사용해서 [주제]에 대한 9:16 TikTok 스타일 훅 영상을 만들어 줘. TTS 내레이션에 맞춰 통통 튀는 자막도 넣어 줘.
- **반복 수정, 에이전트를 영상 편집자처럼 대하기**
  - 타이틀을 2배 크게 하고, 다크 모드로 바꾸고, 끝에 페이드아웃을 추가해 줘.
  - 0:03 지점에 내 이름과 직함이 들어간 로워 서드를 추가해 줘.

에이전트가 스캐폴딩, 애니메이션, 렌더링을 모두 처리합니다. 더 많은 패턴은 [프롬프팅 가이드](https://hyperframes.heygen.com/guides/prompting)를 참고하세요.

> 스킬에는 일반적인 웹 문서에는 없는 HyperFrames 고유 패턴이 담겨 있습니다. 예를 들어 시간 기반 요소에 필요한 `class="clip"`, GSAP 타임라인 등록, `data-*` 속성 시맨틱스 등이 있습니다. 스킬을 사용하면 처음부터 올바른 컴포지션을 만들기 쉽습니다.

## 옵션 2: 프로젝트를 직접 시작하기

### 사전 준비

- **Node.js 22+**: CLI 및 개발 서버 실행에 필요한 런타임
- **FFmpeg**: 로컬 렌더링 시 비디오 인코딩에 필요

### 설치 방법

#### 1. Node.js 22+ 설치

현재 버전을 확인합니다.

```bash
node --version
```

예상 출력:

```bash
v22.0.0   # 22 이상이면 됩니다
```

#### 2. FFmpeg 설치

FFmpeg은 로컬 비디오 렌더링에 필요합니다.

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

설치 확인:

```bash
ffmpeg -version
```

예상 출력:

```bash
ffmpeg version 7.x ...
```

### 첫 번째 비디오 만들기

#### 1. 프로젝트 생성

```bash
npx hyperframes init my-video
cd my-video
```

예제 선택과 미디어 가져오기를 위한 대화형 마법사가 실행됩니다. 프롬프트를 건너뛰려면 다음처럼 `--non-interactive` 옵션을 사용하세요.

```bash
npx hyperframes init my-video --non-interactive --example blank
```

사용 가능한 예제 목록은 [Examples](https://hyperframes.heygen.com/examples)를 참고하세요.

생성되는 디렉터리 구조는 다음과 같습니다.

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

| 경로 | 용도 |
| --- | --- |
| `meta.json` | 프로젝트 메타데이터 (이름, ID, 생성일) |
| `index.html` | 루트 컴포지션, 비디오의 진입점 |
| `compositions/` | `data-composition-src`로 불러오는 하위 컴포지션 |
| `assets/` | 미디어 파일 (비디오, 오디오, 이미지) |

소스 비디오가 있다면 `--video` 옵션으로 전달하면 자동으로 전사와 자막이 생성됩니다.

```bash
npx hyperframes init my-video --example warm-grain --video ./intro.mp4
```

`hyperframes init`은 AI 에이전트 스킬도 자동으로 설치하므로, 중간에 언제든지 AI 에이전트에게 작업을 넘길 수 있습니다.

#### 2. 브라우저에서 미리보기

```bash
npx hyperframes preview
```

Hyperframes Studio가 실행되고 브라우저에서 컴포지션이 열립니다. `index.html`을 수정하면 자동으로 새로고침되며, 개발 서버는 핫 리로드를 지원합니다.

#### 3. 컴포지션 편집하기

AI 코딩 에이전트로 프로젝트를 열어 작업할 수 있습니다. 또는 `index.html`을 직접 편집해도 됩니다. 아래는 최소 구성 예시입니다.

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

  <!-- 3. 일시정지 상태의 타임라인 생성 후 등록 -->
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
    window.__timelines = window.__timelines || {};
    window.__timelines["my-video"] = tl;
  </script>
</div>
```

기억해야 할 세 가지 규칙은 다음과 같습니다.

- 루트 요소에는 반드시 `data-composition-id`, `data-width`, `data-height` 속성이 있어야 합니다.
- 타이밍이 지정된 요소에는 `data-start`, `data-duration`, `data-track-index` 속성과 `class="clip"`이 필요합니다.
- GSAP 타임라인은 반드시 `{ paused: true }` 옵션으로 생성하고 `window.__timelines`에 등록해야 합니다.

#### 4. MP4로 렌더링하기

```bash
npx hyperframes render --output output.mp4
```

예상 출력:

```bash
✔ Capturing frames... 150/150
✔ Encoding MP4...
✔ output.mp4 (1920x1080, 5.0s, 30fps)
```

렌더링이 완료되면 `output.mp4` 파일에 영상이 생성됩니다.

## 요구 사항 요약

| 의존성 | 필수 여부 | 비고 |
| --- | --- | --- |
| **Node.js** 22+ | 예 | CLI 및 개발 서버 실행 환경 |
| **npm** 또는 bun | 예 | 패키지 매니저 |
| **FFmpeg** | 예 | 로컬 렌더링 시 영상 인코딩에 사용 |
| **Docker** | 아니오 | 선택 사항, 결정적이고 재현 가능한 렌더링을 위해 사용 |

## 다음 단계

- [카탈로그 둘러보기](https://hyperframes.heygen.com/catalog/blocks/data-chart): 50개 이상의 바로 사용 가능한 블록, 전환 효과, 오버레이, 데이터 시각화, 이펙트 제공
- [GSAP 애니메이션](https://hyperframes.heygen.com/guides/gsap-animation): 페이드, 슬라이드, 스케일, 커스텀 애니메이션 추가
- [예제](https://hyperframes.heygen.com/examples): Warm Grain, Swiss Grid 등 내장 예제로 시작하기
- [렌더링](https://hyperframes.heygen.com/guides/rendering): 품질 프리셋, Docker 모드, GPU 인코딩 등 렌더링 옵션 살펴보기
