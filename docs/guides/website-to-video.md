# 웹사이트를 비디오로

> 프롬프트 하나로 어떤 웹사이트든 캡처해서 프로덕션 비디오로 만듭니다.

AI 에이전트에게 URL과 크리에이티브 방향을 주세요. 사이트를 캡처하고, 브랜드 아이덴티티를 추출하고, 스크립트와 스토리보드를 쓰고, 보이스오버를 생성하고, 애니메이션 컴포지션을 만들어서 렌더링 가능한 비디오로 내보냅니다.

```
"https://linear.app에서 20초짜리 제품 런칭 비디오를 만들어줘.
 애플 키노트 발표처럼 느껴지게."
```

## 시작하기

<Steps>
  <Step title="Skills 설치">
    Skills는 AI 에이전트에게 웹사이트를 캡처하고 HyperFrames 컴포지션을 만드는 방법을 가르칩니다. 한 번 설치하면 세션 간에도 유지됩니다.

    ```bash theme={null}
    npx skills add heygen-com/hyperframes
    ```

    [Claude Code](https://claude.ai/claude-code), [Cursor](https://cursor.sh), [Gemini CLI](https://github.com/google-gemini/gemini-cli), [Codex CLI](https://github.com/openai/codex)에서 작동합니다.
  </Step>

  <Step title="에이전트에 프롬프트">
    원하는 디렉토리에서 에이전트를 열고 만들고 싶은 비디오를 묘사하세요:

    ```
    https://example.com에서 25초짜리 제품 런칭 비디오를 만들어줘. 볼드하고, 시네마틱하고, 다크 테마 에너지로.
    ```

    에이전트는 URL과 비디오 요청을 보면 skill을 로드하고 전체 파이프라인을 실행합니다 — 캡처, 디자인, 스크립트, 스토리보드, 보이스오버, 빌드, 검증.

    <Note>
      에이전트는 URL과 비디오 요청을 보면 이 skill을 자동으로 트리거하기도 합니다.
    </Note>
  </Step>

  <Step title="미리보기">
    ```bash theme={null}
    npx hyperframes preview
    ```

    브라우저에서 비디오가 열립니다. 편집사항은 자동으로 리로드됩니다.
  </Step>

  <Step title="MP4로 렌더링">
    ```bash theme={null}
    npx hyperframes render --output my-video.mp4
    ```

    ```
    ✓ Captured 750 frames in 12.4s
    ✓ Encoded to my-video.mp4 (25.0s, 1920×1080, 6.8MB)
    ```
  </Step>
</Steps>

<Note>
  `npx hyperframes capture`를 수동으로 실행할 필요는 없습니다 — skill이 에이전트에게 첫 단계로 캡처하도록 지시합니다. capture 명령은 고급 사용을 위해 [아래](#capture-command)에 문서화되어 있습니다.
</Note>

## 파이프라인 작동 방식

Skill은 7단계를 실행합니다. 각 단계는 다음 단계로 전달되는 산출물을 만듭니다:

| 단계            | 출력물                               | 하는 일                                                                 |
| --------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| **Capture**     | `captures/&lt;name&gt;/`            | 스크린샷, 디자인 토큰, 폰트, 에셋, 애니메이션 추출                      |
| **Design**      | `DESIGN.md`                          | 브랜드 레퍼런스 — 색상, 타이포그래피, 해야 할 것 / 하지 말아야 할 것    |
| **Script**      | `SCRIPT.md`                          | 훅, 스토리, 증거, CTA가 포함된 내레이션 텍스트                          |
| **Storyboard**  | `STORYBOARD.md`                      | 비트별 크리에이티브 방향 — 무드, 에셋, 애니메이션, 트랜지션             |
| **VO + Timing** | `narration.wav` + `transcript.json`  | 단어 단위 타임스탬프가 있는 TTS 오디오                                  |
| **Build**       | `compositions/*.html`                | 비트별 애니메이션 HTML 컴포지션                                         |
| **Validate**    | 스냅샷 PNG                           | 납품 전 시각적 검증                                                     |

## 비디오 유형

포맷은 프롬프트가 결정합니다. 길이와 크리에이티브 방향을 포함하세요:

| 유형             | 길이     | 예시                                                     |
| ---------------- | -------- | -------------------------------------------------------- |
| 소셜 광고        | 10–15s   | *"15초짜리 인스타 릴. 에너지 넘치게, 빠른 컷으로."*      |
| 제품 런칭        | 20–30s   | *"25초 제품 런칭. 애플 키노트 에너지로."*                |
| 제품 투어        | 30–60s   | *"상위 3개 기능을 보여주는 45초 투어."*                  |
| 브랜드 릴        | 15–30s   | *"20초짜리 브랜드 비디오. 디자인을 뽐내줘."*             |
| 기능 공지        | 15–25s   | *"새 AI 에이전트를 강조하는 기능 공지."*                 |
| 티저             | 8–15s    | *"10초 티저. 아주 미니멀하게. 훅만."*                    |

<Tip>
  크리에이티브 방향이 포맷보다 더 중요합니다. *"장난스럽고, 손맛 나는 느낌"* 또는 *"어둡고, 개발자 중심이며, 코드를 보여주는"* 같은 표현이 스토리보드를 형성하고 에이전트의 모든 시각적 결정을 이끕니다.
</Tip>

## Gemini Vision으로 캡처 강화하기

기본적으로 캡처는 DOM 컨텍스트 — alt 텍스트, 근처의 헤딩, CSS 클래스 — 를 이용해 에셋을 묘사합니다. 비전을 활용한 더 풍부한 AI 기반 묘사를 위해 [Gemini API 키](https://aistudio.google.com/apikey)를 추가하세요.

프로젝트 루트에 `.env` 파일을 만드세요:

```bash theme={null}
echo "GEMINI_API_KEY=your-key-here" > .env
```

<Tabs>
  <Tab title="Gemini 없이">
    ```
    - hero-bg.png — 582KB, section: "Hero", above fold
    ```

    에이전트는 파일이 존재하고 페이지 어디에 있었는지는 알지만, 어떻게 생겼는지는 모릅니다.
  </Tab>

  <Tab title="Gemini 사용">
    ```
    - hero-bg.png — 582KB, 보라색과 파란색의 그라디언트 웨이브가
      어두운 배경을 가로지르며 오로라 같은 효과를 만들어냅니다.
    ```

    에이전트는 이미지가 실제로 무엇을 보여주는지 알기 때문에 스토리보드에서 더 나은 크리에이티브 결정을 내릴 수 있습니다.
  </Tab>
</Tabs>

| 티어 | 속도 제한  | 이미지당 비용   |
| ---- | ---------- | --------------- |
| 무료 | 5 RPM      | 무료            |
| 유료 | 2,000 RPM  | \~\$0.001       |

이미지 40장 짜리 일반적 캡처는 유료 티어에서 약 **\$0.04** 정도 듭니다.

## Capture 명령

Skill이 캡처를 자동으로 실행하지만, 사전 캐싱, 디버깅, 또는 비디오 제작 외부에서 데이터를 쓰기 위해 직접 실행할 수도 있습니다.

```bash theme={null}
npx hyperframes capture https://stripe.com
```

```
◇  Captured Stripe | Financial Infrastructure → captures/stripe-com

  Screenshots: 12
  Assets: 45
  Sections: 15
  Fonts: sohne-var
```

| 플래그               | 기본값                  | 설명                                         |
| -------------------- | ----------------------- | -------------------------------------------- |
| `-o, --output`       | `captures/&lt;hostname&gt;` | 출력 디렉토리                             |
| `--timeout`          | `120000`                | 페이지 로드 타임아웃(ms)                     |
| `--skip-assets`      | `false`                 | 이미지와 폰트 다운로드 건너뛰기              |
| `--max-screenshots`  | `24`                    | 최대 스크린샷 개수                           |
| `--json`             | `false`                 | 프로그래밍 용도의 구조화된 JSON 출력         |

### 캡처되는 내용

| 데이터            | 설명                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| **스크린샷**      | 모든 스크롤 깊이에서의 뷰포트 캡처 — 페이지 높이에 따라 개수가 달라짐         |
| **색상**          | 픽셀 샘플링 기반 주요 색상 + 계산된 스타일 (oklch/lab 변환 포함)              |
| **폰트**          | CSS 폰트 패밀리 + 다운로드된 woff2 파일                                       |
| **에셋**          | 의미 있는 이름의 이미지, SVG, Lottie 애니메이션, 비디오 프리뷰                |
| **텍스트**        | DOM 순서의 모든 보이는 텍스트                                                 |
| **애니메이션**    | Web Animations API, 스크롤 트리거 애니메이션, WebGL 셰이더                    |
| **섹션**          | 헤딩, 유형, 배경색이 포함된 페이지 구조                                       |
| **CTA**           | 클래스명과 텍스트 패턴으로 감지된 버튼과 링크                                 |

## Snapshot 명령

빌드된 비디오의 주요 프레임을 PNG로 캡처 — 전체 렌더 없이 컴포지션을 검증합니다:

```bash theme={null}
npx hyperframes snapshot my-project --at 2.9,10.4,18.7
```

| 플래그      | 기본값   | 설명                                             |
| ----------- | -------- | ------------------------------------------------ |
| `--frames`  | `5`      | 균등 간격 프레임 개수                            |
| `--at`      | —        | 콤마로 구분된 초 단위 타임스탬프                 |
| `--timeout` | `5000`   | 런타임 초기화 대기 시간(ms)                      |

## 반복하기

변경을 위해 전체 파이프라인을 다시 실행할 필요는 없습니다:

* **스토리보드 편집** — `STORYBOARD.md`는 크리에이티브의 북극성입니다. 비트의 무드나 에셋을 바꾼 뒤 에이전트에게 해당 비트만 다시 빌드하라고 요청하세요.
* **컴포지션 편집** — `compositions/beat-3-proof.html`을 직접 열어 애니메이션, 색상, 레이아웃을 조정하세요.
* **한 비트만 리빌드** — *"비트 2를 더 에너지 있게 다시 만들어줘. 제품 스크린샷을 풀블리드 배경으로."*

## 문제 해결

<AccordionGroup>
  <Accordion title="캡처가 타임아웃됨">
    Cloudflare나 무거운 클라이언트 사이드 렌더링을 쓰는 사이트는 타임아웃을 늘리세요:

    ```bash theme={null}
    npx hyperframes capture https://example.com --timeout 180000
    ```
  </Accordion>

  <Accordion title="에셋이 거의 캡처되지 않음">
    Framer 같은 프레임워크를 쓰는 사이트는 IntersectionObserver로 이미지를 lazy-load합니다. 캡처는 페이지를 스크롤해서 로딩을 트리거하지만, 아주 긴 페이지는 아래쪽의 이미지를 놓칠 수 있습니다. Gemini 키를 추가하면 캡처된 에셋의 설명이 좋아지지만 개수가 늘어나지는 않습니다.
  </Accordion>

  <Accordion title="색상이 이상함">
    캡처는 픽셀 샘플링과 DOM 계산 스타일을 결합합니다. 어두운 사이트는 팔레트에 어두운 색상이 나와야 합니다. `captures/&lt;name&gt;/screenshots/`의 스크롤 스크린샷을 확인해서 캡처가 실제로 무엇을 봤는지 확인하세요.
  </Accordion>

  <Accordion title="에이전트가 skill을 찾지 못함">
    skills가 설치되었는지 확인하세요:

    ```bash theme={null}
    npx skills add heygen-com/hyperframes
    ```

    가장 안정적인 결과를 위해 프롬프트의 첫머리에 *"Use the /website-to-hyperframes skill"*을 넣으세요. 에이전트는 URL과 비디오 요청을 보면 자동으로 발견하기도 합니다.
  </Accordion>
</AccordionGroup>

## 다음 단계

<CardGroup cols={2}>
  <Card title="퀵스타트" icon="rocket" href="/quickstart">
    HyperFrames가 처음이신가요? 여기서 시작하세요.
  </Card>

  <Card title="GSAP 애니메이션" icon="wand-magic-sparkles" href="/guides/gsap-animation">
    컴포지션에 쓰이는 애니메이션 패턴.
  </Card>

  <Card title="렌더링" icon="film" href="/guides/rendering">
    MP4, MOV, WebM으로 렌더링.
  </Card>

  <Card title="CLI 레퍼런스" icon="terminal" href="/packages/cli">
    전체 명령 레퍼런스.
  </Card>
</CardGroup>
