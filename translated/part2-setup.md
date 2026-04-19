## 옵션 2: 프로젝트를 직접 시작하기

### 사전 준비

- **Node.js 22+**: CLI 및 개발 서버 실행에 필요한 런타임
- **FFmpeg**: 로컬 렌더링 시 비디오 인코딩에 필요

#### 설치 방법

1. **Node.js 22+ 설치**
   - 현재 버전 확인:

   ```bash
   node --version
   ```

   - 예상 출력:

   ```bash
   v22.0.0   # 22 이상이면 됩니다
   ```

2. **FFmpeg 설치**
   - FFmpeg은 로컬 비디오 렌더링에 필요합니다.
   - macOS:

   ```bash
   brew install ffmpeg
   ```

   - Ubuntu / Debian:

   ```bash
   sudo apt install ffmpeg
   ```

   - Windows:

   ```bash
   # https://ffmpeg.org/download.html 에서 다운로드하거나
   # winget으로 설치:
   winget install ffmpeg
   ```

   - 설치 확인:

   ```bash
   ffmpeg -version
   ```

   - 예상 출력:

   ```bash
   ffmpeg version 7.x ...
   ```

### 첫 번째 비디오 만들기

1. **프로젝트 생성**

   ```bash
   npx hyperframes init my-video
   cd my-video
   ```

   - 예제 선택과 미디어 가져오기를 위한 대화형 마법사가 실행됩니다.
   - 프롬프트를 건너뛰려면:

   ```bash
   npx hyperframes init my-video --non-interactive --example blank
   ```

   - 사용 가능한 예제 목록은 Examples를 참고하세요.
   - 생성되는 디렉터리 구조:

   ```text
   my-video/
   ├── meta.json
   ├── index.html
   ├── compositions/
   │   ├── intro.html
   │   └── captions.html
   └── assets/
   │   └── video.mp4
   ```

   | 경로 | 용도 |
   | --- | --- |
   | `meta.json` | 프로젝트 메타데이터 (이름, ID, 생성일) |
   | `index.html` | 루트 컴포지션, 비디오의 진입점 |
   | `compositions/` | `data-composition-src`로 불러오는 하위 컴포지션 |
   | `assets/` | 미디어 파일 (비디오, 오디오, 이미지) |

   - 소스 비디오가 있다면 `--video` 옵션으로 전달하면 자동으로 전사(transcription) 및 자막이 생성됩니다:

   ```bash
   npx hyperframes init my-video --example warm-grain --video ./intro.mp4
   ```

   - `hyperframes init`은 AI 에이전트 스킬을 자동으로 설치하므로, 언제든지 AI 에이전트에 작업을 넘길 수 있습니다.

2. **브라우저에서 미리보기**

   ```bash
   npx hyperframes preview
   ```

   - Hyperframes Studio가 실행되고 브라우저에서 컴포지션이 열립니다.
   - `index.html`을 수정하면 자동으로 새로고침됩니다.
   - 개발 서버는 핫 리로드를 지원합니다.

---

> **번역자 노트 — 용어 선택 안내**
>
> | 원문 | 번역 | 비고 |
> | --- | --- | --- |
> | Prerequisites | 사전 준비 | "전제 조건"보다 자연스러운 표현 |
> | Scaffold | 프로젝트 생성 | "스캐폴드"는 한국어 독자에게 직관적이지 않아 의미 중심으로 번역 |
> | Interactive wizard | 대화형 마법사 | 개발 문서에서 일반적으로 사용되는 번역 |
> | Composition | 컴포지션 | Hyperframes 고유 개념이므로 음차 유지 |
> | Hot reload | 핫 리로드 | 개발자 사이에서 널리 통용되는 용어이므로 음차 유지 |
> | Transcription | 전사 | 음성을 텍스트로 변환하는 의미로, 괄호 안에 원문 병기 |
> | Sub-compositions | 하위 컴포지션 | 계층 관계를 명확히 표현 |
> | Entry point | 진입점 | 프로그래밍 문서에서 보편적으로 사용되는 번역 |
