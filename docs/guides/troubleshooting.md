# 문제 해결

> Hyperframes의 일반적인 문제에 대한 해결 방법입니다.

특정 코딩 실수(애니메이션이 작동하지 않음, 영상이 일찍 끊김 등)와 관련된 문제는 먼저 [자주 하는 실수](/guides/common-mistakes)를 참조하세요. 이 페이지에서는 환경, 도구 및 렌더링 관련 문제를 다룹니다.

<AccordionGroup>
  <Accordion title="&#x22;No composition found&#x22;">
    디렉터리에 유효한 [컴포지션](/concepts/compositions)이 포함된 `index.html`이 필요합니다. 루트 요소에는 [`data-composition-id`](/concepts/data-attributes#composition-attributes) 속성이 있어야 합니다.

    **해결 방법:** `npx hyperframes init`를 실행하여 [예제](/examples)에서 컴포지션을 생성하거나, `index.html`이 올바른 구조를 가지고 있는지 확인하세요:

    ```html index.html theme={null}
    <div id="root" data-composition-id="my-video"
         data-start="0" data-width="1920" data-height="1080">
      <!-- elements here -->
    </div>
    ```
  </Accordion>

  <Accordion title="&#x22;FFmpeg not found&#x22;">
    로컬 [렌더링](/guides/rendering)을 하려면 시스템에 FFmpeg이 설치되어 있어야 합니다. 플랫폼에 맞게 설치하세요:

    <CodeGroup>
      ```bash macOS theme={null}
      brew install ffmpeg
      ```

      ```bash Ubuntu/Debian theme={null}
      sudo apt install ffmpeg
      ```

      ```bash Windows theme={null}
      # https://ffmpeg.org/download.html 에서 다운로드
      # bin 디렉터리를 PATH에 추가
      ```

      ```bash 설치 확인 theme={null}
      ffmpeg -version
      ```
    </CodeGroup>

    설치 후 `npx hyperframes doctor`를 실행하여 CLI가 FFmpeg을 찾을 수 있는지 확인하세요.

    <Tip>
      FFmpeg을 설치할 수 없는 경우, 대신 [Docker 모드](/guides/rendering)를 사용하세요 — 컨테이너 안에 FFmpeg이 번들되어 있습니다: `npx hyperframes render --docker --output output.mp4`
    </Tip>
  </Accordion>

  <Accordion title="린트 오류">
    `npx hyperframes lint`를 실행하여 일반적인 구조적 문제를 확인하세요 ([CLI: lint](/packages/cli#lint) 참조):

    | 오류                         | 의미                                                                                                      |
    | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
    | `data-composition-id` 누락 | 루트 요소에 이 속성이 필요합니다. [컴포지션](/concepts/compositions)을 참조하세요.                               |
    | `class="clip"` 누락        | 시간이 지정된 가시 요소에는 이 클래스가 필요합니다. [Data Attributes](/concepts/data-attributes#element-visibility)를 참조하세요. |
    | 타임라인 겹침         | 동일한 [`data-track-index`](/concepts/data-attributes#timing-attributes)에 있는 클립은 시간이 겹칠 수 없습니다.  |
    | 음소거되지 않은 비디오 요소        | 비디오 요소는 `data-has-audio="true"`가 설정되지 않은 한 `muted`여야 합니다.                                      |
    | 더 이상 사용되지 않는 속성 이름    | `data-layer`와 `data-end`는 대체되었습니다. [HTML 스키마 레퍼런스](/reference/html-schema)를 확인하세요.   |
  </Accordion>

  <Accordion title="미리보기가 업데이트되지 않음">
    프로젝트 디렉터리에 있는 `index.html`을 편집하고 있는지 확인하세요. [미리보기 서버](/packages/cli#preview)는 파일 변경을 감시하고 자동으로 새로고침합니다.

    변경 사항이 여전히 반영되지 않는 경우:

    1. 미리보기 서버의 터미널에서 오류를 확인하세요
    2. `npx hyperframes preview`를 중지했다가 다시 시작하세요
    3. 브라우저를 강제 새로고침하세요: **Ctrl+Shift+R** (Windows/Linux) 또는 **Cmd+Shift+R** (macOS)
    4. CSS 변경이 반영되지 않으면 브라우저 캐시를 지우세요
  </Accordion>

  <Accordion title="미리보기가 끊기거나 낮은 프레임 레이트로 재생됨">
    **증상:** 미리보기 재생이 끊기거나 프레임을 건너뛰지만, 렌더링된 mp4는 정상적으로 보입니다.

    **원인:** 개별 프레임을 그리는 데 16-33ms 이상 소요됩니다. 렌더링은 프레임을 하나씩 캡처하므로 이 문제가 숨겨지지만, 미리보기에서는 그렇지 않습니다.

    **흔한 원인 (빈도순):**

    * 겹쳐진 `backdrop-filter: blur()` 레이어, 특히 32px 이상의 반경
    * 작은 영역에 표시되는 매우 고해상도(4K 이상) 소스 이미지
    * 큰 요소에 적용된 `filter: blur()` 또는 `filter: drop-shadow()`
    * `box-shadow` 또는 `text-shadow`가 있으면서 동시에 애니메이션되는 많은 요소

    **먼저 확인할 것:** 끊김이 특정 장면에서만 발생하는지, 아니면 전체적으로 발생하는지 확인하세요. 장면별 끊김은 보통 해당 장면에서 보이게 되는 요소(주로 블러 오버레이)를 가리킵니다.

    **진단 방법:** Chrome DevTools를 열고 Performance 탭으로 전환한 후 몇 초간 재생을 녹화하고, "Composite Layers" 또는 "Paint"라고 표시된 긴 작업을 찾으세요. 전체 안내는 [성능: 느린 컴포지션 측정하기](/guides/performance#measuring-a-slow-composition)를 참조하세요.

    **임시 해결 방법:** mp4로 렌더링하고 출력을 확인하세요. 렌더링은 프레임당 비용에 관계없이 항상 정확합니다.

    ```bash Terminal theme={null}
    npx hyperframes render --quality draft --output preview.mp4
    ```

    비용이 높은 CSS 패턴과 해결 방법에 대한 전체 가이드는 [성능](/guides/performance)을 참조하세요.
  </Accordion>

  <Accordion title="렌더링 결과가 미리보기와 다름">
    [결정론적 출력](/concepts/determinism)을 위해 `--docker` 모드를 사용하세요. 로컬 렌더링은 다음 이유로 차이가 발생할 수 있습니다:

    * **폰트 가용성** — 플랫폼마다 다른 폰트로 인해 텍스트 리플로우가 발생
    * **Chrome 버전** — 로컬 Chromium과 Docker의 고정된 버전이 약간 다르게 렌더링할 수 있음
    * **시스템별 렌더링** — GPU 합성, 서브픽셀 안티앨리어싱 등

    ```bash Terminal theme={null}
    npx hyperframes render --docker --output output.mp4
    ```

    로컬 렌더링과 Docker 렌더링 중 선택하는 방법은 [렌더링: 각 모드를 사용해야 하는 경우](/guides/rendering#when-to-use-each-mode)를 참조하세요.
  </Accordion>

  <Accordion title="Docker 모드 시작 실패">
    Docker가 설치되어 있고 데몬이 실행 중인지 확인하세요:

    ```bash Terminal theme={null}
    docker info
    ```

    일반적인 문제:

    * **Docker가 실행되지 않음:** Docker Desktop 또는 Docker 데몬을 시작하세요
    * **권한 거부:** 사용자를 `docker` 그룹에 추가하고 (`sudo usermod -aG docker $USER`) 셸을 재시작하세요
    * **이미지 풀 실패:** 인터넷 연결을 확인하세요. 첫 번째 렌더링 시 Hyperframes Docker 이미지를 다운로드합니다
  </Accordion>

  <Accordion title="렌더링이 느림">
    다음 최적화를 시도해 보세요:

    1. 개발 중에는 `--quality draft`를 사용하여 더 빠른 인코딩
    2. `npx hyperframes benchmark`를 실행하여 시스템에 최적의 워커 수 찾기
    3. 하드웨어 가속 인코딩을 위해 `--gpu` 사용 (로컬 모드만 해당)
    4. 30fps가 필요하지 않다면 `--fps`를 24로 줄이기
    5. 컴포지션에 불필요한 요소나 지나치게 복잡한 애니메이션이 없는지 확인

    모든 사용 가능한 플래그는 [렌더링: 옵션](/guides/rendering#options)을 참조하세요.
  </Accordion>
</AccordionGroup>

## 시스템 진단

`npx hyperframes doctor`를 실행하여 환경을 확인하세요:

```bash Terminal theme={null}
npx hyperframes doctor
```

Node.js 버전, FFmpeg 가용성, Docker 상태 및 기타 요구 사항을 확인합니다. `doctor`가 문제를 보고하면 렌더링하기 전에 해결하세요.

## 여전히 해결되지 않나요?

위의 방법으로도 문제가 해결되지 않는 경우:

1. `npx hyperframes info`를 실행하여 시스템 및 프로젝트 세부 정보를 수집하세요
2. [GitHub Issues](https://github.com/heygen-com/hyperframes/issues)에서 유사한 보고를 확인하세요
3. `npx hyperframes info`의 출력과 재현 단계를 포함하여 새 이슈를 등록하세요

## 다음 단계

<CardGroup cols={2}>
  <Card title="자주 하는 실수" icon="triangle-exclamation" href="/guides/common-mistakes">
    컴포지션을 깨뜨리는 코딩 함정
  </Card>

  <Card title="렌더링" icon="film" href="/guides/rendering">
    렌더링 모드, 옵션 및 팁
  </Card>

  <Card title="CLI 레퍼런스" icon="terminal" href="/packages/cli">
    CLI 명령어 전체 목록
  </Card>

  <Card title="기여하기" icon="code-branch" href="/contributing">
    버그 신고 및 수정 기여
  </Card>
</CardGroup>
