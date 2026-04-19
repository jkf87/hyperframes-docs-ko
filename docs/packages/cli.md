# CLI

> 명령줄에서 HTML 비디오 컴포지션을 생성, 미리보기, 렌더링합니다.

`hyperframes` CLI는 Hyperframes로 작업하는 주된 방법입니다. 프로젝트 생성, 라이브 미리보기, 렌더링, 린팅, 진단을 모두 터미널에서 처리합니다.

```bash theme={null}
npm install -g hyperframes
# 또는 npx로 직접 사용
npx hyperframes <command>
```

## 언제 사용하나요

**다음을 원할 때 CLI를 사용하세요:**

* 비디오 제작용으로 웹사이트 캡처 (`capture`)
* 예제에서 새 컴포지션 프로젝트 생성 (`init`)
* 라이브 핫 리로드로 컴포지션 미리보기 (`preview`)
* 로컬 또는 Docker에서 컴포지션을 MP4로 렌더링 (`render`)
* 컴포지션의 구조적 문제 린팅 (`lint`)
* 주요 프레임을 PNG 스크린샷으로 캡처 (`snapshot`)
* 환경에 누락된 의존성 확인 (`doctor`)

**다른 패키지를 사용해야 할 때:**

* Node.js 코드에서 프로그램적으로 렌더링하려면 — [producer](/packages/producer) 사용
* 커스텀 프레임 캡처 파이프라인을 구축하려면 — [engine](/packages/engine) 사용
* 자체 웹 앱에 컴포지션 에디터를 임베드하려면 — [studio](/packages/studio) 사용
* 코드에서 컴포지션 HTML을 파싱하거나 생성하려면 — [core](/packages/core) 사용

<Tip>
  CLI는 모든 Hyperframes 사용자에게 권장되는 출발점입니다. producer, engine, studio 패키지를 래핑하므로 개별적으로 설치할 필요가 없습니다.
</Tip>

## 기본값부터 에이전트 친화적

CLI는 **기본적으로 비대화형**입니다 — AI 에이전트(Claude Code, Gemini CLI, Codex, Cursor)가 프롬프트나 대화형 UI 없이 모든 명령을 실행할 수 있도록 설계되었습니다.

* 모든 입력은 플래그로 전달됩니다 (예: `--example`, `--video`, `--output`)
* 필수 플래그가 누락되면 명확한 오류와 사용 예시와 함께 즉시 실패합니다
* 출력은 파싱에 적합한 일반 텍스트입니다
* 대화형 프롬프트, 스피너, 선택 메뉴가 없습니다

어떤 명령에든 `--human-friendly`를 추가하면 프롬프트, 스피너, 선택 메뉴가 있는 대화형 터미널 UI가 활성화됩니다.

<Tabs>
  <Tab title="에이전트 모드 (기본)">
    ```bash theme={null}
    # 완전 비대화형 — 모든 입력을 플래그로
    npx hyperframes init my-video --example blank --video video.mp4
    npx hyperframes render --output output.mp4 --fps 30 --quality standard
    npx hyperframes upgrade --check --json
    ```
  </Tab>

  <Tab title="휴먼 모드">
    ```bash theme={null}
    # 대화형 프롬프트, 스피너, 선택 메뉴
    npx hyperframes init --human-friendly
    npx hyperframes upgrade
    ```
  </Tab>
</Tabs>

### JSON 출력과 `_meta` 엔벨로프

`--json`을 지원하는 모든 명령은 출력을 버전 체크 정보가 포함된 `_meta` 필드로 감쌉니다:

```json theme={null}
{
  "name": "my-video",
  "duration": 10.5,
  "_meta": {
    "version": "0.1.4",
    "latestVersion": "0.1.5",
    "updateAvailable": true
  }
}
```

이를 통해 에이전트는 별도의 업그레이드 체크를 실행하지 않고도 모든 명령의 출력에서 오래된 버전을 감지할 수 있습니다. 버전 데이터는 24시간 캐시에서 제공되므로 — `--json` 출력 중에는 네트워크 요청이 일어나지 않습니다.

### 수동적인 업데이트 알림

CLI는 백그라운드에서 npm의 최신 버전을 확인합니다(24시간 캐시). 업데이트가 있으면 명령 완료 후 stderr에 알림이 표시됩니다:

```
  Update available: 0.1.4 → 0.1.5
  Run: npx hyperframes@latest
```

CI 환경, 비 TTY 셸, 그리고 `HYPERFRAMES_NO_UPDATE_CHECK=1`이 설정된 경우에는 억제됩니다.

## 시작하기

<Steps>
  <Step title="프로젝트 생성">
    예제로부터 새 컴포지션을 스캐폴드합니다:

    ```bash theme={null}
    npx hyperframes init --example warm-grain
    ```

    프로젝트 이름을 물어보거나 인자로 전달할 수 있습니다:

    ```bash theme={null}
    npx hyperframes init my-video --example warm-grain
    ```

    사용 가능한 모든 예제는 [Examples](/examples)를 참고하세요.
  </Step>

  <Step title="브라우저에서 미리보기">
    라이브 핫 리로드로 개발 서버를 시작합니다:

    ```bash theme={null}
    cd my-video
    npx hyperframes preview
    ```

    Hyperframes Studio가 브라우저에서 열립니다. `index.html`을 편집하면 미리보기가 즉시 업데이트됩니다.
  </Step>

  <Step title="컴포지션 린트">
    렌더링 전에 구조적 문제를 확인합니다:

    ```bash theme={null}
    npx hyperframes lint
    ```

    ```
    ◆  Linting my-project/index.html

    ◇  0 errors, 0 warnings
    ```
  </Step>

  <Step title="MP4로 렌더링">
    최종 비디오를 생성합니다:

    ```bash theme={null}
    npx hyperframes render --output output.mp4
    ```

    결정론적(deterministic) 출력을 위해 `--docker`를 추가하세요:

    ```bash theme={null}
    npx hyperframes render --docker --output output.mp4
    ```
  </Step>
</Steps>

## 명령어

<Tabs>
  <Tab title="생성">
    ### `init`

    예제로부터 새 컴포지션 프로젝트를 생성합니다:

    ```bash theme={null}
    # 에이전트 모드 (기본) — --example 필수
    npx hyperframes init my-video --example blank --video video.mp4

    # 휴먼 모드 — 대화형 프롬프트
    npx hyperframes init --human-friendly
    ```

    | 플래그              | 설명                                                                               |
    | ------------------- | ---------------------------------------------------------------------------------- |
    | `--example, -e`     | 스캐폴드할 예제 (기본 모드에서 필수, `--human-friendly`에서는 대화형)              |
    | `--video, -V`       | 비디오 파일 경로 (MP4, WebM, MOV)                                                  |
    | `--audio, -a`       | 오디오 파일 경로 (MP3, WAV, M4A)                                                   |
    | `--skip-skills`     | AI 코딩 스킬 설치 건너뛰기                                                         |
    | `--skip-transcribe` | 자동 whisper 전사 건너뛰기                                                         |
    | `--model`           | 전사용 Whisper 모델 (예: `small.en`, `medium.en`, `large-v3`)                      |
    | `--language`        | 전사용 언어 코드 (예: `en`, `es`, `ja`). 대상 언어가 아닌 음성을 필터링합니다.     |
    | `--human-friendly`  | 프롬프트가 있는 대화형 터미널 UI 활성화                                            |

    | 예제         | 설명                                           |
    | ------------ | ---------------------------------------------- |
    | `blank`      | 빈 컴포지션 — 스캐폴딩만 있음                  |
    | `warm-grain` | 그레인 텍스처가 있는 크림 미학                 |
    | `play-mode`  | 장난기 있는 탄성 애니메이션                    |
    | `swiss-grid` | 구조화된 그리드 레이아웃                       |
    | `vignelli`   | 빨간 악센트가 있는 굵은 타이포그래피           |

    기본(에이전트) 모드에서는 `--example`이 필수입니다 — 누락되면 CLI가 사용 예시와 함께 오류를 냅니다. `--human-friendly` 모드에서는 대화형으로 선택합니다. `--video` 또는 `--audio`가 제공되면 CLI가 Whisper로 오디오를 자동 전사하고 캡션을 컴포지션에 패치합니다(비활성화하려면 `--skip-transcribe`).

    스캐폴딩 후 CLI는 Claude Code, Gemini CLI, Codex CLI용 AI 코딩 스킬을 설치합니다(비활성화하려면 `--skip-skills`). [`skills`](#skills) 명령을 참고하세요.

    자세한 내용은 [Examples](/examples)를 확인하세요.

    ### `add`

    레지스트리에서 **블록** 또는 **컴포넌트**를 기존 프로젝트에 설치합니다. 예제(전체 프로젝트)는 [`init`](#init)으로 스캐폴드하고, 블록과 컴포넌트는 이미 가지고 있는 컴포지션에 추가하는 더 작은 단위입니다.

    ```bash theme={null}
    # 블록 추가 (서브 컴포지션 씬)
    npx hyperframes add claude-code-window

    # 컴포넌트 추가 (효과 / 스니펫)
    npx hyperframes add shader-wipe

    # 다른 프로젝트 디렉터리 지정
    npx hyperframes add shader-wipe --dir ./my-video

    # 헤드리스 / CI (클립보드 건너뛰기; --json은 머신 판독 결과용)
    npx hyperframes add shader-wipe --no-clipboard --json
    ```

    | 플래그                  | 설명                                                          |
    | ----------------------- | ------------------------------------------------------------- |
    | `&lt;name&gt;` (위치 인자) | 레지스트리 항목 이름 (예: `claude-code-window`, `shader-wipe`) |
    | `--dir`                 | 프로젝트 디렉터리 (기본값: 현재 작업 디렉터리)                |
    | `--no-clipboard`        | include 스니펫을 클립보드에 복사하지 않음                     |
    | `--json`                | 머신 판독 가능한 요약(생성된 파일 + 스니펫)을 stdout에 출력   |

    `add`는 프로젝트 루트의 [`hyperframes.json`](#hyperframes-json)을 읽어 어떤 레지스트리에서 가져오고 어디에 파일을 둘지 파악합니다. 파일이 없지만 디렉터리가 Hyperframes 프로젝트로 보이면(`index.html`이 있으면) 처음 `add`를 실행할 때 기본 `hyperframes.json`이 생성됩니다.

    블록이나 컴포넌트의 출력은 파일 집합에 더해 **붙여넣기 스니펫** — 호스트 컴포지션에 포함할 `&lt;iframe&gt;` 태그(블록의 경우) 또는 프래그먼트 경로(컴포넌트의 경우)입니다. 스니펫은 기본적으로 클립보드에 복사됩니다. CI나 헤드리스 환경에서는 `--no-clipboard`를 추가하세요.

    예제 이름(예: `hyperframes add warm-grain`)으로 `add`를 시도하면 `init --example`을 가리키는 명확한 오류를 냅니다.

    ### `catalog`

    레지스트리를 탐색합니다 — 사용 가능한 블록과 컴포넌트를 선택적 필터와 함께 나열합니다:

    ```bash theme={null}
    # 전체 목록 (기본: 테이블 출력)
    npx hyperframes catalog

    # 타입 또는 태그로 필터링
    npx hyperframes catalog --type block
    npx hyperframes catalog --type block --tag social

    # 머신 판독 JSON
    npx hyperframes catalog --json

    # 대화형 선택기 — 선택해서 설치
    npx hyperframes catalog --human-friendly
    ```

    | 플래그             | 설명                                                |
    | ------------------ | --------------------------------------------------- |
    | `--type`           | `block` 또는 `component`로 필터링                   |
    | `--tag`            | 태그로 필터링 (예: `social`, `transition`, `text`)  |
    | `--json`           | 일치하는 항목을 JSON으로 출력 (비대화형)            |
    | `--human-friendly` | 대화형 선택기 — 선택하면 설치 실행                  |

    기본 출력은 이름, 타입, 설명, 태그를 나열하는 테이블 — 에이전트가 파싱하도록 설계되었습니다. `--json`은 구조화된 출력을 생성합니다. `--human-friendly`는 선택 시 `add`를 실행하는 대화형 선택기를 엽니다.

    ### `compositions`

    현재 프로젝트의 모든 컴포지션을 나열합니다:

    ```bash theme={null}
    npx hyperframes compositions
    ```

    | 플래그   | 설명           |
    | -------- | -------------- |
    | `--json` | JSON으로 출력  |

    각 컴포지션의 ID, 길이, 해상도, 요소 개수를 표시합니다.

    ### `transcribe`

    오디오/비디오를 단어 단위 타임스탬프로 전사하거나 기존 전사본을 임포트합니다:

    ```bash theme={null}
    # 로컬 whisper.cpp로 오디오/비디오 전사
    npx hyperframes transcribe audio.mp3
    npx hyperframes transcribe video.mp4 --model medium.en --language en

    # 다른 도구의 기존 전사본 임포트
    npx hyperframes transcribe subtitles.srt
    npx hyperframes transcribe captions.vtt
    npx hyperframes transcribe openai-response.json
    ```

    | 플래그           | 설명                                                                                                       |
    | ---------------- | ---------------------------------------------------------------------------------------------------------- |
    | `--dir, -d`      | 프로젝트 디렉터리 (기본값: 현재 디렉터리)                                                                  |
    | `--model, -m`    | Whisper 모델 (기본값: `small.en`). 옵션: `tiny.en`, `base.en`, `small.en`, `medium.en`, `large-v3`          |
    | `--language, -l` | 언어 코드 (예: `en`, `es`, `ja`). 대상 언어가 아닌 음성을 필터링합니다.                                    |
    | `--json`         | 결과를 JSON으로 출력                                                                                        |

    명령은 입력 유형을 자동 감지합니다. 오디오/비디오 파일은 whisper.cpp로 전사됩니다. 전사 파일(`.json`, `.srt`, `.vtt`)은 정규화되어 임포트됩니다.

    **지원되는 전사 포맷:**

    | 포맷                    | 출처                                                            |
    | ----------------------- | --------------------------------------------------------------- |
    | whisper.cpp JSON        | `hyperframes init --video`, `hyperframes transcribe`            |
    | OpenAI Whisper API JSON | 단어 타임스탬프가 포함된 `openai.audio.transcriptions.create()` |
    | SRT 자막                | 비디오 에디터, YouTube, 자막 도구                               |
    | VTT 자막                | 웹 플레이어, YouTube, 전사 서비스                               |

    모든 포맷은 표준 `[{text, start, end}]` 단어 배열로 정규화되어 `transcript.json`으로 저장됩니다. 프로젝트에 캡션 HTML 파일이 있으면 전사 데이터로 자동 패치됩니다.

    <Tip>
      음악이나 소음이 많은 오디오의 경우 더 나은 정확도를 위해 `--model medium.en`을 사용하세요. 프로덕션 콘텐츠에서 최상의 결과를 위해서는 OpenAI 또는 Groq의 Whisper API로 전사하고 JSON을 임포트하세요.
    </Tip>

    ### `tts`

    로컬 AI 모델(Kokoro-82M)을 사용해 텍스트로부터 음성 오디오를 생성합니다. API 키가 필요 없습니다 — 온디바이스에서 완전히 실행됩니다.

    ```bash theme={null}
    # 텍스트로부터 음성 생성
    npx hyperframes tts "Welcome to HyperFrames"

    # 음성 선택
    npx hyperframes tts "Hello world" --voice am_adam

    # 특정 파일로 저장
    npx hyperframes tts "Intro" --voice bf_emma --output narration.wav

    # 말하기 속도 조정
    npx hyperframes tts "Slow and clear" --speed 0.8

    # 파일에서 텍스트 읽기
    npx hyperframes tts script.txt

    # 사용 가능한 음성 목록
    npx hyperframes tts --list
    ```

    | 플래그         | 설명                                                          |
    | -------------- | ------------------------------------------------------------- |
    | `--output, -o` | 출력 파일 경로 (기본값: 현재 디렉터리의 `speech.wav`)         |
    | `--voice, -v`  | 음성 ID (옵션을 보려면 `--list` 실행)                         |
    | `--speed, -s`  | 말하기 속도 배수 (기본값: 1.0)                                |
    | `--list`       | 사용 가능한 음성 목록을 출력하고 종료                         |
    | `--json`       | 결과를 JSON으로 출력                                          |

    <Tip>
      `tts`와 `transcribe`를 조합하면 하나의 워크플로에서 내레이션과 캡션용 단어 단위 타임스탬프를 생성할 수 있습니다: `tts`로 오디오를 생성한 다음, `transcribe`로 결과물을 전사해서 단어 단위 타이밍을 얻으세요.
    </Tip>

    ### `capture`

    웹사이트를 캡처합니다 — 비디오 제작을 위해 스크린샷, 디자인 토큰, 폰트, 에셋, 애니메이션을 추출합니다:

    ```bash theme={null}
    npx hyperframes capture https://stripe.com
    npx hyperframes capture https://linear.app -o captures/linear
    npx hyperframes capture https://example.com --json
    ```

    ```
    ◇  Captured Stripe | Financial Infrastructure → captures/stripe-com

      Screenshots: 12
      Assets: 45
      Sections: 15
      Fonts: sohne-var
    ```

    | 플래그              | 설명                                                      |
    | ------------------- | --------------------------------------------------------- |
    | `-o, --output`      | 출력 디렉터리 (기본값: `captures/&lt;hostname&gt;`)         |
    | `--timeout`         | 페이지 로드 타임아웃(ms) (기본값: 120000)                 |
    | `--skip-assets`     | 이미지 및 폰트 다운로드 건너뛰기                          |
    | `--max-screenshots` | 최대 스크린샷 개수 (기본값: 24)                           |
    | `--json`            | 프로그램에서 사용할 수 있는 구조화된 JSON 출력            |

    capture 명령은 AI 에이전트가 웹사이트의 시각적 아이덴티티를 이해하는 데 필요한 모든 것을 추출합니다: 모든 스크롤 깊이의 뷰포트 스크린샷, 컬러 팔레트(픽셀 샘플링 + DOM 계산), 폰트 파일, 의미 있는 이름의 이미지, SVG, Lottie 애니메이션, 비디오 미리보기, WebGL 셰이더, 보이는 텍스트, 페이지 구조.

    출력은 `CLAUDE.md` 파일이 포함된 자체 포함 디렉터리로, AI 에이전트라면 누구나 이 파일을 읽어 캡처된 사이트를 이해할 수 있습니다. 비디오 제작 파이프라인의 1단계로 `/website-to-hyperframes` 스킬이 사용합니다.

    Gemini 비전을 통한 AI 기반 이미지 설명을 위해 `.env` 파일에 `GEMINI_API_KEY`를 설정하세요(\~\$0.001/이미지). 자세한 내용은 [Website to Video](/guides/website-to-video#enriching-captures-with-gemini-vision) 가이드를 참고하세요.
  </Tab>

  <Tab title="미리보기">
    ### `preview`

    핫 리로드가 가능한 라이브 미리보기 서버를 시작합니다:

    ```bash theme={null}
    npx hyperframes preview [dir]
    npx hyperframes preview --port 4567
    ```

    | 플래그   | 설명                                                    |
    | -------- | ------------------------------------------------------- |
    | `--port` | 미리보기 서버를 실행할 포트 (기본값: 3002)              |

    컴포지션을 Hyperframes Studio에서 라이브 미리보기로 엽니다. `index.html`과 참조된 서브 컴포지션의 편집 사항이 자동으로 반영됩니다. 미리보기는 프로덕션 렌더링과 동일한 Hyperframes 런타임을 사용하므로, 보이는 대로 렌더링됩니다.

    <Note>
      시각적 출력은 렌더링과 정확히 일치합니다. 재생 *성능*은 그렇지 않습니다: 미리보기는 브라우저에서 실시간으로 재생되므로, 페인트가 많은 컴포지션(대형 이미지, 쌓인 `backdrop-filter` 레이어, 그림자가 많은 요소)은 하드웨어에 따라 끊길 수 있습니다. 렌더링된 mp4는 항상 정확합니다 — 렌더링은 프레임을 하나씩 캡처하므로, 프레임당 비용은 프레임 드롭이 아닌 더 긴 렌더링 시간으로 나타납니다. 자세한 내용은 [Performance](/guides/performance)를 참고하세요.
    </Note>

    미리보기 서버는 세 가지 모드로 실행되며 자동 감지됩니다:

    1. **Embedded 모드** (`npx` 기본값) — CLI에 번들된 스튜디오가 포함된 독립형 서버를 실행합니다. 추가 의존성이 필요 없습니다.
    2. **Local studio 모드** — 프로젝트의 `node_modules`에 `@hyperframes/studio`가 설치되어 있으면 더 빠른 반복을 위해 전체 HMR이 있는 Vite를 생성합니다.
    3. **Monorepo 모드** — Hyperframes 소스 저장소에서 실행할 경우 스튜디오 개발 서버를 직접 생성합니다.

    ### `lint`

    컴포지션에서 일반적인 문제를 확인합니다:

    ```bash theme={null}
    npx hyperframes lint [dir]
    npx hyperframes lint [dir] --verbose   # info 수준 발견 사항 포함
    npx hyperframes lint [dir] --json      # 머신 판독 가능한 JSON 출력
    ```

    ```
    ◆  Linting my-project/index.html

      ✗ missing_gsap_script: Composition uses GSAP but no GSAP script is loaded.
      ⚠ unmuted-video [clip-1]: Video should have the 'muted' attribute for reliable autoplay.

    ◇  1 error(s), 1 warning(s)
    ```

    기본적으로 **errors**와 **warnings**만 출력됩니다. info 수준 발견 사항(예: 외부 스크립트 의존성 알림)은 에이전트와 CI의 출력을 깔끔하게 유지하기 위해 숨겨집니다. 포함하려면 `--verbose`를 사용하세요.

    | 플래그      | 설명                                                                                                    |
    | ----------- | ------------------------------------------------------------------------------------------------------- |
    | `--json`    | 발견 사항을 JSON으로 출력 (`errorCount`, `warningCount`, `infoCount`, `findings` 배열 포함)             |
    | `--verbose` | info 수준 발견 사항을 출력에 포함 (기본적으로 숨겨짐)                                                   |

    **심각도 수준:**

    * **Error** (`✗`) — 렌더링 전에 반드시 수정 (예: 어댑터 라이브러리 누락, 잘못된 속성)
    * **Warning** (`⚠`) — 예기치 않은 동작을 유발할 수 있는 문제
    * **Info** (`ℹ`) — 정보성 알림, `--verbose`로만 표시

    린터는 누락된 속성, 누락된 어댑터 라이브러리(GSAP, Lottie, Three.js), 구조적 문제 등을 감지합니다. 각 규칙에 대한 자세한 내용은 [Common Mistakes](/guides/common-mistakes)를 참고하세요.

    ### `snapshot`

    컴포지션에서 주요 프레임을 PNG 스크린샷으로 캡처합니다 — 전체 렌더링 없이 시각적 출력을 검증합니다:

    ```bash theme={null}
    npx hyperframes snapshot my-project --at 2.9,10.4,18.7
    npx hyperframes snapshot my-project --frames 10
    ```

    ```
    ◆  Capturing 3 frames at [2.9s, 10.4s, 18.7s] from my-project

    ◇  3 snapshots saved to snapshots/
       snapshots/frame-00-at-2.9s.png
       snapshots/frame-01-at-10.4s.png
       snapshots/frame-02-at-18.7s.png
    ```

    | 플래그      | 설명                                                             |
    | ----------- | ---------------------------------------------------------------- |
    | `--frames`  | 캡처할 균등 간격 프레임 수 (기본값: 5)                           |
    | `--at`      | 쉼표로 구분된 타임스탬프(초) (예: `3.0,10.5,18.0`)               |
    | `--timeout` | 런타임 초기화 대기 시간(ms) (기본값: 5000)                       |

    snapshot 명령은 프로젝트를 번들링하고, 로컬에서 서비스하고, 헤드리스 Chrome을 실행하고, 각 타임스탬프로 이동해서 1920×1080 PNG를 캡처합니다. [website-to-video](/guides/website-to-video) 워크플로의 빌드 단계에서 시각적 검증에 유용합니다.
  </Tab>

  <Tab title="빌드">
    ### `render`

    컴포지션을 MP4 또는 WebM으로 렌더링합니다:

    ```bash theme={null}
    # 로컬 모드 (빠른 반복)
    npx hyperframes render --output output.mp4

    # Docker 모드 (결정론적 출력)
    npx hyperframes render --docker --output output.mp4

    # 투명도가 있는 WebM (오버레이, 캡션, 로워써드용)
    npx hyperframes render --format webm --output overlay.webm

    # 옵션과 함께
    npx hyperframes render --output output.mp4 --fps 60 --quality high
    ```

    | 플래그            | 값                    | 기본값                | 설명                                                                             |
    | ----------------- | --------------------- | --------------------- | -------------------------------------------------------------------------------- |
    | `--output`        | 경로                  | `renders/&lt;name&gt;.mp4` | 출력 파일 경로                                                                   |
    | `--format`        | mp4, webm, mov        | mp4                   | 출력 포맷 (WebM/MOV는 투명도와 함께 렌더링)                                      |
    | `--fps`           | 24, 30, 60            | 30                    | 초당 프레임 수                                                                   |
    | `--quality`       | draft, standard, high | standard              | 인코딩 품질 프리셋                                                               |
    | `--crf`           | 0–51                  | —                     | CRF 재정의 (낮을수록 고품질). `--video-bitrate`와 함께 사용할 수 없음            |
    | `--video-bitrate` | 예: `10M`, `5000k`    | —                     | 타겟 비트레이트 인코딩. `--crf`와 함께 사용할 수 없음                            |
    | `--workers`       | 1-8                   | 4                     | 병렬 렌더링 워커                                                                 |
    | `--gpu`           | —                     | off                   | GPU 인코딩 (NVENC, VideoToolbox, VAAPI)                                          |
    | `--docker`        | —                     | off                   | [결정론적 렌더링](/concepts/determinism)을 위해 Docker 사용                      |
    | `--quiet`         | —                     | off                   | 상세 출력 억제                                                                   |

    #### 투명도가 있는 WebM

    `--format webm`을 사용해 투명 배경이 있는 컴포지션을 렌더링합니다. 이는 알파 채널이 있는 VP9 비디오를 WebM 컨테이너로 생성합니다 — 오버레이 가능한 비디오의 표준 포맷입니다.

    ```bash theme={null}
    # 투명 배경으로 캡션 오버레이 렌더링
    npx hyperframes render --format webm --output captions.webm

    # FFmpeg로 다른 비디오에 오버레이
    ffmpeg -c:v libvpx-vp9 -i captions.webm -i background.mp4 \
      -filter_complex "[1:v][0:v]overlay=0:0" -y composited.mp4
    ```

    <Tip>
      투명도가 작동하려면 컴포지션의 HTML이 루트 요소에 `background: transparent`를 사용해야 합니다. WebM 렌더링은 알파 채널을 보존하기 위해 JPEG 대신 PNG 프레임 캡처를 사용합니다.
    </Tip>

    모든 옵션과 모드는 [Rendering](/guides/rendering)을 참고하세요.

    ### `benchmark`

    시스템에 최적화된 렌더링 설정을 찾습니다:

    ```bash theme={null}
    npx hyperframes benchmark [dir]
    ```

    | 플래그   | 값     | 기본값  | 설명                             |
    | -------- | ------ | ------- | -------------------------------- |
    | `--runs` | 1-20   | 3       | 구성당 실행 횟수                 |
    | `--json` | —      | off     | 결과를 JSON으로 출력             |

    여러 렌더링 구성(fps, 품질, 워커 수 변경)을 실행하고 각각의 타이밍과 파일 크기를 비교합니다.
  </Tab>

  <Tab title="유틸리티">
    ### `doctor`

    환경에 필요한 의존성을 확인합니다:

    ```bash theme={null}
    npx hyperframes doctor
    ```

    ```
    hyperframes doctor

      ✓ Version          0.1.4 (latest)
      ✓ Node.js          v22.x (linux x64)
      ✓ FFmpeg            7.x
      ✓ FFprobe           7.x
      ✓ Chrome            (system or cached)
      ✓ Docker            24.x
      ✓ Docker running    Running

      ◇  All checks passed
    ```

    CLI 버전, Node.js, FFmpeg, FFprobe, Chrome, Docker 가용성을 확인합니다. 새 CLI 버전이 있으면 버전 행에 업그레이드 힌트가 표시됩니다.

    ### `info`

    프로젝트 메타데이터를 표시합니다:

    ```bash theme={null}
    npx hyperframes info [dir]
    ```

    | 플래그   | 설명           |
    | -------- | -------------- |
    | `--json` | JSON으로 출력  |

    프로젝트 이름, 해상도, 길이, 타입별 요소 개수, 트랙 개수, 총 프로젝트 크기를 표시합니다.

    ### `upgrade`

    업데이트를 확인하고 업그레이드 지침을 표시합니다:

    ```bash theme={null}
    npx hyperframes upgrade
    npx hyperframes upgrade --check         # 확인 후 종료 (프롬프트 없음)
    npx hyperframes upgrade --check --json  # 에이전트용 머신 판독 가능
    npx hyperframes upgrade --yes           # 프롬프트 없이 업그레이드 명령 표시
    ```

    | 플래그      | 설명                                                        |
    | ----------- | ----------------------------------------------------------- |
    | `--check`   | 업데이트를 확인하고 종료 (프롬프트 없음, 에이전트 친화적)   |
    | `--json`    | JSON으로 출력 (`_meta` 엔벨로프 포함)                       |
    | `--yes, -y` | 프롬프트 없이 업그레이드 명령 표시                          |

    설치된 버전을 npm의 최신 버전과 비교합니다. `--check --json`을 사용하면 다음을 반환합니다:

    ```json theme={null}
    {
      "current": "0.1.4",
      "latest": "0.1.5",
      "updateAvailable": true,
      "_meta": { "version": "0.1.4", "latestVersion": "0.1.5", "updateAvailable": true }
    }
    ```

    ### `browser`

    렌더링에 사용되는 Chrome 브라우저를 관리합니다:

    ```bash theme={null}
    # 렌더링용 Chrome 찾기 또는 다운로드
    npx hyperframes browser ensure

    # 브라우저 실행 파일 경로 출력 (스크립팅용)
    npx hyperframes browser path

    # 캐시된 Chrome 다운로드 제거
    npx hyperframes browser clear
    ```

    `path` 서브 명령은 경로만 출력하므로 스크립트에서 유용합니다: `$(npx hyperframes browser path)`.

    ### `docs`

    터미널에서 인라인 문서를 확인합니다:

    ```bash theme={null}
    npx hyperframes docs [topic]
    ```

    사용 가능한 주제: `data-attributes`, `examples`, `rendering`, `gsap`, `troubleshooting`, `compositions`. 주제 없이 실행하면 전체 목록이 표시됩니다.

    ### `telemetry`

    익명 사용 원격 측정을 관리합니다:

    ```bash theme={null}
    npx hyperframes telemetry enable
    npx hyperframes telemetry disable
    npx hyperframes telemetry status
    ```

    원격 측정은 명령 이름, 렌더링 성능, 예제 선택, 시스템 정보를 수집합니다. 파일 경로, 프로젝트 이름, 비디오 콘텐츠, 개인 식별 정보는 수집하지 **않습니다**. `HYPERFRAMES_NO_TELEMETRY=1` 또는 위 명령으로 비활성화하세요.

    ### `skills`

    AI 코딩 도구용 HyperFrames 및 GSAP 스킬을 설치합니다:

    ```bash theme={null}
    # 기본 타겟 모두에 설치 (Claude Code, Gemini CLI, Codex CLI)
    npx hyperframes skills

    # 특정 도구에 설치
    npx hyperframes skills --claude
    npx hyperframes skills --cursor
    npx hyperframes skills --claude --gemini
    ```

    | 플래그     | 설명                                                        |
    | ---------- | ----------------------------------------------------------- |
    | `--claude` | Claude Code에 설치 (`~/.claude/skills/`)                    |
    | `--gemini` | Gemini CLI에 설치 (`~/.gemini/skills/`)                     |
    | `--codex`  | Codex CLI에 설치 (`~/.codex/skills/`)                       |
    | `--cursor` | Cursor에 설치 (현재 프로젝트의 `.cursor/skills/`)           |

    스킬은 GitHub에서 가져오며 컴포지션 작성, GSAP 애니메이션 패턴, 레지스트리 블록/컴포넌트 연결 및 기타 도메인 특화 지식을 포함합니다. `init` 명령도 프로젝트 스캐폴딩 후 스킬을 자동으로 설치할지 제안합니다.

    #### 문제 해결: `fatal: active post-checkout hook found during git clone`

    Git LFS를 전역으로 설치한 경우(`git lfs install`), Git 2.45+는 어떤 `git clone` 중에도 LFS post-checkout 훅 실행을 거부합니다 — 업스트림 `skills` CLI가 내부에서 수행하는 clone도 포함됩니다. 오류는 다음과 같이 보입니다:

    ```
    ■  Failed to clone repository
    fatal: active `post-checkout` hook found during `git clone`
    └  Installation failed
    ```

    **`hyperframes skills`를 사용하는 것은 이미 문제없습니다** — v0.4.5부터 CLI가 자식 환경에 `GIT_CLONE_PROTECTION_ACTIVE=0`을 설정하는데, 이는 정확히 이 경우를 위해 Git이 제공하는 옵트인 노브입니다. 아무것도 하지 않아도 됩니다.

    **`npx skills add heygen-com/hyperframes`를 직접 실행한 경우**(HyperFrames CLI 우회), 환경 변수를 직접 설정하세요:

    ```bash theme={null}
    GIT_CLONE_PROTECTION_ACTIVE=0 npx skills add heygen-com/hyperframes
    ```

    이는 [GH #316](https://github.com/heygen-com/hyperframes/issues/316)에서 추적되고 있습니다. `skills` CLI 자체의 업스트림 수정이 올바른 장기 해결책이지만, 그때까지는 환경 변수가 적절한 우회 방법입니다.
  </Tab>
</Tabs>

## hyperframes.json

`hyperframes init`은 모든 새 프로젝트 루트에 `hyperframes.json` 파일을 작성합니다. `hyperframes add`는 이를 읽어 어떤 레지스트리에서 항목을 가져오고 어디에 둘지 파악합니다. 프로젝트 레이아웃을 재구성하거나 커스텀 레지스트리를 가리키려면 파일을 편집하세요(또는 삭제해서 기본값으로 되돌리세요).

```json theme={null}
{
  "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
  "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  "paths": {
    "blocks": "compositions",
    "components": "compositions/components",
    "assets": "assets"
  }
}
```

| 필드               | 설명                                                                                     |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `registry`         | `add`가 가져올 레지스트리 기본 URL. 기본값은 공개 Hyperframes 레지스트리.                |
| `paths.blocks`     | 블록 `.html` 파일이 저장되는 위치 (프로젝트 루트 기준).                                  |
| `paths.components` | 컴포넌트 파일이 저장되는 위치 (프로젝트 루트 기준).                                      |
| `paths.assets`     | 참조된 에셋 파일(이미지, 폰트)이 저장되는 위치.                                          |

누락된 필드는 기본값으로 채워집니다 — 재정의하려는 값만 지정하면 됩니다.

## 관련 패키지

<CardGroup cols={2}>
  <Card title="Producer" icon="film" href="/packages/producer">
    CLI가 내부에서 호출하는 렌더링 파이프라인. 프로그램적 렌더링을 위해 직접 사용하세요.
  </Card>

  <Card title="Studio" icon="palette" href="/packages/studio">
    `hyperframes preview`를 구동하는 에디터 UI. 자체 앱에 임베드하려면 직접 사용하세요.
  </Card>

  <Card title="Core" icon="cube" href="/packages/core">
    타입, 린터, 런타임. 커스텀 도구와 통합을 위해 직접 사용하세요.
  </Card>

  <Card title="Engine" icon="gear" href="/packages/engine">
    캡처 엔진. 커스텀 프레임 캡처 파이프라인을 위해 직접 사용하세요.
  </Card>
</CardGroup>
